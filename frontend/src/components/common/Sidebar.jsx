import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Search, Bell, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/home', icon: Home, label: 'Home Feed' },
    { to: '/matches', icon: Trophy, label: 'Live Matches' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0">
      <div className="sticky top-16 flex flex-col gap-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname === to
                ? 'bg-brand-900/60 text-brand-400 border border-brand-800/50'
                : 'text-brand-700 hover:bg-brand-900/30 hover:text-brand-400'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}

        <div className="mt-4 p-4 card rounded-xl">
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(user?.avatar, user?.name)}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-800"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-brand-100 truncate">{user?.name}</p>
              <p className="text-xs text-brand-700 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="bg-dark-700 rounded-lg py-1.5">
              <p className="text-brand-400 font-semibold text-sm">{user?.followers?.length || 0}</p>
              <p className="text-brand-700 text-xs">Followers</p>
            </div>
            <div className="bg-dark-700 rounded-lg py-1.5">
              <p className="text-brand-400 font-semibold text-sm">{user?.following?.length || 0}</p>
              <p className="text-brand-700 text-xs">Following</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;