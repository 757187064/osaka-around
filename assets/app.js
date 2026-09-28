import '../config.local.js';
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
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import {
  checklistGroups,
  dayRouteIds,
  days,
  mainRouteSequence,
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
const localConfig = window.TRIP_CONFIG || {};
const config = {
  // config.local.js only exists on the developer's machine. The production
  // value is injected by GitHub Actions from a repository secret at build time.
  googleMapsApiKey: localConfig.googleMapsApiKey?.trim() || import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || ''
};
let activeDate = days[0].date;
let mapAdapter = null;
let sideTripsVisible = true;
let resetArmed = false;
let progress = readProgress();
let googleAuthenticationError = '';

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

function directionsUrl(points) {
  const [origin, ...rest] = points;
  const destination = rest.at(-1);
  const waypoints = rest.slice(0, -1);
  const params = new URLSearchParams({ api: '1', origin, destination, travelmode: 'transit' });
  if (waypoints.length) params.set('waypoints', waypoints.join('|'));
  return `https://www.google.com/maps/dir/?${params}`;
}

function statusBadge(status) {
  const definition = transportStatus[status];
  return `<span class="status-badge ${status}">${definition.icon} ${definition.label}</span>`;
}

function markerEmoji(place) {
  if (place.kind === 'airport') return '✈';
  if (place.kind === 'onsen') return '♨';
  if (place.kind === 'rail') return '🚆';
  if (place.sequence?.length) return `<span class="sequence">${place.sequence.join('/')}</span>`;
  return place.kind === 'stay' ? '●' : '●';
}

function getContextDay(place) {
  if (activeDate && place.dates.includes(activeDate)) return daysByDate[activeDate];
  return days.find((day) => place.dates.includes(day.date)) || days[0];
}

function nextTransportText(day) {
  return day.timeline.find((entry) => entry.label === '交通')?.detail || '查看当天时间轴';
}

function popupHtml(place) {
  const day = getContextDay(place);
  return `<div class="popup-title">${escapeHtml(place.name)}</div>
    <div class="popup-line"><strong>日期：</strong>${escapeHtml(day.displayDate)} ${escapeHtml(day.weekday)}</div>
    <div class="popup-line"><strong>住宿：</strong>${escapeHtml(day.sleep)}</div>
    <div class="popup-line"><strong>当天任务：</strong>${escapeHtml(day.title)}</div>
    <div class="popup-line"><strong>下一段交通：</strong>${escapeHtml(nextTransportText(day))}</div>
    <div class="popup-actions"><a target="_blank" rel="noreferrer" href="${mapsSearchUrl(place.query)}">Google Maps ↗</a><button data-popup-day="${day.date}">查看当天行程</button></div>`;
}

function bindPopupActions() {
  document.querySelectorAll('[data-popup-day]').forEach((button) => {
    button.addEventListener('click', () => activateDay(button.dataset.popupDay, { scroll: true, open: true }));
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
        const day = getContextDay(place);
        popup.setHTML(popupHtml(place));
        activateDay(day.date, { open: true, skipFly: true });
        window.setTimeout(bindPopupActions, 0);
        document.getElementById(`day-${day.date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function googleIcons(type, opacity) {
  const google = window.google;
  if (type === 'main') return [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3.3, strokeColor: '#063a90', fillColor: '#063a90', fillOpacity: opacity }, offset: '45%', repeat: '82px' }];
  return [
    { icon: { path: 'M 0,-1 0,1', strokeOpacity: opacity, strokeColor: '#d97706', scale: 4 }, offset: '0', repeat: '14px' },
    { icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2.8, strokeColor: '#a65b00', fillColor: '#a65b00', fillOpacity: opacity }, offset: '50%', repeat: '92px' }
  ];
}

class GoogleAdapter {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.infoWindow = null;
    this.routes = new Map();
    this.markers = new Map();
  }

  async init() {
    setOptions({ key: config.googleMapsApiKey, v: 'weekly', language: 'zh-CN', region: 'JP' });
    const mapsLibrary = await withTimeout(importLibrary('maps'), 12000, 'Google Maps loading timeout');
    if (!window.google?.maps) throw new Error('Google Maps unavailable');
    this.map = new mapsLibrary.Map(this.container, { center: { lat: 35.2, lng: 135.1 }, zoom: 7.2, fullscreenControl: false, streetViewControl: false, mapTypeControl: false });
    this.infoWindow = new window.google.maps.InfoWindow();
    this.addRoutes();
    this.addMarkers();
    await new Promise((resolve) => window.google.maps.event.addListenerOnce(this.map, 'idle', resolve));
    this.fitAll();
  }

  addRoutes() {
    routeSegments.forEach((segment) => {
      const forwards = [false];
      if (segment.type === 'side') forwards.push(true);
      forwards.forEach((reverse) => {
        const id = `${segment.id}-${reverse ? 'back' : 'out'}`;
        const line = new window.google.maps.Polyline({
          path: segmentCoordinates(segment, reverse).map(([lng, lat]) => ({ lng, lat })), map: this.map,
          strokeColor: segment.type === 'main' ? '#0b57d0' : '#d97706', strokeOpacity: segment.type === 'main' ? 0.92 : 0,
          strokeWeight: segment.type === 'main' ? 6 : 4, icons: googleIcons(segment.type, 0.92), zIndex: segment.type === 'main' ? 3 : 2
        });
        this.routes.set(id, { segment, line, reverse });
      });
    });
  }

  addMarkers() {
    places.filter((place) => place.kind !== 'corridor').forEach((place) => {
      const color = { airport: '#6d28d9', stay: '#15803d', sight: '#c3342e', onsen: '#b45309', rail: '#2563eb' }[place.kind];
      const label = place.sequence?.length ? place.sequence.join('/') : markerEmoji(place).replace(/<[^>]*>/g, '');
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng }, map: this.map, title: place.name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, fillColor: color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3, scale: 12 },
        label: { text: label, color: '#fff', fontSize: place.sequence?.length ? '9px' : '14px', fontWeight: '700' }
      });
      marker.addListener('click', () => {
        const day = getContextDay(place);
        this.showPopup(place, marker);
        activateDay(day.date, { open: true, skipFly: true });
        document.getElementById(`day-${day.date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      this.markers.set(place.id, marker);
    });
  }

  showPopup(place, marker) {
    this.infoWindow.setContent(popupHtml(place));
    this.infoWindow.open({ map: this.map, anchor: marker });
    window.setTimeout(bindPopupActions, 0);
  }

  setHighlighted(routeIds) {
    this.routes.forEach(({ segment, line, reverse }) => {
      const visibleOpacity = routeIds.size === 0 || routeIds.has(segment.id) ? 0.92 : 0.16;
      line.setOptions({ strokeOpacity: segment.type === 'main' ? visibleOpacity : 0, icons: googleIcons(segment.type, visibleOpacity), visible: segment.type === 'main' || sideTripsVisible });
      if (segment.type === 'side' && reverse) line.setOptions({ zIndex: 2 });
    });
  }

  selectDay(day) {
    const routeIds = idsForDay(day);
    this.setHighlighted(new Set(routeIds));
    const bounds = boundsForSegments(routeIds);
    if (bounds) {
      const googleBounds = new window.google.maps.LatLngBounds();
      const southwest = bounds.getSouthWest();
      const northeast = bounds.getNorthEast();
      googleBounds.extend({ lng: southwest.lng, lat: southwest.lat });
      googleBounds.extend({ lng: northeast.lng, lat: northeast.lat });
      this.map.fitBounds(googleBounds, 70);
    } else {
      const place = placesById[day.placeIds[0]];
      if (place) this.map.panTo({ lat: place.lat, lng: place.lng });
      this.map.setZoom(10);
    }
  }

  fitAll() {
    this.setHighlighted(new Set());
    const bounds = new window.google.maps.LatLngBounds();
    routeSegments.flatMap((segment) => segmentCoordinates(segment)).forEach(([lng, lat]) => bounds.extend({ lng, lat }));
    this.map.fitBounds(bounds, 70);
  }

  setSideVisible(visible) {
    this.routes.forEach(({ segment, line }) => { if (segment.type === 'side') line.setVisible(visible); });
  }

  destroy() {
    this.routes.forEach(({ line }) => line.setMap(null));
    this.markers.forEach((marker) => marker.setMap(null));
    this.container.replaceChildren();
  }
}

function withTimeout(promise, milliseconds, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error(message)), milliseconds))
  ]);
}

async function initializeMap() {
  hideMapMessage();
  if (mapAdapter) {
    mapAdapter.destroy();
    mapAdapter = null;
  }
  $('#map').replaceChildren();
  const hasGoogleKey = Boolean(config.googleMapsApiKey?.trim());
  if (hasGoogleKey) {
    googleAuthenticationError = '';
    setProvider('Google Maps 加载中');
    try {
      const adapter = new GoogleAdapter($('#map'));
      await adapter.init();
      if (googleAuthenticationError) throw new Error(googleAuthenticationError);
      mapAdapter = adapter;
      setProvider('Google Maps');
      adapter.setSideVisible(sideTripsVisible);
      adapter.fitAll();
      return;
    } catch {
      await initializeOpenFreeMap('Google Maps 无法使用，已自动切换至 OpenFreeMap。');
      return;
    }
  }
  await initializeOpenFreeMap();
}

async function initializeOpenFreeMap(reason = '') {
  if (mapAdapter) {
    mapAdapter.destroy();
    mapAdapter = null;
  }
  $('#map').replaceChildren();
  setProvider('OpenFreeMap fallback');
  try {
    const style = await loadOpenFreeMapStyle();
    const adapter = new MapLibreAdapter($('#map'), style);
    await adapter.init();
    mapAdapter = adapter;
    adapter.setSideVisible(sideTripsVisible);
    adapter.fitAll();
  } catch {
    setProvider('OpenFreeMap fallback');
    showMapMessage(reason || 'OpenFreeMap 底图没有响应。请检查网络后重试；行程、路线与外部 Google Maps 按钮仍可使用。');
  }
}

window.gm_authFailure = () => {
  googleAuthenticationError = 'Google Maps 认证失败';
  if (mapAdapter instanceof GoogleAdapter) void initializeOpenFreeMap('Google Maps 认证失败，已切换至 OpenFreeMap。');
};

function renderHeader() {
  $('#heroTitle').textContent = trip.meta.heading;
  $('#heroSubtitle').textContent = trip.meta.subtitle;
  $('#heroPills').innerHTML = [trip.meta.dates, '1人独旅', '✈️ 往返机票已购', '🛏️ 住宿全部已购', '🎒 轻装旅行'].map((item) => `<span class="pill">${item}</span>`).join('');
}

function renderDashboard() {
  $('#statsGrid').innerHTML = trip.stats.map(([value, label]) => `<div class="stat-card"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`).join('');
  const firstOpen = checklistGroups.flatMap((group) => group.items).find((item) => !['completed', 'confirmed', 'rechecked', 'ticketed'].includes(progress[item.id]));
  $('#nextTaskCard').innerHTML = `<div class="card-kicker">下一项待办</div><h4>${firstOpen ? escapeHtml(firstOpen.text) : '复核中心已清空'}</h4><p>${firstOpen ? '在复核中心标记处理状态，刷新后仍会保存。' : '出发前仍请按天气与运行状态复核。'}</p>`;
  $('#alertCard').innerHTML = '<div class="card-kicker">重点提醒</div><h4>12/6 美山是重点交通风险日</h4><p>南丹市营巴士与 JR 衔接不可依赖 ICOCA，冬季周日時刻必须在 11 月底复核。</p>';
  const jpy = transport.reduce((sum, item) => sum + item.budgetJPY, 0);
  $('#budgetMiniCard').innerHTML = `<div class="card-kicker">预算摘要</div><h4>机票 ¥${trip.budget.airfareRmb.toLocaleString()} RMB</h4><p>交通参考合计约 ¥${jpy.toLocaleString()} JPY；住宿金额待手动填写。</p>`;
  const remaining = Math.ceil((new Date(trip.meta.departureDate) - new Date()) / 86400000);
  const countdownText = remaining >= 0 ? `还有 ${remaining} 天` : '行程已开始或已结束';
  $('#countdownCard').innerHTML = `<div class="card-kicker">出发倒计时</div><h4>${countdownText}</h4><p>去程：12/2 11:40，大连 → KIX。</p>`;
}

function renderRouteControls() {
  $('#routeGroupButtons').innerHTML = routeGroups.map((group) => `<a class="map-route-button" href="${directionsUrl(group.googlePoints)}" target="_blank" rel="noreferrer">${group.label} Google Maps ↗</a>`).join('');
  $('#routeSummary').innerHTML = `<span class="route-summary-title">主环线</span>${mainRouteSequence.map(([number, label], index) => `<span class="route-node"><span class="route-number">${number}</span>${label}</span>${index < mainRouteSequence.length - 1 ? '<span class="route-arrow">→</span>' : ''}`).join('')}`;
}

function renderStays() {
  $('#stayGrid').innerHTML = stays.map((stay) => `<article class="card stay-card"><div class="stay-top"><span class="stay-city">${stay.city} · ${stay.dates} · ${stay.nights}晚</span>${statusBadge(stay.status)}</div><h4>${stay.name}</h4><div class="stay-meta">${stay.type}</div><ul>${stay.notes.map((note) => `<li>${note}</li>`).join('')}</ul>${stay.arrivalNote ? `<p class="arrival-note">${stay.arrivalNote}</p>` : ''}<div class="card-actions"><a class="btn btn-light" target="_blank" rel="noreferrer" href="${mapsSearchUrl(placesById[stay.placeId].query)}">Google Maps ↗</a></div></article>`).join('');
}

function renderTransport() {
  $('#transportBody').innerHTML = transport.map((item) => `<tr><td><strong>${item.date}</strong></td><td>${item.segment}</td><td><span class="class-badge">${item.class}</span><span class="class-note">${transportClasses[item.class]}</span></td><td>${statusBadge(item.status)}</td><td>${item.method}</td><td>${item.time}</td><td>${item.price}</td><td>${item.buy}</td><td><span class="risk-${item.risk === '高' ? 'high' : item.risk === '中' ? 'medium' : 'low'}">${item.risk}风险</span><div class="transport-note">${item.note}</div></td></tr>`).join('');
}

function renderExperiences() {
  $('#experienceGrid').innerHTML = trip.experiences.map((experience) => {
    const imagePath = experience.imagePath;
    const visual = imagePath ? `<img src="${imagePath}" alt="${experience.title}">` : `<div class="experience-image" aria-label="${experience.title} 图片占位">${experience.icon}</div>`;
    return `<article class="card experience-card">${visual}<div class="experience-content"><h4>${experience.title}</h4><p>${experience.text}</p><div class="card-actions"><a class="btn btn-light" href="${mapsSearchUrl(placesById[experience.placeId].query)}" target="_blank" rel="noreferrer">Google Maps ↗</a></div></div></article>`;
  }).join('');
}

function renderDays() {
  $('#dateNav').innerHTML = days.map((day) => `<button class="date-nav-button ${day.date === activeDate ? 'active' : ''}" data-day-nav="${day.date}">${day.displayDate}</button>`).join('');
  $('#timeline').innerHTML = days.map((day, index) => `<article class="card day-card risk-${day.risk} ${index === 0 ? 'open' : ''}" id="day-${day.date}" data-day-card="${day.date}"><button class="day-toggle" aria-expanded="${index === 0}" data-day-toggle="${day.date}"><div><div class="day-date">${day.displayDate}</div><div class="weekday">${day.weekday}</div></div><div><div class="day-title">${day.title}</div><div class="day-base">住宿 / 基地：${day.base}</div></div><div class="theme-tag">${day.theme}</div></button><div class="day-body"><div class="schedule">${day.timeline.map((entry) => `<div class="slot"><div class="slot-time">${entry.time}</div><div class="slot-title">${entry.label}</div><div class="slot-detail">${entry.detail}</div></div>`).join('')}</div><div class="weather-plan"><div class="weather-item"><strong>☀️ 正常计划</strong>${day.weather.sun}</div><div class="weather-item"><strong>🌧 雨天</strong>${day.weather.rain}</div><div class="weather-item"><strong>❄️ 大雪／强风</strong>${day.weather.snow}</div></div><div class="day-map-action no-print"><button class="btn btn-light" data-day-map="${day.date}">在地图定位当天路线</button></div></div></article>`).join('');
  document.querySelectorAll('[data-day-nav]').forEach((button) => button.addEventListener('click', () => activateDay(button.dataset.dayNav, { scroll: true, open: true })));
  document.querySelectorAll('[data-day-toggle]').forEach((button) => button.addEventListener('click', () => {
    const card = document.getElementById(`day-${button.dataset.dayToggle}`);
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    activateDay(button.dataset.dayToggle, { open, skipFly: false });
  }));
  document.querySelectorAll('[data-day-map]').forEach((button) => button.addEventListener('click', () => activateDay(button.dataset.dayMap, { open: true })));
}

function renderChecklist() {
  const progressOptions = [
    ['', '未处理'], ['ticketed', '已买票'], ['confirmed', '已确认'], ['rechecked', '已复核'], ['completed', '已完成']
  ];
  $('#checklistGrid').innerHTML = checklistGroups.map((group) => `<article class="card checklist-group"><h4>${group.when}</h4><div class="checklist-items">${group.items.map((item) => `<div class="checklist-item"><label for="progress-${item.id}">□ ${item.text}</label><select class="progress-select" id="progress-${item.id}" data-progress-id="${item.id}">${progressOptions.map(([value, label]) => `<option value="${value}" ${progress[item.id] === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>`).join('')}</div></article>`).join('');
  document.querySelectorAll('[data-progress-id]').forEach((select) => select.addEventListener('change', () => {
    progress[select.dataset.progressId] = select.value;
    saveProgress();
    renderDashboard();
  }));
}

function renderBudget() {
  const airfare = trip.flights.reduce((sum, flight) => sum + flight.amountRmb, 0);
  const transportJpy = transport.reduce((sum, item) => sum + item.budgetJPY, 0);
  const rateRaw = window.localStorage.getItem(trip.budget.exchangeRateStorageKey) || '';
  const converted = Number(rateRaw) > 0 ? `按手填汇率约 ¥${(transportJpy * Number(rateRaw)).toFixed(2)} RMB` : '尚未填写 JPY/CNY 汇率，不自动换汇。';
  $('#budgetGrid').innerHTML = `<article class="card budget-card"><h4>已购机票</h4><div class="budget-amount">¥${airfare.toLocaleString()} RMB</div><p>去程 ¥963 + 返程 ¥1314，状态：已付款。</p></article><article class="card budget-card"><h4>交通参考</h4><div class="budget-amount">¥${transportJpy.toLocaleString()} JPY</div><p>按每日交通参考金额汇总；实际票价与冬季班次须复核。</p></article><article class="card budget-card"><h4>手动汇率</h4><p>填写 1 JPY = ? CNY，仅作本地预算换算。</p><input class="rate-input" id="exchangeRate" type="number" min="0" step="0.0001" placeholder="例如 0.047" value="${rateRaw}"><p id="convertedBudget">${converted}</p></article><article class="card budget-card"><h4>住宿</h4><div class="budget-amount">待填写</div><p>${trip.budget.lodgingPriceState}。不根据网络数据自动估价。</p></article>`;
  $('#exchangeRate').addEventListener('input', (event) => {
    window.localStorage.setItem(trip.budget.exchangeRateStorageKey, event.target.value);
    const text = Number(event.target.value) > 0 ? `按手填汇率约 ¥${(transportJpy * Number(event.target.value)).toFixed(2)} RMB` : '尚未填写 JPY/CNY 汇率，不自动换汇。';
    $('#convertedBudget').textContent = text;
  });
}

function renderLinks() {
  $('#officialLinks').innerHTML = officialLinks.map((link) => `<a class="link-chip" target="_blank" rel="noreferrer" href="${link.url}">${link.label} <span class="link-badge ${link.type === 'third-party' ? 'third-party' : ''}">${link.type === 'official' ? '官方' : '第三方'}</span> ↗</a>`).join('');
}

function activateDay(date, { scroll = false, open = false, skipFly = false } = {}) {
  const day = daysByDate[date];
  if (!day) return;
  activeDate = date;
  document.querySelectorAll('[data-day-nav]').forEach((button) => button.classList.toggle('active', button.dataset.dayNav === date));
  document.querySelectorAll('[data-day-card]').forEach((card) => card.classList.toggle('is-active', card.dataset.dayCard === date));
  if (open) {
    const card = document.getElementById(`day-${date}`);
    card.classList.add('open');
    card.querySelector('.day-toggle').setAttribute('aria-expanded', 'true');
  }
  if (!skipFly && mapAdapter) mapAdapter.selectDay(day);
  if (scroll) document.getElementById(`day-${date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bindUi() {
  $('#showAllRoute').addEventListener('click', () => mapAdapter?.fitAll());
  $('#printButton').addEventListener('click', () => window.print());
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
    renderDashboard();
  });
  const menuButton = $('#mobileMenuButton');
  const sidebar = $('#sidebar');
  const scrim = $('#drawerScrim');
  const closeMenu = () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => { const isOpen = sidebar.classList.toggle('open'); scrim.classList.toggle('show', isOpen); document.body.classList.toggle('menu-open', isOpen); menuButton.setAttribute('aria-expanded', String(isOpen)); });
  scrim.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', closeMenu));
  const links = [...document.querySelectorAll('.nav a')];
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('main section[id], header[id]').forEach((section) => observer.observe(section));
}

async function bootstrap() {
  renderHeader();
  renderDashboard();
  renderRouteControls();
  renderStays();
  renderTransport();
  renderExperiences();
  renderDays();
  renderChecklist();
  renderBudget();
  renderLinks();
  bindUi();
  activateDay(activeDate, { open: true, skipFly: true });
  await initializeMap();
}

bootstrap().catch(() => {
  setProvider('OpenFreeMap fallback');
  showMapMessage('页面其余行程已载入，但地图初始化失败。请检查网络后重试。');
});
