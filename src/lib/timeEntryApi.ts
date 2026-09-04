import { invoke } from '@tauri-apps/api/core';
import { timeEntryService } from '@backend/services/timeEntryService';
import type {
  TimeEntryDTO,
  CreateTimeEntryPayload,
  UpdateTimeEntryPayload,
  TimeEntryFilter,
  TimerStatusDTO,
  TimeEntrySummaryDTO,
} from '@backend/models/timeEntryTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const timeEntryApi = {
  listEntries: async (filter?: TimeEntryFilter): Promise<TimeEntryDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntryDTO[]>('list_time_entries', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_time_entries failed, using fallback:', e);
      }
    }
    return timeEntryService.listEntries(filter);
  },

  getEntry: async (id: string): Promise<TimeEntryDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntryDTO>('get_time_entry', { id });
      } catch (e) {
        console.warn('Tauri invoke get_time_entry failed, using fallback:', e);
      }
    }
    const entry = timeEntryService.getEntry(id);
    if (!entry) throw new Error(`Time entry '${id}' not found`);
    return entry;
  },

  createEntry: async (payload: CreateTimeEntryPayload): Promise<TimeEntryDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntryDTO>('create_time_entry', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_time_entry failed, using fallback:', e);
      }
    }
    return timeEntryService.createEntry(payload);
  },

  updateEntry: async (id: string, payload: UpdateTimeEntryPayload): Promise<TimeEntryDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntryDTO>('update_time_entry', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_time_entry failed, using fallback:', e);
      }
    }
    return timeEntryService.updateEntry(id, payload);
  },

  deleteEntry: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_time_entry', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_time_entry failed, using fallback:', e);
      }
    }
    return timeEntryService.deleteEntry(id);
  },

  startTimer: async (
    description?: string,
    projectName?: string,
    projectColor?: string,
    isBillable?: boolean
  ): Promise<TimerStatusDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimerStatusDTO>('start_time_entry_timer', {
          description,
          projectName,
          projectColor,
          isBillable,
        });
      } catch (e) {
        console.warn('Tauri invoke start_time_entry_timer failed, using fallback:', e);
      }
    }
    return timeEntryService.startTimer(description, projectName, projectColor, isBillable);
  },

  stopTimer: async (): Promise<TimeEntryDTO | null> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntryDTO | null>('stop_time_entry_timer');
      } catch (e) {
        console.warn('Tauri invoke stop_time_entry_timer failed, using fallback:', e);
      }
    }
    return timeEntryService.stopTimer();
  },

  getTimerStatus: async (): Promise<TimerStatusDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimerStatusDTO>('get_time_entry_timer_status');
      } catch (e) {
        console.warn('Tauri invoke get_time_entry_timer_status failed, using fallback:', e);
      }
    }
    return timeEntryService.getTimerStatus();
  },

  getSummary: async (filter?: TimeEntryFilter): Promise<TimeEntrySummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<TimeEntrySummaryDTO>('get_time_entry_summary', { filter });
      } catch (e) {
        console.warn('Tauri invoke get_time_entry_summary failed, using fallback:', e);
      }
    }
    return timeEntryService.getSummary(filter);
  },
};
