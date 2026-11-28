import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import * as main from '../data/index.js';
import {dailyGuides,sightsById,animePlaces,sources} from '../data/guide.js';
import {restaurants,dailyMeals} from '../data/food.js';
import {mealStops} from '../data/meal-stops.js';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={id:'编号',name:'名称',date:'日期',dates:'日期',time:'时间',label:'项目',text:'内容',note:'说明',notes:'说明',query:'Google Maps检索词',address:'地址',city:'地区',route:'区间',from:'起点',to:'终点',price:'价格（日元）',priceNote:'价格依据',dish:'推荐食物',access:'到达方式',when:'适合安排',cutoff:'时间限制',hours:'营业信息',fallback:'替代',source:'来源',sourceLabel:'来源名称',rating:'评分',ratingNote:'评分依据',status:'状态',amountRmb:'人民币金额',nights:'晚数',type:'类别',priority:'优先级',how:'怎么走',why:'看点',practical:'实用信息',duration:'用时',budgetJPY:'预算（日元）',cost:'餐费预算',priceJPY:'日元价格',url:'链接',refs:'来源编号',flight:'航班号',airline:'航空公司',arrivalNote:'晚到说明',title:'标题',subtitle:'副标题',origin:'起点',destination:'终点',mode:'方式',checkedOn:'核查日期'};
function human(value,depth=0){
 if(value==null)return '';
 if(typeof value!=='object')return String(value);
 if(Array.isArray(value))return value.map((v,i)=>typeof v==='object'?`${' '.repeat(depth)}${i+1}. ${human(v,depth+2)}`:String(v)).join('\n');
 return Object.entries(value).filter(([,v])=>typeof v!=='function').map(([k,v])=>`${' '.repeat(depth)}${labels[k]||k}：${typeof v==='object'?'\n'+human(v,depth+2):String(v)}`).join('\n');
}
function markdownHtml(md){
 return md.split(/\n/).map(line=>{
  const match=line.match(/^(#{1,4}) (.*)/);
  if(match)return `<h${match[1].length}>${esc(match[2])}</h${match[1].length}>`;
  if(!line.trim())return '<div class="gap"></div>';
  return `<div class="line">${esc(line)}</div>`;
 }).join('');
}
function bindHandoffReader(){
 const text=document.getElementById('travel-text'),original=text.textContent;
 document.getElementById('copy').onclick=async()=>{
  try{await navigator.clipboard.writeText(original);document.getElementById('status').textContent='已复制';}
  catch{const range=document.createRange();range.selectNodeContents(text);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);document.getElementById('status').textContent='已选中，长按复制';}
 };
 document.getElementById('search').oninput=event=>{
  const q=event.target.value.trim();if(!q){text.textContent=original;return;}
  const lines=original.split('\n'),hits=new Set();
  lines.forEach((line,i)=>{if(line.toLowerCase().includes(q.toLowerCase()))for(let j=Math.max(0,i-2);j<=Math.min(lines.length-1,i+5);j++)hits.add(j);});
  text.textContent=hits.size?[...hits].sort((a,b)=>a-b).map(i=>lines[i]).join('\n'):'没有找到相关内容';
 };
}
export async function exportHandoff(output=path.join(repo,'dist/handoff')){
 output=path.resolve(output);fs.mkdirSync(output,{recursive:true});
 const modules={};
 for(const name of fs.readdirSync(path.join(repo,'data')).filter(n=>n.endsWith('.js')).sort()){
  modules[name]=JSON.parse(JSON.stringify(await import(pathToFileURL(path.join(repo,'data',name)))));
 }
 const jsonData=Object.fromEntries(fs.readdirSync(path.join(repo,'data')).filter(n=>n.endsWith('.json')).map(n=>[n,JSON.parse(fs.readFileSync(path.join(repo,'data',n),'utf8'))]));
 const bundle={jsonData,exportedAt:'2026-11-28',timezones:{china:'Asia/Shanghai',japan:'Asia/Tokyo'},authoritativeCurrentData:main,modules,photos:JSON.parse(fs.readFileSync(path.join(repo,'data/photos.json'),'utf8'))};
 const handoff=fs.readFileSync(path.join(repo,'docs/AI-HANDOFF.md'),'utf8');
 const preferences=handoff.slice(handoff.indexOf('## 用户要求'),handoff.indexOf('## 文件职责'));
 let content='# 日本旅行：完整内容与AI接手资料\n\n资料整理：2026-11-28。供AI直接理解旅行内容、延续安排和回答旅途中问题。日本当地时间与中国时间分开标注；参考班次、评分、营业时间保留原有核查日期。\n\n'+preferences+'\n\n## 航班详情\n\n'+human(main.trip.flights)+'\n\n## 住宿详情\n\n'+human(main.stays)+'\n\n## 每日完整时间轴、景点和餐厅\n';
 for(const day of main.days){
  content+=`\n### ${day.date} ${day.title||day.city||''}\n\n${human(day)}\n\n当天景点安排：\n`;
  for(const stop of dailyGuides[day.date]?.stops||[])content+=human({...sightsById[stop.id],...stop})+'\n\n';
  content+='当天餐饮安排：\n'+human(mealStops[day.date]||[])+'\n\n当天餐费预算：\n'+human(dailyMeals[day.date]||{})+'\n';
 }
 content+='\n## 全部景点与备选（完整保留）\n\n'+human(sightsById)+'\n\n## 全部餐厅（完整保留）\n\n'+human(restaurants)+'\n\n## 动漫与打卡点\n\n'+human(animePlaces)+'\n\n## 交通购买与预算\n\n'+human(main.transport)+'\n\n## 地点地址、坐标与地图检索词\n\n'+human(main.places)+'\n\n## 来源目录\n\n'+human(sources)+'\n\n## 其余完整旅行内容（准备、保险、路线及图片授权）\n';
 for(const [name,data] of Object.entries(modules)){
  if(['index.js','days.js','food.js','guide.js','places.js','stays.js','transport.js'].includes(name))continue;
  content+='\n### '+name.replace('.js','')+'\n\n'+human(data)+'\n';
 }
 content+='\n## 餐厅Google Maps评分记录、地区特色与筛选取舍\n\n'+human(jsonData['food-map-evidence.json'])+'\n\n'+human(modules['food.js'].foodRegions)+'\n\n'+human(modules['food.js'].omittedFood)+'\n\n## 沿途地区比较与已保留的选择\n\n'+human(modules['guide.js'].regionalChoices)+'\n';
 content+='\n## 最近一次天气查询记录\n\n'+human(jsonData['weather-snapshot.json'])+'\n';
 content+='\n## 全部图片及摄影授权\n\n'+human(bundle.photos)+'\n';
 fs.writeFileSync(path.join(output,'完整旅行内容.md'),content);
 fs.writeFileSync(path.join(output,'完整旅行内容.txt'),content);
 fs.writeFileSync(path.join(output,'行程数据.json'),JSON.stringify(bundle,null,2));
 fs.copyFileSync(path.join(repo,'docs/AI-HANDOFF.md'),path.join(output,'工程接手说明.md'));
 const candidates=execFileSync('git',['ls-files','-co','--exclude-standard','-z'],{cwd:repo}).toString().split('\0').filter(Boolean);
 const files=[...new Set(candidates)].filter(file=>!file.startsWith('artifacts/')&&!file.startsWith('dist/')&&!file.startsWith('node_modules/')&&fs.statSync(path.join(repo,file)).isFile()).sort();
 const entries=[];
 for(const file of files){
  const src=path.join(repo,file),dest=path.join(output,'source',file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);
  const bytes=fs.readFileSync(src);entries.push({path:'source/'+file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 const links=entries.map(e=>`<li><a href="${e.path.split('/').map(encodeURIComponent).join('/')}">${esc(e.path.slice(7))}</a> <small>${(e.bytes/1024).toFixed(1)}KB</small></li>`).join('');
 const intro=preferences.slice(0,preferences.indexOf('## 日期、酒店'));
 const page=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>日本旅行 · 内容与完整工程交接</title><style>*{box-sizing:border-box}body{font:17px/1.8 system-ui,-apple-system,"PingFang SC",sans-serif;margin:0;background:#f3f6f9;color:#1b3043}main{max-width:940px;padding:24px 17px 70px;margin:auto}h1{font-size:28px;line-height:1.4}h2{font-size:22px;margin:25px 0 12px}h3{font-size:19px}a{color:#125d8f;overflow-wrap:anywhere}nav{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:20px}nav a,.download{display:inline-block;border:1px solid #bbcdd9;background:white;border-radius:8px;padding:9px 14px;text-decoration:none;min-height:44px}details{background:white;border:1px solid #d1dce5;border-radius:9px;padding:16px;margin:16px 0}summary{font-size:19px;font-weight:700;cursor:pointer;min-height:32px}.line{white-space:pre-wrap;overflow-wrap:anywhere}.gap{height:9px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:white;padding:16px;border-radius:8px;font:15px/1.8 system-ui,sans-serif;max-height:none}.note,small{font-size:14px;color:#52697e}input{width:100%;min-height:46px;padding:10px;font:inherit;border:1px solid #aebfce;border-radius:7px}li{margin:9px 0}button{font:inherit;min-height:44px;padding:8px 14px;border:1px solid #adbfce;border-radius:7px;background:white;color:#174f75}#status{margin-left:10px}.line mark{background:#fff2a5}[hidden]{display:none!important}</style></head><body><main><h1>日本旅行 · 内容与完整工程交接</h1><p class="note">整理于2026/11/28 · 旅行内容可独立交给其他AI阅读</p><nav><a href="#travel">完整旅行内容</a><a href="#ai">AI接手背景</a><a href="#source">完整工程文件</a><a href="../index.html#days">返回攻略</a></nav><p><a class="download" href="完整旅行内容.txt" download>旅行内容 TXT</a> <a class="download" href="完整旅行内容.md" download>旅行内容 Markdown</a> <a class="download" href="行程数据.json" download>结构化数据 JSON</a></p><p class="note">给手机AI：优先上传“完整旅行内容.txt”；需要机器读取全部字段时再附JSON。二者都可独立使用。</p><section id="ai"><h2>AI接手背景</h2>${markdownHtml(intro)}</section><section id="travel"><h2>完整旅行内容</h2><label>在旅行内容中查找<input type="search" id="search" placeholder="例如：12/8、萨莉亚、护照、城崎"></label><p><button id="copy" type="button">复制完整旅行内容</button><span id="status" class="note" role="status"></span></p><details open><summary>展开阅读／长按选择文本</summary><pre id="travel-text">${esc(content)}</pre></details></section><section id="source"><h2>完整工程文件</h2><p><a href="工程接手说明.md">工程维护说明</a> · <a href="文件清单.json">文件清单及SHA-256</a></p><details><summary>源码、图片与配置（${entries.length}个文件）</summary><ul>${links}</ul></details></section></main><script>(${bindHandoffReader.toString()})();</script></body></html>`;
 fs.writeFileSync(path.join(output,'index.html'),page);
 for(const file of ['完整旅行内容.md','完整旅行内容.txt','行程数据.json','工程接手说明.md','index.html']){
  const bytes=fs.readFileSync(path.join(output,file));entries.push({path:file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 fs.writeFileSync(path.join(output,'文件清单.json'),JSON.stringify({exportedAt:bundle.exportedAt,files:entries},null,2));
 console.log(`Handoff: ${entries.length} files; travel-only text ${(Buffer.byteLength(content)/1024).toFixed(0)}KB; ${main.days.length} days, ${restaurants.length} restaurants, ${Object.keys(sightsById).length} sights.`);
 return output;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await exportHandoff(process.argv[2]);
