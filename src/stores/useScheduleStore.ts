import { create } from "zustand";

export interface ScheduleAssignment {
    id: string;
    projectId: string;
    projectName: string;
    projectColor: string;
    client: string;
    memberId: string;
    memberName: string;
    memberInitials: string;
    memberAvatarColor: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    hoursPerDay: number;
    totalHours: number;
    note?: string;
    versionLabel?: string;
    isHatched?: boolean;
    isMilestoneActive?: boolean;
}

export interface ScheduleProject {
    id: string;
    name: string;
    client: string;
    color: string;
    totalAssignedHours: number;
    assignments: ScheduleAssignment[];
}

export interface ScheduleMember {
    id: string;
    name: string;
    role: string;
    initials: string;
    avatarColor: string;
    totalAssignedHours: number;
    assignments: ScheduleAssignment[];
}

interface ScheduleState {
    activeTab: "projects" | "team";
    hasSampleData: boolean;
    dateRange: {
        startDate: string; // e.g. "2026-08-31"
        endDate: string; // e.g. "2026-09-30"
    };
    zoomLevel: "compact" | "normal" | "spacious";
    filterStatus: "all" | "active" | "assigned" | "unassigned";
    searchQuery: string;
    isPublished: boolean;
    expandedProjectIds: string[];
    expandedMemberIds: string[];
    isAddModalOpen: boolean;
    isRemoveSampleModalOpen: boolean;
    selectedAssignmentForEdit: ScheduleAssignment | null;

    // Actions
    setActiveTab: (tab: "projects" | "team") => void;
    setDateRange: (range: { startDate: string; endDate: string }) => void;
    navigateDateRange: (direction: "prev" | "next") => void;
    setZoomLevel: (zoom: "compact" | "normal" | "spacious") => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setFilterStatus: (status: "all" | "active" | "assigned" | "unassigned") => void;
    setSearchQuery: (query: string) => void;
    toggleProjectExpand: (projectId: string) => void;
    toggleMemberExpand: (memberId: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    openAddModal: (assignment?: ScheduleAssignment | null) => void;
    closeAddModal: () => void;
    openRemoveSampleModal: () => void;
    closeRemoveSampleModal: () => void;
    removeSampleData: () => void;
    restoreSampleData: () => void;
    togglePublish: () => void;
    addAssignment: (assignment: Omit<ScheduleAssignment, "id">) => void;
    deleteAssignment: (id: string) => void;
    assignments: ScheduleAssignment[];
}

const INITIAL_SAMPLE_ASSIGNMENTS: ScheduleAssignment[] = [
    // [SAMPLE] Project Alpha (24h)
    {
        id: "assign-alpha-1",
        projectId: "proj-alpha",
        projectName: "[SAMPLE] Project Alpha",
        projectColor: "#F59E0B",
        client: "[SAMPLE] Client B",
        memberId: "tm-bindhu",
        memberName: "Bindhu Shree",
        memberInitials: "BS",
        memberAvatarColor: "#00897B",
        startDate: "2026-08-31",
        endDate: "2026-09-02",
        hoursPerDay: 8,
        totalHours: 16,
        note: "Frontend Architecture & UI Setup",
    },
    {
        id: "assign-alpha-2",
        projectId: "proj-alpha",
        projectName: "[SAMPLE] Project Alpha",
        projectColor: "#F59E0B",
        client: "[SAMPLE] Client B",
        memberId: "tm-likith",
        memberName: "Likith D T",
        memberInitials: "LD",
        memberAvatarColor: "#0288D1",
        startDate: "2026-09-03",
        endDate: "2026-09-03",
        hoursPerDay: 8,
        totalHours: 8,
        note: "API Integration sprint",
    },

    // [SAMPLE] Project Beta (52h)
    {
        id: "assign-beta-1",
        projectId: "proj-beta",
        projectName: "[SAMPLE] Project Beta",
        projectColor: "#EF4444",
        client: "[SAMPLE] Client A",
        memberId: "tm-likith",
        memberName: "Likith D T",
        memberInitials: "LD",
        memberAvatarColor: "#0288D1",
        startDate: "2026-08-31",
        endDate: "2026-09-08",
        hoursPerDay: 4,
        totalHours: 28,
        note: "Rust Native Backend Modules",
    },
    {
        id: "assign-beta-2",
        projectId: "proj-beta",
        projectName: "[SAMPLE] Project Beta",
        projectColor: "#EF4444",
        client: "[SAMPLE] Client A",
        memberId: "tm-james",
        memberName: "James Anderson",
        memberInitials: "JA",
        memberAvatarColor: "#64748B",
        startDate: "2026-09-09",
        endDate: "2026-09-17",
        hoursPerDay: 4,
        totalHours: 24,
        note: "Database Migrations & Security Tests",
    },

    // [SAMPLE] Project Gamma (71h)
    // Hatched segment V1 (Aug 31 to Sep 01)
    {
        id: "assign-gamma-v1",
        projectId: "proj-gamma",
        projectName: "[SAMPLE] Project Gamma",
        projectColor: "#78716C",
        client: "[SAMPLE] Client A",
        memberId: "tm-lara",
        memberName: "Lara Peterson",
        memberInitials: "LP",
        memberAvatarColor: "#4CAF50",
        startDate: "2026-08-31",
        endDate: "2026-09-01",
        hoursPerDay: 8,
        totalHours: 16,
        versionLabel: "V1",
        isHatched: true,
        note: "Version 1 Prototyping Phase",
        isMilestoneActive: true,
    },
    {
        id: "assign-gamma-main",
        projectId: "proj-gamma",
        projectName: "[SAMPLE] Project Gamma",
        projectColor: "#78716C",
        client: "[SAMPLE] Client A",
        memberId: "tm-james",
        memberName: "James Anderson",
        memberInitials: "JA",
        memberAvatarColor: "#64748B",
        startDate: "2026-09-02",
        endDate: "2026-09-13",
        hoursPerDay: 4.5,
        totalHours: 40,
        note: "Core Infrastructure Cluster Build",
        isMilestoneActive: true,
    },
    {
        id: "assign-gamma-late",
        projectId: "proj-gamma",
        projectName: "[SAMPLE] Project Gamma",
        projectColor: "#78716C",
        client: "[SAMPLE] Client A",
        memberId: "tm-lara",
        memberName: "Lara Peterson",
        memberInitials: "LP",
        memberAvatarColor: "#4CAF50",
        startDate: "2026-09-14",
        endDate: "2026-09-18",
        hoursPerDay: 3,
        totalHours: 15,
        note: "Release Validation & QA",
        isMilestoneActive: true,
    },
];

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    activeTab: "projects",
    hasSampleData: true,
    dateRange: {
        startDate: "2026-08-31",
        endDate: "2026-09-30",
    },
    zoomLevel: "normal",
    filterStatus: "all",
    searchQuery: "",
    isPublished: true,
    expandedProjectIds: ["proj-alpha", "proj-beta", "proj-gamma"],
    expandedMemberIds: ["tm-bindhu", "tm-likith", "tm-james", "tm-lara"],
    isAddModalOpen: false,
    isRemoveSampleModalOpen: false,
    selectedAssignmentForEdit: null,
    assignments: INITIAL_SAMPLE_ASSIGNMENTS,

    setActiveTab: (tab) => set({ activeTab: tab }),

    setDateRange: (range) => set({ dateRange: range }),

    navigateDateRange: (direction) => {
        const { startDate } = get().dateRange;
        const currentStart = new Date(startDate);
        const monthDelta = direction === "next" ? 1 : -1;
        const newStart = new Date(currentStart.getFullYear(), currentStart.getMonth() + monthDelta, 1);
        const newEnd = new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0);

        const formatDate = (d: Date) => d.toISOString().split("T")[0];
        set({
            dateRange: {
                startDate: formatDate(newStart),
                endDate: formatDate(newEnd),
            },
        });
    },

    setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

    zoomIn: () => {
        const current = get().zoomLevel;
        if (current === "compact") set({ zoomLevel: "normal" });
        else if (current === "normal") set({ zoomLevel: "spacious" });
    },

    zoomOut: () => {
        const current = get().zoomLevel;
        if (current === "spacious") set({ zoomLevel: "normal" });
        else if (current === "normal") set({ zoomLevel: "compact" });
    },

    setFilterStatus: (status) => set({ filterStatus: status }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleProjectExpand: (projectId) => {
        const current = get().expandedProjectIds;
        set({
            expandedProjectIds: current.includes(projectId)
                ? current.filter((id) => id !== projectId)
                : [...current, projectId],
        });
    },

    toggleMemberExpand: (memberId) => {
        const current = get().expandedMemberIds;
        set({
            expandedMemberIds: current.includes(memberId)
                ? current.filter((id) => id !== memberId)
                : [...current, memberId],
        });
    },

    expandAll: () => {
        const { assignments } = get();
        const projectIds = Array.from(new Set(assignments.map((a) => a.projectId)));
        const memberIds = Array.from(new Set(assignments.map((a) => a.memberId)));
        set({
            expandedProjectIds: projectIds,
            expandedMemberIds: memberIds,
        });
    },

    collapseAll: () => {
        set({
            expandedProjectIds: [],
            expandedMemberIds: [],
        });
    },

    openAddModal: (assignment = null) => {
        set({ isAddModalOpen: true, selectedAssignmentForEdit: assignment });
    },

    closeAddModal: () => {
        set({ isAddModalOpen: false, selectedAssignmentForEdit: null });
    },

    openRemoveSampleModal: () => set({ isRemoveSampleModalOpen: true }),
    closeRemoveSampleModal: () => set({ isRemoveSampleModalOpen: false }),

    removeSampleData: () => {
        set({
            hasSampleData: false,
            assignments: [],
            isRemoveSampleModalOpen: false,
        });
    },

    restoreSampleData: () => {
        set({
            hasSampleData: true,
            assignments: INITIAL_SAMPLE_ASSIGNMENTS,
            expandedProjectIds: ["proj-alpha", "proj-beta", "proj-gamma"],
            expandedMemberIds: ["tm-bindhu", "tm-likith", "tm-james", "tm-lara"],
        });
    },

    togglePublish: () => {
        set((state) => ({ isPublished: !state.isPublished }));
    },

    addAssignment: (newAssignmentData) => {
        const id = `assign-${Date.now()}`;
        const newAssignment: ScheduleAssignment = {
            ...newAssignmentData,
            id,
        };
        set((state) => ({
            assignments: [...state.assignments, newAssignment],
            isAddModalOpen: false,
            selectedAssignmentForEdit: null,
            // Ensure newly assigned project or member is expanded
            expandedProjectIds: Array.from(new Set([...state.expandedProjectIds, newAssignment.projectId])),
            expandedMemberIds: Array.from(new Set([...state.expandedMemberIds, newAssignment.memberId])),
        }));
    },

    deleteAssignment: (id) => {
        set((state) => ({
            assignments: state.assignments.filter((a) => a.id !== id),
        }));
    },
}));
