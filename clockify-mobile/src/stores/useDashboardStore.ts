import { create } from "zustand";

export interface DailyStat {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Mon, Aug 31"
  shortDay: string; // "Mon"
  billableSeconds: number;
  nonBillableSeconds: number;
  totalSeconds: number;
}

export interface ActivityItem {
  id: string;
  description: string;
  projectName: string;
  projectColor: string;
  clientName: string;
  seconds: number;
  isBillable: boolean;
  user: string;
}

export interface ProjectStat {
  id: string;
  name: string;
  color: string;
  client: string;
  seconds: number;
  billableSeconds: number;
  amount: number;
}

export interface TeamMemberStat {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isTracking: boolean;
  currentTask?: string;
  currentProject?: string;
  projectColor?: string;
  todaySeconds: number;
  weekSeconds: number;
}

export type DateRangeType = "this_week" | "last_week" | "this_month" | "last_month";
export type UserFilterType = "only_me" | "team";

interface DashboardState {
  // Filters
  dateRangeType: DateRangeType;
  currentWeekStart: string; // YYYY-MM-DD of Monday
  userFilter: UserFilterType;
  projectFilter: string; // "all" or project name
  topActivitiesLimit: 5 | 10;
  hasSampleData: boolean;
  isQuickLogModalOpen: boolean;
  selectedDayIndex: number | null;

  // Base raw data
  sampleActivities: ActivityItem[];
  sampleTeamMembers: TeamMemberStat[];

  // Actions
  setDateRangeType: (type: DateRangeType) => void;
  navigateWeek: (direction: "prev" | "next" | "current") => void;
  setUserFilter: (filter: UserFilterType) => void;
  setProjectFilter: (project: string) => void;
  setTopActivitiesLimit: (limit: 5 | 10) => void;
  setSelectedDayIndex: (index: number | null) => void;
  removeSampleData: () => void;
  restoreSampleData: () => void;
  openQuickLogModal: () => void;
  closeQuickLogModal: () => void;
  addTimeEntry: (entry: Omit<ActivityItem, "id">) => void;

  // Computed Selectors
  getFilteredActivities: () => ActivityItem[];
  getDailyStats: () => DailyStat[];
  getTotalSeconds: () => number;
  getBillableSeconds: () => number;
  getNonBillableSeconds: () => number;
  getTopProject: () => { name: string; color: string; client: string; seconds: number } | null;
  getTopClient: () => { name: string; seconds: number; percentage: number } | null;
  getProjectStats: () => ProjectStat[];
  getBillableAmount: () => number;
}

// Helper to format seconds to HH:MM:SS
export function formatDurationHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Helper to format seconds to e.g. "5h 30m"
export function formatDurationHuman(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Initial realistic Clockify sample dataset
const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    description: "Mobile App Architecture & State Store Refactoring",
    projectName: "Mobile App 2.0",
    projectColor: "#03a9f4",
    clientName: "Internal",
    seconds: 28800, // 8h
    isBillable: true,
    user: "SH",
  },
  {
    id: "act-2",
    description: "UI Components & Responsive Layout Optimization",
    projectName: "Mobile App 2.0",
    projectColor: "#03a9f4",
    clientName: "Internal",
    seconds: 21600, // 6h
    isBillable: true,
    user: "SH",
  },
  {
    id: "act-3",
    description: "Client API Integration & Token Auth",
    projectName: "Backend Microservices",
    projectColor: "#10b981",
    clientName: "Acme Corp",
    seconds: 18000, // 5h
    isBillable: true,
    user: "SH",
  },
  {
    id: "act-4",
    description: "Design Review & Wireframes Sprint",
    projectName: "Design System",
    projectColor: "#f59e0b",
    clientName: "Starlight Inc",
    seconds: 14400, // 4h
    isBillable: false,
    user: "SH",
  },
  {
    id: "act-5",
    description: "Attendance Terminal Testing & PIN Keypad",
    projectName: "Kiosk Management",
    projectColor: "#8b5cf6",
    clientName: "Retail Group",
    seconds: 12600, // 3.5h
    isBillable: true,
    user: "SH",
  },
  {
    id: "act-6",
    description: "Timesheet Grid Synchronizer Backend",
    projectName: "Timesheet Core",
    projectColor: "#ec4899",
    clientName: "Internal",
    seconds: 10800, // 3h
    isBillable: true,
    user: "SH",
  },
  {
    id: "act-7",
    description: "Daily Standup & Sprint Planning",
    projectName: "General Operations",
    projectColor: "#64748b",
    clientName: "Internal",
    seconds: 7200, // 2h
    isBillable: false,
    user: "SH",
  },
  {
    id: "act-8",
    description: "Weekly Expense Report Reconciliation",
    projectName: "Finance & Expenses",
    projectColor: "#06b6d4",
    clientName: "Acme Corp",
    seconds: 5400, // 1.5h
    isBillable: true,
    user: "LD",
  },
  {
    id: "act-9",
    description: "Bug Triage & PR Validation",
    projectName: "Mobile App 2.0",
    projectColor: "#03a9f4",
    clientName: "Internal",
    seconds: 9000, // 2.5h
    isBillable: true,
    user: "BK",
  },
  {
    id: "act-10",
    description: "Postgres Drizzle Schema Seed Migration",
    projectName: "Backend Microservices",
    projectColor: "#10b981",
    clientName: "Acme Corp",
    seconds: 7200, // 2h
    isBillable: true,
    user: "BS",
  },
];

const INITIAL_TEAM: TeamMemberStat[] = [
  {
    id: "tm-1",
    name: "Shivashankar B S",
    avatar: "SH",
    role: "Lead Mobile Developer",
    isTracking: true,
    currentTask: "Dashboard Navigation & KPI Cards",
    currentProject: "Mobile App 2.0",
    projectColor: "#03a9f4",
    todaySeconds: 23400,
    weekSeconds: 115200,
  },
  {
    id: "tm-2",
    name: "Likith D T",
    avatar: "LD",
    role: "Product Owner",
    isTracking: false,
    currentTask: "Sprint Backlog Review",
    currentProject: "General Operations",
    projectColor: "#64748b",
    todaySeconds: 18000,
    weekSeconds: 98000,
  },
  {
    id: "tm-3",
    name: "Bindhu Shree K R",
    avatar: "BK",
    role: "Backend Architect",
    isTracking: true,
    currentTask: "Schedule Route Endpoints",
    currentProject: "Backend Microservices",
    projectColor: "#10b981",
    todaySeconds: 25200,
    weekSeconds: 122400,
  },
  {
    id: "tm-4",
    name: "Bhabina B",
    avatar: "BB",
    role: "Reports Engineer",
    isTracking: false,
    todaySeconds: 14400,
    weekSeconds: 84000,
  },
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dateRangeType: "this_week",
  currentWeekStart: "2026-08-31", // Matching Dashboard.png (Mon, Aug 31)
  userFilter: "only_me",
  projectFilter: "all",
  topActivitiesLimit: 5,
  hasSampleData: true,
  isQuickLogModalOpen: false,
  selectedDayIndex: null,

  sampleActivities: INITIAL_ACTIVITIES,
  sampleTeamMembers: INITIAL_TEAM,

  setDateRangeType: (dateRangeType) => set({ dateRangeType }),

  navigateWeek: (direction) => {
    const { currentWeekStart } = get();
    const cur = new Date(currentWeekStart);
    if (direction === "prev") {
      cur.setDate(cur.getDate() - 7);
    } else if (direction === "next") {
      cur.setDate(cur.getDate() + 7);
    } else {
      // current week (Aug 31, 2026)
      return set({ currentWeekStart: "2026-08-31" });
    }
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    set({ currentWeekStart: `${y}-${m}-${d}` });
  },

  setUserFilter: (userFilter) => set({ userFilter }),
  setProjectFilter: (projectFilter) => set({ projectFilter }),
  setTopActivitiesLimit: (topActivitiesLimit) => set({ topActivitiesLimit }),
  setSelectedDayIndex: (selectedDayIndex) => set({ selectedDayIndex }),

  removeSampleData: () => set({ hasSampleData: false }),
  restoreSampleData: () => set({ hasSampleData: true, sampleActivities: INITIAL_ACTIVITIES }),

  openQuickLogModal: () => set({ isQuickLogModalOpen: true }),
  closeQuickLogModal: () => set({ isQuickLogModalOpen: false }),

  addTimeEntry: (entry) => {
    const newEntry: ActivityItem = {
      ...entry,
      id: `act-${Date.now()}`,
    };
    set((state) => ({
      sampleActivities: [newEntry, ...state.sampleActivities],
      hasSampleData: true,
    }));
  },

  getFilteredActivities: () => {
    const { sampleActivities, hasSampleData, userFilter, projectFilter } = get();
    if (!hasSampleData) return [];

    return sampleActivities.filter((item) => {
      // User filter
      if (userFilter === "only_me" && item.user !== "SH") {
        return false;
      }
      // Project filter
      if (projectFilter !== "all" && item.projectName !== projectFilter) {
        return false;
      }
      return true;
    });
  },

  getDailyStats: () => {
    const { currentWeekStart, hasSampleData, getFilteredActivities } = get();
    const days: DailyStat[] = [];
    const baseDate = new Date(currentWeekStart);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Sample distribution ratio across Mon-Sun
    const ratios = [0.22, 0.25, 0.20, 0.18, 0.12, 0.03, 0.00];

    const activities = getFilteredActivities();
    const totalSecs = hasSampleData ? activities.reduce((acc, c) => acc + c.seconds, 0) : 0;
    const billableRatio = activities.length > 0
      ? activities.filter((a) => a.isBillable).reduce((acc, c) => acc + c.seconds, 0) / (totalSecs || 1)
      : 0.8;

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const y = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, "0");
      const dStr = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${mStr}-${dStr}`;

      const dayTotal = hasSampleData ? Math.round(totalSecs * ratios[i]) : 0;
      const dayBillable = Math.round(dayTotal * billableRatio);
      const dayNonBillable = dayTotal - dayBillable;

      days.push({
        date: dateStr,
        dayLabel: `${dayNames[i]}, ${monthNames[d.getMonth()]} ${d.getDate()}`,
        shortDay: dayNames[i],
        billableSeconds: dayBillable,
        nonBillableSeconds: dayNonBillable,
        totalSeconds: dayTotal,
      });
    }

    return days;
  },

  getTotalSeconds: () => {
    const activities = get().getFilteredActivities();
    return activities.reduce((acc, item) => acc + item.seconds, 0);
  },

  getBillableSeconds: () => {
    const activities = get().getFilteredActivities();
    return activities.filter((a) => a.isBillable).reduce((acc, item) => acc + item.seconds, 0);
  },

  getNonBillableSeconds: () => {
    const activities = get().getFilteredActivities();
    return activities.filter((a) => !a.isBillable).reduce((acc, item) => acc + item.seconds, 0);
  },

  getTopProject: () => {
    const activities = get().getFilteredActivities();
    if (activities.length === 0) return null;

    const map = new Map<string, { seconds: number; color: string; client: string }>();
    for (const act of activities) {
      const existing = map.get(act.projectName) || { seconds: 0, color: act.projectColor, client: act.clientName };
      existing.seconds += act.seconds;
      map.set(act.projectName, existing);
    }

    let top: { name: string; color: string; client: string; seconds: number } | null = null;
    map.forEach((val, name) => {
      if (!top || val.seconds > top.seconds) {
        top = { name, color: val.color, client: val.client, seconds: val.seconds };
      }
    });

    return top;
  },

  getTopClient: () => {
    const activities = get().getFilteredActivities();
    if (activities.length === 0) return null;

    const total = activities.reduce((acc, a) => acc + a.seconds, 0);
    const map = new Map<string, number>();
    for (const act of activities) {
      if (act.clientName && act.clientName !== "Internal") {
        map.set(act.clientName, (map.get(act.clientName) || 0) + act.seconds);
      }
    }

    let topClientName = "--";
    let maxSeconds = 0;
    map.forEach((sec, name) => {
      if (sec > maxSeconds) {
        maxSeconds = sec;
        topClientName = name;
      }
    });

    if (maxSeconds === 0) {
      return { name: "Internal", seconds: total, percentage: 100 };
    }

    return {
      name: topClientName,
      seconds: maxSeconds,
      percentage: Math.round((maxSeconds / (total || 1)) * 100),
    };
  },

  getProjectStats: () => {
    const activities = get().getFilteredActivities();
    const map = new Map<string, ProjectStat>();

    for (const act of activities) {
      const existing = map.get(act.projectName) || {
        id: act.projectName,
        name: act.projectName,
        color: act.projectColor,
        client: act.clientName,
        seconds: 0,
        billableSeconds: 0,
        amount: 0,
      };

      existing.seconds += act.seconds;
      if (act.isBillable) {
        existing.billableSeconds += act.seconds;
        // Standard rate $75/hr
        existing.amount += Math.round((act.seconds / 3600) * 75);
      }
      map.set(act.projectName, existing);
    }

    return Array.from(map.values()).sort((a, b) => b.seconds - a.seconds);
  },

  getBillableAmount: () => {
    const billableSecs = get().getBillableSeconds();
    return Math.round((billableSecs / 3600) * 75);
  },
}));
