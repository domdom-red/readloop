import { useState } from 'react';
import { M3 } from '../theme.js';
import { Icon } from './ui.jsx';
import { gradeAnswer, getApiKey } from '../api.js';

export default function ReviewSession({ cards, onClose, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [phase, setPhase] = useState('question'); // question | grading | result
  const [gradeResult, setGradeResult] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const card = cards[idx];
  const goodCount = results.filter(r => r.rating === 'good').length;
  const hasApiKey = !!getApiKey();

  const submit = async () => {
    if (!hasApiKey) {
      setPhase('result');
      setGradeResult(null);
      return;
    }
    setPhase('grading');
    try {
      const result = await gradeAnswer(card.q, userAnswer, card.articleTitle, card.summary, card.notes);
      setGradeResult(result);
    } catch {
      setGradeResult({ correct: null, feedback: 'AI 평가 실패 — 직접 확인해주세요.' });
    }
    setPhase('result');
  };

  const advance = (ratingOverride) => {
    const rating = ratingOverride ?? (gradeResult?.correct ? 'good' : 'again');
    const newResults = [...results, {
      articleId: card.articleId,
      questionId: card.id,
      rating,
      userAnswer,
      feedback: gradeResult?.feedback || '',
      aiGraded: !!gradeResult,
    }];
    setResults(newResults);
    setUserAnswer('');
    setGradeResult(null);

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

  const correct = gradeResult?.correct;
  const resultColor = correct === true ? M3.primary : correct === false ? M3.error : M3.onSurfaceVar;
  const resultBg   = correct === true ? M3.primaryCont : correct === false ? '#FFDAD6' : M3.surfContHigh;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: M3.inverseSurface, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={22} color={M3.inverseOnSurf} />
        </button>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(idx / cards.length) * 100}%`, background: M3.inversePrimary, borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', minWidth: 40, textAlign: 'right' }}>{idx + 1} / {cards.length}</div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 40px' }}>
        {/* Card */}
        <div key={`${idx}-q`} className="anim-flip" style={{
          width: '100%', maxWidth: 540, background: M3.surface, borderRadius: 24, padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: M3.secondaryCont, color: M3.onSecondaryCont, fontWeight: 600 }}>{card.type}</span>
            <span style={{ fontSize: 12, color: M3.onSurfaceVar, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{card.articleTitle}</span>
          </div>

          <div style={{ fontSize: 20, lineHeight: '30px', fontWeight: 500, color: M3.onSurface }}>{card.q}</div>

          {/* Answer textarea */}
          <textarea
            autoFocus
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={phase !== 'question'}
            placeholder="생각나는 대로 자유롭게 적어보세요…"
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(); }}
            style={{
              width: '100%', minHeight: 90, resize: 'vertical',
              border: `1px solid ${M3.outlineVar}`, borderRadius: 10,
              padding: '10px 12px', fontSize: 14, lineHeight: '21px',
              color: M3.onSurface, background: phase === 'question' ? M3.surfContLow : M3.surfContHigh,
              fontFamily: 'Roboto,system-ui', outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Grading result */}
          {phase === 'grading' && (
            <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 14, color: M3.onSurfaceVar }}>
              AI가 채점 중이에요…
            </div>
          )}

          {phase === 'result' && gradeResult && (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: resultBg, borderLeft: `3px solid ${resultColor}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: resultColor, marginBottom: 6 }}>
                {correct === true ? '✓ 잘 이해하고 있어요' : correct === false ? '✗ 다시 확인해봐요' : '💬 참고'}
              </div>
              <div style={{ fontSize: 13, lineHeight: '20px', color: M3.onSurface }}>{gradeResult.feedback}</div>
            </div>
          )}

          {phase === 'result' && !gradeResult && card.summary && (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: M3.primaryCont, borderLeft: `3px solid ${M3.primary}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: M3.primary, marginBottom: 6 }}>핵심 요약</div>
              <div style={{ fontSize: 13, lineHeight: '20px', color: M3.onPrimaryCont }}>{card.summary}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 20, width: '100%', maxWidth: 540, display: 'flex', gap: 12 }}>
          {phase === 'question' && (
            <>
              <button
                onClick={submit}
                disabled={!userAnswer.trim()}
                style={{
                  flex: 1, height: 52, borderRadius: 9999, border: 0, cursor: 'pointer',
                  background: userAnswer.trim() ? M3.inversePrimary : 'rgba(255,255,255,0.2)',
                  color: userAnswer.trim() ? M3.onPrimaryCont : 'rgba(255,255,255,0.4)',
                  fontSize: 16, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                {hasApiKey ? '제출하기 (⌘↵)' : '확인하기'}
              </button>
              {!hasApiKey && (
                <button
                  onClick={() => advance('again')}
                  style={{
                    height: 52, padding: '0 20px', borderRadius: 9999, cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
                    color: M3.inverseOnSurf, fontSize: 15, fontFamily: 'Roboto,system-ui',
                  }}
                >
                  🔄 패스
                </button>
              )}
            </>
          )}

          {phase === 'result' && (
            <>
              {(correct === false || correct === null) && (
                <button
                  onClick={() => advance('again')}
                  style={{
                    flex: 1, height: 52, borderRadius: 9999, cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
                    color: M3.inverseOnSurf, fontSize: 15, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                  }}
                >
                  🔄 다시 볼게
                </button>
              )}
              <button
                onClick={() => advance()}
                style={{
                  flex: 2, height: 52, borderRadius: 9999, border: 0, cursor: 'pointer',
                  background: M3.inversePrimary, color: M3.onPrimaryCont,
                  fontSize: 15, fontWeight: 500, fontFamily: 'Roboto,system-ui',
                }}
              >
                {idx + 1 >= cards.length ? '완료' : '다음 →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
