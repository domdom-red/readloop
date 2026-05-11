import { useMemo } from 'react';
import { M3 } from '../theme.js';
import { Icon } from '../components/ui.jsx';
import { computeStats } from '../utils.js';

export default function RecapView({ articles, sessions, streak }) {
  const stats = useMemo(() => computeStats(articles), [articles]);

  const weekAgo = Date.now() - 86400000 * 7;
  const weekSessions = sessions.filter(s => new Date(s.date) > weekAgo);

  const topCats = useMemo(() => {
    const cnt = {};
    articles.filter(a => new Date(a.savedAt) > weekAgo)
      .forEach(a => a.categories.forEach(c => { cnt[c] = (cnt[c] || 0) + 1; }));
    return Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  }, [articles]);

  const topArticles = useMemo(() =>
    [...articles].filter(a => a.reviewCount > 0).sort((a, b) => b.score - a.score).slice(0, 5),
    [articles],
  );

  return (
    <div style={{ padding: '28px 28px 56px', maxWidth: 800 }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 500, color: M3.onSurface }}>이번 주 리캡</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { k: '저장한 아티클', v: `${stats.total}개`, sub: `이번 주 +${stats.weekArticles}`, icon: 'bookmark', bg: M3.primaryCont, fg: M3.onPrimaryCont },
          { k: '복습 세션', v: `${weekSessions.length}회`, sub: '이번 주', icon: 'auto_stories', bg: M3.secondaryCont, fg: M3.onSecondaryCont },
          { k: '연속 학습', v: `${streak}일`, sub: '🔥 streak', icon: 'local_fire_department', bg: M3.tertiaryCont, fg: M3.onTertiaryCont },
          { k: '평균 이해도', v: stats.avgScore > 0 ? `${stats.avgScore}점` : '-', sub: '복습 완료 기준', icon: 'insights', bg: M3.surfContHigh, fg: M3.onSurface },
          { k: '복습한 아티클', v: `${stats.reviewedCount}개`, sub: `전체 ${stats.total}개 중`, icon: 'check_circle', bg: M3.primaryCont, fg: M3.onPrimaryCont },
          { k: '남은 복습', v: `${stats.total - stats.reviewedCount}개`, sub: '아직 안 읽은 아티클', icon: 'pending', bg: M3.surfContHigh, fg: M3.onSurface },
        ].map(s => (
          <div key={s.k} style={{ background: s.bg, color: s.fg, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Icon name={s.icon} size={20} color="currentColor" />
            <div style={{ fontSize: 26, fontWeight: 400, letterSpacing: -0.3 }}>{s.v}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{s.k} · {s.sub}</div>
          </div>
        ))}
      </div>

      {topCats.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: M3.onSurfaceVar, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>이번 주 많이 읽은 카테고리</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {topCats.map((c, i) => (
              <div key={c} style={{ padding: '8px 16px', borderRadius: 10, background: i === 0 ? M3.primary : M3.surfContHigh, color: i === 0 ? M3.onPrimary : M3.onSurface, fontSize: 14, fontWeight: 500 }}>
                {i === 0 && '🏆 '}{c}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: M3.onSurfaceVar, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>점수별 아티클</div>
        {topArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: M3.onSurfaceVar }}>아직 복습한 아티클이 없어요</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topArticles.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: M3.surfContLow, borderRadius: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: a.score >= 80 ? M3.primaryCont : M3.surfContHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: a.score >= 80 ? M3.primary : M3.onSurface, flexShrink: 0 }}>{a.score}</div>
                <div style={{ flex: 1, fontSize: 14, color: M3.onSurface, fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: M3.onSurfaceVar, flexShrink: 0 }}>{a.source}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
