import {correctedSchedules} from './schedules.js';
const dayDetails=[
  {
    "date": "2026-12-02",
    "displayDate": "12/2",
    "weekday": "周三",
    "title": "抵达日本｜KIX → 京都",
    "base": "京都 · Kyoto Guesthouse HIVE",
    "sleep": "Kyoto Guesthouse HIVE",
    "theme": "抵达 / 适应",
    "risk": "medium",
    "placeIds": [
      "kix",
      "kyoto"
    ],
    "mapLegs": [
      {
        "from": "Kansai International Airport",
        "to": "Kyoto Station",
        "label": "KIX → 京都站"
      }
    ],
    "intro": {
      "icon": "✈️",
      "title": "把抵达留给节奏，不留给赶路",
      "text": "第一天的重点不是打卡，而是顺利穿过入境、机场接驳与 HARUKA，把京都的第一晚安稳地接住。"
    },
    "weather": {
      "sun": "按抵达节奏转场即可。",
      "rain": "机场与铁路优先，不增加室外安排。",
      "snow": "确认机场铁路与 T2 接驳状态，必要时告知旅舍晚到。"
    }
  },
  {
    "date": "2026-12-03",
    "displayDate": "12/3",
    "weekday": "周四",
    "title": "丰乡｜轻音旧校舍一日",
    "base": "京都 · Kyoto Guesthouse HIVE",
    "sleep": "Kyoto Guesthouse HIVE",
    "theme": "京阿尼巡礼",
    "risk": "medium",
    "placeIds": [
      "kyoto",
      "toyosato"
    ],
    "mapLegs": [
      {
        "to": "Toyosato Elementary School",
        "label": "丰乡｜轻音旧校舍一日",
        "from": "Kyoto Station"
      }
    ],
    "intro": {
      "icon": "🎬",
      "title": "丰乡轻音专程日｜替换原奈良日，京都住宿不变",
      "text": "把完整一天给丰乡旧校舍：校舍外观、楼梯和公开室内空间分别慢看。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-04",
    "displayDate": "12/4",
    "weekday": "周五",
    "title": "京都北部｜轻音与玉子市场",
    "base": "京都 · Kyoto Guesthouse HIVE",
    "sleep": "Kyoto Guesthouse HIVE",
    "theme": "京阿尼巡礼",
    "risk": "medium",
    "placeIds": [
      "kyoto"
    ],
    "mapLegs": [
      {
        "to": "Demachiyanagi Station",
        "label": "京都北部｜轻音与玉子市场",
        "from": "Shugakuin Station"
      }
    ],
    "intro": {
      "icon": "🎬",
      "title": "京都北部｜轻音片头＋玉子市场＋两段不同的鸭川",
      "text": "上午沿轻音的日常通学线走，下午接出町商店街、糺之森与市中心河畔。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-05",
    "displayDate": "12/5",
    "weekday": "周六",
    "title": "宇治重访｜上低音号与大吉山",
    "base": "京都 · Kyoto Guesthouse HIVE",
    "sleep": "Kyoto Guesthouse HIVE",
    "theme": "京阿尼巡礼",
    "risk": "medium",
    "placeIds": [
      "kyoto",
      "uji"
    ],
    "mapLegs": [
      {
        "to": "Keihan Uji Station",
        "label": "宇治重访｜上低音号与大吉山",
        "from": "Sanjo Station Kyoto"
      }
    ],
    "intro": {
      "icon": "🎬",
      "title": "宇治重访｜上低音号河畔线＋白天大吉山，不重刷平等院",
      "text": "这次重访以河畔和作品记忆为主，午后白天登大吉山，给抹茶休息留时间。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-06",
    "displayDate": "12/6",
    "weekday": "周日",
    "title": "京都晨游→东舞鹤红砖港区",
    "base": "东舞鹤 · GATEWAY MAIZURU",
    "sleep": "GATEWAY MAIZURU",
    "theme": "地方散步 / 铁路转场",
    "risk": "medium",
    "placeIds": [
      "kyoto",
      "maizuru"
    ],
    "mapLegs": [
      {
        "to": "Higashi-Maizuru Station",
        "label": "京都晨游→东舞鹤红砖港区",
        "from": "Kyoto Station"
      }
    ],
    "intro": {
      "icon": "🚆",
      "title": "美山已从主线移除｜京都上午水路阁，下午直接铁路到东舞鹤",
      "text": "上午水路阁，午后铁路转场；当天不再绕进山村等巴士。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-07",
    "displayDate": "12/7",
    "weekday": "周一",
    "title": "西舞鹤→天桥立｜17点前入住",
    "base": "天桥立 · Auberge Amanohashidate",
    "sleep": "Auberge Amanohashidate",
    "theme": "地方散步 / 铁路转场",
    "risk": "medium",
    "placeIds": [
      "amanohashidate"
    ],
    "mapLegs": [
      {
        "to": "Amanohashidate Station",
        "label": "西舞鹤→天桥立｜17点前入住",
        "from": "Higashi-Maizuru Station"
      }
    ],
    "intro": {
      "icon": "🚆",
      "title": "西舞鹤城迹＋海鲜午饭，再去天桥立",
      "text": "西舞鹤看城迹、吃海鲜，下午抵天桥立，把入住截止放在首位。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-08",
    "displayDate": "12/8",
    "weekday": "周二",
    "title": "伊根一日游",
    "base": "天桥立 · Auberge Amanohashidate",
    "sleep": "Auberge Amanohashidate",
    "theme": "舟屋 / 海湾 / 慢旅行",
    "risk": "medium",
    "placeIds": [
      "amanohashidate",
      "ine"
    ],
    "mapLegs": [
      {
        "from": "Amanohashidate Station",
        "to": "Ine Funaya",
        "label": "天桥立 → 伊根"
      },
      {
        "from": "Ine Funaya",
        "to": "Amanohashidate Station",
        "label": "伊根 → 天桥立"
      }
    ],
    "intro": {
      "icon": "🚤",
      "title": "舟屋沿着伊根湾展开",
      "text": "伊根的魅力在于海湾、舟屋与慢节奏；游船只在海况合适时加入，不把它变成必须完成的任务。"
    },
    "weather": {
      "sun": "舟屋、游船与高处景观择体力完成。",
      "rain": "保留舟屋街区与午餐，取消游船和长距离步行。",
      "snow": "优先按巴士是否运行决定；不安全时回天桥立安排大浴场与休息。"
    }
  },
  {
    "date": "2026-12-09",
    "displayDate": "12/9",
    "weekday": "周三",
    "title": "天桥立完整日",
    "base": "天桥立 · Auberge Amanohashidate",
    "sleep": "Auberge Amanohashidate",
    "theme": "双侧展望 / 沙洲 / 神社",
    "risk": "low",
    "placeIds": [
      "amanohashidate"
    ],
    "mapLegs": [
      {
        "from": "Amanohashidate Station",
        "to": "Amanohashidate View Land",
        "label": "天桥立站 → View Land"
      },
      {
        "from": "Amanohashidate View Land",
        "to": "Motoise Kono Shrine",
        "label": "View Land → 笼神社"
      }
    ],
    "intro": {
      "icon": "🌉",
      "title": "从飞龙观看一条横卧海面的松林",
      "text": "今天没有跨城移动，可以把天桥立的南北两侧、沙洲、自行车和神社按当天风力与体力自由取舍。"
    },
    "weather": {
      "sun": "完整走双侧展望与沙洲。",
      "rain": "缩短骑行，保留智恩寺、笼神社和室内休息。",
      "snow": "避开展望台与海边长距离步行，以住宿周边为主。"
    }
  },
  {
    "date": "2026-12-10",
    "displayDate": "12/10",
    "weekday": "周四",
    "title": "天桥立→丰冈｜出石半日",
    "base": "丰冈 · Hostel Act",
    "sleep": "Toyooka Guesthouse Hostel Act",
    "theme": "地方散步 / 铁路转场",
    "risk": "medium",
    "placeIds": [
      "toyooka",
      "izushi"
    ],
    "mapLegs": [
      {
        "to": "Izushi Hyogo",
        "label": "天桥立→丰冈｜出石半日",
        "from": "Amanohashidate Station"
      }
    ],
    "intro": {
      "icon": "🚆",
      "title": "早转丰冈，下午出石城下町｜替换重复去城崎的一晚",
      "text": "用城下町和皿荞麦替换重复温泉夜；早转场成功才执行出石支线。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-11",
    "displayDate": "12/11",
    "weekday": "周五",
    "title": "完整城崎温泉日",
    "base": "丰冈 · Hostel Act",
    "sleep": "Toyooka Guesthouse Hostel Act",
    "theme": "外汤 / 缆车 / 慢泡",
    "risk": "medium",
    "placeIds": [
      "toyooka",
      "kinosaki"
    ],
    "mapLegs": [
      {
        "from": "Toyooka Station Hyogo",
        "to": "Kinosaki Onsen Station",
        "label": "丰冈 → 城崎温泉"
      },
      {
        "from": "Kinosaki Onsen Station",
        "to": "Toyooka Station Hyogo",
        "label": "城崎温泉 → 丰冈"
      }
    ],
    "intro": {
      "icon": "🛁",
      "title": "上午寺院，下午两汤；白天河畔与夜景分别停留",
      "text": "上午寺院、午后两汤，穿插咖啡休息，分别感受白天与夜间温泉街。"
    },
    "weather": {
      "sun": "温泉寺、缆车、外汤与夜景。",
      "rain": "减少缆车，增加外汤、咖啡与街区停留。",
      "snow": "避开山坡缆车，确认夜间 JR 后提早回丰冈。"
    }
  },
  {
    "date": "2026-12-12",
    "displayDate": "12/12",
    "weekday": "周六",
    "title": "丰冈→鸟取｜城迹或室内替换",
    "base": "鸟取 · Drop Inn Tottori",
    "sleep": "Drop Inn Tottori",
    "theme": "地方散步 / 铁路转场",
    "risk": "medium",
    "placeIds": [
      "tottori"
    ],
    "mapLegs": [
      {
        "to": "Tottori Station",
        "label": "丰冈→鸟取｜城迹或室内替换",
        "from": "Toyooka Station"
      }
    ],
    "intro": {
      "icon": "🚆",
      "title": "丰冈→鸟取，下午只选一个市内主题",
      "text": "山阴铁路转场后轻松游鸟取市内，城迹、玩具馆、柯南机场只选一个主题。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-13",
    "displayDate": "12/13",
    "weekday": "周日",
    "title": "岩美Free!巡礼＋砂丘取舍",
    "base": "鸟取 · Drop Inn Tottori",
    "sleep": "Drop Inn Tottori",
    "theme": "京阿尼巡礼",
    "risk": "medium",
    "placeIds": [
      "tottori",
      "iwami"
    ],
    "mapLegs": [
      {
        "to": "Iwami Station",
        "label": "岩美Free!巡礼＋砂丘取舍",
        "from": "Tottori Station"
      }
    ],
    "intro": {
      "icon": "🎬",
      "title": "京阿尼优先：上午Free!浦富一片区，下午砂丘/砂雕择体力",
      "text": "Free!浦富片区优先，按周日公交返回；下午视天气和衔接决定砂丘与砂雕。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-14",
    "displayDate": "12/14",
    "weekday": "周一",
    "title": "鸟取 → 京都",
    "base": "京都 · Piece Hostel Sanjo",
    "sleep": "Piece Hostel Sanjo",
    "theme": "指定席 / 京都收尾",
    "risk": "medium",
    "placeIds": [
      "tottori",
      "chizu",
      "kamigori-himeji",
      "kyoto"
    ],
    "mapLegs": [
      {
        "from": "Tottori Station",
        "to": "Osaka Station",
        "label": "鸟取 → 大阪"
      },
      {
        "from": "Osaka Station",
        "to": "Kyoto Station",
        "label": "大阪 → 京都"
      }
    ],
    "intro": {
      "icon": "🎟️",
      "title": "带着指定席回到京都",
      "text": "这天的主角是 Super Hakuto 与返京衔接；预留转乘时间，抵达三条后只安排轻松的晚餐和散步。"
    },
    "weather": {
      "sun": "按列车计划返京，抵达后轻松逛三条。",
      "rain": "全程以转场与室内街区为主。",
      "snow": "提前到鸟取站，确认 Super Hakuto/JR 运行状态并接受延误余量。"
    }
  },
  {
    "date": "2026-12-15",
    "displayDate": "12/15",
    "weekday": "周二",
    "title": "岚山轻音修学旅行＋三条乐器店",
    "base": "京都 · Piece Hostel Sanjo",
    "sleep": "Piece Hostel Sanjo",
    "theme": "京阿尼巡礼",
    "risk": "medium",
    "placeIds": [
      "kyoto"
    ],
    "mapLegs": [
      {
        "to": "Arashiyama Kyoto",
        "label": "岚山轻音修学旅行＋三条乐器店",
        "from": "Sanjo Station Kyoto"
      }
    ],
    "intro": {
      "icon": "🎬",
      "title": "岚山轻音修学旅行半日＋JEUGIA与三条收尾",
      "text": "上午岚山修学旅行主题，下午三条JEUGIA和最后购物，晚上整理行李。"
    },
    "weather": {
      "sun": "按下方时段游玩；交通时刻仍以下单与运营方为准。",
      "rain": "缩短户外，按下方室内/替换方案取舍，不叠加所有备选。",
      "snow": "先查铁路、巴士和步道路况；停运或结冰则取消支线，优先回住宿城市。"
    }
  },
  {
    "date": "2026-12-16",
    "displayDate": "12/16",
    "weekday": "周三",
    "title": "京都 → KIX → 大连",
    "base": "返程",
    "sleep": "—",
    "theme": "机场 / 离境",
    "risk": "medium",
    "placeIds": [
      "kyoto",
      "kix"
    ],
    "mapLegs": [
      {
        "from": "Kyoto Station",
        "to": "Kansai International Airport",
        "label": "京都站 → KIX"
      }
    ],
    "intro": {
      "icon": "🧳",
      "title": "返程只追求从容抵达",
      "text": "今天没有临时加点：按目标时间到 KIX T2，完成值机与安检，把所有不确定性交给预留时间。"
    },
    "weather": {
      "sun": "按目标 13:00 到 T2。",
      "rain": "预留接驳步行与安检时间。",
      "snow": "提早出发，优先确认 HARUKA 与机场运行状态。"
    }
  }
];
export const days=dayDetails.map(d=>({...d,timeline:correctedSchedules[d.date]}));
