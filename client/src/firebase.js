// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// تنظیمات Firebase (از Project Settings > General)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fittrack-app.firebaseapp.com",
  projectId: "fittrack-app",
  storageBucket: "fittrack-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-XXXXX"
};

// ایجاد اپلیکیشن Firebase
const app = initializeApp(firebaseConfig);

// دریافت سرویس Messaging
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };