跟随 B 站教程《[FPS游戏开发教程 | UE5制作第一人称射击游戏 | 虚幻引擎5.7 零基础入门](https://www.bilibili.com/video/BV1aw9jBeEHr)》（星露Studio）的跟做笔记，基于工程 **FPS_Game_Demo**（UE 5.8）。

## 这份笔记的特点

- **按课程章节线性组织**：每一课一页，照着顺序就能从头回忆整个工程是怎么一步步搭起来的。
- **以我自己的工程为准**：蓝图命名、节点连接、截图全部来自我自己的工程（如 `BP_FPS_Player`、`ABP_FPSPlayer`、`ABP_VIRTUL`）。
- **节点级讲解**：每张蓝图都解释节点和引脚的作用、数据流向，而不只是"点这里"。

## 章节

<div class="lesson-grid">
<a class="lesson-card" href="lesson-01.html"><div class="n">第01课</div><div class="t">创建项目及导入素材</div></a>
<a class="lesson-card" href="lesson-02.html"><div class="n">第02课</div><div class="t">修改DDC缓存路径</div></a>
<a class="lesson-card" href="lesson-03.html"><div class="n">第03课</div><div class="t">配置游戏模式及输入</div></a>
<a class="lesson-card" href="lesson-04.html"><div class="n">第04课</div><div class="t">实现角色基本能力</div></a>
<a class="lesson-card" href="lesson-05.html"><div class="n">第05课</div><div class="t">完善角色细节</div></a>
<a class="lesson-card" href="lesson-06.html"><div class="n">第06课</div><div class="t">制作角色能力系统</div></a>
<a class="lesson-card" href="lesson-07-09.html"><div class="n">第07–09课</div><div class="t">制作动画系统（上/中/下）</div></a>
<a class="lesson-card" href="lesson-10.html"><div class="n">第10课</div><div class="t">模块化设计及DeBug</div></a>
<a class="lesson-card" href="lesson-11.html"><div class="n">第11课</div><div class="t">完善瞄准系统（上）</div></a>
<a class="lesson-card" href="appendix-nodes.html"><div class="n">附录</div><div class="t">蓝图通用节点速查</div></a>
</div>

## 核心资产速查

| 资产 | 类型 | 作用 |
|:---|:---|:---|
| `BP_FPS_Player` | 蓝图类（角色） | FPS 玩家角色，移动/视角/状态逻辑都在这里 |
| `BP_FPS_GameMode` | 蓝图类（游戏模式） | 指定默认 Pawn 为 BP_FPS_Player |
| `IMC_FPS_Input` + `IA_*` | 增强输入 | 移动 / 视角 / 跑步 / 瞄准的输入映射 |
| `EPlayerState` | 枚举 | Idle / Walk / Run / Aim 四种角色状态 |
| `ABP_FPSPlayer` | 动画蓝图（人物） | **权威数据源**，驱动手臂动画 |
| `ABP_VIRTUL` | 动画蓝图（枪械） | 复用 ABP_FPSPlayer 的变量，驱动枪械动画 |
| `BS_FPSPlayer` / `BS_VIRTUL` | 混合空间 | 八方向移动动画混合（人物 / 枪械） |
| `BP_WeaponBase` | 蓝图类（Actor） | 枪械基类，保存枪械共有属性 |
| `BP_VIRTUS` | 蓝图类（继承 WeaponBase） | 具体枪械（Virtus，类似 AK47） |
