const CACHE_NAME = 'dicoding-story-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/styles/main.css',
    '/src/styles/transitions.css',
    '/src/app.js',
    '/src/main.js',
    '/src/assets/3918386.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', event => {
    const payload = event.data ? JSON.parse(event.data.text()) : {};
    const title = payload.title || 'Dicoding Story';
    const options = {
        body: payload.options?.body || 'You have a new notification',
        icon: '/src/assets/3918386.jpg',
        badge: '/src/assets/3918386.jpg'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://story-api.dicoding.dev')
    );
});