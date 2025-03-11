// js/player.js
import { game } from './game.js';
import { fireBullet } from './bullet.js';

export function setupPlayer(width, height) {
  game.player = {
    x: width / 2,
    y: height - game.playerSize * 2,
    width: game.playerSize,
    height: game.playerSize,
    lives: game.lives,
    firepower: 1,
    powerUpEffect: { active: false, startTime: 0, duration: 1000 }
  };
}

export function updatePlayer() {
  if (game.movingLeft || game.touchControls.left) {
    game.player.x -= game.playerSpeed;
  }
  if (game.movingRight || game.touchControls.right) {
    game.player.x += game.playerSpeed;
  }
  if (game.mobileTilt) {
    game.player.x += game.mobileTilt * game.playerSpeed;
  }
  
  // Constrain to screen
  game.player.x = constrain(game.player.x, game.playerSize / 2, game.width - game.playerSize / 2);
  
  // Fire bullet if time
  if ((game.firing || game.touchControls.fire) && millis() - game.lastShot > game.shootDelay) {
    fireBullet();
    game.lastShot = millis();
  }
}

export function drawPlayer() {
  // If power-up effect active, glow
  if (game.player.powerUpEffect.active) {
    let t = millis() - game.player.powerUpEffect.startTime;
    let alpha = map(t, 0, game.player.powerUpEffect.duration, 255, 0);
    noFill();
    stroke(255, 255, 0, alpha);
    strokeWeight(4);
    ellipse(game.player.x, game.player.y, game.player.width * 1.5);
  }
  
  noStroke();
  fill(0, 255, 0);
  rectMode(CENTER);
  rect(game.player.x, game.player.y, game.player.width, game.player.height);
  
  fill(0, 200, 0);
  rect(game.player.x, game.player.y - game.playerSize * 0.2,
       game.playerSize * 0.5, game.playerSize * 0.3);
  
  fill(255, 100, 0);
  rect(game.player.x - game.playerSize * 0.3,
       game.player.y + game.playerSize * 0.3,
       game.playerSize * 0.2, game.playerSize * 0.3);
  rect(game.player.x + game.playerSize * 0.3,
       game.player.y + game.playerSize * 0.3,
       game.playerSize * 0.2, game.playerSize * 0.3);
}

export function triggerPlayerEffect() {
  game.player.powerUpEffect.active = true;
  game.player.powerUpEffect.startTime = millis();
}
