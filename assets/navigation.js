const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export function routeUrl(origin, destination, mode = 'transit') {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({api:'1', origin, destination, travelmode:mode})}`;
}

export function mapPanel(query, title, open = false) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  return `<details class="place-map" ${open ? 'open' : ''}><summary>${esc(title)} · 地图</summary><iframe data-map-src="${esc(src)}" title="${esc(title)}地图" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a href="${esc(mapUrl(query))}" target="_blank" rel="noreferrer">在 Google Maps 打开 ↗</a></details>`;
}

export function loadOpenMaps(root) {
  root.querySelectorAll('.place-map[open] iframe[data-map-src]').forEach(frame => {
    if (!frame.hasAttribute('src')) frame.src = frame.dataset.mapSrc;
  });
}

export function bindInlineMaps() {
  document.addEventListener('toggle', event => {
    if (event.target.matches('.place-map[open]') && !event.target.closest('[hidden]')) loadOpenMaps(event.target.parentElement);
  }, true);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-map-query]');
    if (!button) return;
    const panel = button.closest('.day-route-overview').querySelector('.place-map');
    panel.open = true;
    const frame = panel.querySelector('iframe');
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(button.dataset.mapQuery)}&z=15&output=embed`;
    frame.dataset.mapSrc = src;
    frame.src = src;
    frame.title = button.textContent.trim() + '地图';
    panel.querySelector('summary').textContent = button.textContent.trim() + ' · 地图';
    panel.querySelector('a').href = mapUrl(button.dataset.mapQuery);
    button.closest('.route-map-stops').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
}
