import fs from 'node:fs';
const p = 'D:/Unreal Projects/FPS_Game_Demo/docs/content/13.md';
const t = fs.readFileSync(p, 'utf8');
fs.writeFileSync(p, t.replace(/\r\n/g, '\n'));
console.log('LF 化: 13.md');
