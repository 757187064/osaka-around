export const places = [
  { id: 'kix', name: '关西国际机场 KIX', query: 'Kansai International Airport', lat: 34.4342, lng: 135.2441, kind: 'airport', dates: ['2026-12-02', '2026-12-16'], sequence: [1, 9] },
  { id: 'osaka', name: '大阪方向', query: 'Osaka Station', lat: 34.7025, lng: 135.4959, kind: 'corridor', dates: [], sequence: [] },
  { id: 'kyoto', name: '京都', query: 'Kyoto Station', lat: 34.9858, lng: 135.7588, kind: 'stay', dates: ['2026-12-02', '2026-12-03', '2026-12-04', '2026-12-05', '2026-12-06', '2026-12-14', '2026-12-15', '2026-12-16'], sequence: [2, 8] },
  { id: 'nara', name: '奈良', query: 'Kintetsu Nara Station', lat: 34.6824, lng: 135.8281, kind: 'sight', dates: ['2026-12-03'], sequence: [] },
  { id: 'hiyoshi', name: '日吉站', query: 'Hiyoshi Station Kyoto', lat: 35.1555, lng: 135.5278, kind: 'rail', dates: ['2026-12-06'], sequence: [] },
  { id: 'miyama', name: '美山茅葺之里', query: 'Miyama Kayabuki no Sato', lat: 35.3112, lng: 135.6201, kind: 'sight', dates: ['2026-12-06'], sequence: [3] },
  { id: 'ayabe', name: '绫部站', query: 'Ayabe Station', lat: 35.3044, lng: 135.2558, kind: 'rail', dates: ['2026-12-06'], sequence: [] },
  { id: 'maizuru', name: '东舞鹤', query: 'Higashi-Maizuru Station', lat: 35.4656, lng: 135.3945, kind: 'stay', dates: ['2026-12-06', '2026-12-07'], sequence: [4] },
  { id: 'nishi-maizuru', name: '西舞鹤站', query: 'Nishi-Maizuru Station', lat: 35.4423, lng: 135.3276, kind: 'rail', dates: ['2026-12-07'], sequence: [] },
  { id: 'amanohashidate', name: '天桥立', query: 'Amanohashidate Station', lat: 35.5550, lng: 135.1940, kind: 'stay', dates: ['2026-12-07', '2026-12-08', '2026-12-09', '2026-12-10'], sequence: [5] },
  { id: 'ine', name: '伊根', query: 'Ine Funaya', lat: 35.6752, lng: 135.2875, kind: 'sight', dates: ['2026-12-08'], sequence: [] },
  { id: 'toyooka', name: '丰冈', query: 'Toyooka Station Hyogo', lat: 35.5447, lng: 134.8207, kind: 'stay', dates: ['2026-12-10', '2026-12-11', '2026-12-12'], sequence: [6] },
  { id: 'kinosaki', name: '城崎温泉', query: 'Kinosaki Onsen Station', lat: 35.6254, lng: 134.8112, kind: 'onsen', dates: ['2026-12-10', '2026-12-11'], sequence: [] },
  { id: 'sanin-coast', name: '山阴海岸交通走廊', query: 'Sanin Kaigan Geopark', lat: 35.5904, lng: 134.5840, kind: 'corridor', dates: ['2026-12-12'], sequence: [] },
  { id: 'tottori', name: '鸟取', query: 'Tottori Station', lat: 35.4938, lng: 134.2258, kind: 'stay', dates: ['2026-12-12', '2026-12-13', '2026-12-14'], sequence: [7] },
  { id: 'chizu', name: '智头', query: 'Chizu Station', lat: 35.2658, lng: 134.2257, kind: 'rail', dates: ['2026-12-14'], sequence: [] },
  { id: 'kamigori-himeji', name: '上郡／姬路铁路走廊', query: 'Kamigori Station', lat: 34.8655, lng: 134.3561, kind: 'rail', dates: ['2026-12-14'], sequence: [] }
];

export const placesById = Object.fromEntries(places.map((place) => [place.id, place]));
