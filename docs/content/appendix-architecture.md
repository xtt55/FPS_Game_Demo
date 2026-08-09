> 整个 FPS_Game_Demo 的数据流总图：输入怎么一路变成屏幕上的动画。
> 各课讲的是「每一块怎么搭」，本页讲「块与块怎么连」。

## 一、主链路：输入 → 动画

```
鼠标 / 键盘
   │
   ▼
IA_Look / IA_Move / IA_Run / IA_Aim        （输入操作，第03课）
   │  由 IMC_FPS_Input 映射键位
   ▼
BP_FPS_Player 的变量
   ├─ Move X / Move Y        （IA_Move 缓存，Completed 清零）
   ├─ Want To Run / Want To Aim（输入意图，IA_Run/IA_Aim 写入）
   └─ E_PlayerState          （UpdatePlayerState 每帧算出：Idle/Walk/Run/Aim）
   │
   ▼ 每帧 Event Blueprint Update Animation 同步（Cast To BP_FPS_Player 读变量）
ABP_FPSPlayer（人物动画蓝图）★ 权威数据源
   │
   ├─ AnimGraph：Basic 状态机（Move/Run/Aim/ToAim/ToIdle）→ 手臂动画
   │
   └─◄ ABP_VIRTUL（枪械动画蓝图）从这里读变量
        （Initialize 一次性缓存人物 ABP 引用，Update 每帧复用，零 Cast）
        → 枪械自己的 AnimGraph → 枪械动画
```

**关键规则**：

- `BP_FPS_Player` 是数据的**生产者**；`ABP_FPSPlayer` 是动画侧的**权威数据源**；`ABP_VIRTUL` 是**复用者**——它不直接 Cast 角色，只读人物 ABP 已同步好的变量。
- 方向是单向的：角色 → 人物 ABP → 枪械 ABP。**不要反向，也不要让枪械 ABP 直接读角色**（会同步失败/卡顿，见[第10课](lesson-10.html)）。

## 二、瞄准数据链（第 11 课）

```
枪骨骼 body 上的 AimSocket 插槽（定位用，存在骨骼资产里）
   │
   ▼ BP_WeaponBase.getAimSocketLocation()（基类函数，所有枪通用）
世界空间坐标 AimSocketLocationReturn
   │
   ▼ BP_FPS_Player.Weapon 变量（SpawnWeapon 时 SpawnActor 返回值提升而来）
   │    ↑ 注意 Is Valid：ABP 初始化早于武器生成
   ▼ ABP_FPSPlayer Event Graph 每帧读取存入同名变量
   ▼
AnimGraph：Transform (Modify) Bone（Bone=Head，Replace Existing，World Space）
   → Blend Poses (E_PlayerState)：Aim 时头凑到插槽，0.2 秒过渡
```

**关键规则**：插槽函数写在**基类** `BP_WeaponBase`（换枪通用）；Modify Bone 的平移空间必须和数据来源一致（都是世界空间）。

## 三、两条「意图 vs 结果」的分工

| 层 | 管什么 | 数据源 | 例子 |
|:---|:---|:---|:---|
| **Event Graph / 角色蓝图** | 逻辑状态 | **输入意图**（玩家按了什么键） | UpdatePlayerState 用 Want To Run/Aim + Move X 算枚举 |
| **AnimGraph** | 视觉表现 | **实际物理结果**（角色真的在动吗） | Aim 态内用 Velocity.Length > 0 混合 ADS Idle/Walk |

按了 W 但被墙挡住：逻辑说 Walk，视觉播 Idle——两者都对，各管各的。

## 四、事件频率地图（哪里跑几次）

| 事件 | 频率 | 放什么 |
|:---|:---|:---|
| Event BeginPlay | 一次 | 激活输入映射（Add Mapping Context）、调 SpawnWeapon |
| Event BlueprintInitializeAnimation | 一次 | 多层 Cast 链 + 缓存引用（**性能关键**） |
| Event Tick | 每帧 | 视角同步到 Arm、UpdatePlayerState、UpdateMoveSpeed |
| Event BlueprintUpdateAnimation | 每帧 | 只读写变量，**禁止 Cast** |

## 五、资产关系图

```
BP_FPS_GameMode ──指定默认 Pawn──► BP_FPS_Player
                                      │ 组件：Arm（挂 Camera）、生成并 Attach
                                      ▼
BP_WeaponBase ◄──继承── BP_VIRTUS（SK_MCX-VIRTUS + 配件 + AimSocket）
                                      │ 动画类
                                      ▼
ABP_FPSPlayer（手臂）        ABP_VIRTUL（枪械，读人物 ABP 变量）
   │ 使用                        │ 使用
   ▼                            ▼
BS_FPSPlayer（人物混合空间）   BS_VIRTUL（枪械混合空间，参数与人物一致）
```
