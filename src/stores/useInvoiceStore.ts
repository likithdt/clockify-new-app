import { create } from "zustand";

export interface Invoice {
    id: string;
    invoiceNumber: string;
    client: string;
    issueDate: string;
    dueOn: string;
    dueSubtitle?: string;
    amount: number;
    balance: number;
    currency: string;
    status: "Sent" | "Overdue" | "Paid" | "Draft";
    isSample: boolean;
}

interface InvoiceState {
    invoices: Invoice[];
    hasSampleData: boolean;
    isCreateModalOpen: boolean;
    isRemoveSampleModalOpen: boolean;
    filterClient: string;
    filterStatus: string;
    searchQuery: string;

    // Actions
    openCreateModal: () => void;
    closeCreateModal: () => void;
    openRemoveSampleModal: () => void;
    closeRemoveSampleModal: () => void;
    createInvoice: (params: {
        client: string;
        currency: string;
        invoiceNumber: string;
        issueDate: string;
        dueDate: string;
        amount?: number;
    }) => void;
    deleteInvoice: (id: string) => void;
    removeSampleData: () => void;
    restoreSampleData: () => void;
    setFilterClient: (client: string) => void;
    setFilterStatus: (status: string) => void;
    setSearchQuery: (query: string) => void;
}

const INITIAL_SAMPLE_INVOICES: Invoice[] = [
    {
        id: "inv-sample-1",
        invoiceNumber: "[SAMPLE] Invoice 1",
        client: "[SAMPLE] Client B",
        issueDate: "31/08/2026",
        dueOn: "10/09/2026",
        amount: 730.70,
        balance: 730.70,
        currency: "INR",
        status: "Sent",
        isSample: true,
    },
    {
        id: "inv-sample-2",
        invoiceNumber: "[SAMPLE] Invoice 2",
        client: "[SAMPLE] Client A",
        issueDate: "17/08/2026",
        dueOn: "27/08/2026",
        dueSubtitle: "4 days ago",
        amount: 814.08,
        balance: 814.08,
        currency: "INR",
        status: "Overdue",
        isSample: true,
    },
];

export const useInvoiceStore = create<InvoiceState>((set) => ({
    invoices: INITIAL_SAMPLE_INVOICES,
    hasSampleData: true,
    isCreateModalOpen: false,
    isRemoveSampleModalOpen: false,
    filterClient: "All",
    filterStatus: "All",
    searchQuery: "",

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    openRemoveSampleModal: () => set({ isRemoveSampleModalOpen: true }),
    closeRemoveSampleModal: () => set({ isRemoveSampleModalOpen: false }),

    createInvoice: (params) => {
        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber: params.invoiceNumber,
            client: params.client,
            issueDate: params.issueDate,
            dueOn: params.dueDate,
            amount: params.amount || 650.0,
            balance: params.amount || 650.0,
            currency: params.currency || "INR",
            status: "Draft",
            isSample: false,
        };

        set((state) => ({
            invoices: [newInvoice, ...state.invoices],
            isCreateModalOpen: false,
        }));
    },

    deleteInvoice: (id) =>
        set((state) => ({
            invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

    removeSampleData: () =>
        set((state) => ({
            invoices: state.invoices.filter((inv) => !inv.isSample),
            hasSampleData: false,
            isRemoveSampleModalOpen: false,
        })),

    restoreSampleData: () =>
        set((state) => {
            const nonSample = state.invoices.filter((inv) => !inv.isSample);
            return {
                invoices: [...INITIAL_SAMPLE_INVOICES, ...nonSample],
                hasSampleData: true,
            };
        }),

    setFilterClient: (client) => set({ filterClient: client }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
