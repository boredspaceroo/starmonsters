// js/player.js
import { game } from './game.js';

let mechaLeft, mechaRight;
let leftThrusters, rightThrusters;

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
  
  // Grab DOM elements for the ship (created in index.html)
  mechaLeft = document.getElementById('mecha-left');
  mechaRight = document.getElementById('mecha-right');
  
  leftThrusters = mechaLeft.querySelectorAll('.side-thruster');
  rightThrusters = mechaRight.querySelectorAll('.side-thruster');
}

export function updatePlayer() {
  // Horizontal movement remains unchanged
  if (game.movingLeft || game.touchControls.left) {
    game.player.x -= game.playerSpeed;
  }
  if (game.movingRight || game.touchControls.right) {
    game.player.x += game.playerSpeed;
  }
  if (game.mobileTilt) {
    game.player.x += game.mobileTilt * game.playerSpeed;
  }
  
  game.player.x = constrain(game.player.x, game.playerSize / 2, game.width - game.playerSize / 2);
  
  // Fire bullet if time condition met (handled in main.js via bullet.js)
  if ((game.firing || game.touchControls.fire) && millis() - game.lastShot > game.shootDelay) {
    import('./bullet.js').then(module => module.fireBullet());
    game.lastShot = millis();
  }
  
  // Update the DOM positions and tilt of the booster pods
  updatePodPositionsAndTilt();
}

export function drawPlayer() {
  // No p5.js drawing is required since the DOM elements represent the ship.
  if (game.player.powerUpEffect.active) {
    const t = millis() - game.player.powerUpEffect.startTime;
    if (t > game.player.powerUpEffect.duration) {
      game.player.powerUpEffect.active = false;
    }
    // Optionally, add visual glow effects to the DOM here.
  }
}

function updatePodPositionsAndTilt() {
  if (!mechaLeft || !mechaRight) return;
  
  // Position the two pods around game.player.x.
  // Adjust these offsets as needed for the best visual alignment.
  const gap = 40; // horizontal offset from center
  const baseY = game.player.y - 60; // vertical position of the pods
  
  // Position left pod (subtract half the pod width)
  mechaLeft.style.left = (game.player.x - gap - 40) + 'px'; 
  mechaLeft.style.top = baseY + 'px';
  
  // Position right pod
  mechaRight.style.left = (game.player.x + gap - 40) + 'px';
  mechaRight.style.top = baseY + 'px';
  
  // Determine tilt angle based on input (keeping original x-axis only movement)
  let tiltAngle = 0;
  if (game.movingLeft || game.mobileTilt < -0.2) {
    tiltAngle = -15;
  } else if (game.movingRight || game.mobileTilt > 0.2) {
    tiltAngle = 15;
  }
  
  mechaLeft.style.transform = `rotate(${tiltAngle}deg)`;
  mechaRight.style.transform = `rotate(${tiltAngle}deg)`;
  
  // Show side thrusters on the pod opposite to the turn direction
  if (tiltAngle < 0) {
    leftThrusters.forEach(th => th.style.opacity = '0');
    rightThrusters.forEach(th => th.style.opacity = '1');
  } else if (tiltAngle > 0) {
    leftThrusters.forEach(th => th.style.opacity = '1');
    rightThrusters.forEach(th => th.style.opacity = '0');
  } else {
    leftThrusters.forEach(th => th.style.opacity = '0');
    rightThrusters.forEach(th => th.style.opacity = '0');
  }
}

export function triggerPlayerEffect() {
  game.player.powerUpEffect.active = true;
  game.player.powerUpEffect.startTime = millis();
}
