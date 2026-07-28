import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, ArrowUpRight, ArrowDownRight, 
  Receipt, Wallet, AlertCircle, Activity, ChevronRight, 
  Clock, CheckCircle, CreditCard, UserPlus
} from 'lucide-react';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Line, ComposedChart, PieChart, Pie, Cell
} from 'recharts';
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
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculateChange = (current: number, last: number) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  };

  // --- Render KPI Card ---
  const renderKPICard = (
    title: string, value: string | number, current: number, last: number, 
    icon: React.ReactNode, invertColors = false
  ) => {
    const change = calculateChange(current, last);
    const isPositive = change >= 0;
    // For expenses, an increase is technically bad, but we follow standard green=positive.
    // If invertColors is true, up arrow is red, down is green.
    const colorClass = invertColors 
      ? (isPositive ? 'text-red-500 bg-red-50' : 'text-emerald-500 bg-emerald-50')
      : (isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50');

    const IconArrow = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
      <Card className="flex flex-col justify-between p-6 hover:shadow-lg transition-shadow duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#151717] group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <div className="text-right">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              {title}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-[2.8rem] font-bold text-[#151717] tracking-tight leading-none mb-2">
              {value}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`flex items-center text-[1.2rem] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                <IconArrow size={14} className="mr-1" />
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-[1.2rem] text-neutral-400 font-medium">vs bln lalu</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><Skeleton height="4rem" width="300px" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} height="16rem" className="rounded-2xl" />)}
        </div>
        <Skeleton height="400px" className="rounded-2xl" />
      </div>
    );
  }

  const { kpis, charts, widgets } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-[2.4rem] font-bold text-[#151717] tracking-tight">Dashboard Ringkasan RT</h1>
          <p className="text-[1.4rem] text-neutral-500 font-medium mt-1">
            Pantau kondisi finansial dan hunian secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/payments/new">
            <Button icon={<Plus size={18} />}>Catat Iuran</Button>
          </Link>
          <Link to="/expenses">
            <Button variant="outline" icon={<Receipt size={18} />}>Catat Pengeluaran</Button>
          </Link>
        </div>
      </div>

      {/* 1. Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {renderKPICard(
          "Pemasukan Bln Ini", 
          formatCurrency(kpis.current_month_income), 
          kpis.current_month_income, 
          kpis.last_month_income, 
          <ArrowUpRight size={22} />
        )}
        {renderKPICard(
          "Pengeluaran Bln Ini", 
          formatCurrency(kpis.current_month_expense), 
          kpis.current_month_expense, 
          kpis.last_month_expense, 
          <ArrowDownRight size={22} />,
          true
        )}
        {renderKPICard(
          "Saldo Kas RT", 
          formatCurrency(kpis.current_balance), 
          kpis.current_balance, 
          kpis.current_balance - (kpis.current_month_income - kpis.current_month_expense), // approx last month bal
          <Wallet size={22} />
        )}
        {renderKPICard(
          "Total Penghuni", 
          kpis.total_residents.toString(), 
          kpis.total_residents, 
          kpis.total_residents_last_month, 
          <Users size={22} />
        )}
      </div>

      {/* 2. Main Analytics & Pie */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Chart (Cash Flow) */}
        <Card className="xl:col-span-8 p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-[1.8rem] font-bold text-[#151717]">Statistik Arus Kas</h3>
              <p className="text-[1.3rem] text-neutral-400 font-medium">Pemasukan vs Pengeluaran 12 Bulan Terakhir</p>
            </div>
            <select className="bg-neutral-50 border border-neutral-200 text-[#151717] rounded-lg px-4 py-2 text-[1.3rem] font-medium focus:outline-none focus:ring-2 focus:ring-[#151717]">
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="p-6 flex-1 min-h-[350px] bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={charts.cash_flow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis 
                  yAxisId="left" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }} 
                  tickFormatter={(val) => `Rp${val / 1000000}Jt`}
                />
                <Tooltip 
                  cursor={{ fill: '#f4f4f4' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value))}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '1.2rem', paddingTop: '20px' }} />
                <Bar yAxisId="left" dataKey="income" name="Pemasukan" fill="#151717" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="left" dataKey="expense" name="Pengeluaran" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="left" type="monotone" dataKey="balance" name="Saldo Kumulatif" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Side: Donut Chart & Progress */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="text-[1.8rem] font-bold text-[#151717] mb-6">Target Iuran Bulan Ini</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[1.4rem] font-medium text-neutral-500">Progress Pembayaran</span>
              <span className="text-[1.6rem] font-bold text-[#151717]">
                {kpis.expected_periods > 0 ? Math.round((kpis.paid_periods / kpis.expected_periods) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className="bg-[#151717] h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${kpis.expected_periods > 0 ? (kpis.paid_periods / kpis.expected_periods) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-[1.2rem] text-emerald-600 font-bold mb-1">Sudah Bayar</p>
                <p className="text-[2.2rem] font-bold text-emerald-700">{kpis.paid_periods} <span className="text-[1.4rem] font-normal">Rumah</span></p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-[1.2rem] text-red-600 font-bold mb-1">Belum Bayar</p>
                <p className="text-[2.2rem] font-bold text-red-700">{kpis.unpaid_periods} <span className="text-[1.4rem] font-normal">Rumah</span></p>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex-1 flex flex-col">
            <h3 className="text-[1.8rem] font-bold text-[#151717] mb-2">Komposisi Hunian</h3>
            <div className="flex-1 min-h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.house_composition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {charts.house_composition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-[3rem] font-bold text-[#151717] leading-none">{kpis.total_houses}</span>
                <span className="text-[1.2rem] text-neutral-400 font-medium mt-1">Total Unit</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Small Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Defaulters */}
        <Card className="p-0 overflow-hidden flex flex-col h-[380px]">
          <div className="p-6 border-b border-neutral-100 bg-white flex justify-between items-center">
            <h3 className="text-[1.6rem] font-bold text-[#151717] flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" /> Penunggak Terbanyak
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {widgets.top_defaulters.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <CheckCircle size={32} className="text-emerald-400 mb-2" />
                <p className="text-[1.4rem]">Semua warga taat membayar.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {widgets.top_defaulters.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[1.2rem]">
                        {d.house_number}
                      </div>
                      <div>
                        <p className="text-[1.4rem] font-bold text-[#151717]">{d.resident}</p>
                        <p className="text-[1.2rem] text-neutral-400 font-medium">Blok {d.house_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[1.4rem] font-bold text-red-600">{d.unpaid_count} Bln</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-0 overflow-hidden flex flex-col h-[380px] md:col-span-2">
          <div className="p-6 border-b border-neutral-100 bg-white flex justify-between items-center">
            <h3 className="text-[1.6rem] font-bold text-[#151717] flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" /> Aktivitas Terbaru
            </h3>
            <Link to="/reports/summary" className="text-[1.3rem] font-bold text-[#151717] hover:underline flex items-center">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="relative border-l-2 border-neutral-100 ml-4 space-y-8 pl-8 pb-4">
              {widgets.recent_activities.length === 0 ? (
                <p className="text-[1.4rem] text-neutral-400">Belum ada aktivitas.</p>
              ) : (
                widgets.recent_activities.slice(0,5).map((act, i) => {
                  let Icon = Receipt;
                  let colorClass = 'bg-[#151717] text-white';
                  if (act.type === 'expense') {
                    Icon = CreditCard;
                    colorClass = 'bg-amber-100 text-amber-600';
                  } else if (act.type === 'resident') {
                    Icon = UserPlus;
                    colorClass = 'bg-blue-100 text-blue-600';
                  }

                  return (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${colorClass}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-[1.4rem] font-bold text-[#151717]">{act.title}</p>
                          <p className="text-[1.3rem] font-medium text-emerald-600">{act.subtitle}</p>
                        </div>
                        <div className="flex items-center text-neutral-400 text-[1.2rem] gap-1">
                          <Clock size={12} /> {act.date}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Table Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-white flex justify-between items-center">
          <div>
            <h3 className="text-[1.8rem] font-bold text-[#151717]">Pembayaran Iuran Terbaru</h3>
            <p className="text-[1.3rem] text-neutral-400 font-medium">Daftar transaksi pembayaran masuk ke kas RT.</p>
          </div>
          <Link to="/payments">
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-6 py-4 text-[1.3rem] font-bold text-neutral-500">Tanggal</th>
                <th className="px-6 py-4 text-[1.3rem] font-bold text-neutral-500">No. Rumah</th>
                <th className="px-6 py-4 text-[1.3rem] font-bold text-neutral-500">Nominal</th>
                <th className="px-6 py-4 text-[1.3rem] font-bold text-neutral-500">Metode</th>
                <th className="px-6 py-4 text-[1.3rem] font-bold text-neutral-500">Penerima (Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {widgets.latest_payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[1.4rem] text-neutral-400">
                    Belum ada data pembayaran.
                  </td>
                </tr>
              ) : (
                widgets.latest_payments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 text-[1.4rem] text-neutral-500 font-medium">{p.date}</td>
                    <td className="px-6 py-4 text-[1.4rem] font-bold text-[#151717]">{p.house}</td>
                    <td className="px-6 py-4 text-[1.4rem] font-bold text-emerald-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[1.2rem] font-bold bg-neutral-100 text-neutral-600">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[1.4rem] text-neutral-500">{p.admin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
