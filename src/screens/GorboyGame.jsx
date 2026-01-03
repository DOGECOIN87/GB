import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Galaxy from './Galaxy';

export default function GorboyGame() {
  const [screen, setScreen] = useState('intro');
  const [introPhase, setIntroPhase] = useState('black');
  const canvasRef = useRef(null);
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('reveal'), 500);
    const t2 = setTimeout(() => setIntroPhase('fadeout'), 2500);
    const t3 = setTimeout(() => setScreen('menu'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const check = () => setLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (screen !== 'menu' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let model;
    const loader = new GLTFLoader();
    loader.load('3d-model.glb', (gltf) => {
      model = gltf.scene;

      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Rescale model to a reasonable size (similar to the 1.8 cube)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      model.scale.setScalar(scale);

      // Shift to origin
      model.position.x = -center.x * scale;
      model.position.y = -center.y * scale;
      model.position.z = -center.z * scale;

      scene.add(model);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 10);
    scene.add(dirLight);

    const pl1 = new THREE.PointLight(0xffffff, 1.0, 100);
    pl1.position.set(-5, -5, 5);
    scene.add(pl1);
    camera.position.z = 5;

    let id;
    const animate = () => {
      id = requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); renderer.dispose(); };
  }, [screen]);

  const CircularLogo = () => (
    <img src="circle-logo.webp" className="w-full h-full" alt="Circle Logo" />
  );

  const SquareLogo = () => (
    <img src="square-logo.webp" className="w-full h-full object-contain" alt="Square Logo" />
  );

  const MetallicButton = ({ text, onClick, className = "" }) => (
    <button onClick={onClick} className={`bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 60" className="w-full h-auto drop-shadow-md">
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8e4e0" /><stop offset="50%" stopColor="#c8c4c0" /><stop offset="100%" stopColor="#b8b4b0" />
          </linearGradient>
          <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d0ccc8" /><stop offset="100%" stopColor="#d8d4d0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="236" height="56" rx="8" fill="url(#metalGrad)" stroke="#999" strokeWidth="1" />
        <g fill="#888"><rect x="8" y="20" width="15" height="3" rx="1" /><rect x="8" y="27" width="15" height="3" rx="1" /><rect x="8" y="34" width="15" height="3" rx="1" /></g>
        <g fill="#888"><rect x="217" y="20" width="15" height="3" rx="1" /><rect x="217" y="27" width="15" height="3" rx="1" /><rect x="217" y="34" width="15" height="3" rx="1" /></g>
        <rect x="30" y="8" width="180" height="44" rx="4" fill="url(#innerGrad)" stroke="#aaa" strokeWidth="1" />
        <text x="120" y="38" textAnchor="middle" className="font-mono text-lg font-bold uppercase tracking-widest" fill="#4a3a7c">{text}</text>
      </svg>
    </button>
  );

  // INTRO
  if (screen === 'intro') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center font-mono">
        <style>{`
          @keyframes logoReveal { 0% { opacity: 0; transform: scale(0.8); filter: brightness(0); } 50% { opacity: 1; transform: scale(1); filter: brightness(1); } 80% { opacity: 1; } 100% { opacity: 0; transform: scale(1.1); filter: brightness(0); } }
        `}</style>
        <div className="w-64 h-64 max-w-[70vw] max-h-[70vw]"
          style={{ animation: introPhase !== 'black' ? 'logoReveal 2.5s ease-out forwards' : 'none', opacity: introPhase === 'black' ? 0 : 1 }}>
          <CircularLogo />
        </div>
      </div>
    );
  }

  // MENU
  if (screen === 'menu') {
    return (
      <div className="w-full h-screen flex flex-col font-mono overflow-hidden relative" style={{ background: '#000' }}>
        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.8; } }
        `}</style>

        {/* Galaxy Background - positioned behind everything */}
        <div className="absolute inset-0 z-0">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.2}
            glowIntensity={0.4}
            saturation={0.6}
            hueShift={180}
            speed={0.8}
            twinkleIntensity={0.5}
            rotationSpeed={0.05}
            transparent={false}
          />
        </div>

        <div className="flex justify-between items-start p-5 z-10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-lime-400/30 bg-black/40" style={{ boxShadow: '0 0 20px rgba(200, 230, 74, 0.3)' }}>
              <SquareLogo />
            </div>
            <div className="flex flex-col">
              <span className="text-lime-400 text-xs md:text-sm font-bold tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(200, 230, 74, 0.5)' }}>GORBOY</span>
              <span className="text-lime-400/60 text-[10px] md:text-xs tracking-tighter">OFFICIAL GAME</span>
            </div>
          </div>
          <MetallicButton text="CONNECT" onClick={() => alert('Connect wallet!')} className="w-28 md:w-36" />
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200, 230, 74, 0.2) 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite' }} />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        </div>

        <div className="flex justify-center p-8 z-10">
          <MetallicButton text="ENTER" onClick={() => setScreen('game')} className="w-40 md:w-52" />
        </div>
      </div>
    );
  }

  // ==================== PORTRAIT LAYOUT ====================
  if (!landscape) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2a 0%, #2d2d3d 100%)' }}>
        <svg viewBox="0 0 280 470" className="w-full h-full max-w-md" style={{ maxHeight: '98vh' }}>
          <defs>
            {/* Device body gradient - precise Game Boy gray */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c5c5bd" />
              <stop offset="15%" stopColor="#bfbfb7" />
              <stop offset="50%" stopColor="#b8b8b0" />
              <stop offset="85%" stopColor="#b0b0a8" />
              <stop offset="100%" stopColor="#a8a8a0" />
            </linearGradient>

            {/* Screen bezel gradient - dark blue-gray exactly like reference */}
            <linearGradient id="bezelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#525a62" />
              <stop offset="50%" stopColor="#484f57" />
              <stop offset="100%" stopColor="#3e454d" />
            </linearGradient>

            {/* LCD Screen gradient - classic green */}
            <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9cb030" />
              <stop offset="50%" stopColor="#8ca020" />
              <stop offset="100%" stopColor="#7c9018" />
            </linearGradient>

            {/* D-pad gradient */}
            <linearGradient id="dpadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#363636" />
              <stop offset="50%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#1e1e1e" />
            </linearGradient>

            {/* Purple button gradient - exact Game Boy magenta */}
            <linearGradient id="purpleButtonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#982878" />
              <stop offset="30%" stopColor="#882068" />
              <stop offset="70%" stopColor="#701858" />
              <stop offset="100%" stopColor="#601050" />
            </linearGradient>

            {/* Pill button gradient */}
            <linearGradient id="pillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a9a92" />
              <stop offset="50%" stopColor="#7a7a72" />
              <stop offset="100%" stopColor="#6a6a62" />
            </linearGradient>

            {/* Speaker slot gradient */}
            <linearGradient id="speakerSlotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#606058" />
              <stop offset="50%" stopColor="#505048" />
              <stop offset="100%" stopColor="#606058" />
            </linearGradient>

            {/* Drop shadow */}
            <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="2" dy="4" stdDeviation="6" floodOpacity="0.4" />
            </filter>

            {/* Button shadow */}
            <filter id="buttonShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.35" />
            </filter>

            {/* Inset shadow for screen */}
            <filter id="insetShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite operator="out" in="SourceGraphic" />
            </filter>
          </defs>

          {/* Main device body */}
          <rect x="8" y="8" width="264" height="454" rx="10" ry="10" fill="url(#bodyGradient)" filter="url(#dropShadow)" />

          {/* Subtle edge highlight */}
          <rect x="8" y="8" width="264" height="454" rx="10" ry="10" fill="none" stroke="#d0d0c8" strokeWidth="1" />

          {/* Inner edge shadow line */}
          <rect x="12" y="12" width="256" height="446" rx="8" ry="8" fill="none" stroke="#a0a098" strokeWidth="0.5" />

          {/* ========== TOP POWER SWITCH AREA ========== */}
          <rect x="95" y="2" width="90" height="12" rx="2" fill="#a8a8a0" stroke="#909088" strokeWidth="0.5" />
          <rect x="100" y="4" width="80" height="8" rx="1" fill="#888880" />
          <text x="140" y="10" textAnchor="middle" fontSize="5" fill="#555" fontFamily="Arial, sans-serif" fontWeight="bold">◀ OFF·ON ▶</text>

          {/* ========== SCREEN BEZEL AREA ========== */}
          <rect x="28" y="32" width="224" height="175" rx="6" fill="url(#bezelGradient)" />

          {/* Inner bezel highlight */}
          <rect x="29" y="33" width="222" height="173" rx="5" fill="none" stroke="#5a626a" strokeWidth="0.5" />

          {/* Colored decorative lines - red and blue */}
          <line x1="65" y1="44" x2="215" y2="44" stroke="#a01040" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="49" x2="215" y2="49" stroke="#2850a8" strokeWidth="2.5" strokeLinecap="round" />

          {/* "DOT MATRIX WITH STEREO SOUND" text */}
          <text x="140" y="62" textAnchor="middle" fontSize="5.5" fill="#a8b0b8" fontFamily="Arial, sans-serif" letterSpacing="1.5" fontWeight="500">DOT MATRIX WITH STEREO SOUND</text>

          {/* Screen outer border */}
          <rect x="52" y="70" width="176" height="130" rx="2" fill="#2a2a2a" />

          {/* LCD Screen */}
          <rect x="55" y="73" width="170" height="124" rx="1" fill="url(#screenGradient)" />

          {/* Screen reflection/shine */}
          <rect x="55" y="73" width="170" height="40" rx="1" fill="rgba(255,255,255,0.03)" />

          {/* Battery indicator area */}
          <g transform="translate(32, 80)">
            <text x="8" y="0" fontSize="4.5" fill="#9aa0a8" fontFamily="Arial, sans-serif" fontWeight="500" letterSpacing="0.3">BATTERY</text>
            <circle cx="8" cy="12" r="5" fill="#1a1a1a" stroke="#101010" strokeWidth="0.5" />
            <circle cx="8" cy="12" r="3" fill="#d01010">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Screen content */}
          <text x="140" y="130" textAnchor="middle" fontSize="12" fill="#3a4a1a" fontFamily="monospace" fontWeight="bold">PRESS START</text>
          <text x="140" y="148" textAnchor="middle" fontSize="7" fill="#3a4a1a" opacity="0.8" fontFamily="monospace">GORBOY GAME v1.0</text>

          {/* ========== GORBOY LOGO ========== */}
          <g transform="translate(140, 228)">
            {/* "GORBOY" in Game Boy style font */}
            <text x="0" y="0" textAnchor="middle" fontSize="26" fill="#0f0f4f" fontFamily="'Times New Roman', serif" fontWeight="bold" fontStyle="italic" letterSpacing="1">
              GORBOY
            </text>
            {/* TM symbol */}
            <text x="62" y="-12" fontSize="5" fill="#0f0f4f" fontFamily="Arial, sans-serif">TM</text>
          </g>

          {/* ========== D-PAD ========== */}
          <g transform="translate(30, 260)">
            {/* D-pad base shadow */}
            <ellipse cx="40" cy="42" rx="38" ry="4" fill="rgba(0,0,0,0.1)" />

            {/* Vertical bar of cross */}
            <rect x="25" y="0" width="30" height="80" rx="2" fill="url(#dpadGradient)" filter="url(#buttonShadow)" />

            {/* Horizontal bar of cross */}
            <rect x="0" y="25" width="80" height="30" rx="2" fill="url(#dpadGradient)" />

            {/* Center circle indent */}
            <circle cx="40" cy="40" r="8" fill="#181818" />

            {/* Subtle cross highlights */}
            <rect x="26" y="1" width="28" height="78" rx="1" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </g>

          {/* ========== A & B BUTTONS ========== */}
          {/* Button housing/recessed area hint */}
          <ellipse cx="218" cy="300" rx="50" ry="35" fill="rgba(0,0,0,0.03)" />

          {/* B Button (lower-left of pair) */}
          <g transform="translate(178, 295)">
            <circle cx="18" cy="18" r="17" fill="url(#purpleButtonGradient)" filter="url(#buttonShadow)" />
            {/* Button shine */}
            <ellipse cx="18" cy="13" rx="10" ry="5" fill="rgba(255,255,255,0.1)" />
            {/* Button edge highlight */}
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </g>

          {/* A Button (upper-right of pair) */}
          <g transform="translate(218, 270)">
            <circle cx="18" cy="18" r="17" fill="url(#purpleButtonGradient)" filter="url(#buttonShadow)" />
            {/* Button shine */}
            <ellipse cx="18" cy="13" rx="10" ry="5" fill="rgba(255,255,255,0.1)" />
            {/* Button edge highlight */}
            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </g>

          {/* Button labels */}
          <text x="196" y="335" textAnchor="middle" fontSize="9" fill="#0f0f4f" fontFamily="Arial, sans-serif" fontWeight="bold">B</text>
          <text x="236" y="310" textAnchor="middle" fontSize="9" fill="#0f0f4f" fontFamily="Arial, sans-serif" fontWeight="bold">A</text>

          {/* ========== SELECT & START BUTTONS ========== */}
          <g transform="translate(98, 365)">
            {/* SELECT button */}
            <g transform="rotate(-25, 20, 6)">
              <rect x="0" y="0" width="38" height="11" rx="5.5" fill="url(#pillGradient)" filter="url(#buttonShadow)" />
              <rect x="1" y="1" width="36" height="9" rx="4.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            </g>
            <text x="20" y="30" textAnchor="middle" fontSize="5.5" fill="#0f0f4f" fontFamily="Arial, sans-serif" fontWeight="bold" letterSpacing="0.8">SELECT</text>

            {/* START button */}
            <g transform="translate(48, 0)">
              <g transform="rotate(-25, 20, 6)">
                <rect x="0" y="0" width="38" height="11" rx="5.5" fill="url(#pillGradient)" filter="url(#buttonShadow)" />
                <rect x="1" y="1" width="36" height="9" rx="4.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              </g>
              <text x="20" y="30" textAnchor="middle" fontSize="5.5" fill="#0f0f4f" fontFamily="Arial, sans-serif" fontWeight="bold" letterSpacing="0.8">START</text>
            </g>
          </g>

          {/* ========== SPEAKER GRILLE ========== */}
          <g transform="translate(195, 365)">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <g key={i} transform={`rotate(-20, ${i * 9 + 4}, 25)`}>
                <rect x={i * 9} y="0" width="6" height="50" rx="3" fill="url(#speakerSlotGradient)" />
                <rect x={i * 9 + 0.5} y="0.5" width="5" height="49" rx="2.5" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              </g>
            ))}
          </g>

          {/* ========== BOTTOM DETAILS ========== */}
          {/* Phones jack label area */}
          <g transform="translate(105, 440)">
            <text x="35" y="8" textAnchor="middle" fontSize="4" fill="#707068" fontFamily="Arial, sans-serif" letterSpacing="0.5">🎧 PHONES</text>
          </g>

          {/* Bottom edge detail line */}
          <line x1="30" y1="450" x2="250" y2="450" stroke="#a0a098" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>
    );
  }

  // ==================== LANDSCAPE LAYOUT ====================
  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2a 0%, #2d2d3d 100%)' }}>
      <svg viewBox="0 0 600 340" className="w-full h-full max-w-5xl" style={{ maxHeight: '95vh' }}>
        <defs>
          {/* Device body gradient - gray like reference */}
          <linearGradient id="lBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8c8c0" />
            <stop offset="30%" stopColor="#b8b8b0" />
            <stop offset="70%" stopColor="#a8a8a0" />
            <stop offset="100%" stopColor="#989890" />
          </linearGradient>

          {/* Screen bezel gradient - dark gray */}
          <linearGradient id="lBezelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#505050" />
            <stop offset="50%" stopColor="#404040" />
            <stop offset="100%" stopColor="#303030" />
          </linearGradient>

          {/* LCD Screen gradient */}
          <linearGradient id="lScreenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9dad40" />
            <stop offset="50%" stopColor="#8b9a38" />
            <stop offset="100%" stopColor="#7a8830" />
          </linearGradient>

          {/* D-pad button gradient - solid black */}
          <linearGradient id="lDpadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Action button gradient - dark burgundy/maroon */}
          <linearGradient id="lActionBtnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a2040" />
            <stop offset="40%" stopColor="#6a1830" />
            <stop offset="100%" stopColor="#501025" />
          </linearGradient>

          {/* Small button gradient - gray */}
          <linearGradient id="lSmallBtnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#909090" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>

          {/* Pill button gradient - gray */}
          <linearGradient id="lPillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#808080" />
            <stop offset="50%" stopColor="#606060" />
            <stop offset="100%" stopColor="#505050" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="lDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.35" />
          </filter>

          {/* Button shadow */}
          <filter id="lButtonShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Main device body - rounded rectangle */}
        <rect x="10" y="10" width="580" height="320" rx="40" fill="url(#lBodyGradient)" filter="url(#lDropShadow)" />

        {/* Inner border line */}
        <rect x="20" y="20" width="560" height="300" rx="32" fill="none" stroke="#888" strokeWidth="1" />

        {/* ========== LEFT SIDE ========== */}

        {/* MENU button and label */}
        <g transform="translate(35, 50)">
          <text x="0" y="10" fontSize="10" fill="#555" fontFamily="sans-serif" fontWeight="500">MENU</text>
          <circle cx="55" cy="6" r="8" fill="url(#lSmallBtnGradient)" filter="url(#lButtonShadow)" />
        </g>

        {/* FF >> button and label */}
        <g transform="translate(35, 78)">
          <text x="0" y="10" fontSize="10" fill="#555" fontFamily="sans-serif" fontWeight="500">FF &gt;&gt;</text>
          <circle cx="55" cy="6" r="8" fill="url(#lSmallBtnGradient)" filter="url(#lButtonShadow)" />
        </g>

        {/* D-PAD - solid black cross like reference */}
        <g transform="translate(30, 110)">
          {/* D-pad shadow */}
          <ellipse cx="48" cy="52" rx="46" ry="5" fill="rgba(0,0,0,0.2)" />

          {/* Vertical bar */}
          <rect x="30" y="0" width="36" height="100" rx="3" fill="url(#lDpadGradient)" filter="url(#lButtonShadow)" />
          {/* Horizontal bar */}
          <rect x="0" y="32" width="96" height="36" rx="3" fill="url(#lDpadGradient)" />

          {/* Center indent */}
          <circle cx="48" cy="50" r="10" fill="#1a1a1a" />
        </g>

        {/* SELECT button */}
        <g transform="translate(48, 280)">
          <rect x="0" y="0" width="48" height="14" rx="7" fill="url(#lPillGradient)" filter="url(#lButtonShadow)" />
          <text x="24" y="28" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">SELECT</text>
        </g>

        {/* ========== CENTER SCREEN ========== */}

        {/* Screen bezel */}
        <rect x="155" y="30" width="290" height="260" rx="8" fill="url(#lBezelGradient)" />

        {/* Inner bezel border */}
        <rect x="159" y="34" width="282" height="252" rx="6" fill="none" stroke="#222" strokeWidth="2" />

        {/* LCD Screen */}
        <rect x="165" y="40" width="270" height="240" rx="4" fill="url(#lScreenGradient)" />

        {/* Screen content */}
        <text x="300" y="155" textAnchor="middle" fontSize="14" fill="#3a4a2a" fontFamily="monospace">PRESS START</text>
        <text x="300" y="175" textAnchor="middle" fontSize="8" fill="#3a4a2a" opacity="0.7" fontFamily="monospace">GORBOY GAME v1.0</text>

        {/* ========== RIGHT SIDE ========== */}

        {/* LOAD button and label */}
        <g transform="translate(460, 50)">
          <circle cx="6" cy="6" r="8" fill="url(#lSmallBtnGradient)" filter="url(#lButtonShadow)" />
          <text x="22" y="10" fontSize="10" fill="#555" fontFamily="sans-serif" fontWeight="500">LOAD</text>
        </g>

        {/* SAVE button and label */}
        <g transform="translate(460, 78)">
          <circle cx="6" cy="6" r="8" fill="url(#lSmallBtnGradient)" filter="url(#lButtonShadow)" />
          <text x="22" y="10" fontSize="10" fill="#555" fontFamily="sans-serif" fontWeight="500">SAVE</text>
        </g>

        {/* A button (top) - dark burgundy */}
        <g transform="translate(490, 105)">
          <circle cx="32" cy="32" r="30" fill="url(#lActionBtnGradient)" filter="url(#lButtonShadow)" />
          <circle cx="32" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <ellipse cx="32" cy="24" rx="18" ry="8" fill="rgba(255,255,255,0.05)" />
        </g>
        <text x="522" y="175" textAnchor="middle" fontSize="12" fill="#1a3a6a" fontFamily="sans-serif" fontWeight="bold">A</text>

        {/* B button (bottom) - dark burgundy */}
        <g transform="translate(490, 180)">
          <circle cx="32" cy="32" r="30" fill="url(#lActionBtnGradient)" filter="url(#lButtonShadow)" />
          <circle cx="32" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <ellipse cx="32" cy="24" rx="18" ry="8" fill="rgba(255,255,255,0.05)" />
        </g>
        <text x="522" y="250" textAnchor="middle" fontSize="12" fill="#1a3a6a" fontFamily="sans-serif" fontWeight="bold">B</text>

        {/* START button */}
        <g transform="translate(460, 280)">
          <rect x="0" y="0" width="48" height="14" rx="7" fill="url(#lPillGradient)" filter="url(#lButtonShadow)" />
          <text x="24" y="28" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">START</text>
        </g>

        {/* Speaker grille */}
        <g transform="translate(530, 265)">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x="0" y={i * 9} width="40" height="5" rx="2.5" fill="#666" stroke="#555" strokeWidth="0.5" />
          ))}
        </g>
      </svg>
    </div>
  );
}
