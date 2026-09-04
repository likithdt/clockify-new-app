/// Tauri command handlers for the Time Off feature.
///
/// Every command is exposed to the frontend via `invoke()`.
/// Commands are grouped into five sections that map to the five tabs in
/// the Clockify Time Off UI:
///   1. Requests  (list, create, approve/reject, withdraw, delete)
///   2. Timeline  (list requests filtered by date range for Gantt)
///   3. Balance   (list balances, adjust manually)
///   4. Policies  (list, create, update, delete, assign/unassign members)
///   5. Holidays  (list, create, delete, import public holidays)
///   6. Members   (list members – used for dropdowns)
use tauri::State;

use crate::timeoff::{
    models::{
        CreateHolidayPayload, CreatePolicyPayload, CreateRequestPayload, Holiday, LeaveBalance,
        LeavePolicy, ListPoliciesFilter, ListRequestsFilter, RequestStatus, ReviewRequestPayload,
        TeamMember, TimeOffRequest, UpdatePolicyPayload,
    },
    store::TimeOffState,
};

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

fn now_iso() -> String {
    // chrono is not added to Cargo.toml to keep deps minimal; we use a
    // simple timestamp string. In production, add chrono and use Utc::now().
    // For now we return a fixed "today" string used in sample data.
    "2026-09-03T00:00:00Z".to_string()
}

fn new_uuid() -> String {
    // Generate a random-looking UUID-style ID without pulling in the uuid crate.
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    use std::time::{SystemTime, UNIX_EPOCH};
    let mut h = DefaultHasher::new();
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos()
        .hash(&mut h);
    std::thread::current().id().hash(&mut h);
    format!("{:016x}", h.finish())
}

// ===========================================================================
// 1. REQUESTS
// ===========================================================================

/// List all time-off requests, optionally filtered by member, status, or date range.
#[tauri::command]
pub fn list_timeoff_requests(
    state: State<'_, TimeOffState>,
    filter: Option<ListRequestsFilter>,
) -> Vec<TimeOffRequest> {
    let store = state.0.lock().unwrap();
    let mut results: Vec<TimeOffRequest> = store.requests.clone();

    if let Some(f) = filter {
        if let Some(member_id) = f.member_id {
            results.retain(|r| r.member_id == member_id);
        }
        if let Some(status) = f.status {
            results.retain(|r| r.status == status);
        }
        if let Some(from) = f.from_date {
            results.retain(|r| r.start_date >= from);
        }
        if let Some(to) = f.to_date {
            results.retain(|r| r.end_date <= to);
        }
    }

    // Sort newest first (by requested_at descending)
    results.sort_by(|a, b| b.requested_at.cmp(&a.requested_at));
    results
}

/// Get a single time-off request by ID.
#[tauri::command]
pub fn get_timeoff_request(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<TimeOffRequest, String> {
    let store = state.0.lock().unwrap();
    store
        .get_request_by_id(&id)
        .cloned()
        .ok_or_else(|| format!("Request '{}' not found", id))
}

/// Create a new time-off request (status starts as Pending).
#[tauri::command]
pub fn create_timeoff_request(
    state: State<'_, TimeOffState>,
    payload: CreateRequestPayload,
) -> Result<TimeOffRequest, String> {
    let mut store = state.0.lock().unwrap();

    // Validate: member must exist
    if store.get_member_by_id(&payload.member_id).is_none() {
        return Err(format!("Member '{}' not found", payload.member_id));
    }

    // Validate: policy must exist and be active
    {
        let policy = store
            .get_policy_by_id(&payload.policy_id)
            .ok_or_else(|| format!("Policy '{}' not found", payload.policy_id))?;
        if !policy.is_active {
            return Err(format!("Policy '{}' is inactive", payload.policy_id));
        }
        if !policy.assignee_ids.contains(&payload.member_id) {
            return Err("Member is not assigned to this policy".to_string());
        }
    }

    // Validate dates: start <= end
    if payload.start_date > payload.end_date {
        return Err("start_date must not be after end_date".to_string());
    }

    // Check for overlapping non-withdrawn/rejected requests for the same member
    let overlap = store.requests.iter().any(|r| {
        r.member_id == payload.member_id
            && r.status != RequestStatus::Rejected
            && r.status != RequestStatus::Withdrawn
            && r.start_date <= payload.end_date
            && r.end_date >= payload.start_date
    });
    if overlap {
        return Err("An overlapping request already exists for this member".to_string());
    }

    let request = TimeOffRequest {
        id: new_uuid(),
        member_id: payload.member_id,
        policy_id: payload.policy_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        duration: payload.duration,
        status: RequestStatus::Pending,
        note: payload.note,
        requested_at: now_iso(),
        rejection_reason: None,
    };

    store.requests.push(request.clone());
    Ok(request)
}

/// Approve or reject a time-off request.
#[tauri::command]
pub fn review_timeoff_request(
    state: State<'_, TimeOffState>,
    id: String,
    payload: ReviewRequestPayload,
) -> Result<TimeOffRequest, String> {
    let mut store = state.0.lock().unwrap();

    // Find the request first to capture data needed for balance update
    let (member_id, policy_id, duration, old_status) = {
        let r = store
            .get_request_by_id(&id)
            .ok_or_else(|| format!("Request '{}' not found", id))?;

        if r.status == RequestStatus::Withdrawn {
            return Err("Cannot review a withdrawn request".to_string());
        }

        (
            r.member_id.clone(),
            r.policy_id.clone(),
            r.duration,
            r.status.clone(),
        )
    };

    // Adjust balance
    match (&old_status, &payload.status) {
        // Newly approved → deduct from balance
        (RequestStatus::Pending, RequestStatus::Approved) => {
            store.update_balance_for_request(&member_id, &policy_id, duration);
        }
        // Was approved, now rejected → restore balance
        (RequestStatus::Approved, RequestStatus::Rejected) => {
            store.update_balance_for_request(&member_id, &policy_id, -duration);
        }
        // All other transitions don't change the balance
        _ => {}
    }

    // Apply the status change
    let request = store
        .get_request_by_id_mut(&id)
        .ok_or_else(|| format!("Request '{}' not found", id))?;

    request.status = payload.status;
    request.rejection_reason = payload.rejection_reason;

    Ok(request.clone())
}

/// Withdraw a pending or approved request (by the member themselves).
#[tauri::command]
pub fn withdraw_timeoff_request(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<TimeOffRequest, String> {
    let mut store = state.0.lock().unwrap();

    let (member_id, policy_id, duration, old_status) = {
        let r = store
            .get_request_by_id(&id)
            .ok_or_else(|| format!("Request '{}' not found", id))?;
        (
            r.member_id.clone(),
            r.policy_id.clone(),
            r.duration,
            r.status.clone(),
        )
    };

    // Restore balance if the request was approved
    if old_status == RequestStatus::Approved {
        store.update_balance_for_request(&member_id, &policy_id, -duration);
    }

    let request = store
        .get_request_by_id_mut(&id)
        .ok_or_else(|| format!("Request '{}' not found", id))?;

    request.status = RequestStatus::Withdrawn;
    Ok(request.clone())
}

/// Delete a time-off request permanently.
#[tauri::command]
pub fn delete_timeoff_request(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let pos = store
        .requests
        .iter()
        .position(|r| r.id == id)
        .ok_or_else(|| format!("Request '{}' not found", id))?;

    let removed = store.requests.remove(pos);

    // Restore balance if it was approved
    if removed.status == RequestStatus::Approved {
        store.update_balance_for_request(
            &removed.member_id,
            &removed.policy_id,
            -removed.duration,
        );
    }
    Ok(())
}

// ===========================================================================
// 2. TIMELINE
// ===========================================================================

/// Return requests that overlap the given date range, for the Timeline tab.
/// Includes all team members (or filtered by member_id).
#[tauri::command]
pub fn get_timeline(
    state: State<'_, TimeOffState>,
    from_date: String,
    to_date: String,
    member_id: Option<String>,
) -> Vec<TimeOffRequest> {
    let store = state.0.lock().unwrap();

    store
        .requests
        .iter()
        .filter(|r| {
            // Overlap check: request overlaps [from_date, to_date]
            r.start_date <= to_date
                && r.end_date >= from_date
                && r.status != RequestStatus::Rejected
                && r.status != RequestStatus::Withdrawn
                && member_id.as_deref().map_or(true, |mid| r.member_id == mid)
        })
        .cloned()
        .collect()
}

// ===========================================================================
// 3. BALANCE
// ===========================================================================

/// List leave balances, optionally filtered by policy or member.
#[tauri::command]
pub fn list_leave_balances(
    state: State<'_, TimeOffState>,
    policy_id: Option<String>,
    member_id: Option<String>,
) -> Vec<LeaveBalance> {
    let store = state.0.lock().unwrap();
    store
        .balances
        .iter()
        .filter(|b| {
            policy_id.as_deref().map_or(true, |pid| b.policy_id == pid)
                && member_id.as_deref().map_or(true, |mid| b.member_id == mid)
        })
        .cloned()
        .collect()
}

/// Manually set the accrued balance for a (member, policy) pair.
/// Used by managers to override automatic accrual.
#[tauri::command]
pub fn set_leave_balance(
    state: State<'_, TimeOffState>,
    member_id: String,
    policy_id: String,
    accrued: f64,
    carried_over: f64,
) -> Result<LeaveBalance, String> {
    let mut store = state.0.lock().unwrap();

    // Make sure policy exists
    if store.get_policy_by_id(&policy_id).is_none() {
        return Err(format!("Policy '{}' not found", policy_id));
    }
    // Make sure member exists
    if store.get_member_by_id(&member_id).is_none() {
        return Err(format!("Member '{}' not found", member_id));
    }

    if let Some(balance) = store
        .balances
        .iter_mut()
        .find(|b| b.member_id == member_id && b.policy_id == policy_id)
    {
        balance.accrued = accrued;
        balance.carried_over = carried_over;
        balance.remaining = accrued + carried_over - balance.used;
        Ok(balance.clone())
    } else {
        let balance = LeaveBalance {
            member_id: member_id.clone(),
            policy_id: policy_id.clone(),
            accrued,
            used: 0.0,
            remaining: accrued + carried_over,
            carried_over,
        };
        store.balances.push(balance.clone());
        Ok(balance)
    }
}

// ===========================================================================
// 4. POLICIES
// ===========================================================================

/// List all leave policies, with optional active/inactive filter.
#[tauri::command]
pub fn list_leave_policies(
    state: State<'_, TimeOffState>,
    filter: Option<ListPoliciesFilter>,
) -> Vec<LeavePolicy> {
    let store = state.0.lock().unwrap();
    store
        .policies
        .iter()
        .filter(|p| {
            filter
                .as_ref()
                .and_then(|f| f.is_active)
                .map_or(true, |active| p.is_active == active)
        })
        .cloned()
        .collect()
}

/// Get a single leave policy by ID.
#[tauri::command]
pub fn get_leave_policy(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<LeavePolicy, String> {
    let store = state.0.lock().unwrap();
    store
        .get_policy_by_id(&id)
        .cloned()
        .ok_or_else(|| format!("Policy '{}' not found", id))
}

/// Create a new leave policy.
#[tauri::command]
pub fn create_leave_policy(
    state: State<'_, TimeOffState>,
    payload: CreatePolicyPayload,
) -> Result<LeavePolicy, String> {
    let mut store = state.0.lock().unwrap();

    // Policy name must be unique
    if store.policies.iter().any(|p| p.name == payload.name) {
        return Err(format!("A policy named '{}' already exists", payload.name));
    }

    let policy = LeavePolicy {
        id: new_uuid(),
        name: payload.name,
        unit: payload.unit,
        accrual_per_year: payload.accrual_per_year,
        accrual_type: payload.accrual_type,
        allow_carryover: payload.allow_carryover,
        max_balance: payload.max_balance,
        is_active: true,
        assignee_ids: payload.assignee_ids,
        created_at: now_iso(),
    };

    store.policies.push(policy.clone());
    Ok(policy)
}

/// Update an existing leave policy (partial update – only set fields that are Some).
#[tauri::command]
pub fn update_leave_policy(
    state: State<'_, TimeOffState>,
    id: String,
    payload: UpdatePolicyPayload,
) -> Result<LeavePolicy, String> {
    let mut store = state.0.lock().unwrap();

    let policy = store
        .get_policy_by_id_mut(&id)
        .ok_or_else(|| format!("Policy '{}' not found", id))?;

    if let Some(name) = payload.name {
        policy.name = name;
    }
    if let Some(unit) = payload.unit {
        policy.unit = unit;
    }
    if payload.accrual_per_year.is_some() {
        policy.accrual_per_year = payload.accrual_per_year;
    }
    if let Some(accrual_type) = payload.accrual_type {
        policy.accrual_type = accrual_type;
    }
    if let Some(allow_carryover) = payload.allow_carryover {
        policy.allow_carryover = allow_carryover;
    }
    if payload.max_balance.is_some() {
        policy.max_balance = payload.max_balance;
    }
    if let Some(assignee_ids) = payload.assignee_ids {
        policy.assignee_ids = assignee_ids;
    }
    if let Some(is_active) = payload.is_active {
        policy.is_active = is_active;
    }

    Ok(policy.clone())
}

/// Soft-delete a leave policy by marking it inactive.
#[tauri::command]
pub fn deactivate_leave_policy(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<LeavePolicy, String> {
    let mut store = state.0.lock().unwrap();
    let policy = store
        .get_policy_by_id_mut(&id)
        .ok_or_else(|| format!("Policy '{}' not found", id))?;
    policy.is_active = false;
    Ok(policy.clone())
}

/// Permanently delete a leave policy (only if no approved requests reference it).
#[tauri::command]
pub fn delete_leave_policy(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();

    // Guard: cannot delete if approved requests exist for this policy
    let has_approved = store
        .requests
        .iter()
        .any(|r| r.policy_id == id && r.status == RequestStatus::Approved);
    if has_approved {
        return Err(
            "Cannot delete a policy that has approved time-off requests. Deactivate it instead."
                .to_string(),
        );
    }

    let pos = store
        .policies
        .iter()
        .position(|p| p.id == id)
        .ok_or_else(|| format!("Policy '{}' not found", id))?;

    store.policies.remove(pos);
    // Also remove associated balances
    store.balances.retain(|b| b.policy_id != id);
    Ok(())
}

/// Assign a list of additional members to a policy.
#[tauri::command]
pub fn assign_members_to_policy(
    state: State<'_, TimeOffState>,
    policy_id: String,
    member_ids: Vec<String>,
) -> Result<LeavePolicy, String> {
    let mut store = state.0.lock().unwrap();
    let policy = store
        .get_policy_by_id_mut(&policy_id)
        .ok_or_else(|| format!("Policy '{}' not found", policy_id))?;
    for mid in &member_ids {
        if !policy.assignee_ids.contains(mid) {
            policy.assignee_ids.push(mid.clone());
        }
    }
    Ok(policy.clone())
}

/// Remove a member from a policy.
#[tauri::command]
pub fn unassign_member_from_policy(
    state: State<'_, TimeOffState>,
    policy_id: String,
    member_id: String,
) -> Result<LeavePolicy, String> {
    let mut store = state.0.lock().unwrap();
    let policy = store
        .get_policy_by_id_mut(&policy_id)
        .ok_or_else(|| format!("Policy '{}' not found", policy_id))?;
    policy.assignee_ids.retain(|mid| *mid != member_id);
    Ok(policy.clone())
}

// ===========================================================================
// 5. HOLIDAYS
// ===========================================================================

/// List all holidays, optionally filtered to a specific year.
#[tauri::command]
pub fn list_holidays(
    state: State<'_, TimeOffState>,
    year: Option<u32>,
) -> Vec<Holiday> {
    let store = state.0.lock().unwrap();
    store
        .holidays
        .iter()
        .filter(|h| {
            year.map_or(true, |y| {
                h.date.starts_with(&y.to_string())
            })
        })
        .cloned()
        .collect()
}

/// Create a new holiday.
#[tauri::command]
pub fn create_holiday(
    state: State<'_, TimeOffState>,
    payload: CreateHolidayPayload,
) -> Result<Holiday, String> {
    let mut store = state.0.lock().unwrap();

    // Validate date format (simple check)
    if payload.date.len() != 10 || !payload.date.chars().nth(4).map_or(false, |c| c == '-') {
        return Err("date must be in YYYY-MM-DD format".to_string());
    }

    let holiday = Holiday {
        id: new_uuid(),
        name: payload.name,
        date: payload.date,
        country_code: payload.country_code,
        member_ids: payload.member_ids,
        created_at: now_iso(),
    };

    store.holidays.push(holiday.clone());
    Ok(holiday)
}

/// Delete a holiday by ID.
#[tauri::command]
pub fn delete_holiday(
    state: State<'_, TimeOffState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let pos = store
        .holidays
        .iter()
        .position(|h| h.id == id)
        .ok_or_else(|| format!("Holiday '{}' not found", id))?;
    store.holidays.remove(pos);
    Ok(())
}

/// Bulk-import public holidays for a given country and year.
/// This simulates the "Import public holidays" button in the Holidays tab.
/// In production you would call a public holidays API (e.g. Nager.Date).
#[tauri::command]
pub fn import_public_holidays(
    state: State<'_, TimeOffState>,
    country_code: String,
    year: u32,
) -> Result<Vec<Holiday>, String> {
    // Static sample holidays for India (IN) 2026.
    // In production: fetch from https://date.nager.at/api/v3/PublicHolidays/{year}/{country}
    let static_holidays: Vec<(&str, &str)> = match country_code.to_uppercase().as_str() {
        "IN" => vec![
            ("Republic Day", "01-26"),
            ("Holi", "03-14"),
            ("Good Friday", "04-03"),
            ("Ambedkar Jayanti", "04-14"),
            ("Labour Day", "05-01"),
            ("Independence Day", "08-15"),
            ("Gandhi Jayanti", "10-02"),
            ("Dussehra", "10-02"),
            ("Diwali", "10-20"),
            ("Christmas Day", "12-25"),
        ],
        "US" => vec![
            ("New Year's Day", "01-01"),
            ("Martin Luther King Jr. Day", "01-19"),
            ("Presidents' Day", "02-16"),
            ("Memorial Day", "05-25"),
            ("Independence Day", "07-04"),
            ("Labor Day", "09-07"),
            ("Columbus Day", "10-12"),
            ("Veterans Day", "11-11"),
            ("Thanksgiving Day", "11-26"),
            ("Christmas Day", "12-25"),
        ],
        "GB" => vec![
            ("New Year's Day", "01-01"),
            ("Good Friday", "04-03"),
            ("Easter Monday", "04-06"),
            ("Early May Bank Holiday", "05-04"),
            ("Spring Bank Holiday", "05-25"),
            ("Summer Bank Holiday", "08-31"),
            ("Christmas Day", "12-25"),
            ("Boxing Day", "12-26"),
        ],
        _ => {
            return Err(format!(
                "No holiday data available for country '{}'. Supported: IN, US, GB",
                country_code
            ))
        }
    };

    let mut store = state.0.lock().unwrap();
    let mut imported: Vec<Holiday> = Vec::new();

    for (name, mmdd) in static_holidays {
        let date = format!("{}-{}", year, mmdd);
        // Skip if already imported for this year
        if store
            .holidays
            .iter()
            .any(|h| h.date == date && h.country_code.as_deref() == Some(&country_code))
        {
            continue;
        }
        let holiday = Holiday {
            id: new_uuid(),
            name: name.to_string(),
            date,
            country_code: Some(country_code.clone()),
            member_ids: Vec::new(), // applies to all
            created_at: now_iso(),
        };
        store.holidays.push(holiday.clone());
        imported.push(holiday);
    }

    Ok(imported)
}

// ===========================================================================
// 6. MEMBERS
// ===========================================================================

/// List all team members (used for dropdowns and the Team filter).
#[tauri::command]
pub fn list_team_members(state: State<'_, TimeOffState>) -> Vec<TeamMember> {
    let store = state.0.lock().unwrap();
    store.members.clone()
}

/// Add a new team member (used if team management is not in a separate module).
#[tauri::command]
pub fn add_team_member(
    state: State<'_, TimeOffState>,
    name: String,
    email: String,
    avatar_url: Option<String>,
) -> Result<TeamMember, String> {
    let mut store = state.0.lock().unwrap();
    if store.members.iter().any(|m| m.email == email) {
        return Err(format!("A member with email '{}' already exists", email));
    }
    let member = TeamMember {
        id: new_uuid(),
        name,
        email,
        avatar_url,
    };
    store.members.push(member.clone());
    Ok(member)
}
