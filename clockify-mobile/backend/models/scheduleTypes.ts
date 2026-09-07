export interface ScheduleAssignmentDTO {
  id: string;
  project_id: string;
  project_name: string;
  project_color: string;
  client: string;
  member_id: string;
  member_name: string;
  member_initials: string;
  member_avatar_color: string;
  start_date: string;
  end_date: string;
  hours_per_day: number;
  total_hours: number;
  note?: string;
  version_label?: string;
  is_hatched?: boolean;
  is_milestone_active?: boolean;
}

export interface CreateScheduleAssignmentPayload {
  project_id: string;
  project_name: string;
  project_color: string;
  client: string;
  member_id: string;
  member_name: string;
  member_initials: string;
  member_avatar_color: string;
  start_date: string;
  end_date: string;
  hours_per_day: number;
  total_hours: number;
  note?: string;
  version_label?: string;
  is_hatched?: boolean;
  is_milestone_active?: boolean;
}

export interface UpdateScheduleAssignmentPayload {
  project_id?: string;
  project_name?: string;
  project_color?: string;
  client?: string;
  member_id?: string;
  member_name?: string;
  member_initials?: string;
  member_avatar_color?: string;
  start_date?: string;
  end_date?: string;
  hours_per_day?: number;
  total_hours?: number;
  note?: string;
  version_label?: string;
  is_hatched?: boolean;
  is_milestone_active?: boolean;
}

export interface ScheduleFilter {
  start_date?: string;
  end_date?: string;
  project_id?: string;
  member_id?: string;
  client?: string;
}

export interface ScheduleSummaryDTO {
  total_assignments: number;
  total_scheduled_hours: number;
  total_members_scheduled: number;
  total_projects_scheduled: number;
  is_published: boolean;
}
