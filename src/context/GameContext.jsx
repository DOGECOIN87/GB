import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Settings State
  const [settings, setSettings] = useState({
    musicVolume: 80,
    sfxVolume: 100,
    screenShake: true,
    particles: true,
    scanlines: true,
    difficulty: 'normal',
    gridColor: '#00ff88',
    gridSpeed: 2,
  });

  // High Scores State
  const [highScores, setHighScores] = useState([
    { rank: 1, name: 'GOR', score: 999999, date: '2024.12.01' },
    { rank: 2, name: 'BOY', score: 850000, date: '2024.11.28' },
    { rank: 3, name: 'AAA', score: 720000, date: '2024.11.25' },
    { rank: 4, name: 'ZZZ', score: 650000, date: '2024.11.20' },
    { rank: 5, name: 'XYZ', score: 580000, date: '2024.11.15' },
  ]);

  // Game State
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    score: 0,
    level: 1,
    lives: 3,
  });

  // Update Settings
  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Add High Score
  const addHighScore = useCallback((name, score) => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    const newScore = { name, score, date };

    setHighScores(prev => {
      const updated = [...prev, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      return updated;
    });
  }, []);

  // Game Controls
  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      level: 1,
      lives: 3,
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const updateScore = useCallback((points) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  }, []);

  const value = {
    // State
    settings,
    highScores,
    gameState,

    // Actions
    updateSettings,
    addHighScore,
    startGame,
    pauseGame,
    endGame,
    updateScore,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
