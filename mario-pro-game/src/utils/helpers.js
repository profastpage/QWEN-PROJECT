// Game Constants
export const CONSTANTS = {
  GRAVITY: 0.5,
  FRICTION: 0.8,
  PLAYER_SPEED: 5,
  PLAYER_JUMP: -12,
  ENEMY_SPEED: 2,
  TILE_SIZE: 32,
};

// Utility functions
export function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
