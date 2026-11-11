// Time slots connect the existing restaurant research to the daily route.
export const mealStops = {
 '2026-12-02': [
  {time:'19:30–20:00',label:'晚餐',name:'HIVE 周边简餐',query:'Kyoto Guesthouse HIVE 近く 食堂',note:'入住后步行吃饭，顺便买次日早餐。'}
 ],
 '2026-12-03': [
  {time:'12:00–13:15',label:'午餐',id:'tamaya',origin:'豊郷小学校旧校舎群',note:'12:00离校，步行15–20分钟；12:30未入座改饭团，13:15回校舍。'},
  {time:'18:00–19:00',label:'晚餐',name:'HIVE 周边定食',query:'Kyoto Guesthouse HIVE 近く 定食',note:'回京都入住区后用餐。'}
 ],
 '2026-12-04': [
  {time:'11:30–12:20',label:'午餐',name:'出町桝形商店街简餐',query:'出町桝形商店街 食堂',origin:'鴨川デルタ',note:'三角洲步行至商店街，饭后直接逛《玉子市场》取景点。',alternative:'okuda'},
  {time:'18:30–19:30',label:'晚餐',name:'HIVE 周边定食',query:'Kyoto Guesthouse HIVE 近く 定食',note:'晚饭后洗衣、补给。'}
 ],
 '2026-12-05': [
  {time:'11:50–12:20',label:'午餐',id:'saizeriya',origin:'宇治上神社',note:'11:30离开神社跨河，步行约20分钟；12:00未入座换便餐。12:20离店，留30分钟回登山口。'},
  {time:'18:00–19:00',label:'晚餐',name:'HIVE 周边简餐',query:'Kyoto Guesthouse HIVE 近く 食堂',note:'回京都后用餐，整理次日转场行李。'}
 ],
 '2026-12-06': [
  {time:'11:00–11:40',label:'午餐',id:'asahi',origin:'京都駅',note:'京都站取行李时用餐。距所选列车不足60分钟就用站内便当。'},
  {time:'18:30–19:30',label:'晚餐',id:'himiko',origin:'GATEWAY MAIZURU',note:'入住后在东舞鹤用餐；等位上限20分钟。'}
 ],
 '2026-12-07': [
  {time:'10:45–11:30',label:'早午餐',name:'舞鹤港海鲜市场',query:'舞鶴港とれとれセンター',origin:'田辺城跡',note:'海鲜饭预算1,800日元。12:00左右离开市场返回西舞鹤，14:15前到丹铁站区。'},
  {time:'17:30–18:30',label:'晚餐',name:'天桥立站前简餐',query:'天橋立駅 食堂',note:'先完成17:00前入住，再在站前步行圈吃饭。'}
 ],
 '2026-12-08': [
  {time:'11:30–12:15',label:'午餐',id:'wadatsumi',origin:'伊根浦公園',note:'舟屋日和内，中心街步行10–15分钟。11:45未入座换便餐，15:30前到返程站牌。'},
  {time:'17:30–18:30',label:'晚餐',name:'天桥立站前简餐',query:'天橋立駅 食堂',note:'16:33抵达天桥立后回酒店，再步行吃晚饭。'}
 ],
 '2026-12-09': [
  {time:'11:15–12:00',label:'午餐',name:'府中／笼神社周边简餐',query:'籠神社 周辺 食堂',origin:'天橋立 府中',note:'穿过沙洲后在北侧吃饭，饭后去笼神社。',alternative:'hashidate'},
  {time:'17:00–18:00',label:'晚餐',name:'天桥立站前简餐',query:'天橋立駅 食堂',note:'返回南侧还车后早吃晚饭。'}
 ],
 '2026-12-10': [
  {time:'13:30–14:15',label:'午餐',id:'kinmata',origin:'出石 バス停 全但バス',note:'到出石后先吃荞麦，再逛辰鼓楼。等位超过20分钟换附近店；13:00后才到丰冈则留在站前用餐。'},
  {time:'18:00–19:00',label:'晚餐',id:'oishiya',origin:'Toyooka Guesthouse Hostel Act',note:'回丰冈入住后到站前用餐，步行约3–5分钟。'}
 ],
 '2026-12-11': [
  {time:'11:30–12:15',label:'午餐',id:'okesho',origin:'城崎温泉ロープウェイ',note:'从缆车山脚沿温泉街走向车站用餐，12:00未入座换简餐，12:45去御所之汤。'},
  {time:'18:00–18:30',label:'晚餐',name:'城崎温泉站前简餐',query:'城崎温泉駅 食堂',note:'距JR发车45分钟结束用餐；降雪时提前回丰冈吃饭。'}
 ],
 '2026-12-12': [
  {time:'12:00–13:00',label:'午餐',name:'山阴本线转车便餐',query:'豊岡駅 弁当',note:'出发前在丰冈站买便当和水，换乘途中吃饭。'},
  {time:'18:00–19:00',label:'晚餐',name:'鸟取站周边定食',query:'鳥取駅 定食',note:'入住后在站前步行圈用餐。ベニ屋17:45结束营业，另作早到备选。',alternative:'beniya'}
 ],
 '2026-12-13': [
  {time:'12:45–13:15',label:'午餐',id:'beniya',origin:'鳥取駅',note:'浦富12:01巴士→岩美12:10，接12:20参考JR回鸟取。13:15未吃上饭改便餐，随后乘砂丘线。'},
  {time:'18:00–19:00',label:'晚餐',name:'鸟取站周边定食',query:'鳥取駅 定食',note:'砂丘返回鸟取站后用餐。'}
 ],
 '2026-12-14': [
  {time:'11:30–12:30',label:'午餐',id:'takumi',origin:'Drop Inn Tottori',note:'站前步行4分钟。12:00未入座换简餐，13:00前吃完，13:30–13:45取行李进站。'},
  {time:'18:30–19:30',label:'晚餐',name:'三条／寺町周边定食',query:'Piece Hostel Sanjo 近く 定食',note:'到京都入住后用餐，再逛寺町和新京极。'}
 ],
 '2026-12-15': [
  {time:'12:00–13:00',label:'午餐',id:'shinodaya',origin:'三条京阪駅',note:'岚山回市中心后用餐。14:00前到店，饭后去JEUGIA三条本店。'},
  {time:'18:00–19:00',label:'晚餐',name:'三条／寺町周边定食',query:'Piece Hostel Sanjo 近く 定食',note:'购物结束后用餐，回住宿整理行李。'}
 ],
 '2026-12-16': [
  {time:'13:30–14:15',label:'午餐',name:'关西机场 T2 餐饮区',query:'関西国際空港 第2ターミナル レストラン',note:'到航站楼办妥值机后用餐。16:30日本时间起飞。'},
  {time:'19:00–20:00 中国时间',label:'晚餐',name:'大连机场餐饮区',query:'大连周水子国际机场 餐厅',note:'18:15中国时间抵达，入境后用餐。'}
 ]
};
