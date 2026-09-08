export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export type PolicyUnit = 'days' | 'hours';
export type AccrualType = 'fixed_per_year' | 'monthly_accrual' | 'manual';
export type HolidayRecurrence = 'every_year' | 'once';
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface LeavePolicy {
  id: string;
  name: string;
  unit: PolicyUnit;
  accrual_per_year?: number | null;
  accrual_type: AccrualType;
  allow_carryover: boolean;
  max_balance?: number | null;
  is_active: boolean;
  assignee_ids: string[];
  requires_approval: boolean;
  allow_negative_balance: boolean;
  allow_half_day: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar_url?: string | null;
  email: string;
}

export interface TimeOffRequest {
  id: string;
  member_id: string;
  policy_id: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: RequestStatus;
  note?: string | null;
  requested_at: string;
  rejection_reason?: string | null;
}

export interface LeaveBalance {
  member_id: string;
  policy_id: string;
  accrued: number;
  used: number;
  remaining: number;
  carried_over: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  end_date?: string | null;
  country_code?: string | null;
  member_ids: string[];
  recurrence: HolidayRecurrence;
  color?: string | null;
  created_at: string;
}

export interface CreateRequestPayload {
  member_id: string;
  policy_id: string;
  start_date: string;
  end_date: string;
  duration: number;
  note?: string | null;
}

export interface CreatePolicyPayload {
  name: string;
  unit: PolicyUnit;
  accrual_per_year?: number | null;
  accrual_type: AccrualType;
  allow_carryover: boolean;
  max_balance?: number | null;
  assignee_ids: string[];
  requires_approval: boolean;
  allow_negative_balance: boolean;
  allow_half_day: boolean;
}

export interface UpdatePolicyPayload {
  name?: string;
  unit?: PolicyUnit;
  accrual_per_year?: number | null;
  accrual_type?: AccrualType;
  allow_carryover?: boolean;
  max_balance?: number | null;
  assignee_ids?: string[];
  is_active?: boolean;
  requires_approval?: boolean;
  allow_negative_balance?: boolean;
  allow_half_day?: boolean;
}

export interface CreateHolidayPayload {
  name: string;
  date: string;
  end_date?: string | null;
  country_code?: string | null;
  member_ids: string[];
  recurrence: HolidayRecurrence;
  color?: string | null;
}

export interface UpdateHolidayPayload {
  name?: string;
  date?: string;
  end_date?: string | null;
  member_ids?: string[];
  recurrence?: HolidayRecurrence;
  color?: string | null;
}

export interface ReviewRequestPayload {
  status: RequestStatus;
  rejection_reason?: string | null;
}

export interface ListRequestsFilter {
  member_id?: string | null;
  status?: RequestStatus | null;
  from_date?: string | null;
  to_date?: string | null;
}

export interface ListPoliciesFilter {
  is_active?: boolean | null;
}
