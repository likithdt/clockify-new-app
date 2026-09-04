use super::models::{
    AttendanceRecord, CreateKioskPayload, KioskDevice, KioskSummary, PinVerificationResult,
    PunchClockPayload, UpdateKioskPayload,
};
use super::store::KioskStore;
use tauri::State;

#[tauri::command]
pub fn list_kiosks(state: State<'_, KioskStore>) -> Result<Vec<KioskDevice>, String> {
    Ok(state.list_kiosks())
}

#[tauri::command]
pub fn get_kiosk(id: String, state: State<'_, KioskStore>) -> Result<KioskDevice, String> {
    state.get_kiosk(&id).ok_or_else(|| format!("Kiosk '{}' not found", id))
}

#[tauri::command]
pub fn create_kiosk(payload: CreateKioskPayload, state: State<'_, KioskStore>) -> Result<KioskDevice, String> {
    if payload.name.trim().is_empty() {
        return Err("Kiosk name is required".to_string());
    }
    Ok(state.create_kiosk(payload))
}

#[tauri::command]
pub fn update_kiosk(id: String, payload: UpdateKioskPayload, state: State<'_, KioskStore>) -> Result<KioskDevice, String> {
    state.update_kiosk(&id, payload)
}

#[tauri::command]
pub fn delete_kiosk(id: String, state: State<'_, KioskStore>) -> Result<bool, String> {
    Ok(state.delete_kiosk(&id))
}

#[tauri::command]
pub fn verify_kiosk_pin(kiosk_id: String, pin: String, state: State<'_, KioskStore>) -> Result<PinVerificationResult, String> {
    state.verify_pin(&kiosk_id, &pin)
}

#[tauri::command]
pub fn record_kiosk_attendance(payload: PunchClockPayload, state: State<'_, KioskStore>) -> Result<AttendanceRecord, String> {
    if payload.kiosk_id.trim().is_empty() || payload.user_name.trim().is_empty() {
        return Err("Kiosk ID and user name are required".to_string());
    }
    Ok(state.record_attendance(payload))
}

#[tauri::command]
pub fn list_kiosk_attendance_records(kiosk_id: Option<String>, state: State<'_, KioskStore>) -> Result<Vec<AttendanceRecord>, String> {
    Ok(state.list_attendance_records(kiosk_id))
}

#[tauri::command]
pub fn get_kiosk_summary(state: State<'_, KioskStore>) -> Result<KioskSummary, String> {
    Ok(state.get_summary())
}
