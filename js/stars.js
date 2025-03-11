// js/stars.js
import { game } from './game.js';

let starWarp = {
  active: false,
  startTime: 0,
  duration: 1500,  // 1.5 seconds of warp
  speedMultiplier: 6  // how much faster the stars move
};

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
  // If warp is active, check if we should end it
  if (starWarp.active) {
    const elapsed = millis() - starWarp.startTime;
    if (elapsed > starWarp.duration) {
      starWarp.active = false;
    }
  }
  
  fill(255);
  noStroke();
  for (let star of game.stars) {
    ellipse(star.x, star.y, star.size);
    
    // If warp is active, move them faster
    if (starWarp.active) {
      star.y += star.speed * starWarp.speedMultiplier;
    } else {
      star.y += star.speed;
    }
    
    // Wrap around
    if (star.y > game.height) {
      star.y = 0;
      star.x = random(0, game.width);
    }
  }
}

/**
 * Trigger the warp effect (called from levelManager.js)
 */
export function startWarpEffect() {
  starWarp.active = true;
  starWarp.startTime = millis();
}
