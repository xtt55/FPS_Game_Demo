> UE 编辑器中文本地化有些翻译**不准确甚至误导**，看英文教程/文档时也容易对不上。
> 本页收集中英对照 + 实际含义，踩过翻译坑的条目加 ⚠️。

## ⚠️ 踩过坑的翻译

| 英文 | 编辑器中文 | 实际含义 |
|:---|:---|:---|
| **Negate** | 否定 | **取反/相反方向**（不是"否定这个输入"）。IMC 修改器，用于 S 键、鼠标 Y |
| **Swizzle Input Axis Values** | 拌合输入轴值 | **交换/重排坐标轴**（如 YXZ 表示换到另一根轴）。用于 A/D 键换到 X 轴 |
| **Velocity** | 速度 | **速度向量**（有方向）。判断"有没有在动"要用 Vector Length 取模长 |
| **Get Relevant Anim Time Remaining** | 获取相关剩余动画时间 | 源状态动画的**剩余秒数**；还有同名的 Fraction（比例 0~1）版本，别选错 |

## 输入系统

| 英文 | 中文 | 说明 |
|:---|:---|:---|
| Input Action (IA) | 输入操作 | 一个动作（移动/视角/跑/瞄），有值类型（bool / Vector2D…） |
| Input Mapping Context (IMC) | 输入映射上下文 | 一套 IA ↔ 键位的映射表 |
| Modifier | 修改器 | 挂在映射上改输入值（Negate / Swizzle…） |
| Triggered | 触发中 | 键按住期间持续触发 |
| Completed | 已完成 | 键抬起时触发一次 |
| Enhanced Input Local Player Subsystem | 增强输入本地玩家子系统 | 增强输入的入口，Add Mapping Context 从这拿 |

## 框架与对象

| 英文 | 中文 | 说明 |
|:---|:---|:---|
| Pawn | （棋子） | 可被控制器操控的角色基类 |
| Controller | 控制器 | Pawn 的"大脑"；PlayerController=玩家，AIController=AI |
| GameMode | 游戏模式 | 规定用哪个 Pawn 等规则；项目设置=全局，世界场景设置=仅当前关卡 |
| Default Pawn Class | 默认 Pawn 类 | GameMode 里指定生成哪个角色 |
| Cast To | 类型转换 | 父类引用 → 子类，解锁子类成员；有 Cast Failed 分支 |
| Owner / Owning Actor | 拥有者 | 生成时指定的归属对象 / 组件所属的 Actor |
| Anim Instance | 动画实例 | 骨骼网格体上正在跑的动画蓝图实例 |
| Socket | 插槽 | 骨骼上的挂点（配件、瞄准定位用），来自骨骼资产本身 |

## 动画

| 英文 | 中文 | 说明 |
|:---|:---|:---|
| Animation Blueprint (ABP) | 动画蓝图 | Event Graph 同步数据 + AnimGraph 算姿势 |
| Blend Space (BS) | 混合空间 | 按坐标轴在多段动画间混合（八方向移动） |
| State Machine | 状态机 | 状态 + 转换规则的容器 |
| Transition Rule | 转换规则 | 状态间连线的准入条件，结果接 Can Enter Transition |
| Blend Poses by bool | 按布尔混合姿势 | 按一个布尔在两个姿势间切换并平滑过渡（本项目 Aim 态用它） |
| Layered blend per bone | 按骨骼分层混合 | 按骨骼分权重混合（可做上身瞄准+下身走路）；**本项目未用到**，别和 by bool 混淆 |
| Pose | 姿势 | 骨骼当前的位置/旋转/缩放状态；AnimGraph 里流动的就是它，终点是 Output Pose |
| PIE | 在编辑器中运行 | Play In Editor，点编辑器的运行按钮试玩 |
| ADS | 瞄准（开镜） | Aim Down Sights，动画资产名里的 ADS_Idle / ADS_Walk 就是瞄准状态的待机/行走 |
| DefaultSceneRoot | 默认场景根组件 | 新建 Actor 蓝图时自带的空根节点，可被自己加的组件拖上去覆盖 |
| cached pose | 缓存姿势 | Save 存一次、Use 多处引用，省性能 |
| Loop (Animation) | 循环动画 | 持续动作要勾；一次性过渡（ToAim/ToIdle）千万别勾 |
| Blend Time | 混合时长 | 过渡秒数；硬插值太长会僵，可用过渡动画序列替代 |
| Transform (Modify) Bone | 变换（修改）骨骼 | 程序化改骨骼位置/旋转/缩放 |
| Montage | 蒙太奇 | 动画序列的可编程播放包装（开火/换弹用，后续课程） |

## 渲染与性能

| 英文 | 中文 | 说明 |
|:---|:---|:---|
| Derived Data Cache (DDC) | 派生数据缓存 | 编译好的着色器/贴图缓存；放 SSD，别放 C 盘 |
| Near Clip Plane | 近剪切平面 | 摄像机最近可见距离，FPS 改 0.1，改完重启 |
| Accessed None | 读取了空对象 | 运行时错误，用 Is Valid 防护 |
| World / Relative / Component / Local Space | 世界/相对/组件/本地空间 | 坐标系选择；Modify Bone 空间必须和数据来源一致 |
