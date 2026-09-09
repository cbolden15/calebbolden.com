/* Private Gilded Light review tool. Choices are saved only in this browser. */
(() => {
  'use strict';
  const pairings = [
  {
    "id": "01",
    "heading": "Lora",
    "body": "DM Sans",
    "group": "Serif headings"
  },
  {
    "id": "02",
    "heading": "Libre Baskerville",
    "body": "Source Sans 3",
    "group": "Serif headings"
  },
  {
    "id": "03",
    "heading": "Merriweather",
    "body": "Open Sans",
    "group": "Serif headings"
  },
  {
    "id": "04",
    "heading": "Source Serif 4",
    "body": "Source Sans 3",
    "group": "Serif headings"
  },
  {
    "id": "05",
    "heading": "Crimson Pro",
    "body": "Work Sans",
    "group": "Serif headings"
  },
  {
    "id": "06",
    "heading": "EB Garamond",
    "body": "Lato",
    "group": "Serif headings"
  },
  {
    "id": "07",
    "heading": "Spectral",
    "body": "Karla",
    "group": "Serif headings"
  },
  {
    "id": "08",
    "heading": "Literata",
    "body": "Nunito Sans",
    "group": "Serif headings"
  },
  {
    "id": "09",
    "heading": "PT Serif",
    "body": "PT Sans",
    "group": "Serif headings"
  },
  {
    "id": "10",
    "heading": "Vollkorn",
    "body": "Public Sans",
    "group": "Serif headings"
  },
  {
    "id": "11",
    "heading": "Alegreya",
    "body": "Cabin",
    "group": "Serif headings"
  },
  {
    "id": "12",
    "heading": "Newsreader",
    "body": "Figtree",
    "group": "Serif headings"
  },
  {
    "id": "13",
    "heading": "Bitter",
    "body": "DM Sans",
    "group": "Serif headings"
  },
  {
    "id": "14",
    "heading": "Montserrat",
    "body": "Source Sans 3",
    "group": "Sans serif headings"
  },
  {
    "id": "15",
    "heading": "Raleway",
    "body": "Lato",
    "group": "Sans serif headings"
  },
  {
    "id": "16",
    "heading": "Jost",
    "body": "Nunito Sans",
    "group": "Sans serif headings"
  },
  {
    "id": "17",
    "heading": "Figtree",
    "body": "Lora",
    "group": "Sans serif headings"
  },
  {
    "id": "18",
    "heading": "Josefin Sans",
    "body": "Open Sans",
    "group": "Sans serif headings"
  },
  {
    "id": "19",
    "heading": "Source Sans 3",
    "body": "Source Serif 4",
    "group": "Sans serif headings"
  },
  {
    "id": "20",
    "heading": "Work Sans",
    "body": "Libre Baskerville",
    "group": "Sans serif headings"
  }
];
  const storageKey = 'bli-gilded-font-pairing-v1';
  const root = document.documentElement;
  let activeIndex = 0;
  let requestedIndex = 0;
  let revision = 0;
  const fontLoads = new Map();
  const preview = document.createElement('aside');
  preview.className = 'bli-font-preview';
  preview.setAttribute('aria-label', 'Font preview');
  preview.setAttribute('data-lenis-prevent', '');
  preview.innerHTML = `
    <section class="bli-font-preview__panel" id="bli-font-panel" role="dialog" aria-labelledby="bli-font-title" hidden>
      <div class="bli-font-preview__top">
        <h2 class="bli-font-preview__title" id="bli-font-title">Find your fonts</h2>
        <button class="bli-font-preview__close" type="button" aria-label="Close font preview">Close</button>
      </div>
      <p class="bli-font-preview__intro">Compare headings and paragraph text across the site. Your choice stays in this browser.</p>
      <label class="bli-font-preview__label" for="bli-font-select">Choose a pairing</label>
      <select class="bli-font-preview__select" id="bli-font-select"></select>
      <dl class="bli-font-preview__names">
        <div><dt>Headings</dt><dd class="bli-font-preview__heading-name">Lora</dd></div>
        <div><dt>Paragraphs</dt><dd class="bli-font-preview__body-name">DM Sans</dd></div>
      </dl>
      <div class="bli-font-preview__steps">
        <button type="button" data-step="-1" aria-label="Previous font pairing">← Previous</button>
        <button type="button" data-step="1" aria-label="Next font pairing">Next →</button>
      </div>
      <button class="bli-font-preview__reset" type="button">Reset to current: Lora + DM Sans</button>
      <p class="bli-font-preview__status" role="status" aria-live="polite" aria-atomic="true"></p>
    </section>
    <button class="bli-font-preview__launch" type="button" aria-expanded="false" aria-controls="bli-font-panel">
      <span>Fonts</span><span class="bli-font-preview__count">01 / 20</span>
    </button>`;
  document.body.append(preview);
  const panel = preview.querySelector('.bli-font-preview__panel');
  const launcher = preview.querySelector('.bli-font-preview__launch');
  const select = preview.querySelector('select');
  const status = preview.querySelector('[role="status"]');
  const count = preview.querySelector('.bli-font-preview__count');
  const headingName = preview.querySelector('.bli-font-preview__heading-name');
  const bodyName = preview.querySelector('.bli-font-preview__body-name');
  for (const group of new Set(pairings.map(pair => pair.group))) {
    const options = document.createElement('optgroup');
    options.label = group;
    for (const pair of pairings.filter(pair => pair.group === group)) {
      const option = document.createElement('option');
      option.value = pair.id;
      option.textContent = `${pair.id}. ${pair.heading} + ${pair.body}${pair.id === '01' ? ' (current)' : ''}`;
      options.append(option);
    }
    select.append(options);
  }

  function setOpen(open, returnFocus = false) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) select.focus({ preventScroll: true });
    else if (returnFocus) launcher.focus({ preventScroll: true });
  }
  launcher.addEventListener('click', () => setOpen(panel.hidden));
  preview.querySelector('.bli-font-preview__close').addEventListener('click', () => setOpen(false, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
  });
  document.getElementById('burger')?.addEventListener('click', () => setOpen(false));

  function loadFamily(family) {
    if (!fontLoads.has(family)) {
      const promise = Promise.all(['normal', 'italic'].flatMap(style =>
        [400, 500, 700].map(weight => document.fonts.load(`${style} ${weight} 16px "BLI Preview ${family}"`, 'Brittany'))
      )).then(faces => {
        if (faces.some(result => !result.length)) throw new Error('Font face unavailable');
      }).catch(error => {
        fontLoads.delete(family);
        throw error;
      });
      fontLoads.set(family, promise);
    }
    return fontLoads.get(family);
  }

  async function applyPair(index) {
    const currentRevision = ++revision;
    requestedIndex = index;
    const pair = pairings[index];
    select.value = pair.id;
    preview.dataset.loading = 'true';
    status.dataset.error = 'false';
    status.textContent = `Loading ${pair.heading} + ${pair.body}…`;
    let timeout;
    try {
      await Promise.race([
        Promise.all([loadFamily(pair.heading), loadFamily(pair.body)]),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Font load timed out')), 10000); })
      ]);
      if (currentRevision !== revision) return;
      const headingFallback = pair.group === 'Serif headings' ? 'Georgia, serif' : 'system-ui, sans-serif';
      const bodyFallback = ['Lora', 'Libre Baskerville', 'Source Serif 4'].includes(pair.body) ? 'Georgia, serif' : 'system-ui, sans-serif';
      root.style.setProperty('--bli-font-display', `"BLI Preview ${pair.heading}", ${headingFallback}`);
      root.style.setProperty('--bli-font-sans', `"BLI Preview ${pair.body}", ${bodyFallback}`);
      root.dataset.fontPair = pair.id;
      activeIndex = index;
      headingName.textContent = pair.heading;
      bodyName.textContent = pair.body;
      count.textContent = `${pair.id} / ${pairings.length}`;
      try {
        localStorage.setItem(storageKey, pair.id);
        status.textContent = `Pair ${pair.id} applied. Saved for your next page or visit.`;
      } catch {
        status.textContent = `Pair ${pair.id} applied on this page. Browser settings prevent saving it.`;
      }
      requestAnimationFrame(() => window.ScrollTrigger?.refresh());
    } catch {
      if (currentRevision !== revision) return;
      requestedIndex = activeIndex;
      select.value = pairings[activeIndex].id;
      status.dataset.error = 'true';
      status.textContent = 'Fonts couldn’t load. Try another pairing or reload this page.';
    } finally {
      clearTimeout(timeout);
      if (currentRevision === revision) preview.dataset.loading = 'false';
    }
  }
  select.addEventListener('change', () => applyPair(pairings.findIndex(pair => pair.id === select.value)));
  preview.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    applyPair((requestedIndex + Number(button.dataset.step) + pairings.length) % pairings.length);
  }));
  preview.querySelector('.bli-font-preview__reset').addEventListener('click', () => applyPair(0));
  let initialIndex = 0;
  try {
    const saved = localStorage.getItem(storageKey);
    initialIndex = Math.max(0, pairings.findIndex(pair => pair.id === saved));
  } catch { /* The controls still work when browser storage is unavailable. */ }
  applyPair(initialIndex);
})();
