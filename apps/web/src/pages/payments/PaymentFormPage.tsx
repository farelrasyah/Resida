import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { paymentService } from '../../api/payment.service';
import { houseService } from '../../api/house.service';
import { duesTypeService } from '../../api/duesType.service';
import type { PaymentFormData } from '../../types/payment.types';
import type { House } from '../../types/house.types';
import type { DuesType } from '../../types/dues.types';
import { ApiError } from '../../api/client';

const MONTH_OPTIONS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

export const PaymentFormPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const [houses, setHouses] = useState<House[]>([]);
  const [duesTypes, setDuesTypes] = useState<DuesType[]>([]);
  const [selectedDues, setSelectedDues] = useState<DuesType | null>(null);

  const [formData, setFormData] = useState<{
    house_id: string;
    dues_type_id: string;
    start_month: number;
    end_month: number;
    year: number;
    payment_date: string;
  }>({
    house_id: '',
    dues_type_id: '',
    start_month: new Date().getMonth() + 1,
    end_month: new Date().getMonth() + 1,
    year: currentYear,
    payment_date: new Date().toISOString().split('T')[0],
  });

  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [monthCount, setMonthCount] = useState<number>(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.dues_type_id) {
      const d = duesTypes.find((item) => item.id === parseInt(formData.dues_type_id, 10));
      setSelectedDues(d || null);
    } else {
      setSelectedDues(null);
    }
  }, [formData.dues_type_id, duesTypes]);

  useEffect(() => {
    if (selectedDues) {
      if (selectedDues.default_frequency === 'tahunan') {
        setMonthCount(1);
        setCalculatedTotal(selectedDues.amount);
      } else {
        const count = Math.max(1, formData.end_month - formData.start_month + 1);
        setMonthCount(count);
        setCalculatedTotal(count * selectedDues.amount);
      }
    } else {
      setCalculatedTotal(0);
      setMonthCount(1);
    }
  }, [formData.start_month, formData.end_month, selectedDues]);

  const fetchInitialData = async () => {
    setIsInitializing(true);
    try {
      const [housesRes, duesRes] = await Promise.all([
        houseService.getAll({ per_page: 100, occupancy_status: 'dihuni' }),
        duesTypeService.getAll(),
      ]);

      if (housesRes.success && housesRes.data) {
        setHouses(housesRes.data.items);
      }
      if (duesRes.success && duesRes.data) {
        setDuesTypes(duesRes.data);
        if (duesRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, dues_type_id: duesRes.data[0].id.toString() }));
        }
      }
    } catch (err) {
      showToast('Gagal memuat data opsi rumah atau jenis iuran.', 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!formData.house_id) {
      setFieldErrors({ house_id: ['Pilih rumah yang akan membayar iuran.'] });
      return;
    }

    if (formData.end_month < formData.start_month) {
      setFieldErrors({ end_month: ['Bulan akhir tidak boleh lebih awal dari bulan mulai.'] });
      return;
    }

    setIsLoading(true);

    const payload: PaymentFormData = {
      house_id: parseInt(formData.house_id, 10),
      dues_type_id: parseInt(formData.dues_type_id, 10),
      start_month: formData.start_month,
      end_month: selectedDues?.default_frequency === 'tahunan' ? formData.start_month : formData.end_month,
      year: formData.year,
      payment_date: formData.payment_date,
    };

    try {
      const response = await paymentService.create(payload);
      if (response.success && response.data) {
        showToast('Transaksi pembayaran iuran berhasil dicatat.', 'success');
        navigate(`/payments/${response.data.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(err.errors);
        }
        showToast(err.message || 'Gagal merilis transaksi pembayaran.', 'error');
      } else {
        showToast('Terjadi kesalahan jaringan.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#151717]/20 border-t-[#151717] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/payments')}
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#151717] font-semibold text-[1.4rem] cursor-pointer"
        >
          <ArrowLeft size={18} />
          Batal
        </button>
        <h1 className="text-[2.6rem] font-bold text-[#151717] tracking-tight">Form Pembayaran Iuran RT</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Pilih Rumah (Khusus Rumah Berpenghuni)"
            required
            value={formData.house_id}
            onChange={(e) => setFormData({ ...formData, house_id: e.target.value })}
            placeholder="-- Pilih unit rumah --"
            options={houses.map((h) => ({
              value: h.id,
              label: `Rumah ${h.house_number}`,
            }))}
            error={fieldErrors['house_id']?.[0]}
          />

          <Select
            label="Jenis Iuran"
            required
            value={formData.dues_type_id}
            onChange={(e) => setFormData({ ...formData, dues_type_id: e.target.value })}
            options={duesTypes.map((d) => ({
              value: d.id,
              label: `${d.name} (${formatCurrency(d.amount)} / ${d.default_frequency})`,
            }))}
            error={fieldErrors['dues_type_id']?.[0]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tahun Tagihan"
              required
              value={formData.year.toString()}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
              options={[
                { value: '2026', label: 'Tahun 2026' },
                { value: '2025', label: 'Tahun 2025' },
                { value: '2024', label: 'Tahun 2024' },
              ]}
              error={fieldErrors['year']?.[0]}
            />

            <Input
              label="Tanggal Pembayaran"
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              error={fieldErrors['payment_date']?.[0]}
            />
          </div>

          {selectedDues?.default_frequency === 'bulanan' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#F4F4F4] border border-neutral-200">
              <Select
                label="Dari Bulan"
                required
                value={formData.start_month.toString()}
                onChange={(e) => setFormData({ ...formData, start_month: parseInt(e.target.value, 10) })}
                options={MONTH_OPTIONS.map((m) => ({ value: m.value, label: m.label }))}
                error={fieldErrors['start_month']?.[0]}
              />

              <Select
                label="Sampai Bulan"
                required
                value={formData.end_month.toString()}
                onChange={(e) => setFormData({ ...formData, end_month: parseInt(e.target.value, 10) })}
                options={MONTH_OPTIONS.map((m) => ({ value: m.value, label: m.label }))}
                error={fieldErrors['end_month']?.[0]}
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#F4F4F4] border border-neutral-200">
              <Select
                label="Periode Tagihan Tahunan"
                required
                value={formData.start_month.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_month: parseInt(e.target.value, 10),
                    end_month: parseInt(e.target.value, 10),
                  })
                }
                options={MONTH_OPTIONS.map((m) => ({ value: m.value, label: `Berlaku sejak ${m.label}` }))}
              />
            </div>
          )}

          {/* Auto Calculation Summary Card */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                <Calculator size={24} />
              </div>
              <div>
                <p className="text-[1.3rem] font-bold text-emerald-800 uppercase tracking-wider">Total Yang Harus Dibayar</p>
                <p className="text-[1.3rem] text-emerald-700 font-medium">
                  {selectedDues?.default_frequency === 'bulanan'
                    ? `${monthCount} bulan x ${formatCurrency(selectedDues?.amount || 0)}`
                    : `Tarif tahunan ${formatCurrency(selectedDues?.amount || 0)}`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[3.2rem] font-bold text-emerald-950 tracking-tight">
                {formatCurrency(calculatedTotal)}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/payments')}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={isLoading} icon={<Save size={18} />}>
              Proses Pembayaran
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PaymentFormPage;
