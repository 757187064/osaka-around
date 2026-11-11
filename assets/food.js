import { mealStops } from '../data/meal-stops.js';
import { mapPanel } from './navigation.js';
import evidence from '../data/food-map-evidence.json';
import { foodCheckedOn, foodRegions, restaurants, foodById, dailyMeals } from '../data/food.js';
import { packingGroups, outingPlans, decisionPoints, decisionSources } from '../data/preparation.js';
import { stays, placesById, trip } from '../data/index.js';

const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url,label) => `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`;
const maps = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const scores = Object.fromEntries(evidence.map(e=>[e.id,e]));
const score = r => Number(scores[r.id]?.rating || 0);
const jpy = n => `${n.toLocaleString()} 日元`;
let foodArea='all', foodOnly='all';

export function renderMealNote(day) {
 const meals=mealStops[day.date] || [];
 return `<section class="day-dining"><h4>当天吃什么</h4><div class="day-dining-grid">${meals.map(meal=>{
  const r=meal.id ? foodById[meal.id] : meal;
  const alternative=meal.alternative ? foodById[meal.alternative] : null;
  const rating=meal.id ? scores[meal.id] : null;
  return `<article class="day-restaurant"><p class="meal-time">${esc(meal.time)} · ${esc(meal.label)}</p><h5>${esc(r.name)}</h5>${meal.id?`<p class="meal-price">${jpy(r.price[0])}–${jpy(r.price[1])} / 人 · Google ${esc(rating.rating)} <small>（${foodCheckedOn}）</small></p><p>${esc(r.dish)}</p>${r.anime?`<p>${esc(r.anime)} ${link(r.animeSource,'取景对照')}</p>`:''}<details><summary>菜单与营业时间</summary><p>${esc(r.hours)}</p><p>${esc(r.priceNote)}</p>${link(r.source,r.sourceLabel)}</details>`:''}${mapPanel(r.query,r.name)}${alternative?`<details class="meal-alternative"><summary>替换餐厅 · ${esc(alternative.name)}</summary><p>${esc(alternative.when)}</p><p>${esc(alternative.access)}</p><p>${esc(alternative.cutoff)}</p>${link(maps(alternative.query),'餐厅地图')}<a href="#food-${alternative.id}" data-food-open="${alternative.id}">菜单与详情 ↗</a></details>`:''}</article>`;
 }).join('')}</div></section>`;
}

export function renderOutingCard(day) {
 const stay=stays.find(s=>placesById[s.placeId].dates.includes(day.date)) || stays.at(-1);
 const p=placesById[stay.placeId], plan=outingPlans[day.date];
 return `<details class="outing-card" id="outing-${day.date}"><summary><span>当天出门卡 <small>酒店地址 · 返程 · 误车／雨雪简化</small></span><b aria-hidden="true">＋</b></summary><div class="outing-content"><div class="outing-heading"><strong>${esc(day.displayDate)} · ${esc(day.title)}</strong><span>${day.date==='2026-12-02'?'中国段北京时间，日本段当地时间':'日本段当地时间'}</span></div><dl><dt>${day.date==='2026-12-16'?'出发酒店':'今晚回哪里'}</dt><dd><strong>${esc(stay.name)}</strong><br>${esc(p.address)}<br>${link(maps(p.query),'酒店地图／联系入口')}</dd><dt>先守住的交通</dt><dd>${esc(plan[0])}</dd>${decisionPoints[day.date] ? `<dt>几点决定改线</dt><dd>${esc(decisionPoints[day.date])}<br>${link(decisionSources[day.date][1], decisionSources[day.date][0])}</dd>` : ''}<dt>来不及时这样减</dt><dd>${esc(plan[1])}</dd></dl><div class="outing-actions no-print"><button class="btn btn-light" data-print-outing="${day.date}">单独打印此卡／存 PDF</button><a href="#transport">页面交通参考表 ↗</a><a href="#offline-kit">离线急用页 ↗</a></div></div></details>`;
}

function restaurantHtml(r) {
 const e=scores[r.id], rating=score(r), high=rating>=4.2;
 const dates=Object.entries(mealStops).filter(([,meals])=>meals.some(meal=>meal.id===r.id || meal.alternative===r.id)).map(([date])=>date);
 const walk=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.query)}&travelmode=walking`;
 return `<article class="food-card" id="food-${r.id}" data-food-region="${r.region}" data-food-score="${rating}" data-food-cheap="${r.price[1]<=1700}"><div class="food-card-top"><span>${esc(foodRegions.find(x=>x[0]===r.region)[1])}</span><span class="food-rating ${high?'food-rating-high':''}">Google ${rating.toFixed(1)} · ${esc(e.reviews)} 条${high?' · 高分':''}</span></div><h4>${esc(r.name)}</h4><div class="restaurant-days">${dates.map(date=>`<a href="#day-${date}" data-jump-day="${date}">${date.slice(5).replace('-','/')} 当天行程 ↗</a>`).join('')}</div><div class="food-price">${jpy(r.price[0])}–${jpy(r.price[1])}<small>／人／一餐</small></div><p>${esc(r.dish)}</p><p class="food-access"><strong>位置与交通</strong>${esc(r.access)}</p><p class="food-cutoff"><strong>放弃等位的界线</strong>${esc(r.cutoff)}</p><details class="food-more"><summary>菜单、营业与附近备选 <b aria-hidden="true">＋</b></summary><div><p><strong>价格依据：</strong>${esc(r.priceNote)}</p><p><strong>营业与休店：</strong>${esc(r.hours)}</p><p><strong>备选：</strong>${esc(r.fallback)}</p>${r.anime?`<p><strong>动画关联：</strong>${esc(r.anime)} ${link(r.animeSource,'背景对照记录')}</p>`:''}<div class="food-links">${link(r.source,r.sourceLabel)}${link(e.url || maps(r.query),'Google 评分原页')}</div></div></details><div class="food-links">${link(walk,'从当前位置步行导航')}${link(e.url || maps(r.query),'打开店铺地图')}</div></article>`;
}

export function updateFoodBudget() {
 const raw=Number(localStorage.getItem(trip.budget.exchangeRateStorageKey));
 const rate=Number.isFinite(raw)&&raw>0?raw:0.05;

 document.querySelector('#foodBudgetSummary').innerHTML=`<div><span>每日饮食上限</span><strong>200 元人民币</strong></div><div><span>换算为日元预算</span><strong>${jpy(Math.floor(200/rate))}</strong></div><p>1 日元 ≈ ${rate} 元人民币 · 含三餐、点心和饮料</p>`;
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
 document.querySelector('#foodResultCount').textContent=`显示 ${count} 家 · ${foodOnly==='high'?'Google ≥4.2':'沿途餐厅'}`;
 document.querySelector('#foodEmpty').hidden=count>0;
}

export function renderFood() {
 document.querySelector('#foodContent').innerHTML=`<div class="food-budget-summary" id="foodBudgetSummary"></div><details class="meal-budget-fold"><summary>展开15天三餐分配 <small>含点心饮料；全部金额为日元</small><b aria-hidden="true">＋</b></summary><div class="meal-table-wrap"><table class="meal-budget-table"><thead><tr><th>日期</th><th>早餐</th><th>午餐</th><th>晚餐</th><th>点心饮料</th><th>当天合计</th></tr></thead><tbody id="mealBudgetBody"></tbody></table></div><p>可在“准备 → 预算与汇率”调整换算汇率。</p></details><details class="specialty-fold"><summary>沿途9区吃什么 <b aria-hidden="true">＋</b></summary><div class="specialty-grid">${foodRegions.map(([,name,text])=>`<article><h4>${name}</h4><p>${esc(text)}</p></article>`).join('')}</div></details><div class="food-filter no-print"><label>目的地<select id="foodArea"><option value="all">全部沿途地点</option>${foodRegions.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>偏好<select id="foodOnly"><option value="all">全部顺路候选</option><option value="high">Google ≥4.2</option><option value="cheap">一餐预算上限 ≤1700日元</option></select></label></div><p class="food-checked-date">Google 评分记录于 ${foodCheckedOn}</p><p id="foodResultCount" role="status"></p><div class="food-grid">${restaurants.map(restaurantHtml).join('')}</div><p id="foodEmpty" hidden>该条件下没有已核候选。可放宽评分筛选，先保交通与预算。</p>`;
 updateFoodBudget();applyFoodFilter();
 document.querySelector('#foodArea').addEventListener('change',e=>{foodArea=e.target.value;applyFoodFilter();});
 document.querySelector('#foodOnly').addEventListener('change',e=>{foodOnly=e.target.value;applyFoodFilter();});
 document.addEventListener('click',e=>{
  const open=e.target.closest('[data-food-open]');if(!open)return;
  e.preventDefault();foodArea='all';foodOnly='all';document.querySelector('#foodArea').value='all';document.querySelector('#foodOnly').value='all';applyFoodFilter();
  const card=document.getElementById('food-'+open.dataset.foodOpen);card.querySelector('details').open=true;location.hash=card.id;
 });
}

export function renderPacking(progress,onChange) {
 const items=packingGroups.flatMap(g=>g.items),complete=items.filter(([id])=>progress['pack-'+id]==='completed').length;
 document.querySelector('#packingGrid').innerHTML=`<p class="packing-progress" role="status">已装好 ${complete} / ${items.length} 项</p><div class="packing-groups">${packingGroups.map(g=>`<details class="packing-group"><summary>${esc(g.title)} <small>${g.items.filter(([id])=>progress['pack-'+id]==='completed').length}/${g.items.length}</small><b aria-hidden="true">＋</b></summary><div>${g.items.map(([id,name,note])=>`<label class="packing-item"><input type="checkbox" data-pack-id="${id}" ${progress['pack-'+id]==='completed'?'checked':''}><span><strong>${esc(name)}</strong><small>${esc(note)}</small></span></label>`).join('')}</div></details>`).join('')}</div>`;
 document.querySelectorAll('[data-pack-id]').forEach(box=>box.addEventListener('change',()=>{
  progress['pack-'+box.dataset.packId]=box.checked?'completed':'';onChange();
  const open=[...document.querySelectorAll('.packing-group')].map(d=>d.open);renderPacking(progress,onChange);document.querySelectorAll('.packing-group').forEach((d,i)=>{d.open=open[i];});
 }));
}
