export const genId = () => Math.random().toString(36).slice(2, 9);
export const todayStr = () => new Date().toISOString().slice(0, 10);

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) {
    const d = new Date(iso);
    return `오늘 · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  if (diff === 1) return '어제';
  return `${diff}일 전`;
}

export function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '').split('.')[0]; }
  catch { return ''; }
}

export function parseTags(str) {
  return str.split(',').map(t => t.trim()).filter(Boolean);
}

export function makeQuestions(title) {
  return [
    { id: genId(), type: '핵심 요약', q: `"${title}"의 핵심 주장을 한 문장으로 정리하면?` },
    { id: genId(), type: '업무 적용', q: `이 내용을 내 일에 적용한다면 가장 먼저 할 행동은?` },
  ];
}

export function computeStats(articles) {
  const reviewed = articles.filter(a => a.reviewCount > 0);
  const avgScore = reviewed.length
    ? Math.round(reviewed.reduce((s, a) => s + a.score, 0) / reviewed.length)
    : 0;
  const weekAgo = Date.now() - 86400000 * 7;
  const weekArticles = articles.filter(a => new Date(a.savedAt) > weekAgo).length;
  return {
    total: articles.length,
    reviewedCount: reviewed.length,
    avgScore,
    weekArticles,
  };
}

export function getTodayCards(articles) {
  const t = todayStr();
  const notToday = articles.filter(
    a => !a.lastReviewedAt || a.lastReviewedAt.slice(0, 10) !== t,
  );
  const sorted = [...notToday].sort((a, b) => {
    if (!a.lastReviewedAt) return -1;
    if (!b.lastReviewedAt) return 1;
    return new Date(a.lastReviewedAt) - new Date(b.lastReviewedAt);
  });
  const cards = [];
  for (const a of sorted) {
    if (cards.length >= 6) break;
    a.questions.forEach(q => {
      if (cards.length < 6)
        cards.push({ ...q, articleId: a.id, articleTitle: a.title, summary: a.summary, notes: a.notes || '' });
    });
  }
  return cards;
}

export const isMobileDevice =
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.matchMedia('(max-width: 767px)').matches;
