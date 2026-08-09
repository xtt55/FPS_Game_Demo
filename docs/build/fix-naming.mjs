// 一次性批量修正命名（改完可删）
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'D:/Unreal Projects/FPS_Game_Demo/docs/content';
const RULES = [
  // 枚举资产名与变量名都是 E_PlayerState（UE 里类型显示为 "E Player State"）
  [/`E Player State`/g, '`E_PlayerState`'],
  [/\bE Player State\b(?!」)/g, 'E_PlayerState'],
  [/`EPlayerState`/g, '`E_PlayerState`'],
  [/\bEPlayerState\b/g, 'E_PlayerState'],
  // 变量名大小写：Want To Run / Want To Aim
  [/Want to Run/g, 'Want To Run'],
  [/Want to Aim/g, 'Want To Aim'],
  // 函数名无空格
  [/`Spawn Weapon`/g, '`SpawnWeapon`'],
  [/\*\*Spawn Weapon\*\*/g, '**SpawnWeapon**'],
  // Aim 态用的是 Blend Poses by bool，不是 by Bone
  [/Blend Poses by Bone（按骨骼混合）/g, 'Blend Poses by bool（按布尔混合姿势）'],
  [/Blend Poses by Bone/g, 'Blend Poses by bool'],
  // 颜色修正：UE5 里 Vector = 黄，Rotator = 紫
  [/🔵 蓝 \| 向量 Vector/g, '🟡 黄 \\| 向量 Vector'],
  [/🟡 黄 \| 旋转器 Rotator/g, '🟣 紫 \\| 旋转器 Rotator'],
  [/🟡 黄 \| 旋转器 Rotator/g, '🟣 紫 \\| 旋转器 Rotator'],
];

let total = 0;
for (const f of fs.readdirSync(DIR)) {
  const p = path.join(DIR, f);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  let n = 0;
  for (const [re, to] of RULES) {
    const m = s.match(re);
    if (m) { n += m.length; s = s.replace(re, to); }
  }
  if (s !== before) {
    fs.writeFileSync(p, s.replace(/\r\n/g, '\n'), 'utf8');
    console.log(`${f}: ${n} 处`);
    total += n;
  }
}
console.log('total', total);
