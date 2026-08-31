/* ═══════════════════════════════════════════════
   Yatri Portfolio — Interactions & Scroll Reveal
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Scroll-reveal for project cards & section heading ──
  const revealTargets = document.querySelectorAll('.project-card, .section-heading');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards slightly
        const delay = entry.target.classList.contains('project-card')
          ? (Array.from(revealTargets).indexOf(entry.target) % 2) * 120
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => observer.observe(el));


  // ── 2. Active-nav highlight on click ──
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });


  // ── 3. Header hide/show on scroll ──
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScroll && currentScroll > 120) {
          header.style.transform = 'translateX(-50%) translateY(-100px)';
          header.style.opacity = '0';
        } else {
          header.style.transform = 'translateX(-50%) translateY(0)';
          header.style.opacity = '1';
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });


  // ── 4. Smooth footer link → top scroll ──
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

});
