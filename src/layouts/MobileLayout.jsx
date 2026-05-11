import { useState, useMemo } from 'react';
import { M3 } from '../theme.js';
import { IconBtn, Btn, Icon } from '../components/ui.jsx';
import AddArticleModal from '../components/AddArticleModal.jsx';
import ArticleDetail from '../components/ArticleDetail.jsx';
import ReviewSession from '../components/ReviewSession.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import SearchView from '../views/SearchView.jsx';
import RecapView from '../views/RecapView.jsx';
import { computeStats, getTodayCards, timeAgo } from '../utils.js';

const NAV = [
  { id: 'home',   label: 'Home',   icon: 'home' },
  { id: 'review', label: 'Review', icon: 'auto_stories' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'recap',  label: 'Recap',  icon: 'bar_chart' },
];

export default function MobileLayout({ state, dispatch }) {
  const [activeNav, setActiveNav] = useState('home');
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);

  const stats = useMemo(() => computeStats(state.articles), [state.articles]);
  const todayCards = useMemo(() => getTodayCards(state.articles), [state.articles]);
  const startReview = () => { const c = getTodayCards(state.articles); if (c.length) setReviewSession(c); };

  return (
    <div style={{ width: '100%', height: '100dvh', background: M3.surface, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {activeNav === 'home' && (
          <div>
            {/* Header */}
            <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: M3.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="autorenew" size={18} color={M3.onPrimary} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: M3.onSurface, flex: 1 }}>ReadLoop</span>
              <IconBtn name="settings" onClick={() => setShowSettings(true)} color={M3.onSurfaceVar} />
              <IconBtn name="add" onClick={() => setShowAdd(true)} color={M3.primary} />
            </div>

            {/* Greeting */}
            <div style={{ padding: '12px 20px 0' }}>
              <div style={{ fontSize: 13, color: M3.onSurfaceVar }}>안녕하세요 👋</div>
              <div style={{ fontSize: 24, lineHeight: '30px', fontWeight: 400, color: M3.onSurface, marginTop: 4, letterSpacing: -0.3 }}>
                {stats.weekArticles > 0
                  ? <>{`이번 주 `}<span style={{ color: M3.primary }}>{stats.weekArticles}개</span>{` 읽었어요`}</>
                  : <>{`아티클을 `}<span style={{ color: M3.primary }}>추가</span>{`해보세요`}</>
                }
              </div>
            </div>

            {/* Stat tiles */}
            <div style={{ padding: '14px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: 'bookmark',            v: `${stats.total}`,                             k: '저장 아티클',  bg: M3.primaryCont,  fg: M3.onPrimaryCont },
                { icon: 'check_circle',        v: `${stats.reviewedCount}`,                     k: '복습 완료',    bg: M3.secondaryCont, fg: M3.onSecondaryCont },
                { icon: 'insights',            v: stats.avgScore > 0 ? `${stats.avgScore}점` : '-', k: '평균 이해도', bg: M3.tertiaryCont,  fg: M3.onTertiaryCont },
                { icon: 'local_fire_department', v: `${state.streak}일`,                         k: '연속 학습',    bg: M3.surfContHigh,  fg: M3.onSurface },
              ].map(s => (
                <div key={s.k} style={{ background: s.bg, color: s.fg, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Icon name={s.icon} size={18} color="currentColor" />
                  <div style={{ fontSize: 22, fontWeight: 400, letterSpacing: -0.3 }}>{s.v}</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{s.k}</div>
                </div>
              ))}
            </div>

            {/* Review CTA */}
            {todayCards.length > 0 ? (
              <div style={{ margin: '18px 20px 0', borderRadius: 20, padding: 16, background: M3.primary, color: M3.onPrimary, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>오늘의 복습 · {todayCards.length}장</div>
                  <div style={{ fontSize: 18, fontWeight: 500, marginTop: 2 }}>지금 5분만 다시 떠올리기</div>
                </div>
                <button onClick={startReview} style={{ width: 48, height: 48, borderRadius: 16, background: M3.onPrimary, color: M3.primary, border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="play_arrow" size={24} color="currentColor" fill={1} />
                </button>
              </div>
            ) : (
              <div style={{ margin: '18px 20px 0', borderRadius: 20, padding: 16, background: M3.primaryCont, color: M3.onPrimaryCont, textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>✅ 오늘 복습 완료!</div>
              </div>
            )}

            {/* Article list */}
            <div style={{ padding: '22px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 17, fontWeight: 500, color: M3.onSurface }}>최근 아티클</div>
              <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 0, fontSize: 13, color: M3.primary, fontWeight: 500, cursor: 'pointer', fontFamily: 'Roboto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="add" size={16} color={M3.primary} />추가
              </button>
            </div>
            <div style={{ padding: '12px 20px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.articles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: M3.onSurfaceVar }}>
                  <Icon name="bookmark_add" size={36} color={M3.outlineVar} />
                  <div style={{ marginTop: 8, fontSize: 14 }}>아직 아티클이 없어요</div>
                </div>
              ) : state.articles.slice(0, 8).map(a => (
                <div key={a.id} onClick={() => setSelectedArticle(a)} style={{ background: M3.surfContLow, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                  <div style={{ fontSize: 11, color: M3.onSurfaceVar, fontWeight: 500 }}>{a.source} · {timeAgo(a.savedAt)}</div>
                  <div style={{ fontSize: 15, lineHeight: '20px', fontWeight: 500, color: M3.onSurface }}>{a.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {a.tags.slice(0, 2).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: M3.surface, color: M3.onSurfaceVar, border: `1px solid ${M3.outlineVar}` }}>{t}</span>
                    ))}
                    <div style={{ flex: 1 }} />
                    {a.reviewCount > 0 && <span style={{ fontSize: 12, color: a.score >= 80 ? M3.primary : M3.onSurfaceVar, fontWeight: 500 }}>{a.score}점</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'review' && (
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: M3.onSurface, marginBottom: 16, paddingTop: 8 }}>복습 큐</div>
            {todayCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: M3.onSurfaceVar }}>
                <Icon name="check_circle" size={48} color={M3.primary} fill={1} />
                <div style={{ marginTop: 12, fontSize: 17, fontWeight: 500, color: M3.onSurface }}>오늘 복습 완료!</div>
                <div style={{ marginTop: 6, fontSize: 14 }}>내일 새 카드가 준비돼요</div>
              </div>
            ) : (
              <>
                <Btn variant="filled" icon="play_arrow" onClick={startReview} fullWidth style={{ height: 48, marginBottom: 16 }}>
                  복습 시작 ({todayCards.length}장)
                </Btn>
                {todayCards.map((c, i) => (
                  <div key={c.id} style={{ padding: '12px 14px', background: M3.surfContLow, borderRadius: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: M3.secondaryCont, color: M3.onSecondaryCont, fontWeight: 600 }}>{c.type}</span>
                    <div style={{ fontSize: 14, fontWeight: 500, color: M3.onSurface, marginTop: 6, lineHeight: '20px' }}>{c.q}</div>
                    <div style={{ fontSize: 12, color: M3.onSurfaceVar, marginTop: 6 }}>from · {c.articleTitle}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeNav === 'search' && <SearchView articles={state.articles} onOpenArticle={setSelectedArticle} />}
        {activeNav === 'recap'  && <RecapView  articles={state.articles} sessions={state.sessions} streak={state.streak} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ height: 72, background: M3.surfContLow, borderTop: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
        {NAV.map(it => (
          <button key={it.id} onClick={() => setActiveNav(it.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 3, border: 0, cursor: 'pointer', position: 'relative',
            background: activeNav === it.id ? M3.secondaryCont : 'transparent',
          }}>
            {it.id === 'review' && todayCards.length > 0 && (
              <span style={{ position: 'absolute', top: 10, right: 'calc(50% - 16px)', background: M3.error, color: '#fff', fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{todayCards.length}</span>
            )}
            <Icon name={it.icon} size={22} color={activeNav === it.id ? M3.onSecondaryCont : M3.onSurfaceVar} fill={activeNav === it.id ? 1 : 0} />
            <span style={{ fontSize: 11, color: activeNav === it.id ? M3.onSecondaryCont : M3.onSurfaceVar, fontWeight: activeNav === it.id ? 500 : 400 }}>{it.label}</span>
          </button>
        ))}
      </nav>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAdd && <AddArticleModal onClose={() => setShowAdd(false)} onAdd={art => dispatch({ type: 'ADD_ARTICLE', article: art })} />}
      {selectedArticle && <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} onDelete={id => { dispatch({ type: 'DELETE_ARTICLE', id }); setSelectedArticle(null); }} />}
      {reviewSession && <ReviewSession cards={reviewSession} onClose={() => setReviewSession(null)} onComplete={results => { dispatch({ type: 'COMPLETE_REVIEW', results }); setReviewSession(null); }} />}
    </div>
  );
}
