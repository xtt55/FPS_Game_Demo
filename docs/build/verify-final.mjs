import fs from 'fs';
import path from 'path';
const dir = 'docs/content';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
const pats = [
  ['E Player State(not followed by backtick)', /E Player State(?!`)/g],
  ['Want to Run (lowercase to)', /Want to Run/g],
  ['Want to Aim (lowercase to)', /Want to Aim/g],
  ['Spawn Weapon (space, not Base)', /Spawn Weapon(?!Base)/g],
  ['EPlayerState (no underscore, not followed by backtick)', /EPlayerState(?!`)/g],
  ['by Bone', /by Bone/g],
  ['blue vector color residue', /蓝色向量|蓝是向量/g],
  ['BP_WeaponBaes (typo)', /BP_WeaponBaes/g],
];
let found = false;
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const [name, re] of pats) {
    let m; const hits = [];
    while ((m = re.exec(t))) hits.push(m.index);
    if (hits.length) { found = true; console.log(f, '=>', name, hits.length + '处'); }
  }
}
console.log(found ? '--- 有残留 ---' : '--- 全部干净 ---');
