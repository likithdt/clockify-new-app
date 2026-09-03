import { create } from "zustand";

export interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
}

export interface TimeEntry {
    id: string;
    description: string;
    projectName: string;
    projectColor: string;
    isBillable: boolean;
    startTime: Date;
    endTime?: Date;
    durationSeconds: number;
    location?: LocationData;
}

interface TimerState {
    isTracking: boolean;
    description: string;
    projectName: string;
    projectColor: string;
    isBillable: boolean;
    isLocationEnabled: boolean;
    startTime: Date | null;
    elapsedSeconds: number;
    currentLocation: LocationData | null;
    entries: TimeEntry[];

    setDescription: (desc: string) => void;
    setProject: (name: string, color: string) => void;
    toggleBillable: () => void;
    toggleLocationEnabled: () => void;
    setCurrentLocation: (location: LocationData | null) => void;
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
    isLocationEnabled: false,
    startTime: null,
    elapsedSeconds: 0,
    currentLocation: null,
    entries: [],

    setDescription: (description) => set({ description }),
    setProject: (projectName, projectColor) => set({ projectName, projectColor }),
    toggleBillable: () => set((state) => ({ isBillable: !state.isBillable })),
    toggleLocationEnabled: () => set((state) => ({ isLocationEnabled: !state.isLocationEnabled })),
    setCurrentLocation: (currentLocation) => set({ currentLocation }),

    startTimer: () =>
        set({
            isTracking: true,
            startTime: new Date(),
            elapsedSeconds: 0,
        }),

    stopTimer: () => {
        const { isTracking, startTime, description, projectName, projectColor, isBillable, elapsedSeconds, currentLocation, entries } = get();
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
            ...(currentLocation ? { location: currentLocation } : {}),
        };

        set({
            isTracking: false,
            startTime: null,
            elapsedSeconds: 0,
            description: "",
            currentLocation: null,
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