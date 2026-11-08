/* =========================================================
   6 · SAY HI (contact)
   ---------------------------------------------------------
   The text slides in, the giant letters of "say hi" drop
   from above and bounce (like things knocked off a shelf),
   and then a cat lands on them and falls asleep.
   ========================================================= */

function sayHiSection() {
  const panel = document.querySelector("#say-hi");
  const line = panel.querySelector(".say-hi__line");
  const email = panel.querySelector(".say-hi__email");
  const links = panel.querySelectorAll(".say-hi__links li");
  const letters = panel.querySelectorAll(".say-hi__big .letter");
  const cat = panel.querySelector(".say-hi__cat");

  const tl = gsap.timeline();

  tl.from(line, { y: 50, opacity: 0, duration: 0.6, ease: "back.out(2)" })
    .from(email, { y: 30, opacity: 0, duration: 0.5 }, "-=0.2")
    .from(links, { x: 30, opacity: 0, stagger: 0.08, duration: 0.4 }, "<")
    .from(letters, {
      yPercent: -320,   // start well above the screen (x/y are kept free for the cursor batting)
      rotation: () => gsap.utils.random(-40, 40),
      duration: 1,
      stagger: 0.12,
      ease: "bounce.out",
    }, "-=0.2")
    .from(cat, { y: () => -window.innerHeight, rotation: 30, duration: 0.8, ease: "bounce.out" })
    .to({}, { duration: 1 });   // rest at the end

  return tl;
}

function sayHiAmbience() {
  gsap.fromTo(".zzz",
    { opacity: 0, x: 0, y: 6 },
    { opacity: 1, x: 8, y: -14, duration: 1.2, ease: "sine.out", repeat: -1, yoyo: true, stagger: 0.6 });
  gsap.to(".say-hi__cat", { scaleY: 1.06, transformOrigin: "50% 100%", duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
}
