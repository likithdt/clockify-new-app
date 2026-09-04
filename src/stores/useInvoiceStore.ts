import { create } from "zustand";
import { invoiceApi } from "@/lib/invoiceApi";

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
    isLoading: boolean;

    // Actions
    loadFromBackend: () => Promise<void>;
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
    }) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    removeSampleData: () => Promise<void>;
    restoreSampleData: () => Promise<void>;
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
    isLoading: false,

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const list = await invoiceApi.listInvoices();
            if (list && list.length > 0) {
                const mapped: Invoice[] = list.map((inv) => ({
                    id: inv.id,
                    invoiceNumber: inv.invoice_number,
                    client: inv.client,
                    issueDate: inv.issue_date,
                    dueOn: inv.due_on,
                    amount: inv.amount,
                    balance: inv.balance,
                    currency: inv.currency,
                    status: inv.status as "Sent" | "Overdue" | "Paid" | "Draft",
                    isSample: inv.is_sample,
                }));
                const hasSample = mapped.some((i) => i.isSample);
                set({ invoices: mapped, hasSampleData: hasSample, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (e) {
            console.warn("Could not load invoices from backend:", e);
            set({ isLoading: false });
        }
    },

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    openRemoveSampleModal: () => set({ isRemoveSampleModalOpen: true }),
    closeRemoveSampleModal: () => set({ isRemoveSampleModalOpen: false }),

    createInvoice: async (params) => {
        const id = `inv-${Date.now()}`;
        const newInvoice: Invoice = {
            id,
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

        try {
            await invoiceApi.createInvoice({
                invoice_number: params.invoiceNumber,
                client: params.client,
                issue_date: params.issueDate,
                due_date: params.dueDate,
                currency: params.currency || "INR",
                items: [
                    {
                        id: `item-${Date.now()}`,
                        description: "Standard consultancy hours",
                        quantity: 1,
                        unit_price: params.amount || 650.0,
                        amount: params.amount || 650.0,
                    },
                ],
            });
        } catch (e) {
            console.error("Backend error creating invoice:", e);
        }
    },

    deleteInvoice: async (id) => {
        set((state) => ({
            invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
        try {
            await invoiceApi.deleteInvoice(id);
        } catch (e) {
            console.error("Backend error deleting invoice:", e);
        }
    },

    removeSampleData: async () => {
        set((state) => ({
            invoices: state.invoices.filter((inv) => !inv.isSample),
            hasSampleData: false,
            isRemoveSampleModalOpen: false,
        }));
        try {
            await invoiceApi.removeSampleInvoices();
        } catch (e) {
            console.error("Backend error removing sample data:", e);
        }
    },

    restoreSampleData: async () => {
        set((state) => {
            const nonSample = state.invoices.filter((inv) => !inv.isSample);
            return {
                invoices: [...INITIAL_SAMPLE_INVOICES, ...nonSample],
                hasSampleData: true,
            };
        });
        try {
            const res = await invoiceApi.restoreSampleInvoices();
            if (res && res.length > 0) {
                const mapped: Invoice[] = res.map((inv) => ({
                    id: inv.id,
                    invoiceNumber: inv.invoice_number,
                    client: inv.client,
                    issueDate: inv.issue_date,
                    dueOn: inv.due_on,
                    amount: inv.amount,
                    balance: inv.balance,
                    currency: inv.currency,
                    status: inv.status as "Sent" | "Overdue" | "Paid" | "Draft",
                    isSample: inv.is_sample,
                }));
                set({ invoices: mapped, hasSampleData: true });
            }
        } catch (e) {
            console.error("Backend error restoring sample data:", e);
        }
    },

    setFilterClient: (client) => set({ filterClient: client }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
