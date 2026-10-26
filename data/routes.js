export const routeSegments = [
  {
    "id": "kix-kyoto",
    "type": "main",
    "label": "KIX → 京都",
    "points": [
      "kix",
      "osaka",
      "kyoto"
    ],
    "dates": [
      "2026-12-02"
    ]
  },
  {
    "id": "maizuru-amanohashidate",
    "type": "main",
    "label": "东舞鹤 → 西舞鹤 → 天桥立",
    "points": [
      "maizuru",
      "nishi-maizuru",
      "amanohashidate"
    ],
    "dates": [
      "2026-12-07"
    ]
  },
  {
    "id": "amanohashidate-toyooka",
    "type": "main",
    "label": "天桥立 → 丰冈",
    "points": [
      "amanohashidate",
      "toyooka"
    ],
    "dates": [
      "2026-12-10"
    ]
  },
  {
    "id": "toyooka-tottori",
    "type": "main",
    "label": "丰冈 → 山阴海岸 → 鸟取",
    "points": [
      "toyooka",
      "sanin-coast",
      "tottori"
    ],
    "dates": [
      "2026-12-12"
    ]
  },
  {
    "id": "tottori-kyoto",
    "type": "main",
    "label": "鸟取 → 智头 → 上郡／姬路走廊 → 大阪 → 京都",
    "points": [
      "tottori",
      "chizu",
      "kamigori-himeji",
      "osaka",
      "kyoto"
    ],
    "dates": [
      "2026-12-14"
    ]
  },
  {
    "id": "kyoto-kix",
    "type": "main",
    "label": "京都 → KIX",
    "points": [
      "kyoto",
      "osaka",
      "kix"
    ],
    "dates": [
      "2026-12-16"
    ]
  },
  {
    "id": "amanohashidate-ine",
    "type": "side",
    "label": "天桥立 ↔ 伊根",
    "points": [
      "amanohashidate",
      "ine"
    ],
    "dates": [
      "2026-12-08"
    ]
  },
  {
    "id": "toyooka-kinosaki",
    "type": "side",
    "label": "丰冈 ↔ 城崎温泉",
    "points": [
      "toyooka",
      "kinosaki"
    ],
    "dates": [
      "2026-12-11"
    ]
  },
  {
    "id": "kyoto-maizuru",
    "label": "京都→东舞鹤（铁路）",
    "points": [
      "kyoto",
      "ayabe",
      "maizuru"
    ],
    "dates": [
      "2026-12-06"
    ],
    "type": "main"
  },
  {
    "id": "kyoto-toyosato",
    "label": "京都↔丰乡（经彦根）",
    "points": [
      "kyoto",
      "toyosato"
    ],
    "dates": [
      "2026-12-03"
    ],
    "type": "side"
  },
  {
    "id": "kyoto-uji",
    "label": "京都↔宇治",
    "points": [
      "kyoto",
      "uji"
    ],
    "dates": [
      "2026-12-05"
    ],
    "type": "side"
  },
  {
    "id": "toyooka-izushi",
    "label": "丰冈↔出石（巴士）",
    "points": [
      "toyooka",
      "izushi"
    ],
    "dates": [
      "2026-12-10"
    ],
    "type": "side"
  },
  {
    "id": "tottori-iwami",
    "label": "鸟取↔岩美/浦富（条件支线）",
    "points": [
      "tottori",
      "iwami"
    ],
    "dates": [
      "2026-12-13"
    ],
    "type": "side"
  }
];

export const routeGroups = [
  {
    "id": "kansai",
    "label": "关西巡礼",
    "segmentIds": [
      "kix-kyoto",
      "kyoto-toyosato",
      "kyoto-uji"
    ]
  },
  {
    "id": "north-kinki",
    "label": "北近畿",
    "segmentIds": [
      "kyoto-maizuru",
      "maizuru-amanohashidate",
      "amanohashidate-ine",
      "amanohashidate-toyooka",
      "toyooka-izushi"
    ]
  },
  {
    "id": "sanin",
    "label": "山阴",
    "segmentIds": [
      "toyooka-kinosaki",
      "toyooka-tottori",
      "tottori-iwami"
    ]
  },
  {
    "id": "return",
    "label": "返程",
    "segmentIds": [
      "tottori-kyoto",
      "kyoto-kix"
    ]
  }
];

export const dayRouteIds = {
  "2026-12-02": [
    "kix-kyoto"
  ],
  "2026-12-03": [
    "kyoto-toyosato"
  ],
  "2026-12-04": [],
  "2026-12-05": [
    "kyoto-uji"
  ],
  "2026-12-06": [
    "kyoto-maizuru"
  ],
  "2026-12-07": [
    "maizuru-amanohashidate"
  ],
  "2026-12-08": [
    "amanohashidate-ine"
  ],
  "2026-12-09": [],
  "2026-12-10": [
    "amanohashidate-toyooka",
    "toyooka-izushi"
  ],
  "2026-12-11": [
    "toyooka-kinosaki"
  ],
  "2026-12-12": [
    "toyooka-tottori"
  ],
  "2026-12-13": [
    "tottori-iwami"
  ],
  "2026-12-14": [
    "tottori-kyoto"
  ],
  "2026-12-15": [],
  "2026-12-16": [
    "kyoto-kix"
  ]
};

export const mainRouteSequence = [
  [
    "1",
    "KIX"
  ],
  [
    "2",
    "京都"
  ],
  [
    "3",
    "东舞鹤"
  ],
  [
    "4",
    "天桥立"
  ],
  [
    "5",
    "丰冈"
  ],
  [
    "6",
    "鸟取"
  ],
  [
    "7",
    "京都"
  ],
  [
    "8",
    "KIX"
  ]
];
