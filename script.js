// Sound synthesizer using Web Audio API (100% standalone, zero network audio latency)
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
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  vibrate(pattern) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore vibration errors on unsupported devices
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
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.08);
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
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.28);
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
      const melody = [
        { f: 523.25, t: 0 },    // C5
        { f: 659.25, t: 0.1 },  // E5
        { f: 783.99, t: 0.2 },  // G5
        { f: 1046.50, t: 0.32 } // C6
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
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
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
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sfx.init();
    sfx.enabled = !sfx.enabled;
    soundBtn.querySelector('.sound-icon').textContent = sfx.enabled ? '🎵' : '🔇';
    soundBtn.querySelector('.sound-text').textContent = sfx.enabled ? 'Sound: ON' : 'Sound: OFF';
    if (sfx.enabled) {
      sfx.playPop();
      sfx.vibrate(25);
    }
  });

  // 3. Floating background particles (optimized for mobile fps)
  createBackgroundParticles();

  // 4. Interactive Envelope (tap on mobile)
  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
      sfx.playEnvelope();
      sfx.vibrate(35);
      envelope.classList.add('open');
      fireMiniHeartBurst(envelope);
    }
  });

  // 5. Mobile-Optimized Runaway "No" Button
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const noLabel = document.getElementById('no-label');
  const runawayHint = document.getElementById('runaway-hint');
  const playground = document.getElementById('playground');
  const dodgeBubble = document.getElementById('dodge-bubble');
  const dodgeText = document.getElementById('dodge-text');

  const funnyNoTexts = [
    "No, still mad! 😠",
    "Are you really sure? 🥺",
    "I'll buy you boba & snacks! 🧋",
    "Think of our Snap streak! 👻🔥",
    "Pretty please with a cherry on top? 🍒",
    "Wait, look how big YES is! 👉",
    "Error: 'No' button is broken 🤖",
    "Hear me out, please! 😭",
    "You know you want to forgive me! 💕",
    "System override: YES is only option! ✨"
  ];

  const wittyDodgeBubbles = [
    "Too slow! 😜",
    "Nice try, babe! 🏃💨",
    "Can't touch this! 🎶",
    "Look at the YES button! 💖",
    "You smiled, I saw that! 🤭",
    "Give this silly boy a chance! 🥺"
  ];

  let noAttempts = 0;
  let yesScale = 1.0;

  function dodgeNoButton(e) {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    noAttempts++;
    sfx.playPop();
    sfx.vibrate(30);

    // Update label & bubble
    noLabel.textContent = funnyNoTexts[noAttempts % funnyNoTexts.length];
    dodgeText.textContent = wittyDodgeBubbles[noAttempts % wittyDodgeBubbles.length];
    dodgeBubble.style.transform = 'scale(1.08)';
    setTimeout(() => {
      dodgeBubble.style.transform = 'scale(1)';
    }, 200);

    // Grow Yes button smoothly, capped for mobile layout
    yesScale = Math.min(yesScale + 0.1, 1.45);
    btnYes.style.transform = `scale(${yesScale})`;

    // Mobile safe boundary math: prevent running off screen
    const playgroundRect = playground.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxShiftX = Math.max(20, (playgroundRect.width - btnRect.width) / 2 - 8);
    const maxShiftY = 45; // safe vertical boundary within container

    // Alternate directions so it jumps across
    const directionX = (noAttempts % 2 === 1) ? 1 : -1;
    const randomDistanceX = (0.4 + Math.random() * 0.6) * maxShiftX * directionX;
    const randomDistanceY = (Math.random() - 0.5) * 2 * maxShiftY;

    btnNo.style.transform = `translate(${randomDistanceX}px, ${randomDistanceY}px)`;

    runawayHint.textContent = `Attempt #${noAttempts}: Hehe, you can't click No! 😜`;
    runawayHint.style.color = '#FF4D6D';
  }

  // Pointer & touch events for instant mobile response
  btnNo.addEventListener('pointerdown', dodgeNoButton);
  btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
  btnNo.addEventListener('mouseenter', dodgeNoButton);
  btnNo.addEventListener('click', dodgeNoButton);

  // 6. "YES" Button & Grand Celebration
  const modal = document.getElementById('celebration-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');

  btnYes.addEventListener('click', () => {
    sfx.playSuccess();
    sfx.vibrate([60, 50, 100, 50, 150]);
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
      sfx.vibrate(40);
      coupon.classList.add('claimed');
      claimBtn.textContent = 'Claimed! 🎉💖';
      fireMiniHeartBurst(coupon);
    });
  });
});

// Particles creator (mobile optimized count)
function createBackgroundParticles() {
  const container = document.getElementById('particle-container');
  const emojis = ['👻', '💛', '💖', '✨', '🌸', '🥺', '💬'];
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${7 + Math.random() * 6}s`;
    particle.style.animationDelay = `${Math.random() * 7}s`;
    particle.style.fontSize = `${14 + Math.random() * 14}px`;
    container.appendChild(particle);
  }
}

// Confetti blast functions
function triggerGrandConfetti() {
  if (typeof confetti === 'undefined') return;

  const count = window.innerWidth < 600 ? 140 : 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, {
    spread: 28,
    startVelocity: 50,
    colors: ['#FFFC00', '#FF758F', '#FF4D6D']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#FFE066', '#FF85A1', '#70D6FF']
  });
  fire(0.35, {
    spread: 90,
    decay: 0.91,
    scalar: 0.85
  });
  fire(0.1, {
    spread: 110,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.1
  });
  fire(0.1, {
    spread: 110,
    startVelocity: 40,
  });
}

function fireMiniHeartBurst(element) {
  if (typeof confetti === 'undefined') return;
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 22,
    spread: 55,
    origin: { x, y },
    colors: ['#FF758F', '#FF4D6D', '#FFFC00', '#FF85A1']
  });
}

function triggerHeartCelebration() {
  if (typeof confetti === 'undefined') return;
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 50,
      origin: { x: 0 },
      colors: ['#FF758F', '#FFFC00', '#FF4D6D']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 50,
      origin: { x: 1 },
      colors: ['#FF758F', '#FFFC00', '#FF4D6D']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
