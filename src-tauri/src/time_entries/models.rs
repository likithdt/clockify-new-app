use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocationData {
    pub latitude: f64,
    pub longitude: f64,
    pub address: Option<String>,
    pub accuracy: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeEntry {
    pub id: String,
    pub description: String,
    pub project_id: Option<String>,
    pub project_name: String,
    pub project_color: String,
    pub client: Option<String>,
    pub task_id: Option<String>,
    pub task_name: Option<String>,
    pub is_billable: bool,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_seconds: i64,
    pub location: Option<LocationData>,
    pub user_id: Option<String>,
    pub user_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTimeEntryPayload {
    pub description: String,
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub client: Option<String>,
    pub task_id: Option<String>,
    pub task_name: Option<String>,
    pub is_billable: Option<bool>,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_seconds: i64,
    pub location: Option<LocationData>,
    pub user_id: Option<String>,
    pub user_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateTimeEntryPayload {
    pub description: Option<String>,
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub client: Option<String>,
    pub task_id: Option<String>,
    pub task_name: Option<String>,
    pub is_billable: Option<bool>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub duration_seconds: Option<i64>,
    pub location: Option<LocationData>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct TimeEntryFilter {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub project_id: Option<String>,
    pub user_id: Option<String>,
    pub is_billable: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerStatus {
    pub is_tracking: bool,
    pub start_time: Option<String>,
    pub description: String,
    pub project_name: String,
    pub project_color: String,
    pub is_billable: bool,
    pub elapsed_seconds: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeEntrySummary {
    pub total_entries: usize,
    pub total_seconds: i64,
    pub total_billable_seconds: i64,
    pub active_timer_running: bool,
}
