import { apiClient } from './client';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Expense, ExpenseFilterParams, ExpenseFormData } from '../types/expense.types';

export const expenseService = {
  getAll: async (params?: ExpenseFilterParams): Promise<ApiResponse<PaginatedData<Expense>>> => {
    return apiClient.get<PaginatedData<Expense>>('/expenses', params as Record<string, unknown>);
  },

  getById: async (id: number): Promise<ApiResponse<Expense>> => {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  create: async (data: ExpenseFormData): Promise<ApiResponse<Expense>> => {
    return apiClient.post<Expense>('/expenses', data);
  },
};
