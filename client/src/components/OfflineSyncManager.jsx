// src/components/OfflineSyncManager.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { openDB } from 'idb';

const DB_NAME = 'FitTrackDB';
const DB_VERSION = 1;
const STORE_NAME = 'pendingWorkouts';

let db;

// باز کردن یا ایجاد IndexedDB
const initDB = async () => {
if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains(STORE_NAME)) {
        upgradeDB.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
        });
        }
    },
    });
}
return db;
};

// اضافه کردن تمرین به صف آفلاین
export const addToOfflineQueue = async (workoutData) => {
const database = await initDB();
await database.add(STORE_NAME, {
    ...workoutData,
    createdAt: new Date().toISOString(),
    synced: false,
});
console.log('💾 تمرین به صف آفلاین اضافه شد');
};

// دریافت تمرین‌های آفلاین
export const getOfflineWorkouts = async () => { const database = await initDB();
return await database.getAll(STORE_NAME);
};

// حذف تمرین از صف آفلاین
export const removeFromOfflineQueue = async (id) => {
const database = await initDB();
await database.delete(STORE_NAME, id);
console.log('🗑️ تمرین حذف شد:', id);
};

// همگام‌سازی خودکار با سرور
const syncOfflineWorkouts = async (token) => {
const pendingWorkouts = await getOfflineWorkouts();
for (const workout of pendingWorkouts) {
    try {
    const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
    });

    if (res.ok) {
        await removeFromOfflineQueue(workout.id);
        console.log('✅ تمرین همگام‌سازی شد:', workout.id);
    } else {
        console.warn('❌ خطا در همگام‌سازی:', workout.id, res.status);
    }
    } catch (err) {
    console.warn('⚠️ همگام‌سازی ناموفق برای:', workout.id, err);
      continue; // بقیه تمرین‌ها رو هم امتحان کن
    }
}
};

// مدیریت آفلاین و Sync
const OfflineSyncManager = () => {
const { user } = useAuth();

useEffect(() => {
    initDB();

    const handleOnline = () => {
    if (user?.token) {
        syncOfflineWorkouts(user.token);
    }
    };

    window.addEventListener('online', handleOnline);

    if (navigator.onLine && user?.token) {
    syncOfflineWorkouts(user.token);
    }

    return () => window.removeEventListener('online', handleOnline);
}, [user]);

return null;
};

export default OfflineSyncManager;
