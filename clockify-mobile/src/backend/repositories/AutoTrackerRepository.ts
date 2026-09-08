import type { DetectedActivity, AutoTrackerStatus } from "../types.ts";

export const INITIAL_AUTO_ACTIVITIES: DetectedActivity[] = [
  {
    id: "act-1",
    app: "VS Code",
    windowTitle: "timeflow-design-system — App.tsx",
    iconType: "code",
    suggestedProject: "Project Alpha",
    projectColor: "#03a9f4",
    startTime: "08:30 AM",
    endTime: "10:45 AM",
    durationMinutes: 135,
    durationSeconds: 135 * 60,
    isLogged: false,
    date: "Today",
  },
  {
    id: "act-2",
    app: "Figma",
    windowTitle: "Clockify Light Design Rebuild",
    iconType: "design",
    suggestedProject: "Project Alpha",
    projectColor: "#9333ea",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    durationMinutes: 90,
    durationSeconds: 90 * 60,
    isLogged: false,
    date: "Today",
  },
  {
    id: "act-3",
    app: "Google Chrome",
    windowTitle: "Clockify API Documentation & Reference",
    iconType: "browser",
    suggestedProject: "[SAMPLE] Internal Work",
    projectColor: "#0288d1",
    startTime: "01:15 PM",
    endTime: "01:45 PM",
    durationMinutes: 30,
    durationSeconds: 30 * 60,
    isLogged: false,
    date: "Today",
  },
  {
    id: "act-4",
    app: "Terminal",
    windowTitle: "PowerShell: cargo tauri build & deploy",
    iconType: "terminal",
    suggestedProject: "[SAMPLE] Project Orion",
    projectColor: "#f59e0b",
    startTime: "02:00 PM",
    endTime: "02:45 PM",
    durationMinutes: 45,
    durationSeconds: 45 * 60,
    isLogged: false,
    date: "Today",
  },
];

const STORAGE_KEY = "clockify_mobile_autotracker_activities";
const RECORDING_KEY = "clockify_mobile_autotracker_recording";

export interface IAutoTrackerRepository {
  getAll(): Promise<DetectedActivity[]>;
  getById(id: string): Promise<DetectedActivity | null>;
  getStatus(): Promise<AutoTrackerStatus>;
  toggleRecording(): Promise<boolean>;
  setRecording(isRecording: boolean): Promise<boolean>;
  markAsLogged(id: string): Promise<DetectedActivity | null>;
  markAllAsLogged(): Promise<DetectedActivity[]>;
  delete(id: string): Promise<boolean>;
  updateProject(id: string, projectName: string, projectColor: string, projectId?: string): Promise<DetectedActivity | null>;
  addActivity(activity: Omit<DetectedActivity, "id">): Promise<DetectedActivity>;
  reset(): Promise<DetectedActivity[]>;
}

export class AutoTrackerRepository implements IAutoTrackerRepository {
  private activities: DetectedActivity[];
  private isRecording: boolean = true;

  constructor() {
    this.activities = this.loadFromStorage();
    if (typeof localStorage !== "undefined") {
      const rec = localStorage.getItem(RECORDING_KEY);
      if (rec !== null) {
        this.isRecording = rec === "true";
      }
    }
  }

  private loadFromStorage(): DetectedActivity[] {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Failed to load autotracker from localStorage, using defaults", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_AUTO_ACTIVITIES));
  }

  private saveToStorage(): void {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activities));
        localStorage.setItem(RECORDING_KEY, String(this.isRecording));
      } catch (e) {
        console.warn("Failed to save autotracker to localStorage", e);
      }
    }
  }

  async getAll(): Promise<DetectedActivity[]> {
    return [...this.activities];
  }

  async getById(id: string): Promise<DetectedActivity | null> {
    const act = this.activities.find((a) => a.id === id);
    return act ? { ...act } : null;
  }

  async getStatus(): Promise<AutoTrackerStatus> {
    const unlogged = this.activities.filter((a) => !a.isLogged);
    const unloggedMinutes = unlogged.reduce((sum, a) => sum + a.durationMinutes, 0);
    const totalMinutes = this.activities.reduce((sum, a) => sum + a.durationMinutes, 0);

    const activeApp = this.activities.length > 0 ? this.activities[0].app : "Clockify";
    const activeWindowTitle = this.activities.length > 0 ? this.activities[0].windowTitle : "Mobile Workspace";

    return {
      isRecording: this.isRecording,
      engineStatus: this.isRecording ? "active" : "paused",
      activeApp,
      activeWindowTitle,
      unloggedCount: unlogged.length,
      unloggedMinutes,
      totalCount: this.activities.length,
      totalMinutes,
    };
  }

  async toggleRecording(): Promise<boolean> {
    this.isRecording = !this.isRecording;
    this.saveToStorage();
    return this.isRecording;
  }

  async setRecording(isRecording: boolean): Promise<boolean> {
    this.isRecording = isRecording;
    this.saveToStorage();
    return this.isRecording;
  }

  async markAsLogged(id: string): Promise<DetectedActivity | null> {
    const act = this.activities.find((a) => a.id === id);
    if (!act) return null;
    act.isLogged = true;
    this.saveToStorage();
    return { ...act };
  }

  async markAllAsLogged(): Promise<DetectedActivity[]> {
    for (const act of this.activities) {
      act.isLogged = true;
    }
    this.saveToStorage();
    return [...this.activities];
  }

  async delete(id: string): Promise<boolean> {
    const prev = this.activities.length;
    this.activities = this.activities.filter((a) => a.id !== id);
    this.saveToStorage();
    return this.activities.length < prev;
  }

  async updateProject(
    id: string,
    projectName: string,
    projectColor: string,
    projectId?: string
  ): Promise<DetectedActivity | null> {
    const act = this.activities.find((a) => a.id === id);
    if (!act) return null;
    act.suggestedProject = projectName;
    act.projectColor = projectColor;
    if (projectId !== undefined) act.suggestedProjectId = projectId;
    this.saveToStorage();
    return { ...act };
  }

  async addActivity(activity: Omit<DetectedActivity, "id">): Promise<DetectedActivity> {
    const newAct: DetectedActivity = {
      id: `act-${Date.now()}`,
      ...activity,
    };
    this.activities.unshift(newAct);
    this.saveToStorage();
    return { ...newAct };
  }

  async reset(): Promise<DetectedActivity[]> {
    this.activities = JSON.parse(JSON.stringify(INITIAL_AUTO_ACTIVITIES));
    this.isRecording = true;
    this.saveToStorage();
    return [...this.activities];
  }
}

export const autoTrackerRepository = new AutoTrackerRepository();
