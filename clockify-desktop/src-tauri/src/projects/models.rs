use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub color: String,
    pub client: Option<String>,
    pub tracked_hours: f64,
    pub budget_hours: Option<f64>,
    pub budget_amount: Option<f64>,
    pub is_recurring: Option<bool>,
    pub amount: f64,
    pub currency: String,
    pub progress_percent: Option<f64>,
    pub is_budget_exceeded: Option<bool>,
    pub access: String,
    pub is_favorite: bool,
    pub is_archived: bool,
    pub is_billable: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateProjectPayload {
    pub name: String,
    pub color: String,
    pub client: Option<String>,
    pub access: Option<String>,
    pub is_billable: Option<bool>,
    pub budget_hours: Option<f64>,
    pub budget_amount: Option<f64>,
    pub currency: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateProjectPayload {
    pub name: Option<String>,
    pub color: Option<String>,
    pub client: Option<Option<String>>,
    pub access: Option<String>,
    pub is_billable: Option<bool>,
    pub is_favorite: Option<bool>,
    pub is_archived: Option<bool>,
    pub budget_hours: Option<f64>,
    pub budget_amount: Option<f64>,
    pub tracked_hours: Option<f64>,
    pub amount: Option<f64>,
    pub currency: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ProjectFilter {
    pub query: Option<String>,
    pub client: Option<String>,
    pub status: Option<String>,
    pub access: Option<String>,
    pub billing: Option<String>,
    pub is_favorite: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectSummary {
    pub total_projects: usize,
    pub active_projects: usize,
    pub archived_projects: usize,
    pub total_tracked_hours: f64,
    pub total_billable_amount: f64,
}
