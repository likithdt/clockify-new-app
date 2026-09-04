use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimesheetApproval {
    pub id: String,
    pub period: String,
    pub period_sort_date: String,
    pub user: String,
    pub team_manager: String,
    pub time: String,
    pub time_off: String,
    pub status: String,
    pub submitted_at: Option<String>,
    pub approved_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpenseApproval {
    pub id: String,
    pub period: String,
    pub period_sort_date: String,
    pub user: String,
    pub team_manager: String,
    pub category: String,
    pub amount: f64,
    pub currency: String,
    pub status: String,
    pub submitted_at: Option<String>,
    pub approved_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApprovalSummary {
    pub pending_timesheets: usize,
    pub pending_expenses: usize,
    pub total_pending: usize,
    pub unsubmitted_count: usize,
    pub approved_count: usize,
}
