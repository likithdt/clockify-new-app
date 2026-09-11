import {
  activityRepository,
  type IActivityRepository,
} from "../repositories/ActivityRepository.ts";
import type {
  ActivityRecord,
  ActivityFilter,
  ActivitySummaryDTO,
  ScreenshotItemDTO,
  CreateScreenshotPayload,
  MemberLocationDTO,
  UpdateMemberLocationPayload,
  GeofenceZoneDTO,
  CreateGeofencePayload,
  ActivitySettingsDTO,
} from "../types.ts";

export class ActivityService {
  private repo: IActivityRepository;

  constructor(repo: IActivityRepository = activityRepository) {
    this.repo = repo;
  }

  // ─── Activity Monitoring ──────────────────────────────────────────────────

  async listActivityRecords(filter?: ActivityFilter): Promise<ActivityRecord[]> {
    return this.repo.getActivityRecords(filter);
  }

  async getActivityRecord(id: string): Promise<ActivityRecord | null> {
    if (!id || typeof id !== "string") {
      throw new Error("Activity Record ID is required");
    }
    return this.repo.getActivityRecord(id);
  }

  async logActivityRecord(
    payload: Omit<ActivityRecord, "id" | "recorded_at"> & { id?: string }
  ): Promise<ActivityRecord> {
    if (!payload.member_id || !payload.member_name) {
      throw new Error("Member ID and Name are required to log activity record");
    }
    return this.repo.logActivityRecord(payload);
  }

  async getActivitySummary(): Promise<ActivitySummaryDTO> {
    return this.repo.getActivitySummary();
  }

  async exportActivityData(
    format: "csv" | "json" = "csv"
  ): Promise<{ contentType: string; filename: string; content: string }> {
    const records = await this.repo.getActivityRecords();
    const dateStr = new Date().toISOString().split("T")[0];
    if (format === "json") {
      return {
        contentType: "application/json",
        filename: `Clockify_Activity_${dateStr}.json`,
        content: JSON.stringify(records, null, 2),
      };
    }
    const headers =
      "Member ID,Member Name,Task,Project,Project Color,Activity %,Active Window,Productivity Score,Status,Recorded At\n";
    const rows = records
      .map(
        (r) =>
          `"${r.member_id}","${r.member_name}","${r.task}","${r.project}","${r.project_color}",${r.activity_percent},"${r.active_window}","${r.score}","${r.status}","${r.recorded_at}"`
      )
      .join("\n");
    return {
      contentType: "text/csv; charset=utf-8",
      filename: `Clockify_Activity_${dateStr}.csv`,
      content: headers + rows,
    };
  }

  // ─── Screenshots ──────────────────────────────────────────────────────────

  async listScreenshots(memberId?: string, date?: string): Promise<ScreenshotItemDTO[]> {
    return this.repo.getScreenshots(memberId, date);
  }

  async getScreenshot(id: string): Promise<ScreenshotItemDTO | null> {
    if (!id) {
      throw new Error("Screenshot ID is required");
    }
    return this.repo.getScreenshot(id);
  }

  async captureScreenshot(payload: CreateScreenshotPayload): Promise<ScreenshotItemDTO> {
    if (!payload.member_id || !payload.member_name) {
      throw new Error("Member ID and Name are required to capture screenshot");
    }
    if (!payload.project) {
      payload.project = "No project";
    }
    return this.repo.captureScreenshot(payload);
  }

  async deleteScreenshot(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Screenshot ID is required");
    }
    return this.repo.deleteScreenshot(id);
  }

  // ─── Locations & GPS ──────────────────────────────────────────────────────

  async listMemberLocations(): Promise<MemberLocationDTO[]> {
    return this.repo.getMemberLocations();
  }

  async getMemberLocation(id: string): Promise<MemberLocationDTO | null> {
    if (!id) {
      throw new Error("Member ID is required");
    }
    return this.repo.getMemberLocation(id);
  }

  async updateMemberLocation(
    id: string,
    payload: UpdateMemberLocationPayload
  ): Promise<MemberLocationDTO> {
    if (!id) {
      throw new Error("Member ID is required");
    }
    if (payload.lat === undefined || payload.lng === undefined) {
      throw new Error("Latitude and Longitude coordinates are required");
    }
    return this.repo.updateMemberLocation(id, payload);
  }

  async recordCheckIn(
    memberId: string,
    lat: number,
    lng: number,
    locationName?: string
  ): Promise<MemberLocationDTO> {
    if (!memberId) {
      throw new Error("Member ID is required for GPS check-in");
    }
    if (lat === undefined || lng === undefined) {
      throw new Error("Latitude and Longitude are required for GPS check-in");
    }
    return this.repo.recordCheckIn(memberId, lat, lng, locationName);
  }

  // ─── Geofences ────────────────────────────────────────────────────────────

  async listGeofences(): Promise<GeofenceZoneDTO[]> {
    return this.repo.getGeofences();
  }

  async createGeofence(payload: CreateGeofencePayload): Promise<GeofenceZoneDTO> {
    if (!payload.name || !payload.name.trim()) {
      throw new Error("Geofence zone name is required");
    }
    if (!payload.address || !payload.address.trim()) {
      throw new Error("Geofence zone address is required");
    }
    if (payload.lat === undefined || payload.lng === undefined) {
      throw new Error("Valid coordinates (lat, lng) are required");
    }
    if (!payload.radius_meters || payload.radius_meters <= 0) {
      throw new Error("Radius in meters must be greater than 0");
    }
    return this.repo.createGeofence(payload);
  }

  async deleteGeofence(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Geofence ID is required");
    }
    return this.repo.deleteGeofence(id);
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  async getSettings(): Promise<ActivitySettingsDTO> {
    return this.repo.getSettings();
  }

  async updateSettings(partial: Partial<ActivitySettingsDTO>): Promise<ActivitySettingsDTO> {
    return this.repo.updateSettings(partial);
  }

  async resetSampleData(): Promise<void> {
    return this.repo.resetSampleData();
  }
}

export const activityService = new ActivityService();
