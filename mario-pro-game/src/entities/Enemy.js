import { CONSTANTS, checkCollision } from '../utils/helpers.js';

export class Enemy {
  constructor(x, y, patrolDistance = 100) {
    this.startX = x;
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.velX = -CONSTANTS.ENEMY_SPEED;
    this.velY = 0;
    this.patrolDistance = patrolDistance;
    this.isDead = false;
    this.deathTimer = 0;
    
    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(platforms) {
    if (this.isDead) {
      this.deathTimer--;
      return;
    }

    // Apply gravity
    this.velY += CONSTANTS.GRAVITY;

    // Move
    this.x += this.velX;
    this.y += this.velY;

    // Patrol logic
    if (this.x <= this.startX - this.patrolDistance || this.x >= this.startX + this.patrolDistance) {
      this.velX *= -1;
    }

    // Platform collision
    let grounded = false;
    for (const platform of platforms) {
      if (checkCollision(this, platform)) {
        if (this.velY > 0 && this.y + this.height - this.velY <= platform.y) {
          this.y = platform.y - this.height;
          this.velY = 0;
          grounded = true;
        } else if (this.velY < 0 && this.y - this.velY >= platform.y + platform.height) {
          this.y = platform.y + platform.height;
          this.velY = 0;
        } else {
          if (this.velX > 0) {
            this.x = platform.x - this.width;
            this.velX *= -1;
          } else if (this.velX < 0) {
            this.x = platform.x + platform.width;
            this.velX *= -1;
          }
        }
      }
    }

    // Fall off world
    if (this.y > 600) {
      this.die();
    }

    // Animation
    if (grounded) {
      this.animTimer++;
      if (this.animTimer > 10) {
        this.animFrame = (this.animFrame + 1) % 2;
        this.animTimer = 0;
      }
    }
  }

  die() {
    if (!this.isDead) {
      this.isDead = true;
      this.deathTimer = 30;
    }
  }

  draw(ctx, cameraX) {
    const screenX = this.x - cameraX;
    
    if (screenX < -50 || screenX > 850) return;

    if (this.isDead) {
      // Squished
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(screenX, this.y + this.height - 8, this.width, 8);
      return;
    }

    // Body (brown mushroom-like)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.width / 2, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(screenX, this.y + this.height / 2 - 4, this.width, this.height / 2);

    // Cap
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.arc(screenX + this.width / 2, this.y + this.height / 2, this.width / 2 + 2, Math.PI, 0);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    const eyeOffset = this.velX > 0 ? 4 : -4;
    ctx.fillRect(screenX + this.width / 2 - 8 + eyeOffset, this.y + 10, 5, 6);
    ctx.fillRect(screenX + this.width / 2 + 3 + eyeOffset, this.y + 10, 5, 6);

    // Eyebrows (angry)
    ctx.beginPath();
    ctx.moveTo(screenX + this.width / 2 - 10 + eyeOffset, this.y + 8);
    ctx.lineTo(screenX + this.width / 2 - 3 + eyeOffset, this.y + 11);
    ctx.moveTo(screenX + this.width / 2 + 10 + eyeOffset, this.y + 8);
    ctx.lineTo(screenX + this.width / 2 + 3 + eyeOffset, this.y + 11);
    ctx.stroke();

    // Feet animation
    ctx.fillStyle = '#000';
    if (this.animFrame === 0) {
      ctx.fillRect(screenX + 2, this.y + this.height - 4, 8, 4);
      ctx.fillRect(screenX + this.width - 10, this.y + this.height - 4, 8, 4);
    } else {
      ctx.fillRect(screenX, this.y + this.height - 4, 8, 4);
      ctx.fillRect(screenX + this.width - 8, this.y + this.height - 4, 8, 4);
    }
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
