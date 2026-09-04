import { create } from "zustand";

export interface Project {
    id: string;
    name: string;
    color: string;
    client: string | null;
    trackedHours: number;
    budgetHours?: number;
    budgetAmount?: number;
    isRecurring?: boolean;
    amount: number;
    currency: string;
    progressPercent?: number;
    isBudgetExceeded?: boolean;
    access: "Public" | "Private";
    isFavorite: boolean;
    isArchived: boolean;
    isBillable: boolean;
    createdAt: Date;
}

export type StatusFilter = "Active" | "Archived" | "All";
export type AccessFilter = "All" | "Public" | "Private";
export type BillingFilter = "All" | "Billable" | "Non-billable";
export type SortColumn = "name" | "client" | "tracked" | "amount" | "progress";
export type SortDirection = "asc" | "desc";

interface ProjectState {
    projects: Project[];
    hasSampleData: boolean;
    searchQuery: string;
    statusFilter: StatusFilter;
    clientFilter: string;
    accessFilter: AccessFilter;
    billingFilter: BillingFilter;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    selectedProjectIds: string[];
    isCreateModalOpen: boolean;
    isRemoveSampleModalOpen: boolean;

    // Actions
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: StatusFilter) => void;
    setClientFilter: (client: string) => void;
    setAccessFilter: (access: AccessFilter) => void;
    setBillingFilter: (billing: BillingFilter) => void;
    setSort: (column: SortColumn) => void;
    toggleSelectProject: (id: string) => void;
    selectAllProjects: () => void;
    clearSelectedProjects: () => void;
    toggleFavorite: (id: string) => void;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    setRemoveSampleModalOpen: (open: boolean) => void;
    removeSampleData: () => void;
    restoreSampleData: () => void;
    createProject: (params: {
        name: string;
        color: string;
        client: string | null;
        isPublic: boolean;
        isBillable?: boolean;
    }) => void;
    deleteProject: (id: string) => void;
    archiveProject: (id: string) => void;
    restoreProject: (id: string) => void;
}

const sampleProjects: Project[] = [
    {
        id: "proj-1",
        name: "[SAMPLE] Internal Work",
        color: "#03a9f4",
        client: null,
        trackedHours: 0,
        amount: 0,
        currency: "USD",
        access: "Public",
        isFavorite: false,
        isArchived: false,
        isBillable: true,
        createdAt: new Date("2026-01-01"),
    },
    {
        id: "proj-2",
        name: "[SAMPLE] Project Orion",
        color: "#f59e0b",
        client: "[SAMPLE] Client B",
        trackedHours: 282,
        budgetHours: 400,
        amount: 2953.0,
        currency: "USD",
        progressPercent: 70.5,
        access: "Public",
        isFavorite: false,
        isArchived: false,
        isBillable: true,
        createdAt: new Date("2026-01-10"),
    },
    {
        id: "proj-3",
        name: "[SAMPLE] Project Apollo",
        color: "#ef4444",
        client: "[SAMPLE] Client A",
        trackedHours: 367,
        // No hourly budget, but has monetary budget of 400.00 USD
        amount: 3237.34,
        budgetAmount: 400.0,
        currency: "USD",
        progressPercent: 809.33,
        isBudgetExceeded: true,
        access: "Public",
        isFavorite: false,
        isArchived: false,
        isBillable: true,
        createdAt: new Date("2026-01-15"),
    },
    {
        id: "proj-4",
        name: "[SAMPLE] Project Phoenix",
        color: "#78716c",
        client: "[SAMPLE] Client A",
        trackedHours: 38,
        budgetHours: 200,
        isRecurring: true,
        amount: 405.0,
        currency: "USD",
        progressPercent: 19.0,
        access: "Public",
        isFavorite: false,
        isArchived: false,
        isBillable: true,
        createdAt: new Date("2026-02-01"),
    },
];

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: sampleProjects,
    hasSampleData: true,
    searchQuery: "",
    statusFilter: "Active",
    clientFilter: "All",
    accessFilter: "All",
    billingFilter: "All",
    sortColumn: "name",
    sortDirection: "asc",
    selectedProjectIds: [],
    isCreateModalOpen: false,
    isRemoveSampleModalOpen: false,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    setClientFilter: (clientFilter) => set({ clientFilter }),
    setAccessFilter: (accessFilter) => set({ accessFilter }),
    setBillingFilter: (billingFilter) => set({ billingFilter }),

    setSort: (column) => {
        const { sortColumn, sortDirection } = get();
        if (sortColumn === column) {
            set({ sortDirection: sortDirection === "asc" ? "desc" : "asc" });
        } else {
            set({ sortColumn: column, sortDirection: "asc" });
        }
    },

    toggleSelectProject: (id) => {
        const { selectedProjectIds } = get();
        if (selectedProjectIds.includes(id)) {
            set({ selectedProjectIds: selectedProjectIds.filter((pId) => pId !== id) });
        } else {
            set({ selectedProjectIds: [...selectedProjectIds, id] });
        }
    },

    selectAllProjects: () => {
        const { projects, selectedProjectIds } = get();
        if (selectedProjectIds.length === projects.length) {
            set({ selectedProjectIds: [] });
        } else {
            set({ selectedProjectIds: projects.map((p) => p.id) });
        }
    },

    clearSelectedProjects: () => set({ selectedProjectIds: [] }),

    toggleFavorite: (id) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
            ),
        }));
    },

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    setRemoveSampleModalOpen: (open) => set({ isRemoveSampleModalOpen: open }),

    removeSampleData: () => {
        set((state) => ({
            projects: state.projects.filter((p) => !p.name.startsWith("[SAMPLE]")),
            hasSampleData: false,
            isRemoveSampleModalOpen: false,
        }));
    },

    restoreSampleData: () => {
        set((state) => {
            const nonSample = state.projects.filter((p) => !p.name.startsWith("[SAMPLE]"));
            return {
                projects: [...sampleProjects, ...nonSample],
                hasSampleData: true,
            };
        });
    },

    createProject: ({ name, color, client, isPublic, isBillable = true }) => {
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name,
            color,
            client,
            trackedHours: 0,
            amount: 0,
            currency: "USD",
            access: isPublic ? "Public" : "Private",
            isFavorite: false,
            isArchived: false,
            isBillable,
            createdAt: new Date(),
        };

        set((state) => ({
            projects: [newProject, ...state.projects],
            isCreateModalOpen: false,
        }));
    },

    deleteProject: (id) => {
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            selectedProjectIds: state.selectedProjectIds.filter((pId) => pId !== id),
        }));
    },

    archiveProject: (id) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, isArchived: true } : p
            ),
        }));
    },

    restoreProject: (id) => {
        set((state) => ({
            projects: state.projects.map((p) =>
                p.id === id ? { ...p, isArchived: false } : p
            ),
        }));
    },
}));
