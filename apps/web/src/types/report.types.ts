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

export interface DashboardKPIs {
  total_houses: number;
  occupied_houses: number;
  vacant_houses: number;
  total_residents: number;
  total_residents_last_month: number;
  current_month_income: number;
  last_month_income: number;
  current_month_expense: number;
  last_month_expense: number;
  current_balance: number;
  unpaid_periods: number;
  paid_periods: number;
  expected_periods: number;
}

export interface CashFlowChartData {
  month: string;
  income: number;
  expense: number;
  balance: number | null;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface LatestPayment {
  id: number;
  date: string;
  house: string;
  amount: number;
  method: string;
  admin: string;
}

export interface LatestExpense {
  id: number;
  date: string;
  title: string;
  category: string;
  amount: number;
}

export interface TopDefaulter {
  house_number: string;
  unpaid_count: number;
  resident: string;
}

export interface RecentActivity {
  type: 'payment' | 'expense' | 'resident' | 'house';
  title: string;
  subtitle: string;
  date: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  charts: {
    cash_flow: CashFlowChartData[];
    expense_categories: PieChartData[];
    house_composition: PieChartData[];
  };
  widgets: {
    latest_payments: LatestPayment[];
    latest_expenses: LatestExpense[];
    top_defaulters: TopDefaulter[];
    recent_activities: RecentActivity[];
  };
}
