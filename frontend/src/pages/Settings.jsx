import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon, LogOut, User, Moon, Sun, Shield } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <MainLayout>
      <div className="max-w-lg space-y-6">
        <h1 className="text-lg font-semibold text-brand-200 flex items-center gap-2">
          <SettingsIcon size={18} className="text-brand-500" /> Settings
        </h1>

        {/* Account */}
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-brand-500 uppercase tracking-wider">Account</h2>
          <div className="flex items-center gap-3 p-3 bg-dark-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center">
              <User size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-200">{user?.name}</p>
              <p className="text-xs text-brand-700">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="btn-outline w-full text-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* Appearance */}
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-brand-500 uppercase tracking-wider">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={16} className="text-brand-500" /> : <Sun size={16} className="text-yellow-400" />}
              <div>
                <p className="text-sm text-brand-200">Theme</p>
                <p className="text-xs text-brand-700">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-600' : 'bg-brand-800'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-brand-500 uppercase tracking-wider">Security</h2>
          <div className="flex items-center gap-3 text-sm text-brand-600">
            <Shield size={15} />
            <span>Password is encrypted with bcrypt</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-900/20 transition-all text-sm font-medium"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </MainLayout>
  );
};

export default Settings;