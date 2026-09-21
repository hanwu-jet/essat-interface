# 从论文机制到页面操作

依据用户提供的四份 PDF。下列页码均为 PDF 页序；“本页改编”与“补充关系”是阅读后的设计分析，不是作者共同验证的结论。

| 论文 | 原文机制与证据位置 | 本页真实操作 | 与 option2 的关系 |
| --- | --- | --- | --- |
| option2 | 问题陈述、初始程序、评价函数是实验定义的三个对象（§3，p.3）；迭代定义与低成本检查（§3.1，p.4）；概览、候选表、详情支持理解结果（§3.2，p.5；Fig.1、Fig.4）；看到初始结果再细化实验（§5.1，pp.6–7）。 | 观察时间和费用，更换“越快越好 / 准时后省钱”的选择标准，查看前后优先方案；可继续改要求和查候选详情。 | 整页主线是提出要求、观察结果、调整目标或判断标准、再比较。 |
| AIChains | Chain view 与 Step view 联动；可以编辑单步提示词、输出及链结构（§4.2，pp.7–8，Fig.3）；保留满意的局部结果，观察后续变化（§5.3.2–5.3.4，pp.11–12）。 | 修改“公交等车时间”这一中间值，仅公交总时长及其后续判断变化，其他走法保留。 | 将调整定位到具体步骤与中间结果。 |
| Cocoa | 逐步分配给人或 AI（§4.1.2，p.6）；执行遇到人负责的步骤时停下等待（§4.2.1，p.6）；人提供结果供后续使用（§4.2.3，p.8）；根据产物继续修改计划（§4.3，p.8）。 | 将确认等车时间分给自己；流程等待输入，人完成后，再更新后续比较。 | 将人的主动贡献与分工放进共同计划。 |
| Magentic-UI | 执行时暂停、接管与恢复（§4，pp.6–8，Fig.4）；潜在有害或不可逆操作前可要求人工批准（§6.4，p.14，Fig.8）；检查动作和结果（§4，pp.7–8）。 | 逐步模拟出行流程；暂停并改选走法，付费前确认或取消，结束后核对记录。 | 把控制延伸到已经开始的执行过程和具体动作。 |

## option2（本页文件名）

Alex Bäuerle, Adam Connors, Alexander Novikov et al. *Intentmaking and Sensemaking: Human Interaction with AI-Guided Mathematical Discovery*. 所提供版本为 arXiv:2605.05921v1。

[原文](https://arxiv.org/abs/2605.05921v1)

页面借鉴 Fig.1 的结果概览、候选比较及所选结果详情，以及 Fig.3 的实验定义与测试思路。原文研究数学发现；本页没有复现演化搜索、程序树、科研代码或有效性验证。评价函数在论文中由用户定义，AlphaEvolve 不能自行改写它（§3，p.3）；本页的选择标准也由用户显式改变。

## AIChains

Tongshuang Wu, Michael Terry, Carrie J. Cai. *AIChains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts*. CHI 2022.

[原文](https://doi.org/10.1145/3491102.3517582)

原文任务包括同伴评语和语言闪卡。步骤视图展示的是模型调用的输入、输出和提示，而非模型内部完整思维。本页仅通过确定的计算展示“局部修改 → 后续更新”。这不意味着只要步骤透明，目标就一定合理。

## Cocoa

K. J. Kevin Feng, Kevin Pu, Matt Latzke et al. *Cocoa: Co-Planning and Co-Execution with AI Agents*. CHI 2026.

[原文](https://doi.org/10.1145/3772318.3791673)

原文面向研究文档与文献工作，强调共同规划和共同执行交错进行，而不是只在运行前批准一次计划。Cocoa 也观察到用户的目标与问题理解随探索变化（§7.2.3，p.14），所以不能把“目标变化”说成 option2 独有。本页仅选取分工、等待人的步骤和使用人的产物三个机制。

## Magentic-UI

Hussein Mozannar, Gagan Bansal, Cheng Tan et al. *Magentic-UI: Towards Human-in-the-loop Agentic Systems*. 2025.

[原文](https://arxiv.org/abs/2507.22358)

本页选择执行接手、重要动作前确认及记录核对。没有实现其完整 ActionGuard 判别、安全环境、记忆或多任务机制。共享单车、公交和打车的“付费”都是教学情景，不会实际调用服务；免费步行不进入付费确认。

## 怎样理解三篇的“补充”

option2 着重解释人如何在观察中逐渐想清实验目标与评价方式。AIChains、Cocoa、Magentic-UI 分别提供具体步骤、共同分工、执行动作上的介入设计，可以用来进一步思考如何支持这种循环。四篇范围、任务、研究方法不同，本页不比较其效果大小，也不把它们排列成严格的监督层级。
