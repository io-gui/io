const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

const version = '0.0.22';
const cacheName = `arodic-${version}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('sw installed');
});

const hostPattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
// self.addEventListener('fetch', (event) => {
//
//   const hostUrl = hostPattern.exec(event.request.url);
//   const hostRef = hostPattern.exec(event.request.referrer);
//
//   if (!hostRef || !hostUrl || hostRef[2] !== hostUrl[2]) {
//     event.respondWith(fetch(event.request));
//     return;
//   }
//
//   event.respondWith(
//     caches.open(cacheName)
//     .then(cache => {
//       setTimeout(() => {
//         cache.addAll([event.request]);
//       });
//       return cache.match(event.request, {ignoreSearch: event.request.url.indexOf('?') != -1});
//     })
//     .then(response => {
//       if (response && response.redirected) {
//         return fetch(event.request);
//       }
//       if (!response && !hostRef) {
//         caches.open(cacheName)
//         .then(cache => {
//           cache.addAll([event.request.url]);
//         });
//       }
//       return response || fetch(event.request);
//     }).catch(console.error)
//   );
// });

self.addEventListener('activate', async (event) => {
  event.waitUntil(self.clients.claim());
  console.log('sw activated');
});

self.addEventListener('message', async (event) => {
  switch (event.data.command) {
    case "subscribe":
      try {
        const applicationServerKey = urlB64ToUint8Array('BPZ6Tyf3h6EvdLkX07j4PyimVrsjIY7-pLHWsp_ls1FRe1-pD3ZJPXl4iSt7B3OarLtQrof3OioPM3yDxqhn-P4');
        const subscription = await self.registration.pushManager.subscribe({ applicationServerKey, userVisibleOnly: true });
        console.log('sw subscribed');
        clients.matchAll({type: "window"}).then((clientList) => {
          for (var i = 0; i < clientList.length; i++) {
            clientList[i].postMessage(JSON.stringify({subscription: subscription}));
          }
        });
      } catch (err) {
        console.log('Error', err);
      }
      break;
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon : './images/logo/io-512.png',
    image : './images/logo/io-512.png',
    badge : './images/logo/io-512.png',
    requireInteraction: true,
  }
  const notification = self.registration.showNotification('Hello', options);
  notification.onclick = function () {
    parent.focus();
    window.focus();
    this.close();
  };
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = 'https://akirodic.com/#page=Updates';
  event.waitUntil(
    clients.matchAll({type: "window"}).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
