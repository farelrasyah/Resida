import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Home,
  Receipt,
  CreditCard,
  TrendingDown,
  BarChart3,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Data Master',
      items: [
        { label: 'Penghuni RT', path: '/residents', icon: Users },
        { label: 'Hunian Rumah', path: '/houses', icon: Home },
        { label: 'Setting Iuran', path: '/dues-types', icon: Receipt },
      ],
    },
    {
      title: 'Transaksi',
      items: [
        { label: 'Pembayaran Iuran', path: '/payments', icon: CreditCard },
        { label: 'Pengeluaran Kas', path: '/expenses', icon: TrendingDown },
      ],
    },
    {
      title: 'Laporan Keuangan',
      items: [
        { label: 'Ringkasan Tahunan', path: '/reports/summary', icon: BarChart3 },
        { label: 'Detail Bulanan', path: '/reports/monthly', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#FDFDFD] border-r border-neutral-200/60 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-[72px] px-6 lg:px-8 flex items-center justify-between border-b border-neutral-200/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#151717] to-[#3a3d3d] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-md">
              RS
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[1.6rem] font-bold text-[#151717] tracking-tight leading-none mt-0.5">RESIDA</span>
              <span className="text-[1rem] text-neutral-400 font-semibold uppercase tracking-widest mt-0.5">Workspace</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-[#151717] hover:bg-neutral-100 lg:hidden rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-neutral-200/60 scrollbar-track-transparent">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <p className="px-3 mb-2 text-[1.1rem] font-bold text-neutral-400/80 uppercase tracking-[0.15em]">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[1.4rem] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          isActive
                            ? 'bg-neutral-100/80 text-[#151717] font-semibold shadow-sm'
                            : 'text-neutral-500 hover:bg-neutral-50 hover:text-[#151717] font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`relative flex items-center justify-center transition-transform duration-300 ${!isActive ? 'group-hover:translate-x-0.5' : ''}`}>
                            {isActive && (
                              <div className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-1 h-5 bg-[#151717] rounded-r-full" />
                            )}
                            <Icon size={18} className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-[#151717]' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                          </div>
                          <span className={`transition-transform duration-300 ${!isActive ? 'group-hover:translate-x-0.5' : ''}`}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-neutral-200/60 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[1.2rem] font-medium text-neutral-500">System Operational</span>
            </div>
            <span className="text-[1.1rem] font-semibold text-neutral-400">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

