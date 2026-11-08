/* =========================================================
   TRANSITION · LIGHTS OUT (curiosity → nine lives)
   ---------------------------------------------------------
   1. The sparkle drifts into the little winged cat: caught!
   2. The cat curls its wings around it and the lights go
      out: darkness spreads from the cat in a circle, edged by
      faint pink rings, while a few glowing butterflies escape.
   3. Nine lives then zooms out of the dark.
   ========================================================= */

function lightsOut() {
  const fromPanel = document.querySelector("#curiosity");
  const toPanel = document.querySelector("#nine-lives");
  const cat = fromPanel.querySelector(".familiar");
  const wings = fromPanel.querySelectorAll(".familiar__wing");
  const dot = fromPanel.querySelector(".chase__dot");
  const words = fromPanel.querySelector(".chase");
  const layer = document.querySelector(".fx--spell");
  const dark = layer.querySelector(".spell-light");
  const rings = layer.querySelectorAll(".spell-rings circle");

  // where the cat is on screen (from its CSS, so animations don't throw it off)
  const catCenter = () => {
    const style = getComputedStyle(cat);
    const width = parseFloat(style.width);
    return {
      x: window.innerWidth - parseFloat(style.right) - width / 2,
      y: window.innerHeight - parseFloat(style.bottom) - width / 2,
    };
  };

  // a few glowing butterflies that escape as the lights go out
  const butterflies = Array.from({ length: 9 }, (_, i) => {
    const b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    b.setAttribute("class", "spell-bit");
    b.setAttribute("viewBox", "0 0 40 30");
    b.innerHTML = '<use href="#butterfly"/>';
    b.style.color = ["#FFCAE4", "#C6A4F2", "#F10291"][i % 3];
    layer.append(b);
    return b;
  });

  const tl = gsap.timeline();

  // 1. the sparkle drifts into the cat
  tl.to(dot, {
      x: () => catCenter().x - 14,
      y: () => catCenter().y - 14,
      rotation: "+=270",
      duration: 1,
      ease: "power2.inOut",
    })
    .to(words, { opacity: 0.25, duration: 0.8 }, "<")
    .to(dot, { scale: 0, duration: 0.3 })
    // 2. wings fold around it, the cat glows softly…
    .to(wings, { scaleX: 0.2, svgOrigin: "100 125", duration: 0.4, ease: "power2.inOut" }, "<")
    .to(cat, { scale: 1.08, transformOrigin: "50% 60%", duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, "<")
    // …and the lights go out, spreading from the cat
    .set(layer, { autoAlpha: 1 })
    .fromTo(dark,
      { clipPath: () => `circle(0px at ${catCenter().x}px ${catCenter().y}px)` },
      { clipPath: () => `circle(${Math.hypot(window.innerWidth, window.innerHeight)}px at ${catCenter().x}px ${catCenter().y}px)`, duration: 1.6, ease: "power2.in" })
    .fromTo(rings,
      { attr: { r: 0, cx: () => (catCenter().x / window.innerWidth) * 100, cy: () => (catCenter().y / window.innerHeight) * 100 }, opacity: 0.8 },
      { attr: { r: 110 }, opacity: 0, duration: 1.6, stagger: 0.25, ease: "power2.in" }, "<")
    .fromTo(butterflies,
      { x: () => catCenter().x, y: () => catCenter().y, scale: 0, rotation: 0, opacity: 1 },
      {
        x: () => catCenter().x + gsap.utils.random(-0.6, 0.15) * window.innerWidth,
        y: () => catCenter().y - gsap.utils.random(0.3, 0.8) * window.innerHeight,
        scale: () => gsap.utils.random(0.8, 1.6),
        rotation: () => gsap.utils.random(-40, 40),
        duration: 2,
        stagger: 0.08,
        ease: "sine.out",
      }, "<0.2")
    // swap sections in the dark (nine lives has a black background too)
    .set(fromPanel, { autoAlpha: 0 })
    .set(toPanel, { autoAlpha: 1 })
    .to(butterflies, { opacity: 0, duration: 0.6, stagger: 0.04 })
    .set(layer, { autoAlpha: 0 });

  return tl;
}
