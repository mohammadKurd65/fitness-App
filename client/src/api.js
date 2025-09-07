// client/src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // مسیر سرور Node.js

// ایجاد Axios instance برای ارسال JWT خودکار
const api = axios.create({
baseURL: API_URL,
});

// اضافه کردن توکن JWT به درخواست‌ها
api.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

export default api;
