import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ixyiocarjhkqmytlfgoa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_n65G5dgJYztBtP3YtSwMjA_PGEBmXUA';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 신청자 수가 이 값에 도달하면 원형 다이얼이 100% 채워집니다.
// 실제 목표 인원에 맞게 자유롭게 바꾸세요.
const GOAL = 300;
const CIRCLE_CIRCUMFERENCE = 326.7; // 2 * Math.PI * 52 (SVG 반지름 52 기준)

const countNum = document.getElementById('countNum');
const dialProgress = document.getElementById('dialProgress');

async function refreshCount() {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('신청자 수 조회 실패:', error.message);
    return;
  }

  const n = count || 0;
  countNum.textContent = n.toLocaleString('ko-KR');

  const ratio = Math.min(n / GOAL, 1);
  const offset = CIRCLE_CIRCUMFERENCE * (1 - ratio);
  dialProgress.style.strokeDashoffset = offset;
}

const form = document.getElementById('waitlistForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formMsg.textContent = '';
  formMsg.className = 'form-msg';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const ageGroup = document.getElementById('ageGroup').value;
  const region = document.getElementById('region').value;
  const reason = document.getElementById('reason').value.trim();

  const { error } = await supabase
    .from('waitlist')
    .insert([{ name, email, age_group: ageGroup, region, reason }]);

  if (error) {
    formMsg.textContent = '신청 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.';
    formMsg.classList.add('err');
    submitBtn.disabled = false;
    return;
  }

  formMsg.textContent = '신청 완료! LUMEA 소식을 가장 먼저 전해드릴게요.';
  formMsg.classList.add('ok');
  form.reset();
  submitBtn.disabled = false;
  refreshCount();
});

refreshCount();
