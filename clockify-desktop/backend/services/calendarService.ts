import seedData from '../data/seedData.json';
import type {
  CalendarTask,
  CalendarFilter,
  CreateCalendarTaskPayload,
  UpdateCalendarTaskPayload,
  CalendarSettings,
  ProjectItem,
  TagItem,
  CalendarDaySummary,
} from '../models/calendarTypes';

function calculateDurationMinutes(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return 0;
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;
  return Math.max(0, endTotal - startTotal);
}

class CalendarService {
  private tasks: CalendarTask[] = [];
  private projects: ProjectItem[] = [];
  private tags: TagItem[] = [];
  private settings: CalendarSettings;

  constructor() {
    // Clone initial seed data
    const rawData = seedData as any;
    this.tasks = JSON.parse(JSON.stringify(rawData.calendar_tasks || []));
    this.projects = JSON.parse(JSON.stringify(rawData.projects || []));
    this.tags = JSON.parse(JSON.stringify(rawData.tags || []));
    this.settings = JSON.parse(
      JSON.stringify(
        rawData.calendar_settings || {
          week_start: 'monday',
          time_format: '24h',
          default_duration: 30,
          show_weekends: true,
          working_hours_start: '09:00',
          working_hours_end: '18:00',
        }
      )
    );
  }

  // --- Task Methods ---

  public listTasks(filter?: CalendarFilter): CalendarTask[] {
    return this.tasks.filter((task) => {
      if (filter?.start_date && task.date < filter.start_date) return false;
      if (filter?.end_date && task.date > filter.end_date) return false;
      if (filter?.member_id && task.member_id !== filter.member_id) return false;
      if (filter?.project_id && task.project_id !== filter.project_id) return false;
      if (filter?.entry_type && task.entry_type !== filter.entry_type) return false;
      if (filter?.is_billable !== undefined && task.is_billable !== filter.is_billable) return false;
      return true;
    });
  }

  public getTask(id: string): CalendarTask | null {
    const task = this.tasks.find((t) => t.id === id);
    return task ? { ...task } : null;
  }

  public createTask(payload: CreateCalendarTaskPayload): CalendarTask {
    const duration =
      payload.duration_minutes !== undefined && payload.duration_minutes !== null
        ? payload.duration_minutes
        : calculateDurationMinutes(payload.start_time, payload.end_time);

    // Resolve project details if project_id provided
    let projectName = payload.project_name || 'No Project';
    let projectColor = payload.project_color || '#03a9f4';
    let clientName = payload.client_name || null;

    if (payload.project_id) {
      const proj = this.projects.find((p) => p.id === payload.project_id);
      if (proj) {
        projectName = proj.name;
        projectColor = proj.color;
        clientName = proj.client_name || null;
      }
    }

    const newTask: CalendarTask = {
      id: `ct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: payload.title.trim() || '(No details)',
      project_id: payload.project_id || null,
      project_name: projectName,
      project_color: projectColor,
      client_name: clientName,
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      duration_minutes: duration,
      is_billable: payload.is_billable !== undefined ? payload.is_billable : true,
      tags: payload.tags || [],
      entry_type: payload.entry_type || 'entry',
      member_id: payload.member_id,
      status: payload.status || (payload.entry_type === 'planned' ? 'planned' : 'completed'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    return { ...newTask };
  }

  public updateTask(id: string, payload: UpdateCalendarTaskPayload): CalendarTask {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error(`Calendar task with ID '${id}' not found`);
    }

    const existing = this.tasks[idx];
    const startTime = payload.start_time !== undefined ? payload.start_time : existing.start_time;
    const endTime = payload.end_time !== undefined ? payload.end_time : existing.end_time;
    const duration =
      payload.duration_minutes !== undefined
        ? payload.duration_minutes
        : calculateDurationMinutes(startTime, endTime);

    let projectName = payload.project_name !== undefined ? payload.project_name : existing.project_name;
    let projectColor = payload.project_color !== undefined ? payload.project_color : existing.project_color;
    let clientName = payload.client_name !== undefined ? payload.client_name : existing.client_name;

    if (payload.project_id) {
      const proj = this.projects.find((p) => p.id === payload.project_id);
      if (proj) {
        projectName = proj.name;
        projectColor = proj.color;
        clientName = proj.client_name || null;
      }
    }

    const updated: CalendarTask = {
      ...existing,
      title: payload.title !== undefined ? payload.title.trim() : existing.title,
      project_id: payload.project_id !== undefined ? payload.project_id : existing.project_id,
      project_name: projectName,
      project_color: projectColor,
      client_name: clientName,
      date: payload.date !== undefined ? payload.date : existing.date,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: duration,
      is_billable: payload.is_billable !== undefined ? payload.is_billable : existing.is_billable,
      tags: payload.tags !== undefined ? payload.tags : existing.tags,
      entry_type: payload.entry_type !== undefined ? payload.entry_type : existing.entry_type,
      member_id: payload.member_id !== undefined ? payload.member_id : existing.member_id,
      status: payload.status !== undefined ? payload.status : existing.status,
      updated_at: new Date().toISOString(),
    };

    this.tasks[idx] = updated;
    return { ...updated };
  }

  public deleteTask(id: string): void {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error(`Calendar task with ID '${id}' not found`);
    }
    this.tasks.splice(idx, 1);
  }

  public duplicateTask(id: string): CalendarTask {
    const existing = this.getTask(id);
    if (!existing) {
      throw new Error(`Task with ID '${id}' not found`);
    }

    const newTask: CalendarTask = {
      ...existing,
      id: `ct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: `${existing.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    return { ...newTask };
  }

  public moveTask(id: string, date: string, startTime: string, endTime: string): CalendarTask {
    const duration = calculateDurationMinutes(startTime, endTime);
    return this.updateTask(id, {
      date,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: duration,
    });
  }

  // --- Day / Week Summaries ---

  public getDaySummaries(startDate: string, endDate: string, memberId?: string): Record<string, CalendarDaySummary> {
    const filtered = this.listTasks({
      start_date: startDate,
      end_date: endDate,
      member_id: memberId,
    });

    const summaryMap: Record<string, CalendarDaySummary> = {};

    for (const t of filtered) {
      if (!summaryMap[t.date]) {
        summaryMap[t.date] = {
          date: t.date,
          total_tracked_minutes: 0,
          total_planned_minutes: 0,
          task_count: 0,
        };
      }
      summaryMap[t.date].task_count += 1;
      if (t.entry_type === 'entry') {
        summaryMap[t.date].total_tracked_minutes += t.duration_minutes;
      } else {
        summaryMap[t.date].total_planned_minutes += t.duration_minutes;
      }
    }

    return summaryMap;
  }

  // --- Settings ---

  public getSettings(): CalendarSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<CalendarSettings>): CalendarSettings {
    this.settings = { ...this.settings, ...partial };
    return { ...this.settings };
  }

  // --- Projects & Tags ---

  public listProjects(): ProjectItem[] {
    return [...this.projects];
  }

  public createProject(name: string, color: string, clientName?: string, isBillable = true): ProjectItem {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      name,
      client_name: clientName || null,
      color,
      is_billable: isBillable,
    };
    this.projects.push(newProj);
    return { ...newProj };
  }

  public deleteProject(id: string): void {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Project with ID '${id}' not found`);
    }
    this.projects.splice(idx, 1);
  }

  public listTags(): TagItem[] {
    return [...this.tags];
  }

  public createTag(name: string): TagItem {
    const existing = this.tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const newTag: TagItem = {
      id: `tag_${Date.now()}`,
      name,
    };
    this.tags.push(newTag);
    return { ...newTag };
  }

  public deleteTag(id: string): void {
    const idx = this.tags.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error(`Tag with ID '${id}' not found`);
    }
    this.tags.splice(idx, 1);
  }

  public getMonthSummary(yearMonth: string, memberId?: string) {
    const tasks = this.tasks.filter((t) => {
      if (!t.date.startsWith(yearMonth)) return false;
      if (memberId && t.member_id !== memberId) return false;
      return true;
    });

    let totalTracked = 0;
    let totalPlanned = 0;
    const daysSet = new Set<string>();

    for (const t of tasks) {
      daysSet.add(t.date);
      if (t.entry_type === 'entry') {
        totalTracked += t.duration_minutes;
      } else {
        totalPlanned += t.duration_minutes;
      }
    }

    return {
      month: yearMonth,
      total_tracked_minutes: totalTracked,
      total_planned_minutes: totalPlanned,
      total_tasks: tasks.length,
      days_with_entries: daysSet.size,
    };
  }

  public exportCalendarICS(memberId?: string): string {
    const filtered = memberId ? this.tasks.filter((t) => t.member_id === memberId) : this.tasks;
    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Clockify Desktop//Calendar//EN\r\nCALSCALE:GREGORIAN\r\n";

    for (const t of filtered) {
      const dateClean = t.date.replace(/-/g, '');
      const startClean = t.start_time.replace(/:/g, '');
      const endClean = t.end_time.replace(/:/g, '');

      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:${t.id}\r\n`;
      ics += `DTSTART:${dateClean}T${startClean}00Z\r\n`;
      ics += `DTEND:${dateClean}T${endClean}00Z\r\n`;
      ics += `SUMMARY:${t.title}\r\n`;
      ics += `DESCRIPTION:Project: ${t.project_name} | Billable: ${t.is_billable}\r\n`;
      ics += "STATUS:CONFIRMED\r\n";
      ics += "END:VEVENT\r\n";
    }

    ics += "END:VCALENDAR\r\n";
    return ics;
  }

  public listMembers() {
    const rawData = seedData as any;
    return rawData.members || [];
  }

  public resetSampleData(): void {
    const rawData = seedData as any;
    this.tasks = JSON.parse(JSON.stringify(rawData.calendar_tasks || []));
    this.projects = JSON.parse(JSON.stringify(rawData.projects || []));
    this.tags = JSON.parse(JSON.stringify(rawData.tags || []));
  }
}

export const calendarService = new CalendarService();

