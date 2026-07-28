import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, UserPlus, RefreshCw, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { houseService } from '../../api/house.service';
import { residentService } from '../../api/resident.service';
import type { HouseDetail, OccupancyRecord } from '../../types/house.types';
import type { Resident } from '../../types/resident.types';
import type { Payment } from '../../types/payment.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';

export const HouseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const houseId = parseInt(id || '0', 10);

  const [house, setHouse] = useState<HouseDetail | null>(null);
  const [occupancyHistory, setOccupancyHistory] = useState<OccupancyRecord[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  const [activeTab, setActiveTab] = useState<'info' | 'occupancy' | 'payments'>('info');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Assign / Reassign Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isReassign, setIsReassign] = useState(false);
  const [availableResidents, setAvailableResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<string>('');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (houseId) {
      fetchHouseDetail();
    }
  }, [houseId]);

  useEffect(() => {
    if (houseId && activeTab === 'occupancy') {
      fetchOccupancyHistory();
    } else if (houseId && activeTab === 'payments') {
      fetchPaymentHistory();
    }
  }, [houseId, activeTab]);

  const fetchHouseDetail = async () => {
    setIsLoading(true);
    try {
      const response = await houseService.getById(houseId);
      if (response.success && response.data) {
        setHouse(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat detail rumah.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOccupancyHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await houseService.getOccupancyHistory(houseId);
      if (response.success && response.data) {
        setOccupancyHistory(response.data);
      }
    } catch (err: unknown) {
      showToast('Gagal memuat riwayat penghuni.', 'error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchPaymentHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await houseService.getPaymentHistory(houseId);
      if (response.success && response.data) {
        setPaymentHistory(response.data);
      }
    } catch (err: unknown) {
      showToast('Gagal memuat riwayat pembayaran.', 'error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleOpenAssignModal = async (reassignMode = false) => {
    setIsReassign(reassignMode);
    setSelectedResidentId('');
    setAssignError(null);
    setShowAssignModal(true);

    try {
      const response = await residentService.getAll({ per_page: 100 });
      if (response.success && response.data) {
        setAvailableResidents(response.data.items);
      }
    } catch (err) {
      showToast('Gagal memuat daftar pilihan penghuni.', 'error');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidentId) return;

    setAssignError(null);
    setIsSubmittingAssign(true);

    const residentId = parseInt(selectedResidentId, 10);

    try {
      if (isReassign) {
        const response = await houseService.reassignResident(houseId, residentId);
        if (response.success) {
          showToast('Penghuni berhasil diganti.', 'success');
          setShowAssignModal(false);
          fetchHouseDetail();
        }
      } else {
        const response = await houseService.assignResident(houseId, residentId);
        if (response.success) {
          showToast('Penghuni berhasil ditempatkan.', 'success');
          setShowAssignModal(false);
          fetchHouseDetail();
        }
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setAssignError(err.message || 'Gagal mengubah status penghuni.');
      } else {
        setAssignError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <Skeleton height="3rem" width="30%" />
        <Card className="space-y-6">
          <Skeleton height="8rem" width="100%" />
          <Skeleton height="15rem" width="100%" />
        </Card>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-[1.8rem] text-neutral-500 font-medium">Data rumah tidak ditemukan.</p>
        <Link to="/houses">
          <Button variant="secondary">Kembali ke Daftar Rumah</Button>
        </Link>
      </div>
    );
  }

  const occupancyColumns: Column<OccupancyRecord>[] = [
    {
      header: 'Penghuni',
      accessor: (item) => (
        <span className="font-bold text-[#151717]">{item.resident.full_name}</span>
      ),
    },
    {
      header: 'Tanggal Mulai',
      accessor: (item) => item.start_date,
    },
    {
      header: 'Tanggal Selesai',
      accessor: (item) => (item.end_date ? item.end_date : <Badge variant="success">Masih Menempati</Badge>),
    },
  ];

  const paymentColumns: Column<Payment>[] = [
    {
      header: 'No. Transaksi',
      accessor: (item) => <span className="font-mono font-bold text-[#151717]">{item.transaction_number}</span>,
    },
    {
      header: 'Jenis Iuran',
      accessor: (item) => item.dues_type.name,
    },
    {
      header: 'Total Bayar',
      accessor: (item) => (
        <span className="font-bold text-[#151717]">
          Rp {item.total_amount.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'Tanggal',
      accessor: (item) => item.payment_date,
    },
    {
      header: 'Status',
      accessor: (item) => (
        <Badge variant={item.status === 'lunas' ? 'success' : 'danger'}>
          {item.status === 'lunas' ? 'Lunas' : 'Dibatalkan'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/houses')}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#151717] font-semibold text-[1.4rem] cursor-pointer"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Rumah
        </button>
      </div>

      {/* House Title Header */}
      <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#151717] text-white font-bold flex items-center justify-center text-[2rem]">
            <Home size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Rumah {house.house_number}</h1>
              <Badge variant={house.occupancy_status === 'dihuni' ? 'success' : 'warning'}>
                {house.occupancy_status === 'dihuni' ? 'Dihuni' : 'Kosong'}
              </Badge>
            </div>
            <p className="text-[1.4rem] text-neutral-400 font-medium mt-1">ID Hunian: #{house.id}</p>
          </div>
        </div>

        <div>
          {house.occupancy_status === 'dihuni' ? (
            <Button
              variant="outline"
              icon={<RefreshCw size={18} />}
              onClick={() => handleOpenAssignModal(true)}
            >
              Ganti Penghuni
            </Button>
          ) : (
            <Button
              icon={<UserPlus size={18} />}
              onClick={() => handleOpenAssignModal(false)}
            >
              Tempatkan Penghuni
            </Button>
          )}
        </div>
      </Card>

      {/* Tab Controls */}
      <div className="flex border-b border-neutral-200 gap-8 text-[1.6rem] font-bold">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-4 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'info' ? 'border-[#151717] text-[#151717]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Info & Penghuni Aktif
        </button>
        <button
          onClick={() => setActiveTab('occupancy')}
          className={`pb-4 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'occupancy' ? 'border-[#151717] text-[#151717]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Riwayat Penghuni
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-4 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'payments' ? 'border-[#151717] text-[#151717]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Riwayat Pembayaran
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <Card className="space-y-6">
          <h3 className="text-[1.8rem] font-bold text-[#151717]">Penghuni Aktif Saat Ini</h3>
          {house.active_resident ? (
            <div className="p-6 rounded-2xl bg-[#F4F4F4] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[2rem] font-bold text-[#151717]">{house.active_resident.full_name}</span>
                  <Badge variant={house.active_resident.resident_status === 'tetap' ? 'success' : 'info'}>
                    {house.active_resident.resident_status === 'tetap' ? 'Penghuni Tetap' : 'Kontrak'}
                  </Badge>
                </div>
                <p className="text-[1.4rem] text-neutral-500 font-medium flex items-center gap-2">
                  <Calendar size={16} /> Menempati sejak: {house.active_resident.since}
                </p>
              </div>

              <Link to={`/residents/${house.active_resident.id}`}>
                <Button variant="secondary" size="sm">
                  Lihat Profil Penghuni
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <p className="text-[1.6rem] font-bold">Rumah Ini Sedang Kosong</p>
              <p className="text-[1.4rem] text-amber-800">
                Belum ada penghuni aktif yang didaftarkan di rumah ini.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus size={16} />}
                onClick={() => handleOpenAssignModal(false)}
              >
                Tempatkan Penghuni Sekarang
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'occupancy' && (
        <Table
          columns={occupancyColumns}
          data={occupancyHistory}
          keyExtractor={(item) => item.id}
          isLoading={isLoadingHistory}
          emptyMessage="Belum ada riwayat penghuni sebelumnya."
        />
      )}

      {activeTab === 'payments' && (
        <Table
          columns={paymentColumns}
          data={paymentHistory}
          keyExtractor={(item) => item.id}
          isLoading={isLoadingHistory}
          emptyMessage="Belum ada transaksi pembayaran untuk rumah ini."
        />
      )}

      {/* Assign / Reassign Resident Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={isReassign ? 'Ganti Penghuni Rumah' : 'Tempatkan Penghuni Baru'}
        subtitle={`Pilih penghuni dari master warga untuk menempati rumah ${house.house_number}`}
        maxWidth="md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-6">
          {assignError && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-[1.4rem] font-medium border border-red-200">
              {assignError}
            </div>
          )}

          <Select
            label="Pilih Penghuni"
            required
            value={selectedResidentId}
            onChange={(e) => setSelectedResidentId(e.target.value)}
            placeholder="-- Pilih nama warga --"
            options={availableResidents.map((r) => ({
              value: r.id,
              label: `${r.full_name} (${r.resident_status === 'tetap' ? 'Tetap' : 'Kontrak'}) ${
                r.current_house ? `[Menempati Rumah ${r.current_house.house_number}]` : '[Belum ada rumah]'
              }`,
            }))}
          />

          <div className="p-4 rounded-2xl bg-neutral-100 text-[1.3rem] text-neutral-600 font-medium">
            Catatan: Mengganti atau menempatkan penghuni baru secara otomatis memindahkan status aktif rumah menjadi Dihuni.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAssignModal(false)}
              disabled={isSubmittingAssign}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmittingAssign}>
              {isReassign ? 'Konfirmasi Ganti Penghuni' : 'Konfirmasi Penempatan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HouseDetailPage;
