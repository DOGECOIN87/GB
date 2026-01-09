import React from 'react';

/**
 * GameUI - React component for game HUD and touch controls
 * Identical to the controls shown in the Controls page
 */
const GameUI = ({ 
  coins = 0, 
  securedCoins = 0, 
  isDockingAvailable = false,
  onActionA,
  onActionB,
  onMove,
  onStart,
  onSelect
}) => {
  
  const MobileArrow = ({ direction, color = '#00ff88' }) => {
    const rotations = { up: '0deg', down: '180deg', left: '-90deg', right: '90deg' };
    return (
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: `10px solid ${color}`,
        transform: `rotate(${rotations[direction]})`,
      }} />
    );
  };

  const MobileButton = ({ label, size = 50, round = false, color = '#00ff88', arrow = null, onTouchStart, onTouchEnd, onMouseDown, onMouseUp }) => (
    <div 
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgba(0,30,15,0.9)',
        border: `3px solid ${color}`,
        borderRadius: round ? '50%' : '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: round ? '12px' : '8px',
        color: color,
        boxShadow: `0 0 10px ${color}40, inset 0 0 20px rgba(0,0,0,0.5)`,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {arrow ? <MobileArrow direction={arrow} color={color} /> : label}
    </div>
  );

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#00ff88',
      textShadow: '0 0 10px rgba(0,255,136,0.5)',
      zIndex: 100
    }}>
      {/* HUD Top */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', border: '1px solid #00aa55' }}>
          <div style={{ fontSize: '8px', marginBottom: '5px', color: '#00aa55' }}>COINS</div>
          <div style={{ fontSize: '16px' }}>{coins.toString().padStart(4, '0')}</div>
        </div>
        
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', border: '1px solid #00aa55', textAlign: 'right' }}>
          <div style={{ fontSize: '8px', marginBottom: '5px', color: '#00aa55' }}>SECURED</div>
          <div style={{ fontSize: '16px' }}>{securedCoins.toString().padStart(4, '0')}</div>
        </div>
      </div>

      {/* Docking Prompt */}
      {isDockingAvailable && (
        <div style={{
          alignSelf: 'center',
          backgroundColor: 'rgba(0,255,255,0.2)',
          padding: '10px 20px',
          border: '2px solid #00ffff',
          borderRadius: '5px',
          animation: 'pulse 1s infinite',
          fontSize: '10px',
          color: '#00ffff'
        }}>
          DOCKING AVAILABLE
        </div>
      )}

      {/* Controls Bottom */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'auto',
        padding: '0 10px 20px 10px'
      }}>
        {/* Left: D-Pad */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
        }}>
          <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' }}>
            <MobileButton arrow="up" size={40} 
              onTouchStart={() => onMove('up', true)} onTouchEnd={() => onMove('up', false)}
              onMouseDown={() => onMove('up', true)} onMouseUp={() => onMove('up', false)}
            />
          </div>
          <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
            <MobileButton arrow="down" size={40} 
              onTouchStart={() => onMove('down', true)} onTouchEnd={() => onMove('down', false)}
              onMouseDown={() => onMove('down', true)} onMouseUp={() => onMove('down', false)}
            />
          </div>
          <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
            <MobileButton arrow="left" size={40} 
              onTouchStart={() => onMove('left', true)} onTouchEnd={() => onMove('left', false)}
              onMouseDown={() => onMove('left', true)} onMouseUp={() => onMove('left', false)}
            />
          </div>
          <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
            <MobileButton arrow="right" size={40} 
              onTouchStart={() => onMove('right', true)} onTouchEnd={() => onMove('right', false)}
              onMouseDown={() => onMove('right', true)} onMouseUp={() => onMove('right', false)}
            />
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
            backgroundColor: '#001a0a',
            border: '2px solid #00aa55',
          }} />
        </div>

        {/* Center: Select/Start */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '40px'
        }}>
          <div 
            onClick={onSelect}
            style={{
              width: '50px',
              height: '20px',
              backgroundColor: 'rgba(0,30,15,0.9)',
              border: '2px solid #00aa55',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '5px',
              color: '#00aa55',
              cursor: 'pointer'
            }}>
            SELECT
          </div>
          <div 
            onClick={onStart}
            style={{
              width: '50px',
              height: '20px',
              backgroundColor: 'rgba(0,30,15,0.9)',
              border: '2px solid #00aa55',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '5px',
              color: '#00aa55',
              cursor: 'pointer'
            }}>
            START
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div style={{ marginTop: '30px' }}>
            <MobileButton label="B" size={55} round color="#ffd93d"
              onTouchStart={onActionB} onTouchEnd={() => {}}
              onMouseDown={onActionB} onMouseUp={() => {}}
            />
          </div>
          <div style={{ marginTop: '-10px' }}>
            <MobileButton label="A" size={55} round color="#ff6b6b"
              onTouchStart={onActionA} onTouchEnd={() => {}}
              onMouseDown={onActionA} onMouseUp={() => {}}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default GameUI;
