import { useState } from 'react';
import { M3 } from '../theme.js';

export function Icon({ name, size = 24, color, fill = 0, weight = 400, style: sx }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size, color, display: 'inline-block',
        fontVariationSettings: `'FILL' ${fill},'wght' ${weight},'GRAD' 0,'opsz' ${size}`,
        ...sx,
      }}
    >{name}</span>
  );
}

export function IconBtn({ name, onClick, color = M3.onSurfaceVar, badge, size = 40 }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: size, height: size, borderRadius: '50%', border: 0, cursor: 'pointer',
        background: hov ? 'rgba(29,27,32,0.08)' : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative',
      }}
    >
      <Icon name={name} color={color} size={22} />
      {badge && (
        <span style={{
          position: 'absolute', top: 7, right: 7, width: 8, height: 8,
          borderRadius: '50%', background: M3.error, border: `2px solid ${M3.surface}`,
        }} />
      )}
    </button>
  );
}

export function Btn({ variant = 'filled', icon, children, onClick, disabled, style: sx, fullWidth }) {
  const [hov, setHov] = useState(false);
  const variants = {
    filled:   { bg: M3.primary,       fg: M3.onPrimary },
    tonal:    { bg: M3.secondaryCont, fg: M3.onSecondaryCont },
    outlined: { bg: 'transparent',    fg: M3.primary, border: `1px solid ${M3.outline}` },
    text:     { bg: 'transparent',    fg: M3.primary },
  };
  const v = variants[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: icon ? '0 20px 0 16px' : '0 24px',
        borderRadius: 9999, border: v.border || 0, cursor: disabled ? 'not-allowed' : 'pointer',
        background: v.bg, color: v.fg, opacity: disabled ? 0.4 : hov ? 0.88 : 1,
        fontFamily: 'Roboto,system-ui', fontSize: 14, fontWeight: 500, letterSpacing: 0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'opacity 0.12s', width: fullWidth ? '100%' : undefined, ...sx,
      }}
    >
      {icon && <Icon name={icon} size={18} color="currentColor" />}
      {children}
    </button>
  );
}

export function Chip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 32, padding: '0 16px', borderRadius: 8, cursor: 'pointer',
        border: selected ? 0 : `1px solid ${M3.outlineVar}`,
        background: selected ? M3.secondaryCont : 'transparent',
        color: selected ? M3.onSecondaryCont : M3.onSurfaceVar,
        fontFamily: 'Roboto,system-ui', fontSize: 14, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
      }}
    >
      {selected && <Icon name="check" size={16} color="currentColor" />}
      {children}
    </button>
  );
}

export function Scrim({ onClick, z = 200 }) {
  return (
    <div
      onClick={onClick}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: z }}
    />
  );
}

export function FormInput({ label, value, onChange, placeholder, multiline, required }) {
  const base = {
    width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14,
    color: M3.onSurface, border: `1px solid ${M3.outlineVar}`, background: M3.surface,
    outline: 'none', fontFamily: 'Roboto,system-ui', lineHeight: 1.5,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: M3.onSurfaceVar, letterSpacing: 0.4 }}>
        {label}{required && <span style={{ color: M3.error }}> *</span>}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, resize: 'vertical' }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}
