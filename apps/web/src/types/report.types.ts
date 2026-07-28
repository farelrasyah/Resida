export interface AnnualSummaryMonth {
  month: number;
  income: number;
  expense: number;
  balance: number;
}

export interface AnnualSummaryReport {
  year: number;
  starting_balance: number;
  months: AnnualSummaryMonth[];
}

export interface MonthlyDuesStatus {
  dues_type_id: number;
  dues_type_name: string;
  status: 'Lunas' | 'Belum Lunas' | 'Tidak Ada Tagihan';
}

export interface MonthlyHouseStatus {
  house_id: number;
  house_number: string;
  occupancy_status: 'dihuni' | 'tidak_dihuni';
  dues_statuses: MonthlyDuesStatus[];
}

export interface MonthlyDetailReport {
  year: number;
  month: number;
  payments: unknown[];
  expenses: unknown[];
  house_statuses: MonthlyHouseStatus[];
}

export interface DashboardData {
  total_houses: number;
  occupied_houses: number;
  vacant_houses: number;
  current_month_income: number;
  current_month_expense: number;
  current_balance: number;
}
