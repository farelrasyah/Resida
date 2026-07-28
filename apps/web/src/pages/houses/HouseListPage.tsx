import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Home, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import { houseService } from '../../api/house.service';
import type { House, HouseOccupancyStatus } from '../../types/house.types';
import type { PaginationMeta } from '../../types/api.types';
import { ApiError } from '../../api/client';

export const HouseListPage: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Add/Edit Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [houseNumberInput, setHouseNumberInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Deactivate dialog state
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHouses(1);
  }, [debouncedSearch, statusFilter]);

  const fetchHouses = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await houseService.getAll({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        occupancy_status: (statusFilter as HouseOccupancyStatus) || undefined,
      });

      if (response.success && response.data) {
        setHouses(response.data.items);
        setMeta(response.data.pagination);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat daftar rumah.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingHouse(null);
    setHouseNumberInput('');
    setFormError(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (house: House) => {
    setEditingHouse(house);
    setHouseNumberInput(house.house_number);
    setFormError(null);
    setShowFormModal(true);
  };

  const handleSaveHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      if (editingHouse) {
        const response = await houseService.update(editingHouse.id, houseNumberInput);
        if (response.success) {
          showToast('Nomor rumah berhasil diperbarui.', 'success');
          setShowFormModal(false);
          fetchHouses(meta.current_page);
        }
      } else {
        const response = await houseService.create(houseNumberInput);
        if (response.success) {
          showToast('Rumah baru berhasil ditambahkan.', 'success');
          setShowFormModal(false);
          fetchHouses(1);
        }
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message || (err.errors?.['house_number']?.[0] ?? 'Gagal menyimpan data rumah.'));
      } else {
        setFormError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingId) return;
    setIsDeactivating(true);
    try {
      const response = await houseService.deactivate(deactivatingId);
      if (response.success) {
        showToast('Rumah berhasil dinonaktifkan.', 'success');
        fetchHouses(meta.current_page);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal menonaktifkan rumah.', 'error');
      }
    } finally {
      setIsDeactivating(false);
      setDeactivatingId(null);
    }
  };

  const columns: Column<House>[] = [
    {
      header: 'Nomor Rumah',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#151717] text-white font-bold flex items-center justify-center text-[1.4rem]">
            <Home size={18} />
          </div>
          <div>
            <p className="font-bold text-[#151717] text-[1.6rem]">{item.house_number}</p>
            <p className="text-[1.2rem] text-neutral-400">ID: #{item.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status Hunian',
      accessor: (item) => (
        <Badge variant={item.occupancy_status === 'dihuni' ? 'success' : 'warning'}>
          {item.occupancy_status === 'dihuni' ? 'Dihuni' : 'Kosong'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/houses/${item.id}`)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#151717] transition-colors cursor-pointer"
            title="Detail Rumah & Penghuni"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleOpenEditModal(item)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-[#151717] transition-colors cursor-pointer"
            title="Edit Nomor Rumah"
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Data Hunian Rumah RT</h1>
          <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
            Kelola daftar hunian rumah dan status berpenghuni di blok RT
          </p>
        </div>

        <Button icon={<Plus size={20} />} onClick={handleOpenCreateModal}>
          Tambah Rumah Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <Input
            placeholder="Cari nomor rumah (contoh: A-01)..."
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
              { value: '', label: 'Semua Status Hunian' },
              { value: 'dihuni', label: 'Dihuni' },
              { value: 'tidak_dihuni', label: 'Kosong' },
            ]}
          />
        </div>
      </div>

      {/* Houses Table */}
      <Table
        columns={columns}
        data={houses}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Belum ada data rumah yang terdaftar."
        onRowClick={(item) => navigate(`/houses/${item.id}`)}
      />

      {/* Pagination */}
      <Pagination meta={meta} onPageChange={(page) => fetchHouses(page)} />

      {/* Add / Edit House Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingHouse ? 'Edit Nomor Rumah' : 'Tambah Rumah Baru'}
        subtitle="Nomor rumah digunakan sebagai identitas unik hunian di wilayah RT."
        maxWidth="sm"
      >
        <form onSubmit={handleSaveHouse} className="space-y-6">
          <Input
            label="Nomor Rumah"
            placeholder="Contoh: A-01, B-12"
            required
            value={houseNumberInput}
            onChange={(e) => setHouseNumberInput(e.target.value)}
            error={formError || undefined}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFormModal(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingHouse ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deactivation Dialog */}
      <ConfirmDialog
        isOpen={!!deactivatingId}
        onClose={() => setDeactivatingId(null)}
        onConfirm={handleDeactivate}
        title="Nonaktifkan Rumah?"
        message="Rumah hanya dapat dinonaktifkan jika saat ini statusnya Kosong (tidak ada penghuni aktif)."
        confirmLabel="Ya, Nonaktifkan"
        isLoading={isDeactivating}
      />
    </div>
  );
};

export default HouseListPage;
