use tauri::State;
use crate::expenses::{
    models::{
        CreateExpensePayload, ExpenseCategory, ExpenseFilter, ExpenseItem, ExpenseSettings,
        ExpenseSummary, UpdateExpensePayload,
    },
    store::ExpenseState,
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
pub fn list_expenses(
    state: State<'_, ExpenseState>,
    filter: Option<ExpenseFilter>,
) -> Vec<ExpenseItem> {
    let store = state.0.lock().unwrap();
    let mut results = store.expenses.clone();

    if let Some(f) = filter {
        if let Some(ref member) = f.team_member {
            if !member.is_empty() && member != "all" {
                let m_lower = member.to_lowercase();
                results.retain(|e| e.team_member.to_lowercase() == m_lower);
            }
        }
        if let Some(ref pid) = f.project_id {
            if !pid.is_empty() {
                results.retain(|e| &e.project_id == pid);
            }
        }
        if let Some(ref cat) = f.category {
            if !cat.is_empty() {
                let c_lower = cat.to_lowercase();
                results.retain(|e| e.category.to_lowercase() == c_lower);
            }
        }
        if let Some(billable) = f.billable {
            results.retain(|e| e.billable == billable);
        }
        if let Some(ref st) = f.status {
            if !st.is_empty() {
                results.retain(|e| &e.status == st);
            }
        }
        if let Some(ref start) = f.start_date {
            results.retain(|e| e.date >= *start);
        }
        if let Some(ref end) = f.end_date {
            results.retain(|e| e.date <= *end);
        }
    }

    results
}

#[tauri::command]
pub fn get_expense(
    state: State<'_, ExpenseState>,
    id: String,
) -> Result<ExpenseItem, String> {
    let store = state.0.lock().unwrap();
    store
        .expenses
        .iter()
        .find(|e| e.id == id)
        .cloned()
        .ok_or_else(|| format!("Expense with id '{}' not found", id))
}

#[tauri::command]
pub fn create_expense(
    state: State<'_, ExpenseState>,
    payload: CreateExpensePayload,
) -> ExpenseItem {
    let mut store = state.0.lock().unwrap();
    let id = new_uuid("exp");

    let item = ExpenseItem {
        id,
        team_member: payload.team_member,
        member_id: payload.member_id,
        date: if payload.date.trim().is_empty() { "Today".to_string() } else { payload.date },
        project_id: payload.project_id,
        project_name: payload.project_name.unwrap_or_else(|| "General Project".to_string()),
        project_color: payload.project_color.unwrap_or_else(|| "#03a9f4".to_string()),
        category: payload.category,
        amount: payload.amount,
        currency: payload.currency.unwrap_or_else(|| store.settings.default_currency.clone()),
        note: payload.note.unwrap_or_default(),
        billable: payload.billable.unwrap_or(store.settings.default_billable),
        receipt_name: payload.receipt_name,
        status: payload.status.unwrap_or_else(|| "pending".to_string()),
        created_at: now_iso(),
        updated_at: None,
    };

    store.expenses.insert(0, item.clone());
    item
}

#[tauri::command]
pub fn update_expense(
    state: State<'_, ExpenseState>,
    id: String,
    payload: UpdateExpensePayload,
) -> Result<ExpenseItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .expenses
        .iter()
        .position(|e| e.id == id)
        .ok_or_else(|| format!("Expense with id '{}' not found", id))?;

    let existing = &store.expenses[idx];
    let updated = ExpenseItem {
        id: existing.id.clone(),
        team_member: payload.team_member.unwrap_or_else(|| existing.team_member.clone()),
        member_id: payload.member_id.or_else(|| existing.member_id.clone()),
        date: payload.date.unwrap_or_else(|| existing.date.clone()),
        project_id: payload.project_id.unwrap_or_else(|| existing.project_id.clone()),
        project_name: payload.project_name.unwrap_or_else(|| existing.project_name.clone()),
        project_color: payload.project_color.unwrap_or_else(|| existing.project_color.clone()),
        category: payload.category.unwrap_or_else(|| existing.category.clone()),
        amount: payload.amount.unwrap_or(existing.amount),
        currency: payload.currency.unwrap_or_else(|| existing.currency.clone()),
        note: payload.note.unwrap_or_else(|| existing.note.clone()),
        billable: payload.billable.unwrap_or(existing.billable),
        receipt_name: payload.receipt_name.or_else(|| existing.receipt_name.clone()),
        status: payload.status.unwrap_or_else(|| existing.status.clone()),
        created_at: existing.created_at.clone(),
        updated_at: Some(now_iso()),
    };

    store.expenses[idx] = updated.clone();
    Ok(updated)
}

#[tauri::command]
pub fn delete_expense(
    state: State<'_, ExpenseState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let initial_len = store.expenses.len();
    store.expenses.retain(|e| e.id != id);
    if store.expenses.len() == initial_len {
        return Err(format!("Expense with id '{}' not found", id));
    }
    Ok(())
}

#[tauri::command]
pub fn approve_expense(
    state: State<'_, ExpenseState>,
    id: String,
) -> Result<ExpenseItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .expenses
        .iter()
        .position(|e| e.id == id)
        .ok_or_else(|| format!("Expense with id '{}' not found", id))?;

    store.expenses[idx].status = "approved".to_string();
    store.expenses[idx].updated_at = Some(now_iso());
    Ok(store.expenses[idx].clone())
}

#[tauri::command]
pub fn reject_expense(
    state: State<'_, ExpenseState>,
    id: String,
) -> Result<ExpenseItem, String> {
    let mut store = state.0.lock().unwrap();
    let idx = store
        .expenses
        .iter()
        .position(|e| e.id == id)
        .ok_or_else(|| format!("Expense with id '{}' not found", id))?;

    store.expenses[idx].status = "rejected".to_string();
    store.expenses[idx].updated_at = Some(now_iso());
    Ok(store.expenses[idx].clone())
}

#[tauri::command]
pub fn clear_all_expenses(state: State<'_, ExpenseState>) {
    let mut store = state.0.lock().unwrap();
    store.expenses.clear();
}

#[tauri::command]
pub fn get_expense_summary(
    state: State<'_, ExpenseState>,
    filter: Option<ExpenseFilter>,
) -> ExpenseSummary {
    let list = list_expenses(state.clone(), filter);
    let store = state.0.lock().unwrap();

    let total: f64 = list.iter().map(|e| e.amount).sum();
    let billable: f64 = list.iter().filter(|e| e.billable).map(|e| e.amount).sum();
    let non_billable = total - billable;
    let pending = list.iter().filter(|e| e.status == "pending").count() as i64;
    let approved = list.iter().filter(|e| e.status == "approved").count() as i64;

    ExpenseSummary {
        total_amount: (total * 100.0).round() / 100.0,
        billable_amount: (billable * 100.0).round() / 100.0,
        non_billable_amount: (non_billable * 100.0).round() / 100.0,
        currency: store.settings.default_currency.clone(),
        count: list.len() as i64,
        pending_count: pending,
        approved_count: approved,
    }
}

#[tauri::command]
pub fn list_expense_categories(state: State<'_, ExpenseState>) -> Vec<String> {
    let store = state.0.lock().unwrap();
    store.settings.categories.clone()
}

#[tauri::command]
pub fn create_expense_category(
    state: State<'_, ExpenseState>,
    name: String,
) -> ExpenseCategory {
    let mut store = state.0.lock().unwrap();
    let trimmed = name.trim().to_string();

    if let Some(existing) = store.categories.iter().find(|c| c.name.eq_ignore_ascii_case(&trimmed)) {
        return existing.clone();
    }

    let cat = ExpenseCategory {
        id: new_uuid("cat"),
        name: trimmed.clone(),
        unit_price: None,
        is_active: true,
    };

    store.categories.push(cat.clone());
    if !store.settings.categories.contains(&trimmed) {
        store.settings.categories.push(trimmed);
    }

    cat
}

#[tauri::command]
pub fn delete_expense_category(
    state: State<'_, ExpenseState>,
    name: String,
) -> Result<(), String> {
    let mut store = state.0.lock().unwrap();
    let lower = name.to_lowercase();
    store.categories.retain(|c| c.name.to_lowercase() != lower && c.id != name);
    store.settings.categories.retain(|c| c.to_lowercase() != lower);
    Ok(())
}

#[tauri::command]
pub fn get_expense_settings(state: State<'_, ExpenseState>) -> ExpenseSettings {
    let store = state.0.lock().unwrap();
    store.settings.clone()
}

#[tauri::command]
pub fn update_expense_settings(
    state: State<'_, ExpenseState>,
    settings: ExpenseSettings,
) -> ExpenseSettings {
    let mut store = state.0.lock().unwrap();
    store.settings = settings.clone();
    settings
}
