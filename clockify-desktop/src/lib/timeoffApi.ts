import { invoke } from '@tauri-apps/api/core';
import type {
  TimeOffRequest,
  LeavePolicy,
  LeaveBalance,
  Holiday,
  TeamMember,
  CreateRequestPayload,
  ReviewRequestPayload,
  CreatePolicyPayload,
  UpdatePolicyPayload,
  CreateHolidayPayload,
  UpdateHolidayPayload,
  ListRequestsFilter,
  ListPoliciesFilter,
} from '@/types/timeoff';

export const timeoffApi = {
  // Requests
  listRequests: (filter?: ListRequestsFilter): Promise<TimeOffRequest[]> =>
    invoke('list_timeoff_requests', { filter }),

  getRequest: (id: string): Promise<TimeOffRequest> =>
    invoke('get_timeoff_request', { id }),

  createRequest: (payload: CreateRequestPayload): Promise<TimeOffRequest> =>
    invoke('create_timeoff_request', { payload }),

  reviewRequest: (id: string, payload: ReviewRequestPayload): Promise<TimeOffRequest> =>
    invoke('review_timeoff_request', { id, payload }),

  withdrawRequest: (id: string): Promise<TimeOffRequest> =>
    invoke('withdraw_timeoff_request', { id }),

  deleteRequest: (id: string): Promise<void> =>
    invoke('delete_timeoff_request', { id }),

  // Timeline
  getTimeline: (
    fromDate: string,
    toDate: string,
    memberId?: string
  ): Promise<TimeOffRequest[]> =>
    invoke('get_timeline', {
      fromDate,
      toDate,
      memberId: memberId || null,
    }),

  // Balances
  listBalances: (
    policyId?: string,
    memberId?: string
  ): Promise<LeaveBalance[]> =>
    invoke('list_leave_balances', {
      policyId: policyId || null,
      memberId: memberId || null,
    }),

  setBalance: (
    memberId: string,
    policyId: string,
    accrued: number,
    carriedOver: number
  ): Promise<LeaveBalance> =>
    invoke('set_leave_balance', {
      memberId,
      policyId,
      accrued,
      carriedOver,
    }),

  // Policies
  listPolicies: (filter?: ListPoliciesFilter): Promise<LeavePolicy[]> =>
    invoke('list_leave_policies', { filter }),

  getPolicy: (id: string): Promise<LeavePolicy> =>
    invoke('get_leave_policy', { id }),

  createPolicy: (payload: CreatePolicyPayload): Promise<LeavePolicy> =>
    invoke('create_leave_policy', { payload }),

  updatePolicy: (id: string, payload: UpdatePolicyPayload): Promise<LeavePolicy> =>
    invoke('update_leave_policy', { id, payload }),

  deactivatePolicy: (id: string): Promise<LeavePolicy> =>
    invoke('deactivate_leave_policy', { id }),

  deletePolicy: (id: string): Promise<void> =>
    invoke('delete_leave_policy', { id }),

  assignMembers: (policyId: string, memberIds: string[]): Promise<LeavePolicy> =>
    invoke('assign_members_to_policy', { policyId, memberIds }),

  unassignMember: (policyId: string, memberId: string): Promise<LeavePolicy> =>
    invoke('unassign_member_from_policy', { policyId, memberId }),

  // Holidays
  listHolidays: (year?: number): Promise<Holiday[]> =>
    invoke('list_holidays', { year: year || null }),

  createHoliday: (payload: CreateHolidayPayload): Promise<Holiday> =>
    invoke('create_holiday', { payload }),

  updateHoliday: (id: string, payload: UpdateHolidayPayload): Promise<Holiday> =>
    invoke('update_holiday', { id, payload }),

  deleteHoliday: (id: string): Promise<void> =>
    invoke('delete_holiday', { id }),

  importPublicHolidays: (countryCode: string, year: number): Promise<Holiday[]> =>
    invoke('import_public_holidays', { countryCode, year }),

  // Team Members
  listTeamMembers: (): Promise<TeamMember[]> =>
    invoke('list_team_members'),

  addTeamMember: (
    name: string,
    email: string,
    avatarUrl?: string
  ): Promise<TeamMember> =>
    invoke('add_team_member', {
      name,
      email,
      avatarUrl: avatarUrl || null,
    }),
};
