> 本页汇总第 01–13 课蓝图里出现过的**通用节点**，按用途分六类。
> 每个节点说明：**作用 → 针脚含义 → 什么时候用 → 本项目里的实例**。
> 先记住连线规则：白色粗线 = 执行流（先后次序）；彩色细线 = 数据（值传递）。无白线的节点是纯函数，只在被需要时计算。

---

## 一、事件入口类（流程的起点）

### Event BeginPlay

- **作用**：Actor 进入场景、游戏开始时触发**一次**。
- **针脚**：只有一条白色执行输出。
- **场景**：一次性初始化——激活输入映射、生成武器、初始化 UI。
- **实例**：第 04 课用它激活 `IMC_FPS_Input`；第 10 课在链尾调 `SpawnWeapon` 生成枪。

### Event Tick

- **作用**：**每帧**触发。
- **针脚**：`Delta Seconds`（绿 float）= 距上一帧的秒数，做时间相关计算时用。
- **场景**：需要持续跟随/轮询的逻辑。开销敏感，别在里面干重活。
- **实例**：第 05 课每帧把 Control Rotation 设给 Arm 的世界旋转；第 06 课每帧调 `UpdatePlayerState` + `UpdateMoveSpeed`。

### Event Blueprint Initialize Animation（动画蓝图）

- **作用**：动画蓝图初始化时触发**一次**，类似动画版的 BeginPlay。
- **场景**：缓存引用——把昂贵的 Cast 链结果存成变量。
- **实例**：第 10 课枪械 ABP 在这里一次性拿到人物动画蓝图引用。

### Event Blueprint Update Animation（动画蓝图）

- **作用**：动画蓝图**每帧**触发，类似动画版的 Tick。
- **针脚**：`Delta Time X`（绿 float）= 本帧间隔时间。
- **场景**：每帧同步变量给动画图用。
- **实例**：第 07 课人物 ABP 每帧把角色的 Move X/Y、E_PlayerState 拷进自己的变量。

### EnhancedInputAction IA_*（输入事件）

- **作用**：按键/鼠标输入触发的事件节点（第 03 课在 IMC 里绑好键位后可用）。
- **针脚**：
  - `Triggered`（白线）：键**按住期间持续**触发；
  - `Completed`（白线）：键**抬起时**触发一次；
  - `Action Value`（数据线）：输入的值，类型取决于 IA 的值类型（Vector2D / bool…）。
- **场景**：一切操作输入的入口。
- **实例**：第 04 课 IA_Move 的 Triggered 驱动移动，Completed 把 Move X/Y 清零；第 06 课 IA_Run 的 Triggered/Completed 分别写 `Want To Run = true/false`。

---

## 二、对象引用与类型转换类

### Cast To（类型转换）

- **作用**：把泛化的父类引用转成具体子类，解锁子类专属变量/函数。类比：确认一只 `Animal` 其实是 `Programmer`，才能让它写代码。
- **针脚**：
  - 执行输入/输出（白线）；
  - `Object`（深蓝，输入）：要转换的对象；
  - `As XXX`（深蓝，输出）：转换成功后的具体类型引用；
  - `Cast Failed`（白线）：转换失败走的分支——**建议接 Print String 调试，防止静默失败**。
- **场景**：拿到一个通用类型（Pawn、Actor、Controller）但要访问自己蓝图里的东西时。
- **实例**：第 04 课 `Cast To PlayerController` 排除 AI；第 10 课三层 Cast（BP_VIRTUS → BP_FPS_Player → ABP_FPSPlayer）逐层解锁，其中 Cast 到角色的唯一目的是取 `Arm` 变量。

### Try Get Pawn Owner

- **作用**：获取拥有这个动画蓝图的 Pawn。
- **针脚**：Target = self（动画蓝图自己）；`Return Value`（深蓝）= 通用 Pawn 引用。
- **场景**：动画蓝图里找「我附身的角色」。带 Try 是因为不保证有 Pawn。
- **实例**：第 07 课人物 ABP 用它拿到 Pawn，再 Cast 成 BP_FPS_Player。

### Get Controller

- **作用**：获取控制当前 Pawn 的控制器。Target = self 时，多人游戏各玩家各拿各的。
- **对比**：`Get Player Controller (Index 0)` 是写死第一个本地玩家的短写法，单机可用，联机/分屏会踩坑。
- **实例**：第 04 课 BeginPlay 链里用它拿控制器再绑输入。

### Get Owner / Get Owning Actor

- **作用**：`Get Owner` 拿 Actor 的拥有者（生成时 Owner 脚指定的对象）；`Get Owning Actor` 拿组件/动画蓝图所属的 Actor。
- **实例**：第 10 课枪械 ABP：`Get Owning Actor` → 拿到 BP_VIRTUS → `Get Owner` → 拿回归玩家（前提是 SpawnWeapon 时 Owner 接了 Self）。

### Get Anim Instance

- **作用**：获取骨骼网格体组件上正在跑的动画蓝图实例。
- **针脚**：**Target 必须接 SkeletalMeshComponent**（骨骼网格体），不能接角色 Actor。
- **实例**：第 10 课 Target 接角色的 `Arm` 变量，取到人物动画蓝图 ABP_FPSPlayer。

### Is Valid

- **作用**：检查对象引用是否有效（不为空、没被销毁）。
- **场景**：时序不确定时的保护——比如动画蓝图初始化早于武器生成。
- **实例**：第 11 课读 `Weapon` 变量前先 Is Valid，否则退出 PIE 时报 Accessed None。

---

## 三、输入与移动类

### Enhanced Input Local Player Subsystem + Add Mapping Context

- **作用**：增强输入系统的入口；`Add Mapping Context` 把一套按键映射（IMC）激活。
- **针脚**：`Mapping Context` = 选哪个 IMC；`Priority` = 多套映射冲突时的优先级（0 即可）。
- **场景**：游戏开局激活自定义输入。**注意接在 Cast 成功分支后**，别接 Cast Failed。
- **实例**：第 04 课 BeginPlay 链。

### Add Movement Input

- **作用**：给角色施加一个方向的移动输入。
- **针脚**：`World Direction`（蓝向量）= 移动方向；`Scale Value`（绿 float）= 强度/速度系数（接 -1~1 的轴值）。
- **实例**：第 04 课 前向向量 × Move X、右向向量 × Move Y 各接一个。

### Get Control Rotation + Get Forward/Right Vector

- **作用**：`Get Control Rotation` 拿玩家控制器朝向（黄 Rotator）；`Get Forward/Right Vector` 把旋转转成方向向量（蓝）。
- **要点**：移动时**只连 Z（Yaw）**，忽略抬头低头，保证前进方向贴地；抬臂视角时才连 Y（Pitch）+ Z。
- **注意**：Forward/Right Vector 要选**数学→向量**分类下的，别点成「变换」里的同名项。
- **实例**：第 04 课移动（只连 Z）、第 05 课 Tick 转 Arm（连 Y 和 Z）。

### Add Controller Yaw / Pitch Input

- **作用**：修改控制器的旋转——Yaw 左右转头、Pitch 抬头低头。
- **实例**：第 04 课 IA_Look：鼠标 X → Yaw，鼠标 Y → Pitch。「鼠标上滑却低头」在 IMC 里给 Y 加 Negate 修改器修，不要到处乘 -1。

---

## 四、流程控制与数据类

### Branch（分支）

- **作用**：菱形判断，按条件分流执行。
- **针脚**：`Condition`（红 bool，输入）；`True` / `False`（两条白线输出）。
- **实例**：第 06 课 `UpdatePlayerState` 用四个 Branch 串出 Aim > Run > Walk > Idle 的优先级链。

### SET / GET（变量读写）

- **作用**：SET 写变量（有白线进出，赋值完继续走）；GET 读变量（纯数据节点，无白线）。
- **技巧**：从节点引脚拖出后选「提升为变量（Promote To Variable）」可就地建变量。
- **实例**：第 06 课 `Set E_PlayerState`；第 07 课动画蓝图里四个 SET 把角色数据拷成自己的变量。

### Break Vector2D / 分割结构体引脚

- **作用**：把复合类型拆成分量（Vector2D → X、Y）。
- **等价做法**：右键任意结构体引脚选「分割结构体引脚」，省一个节点。
- **实例**：第 04 课拆 IA_Move 的 Action Value；**第 13 课拆 IA_Look 的 X/Y 用于灵敏度缩放**；第 10 课 SpawnActor 的 Spawn Transform **必须分割**（重组状态没值会编译报错）。

### 比较节点（`>`、`<`、`==`）

- **作用**：纯函数，输入两个值，输出红色布尔。无白线，不消耗执行流。
- **注意**：比较枚举要用**等于/不等于（枚举）**，别用数值版；搜「不等于」用英文输入法敲 `!`。
- **实例**：第 06 课 `Move X > 0`、`Velocity.Length > 0`；第 07–09 课 `E_PlayerState == Run`。

### Vector Length

- **作用**：向量 → 标量（模长，忽略方向）。
- **场景**：判断「角色实际有没有在动」。
- **实例**：第 06 课状态兜底判断、第 09 课 Aim 态里 Idle/Walk 混合的开关。

### OR / AND（布尔逻辑）

- **作用**：多条件组合。OR = 任一满足即放行。
- **实例**：第 09 课 ToIdle→Move：`(剩余时间 < 0.4) OR (E_PlayerState == Run)`——正常等动画播完，跑步则立刻切。

### Select

- **作用**：按输入值从多个候选里选一个输出（类似 switch）。
- **实例**：第 06 课 `UpdateMoveSpeed` 按 `E_PlayerState` 选出对应的 Max Walk Speed；**第 13 课 `UpdateScoreSensitivity` 按 `E_PlayerState` 选出不同状态下的灵敏度倍率（Aim=0.4）**。

### FInterp To（浮点插值）

- **作用**：每帧把当前值向目标值平滑逼近。
- **针脚**：`Current`（绿 float，当前值）→ `Target`（绿 float，目标值）→ `Delta Time`（绿 float，帧间隔）→ `Interp Speed`（绿 float，速度系数，越大越快）→ `Return Value`（绿 float，插值结果）。
- **场景**：FOV 缩放、相机参数、血量条、任何需要渐变过渡的数值。
- **实例**：**第 12 课**瞄准时 FOV 从 `105` 缩到 `75`、松开时恢复 `105`，`Delta Time = Get World Delta Seconds`，`Interp Speed = 8`。

### Nearly Equal（Float）

- **作用**：判断两个浮点数是否“足够接近”（差值小于 `Error Tolerance`），输出红色布尔。
- **针脚**：`A`、`B`（绿 float 比较值）→ `Error Tolerance`（绿 float 容差）→ `Return Value`（红 bool）。
- **场景**：浮点数不能直接 `==`，用这个判断过渡是否到位。
- **实例**：**第 12 课** `OutFOV` 里判断当前 FOV 与 `DefaultFOV` 差值是否小于 `0.1`，到了就停定时器。

### Set Timer By Event / Clear and Invalidate Timer by Handle

- **作用**：启动/停止一个定时器，到时间触发指定事件。
- **针脚**：
  - **Set Timer By Event**：`Event`（白线入口，要调用的自定义事件名）、`Time`（绿 float，延迟/周期秒数）、`Looping`（红 bool，是否循环）、`Return Value`（定时器句柄，**必须提升为变量**保存）。
  - **Clear and Invalidate Timer by Handle**：`Handle`（定时器句柄）——停止对应定时器。
- **场景**：需要“每帧/每隔一段时间重复执行”但又不想占用 `Event Tick`；尤其是一段只在特定条件下持续的平滑过渡。
- **实例**：**第 12 课**松开右键启动循环定时器调用 `OutFOV` 每帧恢复 FOV；再次按下右键时先 `Clear Timer` 防止两条链路打架。

### Custom Event（自定义事件）

- **作用**：用户自己命名的事件节点，可被定时器或其它执行线调用。
- **场景**：把一段需要被重复触发的逻辑（如恢复 FOV）封装成独立入口。
- **实例**：**第 12 课** `OutFOV` 自定义事件，负责把摄像机 FOV 从瞄准值平滑拉回默认。

### Get World Delta Seconds

- **作用**：获取上一帧到当前帧经过的秒数（绿 float）。
- **场景**：所有“随时间渐变”的计算都要乘它，保证 30fps 和 144fps 下速度一致；也可直接作为循环定时器的 `Time` 参数实现“每帧触发”。
- **实例**：**第 12 课** FOV 缩放的 `FInterp To.Delta Time`；**第 12 课** `Set Timer By Event.Time` 也接它，让 `OutFOV` 近似每帧执行。

### Multiply（乘法）

- **作用**：把两个或多个值相乘。
- **针脚**：默认两个绿色输入，可右键“添加引脚”继续加；输出乘积。
- **场景**：缩放——原始输入 × 灵敏度系数 × 状态倍率。
- **实例**：**第 13 课** `IA_Look` 的 `X / Y` 分量 × `MouseSensitivity` × `OutSensitivity`（来自 `UpdateScoreSensitivity`）后再喂给 `Add Controller Yaw/Pitch Input`。

### 自定义函数 / 纯函数（Pure Function）

- **作用**：把一段计算封装成可复用节点；纯函数**没有白色执行引脚**，只在数据被需要时自动求值。
- **设置**：函数细节面板勾选 **纯函数（Pure）**。
- **场景**：只读查表、根据状态返回配置值（灵敏度倍率、速度映射等），让 Event Graph 更干净。
- **实例**：**第 13 课** `UpdateScoreSensitivity` 按 `E_PlayerState` 返回灵敏度倍率（Idle/Walk/Run=1.0，Aim=0.4），无白线直连 `Multiply`。

### Print String

- **作用**：在屏幕左上角打印调试文字。
- **针脚**：`In String` = 内容；`Duration` = 显示时长，**0 = 一直显示**。
- **实例**：第 06 课打印角色状态/速度做调试；也可接在 Cast Failed 分支上。

---

## 五、场景操作类

### SpawnActor from Class

- **作用**：运行时动态生成一个 Actor。
- **针脚**：`Class` = 生成什么蓝图；`Spawn Transform`（橙）= 出生位置（**右键分割结构体引脚**，否则编译报错）；`Owner`（深蓝）= 拥有者；`Return Value` = 生成出来的实例引用（建议**提升为变量**保存）。
- **实例**：第 10 课 `SpawnWeapon`：生成 BP_VIRTUS，Owner 接 Self，返回值存为 `Weapon` 变量。

### Attach Actor to Component

- **作用**：把一个 Actor 附加到某个**组件**上（注意别选成「附加到 Actor」）。
- **针脚**：Target = 被附加的 Actor；`Parent` = 目标组件；`Location/Rotation/Scale Rule` = 变换规则，`Keep Relative` = 保持相对父级的位置。
- **实例**：第 10 课把枪附加到角色的 Arm 组件上。

### Set World Rotation

- **作用**：直接设置组件在**世界空间**的旋转。
- **对比**：`Set Relative Rotation` 是相对父级/插槽的本地旋转，容易和骨骼插槽搅在一起。
- **实例**：第 05 课 Tick 里把 Control Rotation 的 Y、Z 设给 Arm（X=0 不歪头），让手臂+相机+枪一起跟视角。

### Set Max Walk Speed

- **作用**：设置角色移动组件的最大行走速度。Target 接 Character Movement。
- **实例**：第 06 课按状态设 400 / 600 / 265，瞄准减速、跑步加速。

### Get Field Of View / Set Field Of View

- **作用**：读取/设置**摄像机组件**的 FOV（视场角，Field of View）。
- **针脚**：`Target` = `Camera`（摄像机组件，不能接角色 Actor）；`Value / Return Value` = 绿 float。
- **场景**：动态调整视野——瞄准收窄（像拉近），跑步/平时广角（更有速度感）。
- **实例**：**第 12 课**默认 FOV `105`；瞄准时用 `Set Field Of View` 配合 `FInterp To` 平滑缩到 `75`；`UpdateDefaultFOV` 函数用 `Get Field Of View` 在游戏开始时把默认值存进 `DefaultFOV` 变量。

---

## 六、动画图（AnimGraph）专用节点

> AnimGraph 里几乎没有白色执行线，全是「姿势数据」从左流向右，终点是 Output Pose。

### State Machine（状态机）

- **作用**：动画状态的容器，内部是「状态 + 转换规则」的图，对外输出当前激活状态算出的姿势。
- **内部**：`Entry` = 入口（默认状态从它连线）；双击状态进入该状态自己的小动画图；两个状态间的箭头 = 转换规则。
- **实例**：第 07–09 课的 Basic 状态机（Move / Run / Aim / ToAim / ToIdle）。

### BlendSpace Player（混合空间播放器）

- **作用**：按输入坐标在多段动画间混合（如八方向移动）。
- **针脚**：横/纵两个 float 输入对应混合空间的两个轴；输出接 Output Animation Pose。
- **实例**：第 07 课 Move 态：Move X → Forward 轴、Move Y → Right 轴。

### Animation Player（序列播放器）

- **作用**：直接播一个动画序列资产。
- **要点**：持续动作（Run、ADS）**必须勾「循环动画」**；一次性过渡（ToAim/ToIdle）**千万别勾**。
- **实例**：第 08 课 Run 态播 Sprint（勾循环）；第 09 课 ToAim 播 Idle_to_ADS（不勾）。

### Blend Poses by bool / Blend Poses（枚举）

同一族的姿势混合节点，区别只在「用什么值来选」：

| 节点 | 用什么选 | 针脚 |
|:---|:---|:---|
| **Blend Poses by bool** | 一个布尔 | `True Pose` / `False Pose`、`True Blend Time` / `False Blend Time`、`Active Value`（红色布尔输入） |
| **Blend Poses（枚举）** | 一个枚举 | `Default Pose` + 每个枚举值一个 Pose 脚（**右键节点「添加元素引脚」**手动加）、各自的 Blend Time、`Active Enum Value` |

- **Blend Time 的含义**：切到该姿势时的过渡秒数，不是播放时长。
- **实例**：第 09 课 Aim 态用 by bool，按「速度 > 0」在 ADS_Walk / ADS_Idle 间切（0.1 秒）；第 11 课用枚举版，按 `E_PlayerState` 在 Default / Aim 姿势间切（0.2 秒）。
- **另有 `Layered blend per bone`**（按骨骼分层混合，可做「上身瞄准、下身走路」）——本项目第 01–11 课**没有用到**，别和 by bool 搞混。

### Save cached pose / Use cached pose（缓存姿势）

- **作用**：把一份算好的姿势存起来（Save / New Save cached pose），后面多处取用（Use cached pose），**只算一次，省性能**。
- **实例**：第 11 课 Basic 状态机的姿势被 Default 和 Aim 两条支路共用，缓存后引用两次。

### Transform (Modify) Bone

- **作用**：程序化修改某根骨骼的位置/旋转/缩放。
- **针脚/参数**：`Bone to Modify` = 目标骨骼；`Translation` = 目标位置；平移模式 `Replace Existing` = 直接替换原位置；平移空间要和数据来源一致。
- **实例**：第 11 课把 `Head` 骨骼平移到枪械 AimSocket 的世界坐标（World Space），实现探头瞄准。

### Local To Component / Component To Local

- **作用**：姿势在骨骼本地空间 ↔ 组件空间之间转换。
- **要点**：**不用手工添加**——当上下游节点工作空间不匹配时，引擎连线会自动插入这两个「胶水」节点。
- **实例**：第 11 课 cached pose（本地空间）→ Modify Bone（组件空间）→ Blend Poses（本地空间）的链路上自动出现。

### Get Relevant Anim Time Remaining

- **作用**：获取源状态当前动画的**剩余秒数**（注意别选成「比例 Fraction」版本）。
- **场景**：转换规则里「过渡动画快播完才切走」。
- **实例**：第 09 课 ToAim→Aim、ToIdle→Move 都用 `< 0.4` 秒做准入条件。

### Can Enter Transition / Output Pose

- **Can Enter Transition**：转换规则图的终点，接红色布尔——true 才允许切换状态。
- **Output Pose / Output Animation Pose**：动画图/状态内部的最终出口，连进去的姿势就是实际播放结果。

---

## 附：数据类型与连线颜色速查

| 颜色 | 类型 | 本项目例子 |
|:---|:---|:---|
| ⚪ 白（粗） | 执行流 | 所有事件的执行顺序 |
| 🔴 红 | 布尔 Boolean | Want To Run、Branch 条件、Active Value |
| 🟢 绿 | 浮点 Float | Move X、Vector Length 输出、Blend Time |
| 🟡 黄 | **向量 Vector** | Velocity、Forward Vector |
| 🟣 紫 | **旋转器 Rotator** | Get Control Rotation 输出 |
| 🟠 橙 | 变换 Transform | SpawnActor 的 Spawn Transform |
| 🔵 蓝 | 对象引用 Object | Pawn、Arm、Weapon、Character Movement |
| 自定义色 | 枚举 Enum | E_PlayerState（Idle/Walk/Run/Aim） |

一句话记忆：**红色是判断题、绿色是数字、黄色是向量、蓝色是对象、白线是先后顺序**。

> **别把连线颜色和节点标题栏颜色混为一谈**：上表是引脚/连线的颜色（代表数据类型）；节点标题栏另有一套配色（事件红、纯函数绿、函数入口紫等），与数据类型无关。
