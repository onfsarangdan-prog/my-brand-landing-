import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ixyiocarjhkqmytlfgoa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eWlvY2FyamhrcW15dGxmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMjA2NDYsImV4cCI6MjA5ODU5NjY0Nn0.wfTZs3WeYhVC9s8ce7uox7WcmP2NmW1YvlNG7LEUk6E';
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

const intentButtons = document.querySelectorAll('.intent-btn');
const intentInput = document.getElementById('purchaseIntent');
intentButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    intentButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    intentInput.value = btn.dataset.value;
  });
});

const form = document.getElementById('waitlistForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!intentInput.value) {
    formMsg.textContent = '구매 의향 점수를 선택해주세요.';
    formMsg.className = 'form-msg err';
    return;
  }

  submitBtn.disabled = true;
  formMsg.textContent = '';
  formMsg.className = 'form-msg';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const ageGroup = document.getElementById('ageGroup').value;
  const region = document.getElementById('region').value;
  const channel = document.getElementById('channel').value;
  const priceRange = document.getElementById('priceRange').value;
  const purchaseIntent = parseInt(intentInput.value, 10);
  const reason = document.getElementById('reason').value.trim();

  const { error } = await supabase
    .from('waitlist')
    .insert([{
      name, email,
      age_group: ageGroup,
      region,
      channel,
      price_range: priceRange,
      purchase_intent: purchaseIntent,
      reason
    }]);

  if (error) {
    formMsg.textContent = '신청 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.';
    formMsg.classList.add('err');
    submitBtn.disabled = false;
    return;
  }

  formMsg.textContent = '신청 완료! LUMEA 소식을 가장 먼저 전해드릴게요.';
  formMsg.classList.add('ok');
  form.reset();
  intentButtons.forEach(b => b.classList.remove('selected'));
  intentInput.value = '';
  submitBtn.disabled = false;
  refreshCount();
});

refreshCount();
