import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Home, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { useState, useEffect, useCallback } from 'react';
import { getUnreadCountApi } from '../../services/notificationApi';
import useSocket from '../../hooks/useSocket';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getUnreadCountApi().then((r) => setUnread(r.data.data.count)).catch(() => {});
  }, []);

  // Stable callback - must NOT be an inline arrow so useSocket deps don't loop
  const handleNewNotification = useCallback(() => setUnread((n) => n + 1), []);
  useSocket('notification', handleNewNotification);

  const navLinks = [
    { to: '/home', icon: Home, label: 'Feed' },
    { to: '/matches', icon: Trophy, label: 'Matches' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/notifications', icon: Bell, label: 'Alerts', badge: unread },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-brand-900/40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Trophy size={14} className="text-white" />
          </div>
          <span className="font-display text-xl tracking-wide text-brand-400">CricConnect</span>
        </Link>

        {/* Nav links - desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === to
                  ? 'bg-brand-900/50 text-brand-400'
                  : 'text-brand-700 hover:text-brand-400 hover:bg-brand-900/30'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-brand-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src={getAvatarUrl(user?.avatar, user?.name)}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-800"
            />
            <span className="hidden md:block text-sm text-brand-300">{user?.name}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-brand-900/50 rounded-xl shadow-2xl py-1 animate-fade-in">
              <Link
                to={`/profile/${user?._id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-300 hover:bg-brand-900/30 hover:text-brand-400 transition-colors"
              >
                <User size={15} /> Profile
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur border-t border-brand-900/40 flex z-40">
        {navLinks.map(({ to, icon: Icon, badge }) => (
          <Link
            key={to}
            to={to}
            className={`relative flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
              location.pathname === to ? 'text-brand-400' : 'text-brand-700'
            }`}
          >
            <Icon size={20} />
            {badge > 0 && (
              <span className="absolute top-2 right-1/4 h-3.5 w-3.5 bg-brand-500 text-white text-[9px] rounded-full flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Link>
        ))}
        <Link
          to={`/profile/${user?._id}`}
          className={`flex-1 flex flex-col items-center py-3 transition-colors ${
            location.pathname.startsWith('/profile') ? 'text-brand-400' : 'text-brand-700'
          }`}
        >
          <img
            src={getAvatarUrl(user?.avatar, user?.name)}
            alt="me"
            className="w-5 h-5 rounded-full object-cover"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;