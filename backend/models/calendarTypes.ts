/**
 * Clockify Calendar Task - Domain Entities and DTO Types
 */

export type CalendarEntryType = 'entry' | 'planned';
export type CalendarTaskStatus = 'completed' | 'in_progress' | 'planned';

export interface CalendarTask {
  id: string;
  title: string;
  project_id?: string | null;
  project_name: string;
  project_color: string;
  client_name?: string | null;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm or HH:mm:ss
  end_time: string; // HH:mm or HH:mm:ss
  duration_minutes: number; // calculated duration in minutes
  is_billable: boolean;
  tags: string[];
  entry_type: CalendarEntryType; // 'entry' for tracked block, 'planned' for planned task
  member_id: string; // Foreign key to TeamMember
  status: CalendarTaskStatus;
  created_at: string; // ISO timestamp
  updated_at?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  client_name?: string | null;
  color: string;
  is_billable: boolean;
}

export interface TagItem {
  id: string;
  name: string;
}

export interface CalendarSettings {
  week_start: 'monday' | 'sunday';
  time_format: '24h' | '12h';
  default_duration: number; // in minutes (e.g. 30, 60)
  show_weekends: boolean;
  working_hours_start: string; // "09:00"
  working_hours_end: string; // "18:00"
}

export interface CalendarFilter {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  member_id?: string;
  project_id?: string;
  entry_type?: CalendarEntryType;
  is_billable?: boolean;
}

export interface CreateCalendarTaskPayload {
  title: string;
  project_id?: string | null;
  project_name?: string;
  project_color?: string;
  client_name?: string | null;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  duration_minutes?: number;
  is_billable?: boolean;
  tags?: string[];
  entry_type?: CalendarEntryType;
  member_id: string;
  status?: CalendarTaskStatus;
}

export interface UpdateCalendarTaskPayload {
  title?: string;
  project_id?: string | null;
  project_name?: string;
  project_color?: string;
  client_name?: string | null;
  date?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  is_billable?: boolean;
  tags?: string[];
  entry_type?: CalendarEntryType;
  member_id?: string;
  status?: CalendarTaskStatus;
}

export interface MoveCalendarTaskPayload {
  date: string;
  start_time: string;
  end_time: string;
}

export interface CalendarDaySummary {
  date: string;
  total_tracked_minutes: number;
  total_planned_minutes: number;
  task_count: number;
}
