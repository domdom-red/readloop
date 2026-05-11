import { useState } from 'react';
import { M3 } from '../theme.js';
import { Scrim, Btn, IconBtn, FormInput } from './ui.jsx';
import { getApiKey, setApiKey } from '../api.js';

export default function SettingsModal({ onClose }) {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const save = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  const maskedCurrent = getApiKey()
    ? getApiKey().slice(0, 12) + '••••••••••••'
    : null;

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
          <div style={{ fontSize: 22, fontWeight: 500, color: M3.onSurface }}>설정</div>
          <IconBtn name="close" onClick={onClose} />
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: M3.onSurface, marginBottom: 6 }}>Anthropic API 키</div>
          <div style={{ fontSize: 12, color: M3.onSurfaceVar, marginBottom: 12, lineHeight: '18px' }}>
            AI 자동 요약·채점에 사용돼요. 키는 이 기기 로컬에만 저장되고 외부로 전송되지 않아요.
            {maskedCurrent && <div style={{ marginTop: 6, color: M3.primary }}>현재: {maskedCurrent}</div>}
          </div>
          <FormInput
            label="API 키"
            value={key}
            onChange={setKey}
            placeholder="sk-ant-api03-..."
          />
        </div>

        <div style={{ fontSize: 12, color: M3.onSurfaceVar, background: M3.surfContLow, borderRadius: 10, padding: '10px 14px', lineHeight: '18px' }}>
          키 발급: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: M3.primary }}>console.anthropic.com</a>에서 발급 후 붙여넣기
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
