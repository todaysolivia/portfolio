/* =========================================================
   01 · SETUP
   ---------------------------------------------------------
   Runs first. Decides whether to play the animated version,
   starts smooth scrolling, and defines small helpers that
   the other files use.
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const librariesLoaded = Boolean(window.gsap && window.ScrollTrigger && window.Lenis);

// SITE holds things shared between files
const SITE = {
  animated: librariesLoaded && !reduceMotion,   // play the animated version?
  lenis: null,                                  // smooth-scroll engine
  story: null,                                  // the main timeline (js/03-storyboard.js)
};

if (!SITE.animated) {
  // No animations → a normal, still page
  document.documentElement.classList.remove("has-stage");
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scrolling. "lerp" = how quickly it catches up (lower = floatier)
  SITE.lenis = new Lenis({ lerp: 0.1 });
  SITE.lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => SITE.lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}


/* ---------------------------------------------------------
   HELPERS
   --------------------------------------------------------- */

// Wrap every word in <span class="word"> so words can animate one by one
function splitWords(element) {
  const words = element.textContent.trim().split(/\s+/);
  element.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(" ");
  return element.querySelectorAll(".word");
}

// Where is `element` inside `container`, in pixels? (ignores animation transforms)
function positionIn(element, container) {
  let x = 0;
  let y = 0;
  let current = element;
  while (current && current !== container) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

document.querySelectorAll(".split-words").forEach(splitWords);
