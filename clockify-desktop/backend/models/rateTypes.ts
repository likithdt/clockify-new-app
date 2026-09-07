/**
 * Clockify Rates Feature - Domain Models & DTOs
 */

export type RateType = 'billable' | 'cost';
export type RateEntityType = 'workspace' | 'member' | 'project' | 'project_member' | 'client';

export interface HourlyRateDTO {
  id: string;
  entity_type: RateEntityType;
  entity_id: string;
  entity_name: string;
  rate_type: RateType;
  rate_amount: number;
  currency: string;
  since_date?: string;
  is_active: boolean;
  updated_at: string;
}

export interface RateHistoryItemDTO {
  id: string;
  rate_id: string;
  rate_amount: number;
  currency: string;
  effective_date: string;
  changed_by: string;
  created_at: string;
}

export interface SetRatePayload {
  entity_type: RateEntityType;
  entity_id: string;
  entity_name: string;
  rate_type: RateType;
  rate_amount: number;
  currency?: string;
  since_date?: string;
}

export interface RateFilter {
  entity_type?: RateEntityType;
  entity_id?: string;
  rate_type?: RateType;
}

export interface RateSummaryDTO {
  workspace_billable_rate: number;
  workspace_cost_rate: number;
  currency: string;
  total_rate_overrides: number;
  member_rates_count: number;
  project_rates_count: number;
}
