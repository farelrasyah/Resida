import React, { useState } from 'react';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
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
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="p-2.5 rounded-full hover:bg-neutral-100 lg:hidden text-[#151717] transition-colors cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:flex flex-col">
          <h2 className="text-[1.8rem] font-bold text-[#151717] tracking-tight">Sistem Administrasi RT</h2>
          <p className="text-[1.3rem] text-neutral-400 font-medium">Selamat datang di Panel Pengelolaan RESIDA</p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#151717] text-white flex items-center justify-center font-bold text-[1.4rem]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[1.4rem] font-bold text-[#151717] leading-tight">{user?.name || 'Administrator RT'}</span>
            <span className="text-[1.2rem] text-neutral-400 font-medium">{user?.email || 'admin@resida.com'}</span>
          </div>
          <ChevronDown size={18} className="text-neutral-400" />
        </button>

        {showDropdown && (
          <div
            onClick={() => setShowDropdown(false)}
            className="fixed inset-0 z-40"
          />
        )}

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl p-3 shadow-2xl border border-neutral-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="text-[1.4rem] font-bold text-[#151717]">{user?.name || 'Administrator RT'}</p>
              <p className="text-[1.2rem] text-neutral-400">{user?.email || 'admin@resida.com'}</p>
            </div>

            <div className="py-2">
              <div className="flex items-center gap-3 px-4 py-2.5 text-[1.4rem] text-neutral-600 font-medium">
                <UserIcon size={18} />
                <span>Hak Akses: Admin RT</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <Button
                variant="danger"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                icon={<LogOut size={18} />}
              >
                Keluar / Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
