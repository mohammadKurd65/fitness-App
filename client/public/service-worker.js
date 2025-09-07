// public/service-worker.js

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// تنظیمات Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fittrack-app.firebaseapp.com",
  projectId: "fittrack-app",
  storageBucket: "fittrack-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// کش‌های PWA
const CACHE_NAME = 'fittrack-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/*',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
];

// Install: ذخیره فایل‌ها در کش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/icon-192x192.png',
          '/icon-512x512.png',
          '/apple-touch-icon.png',
          '/offline.html' // اضافه کردن fallback آفلاین
        ]);
      })
  );
});

// Fetch: بارگذاری از کش در صورت عدم دسترسی به شبکه
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // اگر کش موجود است، برگردان
      if (response) return response;

      // اگر کش نبود، سعی کن از شبکه بگیری
      return fetch(event.request).catch(() => {
        // اگر درخواست HTML است، fallback بده
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        // برای بقیه منابع می‌توان null یا response ساده برگرداند
        return new Response('Service unavailable', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});



// Push: دریافت اعلان
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'اعلان جدید';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/icon-192x192.png',
    badge: '/badge.png',
    data: { click_action: payload.data?.clickAction || '/' } // اصلاح
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// وقتی روی اعلان کلیک میشه
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.click_action)
  );
});