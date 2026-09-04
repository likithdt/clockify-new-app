import { create } from "zustand";

export interface TimesheetCell {
    seconds: number; // Duration in seconds
    rawInput?: string;
}

export interface TimesheetRow {
    id: string;
    projectId: string | null;
    projectName: string | null;
    projectColor: string | null;
    client: string | null;
    taskId: string | null;
    taskName: string | null;
    description: string;
    isBillable: boolean;
    dayHours: {
        [dateStr: string]: number; // date "YYYY-MM-DD" -> seconds
    };
}

interface TimesheetState {
    isActivated: boolean;
    activeWeekStart: string; // YYYY-MM-DD (Monday)
    selectedTeammateId: string;
    rows: TimesheetRow[];
    templates: { name: string; rows: Omit<TimesheetRow, "id" | "dayHours">[] }[];

    // Actions
    toggleActivate: () => void;
    setActivated: (val: boolean) => void;
    setActiveWeekStart: (startDate: string) => void;
    navigateWeek: (direction: "prev" | "next" | "current") => void;
    setSelectedTeammateId: (id: string) => void;
    addRow: () => void;
    removeRow: (id: string) => void;
    setRowProject: (
        rowId: string,
        projectId: string,
        projectName: string,
        projectColor: string,
        client: string | null
    ) => void;
    setRowTask: (rowId: string, taskId: string, taskName: string) => void;
    setRowDescription: (rowId: string, description: string) => void;
    updateCellTime: (rowId: string, dateStr: string, seconds: number) => void;
    copyLastWeek: () => void;
    saveAsTemplate: () => void;
    clearRow: (rowId: string) => void;
}

// Initial empty row matching TimeSheet.png
const createDefaultRow = (): TimesheetRow => ({
    id: `ts-row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    projectId: null,
    projectName: null,
    projectColor: null,
    client: null,
    taskId: null,
    taskName: null,
    description: "",
    isBillable: true,
    dayHours: {},
});

export const useTimesheetStore = create<TimesheetState>((set, get) => ({
    isActivated: false, // Default is inactive matching TimeSheet.png screenshot!
    activeWeekStart: "2026-08-31", // Monday Aug 31, 2026
    selectedTeammateId: "tm-bindhu",
    rows: [createDefaultRow()],
    templates: [],

    toggleActivate: () => set((state) => ({ isActivated: !state.isActivated })),
    setActivated: (val) => set({ isActivated: val }),

    setActiveWeekStart: (startDate) => set({ activeWeekStart: startDate }),

    navigateWeek: (direction) => {
        if (direction === "current") {
            set({ activeWeekStart: "2026-08-31" });
            return;
        }

        const current = new Date(get().activeWeekStart);
        const daysOffset = direction === "next" ? 7 : -7;
        current.setDate(current.getDate() + daysOffset);

        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        set({ activeWeekStart: `${year}-${month}-${day}` });
    },

    setSelectedTeammateId: (id) => set({ selectedTeammateId: id }),

    addRow: () => {
        set((state) => ({
            rows: [...state.rows, createDefaultRow()],
        }));
    },

    removeRow: (id) => {
        set((state) => {
            const filtered = state.rows.filter((r) => r.id !== id);
            return {
                rows: filtered.length > 0 ? filtered : [createDefaultRow()],
            };
        });
    },

    clearRow: (id) => {
        set((state) => ({
            rows: state.rows.map((r) =>
                r.id === id
                    ? {
                          ...r,
                          projectId: null,
                          projectName: null,
                          projectColor: null,
                          client: null,
                          taskId: null,
                          taskName: null,
                          description: "",
                          dayHours: {},
                      }
                    : r
            ),
        }));
    },

    setRowProject: (rowId, projectId, projectName, projectColor, client) => {
        set((state) => ({
            rows: state.rows.map((r) =>
                r.id === rowId
                    ? {
                          ...r,
                          projectId,
                          projectName,
                          projectColor,
                          client,
                      }
                    : r
            ),
        }));
    },

    setRowTask: (rowId, taskId, taskName) => {
        set((state) => ({
            rows: state.rows.map((r) =>
                r.id === rowId
                    ? {
                          ...r,
                          taskId,
                          taskName,
                      }
                    : r
            ),
        }));
    },

    setRowDescription: (rowId, description) => {
        set((state) => ({
            rows: state.rows.map((r) =>
                r.id === rowId ? { ...r, description } : r
            ),
        }));
    },

    updateCellTime: (rowId, dateStr, seconds) => {
        set((state) => ({
            rows: state.rows.map((r) =>
                r.id === rowId
                    ? {
                          ...r,
                          dayHours: {
                              ...r.dayHours,
                              [dateStr]: Math.max(0, seconds),
                          },
                      }
                    : r
            ),
        }));
    },

    copyLastWeek: () => {
        // Populates sample project rows into current week
        const sampleRow1: TimesheetRow = {
            id: `ts-row-${Date.now()}-1`,
            projectId: "proj-alpha",
            projectName: "[SAMPLE] Project Alpha",
            projectColor: "#F59E0B",
            client: "[SAMPLE] Client B",
            taskId: null,
            taskName: null,
            description: "Frontend Architecture & UI Setup",
            isBillable: true,
            dayHours: {
                "2026-08-31": 28800, // 8h
                "2026-09-01": 28800, // 8h
                "2026-09-02": 28800, // 8h
            },
        };

        const sampleRow2: TimesheetRow = {
            id: `ts-row-${Date.now()}-2`,
            projectId: "proj-beta",
            projectName: "[SAMPLE] Project Beta",
            projectColor: "#EF4444",
            client: "[SAMPLE] Client A",
            taskId: null,
            taskName: null,
            description: "Rust Native Integration & Permissions",
            isBillable: true,
            dayHours: {
                "2026-09-03": 14400, // 4h
                "2026-09-04": 14400, // 4h
            },
        };

        set({ rows: [sampleRow1, sampleRow2] });
    },

    saveAsTemplate: () => {
        const { rows } = get();
        const templateRows = rows.map((r) => ({
            projectId: r.projectId,
            projectName: r.projectName,
            projectColor: r.projectColor,
            client: r.client,
            taskId: r.taskId,
            taskName: r.taskName,
            description: r.description,
            isBillable: r.isBillable,
        }));
        set((state) => ({
            templates: [
                ...state.templates,
                { name: `Template ${state.templates.length + 1}`, rows: templateRows },
            ],
        }));
    },
}));
