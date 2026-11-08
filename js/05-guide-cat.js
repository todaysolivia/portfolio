/* =========================================================
   05 · THE GUIDE CAT & PROGRESS LINE
   ---------------------------------------------------------
   • A small cat walks along the line at the bottom of the
     screen, showing how far through the site you are.
   • The line has one stop per section ("hello", "about"…).
     The current one glows; tap any stop to jump there.
   • DRAG the cat left/right to move through the site.
     Tap it (without dragging) and it meows.
   • On the very first screen it gives a little hop towards
     the next stop, a quiet hint that there's more to see.
   (Looks: css/05-cat-bits.css)
   ========================================================= */

const guideCat = document.querySelector(".guide-cat");
const guideBubble = guideCat.querySelector(".guide-cat__bubble");
const guideButton = guideCat.querySelector(".guide-cat__button");
const track = document.querySelector(".cat-track");
const stopsList = document.querySelector(".cat-track__stops");
const sections = [...document.querySelectorAll(".panel")];

let stops = [];
let lastScrollY = window.scrollY;
let stopWalkingTimer;
let stopTalkingTimer;
let drag = null;
let justDragged = false;


/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */
const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
const clamp01 = (n) => Math.min(1, Math.max(0, n));

// the scroll position of a section (the storyboard knows it in animated mode)
function scrollYFor(section) {
  return SITE.scrollYFor ? SITE.scrollYFor(section.id) : section.offsetTop;
}

function goTo(y, immediate = false) {
  if (SITE.lenis) SITE.lenis.scrollTo(y, { immediate, duration: 1.8 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

function say(text, keepOpen = false) {
  guideBubble.textContent = text;
  guideCat.classList.add("is-talking");
  clearTimeout(stopTalkingTimer);
  if (!keepOpen) stopTalkingTimer = setTimeout(() => guideCat.classList.remove("is-talking"), 1800);
}


/* ---------------------------------------------------------
   1. The stops on the line (one per section)
   --------------------------------------------------------- */
function buildStops() {
  stops = sections.map((section) => {
    const item = document.createElement("li");
    item.className = "cat-stop";
    item.innerHTML = `<button type="button" aria-label="Go to ${section.dataset.name}"></button>
                      <span class="cat-stop__name" aria-hidden="true">${section.dataset.name}</span>`;
    item.querySelector("button").addEventListener("click", () => goTo(scrollYFor(section)));
    stopsList.append(item);
    return { section, item, at: 0 };
  });
  placeStops();
}

// work out where each stop sits along the line (0 = start, 1 = end)
function placeStops() {
  const max = maxScroll();
  stops.forEach((stop) => {
    stop.at = max > 0 ? clamp01(scrollYFor(stop.section) / max) : 0;
    stop.item.style.setProperty("--at", stop.at);
  });
  update();
}

// which section are we in right now?
function currentStopIndex(progress) {
  let index = 0;
  stops.forEach((stop, i) => { if (progress >= stop.at - 0.01) index = i; });
  return index;
}


/* ---------------------------------------------------------
   2. Every scroll: move the cat, light up the current stop
   --------------------------------------------------------- */
function update() {
  const max = maxScroll();
  const progress = max > 0 ? clamp01(window.scrollY / max) : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--track-w", `${track.offsetWidth}px`);   // how far the cat can walk

  if (window.scrollY !== lastScrollY) {
    guideCat.classList.toggle("is-facing-left", window.scrollY < lastScrollY);
  }
  lastScrollY = window.scrollY;
  guideCat.classList.toggle("is-on-right", progress > 0.6);

  const current = currentStopIndex(progress);
  stops.forEach((stop, i) => {
    stop.item.classList.toggle("is-current", i === current);
    stop.item.classList.toggle("is-next", i === current + 1 && progress < 0.003);
  });

  // on the normal (still) page, the storyboard isn't there to set the menu colour
  if (!SITE.animated && stops[current]) {
    document.documentElement.classList.toggle("on-light", LIGHT_SECTIONS.includes(stops[current].section.id));
  }

  // first screen: hop towards the next stop as a hint
  guideCat.classList.toggle("is-beckoning", progress < 0.003 && !drag);

  if (drag && drag.moved) say(`you're at: ${stops[current].section.dataset.name}`, true);
}

function onScroll() {
  update();
  guideCat.classList.add("is-walking");
  clearTimeout(stopWalkingTimer);
  stopWalkingTimer = setTimeout(() => guideCat.classList.remove("is-walking"), 160);
}


/* ---------------------------------------------------------
   3. Dragging the cat
   --------------------------------------------------------- */
guideButton.addEventListener("pointerdown", (event) => {
  drag = { startX: event.clientX, moved: false };
  guideButton.setPointerCapture(event.pointerId);
});

guideButton.addEventListener("pointermove", (event) => {
  if (!drag) return;
  if (!drag.moved && Math.abs(event.clientX - drag.startX) < 5) return;   // tiny wobble = still a tap
  drag.moved = true;
  document.documentElement.classList.add("is-scrubbing");
  guideCat.classList.add("is-dragging");

  // where along the line is the pointer? (0 = start, 1 = end)
  const line = track.getBoundingClientRect();
  const progress = clamp01((event.clientX - line.left) / line.width);
  goTo(progress * maxScroll(), true);
});

function endDrag() {
  if (!drag) return;
  justDragged = drag.moved;
  drag = null;
  document.documentElement.classList.remove("is-scrubbing");
  guideCat.classList.remove("is-dragging");
  if (justDragged) stopTalkingTimer = setTimeout(() => guideCat.classList.remove("is-talking"), 1200);
  update();
}
guideButton.addEventListener("pointerup", endDrag);
guideButton.addEventListener("pointercancel", endDrag);


/* ---------------------------------------------------------
   4. Tapping the cat (or Enter / Space on the keyboard)
   --------------------------------------------------------- */
const meows = ["meow!", "mrrp?", "purrrr…", "drag me ✦", "*tail swish*"];

guideButton.addEventListener("click", () => {
  if (justDragged) { justDragged = false; return; }   // that was a drag, not a tap
  say(meows[Math.floor(Math.random() * meows.length)]);
  guideCat.classList.remove("is-hopping");
  void guideCat.offsetWidth;          // lets the hop animation replay
  guideCat.classList.add("is-hopping");
});

// arrow keys on the cat jump between sections
guideButton.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  const max = maxScroll();
  const index = currentStopIndex(max > 0 ? window.scrollY / max : 0);
  const next = stops[Math.min(stops.length - 1, Math.max(0, index + (event.key === "ArrowRight" ? 1 : -1)))];
  goTo(scrollYFor(next.section));
});


/* ---------------------------------------------------------
   Start
   --------------------------------------------------------- */
buildStops();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", placeStops);
if (SITE.animated) ScrollTrigger.addEventListener("refresh", placeStops);
