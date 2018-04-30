!function o(i,u,s){function c(t,e){if(!u[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var a=u[t]={exports:{}};i[t][0].call(a.exports,function(e){return c(i[t][1][e]||e)},a,a.exports,o,i,u,s)}return u[t].exports}for(var l="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r,o=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),a=e("./indexedb"),i=(r=a)&&r.__esModule?r:{default:r};var u=function(){function a(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a)}return o(a,null,[{key:"fetchRestaurants",value:function(){return fetch(a.DATABASE_URL).then(function(e){return e.json()}).catch(function(e){return console.error("Request failed. Returned status of "+e)})}},{key:"fetchRestaurantById",value:function(n){return i.default.get("restaurants",Number(n)).then(function(e){return e||(console.log("No cache found"),fetch(a.DATABASE_URL).then(function(e){return e.json()}).then(function(e){var t=e.restaurants[n-1];return i.default.set("restaurants",t),t}).catch(function(e){return console.error("Restaurant does not exist: "+e)}))})}},{key:"fetchRestaurantByCuisine",value:function(t){return a.fetchRestaurants().then(function(e){return e.restaurants.filter(function(e){return e.cuisine_type==t})}).catch(function(e){return console.error(e)})}},{key:"fetchRestaurantByNeighborhood",value:function(t){return a.fetchRestaurants().then(function(e){return e.restaurants.filter(function(e){return e.neighborhood==t})}).catch(function(e){return console.error(e)})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(n,r){return i.default.getAll("restaurants").then(function(e){return e.length<10?a.fetchRestaurants().then(function(e){var t=e;return t.forEach(function(e){return i.default.set("restaurants",e)}),a.filterResults(t,n,r)}).catch(function(e){return console.error(e)}):a.filterResults(e,n,r)}).catch(function(e){return console.error(e)})}},{key:"filterResults",value:function(e,t,n){return"all"!==t&&(e=e.filter(function(e){return e.cuisine_type==t})),"all"!==n&&(e=e.filter(function(e){return e.neighborhood==n})),e}},{key:"fetchNeighborhoods",value:function(){return a.fetchRestaurants().then(function(e){var n=e.map(function(e){return e.neighborhood});return n.filter(function(e,t){return n.indexOf(e)==t})}).catch(function(e){return console.error(e)})}},{key:"fetchCuisines",value:function(){return a.fetchRestaurants().then(function(e){var n=e.map(function(e){return e.cuisine_type});return n.filter(function(e,t){return n.indexOf(e)==t})}).catch(function(e){return console.error(e)})}},{key:"urlForRestaurant",value:function(e){return"restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return"assets/img/jpg/"+e.photograph}},{key:"imageWebpUrlForRestaurant",value:function(e){return"assets/img/webp/"+e.photograph}},{key:"mapMarkerForRestaurant",value:function(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:a.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return window.navigator.standalone?"data/restaurants.json":"http://localhost:1337/restaurants"}}]),a}();n.default=u},{"./indexedb":3}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(){var e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){var n=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting){var t=e.target;"source"===t.localName?t.srcset=t.dataset.srcset:t.src=t.dataset.src,t.classList.remove("lazy"),n.unobserve(t)}})});e.forEach(function(e){n.observe(e)})}else{var r=[].slice.call(document.querySelectorAll(".lazy")),t=!1,a=function e(){!1===t&&(t=!0,setTimeout(function(){r.forEach(function(t){t.getBoundingClientRect().top<=window.innerHeight+50&&0<=t.getBoundingClientRect().bottom&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(r=r.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",e),window.removeEventListener("resize",e),window.removeEventListener("orientationchange",e)))}),t=!1},200))};document.addEventListener("scroll",a),window.addEventListener("resize",a),window.addEventListener("orientationchange",a),"complete"===window.document.readyState&&a()}}},{}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r,a=e("../node_modules/idb/lib/idb"),o=(r=a)&&r.__esModule?r:{default:r};var i=function(){if(navigator.serviceWorker)return o.default.open("restaurant-reviews",1,function(e){switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"})}})},u={get:function(t,n){return i().then(function(e){if(e)return e.transaction(t).objectStore(t).get(n)}).catch(function(e){return console.error(e)})},set:function(n,r){return i().then(function(e){if(e){var t=e.transaction(n,"readwrite");return t.objectStore(n).put(r),t.complete}}).catch(function(e){return console.error(e)})},getAll:function(t){return i().then(function(e){if(e)return e.transaction(t).objectStore(t).getAll()}).catch(function(e){return console.error(e)})}};self.idbKey=u,n.default=u},{"../node_modules/idb/lib/idb":5}],4:[function(e,t,n){"use strict";var m=a(e("./dbhelper")),r=a(e("./helpers"));function a(e){return e&&e.__esModule?e:{default:e}}document.addEventListener("load",function(e){}),"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("../sw.js").then(function(e){console.log("registration to serviceWorker complete with scope :",e.scope)}),navigator.serviceWorker.addEventListener("message",function(e){"confirmed"===e.data.message&&(m.default.switchLoaderToMap(),console.log("Switch done"))})}),window.initMap=function(){o().then(function(e){self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:e.latlng,scrollwheel:!1}),(0,r.default)(),m.default.mapMarkerForRestaurant(self.restaurant,self.map),s()})};var o=function(){if(!self.restaurant){var e=c("id");return e?m.default.fetchRestaurantById(e).then(function(e){return self.restaurant=e}).then(i).catch(function(e){return console.error(e)}):console.error("No restaurant id in URL")}console.log("restaurant already fetch")},i=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name;var t=document.getElementById("restaurant-address");t.innerHTML=e.address,t.setAttribute("aria-label","located at "+e.address);var n=document.getElementsByTagName("figure")[0],r=document.getElementsByTagName("figcaption")[0],a=document.createElement("picture"),o=document.createElement("source");o.dataset.srcset=m.default.imageWebpUrlForRestaurant(e)+"-large_x1.webp 1x, "+m.default.imageWebpUrlForRestaurant(e)+"-large_x2.webp 2x",o.srcset=m.default.imageWebpUrlForRestaurant(e)+"-lazy.webp",o.className="lazy",o.media="(min-width: 1000px)",o.type="image/webp";var i=document.createElement("source");i.dataset.srcset=m.default.imageUrlForRestaurant(e)+"-large_x1.jpg 1x, "+m.default.imageUrlForRestaurant(e)+"-large_x2.jpg 2x",i.srcset=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",i.className="lazy",i.media=o.media,i.type="image/jpeg";var u=document.createElement("source");u.dataset.srcset=m.default.imageWebpUrlForRestaurant(e)+"-medium_x1.webp 1x, "+m.default.imageWebpUrlForRestaurant(e)+"-medium_x2.webp 2x",u.srcset=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",u.className="lazy",u.media="(min-width: 420px)",u.type="image/webp";var s=document.createElement("source");s.dataset.srcset=m.default.imageUrlForRestaurant(e)+"-medium_x1.jpg 1x, "+m.default.imageUrlForRestaurant(e)+"-medium_x2.jpg 2x",s.srcset=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",s.className="lazy",s.media=u.media,s.type="image/jpeg";var c=document.createElement("source");c.dataset.srcset=m.default.imageWebpUrlForRestaurant(e)+"-small_x2.webp 2x, "+m.default.imageWebpUrlForRestaurant(e)+"-small_x1.webp 1x",c.srcset=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",c.className="lazy",c.media="(min-width: 320px)",c.type="image/webp";var l=document.createElement("source");l.dataset.srcset=m.default.imageUrlForRestaurant(e)+"-small_x2.jpg 2x, "+m.default.imageUrlForRestaurant(e)+"-small_x1.jpg 1x",l.srcset=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",l.className="lazy",l.media=c.media,l.type="image/jpeg";var d=document.createElement("img");d.className="restaurant-img lazy",d.dataset.src=m.default.imageUrlForRestaurant(e)+"-large_x1.jpg",d.src=m.default.imageUrlForRestaurant(e)+"-lazy.jpg",d.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),d.alt=e.name+"'s  restaurant",d.type="image/jpeg",a.appendChild(o),a.appendChild(i),a.appendChild(u),a.appendChild(s),a.appendChild(c),a.appendChild(l),a.appendChild(d),n.insertBefore(a,r);var f=document.getElementById("restaurant-cuisine");f.innerHTML=e.cuisine_type;var p=document.createElement("label");return p.innerHTML=e.cuisine_type+" food",p.setAttribute("hidden","hidden"),p.id="foodType",f.parentNode.insertBefore(p,f.nextSibling),e.operating_hours&&h(),g(),e},h=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,a.setAttribute("aria-label","open on "+n),r.appendChild(a);var o=document.createElement("td");o.innerHTML=e[n],o.setAttribute("aria-label",e[n]+","),r.appendChild(o),r.setAttribute("role","row"),t.appendChild(r)}},g=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var a=document.getElementById("reviews-list");e.forEach(function(e){a.appendChild(u(e))}),t.appendChild(a)},u=function(e){var t=document.createElement("li"),n=document.createElement("p");n.className="userName",n.innerHTML=e.name,n.setAttribute("aria-label",e.name+","),t.appendChild(n);var r=document.createElement("p");r.className="dateReview",r.innerHTML=e.date,r.setAttribute("aria-label",e.date+","),t.appendChild(r);var a=document.createElement("p"),o=document.createElement("span");a.className="userRating",o.className="ratingStars";for(var i=0;i<e.rating;i++)o.innerHTML+="★";o.setAttribute("aria-label",e.rating+" stars on 5,"),a.innerHTML="Rating: ",a.appendChild(o),t.appendChild(a);var u=document.createElement("p");return u.className="userComments",u.innerHTML=e.comments,t.appendChild(u),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize",self.restaurant.reviews.length),t.setAttribute("aria-posinset",self.restaurant.reviews.indexOf(e)+1),t},s=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=" "+e.name,n.className="fontawesome-arrow-right",n.setAttribute("aria-current","page"),t.appendChild(n)},c=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}},{"./dbhelper":1,"./helpers":2}],5:[function(e,p,t){"use strict";!function(){function i(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function o(n,r,a){var o,e=new Promise(function(e,t){i(o=n[r].apply(n,a)).then(e,t)});return e.request=o,e}function e(e,n,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})})}function t(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return o(this[n],e,arguments)})})}function n(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function r(e,r,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[r],(t=o(e,n,arguments)).then(function(e){if(e)return new u(e,t.request)});var e,t})})}function a(e){this._index=e}function u(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function c(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)},n.onabort=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new c(n)}function d(e){this._db=e}e(a,"_index",["name","keyPath","multiEntry","unique"]),t(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),r(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(u,"_cursor",["direction","key","primaryKey","value"]),t(u,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(u.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),i(t._request).then(function(e){if(e)return new u(e,t._request)})})})}),s.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},e(s,"_store",["name","keyPath","indexNames","autoIncrement"]),t(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),r(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(s,"_store",IDBObjectStore,["deleteIndex"]),c.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},e(c,"_tx",["objectStoreNames","mode"]),n(c,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new c(this._db.transaction.apply(this._db,arguments))},e(d,"_db",["name","version","objectStoreNames"]),n(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(o){[s,a].forEach(function(e){e.prototype[o.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],r=this._store||this._index,a=r[o].apply(r,t.slice(0,-1));a.onsuccess=function(){n(a.result)}}})}),[a,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var r=this,a=[];return new Promise(function(t){r.iterateCursor(e,function(e){e?(a.push(e.value),void 0===n||a.length!=n?e.continue():t(a)):t(a)})})})});var f={open:function(e,t,n){var r=o(indexedDB,"open",[e,t]),a=r.request;return a.onupgradeneeded=function(e){n&&n(new l(a.result,e.oldVersion,a.transaction))},r.then(function(e){return new d(e)})},delete:function(e){return o(indexedDB,"deleteDatabase",[e])}};void 0!==p?(p.exports=f,p.exports.default=p.exports):self.idb=f}()},{}]},{},[4]);