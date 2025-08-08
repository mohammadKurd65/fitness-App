// src/pages/ExerciseLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Exercise from '../../../server/models/Exercise';
import { Link } from 'react-router-dom';
const MUSCLES = ['همه', 'سینه', 'پشت', 'پا', 'شانه', 'بازو', 'هسته'];

const ExerciseLibrary = () => {
const { user } = useAuth();
const [exercises, setExercises] = useState([]);
const [filteredExercises, setFilteredExercises] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedMuscle, setSelectedMuscle] = useState('همه');
const [loading, setLoading] = useState(true);

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
        setExercises(data);
        setFilteredExercises(data);
        }
    } catch (err) {
        console.error('Failed to fetch exercises:', err);
    } finally {
        setLoading(false);
    }
    };

    fetchExercises();
}, [ user, setExercises, setFilteredExercises, setLoading]);

  // فیلتر داده‌ها
useEffect(() => {
    let result = exercises;

    if (searchTerm) {
    result = result.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    }

    if (selectedMuscle !== 'همه') {
    result = result.filter(ex => ex.muscle === selectedMuscle);
    }

    setFilteredExercises(result);
}, [searchTerm, selectedMuscle, exercises]);

return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
    <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">کتابخانه حرکات</h1>
        <p className="text-gray-600">حرکات استاندارد و سفارشی خودت رو جستجو کن</p>
        </div>

        {/* جستجو و فیلتر */}
        <div className="p-6 mb-6 bg-white shadow rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
            <input
            type="text"
            placeholder="جستجوی حرکت..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:w-48"
            >
            {MUSCLES.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
            ))}
            </select>
        </div>
        </div>

        {/* لیست حرکات */}
        {loading ? (
        <p className="py-8 text-center text-gray-500">در حال بارگذاری حرکات...</p>
        ) : filteredExercises.length === 0 ? (
        <p className="py-8 text-center text-gray-500">هیچ حرکتی یافت نشد.</p>
        ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((ex, index) => (
            <div key={index} className="overflow-hidden transition bg-white shadow rounded-xl hover:shadow-lg">
                <img
                src={ex.image}
                alt={ex.name}
                className="object-cover w-full h-40"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                }}
                />
                <div className="p-4">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{ex.name}</h3>
                    {ex.isCustom && (
                    <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">سفارشی</span>
                    )}
                </div>
                <p className="mt-1 text-sm text-gray-600">عضله: <span className="font-medium">{ex.muscle}</span></p>
                <p className="text-sm text-gray-600">وسیله: {ex.equipment}</p>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{ex.instructions}</p>
                </div>

<Link to={`/exercises/${ex._id}`} key={index} className="block">
<div className="transition bg-white shadow rounded-xl hover:shadow-lg">
    <img src={ex.image} alt={ex.name} className="object-cover w-full h-40" />
    <div className="p-4">
    <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800">{ex.name}</h3>
        {ex.isCustom && (
        <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded">سفارشی</span>
        )}
    </div>
    <p className="mt-1 text-sm text-gray-600">عضله: <span className="font-medium">{ex.muscle}</span></p>
    <p className="text-sm text-gray-600">وسیله: {ex.equipment}</p>
    </div>
</div>
</Link>
                
            </div>
            ))}
        </div>
        )}

        {/* دکمه افزودن حرکت سفارشی (در آینده) */}
    <div className="mt-8 text-center">
<Link
    to="/exercises/create"
    className="inline-block px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
>
    + افزودن حرکت سفارشی
</Link>
</div>



    </div>
    </div>
);
};

export default ExerciseLibrary;