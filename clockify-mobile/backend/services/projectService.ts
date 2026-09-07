import type {
  ProjectDTO,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilter,
  ProjectSummaryDTO,
} from '../models/projectTypes';

const INITIAL_PROJECTS: ProjectDTO[] = [
  {
    id: "proj-1",
    name: "[SAMPLE] Internal Work",
    color: "#03a9f4",
    client: null,
    tracked_hours: 0,
    amount: 0,
    currency: "INR",
    access: "Public",
    is_favorite: false,
    is_archived: false,
    is_billable: true,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "proj-2",
    name: "[SAMPLE] Project Orion",
    color: "#f59e0b",
    client: "[SAMPLE] Client B",
    tracked_hours: 282,
    budget_hours: 400,
    amount: 2953.0,
    currency: "INR",
    progress_percent: 70.5,
    access: "Public",
    is_favorite: false,
    is_archived: false,
    is_billable: true,
    created_at: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "proj-3",
    name: "[SAMPLE] Project Apollo",
    color: "#10b981",
    client: "[SAMPLE] Client A",
    tracked_hours: 154,
    budget_hours: 200,
    amount: 1840.0,
    currency: "INR",
    progress_percent: 77.0,
    access: "Public",
    is_favorite: false,
    is_archived: false,
    is_billable: true,
    created_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "proj-4",
    name: "[SAMPLE] Mobile Application",
    color: "#8b5cf6",
    client: "[SAMPLE] Client A",
    tracked_hours: 95,
    budget_hours: 100,
    amount: 1425.0,
    currency: "INR",
    progress_percent: 95.0,
    access: "Public",
    is_favorite: false,
    is_archived: false,
    is_billable: true,
    created_at: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "proj-5",
    name: "[SAMPLE] Brand Redesign",
    color: "#ec4899",
    client: "[SAMPLE] Client B",
    tracked_hours: 42,
    amount: 630.0,
    currency: "INR",
    access: "Public",
    is_favorite: false,
    is_archived: false,
    is_billable: false,
    created_at: "2026-02-10T00:00:00.000Z",
  },
];

class ProjectService {
  private projects: ProjectDTO[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS));

  listProjects(filter?: ProjectFilter): ProjectDTO[] {
    let result = [...this.projects];

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.client && p.client.toLowerCase().includes(q))
      );
    }

    if (filter?.client && filter.client !== 'All') {
      result = result.filter((p) => p.client === filter.client);
    }

    if (filter?.status && filter.status !== 'All') {
      if (filter.status === 'Active') {
        result = result.filter((p) => !p.is_archived);
      } else if (filter.status === 'Archived') {
        result = result.filter((p) => p.is_archived);
      }
    }

    if (filter?.access && filter.access !== 'All') {
      result = result.filter((p) => p.access === filter.access);
    }

    if (filter?.billing && filter.billing !== 'All') {
      if (filter.billing === 'Billable') {
        result = result.filter((p) => p.is_billable);
      } else if (filter.billing === 'Non-billable') {
        result = result.filter((p) => !p.is_billable);
      }
    }

    if (filter?.is_favorite !== undefined) {
      result = result.filter((p) => p.is_favorite === filter.is_favorite);
    }

    return result;
  }

  getProject(id: string): ProjectDTO | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(payload: CreateProjectPayload): ProjectDTO {
    const newProject: ProjectDTO = {
      id: `proj-${Date.now()}`,
      name: payload.name.trim(),
      color: payload.color,
      client: payload.client || null,
      tracked_hours: 0,
      budget_hours: payload.budget_hours,
      budget_amount: payload.budget_amount,
      amount: 0,
      currency: payload.currency || "INR",
      access: payload.access || "Public",
      is_favorite: false,
      is_archived: false,
      is_billable: payload.is_billable ?? true,
      created_at: new Date().toISOString(),
    };

    this.projects.unshift(newProject);
    return newProject;
  }

  updateProject(id: string, payload: UpdateProjectPayload): ProjectDTO {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Project '${id}' not found`);

    const current = this.projects[idx];
    const updated: ProjectDTO = {
      ...current,
      name: payload.name !== undefined ? payload.name.trim() : current.name,
      color: payload.color !== undefined ? payload.color : current.color,
      client: payload.client !== undefined ? payload.client : current.client,
      access: payload.access !== undefined ? payload.access : current.access,
      is_billable: payload.is_billable !== undefined ? payload.is_billable : current.is_billable,
      is_favorite: payload.is_favorite !== undefined ? payload.is_favorite : current.is_favorite,
      is_archived: payload.is_archived !== undefined ? payload.is_archived : current.is_archived,
      budget_hours: payload.budget_hours !== undefined ? payload.budget_hours : current.budget_hours,
      budget_amount: payload.budget_amount !== undefined ? payload.budget_amount : current.budget_amount,
      tracked_hours: payload.tracked_hours !== undefined ? payload.tracked_hours : current.tracked_hours,
      amount: payload.amount !== undefined ? payload.amount : current.amount,
      currency: payload.currency !== undefined ? payload.currency : current.currency,
    };

    if (updated.budget_hours && updated.budget_hours > 0) {
      updated.progress_percent = Math.min(100, (updated.tracked_hours / updated.budget_hours) * 100);
      updated.is_budget_exceeded = updated.tracked_hours > updated.budget_hours;
    }

    this.projects[idx] = updated;
    return updated;
  }

  deleteProject(id: string): boolean {
    const prevLen = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return this.projects.length < prevLen;
  }

  archiveProject(id: string): ProjectDTO {
    return this.updateProject(id, { is_archived: true });
  }

  restoreProject(id: string): ProjectDTO {
    return this.updateProject(id, { is_archived: false });
  }

  toggleFavorite(id: string): ProjectDTO {
    const p = this.getProject(id);
    if (!p) throw new Error(`Project '${id}' not found`);
    return this.updateProject(id, { is_favorite: !p.is_favorite });
  }

  removeSampleData(): void {
    this.projects = this.projects.filter((p) => !p.name.includes("[SAMPLE]"));
  }

  restoreSampleData(): ProjectDTO[] {
    this.projects = this.projects.filter((p) => !p.name.includes("[SAMPLE]"));
    this.projects.push(...JSON.parse(JSON.stringify(INITIAL_PROJECTS)));
    return this.projects;
  }

  getSummary(): ProjectSummaryDTO {
    const total_projects = this.projects.length;
    const active_projects = this.projects.filter((p) => !p.is_archived).length;
    const archived_projects = this.projects.filter((p) => p.is_archived).length;
    const total_tracked_hours = this.projects.reduce((sum, p) => sum + p.tracked_hours, 0);
    const total_billable_amount = this.projects
      .filter((p) => p.is_billable)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total_projects,
      active_projects,
      archived_projects,
      total_tracked_hours,
      total_billable_amount,
    };
  }
}

export const projectService = new ProjectService();
