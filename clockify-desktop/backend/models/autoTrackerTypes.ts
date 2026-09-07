/**
 * Clockify Auto-Tracker Feature - Domain Models & DTOs
 */

export type AutoTrackerIconType =
  | 'code'
  | 'design'
  | 'browser'
  | 'terminal'
  | 'document'
  | 'communication';

export interface DetectedActivityDTO {
  id: string;
  app: string;
  window_title: string;
  icon_type: AutoTrackerIconType;
  suggested_project: string;
  project_color: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  duration_seconds: number;
  is_logged: boolean;
  date: string;
}

export interface AutoTrackerStatusDTO {
  is_recording: boolean;
  active_app?: string;
  active_window?: string;
  idle_seconds: number;
  recorded_today_seconds: number;
  pending_activities_count: number;
}

export interface LogActivityPayload {
  activity_id: string;
  project_id?: string;
  project_name?: string;
  project_color?: string;
  is_billable?: boolean;
}

export interface UpdateSuggestedProjectPayload {
  activity_id: string;
  suggested_project: string;
  project_color: string;
}
