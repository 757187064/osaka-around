import { dailyGuides, sightsById } from '../data/guide.js';
import { mealStops } from '../data/meal-stops.js';
import { foodById } from '../data/food.js';
import { placesById } from '../data/index.js';
import { mapPanel, mapUrl, routeUrl } from './navigation.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const mealPlace = meal => meal.id ? foodById[meal.id] : meal;

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
  if (/列车途中/.test(time)) return 14 * 60;
  return 0;
}

export function renderDailyRoute(day) {
  const guide = dailyGuides[day.date];
  const stops = guide.stops.filter(stop => !stop.brief && !/替换|二选一/.test(stop.priority + stop.time));
  const points = [
    ...(transferPoints[day.date] || []),
    ...stops.map(stop => ({time:stop.time, name:sightsById[stop.id].name + (/可选|可删/.test(stop.priority) ? '（可选）' : ''), query:sightsById[stop.id].query})),
    ...(mealStops[day.date] || []).map(meal => ({time:meal.time, ...mealPlace(meal)}))
  ].sort((a,b) => clock(a.time) - clock(b.time));
  const start = placesById[day.placeIds[0]];
  return `<section class="day-route-overview" id="route-${day.date}"><h4>当天路线与地图</h4><div class="route-map-stops">${points.map((point,i) => `<button type="button" data-map-query="${esc(point.query)}" aria-pressed="${i===0}">${esc(point.time)} · ${esc(point.name)}</button>`).join('')}</div>${mapPanel(points[0]?.query || start.query, points[0]?.name || start.name, true)}</section>`;
}

export function renderDailySchedule(day) {
  const meals = mealStops[day.date] || [];
  const guide = dailyGuides[day.date];
  const entries = day.timeline.filter(entry => !/^(午餐|午餐与步行|餐饮与休息|晚饭与休息|晚饭休息|晚饭散步|晚餐与大浴场|休息)$/.test(entry.label)).map(entry => {
    const stop = guide.stops.find(stop => stop.time === entry.time);
    return {...entry, query:stop ? sightsById[stop.id].query : null};
  });
  for (const meal of meals) {
    const place = mealPlace(meal);
    entries.push({time:meal.time, label:meal.label + ' · ' + place.name, detail:meal.note, query:place.query, meal:true, origin:meal.origin});
  }
  const scheduled = entries.filter(entry => !/替换|备选/.test(entry.time + entry.label)).sort((a,b) => clock(a.time) - clock(b.time));
  return `<section class="daily-schedule"><h4>当天时间表</h4><ol class="day-plan-list">${scheduled.map(entry => `<li class="${entry.meal ? 'meal-slot' : ''}"><time>${esc(entry.time)}</time><div><strong>${esc(entry.label)}</strong><p>${esc(entry.detail)}</p>${entry.query ? `<a href="${esc(mapUrl(entry.query))}" target="_blank" rel="noreferrer">${entry.meal ? '餐厅／用餐区地图' : '地点地图'} ↗</a>${entry.origin ? ` <a href="${esc(routeUrl(entry.origin,entry.query,'walking'))}" target="_blank" rel="noreferrer">从上一站走过去 ↗</a>` : ''}` : ''}</div></li>`).join('')}</ol></section>`;
}
