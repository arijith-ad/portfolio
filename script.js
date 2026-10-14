/**
 * ============================================================================
 * HARRY POTTER WIZARDING WORLD PORTFOLIO - ARIJITH M
 * Interactive Spellcraft, Audio Synthesizer, Wand Particle Engine & Snitch AI
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Audio Synthesizer (Web Audio API - No External Files Required)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a mystical bell note (Celesta simulation)
  function playMagicalNote(frequency, duration = 0.8, type = 'sine', volume = 0.25) {
    if (!isSoundEnabled || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

      // Celestial bell envelope: instant attack, long exponential release
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  // Play iconic Hedwig motif chords sequence
  function playHedwigThemeSnippet() {
    if (!isSoundEnabled) return;
    initAudio();

    // Notes: B4, E5, G5, F#5, E5, B5, A5, F#5
    const notes = [
      { f: 493.88, d: 0.6, delay: 0 },      // B4
      { f: 659.25, d: 0.8, delay: 600 },    // E5
      { f: 783.99, d: 0.4, delay: 1400 },   // G5
      { f: 739.99, d: 0.6, delay: 1800 },   // F#5
      { f: 659.25, d: 0.8, delay: 2400 },   // E5
      { f: 987.77, d: 0.6, delay: 3200 },   // B5
      { f: 880.00, d: 0.9, delay: 3800 },   // A5
      { f: 739.99, d: 1.2, delay: 4700 }    // F#5
    ];

    notes.forEach(item => {
      setTimeout(() => {
        playMagicalNote(item.f, item.d, 'sine', 0.2);
        // Harmonic overtone for that authentic magical music box chime
        playMagicalNote(item.f * 2, item.d * 0.7, 'triangle', 0.08);
      }, item.delay);
    });
  }

  // Sound effects for spells and clicks
  function playSpellSound(type) {
    if (!isSoundEnabled) return;
    initAudio();

    if (type === 'lumos') {
      playMagicalNote(880, 0.4, 'sine', 0.2);
      setTimeout(() => playMagicalNote(1318.51, 0.7, 'triangle', 0.25), 100);
      setTimeout(() => playMagicalNote(1760, 1.0, 'sine', 0.2), 250);
    } else if (type === 'leviosa') {
      playMagicalNote(523.25, 0.5, 'triangle', 0.2);
      setTimeout(() => playMagicalNote(659.25, 0.6, 'sine', 0.25), 150);
      setTimeout(() => playMagicalNote(1046.5, 0.8, 'sine', 0.2), 350);
    } else if (type === 'patronum') {
      playMagicalNote(392.00, 1.2, 'sine', 0.3);
      playMagicalNote(784.00, 1.0, 'triangle', 0.25);
      setTimeout(() => playMagicalNote(1174.66, 1.5, 'sine', 0.25), 200);
    } else if (type === 'snitch') {
      playMagicalNote(1046.50, 0.3, 'sine', 0.3);
      setTimeout(() => playMagicalNote(1318.51, 0.3, 'sine', 0.3), 120);
      setTimeout(() => playMagicalNote(1567.98, 0.3, 'sine', 0.3), 240);
      setTimeout(() => playMagicalNote(2093.00, 0.8, 'triangle', 0.4), 360);
    } else {
      // Wand zap
      playMagicalNote(600 + Math.random() * 400, 0.25, 'triangle', 0.15);
    }
  }

  // --------------------------------------------------------------------------
  // 2. Wand Cursor & Spark Particles Engine
  // --------------------------------------------------------------------------
  const wandCanvas = document.getElementById('wand-canvas');
  const wandCtx = wandCanvas ? wandCanvas.getContext('2d') : null;
  const wandCursor = document.getElementById('wand-cursor');

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, moving: false };
  let particles = [];

  function resizeCanvases() {
    if (wandCanvas) {
      wandCanvas.width = window.innerWidth;
      wandCanvas.height = window.innerHeight;
    }
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
    }
    const snitchCanvas = document.getElementById('snitch-canvas');
    if (snitchCanvas) {
      snitchCanvas.width = window.innerWidth;
      snitchCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // House-based spark palettes
  function getHouseSparksColor() {
    const body = document.body;
    if (body.classList.contains('house-slytherin')) {
      return ['#2a623d', '#52b788', '#d8f3dc', '#aaaaaa'];
    }
    if (body.classList.contains('house-ravenclaw')) {
      return ['#222f5b', '#00b4d8', '#90e0ef', '#d3a625'];
    }
    if (body.classList.contains('house-hufflepuff')) {
      return ['#ecb939', '#ffd166', '#f4a261', '#ffffff'];
    }
    // Gryffindor default
    return ['#eeba30', '#ffd700', '#ae0001', '#ffffff', '#ffaa00'];
  }

  class WandSpark {
    constructor(x, y, speedMult = 1, customColor = null) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 2.5) * speedMult;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed + 0.3; // slight gravity
      this.size = 1.5 + Math.random() * 3.5;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.03;
      
      const palette = getHouseSparksColor();
      this.color = customColor || palette[Math.floor(Math.random() * palette.length)];
      this.spin = Math.random() * 0.2 - 0.1;
      this.angle = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size = Math.max(0, this.size - 0.04);
      this.angle += this.spin;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Star-shaped spark
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 2, Math.sin((i * Math.PI) / 2) * this.size * 2);
        ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.5), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.5));
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function emitSparks(x, y, count = 3, speedMult = 1, color = null) {
    for (let i = 0; i < count; i++) {
      particles.push(new WandSpark(x, y, speedMult, color));
    }
    if (particles.length > 250) {
      particles.splice(0, particles.length - 250);
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moving = true;

    if (wandCursor) {
      wandCursor.style.display = 'block';
      wandCursor.style.left = `${e.clientX}px`;
      wandCursor.style.top = `${e.clientY}px`;
    }

    // Lumos spotlight position tracking
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

    // Emit light trail of sparks
    if (Math.random() > 0.3) {
      emitSparks(e.clientX, e.clientY, 2, 0.8);
    }
  });

  window.addEventListener('click', (e) => {
    emitSparks(e.clientX, e.clientY, 25, 2.8);
    playSpellSound('wand');
  });

  // Particle loop
  function animateSparks() {
    if (wandCtx && wandCanvas) {
      wandCtx.clearRect(0, 0, wandCanvas.width, wandCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(wandCtx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(animateSparks);
  }
  animateSparks();

  // --------------------------------------------------------------------------
  // 3. Mystical Background Starry Atmosphere
  // --------------------------------------------------------------------------
  const starsCanvas = document.getElementById('stars-canvas');
  if (starsCanvas) {
    const starCtx = starsCanvas.getContext('2d');
    const stars = [];
    const numStars = 75;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.015
      });
    }

    function renderStars() {
      starCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      for (let star of stars) {
        star.alpha += star.speed;
        const currentAlpha = Math.abs(Math.sin(star.alpha));
        starCtx.save();
        starCtx.globalAlpha = currentAlpha * 0.8;
        starCtx.fillStyle = '#ffd700';
        starCtx.shadowBlur = 8;
        starCtx.shadowColor = '#ffe680';
        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starCtx.fill();
        starCtx.restore();
      }
      requestAnimationFrame(renderStars);
    }
    renderStars();
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Golden Snitch Simulation
  // --------------------------------------------------------------------------
  const snitchCanvas = document.getElementById('snitch-canvas');
  const snitchToast = document.getElementById('snitch-toast');
  let snitchCaught = false;

  const snitch = {
    x: window.innerWidth * 0.75,
    y: window.innerHeight * 0.35,
    vx: 3,
    vy: -2,
    size: 14,
    wingAngle: 0,
    wingSpeed: 0.35,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 3,
    nextDartTimer: 0
  };

  function updateSnitch() {
    snitch.wingAngle += snitch.wingSpeed;

    // Pick new random destination waypoint every so often
    snitch.nextDartTimer--;
    if (snitch.nextDartTimer <= 0) {
      snitch.targetX = 60 + Math.random() * (window.innerWidth - 120);
      snitch.targetY = 80 + Math.random() * (window.innerHeight - 160);
      snitch.nextDartTimer = 90 + Math.floor(Math.random() * 140);
    }

    // Accelerate toward target with quick, erratic wizarding motion
    const dx = snitch.targetX - snitch.x;
    const dy = snitch.targetY - snitch.y;
    snitch.vx += dx * 0.0018;
    snitch.vy += dy * 0.0018;

    // Friction & speed limits
    snitch.vx *= 0.94;
    snitch.vy *= 0.94;

    snitch.x += snitch.vx;
    snitch.y += snitch.vy;

    // Snitch sparkles in flight
    if (Math.random() > 0.4) {
      emitSparks(snitch.x, snitch.y, 1, 0.4, '#ffd700');
    }
  }

  function drawSnitch(ctx) {
    if (!ctx) return;
    ctx.clearRect(0, 0, snitchCanvas.width, snitchCanvas.height);

    ctx.save();
    ctx.translate(snitch.x, snitch.y);

    // Feathery Silver-Gold Wings
    const wingFlap = Math.sin(snitch.wingAngle) * 22;

    ctx.save();
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-25, -28 + wingFlap, -45, -12 + wingFlap);
    ctx.quadraticCurveTo(-20, 2 + wingFlap, 0, 0);
    ctx.fillStyle = 'rgba(255, 250, 220, 0.75)';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(25, -28 + wingFlap, 45, -12 + wingFlap);
    ctx.quadraticCurveTo(20, 2 + wingFlap, 0, 0);
    ctx.fill();
    ctx.restore();

    // Golden Metallic Orb
    const orbGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, snitch.size);
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.35, '#ffdf00');
    orbGrad.addColorStop(0.8, '#d4af37');
    orbGrad.addColorStop(1, '#8b6914');

    ctx.beginPath();
    ctx.arc(0, 0, snitch.size, 0, Math.PI * 2);
    ctx.fillStyle = orbGrad;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#ffea6c';
    ctx.fill();

    // Intricate Quidditch Carvings
    ctx.strokeStyle = 'rgba(110, 75, 10, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, snitch.size * 0.65, -0.8, 1.2);
    ctx.stroke();

    ctx.restore();
  }

  function snitchLoop() {
    if (snitchCanvas) {
      const ctx = snitchCanvas.getContext('2d');
      updateSnitch();
      drawSnitch(ctx);
    }
    requestAnimationFrame(snitchLoop);
  }
  snitchLoop();

  // Catch the Golden Snitch Event
  if (snitchCanvas) {
    snitchCanvas.addEventListener('click', (e) => {
      const rect = snitchCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const dist = Math.hypot(clickX - snitch.x, clickY - snitch.y);
      if (dist < snitch.size + 24) {
        // Caught!
        emitSparks(snitch.x, snitch.y, 60, 3.5, '#ffd700');
        playSpellSound('snitch');
        
        if (snitchToast) {
          snitchToast.classList.add('show');
          setTimeout(() => snitchToast.classList.remove('show'), 5000);
        }

        // Snitch speeds away excitedly
        snitch.vx = (Math.random() - 0.5) * 30;
        snitch.vy = -20;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. 3D Floating Candles Generation (The Great Hall)
  // --------------------------------------------------------------------------
  const candleContainer = document.getElementById('floating-candles');
  if (candleContainer) {
    const candleCount = window.innerWidth < 768 ? 12 : 22;
    for (let i = 0; i < candleCount; i++) {
      const candle = document.createElement('div');
      candle.className = 'magic-candle';

      const leftPercent = 5 + Math.random() * 90;
      const topPercent = 5 + Math.random() * 75;
      const height = 45 + Math.random() * 35;
      const width = 10 + Math.random() * 4;
      const floatDuration = (4 + Math.random() * 5).toFixed(1) + 's';
      const floatDelta = `-${(15 + Math.random() * 20).toFixed(0)}px`;
      const flickerDuration = (0.8 + Math.random() * 1).toFixed(1) + 's';

      candle.style.left = `${leftPercent}%`;
      candle.style.top = `${topPercent}%`;
      candle.style.height = `${height}px`;
      candle.style.width = `${width}px`;
      candle.style.setProperty('--float-duration', floatDuration);
      candle.style.setProperty('--float-delta', floatDelta);
      candle.style.animationDelay = `-${(Math.random() * 4).toFixed(1)}s`;

      const flame = document.createElement('div');
      flame.className = 'candle-flame';
      flame.style.setProperty('--flicker-duration', flickerDuration);
      flame.style.animationDelay = `-${(Math.random() * 2).toFixed(1)}s`;

      candle.appendChild(flame);
      candleContainer.appendChild(candle);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Acceptance Letter Unfold & Seal Interaction
  // --------------------------------------------------------------------------
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const letterSection = document.getElementById('acceptance-letter-section');
  const breakSealBtn = document.getElementById('break-seal-btn');
  const parchmentDoc = document.getElementById('parchment-doc');

  if (openEnvelopeBtn && letterSection) {
    openEnvelopeBtn.addEventListener('click', () => {
      letterSection.scrollIntoView({ behavior: 'smooth' });
      playSpellSound('leviosa');
      if (parchmentDoc) {
        parchmentDoc.classList.add('open');
      }
    });
  }

  if (breakSealBtn && parchmentDoc) {
    breakSealBtn.addEventListener('click', (e) => {
      const rect = breakSealBtn.getBoundingClientRect();
      emitSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, 3, '#740001');
      playSpellSound('patronum');
      parchmentDoc.classList.toggle('open');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Marauder's Map Footsteps Timeline
  // --------------------------------------------------------------------------
  const marauderToggleBtn = document.getElementById('marauder-toggle-btn');
  const mapBtnText = document.getElementById('map-btn-text');
  const mischiefStatus = document.getElementById('mischief-status');
  let mapRevealed = true;

  if (marauderToggleBtn) {
    marauderToggleBtn.addEventListener('click', () => {
      mapRevealed = !mapRevealed;
      const waypoints = document.querySelectorAll('.map-waypoints .waypoint');
      const footstepPath = document.getElementById('footstep-path');

      if (mapRevealed) {
        mapBtnText.textContent = '"I solemnly swear that I am up to no good"';
        mischiefStatus.textContent = 'Footsteps actively revealed across Hogwarts grounds.';
        waypoints.forEach(wp => wp.classList.add('active'));
        if (footstepPath) footstepPath.style.opacity = '1';
        playSpellSound('leviosa');
      } else {
        mapBtnText.textContent = '"Mischief Managed"';
        mischiefStatus.textContent = 'The parchment turns blank. All traces vanished into thin air.';
        waypoints.forEach(wp => wp.classList.remove('active'));
        if (footstepPath) footstepPath.style.opacity = '0';
        playSpellSound('lumos');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. Interactive Spells Dock Toolbar (Lumos, Leviosa, Patronum, Alohomora, Nox)
  // --------------------------------------------------------------------------
  const spellButtons = document.querySelectorAll('.spell-btn');
  const lumosOverlay = document.getElementById('lumos-overlay');

  spellButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const spell = btn.getAttribute('data-spell');
      handleSpellCast(spell, btn);
    });
  });

  function handleSpellCast(spell, activeBtn) {
    // Reset other active button styles
    spellButtons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    const rect = activeBtn.getBoundingClientRect();
    emitSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, 2.2);

    if (spell === 'lumos') {
      document.body.classList.add('lumos-on');
      if (lumosOverlay) {
        lumosOverlay.classList.remove('lumos-hidden');
        lumosOverlay.classList.add('lumos-active');
      }
      playSpellSound('lumos');
    } else if (spell === 'nox') {
      document.body.classList.remove('lumos-on');
      if (lumosOverlay) {
        lumosOverlay.classList.remove('lumos-active');
        lumosOverlay.classList.add('lumos-hidden');
      }
      playMagicalNote(300, 0.4, 'sine', 0.2);
    } else if (spell === 'leviosa') {
      document.body.classList.toggle('leviosa-active');
      playSpellSound('leviosa');
    } else if (spell === 'patronum') {
      playSpellSound('patronum');
      // Silvery Patronus wave burst
      for (let i = 0; i < 90; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          emitSparks(x, y, 2, 2, '#e0f2fe');
        }, i * 20);
      }
    } else if (spell === 'alohomora') {
      playSpellSound('snitch');
      const projectsSection = document.getElementById('projects-section');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Gleam across project cards
      document.querySelectorAll('.vault-card-inner').forEach(card => {
        card.style.borderColor = '#ffd700';
        card.style.boxShadow = '0 0 35px rgba(255, 215, 0, 0.6)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }, 2500);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. Hogwarts House Theme Selector
  // --------------------------------------------------------------------------
  const houseButtons = document.querySelectorAll('.house-btn');
  houseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      houseButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const house = btn.getAttribute('data-house');
      document.body.classList.remove('house-gryffindor', 'house-slytherin', 'house-ravenclaw', 'house-hufflepuff');
      document.body.classList.add(`house-${house}`);

      playSpellSound('wand');
      const rect = btn.getBoundingClientRect();
      emitSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 2);
    });
  });

  // --------------------------------------------------------------------------
  // 10. Magical Audio Toggle & Hedwig Theme Trigger
  // --------------------------------------------------------------------------
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      initAudio();

      if (isSoundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggleBtn.classList.add('primary-gold');
        playHedwigThemeSnippet();
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggleBtn.classList.remove('primary-gold');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. Owl Post Contact Form Submission
  // --------------------------------------------------------------------------
  const owlForm = document.getElementById('owl-dispatch-form');
  const owlFlightBox = document.getElementById('owl-fly-animation');

  if (owlForm) {
    owlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('send-owl-btn');
      if (submitBtn) submitBtn.disabled = true;

      playSpellSound('patronum');
      if (owlFlightBox) {
        owlForm.style.display = 'none';
        owlFlightBox.classList.remove('hidden');

        setTimeout(() => {
          owlFlightBox.innerHTML = `
            <div style="font-size: 2.8rem; color: #4ade80;">✨📜✨</div>
            <h3 style="font-family: var(--font-title); color: #fff; margin-top: 0.8rem;">Owl Dispatched Successfully!</h3>
            <p style="color: #cad5e8;">Hedwig has delivered your scroll to <strong>Arijith M</strong>. Expect an enchanted response soon!</p>
            <button id="reset-owl-btn" class="magical-btn primary-gold" style="margin-top: 1.2rem;">Send Another Message</button>
          `;

          const resetBtn = document.getElementById('reset-owl-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              owlForm.reset();
              owlForm.style.display = 'flex';
              owlFlightBox.classList.add('hidden');
              if (submitBtn) submitBtn.disabled = false;
            });
          }
        }, 2200);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. Navigation Bar Scroll Elevation
  // --------------------------------------------------------------------------
  const magicNav = document.getElementById('magic-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      magicNav.classList.add('scrolled');
    } else {
      magicNav.classList.remove('scrolled');
    }
  });

})();
