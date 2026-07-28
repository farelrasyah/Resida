import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { AnnualSummaryReport, DashboardData, MonthlyDetailReport } from '../types/report.types';

export const reportService = {
  getAnnualSummary: async (year: number): Promise<ApiResponse<AnnualSummaryReport>> => {
    return apiClient.get<AnnualSummaryReport>('/reports/summary', { year });
  },

  getMonthlyDetail: async (year: number, month: number): Promise<ApiResponse<MonthlyDetailReport>> => {
    return apiClient.get<MonthlyDetailReport>('/reports/detail', { year, month });
  },

  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    return apiClient.get<DashboardData>('/reports/dashboard');
  },
};
