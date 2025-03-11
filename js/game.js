// js/game.js
import { initStars } from './stars.js';

export let game = {
  state: 'start',
  width: 0,
  height: 0,
  score: 0,
  level: 1,
  lives: 3,
  playerSpeed: 5,
  bulletSpeed: 10,
  enemySpeed: 1,
  enemyDropSpeed: 20,
  enemyBulletSpeed: 5,
  enemyShootingRate: 0.005,
  enemyRows: 4,
  enemyCols: 8,
  enemyPadding: 15,
  enemyDirection: 1,
  enemyMoveDown: false,
  playerSize: 40,
  enemySize: 30,
  bulletSize: 8,
  starCount: 100,
  stars: [],
  player: null,
  bullets: [],
  enemies: [],
  enemyBullets: [],
  powerUps: [],
  pickupTexts: [],
  movingLeft: false,
  movingRight: false,
  firing: false,
  lastShot: 0,
  shootDelay: 350,
  touchControls: { left: false, right: false, fire: false },
  mobileTilt: 0,
  explosion: { active: false, startTime: 0, duration: 1000 },
  nextWaveShotTime: 0,
  nextFormationShotTime: 0,
  nextRandomShotTime: 0,
  currentWaveRow: 0,
  waveDirection: 1,
  bossFight: false,
  bossFightStart: 0,
  powerUpSpeed: 1.5,
  powerUpSize: 0
};

export function initGame(width, height) {
  game.width = width;
  game.height = height;
  adjustGameParameters();
  initStars(); // Initialize the stars array
}

function adjustGameParameters() {
  const minDimension = min(game.width, game.height);
  game.playerSize = minDimension * 0.08;
  game.enemySize = minDimension * 0.06;
  game.bulletSize = minDimension * 0.015;
  
  game.playerSpeed = game.width * 0.01;
  game.bulletSpeed = game.height * 0.02;
  game.enemySpeed = game.width * 0.002;
  game.enemyBulletSpeed = game.height * 0.01;
  
  game.powerUpSize = game.playerSize * 0.75;
}

export function resetGameState() {
  game.score = 0;
  game.bullets = [];
  game.enemyBullets = [];
  game.powerUps = [];
  game.pickupTexts = [];
  game.bossFight = false;
  game.explosion.active = false;
  
  if (game.player) {
    game.player.x = game.width / 2;
    game.player.y = game.height - game.playerSize * 2;
    game.player.lives = game.lives;
    game.player.firepower = 1;
  }
}
