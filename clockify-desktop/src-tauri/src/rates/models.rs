use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HourlyRate {
    pub id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub entity_name: String,
    pub rate_type: String,
    pub rate_amount: f64,
    pub currency: String,
    pub since_date: Option<String>,
    pub is_active: bool,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateHistoryItem {
    pub id: String,
    pub rate_id: String,
    pub rate_amount: f64,
    pub currency: String,
    pub effective_date: String,
    pub changed_by: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetRatePayload {
    pub entity_type: String,
    pub entity_id: String,
    pub entity_name: String,
    pub rate_type: String,
    pub rate_amount: f64,
    pub currency: Option<String>,
    pub since_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct RateFilter {
    pub entity_type: Option<String>,
    pub entity_id: Option<String>,
    pub rate_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateSummary {
    pub workspace_billable_rate: f64,
    pub workspace_cost_rate: f64,
    pub currency: String,
    pub total_rate_overrides: usize,
    pub member_rates_count: usize,
    pub project_rates_count: usize,
}
