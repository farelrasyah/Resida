import React, { useEffect, useState } from 'react';
import { Plus, ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { useToast } from '../../hooks/useToast';
import { expenseService } from '../../api/expense.service';
import type { Expense, ExpenseCategory, ExpenseFormData } from '../../types/expense.types';
import type { PaginationMeta } from '../../types/api.types';
import { ApiError } from '../../api/client';

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: 'perbaikan', label: 'Perbaikan Infrastruktur' },
  { value: 'kegiatan', label: 'Kegiatan Warga' },
  { value: 'operasional', label: 'Operasional RT' },
  { value: 'lainnya', label: 'Pengeluaran Lainnya' },
];

export const ExpenseListPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Create Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    category: 'operasional',
    description: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchExpenses(1);
  }, [categoryFilter, startDate, endDate]);

  const fetchExpenses = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await expenseService.getAll({
        page,
        per_page: 15,
        category: (categoryFilter as ExpenseCategory) || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      if (response.success && response.data) {
        setExpenses(response.data.items);
        setMeta(response.data.pagination);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat pengeluaran.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await expenseService.create(formData);
      if (response.success) {
        showToast('Pengeluaran kas RT berhasil dicatat.', 'success');
        setShowFormModal(false);
        setFormData({
          category: 'operasional',
          description: '',
          amount: 0,
          expense_date: new Date().toISOString().split('T')[0],
        });
        fetchExpenses(1);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(err.errors);
        showToast(err.message || 'Gagal menyimpan pengeluaran.', 'error');
      } else {
        showToast('Terjadi kesalahan jaringan.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const columns: Column<Expense>[] = [
    {
      header: 'Keterangan Pengeluaran',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ArrowUpRight size={18} />
          </div>
          <div>
            <p className="font-bold text-[#151717]">{item.description}</p>
            <p className="text-[1.2rem] text-neutral-400">ID: #{item.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Kategori',
      accessor: (item) => {
        const cat = CATEGORY_OPTIONS.find((c) => c.value === item.category);
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[1.2rem]">
            <Tag size={12} className="text-neutral-500" />
            {cat ? cat.label : item.category}
          </span>
        );
      },
    },
    {
      header: 'Nominal',
      accessor: (item) => (
        <span className="font-bold text-amber-700 text-[1.6rem]">
          -{formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      header: 'Tanggal Pengeluaran',
      accessor: (item) => (
        <div className="flex items-center gap-2 text-neutral-600">
          <Calendar size={14} className="text-neutral-400" />
          <span>{item.expense_date}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Pengeluaran Kas RT</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Catat dan pantau alokasi dana kas bulanan untuk kebutuhan operasional RT
          </p>
        </div>

        <Button icon={<Plus size={20} />} onClick={() => setShowFormModal(true)}>
          Catat Pengeluaran Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Filter Kategori"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Kategori' },
            ...CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label })),
          ]}
        />

        <Input
          label="Dari Tanggal"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          label="Sampai Tanggal"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={expenses}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Belum ada catatan pengeluaran kas RT."
      />

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={(page) => fetchExpenses(page)} />

      {/* Create Expense Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Catat Pengeluaran Baru"
        subtitle="Masukkan detail transaksi alokasi pengeluaran kas RT."
        maxWidth="md"
      >
        <form onSubmit={handleCreateExpense} className="space-y-6">
          <Select
            label="Kategori Pengeluaran"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
            options={CATEGORY_OPTIONS}
            error={fieldErrors['category']?.[0]}
          />

          <Input
            label="Deskripsi / Keterangan"
            placeholder="Contoh: Perbaikan penerangan jalan RT 02"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={fieldErrors['description']?.[0]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nominal (Rp)"
              type="number"
              placeholder="Contoh: 150000"
              required
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              error={fieldErrors['amount']?.[0]}
            />

            <Input
              label="Tanggal Pengeluaran"
              type="date"
              required
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              error={fieldErrors['expense_date']?.[0]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFormModal(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan Pengeluaran
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseListPage;
