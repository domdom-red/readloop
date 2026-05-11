import { useMemo, useState } from 'react';
import { M3 } from '../theme.js';
import { Btn, Chip, Icon } from '../components/ui.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import { computeStats } from '../utils.js';
import { ALL_CATEGORIES } from '../data.js';

export default function LibraryView({ articles, todayCards, streak, onOpenArticle, onAdd, onStartReview }) {
  const [activeTag, setActiveTag] = useState('all');
  const stats = useMemo(() => computeStats(articles), [articles]);

  const usedCats = useMemo(() => {
    const used = new Set(articles.flatMap(a => a.categories));
    return ALL_CATEGORIES.filter(c => used.has(c));
  }, [articles]);

  const filtered = useMemo(() => {
    if (activeTag === 'all') return articles;
    return articles.filter(a => a.categories.includes(activeTag));
  }, [articles, activeTag]);

  return (
    <div style={{ padding: '28px 28px 56px' }}>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, color: M3.onSurfaceVar }}>안녕하세요 👋</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 30, lineHeight: '38px', fontWeight: 400, color: M3.onSurface, letterSpacing: -0.5 }}>
            {stats.weekArticles > 0
              ? <>{`이번 주 `}<span style={{ color: M3.primary }}>{stats.weekArticles}개</span>{` 읽었고,`}<br />{`평균 이해도는 `}<span style={{ color: M3.primary }}>{stats.avgScore > 0 ? `${stats.avgScore}점` : '아직 없어요'}</span></>
              : <>{`아티클을 추가하고`}<br /><span style={{ color: M3.primary }}>복습을 시작</span>{`해보세요`}</>
            }
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {todayCards.length > 0 && <Btn variant="tonal" icon="play_arrow" onClick={onStartReview}>복습 시작</Btn>}
          <Btn variant="filled" icon="add" onClick={onAdd}>아티클 추가</Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { k: '저장한 아티클', v: `${stats.total}`, sub: `+${stats.weekArticles} 이번 주`, icon: 'bookmark', bg: M3.primaryCont, fg: M3.onPrimaryCont },
          { k: '복습 완료', v: `${stats.reviewedCount}`, sub: `전체 ${stats.total}개 중`, icon: 'check_circle', bg: M3.secondaryCont, fg: M3.onSecondaryCont },
          { k: '평균 이해도', v: stats.avgScore > 0 ? `${stats.avgScore}점` : '-', sub: stats.avgScore > 0 ? '복습 기준' : '복습 후 표시', icon: 'insights', bg: M3.tertiaryCont, fg: M3.onTertiaryCont },
          { k: '연속 학습', v: `${streak}일`, sub: '🔥 streak', icon: 'local_fire_department', bg: M3.surfContHigh, fg: M3.onSurface },
        ].map(s => (
          <div key={s.k} style={{ background: s.bg, color: s.fg, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 100 }}>
            <Icon name={s.icon} size={20} color="currentColor" />
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 26, lineHeight: '34px', fontWeight: 400, letterSpacing: -0.3 }}>{s.v}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{s.k} · {s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: M3.onSurface }}>최근 저장한 아티클</h2>
        <span style={{ fontSize: 13, color: M3.onSurfaceVar }}>{filtered.length}개</span>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        <Chip selected={activeTag === 'all'} onClick={() => setActiveTag('all')}>전체</Chip>
        {usedCats.map(c => (
          <Chip key={c} selected={activeTag === c} onClick={() => setActiveTag(c)}>{c}</Chip>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: M3.onSurfaceVar }}>
          <Icon name="bookmark_add" size={48} color={M3.outlineVar} />
          <div style={{ marginTop: 12, fontSize: 16 }}>아직 아티클이 없어요</div>
          <div style={{ marginTop: 8 }}>
            <Btn variant="tonal" icon="add" onClick={onAdd}>첫 아티클 추가하기</Btn>
          </div>
        </div>
      ) : (
        <div className="anim-fade article-grid">
          {filtered.map(a => <ArticleCard key={a.id} article={a} onClick={() => onOpenArticle(a)} />)}
        </div>
      )}
    </div>
  );
}
