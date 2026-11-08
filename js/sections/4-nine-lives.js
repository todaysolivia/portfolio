/* =========================================================
   4 · NINE LIVES (study + skills + process)
   ---------------------------------------------------------
   Part 1: we zoom out of the darkness (the lights just went
           out). Nine cat heads pop in, a line draws across,
           and each stage of study lights up one "life".
   Part 2: the toy box. Four cat toys drop in (yarn, mouse,
           feather wand, fish). A paw comes down and bats
           each toy in turn, and that toy's skills tumble out.
   Part 3: the process on its own screen: a strand of yarn
           draws across, each knot is tied, and a cat plays
           with the end of the strand.
   ========================================================= */

function nineLivesSection() {
  const panel = document.querySelector("#nine-lives");
  const study = panel.querySelector(".lives__beat--study");
  const lives = panel.querySelectorAll(".life");
  const line = panel.querySelector(".timeline__line");
  const items = panel.querySelectorAll(".timeline__item");

  const skillsBeat = panel.querySelector(".lives__beat--skills");
  const toys = panel.querySelectorAll(".toy");
  const paw = panel.querySelector(".toybox__paw");

  const processBeat = panel.querySelector(".lives__beat--process");
  const thread = panel.querySelector(".process__thread");
  const knots = panel.querySelectorAll(".process__knot");
  const steps = panel.querySelectorAll(".process__steps strong, .process__steps li > span:last-child");
  const processCat = panel.querySelector(".process__cat");
  const learning = panel.querySelector(".process__learning");

  const tl = gsap.timeline();

  /* ---- Part 1: nine lives ---- */
  tl.fromTo(study,
      { scale: 1.6, opacity: 0, filter: "blur(14px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" })
    .from(lives, { scale: 0, rotation: -40, stagger: 0.06, duration: 0.4, ease: "back.out(3)" }, "-=0.5")
    .addLabel("lineStart")
    .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 3, ease: "none" });

  items.forEach((item, i) => {
    const t = i * 0.75;
    tl.from(item, { y: 40, opacity: 0, duration: 0.5, ease: "back.out(2)" }, `lineStart+=${t}`)
      .to(lives[i], { color: "#F10291", scale: 1.35, duration: 0.25, ease: "back.out(3)" }, `lineStart+=${t}`)
      .to(lives[i], { scale: 1, duration: 0.25 }, `lineStart+=${t + 0.25}`);
  });

  /* ---- Part 2: the toy box ---- */
  tl.to(study, { yPercent: -20, opacity: 0, duration: 0.8, ease: "power2.in" }, "+=0.4")
    .fromTo(skillsBeat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
    .from(skillsBeat.querySelectorAll(".toybox__head > *"), { y: 30, opacity: 0, stagger: 0.1, duration: 0.5 })
    // the toys drop in and bounce
    .from(panel.querySelectorAll(".toy__art"), { y: -120, opacity: 0, stagger: 0.12, duration: 0.7, ease: "bounce.out" }, "<0.2")
    .from(panel.querySelectorAll(".toy h3"), { opacity: 0, y: 16, stagger: 0.12, duration: 0.4 }, "<0.3")
    // the paw arrives from above
    .fromTo(paw, { x: () => pawSpotAbove(toys[0]).x, y: () => -pawHeight() }, { x: () => pawSpotAbove(toys[0]).x, y: () => pawSpotAbove(toys[0]).y - 40, duration: 0.5, ease: "power2.out" });

  // bat each toy in turn; its skills tumble out
  toys.forEach((toy, i) => {
    const art = toy.querySelector(".toy__art");
    const skills = toy.querySelectorAll("li");
    if (i > 0) {
      tl.to(paw, { x: () => pawSpotAbove(toy).x, y: () => pawSpotAbove(toy).y - 40, duration: 0.45, ease: "power2.inOut" });
    }
    tl.to(paw, { y: () => pawSpotAbove(toy).y, duration: 0.14, ease: "power2.in", yoyo: true, repeat: 1 })   // tap!
      .to(art, { scaleY: 0.8, scaleX: 1.12, transformOrigin: "50% 100%", duration: 0.12, yoyo: true, repeat: 1 }, "<0.1")
      .to(art, { rotation: i % 2 ? 14 : -14, duration: 0.15, yoyo: true, repeat: 1, ease: "sine.inOut" }, ">")
      .from(skills, {
        y: -30,
        opacity: 0,
        rotation: () => gsap.utils.random(-25, 25),
        stagger: 0.07,
        duration: 0.45,
        ease: "back.out(2.5)",
      }, "<");
  });

  tl.to(paw, { y: () => -pawHeight(), duration: 0.5, ease: "power2.in" }, "+=0.2")   // paw leaves
    .to({}, { duration: 1 });   // time to read

  /* ---- Part 3: the process ---- */
  tl.to(skillsBeat, { yPercent: -15, opacity: 0, duration: 0.7, ease: "power2.in" })
    .fromTo(processBeat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
    .from(processBeat.querySelector(".lives__title"), { y: 40, opacity: 0, duration: 0.5 })
    .from(processCat, { x: 80, opacity: 0, duration: 0.6, ease: "back.out(1.6)" }, "<0.2")
    .fromTo(thread, { clipPath: "inset(-50% 100% -50% 0%)" }, { clipPath: "inset(-50% 0% -50% 0%)", duration: 1.6, ease: "none" })
    .from(knots, { scale: 0, duration: 0.35, stagger: 0.3, ease: "back.out(3)" }, "<0.15")
    .from(steps, { opacity: 0, y: 12, duration: 0.35, stagger: 0.15 }, "<")
    .to(".process__cat-paw", { rotation: -25, svgOrigin: "40 66", duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" })   // the cat bats the yarn
    .from(learning, { opacity: 0, y: 20, duration: 0.5 }, "<")
    .to({}, { duration: 1.2 });   // time to read before the yarn ball rolls in

  /* ---- helpers: where the paw should go to tap a toy ---- */
  function pawWidth() { return parseFloat(getComputedStyle(paw).width); }
  function pawHeight() { return pawWidth() * 1.65; }   // the paw drawing is 200 × 330
  function pawSpotAbove(toy) {
    const box = positionIn(toy, panel);
    const artHeight = toy.querySelector(".toy__art").getBoundingClientRect().height;
    return {
      x: box.x + box.width / 2 - pawWidth() / 2,
      y: box.y + artHeight * 0.35 - pawHeight(),   // claws land on the top of the toy
    };
  }

  return tl;
}

function nineLivesAmbience() {
  gsap.to(".process__cat-tail", { rotation: 14, svgOrigin: "76 92", duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
}
