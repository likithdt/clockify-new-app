/**
 * Clockify Location & Activity Monitoring - Domain Entities and DTO Types
 */

export type ActivityStatus = 'TRACKING' | 'IDLE' | 'OFFLINE';

export interface ActivityRecord {
  id: string;
  member_id: string;
  member_name: string;
  avatar: string;
  avatar_color: string;
  task: string;
  project: string;
  project_color: string;
  activity_percent: number;
  pulse_text: string;
  active_window: string;
  score: string;
  score_color: string;
  status: ActivityStatus;
  status_color: string;
  recorded_at: string; // ISO timestamp
}

export type ScreenshotCategory = 'figma' | 'code' | 'browser' | 'slack' | 'terminal' | 'other';

export interface ScreenshotItemDTO {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  timestamp: string; // ISO timestamp
  time_formatted: string; // "10:40 AM"
  project: string;
  project_color: string;
  activity_percent: number;
  app_name: string;
  window_title: string;
  code_snippet?: string;
  type: ScreenshotCategory;
}

export type MemberLocationStatus =
  | 'Inside Geofence'
  | 'Outside Zone'
  | 'On Route'
  | 'Stationary'
  | 'Offline';

export interface LocationBreadcrumb {
  lat: number;
  lng: number;
  time: string; // "09:00 AM"
}

export interface MemberLocationDTO {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatar_color: string;
  is_current_user?: boolean;
  last_seen: string; // "Just now" or "-" or "10:42 AM"
  status: MemberLocationStatus;
  status_color: string;
  location_name: string;
  lat: number;
  lng: number;
  speed: string; // "0 km/h"
  battery: number; // percentage 0-100
  breadcrumbs: LocationBreadcrumb[];
}

export interface GeofenceZoneDTO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meters: number;
  color: string;
}

export interface ActivitySettingsDTO {
  is_monitoring_active: boolean;
  is_screenshots_active: boolean;
  is_gps_active: boolean;
  blur_privacy: boolean;
  screenshot_frequency_minutes: number;
}

// Request & Filter Payloads

export interface ActivityFilter {
  member_id?: string;
  project?: string;
  status?: ActivityStatus;
  min_activity?: number;
}

export interface CreateScreenshotPayload {
  member_id: string;
  member_name: string;
  member_avatar?: string;
  time_formatted?: string;
  project: string;
  project_color?: string;
  activity_percent: number;
  app_name: string;
  window_title: string;
  code_snippet?: string;
  type?: ScreenshotCategory;
}

export interface UpdateMemberLocationPayload {
  lat: number;
  lng: number;
  location_name?: string;
  speed?: string;
  battery?: number;
  status?: MemberLocationStatus;
  status_color?: string;
}

export interface CreateGeofencePayload {
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meters: number;
  color?: string;
}

export interface ActivitySummaryDTO {
  total_members_monitored: number;
  active_tracking_count: number;
  idle_count: number;
  average_activity_percent: number;
  total_screenshots_captured: number;
  geofence_compliant_percent: number;
}
