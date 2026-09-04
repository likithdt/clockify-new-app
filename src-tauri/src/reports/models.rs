use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ReportFilter {
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub project_ids: Option<Vec<String>>,
    pub is_billable: Option<bool>,
    pub search_query: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SummaryReportItem {
    pub id: String,
    pub name: String,
    pub color: Option<String>,
    pub client: Option<String>,
    pub duration_seconds: i64,
    pub duration_formatted: String,
    pub billable_seconds: i64,
    pub amount: f64,
    pub currency: String,
    pub percentage: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SummaryReport {
    pub total_duration_seconds: i64,
    pub total_duration_formatted: String,
    pub total_billable_seconds: i64,
    pub total_amount: f64,
    pub currency: String,
    pub by_project: Vec<SummaryReportItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetailedReportItem {
    pub id: String,
    pub description: String,
    pub project_name: String,
    pub project_color: String,
    pub client_name: Option<String>,
    pub user_name: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub duration_seconds: i64,
    pub duration_formatted: String,
    pub is_billable: bool,
    pub amount: f64,
    pub currency: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetailedReport {
    pub total_items: usize,
    pub total_seconds: i64,
    pub total_formatted: String,
    pub total_amount: f64,
    pub currency: String,
    pub items: Vec<DetailedReportItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportReportResult {
    pub filename: String,
    pub mime_type: String,
    pub content: String,
    pub size_bytes: usize,
}
