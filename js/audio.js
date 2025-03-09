// js/audio.js
export let audioCtx;

export function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function createExplosion(x, y) {
  const ctx = getAudioCtx();
  let oscillator = ctx.createOscillator();
  let gainNode = ctx.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.value = 150;
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3);
}

export function createPlayerHitEffect() {
  const ctx = getAudioCtx();
  let oscillator = ctx.createOscillator();
  let gainNode = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 300;
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
}
