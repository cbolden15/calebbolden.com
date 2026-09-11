/* Brittany Lyons Interiors — shared behavior (loaded with defer on every page).
   Pages also include an inline `document.documentElement.classList.add('js')` in <head>
   so reveal styling only applies when JS runs (content is fully visible without JS). */
(function () {
  document.documentElement.classList.add('js');
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    // scroll-reveal (enhances already-visible content)
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); } });
      }, { threshold: .05, rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.bli-reveal').forEach(function (el) { obs.observe(el); });
    } else {
      document.querySelectorAll('.bli-reveal').forEach(function (el) { el.classList.add('is-in'); });
    }

    // header densify on scroll
    var hdr = document.getElementById('hdr');
    function onScroll(){ if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 24); }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    // Desktop dropdowns
    var menuButtons = Array.prototype.slice.call(document.querySelectorAll('.bli-menu-button'));
    function closeMenus(except) {
      menuButtons.forEach(function (button) {
        if (button !== except) button.setAttribute('aria-expanded', 'false');
      });
    }
    menuButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var opening = button.getAttribute('aria-expanded') !== 'true';
        closeMenus(button);
        button.setAttribute('aria-expanded', opening ? 'true' : 'false');
      });
      button.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          button.setAttribute('aria-expanded', 'true');
          var firstLink = document.getElementById(button.getAttribute('aria-controls')).querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });
    });
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.bli-hasmenu')) closeMenus();
    });

    // mobile menu
    var mob = document.getElementById('mobileNav'), burger = document.getElementById('burger'), closeNav = document.getElementById('closeNav');
    var lastFocused;
    function openMobileMenu() {
      if (!mob || !burger) return;
      lastFocused = document.activeElement;
      mob.classList.add('is-open');
      mob.removeAttribute('inert');
      mob.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeNav.focus();
    }
    function closeMobileMenu() {
      if (!mob || !burger) return;
      mob.classList.remove('is-open');
      mob.setAttribute('inert', '');
      mob.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    if (mob) { mob.setAttribute('inert', ''); mob.setAttribute('aria-hidden', 'true'); }
    if (burger) burger.addEventListener('click', openMobileMenu);
    if (closeNav) closeNav.addEventListener('click', closeMobileMenu);
    if (mob) mob.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMobileMenu); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Tab' && mob && mob.classList.contains('is-open')) {
        var focusable = Array.prototype.slice.call(mob.querySelectorAll('button, a[href]'));
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      if (event.key !== 'Escape') return;
      if (mob && mob.classList.contains('is-open')) { closeMobileMenu(); return; }
      var openButton = menuButtons.find(function (button) { return button.getAttribute('aria-expanded') === 'true'; });
      closeMenus();
      if (openButton) openButton.focus();
    });

    // FAQ accordions
    document.querySelectorAll('.bli-faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.bli-faq-item'), a = item.querySelector('.bli-faq-a');
        var open = item.classList.toggle('is-open');
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
      });
    });

    // homepage hero: play once on desktop; use the poster on mobile or reduced motion
    var hv = document.getElementById('heroVideo'), hi = document.getElementById('heroImage');
    if (hv && hi) {
      var wantsVideo = matchMedia('(min-width: 768px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      hv.style.display = wantsVideo ? '' : 'none';
      hi.style.display = wantsVideo ? 'none' : '';
      if (wantsVideo) {
        var p = hv.play();
        if (p && p.catch) p.catch(function(){});
      } else {
        hv.pause();
      }
    }
  });
})();
