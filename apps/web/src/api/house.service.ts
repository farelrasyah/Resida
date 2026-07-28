import { apiClient } from './client';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { House, HouseDetail, HouseFilterParams, OccupancyRecord } from '../types/house.types';
import type { Payment } from '../types/payment.types';

export const houseService = {
  getAll: async (params?: HouseFilterParams): Promise<ApiResponse<PaginatedData<House>>> => {
    return apiClient.get<PaginatedData<House>>('/houses', params as Record<string, unknown>);
  },

  getById: async (id: number): Promise<ApiResponse<HouseDetail>> => {
    return apiClient.get<HouseDetail>(`/houses/${id}`);
  },

  create: async (house_number: string): Promise<ApiResponse<House>> => {
    return apiClient.post<House>('/houses', { house_number });
  },

  update: async (id: number, house_number: string): Promise<ApiResponse<House>> => {
    return apiClient.put<House>(`/houses/${id}`, { house_number });
  },

  deactivate: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/houses/${id}/deactivate`);
  },

  assignResident: async (houseId: number, residentId: number): Promise<ApiResponse<HouseDetail>> => {
    return apiClient.post<HouseDetail>(`/houses/${houseId}/occupancies`, {
      resident_id: residentId,
    });
  },

  reassignResident: async (houseId: number, residentId: number): Promise<ApiResponse<HouseDetail>> => {
    return apiClient.post<HouseDetail>(`/houses/${houseId}/occupancies/reassign`, {
      resident_id: residentId,
    });
  },

  getOccupancyHistory: async (houseId: number): Promise<ApiResponse<OccupancyRecord[]>> => {
    return apiClient.get<OccupancyRecord[]>(`/houses/${houseId}/occupancies/history`);
  },

  getPaymentHistory: async (houseId: number): Promise<ApiResponse<Payment[]>> => {
    return apiClient.get<Payment[]>(`/houses/${houseId}/payments`);
  },
};
