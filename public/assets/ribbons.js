/*
 * Ribbons — a streamer that trails the pointer.
 *
 * A port of the React Bits <Ribbons> component to plain canvas, carrying the
 * same parameters. It is written this way, rather than installed, because the
 * site is only half React: the works, playground, about and résumé pages are
 * static HTML, and a React-only component would miss four of the six routes.
 *
 * The physics are theirs: every point chases the one ahead of it on a spring,
 * the head chases the pointer, and the strip tapers and fades toward the tail.
 *
 * Sits out on touch screens and for prefers-reduced-motion.
 */
(function () {
  var CONFIG = {
    colors: ["#351f5e"],
    baseSpring: 0.01,
    baseFriction: 0.5,
    baseThickness: 20,
    offsetFactor: 0.05,
    maxAge: 550,
    pointCount: 45,
    speedMultiplier: 0.6,
    enableFade: true,
  };

  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.requestAnimationFrame
  ) {
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.className = "ribbons-canvas";
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var style = document.createElement("style");
  style.textContent =
    ".ribbons-canvas{position:fixed;inset:0;width:100%;height:100%;" +
    "pointer-events:none;z-index:2147482000}";

  var dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* One ribbon per colour, each nudged sideways so they do not overlap. */
  var ribbons = CONFIG.colors.map(function (color, index) {
    var offset =
      (index - (CONFIG.colors.length - 1) / 2) *
      CONFIG.offsetFactor *
      window.innerWidth;
    return { color: color, offset: offset, points: null };
  });

  var pointer = { x: 0, y: 0 };
  var lastMove = 0;
  var running = false;

  function seed(ribbon) {
    ribbon.points = [];
    for (var i = 0; i < CONFIG.pointCount; i++) {
      ribbon.points.push({ x: pointer.x + ribbon.offset, y: pointer.y, vx: 0, vy: 0 });
    }
  }

  function step(ribbon) {
    var pts = ribbon.points;
    /* Targets are read from where the points were at the start of the frame.
       Chasing the already-moved point ahead would run the whole length of the
       ribbon in a single frame and collapse it into a kink. */
    var was = pts.map(function (p) {
      return { x: p.x, y: p.y };
    });

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var tx = i === 0 ? pointer.x + ribbon.offset : was[i - 1].x;
      var ty = i === 0 ? pointer.y : was[i - 1].y;
      /* The head is the one that keeps up with the pointer; speedMultiplier
         is what lets the rest lag behind it. */
      var spring =
        i === 0
          ? CONFIG.baseSpring / CONFIG.speedMultiplier
          : CONFIG.baseSpring;

      p.vx = (p.vx + (tx - p.x) * spring) * (1 - CONFIG.baseFriction);
      p.vy = (p.vy + (ty - p.y) * spring) * (1 - CONFIG.baseFriction);
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  /* Catmull-Rom through the control points, so the strip reads as a curve
     rather than 45 straight segments meeting at corners. */
  function smooth(pts, perSegment) {
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(i - 1, 0)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(i + 2, pts.length - 1)];
      for (var s = 0; s < perSegment; s++) {
        var t = s / perSegment;
        var t2 = t * t;
        var t3 = t2 * t;
        out.push({
          x:
            0.5 *
            (2 * p1.x +
              (-p0.x + p2.x) * t +
              (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y:
            0.5 *
            (2 * p1.y +
              (-p0.y + p2.y) * t +
              (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        });
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  /* The strip: two edges walked out along each point's normal, drawn as
     quads so the fade can run down the length. */
  function draw(ribbon, idleAlpha) {
    var pts = smooth(ribbon.points, 4);
    var n = pts.length;
    var left = [];
    var right = [];

    for (var i = 0; i < n; i++) {
      var prev = pts[Math.max(i - 1, 0)];
      var next = pts[Math.min(i + 1, n - 1)];
      var dx = next.x - prev.x;
      var dy = next.y - prev.y;
      var len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len;
      var ny = dx / len;
      var half = (CONFIG.baseThickness * (1 - i / (n - 1))) / 2;
      left.push({ x: pts[i].x + nx * half, y: pts[i].y + ny * half });
      right.push({ x: pts[i].x - nx * half, y: pts[i].y - ny * half });
    }

    ctx.fillStyle = ribbon.color;
    ctx.strokeStyle = ribbon.color;
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";

    for (var j = 0; j < n - 1; j++) {
      ctx.globalAlpha =
        idleAlpha * (CONFIG.enableFade ? 1 - j / (n - 1) : 1);
      ctx.beginPath();
      ctx.moveTo(left[j].x, left[j].y);
      ctx.lineTo(left[j + 1].x, left[j + 1].y);
      ctx.lineTo(right[j + 1].x, right[j + 1].y);
      ctx.lineTo(right[j].x, right[j].y);
      ctx.closePath();
      ctx.fill();
      /* Neighbouring quads share their edge exactly, so what shows between
         them is the antialiasing, not a gap. Stroking closes it. */
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    /* Once the pointer has been still for maxAge, the ribbon lets go. */
    var idle = performance.now() - lastMove;
    var alpha = idle < CONFIG.maxAge ? 1 : Math.max(0, 1 - (idle - CONFIG.maxAge) / 400);

    for (var i = 0; i < ribbons.length; i++) {
      step(ribbons[i]);
      if (alpha > 0) draw(ribbons[i], alpha);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);

  document.addEventListener(
    "pointermove",
    function (event) {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      lastMove = performance.now();

      if (!running) {
        running = true;
        document.head.appendChild(style);
        document.body.appendChild(canvas);
        resize();
        ribbons.forEach(seed);
        requestAnimationFrame(frame);
      }
    },
    { passive: true },
  );
})();
