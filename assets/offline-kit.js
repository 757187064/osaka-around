import { placesById, stays } from '../data/index.js';

const QR_KEY = 'japan-trip-private-vjw-v1';
const hotelAddresses = {
  'stay-gateway': '京都府舞鶴市溝尻150-11（まなびあむ4F）',
  'stay-auberge': '京都府宮津市文珠310',
  'stay-act': '兵庫県豊岡市千代田町3-6（ふれあい公設市場内）',
  'stay-drop-inn': '鳥取県鳥取市今町2-276',
  'stay-piece': '京都市中京区富小路通三条下る朝倉町530'
};

const helpCards = [
  ['medical', '急病／受伤，需要救护车', '请拨119；告诉接线员当前位置。', '救急車を呼んでください。119番に電話してください。私の携帯はデータ通信専用で、電話ができません。', true],
  ['police', '遇到危险，需要警察', '请拨110；向店内、车站等有人处求助。', '危険です。警察を呼んでください。110番に電話してください。私の携帯では電話ができません。', true],
  ['doctor', '需要就医／中文协助', '找医院、沟通症状可请JNTO协助。', '体調が悪いです。診察を受けたいです。中国語の通訳をお願いできますか。'],
  ['passport', '护照丢失', '24小时内到交番报失，取受理编号／证明，再联系大阪总领馆。', 'パスポートをなくしました。紛失届を出したいです。受理番号と、領事館に提出できる証明書について教えてください。'],
  ['theft', '手机／钱包被盗', '到交番报案，并联系银行挂失卡片。', '携帯電話（財布）を盗まれました。被害届を出したいです。警察署か交番まで案内してください。'],
  ['lost', '东西遗失', '找交番；在车站或店内丢失则先找工作人员。', '落とし物をしました。落とし物の窓口か、近くの交番を教えてください。'],
  ['transport', '误车／停运，被困当地', '向站务员询问仍可用的交通；没有车则问附近住宿。', '電車（バス）に乗れず、困っています。今から利用できる交通手段を教えてください。なければ、近くで泊まれる場所を教えてください。'],
  ['hotel', '住宿晚到，需代为联系', '展开下方住宿地址，指出酒店名称。', '予約している宿に到着が遅れます。宿への連絡を手伝っていただけますか。宿の名前と住所はこちらです。'],
  ['consulate', '请帮我联系中国领馆', '日本境内拨06-6445-9427；夜间用中国领事APP。', '中国の総領事館に連絡したいです。06-6445-9427に電話していただけますか。'],
  ['evacuation', '地震／海啸，需要避难', '海边遇强烈或长时间摇晃，立即离岸向高处；海啸警报解除前不返回。', '安全な避難場所まで案内してください。津波から避難できる高い場所はどこですか。'],
  ['location', '请告诉救援人员我的位置', '把这张卡给身边的人看。', '今いる場所の住所や目印を教えてください。救急隊や警察に、私のいる場所を伝えてください。'],
  ['payment', '卡片无法使用，需要帮助', '请店员告知可用付款方式或附近ATM。', 'このカードが使えません。ほかの支払い方法か、海外のカードを使えるATMを教えてください。']
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function validQr(value) {
  return typeof value === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) ? value : '';
}

export const emergencyStyles = `
.emergency-kit{color:#172c3e;font:16px/1.65 system-ui,-apple-system,"PingFang SC","Hiragino Sans",sans-serif;overflow-wrap:anywhere}
.emergency-kit *{box-sizing:border-box}.emergency-kit [hidden]{display:none!important}
.emergency-kit h2,.emergency-kit h3,.emergency-kit p{margin:0}.emergency-kit h2{font-size:23px;line-height:1.35;margin-bottom:18px}.emergency-kit h3{font-size:18px;line-height:1.4}
.emergency-kit a{color:#145c89;text-underline-offset:3px}.emergency-kit button,.emergency-kit .ek-file-label{font:inherit;cursor:pointer;border:1px solid #b5c7d5;border-radius:7px;background:#fff;color:#164b70;padding:9px 14px;min-height:44px}
.emergency-kit button:hover,.emergency-kit .ek-file-label:hover{background:#edf5fa}.emergency-kit button:focus-visible,.emergency-kit a:focus-visible,.emergency-kit summary:focus-visible{outline:3px solid #2576c0;outline-offset:3px}
.ek-nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.ek-nav a{padding:8px 14px;border:1px solid #cfdae3;border-radius:7px;text-decoration:none;background:#fff}
.ek-section{scroll-margin-top:100px;margin:28px 0}.ek-urgent,.ek-help-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.ek-card{padding:20px;border:1px solid #cfdce5;border-radius:10px;background:#fff}.ek-card p{margin-top:10px}.ek-card .ek-jp{font-size:18px;line-height:1.8;color:#152a40}.ek-card button{margin-top:14px}
.ek-card.ek-danger{border-top:4px solid #b02c35;background:#fffafa}.ek-danger .ek-number{font-size:40px;font-weight:800;line-height:1.1;color:#9d202c;text-decoration:none;display:block;margin-bottom:12px}
.ek-note{font-size:14px;color:#4c6171}.ek-contact{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ek-contact .ek-phone{display:block;font-size:23px;font-weight:750;margin:10px 0 4px}.ek-contact .ek-card p{margin-top:7px}.ek-consulate{grid-column:1/-1}.ek-contact dl{margin:12px 0 0;display:grid;grid-template-columns:6em 1fr;gap:7px 12px}.ek-contact dt{color:#526778}.ek-contact dd{margin:0}
.ek-qr{border:1px solid #cfdce5;background:white;border-radius:10px;padding:20px}.ek-qr img{display:block;width:min(100%,420px);height:auto;margin:16px auto;background:#fff}.ek-qr-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:14px}.ek-qr-tools input{max-width:100%}.ek-qr-status{margin-top:8px!important}.ek-hotels{border-top:1px solid #cfdae3;padding-top:20px}.ek-hotels summary{font-size:20px;font-weight:700;cursor:pointer;min-height:44px}.ek-hotel-list{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}.ek-hotel .ek-jp{font-size:17px}.ek-hotel button{margin-top:10px}.ek-hotel time{font-size:14px;color:#526778}
.ek-insurance{padding:18px 20px;border-left:4px solid #336b95;background:#edf4f9}.ek-insurance p{margin-top:8px}.ek-sources{font-size:13px;color:#53697b;border-top:1px solid #d8e1e8;padding-top:15px}.ek-sources a{margin-right:14px}.ek-dialog{width:min(94vw,800px);max-height:94dvh;border:0;border-radius:12px;padding:25px;color:#162b40;background:white;overflow:auto}.ek-dialog::backdrop{background:#152638d9}.ek-dialog h2{font-size:20px}.ek-dialog p[lang=ja]{font-size:clamp(25px,5vw,38px);line-height:1.8;margin:24px 0}.ek-dialog .ek-close{position:sticky;top:0;float:right}.ek-dialog img{display:block;width:min(100%,650px);height:auto;margin:14px auto}.ek-dialog .ek-sim{font-size:20px;line-height:1.7;border-top:1px solid #d4dfe7;padding-top:18px}.ek-export-body{margin:0;background:#f2f5f8}.ek-export-body main{max-width:1000px;margin:auto;padding:26px 22px}.ek-export-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}.ek-export-head h1{font-size:28px;margin:0}.ek-export-head small{color:#526778}
@media(max-width:650px){.ek-urgent,.ek-help-grid,.ek-contact,.ek-hotel-list{grid-template-columns:1fr}.ek-card{padding:17px}.ek-contact dl{grid-template-columns:5em 1fr;gap:8px}.ek-export-body main{padding:20px 14px}.ek-export-head{align-items:start;flex-direction:column}}
@media print{.ek-nav,.ek-card button,.ek-qr-tools,.ek-qr button,.ek-export-head button,.ek-dialog{display:none!important}.ek-export-body{background:#fff}.ek-export-body main{max-width:none;padding:0}.ek-section{margin:18px 0}.ek-card,.ek-qr,.ek-hotel{break-inside:avoid}.ek-help-grid,.ek-contact,.ek-hotel-list{display:block}.ek-help-grid .ek-card,.ek-contact .ek-card,.ek-hotel{margin-bottom:10px}.ek-qr img{width:300px}.ek-card .ek-jp{font-size:16px}.ek-note{font-size:12px}.ek-hotels>summary{list-style:none}}
`;

function cardHtml([id, title, action, japanese, urgent]) {
  return `<article class="ek-card${urgent ? ' ek-danger' : ''}" id="ek-${id}">${urgent ? `<a class="ek-number" href="tel:${id === 'medical' ? '119' : '110'}">${id === 'medical' ? '119' : '110'}</a>` : ''}<h3>${title}</h3><p class="ek-note">${action}</p><p class="ek-jp" lang="ja">${japanese}</p><button type="button" data-ek-show="ek-${id}">放大日语给对方看</button></article>`;
}

function qrHtml(qr, editable) {
  return `<section class="ek-section ek-qr" id="ek-qr"><h2>入境二维码</h2><p class="ek-note">Visit Japan Web · 入境审查／海关申报</p><div data-ek-qr-image>${qr ? `<img src="${qr}" alt="Visit Japan Web 入境审查及海关申报二维码"><button type="button" data-ek-qr-show>放大二维码</button>` : '<p class="ek-qr-status">此设备尚未加入二维码。</p>'}</div>${editable ? '<div class="ek-qr-tools"><label class="ek-file-label">选择二维码图片<input id="ek-qr-file" type="file" accept="image/png,image/jpeg,image/webp" hidden></label><button type="button" id="ek-qr-remove">移除此设备的二维码</button></div><p class="ek-note ek-qr-status" id="ek-qr-status" role="status">图片仅保存在此浏览器；下载的离线文件会包含它。</p>' : ''}</section>`;
}

export function emergencyContents(qr = '', editable = false) {
  const hotels = stays.map(stay => `<article class="ek-card ek-hotel" id="ek-hotel-${stay.id}"><time>${stay.dates}</time><h3>${escapeHtml(stay.name)}</h3><p class="ek-jp" lang="ja">${escapeHtml(hotelAddresses[stay.placeId] || placesById[stay.placeId].address)}</p><button type="button" data-ek-show="ek-hotel-${stay.id}">放大地址</button></article>`).join('');
  return `<style>${emergencyStyles}</style><nav class="ek-nav" aria-label="急用页目录"><a href="#ek-urgent">急救／报警</a><a href="#ek-contacts">领馆／中文协助</a><a href="#ek-help">日语求助</a><a href="#ek-qr">入境二维码</a><a href="#ek-hotels">住宿地址</a></nav>
    <section class="ek-section" id="ek-urgent"><h2>需要马上有人帮忙</h2><div class="ek-urgent">${helpCards.filter(card => card[4]).map(cardHtml).join('')}</div></section>
    <section class="ek-section" id="ek-contacts"><h2>领馆与中文协助</h2><div class="ek-contact">
      <article class="ek-card"><h3>中国领事 · 12308</h3><p><strong>流量卡：打开“中国领事”APP → 12308网络电话</strong></p><p class="ek-note">24小时；联网免费拨打。</p><a class="ek-phone" href="tel:+861012308">+86-10-12308</a><p class="ek-note">普通电话备用：+86-10-65612308</p></article>
      <article class="ek-card"><h3>JNTO · 中文旅客协助</h3><a class="ek-phone" href="tel:05038162787">050-3816-2787</a><p>24小时 · 找医院／事故／灾害协助</p><p class="ek-note">请店员或站务员代拨；境外拨+81-50-3816-2787。</p></article>
      <article class="ek-card ek-consulate"><h3>中国驻大阪总领馆</h3><p class="ek-note">你的大阪、京都、滋贺、兵库、鸟取行程均在其领区。</p><dl><dt>领事保护</dt><dd><a href="tel:0664459427"><strong>06-6445-9427</strong></a>（工作时间；其余时间用12308）</dd><dt>证件咨询</dt><dd><a href="tel:0664459486">06-6445-9486</a></dd><dt>办公时间</dt><dd>周一至周五 09:00–12:30、14:00–18:30，日本时间；中日节假日除外。证件窗口下午不开放。</dd><dt>地址</dt><dd lang="ja">大阪府大阪市西区靱本町3-9-2</dd><dt>证件邮箱</dt><dd><a href="mailto:osaka@csm.mfa.gov.cn">osaka@csm.mfa.gov.cn</a></dd></dl></article>
    </div></section>
    <section class="ek-section" id="ek-help"><h2>选择情况，放大给对方看</h2><div class="ek-help-grid">${helpCards.filter(card => !card[4]).map(cardHtml).join('')}</div></section>
    ${qrHtml(validQr(qr), editable)}
    <details class="ek-section ek-hotels" id="ek-hotels"><summary>住宿地址 · 6间，可直接出示</summary><div class="ek-hotel-list">${hotels}</div></details>
    <section class="ek-section ek-insurance"><h3>保险 · 泰康在线 无忧保</h3><p>支付宝 → 蚂蚁保 → 我的保单 → 对应订单 → 理赔／客服。就医保留诊断、处方、费用明细和付款凭证；医疗转运先联系保险公司安排。</p></section>
    <footer class="ek-sources">联系方式核验：2026/11/28。<a href="https://osaka.china-consulate.gov.cn/chn/lsfw/">大阪总领馆</a><a href="https://www.japan.travel/en/plan/hotline/">JNTO</a><a href="https://www.jma.go.jp/jma/kishou/know/jishin/tsunami_bosai/index.html">气象厅</a></footer>
    <dialog class="ek-dialog" aria-label="向工作人员出示"><button type="button" class="ek-close" data-ek-close>关闭 ×</button><h2 data-ek-title></h2><div data-ek-display></div><p class="ek-sim" lang="ja">私の携帯はデータ通信専用で、電話ができません。お手伝いいただけますか。</p></dialog>`;
}

// Shared with the standalone HTML: all assistance cards also work without a network.
export function bindEmergencyActions(root) {
  const dialog = root.querySelector('.ek-dialog');
  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-ek-close')) return dialog.close();
    if (button.hasAttribute('data-ek-print')) return window.print();
    const id = button.dataset.ekShow;
    const card = id && root.querySelector(`#${id}`);
    const qr = button.hasAttribute('data-ek-qr-show') && root.querySelector('[data-ek-qr-image] img');
    if (!card && !qr) return;
    dialog.querySelector('[data-ek-title]').textContent = qr ? 'Visit Japan Web' : card.querySelector('h3').textContent;
    const display = dialog.querySelector('[data-ek-display]');
    display.replaceChildren();
    if (qr) display.append(qr.cloneNode(true));
    else {
      if (card.classList.contains('ek-hotel')) {
        const request = document.createElement('p');
        request.lang = 'ja';
        request.textContent = 'この宿に行きたいです。行き方を教えてください。';
        display.append(request);
      }
      display.append(card.querySelector('[lang=ja]').cloneNode(true));
    }
    dialog.querySelector('.ek-sim').hidden = !!qr || !!card?.classList.contains('ek-danger');
    dialog.showModal();
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  // Expand addresses for browser-menu printing as well as the print button.
  let printWasOpen = false;
  window.addEventListener('beforeprint', () => {
    const hotels = root.querySelector('#ek-hotels');
    printWasOpen = hotels.open;
    hotels.open = true;
  });
  window.addEventListener('afterprint', () => { root.querySelector('#ek-hotels').open = printWasOpen; });
}

export function buildEmergencyHtml(qr = '') {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>日本旅行 · 离线急用</title><style>${emergencyStyles}</style></head><body class="ek-export-body"><main class="emergency-kit" id="emergency"><header class="ek-export-head"><div><h1>日本旅行 · 离线急用</h1><small>2026/12/2–12/16</small></div><button type="button" data-ek-print>打印／存为PDF</button></header>${emergencyContents(qr)}</main><script>(${bindEmergencyActions.toString()})(document.querySelector('#emergency'));</script></body></html>`;
}

export function renderOfflineKit() {
  const root = document.querySelector('#offline-kit-content');
  root.classList.add('emergency-kit');
  let qr = '';
  try { qr = validQr(localStorage.getItem(QR_KEY)); } catch { /* In-memory use still works. */ }
  root.innerHTML = emergencyContents(qr, true);
  bindEmergencyActions(root);
  const status = root.querySelector('#ek-qr-status');
  const updateQr = () => {
    root.querySelector('[data-ek-qr-image]').innerHTML = qr ? `<img src="${qr}" alt="Visit Japan Web 入境审查及海关申报二维码"><button type="button" data-ek-qr-show>放大二维码</button>` : '<p class="ek-qr-status">此设备尚未加入二维码。</p>';
  };
  root.querySelector('#ek-qr-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      status.textContent = '请选择8MB以内的PNG、JPEG或WebP二维码图片。';
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => { status.textContent = '图片读取失败，请重选。'; };
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => { status.textContent = '无法打开这张图片，请重选。'; };
      image.onload = () => {
        qr = validQr(reader.result);
        updateQr();
        try { localStorage.setItem(QR_KEY, qr); status.textContent = '已加入此设备；现在下载的离线HTML会包含二维码。'; }
        catch { status.textContent = '已加入本次页面；请现在下载离线HTML保存二维码。'; }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  root.querySelector('#ek-qr-remove').addEventListener('click', () => {
    qr = '';
    try { localStorage.removeItem(QR_KEY); } catch { /* No persistent storage. */ }
    root.querySelector('#ek-qr-file').value = '';
    updateQr();
    status.textContent = '已从此设备移除。';
  });
  document.querySelector('#download-offline-kit').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([buildEmergencyHtml(qr)], {type:'text/html;charset=utf-8'}));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'japan-trip-offline-2026.html';
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  });
}
