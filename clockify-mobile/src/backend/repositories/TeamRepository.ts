import type { TeamMember } from "../types.ts";

export interface ITeamRepository {
  getAll(): Promise<TeamMember[]>;
  create(name: string, email: string, role: string): Promise<TeamMember>;
  delete(id: string): Promise<boolean>;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: "team-1", name: "Vishal Komi", email: "vishalkomi954@gmail.com", role: "Owner", status: "active" },
  { id: "team-2", name: "Jane Smith", email: "jane.smith@example.com", role: "Regular", status: "active" },
];

export class TeamRepository implements ITeamRepository {
  private members: TeamMember[] = [...INITIAL_TEAM];

  async getAll(): Promise<TeamMember[]> {
    return [...this.members];
  }

  async create(name: string, email: string, role: string = "Regular"): Promise<TeamMember> {
    const member: TeamMember = {
      id: `team-${Date.now()}`,
      name,
      email,
      role: role as TeamMember["role"],
      status: "active",
    };
    this.members.unshift(member);
    return member;
  }

  async delete(id: string): Promise<boolean> {
    const prev = this.members.length;
    this.members = this.members.filter((m) => m.id !== id);
    return this.members.length < prev;
  }
}

export const teamRepository = new TeamRepository();
