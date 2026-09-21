'use strict';
const papers={
 option2:{name:'option2',title:'看过结果，再改想法',full:'Intentmaking and Sensemaking: Human Interaction with AI-Guided Mathematical Discovery',url:'https://arxiv.org/abs/2605.05921v1',ref:'§3.1–3.2，PDF pp.4–5；§5.1，pp.6–7',original:'数学家反复定义实验、观察候选结果，再修改问题、初始程序或评价方式。目标的具体含义可以在这个过程中逐渐清楚。',here:'先比较时间和费用，再决定“最快”是否真是自己最在意的。点击方案看详情，对应原界面的结果概览、候选列表与详情面板。',relation:'这是本页主线：提出要求 → 看懂结果 → 修改要求或判断标准 → 再比较。',boundary:'原文研究的是数学发现。本页保留交互循环和部分布局，没有复现演化搜索、程序树或科研验证。',object:'目标与判断标准',trigger:'看过结果之后',addition:'提供整页的反复探索主线',evidence:'实验定义包含问题陈述、初始程序、评价函数（§3，p.3）；结果表与详情支持检查候选（§3.2，p.5；Fig.1、Fig.4）。',design:'这里把科研评价标准换成“时间优先 / 花费优先”，用出行取舍帮助理解。',context:'先观察取舍，再修改“什么才算好”。另外三篇为这个循环提供不同的操作位置。'},
 aichains:{name:'AIChains',title:'找到具体哪一步要改',full:'AIChains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts',url:'https://doi.org/10.1145/3491102.3517582',ref:'§4.2，PDF pp.7–8；§5.3.2–5.3.4，pp.11–12',original:'把任务拆成相互连接的模型调用。人可以查看各步输入与输出，修改提示、中间结果或连接方式，再观察下游变化。',here:'只修改“公交等车时间”这个中间结果。公交总用时与最终判断更新，其他走法的估计保留。',relation:'为 option2 的反复调整补充“改哪里”：把修改落到一个具体步骤，方便查找问题和保留已经满意的结果。',boundary:'这里展示的是局部修改与后续更新。它没有显示模型的内部思考，也没有运行真实的 LLM 链。',object:'步骤与中间结果',trigger:'检查流程或结果时',addition:'把修改定位到某一步',evidence:'Chain view 与 Step view 联动；单步输出可直接编辑（§4.2，pp.7–8，Fig.3）；局部修改可保留满意结果并向后传播（§5.3，pp.11–12）。',design:'原文任务包括同伴评语和语言闪卡。公交等车这一项是本页改编的中间结果。',context:'接着 option2 的“想调整”，这里试试把调整落实到一个步骤。'},
 cocoa:{name:'Cocoa',title:'决定哪一步由我来做',full:'Cocoa: Co-Planning and Co-Execution with AI Agents',url:'https://doi.org/10.1145/3772318.3791673',ref:'§4.1.2、§4.2.1–4.2.3，PDF pp.6–8；§4.3，p.8',original:'人与 AI 共用文档中的计划，可以修改步骤、分配执行者、提供各步产物，并在执行过程中继续调整计划。',here:'把“确认等车时间”分给自己。流程会等你填写，再使用你提供的数值重新比较。',relation:'为 option2 的反复探索补充“谁来做”：人可以亲自承担自己更了解的一步，而不只是给 AI 提要求。',boundary:'Cocoa 也观察到目标和理解随探索改变。这里的差别在共同计划和分工的设计重点，并非只有 option2 能修改目标。',object:'共同计划、分工与产物',trigger:'规划和执行交错进行时',addition:'把人的贡献写进共同计划',evidence:'每步的执行者可以切换（§4.1.2，p.6）；执行到用户步骤时等待（§4.2.1，p.6）；人提供结果供后续使用（§4.2.3，p.8）。',design:'原文面向研究文档与文献工作。本页将人的贡献简化为确认一个等车时间；“AI”均由本地规则代演。',context:'同样是改等车时间，Cocoa 进一步让你主动负责这一步，并把自己的结果交给后续工作。'},
 magentic:{name:'Magentic-UI',title:'执行时，仍能接手',full:'Magentic-UI: Towards Human-in-the-loop Agentic Systems',url:'https://arxiv.org/abs/2507.22358',ref:'§4，PDF pp.6–8，Fig.4；§6.4，p.14，Fig.8',original:'人能在执行中暂停、接管和恢复，也能在重要动作前确认，并检查执行记录与结果。',here:'模拟按选定方案出发：可以暂停、换一种走法，再交还演示；涉及付费时停下，等你确认或取消。',relation:'为 option2 的“看结果、改要求”补充执行中的控制：方案开始实施后，人仍可以介入具体动作。',boundary:'这里只演示接手与动作前确认，没有实现完整 ActionGuard、安全沙盒、记忆或多任务系统。',object:'执行过程与具体动作',trigger:'执行途中、重要动作之前',addition:'把控制延伸到执行与核验',evidence:'用户可暂停并接管浏览器，再恢复执行（§4，p.7，Fig.4a）；不可逆或潜在有害动作可交由人审批（§6.4，p.14）。',design:'通勤和模拟付费是本页教学情景。不会实际叫车、购票、支付，也不会发送输入到外部。',context:'目标和方案确定后，仍要看清系统将做什么，并在需要时暂停、接手或取消。'}
};
const research={mode:'option2',trail:[],before:null,chainRuns:0,chainNote:'',waitSource:'演示初值',cocoa:{owner:'ai',status:'ready',note:''},execution:{status:'idle',planId:null,pausedFrom:null,logs:[]}};
function snapshotScenario(){const best=recommended();return{best:best?.name||'没有符合的走法',bus:plans().find(p=>p.id==='bus').minutes,priority:state.priority}}
function beforeScenarioChange(){research.before=snapshotScenario();invalidateExecution('要求或数据已改变，旧的模拟流程已停止。')}
function afterScenarioChange(label,extra=''){
 const before=research.before||snapshotScenario(),after=snapshotScenario();
 research.trail.push({label,from:before.best,to:after.best,extra});research.before=null;
 renderResearch();
}
function invalidateExecution(reason){if(research.execution.status!=='idle'){research.execution={status:'idle',planId:null,pausedFrom:null,logs:[reason]}}}
function resetResearch(){Object.assign(research,{trail:[],before:null,chainRuns:0,chainNote:'',waitSource:'演示初值',cocoa:{owner:'ai',status:'ready',note:''},execution:{status:'idle',planId:null,pausedFrom:null,logs:[]}})}
function sourceButton(id){return `<button class="source-link" data-source="${id}">对应原文 · ${papers[id].ref} ↗</button>`}
function trail(){const item=research.trail.at(-1);return item?`<div class="change-receipt" role="status"><b>${esc(item.label)}</b><p>${item.from===item.to?`优先选择仍是${esc(item.to)}`:`${esc(item.from)} → ${esc(item.to)}`}${item.extra?` · ${esc(item.extra)}`:''}</p></div>`:''}
function optionPlay(){
 const valid=plans().filter(p=>!issues(p).length),fast=[...valid].sort((a,b)=>a.minutes-b.minutes||a.cost-b.cost)[0],cheap=[...valid].sort((a,b)=>a.cost-b.cost||a.minutes-b.minutes)[0];
 const insight=!fast?'当前没有同时符合要求的走法。先调整时间或预算，再观察不同选择的取舍。':fast.id===cheap.id?`在当前条件下，${fast.name}既最快，也最省钱。两种标准可能选出同一个结果；改变要求后，可以继续比较。`:`${fast.name} ${fast.minutes} 分钟、${fast.cost} 元；${cheap.name} ${cheap.minutes} 分钟、${cheap.cost} 元。看到这个差别后，你可能发现：准时到就够了，省下的钱更重要。`;
 return `<div class="workbench-head"><span class="paper-label">option2 · 本页主线</span><h2>看到取舍后，重新决定怎样选</h2></div>
 <div class="loop-strip"><span>① 说出要求</span><span>→</span><span>② 看懂结果</span><span>→</span><span>③ 改变判断标准 ↺</span></div>
 <p>${insight}</p>
 <div class="action-pair" role="group" aria-label="怎样选择更好的方案"><button id="criterion-time" data-criterion="time" aria-pressed="${state.priority==='time'}">还是越快越好</button><button id="criterion-cost" data-criterion="cost" aria-pressed="${state.priority==='cost'}">准时就行，选便宜的</button></div>
 ${trail()}<p class="mechanism-note">这里改变的是“什么才算好”，再用新标准看同一批结果。这是对 intentmaking 与 sensemaking 循环的生活化改编。</p>${sourceButton('option2')}`;
}
function chainPlay(){
 const p=plans().find(p=>p.id==='bus');
 return `<div class="workbench-head"><span class="paper-label">AIChains · 修改一个中间结果</span><h2>公交等车时间估错了，改这一项</h2></div>
 <ol class="step-chain"><li><b>1 · 整理要求</b><small>保留当前要求</small></li><li class="step-active"><b>2 · 估算各段用时</b><small>编辑公交这一项</small></li><li><b>3 · 重新比较</b><small>使用更新后的结果</small></li></ol>
 <form id="chain-form" class="inline-edit"><label for="chain-wait">等车时间 <input id="chain-wait" name="wait" type="number" min="0" max="60" step="1" value="${state.busWait}" required> 分钟</label><button class="primary" type="submit">只更新这一步及后续</button></form>
 <p class="calculation">公交总用时：步行 5 + 等车 ${state.busWait} + 乘车 ${Math.ceil(state.distance*5)} = <b>${p.minutes} 分钟</b></p>
 ${research.chainNote?`<div class="change-receipt" role="status">${esc(research.chainNote)}</div>`:''}
 <p class="mechanism-note">例如把等车从 5 改为 12：按当前路程，公交会从 ${10+Math.ceil(state.distance*5)} 变成 ${17+Math.ceil(state.distance*5)} 分钟。其他三种走法的估计会保留。</p>${sourceButton('aichains')}`;
}
function cocoaPlay(){
 const c=research.cocoa;
 return `<div class="workbench-head"><span class="paper-label">Cocoa · 一份共同计划</span><h2>这一步谁更了解，就让谁来做</h2></div>
 <div class="shared-step"><div><b>1 · 确认公交等车时间</b><span>${c.status==='waiting'?'等你完成':c.status==='done'?`已完成 · ${research.waitSource}`:'尚未执行'}</span></div><label><span class="sr-only">第一步由谁来做</span><select id="cocoa-owner"><option value="ai" ${c.owner==='ai'?'selected':''}>AI 演示估计</option><option value="human" ${c.owner==='human'?'selected':''}>我来填写</option></select></label></div>
 <div class="shared-step"><div><b>2 · 用确认后的时间重新比较</b><span>${c.status==='done'?'已使用第一步的结果':'等待第一步完成'}</span></div><span class="tag">AI 演示</span></div>
 ${c.status==='waiting'?`<form id="cocoa-form" class="human-task"><label for="cocoa-wait">这一步由你负责：预计等车多久？</label><div><input id="cocoa-wait" name="wait" type="number" min="0" max="60" step="1" value="12" required><span>分钟</span><button class="primary" type="submit">完成这一步，继续</button></div></form>`:`<button id="cocoa-run" class="primary">${c.status==='done'?'重新执行共同计划':'执行共同计划'}</button>`}
 ${c.note?`<div class="change-receipt" role="status">${esc(c.note)}</div>`:''}
 <p class="mechanism-note">把第一步改成“我来填写”后再执行，流程会等你给出结果。这里体验的是分工，以及人的结果如何被后续步骤使用。</p>${sourceButton('cocoa')}`;
}
function executionPlay(){
 const ex=research.execution,p=plans().find(p=>p.id===(ex.planId||state.selected)),invalid=issues(p).length>0;
 let content='';
 if(ex.status==='idle')content=`<p>按当前选中的“${p.name}”逐步模拟。${invalid?'这个走法不符合当前要求，请先在下方选一个符合的走法。':'你可以在过程中暂停；需要付费时，演示会等你确认。'}</p><button id="execute-start" class="primary" ${invalid?'disabled':''}>按这个方案试一遍</button>${invalid&&recommended()?'<button id="select-recommended" class="secondary-action">选中符合要求的走法</button>':''}`;
 if(ex.status==='running')content=`<div class="execution-state"><b>已准备：${p.name}</b><span>接下来检查是否需要付费。你现在仍可暂停接手。</span></div><div class="action-pair"><button id="execute-next" class="primary">继续到下一步</button><button id="execute-pause">暂停 / 我来接手</button></div>`;
 if(ex.status==='paused')content=`<div class="execution-state"><b>已暂停，等你处理</b><span>你可以直接换一种走法，再把后续交还演示。</span></div><label class="takeover-label" for="takeover-plan">我来选择 <select id="takeover-plan">${plans().filter(p=>!issues(p).length).map(p=>`<option value="${p.id}" ${p.id===ex.planId?'selected':''}>${p.name} · ${p.minutes} 分钟 / ${p.cost} 元</option>`).join('')}</select></label><div class="action-pair"><button id="execute-takeover">应用我的选择</button><button id="execute-resume" class="primary">交还演示，继续</button></div>`;
 if(ex.status==='approval')content=`<div class="approval-card"><b>下一步：模拟确认 ${p.cost} 元费用</b><p>方式：${p.name}。你确认后，演示才继续。</p><div class="action-pair"><button id="execute-approve" class="primary">确认演示费用</button><button id="execute-deny">取消，不继续</button><button id="execute-pause">暂停 / 我来接手</button></div></div>`;
 if(ex.status==='done'||ex.status==='cancelled')content=`<div class="execution-state"><b>${ex.status==='done'?'演示结束，可以核对记录':'你已取消，后续动作已停止'}</b><span>${ex.status==='done'?`演示方式：${p.name}；${p.cost?'模拟确认费用 '+p.cost+' 元':'没有付费动作'}`:'没有模拟确认付费'}。没有生成真实订单。</span></div><button id="execute-again">再试一次</button>`;
 return `<div class="workbench-head"><span class="paper-label">Magentic-UI · 执行过程中仍可参与</span><h2>执行过程中，也能接手或叫停</h2></div><p class="simulation-note">逐步教学演示，不会实际叫车、购票或付费。</p>${content}${ex.logs.length?`<details class="execution-log" open><summary>检查执行记录</summary><ol>${ex.logs.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>`:''}${sourceButton('magentic')}`;
}
function renderResearch(){
 const id=research.mode,p=papers[id];
 document.querySelectorAll('[data-paper]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.paper===id));
 $('#mode-context').innerHTML=`<b>${p.name}</b><span>${p.context}</span>`;
 $('#paper-playground').innerHTML=({option2:optionPlay,aichains:chainPlay,cocoa:cocoaPlay,magentic:executionPlay}[id])();
 $('#paper-connection').innerHTML=`<div class="connection-head"><span class="paper-label">这一步与论文的关系</span><h2>${p.name}</h2></div><dl><dt>论文里</dt><dd>${p.original}</dd><dt>你在这里做的事</dt><dd>${p.here}</dd><dt>${id==='option2'?'为什么以它为主线':'对 option2 的补充'}</dt><dd>${p.relation}</dd></dl>${sourceButton(id)}<p class="scope-note">${p.boundary}</p>`;
}
function populateSources(){
 $('#paper-content').innerHTML=`<div class="comparison-scroll"><table class="paper-comparison"><thead><tr><th>论文</th><th>主要让人修改什么</th><th>在本页怎样体现</th></tr></thead><tbody>${Object.entries(papers).map(([id,p])=>`<tr><td><button data-source="${id}">${p.name}${id==='option2'?' · 主线':''}</button></td><td>${p.object}</td><td>${p.addition}</td></tr>`).join('')}</tbody></table></div><p class="comparison-note">这些关注点并不互斥：AIChains 也支持理解任务，Cocoa 也涉及目标演变，Magentic-UI 也能共同改计划。表格比较的是设计重点，不是互相排斥的四个阶段。</p>${Object.entries(papers).map(([id,p])=>`<details class="source-paper" id="source-${id}"><summary>${p.name} · ${p.title}</summary><h3>${p.full}</h3><p><b>原文机制：</b>${p.original}</p><p><b>证据定位：</b>${p.evidence}</p><p><b>本页转译：</b>${p.design}</p><p><b>比较判断：</b>${p.relation}</p><p class="scope-note">${p.boundary}</p><a href="${p.url}" target="_blank" rel="noopener noreferrer">查看原文 ↗</a><span class="source-location">${p.ref}</span></details>`).join('')}<div class="paper-summary">option2 提供“看结果、再想清楚目标”的主线；其余三篇分别把人的参与落实到步骤、分工和执行动作。本页的对应关系是基于原文做出的比较与教学改编，四篇论文没有共同验证这个通勤例子。</div>`;
}
function showSource(id){
 const dialog=$('#paper-dialog');if(!dialog.open)dialog.showModal();
 document.querySelectorAll('.source-paper').forEach(d=>d.open=d.id===`source-${id}`);
 document.getElementById(`source-${id}`).scrollIntoView({block:'nearest'});
}
function applyWait(value,origin){
 const n=Number(value);if(!Number.isInteger(n)||n<0||n>60)return false;
 beforeScenarioChange();const before=plans().find(p=>p.id==='bus').minutes;
 state.busWait=n;research.waitSource=origin;selectBest();state.selected='bus';
 const after=plans().find(p=>p.id==='bus').minutes;
 research.chainNote=`公交总用时 ${before} → ${after} 分钟；仅更新公交估计和后续判断，其他三种走法保留。`;
 if(research.cocoa.status==='done'&&origin!=='由你提供'&&origin!=='AI 演示估计')research.cocoa={...research.cocoa,status:'ready',note:'中间结果已在另一种体验中修改，可以重新执行共同计划。'};
 afterScenarioChange('更新了公交等车时间',`${before} → ${after} 分钟`);update();$('#run-status').textContent='已更新公交数据与后续比较';return true;
}
function changeCriterion(priority){
 beforeScenarioChange();state.priority=priority;state.question=questionFor();$('#question').value=state.question;state.round++;selectBest();afterScenarioChange('改变了判断标准',priority==='cost'?'准时后省钱优先':'符合要求后越快越好');update();$('#run-status').textContent=`已更新判断标准 · 第 ${state.round} 次比较`;message('选择标准已应用，表格和优先方案已更新。');
}
function handleExecution(id){
 const ex=research.execution;
 if(id==='select-recommended'){const best=recommended();if(best){state.selected=best.id;update()}return}
 if(id==='execute-start'&&ex.status==='idle'){
  const p=plans().find(p=>p.id===state.selected);if(issues(p).length)return;
  research.execution={status:'running',planId:p.id,pausedFrom:null,logs:[`开始逐步演示：${p.name}，${p.cost} 元；没有发生真实操作。`]};
 }
 if(id==='execute-next'&&ex.status==='running'){
  const p=plans().find(p=>p.id===ex.planId);ex.status=p.cost>0?'approval':'done';ex.logs.push(p.cost>0?`到达付费前：${p.cost} 元，正在等待你的确认。`:'步行没有付费动作，演示直接结束。');
 }
 if(id==='execute-pause'&&['running','approval'].includes(ex.status)){ex.pausedFrom=ex.status;ex.status='paused';ex.logs.push('你暂停了演示，后续动作尚未进行。')}
 if(id==='execute-takeover'&&ex.status==='paused'){
  const choice=$('#takeover-plan').value,p=plans().find(p=>p.id===choice);if(!p||issues(p).length)return;
  ex.planId=choice;ex.pausedFrom='running';state.selected=choice;ex.logs.push(`你接手并选择了${p.name}，接下来按新选择重新检查费用。`);
 }
 if(id==='execute-resume'&&ex.status==='paused'){ex.status=ex.pausedFrom||'running';ex.logs.push('你把后续交还演示，流程恢复。')}
 if(id==='execute-approve'&&ex.status==='approval'){const p=plans().find(p=>p.id===ex.planId);ex.status='done';ex.logs.push(`你确认了 ${p.cost} 元演示费用；模拟完成，未产生订单或扣款。`)}
 if(id==='execute-deny'&&ex.status==='approval'){ex.status='cancelled';ex.logs.push('你取消了费用确认；流程停止，没有继续模拟付费。')}
 if(id==='execute-again'){research.execution={status:'idle',planId:null,pausedFrom:null,logs:[]}}
 update();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.paper){research.mode=b.dataset.paper;renderResearch();b.focus({preventScroll:true})}
 if(b.dataset.source)showSource(b.dataset.source);
 if(b.dataset.criterion)changeCriterion(b.dataset.criterion);
 if(b.id==='cocoa-run'){
  const c=research.cocoa;
  if(c.owner==='human'){c.status='waiting';c.note='流程停在你负责的第一步。完成后，第二步才会使用你的结果。';renderResearch();$('#cocoa-wait').focus({preventScroll:true})}
  else{applyWait(5,'AI 演示估计');c.status='done';c.note='AI 演示给出等车 5 分钟；第二步已使用这个数值更新公交用时。';update()}
 }
 if(b.id.startsWith('execute-')||b.id==='select-recommended')handleExecution(b.id);
});
document.addEventListener('change',e=>{if(e.target.id==='cocoa-owner'){research.cocoa={owner:e.target.value,status:'ready',note:'分工已修改。点击执行共同计划，查看流程如何按新分工进行。'};renderResearch();$('#cocoa-owner').focus({preventScroll:true})}});
document.addEventListener('submit',e=>{
 if(!['chain-form','cocoa-form'].includes(e.target.id))return;e.preventDefault();
 const value=new FormData(e.target).get('wait');
 if(e.target.id==='chain-form'){if(applyWait(value,'你编辑的中间结果'))research.chainRuns++}
 else if(research.cocoa.status==='waiting'&&research.cocoa.owner==='human'){
  if(applyWait(value,'由你提供')){research.cocoa.status='done';research.cocoa.note=`你提供了等车 ${state.busWait} 分钟；第二步已使用你的结果，公交总用时为 ${plans().find(p=>p.id==='bus').minutes} 分钟。`;update()}
 }
});
populateSources();renderResearch();
