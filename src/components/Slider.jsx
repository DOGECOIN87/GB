import React from 'react';

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  accentColor = '#00ff88'
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        <span style={{
          fontFamily: '"VT323", monospace',
          fontSize: '18px',
          color: accentColor,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '10px',
          color: accentColor,
          backgroundColor: 'rgba(0,255,136,0.15)',
          padding: '4px 8px',
          border: `1px solid ${accentColor}`,
        }}>
          {value}%
        </span>
      </div>

      <div style={{
        position: 'relative',
        height: '20px',
        backgroundColor: 'rgba(0,20,10,0.8)',
        border: `2px solid ${accentColor}`,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${value}%`,
          backgroundColor: accentColor,
          transition: 'width 0.1s ease',
        }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
}
