/* 公開サイト（GitHub Pages用）の生成。公開メモだけを、プログラムなしでも読める静的HTMLにする */
const PublicSite = (() => {
  const CSS = "/* Layout: 公開用の一冊。中央の一列に索引（検索・カテゴリ・タグ）とメモを綴じる */\n:root {\n  --paper: #F2F4F8; --sheet: #FFFFFF; --ink: #18203A; --muted: #586278; --faint: #7D879B; --rule: #D8DDE7;\n  --dot: rgba(36, 67, 201, .11); --accent: #2443C9; --on-accent: #FFFFFF; --accent-soft: #E6EBFB;\n  --marker: #FCE68C; --marker-ink: #4B3C00; --done: #2B7449; --done-soft: #E1F1E7;\n  --shadow: 0 1px 2px rgba(24, 32, 58, .05), 0 6px 20px rgba(24, 32, 58, .06);\n  --font-display: \"Zen Kaku Gothic New\", \"Hiragino Kaku Gothic ProN\", \"Hiragino Sans\", \"Yu Gothic UI\", \"Meiryo\", sans-serif;\n  --font-body: \"Zen Kaku Gothic New\", \"Hiragino Kaku Gothic ProN\", \"Hiragino Sans\", \"Yu Gothic UI\", \"Meiryo\", sans-serif;\n  --font-mono: \"IBM Plex Mono\", ui-monospace, \"SFMono-Regular\", Menlo, Consolas, monospace;\n  color-scheme: light;\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    --paper: #10141D; --sheet: #171C27; --ink: #E5E9F2; --muted: #A3ACBF; --faint: #7A8499; --rule: #2A3243;\n    --dot: rgba(142, 162, 255, .08); --accent: #8EA2FF; --on-accent: #0E1430; --accent-soft: #1F2849;\n    --marker: #4D4215; --marker-ink: #FBE38A; --done: #6CCB93; --done-soft: #16301F; --shadow: 0 1px 2px rgba(0, 0, 0, .35);\n    color-scheme: dark;\n  }\n}\n*, *::before, *::after { box-sizing: border-box; }\n[hidden] { display: none !important; }\nhtml { -webkit-text-size-adjust: 100%; }\nbody {\n  margin: 0; background-color: var(--paper); background-image: radial-gradient(var(--dot) 1px, transparent 1.4px); background-size: 22px 22px;\n  color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.8; -webkit-font-smoothing: antialiased;\n}\na { color: var(--accent); text-underline-offset: 2px; }\n:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }\n.wrap { max-width: 800px; margin-inline: auto; padding-inline: 16px; padding-block: 48px 72px; }\n.masthead { display: grid; gap: 6px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--rule); }\n.masthead h1 { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: clamp(26px, 5vw, 34px); line-height: 1.3; letter-spacing: .02em; text-wrap: balance; }\n.masthead p { margin: 0; color: var(--muted); font-size: 15px; }\n.stats { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: 13px; color: var(--faint); }\n.tools { display: grid; gap: 12px; margin-bottom: 20px; }\n.search { position: relative; }\n.search input {\n  width: 100%; font: inherit; font-size: 16px; color: var(--ink); background: var(--sheet);\n  border: 1px solid var(--rule); border-radius: 999px; padding: 10px 16px 10px 40px;\n}\n.search input:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: transparent; }\n.search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--faint); pointer-events: none; }\n.facet { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }\n.facet-label { font-size: 12px; font-weight: 700; letter-spacing: .14em; color: var(--faint); margin-right: 4px; }\n.chip {\n  font: inherit; font-size: 13px; color: var(--ink); background: var(--sheet); border: 1px solid var(--rule);\n  border-radius: 999px; padding: 2px 12px; cursor: pointer; line-height: 1.8;\n}\n.chip:hover { border-color: var(--accent); }\n.chip[aria-pressed=\"true\"] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }\n.result { margin: 0 0 12px; font-size: 14px; color: var(--muted); }\n.list { display: grid; gap: 12px; }\n.memo { background: var(--sheet); border: 1px solid var(--rule); border-radius: 10px; padding: 18px 22px 14px; box-shadow: var(--shadow); min-width: 0; scroll-margin-top: 16px; }\n.memo:target { outline: 2px solid var(--accent); outline-offset: 2px; }\n.memo-head { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 6px 12px; }\n.memo h2 { margin: 0; flex: 1 1 14em; min-width: 0; font-family: var(--font-display); font-size: 18px; line-height: 1.55; overflow-wrap: anywhere; text-wrap: pretty; }\n.memo h2 a { color: inherit; text-decoration: none; }\n.memo h2 a:hover { text-decoration: underline; }\n.memo.is-done h2 { color: var(--muted); text-decoration: line-through; text-decoration-color: var(--faint); }\n.kind { flex: none; font-size: 12px; font-weight: 700; letter-spacing: .08em; padding: 1px 8px; border-radius: 4px; margin-top: 4px; margin-left: auto; white-space: nowrap; }\n.kind-idea { color: var(--marker-ink); background: linear-gradient(transparent 38%, var(--marker) 38%); padding-inline: 4px; border-radius: 0; }\n.kind-todo { color: var(--accent); border: 1px solid var(--accent); }\n.kind-done { color: var(--done); border: 1px solid var(--done); background: var(--done-soft); }\n.memo-body { margin: 8px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }\n.memo-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--rule); font-size: 12px; color: var(--muted); }\n.meta-cat { border: 1px solid var(--rule); background: var(--paper); border-radius: 999px; padding: 0 10px; color: var(--ink); }\n.meta-tag { border: 1px solid var(--rule); border-radius: 999px; padding: 0 10px; }\n.memo-meta time { margin-left: auto; font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--faint); white-space: nowrap; }\n.empty { text-align: center; padding: 40px 20px; border: 1px dashed var(--faint); border-radius: 10px; color: var(--muted); background: var(--sheet); }\n.foot { margin-top: 40px; color: var(--faint); font-size: 12px; }\n@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }\n";
  const RUNTIME = "(function () {\n  'use strict';\n  var q = document.getElementById('q');\n  var list = document.getElementById('list');\n  if (!q || !list) return;\n  var arts = Array.prototype.slice.call(list.querySelectorAll('.memo'));\n  var norm = function (s) { return String(s || '').normalize('NFKC').toLowerCase(); };\n  var texts = arts.map(function (a) { return norm(a.textContent); });\n  var tagsOf = arts.map(function (a) { try { return JSON.parse(a.getAttribute('data-tags') || '[]'); } catch (e) { return []; } });\n  var result = document.getElementById('result');\n  var empty = document.getElementById('empty');\n  var cat = null;\n  var tag = null;\n\n  function apply() {\n    var ts = norm(q.value).split(/\\s+/).filter(Boolean);\n    var shown = 0;\n    arts.forEach(function (a, i) {\n      var ok = (!cat || a.getAttribute('data-cat') === cat) &&\n        (!tag || tagsOf[i].indexOf(tag) >= 0) &&\n        ts.every(function (t) { return texts[i].indexOf(t) >= 0; });\n      a.hidden = !ok;\n      if (ok) shown++;\n    });\n    var filtered = ts.length || cat || tag;\n    if (result) result.textContent = filtered ? (arts.length + ' 件中 ' + shown + ' 件を表示') : ('全 ' + arts.length + ' 件');\n    if (empty) empty.hidden = shown !== 0 || arts.length === 0;\n    document.querySelectorAll('[data-filter-cat]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-cat') === cat)); });\n    document.querySelectorAll('[data-filter-tag]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-tag') === tag)); });\n  }\n\n  document.addEventListener('click', function (e) {\n    var b = e.target.closest && e.target.closest('[data-filter-cat], [data-filter-tag]');\n    if (!b) return;\n    if (b.hasAttribute('data-filter-cat')) { var c = b.getAttribute('data-filter-cat'); cat = cat === c ? null : c; }\n    if (b.hasAttribute('data-filter-tag')) { var t = b.getAttribute('data-filter-tag'); tag = tag === t ? null : t; }\n    apply();\n  });\n  q.addEventListener('input', apply);\n  document.addEventListener('keydown', function (e) {\n    var typing = e.target.closest && e.target.closest('input, textarea, select');\n    if (e.key === '/' && !typing) { e.preventDefault(); q.focus(); }\n  });\n  document.getElementById('tools').hidden = false;\n  apply();\n})();\n";
  const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap">';

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  // 日本時間で表示（どこで書き出しても同じ表記にする）
  const jst = (iso) => {
    const t = Date.parse(iso);
    if (isNaN(t)) return '';
    const d = new Date(t + 9 * 3600 * 1000);
    return `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}`;
  };
  const UNCAT = '未分類';
  const catOf = (m) => String(m.category || '').trim() || UNCAT;

  function linkify(text) {
    const re = /https?:\/\/[^\s<>"'、。「」）)]+/g;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index)) + `<a href="${esc(m[0])}" rel="noopener nofollow ugc">${esc(m[0])}</a>`;
      last = m.index + m[0].length;
    }
    return out + esc(text.slice(last));
  }

  /** 公開してよいメモだけを、必要な項目だけに絞って取り出す */
  function publicMemos(memos) {
    return (Array.isArray(memos) ? memos : [])
      .filter((m) => m && m.visibility === 'public' && !m.sample)
      .map((m) => ({
        id: String(m.id), kind: m.kind === 'todo' ? 'todo' : 'idea', title: String(m.title || ''), body: String(m.body || ''),
        category: String(m.category || ''), tags: Array.isArray(m.tags) ? m.tags.map(String) : [], done: !!m.done,
        createdAt: String(m.createdAt || ''), updatedAt: String(m.updatedAt || m.createdAt || ''),
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  function countBy(list, fn) {
    const map = new Map();
    for (const m of list) for (const k of [].concat(fn(m))) map.set(k, (map.get(k) || 0) + 1);
    return [...map].sort((a, b) => (a[0] === UNCAT) - (b[0] === UNCAT) || b[1] - a[1] || a[0].localeCompare(b[0], 'ja'));
  }

  function card(m) {
    const kind = m.kind === 'todo'
      ? (m.done ? '<span class="kind kind-done">完了</span>' : '<span class="kind kind-todo">TODO</span>')
      : '<span class="kind kind-idea">アイデア</span>';
    const anchor = 'm-' + m.id.replace(/[^A-Za-z0-9_-]/g, '');
    const body = m.body.trim();
    const dateIso = m.updatedAt || m.createdAt;
    return `<article class="memo${m.done ? ' is-done' : ''}" id="${esc(anchor)}" data-cat="${esc(catOf(m))}" data-tags="${esc(JSON.stringify(m.tags))}">
<div class="memo-head"><h2><a href="#${esc(anchor)}">${esc(m.title || '（タイトルなし）')}</a></h2>${kind}</div>
${body ? `<div class="memo-body">${linkify(body)}</div>` : ''}
<div class="memo-meta"><span class="meta-cat">${esc(catOf(m))}</span>${m.tags.map((t) => `<span class="meta-tag">#${esc(t)}</span>`).join('')}<time datetime="${esc(dateIso)}">${esc(jst(dateIso))}${m.updatedAt !== m.createdAt ? ' 更新' : ''}</time></div>
</article>`;
  }

  /**
   * @param {{title?: string, memos: Array}} data 編集ページの保存データ
   * @param {{generatedAt?: string, siteUrl?: string}} [opts]
   * @returns {{html: string, count: number}}
   */
  function build(data, opts) {
    const o = opts || {};
    const title = String((data && data.title) || '備忘録ノート');
    const memos = publicMemos(data && data.memos);
    const generated = o.generatedAt || new Date().toISOString();
    const cats = countBy(memos, catOf);
    const tags = countBy(memos, (m) => m.tags);
    const ideas = memos.filter((m) => m.kind === 'idea').length;
    const todos = memos.length - ideas;
    const desc = `${title}｜アイデアとTODOを書き留めた備忘録。公開メモ${memos.length}件（アイデア${ideas}件・TODO${todos}件）。`;
    const canonical = o.siteUrl ? `<link rel="canonical" href="${esc(o.siteUrl)}"><meta property="og:url" content="${esc(o.siteUrl)}">` : '';

    const facets = (cats.length || tags.length) ? `
${cats.length ? `<div class="facet" role="group" aria-label="カテゴリで絞り込み"><span class="facet-label">カテゴリ</span>${cats.map(([c, n]) => `<button type="button" class="chip" data-filter-cat="${esc(c)}" aria-pressed="false">${esc(c)} <span class="stats">${n}</span></button>`).join('')}</div>` : ''}
${tags.length ? `<div class="facet" role="group" aria-label="タグで絞り込み"><span class="facet-label">タグ</span>${tags.map(([t, n]) => `<button type="button" class="chip" data-filter-tag="${esc(t)}" aria-pressed="false">#${esc(t)} <span class="stats">${n}</span></button>`).join('')}</div>` : ''}` : '';

    const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary">
${canonical}
${FONTS}
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<header class="masthead">
<h1>${esc(title)}</h1>
<p>アイデアとTODOを書き留めている備忘録です。</p>
<p class="stats">公開メモ ${memos.length} 件 · 最終更新 <time datetime="${esc(generated)}">${esc(jst(generated))}</time></p>
</header>
<div class="tools" id="tools" hidden>
<div class="search" role="search"><label for="q" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">メモを検索</label><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="7" cy="7" r="5"></circle><path d="M11 11l3.5 3.5" stroke-linecap="round"></path></svg><input id="q" type="search" placeholder="キーワードで検索" autocomplete="off"></div>${facets}
</div>
<main>
<p class="result" id="result" aria-live="polite">全 ${memos.length} 件</p>
<div class="list" id="list">
${memos.map(card).join('\n')}
</div>
<div class="empty" id="empty" ${memos.length ? 'hidden' : ''}>${memos.length ? '条件に合うメモはありません。' : 'まだ公開しているメモはありません。'}</div>
</main>
<footer class="foot">© ${esc(title)}</footer>
</div>
<script>${RUNTIME}<\/script>
</body>
</html>
`;
    return { html, count: memos.length };
  }

  return { build, publicMemos };
})();
