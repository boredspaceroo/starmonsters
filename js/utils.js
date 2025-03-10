// js/utils.js
import { game } from './game.js';

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = floor(random(0, i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function checkCollision(obj1, obj2) {
  return (
    obj1.x + obj1.width/2  > obj2.x - obj2.width/2 &&
    obj1.x - obj1.width/2  < obj2.x + obj2.width/2 &&
    obj1.y + obj1.height/2 > obj2.y - obj2.height/2 &&
    obj1.y - obj1.height/2 < obj2.y + obj2.height/2
  );
}

export function addPickupText(txt, x, y) {
  game.pickupTexts.push({
    x: x,
    y: y,
    text: txt,
    startTime: millis(),
    duration: 1000
  });
}

export function updatePickupTexts() {
  for (let i = game.pickupTexts.length - 1; i >= 0; i--) {
    let dt = millis() - game.pickupTexts[i].startTime;
    if (dt > game.pickupTexts[i].duration) {
      game.pickupTexts.splice(i, 1);
    }
  }
}

export function drawPickupTexts() {
  textAlign(CENTER, CENTER);
  textSize(20);
  for (let pt of game.pickupTexts) {
    let dt = millis() - pt.startTime;
    let alpha = map(dt, 0, pt.duration, 255, 0);
    fill(255, alpha);
    text(pt.text, pt.x, pt.y - dt / 20);
  }
}

export function setupInputControls() {
  window.addEventListener('keydown', keyPressed);
  window.addEventListener('keyup', keyReleased);
  setupTouchControls();
  
  // Prevent scrolling on touch
  document.addEventListener('touchstart', (e) => {
    if (e.target.id !== 'start-btn' && e.target.id !== 'restart-btn') {
      e.preventDefault();
    }
  }, { passive: false });
  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
}

function keyPressed(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    game.movingLeft = true;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    game.movingRight = true;
  }
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
    game.firing = true;
  }
}

function keyReleased(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    game.movingLeft = false;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    game.movingRight = false;
  }
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
    game.firing = false;
  }
}

export function setupTouchControls() {
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const fireBtn = document.getElementById('fire-btn');
  
  if (leftBtn && rightBtn && fireBtn) {
    leftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      game.touchControls.left = true;
    });
    leftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      game.touchControls.left = false;
    });
    
    rightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      game.touchControls.right = true;
    });
    rightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      game.touchControls.right = false;
    });
    
    fireBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      game.touchControls.fire = true;
    });
    fireBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      game.touchControls.fire = false;
    });
  }
}
