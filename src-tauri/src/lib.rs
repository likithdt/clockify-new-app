// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod timeoff;

use timeoff::commands::*;
use timeoff::store::TimeOffState;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // Register the Time Off in-memory state (seeded with sample data)
        .manage(TimeOffState::new_with_sample_data())
        .invoke_handler(tauri::generate_handler![
            // Legacy
            greet,
            // ── Requests ──────────────────────────────────────────────────
            list_timeoff_requests,
            get_timeoff_request,
            create_timeoff_request,
            review_timeoff_request,
            withdraw_timeoff_request,
            delete_timeoff_request,
            // ── Timeline ──────────────────────────────────────────────────
            get_timeline,
            // ── Balance ───────────────────────────────────────────────────
            list_leave_balances,
            set_leave_balance,
            // ── Policies ──────────────────────────────────────────────────
            list_leave_policies,
            get_leave_policy,
            create_leave_policy,
            update_leave_policy,
            deactivate_leave_policy,
            delete_leave_policy,
            assign_members_to_policy,
            unassign_member_from_policy,
            // ── Holidays ──────────────────────────────────────────────────
            list_holidays,
            create_holiday,
            delete_holiday,
            import_public_holidays,
            // ── Members ───────────────────────────────────────────────────
            list_team_members,
            add_team_member,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
