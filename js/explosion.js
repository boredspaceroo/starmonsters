// js/explosion.js
import { game } from './game.js';
import { gameOver } from './levelManager.js';

export function updateExplosion() {
  if (!game.explosion.active) return;
  
  drawExplosion(game.player.x, game.player.y);
  
  if (millis() - game.explosion.startTime > game.explosion.duration) {
    game.explosion.active = false;
    gameOver();
  }
}

function drawExplosion(x, y) {
  let t = millis() - game.explosion.startTime;
  let progress = t / game.explosion.duration;
  let maxR = game.playerSize * 3;
  let radius = progress * maxR;
  noFill();
  stroke(255, 0, 0, 255 * (1 - progress));
  strokeWeight(4);
  ellipse(x, y, radius, radius);
}
