// Sound engine using Web Audio API (no external dependencies)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.15, volume = 0.3, delay = 0 }) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) {
    // Silently fail if audio not supported
  }
}

export const sounds = {
  click() {
    playTone({ frequency: 600, type: 'sine', duration: 0.08, volume: 0.25 });
  },

  hover() {
    playTone({ frequency: 800, type: 'sine', duration: 0.06, volume: 0.1 });
  },

  taskComplete() {
    // Three ascending notes
    playTone({ frequency: 523, type: 'triangle', duration: 0.12, volume: 0.3, delay: 0 });
    playTone({ frequency: 659, type: 'triangle', duration: 0.12, volume: 0.3, delay: 0.13 });
    playTone({ frequency: 784, type: 'triangle', duration: 0.2, volume: 0.35, delay: 0.26 });
  },

  levelComplete() {
    // Triumphant fanfare - 5 notes
    playTone({ frequency: 523, type: 'triangle', duration: 0.15, volume: 0.4, delay: 0 });
    playTone({ frequency: 659, type: 'triangle', duration: 0.15, volume: 0.4, delay: 0.16 });
    playTone({ frequency: 784, type: 'triangle', duration: 0.15, volume: 0.4, delay: 0.32 });
    playTone({ frequency: 1047, type: 'triangle', duration: 0.15, volume: 0.45, delay: 0.48 });
    playTone({ frequency: 1319, type: 'triangle', duration: 0.4, volume: 0.5, delay: 0.64 });
  },

  error() {
    playTone({ frequency: 300, type: 'sawtooth', duration: 0.15, volume: 0.2 });
    playTone({ frequency: 200, type: 'sawtooth', duration: 0.2, volume: 0.2, delay: 0.16 });
  },

  doubleClick() {
    playTone({ frequency: 900, type: 'sine', duration: 0.06, volume: 0.3 });
    playTone({ frequency: 1100, type: 'sine', duration: 0.1, volume: 0.35, delay: 0.07 });
  },

  drag() {
    playTone({ frequency: 400, type: 'sine', duration: 0.08, volume: 0.15 });
  },

  drop() {
    playTone({ frequency: 500, type: 'triangle', duration: 0.12, volume: 0.3 });
    playTone({ frequency: 700, type: 'triangle', duration: 0.15, volume: 0.3, delay: 0.13 });
  },

  scroll() {
    playTone({ frequency: 350, type: 'sine', duration: 0.05, volume: 0.1 });
  },
};
