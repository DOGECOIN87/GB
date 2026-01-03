# GORBOY Game UI

A retro-styled game interface inspired by the Nintendo Game Boy, featuring a cyberpunk/synthwave aesthetic with a signature green-on-black terminal look.

## Project Structure

```
gorboy/
├── src/
│   ├── screens/           # Main UI screens
│   │   ├── MainMenu.jsx       # Title screen with 3D grid animation
│   │   ├── MainMenuAlt.jsx    # Alternative main menu design
│   │   ├── HighScores.jsx     # Leaderboard display
│   │   ├── Settings.jsx       # Game configuration
│   │   ├── Controls.jsx       # Input configuration
│   │   ├── GameOver.jsx       # Death/failure screen
│   │   ├── HowToPlay.jsx      # Tutorial with typewriter effect
│   │   ├── Background.jsx     # Animated background/grid
│   │   └── BackgroundAlt.jsx  # Alternative background design
│   │
│   ├── components/        # Reusable UI components (to be extracted)
│   ├── context/           # Global state management
│   ├── styles/            # CSS animations and themes
│   └── assets/            # Images and static assets
│
├── docs/
│   ├── GORBOY-DOCUMENTATION.md   # Full design system documentation
│   └── gorboy-mockups.jsx        # UI mockups and prototypes
│
└── public/                # Static files
```

## Features

- Retro Game Boy-inspired UI design
- Cyberpunk/synthwave aesthetic
- 3D animated perspective grid backgrounds
- Responsive design for desktop and mobile
- Multiple screen components ready for integration

## Design System

### Color Palette
- Primary: `#00ff88` (Cyber Green)
- Background: `#0a0a0a` to `#0f2a1a`
- Game Over theme: `#ff0040` (Danger Red)

### Typography
- Headers: Press Start 2P
- Terminal text: VT323
- Labels: Silkscreen

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Import the required Google Fonts:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&display=swap');
   ```

3. Import and use the screen components in your React app

## Documentation

For detailed design specifications, component library, and implementation guides, see [docs/GORBOY-DOCUMENTATION.md](docs/GORBOY-DOCUMENTATION.md).

## License

All rights reserved.
