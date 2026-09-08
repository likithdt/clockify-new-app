import { create } from "zustand";
import { rateApi } from "@/lib/rateApi";
import type { HourlyRateDTO, RateSummaryDTO, SetRatePayload } from "../../backend/models/rateTypes";

interface RateState {
    rates: HourlyRateDTO[];
    summary: RateSummaryDTO | null;
    isLoading: boolean;

    // Actions
    loadFromBackend: () => Promise<void>;
    setRate: (payload: SetRatePayload) => Promise<HourlyRateDTO>;
    deleteRate: (id: string) => Promise<void>;
    getEffectiveRate: (memberId?: string, projectId?: string, rateType?: 'billable' | 'cost') => Promise<number>;
}

export const useRateStore = create<RateState>((set) => ({
    rates: [],
    summary: null,
    isLoading: false,

    loadFromBackend: async () => {
        set({ isLoading: true });
        try {
            const [rates, summary] = await Promise.all([
                rateApi.listRates(),
                rateApi.getSummary(),
            ]);
            set({ rates, summary, isLoading: false });
        } catch (e) {
            console.warn("Could not load rates from backend:", e);
            set({ isLoading: false });
        }
    },

    setRate: async (payload) => {
        const updated = await rateApi.setRate(payload);
        set((state) => {
            const exists = state.rates.some((r) => r.id === updated.id);
            return {
                rates: exists
                    ? state.rates.map((r) => (r.id === updated.id ? updated : r))
                    : [updated, ...state.rates],
            };
        });
        return updated;
    },

    deleteRate: async (id) => {
        await rateApi.deleteRate(id);
        set((state) => ({
            rates: state.rates.filter((r) => r.id !== id),
        }));
    },

    getEffectiveRate: async (memberId, projectId, rateType = 'billable') => {
        return rateApi.getEffectiveRate(memberId, projectId, rateType);
    },
}));
