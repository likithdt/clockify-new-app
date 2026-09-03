import { create } from "zustand";

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

export const useActivityStore = create<ActivityState>((set) => ({
    activeSubTab: "screenshots",
    setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

    isMonitoringActive: false,
    isScreenshotsActive: false,
    isGpsActive: false,

    toggleMonitoring: () => set((s) => ({ isMonitoringActive: !s.isMonitoringActive })),
    setMonitoringActive: (active) => set({ isMonitoringActive: active }),

    toggleScreenshots: () => set((s) => ({ isScreenshotsActive: !s.isScreenshotsActive })),
    setScreenshotsActive: (active) => set({ isScreenshotsActive: active }),

    toggleGps: () =>
        set((s) => {
            const nextGps = !s.isGpsActive;
            const updatedMembers = s.members.map((m) => {
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
            return { isGpsActive: nextGps, members: updatedMembers };
        }),
    setGpsActive: (active) =>
        set((s) => {
            const updatedMembers = s.members.map((m) => ({
                ...m,
                lastSeen: active ? "Just now" : "-",
            }));
            return { isGpsActive: active, members: updatedMembers };
        }),

    blurPrivacy: false,
    toggleBlurPrivacy: () => set((s) => ({ blurPrivacy: !s.blurPrivacy })),

    selectedTeammate: "all",
    setSelectedTeammate: (selectedTeammate) => set({ selectedTeammate }),

    selectedDate: "Today",
    setSelectedDate: (selectedDate) => set({ selectedDate }),

    screenshots: INITIAL_SCREENSHOTS,
    addScreenshot: (item) =>
        set((s) => ({
            screenshots: [{ ...item, id: `sc-${Date.now()}` }, ...s.screenshots],
        })),
    deleteScreenshot: (id) =>
        set((s) => ({
            screenshots: s.screenshots.filter((item) => item.id !== id),
        })),

    selectedMemberId: null,
    setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),

    userLiveCoords: null,
    setUserLiveCoords: (coords) =>
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
        })),

    members: INITIAL_MEMBERS,
    updateMemberLocation: (id, lat, lng, address) =>
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
        })),
}));
