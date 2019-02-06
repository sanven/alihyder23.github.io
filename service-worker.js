console.log("SW Startup!");



// Install Service Worker
self.addEventListener('install', function(event){
    console.log('installed!');
});

// Service Worker Active
self.addEventListener('activate', function(event){
    self.clients.claim()
    console.log('activated!');
});

self.addEventListener('message', function(event){
    clearTimeout(self.notificationTimeout);
    self.notificationTimeout = setTimeout(function() {
      self.registration.showNotification(event.data.title, {
        body: event.data.body,
        icon: event.data.icon,
      });
    }, 3500);
    console.log("received lifecheck");
    self.targetPage = event.data.targetUrl;
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
      return clients.openWindow(self.targetPage);
  }));
});