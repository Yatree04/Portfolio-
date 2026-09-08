/*
 * A smooth cursor: the pointer is replaced by a small arrow that chases the
 * real position on a spring and turns to face the direction of travel.
 *
 * Vanilla on purpose — the static pages are plain HTML and the onboarding is
 * React, and both load this same file.
 *
 * It bows out entirely on touch screens and for anyone who asked for reduced
 * motion, and it hands the native cursor back over text fields and the
 * drawing canvas, where the I-beam and crosshair carry real meaning.
 */
(function () {
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (coarse || still || !window.requestAnimationFrame) return;

  var NATIVE = "input, textarea, select, canvas, [contenteditable]";

  /* Styles ride along with the script: the static pages and the React app
     load this one file and neither needs to know about the other's CSS. */
  var style = document.createElement("style");
  style.textContent =
    ".smooth-cursor{position:fixed;left:0;top:0;z-index:2147483000;" +
    "margin:-2px 0 0 -2px;pointer-events:none;transition:opacity .18s ease;" +
    "will-change:transform}" +
    ".smooth-cursor svg{display:block;fill:#3a2a1b;stroke:#fdfaf0;" +
    "stroke-width:1.1;filter:drop-shadow(0 2px 4px rgba(53,43,56,.28))}" +
    ".smooth-cursor.is-hidden{opacity:0}" +
    "html.has-smooth-cursor,html.has-smooth-cursor body," +
    "html.has-smooth-cursor a,html.has-smooth-cursor button{cursor:none}" +
    "html.has-smooth-cursor :is(input,textarea,select,canvas,[contenteditable])" +
    "{cursor:auto}";

  var root = document.documentElement;
  var el = document.createElement("div");
  el.className = "smooth-cursor";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML =
    '<svg viewBox="0 0 24 24" width="24" height="24">' +
      '<path d="M4.2 2.6 19.1 11a1 1 0 0 1-.1 1.8l-5.6 2.2a1 1 0 0 0-.6.6l-2.2 5.6a1 1 0 0 1-1.8.1L2.6 4.2a1 1 0 0 1 1.6-1.6z"/>' +
    "</svg>";

  var mounted = false;
  /* Where the pointer is, where the arrow is, and how fast it is going. */
  var to = { x: 0, y: 0 };
  var at = { x: 0, y: 0 };
  var vel = { x: 0, y: 0 };
  var angle = 0;
  var drawn = 0;

  /* Critically-damped-ish spring: quick to answer, no overshoot wobble. */
  var STIFFNESS = 0.16;
  var DAMPING = 0.72;

  function frame() {
    vel.x = (vel.x + (to.x - at.x) * STIFFNESS) * DAMPING;
    vel.y = (vel.y + (to.y - at.y) * STIFFNESS) * DAMPING;
    at.x += vel.x;
    at.y += vel.y;

    var speed = Math.hypot(vel.x, vel.y);
    /* Only steer while actually moving, or the arrow spins on tiny jitters. */
    if (speed > 0.6) angle = (Math.atan2(vel.y, vel.x) * 180) / Math.PI + 45;
    /* And lean into the movement a little, the way a real nib would. */
    drawn += (Math.min(speed / 42, 0.22) - drawn) * 0.14;

    el.style.transform =
      "translate3d(" + at.x + "px," + at.y + "px,0) rotate(" + angle +
      "deg) scale(" + (1 - drawn) + ")";
    requestAnimationFrame(frame);
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    document.head.appendChild(style);
    document.body.appendChild(el);
    root.classList.add("has-smooth-cursor");
    at.x = to.x;
    at.y = to.y;
    requestAnimationFrame(frame);
  }

  document.addEventListener(
    "pointermove",
    function (event) {
      if (event.pointerType === "touch") return;
      to.x = event.clientX;
      to.y = event.clientY;
      mount();
      /* Over a field or the canvas, step aside and let the real one show. */
      var over = event.target instanceof Element && event.target.closest(NATIVE);
      el.classList.toggle("is-hidden", !!over);
    },
    { passive: true },
  );

  /* Leaving the window, or tabbing away, should not leave it stranded. */
  document.addEventListener("pointerleave", function () {
    el.classList.add("is-hidden");
  });
  document.addEventListener("pointerenter", function () {
    el.classList.remove("is-hidden");
  });
})();
