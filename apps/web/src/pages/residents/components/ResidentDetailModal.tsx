import React, { useState } from 'react';
import { Phone, Home, Calendar, User, Eye, Edit2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal as KtpModal } from '../../../components/ui/Modal';
import type { Resident } from '../../../types/resident.types';

interface ResidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident;
  onEdit: (resident: Resident) => void;
}

export const ResidentDetailModal: React.FC<ResidentDetailModalProps> = ({
  isOpen,
  onClose,
  resident,
  onEdit,
}) => {
  const [showKtpModal, setShowKtpModal] = useState(false);

  const handleEdit = () => {
    onClose();
    onEdit(resident);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={resident.full_name}
        subtitle={`ID Penghuni: #${resident.id}`}
        maxWidth="lg"
      >
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 shrink-0 border-2 border-white shadow-md">
                {resident.ktp_photo_url ? (
                  <img src={resident.ktp_photo_url} alt={resident.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500 text-2xl">
                    {resident.full_name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <Badge variant={resident.resident_status === 'tetap' ? 'success' : 'info'}>
                    {resident.resident_status === 'tetap' ? 'Penghuni Tetap' : 'Kontrak'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resident.ktp_photo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={18} />}
                  onClick={() => setShowKtpModal(true)}
                >
                  Lihat Foto KTP
                </Button>
              )}
              <Button
                size="sm"
                icon={<Edit2 size={18} />}
                onClick={handleEdit}
              >
                Edit Data
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[1.6rem] font-bold text-[#151717] flex items-center gap-2">
                <User size={18} className="text-neutral-400" /> Informasi Pribadi
              </h3>
              <div className="space-y-3 bg-[#F4F4F4] p-6 rounded-2xl">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-neutral-500 font-medium">Nomor Telepon:</span>
                  <span className="font-bold text-[#151717] flex items-center gap-1.5">
                    <Phone size={14} className="text-neutral-400" />
                    {resident.phone_number}
                  </span>
                </div>
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-neutral-500 font-medium">Status Pernikahan:</span>
                  <span className="font-bold text-[#151717] capitalize">
                    {resident.marital_status === 'sudah_menikah' ? 'Sudah Menikah' : 'Belum Menikah'}
                  </span>
                </div>
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-neutral-500 font-medium">Tanggal Didaftarkan:</span>
                  <span className="font-bold text-[#151717] flex items-center gap-1.5">
                    <Calendar size={14} className="text-neutral-400" />
                    {resident.created_at ? new Date(resident.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[1.6rem] font-bold text-[#151717] flex items-center gap-2">
                <Home size={18} className="text-neutral-400" /> Status Hunian Rumah
              </h3>
              {resident.current_house ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div>
                    <span className="text-[1.2rem] font-bold text-emerald-800 uppercase tracking-wider">Rumah Saat Ini</span>
                    <h4 className="text-[2.4rem] font-bold text-emerald-950">{resident.current_house.house_number}</h4>
                    <p className="text-[1.3rem] text-emerald-700 font-medium">Status aktif berpenghuni</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-neutral-100 text-center space-y-2">
                  <p className="text-[1.5rem] font-bold text-[#151717]">Tidak Menempati Rumah</p>
                  <p className="text-[1.3rem] text-neutral-500">Penghuni ini saat ini belum terdaftar di rumah manapun.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* KTP Image Modal */}
      {resident.ktp_photo_url && (
        <KtpModal
          isOpen={showKtpModal}
          onClose={() => setShowKtpModal(false)}
          title={`Foto KTP - ${resident.full_name}`}
          maxWidth="lg"
        >
          <div className="flex flex-col items-center justify-center p-4">
            <img
              src={resident.ktp_photo_url}
              alt={`KTP ${resident.full_name}`}
              className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-lg border border-neutral-200"
            />
          </div>
        </KtpModal>
      )}
    </>
  );
};
