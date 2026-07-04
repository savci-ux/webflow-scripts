// ------- CONFIG -------------------------------------------------------
const SCROLL_OFFSET = 0; // px
const SECTIONS = [
  "#treatments",
  "#pricing",
  "#your-stories",
  "#why-novexdent",
  "#good-to-know"
];

const KEY_MAP = {
  // letter shortcuts
  "t": "#treatments",
  "p": "#pricing",
  "y": "#your-stories",
  "w": "#why-novexdent",
  "g": "#good-to-know",
};

// ------- HELPERS ------------------------------------------------------
function isTypingInInput(e) {
  const tag = e.target.tagName.toLowerCase();
  const editable =
    e.target.isContentEditable ||
    tag === "input" ||
    tag === "textarea" ||
    tag === "select";
  return editable;
}

function smoothScrollTo(el) {
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
}

function getCurrentSectionIndex() {
  const scrollY = window.scrollY + SCROLL_OFFSET + 2;

  let active = 0;
  SECTIONS.forEach((sec, i) => {
    const el = document.querySelector(sec);
    if (!el) return;
    const top = el.offsetTop;
    if (scrollY >= top) active = i;
  });

  return active;
}

// ------- INIT ---------------------------------------------------------
(function initShortcutNavigation() {

  if (window.__shortcutNavInitialized) return;
  window.__shortcutNavInitialized = true;

  document.addEventListener("keydown", function (e) {
    if (isTypingInInput(e)) return;

    const key = e.key.toLowerCase();

    // --- LETTER SHORTCUTS ---
    if (KEY_MAP[key]) {
      const el = document.querySelector(KEY_MAP[key]);
      smoothScrollTo(el);
      return;
    }

    // --- ARROW NAVIGATION ---
    const currentIndex = getCurrentSectionIndex();

    if (key === "arrowdown") {
      const next = SECTIONS[currentIndex + 1];
      if (next) smoothScrollTo(document.querySelector(next));
    }

    if (key === "arrowup") {
      const prev = SECTIONS[currentIndex - 1];
      if (prev) smoothScrollTo(document.querySelector(prev));
    }
  });

})();
