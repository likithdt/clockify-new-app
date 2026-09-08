import type { ApiResponse } from "./TimeTrackerController.ts";
import { autoTrackerService } from "../services/AutoTrackerService.ts";

export class AutoTrackerController {
  static async getActivities(): Promise<ApiResponse> {
    try {
      const activities = await autoTrackerService.getActivities();
      return { status: 200, data: activities };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to fetch activities" };
    }
  }

  static async getStatus(): Promise<ApiResponse> {
    try {
      const status = await autoTrackerService.getStatus();
      return { status: 200, data: status };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to fetch status" };
    }
  }

  static async toggleRecording(): Promise<ApiResponse> {
    try {
      const isRecording = await autoTrackerService.toggleRecording();
      return { status: 200, data: { isRecording } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to toggle recording" };
    }
  }

  static async logActivity(body: any): Promise<ApiResponse> {
    try {
      const id = body?.id || body?.activity_id;
      if (!id) {
        return { status: 400, error: "Activity ID is required" };
      }
      const result = await autoTrackerService.logActivity(id);
      return { status: 200, data: result };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to log activity" };
    }
  }

  static async logAll(): Promise<ApiResponse> {
    try {
      const result = await autoTrackerService.logAll();
      return { status: 200, data: result };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to accept all suggestions" };
    }
  }

  static async discardActivity(id: string): Promise<ApiResponse> {
    try {
      const success = await autoTrackerService.discardActivity(id);
      if (!success) {
        return { status: 404, error: `Activity '${id}' not found` };
      }
      return { status: 200, data: { deleted: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to discard activity" };
    }
  }

  static async updateProject(id: string, body: any): Promise<ApiResponse> {
    try {
      const { projectName, projectColor, projectId } = body || {};
      if (!projectName) {
        return { status: 400, error: "projectName is required" };
      }
      const updated = await autoTrackerService.updateProject(
        id,
        projectName,
        projectColor || "#03a9f4",
        projectId
      );
      if (!updated) {
        return { status: 404, error: `Activity '${id}' not found` };
      }
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update project" };
    }
  }

  static async simulateActivity(): Promise<ApiResponse> {
    try {
      const newActivity = await autoTrackerService.simulateDetectedActivity();
      return { status: 201, data: newActivity };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to simulate activity" };
    }
  }

  static async reset(): Promise<ApiResponse> {
    try {
      const activities = await autoTrackerService.reset();
      return { status: 200, data: activities };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to reset activities" };
    }
  }
}
