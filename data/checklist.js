export const checklistGroups = [
  { when: '现在', items: [
    { id: 'bag-9c6987', action: 'confirm', text: '确认 9C6987 订单中的实际行李额度' },
    { id: 'bag-9c6988', action: 'confirm', text: '确认 9C6988 订单中的实际行李额度' }
  ] },
  { when: '11/14 以后', items: [
    { id: 'hakuto-buy', action: 'ticket', text: '查看／购买 12/14 Super Hakuto 指定席' }
  ] },
  { when: '11/20–11/25', items: [
    { id: 'miyama-kyoto-hiyoshi', action: 'recheck', text: '重新核实 12/6 京都 → 日吉' },
    { id: 'miyama-bus-out', action: 'recheck', text: '重新核实南丹巴士：日吉 → 美山' },
    { id: 'miyama-bus-return', action: 'recheck', text: '重新核实美山 → 日吉' },
    { id: 'miyama-maizuru', action: 'recheck', text: '重新核实日吉 → 绫部 → 东舞鹤' }
  ] },
  { when: '11 月底', items: [
    { id: 'maizuru-amanohashidate', action: 'recheck', text: '12/7 东舞鹤 → 天桥立' },
    { id: 'ine-bus', action: 'recheck', text: '12/8 伊根快速巴士' },
    { id: 'amanohashidate-toyooka', action: 'recheck', text: '12/10 天桥立 → 丰冈' },
    { id: 'kinosaki-night-jr', action: 'recheck', text: '城崎 → 丰冈夜间 JR' },
    { id: 'toyooka-tottori', action: 'recheck', text: '丰冈 → 鸟取' },
    { id: 'tottori-kyoto', action: 'recheck', text: '鸟取 → 京都' },
    { id: 'kyoto-kix', action: 'recheck', text: '京都 → KIX HARUKA' }
  ] },
  { when: '出发前 24–48 小时', items: [
    { id: 'kix-terminal', action: 'confirm', text: '确认 KIX 春秋实际航站楼' },
    { id: 'flight-status', action: 'confirm', text: '确认航班状态' },
    { id: 'coast-weather', action: 'confirm', text: '确认日本海沿岸天气：大雪／强风' },
    { id: 'jr-status', action: 'confirm', text: '确认 JR 与巴士运行状态' }
  ] }
];

export const officialLinks = [
  { label: 'JR 西日本', url: 'https://www.jr-odekake.net/', type: 'official' },
  { label: '京都丹后铁道', url: 'https://trains.willer.co.jp/', type: 'official' },
  { label: '丹海交通', url: 'https://www.tankai.jp/', type: 'official' },
  { label: '南丹市', url: 'https://www.city.nantan.kyoto.jp/', type: 'official' },
  { label: '城崎温泉旅游协会', url: 'https://kinosaki-spa.gr.jp/', type: 'official' },
  { label: '鸟取砂之美术馆', url: 'https://www.sand-museum.jp/', type: 'official' },
  { label: 'KIX 关西国际机场', url: 'https://www.kansai-airport.or.jp/', type: 'official' },
  { label: '春秋航空', url: 'https://www.ch.com/', type: 'official' },
  { label: 'Google Maps', url: 'https://www.google.com/maps', type: 'third-party' }
];
