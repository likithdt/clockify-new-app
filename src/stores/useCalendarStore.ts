import { create } from 'zustand';
import { calendarApi } from '@/lib/calendarApi';
import { timeOffService } from '@backend/services/timeOffService';
import type {
  CalendarTask,
  CalendarSettings,
  ProjectItem,
  TagItem,
  CreateCalendarTaskPayload,
  UpdateCalendarTaskPayload,
  CalendarViewMode,
} from '@/types/calendar';
import type { TeamMember } from '@/types/timeoff';

interface DraftSlot {
  date: string;
  startTime: string;
  endTime: string;
  entryType?: 'entry' | 'planned';
}

interface CalendarStoreState {
  viewMode: CalendarViewMode;
  selectedDate: string; // "YYYY-MM-DD"
  selectedMemberId: string | null;
  selectedProjectId: string | null;
  zoomLevel: number; // 1 to 4

  tasks: CalendarTask[];
  projects: ProjectItem[];
  tags: TagItem[];
  members: TeamMember[];
  settings: CalendarSettings;

  isLoading: boolean;
  error: string | null;

  // Modals
  isCreateModalOpen: boolean;
  isSettingsModalOpen: boolean;
  editingTask: CalendarTask | null;
  draftSlot: DraftSlot | null;

  // Actions
  setViewMode: (mode: CalendarViewMode) => void;
  setSelectedDate: (date: string) => void;
  setSelectedMemberId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;

  goToToday: () => void;
  nextPeriod: () => void;
  prevPeriod: () => void;

  openCreateModal: (slot?: DraftSlot) => void;
  openEditModal: (task: CalendarTask) => void;
  closeModal: () => void;

  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  fetchData: () => Promise<void>;
  createTask: (payload: CreateCalendarTaskPayload) => Promise<CalendarTask>;
  updateTask: (id: string, payload: UpdateCalendarTaskPayload) => Promise<CalendarTask>;
  deleteTask: (id: string) => Promise<void>;
  duplicateTask: (id: string) => Promise<CalendarTask>;
  moveTask: (id: string, date: string, startTime: string, endTime: string) => Promise<CalendarTask>;
  updateSettings: (settings: CalendarSettings) => Promise<void>;
  createProject: (name: string, color: string, clientName?: string) => Promise<ProjectItem>;
  createTag: (name: string) => Promise<TagItem>;
}

// Initial anchor date: 2026-08-31 to match the reference screenshots
const INITIAL_DATE = '2026-08-31';

export const useCalendarStore = create<CalendarStoreState>((set, get) => ({
  viewMode: 'week',
  selectedDate: INITIAL_DATE,
  selectedMemberId: null,
  selectedProjectId: null,
  zoomLevel: 2, // 60px/hr

  tasks: [],
  projects: [],
  tags: [],
  members: [],
  settings: {
    week_start: 'monday',
    time_format: '24h',
    default_duration: 30,
    show_weekends: true,
    working_hours_start: '09:00',
    working_hours_end: '18:00',
  },

  isLoading: false,
  error: null,

  isCreateModalOpen: false,
  isSettingsModalOpen: false,
  editingTask: null,
  draftSlot: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),

  zoomIn: () =>
    set((state) => ({
      zoomLevel: Math.min(4, state.zoomLevel + 1),
    })),
  zoomOut: () =>
    set((state) => ({
      zoomLevel: Math.max(1, state.zoomLevel - 1),
    })),

  goToToday: () => {
    // Navigate to Aug 31, 2026 (or real today)
    set({ selectedDate: INITIAL_DATE });
  },

  nextPeriod: () => {
    const { selectedDate, viewMode } = get();
    const d = new Date(selectedDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else {
      d.setDate(d.getDate() + 7);
    }
    const iso = d.toISOString().split('T')[0];
    set({ selectedDate: iso });
  },

  prevPeriod: () => {
    const { selectedDate, viewMode } = get();
    const d = new Date(selectedDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else {
      d.setDate(d.getDate() - 7);
    }
    const iso = d.toISOString().split('T')[0];
    set({ selectedDate: iso });
  },

  openCreateModal: (slot) =>
    set({
      isCreateModalOpen: true,
      editingTask: null,
      draftSlot: slot || null,
    }),

  openEditModal: (task) =>
    set({
      isCreateModalOpen: true,
      editingTask: task,
      draftSlot: null,
    }),

  closeModal: () =>
    set({
      isCreateModalOpen: false,
      editingTask: null,
      draftSlot: null,
    }),

  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [tasks, projects, tags, settings] = await Promise.all([
        calendarApi.listTasks(),
        calendarApi.listProjects(),
        calendarApi.listTags(),
        calendarApi.getSettings(),
      ]);

      const members = timeOffService.listMembers();

      set({
        tasks: tasks || [],
        projects: projects || [],
        tags: tags || [],
        settings: settings || get().settings,
        members: members || [],
        isLoading: false,
      });
    } catch (err: unknown) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createTask: async (payload) => {
    const task = await calendarApi.createTask(payload);
    set((state) => ({
      tasks: [...state.tasks, task],
      isCreateModalOpen: false,
      draftSlot: null,
    }));
    return task;
  },

  updateTask: async (id, payload) => {
    const updated = await calendarApi.updateTask(id, payload);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      isCreateModalOpen: false,
      editingTask: null,
    }));
    return updated;
  },

  deleteTask: async (id) => {
    await calendarApi.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      isCreateModalOpen: false,
      editingTask: null,
    }));
  },

  duplicateTask: async (id) => {
    const duplicated = await calendarApi.duplicateTask(id);
    set((state) => ({
      tasks: [...state.tasks, duplicated],
    }));
    return duplicated;
  },

  moveTask: async (id, date, startTime, endTime) => {
    const moved = await calendarApi.moveTask(id, {
      date,
      start_time: startTime,
      end_time: endTime,
    });
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? moved : t)),
    }));
    return moved;
  },

  updateSettings: async (settings) => {
    const updated = await calendarApi.updateSettings(settings);
    set({ settings: updated, isSettingsModalOpen: false });
  },

  createProject: async (name, color, clientName) => {
    const proj = await calendarApi.createProject(name, color, clientName);
    set((state) => ({
      projects: [...state.projects, proj],
    }));
    return proj;
  },

  createTag: async (name) => {
    const tag = await calendarApi.createTag(name);
    set((state) => ({
      tags: [...state.tags, tag],
    }));
    return tag;
  },
}));
