// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios"
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
const Dashboard = () => {
    const { user } = useAuth();
const [recentWorkouts, setRecentWorkouts] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
};

useEffect(() => {
    const fetchWorkouts = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/workouts', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });

        if (res.ok) {
        const data = await res.json();
        setRecentWorkouts(data);
        } else {
        console.error('Failed to fetch workouts');
        }
    } catch (err) {
        console.error('Network error:', err);
    } finally {
        setLoading(false);
    }
    };

    fetchWorkouts();
}, [ navigate, user, setRecentWorkouts, setLoading]);


return (
    
    <div className="min-h-screen px-4 py-8 bg-gray-100">
    <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">خوش آمدی، {user?.name}!</h1>
        <p className="text-gray-600">آخرین فعالیت‌های تمرینی</p>
        </div>

        {/* دکمه ثبت تمرین */}
        <div className="mb-10 text-center">
        <Link
            to="/workout-log"
            className="inline-block px-8 py-4 font-semibold text-white transition bg-blue-600 shadow hover:bg-blue-700 rounded-xl"
        >
            🏋️‍♂️ ثبت تمرین جدید
        </Link>
        <Link to="/exercises" className="text-green-600 hover:underline">
کتابخانه حرکات
</Link>
        </div>

        {/* لیست تمرینات اخیر */}
        <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">تمرینات اخیر</h2>

        {loading ? (
            <p className="py-4 text-center text-gray-500">در حال بارگذاری...</p>
        ) : recentWorkouts.length === 0 ? (
            <p className="py-4 text-center text-gray-500">هنوز تمرینی ثبت نکردی. اولین تمرین رو اضافه کن!</p>
        ) : (
            <ul className="space-y-4">
            {recentWorkouts.map((workout, index) => {
                const date = new Date(workout.date).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
                });

                // نمایش دو حرکت اول
                const exerciseNames = workout.exercises
                .slice(0, 2)
                .map(ex => ex.name)
                .join('، ');

                const moreCount = workout.exercises.length - 2;

                return (
                <li key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800">{date}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                        {exerciseNames}
                        {moreCount > 0 && ` و ${moreCount} حرکت دیگر`}
                        </p>
                    </div>
                    <div className="text-sm text-right text-gray-500">
                        <div>{workout.duration} دقیقه</div>
                        <div>{workout.exercises.length} حرکت</div>
                    </div>
                    </div>
                </li>
                );
            })}
            </ul>
        )}

          {/* لینک به همه تمرینات (در آینده) */}
        <div className="mt-6 text-center">
            <Link to="/workouts" className="text-sm font-medium text-blue-600 hover:underline">
            مشاهده همه تمرینات
            </Link>
        </div>
        </div>

    </div>
    </div>
);
}


export default Dashboard;