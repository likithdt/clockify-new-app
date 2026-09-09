import type { ApiResponse } from "./TimeTrackerController.ts";
import { activityService } from "../services/ActivityService.ts";
import type { ActivityFilter } from "../types.ts";

export class ActivityController {
  // ─── Activity Monitoring ──────────────────────────────────────────────────

  static async listActivityRecords(query?: Record<string, string>): Promise<ApiResponse> {
    try {
      const filter: ActivityFilter = {};
      if (query?.member_id) filter.member_id = query.member_id;
      if (query?.project) filter.project = query.project;
      if (query?.status) filter.status = query.status as any;
      if (query?.min_activity) filter.min_activity = parseInt(query.min_activity, 10);

      const records = await activityService.listActivityRecords(filter);
      return { status: 200, data: records };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list activity records" };
    }
  }

  static async getActivityRecord(id: string): Promise<ApiResponse> {
    try {
      const record = await activityService.getActivityRecord(id);
      if (!record) {
        return { status: 404, error: `Activity record '${id}' not found` };
      }
      return { status: 200, data: record };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to get activity record" };
    }
  }

  static async logActivityRecord(body: any): Promise<ApiResponse> {
    try {
      const record = await activityService.logActivityRecord(body);
      return { status: 201, data: record };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to log activity record" };
    }
  }

  static async getActivitySummary(): Promise<ApiResponse> {
    try {
      const summary = await activityService.getActivitySummary();
      return { status: 200, data: summary };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to get activity summary" };
    }
  }

  static async exportActivity(query?: Record<string, string>): Promise<ApiResponse> {
    try {
      const format = (query?.format === "json" ? "json" : "csv") as "csv" | "json";
      const exported = await activityService.exportActivityData(format);
      return { status: 200, data: exported };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to export activity data" };
    }
  }

  // ─── Screenshots ──────────────────────────────────────────────────────────

  static async listScreenshots(query?: Record<string, string>): Promise<ApiResponse> {
    try {
      const memberId = query?.member_id;
      const date = query?.date;
      const screenshots = await activityService.listScreenshots(memberId, date);
      return { status: 200, data: screenshots };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list screenshots" };
    }
  }

  static async getScreenshot(id: string): Promise<ApiResponse> {
    try {
      const screenshot = await activityService.getScreenshot(id);
      if (!screenshot) {
        return { status: 404, error: `Screenshot '${id}' not found` };
      }
      return { status: 200, data: screenshot };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to get screenshot" };
    }
  }

  static async captureScreenshot(body: any): Promise<ApiResponse> {
    try {
      const screenshot = await activityService.captureScreenshot(body);
      return { status: 201, data: screenshot };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to capture screenshot" };
    }
  }

  static async deleteScreenshot(id: string): Promise<ApiResponse> {
    try {
      const deleted = await activityService.deleteScreenshot(id);
      if (!deleted) {
        return { status: 404, error: `Screenshot '${id}' not found` };
      }
      return { status: 200, data: { deleted: true } };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to delete screenshot" };
    }
  }

  // ─── Member Locations & GPS ───────────────────────────────────────────────

  static async listMemberLocations(): Promise<ApiResponse> {
    try {
      const locations = await activityService.listMemberLocations();
      return { status: 200, data: locations };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list member locations" };
    }
  }

  static async getMemberLocation(id: string): Promise<ApiResponse> {
    try {
      const location = await activityService.getMemberLocation(id);
      if (!location) {
        return { status: 404, error: `Member location for '${id}' not found` };
      }
      return { status: 200, data: location };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to get member location" };
    }
  }

  static async updateMemberLocation(id: string, body: any): Promise<ApiResponse> {
    try {
      const updated = await activityService.updateMemberLocation(id, body);
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update member location" };
    }
  }

  static async checkInLocation(body: any): Promise<ApiResponse> {
    try {
      const { member_id, lat, lng, location_name } = body || {};
      const updated = await activityService.recordCheckIn(
        member_id || "likith-dt",
        lat,
        lng,
        location_name
      );
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to record GPS check-in" };
    }
  }

  // ─── Geofencing ───────────────────────────────────────────────────────────

  static async listGeofences(): Promise<ApiResponse> {
    try {
      const geofences = await activityService.listGeofences();
      return { status: 200, data: geofences };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list geofences" };
    }
  }

  static async createGeofence(body: any): Promise<ApiResponse> {
    try {
      const zone = await activityService.createGeofence(body);
      return { status: 201, data: zone };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to create geofence zone" };
    }
  }

  static async deleteGeofence(id: string): Promise<ApiResponse> {
    try {
      const deleted = await activityService.deleteGeofence(id);
      if (!deleted) {
        return { status: 404, error: `Geofence zone '${id}' not found` };
      }
      return { status: 200, data: { deleted: true } };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to delete geofence zone" };
    }
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  static async getSettings(): Promise<ApiResponse> {
    try {
      const settings = await activityService.getSettings();
      return { status: 200, data: settings };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to get activity settings" };
    }
  }

  static async updateSettings(body: any): Promise<ApiResponse> {
    try {
      const settings = await activityService.updateSettings(body || {});
      return { status: 200, data: settings };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update activity settings" };
    }
  }

  static async resetSampleData(): Promise<ApiResponse> {
    try {
      await activityService.resetSampleData();
      return { status: 200, data: { reset: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to reset sample data" };
    }
  }
}
