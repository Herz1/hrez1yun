/* Local reading shelf and linkable archive filters. No network or external dependency. */
(() => {
  'use strict';
  if (typeof POSTS === 'undefined' || !Array.isArray(POSTS)) return;
  const flavor = document.currentScript?.dataset.library || 'mochi';
  const isMochi = flavor === 'mochi';
  const root = document.body.dataset.root || '';
  const key = `${flavor}-reading-list`;
  const label = isMochi ? '稍后读' : '藏书签';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const knownIds = new Set(POSTS.map(p => p.id));
  const load = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string' && knownIds.has(id)) : []);
    } catch { return new Set(); }
  };
  let saved = load();
  let persisted = true;
  const store = () => {
    try { localStorage.setItem(key, JSON.stringify([...saved])); persisted = true; }
    catch { persisted = false; }
  };
  document.documentElement.dataset.readingTheme = flavor;
  const note = document.createElement('div');
  note.className = 'reading-notice'; note.setAttribute('role', 'status');
  document.body.append(note);
  let noteTimer;
  const notify = text => {
    note.textContent = text; note.classList.add('visible');
    clearTimeout(noteTimer); noteTimer = setTimeout(() => note.classList.remove('visible'), 4000);
  };
  const button = (p, extra = '') => `<button type="button" class="reading-save ${extra}" data-save="${esc(p.id)}" aria-pressed="${saved.has(p.id)}" aria-label="${saved.has(p.id) ? '移出' : '加入'}${label}：${esc(p.title)}"><span aria-hidden="true">${saved.has(p.id) ? '◆' : '◇'}</span> ${saved.has(p.id) ? '已收藏' : label}</button>`;
  const archive = document.getElementById(isMochi ? 'arc-list' : 'archive-timeline');
  const chips = document.getElementById(isMochi ? 'arc-tabs' : 'archive-filters');
  const catLabel = p => p.catName || p.cat;
  const months = [...new Set(POSTS.map(p => p.date.slice(0, 7)))].sort().reverse();
  const tags = [...new Set(POSTS.flatMap(p => p.tags))];
  const categories = [...new Set(POSTS.map(p => p.cat))];
  const readState = () => {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash.startsWith('cat-') ? `cat=${hash.slice(4)}` : hash);
    return {
      q: (params.get('q') || '').slice(0, 180),
      cat: categories.includes(params.get('cat')) ? params.get('cat') : '',
      tag: tags.includes(params.get('tag')) ? params.get('tag') : '',
      month: months.includes(params.get('month')) ? params.get('month') : '',
      saved: params.get('saved') === '1',
      sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest'
    };
  };
  let state = readState();
  let panel;
  const writeState = replace => {
    const params = new URLSearchParams();
    for (const name of ['q', 'cat', 'tag', 'month']) if (state[name]) params.set(name, state[name]);
    if (state.saved) params.set('saved', '1');
    if (state.sort === 'oldest') params.set('sort', state.sort);
    const hash = params.toString();
    const url = location.pathname + location.search + (hash ? '#' + hash : '');
    try { history[replace ? 'replaceState' : 'pushState'](null, '', url); }
    catch { location.hash = hash; }
  };
  const reset = () => {
    state = {q:'', cat:'', tag:'', month:'', saved:false, sort:'newest'};
    writeState(false); render();
    document.getElementById('reading-query')?.focus();
  };
  function render() {
    if (!archive || !panel) return;
    const query = state.q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const hits = POSTS.filter(p => {
      const words = `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${catLabel(p)}`.toLocaleLowerCase();
      return (!state.cat || p.cat === state.cat) && (!state.tag || p.tags.includes(state.tag)) &&
        (!state.month || p.date.startsWith(state.month)) && (!state.saved || saved.has(p.id)) &&
        query.every(q => words.includes(q));
    }).sort((a, b) => state.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    for (const field of ['q', 'month', 'sort']) {
      const el = panel.querySelector(`[data-filter="${field}"]`);
      if (el && el.value !== state[field]) el.value = state[field];
    }
    const savedToggle = panel.querySelector('[data-saved-filter]');
    savedToggle.setAttribute('aria-pressed', state.saved);
    savedToggle.textContent = `${label} · ${saved.size}`;
    const active = [state.cat && (POSTS.find(p => p.cat === state.cat)?.catName || state.cat), state.tag, state.month].filter(Boolean);
    panel.querySelector('[data-result-count]').textContent = `找到 ${hits.length} / ${POSTS.length} 篇${active.length ? ' · ' + active.join(' / ') : ''}`;
    if (chips) {
      const field = isMochi ? 'cat' : 'tag';
      [...chips.querySelectorAll('[data-chip]')].forEach(el => {
        const selected = el.dataset.chip === state[field];
        el.classList.toggle(isMochi ? 'on' : 'f-on', selected);
        el.setAttribute('aria-pressed', selected);
      });
    }
    const groups = new Map();
    hits.forEach(p => { const year = p.date.slice(0, 4); if (!groups.has(year)) groups.set(year, []); groups.get(year).push(p); });
    archive.innerHTML = [...groups].map(([year, posts]) => `<section class="reading-year"><h2>${year}<small>${posts.length} 篇</small></h2><ol>${posts.map(p => `<li class="reading-row"><time datetime="${esc(p.date)}">${esc(p.date.slice(5).replace('-', ' / '))}</time><div class="reading-entry"><a href="${root}${esc(p.url)}">${esc(p.title)}</a><p>${esc(catLabel(p))} · ${p.mins} 分钟 · ${p.tags.map(esc).join(' / ')}</p></div>${button(p)}</li>`).join('')}</ol></section>`).join('') || `<div class="reading-empty"><b>${state.saved ? '书签里还没有匹配的记事' : '这次没有找到匹配的记事'}</b><p>试试其他关键词，或清除筛选，继续慢慢翻。</p><button type="button" data-reset>清除全部筛选</button></div>`;
    const total = document.getElementById('arc-total'); if (total) total.textContent = POSTS.length;
  }
  if (archive) {
    panel = document.createElement('section');
    panel.className = 'reading-room'; panel.setAttribute('aria-label', '文章检索与阅读清单');
    panel.innerHTML = `<div class="reading-room-heading"><div><span>${isMochi ? 'USAGIYAMA READING ROOM' : 'GENSOKYO LIBRARY'}</span><h2>${isMochi ? '给下一次的自己，留一页书签' : '记事入卷，喜欢的留一枚签'}</h2></div><button type="button" data-saved-filter aria-pressed="false">${label}</button></div><div class="reading-controls"><label class="reading-query">关键词<input id="reading-query" data-filter="q" type="search" maxlength="180" placeholder="标题、标签、摘要…" autocomplete="off"></label><label>月份<select data-filter="month"><option value="">全部月份</option>${months.map(m => `<option value="${m}">${m.replace('-', ' 年 ')} 月</option>`).join('')}</select></label><label>顺序<select data-filter="sort"><option value="newest">由新到旧</option><option value="oldest">由旧到新</option></select></label></div><div class="reading-meta"><p data-result-count role="status" aria-live="polite"></p><button type="button" data-reset>清除筛选</button></div><p class="reading-privacy">收藏保存在当前浏览器。筛选链接可以直接复制、收藏或分享。</p>`;
    (chips || archive).before(panel);
    if (chips) {
      const items = isMochi ? categories.map(cat => [cat, POSTS.find(p => p.cat === cat)?.catName || cat]) : tags.map(tag => [tag, tag]);
      const cls = isMochi ? 'arc-tab' : 'ofuda';
      chips.innerHTML = [['', '全部'], ...items].map(([value, title]) => `<button type="button" class="${cls}" data-chip="${esc(value)}" aria-pressed="false">${esc(title)}</button>`).join('');
      chips.addEventListener('click', e => { const el = e.target.closest('[data-chip]'); if (!el) return; state[isMochi ? 'cat' : 'tag'] = el.dataset.chip; writeState(false); render(); });
    }
    panel.addEventListener('input', e => { if (e.target.dataset.filter !== 'q') return; state.q = e.target.value; writeState(true); render(); });
    panel.addEventListener('change', e => { const f = e.target.dataset.filter; if (f !== 'month' && f !== 'sort') return; state[f] = e.target.value; writeState(false); render(); });
    panel.addEventListener('click', e => { if (!e.target.closest('[data-saved-filter]')) return; state.saved = !state.saved; writeState(false); render(); });
    const navigate = () => { state = readState(); render(); };
    addEventListener('popstate', navigate); addEventListener('hashchange', navigate);
    render();
  }
  const current = POSTS.find(p => document.body.dataset.post === p.id || new URL(p.url, location.href).pathname === location.pathname);
  if (current) {
    const article = document.querySelector(isMochi ? '.post-body' : '.article-content');
    if (article) {
      const bar = document.createElement('div'); bar.className = 'reading-article-bar';
      bar.innerHTML = `<span>${isMochi ? '这一页，留到下次慢慢读。' : '喜欢这篇记事？留一枚藏书签。'}</span>${button(current)}<a href="${root}archive.html#saved=1">查看我的${label}</a>`;
      article.prepend(bar);
    }
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.reading-room [data-reset], .reading-empty [data-reset]')) return reset();
    const el = e.target.closest('[data-save]'); if (!el || !knownIds.has(el.dataset.save)) return;
    const id = el.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id); store();
    const wasFocused = document.activeElement === el;
    render();
    document.querySelectorAll('[data-save]').forEach(btn => {
      if (btn.dataset.save !== id) return;
      const p = POSTS.find(post => post.id === id); const selected = saved.has(id);
      btn.setAttribute('aria-pressed', selected); btn.setAttribute('aria-label', `${selected ? '移出' : '加入'}${label}：${p.title}`);
      btn.innerHTML = `<span aria-hidden="true">${selected ? '◆' : '◇'}</span> ${selected ? '已收藏' : label}`;
    });
    if (wasFocused && !el.isConnected) {
      const replacement = [...document.querySelectorAll('[data-save]')].find(btn => btn.dataset.save === id);
      (replacement || panel?.querySelector('[data-saved-filter]'))?.focus();
    }
    notify(persisted ? (saved.has(id) ? `已加入${label}` : `已移出${label}`) : '本页已暂存；浏览器未允许保存，关闭页面后会清除。');
  });
  addEventListener('storage', e => {
    if (e.key !== key && e.key !== null) return;
    saved = load(); render();
    document.querySelectorAll('.reading-article-bar [data-save]').forEach(btn => {
      const p = POSTS.find(post => post.id === btn.dataset.save); if (p) btn.outerHTML = button(p);
    });
  });
})();
