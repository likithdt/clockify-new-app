use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamMember {
    pub id: String,
    pub name: String,
    pub email: String,
    pub billable_rate: Option<f64>,
    pub cost_rate: Option<f64>,
    pub currency: String,
    pub role: String,
    pub group: Option<String>,
    pub status: String,
    pub is_current_user: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddTeamMemberPayload {
    pub emails: Vec<String>,
    pub role: Option<String>,
    pub group: Option<String>,
    pub billable_rate: Option<f64>,
    pub cost_rate: Option<f64>,
    pub currency: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTeamMemberPayload {
    pub name: Option<String>,
    pub email: Option<String>,
    pub billable_rate: Option<Option<f64>>,
    pub cost_rate: Option<Option<f64>>,
    pub currency: Option<String>,
    pub role: Option<String>,
    pub group: Option<Option<String>>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct TeamFilter {
    pub query: Option<String>,
    pub status: Option<String>,
    pub group: Option<String>,
    pub roles: Option<Vec<String>>,
    pub smaller_rate: Option<f64>,
    pub larger_rate: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamSummary {
    pub total_members: usize,
    pub active_members: usize,
    pub inactive_members: usize,
    pub invited_members: usize,
}
