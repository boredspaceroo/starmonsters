// js/player.js
import { game } from './game.js';

// We'll capture references to the DOM pods and the arms/wings:
let mechaLeft, mechaRight;
let leftArmLeft, rightArmLeft, leftWingLeft, rightWingLeft;
let leftArmRight, rightArmRight, leftWingRight, rightWingRight;
let leftThrusters, rightThrusters;

// For the tilt arms/wings logic:
function tiltArmsAndWings(tiltAngle) {
  // If you want arms/wings to move only if tiltAngle < 0 or > 0
  // we can replicate snippet logic:
  if (tiltAngle < 0) {
    // turning left
    leftArmLeft.style.transform = 'rotate(15deg)';
    rightArmLeft.style.transform = 'rotate(5deg)';
    leftWingLeft.style.transform = 'rotate(-15deg)';
    rightWingLeft.style.transform = 'rotate(-5deg)';
    
    leftArmRight.style.transform = 'rotate(15deg)';
    rightArmRight.style.transform = 'rotate(5deg)';
    leftWingRight.style.transform = 'rotate(-15deg)';
    rightWingRight.style.transform = 'rotate(-5deg)';
  } else if (tiltAngle > 0) {
    // turning right
    leftArmLeft.style.transform = 'rotate(-5deg)';
    rightArmLeft.style.transform = 'rotate(-15deg)';
    leftWingLeft.style.transform = 'rotate(5deg)';
    rightWingLeft.style.transform = 'rotate(15deg)';
    
    leftArmRight.style.transform = 'rotate(-5deg)';
    rightArmRight.style.transform = 'rotate(-15deg)';
    leftWingRight.style.transform = 'rotate(5deg)';
    rightWingRight.style.transform = 'rotate(15deg)';
  } else {
    // no tilt
    leftArmLeft.style.transform = 'rotate(0deg)';
    rightArmLeft.style.transform = 'rotate(0deg)';
    leftWingLeft.style.transform = 'rotate(0deg)';
    rightWingLeft.style.transform = 'rotate(0deg)';
    
    leftArmRight.style.transform = 'rotate(0deg)';
    rightArmRight.style.transform = 'rotate(0deg)';
    leftWingRight.style.transform = 'rotate(0deg)';
    rightWingRight.style.transform = 'rotate(0deg)';
  }
}

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
  
  // Grab references to both pods:
  mechaLeft = document.getElementById('mecha-left');
  mechaRight = document.getElementById('mecha-right');
  
  // Grab arms/wings to tilt them:
  leftArmLeft = mechaLeft.querySelector('.left-arm');
  rightArmLeft = mechaLeft.querySelector('.right-arm');
  leftWingLeft = mechaLeft.querySelector('.left-wing');
  rightWingLeft = mechaLeft.querySelector('.right-wing');
  
  leftArmRight = mechaRight.querySelector('.left-arm');
  rightArmRight = mechaRight.querySelector('.right-arm');
  leftWingRight = mechaRight.querySelector('.left-wing');
  rightWingRight = mechaRight.querySelector('.right-wing');
  
  // Grab side thrusters for showing/hiding on turns
  leftThrusters = [
    ...mechaLeft.querySelectorAll('.side-thruster'),
    ...mechaRight.querySelectorAll('.left-thruster')
  ];
  rightThrusters = [
    ...mechaLeft.querySelectorAll('.right-thruster'),
    ...mechaRight.querySelectorAll('.right-thruster')
  ];
}

export function updatePlayer() {
  // Horizontal movement
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
  game.player.x = constrain(
    game.player.x,
    game.playerSize / 2,
    game.width - game.playerSize / 2
  );
  
  // Fire bullet if enough time passed
  if ((game.firing || game.touchControls.fire) &&
      millis() - game.lastShot > game.shootDelay) {
    import('./bullet.js').then(mod => mod.fireBullet());
    game.lastShot = millis();
  }
  
  // Update DOM positions and tilt
  updatePodPositionsAndTilt();
}

export function drawPlayer() {
  // No p5 rectangle/ellipse needed; DOM pods are our ship.
  if (game.player.powerUpEffect.active) {
    let t = millis() - game.player.powerUpEffect.startTime;
    if (t > game.player.powerUpEffect.duration) {
      game.player.powerUpEffect.active = false;
    }
  }
}

function updatePodPositionsAndTilt() {
  if (!mechaLeft || !mechaRight) return;
  
  // The snippet used a transform scale(0.45,1.3333) to shrink + elongate
  // We'll apply the same to replicate the "correct shape + size"
  const scaleTransform = ' scale(0.18, 0.6)';
  
  // We'll give them more spacing so they don't overlap
  const boosterGap = 20; // tweak as you like
  // The snippet's scaled height is ~160, so let's place them so that
  // the center of each pod is near game.player.y
  const baseY = game.player.y - 80; // half of 160 is 80
  
  // If turning left or right, let's tilt up to ±15 degrees
  let tiltAngle = 0;
  if (game.movingLeft || game.mobileTilt < -0.2) {
    tiltAngle = -15;
  } else if (game.movingRight || game.mobileTilt > 0.2) {
    tiltAngle = 15;
  }
  
  // Position left pod
  // The snippet used an effectiveWidth of 36 after scaling
  // so we subtract 36/2 = 18 to center it
  mechaLeft.style.left = (game.player.x - boosterGap - 18) + 'px';
  mechaLeft.style.top = baseY + 'px';
  mechaLeft.style.transform = `rotate(${tiltAngle}deg)${scaleTransform}`;
  
  // Position right pod
  mechaRight.style.left = (game.player.x + boosterGap - 18) + 'px';
  mechaRight.style.top = baseY + 'px';
  mechaRight.style.transform = `rotate(${tiltAngle}deg)${scaleTransform}`;
  
  // Show side thrusters on the opposite side of the turn
  if (tiltAngle < 0) {
    // turning left => show thrusters on the right
    leftThrusters.forEach(th => th.style.opacity = '0');
    rightThrusters.forEach(th => th.style.opacity = '1');
  } else if (tiltAngle > 0) {
    // turning right => show thrusters on the left
    leftThrusters.forEach(th => th.style.opacity = '1');
    rightThrusters.forEach(th => th.style.opacity = '0');
  } else {
    // no tilt
    leftThrusters.forEach(th => th.style.opacity = '0');
    rightThrusters.forEach(th => th.style.opacity = '0');
  }
  
  // Also tilt arms/wings for extra detail
  tiltArmsAndWings(tiltAngle);
}

export function triggerPlayerEffect() {
  game.player.powerUpEffect.active = true;
  game.player.powerUpEffect.startTime = millis();
}
