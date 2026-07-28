import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { reportService } from '../../api/report.service';
import type { AnnualSummaryReport } from '../../types/report.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const AnnualReportPage: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [report, setReport] = useState<AnnualSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchReport();
  }, [year]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getAnnualSummary(year);
      if (response.success && response.data) {
        setReport(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat laporan tahunan.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalIncome = report?.months.reduce((acc, m) => acc + m.income, 0) || 0;
  const totalExpense = report?.months.reduce((acc, m) => acc + m.expense, 0) || 0;
  const lastEndingBalance = report?.months.length ? report.months[report.months.length - 1].balance : (report?.starting_balance || 0);

  return (
    <div className="space-y-8">
      {/* Top Header Controls (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Laporan Rekapitulasi Kas Tahunan</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Ringkasan pemasukan iuran & pengeluaran operasional RT per bulan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              value={year.toString()}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              options={[
                { value: '2026', label: 'Tahun 2026' },
                { value: '2025', label: 'Tahun 2025' },
                { value: '2024', label: 'Tahun 2024' },
              ]}
            />
          </div>

          <Button icon={<Printer size={18} />} onClick={handlePrint}>
            Cetak / Download PDF
          </Button>
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div id="printable-report" className="space-y-8">
        {/* Print Header Visible ONLY on Print */}
        <div className="hidden print:block text-center space-y-2 pb-6 border-b-2 border-[#151717]">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Sistem RT RESIDA</h1>
          <h2 className="text-xl font-bold">Laporan Rekapitulasi Kas RT Tahun {year}</h2>
          <p className="text-sm text-neutral-600">Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>

        {/* Financial Overview Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-sky-500">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Total Pemasukan {year}</span>
            <div>
              {isLoading ? (
                <Skeleton height="2.5rem" width="60%" />
              ) : (
                <p className="text-[3rem] font-bold text-sky-700 tracking-tight">
                  {formatCurrency(totalIncome)}
                </p>
              )}
            </div>
          </Card>

          <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-amber-500">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Total Pengeluaran {year}</span>
            <div>
              {isLoading ? (
                <Skeleton height="2.5rem" width="60%" />
              ) : (
                <p className="text-[3rem] font-bold text-amber-700 tracking-tight">
                  {formatCurrency(totalExpense)}
                </p>
              )}
            </div>
          </Card>

          <Card className="flex flex-col justify-between space-y-4 border-l-4 border-l-emerald-500">
            <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Saldo Kas Akhir</span>
            <div>
              {isLoading ? (
                <Skeleton height="2.5rem" width="60%" />
              ) : (
                <p className="text-[3rem] font-bold text-emerald-700 tracking-tight">
                  {formatCurrency(lastEndingBalance)}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Main Monthly Recap Table */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151717] text-white text-[1.3rem] font-bold uppercase tracking-wider">
                  <th className="p-4 border-b border-neutral-800">Bulan</th>
                  <th className="p-4 border-b border-neutral-800 text-right">Pemasukan</th>
                  <th className="p-4 border-b border-neutral-800 text-right">Pengeluaran</th>
                  <th className="p-4 border-b border-neutral-800 text-right">Surplus / Defisit</th>
                  <th className="p-4 border-b border-neutral-800 text-right">Saldo Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[1.4rem]">
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                    </tr>
                  ))
                ) : (
                  report?.months.map((m) => {
                    const net = m.income - m.expense;
                    return (
                      <tr key={m.month} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-4 font-bold text-[#151717]">{MONTH_NAMES[m.month - 1]}</td>
                        <td className="p-4 text-right font-medium text-emerald-700">
                          {formatCurrency(m.income)}
                        </td>
                        <td className="p-4 text-right font-medium text-amber-700">
                          {formatCurrency(m.expense)}
                        </td>
                        <td className={`p-4 text-right font-bold ${net >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                          {net >= 0 ? `+${formatCurrency(net)}` : formatCurrency(net)}
                        </td>
                        <td className="p-4 text-right font-bold text-[#151717]">
                          {formatCurrency(m.balance)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {!isLoading && report && (
                <tfoot>
                  <tr className="bg-neutral-100 font-bold text-[#151717] text-[1.5rem] border-t-2 border-neutral-300">
                    <td className="p-4">TOTAL TAHUN {year}</td>
                    <td className="p-4 text-right text-emerald-800">{formatCurrency(totalIncome)}</td>
                    <td className="p-4 text-right text-amber-800">{formatCurrency(totalExpense)}</td>
                    <td className="p-4 text-right">
                      {formatCurrency(totalIncome - totalExpense)}
                    </td>
                    <td className="p-4 text-right text-emerald-900">{formatCurrency(lastEndingBalance)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      </div>

      {/* Embedded CSS for Print view styling */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, sidebar, nav, button, .print\\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          #printable-report {
            margin: 0 !important;
            padding: 20px !important;
          }
          .shadow-xl, .shadow-md, .shadow-sm {
            box-shadow: none !important;
          }
          .border {
            border-color: #e5e5e5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnualReportPage;
