export type ApprovalStatus = 'pending' | 'unsubmitted' | 'approved' | 'rejected';
export type ApprovalType = 'timesheet' | 'expenses';

export interface TimesheetApprovalDTO {
  id: string;
  period: string;
  period_sort_date: string;
  user: string;
  team_manager: string;
  time: string;
  time_off: string;
  status: ApprovalStatus;
  submitted_at?: string;
  approved_at?: string;
}

export interface ExpenseApprovalDTO {
  id: string;
  period: string;
  period_sort_date: string;
  user: string;
  team_manager: string;
  category: string;
  amount: number;
  currency: string;
  status: ApprovalStatus;
  submitted_at?: string;
  approved_at?: string;
}

export interface ApprovalSummaryDTO {
  pending_timesheets: number;
  pending_expenses: number;
  total_pending: number;
  unsubmitted_count: number;
  approved_count: number;
}
