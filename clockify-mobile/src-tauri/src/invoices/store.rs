use std::sync::Mutex;
use crate::invoices::models::{InvoiceClient, InvoiceItem, InvoiceSettings};

pub struct InvoiceStore {
    pub invoices: Vec<InvoiceItem>,
    pub clients: Vec<InvoiceClient>,
    pub settings: InvoiceSettings,
}

pub struct InvoiceState(pub Mutex<InvoiceStore>);

impl InvoiceState {
    pub fn new_with_sample_data() -> Self {
        let invoices = vec![
            InvoiceItem {
                id: "inv-sample-1".to_string(),
                invoice_number: "[SAMPLE] Invoice 1".to_string(),
                client: "[SAMPLE] Client B".to_string(),
                client_id: Some("client-b".to_string()),
                issue_date: "31/08/2026".to_string(),
                due_on: "10/09/2026".to_string(),
                due_subtitle: None,
                amount: 730.70,
                balance: 730.70,
                currency: "INR".to_string(),
                status: "Sent".to_string(),
                items: None,
                notes: Some("Consulting and development services for Project Alpha".to_string()),
                is_sample: true,
                created_at: "2026-08-31T10:00:00Z".to_string(),
                updated_at: None,
            },
            InvoiceItem {
                id: "inv-sample-2".to_string(),
                invoice_number: "[SAMPLE] Invoice 2".to_string(),
                client: "[SAMPLE] Client A".to_string(),
                client_id: Some("client-a".to_string()),
                issue_date: "17/08/2026".to_string(),
                due_on: "27/08/2026".to_string(),
                due_subtitle: Some("4 days ago".to_string()),
                amount: 814.08,
                balance: 814.08,
                currency: "INR".to_string(),
                status: "Overdue".to_string(),
                items: None,
                notes: Some("Phase 1 UX Review and backend migration".to_string()),
                is_sample: true,
                created_at: "2026-08-17T09:00:00Z".to_string(),
                updated_at: None,
            },
        ];

        let clients = vec![
            InvoiceClient {
                id: "client-a".to_string(),
                name: "[SAMPLE] Client A".to_string(),
                email: Some("contact@clienta.com".to_string()),
                address: Some("Bengaluru, India".to_string()),
                currency: Some("INR".to_string()),
            },
            InvoiceClient {
                id: "client-b".to_string(),
                name: "[SAMPLE] Client B".to_string(),
                email: Some("billing@clientb.com".to_string()),
                address: Some("Whitefield, Bengaluru".to_string()),
                currency: Some("INR".to_string()),
            },
            InvoiceClient {
                id: "client-acme".to_string(),
                name: "Acme Corp".to_string(),
                email: Some("finance@acme.com".to_string()),
                address: Some("Electronic City, Bengaluru".to_string()),
                currency: Some("INR".to_string()),
            },
            InvoiceClient {
                id: "client-global".to_string(),
                name: "Global Tech Labs".to_string(),
                email: Some("invoices@globaltech.com".to_string()),
                address: Some("Indiranagar, Bengaluru".to_string()),
                currency: Some("INR".to_string()),
            },
        ];

        let settings = InvoiceSettings {
            company_name: "Gopalan College of Engineering and Management".to_string(),
            company_address: "Hoodi, Whitefield, Bengaluru, Karnataka 560048".to_string(),
            default_currency: "INR".to_string(),
            default_due_days: 10,
            next_invoice_number: 3,
            tax_rate_percent: 18.0,
        };

        InvoiceState(Mutex::new(InvoiceStore {
            invoices,
            clients,
            settings,
        }))
    }
}
