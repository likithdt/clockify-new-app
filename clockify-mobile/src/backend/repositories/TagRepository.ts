import type { Tag } from "../types.ts";

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
  getById(id: string): Promise<Tag | null>;
  create(name: string): Promise<Tag>;
}

const INITIAL_TAGS: Tag[] = [
  { id: "tag-1", name: "Development", isArchived: false },
  { id: "tag-2", name: "Design", isArchived: false },
  { id: "tag-3", name: "Meeting", isArchived: false },
  { id: "tag-4", name: "Testing", isArchived: false },
  { id: "tag-5", name: "Bug Fix", isArchived: false },
];

export class InMemoryTagRepository implements ITagRepository {
  private tags: Tag[] = JSON.parse(JSON.stringify(INITIAL_TAGS));

  async getAll(): Promise<Tag[]> {
    return [...this.tags];
  }

  async getById(id: string): Promise<Tag | null> {
    return this.tags.find((t) => t.id === id) || null;
  }

  async create(name: string): Promise<Tag> {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      isArchived: false,
    };
    this.tags.push(newTag);
    return newTag;
  }
}

export const tagRepository = new InMemoryTagRepository();
