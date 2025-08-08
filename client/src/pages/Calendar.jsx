// src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const Calendar = () => {
const { user } = useAuth();
const navigate = useNavigate();

const [weekSchedule, setWeekSchedule] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    const fetchSchedule = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/schedule/week', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });

        if (res.ok) {
        const data = await res.json();
        setWeekSchedule(data);
        } else {
        setError('خطا در بارگذاری برنامه‌ها');
        }
    } catch (err) {
        setError('اتصال به سرور برقرار نیست.');
    } finally {
        setLoading(false);
    }
    };

    fetchSchedule();
}, [ user, navigate, setWeekSchedule, setLoading, setError]);

const startWorkout = (dayPlans) => {
    // انتخاب اولین برنامه روز (اگر چند برنامه داشت)
    const plan = dayPlans[0];
    const exercises = plan.exercises.map(ex => ({
      exercise: null, // برای حرکات استاندارد، می‌تونیم بعداً پر کنیم
    name: ex.name,
    sets: [{ reps: '', weight: '', rest: '90' }]
    }));

    // ارسال داده به WorkoutLog از طریق state
    navigate('/workout-log', {
    state: {
        date: new Date().toISOString().split('T')[0],
        exercises,
        fromCalendar: true
    }
    });
};

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        در حال بارگذاری تقویم...
    </div>
    );
}

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-4xl mx-auto">

        {/* هدر */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">تقویم تمرینی</h1>
        <p className="text-gray-600">برنامه‌های خودکار هفتگی شما</p>
        </div>

        {error && (
        <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
        </div>
        )}

        {/* تقویم هفتگی */}
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
        <div className="grid grid-cols-7 py-3 font-semibold text-center text-white bg-blue-600">
            {DAYS.map(day => (
            <div key={day} className="font-medium">{day}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-1 p-2 bg-gray-100 min-h-64">
            {DAYS.map(day => {
            const plans = weekSchedule[day] || [];
            const hasPlan = plans.length > 0;

            return (
                <div
                key={day}
                className={`min-h-24 p-2 border rounded-lg bg-white cursor-pointer hover:shadow transition ${
                    hasPlan ? 'border-blue-300' : 'border-gray-200'
                }`}
                onClick={() => hasPlan && startWorkout(plans)}
                >
                <div className="font-medium text-gray-800">{day}</div>
                {hasPlan ? (
                    <div className="mt-1 space-y-1">
                    {plans.map((p, i) => (
                        <div
                        key={i}
                        className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                        title={p.planName}
                        >
                        {p.planName}
                        </div>
                    ))}
                    <div className="mt-1 text-xs font-medium text-green-600">کلیک کنید</div>
                    </div>
                ) : (
                    <div className="mt-2 text-xs text-gray-400">بدون برنامه</div>
                )}
                </div>
            );
            })}
        </div>
        </div>

        {/* راهنما */}
        <div className="mt-6 text-sm text-center text-gray-500">
        <p>برای شروع تمرین، روی روزی که برنامه دارد کلیک کنید.</p>
        </div>

        {/* لینک به برنامه‌ها */}
        <div className="mt-6 text-center">
        <button
            onClick={() => navigate('/plans')}
            className="text-sm text-purple-600 hover:underline"
        >
            مدیریت برنامه‌های تمرینی
        </button>
        </div>
    </div>
    </div>
);
};

export default Calendar;