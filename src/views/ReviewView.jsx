import { M3 } from '../theme.js';
import { Btn, Icon } from '../components/ui.jsx';

export default function ReviewView({ todayCards, onStartReview }) {
  if (todayCards.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 48 }}>
        <Icon name="check_circle" size={56} color={M3.primary} fill={1} />
        <div style={{ fontSize: 22, fontWeight: 500, color: M3.onSurface }}>오늘 복습 완료!</div>
        <div style={{ fontSize: 15, color: M3.onSurfaceVar }}>내일 새 카드가 준비돼요 👏</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 28px 56px', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500, color: M3.onSurface }}>오늘의 복습 · {todayCards.length}장</h2>
        <Btn variant="filled" icon="play_arrow" onClick={onStartReview}>복습 시작</Btn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {todayCards.map((c, i) => (
          <div key={c.id} style={{ padding: '14px 18px', background: M3.surface, borderRadius: 14, border: `1px solid ${M3.outlineVar}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: M3.primaryCont, color: M3.onPrimaryCont, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: M3.primary, fontWeight: 600, letterSpacing: 0.4, marginBottom: 3 }}>{c.type}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: M3.onSurface, lineHeight: '22px' }}>{c.q}</div>
              <div style={{ fontSize: 12, color: M3.onSurfaceVar, marginTop: 5 }}>from · {c.articleTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
