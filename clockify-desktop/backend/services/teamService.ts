import type {
  TeamMemberDTO,
  AddTeamMemberPayload,
  UpdateTeamMemberPayload,
  TeamFilter,
  TeamSummaryDTO,
} from '../models/teamTypes';

const INITIAL_MEMBERS: TeamMemberDTO[] = [
  {
    id: "tm-1",
    name: "[SAMPLE] Amy Smith",
    email: "amy.smith1b1753f297a01cbb@clockify.me",
    billable_rate: null,
    cost_rate: 15,
    currency: "INR",
    role: "Project manager",
    group: null,
    status: "Active",
  },
  {
    id: "tm-2",
    name: "[SAMPLE] James Anderson",
    email: "james.anderson36d56b7f7df036@clockify.me",
    billable_rate: null,
    cost_rate: 5,
    currency: "INR",
    role: "Member",
    group: null,
    status: "Active",
  },
  {
    id: "tm-3",
    name: "[SAMPLE] Lara Peterson",
    email: "lara.peterson03af321182e80532@clockify.me",
    billable_rate: null,
    cost_rate: 10,
    currency: "INR",
    role: "Team manager",
    group: null,
    status: "Active",
  },
  {
    id: "tm-4",
    name: "[SAMPLE] Mike Johnson",
    email: "mike.johnson22b7a3ff4c176cbc@clockify.me",
    billable_rate: null,
    cost_rate: 10,
    currency: "INR",
    role: "Member",
    group: null,
    status: "Active",
  },
  {
    id: "tm-5",
    name: "Bindhu shree (you)",
    email: "sbindhu230@gmail.com",
    billable_rate: null,
    cost_rate: null,
    currency: "INR",
    role: "Owner",
    group: null,
    status: "Active",
    is_current_user: true,
  },
];

class TeamService {
  private members: TeamMemberDTO[] = JSON.parse(JSON.stringify(INITIAL_MEMBERS));

  listMembers(filter?: TeamFilter): TeamMemberDTO[] {
    let result = [...this.members];

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      );
    }

    if (filter?.status && filter.status !== 'All') {
      result = result.filter((m) => m.status === filter.status);
    }

    if (filter?.group) {
      result = result.filter((m) => m.group === filter.group);
    }

    if (filter?.roles && filter.roles.length > 0) {
      result = result.filter((m) => filter.roles!.includes(m.role));
    }

    if (filter?.smaller_rate !== undefined) {
      result = result.filter((m) => m.billable_rate !== null && m.billable_rate! < filter.smaller_rate!);
    }

    if (filter?.larger_rate !== undefined) {
      result = result.filter((m) => m.billable_rate !== null && m.billable_rate! > filter.larger_rate!);
    }

    return result;
  }

  getMember(id: string): TeamMemberDTO | undefined {
    return this.members.find((m) => m.id === id);
  }

  addMembers(payload: AddTeamMemberPayload): TeamMemberDTO[] {
    const created: TeamMemberDTO[] = [];

    for (const email of payload.emails) {
      const trimmed = email.trim();
      if (!trimmed) continue;

      const namePart = trimmed.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const newMember: TeamMemberDTO = {
        id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: capitalized,
        email: trimmed,
        billable_rate: payload.billable_rate ?? null,
        cost_rate: payload.cost_rate ?? null,
        currency: payload.currency || "INR",
        role: payload.role || "Member",
        group: payload.group || null,
        status: "Active",
      };

      this.members.push(newMember);
      created.push(newMember);
    }

    return created;
  }

  updateMember(id: string, payload: UpdateTeamMemberPayload): TeamMemberDTO {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Team member '${id}' not found`);

    const current = this.members[idx];
    const updated: TeamMemberDTO = {
      ...current,
      name: payload.name !== undefined ? payload.name.trim() : current.name,
      email: payload.email !== undefined ? payload.email.trim() : current.email,
      billable_rate: payload.billable_rate !== undefined ? payload.billable_rate : current.billable_rate,
      cost_rate: payload.cost_rate !== undefined ? payload.cost_rate : current.cost_rate,
      currency: payload.currency !== undefined ? payload.currency : current.currency,
      role: payload.role !== undefined ? payload.role : current.role,
      group: payload.group !== undefined ? payload.group : current.group,
      status: payload.status !== undefined ? payload.status : current.status,
    };

    this.members[idx] = updated;
    return updated;
  }

  deleteMember(id: string): boolean {
    const prevLen = this.members.length;
    this.members = this.members.filter((m) => m.id !== id);
    return this.members.length < prevLen;
  }

  resetSample(): TeamMemberDTO[] {
    this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
    return this.members;
  }

  getSummary(): TeamSummaryDTO {
    return {
      total_members: this.members.length,
      active_members: this.members.filter((m) => m.status === "Active").length,
      inactive_members: this.members.filter((m) => m.status === "Inactive").length,
      invited_members: this.members.filter((m) => m.status === "Invited").length,
    };
  }
}

export const teamService = new TeamService();
