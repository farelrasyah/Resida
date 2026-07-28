export type PaymentStatus = 'lunas' | 'dibatalkan';

export interface PaymentPeriodItem {
  id: number;
  period_year?: number;
  period_month?: number;
  year?: number;
  month?: number;
  amount?: number;
}

export interface Payment {
  id: number;
  transaction_number: string;
  house: {
    id: number;
    house_number: string;
  };
  resident: {
    id: number;
    full_name: string;
  };
  dues_type: {
    id: number;
    code: string;
    name: string;
  };
  amount: number;
  total_amount: number;
  payment_date: string;
  status: PaymentStatus;
  notes: string | null;
  periods?: PaymentPeriodItem[];
  created_at?: string;
}

export type PaymentDetail = Payment;

export interface PaymentFilterParams {
  house_id?: number;
  resident_id?: number;
  dues_type_id?: number;
  status?: PaymentStatus;
  year?: number;
  month?: number;
  page?: number;
  per_page?: number;
}

export interface CreatePaymentPayload {
  house_id: number;
  dues_type_id: number;
  start_month?: number;
  end_month?: number;
  year?: number;
  period_start_year?: number;
  period_start_month?: number;
  period_count?: number;
  payment_date: string;
  notes?: string;
}

export type PaymentFormData = CreatePaymentPayload;
