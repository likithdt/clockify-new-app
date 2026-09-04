use super::models::{DetailedReport, ExportReportResult, ReportFilter, SummaryReport};
use super::store::ReportStore;
use tauri::State;

#[tauri::command]
pub fn get_summary_report(filter: Option<ReportFilter>, state: State<'_, ReportStore>) -> Result<SummaryReport, String> {
    Ok(state.get_summary(filter))
}

#[tauri::command]
pub fn get_detailed_report(filter: Option<ReportFilter>, state: State<'_, ReportStore>) -> Result<DetailedReport, String> {
    Ok(state.get_detailed(filter))
}

#[tauri::command]
pub fn export_report(report_type: String, format: String, state: State<'_, ReportStore>) -> Result<ExportReportResult, String> {
    Ok(state.export(&report_type, &format))
}
