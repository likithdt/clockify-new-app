import { rateService } from '../services/rateService';
import type {
  SetRatePayload,
  RateFilter,
} from '../models/rateTypes';

export class RateController {
  static listRates(filter?: RateFilter) {
    try {
      const list = rateService.listRates(filter);
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getRate(id: string) {
    try {
      const rate = rateService.getRate(id);
      if (!rate) return { success: false, error: `Rate '${id}' not found` };
      return { success: true, data: rate };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static setRate(payload: SetRatePayload) {
    try {
      if (!payload.entity_id || payload.rate_amount === undefined) {
        return { success: false, error: 'Entity ID and rate amount are required' };
      }
      const rate = rateService.setRate(payload);
      return { success: true, data: rate };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteRate(id: string) {
    try {
      const deleted = rateService.deleteRate(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getEffectiveRate(memberId?: string, projectId?: string, rateType: 'billable' | 'cost' = 'billable') {
    try {
      const rate = rateService.getEffectiveRate(memberId, projectId, rateType);
      return { success: true, data: { effective_rate: rate } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getRateHistory(rateId: string) {
    try {
      const history = rateService.getRateHistory(rateId);
      return { success: true, data: history };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = rateService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
