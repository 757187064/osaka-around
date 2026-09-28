export const transportStatus = {
  confirmed_current: { icon: '🟢', label: '当前资料确认' },
  needs_recheck: { icon: '🟡', label: '当前参考，11月底复核' },
  booking_required: { icon: '🟣', label: '需要主动购买' },
  reference_only: { icon: '🔴', label: '尚未确认' },
  purchased: { icon: '🔵', label: '已购买' }
};

export const transportClasses = {
  A: 'IC卡直接刷／现场即可', B: '普通列车／无需预约', C: '指定席／无需很早购买',
  D: '建议提前购买', E: '必须提前预约', F: '特殊交通／现金或特殊支付'
};

export const transport = [
  { id: 'kix-kyoto-rail', date: '12/2', segment: 'KIX → 京都', class: 'C', method: 'HARUKA／当日最合适机场铁路', time: '约 75–90 分钟', price: '约 ¥3,000 级', budgetJPY: 3000, buy: '入境后按实际时间购买', risk: '中', status: 'reference_only', note: '不把 12 月具体班次写死；抵达 T2 后需预留接驳时间。' },
  { id: 'kyoto-nara', date: '12/3', segment: '京都 ↔ 奈良', class: 'A', method: '优先近铁', time: '约 40–50 分钟／单程', price: '约 ¥700–800 级／单程', budgetJPY: 1600, buy: '当天 IC／现场', risk: '低', status: 'confirmed_current', note: '近铁奈良站更适合奈良公园。' },
  { id: 'kyoto-hiyoshi', date: '12/6', segment: '京都 → 日吉', class: 'B', method: 'JR 普通列车', time: '当前参考：08:00 左右', price: '现场票价', budgetJPY: 1000, buy: '当天', risk: '高', status: 'needs_recheck', note: '11/20–11/25 重新核对以接上美山巴士。' },
  { id: 'hiyoshi-miyama', date: '12/6', segment: '日吉 → 美山茅葺之里', class: 'F', method: '南丹市营巴士', time: '当前参考：09:10 → 10:00', price: '当前 ¥600', budgetJPY: 600, buy: '车上；准备现金／官方支持电子支付', risk: '高', status: 'needs_recheck', note: '不要依赖 ICOCA。' },
  { id: 'miyama-hiyoshi', date: '12/6', segment: '美山 → 日吉', class: 'F', method: '南丹市营巴士', time: '当前参考：14:54 → 15:45', price: '当前 ¥600', budgetJPY: 600, buy: '车上', risk: '高', status: 'needs_recheck', note: '回日吉后的 JR 衔接需重新核对。' },
  { id: 'hiyoshi-maizuru', date: '12/6', segment: '日吉 → 绫部 → 东舞鹤', class: 'B', method: 'JR 普通列车', time: '当前参考：15:56 → 16:50；17:10 → 17:38', price: '现场票价', budgetJPY: 1300, buy: '当天', risk: '高', status: 'needs_recheck', note: '冬季时刻表必须在 11 月底前再次确认。' },
  { id: 'maizuru-amanohashidate', date: '12/7', segment: '东舞鹤 → 西舞鹤 → 天桥立', class: 'B', method: 'JR + 京都丹后铁道', time: '当前参考：13:23 → 14:16', price: '现场票价', budgetJPY: 800, buy: '当天', risk: '中', status: 'needs_recheck', note: '为 17:00 前入住保留余量。' },
  { id: 'amanohashidate-ine', date: '12/8', segment: '天桥立 ↔ 伊根', class: 'F', method: '丹海交通季节快速巴士', time: '当前参考：09:50 → 10:33；15:50 → 16:33', price: '当前 ¥1,200／单程', budgetJPY: 2400, buy: '不预约；提前候车', risk: '中', status: 'needs_recheck', note: '目前不属于必须预约，11 月底确认冬季运行。' },
  { id: 'amanohashidate-toyooka', date: '12/10', segment: '天桥立 → 丰冈', class: 'B', method: '京都丹后铁道普通列车', time: '当前参考：13:18 → 14:41', price: '约 ¥1,200 级', budgetJPY: 1200, buy: '当天', risk: '中', status: 'needs_recheck', note: '当前参考时刻，不当作冬季最终班次。' },
  { id: 'toyooka-kinosaki', date: '12/10–11', segment: '丰冈 ↔ 城崎温泉', class: 'B', method: 'JR 普通列车', time: '约 10–12 分钟／单程', price: '约 ¥200 级／单程', budgetJPY: 800, buy: '当天 IC／现场', risk: '中', status: 'needs_recheck', note: '夜间回程不把最后一班当计划；11 月底复核。' },
  { id: 'toyooka-tottori', date: '12/12', segment: '丰冈 → 鸟取', class: 'B', method: '普通山阴本线省钱方案', time: '约 2.5 小时级', price: '约 ¥1,500 级', budgetJPY: 1500, buy: '当天', risk: '中', status: 'needs_recheck', note: '不要写死尚未最终核实的 12 月班次。' },
  { id: 'tottori-kyoto', date: '12/14', segment: '鸟取 → 大阪 → 京都', class: 'D', method: 'Super Hakuto + JR 新快速', time: '当前参考：鸟取约14:21 → 大阪约16:48', price: '约 ¥8,000 级总计', budgetJPY: 8000, buy: '建议乘车前 7–21 天主动购买指定席', risk: '中', status: 'booking_required', note: 'Super Hakuto 全车指定席；最终 12 月班次 11 月底复核。' },
  { id: 'kyoto-kix', date: '12/16', segment: '京都 → KIX T2', class: 'C', method: 'HARUKA + T2 免费接驳', time: '当前目标：11:00 左右出发', price: '约 ¥3,000 级', budgetJPY: 3000, buy: '前 1–7 天或当天', risk: '中', status: 'needs_recheck', note: '目标约 13:00 已到 T2；须复核实际航站楼与 HARUKA。' }
];
