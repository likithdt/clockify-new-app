export interface LocationDataDTO {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface TimeEntryDTO {
  id: string;
  description: string;
  project_id?: string;
  project_name: string;
  project_color: string;
  client?: string;
  task_id?: string;
  task_name?: string;
  is_billable: boolean;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  location?: LocationDataDTO;
  user_id?: string;
  user_name?: string;
}

export interface CreateTimeEntryPayload {
  description: string;
  project_id?: string;
  project_name?: string;
  project_color?: string;
  client?: string;
  task_id?: string;
  task_name?: string;
  is_billable?: boolean;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  location?: LocationDataDTO;
  user_id?: string;
  user_name?: string;
}

export interface UpdateTimeEntryPayload {
  description?: string;
  project_id?: string;
  project_name?: string;
  project_color?: string;
  client?: string;
  task_id?: string;
  task_name?: string;
  is_billable?: boolean;
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  location?: LocationDataDTO;
}

export interface TimeEntryFilter {
  start_date?: string;
  end_date?: string;
  project_id?: string;
  user_id?: string;
  is_billable?: boolean;
}

export interface TimerStatusDTO {
  is_tracking: boolean;
  start_time?: string;
  description: string;
  project_name: string;
  project_color: string;
  is_billable: boolean;
  elapsed_seconds: number;
}

export interface TimeEntrySummaryDTO {
  total_entries: number;
  total_seconds: number;
  total_billable_seconds: number;
  active_timer_running: boolean;
}
