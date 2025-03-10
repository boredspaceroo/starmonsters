// js/collision.js
import { game } from './game.js';
import { checkCollision } from './utils.js';
import { createExplosion, createPlayerHitEffect } from './audio.js';
import { spawnPowerUp } from './powerup.js';

export function checkCollisions() {
  // Player bullets vs enemies
  for (let i = game.bullets.length - 1; i >= 0; i--) {
    const bullet = game.bullets[i];
    for (let j = 0; j < game.enemies.length; j++) {
      const enemy = game.enemies[j];
      if (!enemy.alive) continue;
      
      if (checkCollision(bullet, enemy)) {
        enemy.alive = false;
        game.bullets.splice(i, 1);
        game.score += (game.enemyRows - enemy.row) * 10;
        createExplosion(enemy.x, enemy.y);
        
        // If enemy had a power-up
        if (enemy.lifeUpgrade) {
          spawnPowerUp(enemy.x, enemy.y, "life");
          delete enemy.lifeUpgrade;
        } else if (enemy.firePowerUpgrade) {
          spawnPowerUp(enemy.x, enemy.y, "fire");
          delete enemy.firePowerUpgrade;
        }
        break;
      }
    }
  }
  
  // Enemy bullets vs player
  for (let i = game.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = game.enemyBullets[i];
    if (checkCollision(bullet, game.player)) {
      game.enemyBullets.splice(i, 1);
      game.player.lives--;
      // Reset firepower if hit
      game.player.firepower = 1;
      createPlayerHitEffect();
      if (game.player.lives <= 0 && !game.explosion.active) {
        game.explosion.active = true;
        game.explosion.startTime = millis();
      }
    }
  }
}
