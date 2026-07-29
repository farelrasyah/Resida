import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#151717] font-['Instrument_Sans'] flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px]">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-[1600px] w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
