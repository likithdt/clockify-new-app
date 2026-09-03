import { create } from "zustand";

export interface TimeEntry {
    id: string;
    description: string;
    projectName: string;
    projectColor: string;
    isBillable: boolean;
    startTime: Date;
    endTime?: Date;
    durationSeconds: number;
}

interface TimerState {
    isTracking: boolean;
    description: string;
    projectName: string;
    projectColor: string;
    isBillable: boolean;
    startTime: Date | null;
    elapsedSeconds: number;
    entries: TimeEntry[];

    setDescription: (desc: string) => void;
    setProject: (name: string, color: string) => void;
    toggleBillable: () => void;
    startTimer: () => void;
    stopTimer: () => void;
    tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
    isTracking: false,
    description: "",
    projectName: "No Project",
    projectColor: "#94a3b8",
    isBillable: true,
    startTime: null,
    elapsedSeconds: 0,
    entries: [],

    setDescription: (description) => set({ description }),
    setProject: (projectName, projectColor) => set({ projectName, projectColor }),
    toggleBillable: () => set((state) => ({ isBillable: !state.isBillable })),

    startTimer: () =>
        set({
            isTracking: true,
            startTime: new Date(),
            elapsedSeconds: 0,
        }),

    stopTimer: () => {
        const { isTracking, startTime, description, projectName, projectColor, isBillable, elapsedSeconds, entries } = get();
        if (!isTracking || !startTime) return;

        const newEntry: TimeEntry = {
            id: crypto.randomUUID(),
            description: description.trim() || "(No details)",
            projectName,
            projectColor,
            isBillable,
            startTime,
            endTime: new Date(),
            durationSeconds: elapsedSeconds,
        };

        set({
            isTracking: false,
            startTime: null,
            elapsedSeconds: 0,
            description: "",
            entries: [newEntry, ...entries],
        });
    },

    tick: () => {
        const { isTracking, startTime } = get();
        if (!isTracking || !startTime) return;
        const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
        set({ elapsedSeconds: diff });
    },
}));