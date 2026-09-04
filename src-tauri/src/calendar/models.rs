use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarTask {
    pub id: String,
    pub title: String,
    pub project_id: Option<String>,
    pub project_name: String,
    pub project_color: String,
    pub client_name: Option<String>,
    pub date: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_minutes: i64,
    pub is_billable: bool,
    pub tags: Vec<String>,
    pub entry_type: String, // "entry" | "planned"
    pub member_id: String,
    pub status: String, // "completed" | "in_progress" | "planned"
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectItem {
    pub id: String,
    pub name: String,
    pub client_name: Option<String>,
    pub color: String,
    pub is_billable: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TagItem {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarSettings {
    pub week_start: String,
    pub time_format: String,
    pub default_duration: i64,
    pub show_weekends: bool,
    pub working_hours_start: String,
    pub working_hours_end: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CalendarFilter {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub member_id: Option<String>,
    pub project_id: Option<String>,
    pub entry_type: Option<String>,
    pub is_billable: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCalendarTaskPayload {
    pub title: String,
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub client_name: Option<String>,
    pub date: String,
    pub start_time: String,
    pub end_time: String,
    pub duration_minutes: Option<i64>,
    pub is_billable: Option<bool>,
    pub tags: Option<Vec<String>>,
    pub entry_type: Option<String>,
    pub member_id: String,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateCalendarTaskPayload {
    pub title: Option<String>,
    pub project_id: Option<String>,
    pub project_name: Option<String>,
    pub project_color: Option<String>,
    pub client_name: Option<String>,
    pub date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub duration_minutes: Option<i64>,
    pub is_billable: Option<bool>,
    pub tags: Option<Vec<String>>,
    pub entry_type: Option<String>,
    pub member_id: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoveCalendarTaskPayload {
    pub date: String,
    pub start_time: String,
    pub end_time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarDaySummary {
    pub date: String,
    pub total_tracked_minutes: i64,
    pub total_planned_minutes: i64,
    pub task_count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarMonthSummary {
    pub month: String,
    pub total_tracked_minutes: i64,
    pub total_planned_minutes: i64,
    pub total_tasks: i64,
    pub days_with_entries: i64,
}

