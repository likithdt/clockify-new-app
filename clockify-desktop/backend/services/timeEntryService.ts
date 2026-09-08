import type {
  TimeEntryDTO,
  CreateTimeEntryPayload,
  UpdateTimeEntryPayload,
  TimeEntryFilter,
  TimerStatusDTO,
  TimeEntrySummaryDTO,
} from '../models/timeEntryTypes';

const INITIAL_TIME_ENTRIES: TimeEntryDTO[] = [
  {
    id: "te-1",
    description: "Desktop UI implementation & state management",
    project_id: "proj-1",
    project_name: "Internal Work",
    project_color: "#03a9f4",
    is_billable: true,
    start_time: "2026-08-31T09:00:00.000Z",
    end_time: "2026-08-31T17:00:00.000Z",
    duration_seconds: 28800,
    user_name: "Bindhu shree",
  },
  {
    id: "te-2",
    description: "Backend architecture review and API endpoints",
    project_id: "proj-2",
    project_name: "Project Orion",
    project_color: "#f59e0b",
    client: "Client B",
    is_billable: true,
    start_time: "2026-09-01T10:00:00.000Z",
    end_time: "2026-09-01T14:30:00.000Z",
    duration_seconds: 16200,
    user_name: "Bindhu shree",
  },
];

class TimeEntryService {
  private entries: TimeEntryDTO[] = JSON.parse(JSON.stringify(INITIAL_TIME_ENTRIES));
  private activeTimer: {
    is_tracking: boolean;
    start_time?: string;
    description: string;
    project_name: string;
    project_color: string;
    is_billable: boolean;
  } = {
    is_tracking: false,
    description: "",
    project_name: "No Project",
    project_color: "#94a3b8",
    is_billable: true,
  };

  listEntries(filter?: TimeEntryFilter): TimeEntryDTO[] {
    let result = [...this.entries];

    if (filter?.project_id) {
      result = result.filter((e) => e.project_id === filter.project_id);
    }
    if (filter?.is_billable !== undefined) {
      result = result.filter((e) => e.is_billable === filter.is_billable);
    }
    if (filter?.start_date && filter?.end_date) {
      result = result.filter(
        (e) => e.start_time.slice(0, 10) >= filter.start_date! && e.start_time.slice(0, 10) <= filter.end_date!
      );
    }

    return result.sort((a, b) => b.start_time.localeCompare(a.start_time));
  }

  getEntry(id: string): TimeEntryDTO | undefined {
    return this.entries.find((e) => e.id === id);
  }

  createEntry(payload: CreateTimeEntryPayload): TimeEntryDTO {
    const newEntry: TimeEntryDTO = {
      id: `te-${Date.now()}`,
      description: payload.description || "(No details)",
      project_id: payload.project_id,
      project_name: payload.project_name || "No Project",
      project_color: payload.project_color || "#94a3b8",
      client: payload.client,
      task_id: payload.task_id,
      task_name: payload.task_name,
      is_billable: payload.is_billable ?? true,
      start_time: payload.start_time,
      end_time: payload.end_time,
      duration_seconds: payload.duration_seconds,
      location: payload.location,
      user_id: payload.user_id,
      user_name: payload.user_name || "Bindhu shree",
    };

    this.entries.unshift(newEntry);
    return newEntry;
  }

  updateEntry(id: string, payload: UpdateTimeEntryPayload): TimeEntryDTO {
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Time entry '${id}' not found`);

    const current = this.entries[idx];
    const updated: TimeEntryDTO = {
      ...current,
      description: payload.description !== undefined ? payload.description : current.description,
      project_id: payload.project_id !== undefined ? payload.project_id : current.project_id,
      project_name: payload.project_name !== undefined ? payload.project_name : current.project_name,
      project_color: payload.project_color !== undefined ? payload.project_color : current.project_color,
      client: payload.client !== undefined ? payload.client : current.client,
      task_id: payload.task_id !== undefined ? payload.task_id : current.task_id,
      task_name: payload.task_name !== undefined ? payload.task_name : current.task_name,
      is_billable: payload.is_billable !== undefined ? payload.is_billable : current.is_billable,
      start_time: payload.start_time !== undefined ? payload.start_time : current.start_time,
      end_time: payload.end_time !== undefined ? payload.end_time : current.end_time,
      duration_seconds: payload.duration_seconds !== undefined ? payload.duration_seconds : current.duration_seconds,
      location: payload.location !== undefined ? payload.location : current.location,
    };

    this.entries[idx] = updated;
    return updated;
  }

  deleteEntry(id: string): boolean {
    const prevLen = this.entries.length;
    this.entries = this.entries.filter((e) => e.id !== id);
    return this.entries.length < prevLen;
  }

  startTimer(
    description: string = "",
    projectName: string = "No Project",
    projectColor: string = "#94a3b8",
    isBillable: boolean = true
  ): TimerStatusDTO {
    this.activeTimer = {
      is_tracking: true,
      start_time: new Date().toISOString(),
      description,
      project_name: projectName,
      project_color: projectColor,
      is_billable: isBillable,
    };
    return this.getTimerStatus();
  }

  stopTimer(): TimeEntryDTO | null {
    if (!this.activeTimer.is_tracking || !this.activeTimer.start_time) {
      return null;
    }

    const startTime = new Date(this.activeTimer.start_time);
    const endTime = new Date();
    const duration = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / 1000));

    const entry = this.createEntry({
      description: this.activeTimer.description,
      project_name: this.activeTimer.project_name,
      project_color: this.activeTimer.project_color,
      is_billable: this.activeTimer.is_billable,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_seconds: duration,
    });

    this.activeTimer = {
      is_tracking: false,
      description: "",
      project_name: "No Project",
      project_color: "#94a3b8",
      is_billable: true,
    };

    return entry;
  }

  getTimerStatus(): TimerStatusDTO {
    let elapsed = 0;
    if (this.activeTimer.is_tracking && this.activeTimer.start_time) {
      elapsed = Math.floor((Date.now() - new Date(this.activeTimer.start_time).getTime()) / 1000);
    }

    return {
      is_tracking: this.activeTimer.is_tracking,
      start_time: this.activeTimer.start_time,
      description: this.activeTimer.description,
      project_name: this.activeTimer.project_name,
      project_color: this.activeTimer.project_color,
      is_billable: this.activeTimer.is_billable,
      elapsed_seconds: elapsed,
    };
  }

  getSummary(filter?: TimeEntryFilter): TimeEntrySummaryDTO {
    const list = this.listEntries(filter);
    const total_seconds = list.reduce((sum, e) => sum + e.duration_seconds, 0);
    const total_billable_seconds = list.filter((e) => e.is_billable).reduce((sum, e) => sum + e.duration_seconds, 0);

    return {
      total_entries: list.length,
      total_seconds,
      total_billable_seconds,
      active_timer_running: this.activeTimer.is_tracking,
    };
  }
}

export const timeEntryService = new TimeEntryService();
