import { create } from "zustand";
import { expenseApi } from "@/lib/expenseApi";

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
    isLoading: boolean;

    // Actions
    loadFromBackend: () => Promise<void>;
    addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
    deleteExpense: (id: string) => void;
    setSelectedTeammate: (teammate: string) => void;
    setCreateModalOpen: (open: boolean) => void;
    setSettingsModalOpen: (open: boolean) => void;
    clearAllExpenses: () => void;
    loadSampleData: () => void;
    addCategory: (name: string) => Promise<void>;
    removeCategory: (name: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    // Initially empty to match Expenses.png exactly which displays the "No results" empty state
    expenses: [],
    selectedTeammate: "",
    isCreateModalOpen: false,
    isSettingsModalOpen: false,
    isLoading: false,
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
        "Amy Smith",
    ],

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const [backendExpenses, categories, settings] = await Promise.all([
                expenseApi.listExpenses(),
                expenseApi.listCategories(),
                expenseApi.getSettings(),
            ]);

            const mapped: Expense[] = backendExpenses.map((e) => ({
                id: e.id,
                teamMember: e.team_member,
                date: e.date,
                projectId: e.project_id,
                projectName: e.project_name,
                projectColor: e.project_color,
                category: e.category,
                amount: e.amount,
                currency: e.currency,
                note: e.note,
                billable: e.billable,
                receiptName: e.receipt_name,
                createdAt: e.created_at,
            }));

            set({
                expenses: mapped,
                categories: categories.length > 0 ? categories : settings.categories,
                isLoading: false,
            });
        } catch (e) {
            console.warn("Could not load expenses from backend:", e);
            set({ isLoading: false });
        }
    },

    addExpense: (expense) => {
        const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newExpense: Expense = {
            ...expense,
            id,
            createdAt: new Date().toISOString(),
        };

        set((state) => ({
            expenses: [newExpense, ...state.expenses],
            isCreateModalOpen: false,
        }));

        expenseApi.createExpense({
            team_member: expense.teamMember,
            date: expense.date,
            project_id: expense.projectId,
            project_name: expense.projectName,
            project_color: expense.projectColor,
            category: expense.category,
            amount: expense.amount,
            currency: expense.currency,
            note: expense.note,
            billable: expense.billable,
            receipt_name: expense.receiptName,
        }).catch(console.error);
    },

    deleteExpense: (id) => {
        set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
        }));
        expenseApi.deleteExpense(id).catch(console.error);
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
        expenseApi.clearAllExpenses().catch(console.error);
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
                currency: "INR",
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
                currency: "INR",
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
                currency: "INR",
                note: "Lunch meeting with stakeholders",
                billable: true,
                receiptName: "receipt_lunch.png",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
        ];
        set({ expenses: sampleExpenses });
    },

    addCategory: async (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (!get().categories.includes(trimmed)) {
            set((state) => ({ categories: [...state.categories, trimmed] }));
            await expenseApi.createCategory(trimmed).catch(console.error);
        }
    },

    removeCategory: async (name: string) => {
        set((state) => ({ categories: state.categories.filter((c) => c !== name) }));
        await expenseApi.deleteCategory(name).catch(console.error);
    },
}));
