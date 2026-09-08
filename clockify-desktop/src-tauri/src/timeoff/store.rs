use std::sync::Mutex;
use crate::timeoff::models::{
    AccrualType, Holiday, LeaveBalance, LeavePolicy, PolicyUnit, RequestStatus, TeamMember,
    TimeOffRequest,
};

// ---------------------------------------------------------------------------
// In-memory store – wrapped in a Mutex for thread-safe Tauri state.
// ---------------------------------------------------------------------------

/// All Time Off state held in memory.
/// In a real deployment this would be persisted to SQLite via tauri-plugin-sql.
pub struct TimeOffStore {
    pub requests: Vec<TimeOffRequest>,
    pub policies: Vec<LeavePolicy>,
    pub balances: Vec<LeaveBalance>,
    pub holidays: Vec<Holiday>,
    pub members: Vec<TeamMember>,
}

/// Mutex-wrapped store used as Tauri managed state.
pub struct TimeOffState(pub Mutex<TimeOffStore>);

impl TimeOffState {
    /// Initialise with realistic sample data matching the screenshots.
    pub fn new_with_sample_data() -> Self {
        let members = vec![
            TeamMember {
                id: "m1".to_string(),
                name: "[SAMPLE] Lara Peterson".to_string(),
                avatar_url: None,
                email: "lara.peterson@example.com".to_string(),
            },
            TeamMember {
                id: "m2".to_string(),
                name: "[SAMPLE] Amy Smith".to_string(),
                avatar_url: None,
                email: "amy.smith@example.com".to_string(),
            },
            TeamMember {
                id: "m3".to_string(),
                name: "[SAMPLE] Mike Johnson".to_string(),
                avatar_url: None,
                email: "mike.johnson@example.com".to_string(),
            },
            TeamMember {
                id: "m4".to_string(),
                name: "Bindhu Shree KR".to_string(),
                avatar_url: None,
                email: "bindhu@gopalan.ac.in".to_string(),
            },
            TeamMember {
                id: "m5".to_string(),
                name: "Team Member 5".to_string(),
                avatar_url: None,
                email: "member5@gopalan.ac.in".to_string(),
            },
        ];

        let policies = vec![
            LeavePolicy {
                id: "p1".to_string(),
                name: "Sick leave".to_string(),
                unit: PolicyUnit::Days,
                accrual_per_year: Some(8.0),
                accrual_type: AccrualType::FixedPerYear,
                allow_carryover: false,
                max_balance: Some(8.0),
                is_active: true,
                assignee_ids: vec![
                    "m1".to_string(),
                    "m2".to_string(),
                    "m3".to_string(),
                    "m4".to_string(),
                    "m5".to_string(),
                ],
                created_at: "2026-01-01T00:00:00Z".to_string(),
            },
            LeavePolicy {
                id: "p2".to_string(),
                name: "Vacation".to_string(),
                unit: PolicyUnit::Days,
                accrual_per_year: Some(20.0),
                accrual_type: AccrualType::FixedPerYear,
                allow_carryover: true,
                max_balance: Some(30.0),
                is_active: true,
                assignee_ids: vec![
                    "m1".to_string(),
                    "m2".to_string(),
                    "m3".to_string(),
                    "m4".to_string(),
                    "m5".to_string(),
                ],
                created_at: "2026-01-01T00:00:00Z".to_string(),
            },
            LeavePolicy {
                id: "p3".to_string(),
                name: "[SAMPLE] Vacation".to_string(),
                unit: PolicyUnit::Days,
                accrual_per_year: None,
                accrual_type: AccrualType::Manual,
                allow_carryover: false,
                max_balance: None,
                is_active: true,
                assignee_ids: vec![
                    "m1".to_string(),
                    "m2".to_string(),
                    "m3".to_string(),
                    "m4".to_string(),
                ],
                created_at: "2026-01-01T00:00:00Z".to_string(),
            },
        ];

        // Sample requests matching the screenshot (Sep 3, 2026 as "today")
        let requests = vec![
            TimeOffRequest {
                id: "r1".to_string(),
                member_id: "m1".to_string(),
                policy_id: "p3".to_string(),
                start_date: "2026-09-15".to_string(),
                end_date: "2026-09-16".to_string(),
                duration: 2.0,
                status: RequestStatus::Rejected,
                note: None,
                requested_at: "2026-09-03T00:00:00Z".to_string(),
                rejection_reason: None,
            },
            TimeOffRequest {
                id: "r2".to_string(),
                member_id: "m2".to_string(),
                policy_id: "p3".to_string(),
                start_date: "2026-09-09".to_string(),
                end_date: "2026-09-09".to_string(),
                duration: 1.0,
                status: RequestStatus::Approved,
                note: None,
                requested_at: "2026-09-03T00:00:00Z".to_string(),
                rejection_reason: None,
            },
            TimeOffRequest {
                id: "r3".to_string(),
                member_id: "m3".to_string(),
                policy_id: "p3".to_string(),
                start_date: "2026-09-07".to_string(),
                end_date: "2026-09-09".to_string(),
                duration: 3.0,
                status: RequestStatus::Pending,
                note: None,
                requested_at: "2026-09-03T00:00:00Z".to_string(),
                rejection_reason: None,
            },
        ];

        // Seed balances for each (member, policy) pair
        let mut balances: Vec<LeaveBalance> = Vec::new();
        for mid in &["m1", "m2", "m3", "m4", "m5"] {
            // Sick leave balance
            balances.push(LeaveBalance {
                member_id: mid.to_string(),
                policy_id: "p1".to_string(),
                accrued: 8.0,
                used: 0.0,
                remaining: 8.0,
                carried_over: 0.0,
            });
            // Vacation balance
            balances.push(LeaveBalance {
                member_id: mid.to_string(),
                policy_id: "p2".to_string(),
                accrued: 20.0,
                used: 0.0,
                remaining: 20.0,
                carried_over: 0.0,
            });
            // [SAMPLE] Vacation balance (only for m1–m4)
            if *mid != "m5" {
                balances.push(LeaveBalance {
                    member_id: mid.to_string(),
                    policy_id: "p3".to_string(),
                    accrued: 0.0,
                    used: 0.0,
                    remaining: 0.0,
                    carried_over: 0.0,
                });
            }
        }

        // Reflect approved request r2 (Amy, 1d) in balances
        if let Some(b) = balances
            .iter_mut()
            .find(|b| b.member_id == "m2" && b.policy_id == "p3")
        {
            b.used = 1.0;
            b.remaining = -1.0; // manual policy, can go negative
        }

        TimeOffState(Mutex::new(TimeOffStore {
            requests,
            policies,
            balances,
            holidays: Vec::new(),
            members,
        }))
    }
}

// ---------------------------------------------------------------------------
// Helper functions used by commands
// ---------------------------------------------------------------------------

impl TimeOffStore {
    // ---- Requests ----------------------------------------------------------

    pub fn get_request_by_id(&self, id: &str) -> Option<&TimeOffRequest> {
        self.requests.iter().find(|r| r.id == id)
    }

    pub fn get_request_by_id_mut(&mut self, id: &str) -> Option<&mut TimeOffRequest> {
        self.requests.iter_mut().find(|r| r.id == id)
    }

    /// Adjust the used/remaining balance for the member when a request is
    /// approved or its previous approval is reversed.
    pub fn update_balance_for_request(
        &mut self,
        member_id: &str,
        policy_id: &str,
        delta: f64, // positive = use balance, negative = restore
    ) {
        if let Some(balance) = self
            .balances
            .iter_mut()
            .find(|b| b.member_id == member_id && b.policy_id == policy_id)
        {
            balance.used = (balance.used + delta).max(0.0);
            balance.remaining = balance.accrued + balance.carried_over - balance.used;
        } else {
            // Create a balance entry on the fly if it doesn't exist
            let used = delta.max(0.0);
            self.balances.push(LeaveBalance {
                member_id: member_id.to_string(),
                policy_id: policy_id.to_string(),
                accrued: 0.0,
                used,
                remaining: -used,
                carried_over: 0.0,
            });
        }
    }

    // ---- Policies ----------------------------------------------------------

    pub fn get_policy_by_id(&self, id: &str) -> Option<&LeavePolicy> {
        self.policies.iter().find(|p| p.id == id)
    }

    pub fn get_policy_by_id_mut(&mut self, id: &str) -> Option<&mut LeavePolicy> {
        self.policies.iter_mut().find(|p| p.id == id)
    }

    // ---- Holidays ----------------------------------------------------------

    pub fn get_holiday_by_id(&self, id: &str) -> Option<&Holiday> {
        self.holidays.iter().find(|h| h.id == id)
    }

    // ---- Members -----------------------------------------------------------

    pub fn get_member_by_id(&self, id: &str) -> Option<&TeamMember> {
        self.members.iter().find(|m| m.id == id)
    }
}
