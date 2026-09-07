use super::models::{
    CreateTimeEntryPayload, TimeEntry, TimeEntryFilter, TimeEntrySummary, TimerStatus,
    UpdateTimeEntryPayload,
};
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
pub struct TimeEntryStore {
    entries: Arc<Mutex<Vec<TimeEntry>>>,
    active_timer: Arc<Mutex<TimerStatus>>,
    start_epoch_secs: Arc<Mutex<u64>>,
}

impl Default for TimeEntryStore {
    fn default() -> Self {
        Self::new()
    }
}

impl TimeEntryStore {
    pub fn new() -> Self {
        let initial = vec![
            TimeEntry {
                id: "te-1".to_string(),
                description: "Desktop UI implementation & state management".to_string(),
                project_id: Some("proj-1".to_string()),
                project_name: "Internal Work".to_string(),
                project_color: "#03a9f4".to_string(),
                client: None,
                task_id: None,
                task_name: None,
                is_billable: true,
                start_time: "2026-08-31T09:00:00.000Z".to_string(),
                end_time: Some("2026-08-31T17:00:00.000Z".to_string()),
                duration_seconds: 28800,
                location: None,
                user_id: None,
                user_name: Some("Bindhu shree".to_string()),
            },
            TimeEntry {
                id: "te-2".to_string(),
                description: "Backend architecture review and API endpoints".to_string(),
                project_id: Some("proj-2".to_string()),
                project_name: "Project Orion".to_string(),
                project_color: "#f59e0b".to_string(),
                client: Some("Client B".to_string()),
                task_id: None,
                task_name: None,
                is_billable: true,
                start_time: "2026-09-01T10:00:00.000Z".to_string(),
                end_time: Some("2026-09-01T14:30:00.000Z".to_string()),
                duration_seconds: 16200,
                location: None,
                user_id: None,
                user_name: Some("Bindhu shree".to_string()),
            },
        ];

        let initial_timer = TimerStatus {
            is_tracking: false,
            start_time: None,
            elapsed_seconds: 0,
            description: "".to_string(),
            project_name: "No Project".to_string(),
            project_color: "#94a3b8".to_string(),
            is_billable: true,
        };

        Self {
            entries: Arc::new(Mutex::new(initial)),
            active_timer: Arc::new(Mutex::new(initial_timer)),
            start_epoch_secs: Arc::new(Mutex::new(0)),
        }
    }

    pub fn list(&self, filter: Option<TimeEntryFilter>) -> Vec<TimeEntry> {
        let entries = self.entries.lock().unwrap();
        let mut result = entries.clone();

        if let Some(f) = filter {
            if let Some(pid) = f.project_id {
                result.retain(|e| e.project_id.as_deref() == Some(&pid));
            }

            if let Some(uid) = f.user_id {
                result.retain(|e| e.user_id.as_deref() == Some(&uid));
            }

            if let Some(billable) = f.is_billable {
                result.retain(|e| e.is_billable == billable);
            }

            if let (Some(start), Some(end)) = (f.start_date, f.end_date) {
                result.retain(|e| e.start_time <= end && e.end_time.as_ref().map(|et| et >= &start).unwrap_or(true));
            }
        }

        result
    }

    pub fn get(&self, id: &str) -> Option<TimeEntry> {
        let entries = self.entries.lock().unwrap();
        entries.iter().find(|e| e.id == id).cloned()
    }

    pub fn create(&self, payload: CreateTimeEntryPayload) -> TimeEntry {
        let mut entries = self.entries.lock().unwrap();
        let id = generate_id("te");
        let new_entry = TimeEntry {
            id,
            description: payload.description.trim().to_string(),
            project_id: payload.project_id,
            project_name: payload.project_name.unwrap_or_else(|| "No Project".to_string()),
            project_color: payload.project_color.unwrap_or_else(|| "#94a3b8".to_string()),
            client: payload.client,
            task_id: payload.task_id,
            task_name: payload.task_name,
            is_billable: payload.is_billable.unwrap_or(true),
            start_time: payload.start_time,
            end_time: payload.end_time,
            duration_seconds: payload.duration_seconds,
            location: payload.location,
            user_id: payload.user_id,
            user_name: payload.user_name.or_else(|| Some("Bindhu shree".to_string())),
        };

        entries.insert(0, new_entry.clone());
        new_entry
    }

    pub fn update(&self, id: &str, payload: UpdateTimeEntryPayload) -> Result<TimeEntry, String> {
        let mut entries = self.entries.lock().unwrap();
        let entry = entries.iter_mut().find(|e| e.id == id).ok_or_else(|| format!("Time entry '{}' not found", id))?;

        if let Some(desc) = payload.description {
            entry.description = desc.trim().to_string();
        }
        if let Some(pid) = payload.project_id {
            entry.project_id = Some(pid);
        }
        if let Some(pname) = payload.project_name {
            entry.project_name = pname;
        }
        if let Some(pcol) = payload.project_color {
            entry.project_color = pcol;
        }
        if let Some(c) = payload.client {
            entry.client = Some(c);
        }
        if let Some(tid) = payload.task_id {
            entry.task_id = Some(tid);
        }
        if let Some(tname) = payload.task_name {
            entry.task_name = Some(tname);
        }
        if let Some(billable) = payload.is_billable {
            entry.is_billable = billable;
        }
        if let Some(st) = payload.start_time {
            entry.start_time = st;
        }
        if let Some(et) = payload.end_time {
            entry.end_time = Some(et);
        }
        if let Some(dur) = payload.duration_seconds {
            entry.duration_seconds = dur;
        }
        if let Some(loc) = payload.location {
            entry.location = Some(loc);
        }

        Ok(entry.clone())
    }

    pub fn delete(&self, id: &str) -> bool {
        let mut entries = self.entries.lock().unwrap();
        let prev_len = entries.len();
        entries.retain(|e| e.id != id);
        entries.len() < prev_len
    }

    pub fn start_timer(
        &self,
        description: String,
        project_name: String,
        project_color: String,
        is_billable: bool,
    ) -> TimerStatus {
        let mut timer = self.active_timer.lock().unwrap();
        let current_secs = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        timer.is_tracking = true;
        timer.start_time = Some(current_iso_timestamp());
        timer.description = description;
        timer.project_name = project_name;
        timer.project_color = project_color;
        timer.is_billable = is_billable;
        timer.elapsed_seconds = 0;

        *self.start_epoch_secs.lock().unwrap() = current_secs;

        timer.clone()
    }

    pub fn stop_timer(&self) -> Option<TimeEntry> {
        let mut timer = self.active_timer.lock().unwrap();
        if !timer.is_tracking || timer.start_time.is_none() {
            return None;
        }

        let start_str = timer.start_time.clone().unwrap();
        let current_secs = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        let start_secs = *self.start_epoch_secs.lock().unwrap();
        let duration = if current_secs >= start_secs && start_secs > 0 {
            (current_secs - start_secs).max(1) as i64
        } else {
            1
        };

        let end_str = current_iso_timestamp();

        let entry = self.create(CreateTimeEntryPayload {
            description: timer.description.clone(),
            project_id: None,
            project_name: Some(timer.project_name.clone()),
            project_color: Some(timer.project_color.clone()),
            client: None,
            task_id: None,
            task_name: None,
            is_billable: Some(timer.is_billable),
            start_time: start_str,
            end_time: Some(end_str),
            duration_seconds: duration,
            location: None,
            user_id: None,
            user_name: None,
        });

        timer.is_tracking = false;
        timer.start_time = None;
        timer.description = "".to_string();
        timer.project_name = "No Project".to_string();
        timer.project_color = "#94a3b8".to_string();
        timer.is_billable = true;
        timer.elapsed_seconds = 0;
        *self.start_epoch_secs.lock().unwrap() = 0;

        Some(entry)
    }

    pub fn get_timer_status(&self) -> TimerStatus {
        let mut timer = self.active_timer.lock().unwrap();
        if timer.is_tracking {
            let current_secs = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs();
            let start_secs = *self.start_epoch_secs.lock().unwrap();
            if current_secs >= start_secs && start_secs > 0 {
                timer.elapsed_seconds = (current_secs - start_secs) as i64;
            }
        }
        timer.clone()
    }

    pub fn get_summary(&self, filter: Option<TimeEntryFilter>) -> TimeEntrySummary {
        let entries = self.list(filter);
        let total_seconds = entries.iter().map(|e| e.duration_seconds).sum();
        let total_billable_seconds = entries.iter().filter(|e| e.is_billable).map(|e| e.duration_seconds).sum();
        let is_running = self.active_timer.lock().unwrap().is_tracking;

        TimeEntrySummary {
            total_entries: entries.len(),
            total_seconds,
            total_billable_seconds,
            active_timer_running: is_running,
        }
    }
}
