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


