// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
const { isAuthenticated, loading } = useAuth();

if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
        <p>در حال بارگذاری...</p>
    </div>
    );
}

return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;