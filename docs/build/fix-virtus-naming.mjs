import fs from 'fs';
import path from 'path';

// 1) 替换 md 文件中的资产命名（docs/content、PROGRESS.md、AGENTS.md）
const targets = [
  ...fs.readdirSync('docs/content').filter(f => f.endsWith('.md')).map(f => 'docs/content/' + f),
  'docs/PROGRESS.md',
  'AGENTS.md',
];
for (const p of targets) {
  let t = fs.readFileSync(p, 'utf8');
  const o = t;
  t = t.replace(/ABP_VIRTUL/g, 'ABP_Virtus').replace(/BS_VIRTUL/g, 'BS_Virtus');
  if (t !== o) { fs.writeFileSync(p, t); console.log('替换命名:', p); }
}

// 2) 重命名截图 l10-abp-virtul-*.png -> l10-abp-virtus-*.png，并同步 content 引用
const imgDir = 'docs/assets/img';
const map = {};
for (const n of fs.readdirSync(imgDir)) {
  if (n.startsWith('l10-abp-virtul-')) {
    const nn = n.replace('virtul', 'virtus');
    fs.renameSync(path.join(imgDir, n), path.join(imgDir, nn));
    map[n] = nn;
    console.log('重命名截图:', n, '->', nn);
  }
}
if (Object.keys(map).length) {
  const p = 'docs/content/10.md';
  let t = fs.readFileSync(p, 'utf8');
  for (const [a, b] of Object.entries(map)) t = t.split(a).join(b);
  fs.writeFileSync(p, t);
  console.log('10.md 截图引用已更新');
}
console.log('done');
