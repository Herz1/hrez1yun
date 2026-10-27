const {JSDOM, ResourceLoader, VirtualConsole} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
async function load(name, page = 'archive.html', options = {}) {
  const base = root;
  const prefix = name === 'hrez1yun' ? '/hrez1yun/' : '/';
  const errors = [];
  class LocalResources extends ResourceLoader {
    fetch(url) {
      const parsed = new URL(url);
      if (parsed.hostname !== 'herz1.github.io') return null;
      const relative = decodeURIComponent(parsed.pathname.slice(prefix.length));
      const file = path.join(base, relative);
      return fs.existsSync(file) && fs.statSync(file).isFile() ? Promise.resolve(fs.readFileSync(file)) : null;
    }
  }
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(base, page), 'utf8'), {
    url: `https://herz1.github.io${prefix}${page}${options.hash || ''}`,
    runScripts: 'dangerously', resources: new LocalResources(), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.matchMedia = q => ({matches: q.includes('reduced-motion'), addEventListener(){}, removeEventListener(){}});
      w.IntersectionObserver = class {observe(){} unobserve(){} disconnect(){}};
      w.requestAnimationFrame = () => 1; w.cancelAnimationFrame = () => {};
      w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = () => {};
      w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get: (_, key) => key === 'canvas' ? {} : () => {}});
      for (const [key, value] of Object.entries(options.storage || {})) w.localStorage.setItem(key, value);
      if (options.denied) for (const field of ['localStorage', 'sessionStorage']) Object.defineProperty(w, field, {get(){throw new w.DOMException('Disabled', 'SecurityError');}});
    }
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve, {once:true}));
  await new Promise(resolve => setTimeout(resolve, 10));
  return {dom, w:dom.window, d:dom.window.document, errors};
}
const key = (w, el, value, extra = {}) => el.dispatchEvent(new w.KeyboardEvent('keydown', {key:value, bubbles:true, cancelable:true, ...extra}));
const tick = () => new Promise(resolve => setTimeout(resolve, 15));

(async () => {
  let assertions = 0;
  for (const [name, flavor, count] of [['hrez1yun', 'gensokyo', 8]]) {
    const {dom,w,d,errors} = await load(name);
    try {
      assert.equal(d.querySelectorAll('.reading-row').length, count); assertions++;
      const first = d.querySelector('[data-save]'); const firstId = first.dataset.save;
      first.focus(); first.click();
      assert.equal(JSON.parse(w.localStorage.getItem(`${flavor}-reading-list`))[0], firstId); assertions++;
      assert.equal(d.activeElement.dataset.save, firstId); assertions++;
      d.querySelector('[data-saved-filter]').click();
      assert.equal(d.querySelectorAll('.reading-row').length, 1); assertions++;
      assert.match(w.location.hash, /saved=1/); assertions++;
      d.querySelector('[data-save]').focus(); d.querySelector('[data-save]').click();
      assert.equal(d.querySelectorAll('.reading-row').length, 0); assertions++;
      assert.ok(d.activeElement.hasAttribute('data-saved-filter')); assertions++;
      d.querySelector('[data-reset]').click();
      assert.equal(d.querySelectorAll('.reading-row').length, count); assertions++;
      const q = d.querySelector('#reading-query'); q.value = '不存在的文章'; q.dispatchEvent(new w.Event('input', {bubbles:true}));
      assert.equal(d.querySelectorAll('.reading-row').length, 0); assertions++;
      d.querySelector('.reading-empty [data-reset]').click();
      assert.equal(d.querySelectorAll('.reading-row').length, count); assertions++;
      w.location.hash = flavor === 'mochi' ? '#tag=SVG' : '#tag=STG'; await tick();
      assert.equal(d.querySelectorAll('.reading-row').length, flavor === 'mochi' ? 1 : 2); assertions++;
      w.location.hash = '#q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E'; await tick();
      assert.equal(d.querySelectorAll('.reading-row').length, 0); assert.equal(d.querySelector('.reading-room img'), null); assertions += 2;
      const trigger = d.querySelector(flavor === 'mochi' ? '#search-btn' : '[data-search-open]'); trigger.focus(); trigger.click();
      const input = d.querySelector('#search-input'); const modal = d.querySelector(flavor === 'mochi' ? '#search-mask' : '#search-modal');
      assert.equal(d.activeElement, input); assert.equal(modal.getAttribute('aria-hidden'), 'false'); assertions += 2;
      assert.equal(d.querySelectorAll('#search-results a').length, count); assertions++;
      key(w,input,'ArrowDown'); assert.equal(d.activeElement,d.querySelector('#search-results a')); assertions++;
      const last = [...d.querySelectorAll('#search-results a')].at(-1); last.focus(); key(w,last,'Tab'); assert.equal(d.activeElement,input); assertions++;
      key(w,input,'Tab',{shiftKey:true}); assert.equal(d.activeElement,last); assertions++;
      key(w,last,'Escape'); assert.equal(d.activeElement,trigger); assert.equal(modal.getAttribute('aria-hidden'),'true'); assertions += 2;
      assert.deepEqual(errors, []); assertions++;
      console.log(`PASS ${name}: archive, reading shelf, malformed query, keyboard modal, focus restoration`);
    } finally { dom.window.close(); }
    const broken = await load(name, 'archive.html', {storage:{[`${flavor}-reading-list`]:'{bad json', 'mochi-read':'{}', theme:flavor==='mochi'?'night':'dark'}});
    try {
      assert.equal(broken.d.querySelectorAll('.reading-row').length,count); assertions++;
      assert.equal(broken.d.documentElement.dataset.theme, flavor==='mochi'?'light':'day'); assertions++;
      assert.deepEqual(broken.errors,[]); assertions++;
      console.log(`PASS ${name}: malformed saved data and cross-blog legacy theme`);
    } finally {broken.dom.window.close();}
    const denied = await load(name, 'archive.html', {denied:true});
    try {
      denied.d.querySelector('[data-save]').click();
      assert.equal(denied.d.querySelector('[data-save]').getAttribute('aria-pressed'),'true'); assertions++;
      assert.match(denied.d.querySelector('.reading-notice').textContent,/未允许保存/); assertions++;
      assert.deepEqual(denied.errors,[]); assertions++;
      console.log(`PASS ${name}: disabled storage degrades to in-page shelf`);
    } finally {denied.dom.window.close();}
    const article = await load(name, flavor === 'mochi' ? 'posts/hello-usagiyama.html' : 'post.html');
    try {
      assert.ok(article.d.querySelector('.reading-article-bar [data-save]')); assertions++;
      assert.ok(article.d.querySelector('.reading-article-bar a').href.endsWith('/archive.html#saved=1')); assertions++;
      assert.deepEqual(article.errors,[]); assertions++;
      console.log(`PASS ${name}: article bookmark and relative archive path`);
    } finally {article.dom.window.close();}
  }
  console.log(`PASS ${assertions} behavior assertions`);
})().catch(e => {console.error(e); process.exitCode=1;});
