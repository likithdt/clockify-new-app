use std::sync::Mutex;
use crate::expenses::models::{ExpenseCategory, ExpenseItem, ExpenseSettings};

pub struct ExpenseStore {
    pub expenses: Vec<ExpenseItem>,
    pub categories: Vec<ExpenseCategory>,
    pub settings: ExpenseSettings,
}

pub struct ExpenseState(pub Mutex<ExpenseStore>);

impl ExpenseState {
    pub fn new_with_sample_data() -> Self {
        let expenses = vec![
            ExpenseItem {
                id: "exp-sample-1".to_string(),
                team_member: "Bindhu shree".to_string(),
                member_id: Some("m4".to_string()),
                date: "2026-09-04".to_string(),
                project_id: "proj_4".to_string(),
                project_name: "Clockify Desktop App".to_string(),
                project_color: "#03a9f4".to_string(),
                category: "Travel".to_string(),
                amount: 145.50,
                currency: "INR".to_string(),
                note: "Flight tickets for client onsite workshop".to_string(),
                billable: true,
                receipt_name: Some("flight_ticket.pdf".to_string()),
                status: "pending".to_string(),
                created_at: "2026-09-04T10:30:00Z".to_string(),
                updated_at: None,
            },
            ExpenseItem {
                id: "exp-sample-2".to_string(),
                team_member: "Lara Peterson".to_string(),
                member_id: Some("m1".to_string()),
                date: "2026-09-03".to_string(),
                project_id: "proj_5".to_string(),
                project_name: "Design System & UI".to_string(),
                project_color: "#10b981".to_string(),
                category: "Day rate".to_string(),
                amount: 100.00,
                currency: "INR".to_string(),
                note: "Consulting rate for DevOps setup".to_string(),
                billable: false,
                receipt_name: None,
                status: "approved".to_string(),
                created_at: "2026-09-03T09:15:00Z".to_string(),
                updated_at: None,
            },
            ExpenseItem {
                id: "exp-sample-3".to_string(),
                team_member: "Bindhu shree".to_string(),
                member_id: Some("m4".to_string()),
                date: "2026-09-02".to_string(),
                project_id: "proj_4".to_string(),
                project_name: "Clockify Desktop App".to_string(),
                project_color: "#03a9f4".to_string(),
                category: "Meals".to_string(),
                amount: 42.80,
                currency: "INR".to_string(),
                note: "Lunch meeting with stakeholders".to_string(),
                billable: true,
                receipt_name: Some("receipt_lunch.png".to_string()),
                status: "pending".to_string(),
                created_at: "2026-09-02T13:45:00Z".to_string(),
                updated_at: None,
            },
            ExpenseItem {
                id: "exp-sample-4".to_string(),
                team_member: "Amy Smith".to_string(),
                member_id: Some("m2".to_string()),
                date: "2026-09-01".to_string(),
                project_id: "proj_1".to_string(),
                project_name: "[SAMPLE] Project Alpha".to_string(),
                project_color: "#f59e0b".to_string(),
                category: "Software".to_string(),
                amount: 29.99,
                currency: "INR".to_string(),
                note: "Monthly cloud hosting subscription".to_string(),
                billable: true,
                receipt_name: Some("cloud_invoice.pdf".to_string()),
                status: "approved".to_string(),
                created_at: "2026-09-01T08:00:00Z".to_string(),
                updated_at: None,
            },
        ];

        let categories = vec![
            ExpenseCategory { id: "cat-1".to_string(), name: "Day rate".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-2".to_string(), name: "Travel".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-3".to_string(), name: "Meals".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-4".to_string(), name: "Office supplies".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-5".to_string(), name: "Equipment".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-6".to_string(), name: "Software".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-7".to_string(), name: "Fuel".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-8".to_string(), name: "Accommodation".to_string(), unit_price: None, is_active: true },
            ExpenseCategory { id: "cat-9".to_string(), name: "Other".to_string(), unit_price: None, is_active: true },
        ];

        let settings = ExpenseSettings {
            default_currency: "INR".to_string(),
            default_billable: true,
            categories: vec![
                "Day rate".to_string(),
                "Travel".to_string(),
                "Meals".to_string(),
                "Office supplies".to_string(),
                "Equipment".to_string(),
                "Software".to_string(),
                "Fuel".to_string(),
                "Accommodation".to_string(),
                "Other".to_string(),
            ],
        };

        ExpenseState(Mutex::new(ExpenseStore {
            expenses,
            categories,
            settings,
        }))
    }
}
