/**
 * Clockify Expenses - Domain Entities and DTO Types
 */

export type ExpenseApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ExpenseItem {
  id: string;
  team_member: string; // Member display name
  member_id?: string;
  date: string; // ISO date string YYYY-MM-DD or formatted like "Today", "Jul 06, 2026"
  project_id: string;
  project_name: string;
  project_color: string;
  category: string;
  amount: number;
  currency: string;
  note: string;
  billable: boolean;
  receipt_name?: string;
  status: ExpenseApprovalStatus;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  unit_price?: number | null;
  is_active: boolean;
}

export interface ExpenseSettings {
  default_currency: string;
  default_billable: boolean;
  categories: string[];
}

export interface ExpenseFilter {
  team_member?: string;
  project_id?: string;
  category?: string;
  billable?: boolean;
  status?: ExpenseApprovalStatus;
  start_date?: string;
  end_date?: string;
}

export interface CreateExpensePayload {
  team_member: string;
  member_id?: string;
  date: string;
  project_id: string;
  project_name?: string;
  project_color?: string;
  category: string;
  amount: number;
  currency?: string;
  note?: string;
  billable?: boolean;
  receipt_name?: string;
  status?: ExpenseApprovalStatus;
}

export interface UpdateExpensePayload {
  team_member?: string;
  member_id?: string;
  date?: string;
  project_id?: string;
  project_name?: string;
  project_color?: string;
  category?: string;
  amount?: number;
  currency?: string;
  note?: string;
  billable?: boolean;
  receipt_name?: string;
  status?: ExpenseApprovalStatus;
}

export interface ExpenseSummaryDTO {
  total_amount: number;
  billable_amount: number;
  non_billable_amount: number;
  currency: string;
  count: number;
  pending_count: number;
  approved_count: number;
}
