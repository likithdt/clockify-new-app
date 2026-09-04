import type {
  HourlyRateDTO,
  RateHistoryItemDTO,
  SetRatePayload,
  RateFilter,
  RateSummaryDTO,
} from '../models/rateTypes';

const INITIAL_RATES: HourlyRateDTO[] = [
  {
    id: "rate-ws-billable",
    entity_type: "workspace",
    entity_id: "ws-default",
    entity_name: "Workspace Default",
    rate_type: "billable",
    rate_amount: 50.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "rate-ws-cost",
    entity_type: "workspace",
    entity_id: "ws-default",
    entity_name: "Workspace Default",
    rate_type: "cost",
    rate_amount: 20.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "rate-tm-1-cost",
    entity_type: "member",
    entity_id: "tm-1",
    entity_name: "Amy Smith",
    rate_type: "cost",
    rate_amount: 15.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "rate-tm-2-cost",
    entity_type: "member",
    entity_id: "tm-2",
    entity_name: "James Anderson",
    rate_type: "cost",
    rate_amount: 5.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "rate-tm-3-cost",
    entity_type: "member",
    entity_id: "tm-3",
    entity_name: "Lara Peterson",
    rate_type: "cost",
    rate_amount: 10.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "rate-proj-2-billable",
    entity_type: "project",
    entity_id: "proj-2",
    entity_name: "Project Orion",
    rate_type: "billable",
    rate_amount: 65.0,
    currency: "INR",
    is_active: true,
    updated_at: "2026-02-01T00:00:00.000Z",
  },
];

class RateService {
  private rates: HourlyRateDTO[] = JSON.parse(JSON.stringify(INITIAL_RATES));
  private history: RateHistoryItemDTO[] = [];

  listRates(filter?: RateFilter): HourlyRateDTO[] {
    let result = [...this.rates];

    if (filter?.entity_type) {
      result = result.filter((r) => r.entity_type === filter.entity_type);
    }
    if (filter?.entity_id) {
      result = result.filter((r) => r.entity_id === filter.entity_id);
    }
    if (filter?.rate_type) {
      result = result.filter((r) => r.rate_type === filter.rate_type);
    }

    return result;
  }

  getRate(id: string): HourlyRateDTO | undefined {
    return this.rates.find((r) => r.id === id);
  }

  setRate(payload: SetRatePayload): HourlyRateDTO {
    const existingIdx = this.rates.findIndex(
      (r) =>
        r.entity_type === payload.entity_type &&
        r.entity_id === payload.entity_id &&
        r.rate_type === payload.rate_type
    );

    const nowIso = new Date().toISOString();

    if (existingIdx !== -1) {
      const old = this.rates[existingIdx];
      // Record history
      this.history.unshift({
        id: `rh-${Date.now()}`,
        rate_id: old.id,
        rate_amount: old.rate_amount,
        currency: old.currency,
        effective_date: old.since_date || old.updated_at,
        changed_by: "Admin",
        created_at: nowIso,
      });

      const updated: HourlyRateDTO = {
        ...old,
        entity_name: payload.entity_name || old.entity_name,
        rate_amount: payload.rate_amount,
        currency: payload.currency || old.currency,
        since_date: payload.since_date || old.since_date,
        updated_at: nowIso,
      };

      this.rates[existingIdx] = updated;
      return updated;
    } else {
      const newRate: HourlyRateDTO = {
        id: `rate-${Date.now()}`,
        entity_type: payload.entity_type,
        entity_id: payload.entity_id,
        entity_name: payload.entity_name,
        rate_type: payload.rate_type,
        rate_amount: payload.rate_amount,
        currency: payload.currency || "INR",
        since_date: payload.since_date,
        is_active: true,
        updated_at: nowIso,
      };

      this.rates.push(newRate);
      return newRate;
    }
  }

  deleteRate(id: string): boolean {
    const prevLen = this.rates.length;
    this.rates = this.rates.filter((r) => r.id !== id);
    return this.rates.length < prevLen;
  }

  getEffectiveRate(
    memberId?: string,
    projectId?: string,
    rateType: 'billable' | 'cost' = 'billable'
  ): number {
    // Clockify Rate Hierarchy:
    // 1. Project Member rate
    // 2. Project rate
    // 3. Member rate
    // 4. Workspace default rate
    if (projectId && memberId) {
      const pmRate = this.rates.find(
        (r) =>
          r.entity_type === "project_member" &&
          r.entity_id === `${projectId}_${memberId}` &&
          r.rate_type === rateType &&
          r.is_active
      );
      if (pmRate) return pmRate.rate_amount;
    }

    if (projectId) {
      const pRate = this.rates.find(
        (r) =>
          r.entity_type === "project" &&
          r.entity_id === projectId &&
          r.rate_type === rateType &&
          r.is_active
      );
      if (pRate) return pRate.rate_amount;
    }

    if (memberId) {
      const mRate = this.rates.find(
        (r) =>
          r.entity_type === "member" &&
          r.entity_id === memberId &&
          r.rate_type === rateType &&
          r.is_active
      );
      if (mRate) return mRate.rate_amount;
    }

    const wsRate = this.rates.find(
      (r) => r.entity_type === "workspace" && r.rate_type === rateType && r.is_active
    );
    return wsRate ? wsRate.rate_amount : rateType === "billable" ? 50.0 : 20.0;
  }

  getRateHistory(rateId: string): RateHistoryItemDTO[] {
    return this.history.filter((h) => h.rate_id === rateId);
  }

  getSummary(): RateSummaryDTO {
    const wsBillable = this.rates.find(
      (r) => r.entity_type === "workspace" && r.rate_type === "billable"
    );
    const wsCost = this.rates.find(
      (r) => r.entity_type === "workspace" && r.rate_type === "cost"
    );

    const overrides = this.rates.filter((r) => r.entity_type !== "workspace");
    const memberRates = this.rates.filter((r) => r.entity_type === "member");
    const projectRates = this.rates.filter((r) => r.entity_type === "project");

    return {
      workspace_billable_rate: wsBillable ? wsBillable.rate_amount : 50.0,
      workspace_cost_rate: wsCost ? wsCost.rate_amount : 20.0,
      currency: wsBillable ? wsBillable.currency : "INR",
      total_rate_overrides: overrides.length,
      member_rates_count: memberRates.length,
      project_rates_count: projectRates.length,
    };
  }
}

export const rateService = new RateService();
