import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style = {}
}) {
  const variants = {
    primary: {
      backgroundColor: '#00ff88',
      color: '#0a0a0a',
      border: '2px solid #00ff88',
      hoverBg: '#00cc6a',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#00ff88',
      border: '2px solid #00ff88',
      hoverBg: 'rgba(0,255,136,0.1)',
    },
    danger: {
      backgroundColor: '#ff0040',
      color: '#ffffff',
      border: '2px solid #ff0040',
      hoverBg: '#cc0033',
    },
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '8px' },
    medium: { padding: '12px 24px', fontSize: '10px' },
    large: { padding: '16px 32px', fontSize: '12px' },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: s.fontSize,
        padding: s.padding,
        backgroundColor: v.backgroundColor,
        color: v.color,
        border: v.border,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
