import { M3 } from '../theme.js';
import { Btn, Icon } from './ui.jsx';

export default function WebSidebar({ todayCards, onStartReview, weekRecap }) {
  return (
    <aside style={{
      width: 300, flexShrink: 0, background: M3.surfContLow,
      borderLeft: `1px solid ${M3.outlineVar}`,
      padding: '28px 22px', overflow: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: M3.onSurfaceVar, textTransform: 'uppercase' }}>오늘의 복습</div>

      {todayCards.length === 0 ? (
        <div style={{ marginTop: 12, padding: 16, background: M3.primaryCont, borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>✅</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: M3.onPrimaryCont, marginTop: 6 }}>오늘 복습 완료!</div>
          <div style={{ fontSize: 12, color: M3.onPrimaryCont, opacity: 0.75, marginTop: 4 }}>내일 새 카드가 준비돼요</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 20, fontWeight: 500, color: M3.onSurface, margin: '4px 0 14px' }}>{todayCards.length}개의 카드</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayCards.slice(0, 3).map(c => (
              <div key={c.id} style={{ background: M3.surface, borderRadius: 12, padding: '12px 14px', border: `1px solid ${M3.outlineVar}` }}>
                <div style={{ fontSize: 11, color: M3.primary, fontWeight: 600, letterSpacing: 0.4 }}>{c.type}</div>
                <div style={{ fontSize: 13, lineHeight: '19px', color: M3.onSurface, marginTop: 3 }}>{c.q}</div>
                <div style={{ fontSize: 11, color: M3.onSurfaceVar, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>from · {c.articleTitle}</div>
              </div>
            ))}
          </div>
          <Btn variant="filled" icon="play_arrow" onClick={onStartReview} style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
            복습 시작하기
          </Btn>
        </>
      )}

      <div style={{ height: 1, background: M3.outlineVar, margin: '24px 0 18px' }} />

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: M3.onSurfaceVar, textTransform: 'uppercase' }}>이번 주 인사이트</div>
      <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {weekRecap.map((t, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: M3.primaryCont, color: M3.onPrimaryCont, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 13, lineHeight: '18px', color: M3.onSurface }}>{t}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
