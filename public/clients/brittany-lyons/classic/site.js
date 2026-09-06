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

/* Palette exploration switcher (2026-08-16) — preview-only.
   Remove this block (and the palette block at the end of site.css) once a direction is chosen.
   The data-bli-palette attribute itself is set by the inline head script to avoid a flash. */
(function () {
  var PALETTES = [
    ['', 'Current · Navy & Green', '#46567C', '#5C7F74'],
    ['navy-gold', 'Navy & Gold', '#46567C', '#C1A948'],
    ['heritage-gold', 'Heritage Gold', '#2E2C28', '#C1A948'],
    ['gold-trim', 'Navy & Green · Gold Accents', '#5C7F74', '#C1A948'],
    ['driftwood-gold', 'Driftwood & Gold', '#6E5F4B', '#C1A948'],
    ['sage-gold', 'Sage & Gold', '#5C6B54', '#C1A948'],
    ['chambray-gold', 'Chambray & Gold', '#4E6A86', '#C1A948'],
    ['petal-gold', 'Petal & Gold', '#83615D', '#C1A948'],
    ['lavender-quiet', 'Lavender Quiet', '#66627F', '#897C68'],
    ['seaglass-air', 'Seaglass Air', '#557084', '#897C68']
  ];
  var BG_PALETTES = [
    ['warm-linen', 'Warm Linen · Navy & Gold', '#F5EFE2', '#46567C'],
    ['seaglass-wash', 'Seaglass Wash', '#EFF3EE', '#46567C'],
    ['chambray-mist', 'Chambray Mist', '#EFF2F6', '#4E6A86'],
    ['ivory-gallery', 'Ivory Gallery', '#FFFFFF', '#3A4148'],
    ['sandstone-gold', 'Sandstone & Gold', '#EAE2D2', '#5C4F3D'],
    ['blush-linen', 'Blush Linen', '#F7EFEA', '#7A5E5B'],
    ['sage-mist', 'Sage Mist', '#EEF1E9', '#5C6B54'],
    ['lavender-mist', 'Lavender Mist', '#F1F0F6', '#66627F'],
    ['porcelain-white', 'Porcelain & White', '#FAFBFC', '#4C6E92'],
    ['stone-quiet', 'Stone Quiet', '#F1EFEC', '#4A4A46']
  ];
  PALETTES = PALETTES.concat(BG_PALETTES);
  var cur = document.documentElement.getAttribute('data-bli-palette') || '';
  if (!PALETTES.some(function (p) { return p[0] === cur; })) cur = '';

  var root = document.createElement('div');
  root.className = 'bli-palette-switch';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'bli-palette-switch__btn';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  var menu = document.createElement('div');
  menu.className = 'bli-palette-switch__menu';
  menu.setAttribute('role', 'menu');

  function swatch(c1, c2) {
    var s = document.createElement('span');
    s.className = 'bli-palette-sw';
    s.style.background = 'linear-gradient(135deg,' + c1 + ' 0 50%,' + c2 + ' 50% 100%)';
    return s;
  }
  function labelFor(key) {
    var m = PALETTES.filter(function (p) { return p[0] === key; })[0] || PALETTES[0];
    return m[1];
  }
  function renderBtn() {
    btn.textContent = '';
    var m = PALETTES.filter(function (p) { return p[0] === cur; })[0] || PALETTES[0];
    btn.appendChild(swatch(m[2], m[3]));
    btn.appendChild(document.createTextNode('Palette · ' + m[1]));
  }
  function apply(key) {
    cur = key;
    if (key) {
      document.documentElement.setAttribute('data-bli-palette', key);
      try { localStorage.setItem('bliPalette', key); } catch (e) {}
    } else {
      document.documentElement.removeAttribute('data-bli-palette');
      try { localStorage.removeItem('bliPalette'); } catch (e) {}
    }
    renderBtn();
    Array.prototype.forEach.call(menu.children, function (o) {
      o.setAttribute('aria-pressed', o.dataset.key === key ? 'true' : 'false');
    });
  }
  function groupLabel(text) {
    var g = document.createElement('div');
    g.className = 'bli-palette-switch__group';
    g.textContent = text;
    return g;
  }
  PALETTES.forEach(function (p) {
    if (p[0] === 'navy-gold') menu.appendChild(groupLabel('Accent studies'));
    if (p[0] === 'warm-linen') menu.appendChild(groupLabel('Background studies'));
    var o = document.createElement('button');
    o.type = 'button';
    o.className = 'bli-palette-switch__opt';
    o.dataset.key = p[0];
    o.setAttribute('role', 'menuitem');
    o.setAttribute('aria-pressed', p[0] === cur ? 'true' : 'false');
    o.appendChild(swatch(p[2], p[3]));
    o.appendChild(document.createTextNode(p[1]));
    o.addEventListener('click', function () {
      apply(p[0]);
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    menu.appendChild(o);
  });
  btn.addEventListener('click', function () {
    var open = root.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) {
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  renderBtn();
  root.appendChild(btn);
  root.appendChild(menu);
  document.body.appendChild(root);
})();
