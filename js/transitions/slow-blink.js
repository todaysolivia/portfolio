/* =========================================================
   TRANSITION · SLOW BLINK (about → curiosity)
   ---------------------------------------------------------
   Two eyelids slowly close over the screen. While they're
   shut, a caption explains the slow blink. Then they open
   on the next section.
   ========================================================= */

function slowBlink() {
  const fromPanel = document.querySelector("#about");
  const toPanel = document.querySelector("#curiosity");
  const layer = document.querySelector(".fx--blink");
  const topLid = layer.querySelector(".lid--top");
  const bottomLid = layer.querySelector(".lid--bottom");
  const caption = layer.querySelector(".blink-caption");

  const SLOW = { duration: 1.3, ease: "sine.inOut" };
  const tl = gsap.timeline();

  tl.set(layer, { autoAlpha: 1 })
    .fromTo(topLid, { yPercent: -101 }, { yPercent: 0, ...SLOW })
    .fromTo(bottomLid, { yPercent: 101 }, { yPercent: 0, ...SLOW }, "<")
    .to(fromPanel, { scale: 0.94, opacity: 0.5, ...SLOW }, "<")
    .fromTo(caption, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
    .set(fromPanel, { autoAlpha: 0 })
    .set(toPanel, { autoAlpha: 1 })
    .to(caption, { opacity: 0, scale: 1.1, duration: 0.4 }, "+=0.6")
    .to(topLid, { yPercent: -101, ...SLOW })
    .to(bottomLid, { yPercent: 101, ...SLOW }, "<")
    .set(layer, { autoAlpha: 0 });

  return tl;
}
