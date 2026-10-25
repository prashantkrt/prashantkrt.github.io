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
        this.baseColor = Math.random() > 0.4 ? 'rgba(161, 244, 194, ' : 'rgba(142, 181, 255, ';
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
        ctx.fillStyle = this.baseColor + glow + ')';
        ctx.shadowColor = '#a1f4c2';
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
              ctx.strokeStyle = `rgba(161, 244, 194, ${alpha})`;
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
            ctx.strokeStyle = `rgba(161, 244, 194, ${alpha})`;
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
          ctx.fillStyle = '#a1f4c2';
          ctx.shadowColor = '#a1f4c2';
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

  // --- 12. SCROLL REVEAL OBSERVER ---
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.section-title, .about-layout, .timeline-item, .cert-card, .principles article, .skills-filter-container, .quick-links, .stats-bar'
    );

    revealElements.forEach((el) => el.classList.add('reveal'));

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

    revealElements.forEach((el) => observer.observe(el));
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

  // --- 15. BYTE THE JAVA WATCHDOG ANIMATED MASCOT ---
  function initByteTheDog() {
    const wrapper = document.getElementById('byteDogWrapper');
    const bubble = document.getElementById('dogSpeechBubble');
    const mascot = document.getElementById('dogMascot');
    const petBtn = document.getElementById('dogPetBtn');
    if (!wrapper || !bubble) return;

    const dogMessages = [
      "Roasting marshmallows over clean Java code! 🏕️",
      "Campfire check: 0 vulnerabilities, 100% tests passing! 🔥",
      "Bear hugs for microservices! Kafka lag is 0ms! 🐻",
      "Sweet marshmallows & zero memory leaks! 🍡",
      "Under the stars shipping reliable distributed systems! ✨",
      "Spring Boot 3.3 initialized in 1.42s by the fire! ⚡",
      "K8s pods 3/3 Running with zero restarts! 🛡️"
    ];

    let bubbleTimer = null;

    function playBarkChime() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        [0, 0.11].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(540, ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(270, ctx.currentTime + delay + 0.08);
          gain.gain.setValueAtTime(0.14, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.09);
        });
      } catch (err) {}
    }

    function petByte() {
      wrapper.classList.remove('barking');
      void wrapper.offsetWidth;
      wrapper.classList.add('barking', 'excited');

      const msg = dogMessages[Math.floor(Math.random() * dogMessages.length)];
      bubble.textContent = msg;
      bubble.classList.add('bubble-visible');

      playBarkChime();

      if (window.showToast) {
        window.showToast(`🐻 Kodi Bear: "${msg}"`);
      }

      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        bubble.classList.remove('bubble-visible');
        wrapper.classList.remove('excited');
      }, 3500);
    }

    window.petByteMascot = petByte;

    if (mascot) {
      mascot.addEventListener('click', petByte);
      mascot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          petByte();
        }
      });
    }

    if (petBtn) {
      petBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        petByte();
      });
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
      "Keep exploring! Lots of cool distributed systems below! 🎯"
    ];

    let bubbleTimer = null;
    let peekTimer = null;

    function popCornerBear() {
      bearBtn.classList.remove('popping');
      void bearBtn.offsetWidth;
      bearBtn.classList.add('popping');
      container.classList.add('peek-active');

      const quote = cornerQuotes[Math.floor(Math.random() * cornerQuotes.length)];
      bubble.textContent = quote;
      bubble.classList.add('bubble-visible');

      // Play soft bear sound
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (err) {
        // AudioContext restricted before first gesture
      }

      if (window.showToast) {
        window.showToast(`🐻 Kodi Bear: "${quote}"`);
      }

      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        bubble.classList.remove('bubble-visible');
        container.classList.remove('peek-active');
      }, 4000);
    }

    bearBtn.addEventListener('click', popCornerBear);

    // Periodic gentle peek animation every 18 seconds to delight the visitor
    function schedulePeek() {
      peekTimer = setTimeout(() => {
        if (!container.classList.contains('peek-active')) {
          container.classList.add('peek-active');
          setTimeout(() => {
            if (!bubble.classList.contains('bubble-visible')) {
              container.classList.remove('peek-active');
            }
          }, 2400);
        }
        schedulePeek();
      }, 18000);
    }
    schedulePeek();
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
    initCopyButtons();
    initMenuAndModal();
    initByteTheDog();
    initCornerBear();
    initPatrolBear();
    initSparkleParticles();
    initRevealAnimations();
  });
})();

// ============================================================
// PATROL BEAR ENGINE — runs across bottom, peeks from corners
// ============================================================
(function () {
  'use strict';

  window.initPatrolBear = function () {
    const bear = document.getElementById('patrolBear');
    if (!bear) return;

    // If user prefers reduced motion, bail out
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bear.style.display = 'none';
      return;
    }

    const svg    = bear.querySelector('.patrol-bear-svg');
    const peekEl = bear.querySelector('.pb-peek-eyes');
    const speech = document.getElementById('pbSpeech');

    const sayings = [
      'Shipping clean code! 🍯',
      'Java 21 FTW! ☕',
      'Kafka lag = 0ms! ⚡',
      'Found a bug! 🐛→🗑️',
      '100% test coverage! ✅',
      'Refactoring in progress… 🔧',
      'Spring Boot ready! 🚀',
      'Microservices deployed! 🎉',
      'Event loop is happy! 🔄',
      'Honey break! 🍯',
    ];

    const BEAR_W    = 70;   // px, must match CSS width
    const RUN_SPEED = 1.8;  // px per frame at 60fps
    const PEEK_TIME = 3800; // ms spent peeking
    const REST_TIME = [5000, 14000]; // ms between patrols

    let posX         = -BEAR_W;
    let dir          = 1;          // 1 = left→right, -1 = right→left
    let state        = 'running';  // 'running' | 'peeking' | 'resting'
    let rafId        = null;
    let speechTimer  = null;
    let restTimer    = null;

    function vw() { return window.innerWidth; }

    // ── Clamp position ───────────────────────────────────────────────────
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // ── Show speech bubble ───────────────────────────────────────────────
    function saySomething() {
      if (!speech) return;
      speech.textContent = sayings[Math.floor(Math.random() * sayings.length)];
      speech.classList.add('visible');
      clearTimeout(speechTimer);
      speechTimer = setTimeout(() => speech.classList.remove('visible'), 2500);
    }

    // ── Enter peek state ─────────────────────────────────────────────────
    function enterPeek(fromRight) {
      state = 'peeking';
      cancelAnimationFrame(rafId);

      // Position bear at correct corner, mostly hidden (only top 35px visible)
      if (fromRight) {
        bear.style.left  = '';
        bear.style.right = '20px';
      } else {
        bear.style.right = '';
        bear.style.left  = '20px';
      }

      // Show only the peek (head) portion
      bear.classList.add('peeking');
      if (svg) svg.style.animation = 'none';

      saySomething();

      // After PEEK_TIME ms, dive away and start rest
      restTimer = setTimeout(() => {
        exitPeek(fromRight);
      }, PEEK_TIME);
    }

    // ── Exit peek → rest ─────────────────────────────────────────────────
    function exitPeek(fromRight) {
      bear.classList.remove('peeking');
      bear.classList.add('hiding');
      speech.classList.remove('visible');

      setTimeout(() => {
        bear.classList.remove('hiding');

        // Reset position to the opposite side, ready to run back
        dir  = fromRight ? -1 : 1;
        posX = fromRight ? vw() + 10 : -BEAR_W;

        // Mirror bear SVG for direction
        if (svg) {
          svg.style.transform = dir === -1 ? 'scaleX(-1)' : '';
          svg.style.animation = '';
        }

        bear.style.right = '';
        bear.style.left  = posX + 'px';

        // Rest before running again
        const waitMs = REST_TIME[0] + Math.random() * (REST_TIME[1] - REST_TIME[0]);
        state = 'resting';
        restTimer = setTimeout(startRun, waitMs);
      }, 500);
    }

    // ── Start the run loop ───────────────────────────────────────────────
    function startRun() {
      state = 'running';
      bear.style.right = '';
      bear.style.left  = posX + 'px';
      if (svg) {
        svg.style.transform = dir === -1 ? 'scaleX(-1) translateY(0)' : '';
        svg.style.animation = '';
      }

      // Occasionally say something while running
      const runQuip = setTimeout(saySomething, 1200 + Math.random() * 2000);

      function frame() {
        if (state !== 'running') return;

        posX += dir * RUN_SPEED;
        bear.style.left = posX + 'px';

        // Hit right edge → peek from right
        if (dir === 1 && posX >= vw() - 30) {
          clearTimeout(runQuip);
          enterPeek(true);
          return;
        }
        // Hit left edge → peek from left
        if (dir === -1 && posX <= -BEAR_W + 30) {
          clearTimeout(runQuip);
          enterPeek(false);
          return;
        }

        rafId = requestAnimationFrame(frame);
      }

      rafId = requestAnimationFrame(frame);
    }

    // ── Make patrol bear clickable / tappable ────────────────────────────
    bear.style.pointerEvents = 'auto';
    bear.style.cursor        = 'pointer';

    bear.addEventListener('click', () => {
      saySomething();
      // Tiny jump on click
      bear.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
      bear.style.transform  = 'translateY(-18px)';
      setTimeout(() => {
        bear.style.transform  = '';
        bear.style.transition = '';
      }, 320);
    });

    // ── Initial delay before first patrol ───────────────────────────────
    const initialDelay = 3000 + Math.random() * 4000;
    restTimer = setTimeout(() => {
      posX = -BEAR_W;
      dir  = 1;
      if (svg) svg.style.transform = '';
      bear.style.left = posX + 'px';
      startRun();
    }, initialDelay);
  };

  // ============================================================
  // SPARKLE PARTICLES — float up from random spots
  // ============================================================
  window.initSparkleParticles = function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const colors = ['#a1f4c2', '#8eb5ff', '#c0a5ff', '#ffd57b', '#ff9cc5'];

    function spawnSparkle() {
      const el = document.createElement('div');
      el.className = 'sparkle-particle';

      const size  = 3 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x     = 5 + Math.random() * 90; // vw %
      const dur   = 2.5 + Math.random() * 3;

      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${x}vw;
        bottom: ${Math.random() * 30}vh;
        opacity: 0;
        animation-duration: ${dur}s;
        animation-delay: 0s;
        box-shadow: 0 0 ${size * 2}px ${color};
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (dur + 0.2) * 1000);
    }

    // Spawn a sparkle every 1.8s
    setInterval(spawnSparkle, 1800);
    // Also spawn a few immediately
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnSparkle, i * 400);
    }
  };

  // ============================================================
  // SCROLL REVEAL ANIMATIONS — .reveal-up elements fade in
  // ============================================================
  window.initRevealAnimations = function () {
    const targets = document.querySelectorAll(
      '.section-title, .stat-card, .skill-card, .project-card, .timeline-item, .cert-card, .directory-card, .principles article'
    );

    if (!targets.length) return;

    // Add reveal-up to eligible elements
    targets.forEach((el, i) => {
      if (!el.classList.contains('reveal-up')) {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
  };

})();
