import seedData from '../data/seedData.json';
import type {
  ExpenseItem,
  ExpenseCategory,
  ExpenseSettings,
  ExpenseFilter,
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseSummaryDTO,
} from '../models/expenseTypes';

class ExpenseService {
  private expenses: ExpenseItem[] = [];
  private categories: ExpenseCategory[] = [];
  private settings!: ExpenseSettings;

  constructor() {
    this.loadSeedData();
  }

  private loadSeedData() {
    const raw = seedData as any;
    this.expenses = JSON.parse(JSON.stringify(raw.expenses || []));
    this.categories = JSON.parse(JSON.stringify(raw.expense_categories || []));
    this.settings = JSON.parse(
      JSON.stringify(
        raw.expense_settings || {
          default_currency: 'INR',
          default_billable: true,
          categories: [
            'Day rate',
            'Travel',
            'Meals',
            'Office supplies',
            'Equipment',
            'Software',
            'Fuel',
            'Accommodation',
            'Other',
          ],
        }
      )
    );
  }

  // ─── Expense CRUD ─────────────────────────────────────────────────────────

  public listExpenses(filter?: ExpenseFilter): ExpenseItem[] {
    return this.expenses.filter((e) => {
      if (filter?.team_member && filter.team_member !== 'all') {
        if (e.team_member.toLowerCase() !== filter.team_member.toLowerCase()) return false;
      }
      if (filter?.project_id && e.project_id !== filter.project_id) return false;
      if (filter?.category && e.category.toLowerCase() !== filter.category.toLowerCase()) return false;
      if (filter?.billable !== undefined && e.billable !== filter.billable) return false;
      if (filter?.status && e.status !== filter.status) return false;
      if (filter?.start_date && e.date < filter.start_date) return false;
      if (filter?.end_date && e.date > filter.end_date) return false;
      return true;
    });
  }

  public getExpense(id: string): ExpenseItem | null {
    const found = this.expenses.find((e) => e.id === id);
    return found ? { ...found } : null;
  }

  public createExpense(payload: CreateExpensePayload): ExpenseItem {
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      team_member: payload.team_member,
      member_id: payload.member_id,
      date: payload.date || 'Today',
      project_id: payload.project_id,
      project_name: payload.project_name || 'General Project',
      project_color: payload.project_color || '#03a9f4',
      category: payload.category,
      amount: payload.amount,
      currency: payload.currency || this.settings.default_currency || 'INR',
      note: payload.note || '',
      billable: payload.billable !== undefined ? payload.billable : this.settings.default_billable,
      receipt_name: payload.receipt_name,
      status: payload.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.expenses.unshift(newExpense);
    return { ...newExpense };
  }

  public updateExpense(id: string, payload: UpdateExpensePayload): ExpenseItem {
    const idx = this.expenses.findIndex((e) => e.id === id);
    if (idx === -1) {
      throw new Error(`Expense with ID '${id}' not found`);
    }

    const current = this.expenses[idx];
    const updated: ExpenseItem = {
      ...current,
      team_member: payload.team_member !== undefined ? payload.team_member : current.team_member,
      member_id: payload.member_id !== undefined ? payload.member_id : current.member_id,
      date: payload.date !== undefined ? payload.date : current.date,
      project_id: payload.project_id !== undefined ? payload.project_id : current.project_id,
      project_name: payload.project_name !== undefined ? payload.project_name : current.project_name,
      project_color: payload.project_color !== undefined ? payload.project_color : current.project_color,
      category: payload.category !== undefined ? payload.category : current.category,
      amount: payload.amount !== undefined ? payload.amount : current.amount,
      currency: payload.currency !== undefined ? payload.currency : current.currency,
      note: payload.note !== undefined ? payload.note : current.note,
      billable: payload.billable !== undefined ? payload.billable : current.billable,
      receipt_name: payload.receipt_name !== undefined ? payload.receipt_name : current.receipt_name,
      status: payload.status !== undefined ? payload.status : current.status,
      updated_at: new Date().toISOString(),
    };

    this.expenses[idx] = updated;
    return { ...updated };
  }

  public deleteExpense(id: string): void {
    const idx = this.expenses.findIndex((e) => e.id === id);
    if (idx === -1) {
      throw new Error(`Expense with ID '${id}' not found`);
    }
    this.expenses.splice(idx, 1);
  }

  public approveExpense(id: string): ExpenseItem {
    return this.updateExpense(id, { status: 'approved' });
  }

  public rejectExpense(id: string): ExpenseItem {
    return this.updateExpense(id, { status: 'rejected' });
  }

  public clearAllExpenses(): void {
    this.expenses = [];
  }

  // ─── Analytics & Summary ──────────────────────────────────────────────────

  public getExpenseSummary(filter?: ExpenseFilter): ExpenseSummaryDTO {
    const filtered = this.listExpenses(filter);
    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    const billable = filtered.filter((e) => e.billable).reduce((acc, curr) => acc + curr.amount, 0);
    const nonBillable = total - billable;
    const pending = filtered.filter((e) => e.status === 'pending').length;
    const approved = filtered.filter((e) => e.status === 'approved').length;

    return {
      total_amount: Math.round(total * 100) / 100,
      billable_amount: Math.round(billable * 100) / 100,
      non_billable_amount: Math.round(nonBillable * 100) / 100,
      currency: this.settings.default_currency || 'INR',
      count: filtered.length,
      pending_count: pending,
      approved_count: approved,
    };
  }

  // ─── Category Management ──────────────────────────────────────────────────

  public listCategories(): string[] {
    return [...this.settings.categories];
  }

  public listCategoryObjects(): ExpenseCategory[] {
    return [...this.categories];
  }

  public createCategory(name: string): ExpenseCategory {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Category name cannot be empty');

    const existing = this.categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return { ...existing };

    const newCat: ExpenseCategory = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      is_active: true,
    };

    this.categories.push(newCat);
    if (!this.settings.categories.includes(trimmed)) {
      this.settings.categories.push(trimmed);
    }

    return { ...newCat };
  }

  public deleteCategory(nameOrId: string): void {
    const idx = this.categories.findIndex(
      (c) => c.id === nameOrId || c.name.toLowerCase() === nameOrId.toLowerCase()
    );
    if (idx !== -1) {
      const removed = this.categories.splice(idx, 1)[0];
      this.settings.categories = this.settings.categories.filter(
        (c) => c.toLowerCase() !== removed.name.toLowerCase()
      );
    } else {
      this.settings.categories = this.settings.categories.filter(
        (c) => c.toLowerCase() !== nameOrId.toLowerCase()
      );
    }
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  public getSettings(): ExpenseSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<ExpenseSettings>): ExpenseSettings {
    this.settings = { ...this.settings, ...partial };
    return { ...this.settings };
  }

  public resetSampleData(): void {
    this.loadSeedData();
  }
}

export const expenseService = new ExpenseService();
