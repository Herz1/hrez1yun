/* ============================================================
   幻想郷通信 · 樱吹雪引擎 PetalFX
   ------------------------------------------------------------
   - 白昼：樱花瓣随风飘落（三维翻转 + 全局风场）
   - 永夜：萤火虫浮游 + 偶发流星
   - 跟随 html[data-theme] 实时切换；标签页隐藏暂停；
     prefers-reduced-motion 时不启动。
   ============================================================ */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const canvas = document.createElement("canvas");
  canvas.id = "petal-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let W = 0, H = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize); resize();

  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const night = () => document.documentElement.dataset.theme === "night";

  /* ---------- 樱花瓣 ---------- */
  const PINKS = ["#ffd3de", "#ffc4d3", "#ffb9cb", "#ffdce6"];
  const petals = [];
  const P_MAX = mobile ? 14 : 26;
  function newPetal(fromTop) {
    return {
      x: rand(-40, W + 40),
      y: fromTop ? rand(-60, -10) : rand(0, H),
      s: rand(5.5, 10.5),                 // 尺寸
      vy: rand(0.35, 0.95),
      vx: rand(-0.2, 0.35),
      rot: rand(0, TAU), rotV: rand(-0.02, 0.02),
      ph: rand(0, TAU), phV: rand(0.008, 0.02),   // 翻转相位
      sway: rand(0.2, 0.9),
      color: PINKS[(Math.random() * PINKS.length) | 0],
      alpha: rand(0.55, 0.9),
    };
  }
  for (let i = 0; i < P_MAX; i++) petals.push(newPetal(false));

  function drawPetal(p, wind) {
    const flutter = Math.sin(p.ph);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot + Math.sin(p.ph * 0.7) * 0.5);
    ctx.scale(1, 0.35 + Math.abs(flutter) * 0.65);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    const s = p.s;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.75, s * 0.55, 0, s);
    ctx.bezierCurveTo(-s * 0.75, s * 0.55, -s * 0.9, -s * 0.7, 0, -s);
    ctx.fill();
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.strokeStyle = "#ff9cb6";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55); ctx.quadraticCurveTo(s * 0.1, 0, 0, s * 0.6);
    ctx.stroke();
    ctx.restore();
    p.ph += p.phV * 60 * dt;
    p.rot += p.rotV * 60 * dt;
    p.x += (p.vx + wind) * 60 * dt;
    p.y += p.vy * 60 * dt + Math.sin(p.ph) * p.sway * 0.3;
    if (p.y > H + 30 || p.x < -60 || p.x > W + 60) Object.assign(p, newPetal(true));
  }

  /* ---------- 萤火虫 ---------- */
  const flies = [];
  const F_MAX = mobile ? 8 : 15;
  function newFly() {
    return {
      x: rand(0, W), y: rand(H * 0.15, H),
      a: rand(0, TAU), av: rand(-0.02, 0.02),
      sp: rand(0.15, 0.5),
      ph: rand(0, TAU), phV: rand(0.02, 0.05),
      r: rand(1.6, 2.8),
      warm: Math.random() < 0.8,
    };
  }
  for (let i = 0; i < F_MAX; i++) flies.push(newFly());
  function drawFly(f) {
    const tw = 0.35 + (Math.sin(f.ph) + 1) * 0.35;
    const color = f.warm ? "255, 224, 150" : "196, 240, 170";
    ctx.globalAlpha = tw;
    const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
    g.addColorStop(0, `rgba(${color}, .9)`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 5, 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(${color}, 1)`;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.9, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    f.ph += f.phV * 60 * dt;
    f.a += f.av * 60 * dt;
    f.x += Math.cos(f.a) * f.sp * 60 * dt;
    f.y += Math.sin(f.a) * f.sp * 0.6 * 60 * dt;
    if (f.x < -20 || f.x > W + 20 || f.y < -20 || f.y > H + 20) Object.assign(f, newFly());
  }

  /* ---------- 流星 ---------- */
  let meteor = null, meteorTimer = rand(4, 10);
  function drawMeteor() {
    if (!meteor) {
      meteorTimer -= dt;
      if (meteorTimer <= 0) {
        const x = rand(W * 0.25, W * 0.95);
        meteor = { x, y: rand(0, H * 0.25), vx: -rand(6, 9), vy: rand(3, 4.5), life: 1 };
        meteorTimer = rand(7, 16);
      }
      return;
    }
    meteor.life -= dt * 1.4;
    if (meteor.life <= 0) { meteor = null; return; }
    const m = meteor, len = 90 * m.life;
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len / 7, m.y - m.vy * len / 7);
    grad.addColorStop(0, `rgba(255, 250, 230, ${0.9 * m.life})`);
    grad.addColorStop(1, "rgba(255, 250, 230, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * len / 7, m.y - m.vy * len / 7);
    ctx.stroke();
    m.x += m.vx * 60 * dt; m.y += m.vy * 60 * dt;
  }

  /* ---------- 主循环 ---------- */
  let paused = false, last = performance.now(), dt = 0, windT = 0;
  document.addEventListener("visibilitychange", () => { paused = document.hidden; last = performance.now(); });
  (function loop(now) {
    requestAnimationFrame(loop);
    if (paused) return;
    dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, W, H);
    if (night()) {
      for (const f of flies) drawFly(f);
      drawMeteor();
    } else {
      windT += dt * 0.3;
      const wind = Math.sin(windT) * 0.45 + 0.25;
      for (const p of petals) drawPetal(p, wind);
    }
    ctx.globalAlpha = 1;
  })(performance.now());
})();
