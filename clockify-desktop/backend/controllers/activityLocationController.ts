import { activityLocationService } from '../services/activityLocationService';
import type {
  ActivityFilter,
  ActivityRecord,
  CreateScreenshotPayload,
  UpdateMemberLocationPayload,
  CreateGeofencePayload,
  ActivitySettingsDTO,
} from '../models/activityLocationTypes';

export class ActivityLocationController {
  // ─── Activity Monitoring ──────────────────────────────────────────────────

  static listActivityRecords(filter?: ActivityFilter) {
    try {
      const data = activityLocationService.listActivityRecords(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getActivityRecord(id: string) {
    try {
      const record = activityLocationService.getActivityRecord(id);
      if (!record) {
        return { success: false, error: `Activity record '${id}' not found` };
      }
      return { success: true, data: record };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static logActivityRecord(payload: Omit<ActivityRecord, 'id' | 'recorded_at'> & { id?: string }) {
    try {
      const data = activityLocationService.logActivityRecord(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getActivitySummary() {
    try {
      const data = activityLocationService.getActivitySummary();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // ─── Screenshots ──────────────────────────────────────────────────────────

  static listScreenshots(memberId?: string, date?: string) {
    try {
      const data = activityLocationService.listScreenshots(memberId, date);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getScreenshot(id: string) {
    try {
      const screenshot = activityLocationService.getScreenshot(id);
      if (!screenshot) {
        return { success: false, error: `Screenshot '${id}' not found` };
      }
      return { success: true, data: screenshot };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static captureScreenshot(payload: CreateScreenshotPayload) {
    try {
      const data = activityLocationService.captureScreenshot(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteScreenshot(id: string) {
    try {
      activityLocationService.deleteScreenshot(id);
      return { success: true, message: `Screenshot '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // ─── Location & GPS ───────────────────────────────────────────────────────

  static listMemberLocations() {
    try {
      const data = activityLocationService.listMemberLocations();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getMemberLocation(id: string) {
    try {
      const location = activityLocationService.getMemberLocation(id);
      if (!location) {
        return { success: false, error: `Member location for '${id}' not found` };
      }
      return { success: true, data: location };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateMemberLocation(id: string, payload: UpdateMemberLocationPayload) {
    try {
      const data = activityLocationService.updateMemberLocation(id, payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // ─── Geofencing ───────────────────────────────────────────────────────────

  static listGeofences() {
    try {
      const data = activityLocationService.listGeofences();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createGeofence(payload: CreateGeofencePayload) {
    try {
      const data = activityLocationService.createGeofence(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteGeofence(id: string) {
    try {
      activityLocationService.deleteGeofence(id);
      return { success: true, message: `Geofence '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  static getSettings() {
    try {
      const data = activityLocationService.getSettings();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateSettings(partial: Partial<ActivitySettingsDTO>) {
    try {
      const data = activityLocationService.updateSettings(partial);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}
