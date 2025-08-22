// src/components/NotificationManager.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messaging, getToken } from '../firebase';

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // در آینده برای Push Server

const urlB64ToUint8Array = (base64String) => {const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
const rawData = window.atob(base64);
return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
};

const NotificationManager = () => {
const { user } = useAuth();

 useEffect(() => {
    if (!user) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('مجوز اعلان داده نشد.');
          return;
        }

        // دریافت FCM Token
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_PUBLIC_KEY' // از Firebase Cloud Messaging
        });

        if (token) {
          console.log('FCM Token:', token);

          // ارسال توکن به سرور برای ذخیره
          await fetch('http://localhost:5000/api/users/update-fcm-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ fcmToken: token })
          });
        } else {
          console.log('نو دستگاه فعال نیست.');
        }
      } catch (err) {
        console.error('خطا در دریافت FCM Token:', err);
      }
    };

    requestPermission();
  }, [user]);

const registerServiceWorker = async () => {
    try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker ثبت شد.');

      // دریافت مجوز
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('مجوز اعلان داده نشد.');
        return;
    }

      // مشترک شدن در Push Service
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log('مشترک شد:', subscription);

      // در آینده: ارسال subscription به سرور
      // await fetch('/api/notifications/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // });

    } catch (err) {
    console.error('خطا در ثبت Push:', err);
    }
};

  return null; // این کامپوننت فقط منطق اجرا می‌کند
};

export default NotificationManager;