import React from 'react';

export default function Toggle({
  label,
  value,
  onChange,
  accentColor = '#00ff88'
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid rgba(0,255,136,0.2)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{
        fontFamily: '"VT323", monospace',
        fontSize: '18px',
        color: accentColor,
      }}>
        {label}
      </span>

      <div style={{
        width: '50px',
        height: '26px',
        backgroundColor: value ? accentColor : 'rgba(0,20,10,0.8)',
        border: `2px solid ${accentColor}`,
        position: 'relative',
        transition: 'all 0.2s ease',
      }}>
        <div style={{
          position: 'absolute',
          width: '18px',
          height: '18px',
          backgroundColor: value ? '#0a0a0a' : accentColor,
          top: '2px',
          left: value ? '26px' : '2px',
          transition: 'all 0.2s ease',
        }} />
      </div>
    </div>
  );
}
