/**
 * Prashant Kumar Tiwary - Project Directory Dynamic Engine
 * - Combined Instant Keyword Search + Category Filter
 * - Live Repo Count Badge & Status
 * - Tag Click Filtering
 * - 3D Card Tilt Effects
 * - Magnetic Buttons & Ripples
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.directory-card[data-category]');
    const searchInput = document.getElementById('projectSearch');
    const clearBtn = document.getElementById('clearProjectSearch');
    const countStatus = document.getElementById('projectCountStatus');

    let currentFilter = 'all';
    let searchQuery = '';

    // Update category badge counts dynamically
    const categoryCounts = { all: cards.length };
    cards.forEach((card) => {
      const cats = (card.dataset.category || '').split(/\s+/);
      cats.forEach((c) => {
        if (!c) return;
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      });
    });

    filterButtons.forEach((btn) => {
      const cat = btn.dataset.filter;
      const count = categoryCounts[cat] || (cat === 'all' ? cards.length : 0);
      const originalText = btn.textContent.replace(/\s*\(\d+\)/, '').trim();
      btn.innerHTML = `${originalText} <span class="tab-badge">${count}</span>`;
    });

    function applyFilters() {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      cards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
        const type = (card.querySelector('.repo-type')?.textContent || '').toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tags span'))
          .map((t) => t.textContent.toLowerCase())
          .join(' ');

        const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
        const matchesQuery = !q || title.includes(q) || desc.includes(q) || type.includes(q) || tags.includes(q);

        if (matchesCategory && matchesQuery) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countStatus) {
        countStatus.textContent = `Showing ${visibleCount} of ${cards.length} repositories`;
      }

      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
    }

    // Filter button clicks
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        applyFilters();
      });
    });

    // Real-time keyword search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFilters();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        applyFilters();
        if (searchInput) searchInput.focus();
      });
    }

    // Tag click filters
    document.addEventListener('click', (e) => {
      const tag = e.target.closest('.tags span');
      if (tag && tag.closest('.directory-section')) {
        const tagText = tag.textContent.trim();
        if (searchInput) {
          searchInput.value = tagText;
          searchQuery = tagText;
          applyFilters();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (window.showToast) {
            window.showToast(`Filtered by tag: "${tagText}"`, '🔍');
          }
        }
      }
    });

    // Make every repository card/tab fully clickable to open its repository link
    cards.forEach((card) => {
      const link = card.querySelector('.project-link');
      if (!link) return;

      const title = card.querySelector('h3')?.textContent.trim() || 'Repository';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${title} - Open repository on GitHub`);
      card.setAttribute('title', `Click to open ${title} repository`);

      card.addEventListener('click', (e) => {
        // If clicking on a tag span, let the tag filter run instead of navigating
        if (e.target.closest('.tags span')) return;

        // If clicking directly on the <a> link, let default navigation run
        if (e.target.closest('.project-link')) return;

        if (window.showToast) {
          window.showToast(`Opening ${title}…`, '↗');
        }
        window.open(link.href, '_blank', 'noopener,noreferrer');
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('.tags span')) return;
          e.preventDefault();
          if (window.showToast) {
            window.showToast(`Opening ${title}…`, '↗');
          }
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // 3D tilt effect on repository cards
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 768) {
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = -((y - centerY) / centerY) * 5;
          const rotateY = ((x - centerX) / centerX) * 5;
          card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    applyFilters();
  });
})();
