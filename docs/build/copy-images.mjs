// 把 Notes 里的截图按语义重命名拷贝到 docs/assets/img/
// 运行：node docs/build/copy-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = 'E:/办公室mac260714/文档工作空间-260605/Games/Notes';
const DEST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/img');

// 旧文件名 -> 新文件名（l课号-描述）
const MAP = {
  // 第02课 DDC
  'image.png': 'l02-ddc-path.png',
  // 第03课 游戏模式与输入
  'image-1.png': 'l03-gamemode-default-pawn.png',
  'image-2.png': 'l03-project-settings-gamemode.png',
  'image-3.png': 'l03-world-settings-gamemode.png',
  'image-10.png': 'l03-imc-ia-look-negate.png',
  'image-4.png': 'l03-imc-ia-move-wasd.png',
  'image-6.png': 'l03-imc-ia-run-ctrl.png',
  'image-7.png': 'l03-imc-ia-aim-rightmouse.png',
  // 第04课 角色基本能力
  'image-8.png': 'l04-get-player-controller-index0.png',
  'image-54.png': 'l04-beginplay-input-chain.png',
  'EnhancedInputAction_IA_Move.png': 'l04-eventgraph-ia-move.png',
  'EnhancedInputAction_IA_Look.png': 'l04-eventgraph-ia-look.png',
  // 第05课 角色细节
  'image-16.png': 'l05-component-hierarchy.png',
  'Arm.png': 'l05-arm-settings.png',
  'Camera.png': 'l05-camera-settings.png',
  'Gun_main.png': 'l05-gun-settings.png',
  'Gun_Barrel.png': 'l05-gun-barrel.png',
  'Gun_Magazine.png': 'l05-gun-magazine.png',
  'Gun_Stock.png': 'l05-gun-stock.png',
  'image-12.png': 'l05-tick-arm-world-rotation.png',
  'image-17.png': 'l05-near-clip-plane.png',
  // 第06课 能力系统
  'image-11.png': 'l06-eplayerstate-enum.png',
  'image-5.png': 'l06-updateplayerstate-graph.png',
  'image-13.png': 'l06-debug-print-state.png',
  'image-14.png': 'l06-debug-print-speed.png',
  // 第07课 动画系统（上）
  'image-15.png': 'l07-anim-assets-location.png',
  'image-18.png': 'l07-bs-player-axes.png',
  'image-19.png': 'l07-bs-player-anims-1.png',
  'image-20.png': 'l07-bs-player-anims-2.png',
  'image-25.png': 'l07-bs-virtus-overview.png',
  'image-27.png': 'l07-bs-virtus-axes.png',
  'image-28.png': 'l07-bs-virtus-anims.png',
  'image-22.png': 'l07-arm-anim-class.png',
  'image-21.png': 'l07-abp-eventgraph-sync.png',
  'image-23.png': 'l07-animgraph-statemachine.png',
  'image-24.png': 'l07-statemachine-entry-move.png',
  'image-26.png': 'l07-move-state-blendspace.png',
  'image-31.png': 'l07-move-state-compile.png',
  // 第08课 动画系统（中）
  'image-32.png': 'l08-add-run-state.png',
  'image-33.png': 'l08-run-state-animation.png',
  'image-34.png': 'l08-transition-move-to-run.png',
  'image-35.png': 'l08-transition-run-to-move.png',
  // 第09课 动画系统（下）
  'image-37.png': 'l09-transition-move-to-aim.png',
  'image-38.png': 'l09-transition-aim-to-move.png',
  'image-36.png': 'l09-aim-state-config.png',
  'image-39.png': 'l09-statemachine-toaim-toidle.png',
  'image-40.png': 'l09-toaim-state.png',
  'image-41.png': 'l09-toidle-state.png',
  'image-42.png': 'l09-transition-move-toaim.png',
  'image-43.png': 'l09-transition-toaim-aim.png',
  'image-44.png': 'l09-transition-aim-toidle.png',
  'image-45.png': 'l09-transition-toidle-move.png',
  'image-46.png': 'l09-transition-toaim-toidle.png',
  'image-47.png': 'l09-transition-toidle-toaim.png',
  // 第10课 模块化
  'image-48.png': 'l10-weaponbase-root.png',
  'image-49.png': 'l10-weaponbase-ammo.png',
  'image-50.png': 'l10-virtus-create.png',
  'image-51.png': 'l10-virtus-class-defaults.png',
  'image-9.png': 'l10-virtus-weapon-mesh.png',
  '枪管.png': 'l10-virtus-barrel.png',
  '弹匣.png': 'l10-virtus-magazine.png',
  '倍镜.png': 'l10-virtus-scope.png',
  '枪托.png': 'l10-virtus-stock.png',
  'image-52.png': 'l10-virtus-nocollision.png',
  'image-53.png': 'l10-spawnweapon-function.png',
  'image-56.png': 'l10-abp-virtus-eventgraph-refactored.png',
  'image-55.png': 'l10-abp-virtus-compare-1.png',
  'image-29.png': 'l10-abp-virtus-compare-2.png',
  'image-30.png': 'l10-abp-virtus-animgraph.png',
  // 第11课 瞄准系统（上）
  'image-58.png': 'l11-virtus-open-skeleton.png',
  'image-57.png': 'l11-aimsocket-create.png',
  'image-59.png': 'l11-getaimsocketlocation-function.png',
  'image-60.png': 'l11-virtus-override-function.png',
  'image-61.png': 'l11-abp-eventgraph-aimsocket.png',
  'image-63.png': 'l11-abp-animgraph-headaim.png',
  'image-62.png': 'l11-modify-bone-config.png',

  // 第12课 完善瞄准系统（下）
  'image-64.png': 'l12-virtus-add-sight.png',
  'image-65.png': 'l12-scope-reticle-material.png',
  'image-66.png': 'l12-holographic-parent-material.png',
  'image-67.png': 'l12-motion-blur-after.png',
  'image-68.png': 'l12-camera-fov-default.png',
  'image-69.png': 'l12-aim-fov-eventgraph.png',
  'image-70.png': 'l12-updatedefaultfov-call.png',
  'image-71.png': 'l12-updatedefaultfov-function.png',

  // 第13课 调节灵敏度
  'image-72.png': 'l13-ia-look-sensitivity.png',
  'image-73.png': 'l13-updatescore-function-select.png',
  'image-74.png': 'l13-updatescore-pure.png',
  'image-75.png': 'l13-mousesensitivity-default.png',
};

fs.mkdirSync(DEST, { recursive: true });
let ok = 0, missing = [];
for (const [from, to] of Object.entries(MAP)) {
  const s = path.join(SRC, from);
  if (!fs.existsSync(s)) { missing.push(from); continue; }
  fs.copyFileSync(s, path.join(DEST, to));
  ok++;
}
console.log(`copied ${ok}/${Object.keys(MAP).length}`);
if (missing.length) console.log('MISSING:', missing.join(', '));
