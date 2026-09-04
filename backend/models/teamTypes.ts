export type TeamMemberRole = 'Owner' | 'Admin' | 'Project manager' | 'Team manager' | 'Member';
export type TeamMemberStatus = 'Active' | 'Inactive' | 'Invited';

export interface TeamMemberDTO {
  id: string;
  name: string;
  email: string;
  billable_rate: number | null;
  cost_rate: number | null;
  currency: string;
  role: TeamMemberRole;
  group: string | null;
  status: TeamMemberStatus;
  is_current_user?: boolean;
}

export interface AddTeamMemberPayload {
  emails: string[];
  role?: TeamMemberRole;
  group?: string | null;
  billable_rate?: number | null;
  cost_rate?: number | null;
  currency?: string;
}

export interface UpdateTeamMemberPayload {
  name?: string;
  email?: string;
  billable_rate?: number | null;
  cost_rate?: number | null;
  currency?: string;
  role?: TeamMemberRole;
  group?: string | null;
  status?: TeamMemberStatus;
}

export interface TeamFilter {
  query?: string;
  status?: 'All' | 'Active' | 'Inactive' | 'Invited';
  group?: string;
  roles?: TeamMemberRole[];
  smaller_rate?: number;
  larger_rate?: number;
}

export interface TeamSummaryDTO {
  total_members: number;
  active_members: number;
  inactive_members: number;
  invited_members: number;
}
