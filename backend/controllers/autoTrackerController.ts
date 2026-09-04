import { autoTrackerService } from '../services/autoTrackerService';
import type {
  LogActivityPayload,
  UpdateSuggestedProjectPayload,
} from '../models/autoTrackerTypes';

export class AutoTrackerController {
  static listActivities() {
    try {
      const list = autoTrackerService.listActivities();
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static toggleRecording() {
    try {
      const recording = autoTrackerService.toggleRecording();
      return { success: true, data: { is_recording: recording } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getStatus() {
    try {
      const status = autoTrackerService.getStatus();
      return { success: true, data: status };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static logActivity(payload: LogActivityPayload) {
    try {
      const logged = autoTrackerService.logActivity(payload);
      return { success: true, data: logged };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static logAllActivities() {
    try {
      const logged = autoTrackerService.logAllActivities();
      return { success: true, data: logged };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static discardActivity(id: string) {
    try {
      const deleted = autoTrackerService.discardActivity(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateSuggestedProject(payload: UpdateSuggestedProjectPayload) {
    try {
      const updated = autoTrackerService.updateSuggestedProject(payload);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
