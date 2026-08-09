// 把 docs/build/ 下的脚本工作区副本统一转为 LF（.gitattributes 要求 eol=lf）
import fs from 'node:fs';
import path from 'node:path';

const dir = 'D:/Unreal Projects/FPS_Game_Demo/docs/build';
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith('.mjs') && !name.endsWith('.js')) continue;
  const p = path.join(dir, name);
  const t = fs.readFileSync(p, 'utf8');
  const fixed = t.replace(/\r\n/g, '\n');
  if (fixed !== t) {
    fs.writeFileSync(p, fixed);
    console.log('LF 化:', name);
  }
}
console.log('done');
