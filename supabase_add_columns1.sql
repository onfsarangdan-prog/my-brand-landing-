-- 이미 waitlist 테이블을 만드셨다면, 이 내용을 Supabase SQL Editor에 붙여넣고
-- Run 하시면 기존 데이터는 그대로 두고 컬럼(연령대, 지역)만 추가됩니다.

alter table waitlist
  add column if not exists age_group text,
  add column if not exists region text,
  add column if not exists channel text,
  add column if not exists purchase_intent integer,
  add column if not exists price_range text;

-- 참고: 기존에 이미 신청한 사람들의 age_group, region 값은 비어있는(null) 상태로 남습니다.
-- 이후 신규 신청자부터 값이 채워집니다.

-- 관리자 대시보드에서 "삭제" 버튼을 쓰려면 삭제 권한도 열어줘야 합니다.
-- 주의: 이 권한은 anon key를 아는 누구나 삭제할 수 있게 됩니다.
-- 지금은 과제/발표용이라 간단하게 허용하지만, 실제 서비스라면
-- Supabase Auth로 관리자만 삭제 가능하도록 제한해야 합니다.
create policy "삭제는 임시로 모두 허용 (과제용)"
  on waitlist for delete
  to anon
  using (true);

