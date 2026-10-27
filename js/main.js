/* ============================================================
   幻想郷通信 · 主脚本
   小组件清单（吸收自各优秀博客的亮点）：
   加载幕 / 昼夜切换(D) / 本地搜索(S) / 打字机 / 幻想时计 /
   本地一言 / 阅读进度·符卡BOSS条 / 目录高亮 / 代码复制+Toast /
   返回顶部(百分比圆环) / 点击擦弹+计分 / ↑↑↓↓←→←→BA 隐藏符卡 /
   首页&归档由 posts-data.js 单一数据源渲染 / 控制台彩蛋
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- 0. 加载幕 ---------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (!loader) return;
    setTimeout(() => { loader.classList.add("done"); setTimeout(() => loader.remove(), 650); }, reduced ? 0 : 350);
  });

  /* ---------- 1. 昼 / 夜 ---------- */
  const root = document.documentElement;
  function applyTheme(t) {
    root.dataset.theme = t; // 图标由 CSS 依据主题切换
  }
  const storedTheme = store.get("gensokyo-theme") || store.get("theme");
  const savedTheme = /^(night|day)$/.test(storedTheme) ? storedTheme : null;
  const urlTheme = new URLSearchParams(location.search).get("theme");
  applyTheme(urlTheme === "night" || urlTheme === "day" ? urlTheme : savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"));
  function toggleTheme() {
    const t = root.dataset.theme === "night" ? "day" : "night";
    applyTheme(t); store.set("gensokyo-theme", t);
    toast(t === "night" ? "🌕 永夜降临" : "☀️ 白昼归来");
  }
  const themeBtn = $("#theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  /* ---------- 2. Toast ---------- */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.id = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  /* ---------- 3. 滚动：导航 / 进度 / BOSS条 / 返回顶部 ---------- */
  const nav = $(".navbar"), bar = $("#progress-bar");
  const backTop = $("#back-top"), backNum = $("#back-top-num");
  const bossName = $("#boss-name"), bossStars = $("#boss-stars"), bossWrap = $("#boss-label");
  const sections = $$(".article-content h2[id]");

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.min(100, Math.round((y / max) * 100)) : 0;
    if (nav) nav.classList.toggle("scrolled", y > 50);
    if (bar) bar.style.width = pct + "%";
    if (backTop) {
      backTop.classList.toggle("show", y > 420);
      backTop.style.setProperty("--p", pct);
      if (backNum) backNum.textContent = pct;
    }
    if (bossWrap) bossWrap.classList.toggle("show", y > 260 && pct < 99);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (backTop) backTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  /* ---------- 4. 目录高亮 + BOSS 符卡名 ---------- */
  if (sections.length) {
    const tocLinks = $$(".toc-list a");
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        tocLinks.forEach((a) => a.classList.toggle("current", a.getAttribute("href") === "#" + id));
        const idx = sections.indexOf(e.target);
        if (bossName) bossName.textContent = "「" + e.target.dataset.sc + "」";
        if (bossStars) bossStars.textContent = "★".repeat(idx + 1) + "☆".repeat(sections.length - idx - 1);
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    sections.forEach((h) => io.observe(h));
  }

  /* ---------- 5. 进场浮现 ---------- */
  const rvIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("rv-in");
    if (e.target.classList.contains("stat-fill")) e.target.style.width = e.target.dataset.w;
    rvIO.unobserve(e.target);
  }), { threshold: 0.1 });
  function observeRv() { $$(".rv, .stat-fill").forEach((el) => rvIO.observe(el)); }

  /* ---------- 6. 打字机 ---------- */
  (function () {
    const el = $("#typing-text"); if (!el) return;
    const lines = JSON.parse(el.dataset.lines || "[]"); if (!lines.length) return;
    if (reduced) { el.textContent = lines[0]; return; }
    let li = 0, ci = 0, del = false;
    (function tick() {
      el.textContent = lines[li].slice(0, ci);
      if (!del) { ci < lines[li].length ? (ci++, setTimeout(tick, 95)) : (del = true, setTimeout(tick, 2400)); }
      else { ci > 0 ? (ci--, setTimeout(tick, 38)) : (del = false, li = (li + 1) % lines.length, setTimeout(tick, 520)); }
    })();
  })();

  /* ---------- 7. 幻想时计 ---------- */
  (function () {
    const t = $("#clock-time"), d = $("#clock-date"), lk = $("#clock-lucky");
    if (!t) return;
    const LUCK = ["宜写码", "宜擦弹", "宜参拜", "宜补番", "宜喝茶", "忌拖延", "忌通宵（大概）", "宜整理收藏夹"];
    if (lk) lk.textContent = LUCK[(Math.random() * LUCK.length) | 0];
    const W = ["日", "一", "二", "三", "四", "五", "六"];
    function tick() {
      const n = new Date(), p = (x) => String(x).padStart(2, "0");
      t.textContent = p(n.getHours()) + ":" + p(n.getMinutes()) + ":" + p(n.getSeconds());
      if (d) d.textContent = n.getFullYear() + " 年 " + (n.getMonth() + 1) + " 月 " + n.getDate() + " 日 · 星期" + W[n.getDay()];
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- 8. 本地一言 ---------- */
  (function () {
    const el = $("#quote-text"), btn = $("#quote-refresh"); if (!el) return;
    const Q = [
      "幻想，是现实的另一种解法。",
      "弹幕是美的，代码也应当如此。",
      "符卡规则第一条：优雅地解决问题。",
      "在竹林里迷路时，记得抬头找月亮。",
      "信仰不足的时候，就写一篇博客吧。",
      "巫女的日报：退治、扫除、喝茶。",
      "贪吃的妖怪和贪心的算法，都要适可而止。",
      "常识什么的，在境界的另一侧就放下吧。",
      "慢慢来，比较快——低速移动，判定更小。",
    ];
    let last = -1;
    function roll() {
      let i; do { i = (Math.random() * Q.length) | 0; } while (i === last && Q.length > 1);
      last = i; el.textContent = Q[i];
    }
    roll();
    if (btn) btn.addEventListener("click", () => { roll(); btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin"); });
  })();

  /* ---------- 9. 封面图鉴（见 js/art.js 手绘场景库） ---------- */
  const COVERS = (window.ART && ART.covers) || {};

  /* ---------- 10. 首页文章渲染 ---------- */
  (function () {
    const wrap = $("#post-list"); if (!wrap || !window.POSTS) return;
    const posts = [...POSTS].sort((a, b) => (b.pin | 0) - (a.pin | 0) || b.date.localeCompare(a.date));
    const ic = (n) => `<svg class="icon"><use href="#i-${n}"/></svg>`;
    wrap.innerHTML = posts.map((p) => `
      <article class="post-card rv">
        <a class="post-cover" href="${p.url}" aria-label="阅读：${p.title}">${COVERS[p.cover] || ""}</a>
        <div class="post-body">
          <div class="post-meta">
            ${p.pin ? `<span class="pin">${ic("pin")}置顶</span>` : ""}
            <span>${ic("calendar")}${p.date}</span><span>${ic("pen")}${p.words} 字</span><span>${ic("clock")}约 ${p.mins} 分钟</span>
          </div>
          <a href="${p.url}"><h2 class="post-title">${p.title}</h2></a>
          <p class="post-excerpt">${p.excerpt}</p>
          <div class="post-tags">
            <span class="cat-chip">${p.cat}</span>
            ${p.tags.map((t) => `<a class="ofuda" href="archive.html#tag=${encodeURIComponent(t)}">${t}</a>`).join("")}
          </div>
        </div>
      </article>`).join("");
  })();

  /* Archive and search are handled by reading-room.js and search-dialog.js. */

  /* ---------- 13. 全局快捷键 ---------- */
  addEventListener("keydown", (e) => {
    const typing = document.activeElement.isContentEditable || /input|textarea|select/i.test(document.activeElement.tagName);
    if (document.getElementById("search-modal")?.classList.contains("open")) return;
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "d" || e.key === "D") toggleTheme();
    if ((e.key === "ArrowLeft" || e.key === "j") && kIdx === 0) { const a = $("a[data-prev]"); if (a) location.href = a.href; }
    if ((e.key === "ArrowRight" || e.key === "k") && kIdx === 0) { const a = $("a[data-next]"); if (a) location.href = a.href; }
  });

  /* ---------- 14. 点击擦弹 + 计分 ---------- */
  let graze = 0;
  const grazeNum = $("#graze-num");
  addEventListener("click", (e) => {
    if (reduced || e.target.closest("a,button,input,textarea,label,.no-fx")) return;
    const n = 6 + ((Math.random() * 5) | 0);
    window.DanmakuFX && DanmakuFX.burst(e.clientX, e.clientY, n);
    graze += n;
    if (grazeNum) grazeNum.textContent = graze;
    const pop = document.createElement("span");
    pop.className = "score-pop"; pop.textContent = "Graze +" + n;
    pop.style.left = e.clientX + "px"; pop.style.top = e.clientY + "px";
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 900);
  });

  /* ---------- 15. 隐藏符卡：↑↑↓↓←→←→BA ---------- */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = k === KONAMI[kIdx] ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kIdx !== KONAMI.length) return;
    kIdx = 0; castSpellcard();
  });
  function castSpellcard() {
    if (reduced) return toast("已尊重系统的减少动态设置～");
    const ov = document.createElement("div");
    ov.id = "spell-overlay";
    ov.innerHTML = `<div class="sp-frame"></div>
      <div class="sp-name"><span class="sp-kind">秘技</span>「博丽大结界 · 全屏走弹」</div>
      <div class="sp-sub">SPELL CARD ATTACK</div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("show"));
    window.DanmakuFX && DanmakuFX.spellcard(6000);
    setTimeout(() => { ov.classList.remove("show"); setTimeout(() => ov.remove(), 600); }, 6000);
  }

  /* ---------- 16. 代码复制 ---------- */
  $$(".article-content pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.className = "copy-btn no-fx"; btn.type = "button"; btn.textContent = "复制";
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code");
      const txt = code ? code.innerText : pre.innerText;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
        .then(() => { toast("已复制符文 ✓"); btn.textContent = "✓"; setTimeout(() => (btn.textContent = "复制"), 1500); })
        .catch(() => toast("复制失败，请手动选择"));
    });
    pre.appendChild(btn);
  });

  /* ---------- 17. Hero 视差 ---------- */
  (function () {
    const hero = $(".hero"); if (!hero || reduced || matchMedia("(hover: none)").matches) return;
    const layers = $$(".plx", hero);
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = +l.dataset.depth || 4;
        l.style.transform = `translate(${(-mx * d).toFixed(1)}px, ${(-my * d * 0.6).toFixed(1)}px)`;
      });
    });
  })();

  /* ---------- 18. 运行天数 & 收尾 ---------- */
  const days = Math.max(0, Math.floor((Date.now() - new Date((window.SITE || {}).since || "2026-01-01")) / 864e5));
  $$("[data-run-days]").forEach((el) => (el.textContent = days));
  observeRv();

  console.log(
    "%c幻想郷通信 %c欢迎参拜 ⛩️\n%c快捷键：S 搜索 · D 昼夜 · ←/→ 翻篇\n隐藏符卡：↑↑↓↓←→←→BA",
    "font-size:20px;color:#c73e3a;font-weight:bold", "font-size:12px;color:#d9a441",
    "color:#8a8598"
  );
})();
