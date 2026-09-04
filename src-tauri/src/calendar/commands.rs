use tauri::State;
use std::collections::HashMap;

use crate::calendar::{
    models::{
        CalendarDaySummary, CalendarFilter, CalendarMonthSummary, CalendarSettings, CalendarTask,
        CreateCalendarTaskPayload, MoveCalendarTaskPayload, ProjectItem, TagItem,
        UpdateCalendarTaskPayload,
    },
    store::CalendarState,
};

fn now_iso() -> String {
    "2026-09-04T12:00:00Z".to_string()
}

fn new_uuid() -> String {
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
    format!("ct_{:016x}", h.finish())
}

fn parse_minutes(time_str: &str) -> Option<i64> {
    let parts: Vec<&str> = time_str.split(':').collect();
    if parts.len() < 2 {
        return None;
    }
    let h = parts[0].parse::<i64>().ok()?;
    let m = parts[1].parse::<i64>().ok()?;
    Some(h * 60 + m)
}

fn calc_duration(start: &str, end: &str) -> i64 {
    match (parse_minutes(start), parse_minutes(end)) {
        (Some(s), Some(e)) => {
            if e >= s {
                e - s
            } else {
                0
            }
        }
        _ => 0,
    }
}

#[tauri::command]
pub fn list_calendar_tasks(
    state: State<'_, CalendarState>,
    filter: Option<CalendarFilter>,
) -> Vec<CalendarTask> {
    let store = state.0.lock().unwrap();
    let mut results = store.tasks.clone();

    if let Some(f) = filter {
        if let Some(start) = f.start_date {
            results.retain(|t| t.date >= start);
        }
        if let Some(end) = f.end_date {
            results.retain(|t| t.date <= end);
        }
        if let Some(member_id) = f.member_id {
            if !member_id.is_empty() {
                results.retain(|t| t.member_id == member_id);
            }
        }
        if let Some(project_id) = f.project_id {
            if !project_id.is_empty() {
                results.retain(|t| t.project_id.as_deref() == Some(&project_id));
            }
        }
        if let Some(entry_type) = f.entry_type {
            if !entry_type.is_empty() {
                results.retain(|t| t.entry_type == entry_type);
            }
        }
        if let Some(billable) = f.is_billable {
            results.retain(|t| t.is_billable == billable);
        }
    }

    results
}

#[tauri::command]
pub fn get_calendar_task(
    state: State<'_, CalendarState>,
    id: String,
) -> Result<CalendarTask, String> {
    let store = state.0.lock().unwrap();
    store
        .tasks
        .iter()
        .find(|t| t.id == id)
        .cloned()
        .ok_or_else(|| format!("Task with id '{}' not found", id))
}

#[tauri::command]
pub fn create_calendar_task(
    state: State<'_, CalendarState>,
    payload: CreateCalendarTaskPayload,
) -> Result<CalendarTask, String> {
    let mut store = state.0.lock().unwrap();

    let duration = payload
        .duration_minutes
        .unwrap_or_else(|| calc_duration(&payload.start_time, &payload.end_time));

    let mut project_name = payload
        .project_name
        .unwrap_or_else(|| "No Project".to_string());
    let mut project_color = payload
        .project_color
        .unwrap_or_else(|| "#03a9f4".to_string());
    let mut client_name = payload.client_name;

    if let Some(ref pid) = payload.project_id {
        if let Some(proj) = store.projects.iter().find(|p| &p.id == pid) {
            project_name = proj.name.clone();
            project_color = proj.color.clone();
            client_name = proj.client_name.clone();
        }
    }

    let entry_type = payload
        .entry_type
        .unwrap_or_else(|| "entry".to_string());
    let status = payload.status.unwrap_or_else(|| {
        if entry_type == "planned" {
            "planned".to_string()
        } else {
            "completed".to_string()
        }
    });

    let new_task = CalendarTask {
        id: new_uuid(),
        title: if payload.title.trim().is_empty() {
            "(No details)".to_string()
        } else {
            payload.title.trim().to_string()
        },
        project_id: payload.project_id,
        project_name,
        project_color,
        client_name,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        duration_minutes: duration,
        is_billable: payload.is_billable.unwrap_or(true),
        tags: payload.tags.unwrap_or_default(),
        entry_type,
        member_id: payload.member_id,
        status,
        created_at: now_iso(),
        updated_at: None,
    };

    store.tasks.push(new_task.clone());
    Ok(new_task)
}

#[tauri::command]
pub fn update_calendar_task(
    state: State<'_, CalendarState>,
    id: String,
    payload: UpdateCalendarTaskPayload,
) -> Result<CalendarTask, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .tasks
        .iter()
        .position(|t| t.id == id)
        .ok_or_else(|| format!("Task with id '{}' not found", id))?;

    let existing = &store.tasks[idx];

    let start_time = payload
        .start_time
        .unwrap_or_else(|| existing.start_time.clone());
    let end_time = payload
        .end_time
        .unwrap_or_else(|| existing.end_time.clone());
    let duration = payload
        .duration_minutes
        .unwrap_or_else(|| calc_duration(&start_time, &end_time));

    let mut project_name = payload
        .project_name
        .unwrap_or_else(|| existing.project_name.clone());
    let mut project_color = payload
        .project_color
        .unwrap_or_else(|| existing.project_color.clone());
    let mut client_name = payload
        .client_name
        .or_else(|| existing.client_name.clone());

    if let Some(ref pid) = payload.project_id {
        if let Some(proj) = store.projects.iter().find(|p| &p.id == pid) {
            project_name = proj.name.clone();
            project_color = proj.color.clone();
            client_name = proj.client_name.clone();
        }
    }

    let updated = CalendarTask {
        id: existing.id.clone(),
        title: payload
            .title
            .map(|t| if t.trim().is_empty() { "(No details)".to_string() } else { t.trim().to_string() })
            .unwrap_or_else(|| existing.title.clone()),
        project_id: payload.project_id.or_else(|| existing.project_id.clone()),
        project_name,
        project_color,
        client_name,
        date: payload.date.unwrap_or_else(|| existing.date.clone()),
        start_time,
        end_time,
        duration_minutes: duration,
        is_billable: payload.is_billable.unwrap_or(existing.is_billable),
        tags: payload.tags.unwrap_or_else(|| existing.tags.clone()),
        entry_type: payload.entry_type.unwrap_or_else(|| existing.entry_type.clone()),
        member_id: payload.member_id.unwrap_or_else(|| existing.member_id.clone()),
        status: payload.status.unwrap_or_else(|| existing.status.clone()),
        created_at: existing.created_at.clone(),
        updated_at: Some(now_iso()),
    };

    store.tasks[idx] = updated.clone();
    Ok(updated)
}

#[tauri::command]
pub fn delete_calendar_task(
    state: State<'_, CalendarState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.tasks.len();
    store.tasks.retain(|t| t.id != id);
    if store.tasks.len() == initial_len {
        return Err(format!("Task with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn duplicate_calendar_task(
    state: State<'_, CalendarState>,
    id: String,
) -> Result<CalendarTask, String> {
    let mut store = state.0.lock().unwrap();
    let existing = store
        .tasks
        .iter()
        .find(|t| t.id == id)
        .cloned()
        .ok_or_else(|| format!("Task with id '{}' not found", id))?;

    let duplicated = CalendarTask {
        id: new_uuid(),
        title: format!("{} (Copy)", existing.title),
        created_at: now_iso(),
        updated_at: None,
        ..existing
    };

    store.tasks.push(duplicated.clone());
    Ok(duplicated)
}

#[tauri::command]
pub fn move_calendar_task(
    state: State<'_, CalendarState>,
    id: String,
    payload: MoveCalendarTaskPayload,
) -> Result<CalendarTask, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .tasks
        .iter()
        .position(|t| t.id == id)
        .ok_or_else(|| format!("Task with id '{}' not found", id))?;

    let duration = calc_duration(&payload.start_time, &payload.end_time);

    let mut task = store.tasks[idx].clone();
    task.date = payload.date;
    task.start_time = payload.start_time;
    task.end_time = payload.end_time;
    task.duration_minutes = duration;
    task.updated_at = Some(now_iso());

    store.tasks[idx] = task.clone();
    Ok(task)
}

#[tauri::command]
pub fn get_calendar_day_summaries(
    state: State<'_, CalendarState>,
    start_date: String,
    end_date: String,
    member_id: Option<String>,
) -> Vec<CalendarDaySummary> {
    let store = state.0.lock().unwrap();
    let mut map: HashMap<String, (i64, i64, i64)> = HashMap::new();

    for t in &store.tasks {
        if t.date >= start_date && t.date <= end_date {
            if let Some(ref mid) = member_id {
                if !mid.is_empty() && &t.member_id != mid {
                    continue;
                }
            }

            let entry = map.entry(t.date.clone()).or_insert((0, 0, 0));
            entry.2 += 1; // count
            if t.entry_type == "entry" {
                entry.0 += t.duration_minutes;
            } else {
                entry.1 += t.duration_minutes;
            }
        }
    }

    let mut summaries: Vec<CalendarDaySummary> = map
        .into_iter()
        .map(|(date, (tracked, planned, count))| CalendarDaySummary {
            date,
            total_tracked_minutes: tracked,
            total_planned_minutes: planned,
            task_count: count,
        })
        .collect();

    summaries.sort_by(|a, b| a.date.cmp(&b.date));
    summaries
}

#[tauri::command]
pub fn get_calendar_settings(state: State<'_, CalendarState>) -> CalendarSettings {
    let store = state.0.lock().unwrap();
    store.settings.clone()
}

#[tauri::command]
pub fn update_calendar_settings(
    state: State<'_, CalendarState>,
    settings: CalendarSettings,
) -> CalendarSettings {
    let mut store = state.0.lock().unwrap();
    store.settings = settings.clone();
    settings
}

#[tauri::command]
pub fn list_calendar_projects(state: State<'_, CalendarState>) -> Vec<ProjectItem> {
    let store = state.0.lock().unwrap();
    store.projects.clone()
}

#[tauri::command]
pub fn list_calendar_tags(state: State<'_, CalendarState>) -> Vec<TagItem> {
    let store = state.0.lock().unwrap();
    store.tags.clone()
}

#[tauri::command]
pub fn create_calendar_project(
    state: State<'_, CalendarState>,
    name: String,
    color: String,
    client_name: Option<String>,
    is_billable: Option<bool>,
) -> ProjectItem {
    let mut store = state.0.lock().unwrap();
    let id = format!("proj_{}", store.projects.len() + 1);
    let proj = ProjectItem {
        id,
        name,
        client_name,
        color,
        is_billable: is_billable.unwrap_or(true),
    };
    store.projects.push(proj.clone());
    proj
}

#[tauri::command]
pub fn delete_calendar_project(
    state: State<'_, CalendarState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.projects.len();
    store.projects.retain(|p| p.id != id);
    if store.projects.len() == initial_len {
        return Err(format!("Project with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn create_calendar_tag(
    state: State<'_, CalendarState>,
    name: String,
) -> TagItem {
    let mut store = state.0.lock().unwrap();
    if let Some(existing) = store.tags.iter().find(|t| t.name.eq_ignore_ascii_case(&name)) {
        return existing.clone();
    }
    let id = format!("tag_{}", store.tags.len() + 1);
    let tag = TagItem { id, name };
    store.tags.push(tag.clone());
    tag
}

#[tauri::command]
pub fn delete_calendar_tag(
    state: State<'_, CalendarState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.tags.len();
    store.tags.retain(|t| t.id != id);
    if store.tags.len() == initial_len {
        return Err(format!("Tag with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn get_calendar_month_summary(
    state: State<'_, CalendarState>,
    year_month: String,
    member_id: Option<String>,
) -> CalendarMonthSummary {
    let store = state.0.lock().unwrap();
    let mut total_tracked = 0i64;
    let mut total_planned = 0i64;
    let mut total_tasks = 0i64;
    let mut days_set = std::collections::HashSet::new();

    for t in &store.tasks {
        if t.date.starts_with(&year_month) {
            if let Some(ref mid) = member_id {
                if !mid.is_empty() && &t.member_id != mid {
                    continue;
                }
            }
            total_tasks += 1;
            days_set.insert(t.date.clone());
            if t.entry_type == "entry" {
                total_tracked += t.duration_minutes;
            } else {
                total_planned += t.duration_minutes;
            }
        }
    }

    CalendarMonthSummary {
        month: year_month,
        total_tracked_minutes: total_tracked,
        total_planned_minutes: total_planned,
        total_tasks,
        days_with_entries: days_set.len() as i64,
    }
}

#[tauri::command]
pub fn export_calendar_ics(
    state: State<'_, CalendarState>,
    member_id: Option<String>,
) -> String {
    let store = state.0.lock().unwrap();
    let mut ics = String::from("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Clockify Desktop//Calendar//EN\r\nCALSCALE:GREGORIAN\r\n");

    for t in &store.tasks {
        if let Some(ref mid) = member_id {
            if !mid.is_empty() && &t.member_id != mid {
                continue;
            }
        }

        let date_clean = t.date.replace('-', "");
        let start_clean = t.start_time.replace(':', "");
        let end_clean = t.end_time.replace(':', "");

        ics.push_str("BEGIN:VEVENT\r\n");
        ics.push_str(&format!("UID:{}\r\n", t.id));
        ics.push_str(&format!("DTSTART:{}T{}00Z\r\n", date_clean, start_clean));
        ics.push_str(&format!("DTEND:{}T{}00Z\r\n", date_clean, end_clean));
        ics.push_str(&format!("SUMMARY:{}\r\n", t.title));
        ics.push_str(&format!("DESCRIPTION:Project: {} | Billable: {}\r\n", t.project_name, t.is_billable));
        ics.push_str("STATUS:CONFIRMED\r\n");
        ics.push_str("END:VEVENT\r\n");
    }

    ics.push_str("END:VCALENDAR\r\n");
    ics
}

