/* =========================================================
   TRANSITION · WALK-BY (work → say hi)
   ---------------------------------------------------------
   A big cat strolls across from right to left. Everything it
   has walked past already shows the next section.

   The new section is cut with clip-path: inset(top right bottom LEFT).
   Shrinking LEFT from 100% to 0% uncovers it from the right.
   ========================================================= */

function walkBy() {
  const fromPanel = document.querySelector("#work");
  const toPanel = document.querySelector("#say-hi");
  const layer = document.querySelector(".fx--walk");
  const walker = layer.querySelector(".walker");
  const legsA = walker.querySelectorAll(".walker__leg--a");
  const legsB = walker.querySelectorAll(".walker__leg--b");
  const tail = walker.querySelector(".walker__tail");

  const WALK = 3;
  const STEPS = 10;
  const tl = gsap.timeline();

  tl.set(layer, { autoAlpha: 1 })
    .set(walker, { scaleX: -1 })                                         // face left
    .set(toPanel, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 100%)" })   // new section, hidden
    .addLabel("walk")
    .fromTo(walker,
      { x: () => window.innerWidth },
      { x: () => -walker.getBoundingClientRect().width, duration: WALK, ease: "none" }, "walk")
    .to(toPanel, { clipPath: "inset(0% 0% 0% 0%)", duration: WALK * 0.62, ease: "none" }, `walk+=${WALK * 0.19}`)
    .fromTo(legsA, { rotation: -24 }, { rotation: 24, transformOrigin: "50% 0%", duration: WALK / STEPS, repeat: STEPS - 1, yoyo: true, ease: "sine.inOut" }, "walk")
    .fromTo(legsB, { rotation: 24 }, { rotation: -24, transformOrigin: "50% 0%", duration: WALK / STEPS, repeat: STEPS - 1, yoyo: true, ease: "sine.inOut" }, "walk")
    .fromTo(walker, { y: 0 }, { y: -10, duration: WALK / STEPS / 2, repeat: STEPS * 2 - 1, yoyo: true, ease: "sine.inOut" }, "walk")
    .fromTo(tail, { rotation: -10 }, { rotation: 14, transformOrigin: "100% 100%", duration: WALK / 4, repeat: 3, yoyo: true, ease: "sine.inOut" }, "walk")
    .set(fromPanel, { autoAlpha: 0 })
    .set(layer, { autoAlpha: 0 });

  return tl;
}
