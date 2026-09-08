use super::models::{AddTeamMemberPayload, TeamFilter, TeamMember, TeamSummary, UpdateTeamMemberPayload};
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
pub struct TeamStore {
    members: Arc<Mutex<Vec<TeamMember>>>,
}

impl Default for TeamStore {
    fn default() -> Self {
        Self::new()
    }
}

impl TeamStore {
    pub fn new() -> Self {
        let initial = vec![
            TeamMember {
                id: "tm-1".to_string(),
                name: "[SAMPLE] Amy Smith".to_string(),
                email: "amy.smith1b1753f297a01cbb@clockify.me".to_string(),
                billable_rate: None,
                cost_rate: Some(15.0),
                currency: "INR".to_string(),
                role: "Project manager".to_string(),
                group: None,
                status: "Active".to_string(),
                is_current_user: None,
            },
            TeamMember {
                id: "tm-2".to_string(),
                name: "[SAMPLE] James Anderson".to_string(),
                email: "james.anderson36d56b7f7df036@clockify.me".to_string(),
                billable_rate: None,
                cost_rate: Some(5.0),
                currency: "INR".to_string(),
                role: "Member".to_string(),
                group: None,
                status: "Active".to_string(),
                is_current_user: None,
            },
            TeamMember {
                id: "tm-3".to_string(),
                name: "[SAMPLE] Lara Peterson".to_string(),
                email: "lara.peterson03af321182e80532@clockify.me".to_string(),
                billable_rate: None,
                cost_rate: Some(10.0),
                currency: "INR".to_string(),
                role: "Team manager".to_string(),
                group: None,
                status: "Active".to_string(),
                is_current_user: None,
            },
            TeamMember {
                id: "tm-4".to_string(),
                name: "[SAMPLE] Mike Johnson".to_string(),
                email: "mike.johnson22b7a3ff4c176cbc@clockify.me".to_string(),
                billable_rate: None,
                cost_rate: Some(10.0),
                currency: "INR".to_string(),
                role: "Member".to_string(),
                group: None,
                status: "Active".to_string(),
                is_current_user: None,
            },
            TeamMember {
                id: "tm-5".to_string(),
                name: "Bindhu shree (you)".to_string(),
                email: "sbindhu230@gmail.com".to_string(),
                billable_rate: None,
                cost_rate: None,
                currency: "INR".to_string(),
                role: "Owner".to_string(),
                group: None,
                status: "Active".to_string(),
                is_current_user: Some(true),
            },
        ];

        Self {
            members: Arc::new(Mutex::new(initial)),
        }
    }

    pub fn list(&self, filter: Option<TeamFilter>) -> Vec<TeamMember> {
        let members = self.members.lock().unwrap();
        let mut result = members.clone();

        if let Some(f) = filter {
            if let Some(q) = f.query {
                let q_lower = q.to_lowercase();
                result.retain(|m| {
                    m.name.to_lowercase().contains(&q_lower) || m.email.to_lowercase().contains(&q_lower)
                });
            }

            if let Some(status) = f.status {
                if status != "All" {
                    result.retain(|m| m.status == status);
                }
            }

            if let Some(grp) = f.group {
                result.retain(|m| m.group.as_deref() == Some(&grp));
            }

            if let Some(roles) = f.roles {
                if !roles.is_empty() {
                    result.retain(|m| roles.contains(&m.role));
                }
            }

            if let Some(smaller) = f.smaller_rate {
                result.retain(|m| m.billable_rate.map(|r| r < smaller).unwrap_or(false));
            }

            if let Some(larger) = f.larger_rate {
                result.retain(|m| m.billable_rate.map(|r| r > larger).unwrap_or(false));
            }
        }

        result
    }

    pub fn get(&self, id: &str) -> Option<TeamMember> {
        let members = self.members.lock().unwrap();
        members.iter().find(|m| m.id == id).cloned()
    }

    pub fn add_members(&self, payload: AddTeamMemberPayload) -> Vec<TeamMember> {
        let mut members = self.members.lock().unwrap();
        let mut created = Vec::new();

        for email in payload.emails {
            let trimmed = email.trim();
            if trimmed.is_empty() {
                continue;
            }
            let name_part = trimmed.split('@').next().unwrap_or(trimmed);
            let capitalized = if let Some(first) = name_part.chars().next() {
                format!("{}{}", first.to_uppercase(), &name_part[first.len_utf8()..])
            } else {
                name_part.to_string()
            };

            let id = generate_id("tm");
            let new_member = TeamMember {
                id,
                name: capitalized,
                email: trimmed.to_string(),
                billable_rate: payload.billable_rate,
                cost_rate: payload.cost_rate,
                currency: payload.currency.clone().unwrap_or_else(|| "INR".to_string()),
                role: payload.role.clone().unwrap_or_else(|| "Member".to_string()),
                group: payload.group.clone(),
                status: "Active".to_string(),
                is_current_user: None,
            };
            members.push(new_member.clone());
            created.push(new_member);
        }

        created
    }

    pub fn update(&self, id: &str, payload: UpdateTeamMemberPayload) -> Result<TeamMember, String> {
        let mut members = self.members.lock().unwrap();
        let member = members.iter_mut().find(|m| m.id == id).ok_or_else(|| format!("Team member '{}' not found", id))?;

        if let Some(name) = payload.name {
            member.name = name.trim().to_string();
        }
        if let Some(email) = payload.email {
            member.email = email.trim().to_string();
        }
        if let Some(b_rate) = payload.billable_rate {
            member.billable_rate = b_rate;
        }
        if let Some(c_rate) = payload.cost_rate {
            member.cost_rate = c_rate;
        }
        if let Some(curr) = payload.currency {
            member.currency = curr;
        }
        if let Some(role) = payload.role {
            member.role = role;
        }
        if let Some(grp) = payload.group {
            member.group = grp;
        }
        if let Some(status) = payload.status {
            member.status = status;
        }

        Ok(member.clone())
    }

    pub fn delete(&self, id: &str) -> bool {
        let mut members = self.members.lock().unwrap();
        let prev_len = members.len();
        members.retain(|m| m.id != id);
        members.len() < prev_len
    }

    pub fn reset_sample(&self) {
        let mut members = self.members.lock().unwrap();
        *members = Self::new().list(None);
    }

    pub fn get_summary(&self) -> TeamSummary {
        let members = self.members.lock().unwrap();
        let total_members = members.len();
        let active_members = members.iter().filter(|m| m.status == "Active").count();
        let inactive_members = members.iter().filter(|m| m.status == "Inactive").count();
        let invited_members = members.iter().filter(|m| m.status == "Invited").count();

        TeamSummary {
            total_members,
            active_members,
            inactive_members,
            invited_members,
        }
    }
}
