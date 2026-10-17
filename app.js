/**
 * AKASHA COMMUNICATION - JAVASCRIPT LOGIC & INTERACTIVITY
 * Includes:
 * - Light / Dark Theme Switcher with localStorage persistence
 * - Dynamic Ether Particle Canvas (Sanskrit 5th element)
 * - Interactive Real-time Quote & Package Simulator
 * - 1-Click WhatsApp Order Generator (+229 01 60 81 70 92)
 * - Audio Visualizer & Web Audio API synthesizer for Voix-Off demo
 * - Quick form dispatch & smooth scrolling
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. THEME SWITCHER (LIGHT / DARK MODE)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('akasha-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-theme');
      body.classList.toggle('dark-theme', !isLight);
      const newTheme = isLight ? 'light' : 'dark';
      localStorage.setItem('akasha-theme', newTheme);
    });
  }

  /* ==========================================================================
     1. AMBIENT ETHER PARTICLE CANVAS (Performance & Mobile Optimized)
     ========================================================================== */
  const canvas = document.getElementById('ether-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let isTabVisible = !document.hidden;

    const isMobile = width <= 768;
    const particleCount = isMobile ? 16 : 38;
    const maxConnectionDist = isMobile ? 85 : 125;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.5 ? 'rgba(252, 0, 213, ' : 'rgba(42, 10, 235, ',
        alpha: Math.random() * 0.45 + 0.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35
      });
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 200);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        requestAnimationFrame(renderEther);
      }
    });

    function renderEther() {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);
      const isLightMode = body.classList.contains('light-theme');

      // Draw faint interconnecting ether lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = isLightMode ? 0.05 * (1 - dist / maxConnectionDist) : 0.10 * (1 - dist / maxConnectionDist);
            ctx.strokeStyle = isLightMode ? `rgba(42, 10, 235, ${lineAlpha})` : `rgba(160, 140, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const particleAlpha = isLightMode ? p.alpha * 0.7 : p.alpha;
        ctx.fillStyle = p.color + particleAlpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(renderEther);
    }
    renderEther();
  }

  /* ==========================================================================
     2. NAVBAR SCROLL, MOBILE MENU & TACTILE NAVIGATION
     ========================================================================== */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  let isNavClickScrolling = false;
  let navClickTimeout = null;

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Tactile click feedback & active class on navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.classList.remove('clicked');
      });
      link.classList.add('active', 'clicked');
      setTimeout(() => link.classList.remove('clicked'), 350);

      isNavClickScrolling = true;
      clearTimeout(navClickTimeout);
      navClickTimeout = setTimeout(() => {
        isNavClickScrolling = false;
      }, 900);

      if (navMenu && mobileToggle) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Dynamic Scrollspy: automatically highlight nav link matching current section in view
  const sectionsToWatch = [
    document.getElementById('agence'),
    document.getElementById('expertises'),
    document.getElementById('tarifs'),
    document.getElementById('formations'),
    document.getElementById('simulateur')
  ].filter(Boolean);

  function updateActiveNavOnScroll() {
    if (isNavClickScrolling) return;

    const scrollY = window.scrollY + 140;
    let currentSectionId = '';

    for (let i = sectionsToWatch.length - 1; i >= 0; i--) {
      const sec = sectionsToWatch[i];
      if (sec && sec.offsetTop <= scrollY) {
        currentSectionId = sec.id;
        break;
      }
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    } else if (window.scrollY < 200) {
      navLinks.forEach(link => link.classList.remove('active'));
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        updateActiveNavOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  updateActiveNavOnScroll();

  /* ==========================================================================
     3. INTERACTIVE QUOTE & PACKAGE SIMULATOR
     ========================================================================== */
  const state = {
    affiches: { name: '', cost: 0 },
    reels: { name: '', cost: 0 },
    scripts: { name: '', cost: 0 },
    montage: { name: '', cost: 0 },
    smm: { name: '', cost: 0 },
    addons: []
  };

  const totalDisplay = document.getElementById('calc-total-display');
  const summaryList = document.getElementById('summary-items-list');
  const whatsappQuoteBtn = document.getElementById('send-whatsapp-quote-btn');
  const checkScripts = document.getElementById('check-scripts');
  const addonChecks = document.querySelectorAll('.addon-check');

  function formatFCA(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function updateCalculatorUI() {
    let total = 0;
    const items = [];

    if (state.affiches.cost > 0) {
      total += state.affiches.cost;
      items.push({ name: state.affiches.name, price: state.affiches.cost });
    }

    if (state.reels.cost > 0) {
      total += state.reels.cost;
      items.push({ name: state.reels.name, price: state.reels.cost });
    }

    if (state.scripts.cost > 0) {
      total += state.scripts.cost;
      items.push({ name: state.scripts.name, price: state.scripts.cost });
    }

    if (state.montage.cost > 0) {
      total += state.montage.cost;
      items.push({ name: state.montage.name, price: state.montage.cost });
    }

    if (state.smm.cost > 0) {
      total += state.smm.cost;
      items.push({ name: state.smm.name, price: state.smm.cost });
    }

    state.addons.forEach(addon => {
      total += addon.cost;
      items.push({ name: addon.name, price: addon.cost });
    });

    // Update Display
    if (totalDisplay) {
      totalDisplay.textContent = formatFCA(total);
    }

    // Render itemized list
    if (summaryList) {
      if (items.length === 0) {
        summaryList.innerHTML = `<div class="empty-state-text">Sélectionnez des options à gauche pour calculer votre estimation en temps réel.</div>`;
      } else {
        summaryList.innerHTML = items.map(it => `
          <div class="selected-item-row">
            <span class="selected-item-name">${it.name}</span>
            <span class="selected-item-price">${formatFCA(it.price)} F</span>
          </div>
        `).join('');
      }
    }
  }

  // Pill selectors click handlers
  const pillSelectors = document.querySelectorAll('.sim-pill-selector');
  pillSelectors.forEach(group => {
    const groupName = group.getAttribute('data-group');
    const buttons = group.querySelectorAll('.sim-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cost = parseInt(btn.getAttribute('data-cost'), 10) || 0;
        const val = btn.getAttribute('data-val');

        if (cost > 0) {
          state[groupName] = { name: val, cost: cost };
        } else {
          state[groupName] = { name: '', cost: 0 };
        }

        updateCalculatorUI();
      });
    });
  });

  // Scripts option toggle
  if (checkScripts) {
    checkScripts.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.scripts = { name: 'Rédaction des scripts par Akasha', cost: 25000 };
      } else {
        state.scripts = { name: '', cost: 0 };
      }
      updateCalculatorUI();
    });
  }

  // Addons checkboxes (Voix off, Formations)
  addonChecks.forEach(check => {
    check.addEventListener('change', () => {
      state.addons = [];
      addonChecks.forEach(c => {
        if (c.checked) {
          state.addons.push({
            name: c.getAttribute('data-name'),
            cost: parseInt(c.getAttribute('data-cost'), 10) || 0
          });
        }
      });
      updateCalculatorUI();
    });
  });

  // Quick "Ajouter au simulateur +" from catalog cards
  const addButtons = document.querySelectorAll('.add-to-calc-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      const planName = btn.getAttribute('data-plan');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      // Scroll smoothly to simulator
      const simSection = document.getElementById('simulateur');
      if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Highlight corresponding pill
      if (category === 'Affiches') {
        const targetBtn = document.querySelector(`.sim-pill-selector[data-group="affiches"] .sim-btn[data-cost="${price}"]`);
        if (targetBtn) targetBtn.click();
      } else if (category === 'Réels') {
        const targetBtn = document.querySelector(`.sim-pill-selector[data-group="reels"] .sim-btn[data-cost="${price}"]`);
        if (targetBtn) targetBtn.click();
      } else if (category === 'Montage') {
        const targetBtn = document.querySelector(`.sim-pill-selector[data-group="montage"] .sim-btn[data-cost="${price}"]`);
        if (targetBtn) targetBtn.click();
      } else if (category === 'Social Media') {
        const targetBtn = document.querySelector(`.sim-pill-selector[data-group="smm"] .sim-btn[data-cost="${price}"]`);
        if (targetBtn) targetBtn.click();
      } else if (category === 'Voix Off') {
        const check = document.querySelector('.addon-check[data-cost="200000"]');
        if (check) { check.checked = true; check.dispatchEvent(new Event('change')); }
      } else if (category === 'Formation') {
        const check = document.querySelector(`.addon-check[data-cost="${price}"]`);
        if (check) { check.checked = true; check.dispatchEvent(new Event('change')); }
      }
    });
  });

  // WhatsApp Order Generator (Real WhatsApp +229 01 60 81 70 92)
  if (whatsappQuoteBtn) {
    whatsappQuoteBtn.addEventListener('click', () => {
      let total = 0;
      const orderLines = [];

      if (state.affiches.cost > 0) {
        total += state.affiches.cost;
        orderLines.push(`• Affiches : ${state.affiches.name}`);
      }
      if (state.reels.cost > 0) {
        total += state.reels.cost;
        orderLines.push(`• Réels : ${state.reels.name}`);
      }
      if (state.scripts.cost > 0) {
        total += state.scripts.cost;
        orderLines.push(`• Option Scripts rédigés : 25 000 F CFA`);
      }
      if (state.montage.cost > 0) {
        total += state.montage.cost;
        orderLines.push(`• Montage vidéo : ${state.montage.name}`);
      }
      if (state.smm.cost > 0) {
        total += state.smm.cost;
        orderLines.push(`• Social Media : ${state.smm.name}`);
      }
      state.addons.forEach(a => {
        total += a.cost;
        orderLines.push(`• ${a.name} : ${formatFCA(a.cost)} F CFA`);
      });

      let message = "";
      if (orderLines.length === 0) {
        message = `Bonjour AKASHA Communication, je souhaite obtenir un devis personnalisé pour mon projet. Pouvons-nous échanger ?`;
      } else {
        message = `*DEMANDE DE PRESTATION - AKASHA COMMUNICATION*\n\n` +
                  `Bonjour, je viens de configurer mes besoins sur votre site web :\n\n` +
                  orderLines.join('\n') + `\n\n` +
                  `*Total estimé :* ${formatFCA(total)} F CFA\n\n` +
                  `Je souhaite valider ces détails avec un conseiller.`;
      }

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/2290160817092?text=${encoded}`, '_blank');
    });
  }

  /* ==========================================================================
     4. VOIX OFF AUDIO DEMO PLAYER (Real HTML5 Audio with fallback)
     ========================================================================== */
  const playBtn = document.getElementById('audio-play-btn');
  const soundwaveWrap = document.getElementById('soundwave-wrap');
  const playIcon = playBtn ? playBtn.querySelector('.play-icon') : null;
  const pauseIcon = playBtn ? playBtn.querySelector('.pause-icon') : null;
  const audioStatus = document.getElementById('audio-status-text');
  const voiceAudio = document.getElementById('voice-demo-audio');

  let audioCtx = null;
  let isPlaying = false;
  let oscInterval = null;

  function toggleVoiceDemo() {
    if (!isPlaying) {
      startVoiceDemo();
    } else {
      stopVoiceDemo();
    }
  }

  function startVoiceDemo() {
    isPlaying = true;
    if (soundwaveWrap) soundwaveWrap.classList.add('playing');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (audioStatus) audioStatus.textContent = 'Voix Akasha en écoute...';

    // If an HTML5 audio element is available and has sources, attempt to play it
    if (voiceAudio) {
      const playPromise = voiceAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Fichier audio non chargé ou lecture bloquée, bascule sur la démo synthétisée.', err);
          runSynthFallback();
        });
      }
    } else {
      runSynthFallback();
    }
  }

  function stopVoiceDemo() {
    isPlaying = false;
    if (voiceAudio && !voiceAudio.paused) {
      voiceAudio.pause();
      voiceAudio.currentTime = 0;
    }
    if (oscInterval) clearInterval(oscInterval);
    if (soundwaveWrap) soundwaveWrap.classList.remove('playing');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (audioStatus) audioStatus.textContent = 'Écouter la démo vocale';
  }

  // Handle native audio ended event
  if (voiceAudio) {
    voiceAudio.addEventListener('ended', () => {
      stopVoiceDemo();
    });
    voiceAudio.addEventListener('pause', () => {
      if (isPlaying && voiceAudio.currentTime === voiceAudio.duration) {
        stopVoiceDemo();
      }
    });
  }

  function runSynthFallback() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const notes = [220, 277.18, 329.63, 440, 554.37, 659.25];
      let noteIndex = 0;

      function playChimeNote(freq) {
        if (!isPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      }

      playChimeNote(notes[0]);
      if (oscInterval) clearInterval(oscInterval);
      oscInterval = setInterval(() => {
        noteIndex = (noteIndex + 1) % notes.length;
        playChimeNote(notes[noteIndex]);
      }, 350);

      setTimeout(() => {
        if (isPlaying && (!voiceAudio || voiceAudio.paused)) {
          stopVoiceDemo();
        }
      }, 7000);

    } catch (e) {
      console.log('Audio Context error', e);
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleVoiceDemo();
    });
  }

  if (soundwaveWrap) {
    soundwaveWrap.addEventListener('click', () => {
      toggleVoiceDemo();
    });
  }

  /* ==========================================================================
     5. QUICK FORM DISPATCH TO WHATSAPP
     ========================================================================== */
  const contactForm = document.getElementById('quick-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-tel').value.trim();
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !phone || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Veuillez remplir tous les champs obligatoires.';
        }
        return;
      }

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Connexion à WhatsApp en cours...';
      }

      const formattedMsg = `*NOUVEAU MESSAGE DEPUIS LE SITE AKASHA*\n\n` +
                           `*Nom / Entreprise :* ${name}\n` +
                           `*Téléphone :* ${phone}\n` +
                           `*Service souhaité :* ${service}\n\n` +
                           `*Détails du projet :*\n${message}`;

      const waUrl = `https://wa.me/2290160817092?text=${encodeURIComponent(formattedMsg)}`;
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
        if (formFeedback) {
          formFeedback.textContent = 'Message préparé avec succès sur WhatsApp !';
        }
      }, 600);
    });
  }

  /* ==========================================================================
     6. CURRENT YEAR AUTO-UPDATE
     ========================================================================== */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
