import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wanderlust Sidebar
 * Features: Fixed glassmorphism, active state styles, and Material Symbols.
 */
const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'grid_view', path: '/' },
    { label: 'Bookings', icon: 'event_available', path: '/bookings' },
    { label: 'Destinations', icon: 'explore', path: '/destinations' },
    { label: 'Packages', icon: 'favorite', path: '/packages' },
    { label: 'Payments', icon: 'payments', path: '/payments' },
    { label: 'Hotels', icon: 'hotel', path: '/hotels' },
    { label: 'Drivers', icon: 'directions_car', path: '/drivers' },
    { label: 'Tour Guides', icon: 'tour', path: '/tour-guides' },
    { label: 'Users', icon: 'group', path: '/users' },
    { label: 'Management', icon: 'engineering', path: '/management' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <aside className="w-72 h-screen shadow-md fixed left-0 top-0 z-40 flex flex-col border-r border-slate-200 px-6 py-6 font-['Plus_Jakarta_Sans']">
      {/* Brand Logo */}
      <div className="mb-6 px-4">
        <h1 className="text-2xl font-extrabold font-nav-md tracking-tighter text-[#0059bb]">Amal Holidays</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#717786] mt-1">Staff Portal</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1 pr-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 group ${
              isActive 
                ? 'bg-[#0059bb] text-white shadow-lg shadow-blue-500/30' 
                : 'text-[#414754] hover:bg-white/50 hover:text-[#0059bb]'
            }`}
          >
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile / Logout Section */}
      <div className="border-t border-white/30">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-[#d8e2ff] border-2 border-white flex items-center justify-center overflow-hidden">
             <span className="material-symbols-outlined text-[#0059bb]">person</span>
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="text-sm font-bold text-[#1b1c1c] truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs text-[#717786] truncate">{user?.role || 'Portal User'}</p>
          </div>
          <button onClick={handleLogout} className="text-[#717786] hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
