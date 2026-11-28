# 冬日旅行手帖 · 2026年12月

网页：https://757187064.github.io/osaka-around/

完整交接：[docs/AI-HANDOFF.md](docs/AI-HANDOFF.md)；Android构建：[docs/ANDROID.md](docs/ANDROID.md)。

## 常用命令

```sh
npm ci
npm run dev
node scripts/validate-trip.mjs
npm run build
npm run handoff
npm run android:prepare
npm run android:build
```

- 网页与APK均使用同一组旅行数据和实景图片。
- `npm run handoff`在`dist/handoff/`生成手机阅读入口、完整旅行内容TXT/Markdown、结构化JSON和完整源码目录。主文本只含旅行内容。
- APK包含离线攻略、独立急用页、外部Google Maps和AI翻译入口，以及交接阅读页。标准版不含个人二维码；私人版通过`TRIP_PRIVATE_QR`注入。
- 发布网页由main推送自动完成，Vite基路径为`/osaka-around/`；Android构建基路径为`./`，不可混用。
- 私人二维码、私人APK、签名密钥和原始保单不提交到公开仓库。
- SDK与Java仅为本机工具，不属于源码。APK构建成功和用户Android17实机验证是不同的检查。

## 已确认事项

K681硬卧已买；护照签证、机票姓名、住宿打印、保险、电子签现场展示方式、VJW均已确认。去程8kg随身，回程8kg随身＋5kg托运。

## 当前数据入口

`data/index.js`导出15天14晚主行程；`data/schedules.js`覆盖原始时间轴。餐厅与时段联动由`data/meal-stops.js`和`assets/day-route.js`实现；图片授权在`data/photos.json`。更多文件职责和用户偏好见交接说明。
