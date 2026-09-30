'use strict';

const cocoaLessonState = {
  replan: { phase: 'ready', route: null },
  assignment: { phase: 'ready', owner: 'ai', stationOpen: null, source: null }
};

const cocoaLessonOptions = [
  { id: 'walk', name: '步行', minutes: 36, cost: 0, waits: false },
  { id: 'bike', name: '自行车', minutes: 18, cost: 2, waits: false },
  { id: 'taxi', name: '打车', minutes: 12, cost: 18, waits: true },
  { id: 'bus', name: '公交', minutes: 32, cost: 2, waits: true }
];

function resetCocoaLessons() {
  cocoaLessonState.replan = { phase: 'ready', route: null };
  cocoaLessonState.assignment = { phase: 'ready', owner: 'ai', stationOpen: null, source: null };
}

function cocoaLessonButton(action, text, options = {}) {
  return `<button type="button" data-lab="${esc(action)}"${options.primary ? ' class="primary"' : ''}${options.disabled ? ' disabled' : ''}${typeof options.pressed === 'boolean' ? ` aria-pressed="${options.pressed}"` : ''}>${esc(text)}</button>`;
}

function cocoaReplanLesson() {
  const current = cocoaLessonState.replan;
  const hasEstimates = current.phase !== 'ready';
  const nextStep = current.route === 'no-wait' ? '先比较不用等车的走法' : '比较全部走法';
  const candidates = cocoaLessonOptions.filter(plan => current.route !== 'no-wait' || !plan.waits);
  const valid = candidates.filter(plan => plan.minutes <= 25 && plan.cost <= 20);
  const best = [...valid].sort((a, b) => a.minutes - b.minutes)[0];

  let interaction = cocoaLessonButton('cocoa-plan-estimate', '先执行第 1 步：估算用时', { primary: true });
  if (hasEstimates) {
    interaction = `<div class="lesson-result" role="status"><b>第 1 步已完成：公交需要 32 分钟，超过 25 分钟的要求。</b><p>估算结果已保留。看到这个结果后，你可以决定下一步往哪里查。</p></div>
      <div class="action-pair" role="group" aria-label="选择后续计划">
        ${cocoaLessonButton('cocoa-plan-no-wait', '把下一步改为：先比较不用等车的走法', { pressed: current.route === 'no-wait' })}
        ${cocoaLessonButton('cocoa-plan-all', '仍比较全部', { pressed: current.route === 'all' })}
      </div>
      ${current.route ? `<p class="lesson-small">下一步已设为“${esc(nextStep)}”。第 1 步的估算不需要重做。</p>${cocoaLessonButton('cocoa-plan-compare', '执行这个下一步', { primary: true, disabled: current.phase === 'done' })}` : '<p class="lesson-small">先选择下一步，再执行比较。</p>'}`;
  }

  const comparison = current.phase === 'done' ? `<div class="lesson-result affected" role="status">
      <b>这次实际比较：${candidates.map(plan => esc(plan.name)).join('、')}</b>
      <ul>${candidates.map(plan => `<li>${esc(plan.name)}：${plan.minutes} 分钟，${plan.cost} 元${plan.minutes > 25 ? ' · 超时' : ' · 符合要求'}</li>`).join('')}</ul>
      <p><strong>符合要求中，优先选${esc(best.name)}：${best.minutes} 分钟，${best.cost} 元。</strong></p>
      <p>${current.route === 'no-wait' ? '公交和打车都需要等车，本轮先不比较。它们的估算仍保留在上面。' : '本轮保留四种候选；步行和公交超时，打车在符合要求的走法中最快。'}</p>
    </div>` : '';

  return `<section class="lesson-stage" aria-label="Cocoa 小实验：看过结果后修改计划">
    <p class="lesson-small">固定情景：3 公里，25 分钟内到，最多 20 元；在本轮符合要求的走法中选更快的。</p>
    <ol class="lesson-flow"><li><b>1 · 估算各走法</b><span>${hasEstimates ? '已完成，结果保留' : '尚未执行'}</span></li><li class="${current.route === 'no-wait' ? 'affected' : ''}"><b>2 · ${esc(nextStep)}</b><span>${current.phase === 'done' ? '已执行' : hasEstimates ? '可根据结果修改' : '等待第 1 步'}</span></li></ol>
    ${hasEstimates ? `<div class="lesson-inline"><b>保留的估算</b><p>${cocoaLessonOptions.map(plan => `${esc(plan.name)} ${plan.minutes} 分钟 / ${plan.cost} 元`).join('；')}。</p></div>` : ''}
    ${interaction}${comparison}
    <p class="lesson-small">这里先看到结果，再改后续探索路线。路程、时间和预算保持不变，并不一定要改变更高层的目标。此处“不用等车”只指排除公交和打车的教学假设。</p>
    ${hasEstimates ? cocoaLessonButton('cocoa-plan-reset', '重做这个小实验') : ''}
  </section>`;
}

function cocoaAssignmentLesson() {
  const current = cocoaLessonState.assignment;
  const done = current.phase === 'done';
  const human = current.owner === 'human';
  const available = current.stationOpen === true;
  const source = human ? '你提供的站点信息' : 'AI 演示采用的假设，未核实';
  const recommendation = available ? '公交：25 分钟，2 元' : '打车：12 分钟，18 元';
  let interaction;

  if (current.phase === 'waiting') {
    interaction = `<div class="lesson-result" role="status"><b>流程停在你负责的第 1 步，等待你的信息。</b><p>假设你知道今天的站点情况，请把这条信息交给后续步骤。</p></div>
      <div class="action-pair" role="group" aria-label="提交站点情况">
        ${cocoaLessonButton('cocoa-station-closed', '今天站点关闭', { primary: true })}
        ${cocoaLessonButton('cocoa-station-open', '站点正常')}
      </div>`;
  } else if (done) {
    interaction = `<div class="lesson-result" role="status"><b>第 1 步提供的结果：${available ? '站点可用' : '今天站点关闭'}</b><p>由谁提供：${esc(source)}。</p>${human ? '' : '<p>AI 并不了解真实站点状态，只是沿用“可用”的假设。</p>'}</div>
      <div class="lesson-result affected"><b>第 2 步怎样使用这条信息？</b><p>${available ? '保留公交。公交和打车都能在 30 分钟内到，公交更便宜。' : '排除这条公交路线。步行 36 分钟会超时，自行车因“不骑车”被排除；打车仍符合要求。'}</p><p><strong>本次推荐：${esc(recommendation)}。</strong></p>${human ? '' : '<p class="lesson-small">这个推荐依赖尚未核实的站点假设。</p>'}</div>
      <p class="lesson-small">你可以切换负责人重新执行，或者重做实验，试试另一种站点信息。</p>`;
  } else {
    interaction = `<p>${human ? '执行到第 1 步时，演示会停下来，等待你提供站点信息。' : 'AI 演示没有站点实时信息，将暂按“站点可用”继续；结果会明确标为未核实。'}</p>${cocoaLessonButton('cocoa-assignment-run', '执行这份共同计划', { primary: true })}`;
  }

  return `<section class="lesson-stage" aria-label="Cocoa 小实验：由人提供 AI 缺少的信息">
    <p class="lesson-small">固定情景：3 公里，30 分钟内到，最多 20 元，不骑车；符合要求后优先省钱。</p>
    <ol class="lesson-flow"><li><b>1 · 确认站点可用</b><span>${done ? `已完成 · ${human ? '你提供信息' : 'AI 使用未核实假设'}` : current.phase === 'waiting' ? '等待你的信息' : '尚未执行'}</span></li><li><b>2 · 用站点信息比较走法</b><span>${done ? '已使用第 1 步的结果' : '等待第 1 步完成'}</span></li></ol>
    <div class="action-pair" role="group" aria-label="第一步由谁完成">
      ${cocoaLessonButton('cocoa-owner-ai', '交给 AI 演示', { pressed: !human })}
      ${cocoaLessonButton('cocoa-owner-human', '这一步我来做', { pressed: human })}
    </div>
    ${interaction}
    <p class="lesson-small">分工决定谁完成这一步、提供什么结果，以及后面用什么信息继续。人的操作在这里是补充信息，而不只是批准 AI 的选择。</p>
    <p class="lesson-small">数值和站点状态均为教学情景；没有查询地图或真实站点，不会实际叫车。</p>
    ${current.phase !== 'ready' || human ? cocoaLessonButton('cocoa-assignment-reset', '重做这个小实验') : ''}
  </section>`;
}

function cocoaLesson(which) {
  return Number(which) === 2 ? cocoaAssignmentLesson() : cocoaReplanLesson();
}

function handleCocoaLesson(action, button) {
  if (typeof action !== 'string' || !action.startsWith('cocoa-') || button?.disabled) return false;
  const replan = cocoaLessonState.replan;
  const assignment = cocoaLessonState.assignment;

  switch (action) {
    case 'cocoa-plan-estimate':
      if (replan.phase !== 'ready') return false;
      replan.phase = 'review';
      break;
    case 'cocoa-plan-no-wait':
    case 'cocoa-plan-all': {
      if (!['review', 'planned', 'done'].includes(replan.phase)) return false;
      const route = action === 'cocoa-plan-no-wait' ? 'no-wait' : 'all';
      if (replan.route === route) return false;
      replan.route = route;
      replan.phase = 'planned';
      break;
    }
    case 'cocoa-plan-compare':
      if (replan.phase !== 'planned' || !['all', 'no-wait'].includes(replan.route)) return false;
      replan.phase = 'done';
      break;
    case 'cocoa-plan-reset':
      cocoaLessonState.replan = { phase: 'ready', route: null };
      break;
    case 'cocoa-owner-ai':
    case 'cocoa-owner-human': {
      const owner = action === 'cocoa-owner-human' ? 'human' : 'ai';
      if (assignment.owner === owner) return false;
      cocoaLessonState.assignment = { phase: 'ready', owner, stationOpen: null, source: null };
      break;
    }
    case 'cocoa-assignment-run':
      if (assignment.phase !== 'ready') return false;
      if (assignment.owner === 'human') {
        assignment.phase = 'waiting';
      } else if (assignment.owner === 'ai') {
        Object.assign(assignment, { phase: 'done', stationOpen: true, source: 'ai-assumption' });
      } else return false;
      break;
    case 'cocoa-station-closed':
    case 'cocoa-station-open':
      if (assignment.owner !== 'human' || assignment.phase !== 'waiting') return false;
      Object.assign(assignment, { phase: 'done', stationOpen: action === 'cocoa-station-open', source: 'human' });
      break;
    case 'cocoa-assignment-reset':
      cocoaLessonState.assignment = { phase: 'ready', owner: 'ai', stationOpen: null, source: null };
      break;
    default:
      return false;
  }

  renderResearch();
  return true;
}
