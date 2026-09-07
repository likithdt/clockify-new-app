use super::models::{
    CreateScheduleAssignmentPayload, ScheduleAssignment, ScheduleFilter, ScheduleSummary,
    UpdateScheduleAssignmentPayload,
};
use super::store::ScheduleStore;
use tauri::State;

#[tauri::command]
pub fn list_schedule_assignments(filter: Option<ScheduleFilter>, state: State<'_, ScheduleStore>) -> Result<Vec<ScheduleAssignment>, String> {
    Ok(state.list(filter))
}

#[tauri::command]
pub fn get_schedule_assignment(id: String, state: State<'_, ScheduleStore>) -> Result<ScheduleAssignment, String> {
    state.get(&id).ok_or_else(|| format!("Assignment '{}' not found", id))
}

#[tauri::command]
pub fn create_schedule_assignment(payload: CreateScheduleAssignmentPayload, state: State<'_, ScheduleStore>) -> Result<ScheduleAssignment, String> {
    if payload.project_name.trim().is_empty() || payload.member_name.trim().is_empty() {
        return Err("Project and member are required".to_string());
    }
    Ok(state.create(payload))
}

#[tauri::command]
pub fn update_schedule_assignment(id: String, payload: UpdateScheduleAssignmentPayload, state: State<'_, ScheduleStore>) -> Result<ScheduleAssignment, String> {
    state.update(&id, payload)
}

#[tauri::command]
pub fn delete_schedule_assignment(id: String, state: State<'_, ScheduleStore>) -> Result<bool, String> {
    Ok(state.delete(&id))
}

#[tauri::command]
pub fn toggle_schedule_publish(state: State<'_, ScheduleStore>) -> Result<bool, String> {
    Ok(state.toggle_publish())
}

#[tauri::command]
pub fn remove_sample_schedule(state: State<'_, ScheduleStore>) -> Result<(), String> {
    state.remove_sample_data();
    Ok(())
}

#[tauri::command]
pub fn restore_sample_schedule(state: State<'_, ScheduleStore>) -> Result<Vec<ScheduleAssignment>, String> {
    state.restore_sample_data();
    Ok(state.list(None))
}

#[tauri::command]
pub fn get_schedule_summary(state: State<'_, ScheduleStore>) -> Result<ScheduleSummary, String> {
    Ok(state.get_summary())
}
