!function(){return function e(s,n,t){function o(a,r){if(!n[a]){if(!s[a]){var i="function"==typeof require&&require;if(!r&&i)return i(a,!0);if(c)return c(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var l=n[a]={exports:{}};s[a][0].call(l.exports,function(e){return o(s[a][1][e]||e)},l,l.exports,e,s,n,t)}return n[a].exports}for(var c="function"==typeof require&&require,a=0;a<t.length;a++)o(t[a]);return o}}()({1:[function(e,s,n){const t=["index.html","manifest.webmanifest","restaurant.html","assets/css/fonts/iconicfill.woff2","assets/css/fonts/fontawesome.woff2","assets/css/fonts/1cXxaUPXBpj2rGoU7C9WiHGFq8Kk1Q.woff2","assets/css/fonts/JTURjIg1_i6t8kCHKm45_ZpC3gnD_vx3rCs.woff2","assets/img/png/launchScreen-ipad-9.7.png","assets/img/png/launchScreen-ipadpro-10.5.png","assets/img/png/launchScreen-ipadpro-12.9.png","assets/img/png/launchScreen-iphone-8.png","assets/img/png/launchScreen-iphone-8plus.png","assets/img/png/launchScreen-iphone-x.png","assets/img/png/launchScreen-iphone-se.png","assets/img/png/logo-64.png","assets/img/png/logo-128.png","assets/img/png/logo-256.png","assets/img/png/logo-512.png","assets/css/index.css","assets/css/restaurant_info.css","js/main.js","js/restaurant_info.js"];self.addEventListener("install",e=>{console.log('- Cache version : "static-cache-9"'),e.waitUntil(caches.open("static-cache-9").then(e=>e.addAll(t)).then(()=>{console.log("- All resources cached."),self.skipWaiting(),console.log("- SW version skipped.")}).catch(e=>console.error("Open cache failed :",e)))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if("static-cache-9"!==e&&"cache-map-api-3"!==e)return console.log("- Deleting",e),caches.delete(e)}))).then(()=>console.log('- "static-cache-9" now ready to handle fetches!')))}),self.addEventListener("fetch",e=>{const s=new URL(e.request.url);let n;s.hostname.indexOf("maps")>-1?e.respondWith(caches.open("cache-map-api-3").then(n=>n.match(e.request).then(e=>e||fetch(s.href,{mode:"no-cors"})).then(s=>(n.put(e.request,s.clone()),s),e=>console.error(e)))):s.pathname.indexOf("restaurant.html")>-1?(n=s.href.replace(/[?&]id=\d/,""),e.respondWith(caches.open("static-cache-9").then(s=>s.match(n).then(s=>s||fetch(e.request)).then(e=>(s.put(n,e.clone()),e),e=>console.error(e))))):s.pathname.indexOf("browser-sync")>-1||s.pathname.endsWith("restaurants.json")?e.respondWith(fetch(e.request)):s.hostname.indexOf(["localhost","hally.github.io"])>-1&&e.respondWith(caches.open("static-cache-9").then(s=>s.match(e.request).then(s=>s||fetch(e.request)).then(n=>(console.log(e.request),s.put(e.request,n.clone()),n),e=>console.error(e)),e=>console.error(e)))})},{}]},{},[1]);