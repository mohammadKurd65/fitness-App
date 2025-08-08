// src/pages/EditCustomExercise.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MUSCLES = ['سینه', 'پشت', 'پا', 'شانه', 'بازو', 'هسته'];
const EQUIPMENT = ['دمبل', 'هالتر', 'بدون وزنه', 'ماشین', 'کش', 'کابل'];

const EditCustomExercise = () => {
const { id } = useParams();
const navigate = useNavigate();

const [formData, setFormData] = useState({
    name: '',
    muscle: '',
    equipment: 'بدون وزنه',
    instructions: '',
    image: '',
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

  // بارگذاری داده حرکت
useEffect(() => {
    const fetchExercise = async () => {
    try {
        const res = await fetch(`http://localhost:5000/api/exercises/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });

        if (res.ok) {
        const data = await res.json();
        setFormData({
            name: data.name,
            muscle: data.muscle,
            equipment: data.equipment,
            instructions: data.instructions,
            image: data.image,
        });
        } else {
        const err = await res.json();
        setError(err.message || 'حرکت یافت نشد.');
        navigate('/exercises');
        }
    } catch (err) {
        setError('اتصال به سرور برقرار نیست.');
    } finally {
        setLoading(false);
    }
    };

    fetchExercise();
}, [id, navigate]);

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
const res = await fetch(`http://localhost:5000/api/exercises/custom/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    });

    if (res.ok) {
        alert('حرکت با موفقیت ویرایش شد!');
        navigate(`/exercises/${id}`); // بازگشت به صفحه جزئیات
    } else {
        const data = await res.json();
        setError(data.message || 'خطا در ویرایش');
    }
    } catch (err) {
    setError('اتصال به سرور برقرار نیست.');
    } finally {
    setLoading(false);
    }
};

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        در حال بارگذاری...
    </div>
    );
}

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-2xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">ویرایش حرکت سفارشی</h1>

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
            onClick={() => navigate(`/exercises/${id}`)}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
            انصراف
            </button>
            <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-70"
            >
            {loading ? 'در حال ویرایش...' : 'ویرایش حرکت'}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default EditCustomExercise;