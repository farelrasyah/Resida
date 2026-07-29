import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { MoreVertical } from 'lucide-react';
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
      return `${(val / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', '');
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const calculateChange = (current: number, last: number) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return ((current - last) / last) * 100;
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-[600px] text-[#64748B]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C50E0]"></div>
      </div>
    );
  }

  const { kpis, charts, widgets } = data;

  // Colors based on TailAdmin reference
  const primaryColor = '#151717';
  const secondaryColor = '#A3A3A3';
  const positiveBg = '#E1F3EA';
  const positiveText = '#219653';
  const negativeBg = '#FEE8E8';
  const negativeText = '#D34053';
  const cardBorder = '#E2E8F0';
  const textDark = '#1C2434';
  const textGray = '#64748B';

  // --- KPI Card Render ---
  const renderKPI = (title: string, value: string, current: number, last: number, invertColors = false) => {
    const change = calculateChange(current, last);
    const isPositive = change >= 0;
    
    // Determine badge styling based on TailAdmin reference
    let badgeBg = isPositive ? positiveBg : negativeBg;
    let badgeText = isPositive ? positiveText : negativeText;
    
    if (invertColors) {
      badgeBg = isPositive ? negativeBg : positiveBg;
      badgeText = isPositive ? negativeText : positiveText;
    }

    const sign = isPositive ? '+' : '';

    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm flex flex-col justify-center" style={{ borderColor: cardBorder }}>
        <h4 className="text-[14px] font-medium mb-3" style={{ color: textGray }}>{title}</h4>
        <div className="flex items-end justify-between">
          <h2 className="text-[28px] font-bold leading-none tracking-tight" style={{ color: textDark }}>
            {value}
          </h2>
          <div className="flex items-center gap-2">
            <span 
              className="text-[12px] font-bold px-2 py-0.5 rounded" 
              style={{ backgroundColor: badgeBg, color: badgeText }}
            >
              {sign}{change.toFixed(1)}%
            </span>
            <span className="text-[12px] font-medium" style={{ color: textGray }}>
              Vs bulan lalu
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 font-sans">
      
      {/* 1. ROW: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {renderKPI('Pemasukan Bulan Ini', formatCurrency(kpis.current_month_income), kpis.current_month_income, kpis.last_month_income)}
        {renderKPI('Pengeluaran Bulan Ini', formatCurrency(kpis.current_month_expense), kpis.current_month_expense, kpis.last_month_expense, true)}
        {renderKPI('Total Saldo Kas', formatCurrency(kpis.current_balance), kpis.current_balance, kpis.current_balance - (kpis.current_month_income - kpis.current_month_expense))}
        {renderKPI('Total Penghuni', formatNumber(kpis.total_residents), kpis.total_residents, kpis.total_residents_last_month)}
      </div>

      {/* 2. ROW: Main Analytics Chart (12 Columns) */}
      <div className="rounded-t-xl border bg-white shadow-sm" style={{ borderColor: cardBorder }}>
        <div className="p-6 border-b flex items-start justify-between" style={{ borderColor: cardBorder }}>
          <div>
            <h3 className="text-[18px] font-bold" style={{ color: textDark }}>Analytics</h3>
            <p className="text-[14px] mt-1" style={{ color: textGray }}>Perbandingan arus kas selama 12 bulan terakhir.</p>
          </div>
          <div className="flex gap-2">
            <select className="text-[13px] font-medium rounded-md px-3 py-1.5 border outline-none" style={{ borderColor: cardBorder, color: textDark }}>
              <option>12 bulan</option>
            </select>
          </div>
        </div>
        <div className="p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.cash_flow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: textGray }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: textGray }} 
                tickFormatter={(val) => `${val / 1000000}M`}
              />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '8px', border: `1px solid ${cardBorder}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value))}
              />
              <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '14px', color: textDark, fontWeight: 500 }} />
              <Bar dataKey="income" name="Pemasukan" stackId="a" fill={primaryColor} maxBarSize={40} />
              <Bar dataKey="expense" name="Pengeluaran" stackId="a" fill={secondaryColor} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. ROW: 3 Widgets (4 cols each) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Top Channels style -> Top Defaulters */}
        <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[420px]" style={{ borderColor: cardBorder }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: cardBorder }}>
            <h3 className="text-[18px] font-bold" style={{ color: textDark }}>Penunggak Terbanyak</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="flex justify-between px-5 py-3 border-b text-[12px] font-medium" style={{ borderColor: cardBorder, color: textGray }}>
              <span>Sumber Warga</span>
              <span>Bulan Tunggakan</span>
            </div>
            {widgets.top_defaulters.length === 0 ? (
              <div className="p-5 text-center text-[14px]" style={{ color: textGray }}>Tidak ada penunggak.</div>
            ) : (
              widgets.top_defaulters.map((d, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-[15px] font-bold" style={{ color: textDark }}>{d.resident}</p>
                    <p className="text-[13px]" style={{ color: textGray }}>Blok {d.house_number}</p>
                  </div>
                  <div className="text-right text-[15px] font-bold" style={{ color: textDark }}>
                    {d.unpaid_count}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t flex justify-center" style={{ borderColor: cardBorder }}>
            <button className="text-[14px] font-medium flex items-center gap-1 hover:underline" style={{ color: textDark }}>
              Lihat Detail →
            </button>
          </div>
        </div>

        {/* Sessions By Device style -> Komposisi Hunian */}
        <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[420px]" style={{ borderColor: cardBorder }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: cardBorder }}>
            <h3 className="text-[18px] font-bold" style={{ color: textDark }}>Komposisi Hunian</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.house_composition}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {/* Manually override colors to match monochrome style */}
                    <Cell fill={primaryColor} />
                    <Cell fill={secondaryColor} />
                    <Cell fill="#E5E5E5" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: `1px solid ${cardBorder}` }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 w-full">
              {charts.house_composition.map((entry, index) => {
                const colors = [primaryColor, secondaryColor, '#E5E5E5'];
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
                    <span className="text-[13px] font-medium" style={{ color: textGray }}>{entry.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Users style -> Aktivitas (Mini Chart + Stats) */}
        <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[420px]" style={{ borderColor: cardBorder }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: cardBorder }}>
            <h3 className="text-[18px] font-bold" style={{ color: textDark }}>Progres Pembayaran</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#10B981' }}></div>
              <span className="text-[24px] font-bold" style={{ color: textDark }}>
                {kpis.paid_periods}
              </span>
              <span className="text-[14px] font-medium" style={{ color: textGray }}>
                Tagihan lunas bulan ini
              </span>
            </div>
            
            {/* Fake Sparkline Area Chart to match "Active Users" widget look */}
            <div className="h-[120px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.cash_flow.slice(-7)}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="income" stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center border-t pt-5" style={{ borderColor: cardBorder }}>
              <div>
                <p className="text-[20px] font-bold" style={{ color: textDark }}>{kpis.expected_periods}</p>
                <p className="text-[12px]" style={{ color: textGray }}>Target Total</p>
              </div>
              <div>
                <p className="text-[20px] font-bold" style={{ color: textDark }}>{kpis.unpaid_periods}</p>
                <p className="text-[12px]" style={{ color: textGray }}>Belum Bayar</p>
              </div>
              <div>
                <p className="text-[20px] font-bold" style={{ color: textDark }}>
                  {kpis.expected_periods > 0 ? Math.round((kpis.paid_periods / kpis.expected_periods) * 100) : 0}%
                </p>
                <p className="text-[12px]" style={{ color: textGray }}>Pencapaian</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. ROW: Recent Orders style -> Data Table (12 cols) */}
      <div className="rounded-xl border bg-white shadow-sm" style={{ borderColor: cardBorder }}>
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: cardBorder }}>
          <h3 className="text-[18px] font-bold" style={{ color: textDark }}>Pembayaran Iuran Terbaru</h3>
          <div className="flex gap-3">
            <button className="px-4 py-1.5 border rounded-md text-[13px] font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors" style={{ borderColor: cardBorder, color: textDark }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.16666 3.5H12.8333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 7H10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.83334 10.5H8.16667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter
            </button>
            <button className="px-4 py-1.5 border rounded-md text-[13px] font-medium hover:bg-slate-50 transition-colors" style={{ borderColor: cardBorder, color: textDark }}>
              See all
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: cardBorder }}>
                <th className="px-6 py-4 text-[13px] font-medium" style={{ color: textGray }}>Tanggal</th>
                <th className="px-6 py-4 text-[13px] font-medium" style={{ color: textGray }}>No. Rumah</th>
                <th className="px-6 py-4 text-[13px] font-medium" style={{ color: textGray }}>Metode</th>
                <th className="px-6 py-4 text-[13px] font-medium" style={{ color: textGray }}>Status</th>
                <th className="px-6 py-4 text-[13px] font-medium" style={{ color: textGray }}>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {widgets.latest_payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[14px]" style={{ color: textGray }}>
                    Belum ada data pembayaran.
                  </td>
                </tr>
              ) : (
                widgets.latest_payments.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50/50 transition-colors" style={{ borderColor: cardBorder }}>
                    <td className="px-6 py-4 text-[14px] font-medium" style={{ color: textDark }}>{p.date}</td>
                    <td className="px-6 py-4 text-[14px]" style={{ color: textGray }}>Blok {p.house}</td>
                    <td className="px-6 py-4 text-[14px]" style={{ color: textGray }}>{p.method}</td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-bold" style={{ color: positiveText }}>Lunas</span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-medium" style={{ color: textDark }}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
