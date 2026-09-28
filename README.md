# 2026 日本关西—北近畿—山阴 14晚独旅行程控制台

Vanilla HTML/CSS/JavaScript + Vite 的旅行控制台。在线版本可直接访问：

<https://757187064.github.io/osaka-around/>

## 地图与 Google Maps 跳转

- 页面内的固定总览使用 MapLibre GL JS + OpenFreeMap，不使用 Google Maps API，也不会请求 `tile.openstreetmap.org`。
- 关西段、北近畿段、山阴段、返京段各有一条固定路线按钮。点击后会在用户当前的 Google Maps 网页或 App 打开，可自行编辑起终点、途经点和交通方式。
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

- `data/days.js`：每日时间轴、天气 Plan B、地图联动地点。
- `data/stays.js`：已购住宿与入住硬约束。
- `data/transport.js`：交通分类、当前参考状态、JPY 预算。
- `data/routes.js`：主环线交通走廊、三条当天往返、四个 Google Maps 固定路线。
- `data/checklist.js`：复核中心与官方入口。
- `data/places.js`：坐标、marker 类型与 Google Maps 搜索名称。

## 图片

`assets/images/` 预留 `kyoto.jpg`、`nara.jpg`、`miyama.jpg`、`maizuru.jpg`、`amanohashidate.jpg`、`ine.jpg`、`kinosaki.jpg`、`tottori.jpg`。没有图片时显示 CSS 占位卡，不会发出缺图请求；要启用图片，在 `data/trip.js` 对应体验项填写 `imagePath`。

## 重要约定

- 已购机票与住宿均为硬约束，页面不会替换或推荐其他住宿。
- 返程额外 5kg 托运行李未确认，绝不显示为已购买。
- 12 月冬季班次不是最终时刻；美山链路和 12/7–12/16 参考交通仍须按复核中心安排确认。
- 进度勾选与手动汇率只保存在当前浏览器的 LocalStorage；“重置进度”需要连续点击两次确认。
