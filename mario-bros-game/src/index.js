import './styles.css';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const livesElement = document.getElementById('livesValue');
const gameOverScreen = document.getElementById('gameOverScreen');
const winScreen = document.getElementById('winScreen');
const finalScoreElement = document.getElementById('finalScore');
const winScoreElement = document.getElementById('winScore');

// Game state
let gameRunning = true;
let score = 0;
let lives = 3;
let cameraOffset = 0;

// Player
const player = {
    x: 50,
    y: 300,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: -15,
    gravity: 0.6,
    grounded: false,
    color: '#ff0000'
};

// Level data
const platforms = [];
const enemies = [];
const coins = [];
const flag = { x: 0, y: 0, width: 40, height: 60 };

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') e.preventDefault();
    if (e.code === 'KeyR') restartGame();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Initialize level
function initLevel() {
    platforms.length = 0;
    enemies.length = 0;
    coins.length = 0;

    // Ground platforms
    for (let i = 0; i < 15; i++) {
        if (i !== 5 && i !== 9) { // Gaps
            platforms.push({
                x: i * 200,
                y: 450,
                width: 200,
                height: 50,
                type: 'ground'
            });
        }
    }

    // Elevated platforms
    platforms.push({ x: 300, y: 350, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 450, y: 280, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 600, y: 350, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 800, y: 250, width: 150, height: 20, type: 'brick' });
    platforms.push({ x: 1100, y: 350, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 1300, y: 280, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 1500, y: 350, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 1700, y: 250, width: 150, height: 20, type: 'brick' });
    platforms.push({ x: 2000, y: 350, width: 100, height: 20, type: 'brick' });
    platforms.push({ x: 2200, y: 280, width: 100, height: 20, type: 'brick' });

    // Stairs to flag
    for (let i = 0; i < 5; i++) {
        platforms.push({
            x: 2500 + i * 40,
            y: 450 - (i + 1) * 40,
            width: 40,
            height: 40,
            type: 'brick'
        });
    }

    // Enemies
    enemies.push({ x: 400, y: 420, width: 32, height: 32, velocityX: -2, startX: 400, type: 'goomba' });
    enemies.push({ x: 700, y: 420, width: 32, height: 32, velocityX: 2, startX: 700, type: 'goomba' });
    enemies.push({ x: 1200, y: 420, width: 32, height: 32, velocityX: -2, startX: 1200, type: 'goomba' });
    enemies.push({ x: 1600, y: 420, width: 32, height: 32, velocityX: 2, startX: 1600, type: 'goomba' });
    enemies.push({ x: 2100, y: 420, width: 32, height: 32, velocityX: -2, startX: 2100, type: 'goomba' });

    // Coins
    coins.push({ x: 320, y: 310, collected: false });
    coins.push({ x: 470, y: 240, collected: false });
    coins.push({ x: 620, y: 310, collected: false });
    coins.push({ x: 850, y: 210, collected: false });
    coins.push({ x: 1120, y: 310, collected: false });
    coins.push({ x: 1320, y: 240, collected: false });
    coins.push({ x: 1520, y: 310, collected: false });
    coins.push({ x: 1750, y: 210, collected: false });
    coins.push({ x: 2020, y: 310, collected: false });
    coins.push({ x: 2220, y: 240, collected: false });

    // Flag position
    flag.x = 2700;
    flag.y = 290;
}

function resetPlayer() {
    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    cameraOffset = 0;
}

function restartGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    gameOverScreen.style.display = 'none';
    winScreen.style.display = 'none';
    initLevel();
    resetPlayer();
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function update() {
    if (!gameRunning) return;

    // Player movement
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX *= 0.8;
    }

    // Jump
    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
        player.velocityY = player.jumpForce;
        player.grounded = false;
    }

    // Apply gravity
    player.velocityY += player.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Camera follow
    if (player.x > 400) {
        cameraOffset = player.x - 400;
    }

    // Platform collision
    player.grounded = false;
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            // Landing on top
            if (player.velocityY > 0 && 
                player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
            // Hitting from below
            else if (player.velocityY < 0 && 
                     player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Side collision
            else {
                if (player.velocityX > 0) {
                    player.x = platform.x - player.width;
                } else if (player.velocityX < 0) {
                    player.x = platform.x + platform.width;
                }
                player.velocityX = 0;
            }
        }
    }

    // Enemy collision and movement
    for (const enemy of enemies) {
        enemy.x += enemy.velocityX;
        
        // Simple patrol logic
        if (enemy.x <= enemy.startX - 100 || enemy.x >= enemy.startX + 100) {
            enemy.velocityX *= -1;
        }

        if (checkCollision(player, enemy)) {
            // Jump on enemy
            if (player.velocityY > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
                enemies.splice(enemies.indexOf(enemy), 1);
                player.velocityY = player.jumpForce / 2;
                score += 100;
                scoreElement.textContent = score;
            } else {
                // Player hit
                lives--;
                livesElement.textContent = lives;
                if (lives <= 0) {
                    gameRunning = false;
                    finalScoreElement.textContent = score;
                    gameOverScreen.style.display = 'block';
                } else {
                    resetPlayer();
                }
                return;
            }
        }
    }

    // Coin collection
    for (const coin of coins) {
        if (!coin.collected && checkCollision(player, { x: coin.x, y: coin.y, width: 20, height: 20 })) {
            coin.collected = true;
            score += 50;
            scoreElement.textContent = score;
        }
    }

    // Check win condition
    if (player.x >= flag.x) {
        gameRunning = false;
        winScoreElement.textContent = score;
        winScreen.style.display = 'block';
    }

    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.y > canvas.height) {
        lives--;
        livesElement.textContent = lives;
        if (lives <= 0) {
            gameRunning = false;
            finalScoreElement.textContent = score;
            gameOverScreen.style.display = 'block';
        } else {
            resetPlayer();
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraOffset, 0);

    // Draw sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(cameraOffset, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 10; i++) {
        const cloudX = i * 300 - cameraOffset * 0.5;
        const cloudY = 50 + (i % 3) * 30;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, cloudY - 10, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, cloudY, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw platforms
    for (const platform of platforms) {
        if (platform.type === 'ground') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, 10);
        } else {
            ctx.fillStyle = '#CD853F';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // Brick pattern
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            for (let i = 0; i < platform.width; i += 20) {
                ctx.strokeRect(platform.x + i, platform.y, 20, platform.height);
            }
        }
    }

    // Draw enemies
    for (const enemy of enemies) {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x + 4, enemy.y + 8, 8, 8);
        ctx.fillRect(enemy.x + 20, enemy.y + 8, 8, 8);
        ctx.fillStyle = 'black';
        ctx.fillRect(enemy.x + 6, enemy.y + 10, 4, 4);
        ctx.fillRect(enemy.x + 22, enemy.y + 10, 4, 4);
    }

    // Draw coins
    for (const coin of coins) {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Shine effect
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(coin.x + 7, coin.y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw flag
    ctx.fillStyle = '#228B22';
    ctx.fillRect(flag.x, flag.y, 5, 60);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(flag.x + 5, flag.y);
    ctx.lineTo(flag.x + 40, flag.y + 20);
    ctx.lineTo(flag.x + 5, flag.y + 40);
    ctx.closePath();
    ctx.fill();

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Player face
    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(player.x + 4, player.y + 4, 24, 16);
    // Hat
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x + 2, player.y, 28, 8);
    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 18, player.y + 8, 4, 4);

    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
initLevel();
gameLoop();

// Make restartGame available globally for HTML buttons
window.restartGame = restartGame;
