/* =========================================================
   02 · CURSOR, WATCHING EYES & BATTING LETTERS
   ---------------------------------------------------------
   1. On a computer the mouse becomes a black cat paw (with a
      white outline so it shows on every colour). It grows over
      links, and clicks leave paw prints.
   2. Every cat eye (class "pupil") watches the cursor.
      Cats with data-watch="dot" watch the sparkle instead.
   3. Big letters get batted away when the cursor comes near,
      then spring back, like a cat playing with them.
   ========================================================= */

const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const pointer = { x: -999, y: -999 };

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});


/* ---- 1. The paw cursor ---- */
if (SITE.animated && hasMouse) {
  document.documentElement.classList.add("has-paw-cursor");
  const paw = document.querySelector(".paw-cursor");

  // quickTo = a fast, smooth way to follow a value that changes a lot
  const moveX = gsap.quickTo(paw, "x", { duration: 0.1, ease: "power3" });
  const moveY = gsap.quickTo(paw, "y", { duration: 0.1, ease: "power3" });
  window.addEventListener("pointermove", (event) => {
    if (!paw.classList.contains("is-active")) gsap.set(paw, { x: event.clientX, y: event.clientY });   // first move: jump straight there
    paw.classList.add("is-active");
    moveX(event.clientX);
    moveY(event.clientY);
  });
  // hide it when the mouse leaves the window
  document.documentElement.addEventListener("mouseleave", () => paw.classList.remove("is-active"));

  // bigger over anything clickable
  document.addEventListener("pointerover", (event) => {
    paw.classList.toggle("is-over-link", Boolean(event.target.closest("a, button")));
  });

  // press = squish, and leave a paw print behind
  window.addEventListener("pointerup", () => paw.classList.remove("is-pressed"));
  window.addEventListener("pointerdown", (event) => {
    paw.classList.add("is-pressed");
    const print = document.createElement("div");
    print.className = "paw-stamp";
    print.innerHTML = '<svg viewBox="0 0 100 100"><use href="#paw-print"/></svg>';
    print.style.left = `${event.clientX}px`;
    print.style.top = `${event.clientY}px`;
    document.body.append(print);
    gsap.fromTo(print,
      { scale: 0.4, opacity: 0.9, rotation: gsap.utils.random(-35, 35) },
      { scale: 1, opacity: 0, duration: 1.2, ease: "power2.out", onComplete: () => print.remove() });
  });
}


/* ---- 2. Eyes that follow ---- */
if (SITE.animated) {
  const chaseDot = document.querySelector(".chase__dot");

  const pupils = [...document.querySelectorAll(".pupil")].map((element) => ({
    element,
    range: Number(element.dataset.range) || 4,
    watch: element.closest("[data-watch]")?.dataset.watch || "pointer",
    moveX: gsap.quickTo(element, "x", { duration: 0.35, ease: "power3" }),
    moveY: gsap.quickTo(element, "y", { duration: 0.35, ease: "power3" }),
  }));

  function lookTarget(watch) {
    if (watch === "dot") {
      const box = chaseDot.getBoundingClientRect();
      return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    }
    if (hasMouse && pointer.x > -999) return pointer;
    // no mouse (phones): the eyes wander by themselves
    const t = performance.now() / 1000;
    return { x: window.innerWidth * (0.5 + 0.5 * Math.cos(t * 0.7)), y: window.innerHeight * (0.5 + 0.35 * Math.sin(t * 1.1)) };
  }

  gsap.ticker.add(() => {
    pupils.forEach((pupil) => {
      const box = pupil.element.getBoundingClientRect();
      if (!box.width) return;
      const target = lookTarget(pupil.watch);
      const dx = target.x - (box.left + box.width / 2);
      const dy = target.y - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, distance / 250);
      pupil.moveX((dx / distance) * pupil.range * strength);
      pupil.moveY((dy / distance) * pupil.range * strength);
    });
  });
}


/* ---- 3. Batting the big letters ---- */
if (SITE.animated && hasMouse) {
  const letters = [...document.querySelectorAll("#hello .letter, .say-hi__big .letter")].map((element) => ({
    element,
    targetX: 0,
    targetY: 0,
    moveX: gsap.quickTo(element, "x", { duration: 0.9, ease: "elastic.out(1, 0.35)" }),
    moveY: gsap.quickTo(element, "y", { duration: 0.9, ease: "elastic.out(1, 0.35)" }),
  }));

  gsap.ticker.add(() => {
    letters.forEach((letter) => {
      const box = letter.element.getBoundingClientRect();
      if (!box.width) return;
      // the letter's resting centre (remove the push it already has)
      const cx = box.left + box.width / 2 - gsap.getProperty(letter.element, "x");
      const cy = box.top + box.height / 2 - gsap.getProperty(letter.element, "y");
      const dx = cx - pointer.x;
      const dy = cy - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = box.height * 0.75;

      let x = 0;
      let y = 0;
      if (distance < reach) {
        const push = (1 - distance / reach) * box.height * 0.3;
        x = (dx / distance) * push;
        y = (dy / distance) * push;
      }
      // only send new targets when they change, so the spring can play out
      if (Math.abs(x - letter.targetX) > 1 || Math.abs(y - letter.targetY) > 1) {
        letter.targetX = x;
        letter.targetY = y;
        letter.moveX(x);
        letter.moveY(y);
      }
    });
  });
}
