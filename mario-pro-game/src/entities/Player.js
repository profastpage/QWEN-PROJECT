import { CONSTANTS, checkCollision } from '../utils/helpers.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 32;
    this.velX = 0;
    this.velY = 0;
    this.speed = CONSTANTS.PLAYER_SPEED;
    this.jumpForce = CONSTANTS.PLAYER_JUMP;
    this.grounded = false;
    this.facingRight = true;
    this.isDead = false;
    this.invincible = false;
    this.invincibleTimer = 0;
    
    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(input, platforms, enemies) {
    if (this.isDead) return;

    // Handle input
    if (input.keys['ArrowRight'] || input.keys['KeyD']) {
      this.velX = this.speed;
      this.facingRight = true;
    } else if (input.keys['ArrowLeft'] || input.keys['KeyA']) {
      this.velX = -this.speed;
      this.facingRight = false;
    } else {
      this.velX *= CONSTANTS.FRICTION;
    }

    // Jump
    if ((input.keys['Space'] || input.keys['ArrowUp'] || input.keys['KeyW']) && this.grounded) {
      this.velY = this.jumpForce;
      this.grounded = false;
    }

    // Apply gravity
    this.velY += CONSTANTS.GRAVITY;

    // Update position
    this.x += this.velX;
    this.y += this.velY;

    // Platform collision
    this.grounded = false;
    for (const platform of platforms) {
      if (checkCollision(this, platform)) {
        // Landing on top
        if (this.velY > 0 && this.y + this.height - this.velY <= platform.y) {
          this.y = platform.y - this.height;
          this.velY = 0;
          this.grounded = true;
        }
        // Hitting bottom
        else if (this.velY < 0 && this.y - this.velY >= platform.y + platform.height) {
          this.y = platform.y + platform.height;
          this.velY = 0;
        }
        // Side collision
        else {
          if (this.velX > 0) {
            this.x = platform.x - this.width;
          } else if (this.velX < 0) {
            this.x = platform.x + platform.width;
          }
          this.velX = 0;
        }
      }
    }

    // Enemy collision
    for (const enemy of enemies) {
      if (!enemy.isDead && checkCollision(this, enemy)) {
        // Stomp enemy
        if (this.velY > 0 && this.y + this.height - this.velY <= enemy.y + enemy.height / 2) {
          enemy.die();
          this.velY = -8;
        } else if (!this.invincible) {
          this.die();
        }
      }
    }

    // World bounds
    if (this.x < 0) this.x = 0;
    if (this.y > 600) {
      this.die();
    }

    // Invincibility timer
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Animation
    if (Math.abs(this.velX) > 0.5) {
      this.animTimer++;
      if (this.animTimer > 8) {
        this.animFrame = (this.animFrame + 1) % 4;
        this.animTimer = 0;
      }
    } else {
      this.animFrame = 0;
    }
  }

  die() {
    this.isDead = true;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.isDead = false;
    this.invincible = true;
    this.invincibleTimer = 120;
  }

  draw(ctx, cameraX) {
    if (this.isDead) return;
    
    const screenX = this.x - cameraX;
    
    // Blink when invincible
    if (this.invincible && Math.floor(this.invincibleTimer / 4) % 2 === 0) {
      return;
    }

    // Body (red)
    ctx.fillStyle = '#e70000';
    ctx.fillRect(screenX, this.y, this.width, this.height);

    // Overalls (blue)
    ctx.fillStyle = '#0000e7';
    ctx.fillRect(screenX, this.y + this.height - 14, this.width, 14);

    // Face
    ctx.fillStyle = '#ffcc99';
    const faceX = this.facingRight ? screenX + 16 : screenX + 4;
    ctx.fillRect(faceX, this.y + 4, 10, 10);

    // Hat
    ctx.fillStyle = '#e70000';
    ctx.fillRect(screenX, this.y, this.width, 8);
    const hatBrimX = this.facingRight ? screenX + 14 : screenX;
    ctx.fillRect(hatBrimX, this.y + 4, 14, 4);

    // Eyes
    ctx.fillStyle = '#000';
    const eyeX = this.facingRight ? screenX + 20 : screenX + 4;
    ctx.fillRect(eyeX, this.y + 6, 4, 4);

    // Mustache
    ctx.fillStyle = '#000';
    const mustacheX = this.facingRight ? screenX + 18 : screenX + 6;
    ctx.fillRect(mustacheX, this.y + 10, 8, 3);

    // Legs animation
    ctx.fillStyle = '#0000e7';
    if (this.animFrame === 1 || this.animFrame === 3) {
      ctx.fillRect(screenX + 4, this.y + this.height - 6, 8, 6);
      ctx.fillRect(screenX + 16, this.y + this.height - 6, 8, 6);
    } else if (this.animFrame === 2) {
      ctx.fillRect(screenX + 2, this.y + this.height - 6, 8, 6);
      ctx.fillRect(screenX + 18, this.y + this.height - 6, 8, 6);
    } else {
      ctx.fillRect(screenX + 4, this.y + this.height - 6, 8, 6);
      ctx.fillRect(screenX + 16, this.y + this.height - 6, 8, 6);
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
