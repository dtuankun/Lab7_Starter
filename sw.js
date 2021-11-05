// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';
const urlsToCache = [
  'index.html',
  'assets/scripts/main.js',
  'assets/scripts/Router.js',
  'assets/styles/main.css',
  'assets/components/RecipeCard.js',
  'assets/components/RecipeExpand.js',
  'assets/images/icons/0-star.svg',
  'assets/images/icons/1-star.svg',
  'assets/images/icons/2-star.svg',
  'assets/images/icons/3-star.svg',
  'assets/images/icons/4-star.svg',
  'assets/images/icons/5-star.svg',
  'assets/images/icons/arrow-down.png',
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json',
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/delish-190807-ghost-cookies-0031-landscape-pf-1566483952.jpg',
  'https://www.recipetineats.com/wp-content/uploads/2020/08/My-best-Vanilla-Cake_9.jpg',
  'https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-1.jpg',
  'https://www.howsweeteats.com/wp-content/uploads/2020/11/best-stuffing-12.jpg',
  'https://tastesbetterfromscratch.com/wp-content/uploads/2017/07/Easy-No-Fuss-Thanksgiving-Turkey-14.jpg',
  'https://cdn.sallysbakingaddiction.com/wp-content/uploads/2014/10/sallys-baking-addiction-pumpkin-pie-2',
];

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  console.log('active');
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
