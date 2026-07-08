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

    // mobile menu
    var mob = document.getElementById('mobileNav'), burger = document.getElementById('burger'), closeNav = document.getElementById('closeNav');
    if (burger) burger.addEventListener('click', function () { mob.classList.add('is-open'); document.body.style.overflow = 'hidden'; });
    if (closeNav) closeNav.addEventListener('click', function () { mob.classList.remove('is-open'); document.body.style.overflow = ''; });
    if (mob) mob.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mob.classList.remove('is-open'); document.body.style.overflow = ''; }); });

    // FAQ accordions
    document.querySelectorAll('.bli-faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.bli-faq-item'), a = item.querySelector('.bli-faq-a');
        var open = item.classList.toggle('is-open');
        q.setAttribute('aria-expanded', open ? 'true' : 'false');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
      });
    });

    // homepage hero: video only on desktop + motion-ok (poster is the LCP asset either way)
    var hv = document.getElementById('heroVideo'), hi = document.getElementById('heroImage');
    if (hv && hi) {
      var btns = document.querySelectorAll('[data-hero]');
      function setHero(mode){
        var v = mode === 'video';
        hv.style.display = v ? '' : 'none'; hi.style.display = v ? 'none' : '';
        if (v) { var p = hv.play(); if (p && p.catch) p.catch(function(){}); } else { hv.pause(); }
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.hero === mode)); });
      }
      btns.forEach(function (b) { b.addEventListener('click', function () { setHero(b.dataset.hero); }); });
      var wantsVideo = matchMedia('(min-width: 768px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      setHero(wantsVideo ? 'video' : 'image');
    }
  });
})();
