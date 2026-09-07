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
