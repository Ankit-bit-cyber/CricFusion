import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import Landing from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import MatchPage from '../pages/MatchPage';
import Notifications from '../pages/Notification';
import Settings from '../pages/Settings';
import SearchPage from '../pages/SearchPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected */}
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/matches" element={<ProtectedRoute><MatchPage /></ProtectedRoute>} />
    <Route path="/matches/:id" element={<ProtectedRoute><MatchPage /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;