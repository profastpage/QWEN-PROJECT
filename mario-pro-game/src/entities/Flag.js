import { CONSTANTS } from '../utils/helpers.js';

export class Flag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 300;
    this.reached = false;
    
    // Flag animation
    this.waveOffset = 0;
    this.waveTimer = 0;
  }

  update() {
    if (this.reached) return;
    
    this.waveTimer++;
    if (this.waveTimer > 5) {
      this.waveOffset = Math.sin(this.waveTimer * 0.1) * 3;
      this.waveTimer = 0;
    }
  }

  reach() {
    this.reached = true;
  }

  draw(ctx, cameraX) {
    const screenX = this.x - cameraX;
    
    if (screenX < -50 || screenX > 850) return;

    // Pole
    ctx.fillStyle = '#228B22';
    ctx.fillRect(screenX, this.y, this.width, this.height);
    
    // Ball on top
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, this.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Flag
    if (!this.reached) {
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(screenX + this.width, this.y + 20);
      ctx.lineTo(screenX + this.width + 60 + this.waveOffset, this.y + 40);
      ctx.lineTo(screenX + this.width, this.y + 60);
      ctx.closePath();
      ctx.fill();
      
      // Star on flag
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(screenX + this.width + 25 + this.waveOffset / 2, this.y + 40, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Flag at bottom when reached
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(screenX + this.width, this.y + this.height - 60, 60, 40);
    }
    
    // Base
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(screenX - 20, this.y + this.height - 20, 50, 20);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
