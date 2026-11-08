/* =========================================================
   04 · INTRO
   ---------------------------------------------------------
   Plays once when the page loads (not tied to scrolling):
   1. The letters of "Olivia Li" drop in and bounce.
   2. The cat rises up from behind the name and the sparkle
      pops in.
   3. The words at the top fade in, then the paw prints
      start walking down the page.
   (Selectors also catch the 4 torn copies used by the claw
   tear, so the copies always match.)
   ========================================================= */

if (SITE.animated) playIntro();

function playIntro() {
  // reloaded halfway down the page? no intro
  if (window.scrollY > 10) return;

  const tl = gsap.timeline({ delay: 0.15 });

  tl.from(".hello__name .letter", {
      yPercent: -130,
      rotation: () => gsap.utils.random(-30, 30),
      opacity: 0,
      stagger: 0.06,
      duration: 0.9,
      ease: "bounce.out",
    })
    // the cat rises from behind the letters
    .from(".hello__cat", { y: () => window.innerHeight * 0.45, duration: 1.1, ease: "back.out(1.3)" }, "-=0.6")
    // the sparkle pops in (its inner shape, so it doesn't clash with the scroll animation)
    .from(".hello__sparkle use", { scale: 0, rotation: -120, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(2.2)" }, "-=0.5")
    .from(".hello__line, .hello__facts", { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.5")
    .fromTo(".hello__trail", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(-20% -20% -20% -20%)", duration: 0.6, ease: "power2.out" });   // (clip, not opacity: scrolling already uses opacity)
}
