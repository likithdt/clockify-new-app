import { invoke } from '@tauri-apps/api/core';
import { autoTrackerService } from '../../backend/services/autoTrackerService';
import type {
  DetectedActivityDTO,
  AutoTrackerStatusDTO,
  LogActivityPayload,
  UpdateSuggestedProjectPayload,
} from '../../backend/models/autoTrackerTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const autoTrackerApi = {
  listActivities: async (): Promise<DetectedActivityDTO[]> => {
    if (isTauri) {
      try {
        const raw = await invoke<any[]>('list_autotracker_activities');
        return raw.map((a) => ({
          id: a.id,
          app: a.app,
          window_title: a.window_title,
          icon_type: a.icon_type,
          suggested_project: a.suggested_project,
          project_color: a.project_color,
          start_time: a.start_time,
          end_time: a.end_time,
          duration_minutes: a.duration_minutes,
          duration_seconds: a.duration_seconds,
          is_logged: a.is_logged,
          date: a.date,
        }));
      } catch (e) {
        console.warn('Tauri invoke list_autotracker_activities failed, using fallback:', e);
      }
    }
    return autoTrackerService.listActivities();
  },

  toggleRecording: async (): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('toggle_autotracker_recording');
      } catch (e) {
        console.warn('Tauri invoke toggle_autotracker_recording failed, using fallback:', e);
      }
    }
    return autoTrackerService.toggleRecording();
  },

  getStatus: async (): Promise<AutoTrackerStatusDTO> => {
    if (isTauri) {
      try {
        const res = await invoke<any>('get_autotracker_status');
        return {
          is_recording: res.is_recording,
          active_app: res.active_app,
          active_window: res.active_window,
          idle_seconds: res.idle_seconds,
          recorded_today_seconds: res.recorded_today_seconds,
          pending_activities_count: res.pending_activities_count,
        };
      } catch (e) {
        console.warn('Tauri invoke get_autotracker_status failed, using fallback:', e);
      }
    }
    return autoTrackerService.getStatus();
  },

  logActivity: async (payload: LogActivityPayload): Promise<DetectedActivityDTO> => {
    if (isTauri) {
      try {
        return await invoke<DetectedActivityDTO>('log_autotracker_activity', {
          payload: {
            activity_id: payload.activity_id,
            project_name: payload.project_name || null,
            project_color: payload.project_color || null,
            is_billable: payload.is_billable ?? null,
          },
        });
      } catch (e) {
        console.warn('Tauri invoke log_autotracker_activity failed, using fallback:', e);
      }
    }
    return autoTrackerService.logActivity(payload);
  },

  logAllActivities: async (): Promise<DetectedActivityDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<DetectedActivityDTO[]>('log_all_autotracker_activities');
      } catch (e) {
        console.warn('Tauri invoke log_all_autotracker_activities failed, using fallback:', e);
      }
    }
    return autoTrackerService.logAllActivities();
  },

  discardActivity: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('discard_autotracker_activity', { id });
      } catch (e) {
        console.warn('Tauri invoke discard_autotracker_activity failed, using fallback:', e);
      }
    }
    return autoTrackerService.discardActivity(id);
  },

  updateSuggestedProject: async (payload: UpdateSuggestedProjectPayload): Promise<DetectedActivityDTO> => {
    if (isTauri) {
      try {
        return await invoke<DetectedActivityDTO>('update_autotracker_project', {
          payload: {
            activity_id: payload.activity_id,
            suggested_project: payload.suggested_project,
            project_color: payload.project_color,
          },
        });
      } catch (e) {
        console.warn('Tauri invoke update_autotracker_project failed, using fallback:', e);
      }
    }
    return autoTrackerService.updateSuggestedProject(payload);
  },
};
