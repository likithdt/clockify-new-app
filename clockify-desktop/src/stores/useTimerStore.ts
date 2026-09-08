import { create } from "zustand";
import { timeEntryApi } from "@/lib/timeEntryApi";

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
    isLoading: boolean;

    loadFromBackend: () => Promise<void>;
    setDescription: (desc: string) => void;
    setProject: (name: string, color: string) => void;
    toggleBillable: () => void;
    toggleLocationEnabled: () => void;
    setCurrentLocation: (location: LocationData | null) => void;
    startTimer: () => void;
    stopTimer: () => void;
    tick: () => void;
    addCustomEntry: (entry: TimeEntry) => void;
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
    isLoading: false,

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const list = await timeEntryApi.listEntries();
            if (list && list.length > 0) {
                const mapped: TimeEntry[] = list.map((e) => ({
                    id: e.id,
                    description: e.description,
                    projectName: e.project_name,
                    projectColor: e.project_color,
                    isBillable: e.is_billable,
                    startTime: new Date(e.start_time),
                    endTime: e.end_time ? new Date(e.end_time) : undefined,
                    durationSeconds: e.duration_seconds,
                    location: e.location,
                }));
                set({ entries: mapped, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (e) {
            console.warn("Could not load time entries from backend:", e);
            set({ isLoading: false });
        }
    },

    setDescription: (description) => set({ description }),
    setProject: (projectName, projectColor) => set({ projectName, projectColor }),
    toggleBillable: () => set((state) => ({ isBillable: !state.isBillable })),
    toggleLocationEnabled: () => set((state) => ({ isLocationEnabled: !state.isLocationEnabled })),
    setCurrentLocation: (currentLocation) => set({ currentLocation }),

    startTimer: () => {
        const { description, projectName, projectColor, isBillable } = get();
        set({
            isTracking: true,
            startTime: new Date(),
            elapsedSeconds: 0,
        });
        timeEntryApi.startTimer(description, projectName, projectColor, isBillable).catch(console.error);
    },

    stopTimer: () => {
        const { isTracking, startTime, description, projectName, projectColor, isBillable, elapsedSeconds, currentLocation, entries } = get();
        if (!isTracking || !startTime) return;

        const id = crypto.randomUUID();
        const endTime = new Date();
        const newEntry: TimeEntry = {
            id,
            description: description.trim() || "(No details)",
            projectName,
            projectColor,
            isBillable,
            startTime,
            endTime,
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

        timeEntryApi.createEntry({
            description: newEntry.description,
            project_name: newEntry.projectName,
            project_color: newEntry.projectColor,
            is_billable: newEntry.isBillable,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration_seconds: elapsedSeconds,
            location: currentLocation || undefined,
        }).catch(console.error);
    },

    tick: () => {
        const { isTracking, startTime } = get();
        if (!isTracking || !startTime) return;
        const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
        set({ elapsedSeconds: diff });
    },

    addCustomEntry: (entry) => {
        set((state) => ({
            entries: [entry, ...state.entries],
        }));

        timeEntryApi.createEntry({
            description: entry.description,
            project_name: entry.projectName,
            project_color: entry.projectColor,
            is_billable: entry.isBillable,
            start_time: entry.startTime.toISOString(),
            end_time: entry.endTime ? entry.endTime.toISOString() : undefined,
            duration_seconds: entry.durationSeconds,
            location: entry.location,
        }).catch(console.error);
    },
}));