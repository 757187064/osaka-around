import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {buildEmergencyHtml} from '../assets/offline-kit.js';
import {exportHandoff} from './export-handoff.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const android=path.join(root,'android/app/src');
execFileSync('npm',['run','build'],{cwd:root,stdio:'inherit',env:{...process.env,VITE_BASE_PATH:'./'}});
await exportHandoff(path.join(root,'dist/handoff'));
const dest=path.join(android,'main/assets');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
fs.cpSync(path.join(root,'dist'),dest,{recursive:true});
// The APK carries the travel-content handoff; full engineering sources remain in the separate delivery/site.
const handoffPage=path.join(dest,'handoff/index.html');
fs.writeFileSync(handoffPage,fs.readFileSync(handoffPage,'utf8').replaceAll('日本旅行 · 内容与完整工程交接','日本旅行 · 内容交接').replace('<a href="#source">完整工程文件</a>','').replace(/<section id="source">[\s\S]*?<\/section>/,''));
fs.rmSync(path.join(dest,'handoff/source'),{recursive:true,force:true});
for(const file of ['工程接手说明.md','文件清单.json'])fs.rmSync(path.join(dest,'handoff',file),{force:true});
// Native toolbar already supplies emergency and export actions.
const nativeIndex=path.join(dest,'index.html');
fs.writeFileSync(nativeIndex,fs.readFileSync(nativeIndex,'utf8').replace('</head>',`<style>.site-brand,.offline-link,#download-offline-kit,#printButton,[data-print-outing]{display:none!important}.site-bar{min-height:48px;padding:4px 8px;display:block}.site-bar nav{justify-content:space-around;margin:0}.site-bar nav a{padding:7px 9px}.main.compact-main{width:calc(100% - 28px)}</style></head>`));
// A separate, self-contained entry remains available if the main guide's JS fails.
function emergency(qr=''){
 const link='<p style="margin-top:18px"><a href="index.html#offline-kit">导入／更换入境二维码</a> · <a href="index.html#days">查看本地行程</a></p>';
 const sync=`<script>try{const saved=localStorage.getItem('japan-trip-private-vjw-v1');if(saved&&/^data:image\\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(saved)){const box=document.querySelector('[data-ek-qr-image]');const image=document.createElement('img');image.src=saved;image.alt='Visit Japan Web 入境审查及海关申报二维码';const button=document.createElement('button');button.type='button';button.setAttribute('data-ek-qr-show','');button.textContent='放大二维码';box.replaceChildren(image,button);}}catch{}</script>`;
 return buildEmergencyHtml(qr).replace('<button type="button" data-ek-print>打印／存为PDF</button>', '').replace('</main>',link+'</main>').replace('</body>',sync+'</body>');
}
for(const variant of ['standard','personal']){
 const folder=path.join(android,variant,'assets');fs.mkdirSync(folder,{recursive:true});
 let qr='';
 if(variant==='personal'&&process.env.TRIP_PRIVATE_QR){
  const bytes=fs.readFileSync(process.env.TRIP_PRIVATE_QR);
  if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error('Private QR must be a PNG image.');
  qr='data:image/png;base64,'+bytes.toString('base64');
 }
 fs.writeFileSync(path.join(folder,'emergency.html'),emergency(qr));
}
console.log('Android assets ready: all guide text/photos, emergency HTML and complete handoff.');
