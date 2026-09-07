use super::models::{ApprovalSummary, ExpenseApproval, TimesheetApproval};
use std::sync::{Arc, Mutex};

fn current_date_string() -> String {
    "2026-09-05".to_string()
}

#[derive(Clone)]
pub struct ApprovalStore {
    timesheets: Arc<Mutex<Vec<TimesheetApproval>>>,
    expenses: Arc<Mutex<Vec<ExpenseApproval>>>,
}

impl Default for ApprovalStore {
    fn default() -> Self {
        Self::new()
    }
}

impl ApprovalStore {
    pub fn new() -> Self {
        let initial_ts = vec![
            TimesheetApproval {
                id: "ts-1".to_string(),
                period: "Aug 31, 2026 - Sep 6, 2026".to_string(),
                period_sort_date: "2026-08-31".to_string(),
                user: "[SAMPLE] Amy Smith".to_string(),
                team_manager: "-".to_string(),
                time: "16:00:00".to_string(),
                time_off: "00:00:00".to_string(),
                status: "pending".to_string(),
                submitted_at: Some("2026-09-01".to_string()),
                approved_at: None,
            },
            TimesheetApproval {
                id: "ts-2".to_string(),
                period: "Jul 13, 2026 - Jul 19, 2026".to_string(),
                period_sort_date: "2026-07-13".to_string(),
                user: "[SAMPLE] James Anderson".to_string(),
                team_manager: "[SAMPLE] Lara Peterson".to_string(),
                time: "09:00:00".to_string(),
                time_off: "00:00:00".to_string(),
                status: "pending".to_string(),
                submitted_at: Some("2026-07-20".to_string()),
                approved_at: None,
            },
            TimesheetApproval {
                id: "ts-3".to_string(),
                period: "Jul 6, 2026 - Jul 12, 2026".to_string(),
                period_sort_date: "2026-07-06".to_string(),
                user: "[SAMPLE] Lara Peterson".to_string(),
                team_manager: "-".to_string(),
                time: "40:00:00".to_string(),
                time_off: "08:00:00".to_string(),
                status: "pending".to_string(),
                submitted_at: Some("2026-07-13".to_string()),
                approved_at: None,
            },
            TimesheetApproval {
                id: "ts-unsub-1".to_string(),
                period: "Aug 31, 2026 - Sep 6, 2026".to_string(),
                period_sort_date: "2026-08-31".to_string(),
                user: "[SAMPLE] David Lee".to_string(),
                team_manager: "[SAMPLE] Lara Peterson".to_string(),
                time: "12:30:00".to_string(),
                time_off: "00:00:00".to_string(),
                status: "unsubmitted".to_string(),
                submitted_at: None,
                approved_at: None,
            },
            TimesheetApproval {
                id: "ts-arch-1".to_string(),
                period: "Jun 22, 2026 - Jun 28, 2026".to_string(),
                period_sort_date: "2026-06-22".to_string(),
                user: "[SAMPLE] Amy Smith".to_string(),
                team_manager: "-".to_string(),
                time: "38:15:00".to_string(),
                time_off: "00:00:00".to_string(),
                status: "approved".to_string(),
                submitted_at: None,
                approved_at: Some("2026-06-29".to_string()),
            },
        ];

        let initial_exp = vec![
            ExpenseApproval {
                id: "exp-app-1".to_string(),
                period: "Jul 6, 2026 - Jul 12, 2026".to_string(),
                period_sort_date: "2026-07-06".to_string(),
                user: "[SAMPLE] Lara Peterson".to_string(),
                team_manager: "-".to_string(),
                category: "Day rate".to_string(),
                amount: 100.0,
                currency: "INR".to_string(),
                status: "pending".to_string(),
                submitted_at: Some("2026-07-13".to_string()),
                approved_at: None,
            },
            ExpenseApproval {
                id: "exp-unsub-1".to_string(),
                period: "Aug 31, 2026 - Sep 6, 2026".to_string(),
                period_sort_date: "2026-08-31".to_string(),
                user: "[SAMPLE] James Anderson".to_string(),
                team_manager: "[SAMPLE] Lara Peterson".to_string(),
                category: "Travel".to_string(),
                amount: 240.5,
                currency: "INR".to_string(),
                status: "unsubmitted".to_string(),
                submitted_at: None,
                approved_at: None,
            },
            ExpenseApproval {
                id: "exp-arch-1".to_string(),
                period: "Jun 15, 2026 - Jun 21, 2026".to_string(),
                period_sort_date: "2026-06-15".to_string(),
                user: "[SAMPLE] Lara Peterson".to_string(),
                team_manager: "-".to_string(),
                category: "Software".to_string(),
                amount: 49.0,
                currency: "INR".to_string(),
                status: "approved".to_string(),
                submitted_at: None,
                approved_at: Some("2026-06-22".to_string()),
            },
        ];

        Self {
            timesheets: Arc::new(Mutex::new(initial_ts)),
            expenses: Arc::new(Mutex::new(initial_exp)),
        }
    }

    pub fn list_timesheets(&self) -> Vec<TimesheetApproval> {
        self.timesheets.lock().unwrap().clone()
    }

    pub fn list_expenses(&self) -> Vec<ExpenseApproval> {
        self.expenses.lock().unwrap().clone()
    }

    pub fn approve_timesheets(&self, ids: Vec<String>) -> Vec<TimesheetApproval> {
        let mut list = self.timesheets.lock().unwrap();
        let today = current_date_string();
        for id in ids {
            if let Some(item) = list.iter_mut().find(|t| t.id == id) {
                item.status = "approved".to_string();
                item.approved_at = Some(today.clone());
            }
        }
        list.clone()
    }

    pub fn reject_timesheets(&self, ids: Vec<String>) -> Vec<TimesheetApproval> {
        let mut list = self.timesheets.lock().unwrap();
        for id in ids {
            if let Some(item) = list.iter_mut().find(|t| t.id == id) {
                item.status = "rejected".to_string();
            }
        }
        list.clone()
    }

    pub fn approve_expenses(&self, ids: Vec<String>) -> Vec<ExpenseApproval> {
        let mut list = self.expenses.lock().unwrap();
        let today = current_date_string();
        for id in ids {
            if let Some(item) = list.iter_mut().find(|e| e.id == id) {
                item.status = "approved".to_string();
                item.approved_at = Some(today.clone());
            }
        }
        list.clone()
    }

    pub fn reject_expenses(&self, ids: Vec<String>) -> Vec<ExpenseApproval> {
        let mut list = self.expenses.lock().unwrap();
        for id in ids {
            if let Some(item) = list.iter_mut().find(|e| e.id == id) {
                item.status = "rejected".to_string();
            }
        }
        list.clone()
    }

    pub fn reset_sample(&self) {
        let fresh = Self::new();
        *self.timesheets.lock().unwrap() = fresh.list_timesheets();
        *self.expenses.lock().unwrap() = fresh.list_expenses();
    }

    pub fn get_summary(&self) -> ApprovalSummary {
        let ts = self.timesheets.lock().unwrap();
        let exp = self.expenses.lock().unwrap();

        let pending_timesheets = ts.iter().filter(|t| t.status == "pending").count();
        let pending_expenses = exp.iter().filter(|e| e.status == "pending").count();
        let unsubmitted_count = ts.iter().filter(|t| t.status == "unsubmitted").count()
            + exp.iter().filter(|e| e.status == "unsubmitted").count();
        let approved_count = ts.iter().filter(|t| t.status == "approved").count()
            + exp.iter().filter(|e| e.status == "approved").count();

        ApprovalSummary {
            pending_timesheets,
            pending_expenses,
            total_pending: pending_timesheets + pending_expenses,
            unsubmitted_count,
            approved_count,
        }
    }
}
