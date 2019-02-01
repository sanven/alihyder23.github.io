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
      self.registration.showNotification(event.data);
    }, 2000);
    self.targetPage = event.data;
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == self.targetPage && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(self.targetPage);
  }));
});