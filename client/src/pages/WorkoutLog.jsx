// src/pages/WorkoutLog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WorkoutLog = () => {
const { user } = useAuth();
const navigate = useNavigate();

  const [exercisesList, setExercisesList] = useState([]); // تمام حرکات
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

  // داده‌های جلسه تمرین
const [workout, setWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    exercises: [] // حرکات انتخاب شده
});

  // بارگذاری حرکات از API
useEffect(() => {
    const fetchExercises = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/exercises', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });

        if (res.ok) {
        const data = await res.json();
        setExercisesList(data);
        } else {
        setError('خطا در بارگذاری حرکات');
        }
    } catch (err) {
        setError('اتصال به سرور برقرار نیست.');
    } finally {
        setLoading(false);
    }
    };

    fetchExercises();
}, [ setLoading, setError, navigate, user]);

  // اضافه کردن حرکت به جلسه
const addExerciseToWorkout = (exercise) => {
    const newExercise = {
    exercise: exercise._id,
    name: exercise.name,
    sets: [{ reps: '', weight: '', rest: '90' }]
    };
    setWorkout({
    ...workout,
    exercises: [...workout.exercises, newExercise]
    });
};

  // حذف حرکت از جلسه
const removeExercise = (index) => {
    setWorkout({
    ...workout,
    exercises: workout.exercises.filter((_, i) => i !== index)
    });
};

  // اضافه کردن ست به یک حرکت
const addSet = (exerciseIndex) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '', rest: '90' });
    setWorkout({ ...workout, exercises: newExercises });
};

  // حذف ست
const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...workout.exercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setWorkout({ ...workout, exercises: newExercises });
    }
};

  // ویرایش ست
const updateSet = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setWorkout({ ...workout, exercises: newExercises });
};

  // ارسال فرم
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!workout.duration || workout.exercises.length === 0) {
    setError('حداقل مدت زمان و یک حرکت باید وارد شود.');
    return;
    }

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
    }
};

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">

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

          {/* انتخاب حرکات */}
        <div className="pt-6 border-t">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">انتخاب حرکات از کتابخانه</h2>

            {loading ? (
            <p>در حال بارگذاری حرکات...</p>
            ) : (
            <div className="grid grid-cols-2 gap-2 p-2 mb-4 overflow-y-auto border rounded-lg md:grid-cols-3 max-h-40 bg-gray-50">
                {exercisesList.map((ex) => (
                <button
                    type="button"
                    key={ex._id}
                    onClick={() => addExerciseToWorkout(ex)}
                    className="p-2 text-sm text-left transition border rounded hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300"
                    title={`${ex.muscle} - ${ex.equipment}`}
                >
                    {ex.name}
                    {ex.isCustom && <span className="text-xs text-purple-500"> (سفارشی)</span>}
                </button>
                ))}
            </div>
            )}
        </div>

          {/* لیست حرکات انتخاب شده */}
        <div className="pt-6 border-t">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">حرکات جلسه</h2>

            {workout.exercises.length === 0 ? (
            <p className="py-4 text-center text-gray-500">هیچ حرکتی اضافه نشده است.</p>
            ) : (
            workout.exercises.map((ex, exIndex) => (
                <div key={exIndex} className="relative p-4 mb-4 border rounded-lg bg-gray-50">
                <button
                    type="button"
                    onClick={() => removeExercise(exIndex)}
                    className="absolute text-sm text-red-500 top-2 right-2 hover:text-red-700"
                >
                    حذف
                </button>

                <h3 className="mb-2 font-semibold text-gray-800">{ex.name}</h3>

                  {/* ست‌ها */}
                <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">ست‌ها:</h4>
                    {ex.sets.map((set, sIndex) => (
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
                        {ex.sets.length > 1 && (
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
            ))
            )}
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
            className="flex-1 px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
            ثبت تمرین
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default WorkoutLog;