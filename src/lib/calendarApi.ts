import { invoke } from '@tauri-apps/api/core';
import { calendarService } from '@backend/services/calendarService';
import type {
  CalendarTask,
  CalendarFilter,
  CreateCalendarTaskPayload,
  UpdateCalendarTaskPayload,
  MoveCalendarTaskPayload,
  CalendarDaySummary,
  CalendarSettings,
  ProjectItem,
  TagItem,
} from '@/types/calendar';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const calendarApi = {
  listTasks: async (filter?: CalendarFilter): Promise<CalendarTask[]> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask[]>('list_calendar_tasks', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_calendar_tasks failed, using fallback:', e);
      }
    }
    return calendarService.listTasks(filter);
  },

  getTask: async (id: string): Promise<CalendarTask> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask>('get_calendar_task', { id });
      } catch (e) {
        console.warn('Tauri invoke get_calendar_task failed, using fallback:', e);
      }
    }
    const task = calendarService.getTask(id);
    if (!task) throw new Error(`Task '${id}' not found`);
    return task;
  },

  createTask: async (payload: CreateCalendarTaskPayload): Promise<CalendarTask> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask>('create_calendar_task', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_calendar_task failed, using fallback:', e);
      }
    }
    return calendarService.createTask(payload);
  },

  updateTask: async (id: string, payload: UpdateCalendarTaskPayload): Promise<CalendarTask> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask>('update_calendar_task', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_calendar_task failed, using fallback:', e);
      }
    }
    return calendarService.updateTask(id, payload);
  },

  deleteTask: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        return await invoke<void>('delete_calendar_task', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_calendar_task failed, using fallback:', e);
      }
    }
    calendarService.deleteTask(id);
  },

  duplicateTask: async (id: string): Promise<CalendarTask> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask>('duplicate_calendar_task', { id });
      } catch (e) {
        console.warn('Tauri invoke duplicate_calendar_task failed, using fallback:', e);
      }
    }
    return calendarService.duplicateTask(id);
  },

  moveTask: async (id: string, payload: MoveCalendarTaskPayload): Promise<CalendarTask> => {
    if (isTauri) {
      try {
        return await invoke<CalendarTask>('move_calendar_task', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke move_calendar_task failed, using fallback:', e);
      }
    }
    return calendarService.moveTask(id, payload.date, payload.start_time, payload.end_time);
  },

  getDaySummaries: async (
    startDate: string,
    endDate: string,
    memberId?: string
  ): Promise<CalendarDaySummary[]> => {
    if (isTauri) {
      try {
        return await invoke<CalendarDaySummary[]>('get_calendar_day_summaries', {
          startDate,
          endDate,
          memberId: memberId || null,
        });
      } catch (e) {
        console.warn('Tauri invoke get_calendar_day_summaries failed, using fallback:', e);
      }
    }
    const map = calendarService.getDaySummaries(startDate, endDate, memberId);
    return Object.values(map);
  },

  getSettings: async (): Promise<CalendarSettings> => {
    if (isTauri) {
      try {
        return await invoke<CalendarSettings>('get_calendar_settings');
      } catch (e) {
        console.warn('Tauri invoke get_calendar_settings failed, using fallback:', e);
      }
    }
    return calendarService.getSettings();
  },

  updateSettings: async (settings: CalendarSettings): Promise<CalendarSettings> => {
    if (isTauri) {
      try {
        return await invoke<CalendarSettings>('update_calendar_settings', { settings });
      } catch (e) {
        console.warn('Tauri invoke update_calendar_settings failed, using fallback:', e);
      }
    }
    return calendarService.updateSettings(settings);
  },

  listProjects: async (): Promise<ProjectItem[]> => {
    if (isTauri) {
      try {
        return await invoke<ProjectItem[]>('list_calendar_projects');
      } catch (e) {
        console.warn('Tauri invoke list_calendar_projects failed, using fallback:', e);
      }
    }
    return calendarService.listProjects();
  },

  createProject: async (name: string, color: string, clientName?: string, isBillable = true): Promise<ProjectItem> => {
    if (isTauri) {
      try {
        return await invoke<ProjectItem>('create_calendar_project', {
          name,
          color,
          clientName: clientName || null,
          isBillable,
        });
      } catch (e) {
        console.warn('Tauri invoke create_calendar_project failed, using fallback:', e);
      }
    }
    return calendarService.createProject(name, color, clientName, isBillable);
  },

  deleteProject: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_calendar_project', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_calendar_project failed, using fallback:', e);
      }
    }
    calendarService.deleteProject(id);
  },

  listTags: async (): Promise<TagItem[]> => {
    if (isTauri) {
      try {
        return await invoke<TagItem[]>('list_calendar_tags');
      } catch (e) {
        console.warn('Tauri invoke list_calendar_tags failed, using fallback:', e);
      }
    }
    return calendarService.listTags();
  },

  createTag: async (name: string): Promise<TagItem> => {
    if (isTauri) {
      try {
        return await invoke<TagItem>('create_calendar_tag', { name });
      } catch (e) {
        console.warn('Tauri invoke create_calendar_tag failed, using fallback:', e);
      }
    }
    return calendarService.createTag(name);
  },

  deleteTag: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_calendar_tag', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_calendar_tag failed, using fallback:', e);
      }
    }
    calendarService.deleteTag(id);
  },

  getMonthSummary: async (yearMonth: string, memberId?: string) => {
    if (isTauri) {
      try {
        return await invoke('get_calendar_month_summary', {
          yearMonth,
          memberId: memberId || null,
        });
      } catch (e) {
        console.warn('Tauri invoke get_calendar_month_summary failed, using fallback:', e);
      }
    }
    return calendarService.getMonthSummary(yearMonth, memberId);
  },

  exportCalendarICS: async (memberId?: string): Promise<string> => {
    if (isTauri) {
      try {
        return await invoke<string>('export_calendar_ics', {
          memberId: memberId || null,
        });
      } catch (e) {
        console.warn('Tauri invoke export_calendar_ics failed, using fallback:', e);
      }
    }
    return calendarService.exportCalendarICS(memberId);
  },

  listMembers: async () => {
    if (isTauri) {
      try {
        return await invoke<any[]>('list_team_members');
      } catch (e) {
        console.warn('Tauri invoke list_team_members failed, using fallback:', e);
      }
    }
    return calendarService.listMembers();
  },
};

