use super::models::{
    AttendanceRecord, CreateKioskPayload, KioskDevice, KioskSummary, PinVerificationResult,
    PunchClockPayload, UpdateKioskPayload,
};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

fn current_iso() -> String {
    let secs = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let hours = (secs / 3600) % 24;
    let minutes = (secs / 60) % 60;
    let seconds = secs % 60;
    format!("2026-09-05T{:02}:{:02}:{:02}.000Z", hours, minutes, seconds)
}

fn next_id(prefix: &str) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    format!("{}-{}", prefix, millis)
}

#[derive(Clone)]
pub struct KioskStore {
    devices: Arc<Mutex<Vec<KioskDevice>>>,
    records: Arc<Mutex<Vec<AttendanceRecord>>>,
}

impl Default for KioskStore {
    fn default() -> Self {
        Self::new()
    }
}

impl KioskStore {
    pub fn new() -> Self {
        let initial_devices = vec![
            KioskDevice {
                id: "kiosk-sample-1".to_string(),
                name: "Headquarters Reception Terminal".to_string(),
                assignees: vec!["All Members".to_string()],
                default_project: "Internal Work".to_string(),
                default_break_project: "Lunch & Break".to_string(),
                logout_after_hours: 24,
                auth_required: true,
                location: "Main Lobby, Floor 1".to_string(),
                device_ip: "192.168.1.101".to_string(),
                today_check_ins: 14,
                status: "ONLINE".to_string(),
                pin_code: Some("1234".to_string()),
                created_at: "2026-01-15T08:00:00.000Z".to_string(),
            },
            KioskDevice {
                id: "kiosk-sample-2".to_string(),
                name: "Engineering Lab Kiosk".to_string(),
                assignees: vec![
                    "Amy Smith".to_string(),
                    "James Anderson".to_string(),
                    "Bindhu shree".to_string(),
                    "Mike Johnson".to_string(),
                ],
                default_project: "Project Alpha".to_string(),
                default_break_project: "Technical Break".to_string(),
                logout_after_hours: 12,
                auth_required: true,
                location: "R&D Wing, Room 302".to_string(),
                device_ip: "192.168.1.145".to_string(),
                today_check_ins: 8,
                status: "ONLINE".to_string(),
                pin_code: Some("5678".to_string()),
                created_at: "2026-02-01T09:30:00.000Z".to_string(),
            },
        ];

        let initial_records = vec![
            AttendanceRecord {
                id: "att-1".to_string(),
                kiosk_id: "kiosk-sample-1".to_string(),
                kiosk_name: "Headquarters Reception Terminal".to_string(),
                user_id: None,
                user_name: "Bindhu shree".to_string(),
                action: "CLOCK_IN".to_string(),
                timestamp: "2026-09-04T09:02:14.000Z".to_string(),
                note: Some("Normal shift arrival".to_string()),
            },
            AttendanceRecord {
                id: "att-2".to_string(),
                kiosk_id: "kiosk-sample-1".to_string(),
                kiosk_name: "Headquarters Reception Terminal".to_string(),
                user_id: None,
                user_name: "Amy Smith".to_string(),
                action: "CLOCK_IN".to_string(),
                timestamp: "2026-09-04T09:15:00.000Z".to_string(),
                note: None,
            },
        ];

        Self {
            devices: Arc::new(Mutex::new(initial_devices)),
            records: Arc::new(Mutex::new(initial_records)),
        }
    }

    pub fn list_kiosks(&self) -> Vec<KioskDevice> {
        self.devices.lock().unwrap().clone()
    }

    pub fn get_kiosk(&self, id: &str) -> Option<KioskDevice> {
        self.devices.lock().unwrap().iter().find(|k| k.id == id).cloned()
    }

    pub fn create_kiosk(&self, payload: CreateKioskPayload) -> KioskDevice {
        let mut devices = self.devices.lock().unwrap();
        let id = next_id("kiosk");
        let new_device = KioskDevice {
            id,
            name: payload.name.trim().to_string(),
            assignees: payload.assignees.unwrap_or_else(|| vec!["All Members".to_string()]),
            default_project: payload.default_project.unwrap_or_else(|| "Internal Work".to_string()),
            default_break_project: payload.default_break_project.unwrap_or_else(|| "Break".to_string()),
            logout_after_hours: payload.logout_after_hours.unwrap_or(24),
            auth_required: payload.auth_required.unwrap_or(true),
            location: payload.location.unwrap_or_else(|| "Office Entrance".to_string()),
            device_ip: "192.168.1.120".to_string(),
            today_check_ins: 0,
            status: "ONLINE".to_string(),
            pin_code: payload.pin_code.or_else(|| Some("1234".to_string())),
            created_at: current_iso(),
        };

        devices.insert(0, new_device.clone());
        new_device
    }

    pub fn update_kiosk(&self, id: &str, payload: UpdateKioskPayload) -> Result<KioskDevice, String> {
        let mut devices = self.devices.lock().unwrap();
        let dev = devices.iter_mut().find(|k| k.id == id).ok_or_else(|| format!("Kiosk '{}' not found", id))?;

        if let Some(n) = payload.name {
            dev.name = n.trim().to_string();
        }
        if let Some(ass) = payload.assignees {
            dev.assignees = ass;
        }
        if let Some(dp) = payload.default_project {
            dev.default_project = dp;
        }
        if let Some(dbp) = payload.default_break_project {
            dev.default_break_project = dbp;
        }
        if let Some(lh) = payload.logout_after_hours {
            dev.logout_after_hours = lh;
        }
        if let Some(auth) = payload.auth_required {
            dev.auth_required = auth;
        }
        if let Some(loc) = payload.location {
            dev.location = loc;
        }
        if let Some(stat) = payload.status {
            dev.status = stat;
        }
        if let Some(pin) = payload.pin_code {
            dev.pin_code = Some(pin);
        }

        Ok(dev.clone())
    }

    pub fn delete_kiosk(&self, id: &str) -> bool {
        let mut devices = self.devices.lock().unwrap();
        let prev_len = devices.len();
        devices.retain(|k| k.id != id);
        devices.len() < prev_len
    }

    pub fn verify_pin(&self, kiosk_id: &str, pin: &str) -> Result<PinVerificationResult, String> {
        let devices = self.devices.lock().unwrap();
        let kiosk = devices.iter().find(|k| k.id == kiosk_id).ok_or_else(|| format!("Kiosk '{}' not found", kiosk_id))?;

        if let Some(ref kp) = kiosk.pin_code {
            if kp == pin {
                return Ok(PinVerificationResult {
                    valid: true,
                    user_name: Some("Authorized Member".to_string()),
                });
            }
        }

        let matched_user = match pin {
            "1234" => Some("Bindhu shree".to_string()),
            "5678" => Some("Amy Smith".to_string()),
            "9999" => Some("James Anderson".to_string()),
            "0000" => Some("Lara Peterson".to_string()),
            _ => None,
        };

        if let Some(user) = matched_user {
            Ok(PinVerificationResult {
                valid: true,
                user_name: Some(user),
            })
        } else {
            Ok(PinVerificationResult {
                valid: false,
                user_name: None,
            })
        }
    }

    pub fn record_attendance(&self, payload: PunchClockPayload) -> AttendanceRecord {
        let mut records = self.records.lock().unwrap();
        let mut devices = self.devices.lock().unwrap();

        let kiosk_name = devices
            .iter()
            .find(|k| k.id == payload.kiosk_id)
            .map(|k| k.name.clone())
            .unwrap_or_else(|| "Kiosk Terminal".to_string());

        let record = AttendanceRecord {
            id: next_id("att"),
            kiosk_id: payload.kiosk_id.clone(),
            kiosk_name,
            user_id: payload.user_id,
            user_name: payload.user_name,
            action: payload.action,
            timestamp: current_iso(),
            note: payload.note,
        };

        records.insert(0, record.clone());

        if let Some(k) = devices.iter_mut().find(|k| k.id == payload.kiosk_id) {
            k.today_check_ins += 1;
        }

        record
    }

    pub fn list_attendance_records(&self, kiosk_id: Option<String>) -> Vec<AttendanceRecord> {
        let records = self.records.lock().unwrap();
        if let Some(kid) = kiosk_id {
            records.iter().filter(|r| r.kiosk_id == kid).cloned().collect()
        } else {
            records.clone()
        }
    }

    pub fn get_summary(&self) -> KioskSummary {
        let devices = self.devices.lock().unwrap();
        let records = self.records.lock().unwrap();

        let total_kiosks = devices.len();
        let online_kiosks = devices.iter().filter(|k| k.status == "ONLINE").count();
        let today_check_ins = devices.iter().map(|k| k.today_check_ins).sum();

        KioskSummary {
            total_kiosks,
            online_kiosks,
            today_check_ins,
            total_attendance_records: records.len(),
        }
    }
}
