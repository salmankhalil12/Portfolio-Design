// Helpers
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* Dynamic year */
(() => { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); })();

/* Ensure body padding matches fixed header height */
(() => {
  const header = document.querySelector('[data-header]');
  const setH = () => {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  // On load/resize and when fonts finish loading
  setH();
  window.addEventListener('load', setH);
  window.addEventListener('resize', setH);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setH).catch(()=>{});
  }
})();

/* Header progress bar + subtle style on scroll */
(() => {
  const header = document.querySelector('[data-header]');
  const progress = $('#scroll-progress');
  const onScroll = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? scrolled / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('scrolled', scrolled > 4);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* Mobile nav */
(() => {
  const btn = $('#menu-toggle');
  const nav = $('#primary-navigation');
  const closeNav = () => {
    nav.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    // document.body.classList.remove('nav-open');
    document.body.classList.add('nav-open');   // openNav()
document.body.classList.remove('nav-open'); // closeNav()

  };
  const openNav = () => {
    nav.classList.add('open');
    btn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };
  btn?.addEventListener('click', () => {
    nav.classList.contains('open') ? closeNav() : openNav();
  });
  // Close on link click + Escape
  $$('.nav-link', nav).forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
})();

/* Scrollspy (active link while scrolling) */
(() => {
  const sections = $$('section[id]');
  const links = $$('.nav-link');
  const setActive = (id) => {
    links.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-55% 0px -40% 0px', threshold: 0.01 });
  sections.forEach(s => observer.observe(s));
})();

/* Typed.js (respects reduced motion) */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = $('#typed-roles');
  if (!el) return;
  let roles = [];
  try { roles = JSON.parse(el.dataset.roles || '[]'); } catch { roles = []; }
  if (!roles.length) roles = [el.textContent.trim() || 'Frontend Developer'];
  if (prefersReduced || typeof Typed === 'undefined') {
    el.textContent = roles[0];
    return;
  }
  new Typed('#typed-roles', {
    strings: roles,
    typeSpeed: 40,
    backSpeed: 44,
    backDelay: 1500,
    loop: true,
    smartBackspace: true,
    cursorChar: '▍'
  });
})();

/* ScrollReveal animations (auto-disabled for reduced motion) */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof ScrollReveal === 'undefined') return;

  const sr = ScrollReveal({
    distance: '40px',
    duration: 800,
    easing: 'cubic-bezier(.2,.8,.2,1)',
    interval: 80,
    viewOffset: { top: 40, bottom: 40 }
  });

  sr.reveal('.hero-content > *', { origin: 'bottom' });
  sr.reveal('.profile-photo-wrap', { origin: 'right', distance: '60px' });
  sr.reveal('.about-photo', { origin: 'left' });
  sr.reveal('.about-content > *', { origin: 'bottom' });
  sr.reveal('.service-card', { origin: 'bottom', interval: 100 });
  sr.reveal('.project-card', { origin: 'bottom', interval: 120 });
  sr.reveal('.contact-info', { origin: 'left' });
  sr.reveal('.contact-form', { origin: 'right' });
})();

/* Contact form handler (mailto fallback) */
function handleContactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  const status = $('#form-status');
  const name = $('#name')?.value.trim();
  const email = $('#email')?.value.trim();
  const subject = $('#subject')?.value.trim();
  const phone = $('#phone')?.value.trim();
  const message = $('#message')?.value.trim();

  if (!name || !email || !subject || !message) {
    status.textContent = 'Please fill in all required fields.';
    status.style.color = '#ef4444';
    return;
  }

  const to = 'your-email@example.com'; // replace with your email
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n${message}`
  );
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;

  status.textContent = 'Opening your email app...';
  status.style.color = '';
  window.location.href = mailto;

  setTimeout(() => {
    status.textContent = 'If your email app didn’t open, please email me directly at ' + to + '.';
  }, 1200);

  form.reset();
}

/* Back-to-top smooth link focus fix */
(() => {
  const back = document.querySelector('.back-to-top');
  back?.addEventListener('click', () => {
    const home = document.getElementById('home');
    home?.setAttribute('tabindex', '-1');
    home?.focus({ preventScroll: true });
    setTimeout(() => home?.removeAttribute('tabindex'), 100);
  });
})();