const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200]
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60
    })
  ]
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

// Register a route handler for caching assets (stylesheets, scripts, workers)
registerRoute(
  // Match requests with style, script or worker destination
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  // Use Stale-While-Revalidate caching strategy
  new StaleWhileRevalidate({
    // Name of the cache for assets
    cacheName: 'asset-cache',
    plugins: [
      // Plugin to configure cachable responses
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
