import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Galaxy from './Galaxy';
import { GameEngine, InputManager, PlayerShip, LaserSystem, CoinSystem, DockingSystem } from '../game';
import GameUI from '../components/GameUI';

export default function GorboyGame() {
  const [screen, setScreen] = useState('intro');
  const [introPhase, setIntroPhase] = useState('black');
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [landscape, setLandscape] = useState(false);
  
  // Game State
  const [gameState, setGameState] = useState({
    coins: 0,
    securedCoins: 0,
    isDockingAvailable: false,
    isPaused: false
  });

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

  // Initialize Game Engine when entering game screen
  useEffect(() => {
    if (screen !== 'game' || !canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engine.initialize();
    engineRef.current = engine;

    // Add Systems
    const input = new InputManager();
    engine.addSystem('input', input);

    const laserSystem = new LaserSystem(engine);
    engine.addSystem('lasers', laserSystem);

    const coinSystem = new CoinSystem(engine);
    engine.addSystem('coins', coinSystem);
    
    const dockingSystem = new DockingSystem(engine);
    engine.addSystem('docking', dockingSystem);

    // Load Player Ship
    let player;
    engine.loadModel('3d-model.glb').then(model => {
      // Center and scale model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      
      engine.addToScene(model);
      player = new PlayerShip(engine, model);
    });

    // Game Loop Update
    engine.onUpdate = (deltaTime) => {
      if (player) player.update(deltaTime);
      
      if (input.isKeyDown('Space')) {
        if (player && player.model) {
          laserSystem.fire(player.model.position);
        }
      }

      coinSystem.update(deltaTime, player);
      dockingSystem.update(deltaTime, player);
    };

    // Callbacks
    coinSystem.onCoinCollected = () => {
      setGameState(prev => ({ ...prev, coins: prev.coins + 1 }));
    };

    dockingSystem.onDockingPossible = (available) => {
      setGameState(prev => ({ ...prev, isDockingAvailable: available }));
    };

    dockingSystem.onDockingComplete = () => {
      setGameState(prev => ({ 
        ...prev, 
        securedCoins: prev.securedCoins + prev.coins,
        coins: 0 
      }));
    };

    engine.start();

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [screen]);

  const handleMove = (direction, active) => {
    const input = engineRef.current?.getSystem('input');
    if (!input) return;
    
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    };
    
    input.keys[keyMap[direction]] = active;
  };

  const handleActionA = () => {
    const laserSystem = engineRef.current?.getSystem('lasers');
    const player = engineRef.current?.systems.get('player'); // Note: player isn't a system yet in my impl, but I can fix that
    // For now, just trigger space key
    const input = engineRef.current?.getSystem('input');
    if (input) input.keys['Space'] = true;
    setTimeout(() => { if (input) input.keys['Space'] = false; }, 100);
  };

  const handleActionB = () => {
    // Barrel roll?
    const input = engineRef.current?.getSystem('input');
    if (input) {
      // Simulate double tap or just trigger roll
      // For now, let's just say B is a special action
    }
  };

  const handleStart = () => {
    if (engineRef.current) {
      const paused = engineRef.current.togglePause();
      setGameState(prev => ({ ...prev, isPaused: paused }));
    }
  };

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

  if (screen === 'menu') {
    return (
      <div className="w-full h-screen flex flex-col font-mono overflow-hidden relative" style={{ background: '#000' }}>
        <div className="absolute inset-0 z-0">
          <Galaxy mouseRepulsion={true} mouseInteraction={true} density={1.2} speed={0.8} />
        </div>
        <div className="flex justify-between items-start p-5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-lime-400/30 bg-black/40">
              <SquareLogo />
            </div>
            <div className="flex flex-col">
              <span className="text-lime-400 text-xs md:text-sm font-bold tracking-widest uppercase">GORBOY</span>
              <span className="text-lime-400/60 text-[10px] md:text-xs tracking-tighter">OFFICIAL GAME</span>
            </div>
          </div>
          <MetallicButton text="CONNECT" onClick={() => alert('Connect wallet!')} className="w-28 md:w-36" />
        </div>
        <div className="flex-1 relative flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
        <div className="flex justify-center p-8 z-10">
          <MetallicButton text="ENTER" onClick={() => setScreen('game')} className="w-40 md:w-52" />
        </div>
      </div>
    );
  }

  if (screen === 'game') {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        <GameUI 
          coins={gameState.coins}
          securedCoins={gameState.securedCoins}
          isDockingAvailable={gameState.isDockingAvailable}
          onMove={handleMove}
          onActionA={handleActionA}
          onActionB={handleActionB}
          onStart={handleStart}
          onSelect={() => {}}
        />

        {gameState.isPaused && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="text-lime-400 text-4xl font-mono animate-pulse">PAUSED</div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
