/* =========================================================
   2 · ABOUT ME
   ---------------------------------------------------------
   The photo wipes up, the title drops in, the bio lights up
   word by word, and the fact strips slide in from the right
   like a fan of paint swatches.
   ========================================================= */

function aboutSection() {
  const panel = document.querySelector("#about");
  const photo = panel.querySelector(".about__photo");
  const title = panel.querySelector(".about__title");
  const words = panel.querySelectorAll(".about__bio .word");
  const facts = panel.querySelectorAll(".fact");

  const tl = gsap.timeline();

  tl.fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out" })
    .from(photo.querySelector("img"), { scale: 1.3, duration: 1.4, ease: "power2.out" }, "<")
    .from(photo.querySelector(".about__photo-cat"), { yPercent: 100, duration: 0.8, ease: "back.out(1.6)" }, "<0.5")
    .from(title, { yPercent: 70, opacity: 0, duration: 0.7, ease: "back.out(1.8)" }, "<")
    .from(words, { opacity: 0.1, stagger: 0.04, duration: 0.3 }, "-=0.3")
    .from(facts, { xPercent: 100, stagger: 0.12, duration: 0.8, ease: "power3.out" }, "-=0.9")
    .to({}, { duration: 0.8 });   // a moment to read

  return tl;
}
