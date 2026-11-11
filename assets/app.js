import { bindInlineMaps, loadOpenMaps } from './navigation.js';
import { renderDailyRoute, renderDailySchedule } from './day-route.js';
import { renderOfflineKit } from './offline-kit.js';
import { renderFood, renderMealNote, renderOutingCard, renderPacking, updateFoodBudget } from './food.js';
import { renderDayGuide, renderResearch } from './guide.js';
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  NavigationControl,
  Popup as MapLibrePopup,
  setWorkerUrl
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {
  checklistGroups,
  dayRouteIds,
  days,
  officialLinks,
  places,
  placesById,
  routeGroups,
  routeSegments,
  stays,
  transport,
  transportClasses,
  transportStatus,
  trip
} from '../data/index.js';

setWorkerUrl(workerUrl);

const $ = (selector) => document.querySelector(selector);
const progressKey = 'japan-trip-2026-progress-v1';
const daysByDate = Object.fromEntries(days.map((day) => [day.date, day]));
const segmentsById = Object.fromEntries(routeSegments.map((segment) => [segment.id, segment]));
let activeDate = days[0].date;
let mapAdapter = null;
let mapRequested = false;
let mapDay = null;
let sideTripsVisible = true;
let resetArmed = false;
let progress = readProgress();

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(progressKey) || '{}');
  } catch {
    return {};
  }
}

function saveProgress() {
  window.localStorage.setItem(progressKey, JSON.stringify(progress));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function directionsUrl(origin, destination) {
  const params = new URLSearchParams({ api: '1', origin, destination, travelmode: 'transit' });
  return `https://www.google.com/maps/dir/?${params}`;
}

function statusBadge(status) {
  const definition = transportStatus[status];
  return `<span class="status-badge ${status}">${definition.label}</span>`;
}

function markerEmoji(place) {
  if (place.kind === 'airport') return '✈';
  if (place.kind === 'onsen') return '♨';
  if (place.sequence?.length) return `<span class="sequence">${place.sequence.join('/')}</span>`;
  if (place.kind === 'rail') return '🚆';
  return place.kind === 'stay' ? '●' : '●';
}

function getContextDay(place) {
  if (activeDate && place.dates.includes(activeDate)) return daysByDate[activeDate];
  return days.find((day) => place.dates.includes(day.date)) || days[0];
}

function popupHtml(place) {
  const day = getContextDay(place);
  return `<div class="popup-title">${escapeHtml(place.name)}</div>
    ${place.address ? `<div class="popup-line"><strong>地址：</strong>${escapeHtml(place.address)}</div>` : ''}
    <div class="popup-line"><strong>日期：</strong>${escapeHtml(day.displayDate)} ${escapeHtml(day.weekday)}</div>
    <div class="popup-actions"><a target="_blank" rel="noreferrer" href="${mapsSearchUrl(place.query)}">Google Maps ↗</a><button data-popup-day="${day.date}">查看当天行程</button></div>`;
}

function bindPopupActions() {
  document.querySelectorAll('[data-popup-day]').forEach((button) => {
    button.addEventListener('click', () => goTo('day-' + button.dataset.popupDay));
  });
}

function segmentCoordinates(segment, reverse = false) {
  const coordinates = segment.points.map((id) => [placesById[id].lng, placesById[id].lat]);
  return reverse ? coordinates.reverse() : coordinates;
}

function idsForDay(day) {
  return dayRouteIds[day.date] || [];
}

function boundsForSegments(segmentIds) {
  const coordinates = segmentIds.flatMap((id) => segmentCoordinates(segmentsById[id]));
  if (!coordinates.length) return null;
  return coordinates.reduce((bounds, coordinate) => bounds.extend(coordinate), new LngLatBounds(coordinates[0], coordinates[0]));
}

function setProvider(label) {
  $('#mapProvider').textContent = label;
}

function hideMapMessage() {
  const message = $('#mapFallbackMessage');
  message.hidden = true;
  message.innerHTML = '';
}

function showMapMessage(message) {
  const target = $('#mapFallbackMessage');
  target.hidden = false;
  target.innerHTML = `<div><strong>地图暂时无法载入</strong><p>${escapeHtml(message)}</p><button class="btn btn-primary" id="retryMap">重试地图</button></div>`;
  $('#retryMap').addEventListener('click', () => void initializeMap());
}

class MapLibreAdapter {
  constructor(container, style) {
    this.container = container;
    this.style = style;
    this.map = null;
    this.markers = new Map();
  }

  async init() {
    this.map = new MapLibreMap({
      container: this.container,
      style: this.style,
      center: [135.1, 35.2],
      zoom: 7.2,
      attributionControl: true
    });
    this.map.addControl(new NavigationControl(), 'top-left');
    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('OpenFreeMap loading timeout')), 12000);
      this.map.once('load', () => { window.clearTimeout(timeout); resolve(); });
      this.map.once('error', (event) => {
        if (event.error?.message?.includes('style')) {
          window.clearTimeout(timeout);
          reject(event.error);
        }
      });
    });
    this.addRouteLayers();
    this.addMarkers();
    this.fitAll();
  }

  addRouteLayers() {
    this.addArrowImage('main-route-arrow', '#063a90');
    this.addArrowImage('side-route-arrow', '#a65b00');
    const mainFeatures = routeSegments.filter((segment) => segment.type === 'main').map((segment) => ({
      type: 'Feature', id: segment.id, properties: { routeId: segment.id }, geometry: { type: 'LineString', coordinates: segmentCoordinates(segment) }
    }));
    const sideFeatures = routeSegments.filter((segment) => segment.type === 'side').flatMap((segment) => [false, true].map((reverse) => ({
      type: 'Feature', id: `${segment.id}-${reverse ? 'back' : 'out'}`, properties: { routeId: segment.id }, geometry: { type: 'LineString', coordinates: segmentCoordinates(segment, reverse) }
    })));
    this.map.addSource('main-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: mainFeatures } });
    this.map.addSource('side-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: sideFeatures } });
    const opacity = ['case', ['boolean', ['feature-state', 'dimmed'], false], 0.16, 0.92];
    this.map.addLayer({ id: 'main-route-line', type: 'line', source: 'main-routes', paint: { 'line-color': '#0b57d0', 'line-width': 6, 'line-opacity': opacity } });
    this.map.addLayer({ id: 'main-route-arrows', type: 'symbol', source: 'main-routes', layout: { 'symbol-placement': 'line', 'icon-image': 'main-route-arrow', 'icon-size': 0.72, 'symbol-spacing': 75, 'icon-allow-overlap': true, 'icon-rotation-alignment': 'map' }, paint: { 'icon-opacity': opacity } });
    this.map.addLayer({ id: 'side-route-line', type: 'line', source: 'side-routes', paint: { 'line-color': '#d97706', 'line-width': 4, 'line-dasharray': [2, 2], 'line-opacity': opacity } });
    this.map.addLayer({ id: 'side-route-arrows', type: 'symbol', source: 'side-routes', layout: { 'symbol-placement': 'line', 'icon-image': 'side-route-arrow', 'icon-size': 0.62, 'symbol-spacing': 88, 'icon-allow-overlap': true, 'icon-rotation-alignment': 'map' }, paint: { 'icon-opacity': opacity } });
  }

  addArrowImage(id, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(19, 12);
    context.lineTo(6, 5);
    context.lineTo(6, 19);
    context.closePath();
    context.fill();
    this.map.addImage(id, context.getImageData(0, 0, 24, 24));
  }

  addMarkers() {
    places.filter((place) => place.kind !== 'corridor').forEach((place) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = `map-marker ${place.kind}`;
      element.setAttribute('aria-label', place.name);
      element.innerHTML = markerEmoji(place);
      const popup = new MapLibrePopup({ offset: 18, closeButton: true }).setHTML(popupHtml(place));
      popup.on('open', bindPopupActions);
      element.addEventListener('click', () => {
        popup.setHTML(popupHtml(place));
        window.setTimeout(bindPopupActions, 0);
      });
      const marker = new MapLibreMarker({ element, anchor: 'center' }).setLngLat([place.lng, place.lat]).setPopup(popup).addTo(this.map);
      this.markers.set(place.id, marker);
    });
  }

  setHighlighted(routeIds) {
    routeSegments.filter((segment) => segment.type === 'main').forEach((segment) => this.map.setFeatureState({ source: 'main-routes', id: segment.id }, { dimmed: routeIds.size > 0 && !routeIds.has(segment.id) }));
    routeSegments.filter((segment) => segment.type === 'side').forEach((segment) => ['out', 'back'].forEach((direction) => this.map.setFeatureState({ source: 'side-routes', id: `${segment.id}-${direction}` }, { dimmed: routeIds.size > 0 && !routeIds.has(segment.id) })));
  }

  selectDay(day) {
    const routeIds = idsForDay(day);
    this.setHighlighted(new Set(routeIds));
    const bounds = boundsForSegments(routeIds);
    if (bounds) this.map.fitBounds(bounds, { padding: 70, duration: 700, maxZoom: 9.5 });
    else {
      const place = placesById[day.placeIds[0]];
      if (place) this.map.flyTo({ center: [place.lng, place.lat], zoom: 10, duration: 700 });
    }
  }

  fitAll() {
    this.setHighlighted(new Set());
    const points = routeSegments.flatMap((segment) => segmentCoordinates(segment));
    const bounds = points.reduce((result, coordinate) => result.extend(coordinate), new LngLatBounds(points[0], points[0]));
    this.map.fitBounds(bounds, { padding: 70, duration: 600, maxZoom: 8.2 });
  }

  setSideVisible(visible) {
    ['side-route-line', 'side-route-arrows'].forEach((id) => this.map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none'));
  }

  destroy() {
    if (this.map) this.map.remove();
  }
}

async function loadOpenFreeMapStyle() {
  const response = await fetch('https://tiles.openfreemap.org/styles/liberty');
  if (!response.ok) throw new Error('OpenFreeMap style unavailable');
  const style = await response.json();
  style.layers = style.layers.map((layer) => {
    if (!layer.filter || !String(layer.id).includes('shield')) return layer;
    return {
      ...layer,
      filter: JSON.parse(JSON.stringify(layer.filter).replaceAll('["get","ref_length"]', '["coalesce",["get","ref_length"],999]'))
    };
  });
  return style;
}

async function initializeMap() {
  await initializeOpenFreeMap();
}

async function initializeOpenFreeMap() {
  if (mapAdapter) {
    mapAdapter.destroy();
    mapAdapter = null;
  }
  $('#map').replaceChildren();
  setProvider('OpenFreeMap 行程总览');
  try {
    const style = await loadOpenFreeMapStyle();
    const adapter = new MapLibreAdapter($('#map'), style);
    try {
      await adapter.init();
    } catch (error) {
      adapter.destroy();
      throw error;
    }
    mapAdapter = adapter;
    adapter.setSideVisible(sideTripsVisible);
    if (mapDay) adapter.selectDay(daysByDate[mapDay]);
  } catch {
    setProvider('OpenFreeMap 行程总览');
    showMapMessage('OpenFreeMap 底图没有响应。请检查网络后重试；固定路线与外部 Google Maps 编辑按钮仍可使用。');
  }
}

function renderHeader() {
  $('#flightGrid').innerHTML = trip.flights.map(f=>`<article class="flight-ticket"><span class="card-kicker">${f.date.slice(5).replace('-','/')} · ${f.flight} · 已购</span><h4>${escapeHtml(f.route)}</h4><strong>${f.time}</strong><p>${escapeHtml(f.note)}</p></article>`).join('');
}

function renderRouteControls() {
  const planners = routeGroups.map((group) => {
    const legs = group.segmentIds.map((id) => segmentsById[id]).filter(Boolean).map((segment) => {
      const from = placesById[segment.points[0]];
      const to = placesById[segment.points.at(-1)];
      return `<div class="route-leg"><span>${escapeHtml(from.name)} → ${escapeHtml(to.name)}</span><a class="btn btn-light" href="${directionsUrl(from.query, to.query)}" target="_blank" rel="noreferrer">Google Maps 路线 ↗</a></div>`;
    }).join('');
    return `<details class="compact-fold" id="planner-${group.id}"><summary>${group.label} · 分段导航</summary><div class="route-leg-list">${legs}</div></details>`;
  }).join('');
  $('#routeSummary').innerHTML = planners;
}

function renderStays() {
  $('#stayGrid').innerHTML = stays.map((stay) => {
    const place = placesById[stay.placeId];
    return `<article class="card stay-card"><div class="stay-top"><span class="stay-city">${stay.city} · ${stay.dates} · ${stay.nights}晚</span>${statusBadge(stay.status)}</div><h4>${stay.name}</h4><div class="stay-meta">${stay.type}</div><p class="stay-address">📍 ${escapeHtml(place.address)}</p><ul>${stay.notes.map((note) => `<li>${note}</li>`).join('')}</ul>${stay.arrivalNote ? `<p class="arrival-note">${stay.arrivalNote}</p>` : ''}<div class="card-actions"><a class="btn btn-light" target="_blank" rel="noreferrer" href="${mapsSearchUrl(place.query)}">Google Maps ↗</a></div></article>`;
  }).join('');
}

function renderTransport() {
  $('#transportBody').innerHTML = transport.map((item) => `<tr><td><strong>${item.date}</strong></td><td>${item.segment}</td><td><span class="class-badge">${item.class}</span><span class="class-note">${transportClasses[item.class]}</span></td><td>${statusBadge(item.status)}</td><td>${item.method}</td><td>${item.time}</td><td>${item.price}</td><td>${item.buy}</td><td><span class="risk-${item.risk === '高' ? 'high' : item.risk === '中' ? 'medium' : 'low'}">${item.risk}风险</span><div class="transport-note">${item.note}</div></td></tr>`).join('');
}

function dayGoogleMapsLinks(day) {
  const legs = day.mapLegs?.length ? day.mapLegs : idsForDay(day).map((id) => {
    const segment = segmentsById[id];
    const from = placesById[segment.points[0]];
    const to = placesById[segment.points.at(-1)];
    return { from: from.query, to: to.query, label: `${from.name} → ${to.name}` };
  });
  if (!legs.length) {
    const place = placesById[day.placeIds[0]];
    return `<a class="btn btn-light" href="${mapsSearchUrl(place.query)}" target="_blank" rel="noreferrer">Google Maps 查看当天地点 ↗</a>`;
  }
  return legs.map((leg) => `<a class="btn btn-light" href="${directionsUrl(leg.from, leg.to)}" target="_blank" rel="noreferrer">${escapeHtml(leg.label)} ↗</a>`).join('');
}

function renderDays() {
  $('#dateNav').innerHTML = days.map(day =>
    `<option value="${day.date}">${day.displayDate} ${day.weekday} · ${escapeHtml(day.title)}</option>`
  ).join('');

  $('#timeline').innerHTML = days.map(day => {
    return `<article class="day-card open" id="day-${day.date}" data-day-card="${day.date}" hidden>
      <header class="day-heading">
        <p>${day.displayDate} ${day.weekday}</p>
        <h3>${escapeHtml(day.title)}</h3>
        ${day.sleep !== '—' ? `<p>${escapeHtml(day.sleep)}</p>` : ''}
      </header>
      <div class="day-body">
        ${renderOutingCard(day)}
        <div class="day-plan-layout">
          <div class="day-route-column">${renderDailyRoute(day)}<div class="day-route-links">${dayGoogleMapsLinks(day)}</div></div>
          ${renderDailySchedule(day)}
        </div>
        ${renderMealNote(day)}
        ${renderDayGuide(day)}
        <details class="compact-fold day-weather-fold">
          <summary>雨雪备选</summary>
          <div class="weather-plan">
            <div class="weather-item"><strong>雨天</strong>${escapeHtml(day.weather.rain)}</div>
            <div class="weather-item"><strong>大雪 / 强风</strong>${escapeHtml(day.weather.snow)}</div>
          </div>
        </details>
        <div class="day-map-action no-print">
          <button class="btn btn-light" data-day-map="${day.date}">在行程地图定位 ↗</button>
        </div>
      </div>
    </article>`;
  }).join('');

  bindInlineMaps();
  $('#dateNav').addEventListener('change', event => goTo('day-' + event.target.value));
  $('#previousDay').addEventListener('click', () => changeDay(-1));
  $('#nextDay').addEventListener('click', () => changeDay(1));
  document.querySelectorAll('[data-day-map]').forEach(button => {
    button.addEventListener('click', () => {
      mapDay = button.dataset.dayMap;
      goTo('map-section');
    });
  });
}

function changeDay(offset) {
  const index = days.findIndex(day => day.date === activeDate);
  const next = days[index + offset];
  if (next) goTo('day-' + next.date);
}

function renderChecklist() {
  const progressOptions = [
    ['', '未处理'], ['ticketed', '已买票'], ['confirmed', '已确认'], ['rechecked', '已复核'], ['completed', '已完成']
  ];
  $('#checklistGrid').innerHTML = checklistGroups.map((group) => `<article class="card checklist-group"><h4>${group.when}</h4><div class="checklist-items">${group.items.map((item) => `<div class="checklist-item"><label for="progress-${item.id}">□ ${item.text}</label><select class="progress-select" id="progress-${item.id}" data-progress-id="${item.id}">${progressOptions.map(([value, label]) => `<option value="${value}" ${progress[item.id] === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>`).join('')}</div></article>`).join('');
  document.querySelectorAll('[data-progress-id]').forEach((select) => select.addEventListener('change', () => {
    progress[select.dataset.progressId] = select.value;
    saveProgress();
  }));
}

function renderBudget() {
  const airfare = trip.flights.reduce((sum, flight) => sum + flight.amountRmb, 0);
  const transportJpy = transport.reduce((sum, item) => sum + item.budgetJPY, 0);
  const rateRaw = window.localStorage.getItem(trip.budget.exchangeRateStorageKey) || '';
  const converted = Number(rateRaw) > 0 ? `按手填汇率约 ¥${(transportJpy * Number(rateRaw)).toFixed(2)} RMB` : '填写汇率后换算交通预算。';
  $('#budgetGrid').innerHTML = `<article class="card budget-card"><h4>已购机票</h4><div class="budget-amount">¥${airfare.toLocaleString()} RMB</div><p>去程 ¥963 + 返程 ¥1314，状态：已付款。</p></article><article class="card budget-card"><h4>交通参考</h4><div class="budget-amount">¥${transportJpy.toLocaleString()} JPY</div><p>按交通表参考金额汇总；不含全部市内交通、景点巴士、门票与餐饮，实际票价须复核。</p></article><article class="card budget-card"><h4>手动汇率</h4><p>填写 1 JPY = ? CNY，仅作本地预算换算。</p><input class="rate-input" id="exchangeRate" type="number" min="0" step="0.0001" placeholder="例如 0.047" value="${rateRaw}"><p id="convertedBudget">${converted}</p></article><article class="card budget-card"><h4>住宿</h4><div class="budget-amount">待填写</div><p>${trip.budget.lodgingPriceState}。</p></article>`;
  $('#exchangeRate').addEventListener('input', (event) => {
    window.localStorage.setItem(trip.budget.exchangeRateStorageKey, event.target.value);
    const text = Number(event.target.value) > 0 ? `按手填汇率约 ¥${(transportJpy * Number(event.target.value)).toFixed(2)} RMB` : '填写汇率后换算交通预算。';
    $('#convertedBudget').textContent = text;
    updateFoodBudget();
  });
}

function renderLinks() {
  $('#officialLinks').innerHTML = officialLinks.map((link) => `<a class="link-chip" target="_blank" rel="noreferrer" href="${link.url}">${link.label} <span class="link-badge ${link.type === 'third-party' ? 'third-party' : ''}">${link.type === 'official' ? '官方' : '第三方'}</span> ↗</a>`).join('');
}

function activateDay(date) {
  if (!daysByDate[date]) return;
  activeDate = date;
  $('#dateNav').value = date;
  $('#previousDay').disabled = date === days[0].date;
  $('#nextDay').disabled = date === days.at(-1).date;
  document.querySelectorAll('[data-day-card]').forEach(card => {
    card.hidden = card.dataset.dayCard !== date;
    if (!card.hidden) loadOpenMaps(card);
  });
}

function goTo(id) {
  if (location.hash === '#' + id) revealHash();
  else location.hash = id;
}

function revealHash() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  const view = target?.closest('[data-view]')?.dataset.view || 'days';
  document.querySelectorAll('[data-view]').forEach(panel => {
    panel.hidden = panel.dataset.view !== view;
  });
  document.querySelectorAll('[data-view-link]').forEach(link => {
    if (link.dataset.viewLink === view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (view === 'days') {
    const day = target?.closest('[data-day-card]');
    activateDay(day?.dataset.dayCard || activeDate);
  }
  const sightDetails = target?.querySelector(':scope > .sight-entry');
  if (sightDetails) sightDetails.open = true;
  for (let element = target; element; element = element.parentElement) {
    if (element.tagName === 'DETAILS') element.open = true;
  }

  if (view === 'map') {
    if (!mapRequested) {
      mapRequested = true;
      void initializeMap();
    } else if (mapAdapter) {
      mapAdapter.map.resize();
      if (mapDay) mapAdapter.selectDay(daysByDate[mapDay]);
      else mapAdapter.fitAll();
    }
  }

  const mainAnchor = ['overview', 'days', 'map-section', 'anime', 'food', 'checklist', 'offline-kit'];
  if (!target || mainAnchor.includes(id)) window.scrollTo(0, 0);
  else if (target.matches('[data-day-card]')) $('#days').scrollIntoView();
  else target.scrollIntoView();
}

function bindUi() {
  $('#showAllRoute').addEventListener('click', () => { mapDay = null; mapAdapter?.fitAll(); });
  $('#sectionNav a[href="#map-section"]').addEventListener('click', () => { mapDay = null; });
  let printClosedDetails=[];
  window.addEventListener('beforeprint',()=>{if(document.body.classList.contains('print-outing'))return;printClosedDetails=[...document.querySelectorAll('details:not([open])')];printClosedDetails.forEach(detail=>{detail.open=true;});});
  window.addEventListener('afterprint',()=>{printClosedDetails.forEach(detail=>{detail.open=false;});printClosedDetails=[];});
  $('#printButton').addEventListener('click', () => window.print());
  document.querySelectorAll('[data-print-outing]').forEach(button=>button.addEventListener('click',()=>{
    const card=document.getElementById('day-'+button.dataset.printOuting);
    document.body.classList.add('print-outing');card.classList.add('print-selected');
    try { window.print(); } finally { document.body.classList.remove('print-outing');card.classList.remove('print-selected'); }
  }));
  $('#toggleSideTrips').addEventListener('click', (event) => {
    sideTripsVisible = !sideTripsVisible;
    mapAdapter?.setSideVisible(sideTripsVisible);
    event.currentTarget.textContent = sideTripsVisible ? '隐藏一日往返' : '显示一日往返';
  });
  $('#resetProgress').addEventListener('click', (event) => {
    if (!resetArmed) {
      resetArmed = true;
      event.currentTarget.textContent = '再次点击确认重置';
      window.setTimeout(() => { resetArmed = false; event.currentTarget.textContent = '重置进度'; }, 6000);
      return;
    }
    progress = {};
    saveProgress();
    resetArmed = false;
    event.currentTarget.textContent = '重置进度';
    renderChecklist();
    renderPacking(progress, saveProgress);
  });
  window.addEventListener('hashchange', revealHash);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goTo(anchor.hash.slice(1));
  });
  revealHash();
}

function bootstrap() {
  renderHeader();
  renderRouteControls();
  renderStays();
  renderTransport();
  renderDays();
  renderResearch();
  renderFood();
  renderOfflineKit();
  document.addEventListener('click', event => {
    const button=event.target.closest('[data-sight-date]'); if(!button)return;
    goTo('sight-' + button.dataset.sightId);
  });
  renderChecklist();
  renderPacking(progress, saveProgress);
  renderBudget();
  renderLinks();
  bindUi();
}

bootstrap();
