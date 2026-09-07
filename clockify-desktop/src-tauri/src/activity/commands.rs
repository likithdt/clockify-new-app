use tauri::State;
use crate::activity::{
    models::{
        ActivityFilter, ActivityRecord, ActivitySettings, ActivitySummary, CreateGeofencePayload,
        CreateScreenshotPayload, GeofenceZone, LocationBreadcrumb, MemberLocation, ScreenshotItem,
        UpdateMemberLocationPayload,
    },
    store::ActivityLocationState,
};

fn now_iso() -> String {
    "2026-09-04T12:00:00Z".to_string()
}

fn new_uuid(prefix: &str) -> String {
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
    format!("{}_{:012x}", prefix, h.finish())
}

// ─── Activity Monitoring Commands ─────────────────────────────────────────

#[tauri::command]
pub fn list_activity_records(
    state: State<'_, ActivityLocationState>,
    filter: Option<ActivityFilter>,
) -> Vec<ActivityRecord> {
    let store = state.0.lock().unwrap();
    let mut results = store.activity_records.clone();

    if let Some(f) = filter {
        if let Some(ref mid) = f.member_id {
            if !mid.is_empty() {
                results.retain(|r| &r.member_id == mid);
            }
        }
        if let Some(ref proj) = f.project {
            if !proj.is_empty() {
                let p_lower = proj.to_lowercase();
                results.retain(|r| r.project.to_lowercase().contains(&p_lower));
            }
        }
        if let Some(ref st) = f.status {
            if !st.is_empty() {
                results.retain(|r| &r.status == st);
            }
        }
        if let Some(min_act) = f.min_activity {
            results.retain(|r| r.activity_percent >= min_act);
        }
    }

    results
}

#[tauri::command]
pub fn get_activity_record(
    state: State<'_, ActivityLocationState>,
    id: String,
) -> Result<ActivityRecord, String> {
    let store = state.0.lock().unwrap();
    store
        .activity_records
        .iter()
        .find(|r| r.id == id || r.member_id == id)
        .cloned()
        .ok_or_else(|| format!("Activity record with id '{}' not found", id))
}

#[tauri::command]
pub fn log_activity_record(
    state: State<'_, ActivityLocationState>,
    record: ActivityRecord,
) -> ActivityRecord {
    let mut store = state.0.lock().unwrap();
    let pos = store
        .activity_records
        .iter()
        .position(|r| r.member_id == record.member_id);

    if let Some(idx) = pos {
        store.activity_records[idx] = record.clone();
    } else {
        store.activity_records.insert(0, record.clone());
    }

    record
}

#[tauri::command]
pub fn get_activity_summary(state: State<'_, ActivityLocationState>) -> ActivitySummary {
    let store = state.0.lock().unwrap();
    let total_members = store.activity_records.len() as i64;
    let active_count = store
        .activity_records
        .iter()
        .filter(|r| r.status == "TRACKING")
        .count() as i64;
    let idle_count = store
        .activity_records
        .iter()
        .filter(|r| r.status == "IDLE")
        .count() as i64;

    let avg_activity = if total_members > 0 {
        let sum: i64 = store.activity_records.iter().map(|r| r.activity_percent).sum();
        sum / total_members
    } else {
        0
    };

    let total_locations = store.member_locations.len() as i64;
    let inside_geofence = store
        .member_locations
        .iter()
        .filter(|m| m.status == "Inside Geofence")
        .count() as i64;
    let geofence_pct = if total_locations > 0 {
        (inside_geofence * 100) / total_locations
    } else {
        100
    };

    ActivitySummary {
        total_members_monitored: total_members,
        active_tracking_count: active_count,
        idle_count,
        average_activity_percent: avg_activity,
        total_screenshots_captured: store.screenshots.len() as i64,
        geofence_compliant_percent: geofence_pct,
    }
}

// ─── Screenshot Commands ──────────────────────────────────────────────────

#[tauri::command]
pub fn list_screenshots(
    state: State<'_, ActivityLocationState>,
    member_id: Option<String>,
    date: Option<String>,
) -> Vec<ScreenshotItem> {
    let store = state.0.lock().unwrap();
    let mut results = store.screenshots.clone();

    if let Some(ref mid) = member_id {
        if !mid.is_empty() && mid != "all" {
            results.retain(|s| &s.member_id == mid);
        }
    }

    if let Some(ref d) = date {
        if !d.is_empty() && d != "Today" {
            results.retain(|s| s.timestamp.starts_with(d));
        }
    }

    results
}

#[tauri::command]
pub fn get_screenshot(
    state: State<'_, ActivityLocationState>,
    id: String,
) -> Result<ScreenshotItem, String> {
    let store = state.0.lock().unwrap();
    store
        .screenshots
        .iter()
        .find(|s| s.id == id)
        .cloned()
        .ok_or_else(|| format!("Screenshot with id '{}' not found", id))
}

#[tauri::command]
pub fn capture_screenshot(
    state: State<'_, ActivityLocationState>,
    payload: CreateScreenshotPayload,
) -> ScreenshotItem {
    let mut store = state.0.lock().unwrap();
    let id = new_uuid("sc");
    let member_avatar = payload
        .member_avatar
        .or_else(|| Some(payload.member_name.chars().take(2).collect::<String>().to_uppercase()));

    let item = ScreenshotItem {
        id,
        member_id: payload.member_id,
        member_name: payload.member_name,
        member_avatar,
        timestamp: now_iso(),
        time_formatted: payload.time_formatted.unwrap_or_else(|| "Just now".to_string()),
        project: payload.project,
        project_color: payload.project_color.unwrap_or_else(|| "#03a9f4".to_string()),
        activity_percent: payload.activity_percent,
        app_name: payload.app_name,
        window_title: payload.window_title,
        code_snippet: payload.code_snippet,
        screenshot_type: payload.screenshot_type.unwrap_or_else(|| "code".to_string()),
    };

    store.screenshots.insert(0, item.clone());
    item
}

#[tauri::command]
pub fn delete_screenshot(
    state: State<'_, ActivityLocationState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.screenshots.len();
    store.screenshots.retain(|s| s.id != id);
    if store.screenshots.len() == initial_len {
        return Err(format!("Screenshot with id '{}' not found", id));
    }
    Ok(())
}

// ─── Location & GPS Commands ──────────────────────────────────────────────

#[tauri::command]
pub fn list_member_locations(state: State<'_, ActivityLocationState>) -> Vec<MemberLocation> {
    let store = state.0.lock().unwrap();
    store.member_locations.clone()
}

#[tauri::command]
pub fn get_member_location(
    state: State<'_, ActivityLocationState>,
    id: String,
) -> Result<MemberLocation, String> {
    let store = state.0.lock().unwrap();
    store
        .member_locations
        .iter()
        .find(|m| m.id == id)
        .cloned()
        .ok_or_else(|| format!("Member location with id '{}' not found", id))
}

#[tauri::command]
pub fn update_member_location(
    state: State<'_, ActivityLocationState>,
    id: String,
    payload: UpdateMemberLocationPayload,
) -> Result<MemberLocation, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .member_locations
        .iter()
        .position(|m| m.id == id)
        .ok_or_else(|| format!("Member location with id '{}' not found", id))?;

    let current = &store.member_locations[idx];
    let mut breadcrumbs = current.breadcrumbs.clone();
    breadcrumbs.push(LocationBreadcrumb {
        lat: payload.lat,
        lng: payload.lng,
        time: "Just now".to_string(),
    });

    let updated = MemberLocation {
        id: current.id.clone(),
        name: current.name.clone(),
        role: current.role.clone(),
        avatar: current.avatar.clone(),
        avatar_color: current.avatar_color.clone(),
        is_current_user: current.is_current_user,
        last_seen: "Just now".to_string(),
        status: payload.status.unwrap_or_else(|| current.status.clone()),
        status_color: payload.status_color.unwrap_or_else(|| current.status_color.clone()),
        location_name: payload.location_name.unwrap_or_else(|| current.location_name.clone()),
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed.unwrap_or_else(|| current.speed.clone()),
        battery: payload.battery.unwrap_or(current.battery),
        breadcrumbs,
    };

    store.member_locations[idx] = updated.clone();
    Ok(updated)
}

// ─── Geofencing Commands ──────────────────────────────────────────────────

#[tauri::command]
pub fn list_geofences(state: State<'_, ActivityLocationState>) -> Vec<GeofenceZone> {
    let store = state.0.lock().unwrap();
    store.geofences.clone()
}

#[tauri::command]
pub fn create_geofence(
    state: State<'_, ActivityLocationState>,
    payload: CreateGeofencePayload,
) -> GeofenceZone {
    let mut store = state.0.lock().unwrap();
    let zone = GeofenceZone {
        id: new_uuid("geo"),
        name: payload.name.trim().to_string(),
        address: payload.address.trim().to_string(),
        lat: payload.lat,
        lng: payload.lng,
        radius_meters: payload.radius_meters,
        color: payload.color.unwrap_or_else(|| "#03a9f4".to_string()),
    };
    store.geofences.push(zone.clone());
    zone
}

#[tauri::command]
pub fn delete_geofence(
    state: State<'_, ActivityLocationState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.geofences.len();
    store.geofences.retain(|g| g.id != id);
    if store.geofences.len() == initial_len {
        return Err(format!("Geofence with id '{}' not found", id));
    }
    Ok(())
}

// ─── Settings Commands ────────────────────────────────────────────────────

#[tauri::command]
pub fn get_activity_settings(state: State<'_, ActivityLocationState>) -> ActivitySettings {
    let store = state.0.lock().unwrap();
    store.settings.clone()
}

#[tauri::command]
pub fn update_activity_settings(
    state: State<'_, ActivityLocationState>,
    settings: ActivitySettings,
) -> ActivitySettings {
    let mut store = state.0.lock().unwrap();
    store.settings = settings.clone();
    settings
}
