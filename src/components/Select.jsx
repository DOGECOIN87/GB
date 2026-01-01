import React from 'react';

export default function Select({
  label,
  value,
  options,
  onChange,
  accentColor = '#00ff88'
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontFamily: '"VT323", monospace',
        fontSize: '18px',
        color: accentColor,
        marginBottom: '10px',
      }}>
        {label}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '8px',
              padding: '10px 15px',
              backgroundColor: value === option.value ? accentColor : 'transparent',
              color: value === option.value ? '#0a0a0a' : accentColor,
              border: `2px solid ${accentColor}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
