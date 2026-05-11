import { todayStr } from './utils.js';

const KEY = 'readloop_v2';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    articles: [],
    sessions: [],
    streak: 0,
    lastActiveDate: null,
  };
}

function persist(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  return state;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ARTICLE':
      return persist({ ...state, articles: [action.article, ...state.articles] });

    case 'DELETE_ARTICLE':
      return persist({ ...state, articles: state.articles.filter(a => a.id !== action.id) });

    case 'COMPLETE_REVIEW': {
      const byArticle = {};
      action.results.forEach(r => {
        (byArticle[r.articleId] ??= []).push(r.rating);
      });
      const articles = state.articles.map(a => {
        const ratings = byArticle[a.id];
        if (!ratings) return a;
        const ratio = ratings.filter(r => r === 'good').length / ratings.length;
        const newScore = Math.round(
          a.reviewCount > 0
            ? (a.score * a.reviewCount + ratio * 100) / (a.reviewCount + 1)
            : ratio * 100,
        );
        return { ...a, score: newScore, reviewCount: a.reviewCount + 1, lastReviewedAt: new Date().toISOString() };
      });
      const t = todayStr();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = state.lastActiveDate === t ? state.streak
        : state.lastActiveDate === yesterday ? state.streak + 1 : 1;
      return persist({
        ...state,
        articles,
        sessions: [...state.sessions, { id: crypto.randomUUID(), date: new Date().toISOString(), cards: action.results }],
        streak,
        lastActiveDate: t,
      });
    }

    default:
      return state;
  }
}
