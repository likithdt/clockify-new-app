import { create } from "zustand";

export interface TimesheetApprovalItem {
    id: string;
    period: string; // e.g. "Aug 31, 2026 - Sep 6, 2026"
    periodSortDate: string; // ISO date for sorting
    user: string;
    teamManager: string;
    time: string; // "16:00:00"
    timeOff: string; // "00:00:00"
    status: "pending" | "unsubmitted" | "approved" | "rejected";
    submittedAt?: string;
    approvedAt?: string;
}

export interface ExpenseApprovalItem {
    id: string;
    period: string; // e.g. "Jul 6, 2026 - Jul 12, 2026"
    periodSortDate: string;
    user: string;
    teamManager: string;
    category: string; // "Day rate"
    amount: number;
    currency: string;
    status: "pending" | "unsubmitted" | "approved" | "rejected";
    submittedAt?: string;
    approvedAt?: string;
}

export type ApprovalTab = "timesheet" | "expenses";
export type ApprovalStatusTab = "pending" | "unsubmitted" | "archive";
export type SortOption = "date-desc" | "date-asc" | "user-asc";

interface ApprovalState {
    activeTab: ApprovalTab;
    statusTab: ApprovalStatusTab;
    sortBy: SortOption;
    teamFilter: string;
    categoryFilter: string;
    selectedIds: string[];
    toastMessage: string | null;

    timesheetItems: TimesheetApprovalItem[];
    expenseItems: ExpenseApprovalItem[];

    // Actions
    setActiveTab: (tab: ApprovalTab) => void;
    setStatusTab: (tab: ApprovalStatusTab) => void;
    setSortBy: (sort: SortOption) => void;
    setTeamFilter: (team: string) => void;
    setCategoryFilter: (cat: string) => void;
    toggleSelect: (id: string) => void;
    selectAllInGroup: (ids: string[]) => void;
    clearSelection: () => void;
    approveSelected: () => void;
    approveAll: () => void;
    rejectSelected: () => void;
    remindToApprove: () => void;
    setToastMessage: (msg: string | null) => void;
    resetSampleData: () => void;
}

const initialTimesheets: TimesheetApprovalItem[] = [
    {
        id: "ts-1",
        period: "Aug 31, 2026 - Sep 6, 2026",
        periodSortDate: "2026-08-31",
        user: "[SAMPLE] Amy Smith",
        teamManager: "-",
        time: "16:00:00",
        timeOff: "00:00:00",
        status: "pending",
        submittedAt: "2026-09-01",
    },
    {
        id: "ts-2",
        period: "Jul 13, 2026 - Jul 19, 2026",
        periodSortDate: "2026-07-13",
        user: "[SAMPLE] James Anderson",
        teamManager: "[SAMPLE] Lara Peterson",
        time: "09:00:00",
        timeOff: "00:00:00",
        status: "pending",
        submittedAt: "2026-07-20",
    },
    {
        id: "ts-3",
        period: "Jul 6, 2026 - Jul 12, 2026",
        periodSortDate: "2026-07-06",
        user: "[SAMPLE] Lara Peterson",
        teamManager: "-",
        time: "40:00:00",
        timeOff: "08:00:00",
        status: "pending",
        submittedAt: "2026-07-13",
    },
    // Unsubmitted sample
    {
        id: "ts-unsub-1",
        period: "Aug 31, 2026 - Sep 6, 2026",
        periodSortDate: "2026-08-31",
        user: "[SAMPLE] David Lee",
        teamManager: "[SAMPLE] Lara Peterson",
        time: "12:30:00",
        timeOff: "00:00:00",
        status: "unsubmitted",
    },
    // Archive sample
    {
        id: "ts-arch-1",
        period: "Jun 22, 2026 - Jun 28, 2026",
        periodSortDate: "2026-06-22",
        user: "[SAMPLE] Amy Smith",
        teamManager: "-",
        time: "38:15:00",
        timeOff: "00:00:00",
        status: "approved",
        approvedAt: "2026-06-29",
    },
];

const initialExpenses: ExpenseApprovalItem[] = [
    {
        id: "exp-app-1",
        period: "Jul 6, 2026 - Jul 12, 2026",
        periodSortDate: "2026-07-06",
        user: "[SAMPLE] Lara Peterson",
        teamManager: "-",
        category: "Day rate",
        amount: 100.0,
        currency: "USD",
        status: "pending",
        submittedAt: "2026-07-13",
    },
    // Unsubmitted sample
    {
        id: "exp-unsub-1",
        period: "Aug 31, 2026 - Sep 6, 2026",
        periodSortDate: "2026-08-31",
        user: "[SAMPLE] James Anderson",
        teamManager: "[SAMPLE] Lara Peterson",
        category: "Travel",
        amount: 240.5,
        currency: "USD",
        status: "unsubmitted",
    },
    // Archive sample
    {
        id: "exp-arch-1",
        period: "Jun 15, 2026 - Jun 21, 2026",
        periodSortDate: "2026-06-15",
        user: "[SAMPLE] Lara Peterson",
        teamManager: "-",
        category: "Software",
        amount: 49.0,
        currency: "USD",
        status: "approved",
        approvedAt: "2026-06-22",
    },
];

export const useApprovalStore = create<ApprovalState>((set, get) => ({
    activeTab: "timesheet",
    statusTab: "pending",
    sortBy: "date-desc",
    teamFilter: "all",
    categoryFilter: "all",
    selectedIds: [],
    toastMessage: null,

    timesheetItems: initialTimesheets,
    expenseItems: initialExpenses,

    setActiveTab: (tab) => {
        set({ activeTab: tab, selectedIds: [] });
    },

    setStatusTab: (tab) => {
        set({ statusTab: tab, selectedIds: [] });
    },

    setSortBy: (sort) => {
        set({ sortBy: sort });
    },

    setTeamFilter: (team) => {
        set({ teamFilter: team });
    },

    setCategoryFilter: (cat) => {
        set({ categoryFilter: cat });
    },

    toggleSelect: (id) => {
        set((state) => {
            if (state.selectedIds.includes(id)) {
                return { selectedIds: state.selectedIds.filter((item) => item !== id) };
            } else {
                return { selectedIds: [...state.selectedIds, id] };
            }
        });
    },

    selectAllInGroup: (ids) => {
        set((state) => {
            const allSelected = ids.every((id) => state.selectedIds.includes(id));
            if (allSelected) {
                return {
                    selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
                };
            } else {
                const combined = Array.from(new Set([...state.selectedIds, ...ids]));
                return { selectedIds: combined };
            }
        });
    },

    clearSelection: () => {
        set({ selectedIds: [] });
    },

    approveSelected: () => {
        const { activeTab, selectedIds } = get();
        if (selectedIds.length === 0) return;

        if (activeTab === "timesheet") {
            set((state) => ({
                timesheetItems: state.timesheetItems.map((item) =>
                    selectedIds.includes(item.id)
                        ? { ...item, status: "approved", approvedAt: new Date().toISOString().slice(0, 10) }
                        : item
                ),
                selectedIds: [],
                toastMessage: `${selectedIds.length} timesheet(s) approved.`,
            }));
        } else {
            set((state) => ({
                expenseItems: state.expenseItems.map((item) =>
                    selectedIds.includes(item.id)
                        ? { ...item, status: "approved", approvedAt: new Date().toISOString().slice(0, 10) }
                        : item
                ),
                selectedIds: [],
                toastMessage: `${selectedIds.length} expense(s) approved.`,
            }));
        }
    },

    approveAll: () => {
        const { activeTab } = get();
        if (activeTab === "timesheet") {
            const pendingCount = get().timesheetItems.filter((i) => i.status === "pending").length;
            if (pendingCount === 0) return;

            set((state) => ({
                timesheetItems: state.timesheetItems.map((item) =>
                    item.status === "pending"
                        ? { ...item, status: "approved", approvedAt: new Date().toISOString().slice(0, 10) }
                        : item
                ),
                selectedIds: [],
                toastMessage: `All ${pendingCount} pending timesheet(s) approved.`,
            }));
        } else {
            const pendingCount = get().expenseItems.filter((i) => i.status === "pending").length;
            if (pendingCount === 0) return;

            set((state) => ({
                expenseItems: state.expenseItems.map((item) =>
                    item.status === "pending"
                        ? { ...item, status: "approved", approvedAt: new Date().toISOString().slice(0, 10) }
                        : item
                ),
                selectedIds: [],
                toastMessage: `All ${pendingCount} pending expense(s) approved.`,
            }));
        }
    },

    rejectSelected: () => {
        const { activeTab, selectedIds } = get();
        if (selectedIds.length === 0) return;

        if (activeTab === "timesheet") {
            set((state) => ({
                timesheetItems: state.timesheetItems.map((item) =>
                    selectedIds.includes(item.id) ? { ...item, status: "rejected" } : item
                ),
                selectedIds: [],
                toastMessage: `${selectedIds.length} timesheet(s) rejected.`,
            }));
        } else {
            set((state) => ({
                expenseItems: state.expenseItems.map((item) =>
                    selectedIds.includes(item.id) ? { ...item, status: "rejected" } : item
                ),
                selectedIds: [],
                toastMessage: `${selectedIds.length} expense(s) rejected.`,
            }));
        }
    },

    remindToApprove: () => {
        set({
            toastMessage: "Reminder notification sent to team managers.",
        });
    },

    setToastMessage: (msg) => {
        set({ toastMessage: msg });
    },

    resetSampleData: () => {
        set({
            timesheetItems: initialTimesheets,
            expenseItems: initialExpenses,
            selectedIds: [],
            toastMessage: "Sample approval data reset.",
        });
    },
}));
