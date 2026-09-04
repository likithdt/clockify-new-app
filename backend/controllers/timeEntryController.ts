import { timeEntryService } from '../services/timeEntryService';
import type {
  CreateTimeEntryPayload,
  UpdateTimeEntryPayload,
  TimeEntryFilter,
} from '../models/timeEntryTypes';

export class TimeEntryController {
  static listEntries(filter?: TimeEntryFilter) {
    try {
      const list = timeEntryService.listEntries(filter);
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getEntry(id: string) {
    try {
      const entry = timeEntryService.getEntry(id);
      if (!entry) return { success: false, error: `Time entry '${id}' not found` };
      return { success: true, data: entry };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static createEntry(payload: CreateTimeEntryPayload) {
    try {
      const entry = timeEntryService.createEntry(payload);
      return { success: true, data: entry };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateEntry(id: string, payload: UpdateTimeEntryPayload) {
    try {
      const updated = timeEntryService.updateEntry(id, payload);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteEntry(id: string) {
    try {
      const deleted = timeEntryService.deleteEntry(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static startTimer(
    description?: string,
    projectName?: string,
    projectColor?: string,
    isBillable?: boolean
  ) {
    try {
      const status = timeEntryService.startTimer(description, projectName, projectColor, isBillable);
      return { success: true, data: status };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static stopTimer() {
    try {
      const entry = timeEntryService.stopTimer();
      return { success: true, data: entry };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getTimerStatus() {
    try {
      const status = timeEntryService.getTimerStatus();
      return { success: true, data: status };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary(filter?: TimeEntryFilter) {
    try {
      const summary = timeEntryService.getSummary(filter);
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
