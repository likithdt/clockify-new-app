use super::models::{
    CreateTimeEntryPayload, TimeEntry, TimeEntryFilter, TimeEntrySummary, TimerStatus,
    UpdateTimeEntryPayload,
};
use super::store::TimeEntryStore;
use tauri::State;

#[tauri::command]
pub fn list_time_entries(filter: Option<TimeEntryFilter>, state: State<'_, TimeEntryStore>) -> Result<Vec<TimeEntry>, String> {
    Ok(state.list(filter))
}

#[tauri::command]
pub fn get_time_entry(id: String, state: State<'_, TimeEntryStore>) -> Result<TimeEntry, String> {
    state.get(&id).ok_or_else(|| format!("Time entry '{}' not found", id))
}

#[tauri::command]
pub fn create_time_entry(payload: CreateTimeEntryPayload, state: State<'_, TimeEntryStore>) -> Result<TimeEntry, String> {
    Ok(state.create(payload))
}

#[tauri::command]
pub fn update_time_entry(id: String, payload: UpdateTimeEntryPayload, state: State<'_, TimeEntryStore>) -> Result<TimeEntry, String> {
    state.update(&id, payload)
}

#[tauri::command]
pub fn delete_time_entry(id: String, state: State<'_, TimeEntryStore>) -> Result<bool, String> {
    Ok(state.delete(&id))
}

#[tauri::command]
pub fn start_time_entry_timer(
    description: Option<String>,
    project_name: Option<String>,
    project_color: Option<String>,
    is_billable: Option<bool>,
    state: State<'_, TimeEntryStore>,
) -> Result<TimerStatus, String> {
    let desc = description.unwrap_or_default();
    let pname = project_name.unwrap_or_else(|| "No Project".to_string());
    let pcol = project_color.unwrap_or_else(|| "#94a3b8".to_string());
    let billable = is_billable.unwrap_or(true);
    Ok(state.start_timer(desc, pname, pcol, billable))
}

#[tauri::command]
pub fn stop_time_entry_timer(state: State<'_, TimeEntryStore>) -> Result<Option<TimeEntry>, String> {
    Ok(state.stop_timer())
}

#[tauri::command]
pub fn get_time_entry_timer_status(state: State<'_, TimeEntryStore>) -> Result<TimerStatus, String> {
    Ok(state.get_timer_status())
}

#[tauri::command]
pub fn get_time_entry_summary(filter: Option<TimeEntryFilter>, state: State<'_, TimeEntryStore>) -> Result<TimeEntrySummary, String> {
    Ok(state.get_summary(filter))
}
