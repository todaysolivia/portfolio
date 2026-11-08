/* =========================================================
   04 · LOADING SCREEN + INTRO
   ---------------------------------------------------------
   The loading screen (a little walking cat) covers the page
   from the very first moment. Once the fonts and images are
   loaded:
   1. The cat trots off, and the loading screen lifts away
      like a curtain.
   2. The letters of "Olivia Li" drop in and bounce.
   3. The big cat rises from behind the name, the sparkle
      pops in, the words fade in, then the paw prints start.
   Waiting first means nothing jumps or flickers on load.
   (Selectors also catch the 4 torn copies used by the claw
   tear, so the copies always match.)
   ========================================================= */

if (SITE.animated) startWhenReady();

function startWhenReady() {
  const loader = document.querySelector(".loader");
  SITE.lenis.stop();   // no scrolling until the page is ready

  // ready = page loaded + fonts loaded (but never wait more than 4 seconds)
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const ready = Promise.all([pageLoaded, document.fonts.ready]);
  const tooSlow = new Promise((resolve) => setTimeout(resolve, 4000));

  Promise.race([ready, tooSlow]).then(() => {
    // reloaded halfway down the page? just fade the loader out
    if (window.scrollY > 10) {
      gsap.to(loader, { opacity: 0, duration: 0.4, onComplete: finish });
      return;
    }
    playIntro();
  });

  function finish() {
    loader.remove();
    SITE.lenis.start();
  }

  function playIntro() {
    const tl = gsap.timeline({ onComplete: () => SITE.lenis.start() });

    // 1. the loading cat trots off and the curtain lifts
    tl.to(".loader__cat, .loader__ground, .loader__name", { x: () => window.innerWidth * 0.6, opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 })
      .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power3.inOut", onComplete: () => loader.remove() }, 0.35)

      // 2. the name drops in (these start hidden, set while the loader still covers them)
      .from(".hello__name .letter", {
        yPercent: -130,
        rotation: () => gsap.utils.random(-30, 30),
        opacity: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "bounce.out",
      }, 0.75)
      // 3. the cat rises, the sparkle pops, words and paw prints appear
      .from(".hello__cat", { y: () => window.innerHeight * 0.8, duration: 1.2, ease: "back.out(1.2)" }, 1.1)
      .from(".hello__sparkle use", { scale: 0, rotation: -120, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(2.2)" }, "-=0.5")
      .from(".hello__line, .hello__facts", { y: 24, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.5")
      .fromTo(".hello__trail", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(-20% -20% -20% -20%)", duration: 0.6, ease: "power2.out" });   // (clip, not opacity: scrolling already uses opacity)
  }
}
