// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import WorkoutLog from "./pages/WorkoutLog";
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
<Route path="/workout-log" element={
  <PrivateRoute>
    <WorkoutLog />
  </PrivateRoute>
} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;