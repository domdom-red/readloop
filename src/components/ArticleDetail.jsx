import { M3 } from '../theme.js';
import { Scrim, Btn, IconBtn, Icon } from './ui.jsx';
import Markdown from './Markdown.jsx';
import { timeAgo } from '../utils.js';

export default function ArticleDetail({ article: a, onClose, onDelete }) {
  return (
    <>
      <Scrim onClick={onClose} z={300} />
      <div className="anim-slide" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 400, width: 640, maxWidth: 'calc(100vw - 32px)', maxHeight: '88vh',
        background: M3.surface, borderRadius: 28, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: M3.onSurfaceVar, marginBottom: 4 }}>{a.source} · {timeAgo(a.savedAt)}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: M3.onSurface, lineHeight: '28px' }}>{a.title}</div>
          </div>
          <IconBtn name="close" onClick={onClose} />
        </div>

        {a.url && (
          <a href={a.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: M3.primary, textDecoration: 'none' }}>
            <Icon name="open_in_new" size={16} color={M3.primary} />원문 보기
          </a>
        )}

        {/* One-line summary */}
        {a.summary && (
          <div style={{ background: M3.primaryCont, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="lightbulb" size={18} color={M3.primary} />
            <div style={{ fontSize: 14, lineHeight: '21px', color: M3.onPrimaryCont, fontWeight: 500 }}>{a.summary}</div>
          </div>
        )}

        {/* Notes (markdown) */}
        {(a.notes || a.summary) && (
          <div style={{ background: M3.surfContLow, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: M3.onSurfaceVar, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>노트</div>
            {a.notes ? (
              <Markdown text={a.notes} style={{ color: M3.onSurface }} />
            ) : (
              <div style={{ fontSize: 14, color: M3.onSurfaceVar }}>노트 없음</div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {a.categories.map(c => (
            <span key={c} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: M3.primaryCont, color: M3.onPrimaryCont, fontWeight: 500 }}>{c}</span>
          ))}
          {a.tags.map(t => (
            <span key={t} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: M3.surfContHigh, color: M3.onSurfaceVar }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { k: '이해도 점수', v: a.reviewCount > 0 ? `${a.score}점` : '미복습', icon: 'insights' },
            { k: '복습 횟수', v: `${a.reviewCount}회`, icon: 'replay' },
            { k: '마지막 복습', v: a.lastReviewedAt ? timeAgo(a.lastReviewedAt) : '없음', icon: 'schedule' },
          ].map(s => (
            <div key={s.k} style={{ background: M3.surfContLow, borderRadius: 12, padding: '12px 14px' }}>
              <Icon name={s.icon} size={18} color={M3.primary} />
              <div style={{ fontSize: 17, fontWeight: 500, color: M3.onSurface, marginTop: 8 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: M3.onSurfaceVar, marginTop: 2 }}>{s.k}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: M3.onSurfaceVar, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>복습 질문</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {a.questions.map(q => (
              <div key={q.id} style={{ padding: '12px 14px', background: M3.surfContLow, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: M3.secondaryCont, color: M3.onSecondaryCont, fontWeight: 500, whiteSpace: 'nowrap', marginTop: 1 }}>{q.type}</span>
                <div style={{ fontSize: 14, lineHeight: '20px', color: M3.onSurface }}>{q.q}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <Btn variant="text" icon="delete" onClick={() => { onDelete(a.id); onClose(); }} style={{ color: M3.error }}>삭제</Btn>
          <Btn variant="filled" onClick={onClose}>닫기</Btn>
        </div>
      </div>
    </>
  );
}
