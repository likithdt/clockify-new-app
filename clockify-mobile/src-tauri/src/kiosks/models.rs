use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KioskDevice {
    pub id: String,
    pub name: String,
    pub assignees: Vec<String>,
    pub default_project: String,
    pub default_break_project: String,
    pub logout_after_hours: u32,
    pub auth_required: bool,
    pub location: String,
    pub device_ip: String,
    pub today_check_ins: u32,
    pub status: String,
    pub pin_code: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttendanceRecord {
    pub id: String,
    pub kiosk_id: String,
    pub kiosk_name: String,
    pub user_id: Option<String>,
    pub user_name: String,
    pub action: String,
    pub timestamp: String,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateKioskPayload {
    pub name: String,
    pub assignees: Option<Vec<String>>,
    pub default_project: Option<String>,
    pub default_break_project: Option<String>,
    pub logout_after_hours: Option<u32>,
    pub auth_required: Option<bool>,
    pub location: Option<String>,
    pub pin_code: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateKioskPayload {
    pub name: Option<String>,
    pub assignees: Option<Vec<String>>,
    pub default_project: Option<String>,
    pub default_break_project: Option<String>,
    pub logout_after_hours: Option<u32>,
    pub auth_required: Option<bool>,
    pub location: Option<String>,
    pub status: Option<String>,
    pub pin_code: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PunchClockPayload {
    pub kiosk_id: String,
    pub user_name: String,
    pub user_id: Option<String>,
    pub action: String,
    pub pin_code: Option<String>,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PinVerificationResult {
    pub valid: bool,
    pub user_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KioskSummary {
    pub total_kiosks: usize,
    pub online_kiosks: usize,
    pub today_check_ins: u32,
    pub total_attendance_records: usize,
}
