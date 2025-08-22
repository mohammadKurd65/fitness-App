// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import ExerciseLibrary from './pages/ExerciseLibrary';
import CreateCustomExercise from './pages/CreateCustomExercise';
import PrivateRoute from './components/PrivateRoute';
import ExerciseDetail from './pages/ExerciseDetail';
import EditCustomExercise from './pages/EditCustomExercise';
import Progress from './pages/Progress';
import WorkoutPlans from './pages/WorkoutPlans';
import Calendar from './pages/Calendar';
import NotificationManager from './components/NotificationManager';
import InstallPrompt from './components/InstallPrompt';
import OfflineSyncManager from './components/OfflineSyncManager';
import OfflineWorkouts from './pages/OfflineWorkouts'; 

import './index.css'; // ✅ این خط باید کاملاً جدا باشه

function App() {
  return (
    <>
    <OfflineSyncManager />
    <InstallPrompt />
      <NotificationManager />
      {/* بقیه روت‌ها */}
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

<Route path="/exercises/:id" element={
  <PrivateRoute>
    <ExerciseDetail />
  </PrivateRoute>
} />

<Route path="/exercises/:id/edit" element={
  <PrivateRoute>
    <EditCustomExercise />
  </PrivateRoute>
} />

<Route path="/progress" element={
  <PrivateRoute>
    <Progress />
  </PrivateRoute>
} />

<Route path="/plans" element={
  <PrivateRoute>
    <WorkoutPlans />
  </PrivateRoute>
} />

<Route path="/calendar" element={
  <PrivateRoute>
    <Calendar />
  </PrivateRoute>
} />

<Route path="/offline-workouts" element={
  <PrivateRoute>
    <OfflineWorkouts />
  </PrivateRoute>
} />

        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
    </>
    
  );
}

export default App;