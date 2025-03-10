// js/main.js
import { initGame, game, resetGameState } from './game.js';
import { setupPlayer, updatePlayer, drawPlayer } from './player.js';
import { setupEnemies, updateEnemies, drawEnemies, handleEnemyFiring, initEnemies } from './enemy.js';
import { fireBullet, updateBullets, drawBullets, updateEnemyBullets, drawEnemyBullets } from './bullet.js';
import { updatePowerUps, drawPowerUps, checkPowerUpCollisions } from './powerup.js';
import { checkLevelComplete, gameOver } from './levelManager.js';
import { setupInputControls, updatePickupTexts, drawPickupTexts } from './utils.js';
import { drawAndUpdateStars } from './stars.js';
import { updateExplosion } from './explosion.js';
import { checkCollisions } from './collision.js';
import { drawHUD } from './hud.js';

let canvas;

window.setup = function() {
  const container = document.getElementById('game-container');
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  canvas = createCanvas(width, height);
  canvas.parent('game-container');
  
  initGame(width, height);
  setupPlayer(width, height);
  setupEnemies(width, height);
  setupInputControls();
};

window.draw = function() {
  // Always draw background & stars
  background(0);
  drawAndUpdateStars();
  
  if (game.state === 'playing') {
    if (game.explosion.active) {
      // If player is exploding, only show the explosion
      updateExplosion();
    } else {
      // Normal gameplay
      updatePlayer();
      drawPlayer();
      
      updateBullets();
      drawBullets();
      
      updateEnemies();
      drawEnemies();
      handleEnemyFiring();
      
      updateEnemyBullets();
      drawEnemyBullets();
      
      updatePowerUps();
      drawPowerUps();
      
      // Collisions
      checkCollisions();
      checkPowerUpCollisions();
      
      checkLevelComplete();
    }
    
    // Pickup text & HUD
    updatePickupTexts();
    drawPickupTexts();
    drawHUD();
    
  } else if (game.state === 'gameOver') {
    // The overlay is visible; we do nothing special here
  }
};

// UI Controls: Start and Restart
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', restartGame);
});

function startGame() {
  game.state = 'playing';
  document.getElementById('start-screen').style.display = 'none';
  
  // iOS orientation permission
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
  
  // Hide on-screen controls if mobile
  if ('ontouchstart' in window) {
    document.getElementById('control-overlay').style.display = 'none';
    canvas.elt.addEventListener('touchstart', (e) => {
      e.preventDefault();
      game.touchControls.fire = true;
    });
    canvas.elt.addEventListener('touchend', (e) => {
      e.preventDefault();
      game.touchControls.fire = false;
    });
  }
  
  restartGame();
}

function restartGame() {
  resetGameState();
  initEnemies();
  
  // Reset firing timers
  game.nextWaveShotTime = millis() + 500;
  game.nextFormationShotTime = millis() + 800;
  game.nextRandomShotTime = millis() + 300;
  game.currentWaveRow = 0;
  game.waveDirection = 1;
  
  document.getElementById('game-over-screen').style.display = 'none';
  game.state = 'playing';
}

function handleOrientation(event) {
  let tilt = event.gamma;
  tilt = constrain(tilt, -30, 30);
  game.mobileTilt = tilt / 30;
}

// Optional: handle window resize if you want a responsive canvas
window.addEventListener('resize', function() {
  const container = document.getElementById('game-container');
  game.width = container.clientWidth;
  game.height = container.clientHeight;
  resizeCanvas(game.width, game.height);
});
