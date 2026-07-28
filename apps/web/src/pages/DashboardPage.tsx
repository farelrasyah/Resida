import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ArrowUpRight, Plus, Receipt } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { reportService } from '../api/report.service';
import type { DashboardData } from '../types/report.types';
import { ApiError } from '../api/client';
import { useToast } from '../hooks/useToast';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getDashboard();
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat ringkasan dashboard.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Dashboard Ringkasan RT</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Pantau statistik hunian warga dan kesehatan kas RT secara real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/payments/new">
            <Button icon={<Plus size={18} />}>
              Catat Pembayaran
            </Button>
          </Link>
          <Link to="/expenses">
            <Button variant="outline" icon={<Plus size={18} />}>
              Catat Pengeluaran
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total & Hunian Rumah */}
        <Card className="flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Status Rumah</span>
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#151717]">
              <Home size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton height="3rem" width="50%" />
            ) : (
              <div className="space-y-1">
                <p className="text-[3.2rem] font-bold text-[#151717] tracking-tight">
                  {data?.occupied_houses || 0}{' '}
                  <span className="text-[1.8rem] text-neutral-400 font-medium">/ {data?.total_houses || 0} Unit</span>
                </p>
                <p className="text-[1.3rem] text-emerald-600 font-semibold">
                  {data?.occupied_houses || 0} Dihuni, {data?.vacant_houses || 0} Kosong
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Saldo Kas RT */}
        <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Total Saldo Kas RT</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton height="3rem" width="70%" />
            ) : (
              <p className="text-[3rem] font-bold text-emerald-700 tracking-tight">
                {formatCurrency(data?.current_balance || 0)}
              </p>
            )}
          </div>
        </Card>

        {/* Card 3: Pemasukan Bulan Ini */}
        <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Pemasukan Bulan Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton height="3rem" width="70%" />
            ) : (
              <p className="text-[3rem] font-bold text-sky-700 tracking-tight">
                {formatCurrency(data?.current_month_income || 0)}
              </p>
            )}
          </div>
        </Card>

        {/* Card 4: Pengeluaran Bulan Ini */}
        <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Pengeluaran Bulan Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowUpRight size={20} className="rotate-90" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton height="3rem" width="70%" />
            ) : (
              <p className="text-[3rem] font-bold text-amber-700 tracking-tight">
                {formatCurrency(data?.current_month_expense || 0)}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/residents" className="group">
          <Card className="flex items-center justify-between hover:border-neutral-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#151717] text-white flex items-center justify-center font-bold">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-[1.8rem] font-bold text-[#151717] group-hover:text-emerald-700 transition-colors">
                  Master Data Penghuni
                </h3>
                <p className="text-[1.3rem] text-neutral-400 font-medium">Kelola warga tetap & kontrak</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="text-neutral-400 group-hover:text-[#151717] transition-colors" />
          </Card>
        </Link>

        <Link to="/houses" className="group">
          <Card className="flex items-center justify-between hover:border-neutral-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#151717] text-white flex items-center justify-center font-bold">
                <Home size={22} />
              </div>
              <div>
                <h3 className="text-[1.8rem] font-bold text-[#151717] group-hover:text-emerald-700 transition-colors">
                  Master Hunian Rumah
                </h3>
                <p className="text-[1.3rem] text-neutral-400 font-medium">Atur unit & penempatan warga</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="text-neutral-400 group-hover:text-[#151717] transition-colors" />
          </Card>
        </Link>

        <Link to="/reports/summary" className="group">
          <Card className="flex items-center justify-between hover:border-neutral-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#151717] text-white flex items-center justify-center font-bold">
                <Receipt size={22} />
              </div>
              <div>
                <h3 className="text-[1.8rem] font-bold text-[#151717] group-hover:text-emerald-700 transition-colors">
                  Laporan Rekapitulasi
                </h3>
                <p className="text-[1.3rem] text-neutral-400 font-medium">Unduh PDF kas & iuran RT</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="text-neutral-400 group-hover:text-[#151717] transition-colors" />
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
