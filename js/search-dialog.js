/* Accessible local search, following the WAI-ARIA modal-dialog keyboard pattern. */
(() => {
  'use strict';
  if (typeof POSTS === 'undefined' || !Array.isArray(POSTS)) return;
  const isMochi = document.currentScript?.dataset.library === 'mochi';
  const modal = document.getElementById(isMochi ? 'search-mask' : 'search-modal');
  const input = document.getElementById('search-input');
  const list = document.getElementById('search-results');
  if (!modal || !input || !list) return;
  const root = document.body.dataset.root || '';
  modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-hidden', 'true');
  input.setAttribute('aria-label', '搜索文章标题、标签和摘要');
  input.setAttribute('aria-controls', 'search-results');
  if (!modal.querySelector('.search-close')) {
    const close = document.createElement('button'); close.className = 'search-close';
    close.type = 'button'; close.textContent = 'Esc'; close.setAttribute('aria-label', '关闭搜索');
    modal.querySelector('kbd')?.replaceWith(close);
  }
  const count = document.createElement('p'); count.className = 'search-count';
  count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite'); list.before(count);
  const help = modal.querySelector('.search-foot');
  if (help) help.textContent = '↑ ↓ 选择 · Enter 打开 · Tab 切换 · Esc 关闭';
  let opener = null, previousOverflow = '', inertNodes = [];
  const isOpen = () => modal.classList.contains('open');
  function render() {
    const q = input.value.trim().toLocaleLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    const hits = POSTS.filter(p => {
      const text = `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${p.catName || p.cat}`.toLocaleLowerCase();
      return words.every(word => text.includes(word));
    });
    count.textContent = q ? `找到 ${hits.length} 篇文章` : `全部 ${hits.length} 篇文章`;
    list.replaceChildren();
    if (!hits.length) {
      const empty = document.createElement('p'); empty.className = isMochi ? 'empty' : 's-empty';
      empty.textContent = '没有找到匹配的文章，换个关键词试试。'; list.append(empty); return;
    }
    hits.forEach(p => {
      const link = document.createElement('a'); link.className = isMochi ? 'sr' : 's-item'; link.href = root + p.url;
      const title = document.createElement('b'); title.textContent = p.title;
      const detail = document.createElement(isMochi ? 'span' : 'small');
      detail.textContent = `${p.date} · ${p.catName || p.cat} · ${p.excerpt}`;
      link.append(title, detail); list.append(link);
    });
  }
  function open() {
    if (isOpen()) { input.focus(); return; }
    opener = document.activeElement; previousOverflow = document.body.style.overflow;
    inertNodes = [...document.body.children].filter(node => node !== modal && node instanceof HTMLElement && !['SCRIPT', 'STYLE', 'LINK'].includes(node.tagName)).map(node => [node, node.inert]);
    inertNodes.forEach(([node]) => { node.inert = true; });
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; input.value = ''; render(); input.focus();
  }
  function close() {
    if (!isOpen()) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    inertNodes.forEach(([node, inert]) => { node.inert = inert; }); inertNodes = [];
    if (opener?.isConnected && typeof opener.focus === 'function') opener.focus();
  }
  document.querySelectorAll(isMochi ? '#search-btn' : '[data-search-open]').forEach(btn => btn.addEventListener('click', open));
  input.addEventListener('input', render);
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.search-close')) close(); });
  document.addEventListener('focusin', e => { if (isOpen() && !modal.contains(e.target)) input.focus(); });
  document.addEventListener('keydown', e => {
    if (e.isComposing) return;
    const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (!isMochi && !typing && !e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 's')) {
      e.preventDefault(); isOpen() ? close() : open(); return;
    }
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const items = [...modal.querySelectorAll('input, button, a[href]')].filter(el => !el.disabled && el.tabIndex >= 0);
      const first = items[0], last = items[items.length - 1];
      if ((e.shiftKey && document.activeElement === first) || (!e.shiftKey && document.activeElement === last) || !modal.contains(document.activeElement)) {
        e.preventDefault(); (e.shiftKey ? last : first)?.focus();
      }
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const links = [...list.querySelectorAll('a')]; if (!links.length) return;
      e.preventDefault(); let index = links.indexOf(document.activeElement);
      index = e.key === 'ArrowDown' ? (index + 1) % links.length : (index <= 0 ? links.length - 1 : index - 1);
      links.forEach((link, i) => link.classList.toggle('sel', i === index));
      links[index].focus(); links[index].scrollIntoView?.({block: 'nearest'});
    }
    if (e.key === 'Enter' && e.target === input) { e.preventDefault(); list.querySelector('a')?.click(); }
  });
})();
