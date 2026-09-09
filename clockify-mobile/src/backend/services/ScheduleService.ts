import {
  scheduleRepository,
  type IScheduleRepository,
} from "../repositories/ScheduleRepository.ts";
import type {
  ScheduleAssignmentDTO,
  CreateScheduleAssignmentPayload,
  UpdateScheduleAssignmentPayload,
  ScheduleFilter,
  ScheduleSummaryDTO,
} from "../types.ts";

export class ScheduleService {
  private repo: IScheduleRepository;

  constructor(repo: IScheduleRepository = scheduleRepository) {
    this.repo = repo;
  }

  async listAssignments(filter?: ScheduleFilter): Promise<ScheduleAssignmentDTO[]> {
    return this.repo.getAll(filter);
  }

  async getAssignment(id: string): Promise<ScheduleAssignmentDTO | null> {
    return this.repo.getById(id);
  }

  async createAssignment(payload: CreateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO> {
    if (!payload.project_name || !payload.member_name) {
      throw new Error("Project and member are required");
    }
    if (!payload.start_date || !payload.end_date) {
      throw new Error("Start date and end date are required");
    }
    if (payload.start_date > payload.end_date) {
      throw new Error("Start date cannot be after end date");
    }

    return this.repo.create(payload);
  }

  async updateAssignment(
    id: string,
    payload: UpdateScheduleAssignmentPayload
  ): Promise<ScheduleAssignmentDTO> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new Error(`Schedule assignment '${id}' not found`);
    }

    const updated = await this.repo.update(id, payload);
    if (!updated) {
      throw new Error(`Failed to update schedule assignment '${id}'`);
    }
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async togglePublish(): Promise<boolean> {
    return this.repo.togglePublish();
  }

  async getPublishStatus(): Promise<boolean> {
    return this.repo.getPublishStatus();
  }

  async removeSampleData(): Promise<void> {
    return this.repo.removeSampleData();
  }

  async restoreSampleData(): Promise<ScheduleAssignmentDTO[]> {
    return this.repo.restoreSampleData();
  }

  async getSummary(): Promise<ScheduleSummaryDTO> {
    return this.repo.getSummary();
  }
}

export const scheduleService = new ScheduleService();
