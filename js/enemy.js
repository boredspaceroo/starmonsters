// js/enemy.js
import { game } from './game.js';
import { shuffleArray } from './utils.js';

export function setupEnemies(width, height) {
  initEnemies();
}

export function initEnemies() {
  game.enemies = [];
  const enemyWidth = game.enemySize + game.enemyPadding;
  const enemyHeight = game.enemySize + game.enemyPadding;
  const startX = (game.width - (game.enemyCols * enemyWidth)) / 2 + game.enemySize / 2;
  const startY = game.height * 0.1;
  
  for (let row = 0; row < game.enemyRows; row++) {
    for (let col = 0; col < game.enemyCols; col++) {
      game.enemies.push({
        x: startX + col * enemyWidth,
        y: startY + row * enemyHeight,
        width: game.enemySize,
        height: game.enemySize,
        row: row,
        type: row % 3,
        alive: true
      });
    }
  }
  
  // Mark one from last row for life upgrade
  let lastRowEnemies = game.enemies.filter(e => e.row === game.enemyRows - 1);
  if (lastRowEnemies.length > 0) {
    let index = floor(random(0, lastRowEnemies.length));
    lastRowEnemies[index].lifeUpgrade = true;
  }
  
  // Mark up to two for firepower
  let otherEnemies = game.enemies.filter(e => !e.lifeUpgrade);
  shuffleArray(otherEnemies);
  for (let i = 0; i < min(2, otherEnemies.length); i++) {
    otherEnemies[i].firePowerUpgrade = true;
  }
}

export function updateEnemies() {
  let hitEdge = false;
  let lowestEnemy = 0;
  
  for (let enemy of game.enemies) {
    if (!enemy.alive) continue;
    
    // Check edges
    if ((enemy.x - enemy.width/2 <= 0 && game.enemyDirection < 0) ||
        (enemy.x + enemy.width/2 >= game.width && game.enemyDirection > 0)) {
      hitEdge = true;
    }
    if (enemy.y + enemy.height/2 > lowestEnemy) {
      lowestEnemy = enemy.y + enemy.height/2;
    }
  }
  
  if (hitEdge) {
    game.enemyDirection *= -1;
    game.enemyMoveDown = true;
  }
  
  // Move enemies
  for (let enemy of game.enemies) {
    if (!enemy.alive) continue;
    enemy.x += game.enemySpeed * game.enemyDirection;
    if (game.enemyMoveDown) {
      enemy.y += game.enemyDropSpeed;
    }
  }
  game.enemyMoveDown = false;
  
  // If any enemy gets too close
  if (lowestEnemy > game.player.y - game.playerSize) {
    game.player.lives = 0;
    if (!game.explosion.active) {
      game.explosion.active = true;
      game.explosion.startTime = millis();
    }
  }
}

export function drawEnemies() {
  rectMode(CENTER);
  for (let enemy of game.enemies) {
    if (!enemy.alive) continue;
    switch (enemy.type) {
      case 0:
        fill(255, 0, 0);
        rect(enemy.x, enemy.y, enemy.width, enemy.height);
        fill(200, 0, 0);
        ellipse(enemy.x - enemy.width*0.25, enemy.y - enemy.height*0.2, enemy.width*0.2);
        ellipse(enemy.x + enemy.width*0.25, enemy.y - enemy.height*0.2, enemy.width*0.2);
        rect(enemy.x, enemy.y + enemy.height*0.2, enemy.width*0.8, enemy.height*0.2);
        break;
      case 1:
        fill(255, 165, 0);
        rect(enemy.x, enemy.y, enemy.width, enemy.height*0.8, 5);
        fill(200, 120, 0);
        ellipse(enemy.x - enemy.width*0.2, enemy.y - enemy.height*0.1, enemy.width*0.15);
        ellipse(enemy.x + enemy.width*0.2, enemy.y - enemy.height*0.1, enemy.width*0.15);
        rect(enemy.x, enemy.y + enemy.height*0.15, enemy.width*0.6, enemy.height*0.15);
        break;
      case 2:
        fill(255, 0, 255);
        ellipse(enemy.x, enemy.y, enemy.width, enemy.height);
        fill(200, 0, 200);
        ellipse(enemy.x - enemy.width*0.25, enemy.y - enemy.height*0.1, enemy.width*0.2);
        ellipse(enemy.x + enemy.width*0.25, enemy.y - enemy.height*0.1, enemy.width*0.2);
        arc(enemy.x, enemy.y + enemy.height*0.15,
            enemy.width*0.5, enemy.height*0.3, 0, PI);
        break;
    }
  }
}

export function handleEnemyFiring() {
  // Skip if boss fight
  if (game.level % 4 === 0) return;
  
  let pattern = (game.level % 4) - 1; // 0=wave, 1=formation, 2=random
  switch (pattern) {
    case 0: // wave
      if (millis() > game.nextWaveShotTime) {
        let enemiesInRow = game.enemies.filter(e => e.alive && e.row === game.currentWaveRow);
        if (enemiesInRow.length === 0) {
          // find next row that has alive enemies
          let found = false;
          for (let r = game.currentWaveRow + 1; r < game.enemyRows; r++) {
            enemiesInRow = game.enemies.filter(e => e.alive && e.row === r);
            if (enemiesInRow.length > 0) {
              game.currentWaveRow = r;
              found = true;
              break;
            }
          }
          if (!found) {
            // reset to row 0
            game.currentWaveRow = 0;
            enemiesInRow = game.enemies.filter(e => e.alive && e.row === 0);
          }
        }
        if (enemiesInRow.length > 0) {
          let shooter;
          if (game.waveDirection === 1) {
            shooter = enemiesInRow.reduce((a,b) => a.x < b.x ? a : b);
          } else {
            shooter = enemiesInRow.reduce((a,b) => a.x > b.x ? a : b);
          }
          import('./bullet.js').then(module => {
            module.fireEnemyBullet(shooter.x, shooter.y + shooter.height / 2);
          });
        }
        game.nextWaveShotTime = millis() + (500 / game.level);
        game.currentWaveRow++;
        if (game.currentWaveRow >= game.enemyRows) {
          game.currentWaveRow = 0;
          game.waveDirection *= -1;
        }
      }
      break;
    case 1: // formation
      if (millis() > game.nextFormationShotTime) {
        let aliveEnemies = game.enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0) {
          let leftmost = aliveEnemies.reduce((a,b) => a.x < b.x ? a : b);
          let rightmost = aliveEnemies.reduce((a,b) => a.x > b.x ? a : b);
          import('./bullet.js').then(module => {
            module.fireEnemyBullet(leftmost.x, leftmost.y + leftmost.height / 2);
            module.fireEnemyBullet(rightmost.x, rightmost.y + rightmost.height / 2);
          });
        }
        game.nextFormationShotTime = millis() + (800 / game.level);
      }
      break;
    case 2: // random
      if (millis() > game.nextRandomShotTime) {
        let aliveEnemies = game.enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0) {
          let shooter = random(aliveEnemies);
          import('./bullet.js').then(module => {
            module.fireEnemyBullet(shooter.x, shooter.y + shooter.height / 2);
          });
        }
        game.nextRandomShotTime = millis() + (300 / game.level);
      }
      break;
  }
}
