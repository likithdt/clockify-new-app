export interface TimeEntry {
  id: string;
  description: string;
  projectId?: string;
  projectName: string;
  projectColor: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  isBillable: boolean;
  tags: string[];
  startTime: string; // ISO 8601
  endTime?: string;   // ISO 8601
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimerStatus {
  isTracking: boolean;
  startTime?: string;
  description: string;
  projectId?: string;
  projectName: string;
  projectColor: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  isBillable: boolean;
  tags: string[];
  elapsedSeconds: number;
}

export interface TaskItem {
  id: string;
  name: string;
  isDone?: boolean;
  isFavorite?: boolean;
  isBillable?: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  clientName?: string;
  tasks: TaskItem[];
  isArchived: boolean;
  isFavorite?: boolean;
  isBillable?: boolean;
  isPublic?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  isArchived: boolean;
}

export interface Client {
  id: string;
  name: string;
  currency: string;
  address?: string;
  isArchived: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Regular" | "Manager";
  status: "active" | "inactive" | "invited";
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  date: string;
  isBillable: boolean;
  notes?: string;
  hasReceipt?: boolean;
}

export interface TimeOffRequest {
  id: string;
  userName: string;
  policyName: string; // e.g. "[SAMPLE] Vacation"
  startDate: string;  // e.g. "2026-09-15"
  endDate: string;    // e.g. "2026-09-17"
  dateRangeLabel: string; // "Tue, Sep 15 - Thu, Sep 17"
  durationDays: number;   // 3
  status: "approved" | "pending" | "rejected";
  note?: string;
}

export interface DayGroup {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Today", "Yesterday", "Sat, Sep 5"
  fullDateLabel: string; // "Today - Sat, Sep 5"
  totalSeconds: number;
  entries: TimeEntry[];
}

export interface TimeTrackerSummary {
  totalSeconds: number;
  todaySeconds: number;
  totalBillableSeconds: number;
  entryCount: number;
  activeTimerRunning: boolean;
}

export interface StartTimerPayload {
  description?: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  isBillable?: boolean;
  tags?: string[];
  startTime?: string;
}

export interface CreateTimeEntryPayload {
  description?: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  isBillable?: boolean;
  tags?: string[];
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
}

export interface UpdateTimeEntryPayload {
  description?: string;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  isBillable?: boolean;
  tags?: string[];
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
}

// ---------------- Settings Module Types ---------------- //

export type AppTheme = "system" | "dark" | "light";

export type AppLanguage =
  | "auto"
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ru"
  | "ja"
  | "it";

export interface ReminderSettings {
  enabled: boolean;
  workDays: number[]; // 1=Mon, 2=Tue, ..., 7=Sun
  startTime: string;  // e.g. "09:00"
  endTime: string;    // e.g. "17:00"
  intervalMinutes: number; // e.g. 60 or 120
}

export interface CalendarSettings {
  integrationEnabled: boolean;
  calendarAccessStatus: "disabled" | "enabled" | "prompt";
  showWorkingDaysOnly: boolean;
  syncedCalendars: string[];
}

export interface WorkspaceNotificationSettings {
  notificationsEnabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  timeTrackingReminders: boolean;
  timerAutoStop: boolean;
  weeklyReportReminder: boolean;
  timeOffAlerts: boolean;
}

export interface WorkspaceSettings {
  id: string;
  workspaceId: string;
  workspaceName: string;
  defaultProjectId: string | null;
  defaultProjectName: string;
  defaultProjectColor?: string | null;
  notifications: WorkspaceNotificationSettings;
}

export interface MobileAppSettings {
  theme: AppTheme;
  themeLabel: string;
  language: AppLanguage;
  languageLabel: string;
  forcedOfflineMode: boolean;
  reminders: ReminderSettings;
  calendar: CalendarSettings;
  appVersion: string;
}

export interface MobileSettingsState {
  app: MobileAppSettings;
  workspace: WorkspaceSettings;
}

// ---------------- Auto Tracker Module Types ---------------- //

export type ActivityIconType =
  | "code"
  | "design"
  | "browser"
  | "terminal"
  | "document"
  | "communication";

export interface DetectedActivity {
  id: string;
  app: string;
  windowTitle: string;
  iconType: ActivityIconType;
  suggestedProjectId?: string;
  suggestedProject: string;
  projectColor: string;
  startTime: string; // "08:30 AM"
  endTime: string;   // "10:45 AM"
  durationMinutes: number;
  durationSeconds: number;
  isLogged: boolean;
  date: string;
}

export interface AutoTrackerStatus {
  isRecording: boolean;
  engineStatus: "active" | "paused";
  activeApp: string;
  activeWindowTitle: string;
  unloggedCount: number;
  unloggedMinutes: number;
  totalCount: number;
  totalMinutes: number;
}

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

// ─── Activity Monitoring, Screenshots & GPS Location Types ────────────────────

export type ActivityStatus = "TRACKING" | "IDLE" | "OFFLINE";

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
  recorded_at: string;
}

export type ScreenshotCategory = "figma" | "code" | "browser" | "slack" | "terminal" | "other";

export interface ScreenshotItemDTO {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  timestamp: string;
  time_formatted: string;
  project: string;
  project_color: string;
  activity_percent: number;
  app_name: string;
  window_title: string;
  code_snippet?: string;
  type: ScreenshotCategory;
}

export type MemberLocationStatus =
  | "Inside Geofence"
  | "Outside Zone"
  | "On Route"
  | "Stationary"
  | "Offline";

export interface LocationBreadcrumb {
  lat: number;
  lng: number;
  time: string;
}

export interface MemberLocationDTO {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatar_color: string;
  is_current_user?: boolean;
  last_seen: string;
  status: MemberLocationStatus;
  status_color: string;
  location_name: string;
  lat: number;
  lng: number;
  speed: string;
  battery: number;
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
