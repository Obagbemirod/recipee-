self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body || 'Time for your meal!',
    icon: '/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png',
    badge: '/lovable-uploads/05699ffd-835b-45ce-9597-5e523e4bdf98.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Recipee Meal Reminder', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});