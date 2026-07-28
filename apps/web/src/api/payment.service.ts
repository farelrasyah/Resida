import { apiClient } from './client';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { CreatePaymentPayload, Payment, PaymentFilterParams } from '../types/payment.types';

export const paymentService = {
  getAll: async (params?: PaymentFilterParams): Promise<ApiResponse<PaginatedData<Payment>>> => {
    return apiClient.get<PaginatedData<Payment>>('/payments', params as Record<string, unknown>);
  },

  getById: async (id: number): Promise<ApiResponse<Payment>> => {
    return apiClient.get<Payment>(`/payments/${id}`);
  },

  create: async (data: CreatePaymentPayload): Promise<ApiResponse<Payment>> => {
    return apiClient.post<Payment>('/payments', data);
  },

  cancel: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/payments/${id}/cancel`);
  },
};
