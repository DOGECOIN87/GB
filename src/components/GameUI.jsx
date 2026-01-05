import React from 'react';

/**
 * GameUI - React component for game HUD and touch controls
 * Requirements: 4.1, 4.2, 4.3, 10.1, 10.2
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
  
  const MobileButton = ({ label, size = 60, color = '#ff6b6b', onClick, active = false }) => (
    <div 
      onClick={onClick}
      style={{
        width: size,
        height: size,
        backgroundColor: active ? color : 'rgba(0,30,15,0.9)',
        border: `3px solid ${color}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: active ? `0 0 20px ${color}` : '0 4px 0 #001a0a',
        transition: 'all 0.1s ease',
        transform: active ? 'translateY(2px)' : 'none'
      }}
    >
      <span style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: active ? '#001a0a' : color,
      }}>
        {label}
      </span>
    </div>
  );

  const DPad = ({ onMove }) => {
    const btnSize = 40;
    const containerSize = 120;
    
    return (
      <div style={{
        width: containerSize,
        height: containerSize,
        position: 'relative',
        backgroundColor: 'rgba(0,30,15,0.5)',
        borderRadius: '10px',
        border: '2px solid #00aa55'
      }}>
        {/* Up */}
        <div 
          onMouseDown={() => onMove('up', true)}
          onMouseUp={() => onMove('up', false)}
          onTouchStart={() => onMove('up', true)}
          onTouchEnd={() => onMove('up', false)}
          style={{
            position: 'absolute',
            top: 5,
            left: (containerSize - btnSize) / 2,
            width: btnSize,
            height: btnSize,
            backgroundColor: '#333',
            border: '2px solid #00aa55',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid #00ff88' }} />
        </div>
        
        {/* Down */}
        <div 
          onMouseDown={() => onMove('down', true)}
          onMouseUp={() => onMove('down', false)}
          onTouchStart={() => onMove('down', true)}
          onTouchEnd={() => onMove('down', false)}
          style={{
            position: 'absolute',
            bottom: 5,
            left: (containerSize - btnSize) / 2,
            width: btnSize,
            height: btnSize,
            backgroundColor: '#333',
            border: '2px solid #00aa55',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid #00ff88' }} />
        </div>
        
        {/* Left */}
        <div 
          onMouseDown={() => onMove('left', true)}
          onMouseUp={() => onMove('left', false)}
          onTouchStart={() => onMove('left', true)}
          onTouchEnd={() => onMove('left', false)}
          style={{
            position: 'absolute',
            left: 5,
            top: (containerSize - btnSize) / 2,
            width: btnSize,
            height: btnSize,
            backgroundColor: '#333',
            border: '2px solid #00aa55',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #00ff88' }} />
        </div>
        
        {/* Right */}
        <div 
          onMouseDown={() => onMove('right', true)}
          onMouseUp={() => onMove('right', false)}
          onTouchStart={() => onMove('right', true)}
          onTouchEnd={() => onMove('right', false)}
          style={{
            position: 'absolute',
            right: 5,
            top: (containerSize - btnSize) / 2,
            width: btnSize,
            height: btnSize,
            backgroundColor: '#333',
            border: '2px solid #00aa55',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #00ff88' }} />
        </div>
      </div>
    );
  };

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
      textShadow: '0 0 10px rgba(0,255,136,0.5)'
    }}>
      {/* HUD Top */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', border: '1px solid #00aa55' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px' }}>COINS</div>
          <div style={{ fontSize: '18px' }}>{coins.toString().padStart(4, '0')}</div>
        </div>
        
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', border: '1px solid #00aa55', textAlign: 'right' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px' }}>SECURED</div>
          <div style={{ fontSize: '18px' }}>{securedCoins.toString().padStart(4, '0')}</div>
        </div>
      </div>

      {/* Docking Prompt */}
      {isDockingAvailable && (
        <div style={{
          alignSelf: 'center',
          backgroundColor: 'rgba(0,255,255,0.2)',
          padding: '15px 30px',
          border: '2px solid #00ffff',
          borderRadius: '5px',
          animation: 'pulse 1s infinite',
          fontSize: '12px',
          color: '#00ffff'
        }}>
          DOCKING AVAILABLE
        </div>
      )}

      {/* Controls Bottom */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'auto'
      }}>
        {/* Left: D-Pad */}
        <DPad onMove={onMove} />

        {/* Center: Select/Start */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div onClick={onSelect} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '12px', backgroundColor: '#555', borderRadius: '6px', border: '1px solid #777' }} />
            <div style={{ fontSize: '6px', marginTop: '4px' }}>SELECT</div>
          </div>
          <div onClick={onStart} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '12px', backgroundColor: '#555', borderRadius: '6px', border: '1px solid #777' }} />
            <div style={{ fontSize: '6px', marginTop: '4px' }}>START</div>
          </div>
        </div>

        {/* Right: A/B Buttons */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ marginTop: '30px' }}>
            <MobileButton label="B" color="#ffd93d" onClick={onActionB} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <MobileButton label="A" color="#ff6b6b" onClick={onActionA} />
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
