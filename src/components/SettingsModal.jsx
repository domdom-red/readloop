import { useState } from 'react';
import { M3 } from '../theme.js';
import { Scrim, Btn, IconBtn } from './ui.jsx';
import { PROVIDERS, getProvider, setProvider, getApiKey, setApiKey } from '../api.js';

export default function SettingsModal({ onClose }) {
  const [activeProvider, setActiveProvider] = useState(getProvider());
  const [keys, setKeys] = useState(() =>
    Object.fromEntries(PROVIDERS.map(p => [p.id, getApiKey(p.id)])),
  );
  const [saved, setSaved] = useState(false);

  const provider = PROVIDERS.find(p => p.id === activeProvider);

  const save = () => {
    setProvider(activeProvider);
    PROVIDERS.forEach(p => setApiKey(keys[p.id] || '', p.id));
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <>
      <Scrim onClick={onClose} z={300} />
      <div className="anim-slide" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 400, width: 480, maxWidth: 'calc(100vw - 32px)',
        background: M3.surface, borderRadius: 28, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: M3.onSurface }}>AI 설정</div>
          <IconBtn name="close" onClick={onClose} />
        </div>

        {/* Provider tabs */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: M3.onSurfaceVar, letterSpacing: 0.4, marginBottom: 10 }}>AI 모델 선택</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {PROVIDERS.map(p => {
              const active = activeProvider === p.id;
              const hasKey = !!keys[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProvider(p.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 14, cursor: 'pointer',
                    border: active ? `2px solid ${M3.primary}` : `1px solid ${M3.outlineVar}`,
                    background: active ? M3.primaryCont : 'transparent',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: active ? M3.onPrimaryCont : M3.onSurface }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 10, color: active ? M3.primary : M3.onSurfaceVar }}>
                    {p.sub}
                  </div>
                  {hasKey && (
                    <div style={{ fontSize: 10, color: M3.primary, fontWeight: 600 }}>✓ 키 있음</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Key input for selected provider */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: M3.onSurface }}>{provider.label} API 키</div>
            <a
              href={provider.keyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: M3.primary, textDecoration: 'none' }}
            >
              키 발급 →
            </a>
          </div>
          <input
            value={keys[activeProvider]}
            onChange={e => setKeys(prev => ({ ...prev, [activeProvider]: e.target.value }))}
            placeholder={provider.placeholder}
            style={{
              width: '100%', height: 42, border: `1px solid ${M3.outlineVar}`, borderRadius: 10,
              padding: '0 12px', fontSize: 14, color: M3.onSurface, background: M3.surfContLow,
              fontFamily: 'Roboto,system-ui', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {activeProvider === 'gemini' && !keys.gemini && (
            <div style={{ marginTop: 8, fontSize: 12, color: M3.primary, lineHeight: '18px' }}>
              Gemini는 무료 티어로 하루 1,500회 요청이 가능해요.
            </div>
          )}
        </div>

        <div style={{ fontSize: 12, color: M3.onSurfaceVar, background: M3.surfContLow, borderRadius: 10, padding: '10px 14px', lineHeight: '18px' }}>
          API 키는 이 기기 로컬에만 저장되며 외부로 전송되지 않아요.
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn variant="text" onClick={onClose}>취소</Btn>
          <Btn variant="filled" onClick={save} disabled={saved}>
            {saved ? '저장됨 ✓' : '저장하기'}
          </Btn>
        </div>
      </div>
    </>
  );
}
