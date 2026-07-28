import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Eye, XCircle, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { paymentService } from '../../api/payment.service';
import { duesTypeService } from '../../api/duesType.service';
import type { Payment, PaymentStatus } from '../../types/payment.types';
import type { DuesType } from '../../types/dues.types';
import type { PaginationMeta } from '../../types/api.types';
import { ApiError } from '../../api/client';
import { PaymentFormModal } from './components/PaymentFormModal';

export const PaymentListPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [duesTypes, setDuesTypes] = useState<DuesType[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [duesTypeFilter, setDuesTypeFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cancel dialog
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    duesTypeService.getAll().then((res) => {
      if (res.success && res.data) setDuesTypes(res.data);
    });
  }, []);

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter, duesTypeFilter, yearFilter]);

  const fetchPayments = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await paymentService.getAll({
        page,
        per_page: 15,
        status: (statusFilter as PaymentStatus) || undefined,
        dues_type_id: duesTypeFilter ? parseInt(duesTypeFilter, 10) : undefined,
        year: yearFilter ? parseInt(yearFilter, 10) : undefined,
      });

      if (response.success && response.data) {
        setPayments(response.data.items);
        setMeta(response.data.pagination);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat transaksi pembayaran.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!cancelingId) return;
    setIsCanceling(true);
    try {
      const response = await paymentService.cancel(cancelingId);
      if (response.success) {
        showToast('Transaksi pembayaran berhasil dibatalkan.', 'success');
        fetchPayments(meta.current_page);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal membatalkan transaksi.', 'error');
      }
    } finally {
      setIsCanceling(false);
      setCancelingId(null);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const columns: Column<Payment>[] = [
    {
      header: 'No. Transaksi',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="font-mono font-bold text-[#151717]">{item.transaction_number}</p>
            <p className="text-[1.2rem] text-neutral-400">{item.payment_date}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Rumah & Warga',
      accessor: (item) => (
        <div>
          <span className="font-bold text-[#151717] flex items-center gap-1.5">
            <Home size={14} className="text-neutral-400" />
            Rumah {item.house.house_number}
          </span>
          <span className="text-[1.3rem] text-neutral-500">{item.resident.full_name}</span>
        </div>
      ),
    },
    {
      header: 'Jenis Iuran',
      accessor: (item) => (
        <span className="font-medium text-[#151717]">{item.dues_type.name}</span>
      ),
    },
    {
      header: 'Total Bayar',
      accessor: (item) => (
        <span className="font-bold text-[#151717] text-[1.6rem]">
          {formatCurrency(item.total_amount)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (item) => (
        <Badge variant={item.status === 'lunas' ? 'success' : 'danger'}>
          {item.status === 'lunas' ? 'Lunas' : 'Dibatalkan'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/payments/${item.id}`)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#151717] transition-colors cursor-pointer"
            title="Detail Transaksi"
          >
            <Eye size={18} />
          </button>
          {item.status === 'lunas' && (
            <button
              onClick={() => setCancelingId(item.id)}
              className="p-2 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Batalkan Pembayaran"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Pembayaran Iuran RT</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Riwayat penerimaan iuran satpam dan iuran kebersihan dari hunian rumah
          </p>
        </div>

        <Button icon={<Plus size={20} />} onClick={() => setShowCreateModal(true)}>
          Catat Pembayaran Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Filter Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Status' },
            { value: 'lunas', label: 'Lunas' },
            { value: 'dibatalkan', label: 'Dibatalkan' },
          ]}
        />

        <Select
          label="Filter Jenis Iuran"
          value={duesTypeFilter}
          onChange={(e) => setDuesTypeFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Jenis Iuran' },
            ...duesTypes.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />

        <Select
          label="Tahun Pembayaran"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          options={[
            { value: '2026', label: 'Tahun 2026' },
            { value: '2025', label: 'Tahun 2025' },
            { value: '2024', label: 'Tahun 2024' },
          ]}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={payments}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Belum ada riwayat transaksi pembayaran."
        onRowClick={(item) => navigate(`/payments/${item.id}`)}
      />

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={(page) => fetchPayments(page)} />

      {/* Create Modal */}
      <PaymentFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => fetchPayments(meta.current_page)}
      />

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={!!cancelingId}
        onClose={() => setCancelingId(null)}
        onConfirm={handleCancelPayment}
        title="Batalkan Pembayaran?"
        message="Pembatalan transaksi akan mengubah status pembayaran menjadi Dibatalkan. Saldo kas RT akan dikurangi kembali sesuai jumlah nominal transaksi ini."
        confirmLabel="Ya, Batalkan Transaksi"
        isLoading={isCanceling}
      />
    </div>
  );
};

export default PaymentListPage;
