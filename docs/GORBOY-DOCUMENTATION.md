# GORBOY Game UI Documentation

## Overview

GORBOY is a retro-styled game interface inspired by the Nintendo Game Boy, featuring a cyberpunk/synthwave aesthetic with a signature green-on-black terminal look. The UI system consists of multiple interconnected screens designed for both desktop and mobile play.

---

## Table of Contents

1. [Design System](#design-system)
2. [Screen Inventory](#screen-inventory)
3. [Navigation Flow](#navigation-flow)
4. [Component Library](#component-library)
5. [Animation Reference](#animation-reference)
6. [Implementation Guide](#implementation-guide)
7. [File Structure](#file-structure)

---

## Design System

### Color Palette

#### Primary Theme (Default - Green/Cyber)
```css
--primary:          #00ff88    /* Main accent, buttons, borders */
--primary-dark:     #00aa55    /* Secondary text, inactive states */
--primary-glow:     rgba(0,255,136,0.5)  /* Glow effects */
--background-dark:  #0a0a0a    /* Base background */
--background-mid:   #0a1a0f    /* Gradient midpoint */
--background-light: #0f2a1a    /* Gradient endpoint */
--terminal-bg:      rgba(0,20,10,0.85)   /* Panel backgrounds */
--text-dark:        #001a0a    /* Text on bright backgrounds */
```

#### Game Over Theme (Red/Danger)
```css
--danger:           #ff0040    /* Main accent */
--danger-light:     #ff6b6b    /* Secondary text */
--danger-glow:      rgba(255,0,64,0.5)   /* Glow effects */
--background-dark:  #0a0a0a    /* Base background */
--background-mid:   #1a0a0a    /* Gradient midpoint */
--background-light: #200a0a    /* Gradient endpoint */
--terminal-bg:      rgba(20,5,5,0.9)     /* Panel backgrounds */
```

#### Special Accent Colors
```css
--gold:    #ffd700    /* 1st place, highlights */
--silver:  #c0c0c0    /* 2nd place */
--bronze:  #cd7f32    /* 3rd place */
--btn-a:   #ff6b6b    /* Mobile A button */
--btn-b:   #ffd93d    /* Mobile B button */
```

### Typography

#### Font Stack
```css
/* Primary - Pixel/Retro headers */
font-family: "Press Start 2P", monospace;

/* Secondary - Terminal text, larger readable text */
font-family: "VT323", monospace;

/* Tertiary - Labels */
font-family: "Silkscreen", monospace;
```

#### Font Import
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&display=swap');
```

#### Size Scale
| Element | Font | Size |
|---------|------|------|
| Page Title | Press Start 2P | clamp(28px, 7vw, 48px) |
| Section Header | Press Start 2P | 8-10px |
| Terminal Text | VT323 | 18-22px |
| Labels | VT323 | 14-16px |
| Buttons | Press Start 2P | 10px |
| Footer | VT323 | 12px |

### Spacing

- Page padding: `30-40px 20px`
- Panel padding: `15-20px`
- Element gap: `15-20px`
- Border radius: `0` (sharp edges for retro feel)
- Max content width: `500-600px`

---

## Screen Inventory

### 1. Main Menu (`gorboy-cyber-3d.jsx`)
**Purpose:** Primary entry point / title screen

**Elements:**
- GORBOY title with glow animation
- "SYSTEM://NINTENDO" header label
- "DOT MATRIX • STEREO SOUND" subtitle
- Terminal window with boot sequence
- START / SELECT buttons
- PWR/SIG status indicators
- 3D animated perspective grid

**Navigation:**
- START → Game Start (not implemented)
- SELECT → Settings or other menu

---

### 2. High Scores (`gorboy-highscores.jsx`)
**Purpose:** Leaderboard display

**Elements:**
- Top 10 player rankings
- Rank, Name, Score, Level columns
- Gold crown for #1 with pulse animation
- Medal colors for top 3
- Expandable player details on click
- Animated row entry on load

**Data Structure:**
```javascript
{
  rank: Number,
  name: String (3 chars),
  score: Number,
  level: Number,
  date: String ("MM.DD.YY")
}
```

**Navigation:**
- PLAY → Game Start
- BACK → Main Menu

---

### 3. Settings (`gorboy-settings.jsx`)
**Purpose:** Game configuration

**Sections:**
| Section | Controls |
|---------|----------|
| AUDIO | Master Volume (slider) |
| DISPLAY | Brightness, Contrast (sliders), Color Mode (select), Scanlines (toggle) |
| GAMEPLAY | Difficulty (select), Screen Shake, Rumble, Auto-Save (toggles) |
| SYSTEM | Language (select), Version display |

**State Structure:**
```javascript
{
  volume: 0-100,
  brightness: 0-100,
  contrast: 0-100,
  scanlines: Boolean,
  screenShake: Boolean,
  colorMode: 'classic' | 'neon' | 'mono',
  difficulty: 'easy' | 'normal' | 'hard',
  language: 'en' | 'jp' | 'de',
  autoSave: Boolean,
  rumble: Boolean
}
```

**Navigation:**
- SAVE → Save & return to previous screen
- RESET → Reset to defaults
- BACK → Main Menu (discard changes)

---

### 4. Controls (`gorboy-controls.jsx`)
**Purpose:** Input configuration display

**Tabs:**
1. **KEYBOARD**
   - WASD visual display
   - Arrow keys visual display
   - Action mappings table

2. **TOUCH/MOBILE**
   - Virtual D-pad layout
   - A/B button layout (diagonal, Game Boy style)
   - START/SELECT buttons
   - Touch mappings table

**Keyboard Mappings:**
| Keys | Action |
|------|--------|
| W/A/S/D or Arrows | Movement |
| Z, J | Confirm / Action |
| X, K | Cancel / Back |
| Enter | Start / Pause |
| Shift | Select |
| Space | Jump / Special |
| Esc | Menu |

**Navigation:**
- REMAP → Key remapping mode (not implemented)
- RESET → Reset to defaults
- BACK → Main Menu

---

### 5. Game Over (`gorboy-gameover.jsx`)
**Purpose:** Death/failure screen

**Elements:**
- Skull icon with pulse
- "GAME OVER" title with glitch effect
- Final stats panel (animated entry)
- "NEW HIGH SCORE" banner (conditional)
- "INSERT COIN TO CONTINUE" blinking text
- Countdown timer
- Screen flicker effect

**Stats Displayed:**
- Score, Level, Time, Enemies, Accuracy, Max Combo

**Navigation:**
- RETRY → Restart game
- SCORES → High Scores screen
- QUIT → Main Menu

### 7. How To Play (`gorboy-howtoplay.jsx`)
**Purpose:** Tutorial / instructions screen with animated typewriter effect

**Elements:**
- Terminal window with streaming text animation
- Typewriter cursor effect
- Scrollable content area
- Skip/Replay functionality
- Placeholder instructions for game mechanics

**Instruction Sections:**
| Section | Content |
|---------|---------|
| OBJECTIVE | Mission goals and win conditions |
| MOVEMENT | Control scheme explanation |
| COMBAT | Attack and defense mechanics |
| POWER-UPS | Item descriptions and effects |
| TIPS | Pro tips and strategies |

**Animation System:**
- Character-by-character typewriter effect
- Configurable typing speeds (headers: 30ms, text: 15ms)
- Pause instructions for dramatic effect
- Blinking cursor during typing
- Blinking "PRESS START" prompt when complete

**Navigation:**
- SKIP → Skip to end of animation
- REPLAY → Restart animation from beginning
- START → Begin game
- BACK → Return to Main Menu

---

### 8. Background / Grid (`gorboy-grid.jsx`)
**Purpose:** Standalone animated background / screensaver / loading screen

**Elements:**
- 3D animated perspective grid
- Synthwave sun with horizontal line effect
- Starfield background
- Optional GORBOY wireframe image
- Configurable control panel

**Configurable Options:**
| Option | Values |
|--------|--------|
| Grid Color | Cyber Green, Danger Red, Ice Blue, Neon Pink, Amber, White |
| Speed | 0.5s - 5s (animation duration) |
| Show Image | On/Off |
| Scanlines | On/Off |

**Use Cases:**
- Loading screen
- Screensaver mode
- Menu background
- Video/stream overlay

**Navigation:**
- SHOW/HIDE button toggles control panel

---

## Navigation Flow

```
                         ┌─────────────┐
                         │  MAIN MENU  │
                         │  (Title)    │
                         └──────┬──────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │   SETTINGS  │      │    GAME     │      │ HIGH SCORES │
   │             │      │   (Play)    │      │             │
   └─────────────┘      └──────┬──────┘      └─────────────┘
          │                    │                     ▲
          │             ┌──────┴──────┐              │
          │             │             │              │
          │             ▼             ▼              │
          │      ┌───────────┐ ┌───────────┐        │
          │      │  CONTROLS │ │ GAME OVER │────────┘
          │      │           │ │           │
          │      └───────────┘ └───────────┘
          │             │             │
          └─────────────┴──────┬──────┘
                               │
                               ▼
                        [BACK TO MENU]
```

---

## Component Library

### Shared Components

#### 1. Perspective Grid Background
```jsx
<div className="perspective-grid-container">
  <div className="perspective-grid" />
</div>
<div className="horizon-glow" />
```

#### 2. Corner Decorations
```jsx
{/* Top-left */}
<div style={{
  position: 'absolute',
  top: '20px',
  left: '20px',
  width: '30px',
  height: '30px',
  borderTop: '2px solid #00ff88',
  borderLeft: '2px solid #00ff88',
  opacity: 0.5,
}} />

{/* Bottom-right */}
<div style={{
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  width: '30px',
  height: '30px',
  borderBottom: '2px solid #00ff88',
  borderRight: '2px solid #00ff88',
  opacity: 0.5,
}} />
```

#### 3. Action Button
```jsx
<button
  className="pixel-btn"
  style={{
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '10px',
    padding: '12px 20px',
    backgroundColor: isPrimary ? '#00ff88' : 'transparent',
    color: isPrimary ? '#001a0a' : '#00ff88',
    border: '2px solid #00ff88',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0,255,136,0.3)',
  }}
>
  [{label}]
</button>
```

#### 4. Panel/Terminal Window
```jsx
<div style={{
  backgroundColor: 'rgba(0,20,10,0.85)',
  border: '2px solid #00ff88',
  width: '100%',
  boxShadow: '0 0 30px rgba(0,255,136,0.2), inset 0 0 60px rgba(0,0,0,0.5)',
}}>
  {/* Header */}
  <div style={{
    backgroundColor: '#00ff88',
    padding: '8px 15px',
  }}>
    <span style={{
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#001a0a',
    }}>
      PANEL_TITLE
    </span>
  </div>
  
  {/* Content */}
  <div style={{ padding: '15px 20px' }}>
    {children}
  </div>
</div>
```

#### 5. Background Image (with blend mode fix)
```jsx
<div style={{
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  opacity: 0.35,
  mixBlendMode: 'lighten',
}}>
  <img 
    src={imageSrc}
    alt="GORBOY"
    style={{ width: '100%', height: 'auto', mixBlendMode: 'lighten' }}
  />
</div>
```

#### 6. Footer
```jsx
<div style={{
  fontFamily: '"VT323", monospace',
  fontSize: '12px',
  color: '#00aa55',
  letterSpacing: '3px',
  textAlign: 'center',
}}>
  SYS.ID: GOR-8BIT-2025 | STATUS: ONLINE
</div>
```

---

## Animation Reference

### CSS Keyframes

```css
/* Blinking cursor/text */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Glow pulsing (green) */
@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor; }
  50% { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
}

/* Glow pulsing (red - game over) */
@keyframes glowRed {
  0%, 100% { text-shadow: 0 0 10px #ff0040, 0 0 20px #ff0040; }
  50% { text-shadow: 0 0 20px #ff0040, 0 0 40px #ff0040, 0 0 60px #ff0040; }
}

/* Gentle floating */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 3D grid movement */
@keyframes gridMove {
  0% { transform: rotateX(60deg) translateY(0); }
  100% { transform: rotateX(60deg) translateY(50px); }
}

/* Content fade in */
@keyframes fadeSlideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Glitch effect */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(3px, -3px); }
  60% { transform: translate(-3px, -3px); }
  80% { transform: translate(3px, 3px); }
  100% { transform: translate(0); }
}

/* Opacity pulse */
@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Rotation (for gear icons) */
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## Implementation Guide

### Setting Up Navigation (React Router Example)

```jsx
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Import screens
import MainMenu from './gorboy-cyber-3d';
import HighScores from './gorboy-highscores';
import Settings from './gorboy-settings';
import Controls from './gorboy-controls';
import GameOver from './gorboy-gameover';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/scores" element={<HighScores />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Adding Navigation to Buttons

```jsx
import { useNavigate } from 'react-router-dom';

function NavigationButton({ to, label, primary = false }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(to)}
      className="pixel-btn"
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        padding: '12px 20px',
        backgroundColor: primary ? '#00ff88' : 'transparent',
        color: primary ? '#001a0a' : '#00ff88',
        border: '2px solid #00ff88',
        cursor: 'pointer',
      }}
    >
      [{label}]
    </button>
  );
}

// Usage
<NavigationButton to="/settings" label="SETTINGS" />
<NavigationButton to="/scores" label="SCORES" />
<NavigationButton to="/" label="BACK" />
```

### State Management (Context Example)

```jsx
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [settings, setSettings] = useState({
    volume: 80,
    brightness: 70,
    contrast: 50,
    scanlines: true,
    screenShake: true,
    colorMode: 'classic',
    difficulty: 'normal',
    language: 'en',
    autoSave: true,
    rumble: true,
  });

  const [gameState, setGameState] = useState({
    currentScore: 0,
    highScores: [],
    isPlaying: false,
  });

  return (
    <GameContext.Provider value={{
      settings,
      setSettings,
      gameState,
      setGameState,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
```

### Connecting Game Over to High Scores

```jsx
// In GameOver component
import { useGame } from './GameContext';
import { useNavigate } from 'react-router-dom';

function GameOver() {
  const { gameState, setGameState } = useGame();
  const navigate = useNavigate();
  
  const handleRetry = () => {
    setGameState(prev => ({
      ...prev,
      currentScore: 0,
      isPlaying: true,
    }));
    navigate('/game');
  };
  
  const handleViewScores = () => {
    navigate('/scores');
  };
  
  const handleQuit = () => {
    navigate('/');
  };
  
  // Check for new high score
  const isNewHighScore = gameState.currentScore > 
    Math.min(...gameState.highScores.map(s => s.score));
  
  // ...
}
```

### Persisting High Scores (LocalStorage)

```jsx
// Load scores on mount
useEffect(() => {
  const saved = localStorage.getItem('gorboy-highscores');
  if (saved) {
    setHighScores(JSON.parse(saved));
  }
}, []);

// Save new score
const saveScore = (newScore) => {
  const updated = [...highScores, newScore]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  setHighScores(updated);
  localStorage.setItem('gorboy-highscores', JSON.stringify(updated));
};
```

### Persisting Settings

```jsx
// Load settings on mount
useEffect(() => {
  const saved = localStorage.getItem('gorboy-settings');
  if (saved) {
    setSettings(JSON.parse(saved));
  }
}, []);

// Save settings
const saveSettings = () => {
  localStorage.setItem('gorboy-settings', JSON.stringify(settings));
};

// Reset to defaults
const resetSettings = () => {
  const defaults = {
    volume: 80,
    brightness: 70,
    contrast: 50,
    scanlines: true,
    screenShake: true,
    colorMode: 'classic',
    difficulty: 'normal',
    language: 'en',
    autoSave: true,
    rumble: true,
  };
  setSettings(defaults);
};
```

---

## File Structure

```
gorboy/
├── src/
│   ├── screens/
│   │   ├── MainMenu.jsx          # gorboy-cyber-3d.jsx
│   │   ├── HighScores.jsx        # gorboy-highscores.jsx
│   │   ├── Settings.jsx          # gorboy-settings.jsx
│   │   ├── Controls.jsx          # gorboy-controls.jsx
│   │   ├── GameOver.jsx          # gorboy-gameover.jsx
│   │   ├── HowToPlay.jsx         # gorboy-howtoplay.jsx
│   │   └── Background.jsx        # gorboy-grid.jsx
│   │
│   ├── components/
│   │   ├── PerspectiveGrid.jsx   # 3D animated background
│   │   ├── Panel.jsx             # Terminal-style container
│   │   ├── Button.jsx            # Pixel button component
│   │   ├── Slider.jsx            # Settings slider
│   │   ├── Toggle.jsx            # On/off toggle
│   │   ├── Select.jsx            # Multi-option select
│   │   ├── KeyCap.jsx            # Keyboard key display
│   │   └── CornerDecorations.jsx # Corner bracket decorations
│   │
│   ├── context/
│   │   └── GameContext.jsx       # Global state management
│   │
│   ├── styles/
│   │   ├── animations.css        # Shared keyframe animations
│   │   ├── theme.css             # CSS variables / design tokens
│   │   └── scanlines.css         # Scanline overlay effect
│   │
│   ├── assets/
│   │   └── gorboy-wireframe.webp # Background image
│   │
│   ├── App.jsx                   # Router setup
│   └── index.jsx                 # Entry point
│
├── public/
│   └── index.html
│
├── GORBOY-DOCUMENTATION.md       # This file
└── package.json
```

---

## Assets Required

| Asset | Format | Usage |
|-------|--------|-------|
| GORBOY Wireframe | .webp | Background image (all screens) |
| Google Fonts | URL import | Press Start 2P, VT323, Silkscreen |

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS `mix-blend-mode: lighten` required for background transparency
- CSS `perspective` and 3D transforms for grid animation
- CSS `mask-image` for grid fade effect

---

## Future Enhancements

1. **Sound Effects** - Add retro beeps/boops for button interactions
2. **Music** - Chiptune background music with volume control
3. **Achievements** - Achievement/badge system on High Scores
4. **Player Profiles** - Name entry for high scores
5. **Themes** - Additional color themes (amber CRT, blue, etc.)
6. **Transitions** - Screen transition animations
7. **Gamepad Support** - Controller input on Controls screen
8. **Online Leaderboards** - Backend integration for global scores

---

## Credits

- Design System: GORBOY Cyber Aesthetic
- Typography: Google Fonts (Press Start 2P, VT323, Silkscreen)
- Inspiration: Nintendo Game Boy, Synthwave, Terminal UIs

---

*Documentation Version: 1.0*
*Last Updated: December 2025*
