!function(){return function e(t,n,r){function o(s,i){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!i&&c)return c(s,!0);if(a)return a(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[s]={exports:{}};t[s][0].call(d.exports,function(e){return o(t[s][1][e]||e)},d,d.exports,e,t,n,r)}return n[s].exports}for(var a="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}}()({1:[function(e,t,n){const r=e("./indexedb"),o="/restaurants/",a="/reviews/",s="?is_favorite=",i="http://localhost:1337",c={DATABASE_URL:{GET:{allRestaurants:()=>fetch(i+o),allReviews:()=>fetch(i+a),restaurant:e=>fetch(i+o+e),setFavoriteRestaurants:e=>fetch(i+o+s+e)},POST:{newReview:e=>fetch(i+a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})},PUT:{favoriteRestaurant:(e,t)=>fetch(i+o+e+s+t,{method:"PUT"}),updateReview:e=>fetch(i+a+e,{method:"PUT"})},DELETE:{review:e=>fetch(i+a+e,{method:"DELETE"})}},fetchRestaurants:()=>{return r.getAll("restaurants").then(e=>e.length<10?c.DATABASE_URL.GET.allRestaurants().then(e=>e.json()).then(e=>(console.log("- Restaurants data fetched !"),e.restaurants||e)).then(e=>(e.forEach(e=>r.set("restaurants",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchReviews:()=>{return r.getAll("reviews").then(e=>e.length<10?c.DATABASE_URL.GET.allReviews().then(e=>e.json()).then(e=>(console.log("- Reviews data fetched !"),e.reviews||e)).then(e=>(e.forEach(e=>r.set("reviews",e)),e)).catch(e=>console.error(`Request failed. Returned status of ${e}`)):e).catch(e=>{console.error(e)})},fetchRestaurantById:e=>{return r.get("restaurants",Number(e)).then(t=>t||(console.log("- No restaurant cached"),c.DATABASE_URL.GET.restaurant(e).then(e=>e.json()).then(e=>(r.set("restaurants",e),e)).catch(e=>console.error(`Restaurant does not exist: ${e}`))))},fetchRestaurantByCuisineAndNeighborhood:(e,t)=>{return r.getAll("restaurants").then(n=>n.length<10?c.fetchRestaurants().then(n=>{const o=n;return o.forEach(e=>r.set("restaurants",e)),c.filterResults(o,e,t)}).catch(e=>console.error(e)):c.filterResults(n,e,t)).catch(e=>console.error(e))},filterResults:(e,t,n)=>("all"!==t&&(e=e.filter(e=>e.cuisine_type==t)),"all"!==n&&(e=e.filter(e=>e.neighborhood==n)),e),addNeighborhoodsOptions:e=>{const t=e.map(e=>e.neighborhood);return t.filter((e,n)=>t.indexOf(e)==n)},addCuisinesOptions:e=>{const t=e.map(e=>e.cuisine_type);return t.filter((e,n)=>t.indexOf(e)==n)},urlForRestaurant:e=>`restaurant.html?id=${e.id}`,imageUrlForRestaurant:e=>`assets/img/jpg/${e.photograph}`,imageWebpUrlForRestaurant:e=>`assets/img/webp/${e.photograph}`,postReview:async e=>{console.log("Trying to post review..."),e.preventDefault();const t=document.querySelector("#title-container form").elements,n={restaurant_id:Number(window.location.search.match(/\d+/)[0]),name:t.name.value,rating:Number(t.rating.value),comments:t.comments.value,createdAt:Date.now(),updatedAt:Date.now()};await r.set("posts",n),await r.addReview("reviews",n);const o=await navigator.serviceWorker.ready;Notification.requestPermission().then(function(e){"denied"!==e?"default"!==e?"granted"===e&&console.log("Notification allowed"):console.log("The permission request was dismissed."):console.log("Permission wasn't granted. Allow a retry.")}),o.sync.register("post-review"),location.reload(),o.sync.getTags().then(e=>console.log(e))},mapMarkerForRestaurant:(e,t)=>{return new google.maps.Marker({position:{lat:e.lat||e.latlng.lat,lng:e.lng||e.latlng.lng},title:e.name,url:c.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP,icon:"assets/img/svg/marker.svg"})}};t.exports=c},{"./indexedb":3}],2:[function(e,t,n){const r=document.querySelector(".filter-options"),o=document.getElementById("menuFilter");filterResultHeading=document.querySelector(".filter-options h3");const a={goToRestaurantPage:e=>{e.target.classList.toggle("move-left"),window.location.assign(e.target.dataset.url)},fixedOnViewport:(e,t)=>{const n=t.cloneNode(!0);if(n.className="fixed exclude",t.appendChild(n),"IntersectionObserver"in window){new IntersectionObserver(function(e,r){e.forEach(function(e){e.intersectionRatio<=.01?(n.classList.remove("exclude"),n.classList.add("shadow"),t.classList.add("shadow")):(t.classList.contains("shadow")&&t.classList.remove("shadow"),n.classList.remove("shadow"),n.classList.add("exclude"))})},{root:null,threshold:[.01],rootMargin:"0px"}).observe(e)}},toggleMenu:()=>{r.classList.toggle("optionsOpen"),r.setAttribute("aria-hidden","false"),o.classList.toggle("pressed"),o.blur(),filterResultHeading.setAttribute("tabindex","-1"),filterResultHeading.focus()},isFormValid:()=>{document.querySelector("form").checkValidity()?document.querySelector('form input[type="submit"]').style.color="green":document.querySelector('form input[type="submit"]').style.color="#ca0000"},toggleForm:()=>{document.getElementById("title-container").classList.toggle("reviews-toggled"),document.getElementById("reviews-list").classList.toggle("reviews-toggled"),document.querySelector("section form").classList.toggle("toggled-display"),setTimeout(()=>{document.querySelector("section form").classList.toggle("toggled-translate")},800)},lazyLoading:()=>{const e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){const t={root:null,threshold:[],rootMargin:"200px"};for(let e=0;e<=1;e+=.01)t.threshold.push(Math.round(100*e)/100);let n=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting||e.intersectionRatio>=.01){let t=e.target;"source"===t.localName?t.srcset=t.dataset.srcset:t.src=t.dataset.src,t.classList.remove("lazy"),n.unobserve(t)}})},t);e.forEach(function(e){n.observe(e)}),document.onreadystatechange=(()=>{"complete"==document.readyState&&a.lazyLoading()})}else{let e=[].slice.call(document.querySelectorAll(".lazy")),t=!1;const n=function(){if(!1===t){t=!0;const r=window.innerHeight+200;e.forEach(function(t){t.getBoundingClientRect().top<=r&&t.getBoundingClientRect().bottom>=0&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(e=e.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",n),window.removeEventListener("resize",n),window.removeEventListener("orientationchange",n)))}),t=!1}};document.addEventListener("scroll",n),window.addEventListener("resize",n),window.addEventListener("orientationchange",n),"complete"==document.readyState&&(console.log("document ready for lazy load"),n()),document.onreadystatechange=function(){"complete"==document.readyState&&(console.log("document ready for lazy load"),n())}}},sortByNote:(e,t)=>{const n=a.getAverageNote(e.reviews),r=a.getAverageNote(t.reviews);return r>n?1:r<n?-1:0},sortByName:(e,t)=>e.name>t.name,sortByNameInverted:(e,t)=>e.name<t.name,getAverageNote:(e,t=self.reviews)=>{let n=0,r=0;return t.forEach(t=>{t.restaurant_id===e&&(n+=Number(t.rating),r++)}),n/=r,Math.round(10*n)/10}};t.exports=a},{}],3:[function(e,t,n){const r=e("../../node_modules/idb/lib/idb"),o=()=>r.open("restaurant-reviews",3,e=>{switch(e.oldVersion){case 0:e.createObjectStore("restaurants",{keyPath:"id"});case 1:e.createObjectStore("reviews",{keyPath:"id",autoIncrement:!0});case 1:e.createObjectStore("posts",{keyPath:"restaurant_id"})}}),a={get:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).get(t)}).catch(e=>console.error(e)),set:(e,t)=>o().then(n=>{if(!n)return;return n.transaction(e,"readwrite").objectStore(e).put(t).complete}).catch(e=>console.error(e)),getAll:e=>o().then(t=>{if(t)return t.transaction(e).objectStore(e).getAll()}).catch(e=>console.error(e)),delete:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).delete(t)}).catch(e=>console.error(e)),addReview:(e,t)=>o().then(n=>{if(n)return n.transaction(e,"readwrite").objectStore(e).add(t)}).catch(e=>console.error(e)),getRestaurantReviews:(e,t)=>o().then(n=>{if(n)return n.transaction(e).objectStore(e).getAll().then(e=>e.filter(e=>e.restaurant_id===t))}).catch(e=>console.error(e))};t.exports=a},{"../../node_modules/idb/lib/idb":5}],4:[function(e,t,n){const r=e("./dbhelper"),o=e("./helpers");const a=document.getElementById("map-loader");window.addEventListener("load",()=>{if("serviceWorker"in navigator&&"SyncManager"in window){const e="hallya.github.io"===window.location.hostname?"/mws-restaurant-stage-1/sw.js":"../sw.js";navigator.serviceWorker.register(e).then(e=>{e.sync.register("post-review"),e.sync.register("fetch-new-reviews")})}}),window.initMap=(()=>{s().then(e=>{const t=document.createElement("div");t.setAttribute("tabindex","-1"),t.setAttribute("aria-hidden","true"),t.id="map",self.map=new google.maps.Map(t,{zoom:16,center:{lat:e.lat||e.latlng.lat,lng:e.lng||e.latlng.lng},streetViewControl:!0,mapTypeId:"roadmap"}),document.getElementById("map-container").appendChild(t),self.map.addListener("tilesloaded",function(){a.classList.toggle("hidden")}),r.mapMarkerForRestaurant(self.restaurant,self.map),p()}).then(o.lazyLoading).catch(e=>console.error(e))});const s=()=>{if(self.restaurant)return void console.log("- Restaurant already fetch");const e=g("id");return e?Promise.all([r.fetchRestaurantById(e),r.fetchReviews()]).then(e=>(self.reviews=e[1],self.restaurant=e[0])).then(i).catch(e=>console.error(e)):console.error("No restaurant id in URL")},i=(e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name;const t=document.getElementById("restaurant-address");t.innerHTML=e.address,t.setAttribute("aria-label",`located at ${e.address}`);const n=document.getElementsByTagName("figure")[0],o=document.getElementsByTagName("figcaption")[0],a=document.createElement("picture"),s=document.createElement("source");s.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-large_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-large_x2.webp 2x`,s.srcset="assets/img/svg/puff.svg",s.className="lazy",s.media="(min-width: 1000px)",s.type="image/webp";const i=document.createElement("source");i.dataset.srcset=`${r.imageUrlForRestaurant(e)}-large_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-large_x2.jpg 2x`,i.srcset="assets/img/svg/puff.svg",i.className="lazy",i.media=s.media,i.type="image/jpeg";const d=document.createElement("source");d.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-medium_x1.webp 1x, ${r.imageWebpUrlForRestaurant(e)}-medium_x2.webp 2x`,d.srcset="assets/img/svg/puff.svg",d.className="lazy",d.media="(min-width: 420px)",d.type="image/webp";const u=document.createElement("source");u.dataset.srcset=`${r.imageUrlForRestaurant(e)}-medium_x1.jpg 1x, ${r.imageUrlForRestaurant(e)}-medium_x2.jpg 2x`,u.srcset="assets/img/svg/puff.svg",u.className="lazy",u.media=d.media,u.type="image/jpeg";const m=document.createElement("source");m.dataset.srcset=`${r.imageWebpUrlForRestaurant(e)}-small_x2.webp 2x, ${r.imageWebpUrlForRestaurant(e)}-small_x1.webp 1x`,m.srcset="assets/img/svg/puff.svg",m.className="lazy",m.media="(min-width: 320px)",m.type="image/webp";const p=document.createElement("source");p.dataset.srcset=`${r.imageUrlForRestaurant(e)}-small_x2.jpg 2x, ${r.imageUrlForRestaurant(e)}-small_x1.jpg 1x`,p.srcset="assets/img/svg/puff.svg",p.className="lazy",p.media=m.media,p.type="image/jpeg";const g=document.createElement("img");g.className="restaurant-img lazy",g.dataset.src=`${r.imageUrlForRestaurant(e)}-large_x1.jpg`,g.src="assets/img/svg/puff.svg",g.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),g.alt=`${e.name}'s  restaurant`,g.type="image/jpeg",a.appendChild(s),a.appendChild(i),a.appendChild(d),a.appendChild(u),a.appendChild(m),a.appendChild(p),a.appendChild(g),n.insertBefore(a,o);const h=document.getElementById("restaurant-cuisine");h.innerHTML=e.cuisine_type;const f=document.createElement("label");return f.innerHTML=`${e.cuisine_type} food`,f.setAttribute("hidden","hidden"),f.id="foodType",h.parentNode.insertBefore(f,h.nextSibling),e.operating_hours&&c(),l(),e},c=(e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,o.setAttribute("aria-label",`open on ${n}`),r.appendChild(o);const a=document.createElement("td");a.innerHTML=e[n],a.setAttribute("aria-label",`${e[n]},`),r.appendChild(a),r.setAttribute("role","row"),t.appendChild(r)}},l=(e=self.restaurant.reviews||self.reviews)=>{if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",t.appendChild(e)}e=e.filter(e=>e.restaurant_id===self.restaurant.id),self.reviews=e;const t=document.getElementById("reviews-container"),n=document.createElement("div"),r=document.createElement("h3"),o=document.createElement("button"),a=document.createElement("span"),s=document.createElement("span");r.innerHTML="Reviews",a.innerHTML="+",s.innerHTML="-",s.className="toggled",n.id="title-container",o.addEventListener("click",d),o.appendChild(a),o.appendChild(s),n.appendChild(r),n.appendChild(o),t.appendChild(n);const i=document.getElementById("reviews-list");e.forEach(e=>{i.appendChild(m(e))}),t.appendChild(i)},d=()=>{const e=document.createElement("form"),t=document.createElement("label"),n=document.createElement("input"),a=document.createElement("fieldset");e.autocomplete="on",n.id="form-name",n.type="text",n.name="name",n.placeholder="Your name",n.minLength="2",n.maxLength="50",n.pattern="^[a-zA-Zs]+$",n.required=!0,t.setAttribute("for",n.id),t.className="visuallyHidden",t.innerHTML="Enter your name",a.className="new-rating";for(let e=5;e>0;e--){const t=document.createElement("input"),n=document.createElement("label");t.type="radio",t.id=`star${e}`,t.name="rating",t.value=e,t.class="visuallyHidden",t.required=!0,t.addEventListener("input",o.isFormValid),n.setAttribute("for",`star${e}`),n.title="It was",a.appendChild(t),a.appendChild(n)}const s=document.createElement("label"),i=document.createElement("textarea"),c=document.createElement("label"),l=document.createElement("input");i.id="form-comment",i.name="comments",i.type="text",i.required=!0,i.minLength=3,i.maxLength=5e3,i.placeholder="Your comment",i.addEventListener("keydown",h),s.setAttribute("for",i.id),s.className="visuallyHidden",s.innerHTML="Enter your opinion about this restaurant",l.id="form-submit",l.type="submit",l.value="Save",c.setAttribute("for",l.id),c.className="visuallyHidden",n.addEventListener("change",o.isFormValid),i.addEventListener("input",o.isFormValid),e.appendChild(t),e.appendChild(n),e.appendChild(a),e.appendChild(s),e.appendChild(i),e.appendChild(l),e.appendChild(c),e.addEventListener("submit",r.postReview),document.getElementById("title-container").classList.toggle("form-open"),document.getElementById("title-container").appendChild(e),e.classList.toggle("form-toggled"),setTimeout(()=>{},300),document.querySelector("#title-container button").removeEventListener("click",d),document.querySelector("#title-container button").addEventListener("click",u),document.querySelectorAll("#title-container button span").forEach(e=>e.classList.toggle("toggled"))},u=()=>{document.querySelector("#title-container form").classList.toggle("form-toggled"),document.getElementById("title-container").classList.toggle("form-open"),setTimeout(()=>{document.querySelector("#title-container form").remove()},300),document.querySelectorAll("#title-container button span").forEach(e=>e.classList.toggle("toggled")),document.querySelector("#title-container button").removeEventListener("click",u),document.querySelector("#title-container button").addEventListener("click",d)},m=e=>{const t=document.createElement("li"),n=document.createElement("p");n.className="userName",n.innerHTML=e.name,n.setAttribute("aria-label",`${e.name},`),t.appendChild(n);const r=document.createElement("p");r.className="dateReview";const o=new Date(e.updatedAt);r.innerHTML=o.toDateString(),r.setAttribute("aria-label",`${r.innerHTML},`),t.appendChild(r);const a=document.createElement("p");let s=document.createElement("span");a.className="userRating",s.className="ratingStars";for(let t=0;t<e.rating;t++){const e=document.createElement("span");e.innerHTML+="★",e.id=`star${t+1}`,s.appendChild(e)}s.setAttribute("aria-label",`${e.rating} stars on 5,`),a.innerHTML="Rating: ",a.appendChild(s),t.appendChild(a);const i=document.createElement("p");return i.className="userComments",i.innerHTML=e.comments,t.appendChild(i),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize",self.reviews),t.setAttribute("aria-posinset",self.reviews.indexOf(e)+1),t},p=(e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=` ${e.name}`,n.className="fontawesome-arrow-right",n.setAttribute("aria-current","page"),t.appendChild(n),o.fixedOnViewport(document.querySelector("nav"),document.querySelector("#breadcrumb"))},g=(e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};function h(){document.getElementById("title-container").style.height="auto",this.style.cssText="height:auto; padding:0",this.style.cssText="height:"+this.scrollHeight+"px"}},{"./dbhelper":1,"./helpers":2}],5:[function(e,t,n){"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(t,n,r){var o,a=new Promise(function(a,s){e(o=t[n].apply(t,r)).then(a,s)});return a.request=o,a}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function a(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function s(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[t],(r=n(e,o,arguments)).then(function(e){if(e)return new c(e,r.request)});var e,r})})}function i(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function l(e){this._store=e}function d(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function u(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new d(n)}function m(e){this._db=e}r(i,"_index",["name","keyPath","multiEntry","unique"]),o(i,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),s(i,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),l.prototype.createIndex=function(){return new i(this._store.createIndex.apply(this._store,arguments))},l.prototype.index=function(){return new i(this._store.index.apply(this._store,arguments))},r(l,"_store",["name","keyPath","indexNames","autoIncrement"]),o(l,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),s(l,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),a(l,"_store",IDBObjectStore,["deleteIndex"]),d.prototype.objectStore=function(){return new l(this._tx.objectStore.apply(this._tx,arguments))},r(d,"_tx",["objectStoreNames","mode"]),a(d,"_tx",IDBTransaction,["abort"]),u.prototype.createObjectStore=function(){return new l(this._db.createObjectStore.apply(this._db,arguments))},r(u,"_db",["name","version","objectStoreNames"]),a(u,"_db",IDBDatabase,["deleteObjectStore","close"]),m.prototype.transaction=function(){return new d(this._db.transaction.apply(this._db,arguments))},r(m,"_db",["name","version","objectStoreNames"]),a(m,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[l,i].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,a=o[e].apply(o,n.slice(0,-1));a.onsuccess=function(){r(a.result)}})})}),[i,l].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var p={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),a=o.request;return a&&(a.onupgradeneeded=function(e){r&&r(new u(a.result,e.oldVersion,a.transaction))}),o.then(function(e){return new m(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};void 0!==t?(t.exports=p,t.exports.default=t.exports):self.idb=p}()},{}]},{},[4]);