use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceLineItem {
    pub id: String,
    pub description: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub amount: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceItem {
    pub id: String,
    pub invoice_number: String,
    pub client: String,
    pub client_id: Option<String>,
    pub issue_date: String,
    pub due_on: String,
    pub due_subtitle: Option<String>,
    pub amount: f64,
    pub balance: f64,
    pub currency: String,
    pub status: String,
    pub items: Option<Vec<InvoiceLineItem>>,
    pub notes: Option<String>,
    pub is_sample: bool,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceClient {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub address: Option<String>,
    pub currency: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceSettings {
    pub company_name: String,
    pub company_address: String,
    pub default_currency: String,
    pub default_due_days: i64,
    pub next_invoice_number: i64,
    pub tax_rate_percent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct InvoiceFilter {
    pub client: Option<String>,
    pub status: Option<String>,
    pub search_query: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateInvoicePayload {
    pub invoice_number: String,
    pub client: String,
    pub client_id: Option<String>,
    pub issue_date: String,
    pub due_date: String,
    pub amount: Option<f64>,
    pub balance: Option<f64>,
    pub currency: Option<String>,
    pub items: Option<Vec<InvoiceLineItem>>,
    pub notes: Option<String>,
    pub status: Option<String>,
    pub is_sample: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateInvoicePayload {
    pub invoice_number: Option<String>,
    pub client: Option<String>,
    pub client_id: Option<String>,
    pub issue_date: Option<String>,
    pub due_date: Option<String>,
    pub due_subtitle: Option<String>,
    pub amount: Option<f64>,
    pub balance: Option<f64>,
    pub currency: Option<String>,
    pub status: Option<String>,
    pub items: Option<Vec<InvoiceLineItem>>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceSummary {
    pub total_amount: f64,
    pub total_balance: f64,
    pub total_paid: f64,
    pub total_overdue: f64,
    pub currency: String,
    pub count: i64,
    pub draft_count: i64,
    pub sent_count: i64,
    pub paid_count: i64,
    pub overdue_count: i64,
}
