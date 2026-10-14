#!/usr/bin/env node
/*
 * 編集用ページ（Artifact read で保存した index.html）から公開サイトを作る。
 * 使い方: node export_public.js <編集ページ.html> <出力フォルダ> [公開URL]
 * 出力: <出力フォルダ>/index.html（公開メモのみ）, robots.txt, sitemap.xml（公開URLがあるとき）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const [src, outDir, siteUrl] = process.argv.slice(2);
if (!src || !outDir) {
  console.error('使い方: node export_public.js <編集ページ.html> <出力フォルダ> [公開URL]');
  process.exit(1);
}
const page = fs.readFileSync(src, 'utf8');
const m = page.match(/<script type="application\/json" id="memo-data">([\s\S]*?)<\/script>/);
if (!m) { console.error('メモのデータが見つかりません'); process.exit(1); }
const data = JSON.parse(m[1]);

const bundle = fs.readFileSync(path.join(__dirname, 'public-site.bundle.js'), 'utf8');
const PublicSite = new Function(bundle + '\nreturn PublicSite;')();
const { html, count } = PublicSite.build(data, { siteUrl: siteUrl || undefined });

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
const robots = ['User-agent: *', 'Allow: /'];
if (siteUrl) {
  const base = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  robots.push('Sitemap: ' + base + 'sitemap.xml');
  const lastmod = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}</loc><lastmod>${lastmod}</lastmod></url>\n</urlset>\n`);
}
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots.join('\n') + '\n');

// 念のための漏れチェック：公開扱いでないメモのタイトル・本文が混ざっていないか
const leaks = (data.memos || []).filter((x) => !(x.visibility === 'public' && !x.sample))
  .filter((x) => (x.title && x.title.length >= 4 && html.includes(x.title)) || (x.body && x.body.length >= 8 && html.includes(x.body)));
if (leaks.length) {
  console.error('公開扱いでないメモが含まれています。中止します:', leaks.map((x) => x.id));
  fs.rmSync(path.join(outDir, 'index.html'));
  process.exit(2);
}
console.log(`公開メモ ${count} 件で ${path.join(outDir, 'index.html')} を作成しました`);
