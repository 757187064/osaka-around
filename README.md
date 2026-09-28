# 2026 日本关西—北近畿—山阴 14晚独旅行程控制台

Vanilla HTML/CSS/JavaScript + Vite 的旅行控制台。日常使用请通过本地服务器或 GitHub Pages 打开，不以 `file://` 作为正常运行方式。

## 在线访问与自动发布

公开网站：<https://757187064.github.io/osaka-around/>

推送到 `main` 会由 `.github/workflows/deploy-pages.yml` 自动构建并发布 GitHub Pages。工作流会使用 `/osaka-around/` 作为 Vite 资源前缀，因此不应手动把 `dist/` 提交进仓库。

## macOS 启动

1. 双击 `start.command`。
2. 首次运行会安装依赖、生成被忽略的空白 `config.local.js`，并打开 <http://localhost:5173>。
3. 保持终端窗口开启；按 `Control + C` 停止服务。

若 macOS 阻止双击，在 Terminal 执行：

```bash
cd /Users/sakiko/Downloads/japan_trip_web
chmod +x start.command start.sh
./start.command
```

若没有 Node.js，`start.sh` 会尝试用 Python 提供已构建的 `dist/` 版本；首次构建仍需 Node.js。

## Windows 启动

安装 Node.js LTS 后，在 PowerShell 执行：

```powershell
cd C:\path\to\japan_trip_web
npm install
npm run dev
```

打开 <http://localhost:5173>。生产构建使用 `npm run build`，本地预览使用 `npm run preview`。

## Google Maps（可选）

没有 key 时，页面完整使用 MapLibre GL JS + OpenFreeMap；不会请求 `tile.openstreetmap.org`。Google Maps 搜索与分段导航按钮不需要 key。

要启用页面内嵌 Google Maps：

1. 在 Google Cloud 建立项目、关联 Billing，并只启用 **Maps JavaScript API**。
2. 创建浏览器 key，并将 **API 限制**设为 `Maps JavaScript API`。
3. 将 **网站来源限制**设为：
   - `http://localhost:5173/*`
   - `https://757187064.github.io/osaka-around/*`
4. 在本机把 `config.example.js` 复制为 `config.local.js` 并填写 key；该文件已被 Git 忽略：

   ```js
   window.TRIP_CONFIG = {
     googleMapsApiKey: "YOUR_KEY"
   };
   ```

5. 对 GitHub Pages，在仓库 **Settings → Secrets and variables → Actions** 新建 Repository secret：
   `VITE_GOOGLE_MAPS_API_KEY`。下次推送或手动运行 Deploy workflow 后生效。

浏览器地图 key 必然可被客户端读到，因此必须使用来源与 API 限制；不能把 key 写进业务源码。key 缺失、认证失败、超时或不可用时，页面自动回退到 OpenFreeMap，并显示当前提供方。

Google Maps JavaScript API 的正式使用需要 Billing。当前 Dynamic Maps 每月前 10,000 次地图加载免费，之后按用量计费；应在 Google Cloud 设置预算提醒与配额。以 [Google Maps 价格表](https://developers.google.com/maps/billing-and-pricing/pricing) 与 [官方 key 配置说明](https://developers.google.com/maps/documentation/javascript/get-api-key) 为准。本项目不调用 Routes 或 Places API。

## 行程数据在哪里改

- `data/days.js`：每日时间轴、天气 Plan B、地图联动地点。
- `data/stays.js`：已购住宿与入住硬约束。
- `data/transport.js`：交通分类、当前参考状态、JPY 预算。
- `data/routes.js`：主环线交通走廊、三条当天往返、Google Maps 分段路线。
- `data/checklist.js`：复核中心与官方入口。
- `data/places.js`：坐标、marker 类型与 Google Maps 搜索名称。

## 图片

`assets/images/` 预留 `kyoto.jpg`、`nara.jpg`、`miyama.jpg`、`maizuru.jpg`、`amanohashidate.jpg`、`ine.jpg`、`kinosaki.jpg`、`tottori.jpg`。没有图片时显示 CSS 占位卡，不会发出缺图请求；要启用图片，在 `data/trip.js` 对应体验项填写 `imagePath`。

## 重要约定

- 已购机票与住宿均为硬约束，页面不会替换或推荐其他住宿。
- 返程额外 5kg 托运行李未确认，绝不显示为已购买。
- 12 月冬季班次不是最终时刻；美山链路和 12/7–12/16 参考交通仍须按复核中心安排确认。
- 进度勾选与手动汇率只保存在当前浏览器的 LocalStorage；“重置进度”需要连续点击两次确认。
