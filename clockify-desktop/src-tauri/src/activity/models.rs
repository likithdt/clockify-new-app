use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityRecord {
    pub id: String,
    pub member_id: String,
    pub member_name: String,
    pub avatar: String,
    pub avatar_color: String,
    pub task: String,
    pub project: String,
    pub project_color: String,
    pub activity_percent: i64,
    pub pulse_text: String,
    pub active_window: String,
    pub score: String,
    pub score_color: String,
    pub status: String,
    pub status_color: String,
    pub recorded_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScreenshotItem {
    pub id: String,
    pub member_id: String,
    pub member_name: String,
    pub member_avatar: Option<String>,
    pub timestamp: String,
    pub time_formatted: String,
    pub project: String,
    pub project_color: String,
    pub activity_percent: i64,
    pub app_name: String,
    pub window_title: String,
    pub code_snippet: Option<String>,
    #[serde(rename = "type")]
    pub screenshot_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocationBreadcrumb {
    pub lat: f64,
    pub lng: f64,
    pub time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemberLocation {
    pub id: String,
    pub name: String,
    pub role: String,
    pub avatar: String,
    pub avatar_color: String,
    pub is_current_user: Option<bool>,
    pub last_seen: String,
    pub status: String,
    pub status_color: String,
    pub location_name: String,
    pub lat: f64,
    pub lng: f64,
    pub speed: String,
    pub battery: i64,
    pub breadcrumbs: Vec<LocationBreadcrumb>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeofenceZone {
    pub id: String,
    pub name: String,
    pub address: String,
    pub lat: f64,
    pub lng: f64,
    pub radius_meters: f64,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivitySettings {
    pub is_monitoring_active: bool,
    pub is_screenshots_active: bool,
    pub is_gps_active: bool,
    pub blur_privacy: bool,
    pub screenshot_frequency_minutes: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ActivityFilter {
    pub member_id: Option<String>,
    pub project: Option<String>,
    pub status: Option<String>,
    pub min_activity: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateScreenshotPayload {
    pub member_id: String,
    pub member_name: String,
    pub member_avatar: Option<String>,
    pub time_formatted: Option<String>,
    pub project: String,
    pub project_color: Option<String>,
    pub activity_percent: i64,
    pub app_name: String,
    pub window_title: String,
    pub code_snippet: Option<String>,
    #[serde(rename = "type")]
    pub screenshot_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateMemberLocationPayload {
    pub lat: f64,
    pub lng: f64,
    pub location_name: Option<String>,
    pub speed: Option<String>,
    pub battery: Option<i64>,
    pub status: Option<String>,
    pub status_color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateGeofencePayload {
    pub name: String,
    pub address: String,
    pub lat: f64,
    pub lng: f64,
    pub radius_meters: f64,
    pub color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivitySummary {
    pub total_members_monitored: i64,
    pub active_tracking_count: i64,
    pub idle_count: i64,
    pub average_activity_percent: i64,
    pub total_screenshots_captured: i64,
    pub geofence_compliant_percent: i64,
}
