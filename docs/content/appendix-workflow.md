> 工程之外的知识：环境、Git、部署、笔记规范。这类东西最容易隔段时间就忘。

## 引擎与项目环境

- **引擎版本**：课程用 UE 5.7 录制，我的工程是 **5.8**
- **DDC（派生数据缓存）**：编辑器偏好设置 → 全局 → 派生数据缓存，改到 SSD 大盘；这是**本机偏好，不进 Git**，换电脑要重设
- **项目设置**：默认游戏模式 = `BP_FPS_GameMode`；近剪切平面 = 0.1（改完重启）
- **目录约定**：自己的蓝图放 `Content/Scripts/`（Players / Weapon / Input / System…），素材包 `XL_FPSPack` 不动

## Git 工作流

- **正仓库**：`D:\Unreal Projects\FPS_Game_Demo`（GitHub: `xtt55/FPS_Game_Demo`，**SSH** 认证；GitHub 早已停用密码认证）
- **换电脑**：直接 git pull/push，不再用"临时副本拷贝合并"那套（Demo1 流程已废弃）
- **.gitignore**：`Binaries/ Build/ DerivedDataCache/ Intermediate/ Saved/` 等引擎生成目录已排除，不要提交
- **.gitattributes**：`*.uasset / *.umap` 等标为 binary（禁止换行转换和自动合并）；`docs/` 下网页文件统一 `eol=lf`
- **Windows 目录大小写坑**：`Docs` 和 `docs` 在 Windows 是同一个目录，但 Git/GitHub 区分大小写——GitHub Pages 只认小写 `docs`，曾用 `git mv` 两步法（`git mv Docs tmp` → `git mv tmp docs`）修正

## 笔记站部署

- 站点源在仓库 `docs/`：内容是 `docs/content/*.md`，跑 `node docs/build/build.mjs` 生成静态 HTML（无需任何 npm 依赖）
- **GitHub Pages 免费版只支持公开仓库**；本仓库是私有的，所以用 **Cloudflare Pages**（免费、支持私有仓库）：
  - Cloudflare → Workers & Pages → Create → Connect to Git → 选 FPS_Game_Demo
  - Framework preset = None；Build command 留空；Output directory = `docs`
  - 部署后得到 `*.pages.dev` 域名，push 到 main 自动更新

## 笔记规范（长期约定）

1. **文件名英文、内容中文**（如 `AnimGraph_HeadAimAnim.md`），命名风格统一
2. **不留依赖外部图片的无图指代**——不写"如图1所示"又不贴图；要么贴图，要么用自洽的文字/ASCII 图
3. **截图语义化命名**：`l课号-描述.png`（如 `l10-spawnweapon-function.png`），不要留 `image-23.png` 这种
4. **按课程章节线性组织**，不按资源类型组织——否则前置依赖会让回忆顺序错乱
5. **不编造**：节点连接、变量来源、对象关系有疑问时，先对照工程或找人确认，写进笔记的必须是验证过的
