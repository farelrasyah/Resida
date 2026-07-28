import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CreditCard, Home, Calendar, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { paymentService } from '../../api/payment.service';
import type { PaymentDetail, PaymentPeriodItem } from '../../types/payment.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const paymentId = parseInt(id || '0', 10);

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
      <div className="space-y-6 max-w-3xl">
        <Skeleton height="3rem" width="30%" />
        <Card className="space-y-6">
          <Skeleton height="8rem" width="100%" />
          <Skeleton height="15rem" width="100%" />
        </Card>
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

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Top Header (Hidden on Print) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('/payments')}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#151717] font-semibold text-[1.4rem] cursor-pointer"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Transaksi
        </button>

        <div className="flex items-center gap-3">
          <Button icon={<Printer size={18} />} onClick={handlePrintReceipt}>
            Cetak Bukti Bayar
          </Button>

          {payment.status === 'lunas' && (
            <Button
              variant="outline"
              icon={<XCircle size={18} />}
              onClick={() => setShowCancelDialog(true)}
            >
              Batalkan
            </Button>
          )}
        </div>
      </div>

      {/* Printable Receipt Card */}
      <Card id="printable-receipt" className="space-y-8 p-8 border border-neutral-200">
        {/* Receipt Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-[#151717]">
          <div>
            <span className="text-[1.2rem] font-bold uppercase tracking-widest text-neutral-400">Sistem RT RESIDA</span>
            <h1 className="text-[2.6rem] font-bold text-[#151717] tracking-tight">Kwitansi Pembayaran Iuran</h1>
            <p className="text-[1.4rem] font-mono text-neutral-500 mt-1">No: {payment.transaction_number}</p>
          </div>

          <Badge variant={payment.status === 'lunas' ? 'success' : 'danger'}>
            {payment.status === 'lunas' ? 'LUNAS' : 'DIBATALKAN'}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[1.4rem]">
          <div className="space-y-3">
            <span className="text-neutral-500 font-medium">Informasi Unit Rumah:</span>
            <div className="p-4 rounded-2xl bg-[#F4F4F4] space-y-1">
              <p className="font-bold text-[#151717] flex items-center gap-2 text-[1.6rem]">
                <Home size={18} className="text-neutral-400" />
                Rumah {payment.house.house_number}
              </p>
              <p className="text-neutral-600 font-medium">Penghuni: {payment.resident.full_name}</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-neutral-500 font-medium">Informasi Transaksi:</span>
            <div className="p-4 rounded-2xl bg-[#F4F4F4] space-y-1">
              <p className="font-bold text-[#151717] flex items-center gap-2 text-[1.6rem]">
                <CreditCard size={18} className="text-neutral-400" />
                {payment.dues_type.name}
              </p>
              <p className="text-neutral-600 font-medium flex items-center gap-2">
                <Calendar size={14} /> Tanggal: {payment.payment_date}
              </p>
            </div>
          </div>
        </div>

        {/* Period Covered List */}
        <div className="space-y-3">
          <span className="text-[1.4rem] font-bold text-[#151717]">Rincian Periode Yang Dibarikan:</span>
          <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100">
            {payment.periods && payment.periods.length > 0 ? (
              payment.periods.map((period: PaymentPeriodItem) => {
                const monthNum = period.month || period.period_month || 1;
                const yearNum = period.year || period.period_year || new Date().getFullYear();
                const amt = period.amount ?? payment.amount;

                return (
                  <div key={period.id} className="p-4 flex items-center justify-between text-[1.4rem]">
                    <span className="font-medium text-[#151717]">
                      Periode {MONTH_NAMES[monthNum - 1]} {yearNum}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(amt)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-neutral-500">1 Periode Pembayaran</div>
            )}
          </div>
        </div>

        {/* Total Price Section */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <span className="text-[1.6rem] font-bold text-emerald-950 uppercase tracking-wider">Total Pembayaran</span>
          <span className="text-[3rem] font-bold text-emerald-900 tracking-tight">
            {formatCurrency(payment.total_amount)}
          </span>
        </div>

        {/* Footer Signature line on Print */}
        <div className="hidden print:flex items-center justify-between pt-12 text-[1.2rem] text-neutral-600">
          <div>
            <p>Penyetor,</p>
            <p className="mt-12 font-bold">{payment.resident.full_name}</p>
          </div>
          <div>
            <p>Pengurus RT (Kasir),</p>
            <p className="mt-12 font-bold">Admin RESIDA</p>
          </div>
        </div>
      </Card>

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
    </div>
  );
};

export default PaymentDetailPage;
