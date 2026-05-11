const API_KEY_STORAGE = 'readloop_apikey';

export const getApiKey = () => localStorage.getItem(API_KEY_STORAGE) || '';
export const setApiKey = k => localStorage.setItem(API_KEY_STORAGE, k.trim());

async function callClaude(messages, maxTokens = 200) {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API ${res.status}`);
  }
  return (await res.json()).content[0].text.trim();
}

export async function generateSummary(title, notes) {
  return callClaude([{
    role: 'user',
    content: `아티클 제목: "${title}"\n\n내 노트:\n${notes}\n\n위 노트를 바탕으로 핵심을 한 줄(30자 이내)로 요약해줘. 한국어로. 요약문만 출력해.`,
  }], 80);
}

export async function gradeAnswer(question, userAnswer, title, summary, notes) {
  const ctx = [summary, notes].filter(Boolean).join('\n\n');
  const raw = await callClaude([{
    role: 'user',
    content: `아티클 "${title}" 복습 퀴즈.\n\n질문: ${question}\n사용자 답변: ${userAnswer}\n\n참고:\n${ctx}\n\nJSON만 출력:\n{"correct": true또는false, "feedback": "한 줄 피드백 (40자 이내)"}`,
  }], 150);
  try {
    return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
  } catch {
    return { correct: true, feedback: 'AI 평가 파싱 실패 — 직접 확인해주세요.' };
  }
}
