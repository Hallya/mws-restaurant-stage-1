"use strict";var restaurants=void 0,neighborhoods=void 0,cuisines=void 0,markers=[],mainContent=document.querySelector("main"),footer=document.querySelector("footer"),filterOptions=document.querySelector(".filter-options"),filterResultHeading=document.querySelector(".filter-options h3"),filterButton=document.querySelector("#menuFilter"),listOfRestaurants=document.querySelector("#restaurants-list"),sectionMap=document.querySelector("#map-container"),neighborhoodsSelect=document.querySelector("#neighborhoods-select"),cuisinesSelect=document.querySelector("#cuisines-select"),mapDiv=document.querySelector("#map"),loader=document.querySelector("#map-loader");function openMenu(){filterOptions.classList.remove("optionsClose"),mainContent.classList.remove("moveUp"),footer.classList.remove("moveUp"),filterOptions.classList.add("optionsOpen"),filterOptions.setAttribute("aria-hidden","false"),mainContent.classList.add("moveDown"),footer.classList.add("moveDown"),filterButton.classList.add("pressed"),filterButton.blur(),filterResultHeading.setAttribute("tabindex","-1"),filterResultHeading.focus()}function closeMenu(){filterOptions.classList.remove("optionsOpen"),filterOptions.classList.add("optionsClose"),filterOptions.setAttribute("aria-hidden","true"),filterButton.classList.remove("pressed"),mainContent.classList.remove("moveDown"),mainContent.classList.add("moveUp"),footer.classList.remove("moveDown"),footer.classList.add("moveUp"),filterResultHeading.removeAttribute("tabindex")}function activateLazyLoading(){var e=[].slice.call(document.querySelectorAll(".lazy"));if("IntersectionObserver"in window){console.log("Starting intersectionObserver");var n=new IntersectionObserver(function(e,t){e.forEach(function(e){if(e.isIntersecting){var t=e.target;"source"===t.localName?t.srcset=t.dataset.srcset:t.src=t.dataset.src,t.classList.remove("lazy"),n.unobserve(t)}})});e.forEach(function(e){n.observe(e)})}else{var a=[].slice.call(document.querySelectorAll(".lazy")),t=!1;console.log("Starting adaptative lazy loading");var r=function e(){!1===t&&(t=!0,setTimeout(function(){a.forEach(function(t){t.getBoundingClientRect().top<=window.innerHeight+50&&0<=t.getBoundingClientRect().bottom&&"none"!==getComputedStyle(t).display&&(t.src=t.dataset.src,t.srcset=t.dataset.srcset,t.classList.remove("lazy"),0===(a=a.filter(function(e){return e!==t})).length&&(document.removeEventListener("scroll",e),window.removeEventListener("resize",e),window.removeEventListener("orientationchange",e)))}),t=!1},200))};document.addEventListener("scroll",r),window.addEventListener("resize",r),window.addEventListener("orientationchange",r),"complete"===window.document.readyState&&r()}}document.addEventListener("DOMContentLoaded",function(){!window.navigator.standalone&&-1<window.navigator.userAgent.indexOf("AppleWebKit")&&addToHomeScreen(),fetchNeighborhoods(),fetchCuisines()}),filterButton.addEventListener("click",function(){filterOptions.classList.contains("optionsClose")?openMenu():closeMenu()}),"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){console.log("registration to serviceWorker complete with scope :",e.scope)}),navigator.serviceWorker.addEventListener("message",function(e){"confirmed"===e.data.message&&(DBHelper.switchLoaderToMap(),console.log("Switch done"))}),activateLazyLoading()}),document.onkeypress=function(e){console.log(e.code),13===e.charCode&&filterOptions.classList.contains("optionsOpen")&&(closeMenu(),console.log(sectionMap.clientHeight),listOfRestaurants.setAttribute("tabindex","0"),listOfRestaurants.focus())};var fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods().then(function(e){self.neighborhoods=e,fillNeighborhoodsHTML()}).catch(function(e){return console.error(e)})},fillNeighborhoodsHTML=function(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,a=neighborhoodsSelect;n.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",n.indexOf(e)+2),a.append(t)})},fetchCuisines=function(){DBHelper.fetchCuisines().then(function(e){self.cuisines=e,fillCuisinesHTML()}).catch(function(e){return console.error(e)})},fillCuisinesHTML=function(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,a=cuisinesSelect;n.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,t.setAttribute("role","option"),t.setAttribute("aria-setsize","4"),t.setAttribute("aria-posinset",n.indexOf(e)+2),a.append(t)})};window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),self.map.addListener("idle",function(){DBHelper.switchLoaderToMap()}),updateRestaurants()};var updateRestaurants=function(){var e=cuisinesSelect,t=neighborhoodsSelect,n=e.selectedIndex,a=t.selectedIndex,r=e[n].value,s=t[a].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(r,s).then(function(e){resetRestaurants(e),fillRestaurantsHTML(),activateLazyLoading()}).catch(function(e){return console.error(e)})},resetRestaurants=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},fillRestaurantsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,t=document.getElementById("restaurants-list");e.forEach(function(e){t.append(createRestaurantHTML(e))}),addMarkersToMap(),console.log("Restaurants HTML filled")},getAverageNote=function(e){var t=0;return e.forEach(function(e){t+=Number(e.rating)}),t/=e.length,Math.round(10*t)/10},createRestaurantHTML=function(e){var t=document.createElement("li"),n=document.createElement("figure"),a=document.createElement("figcaption"),r=document.createElement("picture"),s=document.createElement("source"),o=document.createElement("source"),i=document.createElement("source"),l=document.createElement("source"),c=document.createElement("source"),d=document.createElement("source"),u=document.createElement("img"),p=document.createElement("aside"),m=document.createElement("p");l.dataset.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-large_x1.webp 1x, "+DBHelper.imageWebpUrlForRestaurant(e)+"-large_x2.webp 2x",l.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-lazy.webp",l.media="(min-width: 1000px)",l.className="lazy",l.type="image/webp",s.dataset.srcset=DBHelper.imageUrlForRestaurant(e)+"-large_x1.jpg 1x, "+DBHelper.imageUrlForRestaurant(e)+"-large_x2.jpg 2x",s.srcset=DBHelper.imageUrlForRestaurant(e)+"-lazy.jpg",s.media="(min-width: 1000px)",s.className="lazy",s.type="image/jpeg",c.dataset.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-medium_x1.webp 1x, "+DBHelper.imageWebpUrlForRestaurant(e)+"-medium_x2.webp 2x",c.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-lazy.webp",c.media="(min-width: 420px)",c.className="lazy",c.type="image/webp",o.dataset.srcset=DBHelper.imageUrlForRestaurant(e)+"-medium_x1.jpg 1x, "+DBHelper.imageUrlForRestaurant(e)+"-medium_x2.jpg 2x",o.srcset=DBHelper.imageUrlForRestaurant(e)+"-lazy.jpg",o.media="(min-width: 420px)",o.className="lazy",o.type="image/jpeg",d.dataset.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-small_x2.webp 2x, "+DBHelper.imageWebpUrlForRestaurant(e)+"-small_x1.webp 1x",d.srcset=DBHelper.imageWebpUrlForRestaurant(e)+"-lazy.webp",d.media="(min-width: 320px)",d.className="lazy",d.type="image/webp",i.dataset.srcset=DBHelper.imageUrlForRestaurant(e)+"-small_x2.jpg 2x, "+DBHelper.imageUrlForRestaurant(e)+"-small_x1.jpg 1x",i.srcset=DBHelper.imageUrlForRestaurant(e)+"-lazy.jpg",i.media="(min-width: 320px)",i.className="lazy",i.type="image/jpeg",u.dataset.src=DBHelper.imageUrlForRestaurant(e)+"-small_x1.jpg",u.src=DBHelper.imageUrlForRestaurant(e)+"-lazy.jpg",u.className="restaurant-img lazy",u.setAttribute("sizes","(max-width: 1100px) 85vw, (min-width: 1101px) 990px"),u.alt=e.name+"'s restaurant",u.type="image/jpeg",m.innerHTML=getAverageNote(e.reviews)+"/5",p.append(m),r.append(l),r.append(s),r.append(c),r.append(o),r.append(d),r.append(i),r.append(u),n.append(r),n.append(a),t.append(p),t.append(n);var f=document.createElement("h2");f.innerHTML=e.name,a.append(f);var g=document.createElement("p");g.innerHTML=e.neighborhood,t.append(g);var v=document.createElement("p");v.innerHTML=e.address,t.append(v);var h=document.createElement("a");return h.innerHTML="View Details",h.href=DBHelper.urlForRestaurant(e),h.setAttribute("aria-label","View details of "+e.name),t.append(h),t.setAttribute("role","listitem"),t.setAttribute("aria-setsize","10"),t.setAttribute("aria-posinset",e.id),t},addMarkersToMap=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",function(){window.location.href=t.url}),self.markers.push(t)})},addToHomeScreen=function(){var e=document.createElement("aside"),t=document.createElement("p"),n=document.createElement("p"),a=document.createElement("span");e.id="pop",e.className="popup",n.className="popup msg",n.setAttribute("tabindex","2"),t.className="popup note",t.setAttribute("tabindex","1"),a.className="iconicfill-arrow-down",t.innerHTML="(Tap to close)",n.innerHTML='Add <img src="assets/img/svg/share-apple.svg" alt=""> this app to your home screen and enjoy it as a real application !',e.setAttribute("tabindex","-1"),e.addEventListener("click",function(){e.classList.add("hide"),setTimeout(function(){e.style="display: none;"},1e3)}),e.append(t),e.append(n),e.append(a),document.getElementById("maincontent").appendChild(e),e.focus(),setTimeout(function(){e.classList.add("hide")},7e3)};