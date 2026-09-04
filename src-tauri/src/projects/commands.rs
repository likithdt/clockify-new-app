use super::models::{CreateProjectPayload, Project, ProjectFilter, ProjectSummary, UpdateProjectPayload};
use super::store::ProjectStore;
use tauri::State;

#[tauri::command]
pub fn list_projects(filter: Option<ProjectFilter>, state: State<'_, ProjectStore>) -> Result<Vec<Project>, String> {
    Ok(state.list(filter))
}

#[tauri::command]
pub fn get_project(id: String, state: State<'_, ProjectStore>) -> Result<Project, String> {
    state.get(&id).ok_or_else(|| format!("Project '{}' not found", id))
}

#[tauri::command]
pub fn create_project(payload: CreateProjectPayload, state: State<'_, ProjectStore>) -> Result<Project, String> {
    if payload.name.trim().is_empty() {
        return Err("Project name is required".to_string());
    }
    Ok(state.create(payload))
}

#[tauri::command]
pub fn update_project(id: String, payload: UpdateProjectPayload, state: State<'_, ProjectStore>) -> Result<Project, String> {
    state.update(&id, payload)
}

#[tauri::command]
pub fn delete_project(id: String, state: State<'_, ProjectStore>) -> Result<bool, String> {
    Ok(state.delete(&id))
}

#[tauri::command]
pub fn archive_project(id: String, state: State<'_, ProjectStore>) -> Result<Project, String> {
    state.update(&id, UpdateProjectPayload {
        name: None,
        color: None,
        client: None,
        access: None,
        is_billable: None,
        is_favorite: None,
        is_archived: Some(true),
        budget_hours: None,
        budget_amount: None,
        tracked_hours: None,
        amount: None,
        currency: None,
    })
}

#[tauri::command]
pub fn restore_project(id: String, state: State<'_, ProjectStore>) -> Result<Project, String> {
    state.update(&id, UpdateProjectPayload {
        name: None,
        color: None,
        client: None,
        access: None,
        is_billable: None,
        is_favorite: None,
        is_archived: Some(false),
        budget_hours: None,
        budget_amount: None,
        tracked_hours: None,
        amount: None,
        currency: None,
    })
}

#[tauri::command]
pub fn toggle_favorite_project(id: String, state: State<'_, ProjectStore>) -> Result<Project, String> {
    state.toggle_favorite(&id)
}

#[tauri::command]
pub fn remove_sample_projects(state: State<'_, ProjectStore>) -> Result<(), String> {
    state.remove_sample_data();
    Ok(())
}

#[tauri::command]
pub fn restore_sample_projects(state: State<'_, ProjectStore>) -> Result<Vec<Project>, String> {
    state.restore_sample_data();
    Ok(state.list(None))
}

#[tauri::command]
pub fn get_project_summary(state: State<'_, ProjectStore>) -> Result<ProjectSummary, String> {
    Ok(state.get_summary())
}
