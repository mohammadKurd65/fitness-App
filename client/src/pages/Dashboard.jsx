// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios"
const Dashboard = () => {
const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
};

return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Link to="/workout-log" className="px-6 py-3 text-white bg-blue-500 rounded-lg">
ثبت تمرین جدید
</Link>
    <div className="p-8 text-center bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800">خوش آمدید!</h2>
        <p className="mt-2 text-gray-600">شما با موفقیت وارد شدید.</p>
        <button
        onClick={handleLogout}
        className="px-6 py-2 mt-4 text-white transition bg-red-500 rounded hover:bg-red-600"
        >
        خروج
        </button>
    </div>
    </div>
);
};

export default Dashboard;