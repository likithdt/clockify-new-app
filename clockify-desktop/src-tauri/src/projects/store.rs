use super::models::{CreateProjectPayload, Project, ProjectFilter, ProjectSummary, UpdateProjectPayload};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

fn current_iso_timestamp() -> String {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let hours = (secs / 3600) % 24;
    let minutes = (secs / 60) % 60;
    let seconds = secs % 60;
    format!("2026-09-05T{:02}:{:02}:{:02}.000Z", hours, minutes, seconds)
}

fn generate_id(prefix: &str) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    format!("{}-{}", prefix, millis)
}

#[derive(Clone)]
pub struct ProjectStore {
    projects: Arc<Mutex<Vec<Project>>>,
}

impl Default for ProjectStore {
    fn default() -> Self {
        Self::new()
    }
}

impl ProjectStore {
    pub fn new() -> Self {
        let initial_projects = vec![
            Project {
                id: "proj-1".to_string(),
                name: "[SAMPLE] Internal Work".to_string(),
                color: "#03a9f4".to_string(),
                client: None,
                tracked_hours: 0.0,
                budget_hours: None,
                budget_amount: None,
                is_recurring: None,
                amount: 0.0,
                currency: "INR".to_string(),
                progress_percent: None,
                is_budget_exceeded: None,
                access: "Public".to_string(),
                is_favorite: false,
                is_archived: false,
                is_billable: true,
                created_at: "2026-01-01T00:00:00.000Z".to_string(),
            },
            Project {
                id: "proj-2".to_string(),
                name: "[SAMPLE] Project Orion".to_string(),
                color: "#f59e0b".to_string(),
                client: Some("[SAMPLE] Client B".to_string()),
                tracked_hours: 282.0,
                budget_hours: Some(400.0),
                budget_amount: None,
                is_recurring: None,
                amount: 2953.0,
                currency: "INR".to_string(),
                progress_percent: Some(70.5),
                is_budget_exceeded: Some(false),
                access: "Public".to_string(),
                is_favorite: false,
                is_archived: false,
                is_billable: true,
                created_at: "2026-01-10T00:00:00.000Z".to_string(),
            },
            Project {
                id: "proj-3".to_string(),
                name: "[SAMPLE] Project Apollo".to_string(),
                color: "#10b981".to_string(),
                client: Some("[SAMPLE] Client A".to_string()),
                tracked_hours: 154.0,
                budget_hours: Some(200.0),
                budget_amount: None,
                is_recurring: None,
                amount: 1840.0,
                currency: "INR".to_string(),
                progress_percent: Some(77.0),
                is_budget_exceeded: Some(false),
                access: "Public".to_string(),
                is_favorite: false,
                is_archived: false,
                is_billable: true,
                created_at: "2026-01-15T00:00:00.000Z".to_string(),
            },
            Project {
                id: "proj-4".to_string(),
                name: "[SAMPLE] Mobile Application".to_string(),
                color: "#8b5cf6".to_string(),
                client: Some("[SAMPLE] Client A".to_string()),
                tracked_hours: 95.0,
                budget_hours: Some(100.0),
                budget_amount: None,
                is_recurring: None,
                amount: 1425.0,
                currency: "INR".to_string(),
                progress_percent: Some(95.0),
                is_budget_exceeded: Some(false),
                access: "Public".to_string(),
                is_favorite: false,
                is_archived: false,
                is_billable: true,
                created_at: "2026-02-01T00:00:00.000Z".to_string(),
            },
            Project {
                id: "proj-5".to_string(),
                name: "[SAMPLE] Brand Redesign".to_string(),
                color: "#ec4899".to_string(),
                client: Some("[SAMPLE] Client B".to_string()),
                tracked_hours: 42.0,
                budget_hours: None,
                budget_amount: None,
                is_recurring: None,
                amount: 630.0,
                currency: "INR".to_string(),
                progress_percent: None,
                is_budget_exceeded: None,
                access: "Public".to_string(),
                is_favorite: false,
                is_archived: false,
                is_billable: false,
                created_at: "2026-02-10T00:00:00.000Z".to_string(),
            },
        ];

        Self {
            projects: Arc::new(Mutex::new(initial_projects)),
        }
    }

    pub fn list(&self, filter: Option<ProjectFilter>) -> Vec<Project> {
        let projects = self.projects.lock().unwrap();
        let mut result = projects.clone();

        if let Some(f) = filter {
            if let Some(q) = f.query {
                let q_lower = q.to_lowercase();
                result.retain(|p| {
                    p.name.to_lowercase().contains(&q_lower)
                        || p.client.as_ref().map(|c| c.to_lowercase().contains(&q_lower)).unwrap_or(false)
                });
            }

            if let Some(client) = f.client {
                if client != "All" {
                    result.retain(|p| p.client.as_deref() == Some(&client));
                }
            }

            if let Some(status) = f.status {
                if status == "Active" {
                    result.retain(|p| !p.is_archived);
                } else if status == "Archived" {
                    result.retain(|p| p.is_archived);
                }
            }

            if let Some(access) = f.access {
                if access != "All" {
                    result.retain(|p| p.access == access);
                }
            }

            if let Some(billing) = f.billing {
                if billing == "Billable" {
                    result.retain(|p| p.is_billable);
                } else if billing == "Non-billable" {
                    result.retain(|p| !p.is_billable);
                }
            }

            if let Some(fav) = f.is_favorite {
                result.retain(|p| p.is_favorite == fav);
            }
        }

        result
    }

    pub fn get(&self, id: &str) -> Option<Project> {
        let projects = self.projects.lock().unwrap();
        projects.iter().find(|p| p.id == id).cloned()
    }

    pub fn create(&self, payload: CreateProjectPayload) -> Project {
        let mut projects = self.projects.lock().unwrap();
        let id = generate_id("proj");
        let new_proj = Project {
            id,
            name: payload.name.trim().to_string(),
            color: payload.color,
            client: payload.client,
            tracked_hours: 0.0,
            budget_hours: payload.budget_hours,
            budget_amount: payload.budget_amount,
            is_recurring: None,
            amount: 0.0,
            currency: payload.currency.unwrap_or_else(|| "INR".to_string()),
            progress_percent: None,
            is_budget_exceeded: None,
            access: payload.access.unwrap_or_else(|| "Public".to_string()),
            is_favorite: false,
            is_archived: false,
            is_billable: payload.is_billable.unwrap_or(true),
            created_at: current_iso_timestamp(),
        };

        projects.insert(0, new_proj.clone());
        new_proj
    }

    pub fn update(&self, id: &str, payload: UpdateProjectPayload) -> Result<Project, String> {
        let mut projects = self.projects.lock().unwrap();
        let proj = projects.iter_mut().find(|p| p.id == id).ok_or_else(|| format!("Project '{}' not found", id))?;

        if let Some(name) = payload.name {
            proj.name = name.trim().to_string();
        }
        if let Some(color) = payload.color {
            proj.color = color;
        }
        if let Some(client_opt) = payload.client {
            proj.client = client_opt;
        }
        if let Some(access) = payload.access {
            proj.access = access;
        }
        if let Some(billable) = payload.is_billable {
            proj.is_billable = billable;
        }
        if let Some(fav) = payload.is_favorite {
            proj.is_favorite = fav;
        }
        if let Some(archived) = payload.is_archived {
            proj.is_archived = archived;
        }
        if let Some(b_hours) = payload.budget_hours {
            proj.budget_hours = Some(b_hours);
        }
        if let Some(b_amount) = payload.budget_amount {
            proj.budget_amount = Some(b_amount);
        }
        if let Some(tracked) = payload.tracked_hours {
            proj.tracked_hours = tracked;
        }
        if let Some(amt) = payload.amount {
            proj.amount = amt;
        }
        if let Some(curr) = payload.currency {
            proj.currency = curr;
        }

        if let Some(b_hours) = proj.budget_hours {
            if b_hours > 0.0 {
                proj.progress_percent = Some(((proj.tracked_hours / b_hours) * 100.0).min(100.0));
                proj.is_budget_exceeded = Some(proj.tracked_hours > b_hours);
            }
        }

        Ok(proj.clone())
    }

    pub fn delete(&self, id: &str) -> bool {
        let mut projects = self.projects.lock().unwrap();
        let prev_len = projects.len();
        projects.retain(|p| p.id != id);
        projects.len() < prev_len
    }

    pub fn toggle_favorite(&self, id: &str) -> Result<Project, String> {
        let mut projects = self.projects.lock().unwrap();
        let proj = projects.iter_mut().find(|p| p.id == id).ok_or_else(|| format!("Project '{}' not found", id))?;
        proj.is_favorite = !proj.is_favorite;
        Ok(proj.clone())
    }

    pub fn remove_sample_data(&self) {
        let mut projects = self.projects.lock().unwrap();
        projects.retain(|p| !p.name.contains("[SAMPLE]"));
    }

    pub fn restore_sample_data(&self) {
        let mut projects = self.projects.lock().unwrap();
        let sample = Self::new().list(None);
        projects.retain(|p| !p.name.contains("[SAMPLE]"));
        for p in sample {
            projects.push(p);
        }
    }

    pub fn get_summary(&self) -> ProjectSummary {
        let projects = self.projects.lock().unwrap();
        let total_projects = projects.len();
        let active_projects = projects.iter().filter(|p| !p.is_archived).count();
        let archived_projects = projects.iter().filter(|p| p.is_archived).count();
        let total_tracked_hours = projects.iter().map(|p| p.tracked_hours).sum();
        let total_billable_amount = projects.iter().filter(|p| p.is_billable).map(|p| p.amount).sum();

        ProjectSummary {
            total_projects,
            active_projects,
            archived_projects,
            total_tracked_hours,
            total_billable_amount,
        }
    }
}
