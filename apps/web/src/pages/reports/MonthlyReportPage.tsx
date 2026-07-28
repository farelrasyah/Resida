import React, { useEffect, useState } from 'react';
import { Printer, CheckCircle2, XCircle, Home } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { reportService } from '../../api/report.service';
import type { MonthlyDetailReport, MonthlyHouseStatus, MonthlyDuesStatus } from '../../types/report.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const MonthlyReportPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [report, setReport] = useState<MonthlyDetailReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchReport();
  }, [year, month]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getMonthlyDetail(year, month);
      if (response.success && response.data) {
        setReport(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat laporan detail bulanan.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'lunas') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[1.2rem]">
          <CheckCircle2 size={14} className="text-emerald-600" /> Lunas
        </span>
      );
    }
    if (s.includes('tidak ada tagihan') || s === 'kosong') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 font-semibold text-[1.2rem]">
          Bebas / Kosong
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 font-bold text-[1.2rem]">
        <XCircle size={14} className="text-red-600" /> Belum Lunas
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header Controls (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Status Iuran Bulanan Per Rumah</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Matriks kelunasan iuran warga untuk tiap unit rumah pada bulan & tahun terpilih
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-36">
            <Select
              value={month.toString()}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              options={MONTH_NAMES.map((name, idx) => ({
                value: idx + 1,
                label: name,
              }))}
            />
          </div>

          <div className="w-36">
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
      <div id="printable-monthly-report" className="space-y-8">
        {/* Print Header Visible ONLY on Print */}
        <div className="hidden print:block text-center space-y-2 pb-6 border-b-2 border-[#151717]">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Sistem RT RESIDA</h1>
          <h2 className="text-xl font-bold">Laporan Status Pembayaran Iuran Bulan {MONTH_NAMES[month - 1]} {year}</h2>
          <p className="text-sm text-neutral-600">Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
        </div>

        {/* Status Table */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151717] text-white text-[1.3rem] font-bold uppercase tracking-wider">
                  <th className="p-4 border-b border-neutral-800">Nomor Rumah</th>
                  <th className="p-4 border-b border-neutral-800">Status Hunian</th>
                  <th className="p-4 border-b border-neutral-800">Detail Status Iuran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[1.4rem]">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                    </tr>
                  ))
                ) : report?.house_statuses && report.house_statuses.length > 0 ? (
                  report.house_statuses.map((h: MonthlyHouseStatus) => (
                    <tr key={h.house_id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-4 font-bold text-[#151717] flex items-center gap-2">
                        <Home size={16} className="text-neutral-400" />
                        Rumah {h.house_number}
                      </td>
                      <td className="p-4 capitalize font-semibold text-neutral-600">
                        {h.occupancy_status === 'dihuni' ? 'Dihuni' : 'Kosong'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {h.dues_statuses.map((d: MonthlyDuesStatus) => (
                            <div key={d.dues_type_id} className="flex items-center gap-2">
                              <span className="text-[1.2rem] text-neutral-500 font-medium">{d.dues_type_name}:</span>
                              {getStatusBadge(d.status)}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-neutral-400 font-medium">
                      Tidak ada data hunian rumah untuk periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
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
          #printable-monthly-report {
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

export default MonthlyReportPage;
