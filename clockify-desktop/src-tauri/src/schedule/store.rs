use super::models::{
    CreateScheduleAssignmentPayload, ScheduleAssignment, ScheduleFilter, ScheduleSummary,
    UpdateScheduleAssignmentPayload,
};
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

fn generate_id(prefix: &str) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    format!("{}-{}", prefix, millis)
}

#[derive(Clone)]
pub struct ScheduleStore {
    assignments: Arc<Mutex<Vec<ScheduleAssignment>>>,
    is_published: Arc<Mutex<bool>>,
}

impl Default for ScheduleStore {
    fn default() -> Self {
        Self::new()
    }
}

impl ScheduleStore {
    pub fn new() -> Self {
        let initial = vec![
            ScheduleAssignment {
                id: "assign-alpha-1".to_string(),
                project_id: "proj-alpha".to_string(),
                project_name: "[SAMPLE] Project Alpha".to_string(),
                project_color: "#F59E0B".to_string(),
                client: "[SAMPLE] Client B".to_string(),
                member_id: "tm-bindhu".to_string(),
                member_name: "Bindhu Shree".to_string(),
                member_initials: "BS".to_string(),
                member_avatar_color: "#00897B".to_string(),
                start_date: "2026-08-31".to_string(),
                end_date: "2026-09-02".to_string(),
                hours_per_day: 8.0,
                total_hours: 16.0,
                note: Some("Frontend Architecture & UI Setup".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: None,
            },
            ScheduleAssignment {
                id: "assign-alpha-2".to_string(),
                project_id: "proj-alpha".to_string(),
                project_name: "[SAMPLE] Project Alpha".to_string(),
                project_color: "#F59E0B".to_string(),
                client: "[SAMPLE] Client B".to_string(),
                member_id: "tm-likith".to_string(),
                member_name: "Likith D T".to_string(),
                member_initials: "LD".to_string(),
                member_avatar_color: "#0288D1".to_string(),
                start_date: "2026-09-03".to_string(),
                end_date: "2026-09-03".to_string(),
                hours_per_day: 8.0,
                total_hours: 8.0,
                note: Some("API Integration sprint".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: None,
            },
            ScheduleAssignment {
                id: "assign-beta-1".to_string(),
                project_id: "proj-beta".to_string(),
                project_name: "[SAMPLE] Project Beta".to_string(),
                project_color: "#EF4444".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                member_id: "tm-likith".to_string(),
                member_name: "Likith D T".to_string(),
                member_initials: "LD".to_string(),
                member_avatar_color: "#0288D1".to_string(),
                start_date: "2026-08-31".to_string(),
                end_date: "2026-09-08".to_string(),
                hours_per_day: 4.0,
                total_hours: 28.0,
                note: Some("Rust Native Backend Modules".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: None,
            },
            ScheduleAssignment {
                id: "assign-beta-2".to_string(),
                project_id: "proj-beta".to_string(),
                project_name: "[SAMPLE] Project Beta".to_string(),
                project_color: "#EF4444".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                member_id: "tm-james".to_string(),
                member_name: "James Anderson".to_string(),
                member_initials: "JA".to_string(),
                member_avatar_color: "#64748B".to_string(),
                start_date: "2026-09-09".to_string(),
                end_date: "2026-09-17".to_string(),
                hours_per_day: 4.0,
                total_hours: 24.0,
                note: Some("Database Migrations & Security Tests".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: None,
            },
            ScheduleAssignment {
                id: "assign-gamma-v1".to_string(),
                project_id: "proj-gamma".to_string(),
                project_name: "[SAMPLE] Project Gamma".to_string(),
                project_color: "#78716C".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                member_id: "tm-lara".to_string(),
                member_name: "Lara Peterson".to_string(),
                member_initials: "LP".to_string(),
                member_avatar_color: "#4CAF50".to_string(),
                start_date: "2026-08-31".to_string(),
                end_date: "2026-09-01".to_string(),
                hours_per_day: 8.0,
                total_hours: 16.0,
                version_label: Some("V1".to_string()),
                is_hatched: Some(true),
                note: Some("Version 1 Prototyping Phase".to_string()),
                is_milestone_active: Some(true),
            },
            ScheduleAssignment {
                id: "assign-gamma-main".to_string(),
                project_id: "proj-gamma".to_string(),
                project_name: "[SAMPLE] Project Gamma".to_string(),
                project_color: "#78716C".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                member_id: "tm-james".to_string(),
                member_name: "James Anderson".to_string(),
                member_initials: "JA".to_string(),
                member_avatar_color: "#64748B".to_string(),
                start_date: "2026-09-02".to_string(),
                end_date: "2026-09-13".to_string(),
                hours_per_day: 4.5,
                total_hours: 40.0,
                note: Some("Core Infrastructure Cluster Build".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: Some(true),
            },
            ScheduleAssignment {
                id: "assign-gamma-late".to_string(),
                project_id: "proj-gamma".to_string(),
                project_name: "[SAMPLE] Project Gamma".to_string(),
                project_color: "#78716C".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                member_id: "tm-lara".to_string(),
                member_name: "Lara Peterson".to_string(),
                member_initials: "LP".to_string(),
                member_avatar_color: "#4CAF50".to_string(),
                start_date: "2026-09-14".to_string(),
                end_date: "2026-09-18".to_string(),
                hours_per_day: 3.0,
                total_hours: 15.0,
                note: Some("Release Validation & QA".to_string()),
                version_label: None,
                is_hatched: None,
                is_milestone_active: Some(true),
            },
        ];

        Self {
            assignments: Arc::new(Mutex::new(initial)),
            is_published: Arc::new(Mutex::new(true)),
        }
    }

    pub fn list(&self, filter: Option<ScheduleFilter>) -> Vec<ScheduleAssignment> {
        let items = self.assignments.lock().unwrap();
        let mut result = items.clone();

        if let Some(f) = filter {
            if let Some(pid) = f.project_id {
                result.retain(|a| a.project_id == pid);
            }
            if let Some(mid) = f.member_id {
                result.retain(|a| a.member_id == mid);
            }
            if let Some(client) = f.client {
                result.retain(|a| a.client == client);
            }
            if let (Some(start), Some(end)) = (f.start_date, f.end_date) {
                result.retain(|a| a.start_date <= end && a.end_date >= start);
            }
        }

        result
    }

    pub fn get(&self, id: &str) -> Option<ScheduleAssignment> {
        let items = self.assignments.lock().unwrap();
        items.iter().find(|a| a.id == id).cloned()
    }

    pub fn create(&self, payload: CreateScheduleAssignmentPayload) -> ScheduleAssignment {
        let mut items = self.assignments.lock().unwrap();
        let id = generate_id("assign");
        let new_item = ScheduleAssignment {
            id,
            project_id: payload.project_id,
            project_name: payload.project_name,
            project_color: payload.project_color,
            client: payload.client,
            member_id: payload.member_id,
            member_name: payload.member_name,
            member_initials: payload.member_initials,
            member_avatar_color: payload.member_avatar_color,
            start_date: payload.start_date,
            end_date: payload.end_date,
            hours_per_day: payload.hours_per_day,
            total_hours: payload.total_hours,
            note: payload.note,
            version_label: payload.version_label,
            is_hatched: payload.is_hatched,
            is_milestone_active: payload.is_milestone_active,
        };
        items.push(new_item.clone());
        new_item
    }

    pub fn update(&self, id: &str, payload: UpdateScheduleAssignmentPayload) -> Result<ScheduleAssignment, String> {
        let mut items = self.assignments.lock().unwrap();
        let item = items.iter_mut().find(|a| a.id == id).ok_or_else(|| format!("Assignment '{}' not found", id))?;

        if let Some(pid) = payload.project_id {
            item.project_id = pid;
        }
        if let Some(pname) = payload.project_name {
            item.project_name = pname;
        }
        if let Some(pcol) = payload.project_color {
            item.project_color = pcol;
        }
        if let Some(c) = payload.client {
            item.client = c;
        }
        if let Some(mid) = payload.member_id {
            item.member_id = mid;
        }
        if let Some(mname) = payload.member_name {
            item.member_name = mname;
        }
        if let Some(minit) = payload.member_initials {
            item.member_initials = minit;
        }
        if let Some(mcol) = payload.member_avatar_color {
            item.member_avatar_color = mcol;
        }
        if let Some(sd) = payload.start_date {
            item.start_date = sd;
        }
        if let Some(ed) = payload.end_date {
            item.end_date = ed;
        }
        if let Some(hpd) = payload.hours_per_day {
            item.hours_per_day = hpd;
        }
        if let Some(th) = payload.total_hours {
            item.total_hours = th;
        }
        if let Some(n) = payload.note {
            item.note = n;
        }
        if let Some(vl) = payload.version_label {
            item.version_label = vl;
        }
        if let Some(ih) = payload.is_hatched {
            item.is_hatched = Some(ih);
        }
        if let Some(ma) = payload.is_milestone_active {
            item.is_milestone_active = Some(ma);
        }

        Ok(item.clone())
    }

    pub fn delete(&self, id: &str) -> bool {
        let mut items = self.assignments.lock().unwrap();
        let prev_len = items.len();
        items.retain(|a| a.id != id);
        items.len() < prev_len
    }

    pub fn toggle_publish(&self) -> bool {
        let mut pub_flag = self.is_published.lock().unwrap();
        *pub_flag = !*pub_flag;
        *pub_flag
    }

    pub fn is_published(&self) -> bool {
        *self.is_published.lock().unwrap()
    }

    pub fn remove_sample_data(&self) {
        let mut items = self.assignments.lock().unwrap();
        items.retain(|a| !a.project_name.contains("[SAMPLE]"));
    }

    pub fn restore_sample_data(&self) {
        let mut items = self.assignments.lock().unwrap();
        let sample = Self::new().list(None);
        items.retain(|a| !a.project_name.contains("[SAMPLE]"));
        for a in sample {
            items.push(a);
        }
    }

    pub fn get_summary(&self) -> ScheduleSummary {
        let items = self.assignments.lock().unwrap();
        let total_assignments = items.len();
        let total_scheduled_hours = items.iter().map(|a| a.total_hours).sum();
        let mut members = HashSet::new();
        let mut projects = HashSet::new();
        for a in items.iter() {
            members.insert(&a.member_id);
            projects.insert(&a.project_id);
        }

        ScheduleSummary {
            total_assignments,
            total_scheduled_hours,
            total_members_scheduled: members.len(),
            total_projects_scheduled: projects.len(),
            is_published: *self.is_published.lock().unwrap(),
        }
    }
}
