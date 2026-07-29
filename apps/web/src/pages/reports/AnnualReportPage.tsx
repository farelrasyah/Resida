import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Download, Search, Printer, TrendingUp, TrendingDown,
  DollarSign, CreditCard, Wallet, ArrowUpDown, ArrowUp,
  ArrowDown, Calendar, ChevronDown, FileText, X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { reportService } from '../../api/report.service';
import type { AnnualSummaryReport } from '../../types/report.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

type SortField = 'month' | 'income' | 'expense' | 'net' | 'balance';
type SortDir = 'asc' | 'desc';

const CardWithAccent: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  isLoading?: boolean;
}> = ({ icon, label, value, subtitle, isLoading }) => (
  <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 relative overflow-hidden transition-all duration-200 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] hover:border-neutral-300 print:hidden">
    <div className="absolute top-0 left-4 right-4 h-[2px] bg-neutral-900/10 rounded-full" />
    {isLoading ? (
      <div className="space-y-3 pt-1">
        <Skeleton height="1.4rem" width="11rem" />
        <Skeleton height="2.8rem" width="18rem" />
        {subtitle && <Skeleton height="1.2rem" width="13rem" />}
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[1.3rem] font-medium text-neutral-400 tracking-tight">{label}</span>
          <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <p className="text-[2.6rem] font-bold text-neutral-900 tracking-tight leading-none mb-2 font-['Instrument_Sans']">
          {value}
        </p>
        {subtitle && (
          <p className="text-[1.2rem] text-neutral-400 font-medium">{subtitle}</p>
        )}
      </>
    )}
  </div>
);

const SortIcon: React.FC<{ field: SortField; currentField: SortField; dir: SortDir }> = ({ field, currentField, dir }) => {
  if (currentField !== field) return <ArrowUpDown size={11} className="text-neutral-300 group-hover:text-neutral-400 transition-colors" />;
  return dir === 'asc'
    ? <ArrowUp size={11} className="text-neutral-600" />
    : <ArrowDown size={11} className="text-neutral-600" />;
};

export const AnnualReportPage: React.FC = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<AnnualSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('month');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await reportService.getAnnualSummary(year);
        if (!ignore && response.success && response.data) {
          setReport(response.data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          if (err instanceof ApiError) {
            showToast(err.message, 'error');
          } else {
            showToast('Gagal memuat laporan tahunan.', 'error');
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchReport();
    return () => { ignore = true; };
  }, [year, showToast]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setIsYearOpen(false);
      }
    };
    if (isYearOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isYearOpen]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const formatCurrencyShort = (val: number) => {
    if (val >= 1000000000) return `Rp${(val / 1000000000).toFixed(1)}M`;
    if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)}jt`;
    if (val >= 1000) return `Rp${(val / 1000).toFixed(0)}rb`;
    return `Rp${val}`;
  };

  const totalIncome = report?.months.reduce((acc, m) => acc + m.income, 0) || 0;
  const totalExpense = report?.months.reduce((acc, m) => acc + m.expense, 0) || 0;
  const netTotal = totalIncome - totalExpense;
  const lastEndingBalance = report?.months.length
    ? report.months[report.months.length - 1].balance
    : (report?.starting_balance || 0);
  const avgIncome = report?.months.length ? totalIncome / report.months.length : 0;
  const avgExpense = report?.months.length ? totalExpense / report.months.length : 0;

  const filteredMonths = useMemo(() => {
    if (!report) return [];
    let months = [...report.months];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      months = months.filter(m => MONTH_NAMES[m.month - 1].toLowerCase().includes(q));
    }
    months.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'month': cmp = a.month - b.month; break;
        case 'income': cmp = a.income - b.income; break;
        case 'expense': cmp = a.expense - b.expense; break;
        case 'net': cmp = (a.income - a.expense) - (b.income - b.expense); break;
        case 'balance': cmp = a.balance - b.balance; break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return months;
  }, [report, searchQuery, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'month' ? 'asc' : 'desc');
    }
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (!report) return;
    const headers = ['Bulan', 'Pemasukan', 'Pengeluaran', 'Surplus/Defisit', 'Saldo Kas'];
    const rows = report.months.map(m => [
      MONTH_NAMES[m.month - 1],
      m.income.toString(),
      m.expense.toString(),
      (m.income - m.expense).toString(),
      m.balance.toString(),
    ]);
    rows.push([
      `TOTAL ${year}`,
      totalIncome.toString(),
      totalExpense.toString(),
      netTotal.toString(),
      lastEndingBalance.toString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-kas-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const now = new Date();
  const docId = `RPT-ANN-${year}-${now.getTime().toString().slice(-6)}`;

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <tr key={idx} className="border-b border-neutral-100">
        <td className="px-6 py-4"><Skeleton height="1.6rem" width="9rem" /></td>
        <td className="px-6 py-4"><Skeleton height="1.6rem" width="13rem" /></td>
        <td className="px-6 py-4"><Skeleton height="1.6rem" width="13rem" /></td>
        <td className="px-6 py-4"><Skeleton height="1.6rem" width="11rem" /></td>
        <td className="px-6 py-4"><Skeleton height="1.6rem" width="14rem" /></td>
      </tr>
    ));

  const renderSkeletonCards = () =>
    Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3">
        <Skeleton height="1.4rem" width="10rem" />
        <Skeleton height="2.4rem" width="16rem" />
        <Skeleton height="1.2rem" width="12rem" />
      </div>
    ));

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-300 relative print:p-0 print:m-0 print:space-y-0">
      
      {/* WATERMARK PRINT ONLY */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-[-1] overflow-hidden">
        <div className="text-[12rem] font-bold text-neutral-900 opacity-[0.03] -rotate-45 select-none whitespace-nowrap">
          RESIDA CONFIDENTIAL
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <h1 className="text-[3.2rem] md:text-[3.6rem] font-bold text-neutral-900 tracking-tight leading-none">
            Laporan Kas Tahunan
          </h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium leading-snug max-w-2xl">
            Rekapitulasi pemasukan iuran & pengeluaran operasional RT · Tahun {year}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(o => !o)}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-neutral-200/80 rounded-xl text-[1.4rem] font-medium text-neutral-700 hover:border-neutral-300 hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] transition-all duration-200"
            >
              <Calendar size={15} className="text-neutral-400" />
              <span className="min-w-[4rem] text-left">{year}</span>
              <ChevronDown size={13} className={`text-neutral-400 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`} />
            </button>
            {isYearOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-neutral-200/80 rounded-xl shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] z-20 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => { setYear(y); setIsYearOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[1.4rem] font-medium transition-colors duration-150 ${
                      y === year
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" icon={<Download size={15} />} onClick={handleExportCSV}>
            Export
          </Button>

          <Button variant="secondary" size="sm" icon={<Printer size={15} />} onClick={handlePrint}>
            Cetak
          </Button>
        </div>
      </div>

      {/* ===== PRINT HEADER (ENTERPRISE) ===== */}
      <div className="hidden print:block w-full mb-8">
        <div className="flex justify-between items-start border-b-[3px] border-black pb-6">
          {/* Logo & Company */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl print-exact-color">
              RS
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black m-0 leading-tight">SISTEM RT RESIDA</h1>
              <p className="text-sm text-neutral-600 m-0 mt-1 font-medium">Laporan Resmi Pengurus Rukun Tetangga</p>
            </div>
          </div>
          {/* Meta Data */}
          <div className="text-right">
            <div className="inline-block border border-black px-2 py-1 mb-2">
              <p className="text-xs font-bold tracking-widest uppercase m-0">Official Report</p>
            </div>
            <table className="text-xs text-neutral-600 ml-auto">
              <tbody>
                <tr><td className="pr-3 text-right">Document ID:</td><td className="font-semibold text-black">{docId}</td></tr>
                <tr><td className="pr-3 text-right">Generated Date:</td><td className="font-semibold text-black">{now.toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td></tr>
                <tr><td className="pr-3 text-right">Generated By:</td><td className="font-semibold text-black">{user?.name || 'Administrator'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-black">Laporan Keuangan Tahunan</h2>
          <p className="text-base text-neutral-600 mt-2 font-medium">Periode Tahun Pembukuan {year}</p>
        </div>
      </div>

      {/* ===== PRINT SUMMARY (ENTERPRISE) ===== */}
      <div className="hidden print:flex mb-8 border border-neutral-300 p-6 w-full justify-between">
        <div className="text-center px-4">
          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Total Pemasukan</p>
          <p className="text-xl font-bold text-black">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="w-[1px] bg-neutral-300"></div>
        <div className="text-center px-4">
          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Total Pengeluaran</p>
          <p className="text-xl font-bold text-black">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="w-[1px] bg-neutral-300"></div>
        <div className="text-center px-4">
          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Surplus / Defisit</p>
          <p className="text-xl font-bold text-black">{netTotal >= 0 ? '+' : ''}{formatCurrency(netTotal)}</p>
        </div>
        <div className="w-[1px] bg-neutral-300"></div>
        <div className="text-center px-4">
          <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">Saldo Akhir</p>
          <p className="text-xl font-bold text-black">{formatCurrency(lastEndingBalance)}</p>
        </div>
      </div>

      {/* ===== KPI CARDS (DASHBOARD ONLY) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
        <CardWithAccent
          icon={<DollarSign size={14} className="text-neutral-600" />}
          label="Total Pemasukan"
          value={formatCurrency(totalIncome)}
          subtitle={`Rata-rata ${formatCurrencyShort(avgIncome)}/bulan`}
          isLoading={isLoading}
        />
        <CardWithAccent
          icon={<CreditCard size={14} className="text-neutral-600" />}
          label="Total Pengeluaran"
          value={formatCurrency(totalExpense)}
          subtitle={`Rata-rata ${formatCurrencyShort(avgExpense)}/bulan`}
          isLoading={isLoading}
        />
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 relative overflow-hidden transition-all duration-200 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] hover:border-neutral-300 sm:col-span-2 lg:col-span-1 print:hidden">
          <div className="absolute top-0 left-4 right-4 h-[2px] bg-neutral-900/10 rounded-full" />
          {isLoading ? (
            <div className="space-y-3 pt-1">
              <Skeleton height="1.4rem" width="11rem" />
              <Skeleton height="2.8rem" width="18rem" />
              <Skeleton height="1.2rem" width="14rem" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[1.3rem] font-medium text-neutral-400 tracking-tight">Saldo Kas Akhir</span>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Wallet size={14} className="text-neutral-600" />
                </div>
              </div>
              <p className="text-[2.6rem] font-bold text-neutral-900 tracking-tight leading-none mb-2">
                {formatCurrency(lastEndingBalance)}
              </p>
              <div className="flex items-center gap-1.5">
                {netTotal >= 0 ? (
                  <>
                    <TrendingUp size={13} className="text-emerald-500" />
                    <span className="text-[1.2rem] font-medium text-emerald-600">Surplus {formatCurrencyShort(netTotal)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown size={13} className="text-red-500" />
                    <span className="text-[1.2rem] font-medium text-red-500">Defisit {formatCurrencyShort(Math.abs(netTotal))}</span>
                  </>
                )}
                <span className="text-[1.2rem] text-neutral-400">tahun ini</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== CONTROLS BAR ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden mt-6">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari bulan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-neutral-200/80 rounded-xl text-[1.4rem] font-medium text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {!isLoading && report && (
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-neutral-400" />
            <span className="text-[1.3rem] text-neutral-400 font-medium">
              {filteredMonths.length} dari {report.months.length} bulan
            </span>
          </div>
        )}
      </div>

      {/* ===== TABLE (RESPONSIVE & PRINT) ===== */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden print:border-none print:shadow-none print:overflow-visible print:rounded-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse print:table">
            <thead className="print:table-header-group">
              <tr className="border-b border-neutral-200 bg-neutral-50/50 print:bg-white print:border-t-2 print:border-b-2 print:border-black">
                {([
                  { key: 'month' as SortField, label: 'Bulan', align: 'text-left' },
                  { key: 'income' as SortField, label: 'Pemasukan', align: 'text-right' },
                  { key: 'expense' as SortField, label: 'Pengeluaran', align: 'text-right' },
                  { key: 'net' as SortField, label: 'Surplus / Defisit', align: 'text-right' },
                  { key: 'balance' as SortField, label: 'Saldo Kas', align: 'text-right' },
                ]).map(col => (
                  <th key={col.key} className={`sticky top-0 z-10 px-6 py-4 ${col.align} bg-neutral-50/50 backdrop-blur-sm print:static print:bg-transparent print:backdrop-blur-none print:py-3 print:px-4`}>
                    <button
                      onClick={() => handleSort(col.key)}
                      className="group inline-flex items-center gap-1.5 text-[1.2rem] font-semibold text-neutral-400 uppercase tracking-wider hover:text-neutral-600 transition-colors duration-150 print:text-black print:text-[11px] print:pointer-events-none"
                    >
                      {col.label}
                      <span className="print:hidden"><SortIcon field={col.key} currentField={sortField} dir={sortDir} /></span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/80 print:divide-neutral-300">
              {isLoading ? (
                renderSkeletonRows()
              ) : filteredMonths.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center print:py-8">
                    <div className="flex flex-col items-center gap-3 print:hidden">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                        <Search size={20} className="text-neutral-300" />
                      </div>
                      <p className="text-[1.5rem] font-medium text-neutral-400">
                        {searchQuery ? 'Tidak ada bulan yang cocok dengan pencarian.' : 'Belum ada data untuk tahun ini.'}
                      </p>
                    </div>
                    <div className="hidden print:block text-sm text-neutral-500 font-medium">Belum ada data untuk tahun ini.</div>
                  </td>
                </tr>
              ) : (
                filteredMonths.map((m, idx) => {
                  const net = m.income - m.expense;
                  return (
                    <tr
                      key={m.month}
                      className={`transition-all duration-150 hover:bg-neutral-50 cursor-default print:hover:bg-transparent ${
                        idx % 2 === 1 ? 'bg-neutral-50/30 print:bg-neutral-50/50' : 'print:bg-white'
                      }`}
                    >
                      <td className="px-6 py-4 print:py-3 print:px-4">
                        <span className="text-[1.4rem] font-semibold text-neutral-800 print:text-[12px] print:text-black">
                          {MONTH_NAMES[m.month - 1]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:py-3 print:px-4">
                        <span className="text-[1.4rem] font-medium text-neutral-800 tabular-nums print:text-[12px] print:text-black">
                          {formatCurrency(m.income)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:py-3 print:px-4">
                        <span className="text-[1.4rem] font-medium text-neutral-800 tabular-nums print:text-[12px] print:text-black">
                          {formatCurrency(m.expense)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:py-3 print:px-4">
                        <span className={`text-[1.4rem] font-semibold tabular-nums print:text-[12px] ${
                          net > 0 ? 'text-emerald-600 print:text-black' : net < 0 ? 'text-red-500 print:text-black' : 'text-neutral-500 print:text-black'
                        }`}>
                          {net >= 0 ? '+' : ''}{formatCurrency(net)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:py-3 print:px-4">
                        <span className="text-[1.4rem] font-semibold text-neutral-800 tabular-nums print:text-[12px] print:text-black">
                          {formatCurrency(m.balance)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {!isLoading && report && report.months.length > 0 && (
              <tfoot className="print:table-footer-group">
                <tr className="border-t-2 border-neutral-200 bg-neutral-50/80 print:bg-white print:border-black print:border-t-[3px]">
                  <td className="px-6 py-4 print:py-3 print:px-4">
                    <span className="text-[1.4rem] font-bold text-neutral-800 print:text-[12px] print:text-black">Total Tahun {year}</span>
                  </td>
                  <td className="px-6 py-4 text-right print:py-3 print:px-4">
                    <span className="text-[1.4rem] font-bold text-neutral-800 tabular-nums print:text-[12px] print:text-black">{formatCurrency(totalIncome)}</span>
                  </td>
                  <td className="px-6 py-4 text-right print:py-3 print:px-4">
                    <span className="text-[1.4rem] font-bold text-neutral-800 tabular-nums print:text-[12px] print:text-black">{formatCurrency(totalExpense)}</span>
                  </td>
                  <td className="px-6 py-4 text-right print:py-3 print:px-4">
                    <span className={`text-[1.4rem] font-bold tabular-nums print:text-[12px] print:text-black ${
                      netTotal > 0 ? 'text-emerald-600' : netTotal < 0 ? 'text-red-500' : 'text-neutral-800'
                    }`}>
                      {netTotal >= 0 ? '+' : ''}{formatCurrency(netTotal)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right print:py-3 print:px-4">
                    <span className="text-[1.4rem] font-bold text-neutral-800 tabular-nums print:text-[12px] print:text-black">{formatCurrency(lastEndingBalance)}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ===== CARD LIST (MOBILE) ===== */}
      <div className="md:hidden space-y-3 print:hidden">
        {isLoading ? (
          renderSkeletonCards()
        ) : filteredMonths.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200/80 p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                <Search size={20} className="text-neutral-300" />
              </div>
              <p className="text-[1.5rem] font-medium text-neutral-400">
                {searchQuery ? 'Tidak ada bulan yang cocok.' : 'Belum ada data.'}
              </p>
            </div>
          </div>
        ) : (
          filteredMonths.map((m, idx) => {
            const net = m.income - m.expense;
            return (
              <div
                key={m.month}
                className="bg-white rounded-xl border border-neutral-200/80 p-5 space-y-3 transition-all duration-200 hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.04)]"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[1.5rem] font-bold text-neutral-800">{MONTH_NAMES[m.month - 1]}</span>
                  <span className="text-[1.3rem] font-semibold text-neutral-500 tabular-nums">
                    {formatCurrency(m.balance)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[1.1rem] text-neutral-400 font-medium mb-0.5">Pemasukan</p>
                    <p className="text-[1.4rem] font-semibold text-neutral-800 tabular-nums">{formatCurrencyShort(m.income)}</p>
                  </div>
                  <div>
                    <p className="text-[1.1rem] text-neutral-400 font-medium mb-0.5">Pengeluaran</p>
                    <p className="text-[1.4rem] font-semibold text-neutral-800 tabular-nums">{formatCurrencyShort(m.expense)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <span className="text-[1.2rem] text-neutral-400 font-medium">Surplus / Defisit</span>
                  <span className={`text-[1.4rem] font-bold tabular-nums ${
                    net > 0 ? 'text-emerald-600' : net < 0 ? 'text-red-500' : 'text-neutral-500'
                  }`}>
                    {net >= 0 ? '+' : ''}{formatCurrencyShort(net)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {!isLoading && report && report.months.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-neutral-900/10 p-5 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[1.4rem] font-bold text-neutral-800">Total Tahun {year}</span>
              <span className="text-[1.3rem] font-bold text-neutral-800 tabular-nums">{formatCurrencyShort(lastEndingBalance)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[1.1rem] text-neutral-400 font-medium mb-0.5">Pemasukan</p>
                <p className="text-[1.4rem] font-bold text-neutral-800 tabular-nums">{formatCurrencyShort(totalIncome)}</p>
              </div>
              <div>
                <p className="text-[1.1rem] text-neutral-400 font-medium mb-0.5">Pengeluaran</p>
                <p className="text-[1.4rem] font-bold text-neutral-800 tabular-nums">{formatCurrencyShort(totalExpense)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <span className="text-[1.2rem] text-neutral-400 font-medium">Surplus / Defisit</span>
              <span className={`text-[1.4rem] font-bold tabular-nums ${
                netTotal > 0 ? 'text-emerald-600' : netTotal < 0 ? 'text-red-500' : 'text-neutral-800'
              }`}>
                {netTotal >= 0 ? '+' : ''}{formatCurrencyShort(netTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== PRINT SIGNATURE BLOCK ===== */}
      <div className="hidden print:flex w-full justify-end mt-16 pt-8 break-inside-avoid">
        <div className="w-[300px] text-center">
          <p className="text-[12px] text-black mb-20 font-medium">Mengetahui & Menyetujui,</p>
          <div className="border-b border-black w-full mb-2"></div>
          <p className="text-[12px] font-bold text-black uppercase tracking-wider">{user?.name || 'Ketua RT'}</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">Pengurus RT - RESIDA</p>
        </div>
      </div>

      {/* ===== PRINT FOOTER ===== */}
      <div className="hidden print:block fixed bottom-0 left-0 right-0 border-t border-neutral-300 pt-3 text-center w-full">
        <p className="text-[9px] text-neutral-500 uppercase tracking-widest">
          RESIDA Administration System • Generated Automatically • Confidential
        </p>
      </div>

      {/* ===== EMBEDDED CSS ===== */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-exact-color {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnualReportPage;

