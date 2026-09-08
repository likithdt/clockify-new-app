import type { Project, TaskItem } from "../types.ts";

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(name: string, color: string, clientName?: string): Promise<Project>;
  update(id: string, updates: Partial<Project>): Promise<Project | null>;
  updateTask(projectId: string, taskId: string, updates: Partial<TaskItem>): Promise<TaskItem | null>;
  createTask(projectId: string, name: string): Promise<TaskItem | null>;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "[SAMPLE] Internal Project",
    color: "#03a9f4", // Cyan as seen in Projects.jpeg
    tasks: [
      { id: "task-1-1", name: "Administration", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-1-2", name: "Education", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-1-3", name: "Workshops", isDone: false, isFavorite: false, isBillable: true },
    ],
    isArchived: false,
    isFavorite: true,
    isBillable: false,
    isPublic: true,
  },
  {
    id: "proj-2",
    name: "[SAMPLE] Project Alpha",
    color: "#ff9800", // Orange as seen in Projects.jpeg
    clientName: "[SAMPLE] Client A",
    tasks: [
      { id: "task-2-1", name: "UI Design & Prototyping", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-2-2", name: "Frontend Development", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-2-3", name: "Bug Fixing", isDone: false, isFavorite: false, isBillable: true },
    ],
    isArchived: false,
  },
  {
    id: "proj-3",
    name: "[SAMPLE] Project Beta",
    color: "#8d6e63", // Brown as seen in Projects.jpeg
    clientName: "[SAMPLE] Client B",
    tasks: [
      { id: "task-3-1", name: "API Integration", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-3-2", name: "Database Optimization", isDone: false, isFavorite: false, isBillable: true },
    ],
    isArchived: false,
  },
  {
    id: "proj-4",
    name: "[SAMPLE] Project Gamma",
    color: "#f44336", // Red as seen in Projects.jpeg
    clientName: "[SAMPLE] Client B",
    tasks: [
      { id: "task-4-1", name: "Quality Assurance", isDone: false, isFavorite: false, isBillable: true },
      { id: "task-4-2", name: "Performance Testing", isDone: false, isFavorite: false, isBillable: true },
    ],
    isArchived: false,
  },
];

export class InMemoryProjectRepository implements IProjectRepository {
  private projects: Project[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS));

  async getAll(): Promise<Project[]> {
    return [...this.projects];
  }

  async getById(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async create(name: string, color: string, clientName?: string): Promise<Project> {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      color,
      clientName: clientName || undefined,
      tasks: [],
      isArchived: false,
      isBillable: true,
      isPublic: true,
    };
    this.projects.push(newProject);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.find((p) => p.id === id);
    if (!project) return null;
    Object.assign(project, updates);
    return project;
  }

  async updateTask(
    projectId: string,
    taskId: string,
    updates: Partial<TaskItem>
  ): Promise<TaskItem | null> {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return null;
    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) return null;
    Object.assign(task, updates);
    return task;
  }

  async createTask(projectId: string, name: string): Promise<TaskItem | null> {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return null;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      name,
      isDone: false,
      isFavorite: false,
      isBillable: true,
    };
    project.tasks.push(newTask);
    return newTask;
  }
}

export const projectRepository = new InMemoryProjectRepository();
