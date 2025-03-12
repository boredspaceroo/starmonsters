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
  
  // DOM references for the two pods
  mechaLeft = document.getElementById('mecha-left');
  mechaRight = document.getElementById('mecha-right');
  
  leftThrusters = mechaLeft.querySelectorAll('.side-thruster');
  rightThrusters = mechaRight.querySelectorAll('.side-thruster');
}

export function updatePlayer() {
  // Move horizontally
  if (game.movingLeft || game.touchControls.left) {
    game.player.x -= game.playerSpeed;
  }
  if (game.movingRight || game.touchControls.right) {
    game.player.x += game.playerSpeed;
  }
  if (game.mobileTilt) {
    game.player.x += game.mobileTilt * game.playerSpeed;
  }
  
  // Constrain
  game.player.x = constrain(
    game.player.x,
    game.playerSize / 2,
    game.width - game.playerSize / 2
  );
  
  // Fire bullet if time
  if ((game.firing || game.touchControls.fire) &&
      millis() - game.lastShot > game.shootDelay) {
    import('./bullet.js').then(module => module.fireBullet());
    game.lastShot = millis();
  }
  
  // Position & tilt the DOM pods
  updatePodPositionsAndTilt();
}

export function drawPlayer() {
  // No p5 rectangle or ellipse code here.
  // If you want a glow effect, do it in the DOM or here with p5 if needed.
  if (game.player.powerUpEffect.active) {
    const elapsed = millis() - game.player.powerUpEffect.startTime;
    if (elapsed > game.player.powerUpEffect.duration) {
      game.player.powerUpEffect.active = false;
    }
  }
}

function updatePodPositionsAndTilt() {
  if (!mechaLeft || !mechaRight) return;
  
  // Adjust these to taste:
  const gap = 40; 
  const baseY = game.player.y - 60;
  
  mechaLeft.style.left = (game.player.x - gap - 40) + 'px';
  mechaLeft.style.top  = baseY + 'px';
  
  mechaRight.style.left = (game.player.x + gap - 40) + 'px';
  mechaRight.style.top  = baseY + 'px';
  
  let tiltAngle = 0;
  if (game.movingLeft || game.mobileTilt < -0.2) {
    tiltAngle = -15;
  } else if (game.movingRight || game.mobileTilt > 0.2) {
    tiltAngle = 15;
  }
  
  mechaLeft.style.transform  = `rotate(${tiltAngle}deg)`;
  mechaRight.style.transform = `rotate(${tiltAngle}deg)`;
  
  // Show side thrusters if turning
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
