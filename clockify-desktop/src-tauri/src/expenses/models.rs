use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseItem {
    pub id: String,
    pub team_member: String,
    pub member_id: Option<String>,
    pub date: String,
    pub project_id: String,
    pub project_name: String,
    pub project_color: String,
    pub category: String,
    pub amount: f64,
    pub currency: String,
    pub note: String,
    pub billable: bool,
    pub receipt_name: Option<String>,
    pub status: String,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseCategory {
    pub id: String,
    pub name: String,
    pub unit_price: Option<f64>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseSettings {
    pub default_currency: String,
    pub default_billable: bool,
    pub categories: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ExpenseFilter {
    pub team_member: Option<String>,
    pub project_id: Option<String>,
    pub category: Option<String>,
    pub billable: Option<bool>,
    pub status: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateExpensePayload {
    pub team_member: String,
    pub member_id: Option<String>,
    pub date: String,
    pub project_id: String,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub category: String,
    pub amount: f64,
    pub currency: Option<String>,
    pub note: Option<String>,
    pub billable: Option<bool>,
    pub receipt_name: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateExpensePayload {
    pub team_member: Option<String>,
    pub member_id: Option<String>,
    pub date: Option<String>,
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub category: Option<String>,
    pub amount: Option<f64>,
    pub currency: Option<String>,
    pub note: Option<String>,
    pub billable: Option<bool>,
    pub receipt_name: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseSummary {
    pub total_amount: f64,
    pub billable_amount: f64,
    pub non_billable_amount: f64,
    pub currency: String,
    pub count: i64,
    pub pending_count: i64,
    pub approved_count: i64,
}
