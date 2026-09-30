'use strict';

const magenticLessonState = {
  evidence: { viewed: false, checked: false, accepted: false },
  attention: { view: 'all', payment: 'waiting' }
};

function magenticLesson(which) {
  return which === 2 || which === '2' || which === 'attention'
    ? magenticAttentionLesson()
    : magenticEvidenceLesson();
}

function magenticEvidenceLesson() {
  const s = magenticLessonState.evidence;
  const minutes = s.checked ? 32 : 25;
  let result = '报告说公交刚好来得及。但目前还没有检查等车时间的依据。';
  if (s.viewed) result = '看到了依据：等车 5 分钟只是估计。打开依据，不代表已经核实。';
  if (s.accepted) result = '你接受了报告，但等车时间仍未核实。接受一个结果，不等于证实它正确。';
  if (s.checked) result = '使用演示核对值后，公交要 32 分钟，超时 7 分钟。原先“刚好来得及”的判断已经不成立。';

  return `<div class="lesson-stage">
    <p class="lesson-small">固定情景：公司离家 3 公里，25 分钟内到，最多花 20 元。所有数值都是教学假设。</p>
    <div class="lesson-flow">
      <div><span>报告里的公交用时</span><strong>25 分钟</strong><small>步行 5 + 估计等车 5 + 乘车 15</small></div>
      <div class="${s.checked ? 'affected' : ''}"><span>当前判断</span><strong>${minutes} 分钟 · ${s.checked ? '不合格' : '表面符合'}</strong><small>${s.checked ? '等车改为 12 分钟，费用仍为 2 元' : '费用 2 元；等车依据还没核实'}</small></div>
    </div>
    <div class="action-pair">
      <button type="button" data-lab="mag-evidence-view"${s.viewed ? ' disabled' : ''}>${s.viewed ? '已查看依据' : '查一下依据'}</button>
      <button type="button" data-lab="mag-evidence-accept"${s.accepted || s.checked ? ' disabled' : ''}>${s.checked ? '原报告已不适用' : s.accepted ? '已接受，尚未核实' : '直接接受报告'}</button>
    </div>
    ${s.viewed ? `<div class="lesson-inline"><p><b>依据：演示估计，待核实。</b>这 5 分钟没有实时公交信息支持。</p>${s.checked
      ? '<p>已使用预设的核对值：等车 12 分钟。5 + 12 + 15 = <b>32 分钟</b>。</p>'
      : '<p>我们预设另一条信息：“实际要等 12 分钟”。点击后，看看原来的结论还能不能成立。</p><button type="button" class="primary" data-lab="mag-evidence-check">用演示核对值 12 分钟重新判断</button>'}</div>` : ''}
    <div class="lesson-result" role="status" aria-live="polite">${esc(result)}</div>
    <p class="lesson-small">论文中，有人明知 6 道菜只找到 5 道仍接受，也有人发现票价不是官网信息却仍相信。这里体验的是“愿意接受”与“检查过依据”的区别。</p>
    <p class="lesson-small">本页没有查询真实路况。12 分钟也是预设值，用来演示核对后如何改变判断。</p>
    <button type="button" data-lab="mag-evidence-reset">恢复这个情景</button>
  </div>`;
}

function magenticAttentionLesson() {
  const s = magenticLessonState.attention;
  const waiting = s.payment === 'waiting';
  const records = [
    { name: '读取你的要求', detail: '3 公里，25 分钟内到，预算 20 元。', status: '已完成' },
    { name: '准备你选中的公交方案', detail: '假设有合适的直达线路。', status: '已完成' },
    { name: '估算到车站的时间', detail: '步行 5 分钟。', status: '已完成' },
    { name: '估算等车和乘车时间', detail: '等车 5 分钟，乘车 15 分钟。', status: '已完成' },
    { name: '汇总这次的时间与费用', detail: '预计 25 分钟，费用 2 元。这里只汇总演示假设，没有实时核验。', status: '已完成' },
    { name: waiting ? '付费前，等你决定' : s.payment === 'confirmed' ? '你已确认演示费用' : '你取消了后续操作',
      detail: waiting ? '是否继续模拟支付 2 元？' : s.payment === 'confirmed' ? '只记录了确认结果，没有订单或扣款。' : '模拟支付没有继续，没有订单或扣款。',
      status: waiting ? '待你处理' : s.payment === 'confirmed' ? '已确认' : '已取消', pending: waiting }
  ];
  const shown = s.view === 'pending' ? records.filter(record => record.pending) : records;
  const result = waiting
    ? '普通步骤保留在记录里，付费前这一项等你决定。切换视图不会跳过确认。'
    : s.payment === 'confirmed'
      ? '你已确认 2 元演示费用，待处理变为 0。完整记录仍可随时查看。没有实际支付。'
      : '你已取消，后续模拟支付停止，待处理变为 0。完整记录仍可随时查看。';

  return `<div class="lesson-stage">
    <p class="lesson-small">固定情景：已经选好公交，下面用 6 项记录模拟做事过程。不会实际购票或支付。</p>
    <div class="lesson-toggle" role="group" aria-label="查看哪些执行记录">
      <button type="button" data-lab="mag-attention-all" aria-pressed="${s.view === 'all'}">全部记录 · 6</button>
      <button type="button" data-lab="mag-attention-pending" aria-pressed="${s.view === 'pending'}">只看待我处理 · ${waiting ? 1 : 0}</button>
    </div>
    <p>当前显示 <span class="lesson-count">${shown.length}</span>项${s.view === 'pending' ? '；其他记录保留在“全部记录”里' : '；你可以只看需要自己决定的部分'}。</p>
    <ol class="lesson-flow">${shown.map(record => `<li${record.pending ? ' class="affected"' : ''}><b>${esc(record.name)}</b><span>${esc(record.status)}</span><p>${esc(record.detail)}</p>${record.pending ? '<div class="action-pair"><button type="button" class="primary" data-lab="mag-payment-confirm">确认 2 元演示费用</button><button type="button" data-lab="mag-payment-cancel">取消，不继续</button></div>' : ''}</li>`).join('')}</ol>
    ${shown.length ? '' : '<p class="lesson-inline">现在没有需要你处理的事项。点“全部记录”可以查看刚才的决定。</p>'}
    <div class="lesson-result" role="status" aria-live="polite">${esc(result)}</div>
    <p class="lesson-small">这是根据论文讨论提出的界面改进：让人能挑重点看，同时保留完整过程。它没有证明注意力负担下降，也没有证明效率更高；需要你处理的节点由本例预先指定。</p>
    <button type="button" data-lab="mag-attention-reset">恢复这个情景</button>
  </div>`;
}

function handleMagenticLesson(action, button) {
  if (button && button.disabled) return false;
  const evidence = magenticLessonState.evidence;
  const attention = magenticLessonState.attention;
  switch (action) {
    case 'mag-evidence-view': evidence.viewed = true; break;
    case 'mag-evidence-check':
      if (!evidence.viewed || evidence.checked) return false;
      evidence.checked = true;
      break;
    case 'mag-evidence-accept':
      if (evidence.checked || evidence.accepted) return false;
      evidence.accepted = true;
      break;
    case 'mag-evidence-reset':
      magenticLessonState.evidence = { viewed: false, checked: false, accepted: false };
      break;
    case 'mag-attention-all': attention.view = 'all'; break;
    case 'mag-attention-pending': attention.view = 'pending'; break;
    case 'mag-payment-confirm':
      if (attention.payment !== 'waiting') return false;
      attention.payment = 'confirmed';
      break;
    case 'mag-payment-cancel':
      if (attention.payment !== 'waiting') return false;
      attention.payment = 'cancelled';
      break;
    case 'mag-attention-reset':
      magenticLessonState.attention = { view: 'all', payment: 'waiting' };
      break;
    default: return false;
  }
  if (typeof renderResearch === 'function') renderResearch();
  return true;
}

function resetMagenticLessons() {
  magenticLessonState.evidence = { viewed: false, checked: false, accepted: false };
  magenticLessonState.attention = { view: 'all', payment: 'waiting' };
}
