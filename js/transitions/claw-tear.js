/* =========================================================
   TRANSITION · CLAW TEAR (hello → about)
   ---------------------------------------------------------
   1. A paw swings in from the top and winds up.
   2. SWIPE: three jagged claw gashes rip down the screen,
      with a white flash, a shake and flying sparkles.
   3. The hello screen is really torn: it's split into four
      diagonal strips that pull apart and fall away, showing
      the About section underneath.

   How the tearing works: prepareClawTear() makes 4 copies of
   the hello section. Each copy is cut to one strip with
   clip-path, so each strip can move on its own.
   ========================================================= */

// Where the three claws cut, as % of the screen width (top edge → bottom edge)
const CLAW_CUTS = [
  { top: 57, bottom: 17 },
  { top: 70, bottom: 30 },
  { top: 83, bottom: 43 },
];

// Make the 4 torn strips. Called before the hello animation is built,
// so the hello animations (cat stretching etc.) also move the copies.
function prepareClawTear() {
  const hello = document.querySelector("#hello");
  const tear = document.querySelector(".fx--claw .tear");
  const edges = [{ top: -80, bottom: -80 }, ...CLAW_CUTS, { top: 180, bottom: 180 }];

  for (let i = 0; i < edges.length - 1; i++) {
    const left = edges[i];
    const right = edges[i + 1];
    const strip = hello.cloneNode(true);
    strip.removeAttribute("id");
    strip.classList.remove("panel");
    strip.classList.add("tear-strip");
    // (+0.4% overlap on the right edge so no hairline seams show between strips)
    strip.style.clipPath = `polygon(${left.top}% -5%, ${right.top + 0.4}% -5%, ${right.bottom + 0.4}% 105%, ${left.bottom}% 105%)`;
    tear.append(strip);
  }
}

// Draw one jagged claw gash along a cut, `progress` 0 → 1 = how far it has ripped
function clawPath(cut, progress) {
  const steps = 26;
  const leftSide = [];
  const rightSide = [];
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * progress;
    const x = cut.top + (cut.bottom - cut.top) * t;
    const y = -5 + 110 * t;
    const jag = s % 2 ? 1 : 0.6;                       // zig-zag edge
    const width = 1.7 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * jag + 0.15;
    leftSide.push(`${(x - width).toFixed(2)},${y.toFixed(2)}`);
    rightSide.unshift(`${(x + width).toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${leftSide.concat(rightSide).join("L")}Z`;
}

function clawTear() {
  const fromPanel = document.querySelector("#hello");
  const toPanel = document.querySelector("#about");
  const layer = document.querySelector(".fx--claw");
  const tear = layer.querySelector(".tear");
  const strips = layer.querySelectorAll(".tear-strip");
  const marksSvg = layer.querySelector(".claw-marks");
  const paw = layer.querySelector(".claw-paw");
  const flash = layer.querySelector(".claw-flash");

  // three gashes (SVG paths), redrawn whenever their progress changes
  const gashes = CLAW_CUTS.map((cut) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    marksSvg.append(path);
    return { path, cut, progress: 0 };
  });
  const drawGashes = () => gashes.forEach((g) => g.path.setAttribute("d", clawPath(g.cut, g.progress)));
  drawGashes();

  // little sparkles that fly out of the rips
  const debris = Array.from({ length: 16 }, (_, i) => {
    const bit = document.createElement("div");
    bit.className = "debris";
    bit.innerHTML = '<svg viewBox="0 0 100 100"><use href="#sparkle"/></svg>';
    layer.append(bit);
    const cut = CLAW_CUTS[i % 3];
    const t = gsap.utils.random(0.1, 0.9);
    return { bit, cut, t };
  });
  const debrisX = (i) => ((debris[i].cut.top + (debris[i].cut.bottom - debris[i].cut.top) * debris[i].t) / 100) * window.innerWidth;
  const debrisY = (i) => ((-5 + 110 * debris[i].t) / 100) * window.innerHeight;

  const tl = gsap.timeline();

  tl.set(layer, { autoAlpha: 1 })
    .set(fromPanel, { autoAlpha: 0 })          // the 4 identical strips take the real section's place
    // 1. paw swings in and winds up
    .fromTo(paw,
      { x: () => window.innerWidth * 0.3, y: () => -window.innerHeight * 0.8, rotation: 75 },
      { x: 0, y: () => -window.innerHeight * 0.12, rotation: 40, duration: 0.8, ease: "back.out(1.7)" })
    .to(paw, { y: () => -window.innerHeight * 0.22, rotation: 52, scaleY: 0.9, duration: 0.35, ease: "power2.inOut" })
    // 2. SWIPE
    .to(paw, { x: () => -window.innerWidth * 0.62, y: () => window.innerHeight * 1.1, rotation: 20, scaleY: 1.2, duration: 0.45, ease: "power4.in" })
    .to(gashes, { progress: 1, duration: 0.4, stagger: 0.05, ease: "power3.in", onUpdate: drawGashes }, "<0.06")
    .fromTo(flash, { opacity: 0 }, { opacity: 0.6, duration: 0.05, yoyo: true, repeat: 1 }, ">-0.05")
    .to(tear, { x: 18, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, "<")
    .fromTo(debris.map((d) => d.bit),
      { x: (i) => debrisX(i), y: (i) => debrisY(i), scale: 0, opacity: 1, rotation: 0 },
      {
        x: (i) => debrisX(i) + gsap.utils.random(-260, 260),
        y: (i) => debrisY(i) + gsap.utils.random(-200, 260),
        scale: () => gsap.utils.random(0.6, 1.8),
        rotation: () => gsap.utils.random(-360, 360),
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
      }, "<")
    // 3. the strips pull apart (the About section shows through the gaps)…
    .set(toPanel, { autoAlpha: 1 }, "+=0.1")
    .to(strips[0], { x: -36, rotation: -1.5, duration: 0.4, ease: "power2.out" }, "<")
    .to(strips[1], { x: -12, y: 14, rotation: 2, duration: 0.4, ease: "power2.out" }, "<")
    .to(strips[2], { x: 12, y: -10, rotation: -2, duration: 0.4, ease: "power2.out" }, "<")
    .to(strips[3], { x: 36, rotation: 1.5, duration: 0.4, ease: "power2.out" }, "<")
    .to(marksSvg, { opacity: 0, duration: 0.3 }, "<")
    // …and fall away with gravity
    .to(strips[1], { y: () => window.innerHeight * 1.3, x: -80, rotation: 30, duration: 1.1, ease: "power2.in" })
    .to(strips[2], { y: () => window.innerHeight * 1.4, x: 60, rotation: -24, duration: 1.1, ease: "power2.in" }, "<0.08")
    .to(strips[0], { y: () => window.innerHeight * 1.25, x: () => -window.innerWidth * 0.25, rotation: -16, duration: 1.3, ease: "power2.in" }, "<0.06")
    .to(strips[3], { y: () => window.innerHeight * 1.25, x: () => window.innerWidth * 0.25, rotation: 14, duration: 1.3, ease: "power2.in" }, "<0.06")
    .set(layer, { autoAlpha: 0 });

  return tl;
}
