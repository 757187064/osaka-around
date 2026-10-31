import evidence from '../data/food-map-evidence.json';
import { foodCheckedOn, foodRegions, restaurants, foodById, dailyMeals, omittedFood } from '../data/food.js';
import { packingGroups, outingPlans } from '../data/preparation.js';
import { stays, placesById, trip } from '../data/index.js';

const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url,label) => `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`;
const maps = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const scores = Object.fromEntries(evidence.map(e=>[e.id,e]));
const score = r => Number(scores[r.id]?.rating || 0);
const jpy = n => `${n.toLocaleString()} 日元`;
let foodArea='all', foodOnly='all';

export function renderMealNote(day) {
 const m=dailyMeals[day.date];if(!m)return '';
 return `<aside class="day-meal-note"><strong>顺路吃饭</strong><p>${esc(m.text)}</p><div>${m.ids.map(id=>`<a href="#food-${id}" data-food-open="${id}">${esc(foodById[id].name)} ↗</a>`).join('')}<a href="#food">每日餐费与全部餐厅 ↗</a></div></aside>`;
}

export function renderOutingCard(day) {
 const stay=stays.find(s=>placesById[s.placeId].dates.includes(day.date)) || stays.at(-1);
 const p=placesById[stay.placeId], plan=outingPlans[day.date];
 return `<details class="outing-card" id="outing-${day.date}"><summary><span>当天出门卡 <small>酒店地址 · 返程 · 误车／雨雪简化</small></span><b aria-hidden="true">＋</b></summary><div class="outing-content"><div class="outing-heading"><strong>${esc(day.displayDate)} · ${esc(day.title)}</strong><span>${day.date==='2026-12-02'?'中国段北京时间，日本段当地时间':'日本段当地时间'}</span></div><dl><dt>${day.date==='2026-12-16'?'出发酒店':'今晚回哪里'}</dt><dd><strong>${esc(stay.name)}</strong><br>${esc(p.address)}<br>${link(maps(p.query),'酒店地图／联系入口')}</dd><dt>先守住的交通</dt><dd>${esc(plan[0])}</dd><dt>来不及时这样减</dt><dd>${esc(plan[1])}</dd></dl><p class="outing-note">“目标／预留”为规划余量，不是公布班次；参考时刻临行查运营方。提前存好离线截图，地图导航需自行选当天日期、出发时间和步行路径。</p><div class="outing-actions no-print"><button class="btn btn-light" data-print-outing="${day.date}">单独打印此卡／存 PDF</button><a href="#transport">页面交通参考表 ↗</a></div></div></details>`;
}

function restaurantHtml(r) {
 const e=scores[r.id], rating=score(r), high=rating>=4.2;
 const walk=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.query)}&travelmode=walking`;
 return `<article class="food-card" id="food-${r.id}" data-food-region="${r.region}" data-food-score="${rating}" data-food-cheap="${r.price[1]<=1700}"><div class="food-card-top"><span>${esc(foodRegions.find(x=>x[0]===r.region)[1])}</span><span class="food-rating ${high?'food-rating-high':''}">Google ${rating.toFixed(1)} · ${esc(e.reviews)} 条${high?' · 高分':''}</span></div><h4>${esc(r.name)}</h4><div class="food-price">${jpy(r.price[0])}–${jpy(r.price[1])}<small>／人／一餐</small></div><p>${esc(r.dish)}</p><p class="food-access"><strong>位置与交通</strong>${esc(r.access)}</p><p class="food-cutoff"><strong>放弃等位的界线</strong>${esc(r.cutoff)}</p><details class="food-more"><summary>什么时候吃、菜单依据与附近备选 <b aria-hidden="true">＋</b></summary><div><p><strong>加入行程：</strong>${esc(r.when)}</p><p><strong>价格依据：</strong>${esc(r.priceNote)}</p><p><strong>营业与休店：</strong>${esc(r.hours)}</p><p><strong>备选：</strong>${esc(r.fallback)}</p>${r.anime?`<p><strong>动画关联：</strong>${esc(r.anime)} ${link(r.animeSource,'背景对照记录')}</p>`:''}<div class="food-links">${link(r.source,r.sourceLabel)}${link(e.url || maps(r.query),'Google 评分原页')}</div></div></details><div class="food-links">${link(walk,'从当前位置步行导航')}${link(e.url || maps(r.query),'打开店铺地图')}</div></article>`;
}

export function updateFoodBudget() {
 const raw=Number(localStorage.getItem(trip.budget.exchangeRateStorageKey));
 const rate=Number.isFinite(raw)&&raw>0?raw:0.05;
 const mode=Number.isFinite(raw)&&raw>0?'采用预算栏手填汇率':'采用保守规划假设，非实时汇率';
 document.querySelector('#foodBudgetSummary').innerHTML=`<div><span>每日饮食上限</span><strong>200 元人民币</strong></div><div><span>换算为日元预算</span><strong>${jpy(Math.floor(200/rate))}</strong></div><p>${mode}：1 日元 = ${rate} 元人民币。含三餐、点心和饮料；餐厅范围是一餐，不是一天。到店看价，超预算用附近简餐替换。</p>`;
 document.querySelector('#mealBudgetBody').innerHTML=Object.entries(dailyMeals).map(([date,m])=>{
  const total=m.cost.reduce((a,b)=>a+b,0),cny=total*rate;
  return `<tr><th>${date.slice(5).replace('-','/')}</th>${m.cost.map(n=>`<td>${n.toLocaleString()}</td>`).join('')}<td><strong>${total.toLocaleString()} 日元</strong><small class="${cny>200?'over-budget':''}">约${cny.toFixed(0)}元${cny>200?' · 超200，需缩减':''}</small></td></tr>`;
 }).join('');
}

function applyFoodFilter() {
 let count=0;
 document.querySelectorAll('.food-card').forEach(card=>{
  const show=(foodArea==='all'||card.dataset.foodRegion===foodArea)&&(foodOnly==='all'||foodOnly==='high'&&Number(card.dataset.foodScore)>=4.2||foodOnly==='cheap'&&card.dataset.foodCheap==='true');
  card.hidden=!show;if(show)count++;
 });
 document.querySelector('#foodResultCount').textContent=`显示 ${count} 家 · ${foodOnly==='high'?'高分标准 Google ≥4.2':'低分特色与近站备选均如实标分'}`;
 document.querySelector('#foodEmpty').hidden=count>0;
}

export function renderFood() {
 document.querySelector('#foodContent').innerHTML=`<div class="food-budget-summary" id="foodBudgetSummary"></div><details class="meal-budget-fold"><summary>展开15天三餐分配 <small>含点心饮料；全部金额为日元</small><b aria-hidden="true">＋</b></summary><div class="meal-table-wrap"><table class="meal-budget-table"><thead><tr><th>日期</th><th>早餐</th><th>午餐</th><th>晚餐</th><th>点心饮料</th><th>当天合计</th></tr></thead><tbody id="mealBudgetBody"></tbody></table></div><p>这是消费额度分配，非已订套餐或商户报价；机场日及海鲜日留足预算。可在“机酒与交通 → 预算”调整汇率。</p></details><details class="specialty-fold"><summary>沿途9区吃什么 <b aria-hidden="true">＋</b></summary><div class="specialty-grid">${foodRegions.map(([,name,text])=>`<article><h4>${name}</h4><p>${esc(text)}</p></article>`).join('')}</div></details><div class="food-filter no-print"><label>目的地<select id="foodArea"><option value="all">全部沿途地点</option>${foodRegions.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>偏好<select id="foodOnly"><option value="all">全部顺路候选</option><option value="high">Google ≥4.2</option><option value="cheap">一餐预算上限 ≤1700日元</option></select></label></div><p class="food-evidence-note">Google Maps 分数与评价数量实查于 ${foodCheckedOn}，会变化；并非食べログ评分。店方菜单与“规划预算”分开标注。步行时间均为保守规划估计，非逐店实测导航，不含雪天、等红灯与行李耗时。</p><p id="foodResultCount" role="status"></p><div class="food-grid">${restaurants.map(restaurantHtml).join('')}</div><p id="foodEmpty" hidden>该条件下没有已核候选。可放宽评分筛选，先保交通与预算。</p><details class="food-rejections"><summary>筛掉了哪些常见推荐 <b aria-hidden="true">＋</b></summary><dl>${omittedFood.map(([name,text])=>`<dt>${esc(name)}</dt><dd>${esc(text)}</dd>`).join('')}</dl></details>`;
 updateFoodBudget();applyFoodFilter();
 document.querySelector('#foodArea').addEventListener('change',e=>{foodArea=e.target.value;applyFoodFilter();});
 document.querySelector('#foodOnly').addEventListener('change',e=>{foodOnly=e.target.value;applyFoodFilter();});
 document.addEventListener('click',e=>{
  const open=e.target.closest('[data-food-open]');if(!open)return;
  e.preventDefault();foodArea='all';foodOnly='all';document.querySelector('#foodArea').value='all';document.querySelector('#foodOnly').value='all';applyFoodFilter();
  const card=document.getElementById('food-'+open.dataset.foodOpen);card.querySelector('details').open=true;card.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+card.id);
 });
}

export function renderPacking(progress,onChange) {
 const items=packingGroups.flatMap(g=>g.items),complete=items.filter(([id])=>progress['pack-'+id]==='completed').length;
 document.querySelector('#packingGrid').innerHTML=`<p class="packing-progress" role="status">已装好 ${complete} / ${items.length} 项 <span>勾选状态仅保存在当前浏览器，不跨设备同步。</span></p><div class="packing-groups">${packingGroups.map(g=>`<details class="packing-group"><summary>${esc(g.title)} <small>${g.items.filter(([id])=>progress['pack-'+id]==='completed').length}/${g.items.length}</small><b aria-hidden="true">＋</b></summary><div>${g.items.map(([id,name,note])=>`<label class="packing-item"><input type="checkbox" data-pack-id="${id}" ${progress['pack-'+id]==='completed'?'checked':''}><span><strong>${esc(name)}</strong><small>${esc(note)}</small></span></label>`).join('')}</div></details>`).join('')}</div>`;
 document.querySelectorAll('[data-pack-id]').forEach(box=>box.addEventListener('change',()=>{
  progress['pack-'+box.dataset.packId]=box.checked?'completed':'';onChange();
  const open=[...document.querySelectorAll('.packing-group')].map(d=>d.open);renderPacking(progress,onChange);document.querySelectorAll('.packing-group').forEach((d,i)=>{d.open=open[i];});
 }));
}
