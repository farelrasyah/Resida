import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2, Phone, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import { residentService } from '../../api/resident.service';
import type { Resident, ResidentStatus } from '../../types/resident.types';
import type { PaginationMeta } from '../../types/api.types';
import { ApiError } from '../../api/client';

export const ResidentListPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents(1);
  }, [debouncedSearch, statusFilter]);

  const fetchResidents = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await residentService.getAll({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        resident_status: (statusFilter as ResidentStatus) || undefined,
      });

      if (response.success && response.data) {
        setResidents(response.data.items);
        setMeta(response.data.pagination);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat daftar penghuni.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingId) return;
    setIsDeactivating(true);
    try {
      const response = await residentService.deactivate(deactivatingId);
      if (response.success) {
        showToast('Penghuni berhasil dinonaktifkan.', 'success');
        fetchResidents(meta.current_page);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal menonaktifkan penghuni.', 'error');
      }
    } finally {
      setIsDeactivating(false);
      setDeactivatingId(null);
    }
  };

  const columns: Column<Resident>[] = [
    {
      header: 'Penghuni',
      accessor: (item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
            {item.ktp_photo_url ? (
              <img src={item.ktp_photo_url} alt={item.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                {item.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-[#151717]">{item.full_name}</p>
            <p className="text-[1.3rem] text-neutral-400 font-medium">ID: #{item.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status Tinggal',
      accessor: (item) => (
        <Badge variant={item.resident_status === 'tetap' ? 'success' : 'info'}>
          {item.resident_status === 'tetap' ? 'Penghuni Tetap' : 'Kontrak'}
        </Badge>
      ),
    },
    {
      header: 'No. Telepon',
      accessor: (item) => (
        <div className="flex items-center gap-2 text-neutral-600">
          <Phone size={16} className="text-neutral-400" />
          <span>{item.phone_number}</span>
        </div>
      ),
    },
    {
      header: 'Pernikahan',
      accessor: (item) => (
        <span className="capitalize text-neutral-600">
          {item.marital_status === 'sudah_menikah' ? 'Sudah Menikah' : 'Belum Menikah'}
        </span>
      ),
    },
    {
      header: 'Rumah Saat Ini',
      accessor: (item) => (
        item.current_house ? (
          <Link
            to={`/houses/${item.current_house.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-[#151717] hover:bg-neutral-200 font-semibold text-[1.3rem]"
          >
            <Home size={14} />
            {item.current_house.house_number}
          </Link>
        ) : (
          <span className="text-neutral-400 italic text-[1.3rem]">Tidak menempati</span>
        )
      ),
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/residents/${item.id}`)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#151717] transition-colors cursor-pointer"
            title="Detail Penghuni"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => navigate(`/residents/${item.id}/edit`)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#151717] transition-colors cursor-pointer"
            title="Edit Data"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => setDeactivatingId(item.id)}
            className="p-2 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Nonaktifkan"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Data Penghuni RT</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Kelola daftar identitas warga tetap dan kontrak di lingkungan RT
          </p>
        </div>

        <Link to="/residents/new">
          <Button icon={<Plus size={20} />}>
            Tambah Penghuni Baru
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Cari nama penghuni / telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={20} />}
          />
        </div>

        <div className="w-full md:w-64">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Semua Status Tinggal' },
              { value: 'tetap', label: 'Penghuni Tetap' },
              { value: 'kontrak', label: 'Kontrak' },
            ]}
          />
        </div>
      </div>

      {/* Residents Table */}
      <Table
        columns={columns}
        data={residents}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Belum ada data penghuni yang terdaftar."
        onRowClick={(item) => navigate(`/residents/${item.id}`)}
      />

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={(page) => fetchResidents(page)} />

      {/* Deactivation Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deactivatingId}
        onClose={() => setDeactivatingId(null)}
        onConfirm={handleDeactivate}
        title="Nonaktifkan Penghuni?"
        message="Penghuni yang dinonaktifkan tidak dapat diposisikan ke hunian rumah baru. Tindakan ini hanya dapat dilakukan jika penghuni tidak sedang menempati rumah."
        confirmLabel="Ya, Nonaktifkan"
        isLoading={isDeactivating}
      />
    </div>
  );
};

export default ResidentListPage;
