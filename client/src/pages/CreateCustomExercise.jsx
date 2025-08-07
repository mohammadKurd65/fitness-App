// src/pages/CreateCustomExercise.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MUSCLES = ['سینه', 'پشت', 'پا', 'شانه', 'بازو', 'هسته'];
const EQUIPMENT = ['دمبل', 'هالتر', 'بدون وزنه', 'ماشین', 'کش', 'کابل'];

const CreateCustomExercise = () => {
const { user } = useAuth();
const navigate = useNavigate();

const [formData, setFormData] = useState({
    name: '',
    muscle: '',
    equipment: 'بدون وزنه',
    instructions: '',
    image: '',
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    const res = await fetch('http://localhost:5000/api/exercises/custom', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    });

    if (res.ok) {
        alert('حرکت سفارشی با موفقیت ایجاد شد!');
        navigate('/exercises');
    } else {
        const data = await res.json();
        setError(data.message || 'خطا در ایجاد حرکت');
    }
    } catch (err) {
    setError('اتصال به سرور برقرار نیست.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-2xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">ایجاد حرکت سفارشی</h1>

    {error && (
        <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* نام حرکت */}
        <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
              نام حرکت *
            </label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="اسکوات چرخشی با دمبل"
            />
        </div>

          {/* عضله */}
        <div>
            <label htmlFor="muscle" className="block mb-1 text-sm font-medium text-gray-700">
              عضله هدف *
            </label>
            <select
            id="muscle"
            name="muscle"
            value={formData.muscle}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">یک عضله انتخاب کنید</option>
            {MUSCLES.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
            ))}
            </select>
        </div>

          {/* وسیله */}
        <div>
            <label htmlFor="equipment" className="block mb-1 text-sm font-medium text-gray-700">
            وسیله
            </label>
            <select
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
            {EQUIPMENT.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
            ))}
            </select>
        </div>

          {/* توضیحات */}
        <div>
            <label htmlFor="instructions" className="block mb-1 text-sm font-medium text-gray-700">
            توضیحات اجرا
            </label>
            <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="پاها را به عرض شانه باز کنید، دمبل را در دست بگیرید و به آرامی خم شوید..."
            />
        </div>

          {/* لینک تصویر */}
        <div>
            <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">
            لینک تصویر (اختیاری)
            </label>
            <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/exercise.jpg"
            />
        </div>

          {/* دکمه‌ها */}
        <div className="flex gap-4 pt-4">
            <button
            type="button"
            onClick={() => navigate('/exercises')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
            انصراف
            </button>
            <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-70"
            >
            {loading ? 'در حال ایجاد...' : 'ایجاد حرکت'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default CreateCustomExercise;