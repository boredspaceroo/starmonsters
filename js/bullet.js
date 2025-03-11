// js/bullet.js
import { game } from './game.js';
import { getAudioCtx } from './audio.js';

export function fireBullet() {
  const ctx = getAudioCtx();
  if (game.player.firepower === 1) {
    // Single bullet
    game.bullets.push({
      x: game.player.x,
      y: game.player.y - game.playerSize / 2,
      width: game.bulletSize,
      height: game.bulletSize * 2,
      fire: false
    });
  } else if (game.player.firepower === 4) {
    // Four parallel bullets
    let offset = game.player.width * 0.3;
    game.bullets.push({
      x: game.player.x - offset,
      y: game.player.y - game.playerSize / 2,
      width: game.bulletSize,
      height: game.bulletSize * 2,
      fire: true
    });
    game.bullets.push({
      x: game.player.x - offset/3,
      y: game.player.y - game.playerSize / 2,
      width: game.bulletSize,
      height: game.bulletSize * 2,
      fire: true
    });
    game.bullets.push({
      x: game.player.x + offset/3,
      y: game.player.y - game.playerSize / 2,
      width: game.bulletSize,
      height: game.bulletSize * 2,
      fire: true
    });
    game.bullets.push({
      x: game.player.x + offset,
      y: game.player.y - game.playerSize / 2,
      width: game.bulletSize,
      height: game.bulletSize * 2,
      fire: true
    });
  }
  
  // Play shot sound
  let oscillator = ctx.createOscillator();
  let gainNode = ctx.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = 800;
  gainNode.gain.value = 0.1;
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.05);
}

export function updateBullets() {
  for (let i = game.bullets.length - 1; i >= 0; i--) {
    game.bullets[i].y -= game.bulletSpeed;
    if (game.bullets[i].y < 0) {
      game.bullets.splice(i, 1);
    }
  }
}

export function drawBullets() {
  noStroke();
  for (let bullet of game.bullets) {
    rectMode(CENTER);
    fill(bullet.fire ? color(255, 69, 0) : color(0, 255, 255));
    rect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

export function fireEnemyBullet(x, y) {
  game.enemyBullets.push({
    x: x,
    y: y,
    width: game.bulletSize,
    height: game.bulletSize * 2
  });
}

export function updateEnemyBullets() {
  for (let i = game.enemyBullets.length - 1; i >= 0; i--) {
    game.enemyBullets[i].y += game.enemyBulletSpeed;
    if (game.enemyBullets[i].y > game.height) {
      game.enemyBullets.splice(i, 1);
    }
  }
}

export function drawEnemyBullets() {
  fill(255, 0, 0);
  noStroke();
  for (let bullet of game.enemyBullets) {
    rectMode(CENTER);
    rect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}
