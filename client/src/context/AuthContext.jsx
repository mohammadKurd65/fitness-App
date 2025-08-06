// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

// ایجاد Context
const AuthContext = createContext();

// Initial State
const initialState = {
user: null,
token: null,
isAuthenticated: false,
  loading: true, // در حالت اولیه در حال بارگذاری وضعیت از localStorage
error: null,
};

// Reducer برای مدیریت state
const authReducer = (state, action) => {
switch (action.type) {
    case 'LOGIN_SUCCESS':
    return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
    };
    case 'REGISTER_SUCCESS':
    return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
    };
    case 'LOAD_USER':
    return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
    };
    case 'LOGOUT':
    return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
    };
    case 'AUTH_ERROR':
    return {
        ...state,
        error: action.payload,
        loading: false,
        token: null,
        user: null,
        isAuthenticated: false,
    };
    case 'CLEAR_ERROR':
    return {
        ...state,
        error: null,
    };
    default:
    return state;
}
};

// Provider Component
export const AuthProvider = ({ children }) => {
const [state, dispatch] = useReducer(authReducer, initialState);

  // بررسی توکن در localStorage و بارگذاری کاربر
useEffect(() => {
    const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        // تنظیم توکن در axios برای درخواست‌های بعدی
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          // درخواست به /api/users/me برای دریافت اطلاعات کاربر
        const res = await axios.get('http://localhost:5000/api/users/me');
        dispatch({
            type: 'LOAD_USER',
            payload: { user: res.data },
        });
        } catch (err) {
           console.error("Error:", err.message); // یا err.response در axios// اگر توکن نامعتبر بود، خروج انجام بشه
        logout();
        }
    } else {
        dispatch({ type: 'AUTH_ERROR', payload: null });
    }
    };

    loadUser();
}, []);

  // Login
const login = async (email, password) => {
    try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

    const { token, user } = res.data;

      // ذخیره توکن
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
    });
    } catch (err) {
    const message = err.response?.data?.message || 'ورود ناموفق بود.';
    dispatch({
        type: 'AUTH_ERROR',
        payload: message,
    });
    }
};

  // Register
const register = async (name, email, password) => {
    try {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { token, user },
    });
    } catch (err) {
    const message = err.response?.data?.message || 'ثبت‌نام ناموفق بود.';
    dispatch({
        type: 'AUTH_ERROR',
        payload: message,
    });
    }
};

  // Logout
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
};

  // Clear Error
const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
};

return (
    <AuthContext.Provider
    value={{
        ...state,
        login,
        register,
        logout,
        clearError,
    }}
    >
    {children}
    </AuthContext.Provider> );
};

// Hook سفارشی برای استفاده آسان
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};