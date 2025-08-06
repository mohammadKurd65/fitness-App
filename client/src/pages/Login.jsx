// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
const [formData, setFormData] = useState({
    email: '',
    password: '',
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const navigate = useNavigate();

  // تغییر در فیلدها
const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

  // ارسال فرم
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // ذخیره توکن و اطلاعات کاربر
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

      // هدرهای پیش‌فرض برای درخواست‌های آینده
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      // ریدایرکت به داشبورد
    navigate('/dashboard');
    } catch (err) {
    setError(
        err.response?.data?.message || 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.'
    );
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">ورود به FitTrack</h1>
        <p className="mt-2 text-gray-500">برای ادامه به حساب خود وارد شوید</p>
        </div>

        {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full px-4 py-3 transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                در حال ورود...
            </>
            ) : (
            'ورود به حساب'
            )}
        </button>
        </form>

        <div className="mt-6 text-center">
        <p className="text-gray-600">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:underline">
            ثبت‌نام کنید
            </Link>
        </p>
        </div>
    </div>
    </div>
);
};

export default Login;