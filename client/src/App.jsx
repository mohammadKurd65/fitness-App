// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // فرضی — بعداً می‌سازیمش
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* دیگر صفحات */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;