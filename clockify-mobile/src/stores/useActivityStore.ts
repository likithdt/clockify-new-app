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
  lastSeen: string;
  status: "Inside Geofence" | "Outside Zone" | "On Route" | "Stationary" | "Offline";
  statusColor: string;
  locationName: string;
  lat: number;
  lng: number;
  speed: string;
  battery: number;
  breadcrumbs: { lat: number; lng: number; time: string }[];
}

export interface ActivityState {
  activeSubTab: "activity" | "screenshots" | "locations";
  setActiveSubTab: (tab: "activity" | "screenshots" | "locations") => void;

  isMonitoringActive: boolean;
  isScreenshotsActive: boolean;
  isGpsActive: boolean;

  toggleMonitoring: () => void;
  setMonitoringActive: (active: boolean) => void;
  toggleScreenshots: () => void;
  setScreenshotsActive: (active: boolean) => void;
  toggleGps: () => void;
  setGpsActive: (active: boolean) => void;

  blurPrivacy: boolean;
  toggleBlurPrivacy: () => void;
  selectedTeammate: string;
  setSelectedTeammate: (teammate: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  screenshots: ScreenshotItem[];
  addScreenshot: (item: Omit<ScreenshotItem, "id">) => void;
  deleteScreenshot: (id: string) => void;

  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  userLiveCoords: { lat: number; lng: number; address: string } | null;
  setUserLiveCoords: (coords: { lat: number; lng: number; address: string }) => void;
  members: MemberLocation[];
  updateMemberLocation: (id: string, lat: number, lng: number, address?: string) => void;

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
    speed: "0 km/h",
    battery: 88,
    breadcrumbs: [
      { lat: 12.9810, lng: 77.7210, time: "09:00 AM" },
      { lat: 12.9835, lng: 77.7255, time: "10:15 AM" },
    ],
  },
  {
    id: "lara-peterson",
    name: "[SAMPLE] Lara Peterson",
    role: "Marketing Specialist",
    avatar: "LP",
    avatarColor: "#ec4899",
    lastSeen: "-",
    status: "Outside Zone",
    statusColor: "#f59e0b",
    locationName: "Indiranagar Metro Station, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    speed: "18 km/h",
    battery: 74,
    breadcrumbs: [
      { lat: 12.9710, lng: 77.6350, time: "09:30 AM" },
      { lat: 12.9784, lng: 77.6408, time: "10:45 AM" },
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
    memberId: "bindhu-shree",
    memberName: "Bindhu shree",
    timestamp: "2026-08-31T10:25:00",
    timeFormatted: "10:25 AM",
    project: "Project Alpha",
    projectColor: "#03a9f4",
    activityPercent: 94,
    appName: "Figma / Chrome IDE",
    windowTitle: "Activity - Mobile Screens Design",
    type: "figma",
  },
  {
    id: "sc-4",
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
    id: "sc-5",
    memberId: "james-anderson",
    memberName: "[SAMPLE] James Anderson",
    timestamp: "2026-08-31T10:10:00",
    timeFormatted: "10:10 AM",
    project: "DevOps Core",
    projectColor: "#8b5cf6",
    activityPercent: 95,
    appName: "Terminal / Bash",
    windowTitle: "npm run dev",
    type: "terminal",
  },
  {
    id: "sc-6",
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
  activeSubTab: "activity",
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

  isMonitoringActive: true,
  isScreenshotsActive: true,
  isGpsActive: true,
  isLoading: false,

  loadFromBackend: async () => {
    set({ isLoading: true });
    try {
      const [settingsRes, screenshotsRes, locationsRes] = await Promise.all([
        fetch("/api/activity/settings").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/activity/screenshots").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/activity/locations").then((r) => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (settingsRes) {
        set({
          isMonitoringActive: settingsRes.is_monitoring_active ?? get().isMonitoringActive,
          isScreenshotsActive: settingsRes.is_screenshots_active ?? get().isScreenshotsActive,
          isGpsActive: settingsRes.is_gps_active ?? get().isGpsActive,
          blurPrivacy: settingsRes.blur_privacy ?? get().blurPrivacy,
        });
      }

      if (Array.isArray(screenshotsRes) && screenshotsRes.length > 0) {
        const mappedScreenshots: ScreenshotItem[] = screenshotsRes.map((s: any) => ({
          id: s.id,
          memberId: s.member_id || s.memberId,
          memberName: s.member_name || s.memberName,
          memberAvatar: s.member_avatar || s.memberAvatar,
          timestamp: s.timestamp,
          timeFormatted: s.time_formatted || s.timeFormatted,
          project: s.project,
          projectColor: s.project_color || s.projectColor || "#03a9f4",
          activityPercent: s.activity_percent || s.activityPercent || 90,
          appName: s.app_name || s.appName || "App",
          windowTitle: s.window_title || s.windowTitle || "",
          codeSnippet: s.code_snippet || s.codeSnippet,
          type: s.type || "code",
        }));
        set({ screenshots: mappedScreenshots });
      }

      if (Array.isArray(locationsRes) && locationsRes.length > 0) {
        const mappedMembers: MemberLocation[] = locationsRes.map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role || "Member",
          avatar: m.avatar || m.name.slice(0, 2).toUpperCase(),
          avatarColor: m.avatar_color || m.avatarColor || "#0288d1",
          isCurrentUser: m.is_current_user || m.isCurrentUser,
          lastSeen: m.last_seen || m.lastSeen || "Just now",
          status: m.status || "Inside Geofence",
          statusColor: m.status_color || m.statusColor || "#10b981",
          locationName: m.location_name || m.locationName || "Office",
          lat: m.lat,
          lng: m.lng,
          speed: m.speed || "0 km/h",
          battery: m.battery ?? 100,
          breadcrumbs: m.breadcrumbs || [],
        }));
        set({ members: mappedMembers });
      }
    } catch (e) {
      console.warn("Could not load activity data from backend:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleMonitoring: () => {
    const next = !get().isMonitoringActive;
    set({ isMonitoringActive: next });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_monitoring_active: next }),
    }).catch(() => {});
  },
  setMonitoringActive: (active) => {
    set({ isMonitoringActive: active });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_monitoring_active: active }),
    }).catch(() => {});
  },

  toggleScreenshots: () => {
    const next = !get().isScreenshotsActive;
    set({ isScreenshotsActive: next });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_screenshots_active: next }),
    }).catch(() => {});
  },
  setScreenshotsActive: (active) => {
    set({ isScreenshotsActive: active });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_screenshots_active: active }),
    }).catch(() => {});
  },

  toggleGps: () => {
    const nextGps = !get().isGpsActive;
    const updatedMembers = get().members.map((m) => {
      if (nextGps) {
        const times: Record<string, string> = {
          "amy-smith": "10:42 AM",
          "james-anderson": "10:15 AM",
          "lara-peterson": "10:45 AM",
          "bindhu-shree": "Just now",
          "likith-dt": "Just now",
        };
        return { ...m, lastSeen: times[m.id] || "Just now" };
      } else {
        return { ...m, lastSeen: "-" };
      }
    });
    set({ isGpsActive: nextGps, members: updatedMembers });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_gps_active: nextGps }),
    }).catch(() => {});
  },
  setGpsActive: (active) => {
    const updatedMembers = get().members.map((m) => ({
      ...m,
      lastSeen: active ? "Just now" : "-",
    }));
    set({ isGpsActive: active, members: updatedMembers });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_gps_active: active }),
    }).catch(() => {});
  },

  blurPrivacy: false,
  toggleBlurPrivacy: () => {
    const next = !get().blurPrivacy;
    set({ blurPrivacy: next });
    fetch("/api/activity/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blur_privacy: next }),
    }).catch(() => {});
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

    fetch("/api/activity/screenshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
        type: item.type,
      }),
    }).catch(() => {});
  },
  deleteScreenshot: (id) => {
    set((s) => ({
      screenshots: s.screenshots.filter((item) => item.id !== id),
    }));
    fetch(`/api/activity/screenshots/${id}`, {
      method: "DELETE",
    }).catch(() => {});
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
  },
}));
