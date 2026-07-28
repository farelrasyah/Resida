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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-white border-r border-neutral-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-24 px-8 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#151717] flex items-center justify-center text-white font-bold text-xl tracking-tight">
              RS
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#151717] tracking-tight leading-none">RESIDA</span>
              <span className="text-[1.1rem] text-neutral-400 font-semibold uppercase tracking-wider mt-1">Sistem RT Modern</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-[#151717] lg:hidden rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-thin scrollbar-thumb-neutral-200">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <p className="px-4 text-[1.2rem] font-bold text-neutral-400 uppercase tracking-widest">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-[100px] text-[1.5rem] font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#151717] text-white shadow-md font-semibold'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#151717]'
                        }`
                      }
                    >
                      <Icon size={20} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-neutral-100">
          <div className="p-4 rounded-2xl bg-[#F4F4F4] text-center">
            <p className="text-[1.3rem] font-bold text-[#151717]">RT Administrasi v1.0</p>
            <p className="text-[1.2rem] text-neutral-500 font-medium">Laravel API & React SPA</p>
          </div>
        </div>
      </aside>
    </>
  );
};
