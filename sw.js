const CACHE_NAME = 'purpl3l3an-cache-v1';

// File statici principali da salvare immediatamente in cache (App Shell)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './favicon.ico' // La tua icona appena aggiunta
];

// 1. Installazione: Creazione della cache e salvataggio degli asset statici
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Forza il Service Worker attivo a prendere subito il controllo
    self.skipWaiting();
});

// 2. Attivazione: Pulizia di vecchie cache precedenti
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Rimozione vecchia cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch: Gestione delle richieste di rete e strategie di caching
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Gestione speciale per i file audio (.mp3 o .m4a) e font esterni
    // Usiamo una strategia "Cache First" per i media per risparmiare dati e migliorare lo streaming
    if (url.pathname.includes('/music/') || url.hostname.includes('fonticons') || url.hostname.includes('scdn.co')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((networkResponse) => {
                    // Controlliamo che la risposta sia valida prima di metterla in cache
                    if (networkResponse.status === 200 || networkResponse.status === 206) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Fallback silenzioso se la rete fallisce e non c'è cache per i media
                });
            })
        );
    } else {
        // Strategia "Network First" per i file di testo/codice (HTML/JS) per garantire aggiornamenti immediati
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Se offline, prova a pescare dalla cache
                    return caches.match(event.request);
                })
        );
    }
});