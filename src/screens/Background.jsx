import React, { useState } from 'react';

export default function GorboyGrid() {
  const [showControls, setShowControls] = useState(true);
  const [gridColor, setGridColor] = useState('#00ff88');
  const [gridSpeed, setGridSpeed] = useState(2);
  const [showScanlines, setShowScanlines] = useState(true);

  const gridColorOptions = [
    { value: '#00ff88', label: 'CYBER GREEN' },
    { value: '#ff0040', label: 'DANGER RED' },
    { value: '#00d4ff', label: 'ICE BLUE' },
    { value: '#ff00ff', label: 'NEON PINK' },
    { value: '#ffaa00', label: 'AMBER' },
    { value: '#ffffff', label: 'WHITE' },
  ];

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        @keyframes gridMove {
          0% { transform: rotateX(60deg) translateY(0); }
          100% { transform: rotateX(60deg) translateY(50px); }
        }
        
        .scanlines::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 10;
        }
        
        .perspective-grid-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70%;
          perspective: 400px;
          perspective-origin: 50% 0%;
          overflow: hidden;
          mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%);
        }
        
        .control-panel {
          transition: all 0.3s ease;
        }
        
        .control-panel:hover {
          background: rgba(0,20,10,0.95) !important;
        }
        
        .color-btn {
          transition: all 0.1s ease;
          cursor: pointer;
        }
        
        .color-btn:hover {
          transform: scale(1.1);
        }
        
        .toggle-controls {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .toggle-controls:hover {
          filter: brightness(1.2);
        }
      `}</style>

      {/* Main Background Container */}
      <div 
        className={showScanlines ? 'scanlines' : ''}
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, #0a0a0a 0%, ${hexToRgba(gridColor, 0.05)} 40%, ${hexToRgba(gridColor, 0.1)} 100%)`,
        }}
      >
        
        {/* 3D Perspective Grid */}
        <div className="perspective-grid-container">
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: '-50%',
              width: '200%',
              height: '300%',
              backgroundImage: `
                linear-gradient(${hexToRgba(gridColor, 0.4)} 2px, transparent 2px),
                linear-gradient(90deg, ${hexToRgba(gridColor, 0.4)} 2px, transparent 2px)
              `,
              backgroundSize: '50px 50px',
              transformOrigin: 'center top',
              animation: `gridMove ${gridSpeed}s linear infinite`,
            }}
          />
        </div>
        
        {/* Horizon Glow */}
        <div style={{
          position: 'absolute',
          bottom: '35%',
          left: 0,
          right: 0,
          height: '250px',
          background: `radial-gradient(ellipse 100% 60% at 50% 100%, ${hexToRgba(gridColor, 0.2)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="toggle-controls"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '8px',
          padding: '10px 15px',
          backgroundColor: showControls ? gridColor : 'transparent',
          color: showControls ? '#0a0a0a' : gridColor,
          border: `2px solid ${gridColor}`,
          cursor: 'pointer',
        }}
      >
        {showControls ? 'HIDE' : 'SHOW'}
      </button>

      {/* Control Panel */}
      {showControls && (
        <div
          className="control-panel"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 100,
            backgroundColor: 'rgba(0,20,10,0.85)',
            border: `2px solid ${gridColor}`,
            padding: '0',
            minWidth: '200px',
            boxShadow: `0 0 20px ${hexToRgba(gridColor, 0.3)}`,
          }}
        >
          <div style={{
            backgroundColor: gridColor,
            padding: '8px 12px',
          }}>
            <span style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '8px',
              color: '#0a0a0a',
            }}>
              ⚙ GRID CONFIG
            </span>
          </div>

          <div style={{ padding: '15px' }}>
            {/* Color Selection */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                fontFamily: '"VT323", monospace',
                fontSize: '14px',
                color: gridColor,
                marginBottom: '8px',
              }}>
                COLOR
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {gridColorOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setGridColor(opt.value)}
                    className="color-btn"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: opt.value,
                      border: gridColor === opt.value ? '3px solid #fff' : '2px solid #333',
                      boxShadow: gridColor === opt.value ? `0 0 10px ${opt.value}` : 'none',
                    }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>

            {/* Speed Control */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                fontFamily: '"VT323", monospace',
                fontSize: '14px',
                color: gridColor,
                marginBottom: '8px',
              }}>
                SPEED: {gridSpeed}s
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={gridSpeed}
                onChange={(e) => setGridSpeed(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: gridColor,
                }}
              />
            </div>

            {/* Scanlines Toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: '"VT323", monospace',
              fontSize: '14px',
              color: gridColor,
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={showScanlines}
                onChange={(e) => setShowScanlines(e.target.checked)}
                style={{ accentColor: gridColor }}
              />
              SCANLINES
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
