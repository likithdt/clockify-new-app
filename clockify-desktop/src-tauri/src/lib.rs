// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod timeoff;
pub mod calendar;
pub mod activity;
pub mod expenses;
pub mod invoices;
pub mod projects;
pub mod team;
pub mod schedule;
pub mod approvals;
pub mod time_entries;
pub mod kiosks;
pub mod rates;
pub mod reports;
pub mod autotracker;

use timeoff::commands::*;
use timeoff::store::TimeOffState;

use calendar::commands::*;
use calendar::store::CalendarState;

use activity::commands::*;
use activity::store::ActivityLocationState;

use expenses::commands::*;
use expenses::store::ExpenseState;

use invoices::commands::*;
use invoices::store::InvoiceState;

use projects::commands::*;
use projects::store::ProjectStore;

use team::commands::*;
use team::store::TeamStore;

use schedule::commands::*;
use schedule::store::ScheduleStore;

use approvals::commands::*;
use approvals::store::ApprovalStore;

use time_entries::commands::*;
use time_entries::store::TimeEntryStore;

use kiosks::commands::*;
use kiosks::store::KioskStore;

use rates::commands::*;
use rates::store::RateStore;

use reports::commands::*;
use reports::store::ReportStore;

use autotracker::commands::*;
use autotracker::store::AutoTrackerStore;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // Register in-memory states (seeded with sample data)
        .manage(TimeOffState::new_with_sample_data())
        .manage(CalendarState::new_with_sample_data())
        .manage(ActivityLocationState::new_with_sample_data())
        .manage(ExpenseState::new_with_sample_data())
        .manage(InvoiceState::new_with_sample_data())
        .manage(ProjectStore::new())
        .manage(TeamStore::new())
        .manage(ScheduleStore::new())
        .manage(ApprovalStore::new())
        .manage(TimeEntryStore::new())
        .manage(KioskStore::new())
        .manage(RateStore::new())
        .manage(ReportStore::new())
        .manage(AutoTrackerStore::new())
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
            create_calendar_project,
            delete_calendar_project,
            list_calendar_tags,
            create_calendar_tag,
            delete_calendar_tag,
            get_calendar_month_summary,
            export_calendar_ics,
            // ── Location & Activity Monitoring ────────────────────────────
            list_activity_records,
            get_activity_record,
            log_activity_record,
            get_activity_summary,
            list_screenshots,
            get_screenshot,
            capture_screenshot,
            delete_screenshot,
            list_member_locations,
            get_member_location,
            update_member_location,
            list_geofences,
            create_geofence,
            delete_geofence,
            get_activity_settings,
            update_activity_settings,
            // ── Expenses ──────────────────────────────────────────────────
            list_expenses,
            get_expense,
            create_expense,
            update_expense,
            delete_expense,
            approve_expense,
            reject_expense,
            clear_all_expenses,
            get_expense_summary,
            list_expense_categories,
            create_expense_category,
            delete_expense_category,
            get_expense_settings,
            update_expense_settings,
            // ── Invoices ──────────────────────────────────────────────────
            list_invoices,
            get_invoice,
            create_invoice,
            update_invoice,
            delete_invoice,
            mark_invoice_status,
            record_invoice_payment,
            remove_sample_invoices,
            restore_sample_invoices,
            get_invoice_summary,
            list_invoice_clients,
            create_invoice_client,
            delete_invoice_client,
            get_invoice_settings,
            update_invoice_settings,
            // ── Projects ──────────────────────────────────────────────────
            list_projects,
            get_project,
            create_project,
            update_project,
            delete_project,
            archive_project,
            restore_project,
            toggle_favorite_project,
            remove_sample_projects,
            restore_sample_projects,
            get_project_summary,
            // ── Workspace Team ────────────────────────────────────────────
            list_workspace_team_members,
            get_workspace_team_member,
            add_workspace_team_members,
            update_workspace_team_member,
            delete_workspace_team_member,
            reset_sample_workspace_team,
            get_workspace_team_summary,
            // ── Schedule ──────────────────────────────────────────────────
            list_schedule_assignments,
            get_schedule_assignment,
            create_schedule_assignment,
            update_schedule_assignment,
            delete_schedule_assignment,
            toggle_schedule_publish,
            remove_sample_schedule,
            restore_sample_schedule,
            get_schedule_summary,
            // ── Approvals ─────────────────────────────────────────────────
            list_approval_timesheets,
            list_approval_expenses,
            approve_approval_timesheets,
            reject_approval_timesheets,
            approve_approval_expenses,
            reject_approval_expenses,
            reset_sample_approvals,
            get_approval_summary,
            // ── Time Entries & Timer ───────────────────────────────────────
            list_time_entries,
            get_time_entry,
            create_time_entry,
            update_time_entry,
            delete_time_entry,
            start_time_entry_timer,
            stop_time_entry_timer,
            get_time_entry_timer_status,
            get_time_entry_summary,
            // ── Kiosks ───────────────────────────────────────────────────
            list_kiosks,
            get_kiosk,
            create_kiosk,
            update_kiosk,
            delete_kiosk,
            verify_kiosk_pin,
            record_kiosk_attendance,
            list_kiosk_attendance_records,
            get_kiosk_summary,
            // ── Rates ────────────────────────────────────────────────────
            list_rates,
            get_rate,
            set_rate,
            delete_rate,
            get_effective_rate,
            get_rate_history,
            get_rate_summary,
            // ── Reports ──────────────────────────────────────────────────
            get_summary_report,
            get_detailed_report,
            export_report,
            // ── Auto Tracker ─────────────────────────────────────────────
            list_autotracker_activities,
            toggle_autotracker_recording,
            get_autotracker_status,
            log_autotracker_activity,
            log_all_autotracker_activities,
            discard_autotracker_activity,
            update_autotracker_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
