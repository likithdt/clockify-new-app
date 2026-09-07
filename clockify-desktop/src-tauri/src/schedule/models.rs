use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScheduleAssignment {
    pub id: String,
    pub project_id: String,
    pub project_name: String,
    pub project_color: String,
    pub client: String,
    pub member_id: String,
    pub member_name: String,
    pub member_initials: String,
    pub member_avatar_color: String,
    pub start_date: String,
    pub end_date: String,
    pub hours_per_day: f64,
    pub total_hours: f64,
    pub note: Option<String>,
    pub version_label: Option<String>,
    pub is_hatched: Option<bool>,
    pub is_milestone_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateScheduleAssignmentPayload {
    pub project_id: String,
    pub project_name: String,
    pub project_color: String,
    pub client: String,
    pub member_id: String,
    pub member_name: String,
    pub member_initials: String,
    pub member_avatar_color: String,
    pub start_date: String,
    pub end_date: String,
    pub hours_per_day: f64,
    pub total_hours: f64,
    pub note: Option<String>,
    pub version_label: Option<String>,
    pub is_hatched: Option<bool>,
    pub is_milestone_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateScheduleAssignmentPayload {
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub client: Option<String>,
    pub member_id: Option<String>,
    pub member_name: Option<String>,
    pub member_initials: Option<String>,
    pub member_avatar_color: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub hours_per_day: Option<f64>,
    pub total_hours: Option<f64>,
    pub note: Option<Option<String>>,
    pub version_label: Option<Option<String>>,
    pub is_hatched: Option<bool>,
    pub is_milestone_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ScheduleFilter {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub project_id: Option<String>,
    pub member_id: Option<String>,
    pub client: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScheduleSummary {
    pub total_assignments: usize,
    pub total_scheduled_hours: f64,
    pub total_members_scheduled: usize,
    pub total_projects_scheduled: usize,
    pub is_published: bool,
}
