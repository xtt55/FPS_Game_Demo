// 一次性校验：确认 ABP/BS 资产引用的骨骼（Skeleton）
import fs from 'node:fs';

const root = 'D:/Unreal Projects/FPS_Game_Demo/Content';
const checks = [
  ['Scripts/Players/Animation/Players/ABP_FPSPlayer.uasset', 'Skeleton_Base'],
  ['Scripts/Players/Animation/Players/BS_FPSPlayer.uasset', 'Skeleton_Base'],
  ['Scripts/Players/Animation/Weapon/ABP_Virtus.uasset', 'MCX-VIRTUS_Skeleton'],
  ['Scripts/Players/Animation/Weapon/BS_Virtus.uasset', 'MCX-VIRTUS_Skeleton'],
];

let fail = 0;
for (const [rel, skel] of checks) {
  const buf = fs.readFileSync(`${root}/${rel}`);
  const text = buf.toString('latin1');
  const ok = text.includes(skel);
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${rel} -> ${skel}`);
}
process.exit(fail ? 1 : 0);
