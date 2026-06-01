/* ================================================================
   Mohammed Abbakar — Portfolio v5
   Interactivity
   ================================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Bilingual toggle (EN ↔ FR)
  // ----------------------------------------------------------
  const STORAGE_KEY = 'mohammed-portfolio-lang-v5';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const langBtn = document.getElementById('langBtn');
  const labels  = { en: 'FR', fr: 'EN' };

  function applyLang(lang, instant = false) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    if (langBtn) langBtn.textContent = labels[lang];

    const els = document.querySelectorAll('.t');
    if (instant) {
      els.forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (txt) el.innerHTML = txt;
      });
      return;
    }

    document.body.classList.add('lang-switching');
    setTimeout(() => {
      els.forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (txt) el.innerHTML = txt;
      });
      requestAnimationFrame(() => {
        document.body.classList.remove('lang-switching');
      });
    }, 200);
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'fr' : 'en');
    });
  }
  applyLang(currentLang, true);


  // ----------------------------------------------------------
  // 2. Hero photo: detect missing & show placeholder
  // ----------------------------------------------------------
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    // Check after a moment if image loaded
    setTimeout(() => {
      if (heroImg.naturalWidth === 0 || heroImg.complete === false) {
        heroImg.style.display = 'none';
        heroImg.parentElement.classList.add('no-photo');
      }
    }, 800);
  }


  // ----------------------------------------------------------
  // 3. Back-to-top
  // ----------------------------------------------------------
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (toTop) toTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ----------------------------------------------------------
  // 4. Active nav link based on section in view
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.hn-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));


  // ----------------------------------------------------------
  // 5. Scroll reveals
  // ----------------------------------------------------------
  const revealTargets = [
    '.overline', '.big-h',
    '.svc-card', '.stat',
    '.skill-cat', '.project-card',
    '.tl-item', '.edu-card',
    '.contact-intro', '.biz-card', '.biz-social',
    '.more-work', '.carousel',
    '.band-left', '.band-right'
  ];
  const revealEls = document.querySelectorAll(revealTargets.join(', '));
  revealEls.forEach((el) => {
    el.classList.add('reveal');
    if (el.matches('.skill-cat, .project-card, .tl-item, .edu-card, .svc-card, .stat')) {
      const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 0.08) + 's';
    }
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));


  // ----------------------------------------------------------
  // 6. Custom cursor (desktop only)
  // ----------------------------------------------------------
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const isWide        = window.matchMedia('(min-width: 981px)').matches;

  if (supportsHover && isWide) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      document.body.classList.add('cursor-active');
    });
    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });

    function tick() {
      if (dot) dot.style.transform =
        `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) ring.style.transform =
        `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    const hoverSelector = 'a, button, .svc-card, .skill-tags span, .edu-card, .stat, .project-card, .skill-cat';
    document.querySelectorAll(hoverSelector).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  // ----------------------------------------------------------
  // 7. Stat counter
  // ----------------------------------------------------------
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const small = el.querySelector('small');
    const suffix = small ? small.outerHTML : '';

    const duration = 1400;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      el.innerHTML = current + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.innerHTML = target + suffix;
    }
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    statObserver.observe(el);
  });


  // ----------------------------------------------------------
  // 8. (Contact form removed in favor of business card)
  // ----------------------------------------------------------


  // ----------------------------------------------------------
  // 9. Carousel
  // ----------------------------------------------------------
  (function setupCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const track    = document.getElementById('carouselTrack');
    const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');
    const dotsBox  = document.getElementById('carouselDots');
    const bigNum   = document.getElementById('carouselBigNum');

    if (!slides.length) return;

    let current = 0;
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', `Go to project ${i + 1}`);
      b.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(b);
      return b;
    });

    slides[0].classList.add('is-active');
    if (bigNum) bigNum.textContent = slides[0].dataset.num || '01';

    function goTo(index) {
      if (index === current) return;
      const total = slides.length;
      if (index < 0) index = total - 1;
      else if (index >= total) index = 0;

      const prev = slides[current];
      const next = slides[index];

      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      setTimeout(() => prev.classList.remove('is-leaving'), 600);

      next.classList.add('is-active');

      dots[current].classList.remove('is-active');
      dots[index].classList.add('is-active');

      if (bigNum) {
        bigNum.style.opacity = '0';
        bigNum.style.transform = 'translateX(-10px)';
        setTimeout(() => {
          bigNum.textContent = next.dataset.num || String(index + 1).padStart(2, '0');
          bigNum.style.opacity = '';
          bigNum.style.transform = '';
        }, 250);
      }
      current = index;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    let inView = false;
    const carouselObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { inView = e.isIntersecting; });
    }, { threshold: 0.4 });
    carouselObs.observe(carousel);

    document.addEventListener('keydown', (e) => {
      if (!inView) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    let touchStartX = 0, touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) goTo(current + 1);
      else        goTo(current - 1);
    }, { passive: true });
  })();

})();
