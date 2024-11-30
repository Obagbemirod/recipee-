self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png',
    badge: '/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png'
  };

  event.waitUntil(
    self.registration.showNotification('Recipee Meal Reminder', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});