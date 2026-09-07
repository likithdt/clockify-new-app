use super::models::{HourlyRate, RateFilter, RateHistoryItem, RateSummary, SetRatePayload};
use super::store::RateStore;
use tauri::State;

#[tauri::command]
pub fn list_rates(filter: Option<RateFilter>, state: State<'_, RateStore>) -> Result<Vec<HourlyRate>, String> {
    Ok(state.list(filter))
}

#[tauri::command]
pub fn get_rate(id: String, state: State<'_, RateStore>) -> Result<HourlyRate, String> {
    state.get(&id).ok_or_else(|| format!("Rate '{}' not found", id))
}

#[tauri::command]
pub fn set_rate(payload: SetRatePayload, state: State<'_, RateStore>) -> Result<HourlyRate, String> {
    if payload.entity_id.trim().is_empty() {
        return Err("Entity ID is required".to_string());
    }
    Ok(state.set_rate(payload))
}

#[tauri::command]
pub fn delete_rate(id: String, state: State<'_, RateStore>) -> Result<bool, String> {
    Ok(state.delete(&id))
}

#[tauri::command]
pub fn get_effective_rate(member_id: Option<String>, project_id: Option<String>, rate_type: Option<String>, state: State<'_, RateStore>) -> Result<f64, String> {
    let rt = rate_type.unwrap_or_else(|| "billable".to_string());
    Ok(state.get_effective_rate(member_id.as_deref(), project_id.as_deref(), &rt))
}

#[tauri::command]
pub fn get_rate_history(rate_id: String, state: State<'_, RateStore>) -> Result<Vec<RateHistoryItem>, String> {
    Ok(state.get_history(&rate_id))
}

#[tauri::command]
pub fn get_rate_summary(state: State<'_, RateStore>) -> Result<RateSummary, String> {
    Ok(state.get_summary())
}
