import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {days,places,placesById,stays,transport,routeSegments,dayRouteIds,checklistGroups,trip} from '../data/index.js';
import {dailyGuides,sightsById,sources,animePlaces,auditRows} from '../data/guide.js';
const photos=JSON.parse(fs.readFileSync(new URL('../data/photos.json',import.meta.url)));
const dates=new Set(days.map(d=>d.date));
assert.equal(dates.size,15);
assert.equal(stays.reduce((n,s)=>n+s.nights,0),14);
assert.equal(new Set(stays.map(s=>s.city)).size,5);
assert.equal(trip.flights.reduce((n,f)=>n+f.amountRmb,0),trip.budget.airfareRmb);
const weekdays=['周日','周一','周二','周三','周四','周五','周六'];
for(let i=0;i<days.length;i++) {
 const d=days[i]; assert.equal(d.weekday,weekdays[new Date(d.date+'T12:00:00Z').getUTCDay()]);
 if(i) assert.equal(Date.parse(d.date)-Date.parse(days[i-1].date),86400000);
 assert.ok(d.timeline.length>=5); assert.ok(dailyGuides[d.date]);
 for(const id of d.placeIds)assert.ok(placesById[id],id);
 for(const id of dayRouteIds[d.date])assert.ok(routeSegments.some(s=>s.id===id),id);
 for(const stop of dailyGuides[d.date].stops)assert.ok(sightsById[stop.id],stop.id);
 if(i<14){const stay=stays.find(s=>s.name===d.sleep);assert.ok(stay,d.sleep);assert.ok(placesById[stay.placeId].dates.includes(d.date));}
}
for(const stay of stays)assert.equal(placesById[stay.placeId].dates.length,stay.nights);
for(const route of routeSegments)for(const id of route.points)assert.ok(placesById[id]);
for(const p of places){assert.ok(Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180);for(const date of p.dates)assert.ok(dates.has(date));}
for(const sight of Object.values(sightsById)){
 for(const id of sight.refs)assert.ok(sources[id],id);
 if(sight.photo){const p=photos[sight.photo];if(p?.path)assert.ok(fs.existsSync(p.path),p.path);}
}
for(const anime of animePlaces){for(const id of anime.points)assert.ok(sightsById[id]);for(const id of anime.refs)assert.ok(sources[id]);}
for(const [id,p] of Object.entries(photos)){assert.ok(p.path,`${id} photo requires review`);assert.ok(p.author&&p.license&&p.source);assert.ok(fs.statSync(p.path).size>1000);}
const checklistIds=checklistGroups.flatMap(g=>g.items.map(i=>i.id));assert.equal(new Set(checklistIds).size,checklistIds.length);
for(const t of transport)assert.ok(Number.isFinite(t.budgetJPY)&&t.budgetJPY>=0);
assert.equal(auditRows.length,days.length);
assert.ok(!JSON.stringify(days).includes('14:54'));
console.log(`PASS: ${days.length} days, 14 nights, ${transport.length} transport items, ${Object.keys(sightsById).length} sights, ${Object.keys(photos).length} attributed photos, ${animePlaces.length} regional anime checks.`);

// Every full illustrated card must have its own image, including revisits.
const illustrated=[];
for(const [date,guide] of Object.entries(dailyGuides)) for(const stop of guide.stops) {
 if(stop.brief)continue;
 const sight=sightsById[stop.id],key=stop.photo||sight.photo;
 assert.ok(key,`${date} ${stop.id}: missing precise image`);
 const photo=photos[key];assert.ok(photo?.path,`${stop.id}: missing photo manifest`);
 illustrated.push({id:stop.id,key,source:photo.source,hash:createHash('sha256').update(fs.readFileSync(photo.path)).digest('hex')});
}
for(const property of ['key','source','hash']) assert.equal(new Set(illustrated.map(p=>p[property])).size,illustrated.length,`reused image ${property}`);
const descriptions=Object.values(sightsById).map(s=>s.why);assert.equal(new Set(descriptions).size,descriptions.length,'repeated description');
assert.ok(!routeSegments.some(s=>s.points.includes('miyama')),'Miyama must not remain an active route');
assert.deepEqual(days.find(d=>d.date==='2026-12-03').placeIds,['kyoto','toyosato']);
assert.ok(days.find(d=>d.date==='2026-12-05').placeIds.includes('uji'));
console.log(`PASS: ${illustrated.length} distinct full-card images, unique source URLs and file hashes; no repeated descriptions.`);
