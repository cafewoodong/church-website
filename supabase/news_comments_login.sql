-- ──────────────────────────────────────────────────────────────
-- 교회소식 댓글: 로그인(카카오/구글) 사용자만 작성
-- news_comments.sql 실행 후에 실행. 여러 번 실행해도 안전.
-- ──────────────────────────────────────────────────────────────

-- 1) 작성자 계정 연결
alter table public.news_comments
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 2) 비로그인(anon)은 쓰기 불가, 읽기만
revoke insert on public.news_comments from anon;
grant select on public.news_comments to anon, authenticated;
grant insert, delete on public.news_comments to authenticated;

drop policy if exists "comments_public_insert" on public.news_comments;
drop policy if exists "comments_member_insert" on public.news_comments;
create policy "comments_member_insert" on public.news_comments
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (select 1 from public.news n where n.id = post_id and n.is_published = true)
  );

-- 본인 댓글은 본인이 삭제 가능 (관리자 삭제 규칙은 그대로 유지)
drop policy if exists "comments_own_delete" on public.news_comments;
create policy "comments_own_delete" on public.news_comments
  for delete to authenticated using (user_id = auth.uid());

-- 3) 작성자 이름·계정은 로그인 정보로 자동 기록 (이름 사칭 방지) + 30초 도배 방지
create or replace function public.news_comments_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  meta jsonb;
  mail text;
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  select u.raw_user_meta_data, u.email into meta, mail
  from auth.users u where u.id = auth.uid();

  new.user_id := auth.uid();
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

  new.content := btrim(new.content);
  new.created_at := now();
  return new;
end $$;
