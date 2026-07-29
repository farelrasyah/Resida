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
import { useAuth } from '../../context/AuthContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const MonthlyReportPage: React.FC = () => {
  const { user } = useAuth();
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
    
    // Define UI badge and Print badge separately
    if (s === 'lunas') {
      return (
        <>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[1.2rem] print:hidden">
            <CheckCircle2 size={14} className="text-emerald-600" /> Lunas
          </span>
          <span className="hidden print:inline-flex items-center font-bold text-black text-[12px]">
            [ LUNAS ]
          </span>
        </>
      );
    }
    if (s.includes('tidak ada tagihan') || s === 'kosong') {
      return (
        <>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 font-semibold text-[1.2rem] print:hidden">
            Bebas / Kosong
          </span>
          <span className="hidden print:inline-flex items-center font-semibold text-neutral-500 text-[12px]">
            - KOSONG -
          </span>
        </>
      );
    }
    return (
      <>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 font-bold text-[1.2rem] print:hidden">
          <XCircle size={14} className="text-red-600" /> Belum Lunas
        </span>
        <span className="hidden print:inline-flex items-center font-bold text-black text-[12px]">
          [ BELUM LUNAS ]
        </span>
      </>
    );
  };

  const now = new Date();
  const docId = `RPT-MTH-${year}${month.toString().padStart(2, '0')}-${now.getTime().toString().slice(-6)}`;

  return (
    <div className="space-y-8 relative print:p-0 print:m-0 print:space-y-0">
      
      {/* WATERMARK PRINT ONLY */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-[-1] overflow-hidden">
        <div className="text-[12rem] font-bold text-neutral-900 opacity-[0.03] -rotate-45 select-none whitespace-nowrap">
          RESIDA CONFIDENTIAL
        </div>
      </div>

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
      <div id="printable-monthly-report" className="space-y-8 print:space-y-0 print:w-full">
        
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
            <h2 className="text-3xl font-bold uppercase tracking-widest text-black">Status Pembayaran Iuran</h2>
            <p className="text-base text-neutral-600 mt-2 font-medium">Periode {MONTH_NAMES[month - 1]} {year}</p>
          </div>
        </div>

        {/* Status Table */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm print:border-none print:shadow-none print:rounded-none">
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse print:table">
              <thead className="print:table-header-group">
                <tr className="bg-[#151717] text-white text-[1.3rem] font-bold uppercase tracking-wider print:bg-white print:text-black print:border-t-2 print:border-b-2 print:border-black print:text-[11px]">
                  <th className="p-4 border-b border-neutral-800 print:border-none print:py-3 print:px-4">Nomor Rumah</th>
                  <th className="p-4 border-b border-neutral-800 print:border-none print:py-3 print:px-4">Status Hunian</th>
                  <th className="p-4 border-b border-neutral-800 print:border-none print:py-3 print:px-4">Detail Status Iuran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[1.4rem] print:divide-neutral-300">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                      <td className="p-4"><Skeleton height="1.5rem" /></td>
                    </tr>
                  ))
                ) : report?.house_statuses && report.house_statuses.length > 0 ? (
                  report.house_statuses.map((h: MonthlyHouseStatus, idx) => (
                    <tr key={h.house_id} className={`transition-colors ${idx % 2 === 1 ? 'print:bg-neutral-50/50' : 'print:bg-white'} hover:bg-neutral-50 print:hover:bg-transparent`}>
                      <td className="p-4 font-bold text-[#151717] flex items-center gap-2 print:text-[12px] print:text-black print:py-3 print:px-4">
                        <Home size={16} className="text-neutral-400 print:hidden" />
                        Rumah {h.house_number}
                      </td>
                      <td className="p-4 capitalize font-semibold text-neutral-600 print:text-[12px] print:text-black print:py-3 print:px-4">
                        {h.occupancy_status === 'dihuni' ? 'Dihuni' : 'Kosong'}
                      </td>
                      <td className="p-4 print:py-3 print:px-4">
                        <div className="flex flex-wrap gap-2">
                          {h.dues_statuses.map((d: MonthlyDuesStatus) => (
                            <div key={d.dues_type_id} className="flex items-center gap-2">
                              <span className="text-[1.2rem] text-neutral-500 font-medium print:text-[12px] print:text-neutral-600">{d.dues_type_name}:</span>
                              {getStatusBadge(d.status)}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-neutral-400 font-medium print:py-8 print:text-black print:text-sm">
                      Tidak ada data hunian rumah untuk periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ===== PRINT SIGNATURE BLOCK ===== */}
      <div className="hidden print:flex w-full justify-between mt-16 pt-8 break-inside-avoid">
        <div className="w-[300px] text-center">
          <p className="text-[12px] text-black mb-20 font-medium">Dibuat Oleh,</p>
          <div className="border-b border-black w-full mb-2"></div>
          <p className="text-[12px] font-bold text-black uppercase tracking-wider">{user?.name || 'Administrator'}</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">Sistem RESIDA</p>
        </div>
        <div className="w-[300px] text-center">
          <p className="text-[12px] text-black mb-20 font-medium">Mengetahui & Menyetujui,</p>
          <div className="border-b border-black w-full mb-2"></div>
          <p className="text-[12px] font-bold text-black uppercase tracking-wider">Ketua RT</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-1">Pengurus RT - RESIDA</p>
        </div>
      </div>

      {/* ===== PRINT FOOTER ===== */}
      <div className="hidden print:block fixed bottom-0 left-0 right-0 border-t border-neutral-300 pt-3 text-center w-full bg-white">
        <p className="text-[9px] text-neutral-500 uppercase tracking-widest m-0">
          RESIDA Administration System • Generated Automatically • Confidential
        </p>
      </div>

      {/* Embedded CSS for Print view styling */}
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
            padding: 0 !important;
          }
          .shadow-xl, .shadow-md, .shadow-sm {
            box-shadow: none !important;
          }
          .border {
            border-color: #e5e5e5 !important;
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

export default MonthlyReportPage;
