import { mealStops } from '../data/meal-stops.js';
import { foodById } from '../data/food.js';
import { mapPanel, routeUrl } from './navigation.js';
import { placesById } from '../data/index.js';
import { sources, sightsById, dailyGuides, animePlaces, reminders } from '../data/guide.js';
import photos from '../data/photos.json';
import { transitPhotos } from '../data/transit-photos.js';
const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageFiles = import.meta.glob('./images/*.{jpg,png}', { eager: true, query: '?url', import: 'default' });
export const photoUrl = key => photos[key]?.path ? imageFiles['./images/' + photos[key].path.split('/').at(-1)] : ''; 
const maps = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const link = (url,label,cls='') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)} ↗</a>`;
const refs = ids => `<details class="source-links"><summary>查询来源 · ${[...new Set(ids)].filter(id=>sources[id]).length} <span aria-hidden="true">↗</span></summary><div class="guide-refs">${[...new Set(ids)].map(id=>sources[id]?link(sources[id][1],sources[id][0]):'').join('')}</div></details>`;
export function photoHtml(key,title) {
 const p=photos[key];
 if (!photoUrl(key)) return '';
 return `<figure class="guide-photo"><a href="${photoUrl(key)}" target="_blank" rel="noreferrer"><img src="${photoUrl(key)}" alt="${esc(title)}" loading="lazy" decoding="async" width="1000" height="650"></a><figcaption>${esc(title)}${p.year ? ' · ' + esc(p.year) : ''} · ${link(p.source,p.author)} · ${link(p.licenseUrl,p.license)}</figcaption></figure>`;
}
// First detail location is a navigation target for transport-only references.
const owners = {};
for (const [date, guide] of Object.entries(dailyGuides)) for (const [index, stop] of guide.stops.entries()) {
 if (!stop.brief && !owners[stop.id]) owners[stop.id] = {date,index};
}
export function renderDayGuide(day) {
 const guide=dailyGuides[day.date]; if(!guide)return '';
 const previews = transitPhotos[day.date] || [];
 return `<section class="day-detail-guide" aria-label="${day.displayDate}景点攻略"><div class="guide-heading"><h4>景点图文</h4></div>${guide.fallback?`<details class="campus-fallback"><summary><span>备选路线</span>${esc(guide.fallback.title)}<b aria-hidden="true">＋</b></summary><div class="fallback-body"><p>${esc(guide.fallback.text)}</p><ol>${guide.fallback.steps.map(([time,text])=>`<li><strong>${esc(time)}</strong><span>${esc(text)}</span></li>`).join('')}</ol>${mapPanel(guide.fallback.mapQuery,'京都大学吉田校区')}${refs(guide.fallback.refs)}</div></details>`:''}<div class="sight-grid">${previews.map(({ key, caption }) => `<article class="sight-preview">${photoHtml(key, caption)}</article>`).join('')}${guide.stops.map((s,index)=>{
 const p=sightsById[s.id], owner=owners[s.id];
 const previous=guide.stops.slice(0,index).filter(stop=>!stop.brief && !/二选一|替换|可删|可选/.test(stop.priority)).at(-1);
 const minute=time=>{const m=time.match(/(\d{1,2}):(\d{2})/);return m ? +m[1]*60 + +m[2] : -1;};
 const meal=(mealStops[day.date] || []).filter(meal=>minute(meal.time)<minute(s.time) && minute(meal.time)>minute(previous?.time || '')).at(-1);
 const origin=meal ? (meal.id ? foodById[meal.id].query : meal.query) : previous ? sightsById[previous.id].query : day.mapLegs?.[0]?.from || placesById[day.placeIds[0]].query;
 if(!p)return '';
 if(s.brief) return `<article class="sight-reference"><strong>${esc(s.time)} · ${esc(p.name)}</strong><p>${esc(s.how)}</p>${link(maps(p.query),'地点地图','btn btn-light')}${owner?`<button class="btn btn-light" data-sight-date="${owner.date}" data-sight-id="${esc(s.id)}">查看该地点完整攻略 ↗</button>`:''}</article>`;
 return `<article class="sight-preview" id="sight-${esc(s.id)}">
   ${photoHtml(s.photo || p.photo, s.photoCaption || p.photoCaption || p.name)}
   <div class="sight-preview-heading">
     <p>${esc(s.time)} · ${esc(s.priority)}</p>
     <h5>${esc(p.name)}</h5>
   </div>
   <p class="sight-how">${esc(s.how)}</p>
   <div class="sight-route-links">${previous || meal ? link(routeUrl(origin,p.query,'walking'),'步行路线') : ''}${link(routeUrl(origin,p.query),'公共交通')}</div>
   ${mapPanel(p.query,p.name)}
   <details class="sight-entry">
     <summary>看点与开放时间</summary>
     <div class="sight-content">
       <p>${esc(p.why)}</p>
       <p>${esc(p.practical)}</p>
       ${link(maps(p.query),'景点地图','btn btn-light')}${refs(p.refs)}
     </div>
   </details>
 </article>`;
 }).join('')}</div></section>`;
}
export function renderResearch() {
 document.querySelector('#animeGrid').innerHTML=animePlaces.filter(p=>p.points.length).map((p,i)=>{
 const dates=Object.entries(dailyGuides).filter(([date,guide])=>guide.stops.some(stop=>p.points.includes(stop.id))).map(([date])=>date);
 return `<article class="anime-card"><div class="anime-index">${String(i+1).padStart(2,'0')}</div><div class="anime-main"><div class="card-kicker">${esc(p.area)}</div><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p>${dates.map(date=>`<a class="quiet-link" href="#day-${date}" data-jump-day="${date}">${date.slice(5).replace('-','/')} 行程 ↗</a>`).join(' · ')}<p>${esc(p.route)}</p><div class="anime-points">${p.points.map(id=>link(maps(sightsById[id].query),sightsById[id].name,'link-chip')).join('')}</div>${mapPanel(sightsById[p.points[0]].query,p.title)}${refs(p.refs)}</div></article>`;
 }).join('');
 document.querySelector('#bookingGuide').innerHTML=`<article class="card booking-card"><h4>12/14 鸟取 → 大阪 → 京都</h4><div class="comparison-wrap"><table class="guide-comparison"><thead><tr><th></th><th>Super Hakuto＋JR</th><th>高速巴士＋京都接驳</th></tr></thead><tbody><tr><th>耗时</th><td>鸟取→大阪约2小时27分，再换JR至京都</td><td>鸟取→难波约3–3.5小时，再留1–1.5小时到京都</td></tr><tr><th>预算</th><td>约8,000日元</td><td>巴士约4,200日元，另加难波→京都</td></tr><tr><th>到京都</th><td>14:21→16:48参考，到大阪接新快速，约18:00入住</td><td>选择中午或午后较早班次</td></tr><tr><th>购票</th><td>全车指定席，11/14北京时间09:00开售</td><td>按运营商开放日期预约</td></tr></tbody></table></div><p>优先列车，换乘大阪站较方便。巴士节约约几千日元，但难波接京都更费时，冬季可能受道路积雪与拥堵影响。</p>${refs(['jr','reserve','bus'])}</article><article class="card booking-card"><h4>12/1 K681 硬卧 → 12/2 大连机场</h4><p>12/1北京站20:10 → 12/2大连站07:51（参考）→ 直接打车至周水子机场，目标09:15到达 → 11:40乘9C6987。</p><p>出站及转场留60–90分钟。火车晚点60分钟后，机场余量约1小时20分至1小时50分，需立即按航班截载时间判断。更宽松的备选是12/1高铁到大连住宿。</p><p>11/17北京站10:00起售参考，09:50准备12306购票，选择硬卧。</p>${refs(['k681','trainCN','saleCN','airline'])}</article>`;
 const bookingLabels=[['12/14 · 鸟取返程：列车还是巴士','推荐列车；展开比较耗时、预算与冬季风险'],['12/2 · K681 接大连国际航班','准点可衔接；火车晚点会明显压缩机场余量']];
 document.querySelectorAll('#bookingGuide > article').forEach((card,i)=>{const detail=document.createElement('details');detail.className='booking-details';detail.innerHTML=`<summary><span>${esc(bookingLabels[i][0])}<small>${esc(bookingLabels[i][1])}</small></span><b aria-hidden="true">＋</b></summary>`;card.replaceWith(detail);detail.append(card);});
 document.querySelector('#reminderGrid').innerHTML=reminders.map(r=>`<article class="card reminder-card"><div class="card-kicker">购票提醒 / 已建立</div><h4>${esc(r.title)}</h4><strong>${esc(r.date)}</strong><small>${esc(r.zone)}</small><p>${esc(r.text)}</p></article>`).join('');
 document.querySelector('#sourceIndex').innerHTML=`<div class="guide-refs">${Object.values(sources).map(([title,url])=>link(url,title)).join('')}</div>`;
}
