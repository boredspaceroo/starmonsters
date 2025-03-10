// js/hud.js
import { game } from './game.js';

export function drawHUD() {
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`Score: ${game.score}`, 10, 25);
  text(`Level: ${game.level}`, 10, 45);
  
  // Lives as orange squares
  for (let i = 0; i < game.player.lives; i++) {
    fill(255, 165, 0);
    rect(game.width - 80 + i * 20, 20, 15, 15);
  }
}
