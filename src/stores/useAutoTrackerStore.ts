import { create } from "zustand";
import { useTimerStore } from "./useTimerStore";

export interface DetectedActivity {
    id: string;
    app: string;
    windowTitle: string;
    iconType: "code" | "design" | "browser" | "terminal" | "document" | "communication";
    suggestedProject: string;
    projectColor: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    durationSeconds: number;
    isLogged: boolean;
    date: string;
}

interface AutoTrackerState {
    isRecording: boolean;
    activities: DetectedActivity[];
    searchQuery: string;
    filterApp: string;

    // Actions
    toggleRecording: () => void;
    acceptAndLog: (id: string) => void;
    acceptAll: () => void;
    discardActivity: (id: string) => void;
    updateProject: (id: string, projectName: string, projectColor: string) => void;
    setSearchQuery: (query: string) => void;
    setFilterApp: (app: string) => void;
}

export const useAutoTrackerStore = create<AutoTrackerState>((set, get) => ({
    isRecording: true,
    searchQuery: "",
    filterApp: "All",
    activities: [
        {
            id: "act-1",
            app: "VS Code",
            windowTitle: "timeflow-design-system — App.tsx",
            iconType: "code",
            suggestedProject: "Project Alpha",
            projectColor: "#03a9f4",
            startTime: "08:30 AM",
            endTime: "10:45 AM",
            durationMinutes: 135,
            durationSeconds: 135 * 60,
            isLogged: false,
            date: "Today",
        },
        {
            id: "act-2",
            app: "Figma",
            windowTitle: "Clockify Light Design Rebuild",
            iconType: "design",
            suggestedProject: "Project Alpha",
            projectColor: "#9333ea",
            startTime: "11:00 AM",
            endTime: "12:30 PM",
            durationMinutes: 90,
            durationSeconds: 90 * 60,
            isLogged: false,
            date: "Today",
        },
        {
            id: "act-3",
            app: "Google Chrome",
            windowTitle: "Clockify API Documentation & Reference",
            iconType: "browser",
            suggestedProject: "[SAMPLE] Internal Work",
            projectColor: "#0288d1",
            startTime: "01:15 PM",
            endTime: "01:45 PM",
            durationMinutes: 30,
            durationSeconds: 30 * 60,
            isLogged: false,
            date: "Today",
        },
        {
            id: "act-4",
            app: "Terminal",
            windowTitle: "PowerShell: cargo tauri build & deploy",
            iconType: "terminal",
            suggestedProject: "[SAMPLE] Project Orion",
            projectColor: "#f59e0b",
            startTime: "02:00 PM",
            endTime: "02:45 PM",
            durationMinutes: 45,
            durationSeconds: 45 * 60,
            isLogged: false,
            date: "Today",
        },
    ],

    toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),

    acceptAndLog: (id: string) => {
        const { activities } = get();
        const activity = activities.find((a) => a.id === id);
        if (!activity || activity.isLogged) return;

        // Log to useTimerStore
        const addCustomEntry = useTimerStore.getState().addCustomEntry;
        addCustomEntry({
            id: crypto.randomUUID(),
            description: `${activity.app}: ${activity.windowTitle}`,
            projectName: activity.suggestedProject,
            projectColor: activity.projectColor,
            isBillable: true,
            startTime: new Date(Date.now() - activity.durationSeconds * 1000),
            endTime: new Date(),
            durationSeconds: activity.durationSeconds,
        });

        // Mark as logged
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, isLogged: true } : a
            ),
        }));
    },

    acceptAll: () => {
        const { activities } = get();
        const unlogged = activities.filter((a) => !a.isLogged);
        if (unlogged.length === 0) return;

        const addCustomEntry = useTimerStore.getState().addCustomEntry;
        unlogged.forEach((activity) => {
            addCustomEntry({
                id: crypto.randomUUID(),
                description: `${activity.app}: ${activity.windowTitle}`,
                projectName: activity.suggestedProject,
                projectColor: activity.projectColor,
                isBillable: true,
                startTime: new Date(Date.now() - activity.durationSeconds * 1000),
                endTime: new Date(),
                durationSeconds: activity.durationSeconds,
            });
        });

        set((state) => ({
            activities: state.activities.map((a) => ({ ...a, isLogged: true })),
        }));
    },

    discardActivity: (id: string) => {
        set((state) => ({
            activities: state.activities.filter((a) => a.id !== id),
        }));
    },

    updateProject: (id: string, projectName: string, projectColor: string) => {
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, suggestedProject: projectName, projectColor } : a
            ),
        }));
    },

    setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    setFilterApp: (filterApp: string) => set({ filterApp }),
}));
