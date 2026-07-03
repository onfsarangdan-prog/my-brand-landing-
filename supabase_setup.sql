-- Supabase 대시보드 좌측 메뉴의 SQL Editor에 이 내용을 통째로 붙여넣고
-- "Run" 버튼을 눌러 실행해주세요.

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  reason text,
  created_at timestamptz default now()
);

-- 보안 설정: 외부에서 데이터를 함부로 수정/삭제하지 못하게 잠그고,
-- "신청하기(입력)"와 "신청자 수 세기(카운트)"만 허용합니다.
alter table waitlist enable row level security;

create policy "누구나 신청 가능"
  on waitlist for insert
  to anon
  with check (true);

create policy "신청자 수 확인 가능"
  on waitlist for select
  to anon
  using (true);
