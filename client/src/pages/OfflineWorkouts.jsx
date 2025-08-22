// src/pages/OfflineWorkouts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOfflineWorkouts, removeFromOfflineQueue, syncOfflineWorkouts } from '../components/OfflineSyncManager';

const OfflineWorkouts = () => {
const { user } = useAuth();
const [workouts, setWorkouts] = useState([]);
const [loading, setLoading] = useState(false);
const [syncing, setSyncing] = useState({});

  // بارگذاری تمرین‌های آفلاین
const loadWorkouts = async () => {
    const offlineWorkouts = await getOfflineWorkouts();
    setWorkouts(offlineWorkouts);
};

useEffect(() => {
    loadWorkouts();
}, []);

  // همگام‌سازی یک تمرین
const handleSync = async (id) => {
    setSyncing(prev => ({ ...prev, [id]: true }));
    try {
    const workout = workouts.find(w => w.id === id);
    const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(workout)
    });

    if (res.ok) {
        await removeFromOfflineQueue(id);
        setWorkouts(prev => prev.filter(w => w.id !== id));
        alert('تمرین با موفقیت همگام شد.');
    } else {
        const data = await res.json();
        alert(`خطا در همگام‌سازی: ${data.message || 'ناشناخته'}`);
    }
    } catch (err) {
    alert('اتصال به سرور برقرار نیست. بعداً دوباره امتحان کنید.');
    } finally {
    setSyncing(prev => ({ ...prev, [id]: false }));
    }
};

  // همگام‌سازی همه تمرین‌ها
const handleSyncAll = async () => {
    if (workouts.length === 0) return;

    setLoading(true);
    if (user?.token) {
    await syncOfflineWorkouts(user.token);
    }
    await loadWorkouts(); // بارگذاری مجدد
    setLoading(false);
    alert('همگام‌سازی همه تمرین‌ها انجام شد.');
};

  // حذف یک تمرین آفلاین
const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این تمرین آفلاین اطمینان دارید؟')) return;

    await removeFromOfflineQueue(id);
    setWorkouts(prev => prev.filter(w => w.id !== id));
};

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-3xl mx-auto">

        {/* هدر */}
        <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">تمرین‌های آفلاین</h1>
        <p className="text-gray-600">تمرین‌هایی که در حالت بدون اینترنت ثبت کردید</p>
        </div>

        {/* دکمه Sync All */}
        <div className="flex justify-between mb-6">
        <button
            onClick={handleSyncAll}
            disabled={loading || workouts.length === 0}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
            {loading ? 'در حال همگام‌سازی...' : 'همگام‌سازی همه'}
        </button>
        <button
            onClick={loadWorkouts}
            className="text-sm text-blue-600 hover:underline"
        >
            بروزرسانی
        </button>
        </div>

        {/* لیست تمرین‌ها */}
        {workouts.length === 0 ? (
        <div className="py-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">هیچ تمرین آفلاینی وجود ندارد.</p>
        </div>
        ) : (
        <ul className="space-y-4">
            {workouts.map(workout => (
            <li key={workout.id} className="p-5 bg-white border shadow-sm rounded-xl">
                <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-800">
                    تمرین در {new Date(workout.date).toLocaleDateString('fa-IR')}
                    </h3>
                    <p className="text-sm text-gray-600">
                    {workout.exercises.length} حرکت
                    </p>
                </div>
                <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                    آفلاین
                </span>
                </div>

                <div className="flex gap-2">
                <button
                    onClick={() => handleSync(workout.id)}
                    disabled={syncing[workout.id]}
                    className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {syncing[workout.id] ? 'در حال ارسال...' : 'همگام‌سازی'}
                </button>
                <button
                    onClick={() => handleDelete(workout.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                >
                    حذف
                </button>
                </div>
            </li>
            ))}
        </ul>
        )}

        {/* لینک بازگشت */}
        <div className="mt-8 text-center">
        <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
        >
            ← بازگشت
        </button>
        </div>
    </div>
    </div>
);
};

export default OfflineWorkouts;