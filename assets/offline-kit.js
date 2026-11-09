import { placesById, stays } from '../data/index.js';
import { decisionPoints, decisionSources } from '../data/preparation.js';

const hotelAddresses = {
  'stay-gateway': '京都府舞鶴市溝尻150-11（まなびあむ4F）',
  'stay-auberge': '京都府宮津市文珠310',
  'stay-act': '兵庫県豊岡市千代田町3-6（ふれあい公設市場内）',
  'stay-drop-inn': '鳥取県鳥取市今町2-276',
  'stay-piece': '京都市中京区富小路通三条下る朝倉町530'
};

const transfers = [
  ['02', '大连机场与京都入住', '大連駅 → 大連周水子国際空港。到机场目标为北京时间09:15。K681晚点时按订单核对航班值机截止，并联系春秋航空。关西机场抵达后按实际航站楼找铁路接驳，再前往京都。'],
  ['07', '西舞鹤转天桥立', '西舞鶴駅（JRから京都丹後鉄道へ）→ 天橋立駅。西舞鹤站先找空柜，记下取件位置。无空柜就带包直转丹铁。到天桥立后先步行去酒店，17:00前入住。'],
  ['08', '伊根巴士', '天橋立駅 09:50 → 伊根 10:33。返程「伊根」15:50 → 天橋立駅 16:33。若从游船码头上车，找「伊根湾めぐり・日出」，参考15:55。两处选一处候车。'],
  ['10', '丰冈与出石', '豊岡駅 → 出石バスターミナル（停留所「出石」）。优先问旅舍可否提前寄存，再看丰冈站空柜。无处寄放时直接留在丰冈，出石取消。'],
  ['13', '岩美与浦富海岸', '岩美駅 10:12 → 浦富海岸。返程在「浦富海岸」候12:01车回岩美駅。请把站名给司机看，现场核对站牌方向。'],
  ['14', '鸟取转京都', '鳥取駅 → 大阪駅 → 京都駅 → Piece Hostel Sanjo。14:21为参考，按车票核对大阪站下车及后续接续。向旅舍确认退房后寄存，或在鸟取站找空柜。'],
  ['16', '关西机场', '京都駅 → 関西空港駅。若订单标第2航站楼，从铁路站步行至エアロプラザ换免费接驳。13:00左右到实际航站楼，16:30起飞。']
];

const emergencySource = 'https://www.jnto.go.jp/emergency/jpn/mi_guide.html';

function kitContents() {
  const hotels = stays.map(stay => {
    const address = hotelAddresses[stay.placeId] || placesById[stay.placeId].address;
    return `<li><strong>${stay.dates} · ${stay.name}</strong><br><span lang="ja">${address}</span></li>`;
  }).join('');

  const routes = transfers.map(([day, title, route]) => {
    const date = `2026-12-${day}`;
    const decision = decisionPoints[date];
    const source = decisionSources[date];
    return `<li><strong>12/${Number(day)} ${title}</strong><br>${route}${decision ? `<br>${decision}<br><a href="${source[1]}">${source[0]}</a>` : ''}</li>`;
  }).join('');

  return `<p>2026/12/2–12/16。中国段用北京时间，日本段用当地时间。下列交通时刻供出发前核对，票面与当天公告优先。</p>
    <h3>日本紧急联系</h3>
    <p>警察 <a href="tel:110">110</a> · 急救／火警 <a href="tel:119">119</a> · JNTO 访日旅客热线 <a href="tel:05038162787">050-3816-2787</a>（24小时，提供中文）。<br><a href="${emergencySource}">日本政府观光局</a></p>
    <p>酒店晚到、航班变动请用已订订单的联系方式。出发前把酒店与航司的号码、订单和车票一起保存在手机，方便断网时查阅。</p>
    <h3>可直接出示的住宿地址</h3><ul>${hotels}</ul>
    <h3>关键换乘、行李与返程</h3><ul>${routes}</ul>
    <p lang="ja">この駅（バス停）へ行きたいです。次に乗れる便を教えていただけますか。</p>
    <p>我想去这个车站（公交站）。请问下一班可以搭哪趟？</p>
    <p>12/4 18:30后留给晚饭、洗衣烘干和补给。</p>`;
}

export function renderOfflineKit() {
  const contents = kitContents();
  document.querySelector('#offline-kit-content').innerHTML = contents;
  document.querySelector('#download-offline-kit').addEventListener('click', () => {
    const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>日本行程离线急用页</title>
      <style>body{font:16px/1.6 system-ui,sans-serif;max-width:46rem;margin:auto;padding:1.25rem;color:#202921}h1,h3{line-height:1.3}a{color:#235641}li{margin-bottom:.8rem;break-inside:avoid}@media print{body{padding:0}button{display:none}}</style>
      <body><h1>日本行程离线急用页</h1><button onclick="window.print()">打印或存为 PDF</button>${contents}</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'japan-trip-offline-2026.html';
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  });
}
