window.KodiFoodie = [
    "Hungry? Prashant says a well-fed dev writes cleaner code! 🍽️",
    "Do you want to eat something? Prashant is cooking up ideas! 👨‍🍳",
    "My developer is a total foodie! Ask him for a recipe 😋",
    "Prashant is a really good cook: tasty code, tastier curry! 🍛",
    "Marshmallows are dessert, Prashant cooks the main course! 🍢",
    "Fun fact: Prashant plates his code as neatly as his dinner! 🍽️",
    "Good code, good chai, good food: Prashant's recipe for joy! ☕",
    "Prashant stirs a pot like he tunes Kafka: patiently! 🥘",
    "Hungry? Let's talk food first, Spring Boot second! 🍕",
    "Debug on an empty stomach? Never! Prashant cooks first! 🍳",
    "A good cook and a good engineer: Prashant seasons both well! 🧂",
    "Want to eat? Prashant's kitchen is as organised as his code! 🍲"
  ];
window.ThemeColors = { green: '#a1f4c2', blue: '#8eb5ff', purple: '#c0a5ff', greenRgb: '161, 244, 194', blueRgb: '142, 181, 255' };
/**
 * Prashant Kumar Tiwary - Engineering Portfolio
 * Fully Dynamic Interactive Engine:
 * - Dynamic Background Mesh Canvas
 * - Top Scroll Progress Bar & Glassmorphic Scrolled Header
 * - Active Scroll Spy Navigation
 * - Typewriter Text Rotator in Hero
 * - Live IST Clock & Status
 * - Magnetic Button Physics & Internal Radial Spotlight
 * - Button Ripple Wave Effects
 * - Interactive IDE & Terminal Window with Command System & Build Simulation
 * - Real-time Skills Search & Category Filter with Tag Clicks
 * - Animated Stats Counters (IntersectionObserver)
 * - 3D Card Tilt Effects
 * - Floating Back to Top Button with SVG Circular Progress
 * - Toast Notification System
 * - Copy Email Actions & Contact Modal
 */

(function () {
  'use strict';

  // --- 1. TOAST NOTIFICATION SYSTEM ---
  function showToast(message, icon = '✓') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3200);
  }
  window.showToast = showToast;

  // --- 2. INTERACTIVE BACKGROUND MESH CANVAS ---
  function initNetworkCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let nodes = [];
    const nodeCount = window.innerWidth < 768 ? 24 : 45;
    const maxDistance = 140;
    let mouse = { x: -9999, y: -9999, radius: 150 };
    let animationFrameId = null;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', () => {
      resize();
      initNodes();
    }, { passive: true });

    class Node {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 1.2;
        this.useGreen = Math.random() > 0.4;
        this.pulse = Math.random() * Math.PI;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.03;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.5;
          this.x -= (dx / dist) * force * 5;
          this.y -= (dy / dist) * force * 5;
        }
      }
      draw() {
        const glow = 0.5 + Math.sin(this.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + (this.useGreen ? ThemeColors.greenRgb : ThemeColors.blueRgb) + ', ' + glow + ')';
        ctx.shadowColor = ThemeColors.green;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
      }
    }
    initNodes();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });

    // Packets traveling along lines
    let packets = [];
    setInterval(() => {
      if (document.hidden || nodes.length < 2) return;
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      for (let b of nodes) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 30 && d < maxDistance) {
          packets.push({ from: a, to: b, progress: 0, speed: 0.025 + Math.random() * 0.02 });
          if (packets.length > 8) packets.shift();
          break;
        }
      }
    }, 1200);

    function animate() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].update();
          nodes[i].draw();

          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.16;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(${ThemeColors.greenRgb}, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Connect to mouse if near
          const mdx = mouse.x - nodes[i].x;
          const mdy = mouse.y - nodes[i].y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            const alpha = (1 - mdist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${ThemeColors.greenRgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw packets
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          p.progress += p.speed;
          if (p.progress >= 1) {
            packets.splice(i, 1);
            continue;
          }
          const px = p.from.x + (p.to.x - p.from.x) * p.progress;
          const py = p.from.y + (p.to.y - p.from.y) * p.progress;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = ThemeColors.green;
          ctx.shadowColor = ThemeColors.green;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });
  }

  // --- 3. SCROLL PROGRESS BAR, SCROLLED HEADER & SCROLL SPY ---
  function initScrollSystem() {
    const progressBar = document.getElementById('scrollProgressBar');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      if (header) {
        if (scrollY > 40) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }

      // Scroll Spy
      let currentSectionId = '';
      const offset = 180;
      sections.forEach((sec) => {
        const top = sec.offsetTop - offset;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}` || (currentSectionId === 'home' && href === 'index.html')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 4. HERO TYPEWRITER EFFECT ---
  function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const words = [
      'Kumar Tiwary.',
      'Backend Engineer.',
      'Spring Boot Specialist.',
      'Distributed Systems Builder.',
      'Kafka & Cloud Enthusiast.'
    ];

    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = true;
    let speed = 70;

    function tick() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        el.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        speed = 35;
      } else {
        el.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        speed = 70;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        speed = 2200; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400; // Pause before new word
      }

      setTimeout(tick, speed);
    }

    // Start after 2.5s
    setTimeout(tick, 2500);
  }

  // --- 5. LIVE CLOCK IN HERO ---
  function initLiveClock() {
    const clockEl = document.getElementById('liveTime');
    if (!clockEl) return;

    function updateTime() {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        clockEl.textContent = `${timeStr} IST`;
      } catch (e) {
        // fallback
      }
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- 6. MAGNETIC BUTTON PHYSICS & RADIAL SPOTLIGHT ---
  function initMagneticButtons() {
    const interactives = document.querySelectorAll(
      '.button, .skill-tab-btn, .filter-button, .nav-cta, .term-chip, .header-social-pill, .quick-badge'
    );

    interactives.forEach((btn) => {
      // Spotlight coordinate tracking
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--mouse-x', `${x}px`);
        btn.style.setProperty('--mouse-y', `${y}px`);

        // Subtle magnetic pull for interactive buttons and pills
        if (
          btn.classList.contains('button') ||
          btn.classList.contains('nav-cta') ||
          btn.classList.contains('header-social-pill') ||
          btn.classList.contains('quick-badge')
        ) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const deltaX = (x - centerX) * 0.16;
          const deltaY = (y - centerY) * 0.16;
          btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (
          btn.classList.contains('button') ||
          btn.classList.contains('nav-cta') ||
          btn.classList.contains('header-social-pill') ||
          btn.classList.contains('quick-badge')
        ) {
          btn.style.transform = '';
        }
      });

      // Ripple effect
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('btn-ripple');

        const existing = btn.querySelector('.btn-ripple');
        if (existing) existing.remove();

        btn.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
      });
    });
  }

  // --- 7. BACK TO TOP FLOATING BUTTON WITH SVG CIRCULAR PROGRESS ---
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const circle = btn.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * 24; // r = 24 => ~150.8

    if (circle) {
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      if (scrollY > 280) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }

      if (circle) {
        const offset = circumference - progress * circumference;
        circle.style.strokeDashoffset = `${offset}`;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 8. INTERACTIVE DEVELOPER STUDIO / IDE & TERMINAL ---
  function initCodeStudio() {
    const windowEl = document.querySelector('.code-window');
    if (!windowEl) return;

    const tabs = windowEl.querySelectorAll('.window-tab');
    const panes = windowEl.querySelectorAll('.tab-content');
    const copyBtn = document.getElementById('copyCodeBtn');
    const runBtn = document.getElementById('runCodeBtn');
    const termHistory = document.getElementById('terminalHistory');
    const termInput = document.getElementById('terminalInput');
    const chips = windowEl.querySelectorAll('.term-chip');

    // Tab switching
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        panes.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        if (targetId === 'tabTerminal' && termInput) {
          termInput.focus();
        }
      });
    });

    // Copy active tab content
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const activePane = windowEl.querySelector('.tab-content.active');
        if (!activePane) return;
        const textToCopy = activePane.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Code copied to clipboard! 📋', '✓');
          copyBtn.innerHTML = '<span>✓</span> Copied';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>📋</span> Copy';
          }, 2000);
        });
      });
    }

    // Run code simulation
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        // Switch to terminal tab
        const termTab = windowEl.querySelector('[data-tab="tabTerminal"]');
        if (termTab) termTab.click();

        appendTerminalLine('<span class="log-blue">$</span> ./gradlew bootRun --info', 'log-blue');
        appendTerminalLine('<span class="log-muted">[0.02s]</span> Initializing JVM 21 (GraalVM CE)...', 'log-muted');

        setTimeout(() => {
          appendTerminalLine('<span class="log-muted">[0.12s]</span> Connected to Apache Kafka Cluster (3 brokers ready)', 'log-muted');
        }, 300);

        setTimeout(() => {
          appendTerminalLine('<span class="log-muted">[0.25s]</span> Spring WebFlux reactive endpoints mapped on port :8080', 'log-muted');
        }, 600);

        setTimeout(() => {
          appendTerminalLine('<span class="log-green">✔ BUILD SUCCESSFUL</span> in 320ms — 0 errors, 100% test coverage.', 'log-green');
          showToast('Service compiled & verified! 🚀', '⚡');
        }, 900);
      });
    }

    // Terminal command execution
    function appendTerminalLine(html, className = '') {
      if (!termHistory) return;
      const line = document.createElement('div');
      line.className = `log-line ${className}`;
      line.innerHTML = html;
      termHistory.appendChild(line);
      termHistory.scrollTop = termHistory.scrollHeight;
    }

    function executeCommand(cmd) {
      const cleanCmd = cmd.trim().toLowerCase();
      if (!cleanCmd) return;

      appendTerminalLine(`<span class="log-green">prashant@portfolio:~$</span> ${cmd}`);

      switch (cleanCmd) {
        case 'help':
          appendTerminalLine('Available commands:', 'log-yellow');
          appendTerminalLine('  <b class="log-green">skills</b>     - Display core backend stack');
          appendTerminalLine('  <b class="log-green">experience</b> - Show current and previous roles');
          appendTerminalLine('  <b class="log-green">repos</b>      - List featured GitHub repositories');
          appendTerminalLine('  <b class="log-green">certs</b>      - List cloud & Java credentials');
          appendTerminalLine('  <b class="log-green">contact</b>    - Get direct email and LinkedIn info');
          appendTerminalLine('  <b class="log-green">dog</b>        - Pet Byte the Java watchdog mascot 🐶');
          appendTerminalLine('  <b class="log-green">status</b>     - Check system uptime and current role');
          appendTerminalLine('  <b class="log-green">clear</b>      - Clear terminal window');
          break;

        case 'bear':
        case 'kodi':
        case 'marshmallow':
        case 'campfire':
        case 'dog':
        case 'bark':
        case 'pet':
        case 'fetch':
          if (window.petByteMascot) {
            window.petByteMascot();
          }
          appendTerminalLine('[CAMPFIRE-BEAR]: 🐻 Roasting marshmallows by the Java fire!', 'log-green');
          appendTerminalLine('   ʕ •ᴥ• ʔ', 'log-yellow');
          appendTerminalLine('   (  u u)~🍢  "0 NullPointerExceptions detected!"', 'log-blue');
          appendTerminalLine('● 100% tests passing · Kafka consumer lag: 0ms', 'log-green');
          break;

        case 'skills':
          appendTerminalLine('Core Stack: Java 21, Spring Boot, Kafka, Reactive (WebFlux), Kubernetes, PostgreSQL, AWS, Docker, GitOps', 'log-blue');
          break;

        case 'experience':
          appendTerminalLine('• Publicis Sapient (Mar 2025 – Present): Senior Associate Platform L1', 'log-purple');
          appendTerminalLine('• EPAM Systems (Sep 2024 – Feb 2025): Software Engineer', 'log-muted');
          appendTerminalLine('• Infosys (Jun 2022 – Sep 2024): Senior Associate Consultant', 'log-muted');
          appendTerminalLine('• Wipro (Jul 2019 – Jun 2022): Associate Consultant', 'log-muted');
          break;

        case 'repos':
          appendTerminalLine('1. OrderFlow - Event-driven microservices with Kafka & Helm', 'log-blue');
          appendTerminalLine('2. AWS End-to-End CI/CD Portfolio Platform', 'log-blue');
          appendTerminalLine('3. Java-Reactive-Programming & Spring-Webflux', 'log-blue');
          appendTerminalLine('4. K8sFromScratch & DevOps learning tracks', 'log-blue');
          appendTerminalLine('Run `open projects.html` to inspect all repositories.', 'log-yellow');
          break;

        case 'certs':
          appendTerminalLine('• AWS Certified Cloud Practitioner', 'log-green');
          appendTerminalLine('• Google Cloud Associate Cloud Engineer & Cloud Digital Leader', 'log-green');
          appendTerminalLine('• Microsoft Azure Fundamentals (AZ-900)', 'log-green');
          appendTerminalLine('• Oracle Certified Professional: Java SE 8 Programmer', 'log-green');
          break;

        case 'contact':
          appendTerminalLine('Email: hello@mylearningdesk.in', 'log-green');
          appendTerminalLine('LinkedIn: linkedin.com/in/prashant-kumar-tiwary-a7a741161/', 'log-blue');
          appendTerminalLine('GitHub: github.com/prashantkrt', 'log-purple');
          break;

        case 'status':
          appendTerminalLine('Status: ● ONLINE | Role: Senior Associate Platform L1 @ Publicis Sapient', 'log-green');
          break;

        case 'clear':
          termHistory.innerHTML = '';
          break;

        default:
          appendTerminalLine(`command not found: "${cleanCmd}". Type <span class="log-yellow">help</span> for commands.`, 'log-muted');
          break;
      }
    }

    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = termInput.value;
          termInput.value = '';
          executeCommand(val);
        }
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) executeCommand(cmd);
      });
    });
  }

  // --- 9. DYNAMIC SKILLS FILTER & REAL-TIME SEARCH ---
  function initSkillsFilter() {
    const searchInput = document.getElementById('skillSearch');
    const clearBtn = document.getElementById('clearSkillSearch');
    const tabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const countStatus = document.getElementById('skillsCountStatus');
    const emptyState = document.getElementById('skillsEmptyState');

    let currentCategory = 'all';
    let searchQuery = '';

    function filterSkills() {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      skillCards.forEach((card) => {
        const category = card.dataset.category || '';
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tags span'))
          .map((t) => t.textContent.toLowerCase())
          .join(' ');

        const matchesCat = currentCategory === 'all' || category.includes(currentCategory);
        const matchesQuery = !q || title.includes(q) || desc.includes(q) || tags.includes(q);

        if (matchesCat && matchesQuery) {
          card.classList.remove('skill-hidden');
          visibleCount++;
        } else {
          card.classList.add('skill-hidden');
        }
      });

      if (countStatus) {
        countStatus.textContent = `Showing ${visibleCount} of ${skillCards.length} technologies`;
      }

      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'block';
          const querySpan = emptyState.querySelector('.empty-query');
          if (querySpan) querySpan.textContent = q ? `"${q}"` : 'selected filter';
        } else {
          emptyState.style.display = 'none';
        }
      }

      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
    }

    // Category button clicks
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.skillCat || 'all';
        filterSkills();
      });
    });

    // Search input with instant filtering
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterSkills();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        filterSkills();
        if (searchInput) searchInput.focus();
      });
    }

    // Reset button in empty state
    const resetBtn = document.getElementById('resetSkillsFilter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        currentCategory = 'all';
        tabBtns.forEach((b) => b.classList.remove('active'));
        const allTab = document.querySelector('.skill-tab-btn[data-skill-cat="all"]');
        if (allTab) allTab.classList.add('active');
        filterSkills();
      });
    }

    // Clicking any tag pill in cards sets search query!
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.tags span');
      if (tag && tag.closest('#skills')) {
        const text = tag.textContent.trim();
        if (searchInput) {
          searchInput.value = text;
          searchQuery = text;
          currentCategory = 'all';
          tabBtns.forEach((b) => b.classList.remove('active'));
          const allTab = document.querySelector('.skill-tab-btn[data-skill-cat="all"]');
          if (allTab) allTab.classList.add('active');
          filterSkills();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast(`Filtered by tag: "${text}"`, '🔍');
        }
      }
    });
  }

  // --- 10. ANIMATED STATS COUNTERS ---
  function initStatsCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statCards.forEach((card) => {
              const target = parseInt(card.dataset.count, 10);
              const counterEl = card.querySelector('.counter');
              if (!counterEl || isNaN(target)) return;

              const duration = 1600;
              const startTime = performance.now();

              function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = Math.floor(ease * target);
                counterEl.textContent = currentVal;

                if (progress < 1) {
                  requestAnimationFrame(updateCount);
                } else {
                  counterEl.textContent = target;
                }
              }
              requestAnimationFrame(updateCount);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const bar = document.querySelector('.stats-bar');
    if (bar) observer.observe(bar);
  }

  // --- 11. 3D CARD TILT EFFECTS ---
  function initTiltEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
      return;
    }

    const tiltableCards = document.querySelectorAll(
      '.skill-card, .cert-card, .stat-card, .principles article, .journey-callout'
    );

    tiltableCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -((y - centerY) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- 12. SCROLL REVEAL OBSERVER (fade-up for text blocks, pop-scale + stagger for cards) ---
  function initScrollReveal() {
    const fadeElements = document.querySelectorAll(
      '.section-title, .about-layout, .timeline-item, .skills-filter-container, .quick-links, .stats-bar, .journey-callout'
    );
    const popElements = document.querySelectorAll(
      '.stat-card, .skill-card, .cert-card, .principles article, .project-card, .directory-card'
    );

    fadeElements.forEach((el) => el.classList.add('reveal'));
    popElements.forEach((el, i) => {
      el.classList.add('reveal-pop');
      el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach((el) => observer.observe(el));
    popElements.forEach((el) => observer.observe(el));
  }

  // --- SKILL PROFICIENCY METERS ---
  function initSkillMeters() {
    const cards = document.querySelectorAll('.skill-card[data-level]');
    if (!cards.length) return;

    cards.forEach((card) => {
      const level = clamp(parseInt(card.dataset.level, 10) || 0, 0, 100);
      const tags = card.querySelector('.tags');
      if (!tags) return;

      const meter = document.createElement('div');
      meter.className = 'skill-meter';
      meter.setAttribute('role', 'img');
      meter.setAttribute('aria-label', `Hands-on depth: ${level}%`);
      meter.innerHTML =
        '<div class="skill-meter-track"><span class="skill-meter-fill"></span></div>' +
        `<span class="skill-meter-pct">${level}%</span>`;
      tags.insertAdjacentElement('afterend', meter);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          const level = clamp(parseInt(card.dataset.level, 10) || 0, 0, 100);
          const fill = card.querySelector('.skill-meter-fill');
          if (fill) requestAnimationFrame(() => { fill.style.width = level + '%'; });
          observer.unobserve(card);
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // --- TIMELINE SCROLL PROGRESS LINE ---
  function initTimelineProgress() {
    const bar = document.getElementById('timelineProgress');
    const track = document.querySelector('.timeline');
    if (!bar || !track) return;

    let ticking = false;
    function update() {
      ticking = false;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const progress = clamp((start - rect.top) / Math.max(rect.height, 1), 0, 1);
      bar.style.height = (progress * 100) + '%';
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // --- HERO ART MOUSE PARALLAX ---
  function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;

    const art = document.querySelector('.hero-art');
    const codeWindow = document.querySelector('.code-window');
    const orbit1 = document.querySelector('.orbit-1');
    const orbit2 = document.querySelector('.orbit-2');
    if (!art || !codeWindow) return;

    art.addEventListener('mousemove', (e) => {
      const rect = art.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      codeWindow.style.transform =
        `perspective(1200px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
      if (orbit1) orbit1.style.transform = `rotate(-27deg) translate(${(x * 14).toFixed(1)}px, ${(y * 14).toFixed(1)}px)`;
      if (orbit2) orbit2.style.transform = `rotate(39deg) translate(${(-x * 18).toFixed(1)}px, ${(-y * 18).toFixed(1)}px)`;
    }, { passive: true });

    art.addEventListener('mouseleave', () => {
      codeWindow.style.transform = '';
      if (orbit1) orbit1.style.transform = 'rotate(-27deg)';
      if (orbit2) orbit2.style.transform = 'rotate(39deg)';
    });
  }

  // --- AMBIENT CURSOR GLOW ---
  function initCursorGlow() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!active) {
        active = true;
        glow.classList.add('active');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      active = false;
      glow.classList.remove('active');
    });

    function tick() {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      glow.style.transform = `translate(${curX.toFixed(1)}px, ${curY.toFixed(1)}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // --- 13. COPY EMAIL BUTTONS ---
  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy-email]');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = btn.dataset.copyEmail || 'hello@mylearningdesk.in';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard! 📋`, '✓');
          const originalHTML = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = '<span>✓</span> Copied!';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
          }, 2400);
        });
      });
    });
  }

  // --- 14. MOBILE MENU & CONTACT MODAL ---
  function initMenuAndModal() {
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (menuButton && nav) {
      menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = nav.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(open));
      });
      // Close menu when clicking any nav link, button, or mobile social link
      nav.querySelectorAll('a, button').forEach((el) =>
        el.addEventListener('click', () => {
          nav.classList.remove('open');
          menuButton.setAttribute('aria-expanded', 'false');
        })
      );
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !menuButton.contains(e.target)) {
          nav.classList.remove('open');
          menuButton.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const contactModal = document.getElementById('contactModal');
    const openContactButtons = document.querySelectorAll('.contact-open');
    const closeContactButtons = document.querySelectorAll('[data-modal-close]');

    const closeContactModal = () => {
      if (!contactModal) return;
      contactModal.classList.remove('open');
      contactModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    };

    openContactButtons.forEach((button) =>
      button.addEventListener('click', () => {
        if (!contactModal) return;
        contactModal.classList.add('open');
        contactModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const first = contactModal.querySelector('input[name="name"]');
        if (first) first.focus();
      })
    );

    closeContactButtons.forEach((button) =>
      button.addEventListener('click', closeContactModal)
    );

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeContactModal();
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        if (!contactForm.reportValidity()) {
          event.preventDefault();
          return;
        }
        const feedback = document.getElementById('formFeedback');
        const button = contactForm.querySelector('button[type="submit"]');
        if (feedback) feedback.textContent = 'Sending your message…';
        if (button) {
          button.disabled = true;
          button.innerHTML = 'Sending…';
        }
      });
    }
  }

  // --- 14b. CENTRAL HIGH-FIDELITY SOUND EFFECTS ENGINE ---
  const SoundFX = {
    _ctx: null,
    getCtx() {
      if (!this._ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this._ctx = new AudioCtx();
        }
      }
      if (this._ctx && this._ctx.state === 'suspended') {
        this._ctx.resume().catch(() => {});
      }
      return this._ctx;
    },

    // 1. Kodi cartoon "PONG PONG / BOING" high jump sound
    kodiJump() {
      try {
        const ac = this.getCtx();
        if (!ac) return;
        const t = ac.currentTime;

        // Primary spring wobble: bouncy cartoon frequency sweep
        const osc1 = ac.createOscillator();
        const gain1 = ac.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(200, t);
        osc1.frequency.exponentialRampToValueAtTime(720, t + 0.12);
        osc1.frequency.exponentialRampToValueAtTime(320, t + 0.28);
        osc1.frequency.exponentialRampToValueAtTime(580, t + 0.44);
        osc1.frequency.exponentialRampToValueAtTime(240, t + 0.62);

        gain1.gain.setValueAtTime(0.3, t);
        gain1.gain.linearRampToValueAtTime(0.35, t + 0.08);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

        osc1.connect(gain1);
        gain1.connect(ac.destination);
        osc1.start(t);
        osc1.stop(t + 0.66);

        // Secondary "pong" pop overtone
        const osc2 = ac.createOscillator();
        const gain2 = ac.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(380, t);
        osc2.frequency.exponentialRampToValueAtTime(880, t + 0.14);
        gain2.gain.setValueAtTime(0.24, t);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc2.connect(gain2);
        gain2.connect(ac.destination);
        osc2.start(t);
        osc2.stop(t + 0.3);
      } catch (e) {}
    },

    // 1b. Kodi cartoon Jump, Fall & 360° Somersault Roll sound
    kodiJumpRoll() {
      try {
        const ac = this.getCtx();
        if (!ac) return;
        const t = ac.currentTime;

        // Stage 1: Spring launch boing (0.0s - 0.35s)
        const osc1 = ac.createOscillator();
        const gain1 = ac.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, t);
        osc1.frequency.exponentialRampToValueAtTime(780, t + 0.16);
        osc1.frequency.exponentialRampToValueAtTime(540, t + 0.35);
        gain1.gain.setValueAtTime(0.32, t);
        gain1.gain.exponentialRampToValueAtTime(0.16, t + 0.35);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
        osc1.connect(gain1);
        gain1.connect(ac.destination);
        osc1.start(t);
        osc1.stop(t + 0.43);

        // Stage 2: Mid-air tumble & whoosh (0.32s - 0.60s)
        const osc2 = ac.createOscillator();
        const gain2 = ac.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(640, t + 0.32);
        osc2.frequency.exponentialRampToValueAtTime(180, t + 0.58);
        gain2.gain.setValueAtTime(0.001, t + 0.32);
        gain2.gain.linearRampToValueAtTime(0.24, t + 0.42);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
        osc2.connect(gain2);
        gain2.connect(ac.destination);
        osc2.start(t + 0.32);
        osc2.stop(t + 0.63);

        // Stage 3: Ground impact & roll (0.58s - 0.74s)
        const osc3 = ac.createOscillator();
        const gain3 = ac.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(170, t + 0.58);
        osc3.frequency.exponentialRampToValueAtTime(75, t + 0.68);
        gain3.gain.setValueAtTime(0.36, t + 0.58);
        gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.73);
        osc3.connect(gain3);
        gain3.connect(ac.destination);
        osc3.start(t + 0.58);
        osc3.stop(t + 0.74);

        // Stage 4: Spring recovery double-bounce (0.78s - 1.05s)
        [0.78, 0.88].forEach((delay, idx) => {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.type = 'sine';
          const f0 = idx === 0 ? 340 : 500;
          osc.frequency.setValueAtTime(f0, t + delay);
          osc.frequency.exponentialRampToValueAtTime(f0 * 1.6, t + delay + 0.08);
          g.gain.setValueAtTime(0.24, t + delay);
          g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.12);
          osc.connect(g);
          g.connect(ac.destination);
          osc.start(t + delay);
          osc.stop(t + delay + 0.13);
        });
      } catch (e) {}
    },

    // 2. Nodi cartoon "PONG PONG / DEER LEAP" spring sound
    nodiJump() {
      try {
        const ac = this.getCtx();
        if (!ac) return;
        const t = ac.currentTime;

        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, t);
        osc.frequency.exponentialRampToValueAtTime(1020, t + 0.14);
        osc.frequency.exponentialRampToValueAtTime(460, t + 0.28);
        osc.frequency.exponentialRampToValueAtTime(860, t + 0.44);

        gain.gain.setValueAtTime(0.28, t);
        gain.gain.linearRampToValueAtTime(0.32, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.56);

        // Nimble harmonic chime
        const chime = ac.createOscillator();
        const chimeGain = ac.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(700, t);
        chime.frequency.exponentialRampToValueAtTime(1400, t + 0.16);
        chimeGain.gain.setValueAtTime(0.2, t);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

        chime.connect(chimeGain);
        chimeGain.connect(ac.destination);
        chime.start(t);
        chime.stop(t + 0.34);
      } catch (e) {}
    },

    // 3. Top Kodi Marshmallow Munch & Chime sound
    kodiMunch() {
      try {
        const ac = this.getCtx();
        if (!ac) return;
        const t = ac.currentTime;

        // Cute crunchy munch: rapid chewing sound
        [0, 0.1, 0.22].forEach((delay, idx) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'triangle';
          const baseFreq = 440 + idx * 70;
          osc.frequency.setValueAtTime(baseFreq, t + delay);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + delay + 0.04);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, t + delay + 0.08);

          gain.gain.setValueAtTime(0.25, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);

          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(t + delay);
          osc.stop(t + delay + 0.09);
        });

        // Happy celebratory bell chime
        const bell = ac.createOscillator();
        const bellGain = ac.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(880, t + 0.3);
        bell.frequency.exponentialRampToValueAtTime(1174, t + 0.44);
        bellGain.gain.setValueAtTime(0.24, t + 0.3);
        bellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        bell.connect(bellGain);
        bellGain.connect(ac.destination);
        bell.start(t + 0.3);
        bell.stop(t + 0.62);
      } catch (e) {}
    }
  };
  window.SoundFX = SoundFX;

  // Unmute / unlock AudioContext on first user interaction
  if (typeof window !== 'undefined') {
    const unlockAudio = () => {
      SoundFX.getCtx();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  }

  // --- 15. BYTE THE JAVA WATCHDOG ANIMATED MASCOT ---
  function initByteTheDog() {
    const wrapper = document.getElementById('byteDogWrapper');
    const bubble = document.getElementById('dogSpeechBubble');
    const mascot = document.getElementById('dogMascot');
    const petBtn = document.getElementById('dogPetBtn');
    if (!wrapper || !bubble) return;

    const dogMessages = [
      "Nom nom nom! 🍢 Marshmallow devoured! Back to coding! 💻",
      "Mmm delicious! That's 100% bug-free sugar! 🍡",
      "Roasting marshmallows over clean Java code! 🏕️",
      "Crunch crunch! 🐻 Bear power recharged for microservices! ⚡",
      "Campfire check: 0 vulnerabilities, 100% tests passing! 🔥",
      "Sweet marshmallows & zero memory leaks! ✨",
      "K8s pods 3/3 Running! Kodi writes code, Nodi deploys! 🦌"
    ].concat(window.KodiFoodie);

    let bubbleTimer = null;
    let eatTimer = null;

    function petByte(e) {
      if (e && e.stopPropagation) e.stopPropagation();

      // Clear any pending timers
      clearTimeout(bubbleTimer);
      clearTimeout(eatTimer);

      // Force restart all eating animations so EVERY click reliably eats the marshmallow!
      wrapper.classList.remove('excited', 'barking');
      const animatedEls = wrapper.querySelectorAll(
        '.dog-arm-and-stick, .dog-marshmallow-tip, .dog-head-group, .dog-tongue, .dog-eyes, .byte-dog-svg, #dogArmAndStick'
      );
      animatedEls.forEach(el => {
        el.style.animation = 'none';
      });
      void wrapper.offsetWidth;
      animatedEls.forEach(el => {
        el.style.animation = '';
      });

      // Re-add excited to trigger the eating animation sequence from frame 0
      wrapper.classList.add('excited', 'barking');

      const msg = dogMessages[Math.floor(Math.random() * dogMessages.length)];
      bubble.textContent = msg;
      bubble.classList.add('bubble-visible');

      // Crunch munch sound strictly on click
      SoundFX.kodiMunch();


      // Conclude eating sequence cleanly after 1.65s
      eatTimer = setTimeout(() => {
        wrapper.classList.remove('excited');
      }, 1650);

      // Speech bubble remains visible for 3.5s
      bubbleTimer = setTimeout(() => {
        bubble.classList.remove('bubble-visible');
        wrapper.classList.remove('barking');
      }, 3500);
    }

    window.petByteMascot = petByte;

    if (mascot) {
      mascot.addEventListener('click', petByte);
      mascot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          petByte(e);
        }
      });
    }

    if (petBtn) {
      petBtn.addEventListener('click', petByte);
    }
  }

  // --- CORNER POPPING MOON BEAR MASCOT SYSTEM ---
  function initCornerBear() {
    const container = document.getElementById('cornerBear');
    const bearBtn = document.getElementById('cornerBearBtn');
    const bubble = document.getElementById('cornerBearBubble');
    if (!container || !bearBtn || !bubble) return;

    const cornerQuotes = [
      "Roasting marshmallows & shipping clean Java code! 🍢",
      "Kafka lag is 0ms today! Everything running smooth! ⚡",
      "Need a backend engineer? Prashant is your guy! 🚀",
      "Event-driven architecture + Kubernetes = pure joy! ⚙️",
      "99.99% uptime vibes right here! 🛡️",
      "Spring Boot 3, Virtual Threads, and campfire warmth! ☕",
      "Checking out the code? Tap Engineer.java above! 💻",
      "Keep exploring! Lots of cool distributed systems below! 🎯",
      "Kodi writes the code, Nodi deploys the pods! 🦌"
    ];

    let bubbleTimer = null;
    let peekTimer = null;

    function popCornerBear(customQuote) {
      bearBtn.classList.remove('popping');
      void bearBtn.offsetWidth;
      bearBtn.classList.add('popping');
      container.classList.add('peek-active');

      const quote = typeof customQuote === 'string'
        ? customQuote
        : cornerQuotes[Math.floor(Math.random() * cornerQuotes.length)];
      bubble.textContent = quote;
      bubble.classList.add('bubble-visible');

      // Play Kodi cartoon jump sound
      SoundFX.kodiJump();


      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        bubble.classList.remove('bubble-visible');
        if (!document.body.classList.contains('kodi-busy')) container.classList.remove('peek-active');
      }, 4000);
    }

    bearBtn.addEventListener('click', () => {
      if (window.kodiCycleTheme) popCornerBear(window.kodiCycleTheme());
      else popCornerBear();
    });
    window.kodiSay = popCornerBear;

    // Periodic gentle peek animation every 18 seconds to delight the visitor
    function schedulePeek() {
      peekTimer = setTimeout(() => {
        if (!container.classList.contains('peek-active')) {
          container.classList.add('peek-active');
          setTimeout(() => {
            if (!bubble.classList.contains('bubble-visible') && !document.body.classList.contains('kodi-busy')) {
              container.classList.remove('peek-active');
            }
          }, 2400);
        }
        schedulePeek();
      }, 18000);
    }
    schedulePeek();
  }

  function initDeerCornerPeek() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Corner SVGs: Solid, cohesive mascot art for natural cartoon window peeking
    // 1. Bottom-Right: Upward peek over the bottom window sill (solid chest, arms & paws resting on sill, looking up)
    // 2. Top-Right: Side peek around the vertical right window frame (solid body curving in, looking left)
    // 3. Top-Left: Side peek around the vertical left window frame (solid body curving in, looking right)
    function getNodiSvg(corner) {
      // High-quality deer SVG art — 400px wide viewBox.
      // For RIGHT peek: head in left portion (x=0-220), body/neck extends right (clipped by screen edge).
      // For LEFT peek: same SVG mirrored — head on right (x=180-400), body on left (off-screen left edge).
      const deerSvgContent = `
  <g transform="rotate(-9 62 112)">
  <!-- Antler nubs -->
  <g stroke="#D9B27C" stroke-linecap="round" fill="none">
    <path d="M30 22 C27 14 23 10 19 8 M28 16 C24 15 22 13 21 11" stroke-width="2.6"/>
    <path d="M52 22 C54 14 58 10 62 8 M54 16 C58 15 60 13 61 11" stroke-width="2.4"/>
  </g>
  <!-- Ears -->
  <g class="dp-ear-l"><ellipse cx="14" cy="32" rx="8" ry="13" transform="rotate(-42 14 32)" fill="#B06E34"/><ellipse cx="14.5" cy="32.5" rx="4.4" ry="8.5" transform="rotate(-42 14.5 32.5)" fill="#F0A58E"/></g>
  <g class="dp-ear-r"><ellipse cx="62" cy="28" rx="6.5" ry="11" transform="rotate(30 62 28)" fill="#A56030"/><ellipse cx="61.5" cy="28.5" rx="3.4" ry="7" transform="rotate(30 61.5 28.5)" fill="#E8977F"/></g>
  <!-- Half body only: torso fades out toward the bottom so just face, upper body and hand show -->
  <defs>
    <linearGradient id="nFade" gradientUnits="userSpaceOnUse" x1="0" y1="101" x2="0" y2="113"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="nBodyMask" maskUnits="userSpaceOnUse" x="-20" y="-10" width="160" height="140"><rect x="-20" y="-10" width="160" height="123" fill="url(#nFade)"/><rect x="-20" y="-10" width="160" height="111" fill="#fff"/></mask>
  </defs>
  <g class="dp-body-part" mask="url(#nBodyMask)" stroke="#4E2F15" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="54" cy="96" rx="27" ry="20" fill="#BE7B3C"/>
    <ellipse cx="45" cy="102" rx="15" ry="12" fill="#F2D6AA" stroke="none"/>
    <g fill="#FFF2DE" stroke="none" opacity="0.9"><circle cx="62" cy="86.5" r="1.8"/><circle cx="69" cy="92" r="1.6"/><circle cx="64" cy="97" r="1.5"/></g>
  </g>
  <g class="dp-head">
    <ellipse cx="42" cy="48" rx="31" ry="27" fill="#C98644"/>
    <ellipse cx="40" cy="38" rx="22" ry="14" fill="#D9A062" opacity="0.55"/>
    <circle cx="32" cy="26" r="1.8" fill="#FFF2DE" opacity="0.9"/>
    <circle cx="41" cy="22.5" r="2" fill="#FFF2DE" opacity="0.9"/>
    <circle cx="50" cy="26" r="1.7" fill="#FFF2DE" opacity="0.9"/>
    <!-- Muzzle pushed to the front (left) for a side look -->
    <ellipse cx="25" cy="58" rx="14" ry="10.5" fill="#F2D6AA"/>
    <g class="dp-nose">
      <ellipse cx="14.5" cy="54.5" rx="4.6" ry="3.6" fill="#2A1A10"/>
      <ellipse cx="13.2" cy="53.3" rx="1.5" ry="0.9" fill="#fff" opacity="0.8"/>
    </g>
    <path d="M17 62 Q25 66 33 61" stroke="#2A1A10" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <ellipse cx="26" cy="65" rx="2.4" ry="1.3" fill="#FF6B81"/>
    <!-- Eyes glancing toward the page -->
    <g class="dp-eyes">
      <ellipse cx="29" cy="43" rx="4.8" ry="5.6" fill="#1B1410"/>
      <circle cx="27.4" cy="41" r="1.9" fill="#fff"/><circle cx="30.4" cy="45.2" r="0.8" fill="#fff"/>
      <ellipse cx="50" cy="43" rx="3.8" ry="5.2" fill="#1B1410"/>
      <circle cx="48.8" cy="41" r="1.5" fill="#fff"/>
    </g>
    <ellipse cx="38" cy="55" rx="4" ry="2.4" fill="#F28B82" opacity="0.5"/>
  </g>
  <!-- Handshake foreleg: starts right at the edge of the body, level with it, reaching toward the screen; shakes on hover -->
  <g class="dp-arm" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-12 3)">
      <circle cx="36" cy="94" r="5.4" fill="#B87A3C" stroke="none"/>
      <path d="M36 89.2 L24 91 L24 97 L36 98.8 Z" fill="#B87A3C" stroke="#4E2F15" stroke-width="0.9"/>
      <circle cx="36" cy="94" r="4.2" fill="#B87A3C" stroke="none"/>
      <path d="M33.6 91.6 L25.4 92.6" stroke="#D79A5C" stroke-width="1.4" fill="none" opacity="0.7"/>
      <g class="dp-hand">
        <ellipse cx="23.6" cy="94" rx="2.1" ry="4" fill="#F2D6AA" stroke="#4E2F15" stroke-width="0.8"/>
        <path d="M23.8 90.4 C19.2 89.8 15.2 91.6 14.8 94 C15.2 96.4 19.2 98.2 23.8 97.6 Z" fill="#3A2616" stroke="#1D120A" stroke-width="0.8"/>
        <path d="M15.6 94 H20.4" stroke="#1D120A" stroke-width="0.9" fill="none"/>
        <ellipse cx="19.4" cy="91.9" rx="2.4" ry="0.8" fill="#8B6A4C" stroke="none" opacity="0.8"/>
      </g>
    </g>
  </g>
  </g>
`;

      if (corner === 'top-right') {
        // Deer faces LEFT — head on left side of SVG (visible), body extends right (screen clips it)
        return `<svg viewBox="-20 0 120 122" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">${deerSvgContent}</svg>`;
      }
      // top-left: Mirror the same SVG — head on right side, body on left (screen clips it)
      return `<svg viewBox="0 0 120 122" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible"><g transform="scale(-1,1) translate(-100,0)">${deerSvgContent}</g></svg>`;
    }

    const deer = document.createElement('div');
    deer.className = 'deer-corner-peek';
    deer.setAttribute('aria-hidden', 'true');
    deer.innerHTML = `
      <div class="dp-body"></div>
      <span class="dp-tag">Nodi · Deploy 🦌</span>
      <div class="dp-bubble"></div>`;
    const body = deer.querySelector('.dp-body');
    const tag = deer.querySelector('.dp-tag');
    const bubble = deer.querySelector('.dp-bubble');

    // Nodi peeks only from SIDE views (left and right edges)
    const corners = ['top-right', 'top-left'];
    const quotes = [
      "Hi! I'm Nodi, I keep the pods running! 🦌",
      "Kodi writes the code, I deploy it! 🚀",
      "I'm the Node, Kodi is the Code! 💻",
      "Pods: 3/3 Running. You're welcome! ✅",
      "Zero-downtime rollout, courtesy of Nodi! 🔄",
      "Kafka lag 0ms and the cluster is healthy! ⚡",
      "Ask Kodi about code, ask me about deployments! 🧭",
      "Kubernetes, Docker, CI/CD: that's my forest! 🌲",
      "Hotpatch deployed in 120ms! ⚡",
      "Canary release 100% green! 🌿"
    ];
    let cornerIndex = 0;
    let peekTimer = null;
    let holdTimer = null;
    let isPeeking = false;
    document.body.appendChild(deer);

    function peek() {
      // Keep corner mascot tucked away while chase is running across screen
      if (document.visibilityState !== 'visible' || document.body.classList.contains('chase-active') ||
          document.body.classList.contains('mascots-off') || document.body.classList.contains('no-nodi')) {
        peekTimer = setTimeout(peek, 2500);
        return;
      }
      isPeeking = true;
      bubble.classList.remove('visible');
      const corner = corners[cornerIndex];
      // Render corner-specific perspective SVG: side view on bezel walls, top/upward view on bottom sill
      body.innerHTML = getNodiSvg(corner);
      deer.className = `deer-corner-peek deer-corner-peek-${corner}`;
      void deer.offsetWidth;
      deer.classList.add('is-peeking');

      // Pop down cleanly after 4.5s unless held by user tap
      clearTimeout(holdTimer);
      holdTimer = setTimeout(hidePeek, 4500);
    }

    let leaveTimer = null;

    // Graceful exit: play the leave animation first, then reset and schedule the next peek
    function hidePeek() {
      if (!isPeeking || deer.classList.contains('is-leaving')) return;
      clearTimeout(holdTimer);
      deer.classList.remove('is-popping');
      bubble.classList.remove('visible');
      deer.classList.add('is-leaving');
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(finishHide, 650);
    }

    function finishHide() {
      deer.classList.remove('is-peeking', 'is-leaving');
      isPeeking = false;
      cornerIndex = (cornerIndex + 1) % corners.length;
      // Schedule next peek in 7-12s so Nodi alternates between the two edges
      const nextDelay = 7000 + Math.random() * 5000;
      clearTimeout(peekTimer);
      peekTimer = setTimeout(peek, nextDelay);
    }

    // Settings: leave gracefully when hidden, make an entrance soon after being switched back on
    let wasHidden = false;
    document.addEventListener('mascots:change', () => {
      const cl = document.body.classList;
      const hidden = cl.contains('no-nodi') || cl.contains('mascots-off');
      if (hidden === wasHidden) return;
      wasHidden = hidden;
      if (hidden) {
        if (isPeeking) hidePeek();
      } else if (!isPeeking) {
        clearTimeout(peekTimer);
        peekTimer = setTimeout(peek, 700);
      }
    });

    // Tapping Nodi keeps him in view for a chat, then he carries on his way
    function react() {
      if (!isPeeking || deer.classList.contains('is-leaving')) return;
      clearTimeout(holdTimer);
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      bubble.textContent = quote;
      bubble.classList.add('visible');

      deer.classList.remove('is-popping');
      void deer.offsetWidth;
      deer.classList.add('is-popping');

      for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'dp-heart';
        heart.textContent = '💚';
        heart.style.setProperty('--hx', (i - 1) * 16 + 'px');
        heart.style.animationDelay = i * 0.12 + 's';
        deer.appendChild(heart);
        setTimeout(() => heart.remove(), 1800);
      }

      // Audio strictly on user click/tap!
      SoundFX.nodiJump();
      if (window.showToast) window.showToast(`🦌 Nodi: "${quote}"`);

      // Keep visible for 3.5s after tap, then submerge
      holdTimer = setTimeout(hidePeek, 3500);
    }

    // Strictly click/tap events — zero hover audio
    body.addEventListener('click', react);
    tag.addEventListener('click', react);

    // Initial peek 1.8s after page load
    setTimeout(peek, 1800);
  }

  // --- INITIALIZE ALL DYNAMIC SYSTEMS ---
  document.addEventListener('DOMContentLoaded', () => {
    initNetworkCanvas();
    initScrollSystem();
    initTypewriter();
    initLiveClock();
    initMagneticButtons();
    initBackToTop();
    initCodeStudio();
    initSkillsFilter();
    initStatsCounters();
    initTiltEffects();
    initScrollReveal();
    initSkillMeters();
    initTimelineProgress();
    initHeroParallax();
    initCursorGlow();
    initCopyButtons();
    initMenuAndModal();
    initByteTheDog();
    initCornerBear();
    initDeerCornerPeek();
    initPatrolBear();
    initSparkleParticles();
  });
})();

// ============================================================
// KODI CHASE SCENE ENGINE — Kodi chases Deer across screen
// ============================================================
(function () {
  'use strict';

  window.initPatrolBear = function () {
    const scene = document.getElementById('patrolScene');
    if (!scene) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scene.style.display = 'none';
      return;
    }

    const kodi   = document.getElementById('patrolKodi');
    const deer   = document.getElementById('patrolDeer');
    const speech = document.getElementById('pbSpeech');
    const speechDeer = document.getElementById('pbSpeechDeer');

    // Kodi writes the code, Nodi deploys it: action-packed dev emergency dialogues during runs
    const dialogues = [
      { kodi: 'Pods crashing in prod! 🚨 Nodi, rescue the cluster!',
        deer: 'Rolling back deployment to v2.4.1 right now! 🔄' },
      { kodi: 'Kafka consumer lag is spiking to 50k! 📈',
        deer: 'Scaling consumer pods 3 → 12! Hold on tight! ⚡' },
      { kodi: 'NullPointerException in payment gateway! 💥',
        deer: 'Hotpatch container built and deploying live! 🛡️' },
      { kodi: 'Memory leak detected in reactive pipeline! 🐛',
        deer: 'Container restarted, GC clean, 0 memory leaks! ✅' },
      { kodi: 'Who pushed untested code straight to main?! 😱',
        deer: 'Reverted! Branch protection re-enabled, Kodi! 🔒' },
      { kodi: 'CPU is at 99%! Database connections maxed! 🔥',
        deer: 'Traffic rerouted through replica pool! Stabilized! 🧘' },
      { kodi: 'Nodi, 502 Bad Gateway on the user endpoint! ⚠️',
        deer: 'Ingress service healthy again, 0 dropped packets! 🚀' },
      { kodi: 'Marshmallow on fire! And so is production! 🍢🔥',
        deer: 'Ship the bugfix fast, then we eat marshmallows! 🏃💨' },
    ];

    // What they say when clicked directly by the user (distinct direct responses!)
    const tapQuips = {
      kodi: [
        'Whoa-WHOA! 🐻💨 360° Stunt Roll into production!',
        'Tumbled and rolled! Still holding the marshmallow! 🍢✨',
        'Jump, fall, ROOOLL! Rolling restart in full effect! 🔄',
        'Whoops! Tactical somersault! Zero downtime! 🐾',
        'Acrobatic stunt! Nodi, check out this 360° roll! 🤸‍♂️',
        'Parkour bear! Pushed bugfix while upside down! 🚀',
        'Pong boing roll! 🐻 Falling with style!',
      ],
      deer: [
        'Pong pong! 🦌 High leap over the Kubernetes cluster!',
        'Boing!! Agile sprint jump! Can\'t catch me! 💨',
        'Whoaaa! Leaping over the firewall! 🛡️',
        'Pong! Pod rescheduled mid-air! ☁️',
        'Boiiing! Zero-downtime high jump! 🚀',
        'Can\'t catch me or my containers! 🦌✨',
        'Hop! Rolling release jumping over bugs! 🎯',
      ],
    };
    const bubbles = { kodi: speech, deer: speechDeer };
    const bubbleW = { kodi: 0, deer: 0 };
    const speechTimers = { kodi: null, deer: null };

    const GAP_START = 200;  // centre-to-centre distance at the start of a run
    const GAP_MIN   = 112;  // deer never closer than this, so the sprites don't overlap
    const REST_MIN  = 6000;
    const REST_MAX  = 16000;

    let kodiX       = 0;    // Kodi's centre, px from the left of the viewport
    let deerX       = 0;    // Nodi's centre, tracked for the click-to-hop dust puff
    let gap         = GAP_START;
    let dir         = 1;    // 1 = left→right, -1 = right→left
    let deerV       = 0;    // deer speed, px/s
    let kodiV       = 0;    // Kodi speed, px/s
    let spriteW     = 110;  // Kodi's width, used for entry/exit and dust
    let deerW       = 96;
    let running     = false;
    let rafId       = null;
    let lastT       = null;
    let talkTimer   = 0;
    let talkStage   = 0;    // 0 = Kodi's turn, 1 = Nodi's reply, 2 = pause
    let talkPair    = null;
    let lastPair    = -1;
    let restTimer   = null;

    // ── Run cycle ──────────────────────────────────────────────────────────
    // Eight key poses per stride (heel strike → midstance → push-off → heel kick
    // → knee drive → reach), blended with a periodic Catmull-Rom spline.
    // Angles are in degrees for a character facing right; positive swings a limb
    // backwards, so negative thigh = leg forward and positive knee = heel kicked up.
    const THIGH = [-38, -22, -2, 22, 34, 20, -8, -32];
    const KNEE  = [6, 20, 14, 12, 45, 92, 100, 55];
    const ARM_STRIDE = 26;  // how far the arms swing at full speed

    function spline(table, p) {
      const n = table.length;
      const x = (((p % 1) + 1) % 1) * n;
      const i = Math.floor(x);
      const f = x - i;
      const p0 = table[(i + n - 1) % n];
      const p1 = table[i % n];
      const p2 = table[(i + 1) % n];
      const p3 = table[(i + 2) % n];
      return 0.5 * (2 * p1 + (p2 - p0) * f +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f +
        (3 * p1 - p0 - 3 * p2 + p3) * f * f * f);
    }

    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

    // Collects every [data-j] joint of a sprite so each can be rotated about its pivot
    function makeRig(el) {
      const joints = {};
      el.querySelectorAll('[data-j]').forEach((g) => {
        joints[g.dataset.j] = {
          g,
          x: parseFloat(g.dataset.px) || 0,
          y: parseFloat(g.dataset.py) || 0,
          v: null,
        };
      });
      return { joints, phase: Math.random(), lastStep: 0 };
    }

    function rotateJoint(rig, name, deg) {
      const j = rig.joints[name];
      if (!j) return;
      const a = Math.round(deg * 10) / 10;
      if (a === j.v) return;
      j.v = a;
      j.g.setAttribute('transform', 'rotate(' + a + ' ' + j.x + ' ' + j.y + ')');
    }

    function moveBody(rig, dy, pitch) {
      const j = rig.joints.body;
      if (!j) return;
      j.g.setAttribute('transform',
        'translate(0 ' + dy.toFixed(2) + ') rotate(' + pitch.toFixed(2) + ' ' + j.x + ' ' + j.y + ')');
    }

    // Advances a sprite's stride from its speed and poses every joint.
    // Returns true when a foot has just landed (used for dust puffs).
    function runCycle(rig, speed, dt, opts) {
      const freq = clamp(speed / opts.stride, 1.1, 3.0);   // strides per second
      rig.phase = (rig.phase + freq * dt) % 1;
      const p = rig.phase;
      const power = clamp(0.62 + speed / 330, 0.8, 1.2);   // harder running = bigger swings
      const arms = ARM_STRIDE * power;

      // opts.swing / opts.knee let a character move its legs less (Kodi's stout bear legs)
      const swing = power * (opts.swing || 1);
      const bend = power * (opts.knee || 1);
      rotateJoint(rig, 'thighN', spline(THIGH, p) * swing);
      rotateJoint(rig, 'shinN',  spline(KNEE,  p) * bend);
      rotateJoint(rig, 'thighF', spline(THIGH, p + 0.5) * swing);
      rotateJoint(rig, 'shinF',  spline(KNEE,  p + 0.5) * bend);

      // Arms oppose the leg on the same side
      const aN = Math.cos((p + 0.5) * 2 * Math.PI);
      const aF = Math.cos(p * 2 * Math.PI);
      if (opts.armsFree) {
        rotateJoint(rig, 'armN',  -5 - arms * aN);
        rotateJoint(rig, 'foreN', -(30 + 20 * aN));
      } else {
        // Kodi holds marshmallow stick: dynamic running pump and roasting sway!
        const armPump = Math.sin((p + 0.5) * 2 * Math.PI);
        rotateJoint(rig, 'armN', -8 - 14 * armPump);
      }
      rotateJoint(rig, 'armF',  -5 - arms * aF);
      rotateJoint(rig, 'foreF', -(30 + 20 * aF));

      // Two bounces per stride, lowest at midstance; lean grows with speed
      const bounce = (1 - Math.cos(4 * Math.PI * (p - 0.25))) / 2;
      const amp = clamp(1.8 + speed / 110, 2.2, 4.2);
      const pitch = clamp(speed / 55, 1.5, 5) + 1.4 * Math.sin(4 * Math.PI * p);
      moveBody(rig, -amp * bounce, pitch);

      const sway = Math.sin(4 * Math.PI * p + 0.6);
      rotateJoint(rig, 'head', -pitch * 0.6 + 2.4 * sway);
      rotateJoint(rig, 'earN', 4 + 9 * Math.sin(4 * Math.PI * p - 1));
      rotateJoint(rig, 'earB', 2 + 7 * Math.sin(4 * Math.PI * p - 1.4));
      rotateJoint(rig, 'tail', 12 * Math.sin(4 * Math.PI * p + 1));

      const step = Math.floor(p * 2);
      const landed = step !== rig.lastStep;
      rig.lastStep = step;
      return landed;
    }

    const deerRig = deer ? makeRig(deer) : null;
    const kodiRig = kodi ? makeRig(kodi) : null;

    function vw() { return window.innerWidth; }

    // Sprites are positioned by translate so the element's centre is the given x
    function place(el, cx, w) {
      el.style.transform = 'translate3d(' + (cx - w / 2) + 'px,0,0)';
    }

    function hideBubbles() {
      Object.values(bubbles).forEach((b) => b && b.classList.remove('visible'));
    }

    // Only one of the two speaks at a time, so the bubbles never overlap
    function showLine(who, text, ms) {
      const bubble = bubbles[who];
      if (!bubble) return;
      hideBubbles();
      bubble.textContent = text;
      bubble.classList.add('visible');
      bubbleW[who] = bubble.offsetWidth;
      clearTimeout(speechTimers[who]);
      if (ms) speechTimers[who] = setTimeout(() => bubble.classList.remove('visible'), ms);
    }

    // Slides a bubble sideways so it stays on screen while its pointer follows the speaker
    function keepBubblesOnScreen(deerX) {
      [['kodi', kodiX], ['deer', deerX]].forEach(([who, cx]) => {
        const b = bubbles[who];
        if (!b || !b.classList.contains('visible')) return;
        const half = bubbleW[who] / 2;
        const shift = clamp(cx, half + 8, vw() - half - 8) - cx;
        b.style.setProperty('--shift', shift.toFixed(1) + 'px');
      });
    }

    function say(who) {
      const lines = tapQuips[who];
      showLine(who, lines[Math.floor(Math.random() * lines.length)], 2800);
    }

    // A speaker only talks while it is on screen, so its pointer is always visible
    function onScreen(x) {
      return x > 40 && x < vw() - 40;
    }

    function updateTalk(dt, deerX) {
      talkTimer -= dt;
      if (talkTimer > 0) return;

      if (talkStage === 0) {
        if (!onScreen(kodiX)) return;
        let i;
        do { i = Math.floor(Math.random() * dialogues.length); } while (i === lastPair && dialogues.length > 1);
        lastPair = i;
        talkPair = dialogues[i];
        showLine('kodi', talkPair.kodi);
        talkStage = 1;
        talkTimer = 2.2;
      } else if (talkStage === 1) {
        if (onScreen(deerX)) {
          showLine('deer', talkPair.deer);
          talkStage = 2;
          talkTimer = 2.4;
        } else {
          hideBubbles();
          talkStage = 0;
          talkTimer = 0.5;
        }
      } else {
        hideBubbles();
        talkStage = 0;
        talkTimer = 0.6;
      }
    }

    function spawnDust(x) {
      const puff = document.createElement('div');
      puff.className = 'dust-puff';
      puff.style.left = (x - dir * spriteW * 0.35) + 'px';
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 750);
    }

    // Each run: the deer sprints ahead, Kodi chases and closes the gap.
    // Both sprites start and end fully off-screen, so the scene has no visible cut-in.
    function startRun() {
      if (!kodi || !deer) return;
      const cl = document.body.classList;
      if (cl.contains('mascots-off') || cl.contains('no-run') || cl.contains('kodi-busy') || (cl.contains('no-kodi') && cl.contains('no-nodi'))) {
        restTimer = setTimeout(startRun, 2000);
        return;
      }
      spriteW  = kodi.offsetWidth || 142;
      deerW    = deer.offsetWidth || 124;
      kodiX    = dir === 1 ? -spriteW - GAP_START : vw() + spriteW + GAP_START;
      gap      = GAP_START;
      deerV    = 0;
      kodiV    = 0;
      talkStage = 0;
      talkTimer = 0.5;
      lastT    = null;
      running  = true;
      document.body.classList.add('chase-active');
      scene.classList.toggle('face-left', dir === -1);
      rafId = requestAnimationFrame(frame);
    }

    function frame(t) {
      if (!running) return;
      if (document.body.classList.contains('mascots-off') || document.body.classList.contains('no-run')) { endRun(); return; }
      if (lastT === null) lastT = t;
      // Clamp so a background tab doesn't cause a teleport when it resumes
      const speedMul = window.MascotSettings ? window.MascotSettings.speed : 1;
      const dt = Math.min(0.05, (t - lastT) / 1000) * speedMul;
      lastT = t;

      // A relaxed pace so you can actually watch them: Nodi jogs ahead, Kodi follows
      const deerTarget = gap < 120 ? 105 : gap > 250 ? 70 : 85;
      deerV += (deerTarget - deerV) * Math.min(1, 2 * dt);

      const kodiTarget = Math.min(135, Math.max(45, deerV + (gap - 140) * 0.8));
      kodiV += (kodiTarget - kodiV) * Math.min(1, 2.5 * dt);

      kodiX += dir * kodiV * dt;
      gap = Math.max(GAP_MIN, gap + (deerV - kodiV) * dt);
      deerX = kodiX + dir * gap;

      place(kodi, kodiX, spriteW);
      place(deer, deerX, deerW);
      runCycle(deerRig, deerV, dt, { stride: 62, armsFree: true });
      if (runCycle(kodiRig, kodiV, dt, { stride: 56, armsFree: false, swing: 0.8, knee: 0.55 })) {
        spawnDust(kodiX);
      }

      updateTalk(dt, deerX);
      keepBubblesOnScreen(deerX);

      const offEnd = dir === 1
        ? kodiX - spriteW / 2 > vw() + 20
        : kodiX + spriteW / 2 < -20;
      if (offEnd) {
        endRun();
        return;
      }

      rafId = requestAnimationFrame(frame);
    }

    function endRun() {
      running = false;
      cancelAnimationFrame(rafId);
      hideBubbles();
      document.body.classList.remove('chase-active');
      dir = -dir;
      const wait = REST_MIN + Math.random() * (REST_MAX - REST_MIN);
      restTimer = setTimeout(startRun, wait);
    }

    // Click Kodi: jump, fall and 360° somersault roll stunt!
    // Click Nodi: nimble high leap over containers!
    [['kodi', kodi], ['deer', deer]].forEach(([who, el]) => {
      if (!el) return;
      el.addEventListener('click', () => {
        if (who === 'kodi') {
          SoundFX.kodiJumpRoll();
          spawnDust(kodiX);
          // Kodi gains forward momentum during the stunt roll, surging closer to Nodi!
          kodiV = Math.min(180, kodiV + 45);
          // Ground impact and somersault roll dust puffs
          setTimeout(() => { if (running) spawnDust(kodiX); }, 580);
          setTimeout(() => { if (running) spawnDust(kodiX + dir * 20); }, 750);
        } else {
          SoundFX.nodiJump();
          spawnDust(deerX);
        }
        say(who);
        el.classList.remove('hop');
        void el.offsetWidth;
        el.classList.add('hop');

        // Safety fallback timer to guarantee hop state is cleared
        setTimeout(() => {
          el.classList.remove('hop');
        }, who === 'kodi' ? 1100 : 900);
      });
      el.addEventListener('animationend', (e) => {
        if (!e.animationName.includes('hop') && !e.animationName.includes('roll') && !e.animationName.includes('leap')) return;
        el.classList.remove('hop');
        spawnDust(who === 'kodi' ? kodiX : deerX);
      });
    });

    const initialDelay = 2500 + Math.random() * 3500;
    restTimer = setTimeout(startRun, initialDelay);
  };

  // ============================================================
  // SPARKLE PARTICLES — float up from random spots
  // ============================================================
  window.initSparkleParticles = function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;


    function spawnSparkle() {
      const el    = document.createElement('div');
      el.className = 'sparkle-particle';
      const size  = 3 + Math.random() * 5;
      const palette = [ThemeColors.green, ThemeColors.blue, ThemeColors.purple, '#ffd57b', '#ff9cc5'];
      const color = palette[Math.floor(Math.random() * palette.length)];
      const x     = 5 + Math.random() * 90;
      const dur   = 2.5 + Math.random() * 3.5;

      el.style.cssText = `
        width:${size}px;height:${size}px;
        background:${color};
        left:${x}vw;
        bottom:${10 + Math.random() * 35}vh;
        opacity:0;
        animation-duration:${dur}s;
        animation-delay:0s;
        box-shadow:0 0 ${size * 2.5}px ${color};
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (dur + 0.3) * 1000);
    }

    setInterval(spawnSparkle, 1600);
    for (let i = 0; i < 5; i++) setTimeout(spawnSparkle, i * 350);
  };

})();


// ============================================================
// MASCOT SETTINGS — speed, animation on/off, show/hide Kodi & Nodi
// ============================================================
(function () {
  'use strict';

  const KEY = 'mascotSettings.v1';
  const DEFAULTS = { speed: 1, jump: 1, animations: true, run: true, kodi: true, nodi: true };

  let state = Object.assign({}, DEFAULTS);
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      if (typeof saved.speed === 'number') state.speed = Math.min(2, Math.max(0.4, saved.speed));
      if (typeof saved.jump === 'number') state.jump = Math.min(2.5, Math.max(0.5, saved.jump));
      ['animations', 'run', 'kodi', 'nodi'].forEach((k) => { if (typeof saved[k] === 'boolean') state[k] = saved[k]; });
    }
  } catch (e) { /* storage unavailable: keep defaults */ }

  window.MascotSettings = {
    get speed() { return state.speed; },
  };

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function applyBodyClasses() {
    const cl = document.body.classList;
    cl.toggle('mascots-off', !state.animations);
    cl.toggle('no-run', !state.run);
    cl.toggle('no-kodi', !state.kodi);
    cl.toggle('no-nodi', !state.nodi);
    document.documentElement.style.setProperty('--jump', String(state.jump));
    document.dispatchEvent(new Event('mascots:change'));
  }

  function speedLabel(v) {
    return (Math.round(v * 10) / 10).toFixed(1) + '×';
  }

  function init() {
    applyBodyClasses();
    const btn = document.getElementById('mascotSettingsBtn');
    const panel = document.getElementById('mascotSettingsPanel');
    if (!btn || !panel) return;

    const range = panel.querySelector('#msSpeed');
    const readout = panel.querySelector('#msSpeedValue');
    const presets = panel.querySelectorAll('[data-speed]');
    const jumpRange = panel.querySelector('#msJump');
    const jumpReadout = panel.querySelector('#msJumpValue');
    const jumpPresets = panel.querySelectorAll('[data-jump]');
    const toggles = {
      animations: panel.querySelector('[data-toggle="animations"]'),
      run: panel.querySelector('[data-toggle="run"]'),
      kodi: panel.querySelector('[data-toggle="kodi"]'),
      nodi: panel.querySelector('[data-toggle="nodi"]'),
    };
    const removeBoth = panel.querySelector('#msRemoveBoth');
    const reset = panel.querySelector('#msReset');

    function render() {
      applyBodyClasses();
      range.value = state.speed;
      readout.textContent = speedLabel(state.speed);
      range.style.setProperty('--fill', ((state.speed - 0.4) / 1.6 * 100) + '%');
      presets.forEach((b) => {
        b.classList.toggle('active', Math.abs(parseFloat(b.dataset.speed) - state.speed) < 0.05);
      });
      Object.keys(toggles).forEach((k) => {
        toggles[k].setAttribute('aria-checked', String(state[k]));
      });
      jumpRange.value = state.jump;
      jumpReadout.textContent = speedLabel(state.jump);
      jumpRange.style.setProperty('--fill', ((state.jump - 0.5) / 2 * 100) + '%');
      jumpPresets.forEach((b) => {
        b.classList.toggle('active', Math.abs(parseFloat(b.dataset.jump) - state.jump) < 0.05);
      });
      panel.classList.toggle('ms-anim-off', !state.animations);
      panel.classList.toggle('ms-run-off', !state.run);
      const bothGone = !state.kodi && !state.nodi;
      removeBoth.textContent = bothGone ? 'Bring back both' : 'Remove both';
      removeBoth.classList.toggle('is-restore', bothGone);
    }

    function update(patch) {
      Object.assign(state, patch);
      save();
      render();
    }

    function open() {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('open'));
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { if (!panel.classList.contains('open')) panel.hidden = true; }, 220);
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? close() : open();
    });
    panel.querySelector('#msClose').addEventListener('click', close);
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
      if (box && box.contains(e.target)) return;
      if (panel.classList.contains('open')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) { close(); btn.focus(); }
    });

    range.addEventListener('input', () => update({ speed: parseFloat(range.value) }));
    presets.forEach((b) => b.addEventListener('click', () => update({ speed: parseFloat(b.dataset.speed) })));
    jumpRange.addEventListener('input', () => update({ jump: parseFloat(jumpRange.value) }));
    jumpPresets.forEach((b) => b.addEventListener('click', () => update({ jump: parseFloat(b.dataset.jump) })));
    Object.keys(toggles).forEach((k) => {
      toggles[k].addEventListener('click', () => update({ [k]: !state[k] }));
    });
    removeBoth.addEventListener('click', () => {
      const bothGone = !state.kodi && !state.nodi;
      update({ kodi: bothGone, nodi: bothGone });
    });
    reset.addEventListener('click', () => update(Object.assign({}, DEFAULTS)));

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();


// ============================================================
// KODI EXTRAS — foodie marshmallow chat + site theme picker
// ============================================================
(function () {
  'use strict';

  const THEMES = [{"id": "midnight", "name": "Midnight Mint", "emoji": "\ud83c\udf19", "bg": "#080d19", "bg2": "#0c1424", "green": "#a1f4c2", "blue": "#8eb5ff", "purple": "#c0a5ff"}, {"id": "aurora", "name": "Aurora Violet", "emoji": "\ud83d\udd2e", "bg": "#0c0a1d", "bg2": "#120f28", "green": "#c9a8ff", "blue": "#8fb3ff", "purple": "#ff9fe0"}, {"id": "ocean", "name": "Ocean Depth", "emoji": "\ud83c\udf0a", "bg": "#051520", "bg2": "#09202e", "green": "#6fe3ff", "blue": "#7fb2ff", "purple": "#b2a6ff"}, {"id": "ember", "name": "Sunset Ember", "emoji": "\ud83d\udd25", "bg": "#150c0a", "bg2": "#1e1210", "green": "#ffb86b", "blue": "#ff9a8a", "purple": "#ff8fa3"}, {"id": "forest", "name": "Forest Moss", "emoji": "\ud83c\udf32", "bg": "#07130d", "bg2": "#0c1d14", "green": "#b8f26b", "blue": "#6fe0b4", "purple": "#9be8c8"}, {"id": "rose", "name": "Rose Quartz", "emoji": "\ud83c\udf38", "bg": "#160a13", "bg2": "#200f1b", "green": "#ff9cc5", "blue": "#ffc2a8", "purple": "#d6a8ff"}, {"id": "graphite", "name": "Graphite Mono", "emoji": "\ud83e\udea8", "bg": "#0a0b0e", "bg2": "#111317", "green": "#e3e8f2", "blue": "#9db4dc", "purple": "#b8b4d8"}];

  const FOODIE = window.KodiFoodie;

  const DESC = {
    midnight: 'calm night-sky coding vibes',
    aurora: 'a northern-lights purple glow',
    ocean: 'cool blues for deep-dive debugging',
    ember: 'warm amber, like a cosy evening kitchen',
    forest: 'fresh green, calm as a campfire in the woods',
    rose: 'soft pink, gentle on the eyes',
    graphite: 'clean minimal greys, pure focus'
  };

  const root = document.documentElement;
  let current = 'midnight';
  try { current = localStorage.getItem('siteTheme') || 'midnight'; } catch (e) { /* ignore */ }
  if (!THEMES.some((t) => t.id === current)) current = 'midnight';

  function syncColors() {
    const cs = getComputedStyle(root);
    const get = (n) => cs.getPropertyValue(n).trim();
    const tc = window.ThemeColors;
    tc.green = get('--green') || tc.green;
    tc.blue = get('--blue') || tc.blue;
    tc.purple = get('--purple') || tc.purple;
    tc.greenRgb = get('--green-rgb') || tc.greenRgb;
    tc.blueRgb = get('--blue-rgb') || tc.blueRgb;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', get('--bg') || '#080d19');
  }

  let fadeTimer = null;
  function setTheme(id, animate) {
    if (animate) {
      root.classList.add('theme-fade');
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => root.classList.remove('theme-fade'), 750);
    }
    current = id;
    root.setAttribute('data-theme', id);
    try { localStorage.setItem('siteTheme', id); } catch (e) { /* ignore */ }
    syncColors();
    document.dispatchEvent(new Event('theme:change'));
  }

  function init() {
    setTheme(current, false);

    // Each click on Kodi steps to the next theme and returns his message; works on every page
    let onThemeChange = null;
    window.kodiCycleTheme = function () {
      const i = (THEMES.findIndex((t) => t.id === current) + 1) % THEMES.length;
      const t = THEMES[i];
      setTheme(t.id, true);
      if (onThemeChange) onThemeChange();
      return 'Theme ' + (i + 1) + '/' + THEMES.length + ' · ' + t.name + ' ' + t.emoji + ' · ' + DESC[t.id];
    };

    // Marshmallow: tap for a random foodie message
    const marsh = document.querySelector('.kb-marsh');
    if (marsh) {
      let last = -1;
      marsh.addEventListener('click', (e) => {
        e.stopPropagation();
        let i;
        do { i = Math.floor(Math.random() * FOODIE.length); } while (i === last && FOODIE.length > 1);
        last = i;
        marsh.classList.remove('jiggle');
        void marsh.getBoundingClientRect();
        marsh.classList.add('jiggle');
        if (window.kodiSay) window.kodiSay(FOODIE[i]);
      });
    }

    // Theme picker
    const btn = document.getElementById('kbThemeBtn');
    const panel = document.getElementById('kbThemePanel');
    const grid = document.getElementById('kbThemeGrid');
    if (!btn || !panel || !grid) return;

    grid.innerHTML = THEMES.map((t) => (
      '<button class="kb-theme-opt" type="button" data-theme-id="' + t.id + '" aria-pressed="false">' +
        '<span class="kb-swatch" style="background:linear-gradient(145deg,' + t.bg2 + ',' + t.bg + ')">' +
          '<i style="background:' + t.green + '"></i><i style="background:' + t.blue + '"></i><i style="background:' + t.purple + '"></i>' +
        '</span>' +
        '<span class="kb-theme-name">' + t.name + '<small>' + t.emoji + '</small></span>' +
      '</button>'
    )).join('');

    function markActive() {
      grid.querySelectorAll('.kb-theme-opt').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.themeId === current));
      });
    }
    markActive();

    const box = document.getElementById('cornerBear');
    const cornerBubble = document.getElementById('cornerBearBubble');
    let leaveTimer = null;

    // While Kodi is hovered, touched or showing themes, the chase waits for him
    function setBusy(on) { document.body.classList.toggle('kodi-busy', on); }
    function releaseBusy(delay) {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        if (!panel.classList.contains('open')) setBusy(false);
      }, delay);
    }
    if (box) {
      box.addEventListener('mouseenter', () => { clearTimeout(leaveTimer); setBusy(true); });
      box.addEventListener('mouseleave', () => releaseBusy(700));
      box.addEventListener('focusin', () => { clearTimeout(leaveTimer); setBusy(true); });
      box.addEventListener('focusout', () => releaseBusy(700));
      box.addEventListener('touchstart', () => { clearTimeout(leaveTimer); setBusy(true); releaseBusy(5000); }, { passive: true });
    }

    function open() {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('open'));
      btn.setAttribute('aria-expanded', 'true');
      if (box) box.classList.add('peek-active');
      if (cornerBubble) cornerBubble.classList.remove('bubble-visible');
      clearTimeout(leaveTimer);
      setBusy(true);
    }
    function close() {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (box) box.classList.remove('peek-active');
      setTimeout(() => { if (!panel.classList.contains('open')) panel.hidden = true; }, 240);
      releaseBusy(900);
    }
    function toggle() { panel.classList.contains('open') ? close() : open(); }
    window.kodiToggleThemes = toggle;

    onThemeChange = markActive;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => { if (panel.classList.contains('open')) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) { close(); btn.focus(); }
    });

    grid.addEventListener('click', (e) => {
      const opt = e.target.closest('.kb-theme-opt');
      if (!opt) return;
      const id = opt.dataset.themeId;
      if (id === current) return;
      setTheme(id, true);
      markActive();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
