import { create } from "zustand";
import { reportApi } from "@/lib/reportApi";
import type {
    SummaryReportDTO,
    DetailedReportDTO,
    WeeklyReportDTO,
    ReportFilter,
} from "../../backend/models/reportTypes";

interface ReportState {
    summary: SummaryReportDTO | null;
    detailed: DetailedReportDTO | null;
    weekly: WeeklyReportDTO | null;
    filter: ReportFilter;
    isLoading: boolean;
    activeTab: "summary" | "detailed" | "weekly" | "shared";

    // Actions
    setActiveTab: (tab: "summary" | "detailed" | "weekly" | "shared") => void;
    setFilter: (filter: Partial<ReportFilter>) => void;
    loadSummary: () => Promise<void>;
    loadDetailed: () => Promise<void>;
    loadWeekly: (weekStart?: string) => Promise<void>;
    exportReport: (format: "csv" | "pdf" | "excel") => Promise<{ filename: string; content: string }>;
}

export const useReportStore = create<ReportState>((set, get) => ({
    summary: null,
    detailed: null,
    weekly: null,
    filter: {},
    isLoading: false,
    activeTab: "summary",

    setActiveTab: (activeTab) => set({ activeTab }),

    setFilter: (newFilter) => {
        set((state) => ({ filter: { ...state.filter, ...newFilter } }));
        const tab = get().activeTab;
        if (tab === "summary") get().loadSummary();
        else if (tab === "detailed") get().loadDetailed();
        else if (tab === "weekly") get().loadWeekly();
    },

    loadSummary: async () => {
        set({ isLoading: true });
        try {
            const summary = await reportApi.getSummaryReport(get().filter);
            set({ summary, isLoading: false });
        } catch (e) {
            console.warn("Could not load summary report:", e);
            set({ isLoading: false });
        }
    },

    loadDetailed: async () => {
        set({ isLoading: true });
        try {
            const detailed = await reportApi.getDetailedReport(get().filter);
            set({ detailed, isLoading: false });
        } catch (e) {
            console.warn("Could not load detailed report:", e);
            set({ isLoading: false });
        }
    },

    loadWeekly: async (weekStart = "2026-08-31") => {
        set({ isLoading: true });
        try {
            const weekly = await reportApi.getWeeklyReport(weekStart, get().filter);
            set({ weekly, isLoading: false });
        } catch (e) {
            console.warn("Could not load weekly report:", e);
            set({ isLoading: false });
        }
    },

    exportReport: async (format) => {
        const { activeTab, filter } = get();
        const res = await reportApi.exportReport({
            report_type: activeTab === "summary" ? "summary" : "detailed",
            format,
            filter,
        });
        return { filename: res.filename, content: res.content };
    },
}));
