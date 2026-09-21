'use strict';
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n.toFixed(2)).toString();
const initialQuestion='公司离我 3 公里，希望 25 分钟内到，最多花 20 元。快一点优先。';
const initial={distance:3,minutes:25,budget:20,noBike:false,priority:'time',busWait:5};
const state={...initial,question:initialQuestion,selected:'taxi',round:1,history:[]};
function numberValue(s){
  if(/^-?\d/.test(s))return Number(s);
  if(s==='半')return .5;
  if(s.startsWith('负'))return -numberValue(s.slice(1));
  const digits={零:0,〇:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};
  const [whole,decimal]=s.split('点');let total=0,current=0;
  for(const c of whole){if(c in digits)current=digits[c];else{total+=(current||1)*({十:10,百:100,千:1000}[c]||0);current=0}}
  return total+current+(decimal?Number('0.'+[...decimal].map(c=>digits[c]).join('')):0);
}
function parseQuestion(raw){
  let q=raw.normalize('NFKC').trim();
  if(!q)return{error:'先写下你的打算，例如“25 分钟内到公司，最多花 5 元”。'};
  const num='(?:-?[0-9]+(?:\\.[0-9]+)?|负?[零〇一二两三四五六七八九十百千半]+(?:点[零〇一二两三四五六七八九]+)?)';
  q=q.replace(new RegExp('('+num+')\\s*(?:个)?半小时','g'),(_,n)=>`${numberValue(n)*60+30}分钟`).replace(new RegExp('('+num+')\\s*(?:个)?小时\\s*('+num+')\\s*分钟','g'),(_,h,m)=>`${numberValue(h)*60+numberValue(m)}分钟`);
  const distanceRE=new RegExp('('+num+')\\s*(?:公里|千米)','g');
  const timeRE=new RegExp('('+num+')\\s*(?:个)?(小时|分钟|分(?!钱))','g');
  const budgetRE=new RegExp('('+num+')\\s*(?:元|块钱?)','g');
  const d=[...q.matchAll(distanceRE)].at(-1),t=[...q.matchAll(timeRE)].at(-1),b=[...q.matchAll(budgetRE)].at(-1);
  const bikeRE=/不想骑车|不要骑车|不能骑车|不会骑车|不骑车|不想骑自行车|不骑自行车|可以骑车|愿意骑车|骑车也可以/g;
  const biking=[...q.matchAll(bikeRE)].at(-1);
  const free=/不花钱|不想花钱|免费/.test(q),noTime=/时间不限|不限时间|不赶时间|不着急|取消时间限制/.test(q),noBudget=/预算不限|不限预算|不限制预算|取消预算限制/.test(q);
  const costFirst=/少花钱|省钱|便宜|花钱最少/.test(q),fastFirst=/快一点|省时|尽快|最快|越快越好/.test(q);
  const rest=q.replace(distanceRE,'').replace(timeRE,'').replace(budgetRE,'').replace(bikeRE,'')
    .replace(/时间不限|不限时间|不赶时间|不着急|取消时间限制|预算不限|不限预算|不限制预算|取消预算限制|不想花钱|不花钱|免费|少花钱|省钱|便宜|花钱最少|快一点|省时|尽快|最快|越快越好/g,'')
    .replace(/怎么去合适|怎么去比较合适|怎么去|怎样去|如何去|哪个合适|优先|比较方案|比较|重新|请帮我|帮我|公司|上班|通勤|路程|距离|到达|以内|之内|不超过|不多于|预算|最多|只剩|还有|时间|限时|原来|现在|调整为|改成|改为|改到|改|希望|需要|想要|合适|选择|方式|出发|赶到|至少/g,'')
    .replace(/[我想要去到在离是为有的很更最能不也请就只剩花用内外前了吧呢和或个\s，。！？；：、,.!?;:=]/g,'');
  if(rest||/至少|(?<!不)超过\s*\d|\d\s*(?:分钟|小时)\s*(?:以后|之后)|(?:半|[0-9])小时\s*半/.test(q))return{error:'这页只演示去公司的走法。请试试“3 公里，25 分钟内到，最多花 5 元”，或加上“不想骑车”“少花钱”。'};
  if(!d&&!t&&!b&&!biking&&!free&&!noTime&&!noBudget&&!costFirst&&!fastFirst)return{error:'请补充时间或预算，例如“25 分钟内到，最多花 5 元”。'};
  const full=!!d||/公司|上班/.test(q);
  const base=full?{...initial,minutes:null,budget:null}:state;
  const parsed={distance:d?numberValue(d[1]):base.distance,minutes:noTime?null:t?numberValue(t[1])*(t[2]==='小时'?60:1):base.minutes,budget:noBudget?null:free?0:b?numberValue(b[1]):base.budget,noBike:biking?/不/.test(biking[0]):base.noBike,priority:costFirst?'cost':fastFirst?'time':base.priority};
  if(!Number.isFinite(parsed.distance)||parsed.distance<.1||parsed.distance>20)return{error:'这个短途出行示例支持 0.1 到 20 公里，请修改路程后再比较。'};
  if(parsed.minutes!==null&&(!Number.isFinite(parsed.minutes)||parsed.minutes<=0||parsed.minutes>1440))return{error:'到达时间请填写大于 0、且不超过 1440 的分钟数。'};
  if(parsed.budget!==null&&(!Number.isFinite(parsed.budget)||parsed.budget<0||parsed.budget>10000))return{error:'预算可以是 0，但不能是负数；请填写 0 到 10000 元。'};
  return parsed;
}
function plans(){
  const d=state.distance;
  return [
    {id:'walk',name:'走路',minutes:Math.ceil(d*12),cost:0,parts:[['步行',Math.ceil(d*12)]],description:'直接步行过去，不用等车，也不用花钱。',tradeoff:'用时较长。如果不赶时间，这是最省钱的选择。'},
    {id:'bike',name:'共享单车',minutes:3+Math.ceil(d*5),cost:2,parts:[['找车、取车',3],['骑行、还车',Math.ceil(d*5)]],description:'骑共享单车过去，时间和花费都比较少。',tradeoff:'需要会骑车，并能找到可以使用和停放的单车。'},
    {id:'bus',name:'公交',minutes:5+state.busWait+Math.ceil(d*5),cost:2,parts:[['走到车站',5],['等车',state.busWait],['乘车、到公司',Math.ceil(d*5)]],description:'坐公交过去，花费不多，也不用自己骑车。',tradeoff:'等车可能增加用时。本示例假设有合适的直达线路。'},
    {id:'taxi',name:'打车',minutes:3+Math.ceil(d*3),cost:12+Math.ceil(d*2),parts:[['等车',3],['乘车、到公司',Math.ceil(d*3)]],description:'叫车前往公司，在这个示例中用时最短。',tradeoff:'花费较高。实际用时和价格会受路况、等车和计价方式影响。'}
  ];
}
function issues(p){const a=[];if(state.minutes!==null&&p.minutes>state.minutes)a.push(`超时 ${fmt(p.minutes-state.minutes)} 分钟`);if(state.budget!==null&&p.cost>state.budget)a.push(`超预算 ${fmt(p.cost-state.budget)} 元`);if(state.noBike&&p.id==='bike')a.push('你不想骑车');return a}
function ordered(){return plans().sort((a,b)=>!!issues(a).length-!!issues(b).length||(state.priority==='cost'?a.cost-b.cost||a.minutes-b.minutes:a.minutes-b.minutes||a.cost-b.cost))}
function recommended(){return ordered().find(p=>!issues(p).length)}
function requirements(){return [`路程 ${fmt(state.distance)} 公里`,state.minutes===null?'不限制时间':`${fmt(state.minutes)} 分钟内到`,state.budget===null?'不限制预算':`最多花 ${fmt(state.budget)} 元`,...(state.noBike?['不想骑车']:[]),state.priority==='cost'?'符合要求后，少花钱优先':'符合要求后，快一点优先']}
function questionFor(values={}){const r={...state,...values};return `公司离我 ${fmt(r.distance)} 公里，${r.minutes===null?'时间不限':`希望 ${fmt(r.minutes)} 分钟内到`}，${r.budget===null?'预算不限':`最多花 ${fmt(r.budget)} 元`}${r.noBike?'，不想骑车':''}。${r.priority==='cost'?'少花钱优先。':'怎么去合适？'}`}
function relax(){
  const possible=plans().filter(p=>!state.noBike||p.id!=='bike');
  const withinBudget=possible.filter(p=>state.budget===null||p.cost<=state.budget).sort((a,b)=>a.minutes-b.minutes);
  if(withinBudget.length)return{minutes:withinBudget[0].minutes,label:`试试 ${withinBudget[0].minutes} 分钟内到`};
  const withinTime=possible.filter(p=>state.minutes===null||p.minutes<=state.minutes).sort((a,b)=>a.cost-b.cost);
  if(withinTime.length)return{budget:withinTime[0].cost,label:`预算改为 ${withinTime[0].cost} 元`};
  const p=possible.sort((a,b)=>a.cost-b.cost||a.minutes-b.minutes)[0];return{minutes:p.minutes,budget:p.cost,label:`试试 ${p.minutes} 分钟、${p.cost} 元`};
}
function message(text,error=false){$('#form-message').innerHTML=text?`<div class="message ${error?'error':''}">${esc(text)}</div>`:''}
function preserveFocus(fn){const active=document.activeElement,key=active?.dataset?.select,tag=active?.tagName?.toLowerCase(),id=active?.id;const within=$('#workspace').contains(active)||$('#detail').contains(active);fn();if(id&&document.getElementById(id))document.getElementById(id).focus({preventScroll:true});else if(key)document.querySelector(`${tag}[data-select="${CSS.escape(key)}"]`)?.focus({preventScroll:true});else if(within)$('#workspace').focus({preventScroll:true})}
function chart(){
  const ps=plans(),max=Math.max(...ps.map(p=>p.minutes),state.minutes&&state.minutes<100?state.minutes:0);
  return `<div class="commute-chart" role="group" aria-label="四种走法的时间比较">${ps.map(p=>`<button class="travel-bar ${state.selected===p.id?'active':''} ${issues(p).length?'unfit':''}" data-select="${p.id}" aria-label="查看${p.name}，${p.minutes} 分钟，${p.cost} 元" aria-pressed="${state.selected===p.id}"><span>${p.name}</span><span class="bar-track"><span class="bar-fill" style="width:${p.minutes/max*100}%"></span>${state.minutes!==null&&state.minutes<=max?`<span class="deadline" style="left:${state.minutes/max*100}%"></span>`:''}</span><b>${p.minutes} 分钟</b></button>`).join('')}</div>`;
}
function results(){
  const all=ordered(),valid=all.filter(p=>!issues(p).length),best=recommended();
  return `<div class="panel"><div class="summary"><div><b>4</b><span>种走法</span></div><div><b>${valid.length}</b><span>种符合要求</span></div><div><b>${best?best.name:'需要调整要求'}</b><span>${best?(state.priority==='cost'?'符合要求中更省钱':'符合要求中更快'):'暂时没有同时符合的走法'}</span></div></div><div class="chart-head"><h2>哪种走法来得及？</h2></div><div class="chart-area">${chart()}<div class="chart-note"><span><i class="dot"></i>符合要求　<i class="dot gray"></i>有不符合项</span><span>${state.minutes!==null&&state.minutes<=Math.max(...all.map(p=>p.minutes),state.minutes<100?state.minutes:0)?`黄色线：${fmt(state.minutes)} 分钟`:'点选查看详情'}</span></div></div></div>
  ${!best?`<div class="no-match" role="status"><b>暂时没有同时符合要求的走法</b><p>可以放宽到达时间，或增加一点预算，再比较一次。</p><button class="primary" id="relax">${relax().label} →</button></div>`:''}
  <div class="panel list-panel"><div class="list-head"><h2>时间和花费，一起看看</h2><span class="hint">${state.priority==='cost'?'省钱优先':'省时优先'}</span></div><div class="table-scroll"><table><thead><tr><th>怎么去</th><th>用时</th><th>花费</th><th>是否符合</th></tr></thead><tbody>${all.map(p=>`<tr class="${state.selected===p.id?'selected':''}"><td><button data-select="${p.id}" aria-pressed="${state.selected===p.id}">${p.name}${best?.id===p.id?' <small>本次优先考虑</small>':''}</button></td><td>${p.minutes} 分钟</td><td>${p.cost} 元</td><td class="${issues(p).length?'unfit':''}">${issues(p).length?issues(p).map(esc).join('<br>'):'符合'}</td></tr>`).join('')}</tbody></table></div></div>
  <p class="table-note">以上时间和费用为演示假设，包含取车、等车等时间，不是实时导航结果。</p>${state.history.length?`<details class="history"><summary>之前的要求（${state.history.length}）</summary><ul>${state.history.map(h=>`<li>${esc(h)}</li>`).join('')}</ul></details>`:''}`;
}
function detail(){
  const p=plans().find(p=>p.id===state.selected),problems=issues(p),best=recommended();
  const timing=state.minutes===null?'没有设置到达时间。':p.minutes>state.minutes?`比要求晚 ${fmt(p.minutes-state.minutes)} 分钟。`:p.minutes===state.minutes?'刚好达到时间上限，没有预留余量。':`比时间上限早 ${fmt(state.minutes-p.minutes)} 分钟。`;
  const reasoning=problems.length?`这次不符合你的要求：${problems.join('，')}。`:best?.id===p.id?`它符合你设定的要求，在这些符合的走法中${state.priority==='cost'?'花费最少；花费相同时优先选更快的':'用时最短；用时相同时优先选更省钱的'}。`:'它也符合要求，可以和排在前面的走法比较。';
  return `<div class="detail-head"><h2>看看这条选择</h2><span class="tag">${problems.length?'有不符合项':best?.id===p.id?'本次优先考虑':'也符合要求'}</span></div><div class="detail-body"><h3>${p.name}</h3><p>${p.description}</p><div class="detail-metrics"><div><b>${p.minutes} 分钟</b><span>演示用时</span></div><div><b>${p.cost} 元</b><span>演示花费</span></div></div><div class="detail-section"><h4>时间花在哪里？</h4><ol class="journey">${p.parts.map(([name,m])=>`<li><span>${name}</span><b>${m} 分钟</b></li>`).join('')}</ol></div><div class="detail-section"><h4>适不适合这次出行？</h4><p>${reasoning}</p><p class="timing">${timing}</p></div><div class="tradeoff">${p.tradeoff}</div><button id="refine" class="primary">改改要求，再比较</button></div>`;
}
function update(){preserveFocus(()=>{$('#results').innerHTML=results();$('#detail').innerHTML=detail();if(typeof renderResearch==='function')renderResearch()});$('#requirement-list').innerHTML=requirements().map(t=>`<div class="requirement-item">${esc(t)}</div>`).join('')}
function selectBest(){state.selected=(recommended()||ordered()[0]).id}
function submit(e){e?.preventDefault();const question=$('#question').value.trim(),parsed=parseQuestion(question);if(parsed.error){message(parsed.error,true);$('#run-status').textContent='新要求未应用 · 保留上次结果';return}if(typeof beforeScenarioChange==='function')beforeScenarioChange();state.history.push(state.question);Object.assign(state,parsed,{question,round:state.round+1});selectBest();update();if(typeof afterScenarioChange==='function')afterScenarioChange('修改了出行要求');$('#run-status').textContent=`已更新 · 第 ${state.round} 次比较`;$('#run-button').innerHTML='重新比较 <span>→</span>';message(`已更新：${state.minutes===null?'时间不限':`${fmt(state.minutes)} 分钟内到`}，${state.budget===null?'预算不限':`最多 ${fmt(state.budget)} 元`}${state.noBike?'，不骑车':''}。`)}
$('#request-form').addEventListener('submit',submit);
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.select){state.selected=b.dataset.select;update()}
  if(b.dataset.example){$('#question').value=questionFor(b.dataset.example==='no-bike'?{noBike:true}:{minutes:15,budget:5});submit()}
  if(b.id==='relax'){$('#question').value=questionFor(relax());submit()}
  if(b.id==='refine'){$('#question').focus();$('#question').setSelectionRange($('#question').value.length,$('#question').value.length);$('#question').scrollIntoView({behavior:'smooth',block:'nearest'});message('可以调整时间和预算，或补充“不想骑车”，再点击比较。')}
  if(b.id==='papers-open')$('#paper-dialog').showModal();if(b.id==='help-open')$('#help-dialog').showModal();if(b.hasAttribute('data-close'))b.closest('dialog').close();
  if(b.id==='reset'){if(typeof resetResearch==='function')resetResearch();Object.assign(state,initial,{question:initialQuestion,selected:'taxi',round:1,history:[]});$('#question').value=initialQuestion;update();$('#run-status').textContent='已恢复示例';$('#run-button').innerHTML='比较方案 <span>→</span>';message('')}
});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
$('.skip').addEventListener('click',e=>{e.preventDefault();$('#workspace').focus()});
update();
