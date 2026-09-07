import { scheduleService } from '../services/scheduleService';
import type {
  CreateScheduleAssignmentPayload,
  UpdateScheduleAssignmentPayload,
  ScheduleFilter,
} from '../models/scheduleTypes';

export class ScheduleController {
  static listAssignments(filter?: ScheduleFilter) {
    try {
      const list = scheduleService.listAssignments(filter);
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getAssignment(id: string) {
    try {
      const assignment = scheduleService.getAssignment(id);
      if (!assignment) return { success: false, error: `Assignment '${id}' not found` };
      return { success: true, data: assignment };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static createAssignment(payload: CreateScheduleAssignmentPayload) {
    try {
      if (!payload.project_name || !payload.member_name) {
        return { success: false, error: 'Project and member are required' };
      }
      const created = scheduleService.createAssignment(payload);
      return { success: true, data: created };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateAssignment(id: string, payload: UpdateScheduleAssignmentPayload) {
    try {
      const updated = scheduleService.updateAssignment(id, payload);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteAssignment(id: string) {
    try {
      const deleted = scheduleService.deleteAssignment(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static togglePublish() {
    try {
      const status = scheduleService.togglePublish();
      return { success: true, data: { is_published: status } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static removeSampleData() {
    try {
      scheduleService.removeSampleData();
      return { success: true, message: 'Sample schedule assignments removed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static restoreSampleData() {
    try {
      const list = scheduleService.restoreSampleData();
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = scheduleService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
