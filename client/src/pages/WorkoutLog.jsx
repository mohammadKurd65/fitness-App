// src/pages/WorkoutLog.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MOCK_EXERCISES = [
'اسکوات', 'دمبل پرس', 'کشش دمبل', 'پرس سینه', 'پول‌آپ',
'دیپ', 'لاین جک', 'کراس اور', 'پرس شانه', 'جلو بازو',
'پشت بازو', 'هک اسکوات', 'ربل بک', 'کدومیت'
];

const WorkoutLog = () => {
const { user } = useAuth();
const navigate = useNavigate();

const [workout, setWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    exercises: [
    { name: '', sets: [{ reps: '', weight: '', rest: '90' }] }
    ]
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const addExercise = () => {
    setWorkout({
    ...workout,
    exercises: [...workout.exercises, { name: '', sets: [{ reps: '', weight: '', rest: '90' }] }]
    });
};

const removeExercise = (index) => {
    const newExercises = workout.exercises.filter((_, i) => i !== index);
    setWorkout({ ...workout, exercises: newExercises });
};

const updateExercise = (index, field, value) => {
    const newExercises = [...workout.exercises];
    newExercises[index][field] = value;
    setWorkout({ ...workout, exercises: newExercises });
};

const addSet = (exerciseIndex) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '', rest: '90' });
    setWorkout({ ...workout, exercises: newExercises });
};

const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...workout.exercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setWorkout({ ...workout, exercises: newExercises });
    }
};

const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setWorkout({ ...workout, exercises: newExercises });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(workout)
    });

    if (res.ok) {
        alert('تمرین با موفقیت ذخیره شد!');
        navigate('/dashboard');
    } else {
        const data = await res.json();
        setError(data.message || 'خطا در ذخیره');
    }
    } catch (err) {
    setError('اتصال به سرور برقرار نیست.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-3xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">ثبت تمرین جدید</h1>

        {error && (
        <div className="p-3 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* تاریخ و مدت */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">تاریخ</label>
            <input
                type="date"
                value={workout.date}
                onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
            <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">مدت (دقیقه)</label>
            <input
                type="number"
                placeholder="60"
                value={workout.duration}
                onChange={(e) => setWorkout({ ...workout, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
        </div>

          {/* یادداشت */}
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">یادداشت (اختیاری)</label>
            <textarea
            value={workout.notes}
            onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="احساس خوبی داشتم، انرژی بالا..."
            />
        </div>

          {/* لیست حرکات */}
        <div className="pt-6 border-t">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">حرکات</h2>

            {workout.exercises.map((exercise, exIndex) => (
            <div key={exIndex} className="relative p-4 mb-4 border rounded-lg bg-gray-50">
                <button
                type="button"
                onClick={() => removeExercise(exIndex)}
                className="absolute text-sm text-red-500 top-2 right-2 hover:text-red-700"
                >
                حذف
                </button>

                <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">نام حرکت</label>
                <select
                    value={exercise.name}
                    onChange={(e) => updateExercise(exIndex, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">یک حرکت انتخاب کنید</option>
                    {MOCK_EXERCISES.map((ex, i) => (
                    <option key={i} value={ex}>{ex}</option>
                    ))}
                </select>
                </div>

                {/* ست‌ها */}
                <div className="mb-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-800">ست‌ها:</h3>
                {exercise.sets.map((set, sIndex) => (
                    <div key={sIndex} className="flex items-end gap-2">
                    <div className="grid flex-1 grid-cols-3 gap-2">
                        <input
                        type="number"
                        placeholder="تکرار"
                        value={set.reps}
                        onChange={(e) => updateSet(exIndex, sIndex, 'reps', e.target.value)}
                        className="px-3 py-2 text-center border border-gray-300 rounded"
                        required
                        />
                        <input
                        type="number"
                        placeholder="وزن (کیلو)"
                        value={set.weight}
                        onChange={(e) => updateSet(exIndex, sIndex, 'weight', e.target.value)}
                        className="px-3 py-2 text-center border border-gray-300 rounded"
                        required
                        />
                        <input
                        type="number"
                        placeholder="استراحت (ثانیه)"
                        value={set.rest}
                        onChange={(e) => updateSet(exIndex, sIndex, 'rest', e.target.value)}
                        className="px-3 py-2 text-center border border-gray-300 rounded"
                        />
                    </div>
                    {exercise.sets.length > 1 && (
                        <button
                        type="button"
                        onClick={() => removeSet(exIndex, sIndex)}
                        className="text-sm text-red-500 hover:text-red-700"
                        >
                        حذف
                        </button>
                    )}
                    </div>
                ))}
                </div>

                <button
                type="button"
                onClick={() => addSet(exIndex)}
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                + اضافه کردن ست
                </button>
            </div>
            ))}

            <button
            type="button"
            onClick={addExercise}
            className="text-sm font-medium text-green-600 hover:text-green-800"
            >
            + اضافه کردن حرکت جدید
            </button>
        </div>

          {/* دکمه‌ها */}
        <div className="flex gap-4 pt-4">
            <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
            انصراف
            </button>
            <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
            {loading ? 'در حال ذخیره...' : 'ثبت تمرین'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default WorkoutLog;