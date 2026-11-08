/* =========================================================
   03 · STORYBOARD — the running order of the whole site
   ---------------------------------------------------------
     hello → (claw tear) → about → (slow blink) → curiosity
     → (lights out) → nine lives → (giant yarn ball) → work
     → (walk-by) → say hi

   Everything goes into ONE timeline. ScrollTrigger pins the
   stage to the screen and ties that timeline to the scrollbar:
   scroll down = play forwards, scroll up = rewind.

   Sections live in js/sections/, transitions in js/transitions/.
   Try in the browser console:  SITE.story.progress(0.5)
   ========================================================= */

// 1 second of timeline = this many screen-heights of scrolling (bigger = slower)
const SCROLL_PER_SECOND = 0.3;

// sections with a light background (the menu and labels turn black there)
const LIGHT_SECTIONS = ["hello", "work", "say-hi"];

if (SITE.animated) buildStoryboard();

function buildStoryboard() {
  const stage = document.querySelector(".stage");
  const panels = gsap.utils.toArray(".panel");

  // only the first section is visible at the start
  gsap.set(panels, { autoAlpha: 0 });
  gsap.set(panels[0], { autoAlpha: 1 });

  // the claw tear needs copies of the hello section before anything animates it
  prepareClawTear();

  const menuLinks = document.querySelectorAll(".nav__links a");
  const story = gsap.timeline({
    paused: true,
    onUpdate: () => {
      const current = story.currentLabel();
      // light sections get a black menu
      document.documentElement.classList.toggle("on-light", LIGHT_SECTIONS.includes(current));
      // the menu link for the section you're in gets the wavy underline
      menuLinks.forEach((link) => link.classList.toggle("is-current", link.dataset.goto === current));
    },
  });

  story
    .addLabel("hello")
    .add(helloSection())
    .add(clawTear())

    .addLabel("about")
    .add(aboutSection())
    .add(slowBlink())

    .addLabel("curiosity")
    .add(curiositySection())
    .add(lightsOut())

    .addLabel("nine-lives")
    .add(nineLivesSection())
    .add(yarnBall())

    .addLabel("work")
    .add(workSection())
    .add(walkBy())

    .addLabel("say-hi")
    .add(sayHiSection());

  const trigger = ScrollTrigger.create({
    animation: story,
    trigger: stage,
    start: "top top",
    end: () => "+=" + story.duration() * window.innerHeight * SCROLL_PER_SECOND,
    pin: true,                  // keep the stage on screen while the story plays
    scrub: 0.9,                 // smoothing: the story glides to catch up with the scrollbar
    invalidateOnRefresh: true,  // re-measure everything when the window resizes
  });

  SITE.story = story;

  // The scroll position where a section has fully arrived
  // (used by the menu links and by the stops on the progress line)
  SITE.scrollYFor = (label) => {
    const settle = label === "hello" ? 0 : 1.8;   // just after its entrance animation
    const time = Math.min(story.labels[label] + settle, story.duration());
    return trigger.start + (time / story.duration()) * (trigger.end - trigger.start);
  };

  // Menu links jump to a section
  document.querySelectorAll("[data-goto]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      SITE.lenis.scrollTo(SITE.scrollYFor(link.dataset.goto), { duration: 2.4 });
    });
  });

  // little loops that always run
  helloAmbience();
  curiosityAmbience();
  nineLivesAmbience();
  sayHiAmbience();
}
