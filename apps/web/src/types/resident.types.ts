export type ResidentStatus = 'kontrak' | 'tetap';
export type MaritalStatus = 'sudah_menikah' | 'belum_menikah';

export interface ResidentHouseRef {
  id: number;
  house_number: string;
}

export interface Resident {
  id: number;
  full_name: string;
  ktp_photo_url: string | null;
  resident_status: ResidentStatus;
  phone_number: string;
  marital_status: MaritalStatus;
  current_house?: ResidentHouseRef | null;
  created_at?: string;
  updated_at?: string;
}

export interface ResidentFilterParams {
  search?: string;
  resident_status?: ResidentStatus;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface ResidentFormData {
  full_name: string;
  resident_status: ResidentStatus;
  phone_number: string;
  marital_status: MaritalStatus;
  ktp_photo?: File | null;
}
