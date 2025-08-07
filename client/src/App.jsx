// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import ExerciseLibrary from './pages/ExerciseLibrary';
import CreateCustomExercise from './pages/CreateCustomExercise';
import PrivateRoute from './components/PrivateRoute';

import './index.css'; // ✅ این خط باید کاملاً جدا باشه

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
        <Route path="/exercises" element={
          <PrivateRoute>
            <ExerciseLibrary />
          </PrivateRoute>
        } />
        <Route path="/exercises/create" element={
          <PrivateRoute>
            <CreateCustomExercise />
          </PrivateRoute>
        } />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;