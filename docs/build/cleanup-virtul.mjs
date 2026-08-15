// 删除旧的 l10-abp-virtul-*.png，避免和 l10-abp-virtus-*.png 重复
import fs from 'node:fs';
import path from 'node:path';

const dir = 'D:/Unreal Projects/FPS_Game_Demo/docs/assets/img';
for (const name of fs.readdirSync(dir)) {
  if (name.startsWith('l10-abp-virtul-') && name.endsWith('.png')) {
    fs.unlinkSync(path.join(dir, name));
    console.log('删除:', name);
  }
}
console.log('done');
