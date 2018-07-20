(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const idbKey = require('./indexedb');

const scheme = 'http://',
  host = 'localhost',
  port = ':1337',
  path = {
    restaurants: '/restaurants/',
    reviews: '/reviews/'
  },
  query = {
    is_favorite: '/?is_favorite=',
    restaurant_id: '?restaurant_id='
  },

  baseURI = scheme + host + port;
  
const DBHelper = {

  DATABASE_URL:{
    GET: {
      allRestaurants: () => fetch(baseURI + path.restaurants),
      allReviews: () => fetch(baseURI + path.reviews),
      restaurant: (id) => fetch(baseURI + path.restaurants + id ),
      restaurantReviews: (id) => fetch(baseURI + path.reviews + query.restaurant_id + id)
    },
    POST: {
      newReview: (body) => fetch(baseURI + path.reviews, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    },
    PUT: {
      favoriteRestaurant: (id, answer) => fetch(baseURI + path.restaurants + id + query.is_favorite + answer, {
        method: 'PUT'
      }),
      updateReview: (id) => fetch(baseURI + path.reviews + id, {
        method: 'PUT'
      })
    },
    DELETE: {
      review: (id) => fetch(baseURI + path.reviews + id, {
        method: 'DELETE'
      })
    }
  },
  /**
   * Fetch all restaurants.
   */
  fetchRestaurants: () => {
    const store = 'restaurants';
    return idbKey.getAll(store)
    .then(restaurants => {
      if (restaurants.length < 10) {
        return DBHelper.DATABASE_URL.GET.allRestaurants()
        .then(response => response.json())
        .then(restaurants => {
          console.log('- Restaurants data fetched !');
          return restaurants.restaurants || restaurants;
        })
        .then(restaurants => {
          restaurants.forEach(restaurant => {
            restaurant.is_favorite = restaurant.is_favorite.toString();
            idbKey.set(store, restaurant);
          });
          return restaurants;
        })
        .catch(error => console.error(`Request failed. Returned status of ${error}`));
      } else {
        return restaurants;
      }
    }).catch(error => {
      console.error(error)
    });
  },
  /**
   * Fetch all reviews.
   */
  fetchReviews: () => {
    return DBHelper.DATABASE_URL.GET.allReviews()
    .then(response => response.json())
    .then(reviews => {
      console.log('- Reviews data fetched !');
      return reviews.reviews || reviews;
    })
    .catch(error => console.error(`Request failed. Returned status of ${error}`));
  },
  
  /**
   * Fetch restaurant reviews.
   */
  fetchRestaurantReviews: async (id) => {
    const store = 'reviews';
    let cachedReviews = await idbKey.getAll(store).catch(error => console.error(error))
    cachedReviews = cachedReviews.filter(review => review.restaurant_id === Number(id));
    
    if (!cachedReviews.length) {
      const response = await DBHelper.DATABASE_URL.GET.restaurantReviews(id).catch(error => console.error(`Request failed. Returned status of ${error}`));
      console.log('- Restaurant reviews fetched !');
      let reviews = await response && response.json();
      reviews = await reviews && reviews.reviews || await reviews;
      await reviews && await reviews.length && await reviews.forEach(review => idbKey.set(store, review));
      return reviews;
    } 
    else {
      return cachedReviews;
    };
  },
  
  /**
   * Fetch a restaurant by its ID.
   */
  fetchRestaurantById: (id) => {
    // fetch all restaurants with proper error handling.
    const store = 'restaurants';

    return idbKey.get(store, Number(id))
      .then((restaurant) => {
        if (!restaurant) {
          console.log('- No restaurant cached');
          return DBHelper.DATABASE_URL.GET.restaurant(id)
            .then(response => response.json())
            .then(restaurant => {
              restaurant.is_favorite = restaurant.is_favorite.toString();
              idbKey.set(store, restaurant);
              return restaurant;
            })
            .catch(error => console.error(`Restaurant does not exist: ${error}`));
        } else {
          return restaurant;
        }
      })
  },

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  fetchRestaurantByCuisineAndNeighborhood: (cuisine, neighborhood) => {
    // Fetch all restaurants
    const store = 'restaurants';
    return idbKey.getAll(store)
      .then((cachedResults) => {
        if (cachedResults.length < 10) {
          return DBHelper.fetchRestaurants()
            .then(restaurants => {
              const results = restaurants;
              results.forEach((restaurant) => idbKey.set(store, restaurant));
              return DBHelper.filterResults(results, cuisine, neighborhood);
            })
            .catch(error => console.error(error));
        } else {
          return DBHelper.filterResults(cachedResults, cuisine, neighborhood);
        }
      }).catch((error) => console.error(error));
  },

  filterResults: (results, cuisine, neighborhood) => {
    if (cuisine !== 'all') {
      results = results.filter(restaurant => restaurant.cuisine_type == cuisine);
    }
    if (neighborhood !== 'all') {
      results = results.filter(restaurant => restaurant.neighborhood == neighborhood);
    }
    return results;
  },
  /**
   * Fetch all neighborhoods with proper error handling.
   */
  addNeighborhoodsOptions: (restaurants) => {
    // Get all neighborhoods from all restaurants
    const neighborhoods = restaurants.map(restaurant => restaurant.neighborhood);
    // Remove duplicates from neighborhoods
    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
    return uniqueNeighborhoods;
  },

  /**
   * Fetch all cuisines with proper error handling.
   */
  addCuisinesOptions: (restaurants) => {
    // Get all cuisines from all restaurants
    const cuisines = restaurants.map(restaurant => restaurant.cuisine_type);
    // Remove duplicates from cuisines
    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
    return uniqueCuisines;
  },

  /**
   * Restaurant page URL.
   */
  urlForRestaurant: (restaurant) => {
    return (`restaurant.html?id=${restaurant.id}`);
  },

  /**
   * Restaurant image URL.
   */
  imageUrlForRestaurant: (restaurant) => {
    return (`assets/img/jpg/${restaurant.photograph}`);
  },
  
  imageWebpUrlForRestaurant: (restaurant) => {
    return (`assets/img/webp/${restaurant.photograph}`);
  },

  postReview: async (e) => {
    console.log('Trying to post review...')
    e.preventDefault();
    const form = document.querySelector('#title-container form').elements;
    const body = {
      restaurant_id: Number(window.location.search.match(/\d+/)[0]),
      name: form["name"].value,
      rating: Number(form["rating"].value),
      comments: form["comments"].value,
    }
    await idbKey.set('posts', body);
    body.createdAt = Date.now(),
    body.updatedAt = Date.now();
    await idbKey.addReview('reviews', body);
    const registration = await navigator.serviceWorker.ready
    Notification.requestPermission()
      .then(function (result) {
        if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
        }
        if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
        }
        if (result === 'granted') { 
          console.log('Notification allowed')
        }
      });
    await registration.sync.register('post-review');
    location.reload();
  },

  setFavorite: async (target, restaurant, button, secondTarget) => {
    target.classList.toggle('hidden');
    const favorite = restaurant.is_favorite === 'true'? 'false' : 'true';
    const store = 'restaurants';
    button.setAttribute('aria-label', target.classList.contains('hidden') ? 'unset this restaurant as favorite':'set this restaurant as favorite');
    target.setAttribute('aria-hidden', restaurant.is_favorite === 'true' ? 'true':'false');
    secondTarget.setAttribute('aria-hidden', restaurant.is_favorite === 'true' ? 'false':'true');
    restaurant.is_favorite = favorite;
    await idbKey.set(store, restaurant);
    return await DBHelper.DATABASE_URL.PUT.favoriteRestaurant(restaurant.id, favorite);
  },
  /**
   * Map marker for a restaurant.
   */
  mapMarkerForRestaurant: (restaurant, map) => {
    const marker = new google.maps.Marker({
      position: {
        lat: restaurant.lat || restaurant.latlng.lat,
        lng: restaurant.lng || restaurant.latlng.lng
      },
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'assets/img/svg/marker.svg'
    });
    return marker;
  }
};

module.exports = DBHelper;
},{"./indexedb":2}],2:[function(require,module,exports){
const idb = require('../../node_modules/idb/lib/idb');

/**
 * function connect to indexedDB and all it differents ObjectStore.
 */
const openDatabase = () => {
  return idb.open('restaurant-reviews', 3, (upgradeDb) => {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
      case 1:
        upgradeDb.createObjectStore('reviews', { keyPath: 'id', autoIncrement:true});
      case 1:
        upgradeDb.createObjectStore('posts', {keyPath: 'restaurant_id'});
    }
  })
};

/**
 * All types of actions that can be made in indexedDB.
 */
const idbKey = {
  get(store, key) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .get(key);
    }).catch(error => console.error(error));
  },
  set(store, value) {
    return openDatabase().then(db => {
      if (!db) return;
      const tx = db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .put(value);
      return tx.complete;
    }).catch(error => console.error(error));
  },
  getAll(store) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .getAll();
    }).catch(error => console.error(error));
  },
  delete(store, id) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .delete(id);
    }).catch(error => console.error(error));
  },
  addReview(store, review) {
    return openDatabase().then(db => {
      if (!db) {
        return;
      }
      return db
        .transaction(store, 'readwrite')
        .objectStore(store)
        .add(review);
    }).catch(error => console.error(error));
  },
  getRestaurantReviews(store, key) {
    return openDatabase().then(db => {
      if (!db) return;
      return db
        .transaction(store)
        .objectStore(store)
        .getAll()
        .then(reviews => reviews.filter(review => review.restaurant_id === key))
    }).catch(error => console.error(error));
  }
};
module.exports = idbKey;
},{"../../node_modules/idb/lib/idb":4}],3:[function(require,module,exports){
(function (global){
const window = (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this;
const idbKey = require('./js/indexedb');
const DBHelper = require('./js/dbhelper');

const version = 2;
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
async function postLocalReviews(count = 0) {
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
          if (count === 0) {
            self.registration.showNotification("Your review will be posted later");
          }
          console.error('Review not posted', error);
          setTimeout(() => postLocalReviews(1), 10000);
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

/**
 * Function triggered by sync registration.
 */
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./js/dbhelper":1,"./js/indexedb":2}],4:[function(require,module,exports){
'use strict';

(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());

},{}]},{},[3]);
