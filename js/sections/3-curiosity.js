/* =========================================================
   3 · CURIOSITY (how it started)
   ---------------------------------------------------------
   A glowing sparkle zips across each sentence, and the
   sentence appears behind it, as if the light is writing.
   The cat's winged "familiar" floats nearby and watches it.
   ========================================================= */

function curiositySection() {
  const panel = document.querySelector("#curiosity");
  const lines = panel.querySelectorAll(".chase__line");
  const dot = panel.querySelector(".chase__dot");
  const cat = panel.querySelector(".familiar");
  const DOT = 28;   // sparkle size in px

  const tl = gsap.timeline();

  tl.from(cat, { yPercent: 70, opacity: 0, duration: 0.9, ease: "power2.out" })   // floats up into view (yPercent, so it doesn't clash with the bobbing "y")
    .fromTo(dot,
      { scale: 0, x: () => panel.clientWidth * 0.75, y: () => panel.clientHeight * 0.75 },
      { scale: 1, duration: 0.3 }, "<0.3");

  lines.forEach((line) => {
    const where = () => positionIn(line, panel);

    tl.to(dot, {                                  // hop to the start of the line
        x: () => where().x - DOT - 8,
        y: () => where().y + Math.min(where().height, 70) / 2 - DOT / 2,
        rotation: "+=180",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .fromTo(line,                                // the line appears…
        { clipPath: "inset(-20% 100% -20% 0%)" },
        { clipPath: "inset(-20% 0% -20% 0%)", duration: 1, ease: "none" })
      .to(dot, {                                   // …as the sparkle sweeps across it
        x: () => where().x + where().width,
        y: () => where().y + where().height - DOT,
        rotation: "+=180",
        duration: 1,
        ease: "none",
      }, "<");
  });

  return tl;
}

// Always: the familiar bobs and flaps its wings, specks of light drift upwards
function curiosityAmbience() {
  gsap.to(".familiar", { y: -14, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".familiar__wing--left", { scaleX: 0.6, svgOrigin: "100 125", duration: 0.28, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".familiar__wing--right", { scaleX: 0.6, svgOrigin: "100 125", duration: 0.28, ease: "sine.inOut", yoyo: true, repeat: -1 });

  const motes = document.querySelector(".motes");
  for (let i = 0; i < 18; i++) {
    const mote = document.createElement("span");
    mote.className = "mote";
    mote.style.left = `${gsap.utils.random(2, 98)}%`;
    mote.style.animationDuration = `${gsap.utils.random(7, 14)}s`;
    mote.style.animationDelay = `${-gsap.utils.random(0, 14)}s`;
    mote.style.setProperty("--sway", `${gsap.utils.random(-60, 60)}px`);
    mote.style.scale = gsap.utils.random(0.5, 1.4).toFixed(2);
    motes.append(mote);
  }
}
