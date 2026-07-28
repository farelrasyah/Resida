export type ExpenseCategory =
  | 'gaji_satpam'
  | 'listrik_utilitas'
  | 'kebersihan'
  | 'perbaikan'
  | 'kegiatan'
  | 'operasional'
  | 'lainnya';

export interface Expense {
  id: number;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseFilterParams {
  category?: ExpenseCategory;
  year?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface ExpenseFormData {
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
}
