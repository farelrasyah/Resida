import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { residentService } from '../../../api/resident.service';
import type { Resident, ResidentFormData, ResidentStatus, MaritalStatus } from '../../../types/resident.types';
import { ApiError } from '../../../api/client';

interface ResidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resident?: Resident | null;
}

export const ResidentFormModal: React.FC<ResidentFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  resident,
}) => {
  const isEditMode = !!resident;

  const [formData, setFormData] = useState<ResidentFormData>({
    full_name: '',
    resident_status: 'tetap',
    phone_number: '',
    marital_status: 'sudah_menikah',
    ktp_photo: null,
  });

  const [existingKtpUrl, setExistingKtpUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (resident) {
        setFormData({
          full_name: resident.full_name,
          resident_status: resident.resident_status,
          phone_number: resident.phone_number,
          marital_status: resident.marital_status,
          ktp_photo: null,
        });
        setExistingKtpUrl(resident.ktp_photo_url);
      } else {
        setFormData({
          full_name: '',
          resident_status: 'tetap',
          phone_number: '',
          marital_status: 'sudah_menikah',
          ktp_photo: null,
        });
        setExistingKtpUrl(null);
      }
      setPhotoPreview(null);
      setFieldErrors({});
    }
  }, [isOpen, resident]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, ktp_photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      if (isEditMode && resident) {
        const response = await residentService.update(resident.id, formData);
        if (response.success) {
          showToast('Data penghuni berhasil diperbarui.', 'success');
          onSuccess();
          onClose();
        }
      } else {
        const response = await residentService.create(formData);
        if (response.success) {
          showToast('Penghuni baru berhasil ditambahkan.', 'success');
          onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        }
        showToast(err.message || 'Gagal menyimpan data.', 'error');
      } else {
        showToast('Terjadi kesalahan jaringan.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
      subtitle={isEditMode ? 'Ubah data penghuni yang sudah terdaftar.' : 'Lengkapi data penghuni baru untuk didaftarkan.'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nama Lengkap Penghuni"
          placeholder="Contoh: Budi Santoso"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          error={fieldErrors['full_name']?.[0]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Status Tinggal"
            required
            value={formData.resident_status}
            onChange={(e) => setFormData({ ...formData, resident_status: e.target.value as ResidentStatus })}
            options={[
              { value: 'tetap', label: 'Penghuni Tetap' },
              { value: 'kontrak', label: 'Kontrak' },
            ]}
            error={fieldErrors['resident_status']?.[0]}
          />

          <Input
            label="Nomor Telepon / HP"
            placeholder="Contoh: 081234567890"
            required
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            error={fieldErrors['phone_number']?.[0]}
          />
        </div>

        <Select
          label="Status Pernikahan"
          required
          value={formData.marital_status}
          onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as MaritalStatus })}
          options={[
            { value: 'sudah_menikah', label: 'Sudah Menikah' },
            { value: 'belum_menikah', label: 'Belum Menikah' },
          ]}
          error={fieldErrors['marital_status']?.[0]}
        />

        {/* KTP Photo Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-[1.4rem] font-semibold text-[#151717]">
            Foto KTP {!isEditMode && <span className="text-red-500">*</span>}
          </label>

          <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-[#F4F4F4] border-2 border-dashed border-neutral-300">
            <div className="w-32 h-20 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300 flex items-center justify-center relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview KTP Baru" className="w-full h-full object-cover" />
              ) : existingKtpUrl ? (
                <img src={existingKtpUrl} alt="KTP Saat Ini" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-neutral-400" />
              )}
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#151717] border border-neutral-300 hover:bg-neutral-50 font-semibold text-[1.4rem] cursor-pointer transition-all shadow-sm">
                <Upload size={16} />
                <span>{photoPreview || existingKtpUrl ? 'Ganti File KTP' : 'Upload Foto KTP'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[1.2rem] text-neutral-500">
                Format JPG, JPEG, atau PNG. Maksimal ukuran file 2MB.
              </p>
            </div>
          </div>
          {fieldErrors['ktp_photo']?.[0] && (
            <span className="text-red-600 text-[1.3rem] font-medium pl-3">{fieldErrors['ktp_photo'][0]}</span>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading} icon={<Save size={18} />}>
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Penghuni'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
