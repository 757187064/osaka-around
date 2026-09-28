export const routeSegments = [
  { id: 'kix-kyoto', type: 'main', label: 'KIX → 京都', points: ['kix', 'osaka', 'kyoto'], dates: ['2026-12-02'], googlePoints: ['Kansai International Airport', 'Osaka Station', 'Kyoto Station'] },
  { id: 'kyoto-miyama', type: 'main', label: '京都 → 日吉 → 美山', points: ['kyoto', 'hiyoshi', 'miyama'], dates: ['2026-12-06'], googlePoints: ['Kyoto Station', 'Hiyoshi Station Kyoto', 'Miyama Kayabuki no Sato'] },
  { id: 'miyama-maizuru', type: 'main', label: '美山 → 日吉／绫部 → 东舞鹤', points: ['miyama', 'hiyoshi', 'ayabe', 'maizuru'], dates: ['2026-12-06'], googlePoints: ['Miyama Kayabuki no Sato', 'Hiyoshi Station Kyoto', 'Ayabe Station', 'Higashi-Maizuru Station'] },
  { id: 'maizuru-amanohashidate', type: 'main', label: '东舞鹤 → 西舞鹤 → 天桥立', points: ['maizuru', 'nishi-maizuru', 'amanohashidate'], dates: ['2026-12-07'], googlePoints: ['Higashi-Maizuru Station', 'Nishi-Maizuru Station', 'Amanohashidate Station'] },
  { id: 'amanohashidate-toyooka', type: 'main', label: '天桥立 → 丰冈', points: ['amanohashidate', 'toyooka'], dates: ['2026-12-10'], googlePoints: ['Amanohashidate Station', 'Toyooka Station Hyogo'] },
  { id: 'toyooka-tottori', type: 'main', label: '丰冈 → 山阴海岸 → 鸟取', points: ['toyooka', 'sanin-coast', 'tottori'], dates: ['2026-12-12'], googlePoints: ['Toyooka Station Hyogo', 'Sanin Kaigan Geopark', 'Tottori Station'] },
  { id: 'tottori-kyoto', type: 'main', label: '鸟取 → 智头 → 上郡／姬路走廊 → 大阪 → 京都', points: ['tottori', 'chizu', 'kamigori-himeji', 'osaka', 'kyoto'], dates: ['2026-12-14'], googlePoints: ['Tottori Station', 'Chizu Station', 'Kamigori Station', 'Osaka Station', 'Kyoto Station'] },
  { id: 'kyoto-kix', type: 'main', label: '京都 → KIX', points: ['kyoto', 'osaka', 'kix'], dates: ['2026-12-16'], googlePoints: ['Kyoto Station', 'Osaka Station', 'Kansai International Airport'] },
  { id: 'kyoto-nara', type: 'side', label: '京都 ↔ 奈良', points: ['kyoto', 'nara'], dates: ['2026-12-03'], googlePoints: ['Kyoto Station', 'Kintetsu Nara Station'] },
  { id: 'amanohashidate-ine', type: 'side', label: '天桥立 ↔ 伊根', points: ['amanohashidate', 'ine'], dates: ['2026-12-08'], googlePoints: ['Amanohashidate Station', 'Ine Funaya'] },
  { id: 'toyooka-kinosaki', type: 'side', label: '丰冈 ↔ 城崎温泉', points: ['toyooka', 'kinosaki'], dates: ['2026-12-10', '2026-12-11'], googlePoints: ['Toyooka Station Hyogo', 'Kinosaki Onsen Station'] }
];

export const routeGroups = [
  { id: 'kansai', label: '关西段', segmentIds: ['kix-kyoto', 'kyoto-nara'], googlePoints: ['Kansai International Airport', 'Osaka Station', 'Kyoto Station', 'Kintetsu Nara Station'] },
  { id: 'north-kinki', label: '北近畿段', segmentIds: ['kyoto-miyama', 'miyama-maizuru', 'maizuru-amanohashidate', 'amanohashidate-ine', 'amanohashidate-toyooka'], googlePoints: ['Kyoto Station', 'Hiyoshi Station Kyoto', 'Miyama Kayabuki no Sato', 'Ayabe Station', 'Higashi-Maizuru Station', 'Nishi-Maizuru Station', 'Amanohashidate Station', 'Ine Funaya', 'Toyooka Station Hyogo'] },
  { id: 'sanin', label: '山阴段', segmentIds: ['toyooka-kinosaki', 'toyooka-tottori'], googlePoints: ['Toyooka Station Hyogo', 'Kinosaki Onsen Station', 'Sanin Kaigan Geopark', 'Tottori Station'] },
  { id: 'return', label: '返京段', segmentIds: ['tottori-kyoto', 'kyoto-kix'], googlePoints: ['Tottori Station', 'Chizu Station', 'Kamigori Station', 'Osaka Station', 'Kyoto Station', 'Kansai International Airport'] }
];

export const dayRouteIds = {
  '2026-12-02': ['kix-kyoto'], '2026-12-03': ['kyoto-nara'], '2026-12-04': [], '2026-12-05': [],
  '2026-12-06': ['kyoto-miyama', 'miyama-maizuru'], '2026-12-07': ['maizuru-amanohashidate'],
  '2026-12-08': ['amanohashidate-ine'], '2026-12-09': [], '2026-12-10': ['amanohashidate-toyooka', 'toyooka-kinosaki'],
  '2026-12-11': ['toyooka-kinosaki'], '2026-12-12': ['toyooka-tottori'], '2026-12-13': [],
  '2026-12-14': ['tottori-kyoto'], '2026-12-15': [], '2026-12-16': ['kyoto-kix']
};

export const mainRouteSequence = [
  ['1', 'KIX'], ['2', '京都'], ['3', '美山'], ['4', '东舞鹤'], ['5', '天桥立'], ['6', '丰冈'], ['7', '鸟取'], ['8', '京都'], ['9', 'KIX']
];
