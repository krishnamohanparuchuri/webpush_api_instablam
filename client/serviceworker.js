console.log('Service Worker Loaded...');

const cacheName = 'version4';


//call install event
self.addEventListener('install', e => {
    console.log('Service worker : Installed')
})

//activate event
self.addEventListener('activate', e => {
    console.log('Service worker : Activated');
    //remove the older cache files
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('service worker :clearing old cache')
                        return caches.delete(cache)
                    }

                })
            )
        })
    )
})

self.addEventListener('fetch', e => {
    console.log('Service worker : fetched');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            //make a clone/copy of respone
            const resClone = res.clone();
            caches.open(cacheName)
                .then(cache => {
                    //add response to cache
                    cache.put(e.request, resClone)
                });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    )
})

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push recevied...')
    self.registration.showNotification(data.title, {
        body: "send notification from the instablam app krishna",
        icon: "images/icons/icon-72x72.png"
    })
})