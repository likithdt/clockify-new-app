use super::models::{ApprovalSummary, ExpenseApproval, TimesheetApproval};
use super::store::ApprovalStore;
use tauri::State;

#[tauri::command]
pub fn list_approval_timesheets(state: State<'_, ApprovalStore>) -> Result<Vec<TimesheetApproval>, String> {
    Ok(state.list_timesheets())
}

#[tauri::command]
pub fn list_approval_expenses(state: State<'_, ApprovalStore>) -> Result<Vec<ExpenseApproval>, String> {
    Ok(state.list_expenses())
}

#[tauri::command]
pub fn approve_approval_timesheets(ids: Vec<String>, state: State<'_, ApprovalStore>) -> Result<Vec<TimesheetApproval>, String> {
    Ok(state.approve_timesheets(ids))
}

#[tauri::command]
pub fn reject_approval_timesheets(ids: Vec<String>, state: State<'_, ApprovalStore>) -> Result<Vec<TimesheetApproval>, String> {
    Ok(state.reject_timesheets(ids))
}

#[tauri::command]
pub fn approve_approval_expenses(ids: Vec<String>, state: State<'_, ApprovalStore>) -> Result<Vec<ExpenseApproval>, String> {
    Ok(state.approve_expenses(ids))
}

#[tauri::command]
pub fn reject_approval_expenses(ids: Vec<String>, state: State<'_, ApprovalStore>) -> Result<Vec<ExpenseApproval>, String> {
    Ok(state.reject_expenses(ids))
}

#[tauri::command]
pub fn reset_sample_approvals(state: State<'_, ApprovalStore>) -> Result<(), String> {
    state.reset_sample();
    Ok(())
}

#[tauri::command]
pub fn get_approval_summary(state: State<'_, ApprovalStore>) -> Result<ApprovalSummary, String> {
    Ok(state.get_summary())
}
