-- ──────────────────────────────────────────────────────────────
-- 교회소식 댓글: 답글 + 교회(관리자) 공식 답글
-- news_comments_login.sql 실행 후에 실행. 여러 번 실행해도 안전.
-- ──────────────────────────────────────────────────────────────

alter table public.news_comments
  add column if not exists parent_id bigint references public.news_comments(id) on delete cascade,
  add column if not exists is_official boolean not null default false;

create index if not exists news_comments_parent_idx on public.news_comments (parent_id);

create or replace function public.news_comments_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta jsonb;
  mail text;
  is_admin boolean;
  parent record;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  select u.raw_user_meta_data, u.email into meta, mail
  from auth.users u where u.id = auth.uid();

  is_admin := (mail = 'ggcommchurch@gmail.com');

  -- 답글: 원 댓글과 같은 게시물, 한 단계만 허용
  if new.parent_id is not null then
    select id, post_id, parent_id into parent from public.news_comments where id = new.parent_id;
    if not found then
      raise exception '원 댓글을 찾을 수 없습니다.';
    end if;
    new.post_id := parent.post_id;
    if parent.parent_id is not null then
      new.parent_id := parent.parent_id;
    end if;
  end if;

  new.user_id := auth.uid();
  new.is_official := is_admin;
  if is_admin then
    new.author_name := '광교우리동네교회';
  else
    new.author_name := left(coalesce(
      nullif(btrim(meta->>'full_name'), ''),
      nullif(btrim(meta->>'name'), ''),
      nullif(btrim(meta->>'nickname'), ''),
      nullif(btrim(meta->>'preferred_username'), ''),
      nullif(split_part(coalesce(mail, ''), '@', 1), ''),
      '성도'), 20);

    if exists (
      select 1 from public.news_comments
      where user_id = new.user_id
        and created_at > now() - interval '30 seconds'
    ) then
      raise exception '잠시 후 다시 등록해 주세요.';
    end if;
  end if;

  new.content := btrim(new.content);
  new.created_at := now();
  return new;
end $$;
