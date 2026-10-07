/* Shared lifecycle for decorative Canvas effects. No frame is queued while hidden/reduced. */
(function () {
  "use strict";
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  window.SiteMotion = {
    query,
    get reduced() { return query.matches; },
    createLoop(draw, clear) {
      let frame = 0, last = 0;
      const allowed = () => !query.matches && !document.hidden;
      function tick(now) {
        frame = 0;
        if (!allowed()) return;
        const interval = matchMedia("(max-width: 640px)").matches ? 1000 / 30 : 1000 / 60;
        if (!last || now - last >= interval - 0.5) {
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
          last = now;
          draw(now, dt);
        }
        frame = requestAnimationFrame(tick);
      }
      function sync() {
        cancelAnimationFrame(frame); frame = 0; last = 0;
        if (allowed()) frame = requestAnimationFrame(tick);
        else clear();
      }
      query.addEventListener("change", sync);
      document.addEventListener("visibilitychange", sync);
      sync();
    },
  };
})();
