document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------
     CONFIG
  ------------------------------------------------------- */
  const VISIBILITY_THRESHOLD = 0.25; // %25 görünürlük
  const VISIBILITY_DELAY = 1000;     // 1 saniye gecikme (ms)

  /* -------------------------------------------------------
     UTILITIES
  ------------------------------------------------------- */
  const qs = (sel, parent = document) => parent.querySelector(sel);
  const qsa = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  /* Webflow slider engine (fail-safe) */
  const sliderEngine = (() => {
    try {
      return Webflow.require("slider");
    } catch {
      console.warn("[AutoSlider] Webflow slider engine bulunamadı.");
      return null;
    }
  })();

  if (!sliderEngine) return;

  /* Tüm slider’ları bul */
  const sliders = qsa(".w-slider");
  if (!sliders.length) return;

  /* State */
  const sliderState = new WeakMap();

  sliders.forEach((slider) => {
    const originalDelay = slider.getAttribute("data-delay") || "4000";

    sliderState.set(slider, {
      originalDelay,
      isActive: false,
      isHovered: false,
      visibilityTimer: null
    });
  });

  /* -------------------------------------------------------
     AUTOPLAY CONTROLS
  ------------------------------------------------------- */

  const enableAutoplay = (slider) => {
    const state = sliderState.get(slider);
    if (!state || state.isActive || state.isHovered) return;

    slider.setAttribute("data-delay", state.originalDelay);
    sliderEngine.redraw();
    state.isActive = true;
  };

  const disableAutoplay = (slider) => {
    const state = sliderState.get(slider);
    if (!state || !state.isActive) return;

    slider.setAttribute("data-delay", "0");
    sliderEngine.redraw();
    state.isActive = false;
  };

  /* -------------------------------------------------------
     HOVER PAUSE
  ------------------------------------------------------- */
  sliders.forEach((slider) => {
    slider.addEventListener("mouseenter", () => {
      const state = sliderState.get(slider);
      state.isHovered = true;
      disableAutoplay(slider);
    });

    slider.addEventListener("mouseleave", () => {
      const state = sliderState.get(slider);
      state.isHovered = false;
      enableAutoplay(slider);
    });
  });

  /* -------------------------------------------------------
     INTERSECTION OBSERVER — delayed autoplay
  ------------------------------------------------------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const slider = entry.target;
        const state = sliderState.get(slider);

        if (entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
          clearTimeout(state.visibilityTimer);

          state.visibilityTimer = setTimeout(() => {
            enableAutoplay(slider);
          }, VISIBILITY_DELAY);

        } else {
          clearTimeout(state.visibilityTimer);
          disableAutoplay(slider);
        }
      });
    },
    { threshold: VISIBILITY_THRESHOLD }
  );

  sliders.forEach((slider) => observer.observe(slider));

  /* -------------------------------------------------------
     GSAP SCROLL SYNC: Scroll position → slider index
  ------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    sliders.forEach((slider) => {
      const mask = qs(".w-slider-mask", slider);
      const items = qsa(".w-slide", slider);
      if (!mask || !items.length) return;

      const totalSlides = items.length;

      gsap.to({}, {
        scrollTrigger: {
          trigger: slider,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const slideIndex = Math.floor(progress * totalSlides);

            sliderEngine.goto(slider, slideIndex);
          }
        }
      });
    });

    console.info("[AutoSlider] GSAP Scroll Sync aktif.");
  } else {
    console.warn("[AutoSlider] GSAP + ScrollTrigger yüklenmemiş.");
  }

  console.info("[AutoSlider] Advanced slider controller initialized.");
});
