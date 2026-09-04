import { create } from "zustand";

export interface Expense {
    id: string;
    teamMember: string;
    date: string;
    projectId: string;
    projectName: string;
    projectColor: string;
    category: string;
    amount: number;
    currency: string;
    note: string;
    billable: boolean;
    receiptName?: string;
    createdAt: string;
}

interface ExpenseState {
    expenses: Expense[];
    selectedTeammate: string;
    isCreateModalOpen: boolean;
    isSettingsModalOpen: boolean;
    categories: string[];
    teammates: string[];

    // Actions
    addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
    deleteExpense: (id: string) => void;
    setSelectedTeammate: (teammate: string) => void;
    setCreateModalOpen: (open: boolean) => void;
    setSettingsModalOpen: (open: boolean) => void;
    clearAllExpenses: () => void;
    loadSampleData: () => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
    // Initially empty to match Expenses.png exactly which displays the "No results" empty state
    expenses: [],
    selectedTeammate: "",
    isCreateModalOpen: false,
    isSettingsModalOpen: false,
    categories: [
        "Day rate",
        "Travel",
        "Meals",
        "Office supplies",
        "Equipment",
        "Software",
        "Fuel",
        "Accommodation",
        "Other",
    ],
    teammates: [
        "Bindhu shree",
        "Lara Peterson",
        "Jane Doe",
        "Alex Miller",
    ],

    addExpense: (expense) => {
        const newExpense: Expense = {
            ...expense,
            id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({
            expenses: [newExpense, ...state.expenses],
            isCreateModalOpen: false,
        }));
    },

    deleteExpense: (id) => {
        set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
        }));
    },

    setSelectedTeammate: (teammate) => {
        set({ selectedTeammate: teammate });
    },

    setCreateModalOpen: (open) => {
        set({ isCreateModalOpen: open });
    },

    setSettingsModalOpen: (open) => {
        set({ isSettingsModalOpen: open });
    },

    clearAllExpenses: () => {
        set({ expenses: [] });
    },

    loadSampleData: () => {
        const sampleExpenses: Expense[] = [
            {
                id: "exp-sample-1",
                teamMember: "Bindhu shree",
                date: "Today",
                projectId: "proj-1",
                projectName: "Clockify Mobile App",
                projectColor: "#03A9F4",
                category: "Travel",
                amount: 145.50,
                currency: "USD",
                note: "Flight tickets for client onsite workshop",
                billable: true,
                receiptName: "flight_ticket.pdf",
                createdAt: new Date().toISOString(),
            },
            {
                id: "exp-sample-2",
                teamMember: "Lara Peterson",
                date: "Jul 06, 2026",
                projectId: "proj-2",
                projectName: "Internal Infrastructure",
                projectColor: "#4CAF50",
                category: "Day rate",
                amount: 100.00,
                currency: "USD",
                note: "Consulting rate for DevOps setup",
                billable: false,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: "exp-sample-3",
                teamMember: "Bindhu shree",
                date: "Yesterday",
                projectId: "proj-1",
                projectName: "Clockify Mobile App",
                projectColor: "#03A9F4",
                category: "Meals",
                amount: 42.80,
                currency: "USD",
                note: "Lunch meeting with stakeholders",
                billable: true,
                receiptName: "receipt_lunch.png",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
        ];
        set({ expenses: sampleExpenses });
    },
}));
