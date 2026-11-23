import { dailyGuides, sightsById } from '../data/guide.js';
import { mealStops } from '../data/meal-stops.js';
import { foodById } from '../data/food.js';
import { placesById } from '../data/index.js';
import { transitPhotos } from '../data/transit-photos.js';
import { mapPanel, mapUrl, routeUrl } from './navigation.js';
import { photoHtml } from './guide.js';
import { renderMealDetails } from './food.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mealPlace = meal => meal.id ? foodById[meal.id] : meal;
const optional = stop => /替换|二选一|可选|可删/.test(stop.priority + stop.time);

const transferPoints = {
  '2026-12-02': [
    {time:'15:30',name:'关西国际机场',query:'Kansai International Airport Terminal 2'},
    {time:'19:00',name:'京都站',query:'Kyoto Station'}
  ],
  '2026-12-14': [
    {time:'14:21参考',name:'鸟取站',query:'Tottori Station'},
    {time:'16:48参考',name:'大阪站',query:'Osaka Station'},
    {time:'18:00目标',name:'京都 · 三条住宿',query:'Piece Hostel Sanjo'}
  ],
  '2026-12-16': [
    {time:'09:45',name:'三条住宿出发',query:'Piece Hostel Sanjo'},
    {time:'13:00目标',name:'关西机场T2',query:'Kansai International Airport Terminal 2'},
    {time:'18:15中国时间',name:'大连周水子机场',query:'大连周水子国际机场'}
  ]
};

function clock(time) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  if (/抵达后|到达后|中午/.test(time)) return 12 * 60;
  if (/入住后|晚上/.test(time)) return 20 * 60;
  if (/列车途中/.test(time)) return 14 * 60 + 50;
  return 0;
}

export function renderDailyRoute(day) {
  const stops = dailyGuides[day.date].stops.filter(stop => !stop.brief && !optional(stop));
  const points = [
    ...(transferPoints[day.date] || []),
    ...stops.map(stop => ({time:stop.time, name:sightsById[stop.id].name, query:sightsById[stop.id].query})),
    ...(mealStops[day.date] || []).map(meal => ({time:meal.time, ...mealPlace(meal)}))
  ].sort((a,b) => clock(a.time) - clock(b.time));
  const start = placesById[day.placeIds[0]];
  return `<section class="day-route-overview" id="route-${day.date}"><p class="section-kicker">ON THE MAP</p><h4>当天地图</h4><div class="route-map-stops">${points.map((point,i) => `<button type="button" data-map-query="${esc(point.query)}" aria-pressed="${i===0}"><span>${esc(point.time)}</span>${esc(point.name)}</button>`).join('')}</div>${mapPanel(points[0]?.query || start.query, points[0]?.name || start.name, true)}</section>`;
}

function sourceLinks(ids) {
  // Use the same source index as the standalone attraction cards.
  return ids.length ? `<a href="#research-sources" class="source-shortcut">查看资料来源 ↗</a>` : '';
}

function renderStop(stop, origin, walkable = false) {
  const sight = sightsById[stop.id];
  return `<article class="journey-card sight-preview" id="sight-${stop.id}">
    ${photoHtml(stop.photo || sight.photo, stop.photoCaption || sight.photoCaption || sight.name)}
    <div class="journey-copy"><p class="entry-time">${esc(stop.time)}<span>${optional(stop) ? '可选 / 替换' : '游览'}</span></p><h4>${esc(sight.name)}</h4>
    <p class="sight-description">${esc(sight.why)}</p><p class="entry-access"><strong>怎么走</strong>${esc(stop.how)}</p><p class="entry-practical">${esc(sight.practical)}</p>
    <div class="entry-links"><a href="${mapUrl(sight.query)}" target="_blank" rel="noreferrer">地点地图 ↗</a>${walkable && origin !== sight.query ? `<a href="${routeUrl(origin,sight.query,'walking')}" target="_blank" rel="noreferrer">步行 ↗</a>` : ''}<a href="${routeUrl(origin,sight.query)}" target="_blank" rel="noreferrer">公共交通 ↗</a>${sourceLinks(sight.refs)}</div>${mapPanel(sight.query,'展开此处地图')}</div></article>`;
}

export function renderDailySchedule(day) {
  const guide = dailyGuides[day.date];
  const meals = mealStops[day.date] || [];
  const represented = new Set();
  const entries = day.timeline.filter(entry => !/^(午餐|午餐与步行|餐饮与休息|晚饭与休息|晚饭休息|晚饭散步|晚餐与大浴场|休息|可选游玩)$/.test(entry.label) && !/替换|备选/.test(entry.time + entry.label)).map(entry => {
    const index = guide.stops.findIndex(stop => stop.time === entry.time);
    const stop = guide.stops[index];
    if (stop && !stop.brief) {
      represented.add(index);
      return optional(stop) ? null : {time:stop.time, stop};
    }
    return {...entry, query:stop?.brief ? sightsById[stop.id].query : null};
  }).filter(Boolean);
  guide.stops.forEach((stop,index) => {
    if (!stop.brief && !optional(stop) && !represented.has(index)) entries.push({time:stop.time, stop});
  });
  for (const meal of meals) entries.push({time:meal.time, meal});
  entries.sort((a,b) => clock(a.time) - clock(b.time));
  let origin = day.mapLegs?.[0]?.from || placesById[day.placeIds[0]].query;
  let mealIndex = 0;
  let walkable = false;
  const main = entries.map(entry => {
    if (entry.stop) {
      const html = renderStop(entry.stop, origin, walkable);
      origin = sightsById[entry.stop.id].query;
      walkable = true;
      return html;
    }
    if (entry.meal) {
      const meal = entry.meal, place = mealPlace(meal);
      const html = `<article class="journey-meal" ${mealIndex++ === 0 ? `id="meals-${day.date}"` : ''}><div class="meal-marker" aria-hidden="true">食</div><div class="journey-copy"><p class="entry-time">${esc(meal.time)}<span>${esc(meal.label)}</span></p><h4>${esc(place.name)}</h4><p>${esc(meal.note)}</p>${renderMealDetails(meal)}<div class="entry-links"><a href="${mapUrl(place.query)}" target="_blank" rel="noreferrer">用餐地图 ↗</a>${meal.origin || walkable ? `<a href="${routeUrl(meal.origin || origin,place.query,'walking')}" target="_blank" rel="noreferrer">从上一站步行 ↗</a>` : ''}</div>${mapPanel(place.query,'展开用餐地图')}</div></article>`;
      origin = place.query;
      walkable = true;
      return html;
    }
    if (entry.query) origin = entry.query;
    walkable = false;
    return `<article class="journey-transfer"><time>${esc(entry.time)}</time><div><h4>${esc(entry.label)}</h4><p>${esc(entry.detail)}</p></div></article>`;
  }).join('');
  const alternatives = guide.stops.filter(stop => !stop.brief && optional(stop));
  const previews = (transitPhotos[day.date] || []).map(({key,caption}) => photoHtml(key,caption)).join('');
  return `<section class="daily-schedule" id="plan-${day.date}"><div class="journey-section-head"><p class="section-kicker">YOUR DAY</p><h3>当天图文行程</h3></div>${previews ? `<div class="arrival-gallery">${previews}</div>` : ''}<div class="journey-feed">${main}</div>${alternatives.length ? `<section class="day-alternatives"><div class="journey-section-head"><p class="section-kicker">OPTIONAL</p><h3>有余量再去 / 替换方案</h3></div>${alternatives.map(stop=>renderStop(stop,placesById[day.placeIds[0]].query)).join('')}</section>` : ''}${guide.fallback ? `<details class="campus-fallback"><summary>${esc(guide.fallback.title)}</summary><p>${esc(guide.fallback.text)}</p><ol>${guide.fallback.steps.map(([time,text])=>`<li><strong>${esc(time)}</strong> ${esc(text)}</li>`).join('')}</ol>${mapPanel(guide.fallback.mapQuery,'京都大学吉田校区')}</details>` : ''}</section>`;
}
