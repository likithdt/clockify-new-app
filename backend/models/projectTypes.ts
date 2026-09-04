export type ProjectAccess = 'Public' | 'Private';

export interface ProjectDTO {
  id: string;
  name: string;
  color: string;
  client: string | null;
  tracked_hours: number;
  budget_hours?: number;
  budget_amount?: number;
  is_recurring?: boolean;
  amount: number;
  currency: string;
  progress_percent?: number;
  is_budget_exceeded?: boolean;
  access: ProjectAccess;
  is_favorite: boolean;
  is_archived: boolean;
  is_billable: boolean;
  created_at: string;
}

export interface CreateProjectPayload {
  name: string;
  color: string;
  client?: string | null;
  access?: ProjectAccess;
  is_billable?: boolean;
  budget_hours?: number;
  budget_amount?: number;
  currency?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  color?: string;
  client?: string | null;
  access?: ProjectAccess;
  is_billable?: boolean;
  is_favorite?: boolean;
  is_archived?: boolean;
  budget_hours?: number;
  budget_amount?: number;
  tracked_hours?: number;
  amount?: number;
  currency?: string;
}

export interface ProjectFilter {
  query?: string;
  client?: string;
  status?: 'Active' | 'Archived' | 'All';
  access?: 'All' | 'Public' | 'Private';
  billing?: 'All' | 'Billable' | 'Non-billable';
  is_favorite?: boolean;
}

export interface ProjectSummaryDTO {
  total_projects: number;
  active_projects: number;
  archived_projects: number;
  total_tracked_hours: number;
  total_billable_amount: number;
}
