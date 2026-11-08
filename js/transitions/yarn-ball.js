/* =========================================================
   TRANSITION · GIANT BALL OF YARN (nine lives → work)
   ---------------------------------------------------------
   A ball of yarn bigger than the screen rolls in from the
   left and covers everything. It keeps rolling out to the
   right, and the Work section is left behind it, with a
   strand of yarn trailing across.

   Rolling maths: a ball that travels its own circumference
   (π × diameter) turns exactly once (360°).
   ========================================================= */

function yarnBall() {
  const fromPanel = document.querySelector("#nine-lives");
  const toPanel = document.querySelector("#work");
  const layer = document.querySelector(".fx--yarn");
  const ball = layer.querySelector(".giant-yarn");
  const thread = layer.querySelector(".yarn-thread");

  const size = () => Math.max(window.innerWidth, window.innerHeight) * 1.5;   // matches 150vmax in the CSS
  const travel = () => window.innerWidth / 2 + size() / 2;                       // centre → fully off screen
  const turns = () => (travel() / (Math.PI * size())) * 360;                      // degrees for that distance

  const tl = gsap.timeline();

  tl.set(layer, { autoAlpha: 1 })
    // roll in from the left…
    .fromTo(ball,
      { x: () => -travel(), rotation: 0, scaleY: 1 },
      { x: 0, rotation: () => turns(), duration: 1.4, ease: "power2.in" })
    .to(fromPanel, { x: 80, rotation: 1, duration: 1.4, ease: "power2.in" }, "<")   // gets nudged
    .to(ball, { scaleY: 0.94, scaleX: 1.04, duration: 0.15, yoyo: true, repeat: 1 })  // squish!
    // swap sections while the ball covers the screen
    .set(fromPanel, { autoAlpha: 0 })
    .set(toPanel, { autoAlpha: 1 })
    // …and roll out to the right, trailing a strand of yarn
    .to(ball, { x: () => travel(), rotation: () => turns() * 2, duration: 1.4, ease: "power2.out" })
    .fromTo(thread, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.out" }, "<0.15")
    .to(thread, { opacity: 0, duration: 0.5 }, "+=0.2")
    .set(layer, { autoAlpha: 0 })
    .set(thread, { opacity: 1 });

  return tl;
}
