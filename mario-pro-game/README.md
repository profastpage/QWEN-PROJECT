# Mario Pro Game

A professional Mario Bros-style platformer game built with modern JavaScript and Webpack.

## Project Structure

```
mario-pro-game/
├── src/
│   ├── index.js          # Main game loop and Game class
│   ├── entities/
│   │   ├── Player.js     # Player character with physics and animation
│   │   ├── Enemy.js      # Enemy (Goomba-like) characters
│   │   ├── Coin.js       # Collectible coins
│   │   └── Flag.js       # Victory flag at end of level
│   └── utils/
│       └── helpers.js    # Utility functions and constants
├── public/
│   └── index.html        # HTML template
├── build/                 # Production build output
├── package.json          # Project dependencies and scripts
└── webpack.config.js     # Webpack configuration
```

## Features

- **Side-scrolling platformer** with camera following the player
- **Physics system** with gravity, friction, and collision detection
- **Player mechanics**:
  - Run left/right with arrow keys or A/D
  - Jump with Space, W, or Up arrow
  - Stomp enemies to defeat them
  - Collect coins for points
  - 3 lives system
- **Enemies** that patrol platforms and can be defeated by jumping on them
- **Collectibles** (coins) with spinning animation
- **Victory condition** - reach the flag at the end of the level
- **Animated graphics** for all game elements
- **Parallax scrolling** background clouds

## Installation & Running

### Development Mode

```bash
cd mario-pro-game
npm install
npm run dev
```

This will start a development server with hot reloading at `http://localhost:8080`

### Production Build

```bash
npm run build
```

This creates optimized production files in the `build/` directory. Open `build/index.html` in a browser to play.

### Start Server

```bash
npm start
```

## Controls

- **← →** or **A/D**: Move left/right
- **SPACE** or **↑** or **W**: Jump
- **R**: Restart game (when game over or victory)

## Gameplay

1. Navigate through the level by running and jumping across platforms
2. Collect coins for points (+50 each)
3. Avoid or stomp on enemies (jump on top to defeat them)
4. Reach the flag at the end of the level to win
5. Don't fall into pits or run out of lives!

## Technical Details

- Built with vanilla JavaScript (ES6+)
- Uses Webpack for bundling and development server
- Canvas API for rendering
- RequestAnimationFrame for smooth 60fps gameplay
- Modular architecture with separate entity classes
- Collision detection using AABB (Axis-Aligned Bounding Box)

## License

MIT
