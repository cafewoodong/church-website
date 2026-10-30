-- ──────────────────────────────────────────────────────────────
-- 교회소식 댓글 테이블 (news_comments)
-- Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
-- 여러 번 실행해도 안전합니다.
-- ──────────────────────────────────────────────────────────────

-- 1) 테이블 생성 (news.id 타입(uuid/bigint 등)에 자동으로 맞춤)
do $$
declare
  id_type text;
begin
  select format_type(a.atttypid, a.atttypmod) into id_type
  from pg_attribute a
  where a.attrelid = 'public.news'::regclass and a.attname = 'id';

  if not exists (select 1 from information_schema.tables
                 where table_schema = 'public' and table_name = 'news_comments') then
    execute format($f$
      create table public.news_comments (
        id          bigint generated always as identity primary key,
        post_id     %s not null references public.news(id) on delete cascade,
        author_name text not null check (char_length(btrim(author_name)) between 1 and 20),
        content     text not null check (char_length(btrim(content)) between 1 and 500),
        created_at  timestamptz not null default now()
      )$f$, id_type);
  end if;
end $$;

create index if not exists news_comments_post_id_idx
  on public.news_comments (post_id, created_at);

-- 접근 권한 (실제 허용 범위는 아래 RLS 규칙이 제한)
grant select, insert on public.news_comments to anon, authenticated;
grant delete on public.news_comments to authenticated;

-- 2) 보안 규칙 (RLS)
alter table public.news_comments enable row level security;

-- 누구나 읽기: 공개된 게시물의 댓글만
drop policy if exists "comments_public_read" on public.news_comments;
create policy "comments_public_read" on public.news_comments
  for select using (
    exists (select 1 from public.news n where n.id = post_id and n.is_published = true)
  );

-- 누구나 쓰기: 공개된 게시물에만
drop policy if exists "comments_public_insert" on public.news_comments;
create policy "comments_public_insert" on public.news_comments
  for insert with check (
    exists (select 1 from public.news n where n.id = post_id and n.is_published = true)
  );

-- 삭제: 관리자 계정만
drop policy if exists "comments_admin_delete" on public.news_comments;
create policy "comments_admin_delete" on public.news_comments
  for delete using ((auth.jwt() ->> 'email') = 'ggcommchurch@gmail.com');

-- 관리자는 비공개 글 댓글도 보기
drop policy if exists "comments_admin_read" on public.news_comments;
create policy "comments_admin_read" on public.news_comments
  for select using ((auth.jwt() ->> 'email') = 'ggcommchurch@gmail.com');

-- 3) 도배 방지: 같은 이름으로 30초 안에 연속 등록 차단
create or replace function public.news_comments_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.news_comments
    where post_id = new.post_id
      and author_name = new.author_name
      and created_at > now() - interval '30 seconds'
  ) then
    raise exception '잠시 후 다시 등록해 주세요.';
  end if;
  new.author_name := btrim(new.author_name);
  new.content := btrim(new.content);
  new.created_at := now();
  return new;
end $$;

drop trigger if exists news_comments_rate_limit on public.news_comments;
create trigger news_comments_rate_limit
  before insert on public.news_comments
  for each row execute function public.news_comments_rate_limit();
