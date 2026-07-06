import { CONSTANTS, checkCollision } from '../utils/helpers.js';

export class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 24;
    this.collected = false;
    
    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update() {
    if (this.collected) return;
    
    this.animTimer++;
    if (this.animTimer > 6) {
      this.animFrame = (this.animFrame + 1) % 4;
      this.animTimer = 0;
    }
  }

  collect() {
    if (!this.collected) {
      this.collected = true;
      return 50; // Points
    }
    return 0;
  }

  draw(ctx, cameraX) {
    if (this.collected) return;
    
    const screenX = this.x - cameraX;
    
    if (screenX < -50 || screenX > 850) return;

    // Calculate width based on animation frame for spinning effect
    let width;
    switch(this.animFrame) {
      case 0: width = this.width; break;
      case 1: width = this.width * 0.75; break;
      case 2: width = this.width * 0.3; break;
      case 3: width = this.width * 0.75; break;
      default: width = this.width;
    }
    
    const offsetX = (this.width - width) / 2;

    // Coin body (gold)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(screenX + offsetX, this.y, width, this.height);
    
    // Shine effect
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(screenX + offsetX + 3, this.y + 3, width - 6, 4);
    
    // Inner detail
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(screenX + offsetX + 5, this.y + 10, width - 10, 8);
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
