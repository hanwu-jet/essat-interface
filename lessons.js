'use strict';
// These controlled lessons illustrate mechanisms; they do not call a model.
const lessonCatalog={
 '锚点论文':[
  {short:'失败也需要方向',title:'四个方案都失败了，下一步往哪改？',intro:'只给“成 / 败”，可能分不清离目标很近的尝试和差得很远的尝试。给出距离目标还有多远的反馈，同时守住达标条件。',facts:['去 3 公里外的公司','10 分钟内到，最多 20 元','四种走法都来不及'],finding:'超平面问题中，团队和参与者发现奖励太稀疏，讨论用部分分数提供方向，同时对漏掉的边保持高惩罚。',example:'原文讨论了用更细的分数区分接近目标的构造，也提醒数学里的 99% 不能当成 100%。',method:'外部 11 位数学家的三个月使用研究中的对话与观察；没有单独验证这种评分修改的效果。',ref:'§5.1，PDF p.7',response:'我们把“是否达标”和“还差多少”分开显示。更有方向，不等于已经找到可用方案。',boundary:'固定候选的教学对照，不运行演化搜索，不能据此声称搜索速度提高。'},
  {short:'高分也可能有漏洞',title:'看起来更快，其实只是少算了时间',intro:'当分数只看候选自己报出的数字，候选可能“看起来很好”。试着核对数据，再修正判断规则。',facts:['去 3 公里外的公司','20 分钟内到，最多 5 元','公交报告漏算了步行和等车'],finding:'参与者报告，演化产生的代码自定义了列表类型、改变长度的含义，绕过评分；准备阶段的代码检查也没有消除全部漏洞。',example:'候选程序钻了评价规则的空子，并不是 AlphaEvolve 直接改写了评价函数。',method:'参与者报告与研究者归纳；是实际遇到的失败方式，没有给出通用漏洞检测的成功率。',ref:'§5.3，PDF p.7；§6.2，p.9',response:'先逐段核验，再让评分读取完整用时。评价规则和候选自报结果需要分别检查。',boundary:'公交漏算是预设类比，不是本页 AI 实际发现的漏洞；逐段加总也不是通用的防作弊方法。'}
 ],
 aichains:[
  {short:'从重试到局部修改',title:'同一个错误，两种修改入口',intro:'已知公交要等 12 分钟，原估计却写了 5 分钟。Sandbox 可以用文本修改；AIChains 把中间结果单独摆出来。两边都能改对。',facts:['3 公里 / 25 分钟 / 20 元','已知要等 12 分钟','两种界面共用同一份数据'],finding:'没有改提示就重跑的平均比例从 Sandbox 的 51% 降至 Chaining 的 36%；编辑操作也更多用于整理已有内容。',example:'P10 喜欢固定已经满意的中间结果，避免后续调整让前面的进展丢失。',method:'20 人使用两种界面的对照研究；完成时间没有显著差异。结果不是“链越长越快”。',ref:'§5.1–5.2，PDF pp.8–10；§5.3.2，pp.11–12',response:'同样允许修正文本，也提供明确的中间值入口，并显示相关更新与保留部分。',boundary:'原 Sandbox 可编辑提示和输出、反复运行。这里仅用本地规则演示一种修正，不能替代原系统或当前聊天产品的完整比较。'},
  {short:'对照步骤，找到遗漏',title:'推荐不对，到底是哪一步少算了？',intro:'对照两种计算方式，把“答案不对”缩小为一个能修的具体问题。',facts:['3 公里 / 20 分钟 / 5 元','同一趟公交，同一组数据','差别仅在计算包含哪些部分'],finding:'用户通过并列分支比较输入与输出，形成对错误原因的判断；局部修改既可以保留无关部分，也可以传到后续结果。',example:'P8 比较不同类别生成的闪卡；P3 把“互动类型”改为“对话发生的地点”，后面的闪卡随之改变。',method:'§5.3 的参与者操作与访谈。主观透明度为 5.4 对 3.8（7 分制），不等于客观理解准确率。',ref:'§5.2，PDF p.10；§5.3.3–5.3.4，p.12',response:'把两种输入的影响摆在一起，允许补回遗漏，并标出后续哪些判断需要更新。',boundary:'这是通勤中的假设对照，不是原文闪卡实验。更多步骤也可能增加学习负担。'}
 ],
 cocoa:[
  {short:'结果会改变下一步',title:'还没做完，计划就有了新方向',intro:'先执行一部分，再决定后面怎么做。看看公交的估计结果，是否让你想改下一步。',facts:['3 公里 / 25 分钟 / 20 元','公交估计：32 分钟','高层目标仍是准时到公司'],finding:'P15 看过文献结果后补充偏好的发表场所；P12 看过摘要后新增下一步研究建议。执行中的产物成了改计划的依据。',example:'这与“看结果后重新理解问题”有交集，但一次修改也可能只改变查找方式，并没有改变最终目标。',method:'16 人对照研究中的观察；感知可引导性中位数 4 对 3（5 分制）。没有证明客观产物质量提高。',ref:'§6.1，PDF p.11；§6.2.1，pp.12–13；§7.2.3，p.14',response:'保留已获得的结果，让下一步可以在执行途中修改，并说明修改的理由。',boundary:'通勤计划是教学改编。“不用等车”是一次主动改变探索范围，也可能排除更快的打车。'},
  {short:'把人的知识用起来',title:'AI 不知道的事，谁来补进去？',intro:'你知道附近车站的情况。把确认站点交给自己，看看这个信息是否真的进入后续比较。',facts:['3 公里 / 30 分钟 / 20 元','不骑车，准时后选便宜的','站点状态：需要有人确认'],finding:'短时实验中，很多人把步骤都交给 AI；后续七天部署中，有人主动保留需要自身判断和专业知识的步骤。',example:'P3 让 AI 查文献，自己补入访谈笔记中的情境，再由 AI 结合两类材料提出干预方案。',method:'7 位参与者的七天部署观察；不是随机实验，不代表人人都会随时间增加人工参与。',ref:'§7.1–7.2.2，PDF pp.13–14；§4.2.3，p.8',response:'让流程等待人的实际贡献，标清信息来源，并让后续步骤读取它。分工因此改变结果，而不只是改一个姓名。',boundary:'“谁负责”指谁执行并提供产物，不是法律责任，也不是把资料划成互不共享的所有权。'}
 ],
 magentic:[
  {short:'看见不等于核查',title:'你接受了报告，还是核查过依据？',intro:'能看到过程，并不保证人会认真检查。这里把“接受结果”和“核对依据”区分开。',facts:['3 公里 / 25 分钟 / 20 元','报告声称：公交刚好 25 分钟','其中等车 5 分钟尚未核实'],finding:'P1 看出六道菜只找到了五道，仍觉得够用；P9 发现票价没有来自官方网站，仍选择相信。',example:'前一个例子是知道缺项后接受，并不是没有看见；后一个揭示了对可疑过程仍可能过度相信。',method:'12 人短时使用研究中的行为与自述；没有比较核验功能使错误率降低了多少。',ref:'§7.4，PDF pp.22–23',response:'在建议旁提供依据入口，区分“我接受了”和“已有证据支持”，并让核验能更新结论。',boundary:'站牌信息是预设的教学证据，没有连接公交实时服务；看过它也不代表能保证真实出行正确。'},
  {short:'控制也有注意力成本',title:'保留控制，不必一直盯着全部记录',intro:'试着从六项记录中找出现在真正等你处理的一项。完整记录仍可以随时展开。',facts:['固定演示：公交 2 元','共 6 项执行记录','付款前需要你的决定'],finding:'参与者提到离开后难找回上下文，有些确认过多；作者也指出长计划与长历史的审核负担。',example:'用户支持在支付等重要动作前介入，但并不希望每一个小动作都来打扰。',method:'§7.4 的访谈与使用观察，以及 §8.1 的限制讨论；没有证明某种提醒策略普遍最优。',ref:'§7.4，PDF pp.21–23；§8.1，p.25',response:'我们的改进提案：默认突出待处理事项，同时保留完整记录和取消入口。',boundary:'这里只对照显示条目，不测量注意力或效率；原系统的动作审批也不是每一步都找人确认。'}
 ]
};
const lessonState={tabs:{'锚点论文':0,aichains:0,cocoa:0,magentic:0},direction:false,hack:0,chainView:'sandbox',wait:5,chainRuns:0,chainNote:'',sandboxPrompt:'公司离我 3 公里，25 分钟内到，最多花 20 元。公交等车 5 分钟，其他条件保持。',sandboxOutput:'公交：步行 5 + 等车 5 + 乘车 15 = 25 分钟，符合要求。\n共享单车：18 分钟 / 2 元；打车：12 分钟 / 18 元；走路：36 分钟 / 0 元。\n符合要求的走法中，打车最快。',sandboxSaved:'',diagnostic:'hidden',repair:false};
function resetLessons(){Object.assign(lessonState,{tabs:{'锚点论文':0,aichains:0,cocoa:0,magentic:0},direction:false,hack:0,chainView:'sandbox',wait:5,chainRuns:0,chainNote:'',sandboxPrompt:'公司离我 3 公里，25 分钟内到，最多花 20 元。公交等车 5 分钟，其他条件保持。',sandboxOutput:chainReport(5),sandboxSaved:'',diagnostic:'hidden',repair:false});resetCocoaLessons();resetMagenticLessons()}
function currentLesson(){return lessonState.tabs[research.mode]||0}
function lessonEvidence(id,number){const item=lessonCatalog[id][number-1];return `<details class="lesson-source"><summary>原文例子与证据 · ${item.ref}</summary><p><b>原文：</b>${item.finding}</p><p>${item.example}</p><p><b>证据类型：</b>${item.method}</p><p><b>演示范围：</b>${item.boundary}</p><a href="${papers[id].url}" target="_blank" rel="noopener noreferrer">打开论文 ↗</a></details>`}
function artifactMap(){return `<details class="artifact-map"><summary>原论文的“问题、初始程序、评价函数”，在这里分别是什么？</summary><dl><dt>① 问题描述</dt><dd>左侧写下的目标与限制：${esc(state.question)}</dd><dt>② 初始程序：本页没有复现自动改写程序的过程</dt><dd>原论文中，它是交给 AlphaEvolve 继续改写的起始解程序。本页只有预设的“方案生成与估算规则”（plans），可查看下方类比；所选的公交或打车是结果，不是程序。</dd></dl><pre class="lesson-code">方案生成与估算规则（教学类比）\n输入：路程、公交等车时间\n分别计算：走路、骑车、公交、打车\n输出：四种走法的用时、费用和分段数据</pre><dl><dt>③ 评价规则：先检查，再排序</dt><dd>先检查时间、预算和是否骑车，再按${state.priority==='cost'?'费用':'时间'}比较合格方案。上面的两个按钮改变的是这一部分。</dd></dl><p>本页用固定规则帮助理解三个对象的区别，没有运行 AlphaEvolve，也不会自动演化候选代码。依据：§3，PDF p.3；§3.1–3.2，pp.4–5。</p></details>`}
function sandboxExplanation(){return `<details class="artifact-map"><summary>与论文里的 Sandbox 有什么区别？</summary><div class="lesson-comparison"><div><b>Sandbox · 集中在文本里改</b>可编辑提示和输出、反复运行。它也能局部修改，不是只能一次问完。</div><div><b>AIChains · 将步骤单独摆出来</b>查看每步输入输出，直接改中间结果、提示或连接，再观察后续变化。</div></div><p>上面的三步概览类比 Chain view；等车编辑框类比 Step view 的中间输出编辑；只更新公交及后续判断类比局部隔离与传播。没有实现任意提示编辑或链结构搭建。</p><button data-lesson="1">试试两种修改入口 →</button><p>论文两种条件使用同一模型；比较的是交互结构，不是更换更强模型。§4.2，pp.7–8；§5.1，pp.8–9。</p></details>`}
function renderLesson(id,basic){
 const active=lessonState.tabs[id]||0;
 const nav=`<div class="lesson-nav" role="group" aria-label="操作与论文发现"><button data-lesson="0" aria-pressed="${active===0}"><small>自由比较</small>基本操作</button>${lessonCatalog[id].map((x,i)=>`<button data-lesson="${i+1}" aria-pressed="${active===i+1}"><small>发现 ${i+1} · 小实验</small>${x.short}</button>`).join('')}</div>`;
 if(!active)return nav+basic+(id==='锚点论文'?artifactMap():id==='aichains'?sandboxExplanation():'');
 const item=lessonCatalog[id][active-1];
 const stage=id==='锚点论文'?anchorLesson(active):id==='aichains'?aiChainsLesson(active):id==='cocoa'?cocoaLesson(active):magenticLesson(active);
 return `${nav}<p class="lesson-kicker">${papers[id].name} · 从发现到设计</p><h2 tabindex="-1" id="lesson-heading">${item.title}</h2><p class="lesson-intro">${item.intro}</p><span class="lesson-label">通勤小实验 · 固定情景 · 本地规则演示</span>${stage}<p class="lesson-takeaway"><b>本页怎样回应：</b>${item.response}</p>${lessonEvidence(id,active)}`;
}
function renderLessonContext(id){
 const n=lessonState.tabs[id]||0,item=lessonCatalog[id][n-1];
 document.body.dataset.lesson=n?'experiment':'basic';$('#lesson-setup').hidden=!n;$('#results').hidden=!!n;$('#detail').hidden=!!n;
 $('.request').setAttribute('aria-label',n?'小实验的固定条件':'自由比较的要求');$('.request').removeAttribute('aria-labelledby');
 if(!n)return;
 $('#lesson-setup').innerHTML=`<span class="paper-label">这次小实验的条件</span><h2>先看这个情景</h2><ul class="lesson-facts">${item.facts.map(x=>`<li>${x}</li>`).join('')}</ul><p>小实验使用这组固定条件。之前的自由比较仍被保留，可以随时返回。</p><button data-lesson="0">返回自由比较</button><p><button class="plain" data-lab="reset-one">重置这个小实验</button></p>`;
 $('#paper-connection').innerHTML=`<span class="paper-label">这个实验对应的论文发现</span><h2>${papers[id].name}</h2><dl><dt>论文发现</dt><dd>${item.finding}</dd><dt>怎样得到这个发现</dt><dd>${item.method}</dd><dt>这里的操作回应</dt><dd>${item.response}</dd></dl><a class="source-link" href="${papers[id].url}" target="_blank" rel="noopener noreferrer">原文 · ${item.ref} ↗</a><p class="scope-note">${item.boundary}</p>`;
}
function anchorLesson(which){
 if(which===1){const on=lessonState.direction;return `<div class="lesson-stage"><h3>要求：10 分钟内到公司</h3><div class="lesson-toggle"><button data-lab="anchor-binary" aria-pressed="${!on}">只给成败分数</button><button data-lab="anchor-direction" aria-pressed="${on}">也告诉我离目标多远</button></div><table class="lesson-table"><thead><tr><th>走法</th><th>${on?"用时":"用时反馈"}</th><th>成败分数</th><th>${on?'方向反馈':'可以知道什么'}</th></tr></thead><tbody>${[['走路',36],['共享单车',18],['公交',25],['打车',12]].map(([name,m])=>`<tr ${on&&m===12?'class="highlight"':''}><td>${name}</td><td>${on?`${m} 分钟`:"未返回"}</td><td>0 · 不合格</td><td>${on?`还差 ${m-10} 分钟`:'都失败了'}</td></tr>`).join('')}</tbody></table><div class="lesson-result" role="status">${on?'<strong>现在能看见：打车距离目标最近，还差 2 分钟。</strong><p>四种走法仍然全部不合格。方向反馈帮助继续探索，不能把差一点达标当成成功。</p>':'四个 0 分，分不出哪次尝试更接近目标。试着打开“方向反馈”。'}</div></div>`}
 const stage=lessonState.hack,fixed=stage===2;return `<div class="lesson-stage"><h3>要求：20 分钟内到，最多花 5 元</h3><table class="lesson-table"><thead><tr><th>方案</th><th>用于评价的时间</th><th>判断</th></tr></thead><tbody><tr class="highlight"><td>公交 · 2 元</td><td>${fixed?25:15} 分钟</td><td>${fixed?'超时 5 分钟':'表面合格，似乎更快'}</td></tr><tr><td>单车 · 2 元</td><td>18 分钟</td><td>合格</td></tr></tbody></table><p>有问题的公交报告只填了“车上 15 分钟”。${fixed?'现在评分已使用完整分段数据。':'按这个数字排序，会把公交排在单车前面。'}</p><div class="action-pair"><button data-lab="anchor-audit" ${stage>0?'disabled':''}>核对每一段用时</button><button data-lab="anchor-fix" class="primary" ${stage!==1?'disabled':''}>改为逐段相加再判断</button></div>${stage?`<div class="lesson-result" role="status"><b>步行 5 + 等车 5 + 乘车 15 = 25 分钟</b><p>${fixed?'规则已修正：公交不合格，当前应选 18 分钟的单车。':'发现漏算了 10 分钟。仅看见漏洞还不够，继续修改判断规则。'}</p></div>`:''}</div>`;
}
function chainReport(wait){const total=20+wait;return `公交：步行 5 + 等车 ${wait} + 乘车 15 = ${total} 分钟，${total<=25?'符合要求':`超时 ${total-25} 分钟`}。\n共享单车：18 分钟 / 2 元；打车：12 分钟 / 18 元；走路：36 分钟 / 0 元。\n符合要求的走法中，打车最快。`}
function aiChainsLesson(which){
 const s=lessonState;
 if(which===2){return `<div class="lesson-stage"><h3>同一组数据，两种中间结果</h3><div class="lesson-comparison"><div><b>只写“乘车”</b>15 分钟 / 2 元<br>后续判断：20 分钟内，合格。</div><div><b>从家门算到公司</b>步行 5 + 等车 5 + 乘车 15<br>后续判断：25 分钟，超时。</div></div><div class="action-pair"><button data-lab="chain-inspect">展开输入 → 中间结果 → 判断</button><button class="primary" data-lab="chain-repair" ${s.diagnostic==='hidden'||s.repair?'disabled':''}>补回漏算的两段</button></div>${s.diagnostic!=='hidden'?`<ol class="lesson-flow"><li>输入：步行 5、等车 5、乘车 15<span>原始数据已有三段，不需要重查。</span></li><li class="affected">中间结果：${s.repair?'5 + 5 + 15 = 25 分钟':'仅取乘车 15 分钟 ← 遗漏在这里'}</li><li class="affected">后续判断：${s.repair?'公交超时 5 分钟；改选单车 18 分钟':'公交被错判为合格'}</li><li>保留：单车 18 分钟 / 2 元<span>没有受这次修改影响。</span></li></ol>`:''}${s.repair?'<div class="lesson-result" role="status">已修改中间计算，并更新依赖它的判断。原始数据和单车估计被保留。</div>':''}<p class="lesson-small">锚点论文关注“判断规则哪里失真”；这里关注“从步骤对照中，怎样找到可修改的位置”。认知活动可以重叠。</p></div>`}
 return `<div class="lesson-stage"><div class="lesson-toggle" role="group" aria-label="比较修改入口"><button data-lab="chain-sandbox" aria-pressed="${s.chainView==='sandbox'}">Sandbox · 文本入口</button><button data-lab="chain-structured" aria-pressed="${s.chainView==='chain'}">AIChains · 步骤入口</button></div>${s.chainView==='sandbox'?`<label for="sandbox-prompt">输入文本（试着把“等车 5 分钟”改成 12）</label><textarea id="sandbox-prompt" class="lesson-output">${esc(s.sandboxPrompt)}</textarea><button class="primary" data-lab="sandbox-run">按输入重新计算</button><label for="sandbox-output" style="display:block;margin-top:15px">结果文本（也可以直接编辑并保存）</label><textarea id="sandbox-output" class="lesson-output">${esc(s.sandboxOutput)}</textarea><button data-lab="sandbox-save">保存我的文本修改</button><p class="lesson-small">此教学版本只读取“等车 N 分钟”（0–60 的整数），其余条件固定。直接改输出会保存为你的文本，不会自动当成已核实的数据；再次计算将按输入替换输出。原论文的 Sandbox 使用真实模型，能力更开放。</p>`:`<ol class="lesson-flow"><li>1 · 要求<span>3 公里、25 分钟、20 元，保持不变。</span></li><li class="affected"><label for="lesson-chain-wait">2 · 公交等车 <input id="lesson-chain-wait" type="number" min="0" max="60" step="1" value="${s.wait}"> 分钟</label><span>中间输出可以直接改。</span></li><li>3 · 比较<span>公交总用时 ${20+s.wait} 分钟；${s.wait<=5?'符合要求':`超时 ${s.wait-5} 分钟`}。</span></li></ol><button class="primary" data-lab="chain-update">更新这一步及后续</button><p class="lesson-small">走路 36 分钟、单车 18 分钟、打车 12 分钟：无关估计保留。即使公交变差，最快的合格方案仍然可能是打车。</p>`}${s.chainNote?`<div class="lesson-result" role="status">${esc(s.chainNote)}</div>`:''}${s.sandboxSaved?`<details class="lesson-source"><summary>你保存的结果文本</summary><p style="white-space:pre-wrap">${esc(s.sandboxSaved)}</p></details>`:''}<p class="lesson-small">两种入口共用相同数据与计算规则；切换不会故意让某一边算错。这里对照的是操作方式，没有复现论文的模型生成或实验效果。</p></div>`;
}
function resetOneLesson(){const id=research.mode,n=currentLesson();if(id==='锚点论文'){if(n===1)lessonState.direction=false;else lessonState.hack=0}else if(id==='aichains'){if(n===2){lessonState.diagnostic='hidden';lessonState.repair=false}else{Object.assign(lessonState,{chainView:'sandbox',wait:5,chainRuns:0,chainNote:'',sandboxPrompt:'公司离我 3 公里，25 分钟内到，最多花 20 元。公交等车 5 分钟，其他条件保持。',sandboxOutput:chainReport(5),sandboxSaved:''})}}else if(id==='cocoa')handleCocoaLesson(n===1?'cocoa-plan-reset':'cocoa-assignment-reset');else handleMagenticLesson(n===1?'mag-evidence-reset':'mag-attention-reset')}
function validLessonWait(value){return String(value).trim()!==''&&Number.isInteger(Number(value))&&Number(value)>=0&&Number(value)<=60}
function restoreLessonFocus(action){const button=document.querySelector(`[data-lab="${action}"]`);(button&&!button.disabled?button:$('#lesson-heading'))?.focus({preventScroll:true})}
document.addEventListener('input',e=>{if(e.target.id==='sandbox-prompt')lessonState.sandboxPrompt=e.target.value;if(e.target.id==='sandbox-output')lessonState.sandboxOutput=e.target.value});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.lesson!==undefined){const n=Number(b.dataset.lesson);if(![0,1,2].includes(n))return;lessonState.tabs[research.mode]=n;renderResearch();document.querySelector(`#paper-playground [data-lesson="${n}"]`)?.focus({preventScroll:true});return}
 const action=b.dataset.lab;if(!action)return;
 if(action.startsWith('cocoa-')){handleCocoaLesson(action,b);restoreLessonFocus(action);return}
 if(action.startsWith('mag-')){handleMagenticLesson(action,b);restoreLessonFocus(action);return}
 if(action==='reset-one')resetOneLesson();
 if(action==='anchor-binary')lessonState.direction=false;
 if(action==='anchor-direction')lessonState.direction=true;
 if(action==='anchor-audit'&&lessonState.hack===0)lessonState.hack=1;
 if(action==='anchor-fix'&&lessonState.hack===1)lessonState.hack=2;
 if(action==='chain-sandbox')lessonState.chainView='sandbox';
 if(action==='chain-structured')lessonState.chainView='chain';
 if(action==='chain-inspect')lessonState.diagnostic='shown';
 if(action==='chain-repair'&&lessonState.diagnostic!=='hidden')lessonState.repair=true;
 if(action==='sandbox-save'){lessonState.sandboxSaved=lessonState.sandboxOutput;lessonState.chainNote='文本已保存。后续计算仍使用输入中的等车时间；人工文本与计算数据分开记录。'}
 if(action==='sandbox-run'||action==='chain-update'){
  const matches=[...lessonState.sandboxPrompt.matchAll(/等车\s*(?:时间\s*)?(?:为|是|改为|改成|需|要)?\s*(-?\d+(?:\.\d+)?)\s*分钟/g)];
  const value=action==='sandbox-run'?(matches.length===1?matches[0][1]:null):$('#lesson-chain-wait').value;
  if(value===null||!validLessonWait(value)){lessonState.chainNote='还没有应用：请只写一个明确的“等车 N 分钟”，N 为 0–60 的整数。';renderResearch();return}
  const before=20+lessonState.wait;lessonState.wait=Number(value);lessonState.chainRuns++;
  lessonState.sandboxOutput=chainReport(lessonState.wait);
  if(action==='chain-update')lessonState.sandboxPrompt=`公司离我 3 公里，25 分钟内到，最多花 20 元。公交等车 ${lessonState.wait} 分钟，其他条件保持。`;
  lessonState.chainNote=`已计算：公交 ${before} → ${20+lessonState.wait} 分钟；${lessonState.wait<=5?'仍符合时间要求':`超时 ${lessonState.wait-5} 分钟`}。其他三种走法保留。`;
 }
 renderResearch();restoreLessonFocus(action);
});
// Make the evidence accessible from the source dialog as well as each lesson.
Object.entries(lessonCatalog).forEach(([id,items])=>{const host=document.getElementById(`source-${id}`);if(host){const box=document.createElement('div');box.className='lesson-source';box.innerHTML=`<b>本页新增的两项发现</b>${items.map((item,i)=>`<p>${i+1}. ${item.finding}<br><span>${item.ref} · ${item.method}</span></p>`).join('')}`;host.append(box)}});
renderResearch();
