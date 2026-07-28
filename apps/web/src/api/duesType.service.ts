import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { DuesType } from '../types/dues.types';

export const duesTypeService = {
  getAll: async (): Promise<ApiResponse<DuesType[]>> => {
    return apiClient.get<DuesType[]>('/dues-types');
  },

  updateAmount: async (id: number, amount: number): Promise<ApiResponse<DuesType>> => {
    return apiClient.put<DuesType>(`/dues-types/${id}`, { amount });
  },
};
