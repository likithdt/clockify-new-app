import { scheduleService } from "../services/ScheduleService.ts";
import type { ApiResponse } from "./TimeTrackerController.ts";
import type { ScheduleFilter } from "../types.ts";

export class ScheduleController {
  static async listAssignments(filter?: ScheduleFilter): Promise<ApiResponse> {
    try {
      const data = await scheduleService.listAssignments(filter);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async getAssignment(id: string): Promise<ApiResponse> {
    try {
      const data = await scheduleService.getAssignment(id);
      if (!data) {
        return { status: 404, error: `Assignment '${id}' not found` };
      }
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async createAssignment(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.project_name || !body.member_name) {
        return { status: 400, error: "Project and member are required" };
      }
      const data = await scheduleService.createAssignment(body);
      return { status: 201, data };
    } catch (err: any) {
      return { status: 400, error: err.message };
    }
  }

  static async updateAssignment(id: string, body: any): Promise<ApiResponse> {
    try {
      const data = await scheduleService.updateAssignment(id, body);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message };
    }
  }

  static async deleteAssignment(id: string): Promise<ApiResponse> {
    try {
      const deleted = await scheduleService.deleteAssignment(id);
      return { status: 200, data: { deleted } };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async togglePublish(): Promise<ApiResponse> {
    try {
      const is_published = await scheduleService.togglePublish();
      return { status: 200, data: { is_published } };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async removeSampleData(): Promise<ApiResponse> {
    try {
      await scheduleService.removeSampleData();
      return { status: 200, data: { success: true, message: "Sample schedule data removed" } };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async restoreSampleData(): Promise<ApiResponse> {
    try {
      const data = await scheduleService.restoreSampleData();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }

  static async getSummary(): Promise<ApiResponse> {
    try {
      const data = await scheduleService.getSummary();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message };
    }
  }
}
