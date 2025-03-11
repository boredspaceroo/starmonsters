// js/powerup.js
import { game } from './game.js';
import { getAudioCtx } from './audio.js';
import { addPickupText, checkCollision } from './utils.js';
import { triggerPlayerEffect } from './player.js';

export function spawnPowerUp(x, y, type) {
  game.powerUps.push({
    x: x,
    y: y,
    width: game.powerUpSize,
    height: game.powerUpSize,
    type: type
  });
}

export function updatePowerUps() {
  for (let i = game.powerUps.length - 1; i >= 0; i--) {
    game.powerUps[i].y += game.powerUpSpeed;
    if (game.powerUps[i].y > game.height) {
      game.powerUps.splice(i, 1);
    }
  }
}

export function drawPowerUps() {
  textAlign(CENTER, CENTER);
  textSize(16);
  for (let pu of game.powerUps) {
    let r = pu.width;
    strokeWeight(4);
    if (pu.type === "life") {
      stroke(0, 255, 0);
      fill(0);
      ellipse(pu.x, pu.y, r);
      noStroke();
      fill(0, 255, 0);
      text("P", pu.x, pu.y);
    } else if (pu.type === "fire") {
      stroke(255, 255, 0);
      fill(0);
      ellipse(pu.x, pu.y, r);
      noStroke();
      fill(255, 255, 0);
      text("F", pu.x, pu.y);
    }
  }
}

export function checkPowerUpCollisions() {
  for (let i = game.powerUps.length - 1; i >= 0; i--) {
    let pu = game.powerUps[i];
    if (checkCollision(pu, game.player)) {
      const ctx = getAudioCtx();
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 400;
      gain.gain.value = 0.1;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      
      if (pu.type === "life") {
        if (game.player.lives < 3) {
          game.player.lives++;
          addPickupText("1UP", game.player.x, game.player.y);
          triggerPlayerEffect();
        } else {
          game.score += 500;
          addPickupText("500+", game.player.x, game.player.y);
        }
      } else if (pu.type === "fire") {
        if (game.player.firepower < 4) {
          game.player.firepower = 4;
          addPickupText("🔥", game.player.x, game.player.y);
          triggerPlayerEffect();
        } else {
          game.score += 100;
          addPickupText("100+", game.player.x, game.player.y);
        }
      }
      game.powerUps.splice(i, 1);
    }
  }
}
