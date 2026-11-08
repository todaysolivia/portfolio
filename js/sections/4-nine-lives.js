/* =========================================================
   4 · NINE LIVES (study + skills)
   ---------------------------------------------------------
   Part 1: we zoom out of the darkness (the lights just went
           out). Nine cat heads pop in, a line draws across,
           and each stage of study lights up one "life".
   Part 2: a ball of yarn rolls in and the skills fly out of
           the tangle into neat lists. Then a strand of yarn
           draws across with the five steps of her process.
   ========================================================= */

function nineLivesSection() {
  const panel = document.querySelector("#nine-lives");
  const study = panel.querySelector(".lives__beat--study");
  const skillsBeat = panel.querySelector(".lives__beat--skills");
  const lives = panel.querySelectorAll(".life");
  const line = panel.querySelector(".timeline__line");
  const items = panel.querySelectorAll(".timeline__item");
  const yarn = panel.querySelector(".skills__yarn");
  const skills = panel.querySelectorAll(".skills__group li");
  const groupTitles = panel.querySelectorAll(".skills__group h3");
  const note = panel.querySelector(".skills__note");
  const processTitle = panel.querySelector(".process__title");
  const thread = panel.querySelector(".process__thread");
  const knots = panel.querySelectorAll(".process__knot");
  const steps = panel.querySelectorAll(".process__steps strong, .process__steps li > span:last-child");

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

  /* ---- Part 2: untangling the yarn ---- */
  tl.to(study, { yPercent: -20, opacity: 0, duration: 0.8, ease: "power2.in" }, "+=0.4")
    .fromTo(skillsBeat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
    .from(skillsBeat.querySelector(".lives__title"), { y: 40, opacity: 0, duration: 0.5 })
    .from(note, { opacity: 0, duration: 0.4 }, "<0.2")
    .from(yarn, { x: () => -window.innerWidth * 0.6, rotation: -720, duration: 1.2, ease: "power2.out" }, "<")
    .from(groupTitles, { opacity: 0, y: 30, stagger: 0.15, duration: 0.5 }, "-=0.3")
    // every skill starts tangled inside the yarn ball, then flies to its place
    .from(skills, {
      x: (i, el) => center(yarn).x - center(el).x,
      y: (i, el) => center(yarn).y - center(el).y,
      rotation: () => gsap.utils.random(-200, 200),
      scale: 0.3,
      opacity: 0,
      duration: 1.4,
      stagger: 0.04,
      ease: "power3.out",
    }, "<")
    // the process: a strand of yarn draws across, and each knot is tied
    .from(processTitle, { opacity: 0, y: 20, duration: 0.4 }, "-=0.6")
    .fromTo(thread, { clipPath: "inset(-50% 100% -50% 0%)" }, { clipPath: "inset(-50% 0% -50% 0%)", duration: 1.6, ease: "none" })
    .from(knots, { scale: 0, duration: 0.35, stagger: 0.3, ease: "back.out(3)" }, "<0.15")
    .from(steps, { opacity: 0, y: 12, duration: 0.35, stagger: 0.15 }, "<")
    .to({}, { duration: 1.4 });   // time to read before the yarn ball rolls in

  function center(element) {
    const p = positionIn(element, panel);
    return { x: p.x + p.width / 2, y: p.y + p.height / 2 };
  }

  return tl;
}

function nineLivesAmbience() {
  gsap.to(".skills__yarn", { rotation: 360, duration: 12, ease: "none", repeat: -1 });
}
