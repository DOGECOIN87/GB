import React from 'react';

const Arrow = ({ direction, color = '#001a0a' }) => {
  const rotations = { up: '0deg', down: '180deg', left: '-90deg', right: '90deg' };
  return (
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: `12px solid ${color}`,
      transform: `rotate(${rotations[direction]})`,
    }} />
  );
};

export default function KeyCap({ label, size = 'normal', active = false, arrow = null }) {
  const widths = { normal: '45px', wide: '70px', space: '180px' };
  return (
    <div style={{
      width: widths[size],
      height: '45px',
      backgroundColor: active ? '#00ff88' : 'rgba(0,30,15,0.9)',
      border: '2px solid ' + (active ? '#00ff88' : '#00aa55'),
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: size === 'space' ? '8px' : '10px',
      color: active ? '#001a0a' : '#00ff88',
      boxShadow: active
        ? '0 0 15px rgba(0,255,136,0.6), inset 0 -3px 0 rgba(0,0,0,0.3)'
        : '0 4px 0 #001a0a, inset 0 -3px 0 rgba(0,0,0,0.3)',
      transition: 'all 0.1s ease',
      cursor: 'pointer',
      userSelect: 'none',
    }}>
      {arrow ? <Arrow direction={arrow} color={active ? '#001a0a' : '#00ff88'} /> : label}
    </div>
  );
}
