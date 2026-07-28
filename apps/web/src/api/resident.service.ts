import { apiClient } from './client';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Resident, ResidentFilterParams, ResidentFormData } from '../types/resident.types';

export const residentService = {
  getAll: async (params?: ResidentFilterParams): Promise<ApiResponse<PaginatedData<Resident>>> => {
    return apiClient.get<PaginatedData<Resident>>('/residents', params as Record<string, unknown>);
  },

  getById: async (id: number): Promise<ApiResponse<Resident>> => {
    return apiClient.get<Resident>(`/residents/${id}`);
  },

  create: async (data: ResidentFormData): Promise<ApiResponse<Resident>> => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('resident_status', data.resident_status);
    formData.append('phone_number', data.phone_number);
    formData.append('marital_status', data.marital_status);
    if (data.ktp_photo) {
      formData.append('ktp_photo', data.ktp_photo);
    }
    return apiClient.upload<Resident>('/residents', formData);
  },

  update: async (id: number, data: ResidentFormData): Promise<ApiResponse<Resident>> => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('resident_status', data.resident_status);
    formData.append('phone_number', data.phone_number);
    formData.append('marital_status', data.marital_status);
    if (data.ktp_photo) {
      formData.append('ktp_photo', data.ktp_photo);
    }
    return apiClient.upload<Resident>(`/residents/${id}`, formData, 'PUT');
  },

  deactivate: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/residents/${id}/deactivate`);
  },
};
