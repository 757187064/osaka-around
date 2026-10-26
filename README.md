# 2026 日本关西—北近畿—山阴 14晚独旅行程控制台

Vanilla HTML/CSS/JavaScript + Vite 的旅行控制台。在线版本可直接访问：

<https://757187064.github.io/osaka-around/>

## 地图与 Google Maps 跳转

- 页面内的固定总览使用 MapLibre GL JS + OpenFreeMap，不使用 Google Maps API，也不会请求 `tile.openstreetmap.org`。
- 四个区域与每日行程均按真实交通段拆成独立的“起点 → 终点”按钮；每次只提交一段给 Google Maps，以便获得公共交通方案，并可在网页或 App 内继续编辑。
- 住宿、景点、车站的 Google Maps 按钮同样只打开普通 Google Maps 搜索页。
- 项目不包含 Google Cloud Billing、API key、Google Maps JavaScript API、Routes API 或 Places API 配置，不会产生 Google Maps Platform 的 API 调用费用。

## 在线发布

推送到 `main` 会由 `.github/workflows/deploy-pages.yml` 自动构建并发布 GitHub Pages。工作流使用 `/osaka-around/` 作为 Vite 资源前缀，不应手动提交 `dist/`。

## macOS 启动

1. 双击 `start.command`。
2. 首次运行会安装依赖，并打开 <http://localhost:5173>。
3. 保持终端窗口开启；按 `Control + C` 停止服务。

若 macOS 阻止双击，在 Terminal 执行：

```bash
cd /Users/sakiko/Downloads/japan_trip_web
chmod +x start.command start.sh
./start.command
```

若没有 Node.js，`start.sh` 会尝试用 Python 提供已经构建好的 `dist/`；首次构建仍需要 Node.js。

## Windows 启动

安装 Node.js LTS 后，在 PowerShell 执行：

```powershell
cd C:\path\to\japan_trip_web
npm install
npm run dev
```

打开 <http://localhost:5173>。生产构建使用 `npm run build`，本地预览使用 `npm run preview`。

## 行程数据在哪里改

- `data/days.js`：每日时间轴、天气 Plan B、地图联动地点，以及每天独立的 Google Maps 起点 → 终点链接。
- `data/stays.js`：已购住宿与入住硬约束。
- `data/transport.js`：交通分类、当前参考状态、JPY 预算。
- `data/routes.js`：主环线交通走廊、三条当天往返与区域分段路线。
- `data/checklist.js`：复核中心与官方入口。
- `data/places.js`：坐标、marker 类型与 Google Maps 搜索名称。

## 图片

`assets/images/` 预留 `kyoto.jpg`、`nara.jpg`、`miyama.jpg`、`maizuru.jpg`、`amanohashidate.jpg`、`ine.jpg`、`kinosaki.jpg`、`tottori.jpg`。没有图片时显示 CSS 占位卡，不会发出缺图请求；要启用图片，在 `data/trip.js` 对应体验项填写 `imagePath`。

## 重要约定

- 已购机票与住宿均为硬约束，页面不会替换或推荐其他住宿。
- 返程额外 5kg 托运行李未确认，绝不显示为已购买。
- 12 月冬季班次不是最终时刻；新增丰乡、出石、岩美与 12/7–12/16 参考交通仍须按复核中心安排确认。
- 进度勾选与手动汇率只保存在当前浏览器的 LocalStorage；“重置进度”需要连续点击两次确认。

## 2026/10/26 攻略补充与核查

- `data/guide.js`：40个游玩条目、15天时段建议、11组地区动漫检索结论、来源及核查状态。
- `data/schedules.js`：纠正后的每日概览时间轴；`data/days.js`保留日期、住宿和天气等基础信息。
- `assets/guide.js`：景点卡、来源、照片署名、动漫卡与交通方案比较。
- `data/photos.json`：审核后的Commons实景图片来源和授权，不以历史照片承诺出行当季景色。
- `node scripts/validate-trip.mjs`：日期/星期连续性、14晚住宿、地点/路线/攻略引用、图片文件与授权完整性检查。

核查不等于访问或确认个人机酒订单。岩美周日巴士及部分JR冬季衔接及未获得报价的交通仍需复核。
预算仅汇总已列交通参考金额，未覆盖全部市内交通、景点门票和餐饮。

应用内已建立两项一次性提醒（北京时间）：11/14 08:50鸟取返程交通比较与预约；11/17 09:50北京→大连K681硬卧购票。
页面的提醒卡是静态记录；实际提醒由Codex应用安排，网页本身不会发送推送，也不会自动同步提醒修改。

本轮重构：机酒保持，奈良日改丰乡，宇治重访，京都北部轻音与鸭川，取消美山串联改铁路舞鹤；出石半日、城崎全天、岩美周日接驳。图卡按具体场景独立配图，不限制同一景点的多角度介绍。
