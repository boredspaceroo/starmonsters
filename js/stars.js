// js/stars.js
import { game } from './game.js';

export function initStars() {
  game.stars = [];
  for (let i = 0; i < game.starCount; i++) {
    game.stars.push({
      x: random(0, game.width),
      y: random(0, game.height),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }
}

export function drawAndUpdateStars() {
  fill(255);
  noStroke();
  for (let star of game.stars) {
    ellipse(star.x, star.y, star.size);
    star.y += star.speed;
    if (star.y > game.height) {
      star.y = 0;
      star.x = random(0, game.width);
    }
  }
}
