const PROVIDER_KEY = 'readloop_llm_provider';
const KEY_PREFIX    = 'readloop_apikey_';

export const PROVIDERS = [
  {
    id: 'gemini',
    label: 'Gemini',
    sub: '무료 · Google AI Studio',
    model: 'gemini-2.0-flash',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIza...',
  },
  {
    id: 'openai',
    label: 'ChatGPT',
    sub: '유료 · gpt-4o-mini',
    model: 'gpt-4o-mini',
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-...',
  },
  {
    id: 'anthropic',
    label: 'Claude',
    sub: '유료 · claude-haiku',
    model: 'claude-haiku-4-5-20251001',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...',
  },
];

export const getProvider = () => localStorage.getItem(PROVIDER_KEY) || 'gemini';
export const setProvider = p => localStorage.setItem(PROVIDER_KEY, p);

export const getApiKey = (provider) => {
  const p = provider || getProvider();
  // backward-compat: old 'readloop_apikey' was anthropic
  if (p === 'anthropic') {
    return localStorage.getItem(KEY_PREFIX + p) || localStorage.getItem('readloop_apikey') || '';
  }
  return localStorage.getItem(KEY_PREFIX + p) || '';
};

export const setApiKey = (key, provider) => {
  localStorage.setItem(KEY_PREFIX + (provider || getProvider()), key.trim());
};

// ── Provider-specific callers ─────────────────────────────────────────────

async function callGemini(prompt, maxTokens) {
  const key = getApiKey('gemini');
  if (!key) throw new Error('NO_API_KEY');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini ${res.status}`);
  }
  return (await res.json()).candidates[0].content.parts[0].text.trim();
}

async function callOpenAI(prompt, maxTokens) {
  const key = getApiKey('openai');
  if (!key) throw new Error('NO_API_KEY');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI ${res.status}`);
  }
  return (await res.json()).choices[0].message.content.trim();
}

async function callAnthropic(prompt, maxTokens) {
  const key = getApiKey('anthropic');
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
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic ${res.status}`);
  }
  return (await res.json()).content[0].text.trim();
}

async function callLLM(prompt, maxTokens = 200) {
  const p = getProvider();
  if (p === 'gemini')    return callGemini(prompt, maxTokens);
  if (p === 'openai')    return callOpenAI(prompt, maxTokens);
  if (p === 'anthropic') return callAnthropic(prompt, maxTokens);
  throw new Error('Unknown provider');
}

// ── Public API ────────────────────────────────────────────────────────────

export async function generateQuestions(title, notes, summary) {
  const ctx = [summary, notes].filter(Boolean).join('\n\n');
  const raw = await callLLM(
    `아티클 제목: "${title}"

내용:
${ctx}

아래 규칙을 반드시 지켜서 복습 퀴즈 3개를 만들어.

규칙:
1. 질문 안에 위 내용의 실제 문장을 직접 인용하거나 밀접하게 활용할 것
2. 빈칸 채우기: 핵심 문장에서 가장 중요한 단어/구를 ___로 대체. 나머지 문장은 그대로 유지
3. 인과 관계: 노트에 나온 원인-결과를 활용. 한쪽을 문장으로 제시하고 나머지를 질문할 것
4. hint: 해당 질문의 답이 담긴 노트 원문 문장 (짧게, 1~2문장)
5. 정답이 노트 안에 명확히 있어야 함. 추측·상상이 필요한 질문 금지
6. 타입은 "빈칸 채우기", "인과 관계", "핵심 개념" 중 하나

JSON 배열만 출력 (다른 텍스트 없이):
[{"type":"빈칸 채우기","q":"노트 문장에서 ___ 처리한 질문","hint":"답이 포함된 노트 원문"},{"type":"인과 관계","q":"[맥락 제시] → [?]는?","hint":"답이 포함된 노트 원문"},{"type":"핵심 개념","q":"노트에서 언급한 [구체적 맥락]에서 [?]는?","hint":"답이 포함된 노트 원문"}]`,
    600,
  );
  try {
    const arr = JSON.parse(raw.match(/\[[\s\S]*\]/)?.[0] || '[]');
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.map(q => ({
        id: Math.random().toString(36).slice(2, 9),
        type: q.type,
        q: q.q,
        hint: q.hint || '',
      }));
    }
  } catch {}
  return null;
}

export async function generateSummary(title, notes) {
  return callLLM(
    `아티클 제목: "${title}"\n\n내 노트:\n${notes}\n\n위 노트를 바탕으로 핵심을 한 줄(30자 이내)로 요약해줘. 한국어로. 요약문만 출력해.`,
    80,
  );
}

export async function gradeAnswer(question, userAnswer, title, summary, notes) {
  const ctx = [summary, notes].filter(Boolean).join('\n\n');
  const raw = await callLLM(
    `아티클 "${title}" 복습 퀴즈.\n\n질문: ${question}\n사용자 답변: ${userAnswer}\n\n참고:\n${ctx}\n\nJSON만 출력:\n{"correct": true또는false, "feedback": "한 줄 피드백 (40자 이내)"}`,
    150,
  );
  try {
    return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
  } catch {
    return { correct: true, feedback: 'AI 평가 파싱 실패 — 직접 확인해주세요.' };
  }
}
