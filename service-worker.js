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
      self.registration.showNotification(event.data, {
        title: "Please provide feedback!";
      });
    }, 2000);
    self.targetPage = event.data;
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
      return clients.openWindow(self.targetPage);
  }));
});