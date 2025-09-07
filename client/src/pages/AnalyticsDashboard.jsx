// src/pages/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
LineChart,
Line,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
ComposedChart,
Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const AnalyticsDashboard = () => {
const { user } = useAuth();
const [workouts, setWorkouts] = useState([]);
const [loading, setLoading] = useState(true);

  // داده‌های آماری
const [weightData, setWeightData] = useState([]);
const [volumeData, setVolumeData] = useState([]);
const [activityData, setActivityData] = useState([]);
const [goals, setGoals] = useState({});

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
        setWorkouts(data);
        processAnalytics(data);
        }
    } catch (err) {
        console.error('Failed to fetch workouts:', err);
    } finally {
        setLoading(false);
    }
    };

    fetchWorkouts();
}, []);

  // پردازش داده‌ها
const processAnalytics = (workouts) => {
    // 1. وزن بدن
    const weightPoints = workouts
    .filter(w => w.bodyWeight)
    .map(w => ({
        date: new Date(w.date).toLocaleDateString('fa-IR'),
        weight: w.bodyWeight
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

    setWeightData(weightPoints);

    // 2. حجم تمرین (مثلاً اسکوات)
    const squatData = [];
    workouts.forEach(workout => {
    const squat = workout.exercises.find(ex => ex.name === 'اسکوات');
    if (squat) {
        const volume = squat.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
        squatData.push({
        date: new Date(workout.date).toLocaleDateString('fa-IR'),
        volume,
        maxWeight: Math.max(...squat.sets.map(s => s.weight || 0))
        });
    }
    });
    setVolumeData(squatData);

    // 3. تقویم فعالیت (Heatmap)
    const activityMap = {};
    workouts.forEach(w => {
    const date = new Date(w.date).toLocaleDateString('fa-IR');
    activityMap[date] = (activityMap[date] || 0) + 1;
    });

    const days = [];
    for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('fa-IR');
    days.push({
        date: d.getDate(),
        value: activityMap[dateStr] || 0
    });
    }
    setActivityData(days);

    // 4. هدف‌ها
    const lastWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
    });

    const thisWeekCount = lastWeekWorkouts.length;
    const goalMet = thisWeekCount >= 3;

    setGoals({
    workoutsThisWeek: thisWeekCount,
    goal: 3,
    met: goalMet,
      progress: Math.min(100, (thisWeekCount / 3) * 100)
    });
};

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        در حال بارگذاری آمار...
    </div>
    );
}

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-5xl mx-auto">

        {/* هدر */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">تحلیل پیشرفت شما</h1>
        <p className="text-gray-600">داده‌های شما به صورت هوشمند تحلیل شده‌اند</p>
        </div>

        {/* هشدار هوشمند */}
        {goals.workoutsThisWeek === 0 && (
        <div className="p-4 mb-6 text-center text-yellow-800 bg-yellow-100 rounded-lg">
            🔔 به نظر می‌رسه هفته اخیر تمرین نکردی! بیا یه جلسه ثبت کنیم؟
        </div>
        )}

        {/* نمودار وزن */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">وزن بدن در طول زمان</h2>
        {weightData.length === 0 ? (
            <p className="py-8 text-center text-gray-500">داده‌ای برای وزن ثبت نشده است.</p>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'کیلوگرم', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="وزن (kg)" dot={false} />
            </LineChart>
            </ResponsiveContainer>
        )}
        </div>

        {/* نمودار حجم اسکوات */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">پیشرفت در اسکوات</h2>
        {volumeData.length === 0 ? (
            <p className="py-8 text-center text-gray-500">برای اسکوات داده‌ای وجود ندارد.</p>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={volumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="حجم (کیلو × تکرار)" />
                <Line yAxisId="right" type="monotone" dataKey="maxWeight" stroke="#10b981" name="حداکثر وزن (kg)" dot />
            </ComposedChart>
            </ResponsiveContainer>
        )}
        </div>

        {/* تقویم فعالیت */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">فعالیت اخیر (14 روز)</h2>
        <div className="flex flex-wrap justify-center gap-1">
            {activityData.map((day, i) => (
            <div
                key={i}
                className={`w-6 h-6 rounded-sm text-xs flex items-center justify-center text-white ${
                day.value === 0 ? 'bg-gray-200' :
                day.value === 1 ? 'bg-green-300' :
                day.value === 2 ? 'bg-green-500' :
                'bg-green-700'
                }`}
                title={`${day.value} جلسه`}
            >
                {day.date}
            </div>
            ))}
        </div>
        </div>

        {/* هدف هفتگی */}
        <div className="p-6 mb-8 shadow-lg bg-blue-50 rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-blue-800">هدف هفتگی</h2>
        <p className="mb-3 text-blue-700">
            {goals.met
            ? `🎉 تبریک! این هفته ${goals.workoutsThisWeek} تمرین انجام دادی — هدف رو محقق کردی!`
            : `باقیمانده ${goals.goal - goals.workoutsThisWeek} تمرین تا رسیدن به هدف`}
        </p>
        <div className="w-full h-3 bg-blue-200 rounded-full">
            <div
            className="h-3 transition-all duration-500 bg-blue-600 rounded-full"
            style={{ width: `${goals.progress}%` }}
            ></div>
        </div>
        <p className="mt-1 text-sm text-blue-600">{goals.workoutsThisWeek} از {goals.goal} تمرین</p>
        </div>

        {/* دکمه بازگشت */}
        <div className="text-center">
        <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
        >
            ← بازگشت به داشبورد
        </button>
        </div>
    </div>
    </div>
);
};

export default AnalyticsDashboard;