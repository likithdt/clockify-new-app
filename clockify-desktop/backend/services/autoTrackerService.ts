import type {
  DetectedActivityDTO,
  AutoTrackerStatusDTO,
  LogActivityPayload,
  UpdateSuggestedProjectPayload,
} from '../models/autoTrackerTypes';
import { timeEntryService } from './timeEntryService';

const INITIAL_ACTIVITIES: DetectedActivityDTO[] = [
  {
    id: "act-1",
    app: "VS Code",
    window_title: "timeflow-design-system — App.tsx",
    icon_type: "code",
    suggested_project: "Project Alpha",
    project_color: "#03a9f4",
    start_time: "08:30 AM",
    end_time: "10:45 AM",
    duration_minutes: 135,
    duration_seconds: 135 * 60,
    is_logged: false,
    date: "Today",
  },
  {
    id: "act-2",
    app: "Figma",
    window_title: "Clockify Light Design Rebuild",
    icon_type: "design",
    suggested_project: "Project Alpha",
    project_color: "#9333ea",
    start_time: "11:00 AM",
    end_time: "12:30 PM",
    duration_minutes: 90,
    duration_seconds: 90 * 60,
    is_logged: false,
    date: "Today",
  },
  {
    id: "act-3",
    app: "Google Chrome",
    window_title: "Clockify API Documentation & Reference",
    icon_type: "browser",
    suggested_project: "[SAMPLE] Internal Work",
    project_color: "#0288d1",
    start_time: "01:15 PM",
    end_time: "01:45 PM",
    duration_minutes: 30,
    duration_seconds: 30 * 60,
    is_logged: false,
    date: "Today",
  },
  {
    id: "act-4",
    app: "Terminal",
    window_title: "PowerShell: cargo tauri build & deploy",
    icon_type: "terminal",
    suggested_project: "[SAMPLE] Project Orion",
    project_color: "#f59e0b",
    start_time: "02:00 PM",
    end_time: "02:45 PM",
    duration_minutes: 45,
    duration_seconds: 45 * 60,
    is_logged: false,
    date: "Today",
  },
];

class AutoTrackerService {
  private activities: DetectedActivityDTO[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));
  private isRecording: boolean = true;

  listActivities(): DetectedActivityDTO[] {
    return [...this.activities];
  }

  toggleRecording(): boolean {
    this.isRecording = !this.isRecording;
    return this.isRecording;
  }

  getStatus(): AutoTrackerStatusDTO {
    const recorded_today_seconds = this.activities.reduce((sum, a) => sum + a.duration_seconds, 0);
    const pending_activities_count = this.activities.filter((a) => !a.is_logged).length;

    return {
      is_recording: this.isRecording,
      active_app: "VS Code",
      active_window: "Clockify Desktop - Project Development",
      idle_seconds: 0,
      recorded_today_seconds,
      pending_activities_count,
    };
  }

  logActivity(payload: LogActivityPayload): DetectedActivityDTO {
    const act = this.activities.find((a) => a.id === payload.activity_id);
    if (!act) throw new Error(`Activity '${payload.activity_id}' not found`);

    act.is_logged = true;

    // Convert into permanent Clockify Time Entry
    timeEntryService.createEntry({
      description: act.window_title,
      project_name: payload.project_name || act.suggested_project,
      project_color: payload.project_color || act.project_color,
      is_billable: payload.is_billable ?? true,
      start_time: new Date().toISOString(),
      duration_seconds: act.duration_seconds,
    });

    return act;
  }

  logAllActivities(): DetectedActivityDTO[] {
    for (const act of this.activities) {
      if (!act.is_logged) {
        this.logActivity({ activity_id: act.id });
      }
    }
    return [...this.activities];
  }

  discardActivity(id: string): boolean {
    const prevLen = this.activities.length;
    this.activities = this.activities.filter((a) => a.id !== id);
    return this.activities.length < prevLen;
  }

  updateSuggestedProject(payload: UpdateSuggestedProjectPayload): DetectedActivityDTO {
    const act = this.activities.find((a) => a.id === payload.activity_id);
    if (!act) throw new Error(`Activity '${payload.activity_id}' not found`);

    act.suggested_project = payload.suggested_project;
    act.project_color = payload.project_color;
    return act;
  }
}

export const autoTrackerService = new AutoTrackerService();
