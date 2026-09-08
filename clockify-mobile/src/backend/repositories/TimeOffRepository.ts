import type { TimeOffRequest } from "../types.ts";

export interface ITimeOffRepository {
  getAll(): Promise<TimeOffRequest[]>;
  create(data: Omit<TimeOffRequest, "id">): Promise<TimeOffRequest>;
  updateStatus(id: string, status: "approved" | "pending" | "rejected"): Promise<TimeOffRequest | null>;
}

const INITIAL_TIMEOFF: TimeOffRequest[] = [
  {
    id: "to-1",
    userName: "vishalkomi954",
    policyName: "[SAMPLE] Vacation",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    dateRangeLabel: "Tue, Sep 15 - Thu, Sep 17",
    durationDays: 3,
    status: "approved",
    note: "Family trip",
  },
];

export class TimeOffRepository implements ITimeOffRepository {
  private requests: TimeOffRequest[] = [...INITIAL_TIMEOFF];

  async getAll(): Promise<TimeOffRequest[]> {
    return [...this.requests];
  }

  async create(data: Omit<TimeOffRequest, "id">): Promise<TimeOffRequest> {
    const req: TimeOffRequest = {
      id: `to-${Date.now()}`,
      ...data,
    };
    this.requests.unshift(req);
    return req;
  }

  async updateStatus(id: string, status: "approved" | "pending" | "rejected"): Promise<TimeOffRequest | null> {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;
    req.status = status;
    return { ...req };
  }
}

export const timeOffRepository = new TimeOffRepository();
