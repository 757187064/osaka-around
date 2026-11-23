import { insurance } from '../data/insurance.js';

export function insuranceHtml(compact = false) {
  if (compact) return `<h3>已购旅行保险</h3><p>${insurance.insurer} · ${insurance.name}</p><p>${insurance.period}，目的地${insurance.destination}。境外意外／突发疾病医疗100万元，医疗运送与送返100万元，金额均为人民币。</p><p>有流量时从蚂蚁保保单订单联系理赔／客服。${insurance.phone}。就医留诊断和付款凭证，证件丢失24小时内向当地警方报案。</p>`;
  return `<section class="insurance-panel" id="insurance"><div class="section-head"><div><p class="section-kicker">TRAVEL COVER</p><h2>已购保险与理赔</h2></div><span class="status-badge purchased">✓ 已购买</span></div><p class="insurance-name">${insurance.insurer} · ${insurance.name}</p><p>${insurance.period} · ${insurance.destination}</p><p class="coverage-caption">以下保障金额均为人民币</p><div class="coverage-grid">${insurance.coverage.map(([name,amount,note])=>`<article><h3>${name}</h3><strong>${amount}</strong><p>${note}</p></article>`).join('')}</div><h3>遇到情况怎么处理</h3><ol class="insurance-actions">${insurance.actions.slice(1).map(([title,body])=>`<li><strong>${title}</strong><p>${body}</p></li>`).join('')}</ol><p>${insurance.phone} · <a href="${insurance.website}" target="_blank" rel="noreferrer">泰康在线 ↗</a></p><details class="source-links"><summary>保单对应页码</summary><p>${insurance.source}</p></details></section>`;
}

export function renderInsurance() {
  document.querySelector('#insuranceContent').innerHTML = insuranceHtml();
}
