import { create } from "zustand";
import { activityApi } from "@/lib/activityApi";
import type { ScreenshotCategory, MemberLocationStatus } from "@backend/models/activityLocationTypes";

export interface ScreenshotItem {
    id: string;
    memberId: string;
    memberName: string;
    memberAvatar?: string;
    timestamp: string;
    timeFormatted: string;
    project: string;
    projectColor: string;
    activityPercent: number;
    appName: string;
    windowTitle: string;
    codeSnippet?: string;
    type: "figma" | "code" | "browser" | "slack" | "terminal";
}

export interface MemberLocation {
    id: string;
    name: string;
    role: string;
    avatar: string;
    avatarColor: string;
    isCurrentUser?: boolean;
    lastSeen: string; // "-" when GPS off, or time like "10:42 AM"
    status: "Inside Geofence" | "Outside Zone" | "On Route" | "Stationary" | "Offline";
    statusColor: string;
    locationName: string;
    lat: number;
    lng: number;
    speed: string;
    battery: number;
    breadcrumbs: { lat: number; lng: number; time: string }[];
}

interface ActivityState {
    // Current Active Tab inside Activity: "activity" | "screenshots" | "locations"
    activeSubTab: "activity" | "screenshots" | "locations";
    setActiveSubTab: (tab: "activity" | "screenshots" | "locations") => void;

    // Feature activation toggles (matching reference images)
    isMonitoringActive: boolean;
    isScreenshotsActive: boolean;
    isGpsActive: boolean;

    toggleMonitoring: () => void;
    setMonitoringActive: (active: boolean) => void;
    toggleScreenshots: () => void;
    setScreenshotsActive: (active: boolean) => void;
    toggleGps: () => void;
    setGpsActive: (active: boolean) => void;

    // Screenshots State
    blurPrivacy: boolean;
    toggleBlurPrivacy: () => void;
    selectedTeammate: string;
    setSelectedTeammate: (teammate: string) => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    screenshots: ScreenshotItem[];
    addScreenshot: (item: Omit<ScreenshotItem, "id">) => void;
    deleteScreenshot: (id: string) => void;

    // Locations State
    selectedMemberId: string | null;
    setSelectedMemberId: (id: string | null) => void;
    userLiveCoords: { lat: number; lng: number; address: string } | null;
    setUserLiveCoords: (coords: { lat: number; lng: number; address: string }) => void;
    members: MemberLocation[];
    updateMemberLocation: (id: string, lat: number, lng: number, address?: string) => void;

    // Backend Synchronizer
    isLoading: boolean;
    loadFromBackend: () => Promise<void>;
}

const INITIAL_MEMBERS: MemberLocation[] = [
    {
        id: "likith-dt",
        name: "Likith D T (You)",
        role: "Workspace Owner & Lead Engineer",
        avatar: "LD",
        avatarColor: "#0288d1",
        isCurrentUser: true,
        lastSeen: "Just now",
        status: "Inside Geofence",
        statusColor: "#10b981",
        locationName: "Gopalan College of Engineering and Management, Hoodi, Whitefield, Bengaluru",
        lat: 12.9904,
        lng: 77.7126,
        speed: "0 km/h",
        battery: 100,
        breadcrumbs: [
            { lat: 12.9890, lng: 77.7110, time: "09:00 AM" },
            { lat: 12.9904, lng: 77.7126, time: "10:50 AM" },
        ],
    },
    {
        id: "bindhu-shree",
        name: "Bindhu shree",
        role: "Backend Developer",
        avatar: "BS",
        avatarColor: "#00897b",
        lastSeen: "-",
        status: "Inside Geofence",
        statusColor: "#10b981",
        locationName: "Gopalan College Campus, Whitefield, Bengaluru",
        lat: 12.9850,
        lng: 77.7280,
        speed: "0 km/h",
        battery: 97,
        breadcrumbs: [
            { lat: 12.9840, lng: 77.7265, time: "09:00 AM" },
            { lat: 12.9850, lng: 77.7280, time: "10:50 AM" },
        ],
    },
    {
        id: "amy-smith",
        name: "[SAMPLE] Amy Smith",
        role: "Frontend Developer",
        avatar: "AS",
        avatarColor: "#f59e0b",
        lastSeen: "-",
        status: "Inside Geofence",
        statusColor: "#10b981",
        locationName: "Whitefield Site 2, Bengaluru",
        lat: 12.9865,
        lng: 77.7295,
        speed: "0 km/h",
        battery: 92,
        breadcrumbs: [
            { lat: 12.9825, lng: 77.7240, time: "09:00 AM" },
            { lat: 12.9865, lng: 77.7295, time: "10:30 AM" },
        ],
    },
    {
        id: "james-anderson",
        name: "[SAMPLE] James Anderson",
        role: "DevOps Engineer",
        avatar: "JA",
        avatarColor: "#0288d1",
        lastSeen: "-",
        status: "Inside Geofence",
        statusColor: "#10b981",
        locationName: "Gopalan Tech Park, Bengaluru",
        lat: 12.9835,
        lng: 77.7255,
        speed: "4 km/h",
        battery: 88,
        breadcrumbs: [
            { lat: 12.9810, lng: 77.7220, time: "08:30 AM" },
            { lat: 12.9835, lng: 77.7255, time: "10:15 AM" },
        ],
    },
    {
        id: "lara-peterson",
        name: "[SAMPLE] Lara Peterson",
        role: "Product Designer",
        avatar: "LP",
        avatarColor: "#ec4899",
        lastSeen: "-",
        status: "Outside Zone",
        statusColor: "#f59e0b",
        locationName: "Indiranagar 100ft Rd, Bengaluru",
        lat: 12.9784,
        lng: 77.6408,
        speed: "18 km/h",
        battery: 74,
        breadcrumbs: [
            { lat: 12.9800, lng: 77.6450, time: "09:15 AM" },
            { lat: 12.9784, lng: 77.6408, time: "10:45 AM" },
        ],
    },
    {
        id: "mike-johnson",
        name: "[SAMPLE] Mike Johnson",
        role: "Quality Assurance",
        avatar: "MJ",
        avatarColor: "#8b5cf6",
        lastSeen: "-",
        status: "Inside Geofence",
        statusColor: "#10b981",
        locationName: "Electronic City Phase 1, Bengaluru",
        lat: 12.8452,
        lng: 77.6602,
        speed: "0 km/h",
        battery: 65,
        breadcrumbs: [
            { lat: 12.8410, lng: 77.6580, time: "08:45 AM" },
            { lat: 12.8452, lng: 77.6602, time: "10:20 AM" },
        ],
    },
];

const INITIAL_SCREENSHOTS: ScreenshotItem[] = [
    {
        id: "sc-1",
        memberId: "likith-dt",
        memberName: "Likith D T (You)",
        timestamp: "2026-08-31T10:40:00",
        timeFormatted: "10:40 AM",
        project: "Project Alpha",
        projectColor: "#03a9f4",
        activityPercent: 98,
        appName: "Figma Desktop App",
        windowTitle: "Workspace UI Master v2.4 - Canvas 1",
        type: "figma",
    },
    {
        id: "sc-2",
        memberId: "likith-dt",
        memberName: "Likith D T (You)",
        timestamp: "2026-08-31T10:30:00",
        timeFormatted: "10:30 AM",
        project: "Frontend Dev",
        projectColor: "#10b981",
        activityPercent: 92,
        appName: "VS Code Studio",
        windowTitle: "src/components/tracker/TrackerBar.tsx",
        codeSnippet: "const timer = new Stopwatch();\nstartLiveTracker();",
        type: "code",
    },
    {
        id: "sc-3",
        memberId: "amy-smith",
        memberName: "[SAMPLE] Amy Smith",
        timestamp: "2026-08-31T10:20:00",
        timeFormatted: "10:20 AM",
        project: "Clockify Web",
        projectColor: "#ec4899",
        activityPercent: 87,
        appName: "Google Chrome",
        windowTitle: "Activity - Screenshots & GPS Audits",
        type: "browser",
    },
    {
        id: "sc-4",
        memberId: "james-anderson",
        memberName: "[SAMPLE] James Anderson",
        timestamp: "2026-08-31T10:10:00",
        timeFormatted: "10:10 AM",
        project: "DevOps Core",
        projectColor: "#8b5cf6",
        activityPercent: 95,
        appName: "Terminal / Bash",
        windowTitle: "cargo tauri dev --release",
        type: "terminal",
    },
    {
        id: "sc-5",
        memberId: "lara-peterson",
        memberName: "[SAMPLE] Lara Peterson",
        timestamp: "2026-08-31T10:00:00",
        timeFormatted: "10:00 AM",
        project: "Client Sync",
        projectColor: "#f59e0b",
        activityPercent: 78,
        appName: "Slack",
        windowTitle: "#sprint-planning · Team Channel",
        type: "slack",
    },
];

export const useActivityStore = create<ActivityState>((set, get) => ({
    activeSubTab: "screenshots",
    setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

    isMonitoringActive: true,
    isScreenshotsActive: true,
    isGpsActive: true,
    isLoading: false,

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const [settings, screenshots, locations] = await Promise.all([
                activityApi.getActivitySettings(),
                activityApi.listScreenshots(),
                activityApi.listMemberLocations(),
            ]);

            const mappedScreenshots: ScreenshotItem[] = screenshots.map((s) => ({
                id: s.id,
                memberId: s.member_id,
                memberName: s.member_name,
                memberAvatar: s.member_avatar,
                timestamp: s.timestamp,
                timeFormatted: s.time_formatted,
                project: s.project,
                projectColor: s.project_color,
                activityPercent: s.activity_percent,
                appName: s.app_name,
                windowTitle: s.window_title,
                codeSnippet: s.code_snippet,
                type: (s.type as "figma" | "code" | "browser" | "slack" | "terminal") || "code",
            }));

            const mappedMembers: MemberLocation[] = locations.map((m) => ({
                id: m.id,
                name: m.name,
                role: m.role,
                avatar: m.avatar,
                avatarColor: m.avatar_color,
                isCurrentUser: m.is_current_user,
                lastSeen: m.last_seen,
                status: m.status as MemberLocationStatus,
                statusColor: m.status_color,
                locationName: m.location_name,
                lat: m.lat,
                lng: m.lng,
                speed: m.speed,
                battery: m.battery,
                breadcrumbs: m.breadcrumbs || [],
            }));

            set({
                isMonitoringActive: settings.is_monitoring_active,
                isScreenshotsActive: settings.is_screenshots_active,
                isGpsActive: settings.is_gps_active,
                blurPrivacy: settings.blur_privacy,
                screenshots: mappedScreenshots.length > 0 ? mappedScreenshots : INITIAL_SCREENSHOTS,
                members: mappedMembers.length > 0 ? mappedMembers : INITIAL_MEMBERS,
            });
        } catch (e) {
            console.warn("Could not load activity data from backend:", e);
        } finally {
            set({ isLoading: false });
        }
    },

    toggleMonitoring: () => {
        const next = !get().isMonitoringActive;
        set({ isMonitoringActive: next });
        activityApi.updateActivitySettings({
            is_monitoring_active: next,
            is_screenshots_active: get().isScreenshotsActive,
            is_gps_active: get().isGpsActive,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },
    setMonitoringActive: (active) => {
        set({ isMonitoringActive: active });
        activityApi.updateActivitySettings({
            is_monitoring_active: active,
            is_screenshots_active: get().isScreenshotsActive,
            is_gps_active: get().isGpsActive,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },

    toggleScreenshots: () => {
        const next = !get().isScreenshotsActive;
        set({ isScreenshotsActive: next });
        activityApi.updateActivitySettings({
            is_monitoring_active: get().isMonitoringActive,
            is_screenshots_active: next,
            is_gps_active: get().isGpsActive,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },
    setScreenshotsActive: (active) => {
        set({ isScreenshotsActive: active });
        activityApi.updateActivitySettings({
            is_monitoring_active: get().isMonitoringActive,
            is_screenshots_active: active,
            is_gps_active: get().isGpsActive,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },

    toggleGps: () => {
        const nextGps = !get().isGpsActive;
        const updatedMembers = get().members.map((m) => {
            if (nextGps) {
                const times: Record<string, string> = {
                    "amy-smith": "10:42 AM",
                    "james-anderson": "10:15 AM",
                    "lara-peterson": "10:45 AM",
                    "mike-johnson": "10:20 AM",
                    "bindhu-shree": "Just now",
                };
                return { ...m, lastSeen: times[m.id] || "Just now" };
            } else {
                return { ...m, lastSeen: "-" };
            }
        });
        set({ isGpsActive: nextGps, members: updatedMembers });
        activityApi.updateActivitySettings({
            is_monitoring_active: get().isMonitoringActive,
            is_screenshots_active: get().isScreenshotsActive,
            is_gps_active: nextGps,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },
    setGpsActive: (active) => {
        const updatedMembers = get().members.map((m) => ({
            ...m,
            lastSeen: active ? "Just now" : "-",
        }));
        set({ isGpsActive: active, members: updatedMembers });
        activityApi.updateActivitySettings({
            is_monitoring_active: get().isMonitoringActive,
            is_screenshots_active: get().isScreenshotsActive,
            is_gps_active: active,
            blur_privacy: get().blurPrivacy,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },

    blurPrivacy: false,
    toggleBlurPrivacy: () => {
        const next = !get().blurPrivacy;
        set({ blurPrivacy: next });
        activityApi.updateActivitySettings({
            is_monitoring_active: get().isMonitoringActive,
            is_screenshots_active: get().isScreenshotsActive,
            is_gps_active: get().isGpsActive,
            blur_privacy: next,
            screenshot_frequency_minutes: 5,
        }).catch(console.error);
    },

    selectedTeammate: "all",
    setSelectedTeammate: (selectedTeammate) => set({ selectedTeammate }),

    selectedDate: "Today",
    setSelectedDate: (selectedDate) => set({ selectedDate }),

    screenshots: INITIAL_SCREENSHOTS,
    addScreenshot: (item) => {
        const id = `sc-${Date.now()}`;
        const newScreenshot: ScreenshotItem = { ...item, id };
        set((s) => ({ screenshots: [newScreenshot, ...s.screenshots] }));

        activityApi.captureScreenshot({
            member_id: item.memberId,
            member_name: item.memberName,
            member_avatar: item.memberAvatar,
            time_formatted: item.timeFormatted,
            project: item.project,
            project_color: item.projectColor,
            activity_percent: item.activityPercent,
            app_name: item.appName,
            window_title: item.windowTitle,
            code_snippet: item.codeSnippet,
            type: item.type as ScreenshotCategory,
        }).catch(console.error);
    },
    deleteScreenshot: (id) => {
        set((s) => ({
            screenshots: s.screenshots.filter((item) => item.id !== id),
        }));
        activityApi.deleteScreenshot(id).catch(console.error);
    },

    selectedMemberId: null,
    setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),

    userLiveCoords: null,
    setUserLiveCoords: (coords) => {
        set((s) => ({
            userLiveCoords: coords,
            members: s.members.map((m) =>
                m.isCurrentUser
                    ? {
                          ...m,
                          lat: coords.lat,
                          lng: coords.lng,
                          locationName: coords.address || m.locationName,
                          lastSeen: "Just now",
                      }
                    : m
            ),
        }));

        const current = get().members.find((m) => m.isCurrentUser);
        if (current) {
            activityApi.updateMemberLocation(current.id, {
                lat: coords.lat,
                lng: coords.lng,
                location_name: coords.address || current.locationName,
            }).catch(console.error);
        }
    },

    members: INITIAL_MEMBERS,
    updateMemberLocation: (id, lat, lng, address) => {
        set((s) => ({
            members: s.members.map((m) =>
                m.id === id
                    ? {
                          ...m,
                          lat,
                          lng,
                          locationName: address || m.locationName,
                          lastSeen: "Just now",
                      }
                    : m
            ),
        }));

        activityApi.updateMemberLocation(id, {
            lat,
            lng,
            location_name: address,
        }).catch(console.error);
    },
}));
