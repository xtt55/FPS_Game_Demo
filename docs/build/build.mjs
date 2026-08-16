// 静态站构建脚本：docs/content/*.md -> docs/*.html
// 运行：node docs/build/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { marked } = require('./marked.min.js');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');

// 页面清单（顺序即导航顺序）
const PAGES = [
  { id: 'index',      md: 'index.md',  nav: '首页',                 title: 'UE5 FPS 学习笔记' },
  { id: 'lesson-01',  md: '01.md',     nav: '01 创建项目及导入素材', title: '第01课 · 创建项目及导入素材', video: 2 },
  { id: 'lesson-02',  md: '02.md',     nav: '02 修改DDC缓存路径',    title: '第02课 · 修改DDC缓存路径',  video: 3 },
  { id: 'lesson-03',  md: '03.md',     nav: '03 配置游戏模式及输入', title: '第03课 · 配置游戏模式及输入', video: 4 },
  { id: 'lesson-04',  md: '04.md',     nav: '04 实现角色基本能力',   title: '第04课 · 实现角色基本能力', video: 5 },
  { id: 'lesson-05',  md: '05.md',     nav: '05 完善角色细节',       title: '第05课 · 完善角色细节',     video: 6 },
  { id: 'lesson-06',  md: '06.md',     nav: '06 制作角色能力系统',   title: '第06课 · 制作角色能力系统', video: 7 },
  { id: 'lesson-07-09', md: '07-09.md', nav: '07-09 制作动画系统',   title: '第07–09课 · 制作动画系统（上/中/下）', video: 8 },
  { id: 'lesson-10',  md: '10.md',     nav: '10 模块化设计及DeBug',  title: '第10课 · 模块化设计及DeBug', video: 11 },
  { id: 'lesson-11',  md: '11.md',     nav: '11-12 完善瞄准系统', title: '第11-12课 · 完善瞄准系统（上/下）', video: 13 },
  { id: 'lesson-13',  md: '13.md',     nav: '13 调节灵敏度',      title: '第13课 · 调节灵敏度',      video: 14 },
  { id: 'appendix-nodes', md: 'appendix-nodes.md', nav: '附录一 · 通用节点速查', title: '附录一 · 蓝图通用节点速查' },
  { id: 'appendix-troubleshooting', md: 'appendix-troubleshooting.md', nav: '附录二 · 踩坑速查', title: '附录二 · 踩坑速查（症状 → 原因 → 修复）' },
  { id: 'appendix-architecture', md: 'appendix-architecture.md', nav: '附录三 · 数据流全景', title: '附录三 · 数据流全景（工程总架构）' },
  { id: 'appendix-sop', md: 'appendix-sop.md', nav: '附录四 · SOP 清单', title: '附录四 · 常用操作 SOP 清单' },
  { id: 'appendix-terms', md: 'appendix-terms.md', nav: '附录五 · 术语对照', title: '附录五 · UE 中英术语对照' },
  { id: 'appendix-workflow', md: 'appendix-workflow.md', nav: '附录六 · 工具链与环境', title: '附录六 · 工具链与环境（Git / 部署 / 笔记规范）' },
  { id: 'appendix-principles', md: 'appendix-principles.md', nav: '附录七 · 设计原则', title: '附录七 · 设计原则（为什么这么写）' },
];

const VIDEO_BASE = 'https://www.bilibili.com/video/BV1aw9jBeEHr/?p=';

function navHtml(currentId) {
  return PAGES.map(p =>
    `<a class="nav-link${p.id === currentId ? ' active' : ''}" href="${p.id}.html">${p.nav}</a>`
  ).join('\n');
}

function template(page, bodyHtml) {
  const idx = PAGES.findIndex(p => p.id === page.id);
  const prev = PAGES[idx - 1], next = PAGES[idx + 1];
  const videoLink = page.video
    ? `<a class="video-link" href="${VIDEO_BASE}${page.video}" target="_blank" rel="noopener">▶ 对应视频（P${page.video}）</a>`
    : '';
  const pager = `
    <div class="pager">
      ${prev ? `<a href="${prev.id}.html">← ${prev.nav}</a>` : '<span></span>'}
      ${next ? `<a href="${next.id}.html">${next.nav} →</a>` : '<span></span>'}
    </div>`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.title} · UE5 FPS 学习笔记</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="topbar">
  <button id="menu-btn" aria-label="菜单">☰</button>
  <a class="site-title" href="index.html">UE5 FPS 学习笔记</a>
  <span class="course-link"><a href="https://www.bilibili.com/video/BV1aw9jBeEHr" target="_blank" rel="noopener">课程：星露Studio · UE5 制作第一人称射击游戏</a></span>
</header>
<div class="layout">
  <nav class="sidebar" id="sidebar">
    ${navHtml(page.id)}
  </nav>
  <main class="content">
    <h1 class="page-title">${page.title}</h1>
    ${videoLink}
    ${bodyHtml}
    ${pager}
  </main>
</div>
<footer class="footer">跟课进度：第 13 课 · 笔记持续更新中</footer>
<script>
document.getElementById('menu-btn').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open');
});
</script>
</body>
</html>`;
}

// 图片包一层链接，点击看大图
function wrapImages(html) {
  return html.replace(/<img src="(assets\/img\/[^"]+)"([^>]*)>/g,
    '<a class="img-link" href="$1" target="_blank" rel="noopener"><img src="$1"$2 loading="lazy"></a>');
}

let missing = [];
for (const page of PAGES) {
  const mdPath = path.join(CONTENT, page.md);
  if (!fs.existsSync(mdPath)) { missing.push(page.md); continue; }
  const md = fs.readFileSync(mdPath, 'utf8');
  // 校验图片引用是否存在
  for (const m of md.matchAll(/!\[[^\]]*\]\((assets\/img\/[^)]+)\)/g)) {
    if (!fs.existsSync(path.join(ROOT, m[1]))) console.log(`  [缺图] ${page.md}: ${m[1]}`);
  }
  const body = wrapImages(marked.parse(md));
  fs.writeFileSync(path.join(ROOT, `${page.id}.html`), template(page, body), 'utf8');
  console.log(`built ${page.id}.html`);
}
if (missing.length) console.log('MISSING CONTENT:', missing.join(', '));
console.log('done');
