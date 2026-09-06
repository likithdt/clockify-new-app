import type {
  TimeEntry,
  TimerStatus,
  DayGroup,
  TimeTrackerSummary,
  StartTimerPayload,
  CreateTimeEntryPayload,
  UpdateTimeEntryPayload,
} from "../types.ts";
import type { ITimeEntryRepository } from "../repositories/TimeEntryRepository.ts";
import { timeEntryRepository } from "../repositories/TimeEntryRepository.ts";
import type { IProjectRepository } from "../repositories/ProjectRepository.ts";
import { projectRepository } from "../repositories/ProjectRepository.ts";

export class TimeTrackerService {
  private entryRepo: ITimeEntryRepository;
  private projectRepo: IProjectRepository;

  private activeTimer: {
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
  } = {
    isTracking: false,
    description: "",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: [],
  };

  constructor(
    entryRepo: ITimeEntryRepository = timeEntryRepository,
    projRepo: IProjectRepository = projectRepository
  ) {
    this.entryRepo = entryRepo;
    this.projectRepo = projRepo;
  }

  // --- TIMER LOGIC ---

  getTimerStatus(): TimerStatus {
    let elapsed = 0;
    if (this.activeTimer.isTracking && this.activeTimer.startTime) {
      const startMs = new Date(this.activeTimer.startTime).getTime();
      elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
    }

    return {
      isTracking: this.activeTimer.isTracking,
      startTime: this.activeTimer.startTime,
      description: this.activeTimer.description,
      projectId: this.activeTimer.projectId,
      projectName: this.activeTimer.projectName,
      projectColor: this.activeTimer.projectColor,
      clientName: this.activeTimer.clientName,
      taskId: this.activeTimer.taskId,
      taskName: this.activeTimer.taskName,
      isBillable: this.activeTimer.isBillable,
      tags: [...this.activeTimer.tags],
      elapsedSeconds: elapsed,
    };
  }

  async startTimer(payload: StartTimerPayload = {}): Promise<TimerStatus> {
    // If a timer is already running, auto-stop and save it first
    if (this.activeTimer.isTracking && this.activeTimer.startTime) {
      await this.stopTimer();
    }

    let projectName = payload.projectName || "No project";
    let projectColor = payload.projectColor || "#94a3b8";
    let clientName = payload.clientName;

    if (payload.projectId) {
      const proj = await this.projectRepo.getById(payload.projectId);
      if (proj) {
        projectName = proj.name;
        projectColor = proj.color;
        clientName = proj.clientName;
      }
    }

    this.activeTimer = {
      isTracking: true,
      startTime: payload.startTime || new Date().toISOString(),
      description: (payload.description || "").trim(),
      projectId: payload.projectId,
      projectName,
      projectColor,
      clientName,
      taskId: payload.taskId,
      taskName: payload.taskName,
      isBillable: payload.isBillable ?? true,
      tags: payload.tags ? [...payload.tags] : [],
    };

    return this.getTimerStatus();
  }

  async stopTimer(): Promise<TimeEntry | null> {
    if (!this.activeTimer.isTracking || !this.activeTimer.startTime) {
      return null;
    }

    const startTime = this.activeTimer.startTime;
    const endTime = new Date().toISOString();
    const duration = Math.max(
      1,
      Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
    );

    const savedEntry = await this.entryRepo.create({
      description: this.activeTimer.description || "No description",
      projectId: this.activeTimer.projectId,
      projectName: this.activeTimer.projectName,
      projectColor: this.activeTimer.projectColor,
      clientName: this.activeTimer.clientName,
      taskId: this.activeTimer.taskId,
      taskName: this.activeTimer.taskName,
      isBillable: this.activeTimer.isBillable,
      tags: [...this.activeTimer.tags],
      startTime,
      endTime,
      durationSeconds: duration,
    });

    // Reset active timer
    this.activeTimer = {
      isTracking: false,
      description: "",
      projectName: "No project",
      projectColor: "#94a3b8",
      isBillable: true,
      tags: [],
    };

    return savedEntry;
  }

  discardTimer(): TimerStatus {
    this.activeTimer = {
      isTracking: false,
      description: "",
      projectName: "No project",
      projectColor: "#94a3b8",
      isBillable: true,
      tags: [],
    };
    return this.getTimerStatus();
  }

  // --- TIME ENTRIES LOGIC ---

  async listEntries(): Promise<TimeEntry[]> {
    return this.entryRepo.getAll();
  }

  async listGroupedEntries(): Promise<DayGroup[]> {
    const entries = await this.entryRepo.getAll();
    const groupsMap = new Map<string, TimeEntry[]>();

    for (const entry of entries) {
      const dateKey = entry.startTime.slice(0, 10); // YYYY-MM-DD
      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, []);
      }
      groupsMap.get(dateKey)!.push(entry);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    const groups: DayGroup[] = [];

    // Sort dates descending
    const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));

    for (const dateStr of sortedDates) {
      const dayEntries = groupsMap.get(dateStr)!;
      const totalSeconds = dayEntries.reduce((sum, e) => sum + e.durationSeconds, 0);

      const d = new Date(dateStr + "T12:00:00");
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const dayNum = d.getDate();
      const standardDateStr = `${weekday}, ${month} ${dayNum}`;

      let dayLabel = standardDateStr;
      let fullDateLabel = standardDateStr;

      if (dateStr === todayStr) {
        dayLabel = "Today";
        fullDateLabel = `Today - ${standardDateStr}`;
      } else if (dateStr === yesterdayStr) {
        dayLabel = "Yesterday";
        fullDateLabel = `Yesterday - ${standardDateStr}`;
      }

      groups.push({
        date: dateStr,
        dayLabel,
        fullDateLabel,
        totalSeconds,
        entries: dayEntries,
      });
    }

    return groups;
  }

  async getEntryById(id: string): Promise<TimeEntry | null> {
    return this.entryRepo.getById(id);
  }

  async createEntry(payload: CreateTimeEntryPayload): Promise<TimeEntry> {
    let startTime = payload.startTime;
    let endTime = payload.endTime;
    let duration = payload.durationSeconds;

    if (!startTime) {
      startTime = new Date().toISOString();
    }

    if (duration !== undefined && duration > 0 && !endTime) {
      endTime = new Date(new Date(startTime).getTime() + duration * 1000).toISOString();
    } else if (endTime && duration === undefined) {
      duration = Math.max(
        1,
        Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
      );
    } else if (!duration && !endTime) {
      duration = 60; // default 1 min
      endTime = new Date(new Date(startTime).getTime() + 60000).toISOString();
    }

    let projectName = payload.projectName || "No project";
    let projectColor = payload.projectColor || "#94a3b8";
    let clientName = payload.clientName;

    if (payload.projectId) {
      const proj = await this.projectRepo.getById(payload.projectId);
      if (proj) {
        projectName = proj.name;
        projectColor = proj.color;
        clientName = proj.clientName;
      }
    }

    return this.entryRepo.create({
      description: (payload.description || "").trim() || "No description",
      projectId: payload.projectId,
      projectName,
      projectColor,
      clientName,
      taskId: payload.taskId,
      taskName: payload.taskName,
      isBillable: payload.isBillable ?? true,
      tags: payload.tags ? [...payload.tags] : [],
      startTime,
      endTime,
      durationSeconds: duration || 0,
    });
  }

  async updateEntry(id: string, payload: UpdateTimeEntryPayload): Promise<TimeEntry | null> {
    const existing = await this.entryRepo.getById(id);
    if (!existing) return null;

    let startTime = payload.startTime !== undefined ? payload.startTime : existing.startTime;
    let endTime = payload.endTime !== undefined ? payload.endTime : existing.endTime;
    let durationSeconds =
      payload.durationSeconds !== undefined ? payload.durationSeconds : existing.durationSeconds;

    if (payload.startTime || payload.endTime) {
      if (startTime && endTime) {
        durationSeconds = Math.max(
          1,
          Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
        );
      }
    } else if (payload.durationSeconds && startTime) {
      endTime = new Date(new Date(startTime).getTime() + durationSeconds * 1000).toISOString();
    }

    let projectName = payload.projectName !== undefined ? payload.projectName : existing.projectName;
    let projectColor = payload.projectColor !== undefined ? payload.projectColor : existing.projectColor;
    let clientName = payload.clientName !== undefined ? payload.clientName : existing.clientName;

    if (payload.projectId && payload.projectId !== existing.projectId) {
      const proj = await this.projectRepo.getById(payload.projectId);
      if (proj) {
        projectName = proj.name;
        projectColor = proj.color;
        clientName = proj.clientName;
      }
    }

    return this.entryRepo.update(id, {
      description: payload.description !== undefined ? payload.description.trim() || "(no description)" : existing.description,
      projectId: payload.projectId !== undefined ? payload.projectId : existing.projectId,
      projectName,
      projectColor,
      clientName,
      taskId: payload.taskId !== undefined ? payload.taskId : existing.taskId,
      taskName: payload.taskName !== undefined ? payload.taskName : existing.taskName,
      isBillable: payload.isBillable !== undefined ? payload.isBillable : existing.isBillable,
      tags: payload.tags !== undefined ? [...payload.tags] : existing.tags,
      startTime,
      endTime,
      durationSeconds,
    });
  }

  async deleteEntry(id: string): Promise<boolean> {
    return this.entryRepo.delete(id);
  }

  async getSummary(): Promise<TimeTrackerSummary> {
    const entries = await this.entryRepo.getAll();
    const todayStr = new Date().toISOString().slice(0, 10);

    const totalSeconds = entries.reduce((acc, e) => acc + e.durationSeconds, 0);
    const todaySeconds = entries
      .filter((e) => e.startTime.slice(0, 10) === todayStr)
      .reduce((acc, e) => acc + e.durationSeconds, 0);
    const totalBillableSeconds = entries
      .filter((e) => e.isBillable)
      .reduce((acc, e) => acc + e.durationSeconds, 0);

    return {
      totalSeconds,
      todaySeconds,
      totalBillableSeconds,
      entryCount: entries.length,
      activeTimerRunning: this.activeTimer.isTracking,
    };
  }

  async seedData(): Promise<TimeEntry[]> {
    return this.entryRepo.seedSampleData();
  }

  async clearData(): Promise<void> {
    await this.entryRepo.clear();
    this.discardTimer();
  }
}

export const timeTrackerService = new TimeTrackerService();
