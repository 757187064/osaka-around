export const trip = {
  meta: {
    title: '2026年12月 日本关西—北近畿—山阴 14晚独旅行程',
    heading: '2026年12月\n日本关西—北近畿—山阴\n14晚独旅行程',
    subtitle: '京都 · 奈良 · 美山 · 舞鹤 · 天桥立 · 伊根 · 丰冈 · 城崎 · 鸟取',
    dates: '2026/12/02 — 2026/12/16',
    departureDate: '2026-12-02T11:40:00+08:00'
  },
  stats: [
    ['15天', '旅行天数'],
    ['14晚', '住宿已覆盖'],
    ['1人', '独自旅行'],
    ['5个', '主要住宿城市'],
    ['3个', '当天往返'],
    ['1个', '重点交通风险日']
  ],
  flights: [
    {
      id: 'flight-9c6987', date: '2026-12-02', airline: '春秋航空', flight: '9C6987',
      route: '大连 → 大阪 KIX', time: '11:40 → 15:30', amountRmb: 963, status: 'purchased',
      note: '近期春秋在 KIX 主要使用 T2；实际航站楼须在出发前 24–48 小时再次确认。'
    },
    {
      id: 'flight-9c6988', date: '2026-12-16', airline: '春秋航空', flight: '9C6988',
      route: '大阪 KIX → 大连', time: '16:30 → 18:15', amountRmb: 1314, status: 'purchased',
      note: '目标约 13:00 已抵达 KIX T2；额外 5kg 托运行李目前未确认，不能视为已购买。'
    }
  ],
  budget: {
    airfareRmb: 2277,
    lodgingPriceState: '住宿价格字段保留，待手动填写',
    exchangeRateStorageKey: 'japan-trip-2026-jpy-cny-rate'
  },
  experiences: [
    { placeId: 'miyama', icon: '🏡', title: '美山茅葺之里', text: '12/6 的村落步行、拍照与午饭；大雪或巴士异常时优先处理交通风险。', imageKey: 'miyama' },
    { placeId: 'ine', icon: '⛵', title: '伊根舟屋与海湾', text: '12/8 当天往返；海况不佳时不强求游船。', imageKey: 'ine' },
    { placeId: 'kinosaki', icon: '♨️', title: '城崎温泉', text: '住丰冈、白天与晚上往返城崎；外汤主力安排在 12/11。', imageKey: 'kinosaki' },
    { placeId: 'tottori', icon: '🏜️', title: '鸟取砂丘', text: '砂丘与砂之美术馆为核心，浦富海岸由天气决定。', imageKey: 'tottori' }
  ]
};
