console.log("SW Startup!");

// Install Service Worker
self.addEventListener('install', function(event){
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
    console.log("installed!");
});

// Service Worker Active
self.addEventListener('activate', function(event){
    event.waitUntil(self.clients.claim());
    console.log('activated!');
});

self.addEventListener('message', function(event){
  self.notificationData = {};
  self.notificationData.title = event.data.title;
  self.notificationData.body = event.data.body;
  self.notificationData.icon = event.data.icon;
  self.notificationData.targetPage = event.data.targetUrl;
  self.notificationShown = false;

  self.notificationInterval = setInterval(function() {
    clients.matchAll({
      type: "window"
    }).then(function(clientList) {
        console.log(clientList);
        // if visitor has closed out of all tabs
        if (clientList.length === 0 && !self.notificationShown) {
          clearInterval(self.notificationInterval);
          self.notificationShown = true;
          self.registration.showNotification(self.notificationData.title, {
            body: self.notificationData.body,
            icon: self.notificationData.icon,
          });
        }
    });
  }, 3000);

  console.log("received notification data and it has been set");
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
      return clients.openWindow(self.notificationData.targetPage);
  }));
});