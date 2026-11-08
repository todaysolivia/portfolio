/* =========================================================
   1 · HELLO
   ---------------------------------------------------------
   While you scroll the first screen: the paw-print cue fades,
   the cat stretches out,
   "Li" slides away a little and the sparkle spins.
   Always: the tail sways and the cat breathes.
   (Selectors also hit the 4 torn copies made by claw-tear.js,
   so the copies always match the real section.)
   ========================================================= */

function helloSection() {
  const tl = gsap.timeline();

  tl.to(".hello__trail", { opacity: 0, duration: 0.3 }, 0)   // the paw-print cue fades once you scroll
    .to(".hello__cat", { scaleX: 1.12, transformOrigin: "100% 100%", duration: 1.2, ease: "sine.inOut" }, 0)
    .to(".hello__word--last", { x: () => window.innerWidth * 0.025, duration: 1.2, ease: "sine.inOut" }, 0)
    .to(".hello__sparkle", { rotation: 90, scale: 1.2, duration: 1.2, ease: "none" }, 0);

  return tl;
}

function helloAmbience() {
  gsap.to(".hello__tail", { rotation: 16, svgOrigin: "60 160", duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".hello__cat", { scaleY: 1.025, transformOrigin: "100% 100%", duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
}
