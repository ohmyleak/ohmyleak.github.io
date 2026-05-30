const CACHE_NAME = 'purpl3l3an-cache-v3';

const STATIC_ASSETS = [
    './',
    './index.html',
    './favicon.ico'
];

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
    'music/_bilico_.m4a',
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

// Installazione atomica pezzo per pezzo
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[SW] Start caching...');
            
            try {
                await cache.addAll(STATIC_ASSETS);
                console.log('[SW] Asset statici salvati.');
            } catch (e) {
                console.error('[SW] Errore asset statici', e);
            }

            for (const track of MUSIC_ASSETS) {
                try {
                    await cache.add(track);
                    console.log(`[SW] In cache: ${track}`);
                } catch (err) {
                    console.warn(`[SW] Nome errato o file mancante: ${track}`);
                }
            }
            console.log('[SW] Caching completato!');
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => {
                if (k !== CACHE_NAME) return caches.delete(k);
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => {
            return res || fetch(event.request).then((networkRes) => {
                if (networkRes.status === 200) {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return networkRes;
            });
        })
    );
});
