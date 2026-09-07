import { create } from "zustand";
import { autoTrackerApi } from "@/lib/autoTrackerApi";
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
    isLoading: boolean;

    // Actions
    loadFromBackend: () => Promise<void>;
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
    isLoading: false,
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

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const list = await autoTrackerApi.listActivities();
            if (list && list.length > 0) {
                const mapped: DetectedActivity[] = list.map((a) => ({
                    id: a.id,
                    app: a.app,
                    windowTitle: a.window_title,
                    iconType: a.icon_type,
                    suggestedProject: a.suggested_project,
                    projectColor: a.project_color,
                    startTime: a.start_time,
                    endTime: a.end_time,
                    durationMinutes: a.duration_minutes,
                    durationSeconds: a.duration_seconds,
                    isLogged: a.is_logged,
                    date: a.date,
                }));
                set({ activities: mapped });
            }
            const status = await autoTrackerApi.getStatus();
            if (status) {
                set({ isRecording: status.is_recording });
            }
            set({ isLoading: false });
        } catch (e) {
            console.warn("Could not load autotracker from backend:", e);
            set({ isLoading: false });
        }
    },

    toggleRecording: () => {
        set((state) => ({ isRecording: !state.isRecording }));
        autoTrackerApi.toggleRecording().catch(console.error);
    },

    acceptAndLog: (id: string) => {
        const { activities } = get();
        const activity = activities.find((a) => a.id === id);
        if (!activity || activity.isLogged) return;

        // Push directly to live Time Tracker store
        useTimerStore.getState().addCustomEntry({
            id: `entry-${Date.now()}`,
            description: activity.windowTitle,
            projectName: activity.suggestedProject,
            projectColor: activity.projectColor,
            isBillable: true,
            startTime: new Date(),
            durationSeconds: activity.durationSeconds,
        });

        // Mark local and backend
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, isLogged: true } : a
            ),
        }));

        autoTrackerApi.logActivity({
            activity_id: id,
            project_name: activity.suggestedProject,
            project_color: activity.projectColor,
            is_billable: true,
        }).catch(console.error);
    },

    acceptAll: () => {
        const { activities } = get();
        activities.forEach((act) => {
            if (!act.isLogged) {
                useTimerStore.getState().addCustomEntry({
                    id: `entry-${Date.now()}-${act.id}`,
                    description: act.windowTitle,
                    projectName: act.suggestedProject,
                    projectColor: act.projectColor,
                    isBillable: true,
                    startTime: new Date(),
                    durationSeconds: act.durationSeconds,
                });
            }
        });

        set((state) => ({
            activities: state.activities.map((a) => ({ ...a, isLogged: true })),
        }));

        autoTrackerApi.logAllActivities().catch(console.error);
    },

    discardActivity: (id: string) => {
        set((state) => ({
            activities: state.activities.filter((a) => a.id !== id),
        }));
        autoTrackerApi.discardActivity(id).catch(console.error);
    },

    updateProject: (id: string, projectName: string, projectColor: string) => {
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id
                    ? { ...a, suggestedProject: projectName, projectColor }
                    : a
            ),
        }));
        autoTrackerApi.updateSuggestedProject({
            activity_id: id,
            suggested_project: projectName,
            project_color: projectColor,
        }).catch(console.error);
    },

    setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    setFilterApp: (filterApp: string) => set({ filterApp }),
}));
