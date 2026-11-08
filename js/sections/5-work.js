/* =========================================================
   5 · WORK
   ---------------------------------------------------------
   The giant word "work" slides up, then scrolling slides the
   row of posters sideways while a paw bats each one in.
   ========================================================= */

function workSection() {
  const panel = document.querySelector("#work");
  const title = panel.querySelector(".work__title");
  const note = panel.querySelector(".work__note");
  const track = panel.querySelector(".work__track");
  const projects = panel.querySelectorAll(".project");
  const paw = panel.querySelector(".work__paw");

  const slideDistance = () => Math.max(0, track.scrollWidth - panel.clientWidth);
  const SLIDE = 5;

  const tl = gsap.timeline();

  tl.from(title, { yPercent: -60, opacity: 0, duration: 0.8, ease: "back.out(1.6)" })
    .from(note, { y: 20, opacity: 0, duration: 0.5 }, "<0.3")
    .from(paw, { yPercent: 100, duration: 0.6, ease: "back.out(2)" }, "<")
    .to(track, { x: () => -slideDistance(), duration: SLIDE, ease: "none" })
    // each poster starts knocked over and bounces upright as it arrives
    .from(projects, {
      rotation: (i) => (i % 2 ? 16 : -16),
      y: 120,
      opacity: 0,
      duration: 0.9,
      stagger: SLIDE / projects.length,
      ease: "back.out(2.2)",
    }, "<")
    .to(paw, { rotation: 26, transformOrigin: "50% 100%", duration: SLIDE / 12, yoyo: true, repeat: 11, ease: "sine.inOut" }, "<");

  return tl;
}
