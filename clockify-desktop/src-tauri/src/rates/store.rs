use super::models::{HourlyRate, RateFilter, RateHistoryItem, RateSummary, SetRatePayload};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

fn current_iso() -> String {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let hours = (secs / 3600) % 24;
    let minutes = (secs / 60) % 60;
    let seconds = secs % 60;
    format!("2026-09-05T{:02}:{:02}:{:02}.000Z", hours, minutes, seconds)
}

fn next_id(prefix: &str) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    format!("{}-{}", prefix, millis)
}

#[derive(Clone)]
pub struct RateStore {
    rates: Arc<Mutex<Vec<HourlyRate>>>,
    history: Arc<Mutex<Vec<RateHistoryItem>>>,
}

impl Default for RateStore {
    fn default() -> Self {
        Self::new()
    }
}

impl RateStore {
    pub fn new() -> Self {
        let initial_rates = vec![
            HourlyRate {
                id: "rate-ws-billable".to_string(),
                entity_type: "workspace".to_string(),
                entity_id: "ws-default".to_string(),
                entity_name: "Workspace Default".to_string(),
                rate_type: "billable".to_string(),
                rate_amount: 50.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-01-01T00:00:00.000Z".to_string(),
            },
            HourlyRate {
                id: "rate-ws-cost".to_string(),
                entity_type: "workspace".to_string(),
                entity_id: "ws-default".to_string(),
                entity_name: "Workspace Default".to_string(),
                rate_type: "cost".to_string(),
                rate_amount: 20.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-01-01T00:00:00.000Z".to_string(),
            },
            HourlyRate {
                id: "rate-tm-1-cost".to_string(),
                entity_type: "member".to_string(),
                entity_id: "tm-1".to_string(),
                entity_name: "Amy Smith".to_string(),
                rate_type: "cost".to_string(),
                rate_amount: 15.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-01-15T00:00:00.000Z".to_string(),
            },
            HourlyRate {
                id: "rate-tm-2-cost".to_string(),
                entity_type: "member".to_string(),
                entity_id: "tm-2".to_string(),
                entity_name: "James Anderson".to_string(),
                rate_type: "cost".to_string(),
                rate_amount: 5.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-01-15T00:00:00.000Z".to_string(),
            },
            HourlyRate {
                id: "rate-tm-3-cost".to_string(),
                entity_type: "member".to_string(),
                entity_id: "tm-3".to_string(),
                entity_name: "Lara Peterson".to_string(),
                rate_type: "cost".to_string(),
                rate_amount: 10.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-01-15T00:00:00.000Z".to_string(),
            },
            HourlyRate {
                id: "rate-proj-2-billable".to_string(),
                entity_type: "project".to_string(),
                entity_id: "proj-2".to_string(),
                entity_name: "Project Orion".to_string(),
                rate_type: "billable".to_string(),
                rate_amount: 65.0,
                currency: "INR".to_string(),
                since_date: None,
                is_active: true,
                updated_at: "2026-02-01T00:00:00.000Z".to_string(),
            },
        ];

        Self {
            rates: Arc::new(Mutex::new(initial_rates)),
            history: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn list(&self, filter: Option<RateFilter>) -> Vec<HourlyRate> {
        let rates = self.rates.lock().unwrap();
        let mut result = rates.clone();

        if let Some(f) = filter {
            if let Some(et) = f.entity_type {
                result.retain(|r| r.entity_type == et);
            }
            if let Some(eid) = f.entity_id {
                result.retain(|r| r.entity_id == eid);
            }
            if let Some(rt) = f.rate_type {
                result.retain(|r| r.rate_type == rt);
            }
        }

        result
    }

    pub fn get(&self, id: &str) -> Option<HourlyRate> {
        self.rates.lock().unwrap().iter().find(|r| r.id == id).cloned()
    }

    pub fn set_rate(&self, payload: SetRatePayload) -> HourlyRate {
        let mut rates = self.rates.lock().unwrap();
        let mut history = self.history.lock().unwrap();
        let now = current_iso();

        if let Some(existing) = rates.iter_mut().find(|r| {
            r.entity_type == payload.entity_type
                && r.entity_id == payload.entity_id
                && r.rate_type == payload.rate_type
        }) {
            history.insert(0, RateHistoryItem {
                id: next_id("rh"),
                rate_id: existing.id.clone(),
                rate_amount: existing.rate_amount,
                currency: existing.currency.clone(),
                effective_date: existing.since_date.clone().unwrap_or_else(|| existing.updated_at.clone()),
                changed_by: "Admin".to_string(),
                created_at: now.clone(),
            });

            existing.entity_name = payload.entity_name;
            existing.rate_amount = payload.rate_amount;
            if let Some(curr) = payload.currency {
                existing.currency = curr;
            }
            existing.since_date = payload.since_date;
            existing.updated_at = now;

            existing.clone()
        } else {
            let new_rate = HourlyRate {
                id: next_id("rate"),
                entity_type: payload.entity_type,
                entity_id: payload.entity_id,
                entity_name: payload.entity_name,
                rate_type: payload.rate_type,
                rate_amount: payload.rate_amount,
                currency: payload.currency.unwrap_or_else(|| "INR".to_string()),
                since_date: payload.since_date,
                is_active: true,
                updated_at: now,
            };

            rates.push(new_rate.clone());
            new_rate
        }
    }

    pub fn delete(&self, id: &str) -> bool {
        let mut rates = self.rates.lock().unwrap();
        let prev_len = rates.len();
        rates.retain(|r| r.id != id);
        rates.len() < prev_len
    }

    pub fn get_effective_rate(&self, member_id: Option<&str>, project_id: Option<&str>, rate_type: &str) -> f64 {
        let rates = self.rates.lock().unwrap();

        if let (Some(pid), Some(mid)) = (project_id, member_id) {
            let combined = format!("{}_{}", pid, mid);
            if let Some(r) = rates.iter().find(|r| r.entity_type == "project_member" && r.entity_id == combined && r.rate_type == rate_type && r.is_active) {
                return r.rate_amount;
            }
        }

        if let Some(pid) = project_id {
            if let Some(r) = rates.iter().find(|r| r.entity_type == "project" && r.entity_id == pid && r.rate_type == rate_type && r.is_active) {
                return r.rate_amount;
            }
        }

        if let Some(mid) = member_id {
            if let Some(r) = rates.iter().find(|r| r.entity_type == "member" && r.entity_id == mid && r.rate_type == rate_type && r.is_active) {
                return r.rate_amount;
            }
        }

        let ws = rates.iter().find(|r| r.entity_type == "workspace" && r.rate_type == rate_type && r.is_active);
        ws.map(|r| r.rate_amount).unwrap_or(if rate_type == "billable" { 50.0 } else { 20.0 })
    }

    pub fn get_history(&self, rate_id: &str) -> Vec<RateHistoryItem> {
        self.history.lock().unwrap().iter().filter(|h| h.rate_id == rate_id).cloned().collect()
    }

    pub fn get_summary(&self) -> RateSummary {
        let rates = self.rates.lock().unwrap();
        let ws_b = rates.iter().find(|r| r.entity_type == "workspace" && r.rate_type == "billable");
        let ws_c = rates.iter().find(|r| r.entity_type == "workspace" && r.rate_type == "cost");

        let overrides = rates.iter().filter(|r| r.entity_type != "workspace").count();
        let member_rates = rates.iter().filter(|r| r.entity_type == "member").count();
        let project_rates = rates.iter().filter(|r| r.entity_type == "project").count();

        RateSummary {
            workspace_billable_rate: ws_b.map(|r| r.rate_amount).unwrap_or(50.0),
            workspace_cost_rate: ws_c.map(|r| r.rate_amount).unwrap_or(20.0),
            currency: ws_b.map(|r| r.currency.clone()).unwrap_or_else(|| "INR".to_string()),
            total_rate_overrides: overrides,
            member_rates_count: member_rates,
            project_rates_count: project_rates,
        }
    }
}
