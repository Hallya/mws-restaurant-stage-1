(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var CACHE_STATIC="static-cache-6",CACHE_MAP="cache-map-api-2",URLS_TO_CACHE=["index.html","manifest.webmanifest","restaurant.html","assets/css/fonts/iconicfill.woff2","assets/css/fonts/fontawesome.woff2","assets/css/fonts/1cXxaUPXBpj2rGoU7C9WiHGFq8Kk1Q.woff2","assets/css/fonts/JTURjIg1_i6t8kCHKm45_ZpC3gnD_vx3rCs.woff2","assets/img/png/launchScreen-ipad-9.7.png","assets/img/png/launchScreen-ipadpro-10.5.png","assets/img/png/launchScreen-ipadpro-12.9.png","assets/img/png/launchScreen-iphone-8.png","assets/img/png/launchScreen-iphone-8plus.png","assets/img/png/launchScreen-iphone-x.png","assets/img/png/launchScreen-iphone-se.png","assets/img/png/logo-64.png","assets/img/png/logo-128.png","assets/img/png/logo-256.png","assets/img/png/logo-512.png","assets/css/styles.css","js/main.js","js/restaurant_info.js"];self.addEventListener("install",function(e){console.log("cache version : "+CACHE_STATIC),e.waitUntil(caches.open(CACHE_STATIC).then(function(e){return e.addAll(URLS_TO_CACHE)}).then(function(){console.log("All resources cached."),self.skipWaiting(),console.log("SW version skipped.")}).catch(function(e){return console.error("Open cache failed :",e)}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){return e!==CACHE_STATIC?caches.delete(e):null}))}).then(function(){return console.log(CACHE_STATIC+" now ready to handle fetches!")}))}),self.addEventListener("fetch",function(e){var n=new URL(e.request.url),t=void 0;n.hostname.indexOf("maps")>-1?e.respondWith(caches.open(CACHE_MAP).then(function(t){return t.match(e.request).then(function(e){return e||fetch(n.href,{mode:"no-cors"})}).then(function(n){return t.put(e.request,n.clone()),n},function(e){return console.error(e)})})):n.pathname.indexOf("restaurant.html")>-1?(t=n.href.replace(/[?&]id=\d/,""),e.respondWith(caches.open(CACHE_STATIC).then(function(n){return n.match(t).then(function(n){return n||fetch(e.request)}).then(function(e){return n.put(t,e.clone()),e},function(e){return console.error(e)})}))):n.pathname.indexOf("browser-sync")>-1||n.pathname.endsWith("restaurants.json")?e.respondWith(fetch(e.request)):(n.hostname.startsWith("localhost")||n.hostname.startsWith("hally.github.io"))&&e.respondWith(caches.open(CACHE_STATIC).then(function(n){return n.match(e.request).then(function(n){return n||fetch(e.request)}).then(function(t){return n.put(e.request,t.clone()),t},function(e){return console.error(e)})}))});
},{}]},{},[1]);
