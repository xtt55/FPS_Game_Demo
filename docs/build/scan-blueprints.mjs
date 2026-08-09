import fs from 'fs';
import path from 'path';
const dir = 'docs/content';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
const re = /(BP_[A-Za-z0-9_]+|ABP_[A-Za-z0-9_]+|GM_[A-Za-z0-9_]+|AM_[A-Za-z0-9_]+|BS_[A-Za-z0-9_]+)/g;
const map = {}; // name -> [{file, count}]
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  let m;
  while ((m = re.exec(t))) {
    const n = m[1];
    if (!map[n]) map[n] = [];
    const last = map[n][map[n].length - 1];
    if (last && last.file === f) last.count++;
    else map[n].push({ file: f, count: 1 });
  }
}
for (const n of Object.keys(map).sort()) {
  const locs = map[n].map(x => x.file + '×' + x.count).join(', ');
  console.log(n + '  =>  ' + locs);
}
