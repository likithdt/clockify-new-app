import type { DetectedActivity, AutoTrackerStatus, TimeEntry } from "../types.ts";
import {
  autoTrackerRepository,
  type IAutoTrackerRepository,
} from "../repositories/AutoTrackerRepository.ts";
import {
  timeEntryRepository,
  type ITimeEntryRepository,
} from "../repositories/TimeEntryRepository.ts";
import {
  projectRepository,
  type IProjectRepository,
} from "../repositories/ProjectRepository.ts";

export class AutoTrackerService {
  constructor(
    private repo: IAutoTrackerRepository = autoTrackerRepository,
    private timeEntryRepo: ITimeEntryRepository = timeEntryRepository,
    private projectRepo: IProjectRepository = projectRepository
  ) {}

  async getActivities(): Promise<DetectedActivity[]> {
    return this.repo.getAll();
  }

  async getStatus(): Promise<AutoTrackerStatus> {
    return this.repo.getStatus();
  }

  async toggleRecording(): Promise<boolean> {
    return this.repo.toggleRecording();
  }

  async setRecording(isRecording: boolean): Promise<boolean> {
    return this.repo.setRecording(isRecording);
  }

  async logActivity(id: string): Promise<{ activity: DetectedActivity; timeEntry: TimeEntry }> {
    const act = await this.repo.getById(id);
    if (!act) {
      throw new Error(`Activity '${id}' not found`);
    }

    // Resolve project ID if not set
    let projectId = act.suggestedProjectId;
    if (!projectId) {
      const allProjects = await this.projectRepo.getAll();
      const match = allProjects.find((p) => p.name.toLowerCase() === act.suggestedProject.toLowerCase());
      if (match) {
        projectId = match.id;
      }
    }

    // Convert start and end times to ISO timestamp for the time entry
    const now = new Date();
    const startTime = new Date(now.getTime() - act.durationSeconds * 1000).toISOString();
    const endTime = now.toISOString();

    const entry = await this.timeEntryRepo.create({
      description: `${act.app}: ${act.windowTitle}`,
      projectId,
      projectName: act.suggestedProject,
      projectColor: act.projectColor,
      isBillable: true,
      tags: ["AutoTracker", act.app],
      startTime,
      endTime,
      durationSeconds: act.durationSeconds,
    });

    const updatedActivity = await this.repo.markAsLogged(id);
    if (!updatedActivity) {
      throw new Error(`Failed to mark activity '${id}' as logged`);
    }

    return { activity: updatedActivity, timeEntry: entry };
  }

  async logAll(): Promise<{ activities: DetectedActivity[]; createdEntriesCount: number }> {
    const all = await this.repo.getAll();
    const unlogged = all.filter((a) => !a.isLogged);
    let count = 0;

    for (const act of unlogged) {
      try {
        await this.logActivity(act.id);
        count++;
      } catch (err) {
        console.error(`Failed to log activity ${act.id}`, err);
      }
    }

    const updated = await this.repo.getAll();
    return { activities: updated, createdEntriesCount: count };
  }

  async discardActivity(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async updateProject(
    id: string,
    projectName: string,
    projectColor: string,
    projectId?: string
  ): Promise<DetectedActivity | null> {
    return this.repo.updateProject(id, projectName, projectColor, projectId);
  }

  async simulateDetectedActivity(): Promise<DetectedActivity> {
    const samplePool = [
      {
        app: "VS Code",
        windowTitle: "clockify-mobile — AutoTrackerScreen.tsx",
        iconType: "code" as const,
        suggestedProject: "Project Alpha",
        projectColor: "#03a9f4",
        durationMinutes: 40,
      },
      {
        app: "Google Chrome",
        windowTitle: "Tailwind CSS Documentation — Flexbox & Grid",
        iconType: "browser" as const,
        suggestedProject: "[SAMPLE] Internal Work",
        projectColor: "#0288d1",
        durationMinutes: 25,
      },
      {
        app: "Slack",
        windowTitle: "#product-design-engineering · Standup Sync",
        iconType: "communication" as const,
        suggestedProject: "[SAMPLE] Project Phoenix",
        projectColor: "#10b981",
        durationMinutes: 20,
      },
      {
        app: "Terminal",
        windowTitle: "bash: pnpm test & git commit -m 'autotracker'",
        iconType: "terminal" as const,
        suggestedProject: "[SAMPLE] Project Orion",
        projectColor: "#f59e0b",
        durationMinutes: 15,
      },
      {
        app: "Figma",
        windowTitle: "Mobile UI Design Kit v3 — Android Material",
        iconType: "design" as const,
        suggestedProject: "Project Alpha",
        projectColor: "#9333ea",
        durationMinutes: 55,
      },
    ];

    const pick = samplePool[Math.floor(Math.random() * samplePool.length)];

    const now = new Date();
    const endMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = Math.max(0, endMinutes - pick.durationMinutes);

    const formatHM = (mins: number) => {
      const h = Math.floor(mins / 60) % 12 || 12;
      const m = mins % 60;
      const ampm = Math.floor(mins / 60) >= 12 ? "PM" : "AM";
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    const newActivity = await this.repo.addActivity({
      app: pick.app,
      windowTitle: pick.windowTitle,
      iconType: pick.iconType,
      suggestedProject: pick.suggestedProject,
      projectColor: pick.projectColor,
      startTime: formatHM(startMinutes),
      endTime: formatHM(endMinutes),
      durationMinutes: pick.durationMinutes,
      durationSeconds: pick.durationMinutes * 60,
      isLogged: false,
      date: "Today",
    });

    return newActivity;
  }

  async reset(): Promise<DetectedActivity[]> {
    return this.repo.reset();
  }
}

export const autoTrackerService = new AutoTrackerService();
