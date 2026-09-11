(() => {
  "use strict";

  const deck = document.querySelector("#logo-deck");
  const slides = [...document.querySelectorAll(".logo-slide")];
  const tabs = [...document.querySelectorAll(".option-tab")];
  const selectButtons = [...document.querySelectorAll(".select-button")];
  const previousButton = document.querySelector("#previous-option");
  const nextButton = document.querySelector("#next-option");
  const currentCount = document.querySelector("#current-count");
  const preferenceValue = document.querySelector("#preference-value");
  const copyButton = document.querySelector("#copy-selection");
  const clearButton = document.querySelector("#clear-selection");
  const status = document.querySelector("#carousel-status");
  const optionRail = document.querySelector(".option-rail");

  if (!deck || slides.length === 0) {
    return;
  }

  const storageKey = "fieldgoodfoods-logo-preference";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const optionIndexes = new Map(slides.map((slide, index) => [slide.dataset.option, index]));
  const optionTitles = new Map(
    slides.map((slide) => [slide.dataset.option, slide.querySelector("h3").textContent.trim()])
  );

  let activeIndex = 0;
  let selectedOption = null;
  let requestedIndex = null;
  let scrollFrame = null;
  let scrollSettledTimer = null;
  let resizeFrame = null;
  let copyResetTimer = null;

  function clampIndex(index) {
    return Math.max(0, Math.min(index, slides.length - 1));
  }

  function leftForSlide(slide) {
    const deckRect = deck.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    return deck.scrollLeft + slideRect.left - deckRect.left;
  }

  function nearestSlideIndex() {
    const deckCenter = deck.scrollLeft + deck.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = leftForSlide(slide) + slide.offsetWidth / 2;
      const distance = Math.abs(deckCenter - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function centerActiveTab(index) {
    const tab = tabs[index];
    if (!tab || optionRail.scrollWidth <= optionRail.clientWidth) {
      return;
    }

    const left = tab.offsetLeft - (optionRail.clientWidth - tab.offsetWidth) / 2;
    optionRail.scrollTo({
      left,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  }

  function updateActive(index, announce = false) {
    const nextIndex = clampIndex(index);
    const changed = nextIndex !== activeIndex;
    activeIndex = nextIndex;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    tabs.forEach((tab, tabIndex) => {
      if (tabIndex === activeIndex) {
        tab.setAttribute("aria-current", "true");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    currentCount.textContent = String(activeIndex + 1).padStart(2, "0");
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;

    if (changed) {
      centerActiveTab(activeIndex);
    }

    if (announce) {
      const option = slides[activeIndex].dataset.option;
      status.textContent = `Option ${option}: ${optionTitles.get(option)}. Slide ${activeIndex + 1} of ${slides.length}.`;
    }
  }

  function goTo(index, { announce = true, behavior } = {}) {
    const nextIndex = clampIndex(index);
    const distance = Math.abs(nextIndex - activeIndex);
    const scrollBehavior =
      behavior || (reducedMotion.matches || distance > 1 ? "auto" : "smooth");
    requestedIndex = nextIndex;
    updateActive(nextIndex, announce);
    deck.scrollTo({
      left: leftForSlide(slides[nextIndex]),
      behavior: scrollBehavior,
    });
  }

  function releaseProgrammaticScroll() {
    requestedIndex = null;
  }

  function onDeckScroll() {
    if (scrollFrame === null) {
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        if (requestedIndex === null) {
          updateActive(nearestSlideIndex());
        }
      });
    }

    window.clearTimeout(scrollSettledTimer);
    scrollSettledTimer = window.setTimeout(() => {
      requestedIndex = null;
      updateActive(nearestSlideIndex(), true);
    }, 140);
  }

  function normalizeOption(value) {
    const option = String(value || "").toUpperCase();
    return optionIndexes.has(option) ? option : null;
  }

  function updatePreferenceUrl(option) {
    try {
      const url = new URL(window.location.href);
      if (option) {
        url.searchParams.set("pick", option);
      } else {
        url.searchParams.delete("pick");
      }
      window.history.replaceState({}, "", url);
    } catch (_error) {
      // Selection still works when browser privacy settings block history updates.
    }
  }

  function savePreference(option) {
    try {
      if (option) {
        window.localStorage.setItem(storageKey, option);
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch (_error) {
      // The shareable URL remains available when storage is disabled.
    }
  }

  function readSavedPreference() {
    try {
      return normalizeOption(window.localStorage.getItem(storageKey));
    } catch (_error) {
      return null;
    }
  }

  function setPreference(option, { announce = true, syncUrl = true } = {}) {
    const normalizedOption = normalizeOption(option);
    if (!normalizedOption) {
      return;
    }

    selectedOption = normalizedOption;
    slides.forEach((slide) => {
      slide.classList.toggle("is-selected", slide.dataset.option === selectedOption);
    });

    selectButtons.forEach((button) => {
      const isSelected = button.dataset.select === selectedOption;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
      button.querySelector(".select-button__text").textContent = isSelected
        ? `Selected: option ${selectedOption}`
        : `Choose option ${button.dataset.select}`;
    });

    preferenceValue.textContent = `${selectedOption}: ${optionTitles.get(selectedOption)}`;
    copyButton.disabled = false;
    clearButton.disabled = false;
    savePreference(selectedOption);

    if (syncUrl) {
      updatePreferenceUrl(selectedOption);
    }

    if (announce) {
      status.textContent = `Option ${selectedOption}, ${optionTitles.get(selectedOption)}, is now your preferred logo.`;
    }
  }

  function clearPreference() {
    selectedOption = null;
    slides.forEach((slide) => slide.classList.remove("is-selected"));
    selectButtons.forEach((button) => {
      button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", "false");
      button.querySelector(".select-button__text").textContent = `Choose option ${button.dataset.select}`;
    });
    preferenceValue.textContent = "Nothing selected yet";
    copyButton.disabled = true;
    clearButton.disabled = true;
    savePreference(null);
    updatePreferenceUrl(null);
    status.textContent = "Logo preference cleared.";
  }

  function fallbackCopy(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }

  async function copySelectionLink() {
    if (!selectedOption) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("pick", selectedOption);
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url.toString());
        copied = true;
      } else {
        copied = fallbackCopy(url.toString());
      }
    } catch (_error) {
      copied = fallbackCopy(url.toString());
    }

    window.clearTimeout(copyResetTimer);
    copyButton.textContent = copied ? "Link copied" : "Copy failed";
    status.textContent = copied
      ? `Selection link for option ${selectedOption} copied.`
      : "The link could not be copied. Copy it from the browser address bar.";
    copyResetTimer = window.setTimeout(() => {
      copyButton.textContent = "Copy selection link";
    }, 1800);
  }

  previousButton.addEventListener("click", () => goTo(activeIndex - 1));
  nextButton.addEventListener("click", () => goTo(activeIndex + 1));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => goTo(optionIndexes.get(tab.dataset.goTo)));
  });

  selectButtons.forEach((button) => {
    button.addEventListener("click", () => setPreference(button.dataset.select));
  });

  copyButton.addEventListener("click", copySelectionLink);
  clearButton.addEventListener("click", clearPreference);

  deck.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const destinations = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: slides.length - 1,
    };

    if (Object.prototype.hasOwnProperty.call(destinations, event.key)) {
      event.preventDefault();
      goTo(destinations[event.key]);
    }
  });

  optionRail.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    const focusedIndex = tabs.indexOf(document.activeElement);
    if (focusedIndex === -1) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = clampIndex(focusedIndex + direction);
    tabs[nextIndex].focus();
    goTo(nextIndex);
  });

  deck.addEventListener("scroll", onDeckScroll, { passive: true });
  deck.addEventListener("pointerdown", releaseProgrammaticScroll, { passive: true });
  deck.addEventListener("touchstart", releaseProgrammaticScroll, { passive: true });
  deck.addEventListener("wheel", releaseProgrammaticScroll, { passive: true });

  window.addEventListener("resize", () => {
    if (resizeFrame !== null) {
      window.cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      deck.scrollTo({ left: leftForSlide(slides[activeIndex]), behavior: "auto" });
    });
  });

  const queryPreference = normalizeOption(new URL(window.location.href).searchParams.get("pick"));
  const initialPreference = queryPreference || readSavedPreference();

  if (initialPreference) {
    setPreference(initialPreference, { announce: false, syncUrl: !queryPreference });
    activeIndex = optionIndexes.get(initialPreference);
  }

  updateActive(activeIndex);
  window.requestAnimationFrame(() => {
    deck.scrollTo({ left: leftForSlide(slides[activeIndex]), behavior: "auto" });
  });
})();
