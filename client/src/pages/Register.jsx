// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // اعتبارسنجی فرم
    if (formData.password !== formData.confirmPassword) {
    setError('رمز عبور و تکرار آن یکسان نیستند.');
    setLoading(false);
    return;
    }

    if (formData.password.length < 6) {
    setError('رمز عبور باید حداقل 6 کاراکتر باشد.');
    setLoading(false);
    return;
    }

    try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
    });

      // ذخیره توکن و کاربر
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

      // تنظیم هدر پیش‌فرض برای درخواست‌های بعدی
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    setSuccess('ثبت‌نام موفقیت‌آمیز بود! در حال انتقال به داشبورد...');
    setTimeout(() => {
        navigate('/dashboard');
    }, 1500);

    } catch (err) {
    setError(
        err.response?.data?.message || 'ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.'
    );
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
    <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">ایجاد حساب کاربری</h1>
        <p className="mt-2 text-gray-500">برای شروع مسیر تناسب اندام ثبت‌نام کنید</p>
        </div>

        {success ? (
        <div className="p-4 mb-6 text-center text-green-700 bg-green-100 rounded-lg">
            {success}
        </div>
        ) : null}

        {error && (
        <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            نام و نام خانوادگی
            </label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="علی رضا"
            />
        </div>

        <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            ایمیل
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ali@example.com"
            />
        </div>

        <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            رمز عبور
            </label>
            <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            />
        </div>

        <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
            تکرار رمز عبور
            </label>
            <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            />
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
            {loading ? (
            <>
                <svg className="inline w-5 h-5 mr-2 -ml-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ثبت‌نام...
            </>
            ) : (
            'ثبت‌نام'
            )}
        </button>
        </form>

        <div className="mt-6 text-center">
        <p className="text-gray-600">
            حساب کاربری دارید؟{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:underline">
            وارد شوید
            </Link>
        </p>
        </div>
    </div>
    </div>
);
};

export default Register;