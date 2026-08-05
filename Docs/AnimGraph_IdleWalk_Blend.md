# AnimGraph 笔记：Idle / Walk 动画混合（Blend Poses by Bone）

> 项目：FPS_Game_Demo
> 相关蓝图：ABP_FPSPlayer（动画蓝图）
> 说明：本笔记对应 AnimGraph 中「根据角色实际移动速度，在 Idle 与 Walk 之间平滑切换」的节点图。

---

## 一、整体作用

这张图做的事情：**根据角色实际移动速度，在 Idle（待机）和 Walk（行走）两个动画之间平滑切换**。

相比纯状态机，这里用了 **Blend Poses by Bone（按骨骼混合）** 节点做过渡，不会生硬跳切动画。

---

## 二、节点逐个解释（数据流从底到顶）

### ① Character Movement（深蓝色，变量 Getter）
- **来源**：从「我的变量」面板拖出的 `CharacterMovementComponent` 对象引用。
- **作用**：拿到角色身上的移动组件，后续从它身上取速度。

### ② Velocity（深蓝色针脚）
- **作用**：从 `Character Movement` 组件读取当前帧的**速度向量（Vector）**。
- **输入**：`Target` 针脚接上面的 Character Movement（告诉它去哪个组件身上取）。
- **输出**：一根**蓝色细线（Vector 类型）**，代表 `(X, Y, Z)` 三轴速度。

### ③ Vector Length（绿色，纯函数节点）
- **作用**：把蓝色速度向量变成一个**绿色标量（float）**——即速度的「大小 / 模长」，忽略方向。
- **输入**：`A` 针脚接 Velocity 的蓝色输出。
- **输出**：`Return Value`（绿色 float）。站着不动 ≈ 0.0；走路 ≈ 200~400；跑步 ≈ 600+。
- **说明**：无白色执行线 → 这是**纯函数**，不消耗执行流，需要值时才算。

### ④ `> 0.0` 比较（隐含节点）
- 图上有绿色常量 `0.0...`，与 Vector Length 的结果做比较。
- **输出一根红色布尔线（true/false）**，即下面的 `Active Value`。
- 含义：判断「速度是否 > 0」（在移动为 true，静止为 false）。

### ⑤ Blend Poses by Bone（核心混合节点，绿色标题栏）
整张图最重要的节点：

| 针脚 | 类型 | 含义 |
|:---|:---|:---|
| **True Pose** | 动画姿势 | 条件为 true 时播放 → 接 Walk |
| **False Pose** | 动画姿势 | 条件为 false 时播放 → 接 Idle |
| **True Blend Time** | float (绿) | 切到 True Pose 的过渡时间 = **0.1 秒** |
| **False Blend Time** | float (绿) | 切回 False Pose 的过渡时间 = **0.1 秒** |
| **Active Value** | bool (红) | 判断条件 → 接「速度是否 > 0」 |

- **效果**：角色开始移动时，用 0.1 秒从 Idle 平滑混合到 Walk；停下时用 0.1 秒混回来，不会瞬间跳切。
- **「by Bone」含义**：可指定某些骨骼用不同权重混合（默认全骨骼统一）。高级用法可做「上身瞄准、下身走路」的分层效果。

### ⑥ Player_MCV_VIRTUS_AJS_Walk / Idle（Animation Player）
- **Walk**：播放行走循环动画 → 连到 `True Pose`。
- **Idle**：播放待机 idle 动画 → 连到 `False Pose`。
- 都是 `Animation Player` 节点，直接引用 `.uasset` 动画资产。

### ⑦ Output Animation Pose（最终出口）
- 整个 AnimGraph 的终点，连进去的 Pose 即角色这帧实际渲染的姿势。

---

## 三、数据流全景（从底到顶）

```
Character Movement (组件)
    ↓ (深蓝对象线)
Velocity (取速度向量)
    ↓ (蓝色向量线)
Vector Length (向量 → 标量)
    ↓ (绿色 float 线)
[> 0.0] 比较
    ↓ (红色 bool 线)
Blend Poses by Bone.Active Value
    ├─ True  → Walk Animation Player → True Pose
    └─ False → Idle Animation Player → False Pose
    ↓ (混合后的姿势)
Output Animation Pose → 屏幕上的角色
```

---

## 四、与之前状态机（Event Graph）的关系

现在有两套东西同时在工作：

| 位置 | 做什么 | 驱动数据 |
|:---|:---|:---|
| **Event Graph**（之前做的） | 每帧算 `EPlayerState` 枚举（Idle/Walk/Run/Aim） | 输入轴 Move X/Y + Want to Run + Want to Aim |
| **AnimGraph**（本图） | 根据**实际速度**混合 Idle/Walk 动画 | Character Movement.Velocity 的长度 |

**关键区别**：
- Event Graph 用**输入意图**（玩家是否按键）。
- AnimGraph 用**实际物理结果**（角色真的有没有在动）。

两者不完全一致，但这正是正确的分工：
- 按了 W 但被墙挡住 → 输入有、速度 = 0 → 逻辑说 Walk，视觉播 Idle（✅ 对）。
- 松开按键但惯性滑行 → 输入无、速度 > 0 → 逻辑说 Idle，视觉播 Walk（✅ 对）。

**结论**：Event Graph 管逻辑状态，AnimGraph 管视觉表现，各管各的。

---

## 五、下一步建议（待补）

当前 AnimGraph 只覆盖 **Idle ↔ Walk** 两种状态，要完整闭环还需接入 `EPlayerState` 的 Run、Aim：

1. 加 `Blend Poses by Bone` 或 `Layered Blend per bone` 处理 **Aim**（通常只影响上半身 / 脊椎以上骨骼）。
2. **Run** 可用同一个 Walk 动画但 `Play Rate` 设 1.5~2.0，或单独做 Run 动画。
3. 用 `EPlayerState` 枚举当条件，替代现在的「速度 > 0」，实现四态切换。

---

## 附：UE5 蓝图颜色速查

| 颜色 | 类型 | 本图出现位置 |
|:---|:---|:---|
| 白 / 橙粗线 | 执行流 | （本图 AnimGraph 主要为数据流，执行线极少见） |
| 深蓝 | 对象引用 | Character Movement、Velocity 的 Target |
| 绿色 | float | Vector Length 输出、常量 0.0、Blend Time |
| 蓝色 | 向量 Vector | Velocity |
| 红色 | 布尔 Boolean | Active Value、比较节点输出 |
| 自定义 / 暗色 | 枚举 Enum | EPlayerState（Event Graph 中） |
