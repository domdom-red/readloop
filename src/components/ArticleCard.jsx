import { useState } from 'react';
import { M3 } from '../theme.js';
import { Icon } from './ui.jsx';
import { timeAgo } from '../utils.js';

export default function ArticleCard({ article: a, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: M3.surface, borderRadius: 16, padding: 16, cursor: 'pointer',
        border: `1px solid ${hov ? M3.outline : M3.outlineVar}`,
        boxShadow: hov ? '0 2px 10px rgba(0,0,0,0.09)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'border-color 0.12s, box-shadow 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: M3.surfContHigh,
          color: M3.onSurfaceVar, fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{a.source.slice(0, 2)}</div>
        <div style={{ fontSize: 12, color: M3.onSurfaceVar }}>{a.source} · {timeAgo(a.savedAt)}</div>
      </div>

      <div style={{ fontSize: 15, lineHeight: '22px', fontWeight: 500, color: M3.onSurface }}>{a.title}</div>

      {a.summary && (
        <div style={{
          fontSize: 13, lineHeight: '19px', color: M3.onSurfaceVar,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{a.summary}</div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {a.tags.slice(0, 2).map(t => (
            <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: M3.surfContHigh, color: M3.onSurfaceVar }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: M3.onSurfaceVar, flexShrink: 0 }}>
          <Icon name="quiz" size={14} color={M3.onSurfaceVar} />
          {a.questions.length}
          {a.reviewCount > 0
            ? <span style={{ marginLeft: 4, fontWeight: 500, color: a.score >= 80 ? M3.primary : M3.onSurfaceVar }}>· {a.score}점</span>
            : <span style={{ marginLeft: 4 }}>· 미복습</span>
          }
        </div>
      </div>
    </div>
  );
}
