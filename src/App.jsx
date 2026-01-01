import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

// Screen Components
import MainMenu from './screens/MainMenu';
import HighScores from './screens/HighScores';
import Settings from './screens/Settings';
import Controls from './screens/Controls';
import GameOver from './screens/GameOver';
import HowToPlay from './screens/HowToPlay';
import Background from './screens/Background';

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/highscores" element={<HighScores />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/gameover" element={<GameOver />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route path="/background" element={<Background />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
