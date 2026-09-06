import type { TimeEntry } from "../types.ts";

export interface ITimeEntryRepository {
  getAll(): Promise<TimeEntry[]>;
  getById(id: string): Promise<TimeEntry | null>;
  create(entry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">): Promise<TimeEntry>;
  update(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
  seedSampleData(): Promise<TimeEntry[]>;
}

export const SAMPLE_ENTRIES: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">[] = [
  {
    description: "No description",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: [],
    startTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 60 * 1000 + 15000).toISOString(),
    durationSeconds: 15,
  },
  {
    description: "No description",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: [],
    startTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 60 * 1000 + 4000).toISOString(),
    durationSeconds: 4,
  },
  {
    description: "No description",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: [],
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 60 * 1000 + 4000).toISOString(),
    durationSeconds: 4,
  },
  {
    description: "No description",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: [],
    startTime: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 6 * 60 * 1000 + 8000).toISOString(),
    durationSeconds: 8,
  },
  {
    description: "Break",
    projectName: "No project",
    projectColor: "#94a3b8",
    isBillable: true,
    tags: ["Break"],
    startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 10 * 60 * 1000 + 83000).toISOString(),
    durationSeconds: 83,
  },
];

export class InMemoryTimeEntryRepository implements ITimeEntryRepository {
  private entries: TimeEntry[] = [];

  constructor(initialEntries: TimeEntry[] = []) {
    this.entries = initialEntries;
  }

  async getAll(): Promise<TimeEntry[]> {
    // Return sorted reverse chronological
    return [...this.entries].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  async getById(id: string): Promise<TimeEntry | null> {
    return this.entries.find((e) => e.id === id) || null;
  }

  async create(data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">): Promise<TimeEntry> {
    const now = new Date().toISOString();
    const newEntry: TimeEntry = {
      ...data,
      id: `te-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.entries.unshift(newEntry);
    return newEntry;
  }

  async update(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const current = this.entries[idx];
    const updated: TimeEntry = {
      ...current,
      ...updates,
      id: current.id, // prevent id change
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.entries[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.entries.length;
    this.entries = this.entries.filter((e) => e.id !== id);
    return this.entries.length < initialLen;
  }

  async clear(): Promise<void> {
    this.entries = [];
  }

  async seedSampleData(): Promise<TimeEntry[]> {
    this.entries = [];
    for (const sample of SAMPLE_ENTRIES) {
      await this.create(sample);
    }
    return this.getAll();
  }
}

export const timeEntryRepository = new InMemoryTimeEntryRepository();
