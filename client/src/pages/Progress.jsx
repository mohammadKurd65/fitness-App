
import React, { useState, useEffect } from 'react';
import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
 ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const Progress = () => {
const { user } = useAuth();
const [workouts, setWorkouts] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedExercise, setSelectedExercise] = useState('');

  // داده‌های پیشرفت وزن بدن
const [weightData, setWeightData] = useState([]);

  // داده‌های پیشرفت حجم حرکت
const [volumeData, setVolumeData] = useState([]);

  // لیست حرکات منحصر به فرد
const [exerciseOptions, setExerciseOptions] = useState([]);

  // بارگذاری تمرینات
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

          // استخراج داده‌های وزن بدن (اگر در تمرینات ثبت شده باشد)
        const weightPoints = data
            .filter(w => w.bodyWeight)
            .map(w => ({
            date: new Date(w.date).toLocaleDateString('fa-IR'),
            weight: w.bodyWeight
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        setWeightData(weightPoints);

          // استخراج حرکات منحصر به فرد
        const exercisesSet = new Set();
        data.forEach(workout => {
            workout.exercises.forEach(ex => exercisesSet.add(ex.name));
        });
        const exercisesList = Array.from(exercisesSet).sort();
        setExerciseOptions(exercisesList);

          // اگر حرکتی انتخاب شده باشد، داده‌های آن را بساز
        if (exercisesList.length > 0 && selectedExercise) {
            buildVolumeData(data, selectedExercise);
        }
        }
    } catch (err) {
        console.error('Failed to fetch workouts:', err);
    } finally {
        setLoading(false);
    }
    };

    fetchWorkouts();
}, [selectedExercise, user]);

  // ساخت داده‌های حجم برای یک حرکت خاص
const buildVolumeData = (workouts, exerciseName) => {
    const data = [];

    workouts.forEach(workout => {
    const exercise = workout.exercises.find(ex => ex.name === exerciseName);
    if (exercise) {
        // حداکثر وزن در ست‌ها
        const maxWeight = Math.max(...exercise.sets.map(s => s.weight || 0));
        if (maxWeight > 0) {
        data.push({
            date: new Date(workout.date).toLocaleDateString('fa-IR'),
            weight: maxWeight
        });
        }
    }
    });

    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setVolumeData(data);
};

  // هنگام تغییر حرکت
const handleExerciseChange = (e) => {
    const name = e.target.value;
    setSelectedExercise(name);
};

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        در حال بارگذاری داده‌های پیشرفت...
    </div>
    );
}

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-5xl mx-auto">

        {/* هدر */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">پیشرفت شما</h1>
        <p className="text-gray-600">تبریک! مسیر تناسب اندام رو با دقت طی می‌کنی</p>
        </div>

        {/* نمودار وزن */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">وزن بدن در طول زمان</h2>
        {weightData.length === 0 ? (
            <p className="py-8 text-center text-gray-500">هنوز وزنی ثبت نکردید.</p>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'کیلوگرم', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="وزن (kg)" />
            </LineChart>
            </ResponsiveContainer>
        )}
        </div>

        {/* نمودار حجم حرکت */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">پیشرفت در حرکات</h2>

        {exerciseOptions.length === 0 ? (
            <p className="py-8 text-center text-gray-500">هنوز تمرینی ثبت نکردید.</p>
        ) : (
            <>
            <div className="mb-6">
                <label htmlFor="exercise" className="block mb-1 text-sm font-medium text-gray-700">
                انتخاب حرکت
                </label>
                <select
                id="exercise"
                value={selectedExercise}
                onChange={handleExerciseChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none md:w-64 focus:ring-2 focus:ring-blue-500"
                >
                <option value="">یک حرکت انتخاب کنید</option>
                {exerciseOptions.map(name => (
                    <option key={name} value={name}>{name}</option>
                ))}
                </select>
            </div>

            {selectedExercise && volumeData.length === 0 ? (
                <p className="py-8 text-center text-gray-500">برای این حرکت داده‌ای وجود ندارد.</p>
            ) : selectedExercise ? (
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'وزن (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" name="حداکثر وزن" />
                </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="py-8 text-center text-gray-500">برای مشاهده نمودار، یک حرکت انتخاب کنید.</p>
            )}
            </>
        )}
        </div>

        {/* دکمه بازگشت */}
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

export default Progress;