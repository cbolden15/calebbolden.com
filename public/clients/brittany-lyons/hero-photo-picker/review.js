(() => {
  'use strict';
  const data = window.heroOptions;
  const tabs = document.getElementById('options');
  const panel = document.getElementById('selected-option');
  const video = document.getElementById('preview');
  const sequence = document.getElementById('sequence');
  const error = document.getElementById('player-error');
  let selected = data.options[0];
  data.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.id = `option-${option.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'selected-option');
    button.innerHTML = `<span class="number">${option.id}</span><strong>${option.title}</strong><small>${option.recommended ? 'Suggested starting point' : option.new_count === 4 ? 'All four new photos' : `${option.new_count} new photos`}</small>`;
    button.addEventListener('click', () => showOption(option));
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % data.options.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + data.options.length) % data.options.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = data.options.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        showOption(data.options[target]);
        tabs.children[target].focus();
      }
    });
    tabs.append(button);
  });
  function showOption(option) {
    selected = option;
    video.pause();
    error.hidden = true;
    video.poster = option.poster;
    video.src = option.video;
    video.setAttribute('aria-label', `Option ${option.id}: ${option.title}`);
    video.load();
    panel.setAttribute('aria-labelledby', `option-${option.id}`);
    document.getElementById('option-title').textContent = option.title;
    document.getElementById('option-description').textContent = option.description;
    document.getElementById('download').href = option.video;
    document.getElementById('specs').textContent = `${option.new_count} new photos + 3 retained interiors · ${option.duration.toFixed(1)} seconds · Silent`;
    [...tabs.children].forEach((tab, i) => {
      const active = data.options[i].id === option.id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    sequence.replaceChildren();
    sequence.style.setProperty('--count', option.shots.length);
    option.timeline.forEach((scene, i) => {
      const shot = data.shots[scene.shot];
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scene';
      button.setAttribute('aria-label', `Jump to scene ${i + 1}: ${shot.name}, ${shot.kind.toLowerCase()}`);
      button.innerHTML = `<img src="${shot.photo}" alt="${shot.name}" loading="lazy"><span>${i + 1}. ${shot.short}</span><small>${shot.kind}</small>`;
      button.addEventListener('click', () => {
        video.pause();
        if (video.readyState >= 1) video.currentTime = scene.sample;
        else video.addEventListener('loadedmetadata', () => { video.currentTime = scene.sample; }, { once: true });
      });
      li.append(button);
      sequence.append(li);
    });
    updateScene();
  }
  function updateScene() {
    let current = 0;
    selected.timeline.forEach((scene, i) => { if (video.currentTime >= scene.start + (i ? .25 : 0)) current = i; });
    sequence.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  }
  video.addEventListener('timeupdate', updateScene);
  video.addEventListener('error', () => { error.hidden = false; });
  document.getElementById('overlay-toggle').addEventListener('change', event => { document.getElementById('hero-text').hidden = !event.target.checked; });
  document.getElementById('mobile-toggle').addEventListener('change', event => { document.getElementById('player-frame').classList.toggle('mobile', event.target.checked); });
  showOption(selected);
})();
