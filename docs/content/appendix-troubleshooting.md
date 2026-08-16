> 按**症状**索引的踩坑速查表。遇到怪事先在这里搜症状，比按课翻快。
> 每条注明出处课程，点进去看详细上下文。

## 输入与移动

| 症状 | 原因 | 修复 | 出处 |
|:---|:---|:---|:---|
| 松开按键角色一直走 | IA_Move 的 **Completed** 没把 Move X/Y 清零（Triggered 松开后就停跑，变量卡在最后的值） | Completed 分支补 SET Move X/Y = 0 | [第04课](lesson-04.html) / [第06课](lesson-06.html) |
| 鼠标上滑视角却向下 | 鼠标 Y 轴方向反了 | 在 **IMC 的 IA_Look** 上加修改器 **Negate**（只反转 Y），不要到处乘 -1 | [第03课](lesson-03.html) |
| WASD 左右反了/前后左右对调 | A/D 漏了 Swizzle，或 A 漏了 Negate | W 默认；S=Negate；D=Swizzle；A=Swizzle+Negate | [第03课](lesson-03.html) |
| 低头按 W 越走越慢/卡住 | 移动时把 Pitch 也喂给了方向向量 | Get Control Rotation **只连 Z（Yaw）** | [第04课](lesson-04.html) |
| 鼠标视角完全不动 | `MouseSensitivity` 默认值为 `0`，或 `IA_Look` X/Y 没乘灵敏度就给了 `Add Controller ... Input` | 检查 `MouseSensitivity` 默认 `0.7`，并确认乘法节点两个输入都有 | [第13课](lesson-13.html) |
| 瞄准时鼠标还是很快/很慢 | `Aim` 状态灵敏度倍率设反，或 `Out Sensitivity` 根本没乘 | 确认 `UpdateScoreSensitivity` 里 `Aim=0.4`，并且 `X/Y` 同时乘 `MouseSensitivity × Out Sensitivity` | [第13课](lesson-13.html) |
| 鼠标上下左右反向 | `Yaw` / `Pitch` 接反（X 接了 Pitch，Y 接了 Yaw） | `X` → `Add Controller Yaw Input`；`Y` → `Add Controller Pitch Input` | [第13课](lesson-13.html) |
| 纯函数节点非要接执行线 | `UpdateScoreSensitivity` 没勾 **纯函数** | 函数 Details 面板勾选 **纯函数（Pure）** | [第13课](lesson-13.html) |
| 只按跑步键跑不起来 | 设计上必须 **W + 跑步键**同时（Move X > 0 且 Want To Run） | 不是 bug，是优先级设计 | [第06课](lesson-06.html) |
| 配完输入按键完全没反应 | 第 03 课只配了映射，**还没写移动逻辑**；或 GameMode 没在项目设置里指定 | 先确认项目设置→默认模式；逻辑在第 04 课 | [第03课](lesson-03.html) |
| 换关卡后 GameMode 失效 | 只设了「世界场景设置→游戏模式重载」（仅当前关卡） | 改到项目设置→默认模式（全局） | [第03课](lesson-03.html) |
| 自定义相机后上下看没反应 | 引擎不再代管默认摄像机，缺 Tick 同步 | Event Tick → Get Control Rotation → Set World Rotation 到 Arm（连 Y、Z） | [第05课](lesson-05.html) |
| 奔跑时画面只有平移没有晃动 | Camera 的「使用 Pawn 控制旋转」没关 | 取消勾选 | [第05课](lesson-05.html) / [第10课](lesson-10.html) |
| 枪口/手臂太近被裁掉 | 近剪切平面（Near Clip Plane）默认值太大 | 项目设置改为 0.1，**改完重启引擎** | [第05课](lesson-05.html) |

## 动画

| 症状 | 原因 | 修复 | 出处 |
|:---|:---|:---|:---|
| 前后左右都没动画，一直 Idle | Update Animation 里 **Cast 的执行针没接** | 接上白色执行线 | [第07课](lesson-07-09.html) |
| 动画前后和左右对调 | Move X/Y 接混合空间时接反 | Move X → Forward 轴，Move Y → Right 轴 | [第07课](lesson-07-09.html) |
| 搜 `run` 找不到跑步动画 | 序列名是 **Sprint** | 搜 `sprint` | [第08课](lesson-07-09.html) |
| 搜索框搜不到「不等于」节点 | 中文输入法敲了 `！` | 切英文输入法敲 `!`，选「不等于（枚举）」 | [第08课](lesson-07-09.html) |
| 枚举比较不生效 | 用了数值的「等于」 | 用**等于/不等于（枚举）** | [第08课](lesson-07-09.html) |
| 冲刺/瞄准动画播一次就停 | 忘勾**循环动画** | 序列节点 Details 勾 Loop | [第08/09课](lesson-07-09.html) |
| 永远进不了 Aim / 回不了 Move | ToAim/ToIdle **勾了循环**（过渡动画永远播不完，剩余时间永不 < 0.4） | 过渡序列**不要**勾循环 | [第09课](lesson-07-09.html) |
| 松瞄再冲刺有明显延迟 | ToIdle→Move 缺 **OR Run** | 条件改为 `(剩余时间<0.4) OR (E_PlayerState==Run)` | [第09课](lesson-07-09.html) |
| 手臂和枪动画穿模/不同步 | 两边混合空间的平滑时间/过渡曲线不一致 | 人物与枪械参数保持一致 | [第07课](lesson-07-09.html) |
| 瞄准时只会站着瞄，走动没变化 | Event Graph 没同步 Character Movement 进 ABP | 补 GET Character Movement → 提升为变量 | [第09课](lesson-07-09.html) |

## 武器与模块化

| 症状 | 原因 | 修复 | 出处 |
|:---|:---|:---|:---|
| 人物方向失灵、无法移动 | 枪械部件和角色胶囊**互卡碰撞** | 枪械主体+枪管+弹匣+倍镜+枪托全部 **NoCollision** | [第10课](lesson-10.html) |
| 场景里没有枪 | 写了 `SpawnWeapon` 但没在 BeginPlay 调用 | BeginPlay 链尾调 SpawnWeapon | [第10课](lesson-10.html) |
| SpawnActor 编译报错 | Spawn Transform 是重组状态没有值 | 右键**分割结构体引脚**（默认 0 即可，位置靠 Attach） | [第10课](lesson-10.html) |
| 枪械 ABP 拿不到玩家 | SpawnActor 的 **Owner 没接 Self** | Owner ← self | [第10课](lesson-10.html) |
| 狂按瞄准/奔跑时人枪脱节、卡顿 | 枪械 ABP 每帧自己 Cast 角色拿变量 | 重构：Initialize 缓存人物 ABP 引用，Update 只读缓存 | [第10课](lesson-10.html) |
| Get Anim Instance 拿不到东西 | Target 接了角色 Actor | Target 必须接**骨骼网格体**（Arm 变量） | [第10课](lesson-10.html) |
| 配件飘在半空 | 没设父项插槽，或设了还飘 | 设父项插槽 + 位置/旋转重置为 0 | [第05课](lesson-05.html) |

## 瞄准

| 症状 | 原因 | 修复 | 出处 |
|:---|:---|:---|:---|
| 退出 PIE 报 Accessed None（Weapon 为空） | ABP 初始化早于 SpawnWeapon 赋值 | 读 Weapon 前先过 **Is Valid** | [第11课](lesson-11.html) |
| 瞄准时头漂到奇怪位置 | AimSocket 名字拼错，Get Socket Location 退回组件原点 | 插槽名复制粘贴，别手打 | [第11课](lesson-11.html) |
| 头凑过去但对不齐瞄具 | Modify Bone 用了组件空间，或平移模式不是替换 | 平移空间 **World Space** + 模式 **Replace Existing** | [第11课](lesson-11.html) |
| 瞄准头不动 | Blend Poses 枚举节点没加 Aim 引脚，或 Aim 支路没接 Modify Bone | 右键「添加元素引脚 Aim」并接好支路 | [第11课](lesson-11.html) |
| 按下右键 FOV 突变 / 没有缩放动画 | `Set Field Of View` 直接设 `75`，没有用 `FInterp To` 或 `Interp Speed=0` | 用 `FInterp To`，`Target=75`，`Interp Speed=8`，`Delta Time=Get World Delta Seconds` | [第12课](lesson-11.html) |
| 松开右键 FOV 不恢复 / 只恢复一帧 | `Set Timer By Event` 没勾 **Looping**，或句柄没存 | 勾 `Looping`，`Return Value` 提升为 `OutFOVHandle` 变量 | [第12课](lesson-11.html) |
| 按瞄准时 FOV 抖动 / 缩放和恢复打架 | 没清掉已有的恢复定时器 | 按下右键的 Triggered 分支先 `Clear and Invalidate Timer by Handle` | [第12课](lesson-11.html) |
| FOV 恢复到 105 附近还一直循环 / 回不到 105 | `Nearly Equal` 容差不合适，或 `DefaultFOV` 写死 | `Error Tolerance=0.1`；用 `UpdateDefaultFOV` 在游戏开始时从 Camera 读取默认值 | [第12课](lesson-11.html) |
| 全息准星快速移动时被拉成长条 | 材质被动态模糊一起处理了 | 准星材质半透明通道设为 **After Motion Blur**（动态模糊后） | [第12课](lesson-11.html) |

## 编辑器与环境

| 症状 | 原因 | 修复 | 出处 |
|:---|:---|:---|:---|
| 每次开工程都重新编译着色器、C 盘爆红 | DDC 在默认系统盘路径 | 编辑器偏好设置把全局本地 DDC 改到 SSD 大盘 | [第02课](lesson-02.html) |
| IA/IMC 打开成悬浮小窗 | 资产编辑器打开位置默认新窗口 | 编辑器偏好设置搜 open → 改为「主窗口」 | [第03课](lesson-03.html) |
| IMC 加映射点错加号 | Default Key Mappings 上下有两个 `+` | 点**上面那个** | [第03课](lesson-03.html) |
| Forward/Right Vector 节点找不到/行为怪 | 点成了「变换」分类下的同名项 | 选**数学→向量**分类 | [第04课](lesson-04.html) |

## 通用调试三板斧

1. **Print String**：`Duration = 0` 让打印常显在屏幕左上角，盯变量值最直观（第 06 课打印过枚举状态和速度）。
2. **Cast Failed 接 Print String**：Cast 失败是**静默**的，不接打印你永远不知道链断了。
3. **怀疑时序就加 Is Valid**：凡是"A 生成/初始化可能晚于 B 读取"的地方（如武器 vs 动画蓝图），先 Is Valid 护住再调函数。
