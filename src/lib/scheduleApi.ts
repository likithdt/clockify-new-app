import { invoke } from '@tauri-apps/api/core';
import { scheduleService } from '@backend/services/scheduleService';
import type {
  ScheduleAssignmentDTO,
  CreateScheduleAssignmentPayload,
  UpdateScheduleAssignmentPayload,
  ScheduleFilter,
  ScheduleSummaryDTO,
} from '@backend/models/scheduleTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const scheduleApi = {
  listAssignments: async (filter?: ScheduleFilter): Promise<ScheduleAssignmentDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleAssignmentDTO[]>('list_schedule_assignments', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_schedule_assignments failed, using fallback:', e);
      }
    }
    return scheduleService.listAssignments(filter);
  },

  getAssignment: async (id: string): Promise<ScheduleAssignmentDTO> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleAssignmentDTO>('get_schedule_assignment', { id });
      } catch (e) {
        console.warn('Tauri invoke get_schedule_assignment failed, using fallback:', e);
      }
    }
    const a = scheduleService.getAssignment(id);
    if (!a) throw new Error(`Assignment '${id}' not found`);
    return a;
  },

  createAssignment: async (payload: CreateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleAssignmentDTO>('create_schedule_assignment', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_schedule_assignment failed, using fallback:', e);
      }
    }
    return scheduleService.createAssignment(payload);
  },

  updateAssignment: async (id: string, payload: UpdateScheduleAssignmentPayload): Promise<ScheduleAssignmentDTO> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleAssignmentDTO>('update_schedule_assignment', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_schedule_assignment failed, using fallback:', e);
      }
    }
    return scheduleService.updateAssignment(id, payload);
  },

  deleteAssignment: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_schedule_assignment', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_schedule_assignment failed, using fallback:', e);
      }
    }
    return scheduleService.deleteAssignment(id);
  },

  togglePublish: async (): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('toggle_schedule_publish');
      } catch (e) {
        console.warn('Tauri invoke toggle_schedule_publish failed, using fallback:', e);
      }
    }
    return scheduleService.togglePublish();
  },

  removeSampleSchedule: async (): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('remove_sample_schedule');
        return;
      } catch (e) {
        console.warn('Tauri invoke remove_sample_schedule failed, using fallback:', e);
      }
    }
    scheduleService.removeSampleData();
  },

  restoreSampleSchedule: async (): Promise<ScheduleAssignmentDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleAssignmentDTO[]>('restore_sample_schedule');
      } catch (e) {
        console.warn('Tauri invoke restore_sample_schedule failed, using fallback:', e);
      }
    }
    scheduleService.restoreSampleData();
    return scheduleService.listAssignments();
  },

  getSummary: async (): Promise<ScheduleSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<ScheduleSummaryDTO>('get_schedule_summary');
      } catch (e) {
        console.warn('Tauri invoke get_schedule_summary failed, using fallback:', e);
      }
    }
    return scheduleService.getSummary();
  },
};
