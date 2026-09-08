import { invoke } from '@tauri-apps/api/core';
import { activityLocationService } from '@backend/services/activityLocationService';
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
} from '@backend/models/activityLocationTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const activityApi = {
  // ─── Activity Monitoring ──────────────────────────────────────────────────

  listActivityRecords: async (filter?: ActivityFilter): Promise<ActivityRecord[]> => {
    if (isTauri) {
      try {
        return await invoke<ActivityRecord[]>('list_activity_records', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_activity_records failed, using fallback:', e);
      }
    }
    return activityLocationService.listActivityRecords(filter);
  },

  getActivityRecord: async (id: string): Promise<ActivityRecord> => {
    if (isTauri) {
      try {
        return await invoke<ActivityRecord>('get_activity_record', { id });
      } catch (e) {
        console.warn('Tauri invoke get_activity_record failed, using fallback:', e);
      }
    }
    const record = activityLocationService.getActivityRecord(id);
    if (!record) throw new Error(`Activity record '${id}' not found`);
    return record;
  },

  logActivityRecord: async (record: ActivityRecord): Promise<ActivityRecord> => {
    if (isTauri) {
      try {
        return await invoke<ActivityRecord>('log_activity_record', { record });
      } catch (e) {
        console.warn('Tauri invoke log_activity_record failed, using fallback:', e);
      }
    }
    return activityLocationService.logActivityRecord(record);
  },

  getActivitySummary: async (): Promise<ActivitySummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<ActivitySummaryDTO>('get_activity_summary');
      } catch (e) {
        console.warn('Tauri invoke get_activity_summary failed, using fallback:', e);
      }
    }
    return activityLocationService.getActivitySummary();
  },

  // ─── Screenshots ──────────────────────────────────────────────────────────

  listScreenshots: async (memberId?: string, date?: string): Promise<ScreenshotItemDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ScreenshotItemDTO[]>('list_screenshots', {
          memberId: memberId || null,
          date: date || null,
        });
      } catch (e) {
        console.warn('Tauri invoke list_screenshots failed, using fallback:', e);
      }
    }
    return activityLocationService.listScreenshots(memberId, date);
  },

  captureScreenshot: async (payload: CreateScreenshotPayload): Promise<ScreenshotItemDTO> => {
    if (isTauri) {
      try {
        return await invoke<ScreenshotItemDTO>('capture_screenshot', { payload });
      } catch (e) {
        console.warn('Tauri invoke capture_screenshot failed, using fallback:', e);
      }
    }
    return activityLocationService.captureScreenshot(payload);
  },

  deleteScreenshot: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_screenshot', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_screenshot failed, using fallback:', e);
      }
    }
    activityLocationService.deleteScreenshot(id);
  },

  // ─── Location & GPS ───────────────────────────────────────────────────────

  listMemberLocations: async (): Promise<MemberLocationDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<MemberLocationDTO[]>('list_member_locations');
      } catch (e) {
        console.warn('Tauri invoke list_member_locations failed, using fallback:', e);
      }
    }
    return activityLocationService.listMemberLocations();
  },

  getMemberLocation: async (id: string): Promise<MemberLocationDTO> => {
    if (isTauri) {
      try {
        return await invoke<MemberLocationDTO>('get_member_location', { id });
      } catch (e) {
        console.warn('Tauri invoke get_member_location failed, using fallback:', e);
      }
    }
    const loc = activityLocationService.getMemberLocation(id);
    if (!loc) throw new Error(`Location for member '${id}' not found`);
    return loc;
  },

  updateMemberLocation: async (
    id: string,
    payload: UpdateMemberLocationPayload
  ): Promise<MemberLocationDTO> => {
    if (isTauri) {
      try {
        return await invoke<MemberLocationDTO>('update_member_location', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_member_location failed, using fallback:', e);
      }
    }
    return activityLocationService.updateMemberLocation(id, payload);
  },

  // ─── Geofencing ───────────────────────────────────────────────────────────

  listGeofences: async (): Promise<GeofenceZoneDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<GeofenceZoneDTO[]>('list_geofences');
      } catch (e) {
        console.warn('Tauri invoke list_geofences failed, using fallback:', e);
      }
    }
    return activityLocationService.listGeofences();
  },

  createGeofence: async (payload: CreateGeofencePayload): Promise<GeofenceZoneDTO> => {
    if (isTauri) {
      try {
        return await invoke<GeofenceZoneDTO>('create_geofence', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_geofence failed, using fallback:', e);
      }
    }
    return activityLocationService.createGeofence(payload);
  },

  deleteGeofence: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_geofence', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_geofence failed, using fallback:', e);
      }
    }
    activityLocationService.deleteGeofence(id);
  },

  // ─── Settings ─────────────────────────────────────────────────────────────

  getActivitySettings: async (): Promise<ActivitySettingsDTO> => {
    if (isTauri) {
      try {
        return await invoke<ActivitySettingsDTO>('get_activity_settings');
      } catch (e) {
        console.warn('Tauri invoke get_activity_settings failed, using fallback:', e);
      }
    }
    return activityLocationService.getSettings();
  },

  updateActivitySettings: async (settings: ActivitySettingsDTO): Promise<ActivitySettingsDTO> => {
    if (isTauri) {
      try {
        return await invoke<ActivitySettingsDTO>('update_activity_settings', { settings });
      } catch (e) {
        console.warn('Tauri invoke update_activity_settings failed, using fallback:', e);
      }
    }
    return activityLocationService.updateSettings(settings);
  },
};
