const item = (time, label, detail) => ({ time, label, detail });

export const days = [
  {
    date: '2026-12-02', displayDate: '12/2', weekday: '周三', title: '抵达日本｜KIX → 京都', base: '京都 · Kyoto Guesthouse HIVE', sleep: 'Kyoto Guesthouse HIVE', theme: '抵达 / 适应', risk: 'medium', placeIds: ['kix', 'kyoto'],
    mapLegs: [{ from: 'Kansai International Airport', to: 'Kyoto Station', label: 'KIX → 京都站' }],
    intro: { icon: '✈️', title: '把抵达留给节奏，不留给赶路', text: '第一天的重点不是打卡，而是顺利穿过入境、机场接驳与 HARUKA，把京都的第一晚安稳地接住。' },
    timeline: [
      item('11:40', '起床', '已在大连机场；春秋航空 9C6987 起飞。'), item('出发前', '离开住宿', '离开大连，确认护照、订单和手提行李。'), item('15:30 后', '交通', '入境、T2 接驳与铁路；约 17:00 开始前往京都，优先 HARUKA。'), item('19:00–20:00', '抵达', '目标抵达 HIVE；如航班延误，先与旅舍联系。'), item('抵达后', '上午', '不安排景点，保留给入境与转场。'), item('晚上前', '午餐区域', '机场或京都站按实际时间简单用餐。'), item('傍晚', '下午', '完成入住，要求前台关联两张订单并尽量四晚同一床位。'), item('日落前', '日落前', '便利店补给、确认次日奈良出发点。'), item('晚上', '晚上', '晚餐、洗澡、休息；当天不安排景点。'), item('夜间', '回住宿', '回 Kyoto Guesthouse HIVE。'), item('重点', '交通注意', 'Flight 9C6987 arrives at KIX at 15:30. Expected arrival approximately 19:00–20:00. Please keep the reservation in case of flight delay.')
    ],
    weather: { sun: '按抵达节奏转场即可。', rain: '机场与铁路优先，不增加室外安排。', snow: '确认机场铁路与 T2 接驳状态，必要时告知旅舍晚到。' }
  },
  {
    date: '2026-12-03', displayDate: '12/3', weekday: '周四', title: '奈良一日游', base: '京都 · Kyoto Guesthouse HIVE', sleep: 'Kyoto Guesthouse HIVE', theme: '古都 / 鹿 / 寺社', risk: 'low', placeIds: ['kyoto', 'nara'],
    mapLegs: [{ from: 'Kyoto Station', to: 'Kintetsu Nara Station', label: '京都 → 近铁奈良' }, { from: 'Kintetsu Nara Station', to: 'Kyoto Station', label: '近铁奈良 → 京都' }],
    intro: { icon: '🦌', title: '古寺、鹿群与冬日的缓坡', text: '从奈良公园到二月堂，再把午后留给春日大社与奈良町；这是一条适合慢慢走、随时停下来的古都路线。' },
    timeline: [
      item('07:00', '起床', '轻装出门。'), item('07:45', '离开住宿', '从 HIVE 出发前往近铁方向。'), item('07:45–09:00', '交通', '京都 → 近铁奈良，优先近铁奈良站。'), item('约09:00', '抵达', '抵达近铁奈良，步行进入奈良公园区域。'), item('09:00–12:00', '上午', '兴福寺 → 奈良公园 → 东大寺 → 二月堂。'), item('12:00–13:00', '午餐区域', '东向商店街／奈良町。'), item('13:00–16:30', '下午', '春日大社 → 春日原始林外围 → 奈良町。'), item('16:30–17:00', '日落前', '结束奈良町步行，回站前留出余量。'), item('17:00–18:30', '晚上', '返回京都后在河原町附近自由晚餐。'), item('晚间', '回住宿', '回 Kyoto Guesthouse HIVE。'), item('重点', '交通注意', '近铁奈良站位置更贴近奈良公园；当天 IC／现场即可。')
    ],
    weather: { sun: '按寺社、公园与奈良町完整步行。', rain: '缩短春日原始林外围，增加奈良町、商店街和博物馆型停留。', snow: '优先东大寺、兴福寺与室内休息，谨慎走林道。' }
  },
  {
    date: '2026-12-04', displayDate: '12/4', weekday: '周五', title: '京都东部／东北部', base: '京都 · Kyoto Guesthouse HIVE', sleep: 'Kyoto Guesthouse HIVE', theme: '寺院 / 步行 / 初冬', risk: 'low', placeIds: ['kyoto'],
    mapLegs: [{ from: 'Kyoto Station', to: 'Nanzen-ji Temple', label: '京都站 → 南禅寺' }, { from: 'Nanzen-ji Temple', to: 'Kawaramachi Station Kyoto', label: '南禅寺 → 河原町' }],
    intro: { icon: '⛩️', title: '寺院水路与哲学之道', text: '南禅寺的石桥、水路阁与东山小径串起京都东北部；傍晚顺势落到鸭川和河原町即可。' },
    timeline: [
      item('07:00', '起床', '早餐后准备东山步行。'), item('08:00', '离开住宿', '从 HIVE 出发前往南禅寺。'), item('08:00–08:30', '交通', '市内公共交通至南禅寺周边。'), item('08:30', '抵达', '抵达南禅寺入口。'), item('08:30–11:30', '上午', '南禅寺 → 水路阁 → 永观堂。'), item('11:30–13:00', '午餐区域', '哲学之道／冈崎周边。'), item('13:00–16:00', '下午', '哲学之道 → 法然院 → 真如堂。'), item('16:00–17:00', '日落前', '吉田山、出町柳、鸭川，随天色收束。'), item('晚上', '晚上', '河原町／先斗町晚饭。'), item('晚间', '回住宿', '回 Kyoto Guesthouse HIVE。'), item('重点', '交通注意', '路线不依赖红叶满开；按步行体力删减一处寺院即可。')
    ],
    weather: { sun: '完整走寺院与哲学之道。', rain: '缩短哲学之道，把重点放在南禅寺、永观堂与河原町。', snow: '减少山坡与小径，市内交通与室内寺院优先。' }
  },
  {
    date: '2026-12-05', displayDate: '12/5', weekday: '周六', title: '岚山深度游', base: '京都 · Kyoto Guesthouse HIVE', sleep: 'Kyoto Guesthouse HIVE', theme: '岚山 / 安静古街', risk: 'low', placeIds: ['kyoto'],
    mapLegs: [{ from: 'Kyoto Station', to: 'Arashiyama Station', label: '京都站 → 岚山站' }, { from: 'Arashiyama Station', to: 'Kyoto Station', label: '岚山站 → 京都站' }],
    intro: { icon: '🎋', title: '早晨的岚山，下午的嵯峨', text: '渡月桥、天龙寺和竹林适合早到；真正值得放慢的是常寂光寺、祇王寺到嵯峨鸟居本这一段。' },
    timeline: [
      item('06:45', '起床', '周六尽量早起。'), item('07:20', '离开住宿', '轻装前往岚山。'), item('07:20–08:00', '交通', '京都市内 → 岚山。'), item('08:00', '抵达', '抵达渡月桥区域。'), item('08:00–10:00', '上午', '渡月桥 → 天龙寺 → 竹林。'), item('10:00–11:00', '午餐区域', '岚山核心区提前简单用餐。'), item('11:00–15:30', '下午', '常寂光寺 → 祇王寺 → 嵯峨鸟居本。'), item('16:00 前', '日落前', '早点返回京都，不继续横跨全城。'), item('晚上', '晚上', '整理 12/6 轻装，早睡。'), item('晚间', '回住宿', '回 Kyoto Guesthouse HIVE。'), item('重点', '交通注意', '周六人流大；重点是嵯峨后半段，不是压缩打卡。')
    ],
    weather: { sun: '按渡月桥至嵯峨鸟居本完整步行。', rain: '缩短竹林与古街，保留天龙寺及室内用餐。', snow: '只保留渡月桥、天龙寺周边，提早回京都准备交通日。' }
  },
  {
    date: '2026-12-06', displayDate: '12/6', weekday: '周日', title: '重点交通日｜京都 → 美山 → 东舞鹤', base: '东舞鹤 · GATEWAY MAIZURU', sleep: 'GATEWAY MAIZURU', theme: '全程最大交通核查点', risk: 'high', placeIds: ['kyoto', 'hiyoshi', 'miyama', 'ayabe', 'maizuru'],
    mapLegs: [{ from: 'Kyoto Station', to: 'Hiyoshi Station Kyoto', label: '京都 → 日吉' }, { from: 'Hiyoshi Station Kyoto', to: 'Miyama Kayabuki no Sato', label: '日吉 → 美山' }, { from: 'Miyama Kayabuki no Sato', to: 'Hiyoshi Station Kyoto', label: '美山 → 日吉' }, { from: 'Hiyoshi Station Kyoto', to: 'Ayabe Station', label: '日吉 → 绫部' }, { from: 'Ayabe Station', to: 'Higashi-Maizuru Station', label: '绫部 → 东舞鹤' }],
    intro: { icon: '🏡', title: '茅葺村落与一整天的转场', text: '美山是这趟旅程最需要尊重班次的一站：给村落留足散步时间，也给巴士、换乘和冬季天气留足余量。' },
    timeline: [
      item('06:20–06:30', '起床', '早餐尽量简单，检查现金和充电。'), item('06:55', '离开住宿', '离开 HIVE，目标 07:25–07:35 到京都站。'), item('08:00 左右', '交通', '京都 → 日吉；当前参考，必须在 11 月底前复核。'), item('10:00', '抵达', '当前参考：日吉 09:10 巴士 → 美山，10:00 抵达。'), item('10:00–12:00', '上午', '茅葺村落、拍照与慢步行。'), item('12:00–13:00', '午餐区域', '美山茅葺之里内解决午餐。'), item('13:00–14:35', '下午', '继续村落散步；14:54 前回到巴士点。'), item('14:54–15:45', '日落前', '美山 → 日吉；冬季日落早，不延后。'), item('18:00 左右', '晚上', '日吉 → 绫部 → 东舞鹤后入住、晚饭、休息。'), item('夜间', '回住宿', '回 GATEWAY MAIZURU。'), item('重点', '交通注意', '南丹市营巴士不要依赖 ICOCA；准备现金／官方支持电子支付。现有班次仅供参考，11/20–11/25 与 11 月底均需复核。')
    ],
    weather: { sun: '按当前链路慢玩美山，14:54 准时返程。', rain: '减少村落外围步行，优先室内午餐与按时回巴士。', snow: '显示明显交通风险；若巴士异常，留在安全的日吉／京都区域处理衔接，不自动取消已订东舞鹤住宿。' }
  },
  {
    date: '2026-12-07', displayDate: '12/7', weekday: '周一', title: '东舞鹤 → 天桥立', base: '天桥立 · Auberge Amanohashidate', sleep: 'Auberge Amanohashidate', theme: '红砖 / 海港 / 入住', risk: 'medium', placeIds: ['maizuru', 'nishi-maizuru', 'amanohashidate'],
    mapLegs: [{ from: 'Higashi-Maizuru Station', to: 'Nishi-Maizuru Station', label: '东舞鹤 → 西舞鹤' }, { from: 'Nishi-Maizuru Station', to: 'Amanohashidate Station', label: '西舞鹤 → 天桥立' }],
    intro: { icon: '🧱', title: '红砖港区，转向海上沙洲', text: '上午在舞鹤的红砖与港区慢慢看，下午把重心转回天桥立的入住时间；17:00 前进房是当天的硬约束。' },
    timeline: [
      item('07:30', '起床', '正常早餐，不必过早撤离。'), item('08:30', '离开住宿', '从 GATEWAY 出发步行至东舞鹤站／港区。'), item('上午', '交通', '以步行为主；下午搭 JR + 京都丹后铁道。'), item('09:00', '抵达', '抵达舞鹤红砖公园与港区。'), item('09:00–11:15', '上午', '舞鹤红砖公园、港区、海军相关区域。'), item('11:30–12:30', '午餐区域', '东舞鹤站／港区。'), item('13:00–14:30', '下午', '当前参考：东舞鹤 13:23 → 西舞鹤 13:29；13:37 → 天桥立 14:16。'), item('15:30–16:00', '日落前', '入住 Auberge，最晚不得超过 17:00。'), item('晚上', '晚上', '智恩寺、廻旋桥、沙洲南端初览；可使用旁边大浴场。'), item('晚间', '回住宿', '回 Auberge Amanohashidate。'), item('重点', '交通注意', '12 月时刻必须 11 月底复核；天气恶劣时提前一班离开东舞鹤。')
    ],
    weather: { sun: '红砖公园后按当前参考前往天桥立。', rain: '缩短港区，提早转场，确保 17:00 前入住。', snow: '优先住宿硬约束，取消非必要港区停留。' }
  },
  {
    date: '2026-12-08', displayDate: '12/8', weekday: '周二', title: '伊根一日游', base: '天桥立 · Auberge Amanohashidate', sleep: 'Auberge Amanohashidate', theme: '舟屋 / 海湾 / 慢旅行', risk: 'medium', placeIds: ['amanohashidate', 'ine'],
    mapLegs: [{ from: 'Amanohashidate Station', to: 'Ine Funaya', label: '天桥立 → 伊根' }, { from: 'Ine Funaya', to: 'Amanohashidate Station', label: '伊根 → 天桥立' }],
    intro: { icon: '🚤', title: '舟屋沿着伊根湾展开', text: '伊根的魅力在于海湾、舟屋与慢节奏；游船只在海况合适时加入，不把它变成必须完成的任务。' },
    timeline: [
      item('07:30', '起床', '早餐后准备海边防风衣物。'), item('09:10', '离开住宿', '前往天桥立站／巴士上车点。'), item('09:25', '交通', '提前候车；当前参考 09:50 天桥立 → 伊根。'), item('10:33', '抵达', '抵达伊根。'), item('10:33–12:00', '上午', '舟屋街区与伊根湾步行。'), item('12:00–13:00', '午餐区域', '伊根当地。'), item('13:00–15:20', '下午', '伊根湾游船、舟屋、高处景观；海况不好就不强求游船。'), item('15:50–16:33', '日落前', '当前参考伊根 → 天桥立。'), item('晚上', '晚上', '大浴场、晚饭。'), item('晚间', '回住宿', '回 Auberge Amanohashidate。'), item('重点', '交通注意', '特殊巴士，目前不是必须预约；不依赖 IC 卡，11 月底复核运行。')
    ],
    weather: { sun: '舟屋、游船与高处景观择体力完成。', rain: '保留舟屋街区与午餐，取消游船和长距离步行。', snow: '优先按巴士是否运行决定；不安全时回天桥立安排大浴场与休息。' }
  },
  {
    date: '2026-12-09', displayDate: '12/9', weekday: '周三', title: '天桥立完整日', base: '天桥立 · Auberge Amanohashidate', sleep: 'Auberge Amanohashidate', theme: '双侧展望 / 沙洲 / 神社', risk: 'low', placeIds: ['amanohashidate'],
    mapLegs: [{ from: 'Amanohashidate Station', to: 'Amanohashidate View Land', label: '天桥立站 → View Land' }, { from: 'Amanohashidate View Land', to: 'Motoise Kono Shrine', label: 'View Land → 笼神社' }],
    intro: { icon: '🌉', title: '从飞龙观看一条横卧海面的松林', text: '今天没有跨城移动，可以把天桥立的南北两侧、沙洲、自行车和神社按当天风力与体力自由取舍。' },
    timeline: [
      item('08:00', '起床', '先看天气与能见度。'), item('08:30', '离开住宿', '步行前往南侧展望区域。'), item('上午', '交通', '步行／自行车／缆车，按当日风力选择。'), item('08:30', '抵达', '抵达 View Land。'), item('08:30–10:30', '上午', 'View Land、飞龙观、智恩寺。'), item('12:00', '午餐区域', '沙洲南端／车站附近。'), item('13:00–16:15', '下午', '租自行车穿越沙洲 → 元伊势笼神社 → 真名井神社 → 伞松公园。'), item('16:00 后', '日落前', '开始返回，不向更远地区扩展。'), item('晚上', '晚上', '大浴场与慢晚饭。'), item('晚间', '回住宿', '回 Auberge Amanohashidate。'), item('重点', '交通注意', '风大时改为单侧展望与神社，不强行骑行穿越。')
    ],
    weather: { sun: '完整走双侧展望与沙洲。', rain: '缩短骑行，保留智恩寺、笼神社和室内休息。', snow: '避开展望台与海边长距离步行，以住宿周边为主。' }
  },
  {
    date: '2026-12-10', displayDate: '12/10', weekday: '周四', title: '天桥立 → 丰冈 → 城崎温泉', base: '丰冈 · Hostel Act', sleep: 'Toyooka Guesthouse Hostel Act', theme: '转场 / 温泉街夜景', risk: 'medium', placeIds: ['amanohashidate', 'toyooka', 'kinosaki'],
    mapLegs: [{ from: 'Amanohashidate Station', to: 'Toyooka Station Hyogo', label: '天桥立 → 丰冈' }, { from: 'Toyooka Station Hyogo', to: 'Kinosaki Onsen Station', label: '丰冈 → 城崎温泉' }, { from: 'Kinosaki Onsen Station', to: 'Toyooka Station Hyogo', label: '城崎温泉 → 丰冈' }],
    intro: { icon: '♨️', title: '先把行李留在丰冈，再去泡城崎', text: '今天是转场和温泉街初见：丰冈是住宿基地，城崎留给傍晚的河边、灯光与第一批外汤。' },
    timeline: [
      item('08:00', '起床', '上午慢一点，收拾离开天桥立。'), item('11:30', '离开住宿', '退房后前往天桥立站。'), item('13:18', '交通', '当前参考：天桥立 → 丰冈，14:41 抵达；11 月底复核。'), item('15:00', '抵达', '抵达丰冈后入住／放行李。'), item('上午', '上午', '天桥立最后散步，不赶早班。'), item('11:30–12:30', '午餐区域', '天桥立站附近。'), item('15:45–18:30', '下午', '丰冈 → 城崎温泉普通 JR；温泉街、河边、第一批外汤。'), item('日落后', '日落前', '大谿川与温泉街夜景。'), item('晚上', '晚上', '晚餐后返回丰冈。'), item('20:30–21:00', '回住宿', '普通 JR 回 Toyooka Guesthouse Hostel Act，不赌最后一班。'), item('重点', '交通注意', '星期四当前参考御所之汤、柳汤可能固定休息，因此泡汤主力放 12/11。')
    ],
    weather: { sun: '按计划转场并在黄昏看温泉街。', rain: '减少河边停留，增加外汤与咖啡。', snow: '优先完成丰冈入住，确认丰冈↔城崎 JR 后再决定是否出发。' }
  },
  {
    date: '2026-12-11', displayDate: '12/11', weekday: '周五', title: '完整城崎温泉日', base: '丰冈 · Hostel Act', sleep: 'Toyooka Guesthouse Hostel Act', theme: '外汤 / 缆车 / 慢泡', risk: 'medium', placeIds: ['toyooka', 'kinosaki'],
    mapLegs: [{ from: 'Toyooka Station Hyogo', to: 'Kinosaki Onsen Station', label: '丰冈 → 城崎温泉' }, { from: 'Kinosaki Onsen Station', to: 'Toyooka Station Hyogo', label: '城崎温泉 → 丰冈' }],
    intro: { icon: '🛁', title: '让城崎温泉按自己的节奏发生', text: '缆车、温泉寺和外汤之间不需要冲刺；一张 Yumepa 配上咖啡、甜品与夜景，才是最舒服的完整一天。' },
    timeline: [
      item('07:30', '起床', '早餐后前往城崎。'), item('08:30', '离开住宿', '从 Hostel Act 前往丰冈站。'), item('08:30–09:00', '交通', '普通 JR 丰冈 → 城崎温泉。'), item('09:00', '抵达', '抵达城崎温泉站。'), item('09:00–11:30', '上午', '城崎温泉寺、缆车；优先完成有营业时间的项目。'), item('11:30–13:00', '午餐区域', '温泉街。'), item('13:00–17:00', '下午', '可购买 Yumepa 外汤一日券（当前约 ¥1,500）；穿插咖啡甜品，不机械刷汤。'), item('17:00–19:30', '日落前', '黄昏以后的温泉街夜景与晚饭。'), item('晚上', '晚上', '再泡一汤，看体力决定。'), item('20:30–21:00', '回住宿', '普通 JR 回丰冈，勿把末班当计划。'), item('重点', '交通注意', '当前参考さとの湯处于重建休业；外汤开放与票价须出发前复核。')
    ],
    weather: { sun: '温泉寺、缆车、外汤与夜景。', rain: '减少缆车，增加外汤、咖啡与街区停留。', snow: '避开山坡缆车，确认夜间 JR 后提早回丰冈。' }
  },
  {
    date: '2026-12-12', displayDate: '12/12', weekday: '周六', title: '丰冈 → 鸟取', base: '鸟取 · Drop Inn Tottori', sleep: 'Drop Inn Tottori', theme: '普通列车 / 海岸 / 鸟取初见', risk: 'medium', placeIds: ['toyooka', 'sanin-coast', 'tottori'],
    mapLegs: [{ from: 'Toyooka Station Hyogo', to: 'Tottori Station', label: '丰冈 → 鸟取' }],
    intro: { icon: '🚆', title: '沿山阴本线进入鸟取', text: '把今天当作从北近畿切换到山阴的移动日：抵达、入住与晚餐优先，海岸或城迹只在天气和班次允许时二选一。' },
    timeline: [
      item('07:30', '起床', '早餐、收拾行李。'), item('10:00', '离开住宿', '退房后前往丰冈站。'), item('中午前后', '交通', '优先普通山阴本线省钱方案；不写死 12 月未核实班次。'), item('中午–下午早些', '抵达', '目标抵达鸟取，先放行李并尽量 20:00 前完成入住。'), item('上午', '上午', '丰冈站周边／收拾，为衔接留余量。'), item('中午', '午餐区域', '丰冈站或换乘站按实际班次。'), item('15:00–17:00', '下午', '天气好：白兔海岸／白兔神社；或鸟取城迹，二选一。'), item('日落前', '日落前', '回鸟取站附近，避免冬季海边拖晚。'), item('晚上', '晚上', '鸟取站附近晚饭。'), item('晚间', '回住宿', '回 Drop Inn Tottori。'), item('重点', '交通注意', '11 月底复核丰冈 → 鸟取；不要把其他日期的特急运行规则硬套。')
    ],
    weather: { sun: '白兔海岸／鸟取城迹二选一。', rain: '入住后以鸟取站、市内咖啡为主。', snow: '以安全抵达与准时入住为第一优先，不安排海岸。' }
  },
  {
    date: '2026-12-13', displayDate: '12/13', weekday: '周日', title: '鸟取核心日', base: '鸟取 · Drop Inn Tottori', sleep: 'Drop Inn Tottori', theme: '砂丘 / 冬季日本海', risk: 'medium', placeIds: ['tottori'],
    mapLegs: [{ from: 'Tottori Station', to: 'Tottori Sand Dunes', label: '鸟取站 → 鸟取砂丘' }, { from: 'Tottori Sand Dunes', to: 'The Sand Museum', label: '鸟取砂丘 → 砂之美术馆' }],
    intro: { icon: '🏜️', title: '风纹、砂丘与冬日的日本海', text: '鸟取砂丘和砂之美术馆是今天的核心；浦富海岸只在能见度与海况都合适时作为额外奖励。' },
    timeline: [
      item('07:00', '起床', '天气好就早出门。'), item('08:00', '离开住宿', '从 Drop Inn 前往鸟取砂丘。'), item('08:00–08:30', '交通', '市内巴士前往砂丘，按当日班次确认。'), item('08:30', '抵达', '抵达鸟取砂丘。'), item('08:30–10:30', '上午', '鸟取砂丘。'), item('12:00', '午餐区域', '砂丘周边或回鸟取站方向。'), item('10:30–12:00 / 13:00 后', '下午', '砂之美术馆（2026 西班牙主题展期参考：4/24–2027/1/3）；天气好才考虑浦富海岸。'), item('16:00 前', '日落前', '浦富海岸仅作为天气加分项，不与白兔神社硬塞同日。'), item('晚上', '晚上', '鸟取最后一晚，整理次日指定席出发。'), item('晚间', '回住宿', '回 Drop Inn Tottori。'), item('重点', '交通注意', '冬季日本海风浪与公交间隔优先；砂丘、浦富、白兔不全塞一天。')
    ],
    weather: { sun: '砂丘 → 砂之美术馆，天气稳定时追加浦富海岸。', rain: '砂之美术馆、鸟取市内、咖啡和博物馆。', snow: '取消浦富海岸，优先市内室内计划。' }
  },
  {
    date: '2026-12-14', displayDate: '12/14', weekday: '周一', title: '鸟取 → 京都', base: '京都 · Piece Hostel Sanjo', sleep: 'Piece Hostel Sanjo', theme: '指定席 / 京都收尾', risk: 'medium', placeIds: ['tottori', 'chizu', 'kamigori-himeji', 'kyoto'],
    mapLegs: [{ from: 'Tottori Station', to: 'Osaka Station', label: '鸟取 → 大阪' }, { from: 'Osaka Station', to: 'Kyoto Station', label: '大阪 → 京都' }],
    intro: { icon: '🎟️', title: '带着指定席回到京都', text: '这天的主角是 Super Hakuto 与返京衔接；预留转乘时间，抵达三条后只安排轻松的晚餐和散步。' },
    timeline: [
      item('08:00', '起床', '早餐、整理与最后买伴手礼。'), item('11:30', '离开住宿', '退房并前往鸟取站。'), item('14:21 前', '交通', 'Super Hakuto → 大阪（当前参考约 16:48）→ JR 新快速 → 京都。'), item('17:20–17:40', '抵达', '目标到京都，前往 Piece Hostel Sanjo 入住。'), item('上午', '上午', '鸟取站周边轻松收尾，不安排远景点。'), item('11:30–13:20', '午餐区域', '鸟取站附近。'), item('下午', '下午', '以列车转场为主；全车指定席，提前处理购票。'), item('傍晚', '日落前', '京都入住后在三条／河原町散步。'), item('晚上', '晚上', '三条／河原町晚饭。'), item('晚间', '回住宿', '回 Piece Hostel Sanjo。'), item('重点', '交通注意', 'Super Hakuto 全车指定席，建议乘车前 7–21 天主动购买；最终时刻 11 月底复核。')
    ],
    weather: { sun: '按列车计划返京，抵达后轻松逛三条。', rain: '全程以转场与室内街区为主。', snow: '提前到鸟取站，确认 Super Hakuto/JR 运行状态并接受延误余量。' }
  },
  {
    date: '2026-12-15', displayDate: '12/15', weekday: '周二', title: '京都最后完整一天', base: '京都 · Piece Hostel Sanjo', sleep: 'Piece Hostel Sanjo', theme: '市中心 / 购物 / 弹性', risk: 'low', placeIds: ['kyoto'],
    mapLegs: [{ from: 'Kyoto Sanjo Station', to: 'Nishiki Market', label: '三条 → 锦市场' }, { from: 'Nishiki Market', to: 'Kennin-ji Temple', label: '锦市场 → 建仁寺' }],
    intro: { icon: '🛍️', title: '把京都留给最后一段慢逛', text: '锦市场、寺町、新京极和河原町都在步行范围内；晴天去祇园白川，雨雪时安心转入漫画博物馆与购物。' },
    timeline: [
      item('08:00', '起床', '不赶远景点。'), item('09:00', '离开住宿', '从 Piece Hostel Sanjo 步行前往市中心。'), item('全天', '交通', '市内步行与短程公共交通。'), item('09:00', '抵达', '抵达锦市场／寺町一带。'), item('09:00–11:30', '上午', '锦市场 → 寺町 → 新京极。'), item('11:30–13:00', '午餐区域', '河原町／三条。'), item('13:00–16:00', '下午', '晴天：建仁寺 + 祇园白川；雨雪：京都国际漫画博物馆 + 购物。'), item('16:00–19:30', '日落前', '河原町／三条最后购物。'), item('晚上', '晚上', '最后晚餐、整理行李。'), item('晚间', '回住宿', '回 Piece Hostel Sanjo，确认返程行李重量。'), item('重点', '交通注意', '返程可能额外购买 5kg 托运，但当前不能显示为已购买。')
    ],
    weather: { sun: '建仁寺、祇园白川与购物。', rain: '京都国际漫画博物馆、寺町、新京极、室内购物。', snow: '取消景观步行，集中三条／河原町室内购物。' }
  },
  {
    date: '2026-12-16', displayDate: '12/16', weekday: '周三', title: '京都 → KIX → 大连', base: '返程', sleep: '—', theme: '机场 / 离境', risk: 'medium', placeIds: ['kyoto', 'kix'],
    mapLegs: [{ from: 'Kyoto Station', to: 'Kansai International Airport', label: '京都站 → KIX' }],
    intro: { icon: '🧳', title: '返程只追求从容抵达', text: '今天没有临时加点：按目标时间到 KIX T2，完成值机与安检，把所有不确定性交给预留时间。' },
    timeline: [
      item('07:30', '起床', '早餐、最后收拾。'), item('09:45–10:00', '离开住宿', '离开 Piece Hostel Sanjo，前往京都站。'), item('11:00 左右', '交通', '当前参考 HARUKA 京都 → KIX；抵达铁路站后转 T2 免费接驳。'), item('约13:00', '抵达', '目标已抵达 KIX T2，办理值机、托运、安检与出境。'), item('上午', '上午', '预留给京都站、机场铁路和接驳。'), item('中午', '午餐区域', 'KIX T2 安检前后按实际时间。'), item('12:20–12:50', '下午', '当前参考：约 12:20 到机场铁路站，约 12:35–12:50 到 T2。'), item('13:00 前', '日落前', '已完成到达 T2 的目标，不做卡点计划。'), item('16:30', '晚上', '9C6988 起飞，18:15 抵达大连。'), item('返程后', '回住宿', '不适用。'), item('重点', '交通注意', 'KIX 春秋实际航站楼、航班状态与 HARUKA 必须在出发前 24–48 小时复核。')
    ],
    weather: { sun: '按目标 13:00 到 T2。', rain: '预留接驳步行与安检时间。', snow: '提早出发，优先确认 HARUKA 与机场运行状态。' }
  }
];
