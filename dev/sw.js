const window = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this;
const idbKey = require('./js/indexedb');
const DBHelper = require('./js/dbhelper');

const requestFetched = [];
const version = 7;
/**
 * Object containing different cache names.
 */
const CURRENT_CACHES = {
  CACHE_STATIC: 'static-cache-' + version,
  CACHE_MAP: 'map-api-' + version,
  CACHE_FONT: 'google-fonts-' + version
}

/**
 * List of files to add put in cache immediately at first connexion.
 */
const URLS_TO_CACHE = [
  'index.html',
  'manifest.webmanifest',
  'restaurant.html',
  'assets/css/fonts/iconicfill.woff2',
  'assets/css/fonts/fontawesome.woff2',
  'assets/img/svg/puff.svg',
  'assets/img/svg/no-wifi.svg',
  'assets/img/svg/not-favorite.svg',
  'assets/img/svg/favorite.svg',
  'assets/img/png/launchScreen-ipad-9.7.png',
  'assets/img/png/launchScreen-ipadpro-10.5.png',
  'assets/img/png/launchScreen-ipadpro-12.9.png',
  'assets/img/png/launchScreen-iphone-8.png',
  'assets/img/png/launchScreen-iphone-8plus.png',
  'assets/img/png/launchScreen-iphone-x.png',
  'assets/img/png/launchScreen-iphone-se.png',
  'assets/img/png/logo-64.png',
  'assets/img/png/logo-128.png',
  'assets/img/png/logo-256.png',
  'assets/img/png/logo-512.png',
  'assets/css/index.css',
  'assets/css/restaurant_info.css',
  'js/main.js',
  'js/restaurant_info.js'
];

/**
 * Event triggered when a service worker is in installing state, it will add a set of static files.
 */
self.addEventListener('install', event => {
  
  console.log(`SW - Cache version : "${CURRENT_CACHES.CACHE_STATIC}"`);

  event.waitUntil(
    caches.open(CURRENT_CACHES.CACHE_STATIC)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => {
        console.log('SW - All resources cached.');
        self.skipWaiting(),
        console.log('SW - SW version skipped.');
      })
      .catch(error => console.error('SW - Open cache failed :', error))
  );

});

/**
 * Event triggered when a service worker is in activating state, it will remove old cache to keep the latest.
 */
self.addEventListener('activate', event => {
  
  const expectedCaches = Object.keys(CURRENT_CACHES).map(key => CURRENT_CACHES[key]);

  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => {
          if (expectedCaches.indexOf(key) == -1) {
            console.log('SW - Deleting', key);
            return caches.delete(key)
          }
        })
      ))
      .then(() => {
        console.log(`SW - "${CURRENT_CACHES.CACHE_STATIC}" now ready to handle fetches!`);
      })
  );

});

/**
 * Event triggered when a service worker is active and intercepting all request, it will act differentely depending on url request.
 */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const location = window.location;
  switch (url.hostname) {
    case 'maps.gstatic.com':
      event.respondWith(getFromCacheOrFetch(CURRENT_CACHES.CACHE_MAP, event.request));
    break;

    case 'fonts.gstatic.com':
      event.respondWith(getFromCacheOrFetch(CURRENT_CACHES.CACHE_FONT, event.request));
    break;

    case location.hostname:
      if (url.pathname.startsWith('/restaurant.html')) {
        const newPath = url.href.replace(/[?&]id=\d{1,}/, '');
        event.respondWith(getFromCacheOrFetch(CURRENT_CACHES.CACHE_STATIC, newPath));
      }

      else if (url.pathname.startsWith('/restaurants') || url.pathname.startsWith('/reviews')) {
        event.respondWith(fetch(event.request));
      }
      else if (event.request.method !== 'GET') {
        event.respondWith(fetch(event.request))
      }
      else {
        event.respondWith(getFromCacheOrFetch(CURRENT_CACHES.CACHE_STATIC, event.request))
      }
    break;

    default:
      event.respondWith(fetch(event.request));
    break;
  }
  
});

/**
 * Handle any error and return default image if request for webp or jpg fails.
 */
async function handleError(error, { url }) {
  console.error(error);
  if (url.match(/\.(jpe?g|webp)$/i)) {
    const cache = await caches.open(CURRENT_CACHES.CACHE_STATIC);
    return cache.match('assets/img/svg/no-wifi.svg');
  }
}

/**
 * The function name speak for itself ;).
 */
async function getFromCacheOrFetch(cache_id, request) {
  const cache = await caches.open(cache_id);
  const match = await cache.match(request);

  if (match) {
    return match;
  }
  const response = await fetch(request).catch((e) =>  handleError(e, request));
  if (!response.url.match(/no-wifi.svg$/i)) {
    cache.put(request, response.clone());
  }
  return response;
}

/**
 * Function called on "post-review" tag event, it will try to post reviews to server.
 */
async function postLocalReviews() {
  const store = 'posts';
  const reviews = await idbKey.getAll(store).catch(err => console.error(err));
  
  return await Promise.all(reviews
    .map(review => {
      return DBHelper.DATABASE_URL.POST.newReview(review)
        .then(response => {
          console.log('Response after post request', response,'\nStatus :',response.status)
          if (response.status === 201) {
            self.registration.showNotification("Review synchronised to server")
              .then(() => idbKey.delete(store, review.restaurant_id))
          }
          return response;
        })
        .catch(error => {
          self.registration.showNotification("Your review will be posted later");
          console.error('Review not posted',error);
        })
    }))
}

/**
 * Function called on "fetch-new-reviews" tag event, it will add or update new reviews.
 */
const fetchLastReviews = async () => {
  const response = await DBHelper.DATABASE_URL.GET.restaurantReviews(location.search.match(/\d+/)[0]);
  const reviews = await response.json(),
    store = 'reviews';
  reviews.forEach(review => idbKey.set(store, review))
}

self.addEventListener('sync', function (event) {
  if (event.tag === 'post-review') {
    event.waitUntil(postLocalReviews());
  }
  if (event.lastChance) {
    console.log('Last time trying to sync')
  }
  if (event.tag === 'fetch-new-reviews') {
    event.waitUntil(fetchLastReviews())
  }
});