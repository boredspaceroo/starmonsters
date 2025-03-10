// js/levelManager.js
import { game } from './game.js';
import { initEnemies } from './enemy.js';

export function checkLevelComplete() {
  let allDead = game.enemies.every(e => !e.alive);
  if (allDead) {
    // If next level is boss (every 4th), placeholder
    if ((game.level + 1) % 4 === 0) {
      game.bossFight = true;
      game.bossFightStart = millis();
    } else {
      game.level++;
      game.enemySpeed += 0.2;
      game.enemyShootingRate += 0.001;
      initEnemies();
    }
  }
}

export function gameOver() {
  game.state = 'gameOver';
  const finalScoreEl = document.getElementById('final-score');
  if (finalScoreEl) {
    finalScoreEl.textContent = game.score;
  }
  const gameOverScreen = document.getElementById('game-over-screen');
  if (gameOverScreen) {
    gameOverScreen.style.display = 'flex';
  }
}
