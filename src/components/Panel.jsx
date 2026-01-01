import React from 'react';
import CornerDecorations from './CornerDecorations';

export default function Panel({
  title,
  children,
  accentColor = '#00ff88',
  showCorners = true,
  style = {}
}) {
  return (
    <div style={{
      backgroundColor: 'rgba(0,20,10,0.85)',
      border: `2px solid ${accentColor}`,
      position: 'relative',
      boxShadow: `0 0 30px ${accentColor}33`,
      ...style,
    }}>
      {showCorners && <CornerDecorations color={accentColor} />}

      {title && (
        <div style={{
          backgroundColor: accentColor,
          padding: '10px 20px',
          borderBottom: `2px solid ${accentColor}`,
        }}>
          <span style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#0a0a0a',
          }}>
            {title}
          </span>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}
