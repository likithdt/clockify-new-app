use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/// Current status of a time-off request.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RequestStatus {
    Pending,
    Approved,
    Rejected,
    Withdrawn,
}

impl std::fmt::Display for RequestStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            RequestStatus::Pending => write!(f, "Pending"),
            RequestStatus::Approved => write!(f, "Approved"),
            RequestStatus::Rejected => write!(f, "Rejected"),
            RequestStatus::Withdrawn => write!(f, "Withdrawn"),
        }
    }
}

/// Unit of measurement for a leave policy.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PolicyUnit {
    Days,
    Hours,
}

impl std::fmt::Display for PolicyUnit {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PolicyUnit::Days => write!(f, "days"),
            PolicyUnit::Hours => write!(f, "hours"),
        }
    }
}

/// How accrual resets or accumulates over time.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AccrualType {
    /// Granted as a lump sum at the start of the policy period.
    FixedPerYear,
    /// Accumulates monthly.
    MonthlyAccrual,
    /// No automatic accrual; balance is set manually.
    Manual,
}

// ---------------------------------------------------------------------------
// Leave Policy
// ---------------------------------------------------------------------------

/// A company-level leave policy (e.g. "Vacation", "Sick Leave").
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeavePolicy {
    /// Unique identifier (UUID).
    pub id: String,
    /// Human-readable name, e.g. "Vacation".
    pub name: String,
    /// Measurement unit.
    pub unit: PolicyUnit,
    /// How many units are accrued per year (None = manual / no accrual).
    pub accrual_per_year: Option<f64>,
    /// Accrual mechanism.
    pub accrual_type: AccrualType,
    /// Whether unused balance carries over to the next year.
    pub allow_carryover: bool,
    /// Maximum balance a member can hold at any time (None = unlimited).
    pub max_balance: Option<f64>,
    /// Whether this policy is currently active.
    pub is_active: bool,
    /// IDs of team members assigned to this policy.
    pub assignee_ids: Vec<String>,
    /// ISO 8601 creation timestamp.
    pub created_at: String,
}

// ---------------------------------------------------------------------------
// Team Member
// ---------------------------------------------------------------------------

/// A team member / employee record.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamMember {
    /// Unique identifier (UUID).
    pub id: String,
    /// Full name.
    pub name: String,
    /// Avatar URL or data URI (optional).
    pub avatar_url: Option<String>,
    /// Email address.
    pub email: String,
}

// ---------------------------------------------------------------------------
// Time-Off Request
// ---------------------------------------------------------------------------

/// A time-off request submitted by a team member.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeOffRequest {
    /// Unique identifier (UUID).
    pub id: String,
    /// ID of the team member who made the request.
    pub member_id: String,
    /// ID of the leave policy being applied.
    pub policy_id: String,
    /// Start date in "YYYY-MM-DD" format (inclusive).
    pub start_date: String,
    /// End date in "YYYY-MM-DD" format (inclusive).
    pub end_date: String,
    /// Total days (or hours) requested.
    pub duration: f64,
    /// Current approval status.
    pub status: RequestStatus,
    /// Optional note from the requester.
    pub note: Option<String>,
    /// ISO 8601 timestamp of when the request was submitted.
    pub requested_at: String,
    /// Optional note from the approver when rejecting.
    pub rejection_reason: Option<String>,
}

// ---------------------------------------------------------------------------
// Leave Balance
// ---------------------------------------------------------------------------

/// Current leave balance for a specific team member under a specific policy.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaveBalance {
    /// ID of the team member.
    pub member_id: String,
    /// ID of the leave policy.
    pub policy_id: String,
    /// Total units accrued so far this year.
    pub accrued: f64,
    /// Total units used (approved requests).
    pub used: f64,
    /// Remaining balance (accrued − used).
    pub remaining: f64,
    /// Units carried over from the previous year.
    pub carried_over: f64,
}

// ---------------------------------------------------------------------------
// Holiday
// ---------------------------------------------------------------------------

/// A public or company holiday.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Holiday {
    /// Unique identifier (UUID).
    pub id: String,
    /// Name of the holiday, e.g. "Independence Day".
    pub name: String,
    /// Date in "YYYY-MM-DD" format.
    pub date: String,
    /// Country code for imported public holidays (e.g. "IN", "US").
    pub country_code: Option<String>,
    /// IDs of team members this holiday applies to (empty = all members).
    pub member_ids: Vec<String>,
    /// ISO 8601 creation timestamp.
    pub created_at: String,
}

// ---------------------------------------------------------------------------
// DTO – payloads sent from the frontend
// ---------------------------------------------------------------------------

/// Payload for creating a new time-off request.
#[derive(Debug, Deserialize)]
pub struct CreateRequestPayload {
    pub member_id: String,
    pub policy_id: String,
    pub start_date: String,
    pub end_date: String,
    pub duration: f64,
    pub note: Option<String>,
}

/// Payload for creating a new leave policy.
#[derive(Debug, Deserialize)]
pub struct CreatePolicyPayload {
    pub name: String,
    pub unit: PolicyUnit,
    pub accrual_per_year: Option<f64>,
    pub accrual_type: AccrualType,
    pub allow_carryover: bool,
    pub max_balance: Option<f64>,
    pub assignee_ids: Vec<String>,
}

/// Payload for updating an existing leave policy.
#[derive(Debug, Deserialize)]
pub struct UpdatePolicyPayload {
    pub name: Option<String>,
    pub unit: Option<PolicyUnit>,
    pub accrual_per_year: Option<f64>,
    pub accrual_type: Option<AccrualType>,
    pub allow_carryover: Option<bool>,
    pub max_balance: Option<f64>,
    pub assignee_ids: Option<Vec<String>>,
    pub is_active: Option<bool>,
}

/// Payload for creating a new holiday.
#[derive(Debug, Deserialize)]
pub struct CreateHolidayPayload {
    pub name: String,
    pub date: String,
    pub country_code: Option<String>,
    pub member_ids: Vec<String>,
}

/// Payload for approving or rejecting a request.
#[derive(Debug, Deserialize)]
pub struct ReviewRequestPayload {
    /// "approved" | "rejected" | "withdrawn"
    pub status: RequestStatus,
    pub rejection_reason: Option<String>,
}

/// Filters for listing requests.
#[derive(Debug, Deserialize)]
pub struct ListRequestsFilter {
    /// If Some, only requests for this member are returned.
    pub member_id: Option<String>,
    /// If Some, only requests with this status are returned.
    pub status: Option<RequestStatus>,
    /// If Some, only requests starting on or after this date ("YYYY-MM-DD").
    pub from_date: Option<String>,
    /// If Some, only requests ending on or before this date ("YYYY-MM-DD").
    pub to_date: Option<String>,
}

/// Filters for listing policies.
#[derive(Debug, Deserialize)]
pub struct ListPoliciesFilter {
    /// If Some(true) only active policies; Some(false) only inactive; None = all.
    pub is_active: Option<bool>,
}
