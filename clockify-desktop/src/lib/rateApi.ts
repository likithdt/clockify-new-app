import { invoke } from '@tauri-apps/api/core';
import { rateService } from '../../backend/services/rateService';
import type {
  HourlyRateDTO,
  RateHistoryItemDTO,
  SetRatePayload,
  RateFilter,
  RateSummaryDTO,
} from '../../backend/models/rateTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const rateApi = {
  listRates: async (filter?: RateFilter): Promise<HourlyRateDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<HourlyRateDTO[]>('list_rates', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_rates failed, using fallback:', e);
      }
    }
    return rateService.listRates(filter);
  },

  getRate: async (id: string): Promise<HourlyRateDTO> => {
    if (isTauri) {
      try {
        return await invoke<HourlyRateDTO>('get_rate', { id });
      } catch (e) {
        console.warn('Tauri invoke get_rate failed, using fallback:', e);
      }
    }
    const r = rateService.getRate(id);
    if (!r) throw new Error(`Rate '${id}' not found`);
    return r;
  },

  setRate: async (payload: SetRatePayload): Promise<HourlyRateDTO> => {
    if (isTauri) {
      try {
        return await invoke<HourlyRateDTO>('set_rate', { payload });
      } catch (e) {
        console.warn('Tauri invoke set_rate failed, using fallback:', e);
      }
    }
    return rateService.setRate(payload);
  },

  deleteRate: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_rate', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_rate failed, using fallback:', e);
      }
    }
    return rateService.deleteRate(id);
  },

  getEffectiveRate: async (memberId?: string, projectId?: string, rateType: 'billable' | 'cost' = 'billable'): Promise<number> => {
    if (isTauri) {
      try {
        return await invoke<number>('get_effective_rate', {
          memberId: memberId || null,
          projectId: projectId || null,
          rateType,
        });
      } catch (e) {
        console.warn('Tauri invoke get_effective_rate failed, using fallback:', e);
      }
    }
    return rateService.getEffectiveRate(memberId, projectId, rateType);
  },

  getRateHistory: async (rateId: string): Promise<RateHistoryItemDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<RateHistoryItemDTO[]>('get_rate_history', { rateId });
      } catch (e) {
        console.warn('Tauri invoke get_rate_history failed, using fallback:', e);
      }
    }
    return rateService.getRateHistory(rateId);
  },

  getSummary: async (): Promise<RateSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<RateSummaryDTO>('get_rate_summary');
      } catch (e) {
        console.warn('Tauri invoke get_rate_summary failed, using fallback:', e);
      }
    }
    return rateService.getSummary();
  },
};
