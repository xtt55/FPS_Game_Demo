# 站点构建进度（供中断后接手）

> 本文件记录 UE5 FPS 学习笔记静态站的构建进度与关键决策。随时更新。
> 最新更新：2026-08-09 四次更新（合并第 12 课「完善瞄准系统（下）」到 11-12 页）。

## 目标

- 在 `D:\Unreal Projects\FPS_Game_Demo\docs\` 生成纯静态站点（GitHub Pages：Settings → Pages → main 分支 /docs 目录）。
- 覆盖第 01–11 课；07/08/09 合并为一页（内部三个小节）。
- 章节名以 `E:\办公室mac260714\learn\learn\README.md` 为准。
- 内容以用户 Notes 为准（`E:\办公室mac260714\文档工作空间-260605\Games\Notes`），learn 的 summary（`showcase/notes-data.js` 内嵌全部 26 章）作骨架与补全。
- 图片全部用 Notes 里的用户截图，**重命名为语义化英文名**（`l课号-描述.png`），拷贝到 `docs/assets/img/`。

## 已完成

1. ✅ 读完 `C:\Users\Administrator\Desktop\UE5_FPS_Session_Log.md`（7 次纠正教训：不编造、先澄清、对象关系以用户为准、英文文件名中文内容、不留无图指代）。
2. ✅ 读完 Notes 全部 6 份 md：FPS.md（主笔记，736 行）+ 5 份专题（Refactor / HeadAimAnim / IdleWalk_Blend / TransitionRule_IdleToMove / ABP_Virtus_Basic_Intro）。
3. ✅ 提取 learn 01–11 章 summary 到 `docs_src_tmp/learn_01_11_summaries.md` 并通读。
4. ✅ 用户确认：只做到第 11 课；07/08/09 合并；输出到 docs/；用用户截图并重命名。

## 关键事实（勿编错）

- 命名：`ABP_FPSPlayer`=人物动画蓝图（权威数据源）；`ABP_Virtus`=枪械动画蓝图（引用人物的变量）；`BP_VIRTUS`=枪蓝图（运行时挂在角色上）；`BP_FPS_Player`=角色蓝图，`Arm`=其下手臂骨骼网格体变量。Virtus 是枪名。
- `Arm Socket Location Return` == `AimSocketLocationReturn`（UE 自动加大空格显示）。
- Local/Component To Local 是引擎连线时自动插入的胶水节点，非手工摆放。
- Cast 链放 `Event BlueprintInitializeAnimation`（一次），Update 每帧只读缓存。
- `Cast To BP_FPS_Player` 唯一目的 = 拿 Arm。
- 转换规则笔记描述的是 ToIdle→Move：`(剩余时间<0.4) OR (E Player State == Run)`。
- 视频链接：`https://www.bilibili.com/video/BV1aw9jBeEHr/?p=N`，课号+1=p（第1课=p2 … 第11课=p12）。
- 用户键位：Run=左Ctrl（learn 是 Shift），Aim=右键。

## 页面清单（docs/ 根目录平铺）

| 页面 | 内容来源 |
|---|---|
| index.html | 首页+章节导航 |
| lesson-01.html 创建项目及导入素材 | learn 为主（Notes 无内容） |
| lesson-02.html 修改DDC缓存路径 | FPS.md 一.1 + learn |
| lesson-03.html 配置游戏模式及输入 | FPS.md 一.2/二(GameMode/IA/IMC) + learn |
| lesson-04.html 实现角色基本能力 | FPS.md 三.1(BeginPlay/IA_Move/IA_Look) + learn 原理；含连线颜色速查 |
| lesson-05.html 完善角色细节 | FPS.md 四.1(组件/相机/枪方法一) + 三.1第四部分(Tick Arm) + learn |
| lesson-06.html 制作角色能力系统 | FPS.md 五.1(UpdatePlayerState) + learn(WantToRun/UpdateMoveSpeed) |
| lesson-07-09.html 制作动画系统（上中下合并） | FPS.md 六 + IdleWalk/TransitionRule 两份专题 + learn |
| lesson-10.html 模块化设计及DeBug | FPS.md 二.2/四枪方法二 + Refactor/VirtusIntro 专题 + learn |
| lesson-11.html 完善瞄准系统（上） | FPS.md 六.5 + HeadAimAnim 专题 + learn |

## 构建方式

- `docs/build/build.mjs`（Node 脚本，无外部依赖，marked 用 `docs/build/marked.min.js` UMD 版 require）。
- 内容源：`docs/content/*.md`（图片引用写 `assets/img/lXX-*.png`）。
- 运行：`node docs/build/build.mjs` 生成 `docs/*.html`。
- 图片拷贝+重命名：`docs/build/copy-images.mjs`（内含 旧名→新名 映射表）。

## 2026-08-09 二次更新

- 重构 lesson-07-09：去掉上/中/下分节与双套编号，改为「整体结构 → 混合空间 → EventGraph → 挂载 → 状态机骨架 → 各状态内部 → 转换规则」单主线
- 新增 7 个附录页：通用节点速查 / 踩坑速查 / 数据流全景 / SOP 清单 / 术语对照 / 工具链与环境 / 设计原则
- 记忆沉淀：全局记忆 `C:\Users\Administrator\.codeium\windsurf\memories\global_rules.md` + 项目根 `AGENTS.md`

## 2026-08-09 三次更新

- 命名统一：`ABP_VIRTUL`/`BS_VIRTUL` → `ABP_Virtus`/`BS_Virtus`（工程实际资产名，用户确认）；4 张 l10 截图同步改名；`docs/build/fix-virtus-naming.mjs` 是当时的批量替换脚本
- 补蓝图创建步骤：03 课开头加「创建 BP_FPS_Player」（父类=角色 Character，位置 `Scripts/Players`）；07-09 课开头加「创建动画蓝图与混合空间」（位置 `Scripts/Players/Animation/{Players,Weapon}`）
- 修正资产位置：GameMode 在 `Scripts/Players/System`，输入资产在 `Scripts/Players/System/Input`（均与工程 .uasset 路径核对过）
- 骨骼选择已用二进制校验（`docs/build/check-skeletons.mjs`）：人物侧=`Skeleton_Base`，枪械侧=`MCX-VIRTUS_Skeleton`；术语表补「命名前缀」和 Skeleton vs Skeletal Mesh 区分

## 2026-08-09 四次更新

- 合并第 12 课「完善瞄准系统（下）」到第 11 页：文件名保持 `11.md` / `lesson-11.html`，标题改为「第11-12课 · 完善瞄准系统（上/下）」
- 新增第 12 课截图 8 张并更新 `copy-images.mjs` 映射；copy 校验 84/84
- 11-12 页内容：Step 8 加 `Sight` 机瞄组件；Step 9 修复动态模糊拉长准星（`After Motion Blur`）；Step 10 FOV 平滑缩放（105→75，FInterp To + Set Timer By Event + OutFOV）；Step 11 `UpdateDefaultFOV` 存默认 FOV 变量
- 站点页脚、PAGES、index 首页卡片、AGENTS.md 的 `EPlayerState` 命名同步更新

## 待办（全部完成 ✅）

- [x] copy-images.mjs + 执行（76/76 全部拷贝成功）
- [x] build.mjs + style.css + 模板（已验证可构建，marked.min.js 用 `require` 后取 `.marked.parse`）
- [x] content/ 9 份 md 全部写完（index/01/02/03/04/05/06/07-09/10/11）
- [x] 构建 + 校验：引用图片 76 张、缺失 0、未引用 0、内部链接无坏链
- [x] 删除 `docs_src_tmp/`
- [x] 目录大小写修正：`Docs/` → `docs/`（git mv 两步法，已暂存 R 记录；GitHub Pages 要求小写 /docs）

## 续写新课的方法（第 12 课起）

1. 在 `docs/content/` 新建 `12.md`（图片放 `assets/img/l12-*.png`）。
2. 在 `docs/build/build.mjs` 的 `PAGES` 数组里加一条（video = 课号+1）。
3. 跑 `node docs/build/build.mjs`。
4. 提交并 push；GitHub Pages 设置：Settings → Pages → Source: main 分支 /docs 文件夹。

## 遗留说明

- `docs/AnimGraph_IdleWalk_Blend.md` 是早期 Docs 副本（站点未引用它），可留可删。
- git status 里的 .uasset 修改是用户第 11 课的工程改动，本次未提交。

## 注意（环境坑）

- 本会话默认 shell 实际是 **PowerShell**（不是 bash）：不支持 `&&` 链，写了会静默失败无输出。多条命令分开跑或用 Node 脚本。
- exec 的输出偶尔被吞（空输出+退出码1多半就是 `&&` 问题）。
