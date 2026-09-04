// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod timeoff;
pub mod calendar;

use timeoff::commands::*;
use timeoff::store::TimeOffState;

use calendar::commands::*;
use calendar::store::CalendarState;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // Register the Time Off and Calendar in-memory state (seeded with sample data)
        .manage(TimeOffState::new_with_sample_data())
        .manage(CalendarState::new_with_sample_data())
        .invoke_handler(tauri::generate_handler![
            // Legacy
            greet,
            // ── Time Off: Requests ────────────────────────────────────────
            list_timeoff_requests,
            get_timeoff_request,
            create_timeoff_request,
            review_timeoff_request,
            withdraw_timeoff_request,
            delete_timeoff_request,
            // ── Time Off: Timeline ────────────────────────────────────────
            get_timeline,
            // ── Time Off: Balance ─────────────────────────────────────────
            list_leave_balances,
            set_leave_balance,
            // ── Time Off: Policies ────────────────────────────────────────
            list_leave_policies,
            get_leave_policy,
            create_leave_policy,
            update_leave_policy,
            deactivate_leave_policy,
            delete_leave_policy,
            assign_members_to_policy,
            unassign_member_from_policy,
            // ── Time Off: Holidays ────────────────────────────────────────
            list_holidays,
            create_holiday,
            delete_holiday,
            import_public_holidays,
            // ── Time Off: Members ─────────────────────────────────────────
            list_team_members,
            add_team_member,
            // ── Calendar Tasks ────────────────────────────────────────────
            list_calendar_tasks,
            get_calendar_task,
            create_calendar_task,
            update_calendar_task,
            delete_calendar_task,
            duplicate_calendar_task,
            move_calendar_task,
            get_calendar_day_summaries,
            get_calendar_settings,
            update_calendar_settings,
            list_calendar_projects,
            list_calendar_tags,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
