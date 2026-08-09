# AGENTS.md — FPS_Game_Demo

## 项目

UE 5.8 第一人称射击学习工程（蓝图，无 C++），跟随 B 站教程 BV1aw9jBeEHr。Git 远程：`git@github.com:xtt55/FPS_Game_Demo.git`（SSH，私有仓库）。

## 目录约定

- `Content/Scripts/`：自己的蓝图（Players / Weapon / Input / System…）
- `Content/XL_FPSPack/`：课程素材包，不要往里放自己的东西
- `docs/`：学习笔记静态站（见下）
- 引擎生成目录（Intermediate/Saved/DerivedDataCache…）已被 .gitignore 排除，勿提交

## 笔记站（docs/）

- 内容源：`docs/content/*.md`；构建：`node docs/build/build.mjs`（零 npm 依赖）
- 新增一节课：content 加 md → `build/build.mjs` 的 PAGES 加一条（video = 课号+1）→ 跑构建
- 截图：源在 `E:\办公室mac260714\文档工作空间-260605\Games\Notes`，用 `docs/build/copy-images.mjs` 的映射表重命名为 `l课号-描述.png` 后拷入 `docs/assets/img/`
- 部署：Cloudflare Pages（Build command 留空，输出目录 `docs`），push main 自动更新
- 网页文件统一 LF（.gitattributes 已配 `docs/** eol=lf`）

## 关键事实（蓝图对象关系）

- `ABP_FPSPlayer` = 人物动画蓝图（权威数据源）；`ABP_VIRTUL` = 枪械动画蓝图（读人物 ABP 变量，不直接 Cast 角色）
- `BP_WeaponBase` 是枪械基类（通用函数如 getAimSocketLocation 写这里）；`BP_VIRTUS` 继承它
- Cast 链只在 `Event BlueprintInitializeAnimation` 跑一次并缓存；每帧 Update 零 Cast
- `EPlayerState`：Idle / Walk / Run / Aim，由 `UpdatePlayerState` 计算

## 工作规则

- 不编造蓝图细节；有疑问先看工程/截图或问用户，确认后再写
- 笔记规范：文件名英文内容中文；截图语义命名；按课程章节组织；不留无图指代
