use tauri::State;
use crate::invoices::{
    models::{
        CreateInvoicePayload, InvoiceClient, InvoiceFilter, InvoiceItem, InvoiceSettings,
        InvoiceSummary, UpdateInvoicePayload,
    },
    store::InvoiceState,
};

fn now_iso() -> String {
    "2026-09-04T12:00:00Z".to_string()
}

fn new_uuid(prefix: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    use std::time::{SystemTime, UNIX_EPOCH};
    let mut h = DefaultHasher::new();
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos()
        .hash(&mut h);
    std::thread::current().id().hash(&mut h);
    format!("{}_{:012x}", prefix, h.finish())
}

#[tauri::command]
pub fn list_invoices(
    state: State<'_, InvoiceState>,
    filter: Option<InvoiceFilter>,
) -> Vec<InvoiceItem> {
    let store = state.0.lock().unwrap();
    let mut results = store.invoices.clone();

    if let Some(f) = filter {
        if let Some(ref client) = f.client {
            if !client.is_empty() && client != "All" {
                let c_lower = client.to_lowercase();
                results.retain(|i| i.client.to_lowercase() == c_lower);
            }
        }
        if let Some(ref st) = f.status {
            if !st.is_empty() && st != "All" {
                results.retain(|i| &i.status == st);
            }
        }
        if let Some(ref q) = f.search_query {
            if !q.trim().is_empty() {
                let q_lower = q.trim().to_lowercase();
                results.retain(|i| {
                    i.invoice_number.to_lowercase().contains(&q_lower)
                        || i.client.to_lowercase().contains(&q_lower)
                });
            }
        }
        if let Some(ref start) = f.start_date {
            results.retain(|i| i.issue_date >= *start);
        }
        if let Some(ref end) = f.end_date {
            results.retain(|i| i.issue_date <= *end);
        }
    }

    results
}

#[tauri::command]
pub fn get_invoice(
    state: State<'_, InvoiceState>,
    id: String,
) -> Result<InvoiceItem, String> {
    let store = state.0.lock().unwrap();
    store
        .invoices
        .iter()
        .find(|i| i.id == id)
        .cloned()
        .ok_or_else(|| format!("Invoice with id '{}' not found", id))
}

#[tauri::command]
pub fn create_invoice(
    state: State<'_, InvoiceState>,
    payload: CreateInvoicePayload,
) -> InvoiceItem {
    let mut store = state.0.lock().unwrap();
    let id = new_uuid("inv");
    let amount = payload.amount.unwrap_or(750.0);
    let balance = payload.balance.unwrap_or(amount);

    let item = InvoiceItem {
        id,
        invoice_number: payload.invoice_number,
        client: payload.client,
        client_id: payload.client_id,
        issue_date: payload.issue_date,
        due_on: payload.due_date,
        due_subtitle: None,
        amount,
        balance,
        currency: payload.currency.unwrap_or_else(|| store.settings.default_currency.clone()),
        status: payload.status.unwrap_or_else(|| "Draft".to_string()),
        items: payload.items,
        notes: payload.notes,
        is_sample: payload.is_sample.unwrap_or(false),
        created_at: now_iso(),
        updated_at: None,
    };

    store.invoices.insert(0, item.clone());
    store.settings.next_invoice_number += 1;
    item
}

#[tauri::command]
pub fn update_invoice(
    state: State<'_, InvoiceState>,
    id: String,
    payload: UpdateInvoicePayload,
) -> Result<InvoiceItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .invoices
        .iter()
        .position(|i| i.id == id)
        .ok_or_else(|| format!("Invoice with id '{}' not found", id))?;

    let existing = &store.invoices[idx];
    let updated = InvoiceItem {
        id: existing.id.clone(),
        invoice_number: payload.invoice_number.unwrap_or_else(|| existing.invoice_number.clone()),
        client: payload.client.unwrap_or_else(|| existing.client.clone()),
        client_id: payload.client_id.or_else(|| existing.client_id.clone()),
        issue_date: payload.issue_date.unwrap_or_else(|| existing.issue_date.clone()),
        due_on: payload.due_date.unwrap_or_else(|| existing.due_on.clone()),
        due_subtitle: payload.due_subtitle.or_else(|| existing.due_subtitle.clone()),
        amount: payload.amount.unwrap_or(existing.amount),
        balance: payload.balance.unwrap_or(existing.balance),
        currency: payload.currency.unwrap_or_else(|| existing.currency.clone()),
        status: payload.status.unwrap_or_else(|| existing.status.clone()),
        items: payload.items.or_else(|| existing.items.clone()),
        notes: payload.notes.or_else(|| existing.notes.clone()),
        is_sample: existing.is_sample,
        created_at: existing.created_at.clone(),
        updated_at: Some(now_iso()),
    };

    store.invoices[idx] = updated.clone();
    Ok(updated)
}

#[tauri::command]
pub fn delete_invoice(
    state: State<'_, InvoiceState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.invoices.len();
    store.invoices.retain(|i| i.id != id);
    if store.invoices.len() == initial_len {
        return Err(format!("Invoice with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn mark_invoice_status(
    state: State<'_, InvoiceState>,
    id: String,
    status: String,
) -> Result<InvoiceItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .invoices
        .iter()
        .position(|i| i.id == id)
        .ok_or_else(|| format!("Invoice with id '{}' not found", id))?;

    store.invoices[idx].status = status;
    store.invoices[idx].updated_at = Some(now_iso());
    Ok(store.invoices[idx].clone())
}

#[tauri::command]
pub fn record_invoice_payment(
    state: State<'_, InvoiceState>,
    id: String,
    amount_paid: f64,
) -> Result<InvoiceItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .invoices
        .iter()
        .position(|i| i.id == id)
        .ok_or_else(|| format!("Invoice with id '{}' not found", id))?;

    let inv = &mut store.invoices[idx];
    inv.balance = (inv.balance - amount_paid).max(0.0);
    if inv.balance == 0.0 {
        inv.status = "Paid".to_string();
    }
    inv.updated_at = Some(now_iso());
    Ok(inv.clone())
}

#[tauri::command]
pub fn remove_sample_invoices(state: State<'_, InvoiceState>) {
    let mut store = state.0.lock().unwrap();
    store.invoices.retain(|i| !i.is_sample);
}

#[tauri::command]
pub fn restore_sample_invoices(state: State<'_, InvoiceState>) -> Vec<InvoiceItem> {
    let mut store = state.0.lock().unwrap();
    let sample1 = InvoiceItem {
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
    };
    let sample2 = InvoiceItem {
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
    };

    store.invoices.retain(|i| !i.is_sample);
    store.invoices.push(sample1);
    store.invoices.push(sample2);
    store.invoices.clone()
}

#[tauri::command]
pub fn get_invoice_summary(
    state: State<'_, InvoiceState>,
    filter: Option<InvoiceFilter>,
) -> InvoiceSummary {
    let list = list_invoices(state.clone(), filter);
    let store = state.0.lock().unwrap();

    let total_amount: f64 = list.iter().map(|i| i.amount).sum();
    let total_balance: f64 = list.iter().map(|i| i.balance).sum();
    let total_paid = total_amount - total_balance;
    let total_overdue: f64 = list.iter().filter(|i| i.status == "Overdue").map(|i| i.balance).sum();

    let draft_count = list.iter().filter(|i| i.status == "Draft").count() as i64;
    let sent_count = list.iter().filter(|i| i.status == "Sent").count() as i64;
    let paid_count = list.iter().filter(|i| i.status == "Paid").count() as i64;
    let overdue_count = list.iter().filter(|i| i.status == "Overdue").count() as i64;

    InvoiceSummary {
        total_amount: (total_amount * 100.0).round() / 100.0,
        total_balance: (total_balance * 100.0).round() / 100.0,
        total_paid: (total_paid * 100.0).round() / 100.0,
        total_overdue: (total_overdue * 100.0).round() / 100.0,
        currency: store.settings.default_currency.clone(),
        count: list.len() as i64,
        draft_count,
        sent_count,
        paid_count,
        overdue_count,
    }
}

#[tauri::command]
pub fn list_invoice_clients(state: State<'_, InvoiceState>) -> Vec<InvoiceClient> {
    let store = state.0.lock().unwrap();
    store.clients.clone()
}

#[tauri::command]
pub fn create_invoice_client(
    state: State<'_, InvoiceState>,
    name: String,
    email: Option<String>,
    address: Option<String>,
    currency: Option<String>,
) -> InvoiceClient {
    let mut store = state.0.lock().unwrap();
    let trimmed = name.trim().to_string();

    if let Some(existing) = store.clients.iter().find(|c| c.name.eq_ignore_ascii_case(&trimmed)) {
        return existing.clone();
    }

    let client = InvoiceClient {
        id: new_uuid("client"),
        name: trimmed,
        email,
        address,
        currency: currency.or_else(|| Some(store.settings.default_currency.clone())),
    };

    store.clients.push(client.clone());
    client
}

#[tauri::command]
pub fn delete_invoice_client(
    state: State<'_, InvoiceState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.clients.len();
    store.clients.retain(|c| c.id != id);
    if store.clients.len() == initial_len {
        return Err(format!("Client with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn get_invoice_settings(state: State<'_, InvoiceState>) -> InvoiceSettings {
    let store = state.0.lock().unwrap();
    store.settings.clone()
}

#[tauri::command]
pub fn update_invoice_settings(
    state: State<'_, InvoiceState>,
    settings: InvoiceSettings,
) -> InvoiceSettings {
    let mut store = state.0.lock().unwrap();
    store.settings = settings.clone();
    settings
}
