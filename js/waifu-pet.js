/*
 * 幻想郷通信 · 自托管静态桌宠
 *
 * 参考 stevenjoezhang/live2d-widget 的交互结构（延迟加载、台词、工具栏、
 * 拖动、关闭与唤醒），但当前素材不是 Live2D，因此不加载或伪造 Cubism。
 * 参考项目：https://github.com/stevenjoezhang/live2d-widget
 */
(function () {
  "use strict";

  var currentScript = document.currentScript;
  if (!currentScript || window.__GENSOKYO_WAIFU_V1__) return;

  var runtime = {
    mounted: false,
    listenersReady: false,
    pet: null,
    toggle: null,
    tips: null,
    tipTimer: 0,
    styleReady: null,
    lastHover: null,
    dragMoved: false,
    scale: 1,
  };
  window.__GENSOKYO_WAIFU_V1__ = runtime;

  var scriptUrl = new URL(currentScript.src, window.location.href);
  var cssUrl = new URL("../css/waifu.css?v=5", scriptUrl).href;
  var assetRoot = new URL("../assets/waifu/v1/", scriptUrl);
  var modelUrl = new URL("models/reimu-static/reimu.png?v=5", assetRoot).href;
  var tipsUrl = new URL("waifu-tips.json", assetRoot).href;

  var DISPLAY_KEY = "gensokyo-waifu-display-v1";
  var POSITION_KEY = "gensokyo-waifu-position-v1";
  var MOTION_KEY = "gensokyo-waifu-motion-v1";
  var SCALE_KEY = "gensokyo-waifu-scale-v1";
  var SCALE_MIN = 0.7;
  var SCALE_MAX = 1.5;
  var SCALE_STEP = 0.1;
  var reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var narrowQuery = window.matchMedia("(max-width: 1100px)");

  var fallbackTips = {
    idle: [
      "守着结界也要记得偶尔休息。",
      "这里的弹幕不会伤人，放心阅读吧。",
      "文章很多，慢慢翻就好。",
      "夜色正好，要切换成永夜模式吗？",
    ],
    character: [
      "御札可不是书签，不过这次就借你用吧。",
      "别急，我一直在这里。",
      "今天也要把结界维护好。",
    ],
    mouseover: [],
  };

  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }

  function writeStore(key, value) {
    try { window.localStorage.setItem(key, value); } catch (error) {}
  }

  function parseStore(key) {
    try { return JSON.parse(readStore(key) || "null"); } catch (error) { return null; }
  }

  function normalizeScale(value) {
    var numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.round(Math.min(SCALE_MAX, Math.max(SCALE_MIN, numeric)) * 10) / 10;
  }

  function updateScaleButtons() {
    if (!runtime.pet) return;
    var smaller = runtime.pet.querySelector('[data-waifu-action="smaller"]');
    var larger = runtime.pet.querySelector('[data-waifu-action="larger"]');
    if (smaller) smaller.disabled = runtime.scale <= SCALE_MIN;
    if (larger) larger.disabled = runtime.scale >= SCALE_MAX;
    runtime.pet.dataset.scale = runtime.scale.toFixed(1);
  }

  function applyScale(value, announce) {
    if (!runtime.pet) return;
    var nextScale = normalizeScale(value);
    runtime.pet.style.setProperty("--waifu-scale", String(nextScale));
    var before = runtime.pet.getBoundingClientRect();
    var keepVisualBottom = Boolean(runtime.pet.style.top);
    if (before.width <= 0) {
      runtime.scale = nextScale;
      writeStore(SCALE_KEY, String(nextScale));
      updateScaleButtons();
      return;
    }

    runtime.pet.style.removeProperty("--waifu-user-width");
    var baseWidth = runtime.pet.getBoundingClientRect().width;
    runtime.pet.style.setProperty("--waifu-user-width", Math.round(baseWidth * nextScale) + "px");
    runtime.scale = nextScale;
    writeStore(SCALE_KEY, String(nextScale));

    if (keepVisualBottom) {
      var after = runtime.pet.getBoundingClientRect();
      runtime.pet.style.top = Math.round(before.bottom - after.height) + "px";
      runtime.pet.style.bottom = "auto";
    }

    updateScaleButtons();
    clampPetPosition();

    if (runtime.pet.style.top) {
      var rect = runtime.pet.getBoundingClientRect();
      writeStore(POSITION_KEY, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
    }
    if (announce) showTip("桌宠大小：" + Math.round(nextScale * 100) + "%", 2200);
  }

  function restoreScale() {
    var saved = Number(readStore(SCALE_KEY));
    if (Number.isFinite(saved) && saved > 0) {
      applyScale(saved, false);
      return;
    }
    runtime.scale = 1;
    runtime.pet.style.setProperty("--waifu-scale", "1");
    updateScaleButtons();
  }

  function randomText(list) {
    return list && list.length ? list[Math.floor(Math.random() * list.length)] : "";
  }

  function loadStyles() {
    if (runtime.styleReady) return runtime.styleReady;
    var existing = document.querySelector('link[data-waifu-style="v1"]');
    runtime.styleReady = new Promise(function (resolve) {
      if (existing && existing.sheet) {
        resolve();
        return;
      }
      var link = existing || document.createElement("link");
      link.addEventListener("load", resolve, { once: true });
      link.addEventListener("error", resolve, { once: true });
      if (existing) return;
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.dataset.waifuStyle = "v1";
      document.head.appendChild(link);
    });
    return runtime.styleReady;
  }

  function ensureToggle() {
    if (runtime.toggle) return runtime.toggle;
    var button = document.createElement("button");
    button.id = "waifu-toggle";
    button.type = "button";
    button.hidden = true;
    button.setAttribute("aria-label", "重新唤起桌宠");
    button.title = "重新唤起博丽灵梦";
    button.textContent = "⛩";
    button.addEventListener("click", function () {
      writeStore(DISPLAY_KEY, "visible");
      if (reducedQuery.matches) writeStore(MOTION_KEY, "enabled");
      mountPet(true);
    });
    document.body.appendChild(button);
    runtime.toggle = button;
    return button;
  }

  function showTip(text, duration) {
    if (!runtime.tips || !text) return;
    updateTipSide();
    runtime.tips.textContent = text;
    runtime.tips.classList.add("is-showing");
    window.clearTimeout(runtime.tipTimer);
    runtime.tipTimer = window.setTimeout(function () {
      if (runtime.tips) runtime.tips.classList.remove("is-showing");
    }, duration || 4200);
  }

  function loadTips() {
    if (window.location.protocol === "file:") {
      return Promise.resolve(fallbackTips);
    }
    return window.fetch(tipsUrl, {
      credentials: "same-origin",
      cache: "force-cache",
      headers: { "Accept": "application/json" },
    }).then(function (response) {
      if (!response.ok) throw new Error("tips " + response.status);
      return response.json();
    }).catch(function () {
      return fallbackTips;
    });
  }

  function registerTipEvents(config) {
    if (runtime.listenersReady) return;
    var hoverRules = (config.mouseover || []).filter(function (rule) {
      try { return Boolean(rule.selector && document.querySelector(rule.selector)); }
      catch (error) { return false; }
    });
    var clickRules = (config.click || []).filter(function (rule) {
      try { return Boolean(rule.selector && document.querySelector(rule.selector)); }
      catch (error) { return false; }
    });

    if (hoverRules.length) {
      document.addEventListener("mouseover", function (event) {
        if (!(event.target instanceof Element)) return;
        for (var i = 0; i < hoverRules.length; i++) {
          var matched = event.target.closest(hoverRules[i].selector);
          if (!matched || matched === runtime.lastHover) continue;
          runtime.lastHover = matched;
          showTip(randomText(hoverRules[i].text), 3200);
          return;
        }
      }, { passive: true });
      document.addEventListener("mouseout", function (event) {
        if (!runtime.lastHover || runtime.lastHover.contains(event.relatedTarget)) return;
        runtime.lastHover = null;
      }, { passive: true });
    }

    if (clickRules.length) {
      document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) return;
        for (var i = 0; i < clickRules.length; i++) {
          if (!event.target.closest(clickRules[i].selector)) continue;
          showTip(randomText(clickRules[i].text), 3500);
          return;
        }
      });
    }

    runtime.listenersReady = true;
  }

  function updateTipSide() {
    if (!runtime.pet || runtime.pet.hidden) return;
    var rect = runtime.pet.getBoundingClientRect();
    if (rect.width <= 0) return;
    var isOnRight = rect.left + rect.width / 2 > window.innerWidth / 2;
    runtime.pet.classList.toggle("is-tip-left", isOnRight);
  }

  function clampPetPosition() {
    if (!runtime.pet || runtime.pet.hidden) return;
    var rect = runtime.pet.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    var x = Math.min(Math.max(rect.left, 0), Math.max(0, window.innerWidth - rect.width));
    var y = Math.min(Math.max(rect.top, 56), Math.max(56, window.innerHeight - rect.height));
    if (Math.abs(x - rect.left) > 0.5 || Math.abs(y - rect.top) > 0.5) {
      runtime.pet.style.left = x + "px";
      runtime.pet.style.top = y + "px";
      runtime.pet.style.bottom = "auto";
    }
    updateTipSide();
  }

  function restorePetPosition() {
    var saved = parseStore(POSITION_KEY);
    if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.y) || !runtime.pet) return;
    runtime.pet.style.left = saved.x + "px";
    runtime.pet.style.top = saved.y + "px";
    runtime.pet.style.bottom = "auto";
    window.requestAnimationFrame(clampPetPosition);
  }

  function installDrag(handle) {
    var drag = null;

    handle.addEventListener("pointerdown", function (event) {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      var rect = runtime.pet.getBoundingClientRect();
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top,
      };
      runtime.dragMoved = false;
      handle.setPointerCapture(event.pointerId);
      runtime.pet.classList.add("is-dragging");
    });

    handle.addEventListener("pointermove", function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.startX;
      var dy = event.clientY - drag.startY;
      if (!runtime.dragMoved && Math.hypot(dx, dy) < 5) return;
      runtime.dragMoved = true;
      event.preventDefault();
      var rect = runtime.pet.getBoundingClientRect();
      var x = Math.min(Math.max(drag.left + dx, 0), Math.max(0, window.innerWidth - rect.width));
      var y = Math.min(Math.max(drag.top + dy, 56), Math.max(56, window.innerHeight - rect.height));
      runtime.pet.style.left = x + "px";
      runtime.pet.style.top = y + "px";
      runtime.pet.style.bottom = "auto";
      updateTipSide();
    });

    function finishDrag(event) {
      if (!drag || drag.id !== event.pointerId) return;
      try { handle.releasePointerCapture(event.pointerId); } catch (error) {}
      runtime.pet.classList.remove("is-dragging");
      if (runtime.dragMoved) {
        var rect = runtime.pet.getBoundingClientRect();
        writeStore(POSITION_KEY, JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
      }
      updateTipSide();
      drag = null;
    }

    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);
  }

  function hidePet() {
    if (!runtime.pet) return;
    runtime.pet.hidden = true;
    runtime.toggle.hidden = false;
    writeStore(DISPLAY_KEY, "hidden");
  }

  function buildPet() {
    if (runtime.pet) return runtime.pet;
    var pet = document.createElement("section");
    pet.id = "waifu";
    pet.className = "is-loading";
    pet.setAttribute("aria-label", "博丽灵梦静态桌宠");
    pet.innerHTML =
      '<div id="waifu-tips" role="status" aria-live="polite"></div>' +
      '<button class="waifu-character" type="button" aria-label="博丽灵梦桌宠，可拖动">' +
        '<img alt="博丽灵梦静态桌宠" width="1500" height="2500" draggable="false" decoding="async">' +
      '</button>' +
      '<div id="waifu-tool" role="toolbar" aria-label="桌宠工具">' +
        '<button type="button" data-waifu-action="smaller" aria-label="缩小桌宠" title="缩小桌宠">−</button>' +
        '<button type="button" data-waifu-action="larger" aria-label="放大桌宠" title="放大桌宠">+</button>' +
        '<button type="button" data-waifu-action="talk" aria-label="让桌宠说句话" title="说句话">文</button>' +
        '<button type="button" data-waifu-action="info" aria-label="查看桌宠说明" title="桌宠说明">i</button>' +
        '<button type="button" data-waifu-action="close" aria-label="关闭桌宠" title="关闭桌宠">×</button>' +
      '</div>';
    document.body.appendChild(pet);
    runtime.pet = pet;
    runtime.tips = pet.querySelector("#waifu-tips");

    var character = pet.querySelector(".waifu-character");
    var image = character.querySelector("img");
    image.addEventListener("load", function () {
      pet.classList.remove("is-loading");
      pet.classList.add("is-ready");
      restorePetPosition();
      restoreScale();
      window.requestAnimationFrame(updateTipSide);
    }, { once: true });
    image.addEventListener("error", function () {
      pet.remove();
      runtime.pet = null;
      runtime.tips = null;
      runtime.toggle.hidden = false;
      runtime.toggle.dataset.status = "asset-error";
    }, { once: true });
    image.src = modelUrl;

    character.addEventListener("click", function () {
      if (runtime.dragMoved) {
        runtime.dragMoved = false;
        return;
      }
      showTip(randomText((runtime.tipConfig || fallbackTips).character), 3600);
    });
    pet.querySelector('[data-waifu-action="talk"]').addEventListener("click", function () {
      showTip(randomText((runtime.tipConfig || fallbackTips).idle), 4200);
    });
    pet.querySelector('[data-waifu-action="smaller"]').addEventListener("click", function () {
      applyScale(runtime.scale - SCALE_STEP, true);
    });
    pet.querySelector('[data-waifu-action="larger"]').addEventListener("click", function () {
      applyScale(runtime.scale + SCALE_STEP, true);
    });
    pet.querySelector('[data-waifu-action="info"]').addEventListener("click", function () {
      showTip("这是本地 PNG 静态桌宠，不是 Live2D 模型；可拖动、缩放、关闭并重新唤起。", 6200);
    });
    pet.querySelector('[data-waifu-action="close"]').addEventListener("click", hidePet);

    installDrag(character);
    window.addEventListener("resize", function () {
      if (narrowQuery.matches && runtime.pet && !runtime.pet.classList.contains("is-mobile-open")) {
        runtime.toggle.hidden = false;
      }
      if (runtime.pet) applyScale(runtime.scale, false);
    }, { passive: true });
    return pet;
  }

  function mountPet(manual) {
    ensureToggle();
    if (narrowQuery.matches && !manual) {
      runtime.toggle.hidden = false;
      return;
    }

    var pet = buildPet();
    if (narrowQuery.matches && manual) {
      pet.classList.add("is-mobile-open");
      window.requestAnimationFrame(function () { applyScale(runtime.scale, false); });
    }
    pet.hidden = false;
    runtime.toggle.hidden = true;
    runtime.mounted = true;
    window.requestAnimationFrame(updateTipSide);

    loadTips().then(function (config) {
      runtime.tipConfig = config || fallbackTips;
      registerTipEvents(runtime.tipConfig);
      showTip(manual ? "欢迎回来，结界已经重新展开。" : "欢迎参拜。需要时可以拖动我。", 4300);
    });
  }

  function start() {
    loadStyles().then(function () {
      ensureToggle();

      if (readStore(DISPLAY_KEY) === "hidden") {
        runtime.toggle.hidden = false;
        return;
      }
      if (reducedQuery.matches && readStore(MOTION_KEY) !== "enabled") {
        runtime.toggle.hidden = false;
        runtime.toggle.title = "已尊重减少动态偏好；点击可手动启用桌宠";
        return;
      }

      var homeHero = document.querySelector(".hero");
      if (homeHero && window.scrollY < Math.min(homeHero.offsetHeight * 0.7, window.innerHeight * 0.72)) {
        runtime.toggle.hidden = false;
        var revealAfterHero = function () {
          if (readStore(DISPLAY_KEY) === "hidden") {
            window.removeEventListener("scroll", revealAfterHero);
            return;
          }
          if (window.scrollY < Math.min(homeHero.offsetHeight * 0.7, window.innerHeight * 0.72)) return;
          window.removeEventListener("scroll", revealAfterHero);
          mountPet(false);
        };
        window.addEventListener("scroll", revealAfterHero, { passive: true });
        return;
      }

      var load = function () { mountPet(false); };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(load, { timeout: 1800 });
      } else {
        window.setTimeout(load, 900);
      }
    });
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
