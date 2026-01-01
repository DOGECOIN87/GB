import React from 'react';

export default function PerspectiveGrid({
  gridColor = '#00ff88',
  speed = 2,
  showScanlines = true
}) {
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <>
      <style>{`
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
      `}</style>

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
              animation: `gridMove ${speed}s linear infinite`,
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
    </>
  );
}
