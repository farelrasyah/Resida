import React, { useEffect, useState } from 'react';
import { Receipt, Edit2, Info } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { duesTypeService } from '../../api/duesType.service';
import type { DuesType } from '../../types/dues.types';
import { ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';

export const DuesTypeSettingPage: React.FC = () => {
  const [duesTypes, setDuesTypes] = useState<DuesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingType, setEditingType] = useState<DuesType | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchDuesTypes();
  }, []);

  const fetchDuesTypes = async () => {
    setIsLoading(true);
    try {
      const response = await duesTypeService.getAll();
      if (response.success && response.data) {
        setDuesTypes(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Gagal memuat jenis iuran.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (dues: DuesType) => {
    setEditingType(dues);
    setAmountInput(dues.amount.toString());
    setFormError(null);
  };

  const handleSaveAmount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    setFormError(null);
    setIsSaving(true);

    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Nominal iuran harus berupa angka lebih besar dari 0.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await duesTypeService.updateAmount(editingType.id, numericAmount);
      if (response.success) {
        showToast(`Nominal ${editingType.name} berhasil diperbarui.`, 'success');
        setEditingType(null);
        fetchDuesTypes();
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message || 'Gagal memperbarui nominal iuran.');
      } else {
        setFormError('Terjadi kesalahan jaringan.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-[3rem] font-bold text-[#151717] tracking-tight">Setting Jenis Iuran RT</h1>
        <p className="text-[1.5rem] text-neutral-400 font-medium mt-1">
          Kelola master tarif nominal iuran bulanan satpam dan iuran tahunan kebersihan
        </p>
      </div>

      {/* Snapshot Information Banner */}
      <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-4">
        <Info className="text-sky-600 shrink-0 mt-1" size={24} />
        <div className="space-y-1">
          <p className="text-[1.5rem] font-bold">Prinsip Snapshot Nominal Iuran</p>
          <p className="text-[1.4rem] text-sky-800 font-medium leading-relaxed">
            Perubahan tarif nominal di halaman ini hanya akan berlaku untuk transaksi pembayaran di masa mendatang. Pembayaran yang sudah dicatat sebelumnya tidak akan berubah nilainya.
          </p>
        </div>
      </div>

      {/* Dues Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          <>
            <Card className="space-y-4">
              <Skeleton height="3rem" width="60%" />
              <Skeleton height="5rem" width="100%" />
            </Card>
            <Card className="space-y-4">
              <Skeleton height="3rem" width="60%" />
              <Skeleton height="5rem" width="100%" />
            </Card>
          </>
        ) : (
          duesTypes.map((dues) => (
            <Card key={dues.id} className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#151717] text-white flex items-center justify-center">
                      <Receipt size={24} />
                    </div>
                    <div>
                      <h3 className="text-[2rem] font-bold text-[#151717]">{dues.name}</h3>
                      <p className="text-[1.2rem] text-neutral-400 font-mono uppercase">Kode: {dues.code}</p>
                    </div>
                  </div>

                  <Badge variant={dues.default_frequency === 'bulanan' ? 'info' : 'warning'}>
                    {dues.default_frequency === 'bulanan' ? 'Tagihan Bulanan' : 'Tagihan Tahunan'}
                  </Badge>
                </div>

                <div className="p-6 rounded-2xl bg-[#F4F4F4]">
                  <span className="text-[1.3rem] font-bold text-neutral-400 uppercase tracking-wider">Tarif Nominal</span>
                  <p className="text-[3.2rem] font-bold text-[#151717] tracking-tight mt-1">
                    {formatCurrency(dues.amount)}
                  </p>
                  <p className="text-[1.3rem] text-neutral-500 font-medium mt-1">
                    Per {dues.default_frequency === 'bulanan' ? 'bulan per rumah' : 'tahun per rumah'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <Button
                  variant="outline"
                  icon={<Edit2 size={16} />}
                  onClick={() => handleOpenEditModal(dues)}
                >
                  Ubah Nominal Tarif
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Amount Modal */}
      <Modal
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        title={`Ubah Tarif ${editingType?.name}`}
        subtitle="Masukkan nominal iuran baru yang akan digunakan untuk transaksi berikutnya."
        maxWidth="sm"
      >
        <form onSubmit={handleSaveAmount} className="space-y-6">
          <Input
            label="Nominal Iuran Baru (Rp)"
            type="number"
            placeholder="Contoh: 100000"
            required
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            error={formError || undefined}
          />

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[1.3rem] font-medium">
            Penting: Nominal baru ini langsung menjadi acuan perhitungan saat membuat pembayaran iuran baru.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingType(null)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Simpan Nominal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DuesTypeSettingPage;
