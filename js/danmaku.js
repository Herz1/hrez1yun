/* ============================================================
   幻想郷通信 · 弹幕引擎 DanmakuFX
   ------------------------------------------------------------
   - 环境弹幕：低密度环形/扇形/漂浮弹，全站氛围
   - burst(x,y,n)：点击处弹幕爆发（配合擦弹计数）
   - spellcard(ms)：全屏螺旋符卡弹幕（隐藏指令触发）
   - 自动暂停：标签页隐藏时停止渲染省电
   - 尊重 prefers-reduced-motion：直接不启动
   ============================================================ */
(function () {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("danmaku-canvas");
  if (!canvas || reduced) { window.DanmakuFX = { burst(){}, spellcard(){}, }; return; }

  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  const MAX = mobile ? 90 : 200;          // 子弹上限
  const bullets = [];
  let paused = false, spellUntil = 0;

  const PALETTE = ["#e2474b", "#4f9dde", "#58b368", "#a06ee0", "#e8b84b"];
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const TAU = Math.PI * 2;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize); resize();

  /* ---------- 子弹 ---------- */
  function spawn(o) {
    if (bullets.length >= MAX) bullets.shift();
    bullets.push(Object.assign({
      x: 0, y: 0, vx: 0, vy: 0,
      r: 5, color: pick(PALETTE),
      life: 0, maxLife: 900,          // 帧
      type: "orb",                    // orb | star
      rot: Math.random() * TAU, rotV: (Math.random() - .5) * .06,
      fadeIn: 20,
    }, o));
  }

  function drawOrb(b, alpha) {
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU);
    ctx.fillStyle = b.color; ctx.fill();
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * .55, 0, TAU);
    ctx.fillStyle = "#fffdf5"; ctx.fill();
  }
  function drawStar(b, alpha) {
    ctx.globalAlpha = alpha;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.fillStyle = b.color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 ? b.r * .45 : b.r;
      const a = (i / 8) * TAU;
      ctx[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = alpha * .9;
    ctx.beginPath(); ctx.arc(0, 0, b.r * .32, 0, TAU);
    ctx.fillStyle = "#fffdf5"; ctx.fill();
    ctx.restore();
  }

  /* ---------- 环境弹型 ---------- */
  function patternRing() {                       // 环形绽放
    const cx = W * (0.15 + Math.random() * 0.7);
    const cy = H * (0.1 + Math.random() * 0.5);
    const n = 10 + ((Math.random() * 6) | 0);
    const color = pick(PALETTE), speed = 0.35 + Math.random() * 0.3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      spawn({ x: cx, y: cy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed + 0.1,
              r: 4.5, color, maxLife: 620 });
    }
  }
  function patternFan() {                        // 边缘扇形
    const fromLeft = Math.random() < .5;
    const x = fromLeft ? -10 : W + 10, y = H * (0.15 + Math.random() * 0.5);
    const base = fromLeft ? 0 : Math.PI, color = pick(PALETTE);
    for (let i = -2; i <= 2; i++) {
      const a = base + i * 0.22;
      const s = 0.7 + Math.random() * 0.3;
      spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s + 0.15,
              r: 5, color, type: Math.random() < .3 ? "star" : "orb", maxLife: 800 });
    }
  }
  function patternDrift() {                      // 零星漂浮星弹
    spawn({ x: Math.random() * W, y: -12,
            vx: (Math.random() - .5) * .3, vy: .3 + Math.random() * .35,
            r: 4 + Math.random() * 2.5, type: "star", maxLife: 1100 });
  }

  let tAmbient = 0;
  function ambient() {
    tAmbient++;
    if (tAmbient % 150 === 0) patternRing();
    if (tAmbient % 260 === 130) patternFan();
    if (tAmbient % 90 === 40) patternDrift();
  }

  /* ---------- 符卡：黄金角螺旋 ---------- */
  let spellT = 0;
  function spellTick() {
    spellT++;
    if (spellT % 3 !== 0) return;
    const cx = W / 2, cy = H * 0.4;
    const GA = 2.399963;                          // 黄金角
    for (let k = 0; k < 3; k++) {
      const a = (spellT * GA) + (k / 3) * TAU;
      spawn({ x: cx, y: cy,
              vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5,
              r: 5.5, color: PALETTE[(spellT / 3 + k) % PALETTE.length | 0],
              type: k === 2 ? "star" : "orb", maxLife: 500 });
    }
  }

  /* ---------- 主循环 ---------- */
  function loop() {
    requestAnimationFrame(loop);
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    if (Date.now() < spellUntil) spellTick(); else ambient();

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.life++; b.x += b.vx; b.y += b.vy; b.rot += b.rotV;
      if (b.life > b.maxLife || b.x < -40 || b.x > W + 40 || b.y > H + 40 || b.y < -60) {
        bullets.splice(i, 1); continue;
      }
      const fadeOut = Math.min(1, (b.maxLife - b.life) / 60);
      const alpha = Math.min(1, b.life / b.fadeIn) * fadeOut * 0.8;
      (b.type === "star" ? drawStar : drawOrb)(b, alpha);
    }
    ctx.globalAlpha = 1;
  }
  loop();

  document.addEventListener("visibilitychange", () => { paused = document.hidden; });

  /* ---------- 对外接口 ---------- */
  window.DanmakuFX = {
    burst(x, y, n = 8) {
      const color = pick(PALETTE);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + Math.random() * .4;
        const s = 1.2 + Math.random() * 1.2;
        spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                r: 3.5 + Math.random() * 2, color,
                type: Math.random() < .35 ? "star" : "orb", maxLife: 90, fadeIn: 4 });
      }
    },
    spellcard(ms = 6000) { spellT = 0; spellUntil = Date.now() + ms; },
  };
})();
