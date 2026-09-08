import type {
  ScheduleAssignmentDTO,
  CreateScheduleAssignmentPayload,
  UpdateScheduleAssignmentPayload,
  ScheduleFilter,
  ScheduleSummaryDTO,
} from "../types.ts";

export interface IScheduleRepository {
  getAll(filter?: ScheduleFilter): Promise<ScheduleAssignmentDTO[]>;
  getById(id: string): Promise<ScheduleAssignmentDTO | null>;
  create(payload: CreateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO>;
  update(id: string, payload: UpdateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO | null>;
  delete(id: string): Promise<boolean>;
  togglePublish(): Promise<boolean>;
  getPublishStatus(): Promise<boolean>;
  removeSampleData(): Promise<void>;
  restoreSampleData(): Promise<ScheduleAssignmentDTO[]>;
  getSummary(): Promise<ScheduleSummaryDTO>;
}

export const INITIAL_SCHEDULE_ASSIGNMENTS: ScheduleAssignmentDTO[] = [
  {
    id: "assign-alpha-1",
    project_id: "proj-alpha",
    project_name: "[SAMPLE] Project Alpha",
    project_color: "#F59E0B",
    client: "[SAMPLE] Client B",
    member_id: "tm-bindhu",
    member_name: "Bindhu Shree",
    member_initials: "BS",
    member_avatar_color: "#00897B",
    start_date: "2026-08-31",
    end_date: "2026-09-02",
    hours_per_day: 8,
    total_hours: 16,
    note: "Frontend Architecture & UI Setup",
  },
  {
    id: "assign-alpha-2",
    project_id: "proj-alpha",
    project_name: "[SAMPLE] Project Alpha",
    project_color: "#F59E0B",
    client: "[SAMPLE] Client B",
    member_id: "tm-likith",
    member_name: "Likith D T",
    member_initials: "LD",
    member_avatar_color: "#0288D1",
    start_date: "2026-09-03",
    end_date: "2026-09-03",
    hours_per_day: 8,
    total_hours: 8,
    note: "API Integration sprint",
  },
  {
    id: "assign-beta-1",
    project_id: "proj-beta",
    project_name: "[SAMPLE] Project Beta",
    project_color: "#EF4444",
    client: "[SAMPLE] Client A",
    member_id: "tm-likith",
    member_name: "Likith D T",
    member_initials: "LD",
    member_avatar_color: "#0288D1",
    start_date: "2026-08-31",
    end_date: "2026-09-08",
    hours_per_day: 4,
    total_hours: 28,
    note: "Rust Native Backend Modules",
  },
  {
    id: "assign-beta-2",
    project_id: "proj-beta",
    project_name: "[SAMPLE] Project Beta",
    project_color: "#EF4444",
    client: "[SAMPLE] Client A",
    member_id: "tm-james",
    member_name: "James Anderson",
    member_initials: "JA",
    member_avatar_color: "#64748B",
    start_date: "2026-09-09",
    end_date: "2026-09-17",
    hours_per_day: 4,
    total_hours: 24,
    note: "Database Migrations & Security Tests",
  },
  {
    id: "assign-gamma-v1",
    project_id: "proj-gamma",
    project_name: "[SAMPLE] Project Gamma",
    project_color: "#78716C",
    client: "[SAMPLE] Client A",
    member_id: "tm-lara",
    member_name: "Lara Peterson",
    member_initials: "LP",
    member_avatar_color: "#4CAF50",
    start_date: "2026-08-31",
    end_date: "2026-09-01",
    hours_per_day: 8,
    total_hours: 16,
    version_label: "V1",
    is_hatched: true,
    note: "Version 1 Prototyping Phase",
    is_milestone_active: true,
  },
  {
    id: "assign-gamma-main",
    project_id: "proj-gamma",
    project_name: "[SAMPLE] Project Gamma",
    project_color: "#78716C",
    client: "[SAMPLE] Client A",
    member_id: "tm-james",
    member_name: "James Anderson",
    member_initials: "JA",
    member_avatar_color: "#64748B",
    start_date: "2026-09-02",
    end_date: "2026-09-13",
    hours_per_day: 4.5,
    total_hours: 40,
    note: "Core Infrastructure Cluster Build",
    is_milestone_active: true,
  },
  {
    id: "assign-gamma-late",
    project_id: "proj-gamma",
    project_name: "[SAMPLE] Project Gamma",
    project_color: "#78716C",
    client: "[SAMPLE] Client A",
    member_id: "tm-lara",
    member_name: "Lara Peterson",
    member_initials: "LP",
    member_avatar_color: "#4CAF50",
    start_date: "2026-09-14",
    end_date: "2026-09-18",
    hours_per_day: 3,
    total_hours: 15,
    note: "Release Validation & QA",
    is_milestone_active: true,
  },
];

const STORAGE_KEY_ASSIGNMENTS = "clockify_mobile_schedule_assignments";
const STORAGE_KEY_PUBLISHED = "clockify_mobile_schedule_published";

export class ScheduleRepository implements IScheduleRepository {
  private assignments: ScheduleAssignmentDTO[] = [];
  private isPublished: boolean = true;

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
      if (saved) {
        try {
          this.assignments = JSON.parse(saved);
        } catch {
          this.assignments = JSON.parse(JSON.stringify(INITIAL_SCHEDULE_ASSIGNMENTS));
        }
      } else {
        this.assignments = JSON.parse(JSON.stringify(INITIAL_SCHEDULE_ASSIGNMENTS));
      }

      const savedPub = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (savedPub !== null) {
        this.isPublished = savedPub === "true";
      }
    } else {
      this.assignments = JSON.parse(JSON.stringify(INITIAL_SCHEDULE_ASSIGNMENTS));
      this.isPublished = true;
    }
  }

  private saveState() {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(this.assignments));
      localStorage.setItem(STORAGE_KEY_PUBLISHED, String(this.isPublished));
    }
  }

  async getAll(filter?: ScheduleFilter): Promise<ScheduleAssignmentDTO[]> {
    let result = [...this.assignments];

    if (filter?.project_id) {
      result = result.filter((a) => a.project_id === filter.project_id);
    }
    if (filter?.member_id) {
      result = result.filter((a) => a.member_id === filter.member_id);
    }
    if (filter?.client) {
      result = result.filter((a) => a.client.toLowerCase() === filter.client?.toLowerCase());
    }
    if (filter?.start_date && filter?.end_date) {
      result = result.filter(
        (a) => a.start_date <= filter.end_date! && a.end_date >= filter.start_date!
      );
    }

    return result;
  }

  async getById(id: string): Promise<ScheduleAssignmentDTO | null> {
    const item = this.assignments.find((a) => a.id === id);
    return item ? { ...item } : null;
  }

  async create(payload: CreateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO> {
    const newAssignment: ScheduleAssignmentDTO = {
      id: `assign-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      project_id: payload.project_id,
      project_name: payload.project_name,
      project_color: payload.project_color,
      client: payload.client,
      member_id: payload.member_id,
      member_name: payload.member_name,
      member_initials: payload.member_initials,
      member_avatar_color: payload.member_avatar_color,
      start_date: payload.start_date,
      end_date: payload.end_date,
      hours_per_day: payload.hours_per_day,
      total_hours: payload.total_hours,
      note: payload.note,
      version_label: payload.version_label,
      is_hatched: payload.is_hatched,
      is_milestone_active: payload.is_milestone_active,
    };

    this.assignments.push(newAssignment);
    this.saveState();
    return newAssignment;
  }

  async update(id: string, payload: UpdateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO | null> {
    const idx = this.assignments.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const current = this.assignments[idx];
    const updated: ScheduleAssignmentDTO = {
      ...current,
      ...payload,
    };

    this.assignments[idx] = updated;
    this.saveState();
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const prevLen = this.assignments.length;
    this.assignments = this.assignments.filter((a) => a.id !== id);
    const deleted = this.assignments.length < prevLen;
    if (deleted) this.saveState();
    return deleted;
  }

  async togglePublish(): Promise<boolean> {
    this.isPublished = !this.isPublished;
    this.saveState();
    return this.isPublished;
  }

  async getPublishStatus(): Promise<boolean> {
    return this.isPublished;
  }

  async removeSampleData(): Promise<void> {
    this.assignments = this.assignments.filter((a) => !a.project_name.includes("[SAMPLE]"));
    this.saveState();
  }

  async restoreSampleData(): Promise<ScheduleAssignmentDTO[]> {
    this.assignments = this.assignments.filter((a) => !a.project_name.includes("[SAMPLE]"));
    this.assignments.push(...JSON.parse(JSON.stringify(INITIAL_SCHEDULE_ASSIGNMENTS)));
    this.saveState();
    return [...this.assignments];
  }

  async getSummary(): Promise<ScheduleSummaryDTO> {
    const total_assignments = this.assignments.length;
    const total_scheduled_hours = this.assignments.reduce((sum, a) => sum + a.total_hours, 0);
    const members = new Set(this.assignments.map((a) => a.member_id));
    const projects = new Set(this.assignments.map((a) => a.project_id));

    return {
      total_assignments,
      total_scheduled_hours,
      total_members_scheduled: members.size,
      total_projects_scheduled: projects.size,
      is_published: this.isPublished,
    };
  }
}

export const scheduleRepository = new ScheduleRepository();
