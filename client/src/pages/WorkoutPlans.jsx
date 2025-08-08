// src/pages/WorkoutPlans.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const MOCK_EXERCISES = [
'اسکوات', 'دمبل پرس', 'کشش دمبل', 'پرس سینه', 'پول‌آپ',
'دیپ', 'لاین جک', 'کراس اور', 'پرس شانه', 'جلو بازو', 'پشت بازو'
];

const WorkoutPlans = () => {
const { user } = useAuth();
const navigate = useNavigate();

const [plans, setPlans] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

  // فرم ایجاد/ویرایش
const [form, setForm] = useState({
    name: '',
    days: DAYS.map(day => ({ day, exercises: [] }))
});
const [editingId, setEditingId] = useState(null);

useEffect(() => {
    fetchPlans();
}, [ user, editingId, form, setPlans, setEditingId, setForm, setError, setLoading, navigate]);

const fetchPlans = async () => {
    try {
    const res = await fetch('http://localhost:5000/api/plans', {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (res.ok) {
        const data = await res.json();
        setPlans(data);
    } else {
        setError('خطا در بارگذاری برنامه‌ها');
    }
    } catch (err) {
    setError('اتصال به سرور برقرار نیست.');
    } finally {
    setLoading(false);
    }
};

const openCreateForm = () => {
    setForm({
    name: '',
    days: DAYS.map(day => ({ day, exercises: [] }))
    });
    setEditingId(null);
};

const handleExerciseChange = (dayIndex, exerciseIndex, value) => {
    const newDays = [...form.days];
    newDays[dayIndex].exercises[exerciseIndex] = { name: value };
    setForm({ ...form, days: newDays });
};

const addExerciseToDay = (dayIndex) => {
    const newDays = [...form.days];
    newDays[dayIndex].exercises.push({ name: '' });
    setForm({ ...form, days: newDays });
};

const removeExerciseFromDay = (dayIndex, exerciseIndex) => {
    const newDays = [...form.days];
    newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex);
    setForm({ ...form, days: newDays });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
    const url = editingId
        ? `http://localhost:5000/api/plans/${editingId}`
        : 'http://localhost:5000/api/plans';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
    });

    if (res.ok) {
        const savedPlan = await res.json();
        if (editingId) {
        setPlans(plans.map(p => p._id === editingId ? savedPlan : p));
        } else {
        setPlans([savedPlan, ...plans]);
        }
        setForm({ name: '', days: DAYS.map(d => ({ day: d, exercises: [] })) });
    } else {
        const data = await res.json();
        setError(data.message || 'خطا در ذخیره');
    }
    } catch (err) {
    setError('اتصال به سرور برقرار نیست.');
    }
};

const startEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
    name: plan.name,
    days: DAYS.map(day => {
        const found = plan.days.find(d => d.day === day);
        return {
        day,
        exercises: found ? found.exercises : []
        };
    })
    });
};

const deletePlan = async (id) => {
    if (!window.confirm('آیا از حذف این برنامه اطمینان دارید؟')) return;

    try {
    const res = await fetch(`http://localhost:5000/api/plans/${id}`, {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (res.ok) {
        setPlans(plans.filter(p => p._id !== id));
    } else {
        alert('حذف انجام نشد.');
    }
    } catch (err) {
    alert('اتصال برقرار نیست.');
    }
};

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-5xl mx-auto">

        {/* هدر */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">برنامه‌های تمرینی</h1>
        <p className="text-gray-600">برنامه‌های هفتگی خود را ایجاد و مدیریت کنید</p>
        </div>

        {/* دکمه ایجاد برنامه */}
        <div className="mb-8 text-center">
        <button
            onClick={openCreateForm}
            className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
            + ایجاد برنامه جدید
        </button>
        </div>

        {/* فرم ایجاد/ویرایش */}
        {(editingId !== null || form.name || form.days.some(d => d.exercises.length > 0)) && (
        <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
            {editingId ? 'ویرایش برنامه' : 'ایجاد برنامه جدید'}
            </h2>

            <input
            type="text"
            placeholder="نام برنامه (مثلاً PPL)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg"
            required
            />

            {form.days.map((day, dayIndex) => (
            <div key={day.day} className="p-4 mb-6 rounded-lg bg-gray-50">
                <h3 className="mb-3 font-semibold text-gray-800">{day.day}</h3>
                {day.exercises.length === 0 ? (
                <p className="text-sm text-gray-500">هیچ حرکتی اضافه نشده</p>
                ) : (
                <ul className="mb-3 space-y-2">
                    {day.exercises.map((ex, exIndex) => (
                    <li key={exIndex} className="flex items-center gap-2">
                        <select
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(dayIndex, exIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        >
                        <option value="">یک حرکت انتخاب کنید</option>
                        {MOCK_EXERCISES.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                        </select>
                        <button
                        type="button"
                        onClick={() => removeExerciseFromDay(dayIndex, exIndex)}
                        className="text-sm text-red-500 hover:text-red-700"
                        >
                        حذف
                        </button>
                    </li>
                    ))}
                </ul>
                )}
                <button
                type="button"
                onClick={() => addExerciseToDay(dayIndex)}
                className="text-sm text-blue-600 hover:text-blue-800"
                >
                + اضافه کردن حرکت
                </button>
            </div>
            ))}

            <div className="flex gap-4">
            <button
                type="button"
                onClick={() => {
                setForm({ name: '', days: DAYS.map(d => ({ day: d, exercises: [] })) });
                setEditingId(null);
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg"
            >
                انصراف
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
                {editingId ? 'به‌روزرسانی برنامه' : 'ایجاد برنامه'}
            </button>
            </div>
        </div>
        )}

        {/* لیست برنامه‌ها */}
        {loading ? (
        <p>در حال بارگذاری...</p>
        ) : plans.length === 0 ? (
        <p className="py-8 text-center text-gray-500">هنوز برنامه‌ای ایجاد نکردید.</p>
        ) : (
        <div className="space-y-6">
            {plans.map(plan => (
            <div key={plan._id} className="p-6 bg-white shadow rounded-xl">
                <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
                <div className="space-x-2 space-x-reverse">
                    <button
                    onClick={() => startEdit(plan)}
                    className="text-sm text-yellow-600 hover:text-yellow-800"
                    >
                    ویرایش
                    </button>
                    <button
                    onClick={() => deletePlan(plan._id)}
                    className="text-sm text-red-600 hover:text-red-800"
                    >
                    حذف
                    </button>
                </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                {plan.days.map((day, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-800">{day.day}</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {day.exercises.length > 0 ? (
                        day.exercises.map((ex, idx) => (
                            <li key={idx}>• {ex.name}</li>
                        ))
                        ) : (
                        <li>بدون حرکت</li>
                        )}
                    </ul>
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
        )}

        {/* دکمه بازگشت */}
        <div className="mt-8 text-center">
        <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline"
        >
            ← بازگشت به داشبورد
        </button>
        </div>
    </div>
    </div>
);
};

export default WorkoutPlans;