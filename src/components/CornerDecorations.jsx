import React from 'react';

export default function CornerDecorations({ color = '#00ff88', size = 15 }) {
  const cornerStyle = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    border: `2px solid ${color}`,
  };

  return (
    <>
      {/* Top Left */}
      <div style={{
        ...cornerStyle,
        top: '-2px',
        left: '-2px',
        borderRight: 'none',
        borderBottom: 'none',
      }} />

      {/* Top Right */}
      <div style={{
        ...cornerStyle,
        top: '-2px',
        right: '-2px',
        borderLeft: 'none',
        borderBottom: 'none',
      }} />

      {/* Bottom Left */}
      <div style={{
        ...cornerStyle,
        bottom: '-2px',
        left: '-2px',
        borderRight: 'none',
        borderTop: 'none',
      }} />

      {/* Bottom Right */}
      <div style={{
        ...cornerStyle,
        bottom: '-2px',
        right: '-2px',
        borderLeft: 'none',
        borderTop: 'none',
      }} />
    </>
  );
}
