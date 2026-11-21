// Sound synthesizer using Web Audio API (works without external mp3 files)
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  playEnvelope() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.3);
      });
    } catch (e) {
      console.log(e);
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Cheerful fanfare
      const melody = [
        { f: 523.25, t: 0 },    // C5
        { f: 659.25, t: 0.12 }, // E5
        { f: 783.99, t: 0.24 }, // G5
        { f: 1046.50, t: 0.38 } // C6
      ];
      melody.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + note.t);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + note.t);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + note.t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + note.t);
        osc.stop(this.ctx.currentTime + note.t + 0.4);
      });
    } catch (e) {
      console.log(e);
    }
  }

  playClaim() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.log(e);
    }
  }
}

const sfx = new SoundEffects();

document.addEventListener('DOMContentLoaded', () => {
  // 1. URL parameter personalization (?her=HerName&him=HisName)
  const urlParams = new URLSearchParams(window.location.search);
  const herName = urlParams.get('her') || urlParams.get('name') || 'My Beautiful Girl';
  const hisName = urlParams.get('him') || urlParams.get('from') || 'Your Silly Boyfriend';

  document.querySelectorAll('.recipient-name').forEach(el => {
    el.textContent = herName;
  });
  document.querySelectorAll('.sender-name').forEach(el => {
    el.textContent = hisName;
  });

  // 2. Sound Toggle Button
  const soundBtn = document.getElementById('sound-toggle');
  soundBtn.addEventListener('click', () => {
    sfx.init();
    sfx.enabled = !sfx.enabled;
    soundBtn.querySelector('.sound-icon').textContent = sfx.enabled ? '🎵' : '🔇';
    soundBtn.querySelector('.sound-text').textContent = sfx.enabled ? 'Sound: ON' : 'Sound: OFF';
    if (sfx.enabled) sfx.playPop();
  });

  // 3. Floating background particles
  createBackgroundParticles();

  // 4. Interactive Envelope
  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
      sfx.playEnvelope();
      envelope.classList.add('open');
      fireMiniHeartBurst(envelope);
    }
  });

  // 5. Runaway "No" Button & Growing "Yes" Button
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const noLabel = document.getElementById('no-label');
  const runawayHint = document.getElementById('runaway-hint');
  const playground = document.getElementById('playground');

  const funnyNoTexts = [
    "No, still mad! 😠",
    "Are you really sure? 🥺",
    "I'll buy you boba & snacks! 🧋",
    "Think of our Snap streak! 👻🔥",
    "Pretty please with cherry on top? 🍒",
    "Wait, look how big YES is! 👉",
    "Error: 'No' button is broken 🤖",
    "Okay wait, hear me out 😭",
    "You know you want to forgive me! 💕",
    "System override: YES is only option! ✨"
  ];

  let noClickAttempts = 0;
  let yesScale = 1.0;

  function dodgeNoButton(e) {
    if (e) {
      e.preventDefault();
    }
    noClickAttempts++;
    sfx.playPop();

    // Change text playfully
    const textIdx = noClickAttempts % funnyNoTexts.length;
    noLabel.textContent = funnyNoTexts[textIdx];

    // Grow Yes button
    yesScale = Math.min(yesScale + 0.12, 1.8);
    btnYes.style.transform = `scale(${yesScale})`;

    // Get boundaries
    const rect = playground.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxMoveX = (rect.width / 2) - 40;
    const maxMoveY = 50;

    // Calculate random jump position
    const randomX = (Math.random() - 0.5) * 2 * maxMoveX;
    const randomY = (Math.random() - 0.5) * 2 * maxMoveY;

    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    runawayHint.textContent = `Attempt #${noClickAttempts}: Hehe, you can't click it! 😜`;
    runawayHint.style.color = '#FF4D6D';
  }

  // Hover and touch triggers for "No"
  btnNo.addEventListener('mouseenter', dodgeNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    dodgeNoButton(e);
  }, { passive: false });
  btnNo.addEventListener('click', dodgeNoButton);

  // 6. "YES" Button & Celebration
  const modal = document.getElementById('celebration-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  btnYes.addEventListener('click', () => {
    sfx.playSuccess();
    triggerGrandConfetti();
    modal.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    modal.classList.remove('active');
    triggerHeartCelebration();
  });

  // 7. Interactive Claim Coupons
  const coupons = document.querySelectorAll('.coupon-item');
  coupons.forEach(coupon => {
    const claimBtn = coupon.querySelector('.claim-btn');
    claimBtn.addEventListener('click', () => {
      sfx.playClaim();
      coupon.classList.add('claimed');
      claimBtn.textContent = 'Redeemed! 🎉💖';
      fireMiniHeartBurst(coupon);
    });
  });
});

// Particles creator
function createBackgroundParticles() {
  const container = document.getElementById('particle-container');
  const emojis = ['👻', '💛', '💖', '✨', '🌸', '🥺', '💬', '🔥'];

  for (let i = 0; i < 22; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.fontSize = `${16 + Math.random() * 16}px`;
    container.appendChild(particle);
  }
}

// Confetti blast functions
function triggerGrandConfetti() {
  if (typeof confetti === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FFFC00', '#FF758F', '#FF4D6D']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#FFE066', '#FF85A1', '#70D6FF']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

function fireMiniHeartBurst(element) {
  if (typeof confetti === 'undefined') return;
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 25,
    spread: 60,
    origin: { x, y },
    colors: ['#FF758F', '#FF4D6D', '#FFFC00', '#FF85A1']
  });
}

function triggerHeartCelebration() {
  if (typeof confetti === 'undefined') return;
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF758F', '#FFFC00', '#FF4D6D']
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF758F', '#FFFC00', '#FF4D6D']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
