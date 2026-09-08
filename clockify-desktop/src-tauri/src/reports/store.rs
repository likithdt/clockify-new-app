use super::models::{
    DetailedReport, DetailedReportItem, ExportReportResult, ReportFilter, SummaryReport,
    SummaryReportItem,
};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

fn format_secs(sec: i64) -> String {
    let h = sec / 3600;
    let m = (sec % 3600) / 60;
    let s = sec % 60;
    format!("{:02}:{:02}:{:02}", h, m, s)
}

#[derive(Clone)]
pub struct ReportStore {
    sample_records: Arc<Mutex<Vec<DetailedReportItem>>>,
}

impl Default for ReportStore {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportStore {
    pub fn new() -> Self {
        let sample = vec![
            DetailedReportItem {
                id: "rep-1".to_string(),
                description: "Desktop UI implementation & state management".to_string(),
                project_name: "Internal Work".to_string(),
                project_color: "#03a9f4".to_string(),
                client_name: None,
                user_name: "Bindhu shree".to_string(),
                start_time: "2026-08-31T09:00:00.000Z".to_string(),
                end_time: Some("2026-08-31T17:00:00.000Z".to_string()),
                duration_seconds: 28800,
                duration_formatted: "08:00:00".to_string(),
                is_billable: true,
                amount: 400.0,
                currency: "INR".to_string(),
            },
            DetailedReportItem {
                id: "rep-2".to_string(),
                description: "Backend architecture review and API endpoints".to_string(),
                project_name: "Project Orion".to_string(),
                project_color: "#f59e0b".to_string(),
                client_name: Some("Client B".to_string()),
                user_name: "Bindhu shree".to_string(),
                start_time: "2026-09-01T10:00:00.000Z".to_string(),
                end_time: Some("2026-09-01T14:30:00.000Z".to_string()),
                duration_seconds: 16200,
                duration_formatted: "04:30:00".to_string(),
                is_billable: true,
                amount: 292.5,
                currency: "INR".to_string(),
            },
            DetailedReportItem {
                id: "rep-3".to_string(),
                description: "Tauri IPC bridge and error handling".to_string(),
                project_name: "Project Apollo".to_string(),
                project_color: "#10b981".to_string(),
                client_name: Some("Client A".to_string()),
                user_name: "Amy Smith".to_string(),
                start_time: "2026-09-02T09:00:00.000Z".to_string(),
                end_time: Some("2026-09-02T13:00:00.000Z".to_string()),
                duration_seconds: 14400,
                duration_formatted: "04:00:00".to_string(),
                is_billable: true,
                amount: 200.0,
                currency: "INR".to_string(),
            },
        ];

        Self {
            sample_records: Arc::new(Mutex::new(sample)),
        }
    }

    pub fn get_summary(&self, filter: Option<ReportFilter>) -> SummaryReport {
        let items = self.sample_records.lock().unwrap();
        let mut filtered: Vec<DetailedReportItem> = items.clone();

        if let Some(f) = filter {
            if let Some(billable) = f.is_billable {
                filtered.retain(|i| i.is_billable == billable);
            }
        }

        let total_secs: i64 = filtered.iter().map(|i| i.duration_seconds).sum();
        let total_billable: i64 = filtered.iter().filter(|i| i.is_billable).map(|i| i.duration_seconds).sum();
        let total_amount: f64 = filtered.iter().map(|i| i.amount).sum();

        let mut project_map: HashMap<String, (i64, i64, f64, String, Option<String>)> = HashMap::new();
        for item in &filtered {
            let entry = project_map.entry(item.project_name.clone()).or_insert((0, 0, 0.0, item.project_color.clone(), item.client_name.clone()));
            entry.0 += item.duration_seconds;
            if item.is_billable {
                entry.1 += item.duration_seconds;
            }
            entry.2 += item.amount;
        }

        let by_project: Vec<SummaryReportItem> = project_map
            .into_iter()
            .map(|(name, (secs, bill_secs, amt, color, client))| {
                let pct = if total_secs > 0 { (secs as f64 / total_secs as f64) * 100.0 } else { 0.0 };
                SummaryReportItem {
                    id: name.clone(),
                    name,
                    color: Some(color),
                    client,
                    duration_seconds: secs,
                    duration_formatted: format_secs(secs),
                    billable_seconds: bill_secs,
                    amount: amt,
                    currency: "INR".to_string(),
                    percentage: (pct * 10.0).round() / 10.0,
                }
            })
            .collect();

        SummaryReport {
            total_duration_seconds: total_secs,
            total_duration_formatted: format_secs(total_secs),
            total_billable_seconds: total_billable,
            total_amount,
            currency: "INR".to_string(),
            by_project,
        }
    }

    pub fn get_detailed(&self, filter: Option<ReportFilter>) -> DetailedReport {
        let items = self.sample_records.lock().unwrap();
        let mut filtered: Vec<DetailedReportItem> = items.clone();

        if let Some(f) = filter {
            if let Some(billable) = f.is_billable {
                filtered.retain(|i| i.is_billable == billable);
            }
        }

        let total_secs: i64 = filtered.iter().map(|i| i.duration_seconds).sum();
        let total_amount: f64 = filtered.iter().map(|i| i.amount).sum();

        DetailedReport {
            total_items: filtered.len(),
            total_seconds: total_secs,
            total_formatted: format_secs(total_secs),
            total_amount,
            currency: "INR".to_string(),
            items: filtered,
        }
    }

    pub fn export(&self, report_type: &str, format: &str) -> ExportReportResult {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis();

        let csv = if report_type == "summary" {
            "Project,Client,Duration,Amount\nInternal Work,,08:00:00,400\nProject Orion,Client B,04:30:00,292.5\n".to_string()
        } else {
            "Description,Project,Client,User,Duration,Amount\nDesktop UI,Internal Work,,Bindhu shree,08:00:00,400\n".to_string()
        };

        let filename = format!("Clockify_{}_Report_{}.{}", report_type, millis, if format == "excel" { "csv" } else { format });

        ExportReportResult {
            filename,
            mime_type: "text/csv".to_string(),
            content: csv.clone(),
            size_bytes: csv.len(),
        }
    }
}
