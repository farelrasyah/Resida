import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CreditCard, Home, Calendar, XCircle, Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { paymentService } from '../../api/payment.service';
import type { PaymentDetail, PaymentPeriodItem } from '../../types/payment.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const paymentId = parseInt(id || '0', 10);
  const { user } = useAuth();

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetail();
    }
  }, [paymentId]);

  const fetchPaymentDetail = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getById(paymentId);
      if (response.success && response.data) {
        setPayment(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat rincian transaksi.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    setIsCanceling(true);
    try {
      const response = await paymentService.cancel(paymentId);
      if (response.success) {
        showToast('Transaksi pembayaran berhasil dibatalkan.', 'success');
        setShowCancelDialog(false);
        fetchPaymentDetail();
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal membatalkan transaksi.', 'error');
      }
    } finally {
      setIsCanceling(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton height="3rem" width="30%" />
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 space-y-6">
          <Skeleton height="8rem" width="100%" />
          <Skeleton height="15rem" width="100%" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-[1.8rem] text-neutral-500 font-medium">Transaksi tidak ditemukan.</p>
        <Link to="/payments">
          <Button variant="secondary">Kembali ke Daftar Transaksi</Button>
        </Link>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="space-y-8 max-w-4xl mx-auto print:max-w-none relative print:p-0 print:m-0 print:space-y-0 pb-12">
      
      {/* WATERMARK PRINT ONLY */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-[-1] overflow-hidden">
        <div className="text-[12rem] font-bold text-neutral-900 opacity-[0.03] -rotate-45 select-none whitespace-nowrap">
          RESIDA CONFIDENTIAL
        </div>
      </div>

      {/* Top Header (Hidden on Print) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('/payments')}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium text-[1.4rem] transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Semua Transaksi
        </button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Download size={15} />} onClick={handlePrintReceipt}>
            Download PDF
          </Button>

          {payment.status === 'lunas' && (
            <Button
              variant="outline"
              icon={<XCircle size={15} />}
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-neutral-200"
            >
              Batalkan
            </Button>
          )}
        </div>
      </div>

      {/* Screen Invoice Card (Premium SaaS Style) */}
      <div id="printable-receipt" className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_24px_0_rgba(0,0,0,0.02)] overflow-hidden print:border-none print:shadow-none print:p-0 print:rounded-none">
        
        {/* DASHBOARD HEADER */}
        <div className="p-10 border-b border-neutral-100 print:hidden flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-[2.4rem] font-semibold text-neutral-900 tracking-tight leading-none">Invoice</h1>
              <Badge variant={payment.status === 'lunas' ? 'success' : 'danger'} className="text-[1rem] uppercase tracking-wider px-2 py-0.5 rounded-md">
                {payment.status === 'lunas' ? 'LUNAS' : 'DIBATALKAN'}
              </Badge>
            </div>
            <p className="text-[1.4rem] font-mono text-neutral-500">{payment.transaction_number}</p>
          </div>
          <div className="text-left md:text-right space-y-1">
            <p className="text-[1.3rem] text-neutral-500 font-medium">Jumlah Tagihan</p>
            <p className="text-[3.2rem] font-bold text-neutral-900 tracking-tight leading-none">{formatCurrency(payment.total_amount)}</p>
            <p className="text-[1.3rem] text-neutral-400">Dibayar pada {payment.payment_date}</p>
          </div>
        </div>

        {/* DETAILS GRID (SCREEN) */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 print:hidden">
          <div className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold text-neutral-400 uppercase tracking-wider">Telah Terima Dari</h3>
            <div className="space-y-1">
              <p className="text-[1.6rem] font-semibold text-neutral-900">{payment.resident.full_name}</p>
              <p className="text-[1.4rem] text-neutral-500 flex items-center gap-2">
                <Home size={14} /> Rumah {payment.house.house_number}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[1.2rem] font-semibold text-neutral-400 uppercase tracking-wider">Detail Pembayaran</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[1.4rem] text-neutral-500">Jenis Iuran</span>
                <span className="text-[1.4rem] font-medium text-neutral-900">{payment.dues_type.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[1.4rem] text-neutral-500">Metode</span>
                <span className="text-[1.4rem] font-medium text-neutral-900 capitalize">{payment.payment_method || 'Kasir RT'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[1.4rem] text-neutral-500">Penerima</span>
                <span className="text-[1.4rem] font-medium text-neutral-900">{user?.name || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LINE ITEMS TABLE (SCREEN) */}
        <div className="px-10 pb-10 print:hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-4 text-[1.2rem] font-semibold text-neutral-400 uppercase tracking-wider w-2/3">Deskripsi Periode</th>
                <th className="py-4 text-[1.2rem] font-semibold text-neutral-400 uppercase tracking-wider text-right w-1/3">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payment.periods && payment.periods.length > 0 ? (
                payment.periods.map((period: PaymentPeriodItem) => {
                  const monthNum = period.month || period.period_month || 1;
                  const yearNum = period.year || period.period_year || new Date().getFullYear();
                  const amt = period.amount ?? payment.amount;
                  return (
                    <tr key={period.id}>
                      <td className="py-5 text-[1.5rem] font-medium text-neutral-800">
                        Iuran {payment.dues_type.name} - Bulan {MONTH_NAMES[monthNum - 1]} {yearNum}
                      </td>
                      <td className="py-5 text-[1.5rem] font-medium text-neutral-900 text-right tabular-nums">
                        {formatCurrency(amt)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-5 text-[1.5rem] font-medium text-neutral-800">Pembayaran 1 Periode</td>
                  <td className="py-5 text-[1.5rem] font-medium text-neutral-900 text-right tabular-nums">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200">
                <td className="py-6 text-[1.5rem] font-medium text-neutral-500 text-right">Total Transaksi</td>
                <td className="py-6 text-[2.2rem] font-bold text-neutral-900 text-right tabular-nums tracking-tight">
                  {formatCurrency(payment.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ===== PRINT HEADER (ENTERPRISE) ===== */}
        <div className="hidden print:block w-full mb-8">
          <div className="flex justify-between items-start border-b-[3px] border-black pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-xl print-exact-color">
                RS
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-black m-0 leading-tight">SISTEM RT RESIDA</h1>
                <p className="text-sm text-neutral-600 m-0 mt-1 font-medium">Tanda Terima Pembayaran Resmi</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block border border-black px-2 py-1 mb-2">
                <p className="text-xs font-bold tracking-widest uppercase m-0">Official Receipt</p>
              </div>
              <table className="text-xs text-neutral-600 ml-auto">
                <tbody>
                  <tr><td className="pr-3 text-right">Receipt No:</td><td className="font-semibold text-black uppercase">{payment.transaction_number}</td></tr>
                  <tr><td className="pr-3 text-right">Date Issued:</td><td className="font-semibold text-black">{now.toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td></tr>
                  <tr><td className="pr-3 text-right">Status:</td><td className="font-bold text-black uppercase">[{payment.status}]</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-black">Kwitansi Pembayaran</h2>
            <p className="text-base text-neutral-600 mt-2 font-medium">No. Transaksi: {payment.transaction_number}</p>
          </div>
        </div>

        {/* Details Grid (PRINT ONLY) */}
        <div className="hidden print:grid grid-cols-2 gap-0 border border-black mb-8">
          <div className="p-6 border-r border-black">
            <span className="text-[11px] uppercase tracking-wider text-neutral-600 mb-2 block font-medium">Telah Terima Dari:</span>
            <p className="text-[16px] font-bold text-black m-0">{payment.resident.full_name}</p>
            <p className="text-[13px] font-medium text-black m-0 mt-1">Rumah {payment.house.house_number}</p>
          </div>

          <div className="p-6">
            <span className="text-[11px] uppercase tracking-wider text-neutral-600 mb-2 block font-medium">Informasi Pembayaran:</span>
            <p className="text-[16px] font-bold text-black m-0">{payment.dues_type.name}</p>
            <p className="text-[13px] font-medium text-black m-0 mt-1">Tanggal Bayar: {payment.payment_date}</p>
          </div>
        </div>

        {/* Period Covered List (PRINT ONLY) */}
        <div className="hidden print:block space-y-4">
          <span className="text-[14px] font-bold text-black uppercase tracking-widest block">Rincian Periode Yang Dibayarkan:</span>
          <div className="border border-black divide-y divide-black">
            {payment.periods && payment.periods.length > 0 ? (
              payment.periods.map((period: PaymentPeriodItem) => {
                const monthNum = period.month || period.period_month || 1;
                const yearNum = period.year || period.period_year || new Date().getFullYear();
                const amt = period.amount ?? payment.amount;

                return (
                  <div key={period.id} className="py-3 px-4 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-black">
                      Iuran Bulan {MONTH_NAMES[monthNum - 1]} {yearNum}
                    </span>
                    <span className="text-[14px] font-bold text-black tabular-nums">
                      {formatCurrency(amt)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-3 px-4 text-[13px] text-black">
                Pembayaran 1 Periode - {formatCurrency(payment.amount)}
              </div>
            )}
          </div>
        </div>

        {/* Total Price Section (PRINT ONLY) */}
        <div className="hidden print:flex items-center justify-between border-b border-l border-r border-black p-4">
          <span className="text-[14px] font-bold text-black uppercase tracking-wider">Total Pembayaran</span>
          <span className="text-[24px] font-bold text-black tabular-nums tracking-tight">
            {formatCurrency(payment.total_amount)}
          </span>
        </div>

        {/* Footer Signature line on Print (PRINT ONLY) */}
        <div className="hidden print:flex items-center justify-between pt-16 mt-8 break-inside-avoid">
          <div className="w-[250px] text-center">
            <p className="text-[12px] text-black mb-20 font-medium">Penyetor,</p>
            <div className="border-b border-black w-full mb-2"></div>
            <p className="text-[12px] font-bold text-black uppercase tracking-wider">{payment.resident.full_name}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-1">Warga RT</p>
          </div>
          <div className="w-[250px] text-center">
            <p className="text-[12px] text-black mb-20 font-medium">Pengurus RT (Kasir),</p>
            <div className="border-b border-black w-full mb-2"></div>
            <p className="text-[12px] font-bold text-black uppercase tracking-wider">{user?.name || 'Admin RESIDA'}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-1">Penerima Iuran</p>
          </div>
        </div>
        
        {/* ===== PRINT FOOTER ===== */}
        <div className="hidden print:block fixed bottom-0 left-0 right-0 border-t border-neutral-300 pt-3 text-center w-full bg-white">
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest m-0">
            RESIDA Administration System • Generated Automatically • Confidential
          </p>
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelPayment}
        title="Konfirmasi Pembatalan Transaksi"
        message="Apakah Anda yakin ingin membatalkan transaksi pembayaran ini? Aksi ini akan mempengaruhi laporan kas RT."
        confirmLabel="Ya, Batalkan Transaksi"
        isLoading={isCanceling}
      />
      
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
          .print-exact-color {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentDetailPage;
