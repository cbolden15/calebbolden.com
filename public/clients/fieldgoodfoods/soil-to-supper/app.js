const header = document.querySelector('[data-header]');
const hero = document.querySelector('[data-hero]');
const heroVideo = document.querySelector('[data-hero-video]');
const heroLoop = document.querySelector('[data-hero-loop]');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let heroVisible = true;
let pageLoaded = document.readyState === 'complete';
let activeHero = heroVideo;

// Hero video candidates under review. Pick with ?hero=a|b|c or the switcher; the choice persists per browser.
const HERO_CANDIDATES = {
  a: { file: 'hero-montage' },
  b: { file: 'hero-cinematic' },
  c: { file: 'hero-product' },
};
const heroSwitcher = document.querySelector('[data-hero-switcher]');

function heroChoice() {
  const fromUrl = new URLSearchParams(window.location.search).get('hero');
  if (fromUrl && HERO_CANDIDATES[fromUrl]) return fromUrl;
  try {
    const stored = window.localStorage.getItem('fgf-hero-candidate');
    if (stored && HERO_CANDIDATES[stored]) return stored;
  } catch {}
  return 'a';
}

function setHeroCandidate(key, { fromUser = false } = {}) {
  const candidate = HERO_CANDIDATES[key];
  if (!candidate || !heroVideo || !heroLoop) return;
  const base = `assets/hero-ads/${candidate.file}`;

  hero?.style.setProperty('--hero-poster', `url("${base}-poster-desktop.webp")`);
  hero?.style.setProperty('--hero-poster-mobile', `url("${base}-poster-mobile.webp")`);

  heroLoop.pause();
  heroLoop.classList.remove('is-ready');
  heroLoop.src = `${base}-loop-1080.mp4`;
  heroLoop.load();

  heroVideo.pause();
  heroVideo.classList.remove('is-ready');
  heroVideo.src = `${base}-1080.mp4`;
  heroVideo.addEventListener('canplay', () => heroVideo.classList.add('is-ready'), { once: true });
  heroVideo.onended = () => {
    activeHero = heroLoop;
    heroLoop.classList.add('is-ready');
    playHeroWhenReady();
    window.setTimeout(() => heroVideo.classList.remove('is-ready'), 400);
  };
  heroVideo.load();
  activeHero = heroVideo;
  playHeroWhenReady();

  heroSwitcher?.querySelectorAll('[data-hero-pick]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.heroPick === key));
  });
  if (fromUser) {
    try { window.localStorage.setItem('fgf-hero-candidate', key); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set('hero', key);
    window.history.replaceState(null, '', url);
  }
}

heroSwitcher?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-hero-pick]');
  if (button) setHeroCandidate(button.dataset.heroPick, { fromUser: true });
});

function playHeroWhenReady() {
  if (!activeHero || reducedMotion || !heroVisible || !pageLoaded) return;
  activeHero.play().catch(() => {});
}

if (heroVideo && heroLoop) setHeroCandidate(heroChoice());

// Homepage photograph candidates under review. Pick with ?media=herd:2,soil:1,... or the panel; choices persist per browser.
// Candidate 0 is the current photograph; 1..3 are the new options in assets/stills/<slot>-<n>.webp.
const STILL_SLOTS = {
  herd: 'herd-oaks',
  soil: 'soil-cut',
  check: 'pasture-check',
  cuts: 'cuts-board',
  table: 'family-table',
};
const stillPicks = {};
const stillOriginal = {};
document.querySelectorAll('[data-still]').forEach((image) => { stillOriginal[image.dataset.still] = image.getAttribute('src'); });

function readStillPicks() {
  const picks = {};
  try {
    Object.assign(picks, JSON.parse(window.localStorage.getItem('fgf-still-picks') || '{}'));
  } catch {}
  const fromUrl = new URLSearchParams(window.location.search).get('media');
  if (fromUrl) {
    fromUrl.split(',').forEach((pair) => {
      const [slot, n] = pair.split(':');
      if (STILL_SLOTS[slot] && /^[0-3]$/.test(n)) picks[slot] = Number(n);
    });
  }
  return picks;
}

function setStill(slot, n, { fromUser = false } = {}) {
  const image = document.querySelector(`[data-still="${slot}"]`);
  if (!image || !STILL_SLOTS[slot]) return;
  stillPicks[slot] = n;
  image.src = n === 0 ? stillOriginal[slot] : `assets/stills/${STILL_SLOTS[slot]}-${n}.webp`;
  document.querySelectorAll(`[data-still-pick^="${slot}:"]`).forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.stillPick === `${slot}:${n}`));
  });
  if (fromUser) {
    try { window.localStorage.setItem('fgf-still-picks', JSON.stringify(stillPicks)); } catch {}
    const url = new URL(window.location.href);
    const encoded = Object.entries(stillPicks).filter(([, value]) => value > 0).map(([key, value]) => `${key}:${value}`).join(',');
    if (encoded) url.searchParams.set('media', encoded); else url.searchParams.delete('media');
    window.history.replaceState(null, '', url);
  }
}

const reviewPanel = document.querySelector('[data-review-panel]');
reviewPanel?.addEventListener('click', (event) => {
  const pick = event.target.closest('[data-still-pick]');
  if (pick) {
    const [slot, n] = pick.dataset.stillPick.split(':');
    setStill(slot, Number(n), { fromUser: true });
    return;
  }
  if (event.target.closest('[data-review-toggle]')) {
    const open = reviewPanel.classList.toggle('is-collapsed') === false;
    event.target.closest('[data-review-toggle]').setAttribute('aria-expanded', String(open));
    return;
  }
  const copy = event.target.closest('[data-review-copy]');
  if (copy) {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      copy.textContent = 'Link copied';
      window.setTimeout(() => { copy.textContent = 'Copy link to these picks'; }, 1800);
    }).catch(() => {});
  }
});

Object.entries(readStillPicks()).forEach(([slot, n]) => setStill(slot, n));

if (!pageLoaded) {
  window.addEventListener(
    'load',
    () => {
      pageLoaded = true;
      window.setTimeout(playHeroWhenReady, 150);
    },
    { once: true }
  );
}

function closeMenu() {
  if (!header || !menuToggle) return;
  header.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (header && hero && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      header.classList.toggle('is-solid', !entry.isIntersecting);
      if (!heroVideo || reducedMotion) return;

      if (entry.isIntersecting) {
        playHeroWhenReady();
      } else {
        activeHero?.pause();
      }
    },
    { rootMargin: '-72px 0px 0px 0px', threshold: 0 }
  );
  heroObserver.observe(hero);
} else if (heroVideo && !reducedMotion) {
  playHeroWhenReady();
}

if (heroVideo && reducedMotion) {
  heroVideo.pause();
  heroLoop?.pause();
}

if (header && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const opening = !header.classList.contains('is-open');
    header.classList.toggle('is-open', opening);
    document.body.classList.toggle('nav-open', opening);
    menuToggle.setAttribute('aria-expanded', String(opening));
  });

  primaryNav?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealTargets = document.querySelectorAll('[data-reveal]');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  revealTargets.forEach((target) => revealObserver.observe(target));
}

function showStatus(status, message, state) {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

const newsletterForm = document.querySelector('[data-newsletter]');
newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email;
  const status = form.querySelector('[data-form-status], [data-newsletter-status]');
  const button = form.querySelector('button[type="submit"]');

  if (!email.checkValidity()) {
    showStatus(status, 'Enter a valid email address.', 'error');
    email.focus();
    return;
  }

  const buttonLabel = button.textContent;
  button.disabled = true;
  button.textContent = 'Joining...';
  form.setAttribute('aria-busy', 'true');

  window.setTimeout(() => {
    showStatus(status, 'You are on the list. Watch your inbox for farm news and specials.', 'success');
    form.reset();
    form.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = buttonLabel;
  }, 350);
});

const finderForm = document.querySelector('[data-finder]');
finderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const choice = form.querySelector('input[name="occasion"]:checked');
  const firstChoice = form.querySelector('input[name="occasion"]');
  const email = form.elements.email;
  const status = form.querySelector('[data-form-status], [data-finder-status]');
  const button = form.querySelector('button[type="submit"]');

  if (!choice) {
    showStatus(status, 'Choose what you are cooking for.', 'error');
    firstChoice?.focus();
    return;
  }

  if (!email.checkValidity()) {
    showStatus(status, 'Enter a valid email address.', 'error');
    email.focus();
    return;
  }

  const matches = {
    everyday: 'Prime Top Sirloin',
    weekend: 'Prime T-Bone',
    celebration: 'Prime Porterhouse',
  };

  button.disabled = true;
  button.textContent = 'Finding...';
  form.setAttribute('aria-busy', 'true');

  window.setTimeout(() => {
    showStatus(status, `Your match is the ${matches[choice.value]}. We sent the cut guide to your inbox.`, 'success');
    form.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = 'Find my steak';
  }, 350);
});

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
