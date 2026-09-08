use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectedActivity {
    pub id: String,
    pub app: String,
    pub window_title: String,
    pub icon_type: String,
    pub suggested_project: String,
    pub project_color: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_minutes: u32,
    pub duration_seconds: u32,
    pub is_logged: bool,
    pub date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AutoTrackerStatus {
    pub is_recording: bool,
    pub active_app: Option<String>,
    pub active_window: Option<String>,
    pub idle_seconds: u32,
    pub recorded_today_seconds: u32,
    pub pending_activities_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogActivityPayload {
    pub activity_id: String,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub is_billable: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSuggestedProjectPayload {
    pub activity_id: String,
    pub suggested_project: String,
    pub project_color: String,
}
