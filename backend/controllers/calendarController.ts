import { calendarService } from '../services/calendarService';
import type {
  CalendarFilter,
  CreateCalendarTaskPayload,
  UpdateCalendarTaskPayload,
  CalendarSettings,
} from '../models/calendarTypes';

export class CalendarController {
  static listTasks(filter?: CalendarFilter) {
    try {
      const data = calendarService.listTasks(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getTask(id: string) {
    try {
      const task = calendarService.getTask(id);
      if (!task) {
        return { success: false, error: `Calendar task '${id}' not found` };
      }
      return { success: true, data: task };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createTask(payload: CreateCalendarTaskPayload) {
    try {
      const data = calendarService.createTask(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateTask(id: string, payload: UpdateCalendarTaskPayload) {
    try {
      const data = calendarService.updateTask(id, payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteTask(id: string) {
    try {
      calendarService.deleteTask(id);
      return { success: true, message: `Task '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static duplicateTask(id: string) {
    try {
      const data = calendarService.duplicateTask(id);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static moveTask(id: string, date: string, startTime: string, endTime: string) {
    try {
      const data = calendarService.moveTask(id, date, startTime, endTime);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getDaySummaries(startDate: string, endDate: string, memberId?: string) {
    try {
      const data = calendarService.getDaySummaries(startDate, endDate, memberId);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getSettings() {
    try {
      const data = calendarService.getSettings();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateSettings(settings: Partial<CalendarSettings>) {
    try {
      const data = calendarService.updateSettings(settings);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static listProjects() {
    try {
      const data = calendarService.listProjects();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createProject(name: string, color: string, clientName?: string, isBillable = true) {
    try {
      const data = calendarService.createProject(name, color, clientName, isBillable);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static listTags() {
    try {
      const data = calendarService.listTags();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createTag(name: string) {
    try {
      const data = calendarService.createTag(name);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}
