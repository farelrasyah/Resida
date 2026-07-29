import React, { useState } from 'react';
import { Menu, LogOut, User as UserIcon, ChevronDown, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onMenuToggle?: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ onToggleSidebar, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleToggle = onToggleSidebar || onMenuToggle;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-[72px] bg-white/70 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg hover:bg-neutral-100 lg:hidden text-neutral-600 transition-colors cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Mockup (Premium SaaS feature) */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center gap-3 w-72 lg:w-96 bg-neutral-100/70 hover:bg-neutral-100 border border-transparent hover:border-neutral-200/60 transition-all duration-300 text-neutral-400 px-4 py-2 rounded-xl text-[1.3rem] group">
            <Search size={16} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            <span className="flex-1 text-left group-hover:text-neutral-500 transition-colors">Cari data warga, laporan...</span>
            <div className="flex items-center gap-1 opacity-70">
              <kbd className="hidden sm:inline-block bg-white border border-neutral-200 rounded-md px-2 py-0.5 text-[1.1rem] font-sans font-medium text-neutral-500 shadow-sm">
                ⌘
              </kbd>
              <kbd className="hidden sm:inline-block bg-white border border-neutral-200 rounded-md px-2 py-0.5 text-[1.1rem] font-sans font-medium text-neutral-500 shadow-sm">
                K
              </kbd>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer group">
          <Bell size={20} className="group-hover:text-[#151717] transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-8 bg-neutral-200/60 hidden sm:block mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-neutral-100 transition-all duration-300 cursor-pointer border border-transparent hover:border-neutral-200/50"
          >
            <div className="w-9 h-9 rounded-full bg-[#151717] text-white flex items-center justify-center font-bold text-[1.3rem] shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[1.3rem] font-semibold text-[#151717] leading-tight">{user?.name || 'Administrator'}</span>
              <span className="text-[1.1rem] text-neutral-400 font-medium">Admin RT</span>
            </div>
            <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div
              onClick={() => setShowDropdown(false)}
              className="fixed inset-0 z-40"
            />
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-100 z-50 animate-in fade-in zoom-in-95 duration-200 ease-out origin-top-right">
              <div className="px-3 py-3 mb-1">
                <p className="text-[1.4rem] font-bold text-[#151717] truncate">{user?.name || 'Administrator RT'}</p>
                <p className="text-[1.2rem] text-neutral-400 truncate">{user?.email || 'admin@resida.com'}</p>
              </div>
              
              <div className="h-[1px] bg-neutral-100 mx-2 mb-1"></div>

              <div className="py-1">
                <div className="flex items-center gap-3 px-3 py-2 text-[1.3rem] text-neutral-600 font-medium hover:bg-neutral-50 rounded-xl transition-colors cursor-default">
                  <UserIcon size={16} />
                  <span>Hak Akses: Admin RT</span>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100 mx-2 mt-1 mb-1"></div>

              <div className="p-1">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full justify-start rounded-xl font-medium"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                  icon={<LogOut size={16} />}
                >
                  Keluar / Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

