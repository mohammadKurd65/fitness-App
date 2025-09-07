import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
const { user, logout } = useAuth();
const navigate = useNavigate();

const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});
const [avatar, setAvatar] = useState(null);
const [avatarPreview, setAvatarPreview] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

useEffect(() => {
    if (user) {
    setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    setAvatarPreview(user.avatar ? user.avatar : '');
    }
}, [user]);

const handleChange = (e) => {
    setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
    }));
};

const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // ساخت FormData برای ارسال اطلاعات و آواتار
    const fd = new window.FormData();
    if (formData.name && formData.name !== user.name) fd.append('name', formData.name);
    if (formData.email && formData.email !== user.email) fd.append('email', formData.email);
    if (avatar) fd.append('avatar', avatar);

      // اگر کاربر رمز عبور را می‌خواهد تغییر دهد
    if (formData.currentPassword && formData.newPassword && formData.confirmNewPassword) {
        if (formData.newPassword !== formData.confirmNewPassword) {
        setError('رمز عبور جدید و تکرار آن یکسان نیستند.');
        setLoading(false);
        return;
        }
        fd.append('currentPassword', formData.currentPassword);
        fd.append('newPassword', formData.newPassword);
    }

      // اگر هیچ داده‌ای برای آپدیت وجود ندارد
    if (Array.from(fd.entries()).length === 0) {
        setError('هیچ تغییری اعمال نشده است.');
        setLoading(false);
        return;
    }

    const res = await fetch('http://localhost:5000/api/users/upload-avatar', {
        method: 'PUT',
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: fd
    });

    const data = await res.json();
    if (!res.ok) {
        setError(data.message || 'خطا در بروزرسانی اطلاعات');
    } else {
        setSuccess('اطلاعات با موفقیت بروزرسانی شد.');
        // اگر اطلاعات کاربر تغییر کرد، می‌توانید اینجا user را آپدیت کنید
    }
    } catch (err) {
    setError('خطا در ارتباط با سرور');
    } finally {
    setLoading(false);
    }
};

const handleLogoutAll = async () => {
    // پیاده‌سازی لاگ‌اوت همه دستگاه‌ها (در صورت نیاز)
    logout();
    navigate('/login');
};

const handleDownloadData = () => {
    // پیاده‌سازی دانلود داده‌های کاربر (در صورت نیاز)
    alert('این قابلیت هنوز پیاده‌سازی نشده است.');
};

const handleDeleteAccount = async () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
    const res = await fetch('http://localhost:5000/api/users/delete', {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const data = await res.json();
    if (!res.ok) {
        setError(data.message || 'خطا در حذف حساب');
    } else {
        setSuccess('حساب با موفقیت حذف شد.');
        logout();
        navigate('/register');
    }
    } catch (err) {
    setError('خطا در ارتباط با سرور');
    } finally {
    setLoading(false);
    }
};

return (
    <div>
      {/* فرم تنظیمات کاربر */}
    <form onSubmit={handleSubmit}>
        <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="نام"
        />
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="ایمیل"
        />
        <input
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder="رمز عبور فعلی"
        />
        <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="رمز عبور جدید"
        />
        <input
        type="password"
        name="confirmNewPassword"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        placeholder="تکرار رمز عبور جدید"
        />
        <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        />
        {avatarPreview && <img src={avatarPreview} alt="avatar preview" width={80} />}
        <button type="submit" disabled={loading}>ذخیره تغییرات</button>
    </form>
    {error && <div style={{ color: 'red' }}>{error}</div>}
    {success && <div style={{ color: 'green' }}>{success}</div>}
    <button onClick={handleLogoutAll}>خروج از همه دستگاه‌ها</button>
    <button onClick={handleDownloadData}>دانلود داده‌ها</button>
    <button onClick={handleDeleteAccount} style={{ color: 'red' }}>حذف حساب</button>
    </div>
);
};

export default Settings;