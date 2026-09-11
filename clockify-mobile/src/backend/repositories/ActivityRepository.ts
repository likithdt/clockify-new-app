import type {
  ActivityRecord,
  ActivityFilter,
  ActivitySummaryDTO,
  ScreenshotItemDTO,
  CreateScreenshotPayload,
  MemberLocationDTO,
  UpdateMemberLocationPayload,
  GeofenceZoneDTO,
  CreateGeofencePayload,
  ActivitySettingsDTO,
} from "../types.ts";

export const INITIAL_ACTIVITY_RECORDS: ActivityRecord[] = [
  {
    id: "act-1",
    member_id: "likith-dt",
    member_name: "Likith D T (You)",
    avatar: "LD",
    avatar_color: "#0288d1",
    task: "Clockify Mobile Development",
    project: "Project Alpha",
    project_color: "#03a9f4",
    activity_percent: 98,
    pulse_text: "98% active pulse",
    active_window: "VS Code Studio / Terminal",
    score: "99% High",
    score_color: "text-[#10b981]",
    status: "TRACKING",
    status_color: "bg-[#ecfdf5] text-[#047857]",
    recorded_at: "2026-09-04T10:50:00Z",
  },
  {
    id: "act-2",
    member_id: "bindhu-shree",
    member_name: "Bindhu shree",
    avatar: "BS",
    avatar_color: "#00897b",
    task: "UI Design Refactoring",
    project: "Project Alpha",
    project_color: "#03a9f4",
    activity_percent: 94,
    pulse_text: "94% active pulse",
    active_window: "Figma / Chrome IDE",
    score: "96% High",
    score_color: "text-[#10b981]",
    status: "TRACKING",
    status_color: "bg-[#ecfdf5] text-[#047857]",
    recorded_at: "2026-09-04T10:50:00Z",
  },
  {
    id: "act-3",
    member_id: "priya",
    member_name: "Priya Sharma",
    avatar: "PS",
    avatar_color: "#9333ea",
    task: "Database Migration Scripts",
    project: "Backend Core",
    project_color: "#9333ea",
    activity_percent: 86,
    pulse_text: "86% active pulse",
    active_window: "VS Code (PostgreSQL)",
    score: "88% Optimal",
    score_color: "text-[#0288d1]",
    status: "TRACKING",
    status_color: "bg-[#ecfdf5] text-[#047857]",
    recorded_at: "2026-09-04T10:45:00Z",
  },
  {
    id: "act-4",
    member_id: "amy-smith",
    member_name: "[SAMPLE] Amy Smith",
    avatar: "AS",
    avatar_color: "#f59e0b",
    task: "Client Report Analysis",
    project: "Audit Q3",
    project_color: "#f59e0b",
    activity_percent: 78,
    pulse_text: "78% active pulse",
    active_window: "Microsoft Excel",
    score: "82% Normal",
    score_color: "text-[#0288d1]",
    status: "TRACKING",
    status_color: "bg-[#ecfdf5] text-[#047857]",
    recorded_at: "2026-09-04T10:42:00Z",
  },
  {
    id: "act-5",
    member_id: "james-anderson",
    member_name: "[SAMPLE] James Anderson",
    avatar: "JA",
    avatar_color: "#0288d1",
    task: "Docker Cluster Setup",
    project: "Infrastructure",
    project_color: "#64748b",
    activity_percent: 91,
    pulse_text: "91% active pulse",
    active_window: "Windows Terminal / SSH",
    score: "93% High",
    score_color: "text-[#10b981]",
    status: "TRACKING",
    status_color: "bg-[#ecfdf5] text-[#047857]",
    recorded_at: "2026-09-04T10:15:00Z",
  },
  {
    id: "act-6",
    member_id: "lara-peterson",
    member_name: "[SAMPLE] Lara Peterson",
    avatar: "LP",
    avatar_color: "#ec4899",
    task: "Brand Guidelines v2",
    project: "Marketing",
    project_color: "#ec4899",
    activity_percent: 32,
    pulse_text: "32% idle flagged",
    active_window: "Slack #design",
    score: "45% Low",
    score_color: "text-[#f59e0b]",
    status: "IDLE",
    status_color: "bg-[#fffbeb] text-[#b45309]",
    recorded_at: "2026-09-04T10:00:00Z",
  },
];

export const INITIAL_SCREENSHOTS: ScreenshotItemDTO[] = [
  {
    id: "sc-1",
    member_id: "likith-dt",
    member_name: "Likith D T (You)",
    member_avatar: "LD",
    timestamp: "2026-08-31T10:40:00Z",
    time_formatted: "10:40 AM",
    project: "Project Alpha",
    project_color: "#03a9f4",
    activity_percent: 98,
    app_name: "Figma Mobile App",
    window_title: "Workspace UI Master v2.4 - Canvas 1",
    type: "figma",
  },
  {
    id: "sc-2",
    member_id: "likith-dt",
    member_name: "Likith D T (You)",
    member_avatar: "LD",
    timestamp: "2026-08-31T10:30:00Z",
    time_formatted: "10:30 AM",
    project: "Frontend Dev",
    project_color: "#10b981",
    activity_percent: 92,
    app_name: "VS Code Studio",
    window_title: "src/components/tracker/TrackerBar.tsx",
    code_snippet: "const timer = new Stopwatch();\nstartLiveTracker();",
    type: "code",
  },
  {
    id: "sc-3",
    member_id: "amy-smith",
    member_name: "[SAMPLE] Amy Smith",
    member_avatar: "AS",
    timestamp: "2026-08-31T10:20:00Z",
    time_formatted: "10:20 AM",
    project: "Clockify Web",
    project_color: "#ec4899",
    activity_percent: 87,
    app_name: "Google Chrome",
    window_title: "Activity - Screenshots & GPS Audits",
    type: "browser",
  },
  {
    id: "sc-4",
    member_id: "james-anderson",
    member_name: "[SAMPLE] James Anderson",
    member_avatar: "JA",
    timestamp: "2026-08-31T10:10:00Z",
    time_formatted: "10:10 AM",
    project: "DevOps Core",
    project_color: "#8b5cf6",
    activity_percent: 95,
    app_name: "Terminal / Bash",
    window_title: "vite build --mode mobile",
    type: "terminal",
  },
  {
    id: "sc-5",
    member_id: "lara-peterson",
    member_name: "[SAMPLE] Lara Peterson",
    member_avatar: "LP",
    timestamp: "2026-08-31T10:00:00Z",
    time_formatted: "10:00 AM",
    project: "Client Sync",
    project_color: "#f59e0b",
    activity_percent: 78,
    app_name: "Slack",
    window_title: "#sprint-planning · Team Channel",
    type: "slack",
  },
];

export const INITIAL_MEMBER_LOCATIONS: MemberLocationDTO[] = [
  {
    id: "likith-dt",
    name: "Likith D T (You)",
    role: "Workspace Owner & Lead Engineer",
    avatar: "LD",
    avatar_color: "#0288d1",
    is_current_user: true,
    last_seen: "-",
    status: "Inside Geofence",
    status_color: "#10b981",
    location_name: "Gopalan College of Engineering and Management, Hoodi, Whitefield, Bengaluru",
    lat: 12.9904,
    lng: 77.7126,
    speed: "0 km/h",
    battery: 100,
    breadcrumbs: [
      { lat: 12.989, lng: 77.711, time: "09:00 AM" },
      { lat: 12.9904, lng: 77.7126, time: "10:50 AM" },
    ],
  },
  {
    id: "bindhu-shree",
    name: "Bindhu shree",
    role: "Backend Developer",
    avatar: "BS",
    avatar_color: "#00897b",
    is_current_user: false,
    last_seen: "-",
    status: "Inside Geofence",
    status_color: "#10b981",
    location_name: "Gopalan College Campus, Whitefield, Bengaluru",
    lat: 12.985,
    lng: 77.728,
    speed: "0 km/h",
    battery: 97,
    breadcrumbs: [
      { lat: 12.984, lng: 77.7265, time: "09:00 AM" },
      { lat: 12.985, lng: 77.728, time: "10:50 AM" },
    ],
  },
  {
    id: "amy-smith",
    name: "[SAMPLE] Amy Smith",
    role: "Frontend Developer",
    avatar: "AS",
    avatar_color: "#f59e0b",
    is_current_user: false,
    last_seen: "-",
    status: "Inside Geofence",
    status_color: "#10b981",
    location_name: "Whitefield Site 2, Bengaluru",
    lat: 12.9865,
    lng: 77.7295,
    speed: "0 km/h",
    battery: 92,
    breadcrumbs: [
      { lat: 12.9825, lng: 77.724, time: "09:00 AM" },
      { lat: 12.9865, lng: 77.7295, time: "10:30 AM" },
    ],
  },
  {
    id: "james-anderson",
    name: "[SAMPLE] James Anderson",
    role: "DevOps Engineer",
    avatar: "JA",
    avatar_color: "#0288d1",
    is_current_user: false,
    last_seen: "-",
    status: "Inside Geofence",
    status_color: "#10b981",
    location_name: "Gopalan Tech Park, Bengaluru",
    lat: 12.9835,
    lng: 77.7255,
    speed: "4 km/h",
    battery: 88,
    breadcrumbs: [
      { lat: 12.981, lng: 77.722, time: "08:30 AM" },
      { lat: 12.9835, lng: 77.7255, time: "10:15 AM" },
    ],
  },
  {
    id: "lara-peterson",
    name: "[SAMPLE] Lara Peterson",
    role: "Product Designer",
    avatar: "LP",
    avatar_color: "#ec4899",
    is_current_user: false,
    last_seen: "-",
    status: "Outside Zone",
    status_color: "#f59e0b",
    location_name: "Indiranagar 100ft Rd, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    speed: "18 km/h",
    battery: 74,
    breadcrumbs: [
      { lat: 12.98, lng: 77.645, time: "09:15 AM" },
      { lat: 12.9784, lng: 77.6408, time: "10:45 AM" },
    ],
  },
  {
    id: "mike-johnson",
    name: "[SAMPLE] Mike Johnson",
    role: "Quality Assurance",
    avatar: "MJ",
    avatar_color: "#8b5cf6",
    is_current_user: false,
    last_seen: "-",
    status: "Inside Geofence",
    status_color: "#10b981",
    location_name: "Electronic City Phase 1, Bengaluru",
    lat: 12.8452,
    lng: 77.6602,
    speed: "0 km/h",
    battery: 65,
    breadcrumbs: [
      { lat: 12.841, lng: 77.658, time: "08:45 AM" },
      { lat: 12.8452, lng: 77.6602, time: "10:20 AM" },
    ],
  },
];

export const INITIAL_GEOFENCES: GeofenceZoneDTO[] = [
  {
    id: "geo-1",
    name: "Gopalan College Campus",
    address: "Hoodi, Whitefield, Bengaluru, Karnataka 560048",
    lat: 12.9904,
    lng: 77.7126,
    radius_meters: 450,
    color: "#10b981",
  },
  {
    id: "geo-2",
    name: "Whitefield Tech Hub Zone",
    address: "ITPL Main Road, Whitefield, Bengaluru",
    lat: 12.985,
    lng: 77.728,
    radius_meters: 750,
    color: "#0288d1",
  },
  {
    id: "geo-3",
    name: "Electronic City Headquarters",
    address: "Electronic City Phase 1, Bengaluru",
    lat: 12.8452,
    lng: 77.6602,
    radius_meters: 1000,
    color: "#8b5cf6",
  },
];

export const INITIAL_SETTINGS: ActivitySettingsDTO = {
  is_monitoring_active: false,
  is_screenshots_active: false,
  is_gps_active: false,
  blur_privacy: false,
  screenshot_frequency_minutes: 5,
};

const STORAGE_KEY_RECORDS = "clockify_mobile_activity_records";
const STORAGE_KEY_SCREENSHOTS = "clockify_mobile_activity_screenshots";
const STORAGE_KEY_LOCATIONS = "clockify_mobile_activity_locations";
const STORAGE_KEY_GEOFENCES = "clockify_mobile_activity_geofences";
const STORAGE_KEY_SETTINGS = "clockify_mobile_activity_settings";

export interface IActivityRepository {
  getActivityRecords(filter?: ActivityFilter): Promise<ActivityRecord[]>;
  getActivityRecord(id: string): Promise<ActivityRecord | null>;
  logActivityRecord(payload: Omit<ActivityRecord, "id" | "recorded_at"> & { id?: string }): Promise<ActivityRecord>;
  getActivitySummary(): Promise<ActivitySummaryDTO>;

  getScreenshots(memberId?: string, date?: string): Promise<ScreenshotItemDTO[]>;
  getScreenshot(id: string): Promise<ScreenshotItemDTO | null>;
  captureScreenshot(payload: CreateScreenshotPayload): Promise<ScreenshotItemDTO>;
  deleteScreenshot(id: string): Promise<boolean>;

  getMemberLocations(): Promise<MemberLocationDTO[]>;
  getMemberLocation(id: string): Promise<MemberLocationDTO | null>;
  updateMemberLocation(id: string, payload: UpdateMemberLocationPayload): Promise<MemberLocationDTO>;
  recordCheckIn(memberId: string, lat: number, lng: number, locationName?: string): Promise<MemberLocationDTO>;

  getGeofences(): Promise<GeofenceZoneDTO[]>;
  createGeofence(payload: CreateGeofencePayload): Promise<GeofenceZoneDTO>;
  deleteGeofence(id: string): Promise<boolean>;

  getSettings(): Promise<ActivitySettingsDTO>;
  updateSettings(partial: Partial<ActivitySettingsDTO>): Promise<ActivitySettingsDTO>;
  resetSampleData(): Promise<void>;
}

export class ActivityRepository implements IActivityRepository {
  private activityRecords: ActivityRecord[] = [];
  private screenshots: ScreenshotItemDTO[] = [];
  private memberLocations: MemberLocationDTO[] = [];
  private geofences: GeofenceZoneDTO[] = [];
  private settings: ActivitySettingsDTO = { ...INITIAL_SETTINGS };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== "undefined") {
      try {
        const storedRecs = localStorage.getItem(STORAGE_KEY_RECORDS);
        this.activityRecords = storedRecs ? JSON.parse(storedRecs) : JSON.parse(JSON.stringify(INITIAL_ACTIVITY_RECORDS));

        const storedScreens = localStorage.getItem(STORAGE_KEY_SCREENSHOTS);
        this.screenshots = storedScreens ? JSON.parse(storedScreens) : JSON.parse(JSON.stringify(INITIAL_SCREENSHOTS));

        const storedLocs = localStorage.getItem(STORAGE_KEY_LOCATIONS);
        this.memberLocations = storedLocs ? JSON.parse(storedLocs) : JSON.parse(JSON.stringify(INITIAL_MEMBER_LOCATIONS));

        const storedGeos = localStorage.getItem(STORAGE_KEY_GEOFENCES);
        this.geofences = storedGeos ? JSON.parse(storedGeos) : JSON.parse(JSON.stringify(INITIAL_GEOFENCES));

        const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        this.settings = storedSettings ? JSON.parse(storedSettings) : { ...INITIAL_SETTINGS };
        return;
      } catch (e) {
        console.warn("Failed to load activity repository from localStorage", e);
      }
    }

    this.activityRecords = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_RECORDS));
    this.screenshots = JSON.parse(JSON.stringify(INITIAL_SCREENSHOTS));
    this.memberLocations = JSON.parse(JSON.stringify(INITIAL_MEMBER_LOCATIONS));
    this.geofences = JSON.parse(JSON.stringify(INITIAL_GEOFENCES));
    this.settings = { ...INITIAL_SETTINGS };
  }

  private saveToStorage(): void {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(this.activityRecords));
        localStorage.setItem(STORAGE_KEY_SCREENSHOTS, JSON.stringify(this.screenshots));
        localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.memberLocations));
        localStorage.setItem(STORAGE_KEY_GEOFENCES, JSON.stringify(this.geofences));
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      } catch (e) {
        console.warn("Failed to save activity repository to localStorage", e);
      }
    }
  }

  // ─── Activity Monitoring ──────────────────────────────────────────────────

  async getActivityRecords(filter?: ActivityFilter): Promise<ActivityRecord[]> {
    return this.activityRecords.filter((rec) => {
      if (filter?.member_id && rec.member_id !== filter.member_id) return false;
      if (filter?.project && !rec.project.toLowerCase().includes(filter.project.toLowerCase()))
        return false;
      if (filter?.status && rec.status !== filter.status) return false;
      if (filter?.min_activity !== undefined && rec.activity_percent < filter.min_activity)
        return false;
      return true;
    });
  }

  async getActivityRecord(id: string): Promise<ActivityRecord | null> {
    const found = this.activityRecords.find((r) => r.id === id || r.member_id === id);
    return found ? { ...found } : null;
  }

  async logActivityRecord(
    payload: Omit<ActivityRecord, "id" | "recorded_at"> & { id?: string }
  ): Promise<ActivityRecord> {
    const newRecord: ActivityRecord = {
      ...payload,
      id: payload.id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recorded_at: new Date().toISOString(),
    };

    const existingIdx = this.activityRecords.findIndex((r) => r.member_id === payload.member_id);
    if (existingIdx >= 0) {
      this.activityRecords[existingIdx] = newRecord;
    } else {
      this.activityRecords.unshift(newRecord);
    }

    this.saveToStorage();
    return { ...newRecord };
  }

  async getActivitySummary(): Promise<ActivitySummaryDTO> {
    const totalMembers = this.activityRecords.length;
    const activeCount = this.activityRecords.filter((r) => r.status === "TRACKING").length;
    const idleCount = this.activityRecords.filter((r) => r.status === "IDLE").length;
    const avgActivity =
      totalMembers > 0
        ? Math.round(
            this.activityRecords.reduce((acc, r) => acc + r.activity_percent, 0) / totalMembers
          )
        : 0;

    const insideGeofenceCount = this.memberLocations.filter(
      (m) => m.status === "Inside Geofence"
    ).length;
    const geofencePercent =
      this.memberLocations.length > 0
        ? Math.round((insideGeofenceCount / this.memberLocations.length) * 100)
        : 100;

    return {
      total_members_monitored: totalMembers,
      active_tracking_count: activeCount,
      idle_count: idleCount,
      average_activity_percent: avgActivity,
      total_screenshots_captured: this.screenshots.length,
      geofence_compliant_percent: geofencePercent,
    };
  }

  // ─── Screenshots ──────────────────────────────────────────────────────────

  async getScreenshots(memberId?: string, date?: string): Promise<ScreenshotItemDTO[]> {
    return this.screenshots.filter((s) => {
      if (memberId && memberId !== "all" && s.member_id !== memberId) return false;
      if (date && date !== "Today" && !s.timestamp.startsWith(date)) return false;
      return true;
    });
  }

  async getScreenshot(id: string): Promise<ScreenshotItemDTO | null> {
    const found = this.screenshots.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  async captureScreenshot(payload: CreateScreenshotPayload): Promise<ScreenshotItemDTO> {
    const now = new Date();
    const timeFormatted =
      payload.time_formatted ||
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newScreenshot: ScreenshotItemDTO = {
      id: `sc-${Date.now()}`,
      member_id: payload.member_id,
      member_name: payload.member_name,
      member_avatar: payload.member_avatar || payload.member_name.slice(0, 2).toUpperCase(),
      timestamp: now.toISOString(),
      time_formatted: timeFormatted,
      project: payload.project,
      project_color: payload.project_color || "#03a9f4",
      activity_percent: payload.activity_percent,
      app_name: payload.app_name,
      window_title: payload.window_title,
      code_snippet: payload.code_snippet,
      type: payload.type || "code",
    };

    this.screenshots.unshift(newScreenshot);
    this.saveToStorage();
    return { ...newScreenshot };
  }

  async deleteScreenshot(id: string): Promise<boolean> {
    const idx = this.screenshots.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.screenshots.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // ─── Member Locations & GPS ───────────────────────────────────────────────

  async getMemberLocations(): Promise<MemberLocationDTO[]> {
    const isGpsActive = this.settings.is_gps_active;
    return this.memberLocations.map((m) => {
      return {
        ...m,
        last_seen: isGpsActive ? (m.is_current_user ? "Just now" : m.last_seen === "-" ? "10:50 AM" : m.last_seen) : "-",
      };
    });
  }

  async getMemberLocation(id: string): Promise<MemberLocationDTO | null> {
    const found = this.memberLocations.find((m) => m.id === id);
    return found ? { ...found } : null;
  }

  async updateMemberLocation(
    id: string,
    payload: UpdateMemberLocationPayload
  ): Promise<MemberLocationDTO> {
    const idx = this.memberLocations.findIndex((m) => m.id === id);
    if (idx === -1) {
      throw new Error(`Member with ID '${id}' not found`);
    }

    const current = this.memberLocations[idx];
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedBreadcrumbs = [...current.breadcrumbs];
    if (
      updatedBreadcrumbs.length === 0 ||
      Math.abs(updatedBreadcrumbs[updatedBreadcrumbs.length - 1].lat - payload.lat) > 0.0001 ||
      Math.abs(updatedBreadcrumbs[updatedBreadcrumbs.length - 1].lng - payload.lng) > 0.0001
    ) {
      updatedBreadcrumbs.push({
        lat: payload.lat,
        lng: payload.lng,
        time: nowTime,
      });
    }

    const updated: MemberLocationDTO = {
      ...current,
      lat: payload.lat,
      lng: payload.lng,
      location_name: payload.location_name || current.location_name,
      last_seen: "Just now",
      speed: payload.speed !== undefined ? payload.speed : current.speed,
      battery: payload.battery !== undefined ? payload.battery : current.battery,
      status: payload.status !== undefined ? payload.status : current.status,
      status_color: payload.status_color !== undefined ? payload.status_color : current.status_color,
      breadcrumbs: updatedBreadcrumbs,
    };

    this.memberLocations[idx] = updated;
    this.saveToStorage();
    return { ...updated };
  }

  async recordCheckIn(
    memberId: string,
    lat: number,
    lng: number,
    locationName?: string
  ): Promise<MemberLocationDTO> {
    let idx = this.memberLocations.findIndex((m) => m.id === memberId);
    if (idx === -1) {
      const newMember: MemberLocationDTO = {
        id: memberId,
        name: memberId === "likith-dt" ? "Likith D T (You)" : memberId,
        role: "Mobile Field Worker",
        avatar: memberId.slice(0, 2).toUpperCase(),
        avatar_color: "#03a9f4",
        is_current_user: true,
        last_seen: "Just now",
        status: "Inside Geofence",
        status_color: "#10b981",
        location_name: locationName || `GPS Check-in (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
        speed: "0 km/h",
        battery: 100,
        breadcrumbs: [{ lat, lng, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
      };
      this.memberLocations.unshift(newMember);
      this.saveToStorage();
      return { ...newMember };
    }

    return this.updateMemberLocation(memberId, {
      lat,
      lng,
      location_name: locationName,
      speed: "0 km/h",
      status: "Inside Geofence",
    });
  }

  // ─── Geofences ────────────────────────────────────────────────────────────

  async getGeofences(): Promise<GeofenceZoneDTO[]> {
    return [...this.geofences];
  }

  async createGeofence(payload: CreateGeofencePayload): Promise<GeofenceZoneDTO> {
    const newZone: GeofenceZoneDTO = {
      id: `geo-${Date.now()}`,
      name: payload.name.trim(),
      address: payload.address.trim(),
      lat: payload.lat,
      lng: payload.lng,
      radius_meters: payload.radius_meters,
      color: payload.color || "#03a9f4",
    };

    this.geofences.push(newZone);
    this.saveToStorage();
    return { ...newZone };
  }

  async deleteGeofence(id: string): Promise<boolean> {
    const idx = this.geofences.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    this.geofences.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  async getSettings(): Promise<ActivitySettingsDTO> {
    return { ...this.settings };
  }

  async updateSettings(partial: Partial<ActivitySettingsDTO>): Promise<ActivitySettingsDTO> {
    this.settings = { ...this.settings, ...partial };
    this.saveToStorage();
    return { ...this.settings };
  }

  async resetSampleData(): Promise<void> {
    this.activityRecords = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_RECORDS));
    this.screenshots = JSON.parse(JSON.stringify(INITIAL_SCREENSHOTS));
    this.memberLocations = JSON.parse(JSON.stringify(INITIAL_MEMBER_LOCATIONS));
    this.geofences = JSON.parse(JSON.stringify(INITIAL_GEOFENCES));
    this.settings = { ...INITIAL_SETTINGS };
    this.saveToStorage();
  }
}

export const activityRepository = new ActivityRepository();
