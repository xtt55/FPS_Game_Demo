> 重复性操作的「照着打勾」清单。每做完一步勾一步，避免漏环节。
> 后续课程（换弹、新武器、音效特效）学到后可以继续在这里追加。

## SOP 1：新加一把枪

前置：已有 `BP_WeaponBase` 基类（[第10课](lesson-10.html)）。

- [ ] 新建蓝图类，**父类选 BP_WeaponBase**（不要再选 Actor），命名 `BP_枪械名`
- [ ] 类默认值里配置继承来的变量（如 Ammo）
- [ ] `Weapon` 骨骼网格体选这把枪的 SK 资产
- [ ] 加配件（静态网格体）：枪管 / 弹匣 / 倍镜 / 枪托，各自指定父项插槽；飘移就把位置/旋转重置为 0
- [ ] **全部件（含主体）碰撞预设 = NoCollision**，否则卡角色
- [ ] 骨骼网格的动画类 = 这把枪的 ABP（新建或复用）
- [ ] 枪械 ABP：Initialize 缓存人物 ABP 引用 → Update 读人物变量（直接照抄 ABP_Virtus）
- [ ] 枪械混合空间 BS：轴/平滑时间/平滑类型**与人物 BS 保持一致**
- [ ] 骨骼 body 上加 **AimSocket** 插槽并调位置（瞄准用，[第11课](lesson-11.html)）
- [ ] `BP_FPS_Player` 的 `SpawnWeapon`：SpawnActor 的 Class 换成新枪（或做换枪逻辑）
- [ ] PIE 验证：移动不卡碰撞、动画同步、瞄准头到位

## SOP 2：新加一种角色状态（如冲刺、滑铲）

前置：状态枚举与状态机已搭好（[第06课](lesson-06.html)、[第07–09课](lesson-07-09.html)）。

- [ ] 枚举 `E_PlayerState` 加新值
- [ ] （如新按键）建 IA + IMC 加映射 + 设值类型
- [ ] 角色蓝图写 `Want to XXX` 变量（Triggered=true / Completed=false）
- [ ] `UpdatePlayerState` 加分支——**想清楚优先级**插在哪个 Branch 前面
- [ ] `UpdateMoveSpeed` 的 Select 加一行速度
- [ ] **人物 ABP** 状态机：加新状态（选动画、决定勾不勾循环）+ 进出双向转换规则
- [ ] **枪械 ABP** 状态机：同样来一遍（动画选 Weapon 系列）
- [ ] 检查与现有状态的打断边要不要补（参考 ToAim↔ToIdle）
- [ ] 检查相关转换要不要加 `OR 新状态`（参考 ToIdle→Move 的 OR Run）
- [ ] PIE 验证：进/出/打断三种路径都试

## SOP 3：给蓝图功能配调试输出

- [ ] 关键变量接 **Print String**，`Duration = 0`（常显）
- [ ] 每条 Cast 的 **Cast Failed** 接 Print String
- [ ] 有时序依赖的对象引用，读取前过 **Is Valid**
- [ ] 验证完：打印节点可留可删，删前确认逻辑已稳

## SOP 4：换一台电脑继续开发

- [ ] 旧电脑：`git add` + `commit` + `push`（**FPS_Game_Demo 才是正仓库**，别再用临时副本）
- [ ] 新电脑：`git pull`（SSH 已配好）
- [ ] 打开工程，等 DDC/着色器编译（DDC 路径每台机器各自设置，不进 Git）
- [ ] 不回传 `Intermediate/`、`Saved/`、`DerivedDataCache/`（.gitignore 已排除）

## SOP 5：笔记站更新一节课

- [ ] 截图放进 Notes，按 `l课号-描述.png` 语义命名
- [ ] `docs/build/copy-images.mjs` 的映射表加新图，运行拷贝
- [ ] `docs/content/` 新建/更新对应课程 md（图片路径 `assets/img/...`）
- [ ] `docs/build/build.mjs` 的 PAGES 加新课（video = 课号 + 1）
- [ ] 运行 `node docs/build/build.mjs`
- [ ] 新学到的通用节点/坑/SOP → 同步更新对应附录页
- [ ] `git add docs` + commit + push（Pages/Cloudflare 自动更新）
