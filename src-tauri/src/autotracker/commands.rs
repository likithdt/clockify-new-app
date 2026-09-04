use super::models::{
    AutoTrackerStatus, DetectedActivity, LogActivityPayload, UpdateSuggestedProjectPayload,
};
use super::store::AutoTrackerStore;
use tauri::State;

#[tauri::command]
pub fn list_autotracker_activities(state: State<'_, AutoTrackerStore>) -> Result<Vec<DetectedActivity>, String> {
    Ok(state.list())
}

#[tauri::command]
pub fn toggle_autotracker_recording(state: State<'_, AutoTrackerStore>) -> Result<bool, String> {
    Ok(state.toggle_recording())
}

#[tauri::command]
pub fn get_autotracker_status(state: State<'_, AutoTrackerStore>) -> Result<AutoTrackerStatus, String> {
    Ok(state.get_status())
}

#[tauri::command]
pub fn log_autotracker_activity(payload: LogActivityPayload, state: State<'_, AutoTrackerStore>) -> Result<DetectedActivity, String> {
    state.log_activity(payload)
}

#[tauri::command]
pub fn log_all_autotracker_activities(state: State<'_, AutoTrackerStore>) -> Result<Vec<DetectedActivity>, String> {
    Ok(state.log_all())
}

#[tauri::command]
pub fn discard_autotracker_activity(id: String, state: State<'_, AutoTrackerStore>) -> Result<bool, String> {
    Ok(state.discard(&id))
}

#[tauri::command]
pub fn update_autotracker_project(payload: UpdateSuggestedProjectPayload, state: State<'_, AutoTrackerStore>) -> Result<DetectedActivity, String> {
    state.update_project(payload)
}
