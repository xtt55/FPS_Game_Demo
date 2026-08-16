import fs from 'node:fs';
import path from 'node:path';

const root = 'D:/Unreal Projects/FPS_Game_Demo/docs';
function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.md')) continue;
    const t = fs.readFileSync(p, 'utf8');
    const fixed = t.replace(/\r\n/g, '\n');
    if (fixed !== t) { fs.writeFileSync(p, fixed); console.log('LF 化:', path.relative(root, p)); }
  }
}
walk(root);
console.log('done');
