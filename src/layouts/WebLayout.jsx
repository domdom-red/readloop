import { useState, useMemo } from 'react';
import { M3 } from '../theme.js';
import { Btn, IconBtn, Icon } from '../components/ui.jsx';
import WebSidebar from '../components/WebSidebar.jsx';
import AddArticleModal from '../components/AddArticleModal.jsx';
import ArticleDetail from '../components/ArticleDetail.jsx';
import ReviewSession from '../components/ReviewSession.jsx';
import LibraryView from '../views/LibraryView.jsx';
import ReviewView from '../views/ReviewView.jsx';
import SearchView from '../views/SearchView.jsx';
import RecapView from '../views/RecapView.jsx';
import { getTodayCards } from '../utils.js';

export default function WebLayout({ state, dispatch }) {
  const [activeNav, setActiveNav] = useState('Library');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);

  const todayCards = useMemo(() => getTodayCards(state.articles), [state.articles]);

  const weekRecap = useMemo(() => {
    const wk = Date.now() - 86400000 * 7;
    const cnt = {};
    state.articles.filter(a => new Date(a.savedAt) > wk)
      .forEach(a => a.categories.forEach(c => { cnt[c] = (cnt[c] || 0) + 1; }));
    const topCat = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0];
    const hi = [...state.articles].filter(a => a.reviewCount > 0).sort((a, b) => b.score - a.score)[0];
    return [
      topCat ? `이번 주 가장 많이 읽은 주제: ${topCat}` : '이번 주 아티클을 추가해보세요',
      hi ? `이해도 최고: "${hi.title.slice(0, 18)}…" (${hi.score}점)` : '복습을 시작하면 인사이트가 쌓여요',
      `전체 ${state.articles.length}개 중 ${state.articles.filter(a => a.reviewCount > 0).length}개 복습 완료`,
    ];
  }, [state.articles]);

  const startReview = () => {
    const cards = getTodayCards(state.articles);
    if (cards.length) setReviewSession(cards);
  };

  const navItems = ['Library', 'Review', 'Search', 'Recap'];

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: M3.surface, overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ height: 64, padding: '0 28px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: `1px solid ${M3.outlineVar}`, background: M3.surface, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: M3.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="autorenew" size={18} color={M3.onPrimary} weight={600} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: M3.onSurface, letterSpacing: -0.3 }}>ReadLoop</span>
        </div>

        <nav style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {navItems.map(n => (
            <button key={n} onClick={() => setActiveNav(n)} style={{
              height: 36, padding: '0 16px', borderRadius: 9999, border: 0, cursor: 'pointer',
              background: activeNav === n ? M3.secondaryCont : 'transparent',
              color: activeNav === n ? M3.onSecondaryCont : M3.onSurfaceVar,
              fontFamily: 'Roboto,system-ui', fontSize: 14, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {n}
              {n === 'Review' && todayCards.length > 0 && (
                <span style={{ background: M3.primary, color: M3.onPrimary, borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{todayCards.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />
        <Btn variant="tonal" icon="add" onClick={() => setShowAdd(true)}>아티클 추가</Btn>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: M3.tertiaryCont, color: M3.onTertiaryCont, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>주</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflow: 'auto' }}>
          {activeNav === 'Library' && (
            <LibraryView
              articles={state.articles} todayCards={todayCards} streak={state.streak}
              onOpenArticle={setSelectedArticle} onAdd={() => setShowAdd(true)} onStartReview={startReview}
            />
          )}
          {activeNav === 'Review' && <ReviewView todayCards={todayCards} onStartReview={startReview} />}
          {activeNav === 'Search' && <SearchView articles={state.articles} onOpenArticle={setSelectedArticle} />}
          {activeNav === 'Recap' && <RecapView articles={state.articles} sessions={state.sessions} streak={state.streak} />}
        </main>

        {activeNav === 'Library' && (
          <WebSidebar todayCards={todayCards} onStartReview={startReview} weekRecap={weekRecap} />
        )}
      </div>

      {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onAdd={art => dispatch({ type: 'ADD_ARTICLE', article: art })} />}
      {selectedArticle && <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} onDelete={id => { dispatch({ type: 'DELETE_ARTICLE', id }); setSelectedArticle(null); }} />}
      {reviewSession && <ReviewSession cards={reviewSession} onClose={() => setReviewSession(null)} onComplete={results => { dispatch({ type: 'COMPLETE_REVIEW', results }); setReviewSession(null); }} />}
    </div>
  );
}
