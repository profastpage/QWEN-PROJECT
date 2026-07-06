import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Coin } from './entities/Coin.js';
import { Flag } from './entities/Flag.js';
import { CONSTANTS, checkCollision } from './utils/helpers.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    this.cameraX = 0;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.victory = false;
    
    this.input = {
      keys: {}
    };
    
    this.setupInput();
    this.initLevel();
    
    this.lastTime = 0;
    this.gameLoop = this.gameLoop.bind(this);
    requestAnimationFrame(this.gameLoop);
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.input.keys[e.code] = true;
      
      // Prevent scrolling with space
      if (e.code === 'Space') {
        e.preventDefault();
      }
      
      // Restart on R
      if (e.code === 'KeyR' && (this.gameOver || this.victory)) {
        this.restart();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.input.keys[e.code] = false;
    });
  }

  initLevel() {
    // Create player
    this.player = new Player(100, 400);
    
    // Create platforms (ground and floating platforms)
    this.platforms = [
      // Ground - extended for longer level
      { x: 0, y: 550, width: 2000, height: 50 },
      
      // Floating platforms
      { x: 300, y: 450, width: 150, height: 20 },
      { x: 500, y: 380, width: 150, height: 20 },
      { x: 700, y: 320, width: 150, height: 20 },
      { x: 900, y: 400, width: 150, height: 20 },
      { x: 1100, y: 350, width: 150, height: 20 },
      { x: 1300, y: 280, width: 150, height: 20 },
      { x: 1500, y: 450, width: 200, height: 20 },
      
      // Steps before flag
      { x: 1750, y: 500, width: 50, height: 50 },
      { x: 1800, y: 450, width: 50, height: 100 },
      { x: 1850, y: 400, width: 50, height: 150 },
    ];
    
    // Create enemies
    this.enemies = [
      new Enemy(400, 522, 80),
      new Enemy(800, 522, 100),
      new Enemy(1200, 522, 80),
      new Enemy(950, 372, 60),
      new Enemy(1350, 252, 50),
    ];
    
    // Create coins
    this.coins = [
      new Coin(350, 410),
      new Coin(400, 410),
      new Coin(450, 410),
      new Coin(550, 340),
      new Coin(600, 340),
      new Coin(650, 340),
      new Coin(750, 280),
      new Coin(800, 280),
      new Coin(850, 280),
      new Coin(950, 360),
      new Coin(1000, 360),
      new Coin(1150, 310),
      new Coin(1200, 310),
      new Coin(1350, 240),
      new Coin(1400, 240),
      new Coin(1550, 410),
      new Coin(1600, 410),
      new Coin(1650, 410),
    ];
    
    // Create flag at end of level
    this.flag = new Flag(1950, 250);
    
    // Level length
    this.levelWidth = 2000;
  }

  update(deltaTime) {
    if (this.gameOver || this.victory) return;
    
    // Update player
    this.player.update(this.input, this.platforms, this.enemies);
    
    // Check if player fell off
    if (this.player.y > 600) {
      this.handleDeath();
    }
    
    // Update enemies
    this.enemies.forEach(enemy => enemy.update(this.platforms));
    
    // Update coins
    this.coins.forEach(coin => {
      coin.update();
      if (!coin.collected && checkCollision(this.player.getBounds(), coin.getBounds())) {
        this.score += coin.collect();
      }
    });
    
    // Update flag
    this.flag.update();
    if (checkCollision(this.player.getBounds(), this.flag.getBounds())) {
      this.flag.reach();
      this.victory = true;
    }
    
    // Update camera to follow player
    this.cameraX = this.player.x - 300;
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.levelWidth - 800));
  }

  handleDeath() {
    this.lives--;
    if (this.lives <= 0) {
      this.gameOver = true;
    } else {
      this.player.respawn(100, 400);
    }
  }

  restart() {
    this.cameraX = 0;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.victory = false;
    this.initLevel();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#5c94fc';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background decorations (clouds)
    this.drawClouds();
    
    // Draw platforms
    this.platforms.forEach(platform => {
      const screenX = platform.x - this.cameraX;
      if (screenX < -100 || screenX > 900) return;
      
      // Grass top
      this.ctx.fillStyle = '#00AA00';
      this.ctx.fillRect(screenX, platform.y, platform.width, 10);
      
      // Dirt below
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(screenX, platform.y + 10, platform.width, platform.height - 10);
      
      // Decorative details
      this.ctx.fillStyle = '#654321';
      for (let i = 0; i < platform.width; i += 30) {
        this.ctx.fillRect(screenX + i + 5, platform.y + 15, 10, 10);
      }
    });
    
    // Draw coins
    this.coins.forEach(coin => coin.draw(this.ctx, this.cameraX));
    
    // Draw enemies
    this.enemies.forEach(enemy => enemy.draw(this.ctx, this.cameraX));
    
    // Draw flag
    this.flag.draw(this.ctx, this.cameraX);
    
    // Draw player
    this.player.draw(this.ctx, this.cameraX);
    
    // Draw UI
    this.drawUI();
    
    // Draw game over or victory screen
    if (this.gameOver) {
      this.drawGameOver();
    } else if (this.victory) {
      this.drawVictory();
    }
  }

  drawClouds() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Static clouds in background
    const cloudPositions = [
      { x: 100, y: 80, size: 40 },
      { x: 400, y: 120, size: 50 },
      { x: 700, y: 60, size: 45 },
      { x: 1000, y: 100, size: 55 },
      { x: 1300, y: 70, size: 40 },
      { x: 1600, y: 110, size: 50 },
    ];
    
    cloudPositions.forEach(cloud => {
      const screenX = cloud.x - this.cameraX * 0.5; // Parallax effect
      if (screenX < -100 || screenX > 900) return;
      
      this.ctx.beginPath();
      this.ctx.arc(screenX, cloud.y, cloud.size, 0, Math.PI * 2);
      this.ctx.arc(screenX + cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
      this.ctx.arc(screenX + cloud.size * 1.5, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawUI() {
    // Score
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 20px "Courier New", monospace';
    this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    
    // Lives
    this.ctx.fillText(`LIVES: ${this.lives}`, 20, 60);
    
    // Draw life icons
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillStyle = '#e70000';
      this.ctx.fillRect(120 + i * 25, 45, 18, 18);
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = 'bold 48px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
    
    this.ctx.font = '24px "Courier New", monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
    
    this.ctx.textAlign = 'left';
  }

  drawVictory() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 48px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2 - 30);
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '24px "Courier New", monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    this.ctx.fillText('Press R to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 60);
    
    this.ctx.textAlign = 'left';
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.draw();
    
    requestAnimationFrame(this.gameLoop);
  }
}

// Start the game when the page loads
window.addEventListener('load', () => {
  new Game();
});
