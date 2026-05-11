import { useState } from 'react';
import { M3 } from '../theme.js';
import { Icon } from './ui.jsx';

export default function ReviewSession({ cards, onClose, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('question');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const card = cards[idx];
  const goodCount = results.filter(r => r.rating === 'good').length;

  const rate = (rating) => {
    const newResults = [...results, { articleId: card.articleId, questionId: card.id, rating }];
    setResults(newResults);
    if (idx + 1 >= cards.length) {
      setDone(true);
      onComplete(newResults);
    } else {
      setIdx(idx + 1);
      setPhase('question');
    }
  };

  if (done) {
    const pct = Math.round((goodCount / cards.length) * 100);
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: M3.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="anim-slide" style={{ textAlign: 'center', color: M3.onPrimary }}>
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={{ fontSize: 28, fontWeight: 500, marginTop: 16 }}>복습 완료!</div>
          <div style={{ fontSize: 16, opacity: 0.85, marginTop: 8 }}>{cards.length}장 중 {goodCount}장 이해</div>
          <div style={{ fontSize: 52, fontWeight: 300, marginTop: 24, letterSpacing: -1 }}>{pct}점</div>
          <div style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>이번 세션 이해도</div>
          <button onClick={onClose} style={{
            marginTop: 32, height: 48, padding: '0 32px', borderRadius: 9999,
            background: M3.onPrimary, color: M3.primary, border: 0, cursor: 'pointer',
            fontSize: 16, fontWeight: 500, fontFamily: 'Roboto,system-ui',
          }}>완료</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: M3.inverseSurface, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={22} color={M3.inverseOnSurf} />
        </button>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(idx / cards.length) * 100}%`, background: M3.inversePrimary, borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', minWidth: 40, textAlign: 'right' }}>{idx + 1} / {cards.length}</div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 32px' }}>
        <div key={`${idx}-${phase}`} className="anim-flip" style={{
          width: '100%', maxWidth: 540, background: M3.surface, borderRadius: 24, padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: M3.secondaryCont, color: M3.onSecondaryCont, fontWeight: 600 }}>{card.type}</span>
            <span style={{ fontSize: 12, color: M3.onSurfaceVar, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{card.articleTitle}</span>
          </div>
          <div style={{ fontSize: 20, lineHeight: '30px', fontWeight: 500, color: M3.onSurface }}>{card.q}</div>

          {phase === 'question' && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: M3.surfContLow, fontSize: 13, color: M3.onSurfaceVar }}>
              💭 잠깐 생각해보세요. 준비되면 아래 버튼을 눌러주세요.
            </div>
          )}
          {phase === 'rate' && card.summary && (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: M3.primaryCont, borderLeft: `3px solid ${M3.primary}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: M3.primary, marginBottom: 6 }}>아티클 핵심 내용</div>
              <div style={{ fontSize: 14, lineHeight: '21px', color: M3.onPrimaryCont }}>{card.summary}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 24, width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {phase === 'question' ? (
            <button onClick={() => setPhase('rate')} style={{
              height: 52, padding: '0 40px', borderRadius: 9999, border: 0, cursor: 'pointer',
              background: M3.inversePrimary, color: M3.onPrimaryCont,
              fontSize: 16, fontWeight: 500, fontFamily: 'Roboto,system-ui',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="lightbulb" size={20} color={M3.onPrimaryCont} />
              답 확인하기
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button onClick={() => rate('again')} style={{
                flex: 1, height: 52, borderRadius: 9999, border: `1px solid rgba(255,255,255,0.3)`,
                cursor: 'pointer', background: 'transparent', color: M3.inverseOnSurf,
                fontSize: 15, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                🔄 다시 볼게
              </button>
              <button onClick={() => rate('good')} style={{
                flex: 1, height: 52, borderRadius: 9999, border: 0,
                cursor: 'pointer', background: M3.inversePrimary, color: M3.onPrimaryCont,
                fontSize: 15, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                💪 알겠어!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
