use super::models::{
    AutoTrackerStatus, DetectedActivity, LogActivityPayload, UpdateSuggestedProjectPayload,
};
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AutoTrackerStore {
    activities: Arc<Mutex<Vec<DetectedActivity>>>,
    is_recording: Arc<Mutex<bool>>,
}

impl Default for AutoTrackerStore {
    fn default() -> Self {
        Self::new()
    }
}

impl AutoTrackerStore {
    pub fn new() -> Self {
        let sample = vec![
            DetectedActivity {
                id: "act-1".to_string(),
                app: "VS Code".to_string(),
                window_title: "timeflow-design-system — App.tsx".to_string(),
                icon_type: "code".to_string(),
                suggested_project: "Project Alpha".to_string(),
                project_color: "#03a9f4".to_string(),
                start_time: "08:30 AM".to_string(),
                end_time: "10:45 AM".to_string(),
                duration_minutes: 135,
                duration_seconds: 135 * 60,
                is_logged: false,
                date: "Today".to_string(),
            },
            DetectedActivity {
                id: "act-2".to_string(),
                app: "Figma".to_string(),
                window_title: "Clockify Light Design Rebuild".to_string(),
                icon_type: "design".to_string(),
                suggested_project: "Project Alpha".to_string(),
                project_color: "#9333ea".to_string(),
                start_time: "11:00 AM".to_string(),
                end_time: "12:30 PM".to_string(),
                duration_minutes: 90,
                duration_seconds: 90 * 60,
                is_logged: false,
                date: "Today".to_string(),
            },
            DetectedActivity {
                id: "act-3".to_string(),
                app: "Google Chrome".to_string(),
                window_title: "Clockify API Documentation & Reference".to_string(),
                icon_type: "browser".to_string(),
                suggested_project: "[SAMPLE] Internal Work".to_string(),
                project_color: "#0288d1".to_string(),
                start_time: "01:15 PM".to_string(),
                end_time: "01:45 PM".to_string(),
                duration_minutes: 30,
                duration_seconds: 30 * 60,
                is_logged: false,
                date: "Today".to_string(),
            },
            DetectedActivity {
                id: "act-4".to_string(),
                app: "Terminal".to_string(),
                window_title: "PowerShell: cargo tauri build & deploy".to_string(),
                icon_type: "terminal".to_string(),
                suggested_project: "[SAMPLE] Project Orion".to_string(),
                project_color: "#f59e0b".to_string(),
                start_time: "02:00 PM".to_string(),
                end_time: "02:45 PM".to_string(),
                duration_minutes: 45,
                duration_seconds: 45 * 60,
                is_logged: false,
                date: "Today".to_string(),
            },
        ];

        Self {
            activities: Arc::new(Mutex::new(sample)),
            is_recording: Arc::new(Mutex::new(true)),
        }
    }

    pub fn list(&self) -> Vec<DetectedActivity> {
        self.activities.lock().unwrap().clone()
    }

    pub fn toggle_recording(&self) -> bool {
        let mut rec = self.is_recording.lock().unwrap();
        *rec = !*rec;
        *rec
    }

    pub fn get_status(&self) -> AutoTrackerStatus {
        let activities = self.activities.lock().unwrap();
        let total_secs = activities.iter().map(|a| a.duration_seconds).sum();
        let pending = activities.iter().filter(|a| !a.is_logged).count();

        AutoTrackerStatus {
            is_recording: *self.is_recording.lock().unwrap(),
            active_app: Some("VS Code".to_string()),
            active_window: Some("Clockify Desktop - Project Development".to_string()),
            idle_seconds: 0,
            recorded_today_seconds: total_secs,
            pending_activities_count: pending,
        }
    }

    pub fn log_activity(&self, payload: LogActivityPayload) -> Result<DetectedActivity, String> {
        let mut activities = self.activities.lock().unwrap();
        let act = activities.iter_mut().find(|a| a.id == payload.activity_id).ok_or_else(|| format!("Activity '{}' not found", payload.activity_id))?;
        act.is_logged = true;
        if let Some(pname) = payload.project_name {
            act.suggested_project = pname;
        }
        if let Some(pcol) = payload.project_color {
            act.project_color = pcol;
        }
        Ok(act.clone())
    }

    pub fn log_all(&self) -> Vec<DetectedActivity> {
        let mut activities = self.activities.lock().unwrap();
        for a in activities.iter_mut() {
            a.is_logged = true;
        }
        activities.clone()
    }

    pub fn discard(&self, id: &str) -> bool {
        let mut activities = self.activities.lock().unwrap();
        let prev_len = activities.len();
        activities.retain(|a| a.id != id);
        activities.len() < prev_len
    }

    pub fn update_project(&self, payload: UpdateSuggestedProjectPayload) -> Result<DetectedActivity, String> {
        let mut activities = self.activities.lock().unwrap();
        let act = activities.iter_mut().find(|a| a.id == payload.activity_id).ok_or_else(|| format!("Activity '{}' not found", payload.activity_id))?;
        act.suggested_project = payload.suggested_project;
        act.project_color = payload.project_color;
        Ok(act.clone())
    }
}
