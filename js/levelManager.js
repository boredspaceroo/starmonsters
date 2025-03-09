// js/levelManager.js
import { game } from './game.js';
import { initEnemies } from './enemy.js';

export function checkLevelComplete() {
  let allDead = game.enemies.every(e => !e.alive);
  if (allDead) {
    // For every 5 sub-levels, the 6th is a boss fight.
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
