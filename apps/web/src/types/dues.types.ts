export type DuesTypeCode = 'satpam' | 'kebersihan';

export interface DuesType {
  id: number;
  code: DuesTypeCode;
  name: string;
  amount: number;
  default_frequency: 'bulanan' | 'tahunan';
  created_at?: string;
  updated_at?: string;
}
