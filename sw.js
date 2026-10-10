'use strict';
const CACHE='zizai-static-v2';
const FILES=['./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./icon-maskable.png'];
const urls=FILES.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(urls)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zizai-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(urls.includes(url.href)){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));return;}if(event.request.mode==='navigate'&&url.href.startsWith(self.registration.scope)){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(urls[0]))||fetch(event.request)));}});
