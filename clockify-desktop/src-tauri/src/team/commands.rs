use super::models::{AddTeamMemberPayload, TeamFilter, TeamMember, TeamSummary, UpdateTeamMemberPayload};
use super::store::TeamStore;
use tauri::State;

#[tauri::command]
pub fn list_workspace_team_members(filter: Option<TeamFilter>, state: State<'_, TeamStore>) -> Result<Vec<TeamMember>, String> {
    Ok(state.list(filter))
}

#[tauri::command]
pub fn get_workspace_team_member(id: String, state: State<'_, TeamStore>) -> Result<TeamMember, String> {
    state.get(&id).ok_or_else(|| format!("Team member '{}' not found", id))
}

#[tauri::command]
pub fn add_workspace_team_members(payload: AddTeamMemberPayload, state: State<'_, TeamStore>) -> Result<Vec<TeamMember>, String> {
    if payload.emails.is_empty() {
        return Err("At least one email is required".to_string());
    }
    Ok(state.add_members(payload))
}

#[tauri::command]
pub fn update_workspace_team_member(id: String, payload: UpdateTeamMemberPayload, state: State<'_, TeamStore>) -> Result<TeamMember, String> {
    state.update(&id, payload)
}

#[tauri::command]
pub fn delete_workspace_team_member(id: String, state: State<'_, TeamStore>) -> Result<bool, String> {
    Ok(state.delete(&id))
}

#[tauri::command]
pub fn reset_sample_workspace_team(state: State<'_, TeamStore>) -> Result<Vec<TeamMember>, String> {
    state.reset_sample();
    Ok(state.list(None))
}

#[tauri::command]
pub fn get_workspace_team_summary(state: State<'_, TeamStore>) -> Result<TeamSummary, String> {
    Ok(state.get_summary())
}
