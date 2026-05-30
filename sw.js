const CACHE_NAME = 'purpl3l3an-cache-v2'; // Aggiornato la versione per forzare il refresh

// 1. Elenco di TUTTI i file di sistema e della grafica
const STATIC_ASSETS = [
    './',
    './index.html',
    './favicon.ico'
];

// 2. Elenco completo di tutte le tue tracce audio
// Il Service Worker le scaricherà in background non appena aprirai il sito con internet attivo
const MUSIC_ASSETS = [
    'music/dazero.mp3',
    'music/!ly.mp3',
    'music/molecole.mp3',
    'music/Lulu.mp3',
    'music/m12ano.m4a',
    'music/prendimilemani.m4a',
    'music/comet!vorre!.m4a',
    'music/StarShopping.mp3',
    'music/spigoli.m4a',
    'music/grazieadio.m4a',
    'music/occh1purpl3.m4a',
    'music/sillycup.mp3',
    'music/reflections.mp3',
    'music/eglièilre.m4a',
    'music/postomio.m4a',
    'music/blesssubless.m4a',
    'music/backtoback.m4a',
    'music/comepolvere.m4a',
    'music/sochecisei.m4a',
    'music/oneking.m4a',
    'music/occhimiei.m4a',
    'music/comefa1.m4a',
    'music/2ollipop.m4a',
    'music/pers0na2.m4a',
    'music/scuol4.m4a',
    'music/5olo.m4a',
    'music/6itchremix.m4a',
    'music/blun7aswishland.m4a',
    'music/m8nstar.m4a',
    'music/oh9od.m4a',
    'music/gua10.m4a',
    'music/parano1ak1d.m4a',
    'music/no14.m4a',
    'music/ch15eite.m4a',
    'music/sw1n6o.m4a',
    'music/7rapperma1.m4a',
    'music/8rosk1.m4a',
    'music/bubb1e9um.m4a',
    'music/mar+e.m4a',
    'music/okk@pp@.m4a',
    'music/l%p.m4a',
    '_bilico_.m4a',
    'music/r()t()nda.m4a',
    'music/ye@h.m4a',
    'music/come t! vorre!.m4a',
    'music/rock & rolla.m4a',
    'music/sci@ll@.m4a',
    'music/r!va.m4a',
    'music/mi @mi o è f@ke.m4a',
    'music/s!r!.m4a',
    'music/b@by nel bed.m4a',
    'music/cas!no nella m!a testa.m4a',
    'music/w()ah.m4a',
    'music/c!ao.m4a',
    'music/bling.m4a',
    'music/m%n.m4a'
];

// Uniamo tutto in un unico grande zaino da salvare subito
const ALL_ASSETS = [...STATIC_ASSETS, ...MUSIC_ASSETS];

// Installazione: scarica TUTTO subito in cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Scaricamento e caching di tutta la libreria musicale...');
            // Usiamo un ciclo o andiamo tolleranti se qualche traccia manca fisicamente nella cartella
            return cache.addAll(ALL_ASSETS).catch(err => {
                console.error('[Service Worker] Errore nel pre-cache, assicurati che tutti i file esistano:', err);
            });
        })
    );
    self.skipWaiting();
});

// Attivazione: eliminiamo la vecchia cache v1
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

// Fetch: Rispondi dalla cache se presente (ottimo per l'offline completo)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Se c'è in cache (anche offline), usa questo!
            }
            
            // Se non c'è in cache, prova ad andare in rete
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });
        })
    );
});