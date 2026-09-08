import { expenseService } from '../services/expenseService';
import type {
  ExpenseFilter,
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseSettings,
} from '../models/expenseTypes';

export class ExpenseController {
  static listExpenses(filter?: ExpenseFilter) {
    try {
      const data = expenseService.listExpenses(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getExpense(id: string) {
    try {
      const expense = expenseService.getExpense(id);
      if (!expense) {
        return { success: false, error: `Expense '${id}' not found` };
      }
      return { success: true, data: expense };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createExpense(payload: CreateExpensePayload) {
    try {
      const data = expenseService.createExpense(payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateExpense(id: string, payload: UpdateExpensePayload) {
    try {
      const data = expenseService.updateExpense(id, payload);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteExpense(id: string) {
    try {
      expenseService.deleteExpense(id);
      return { success: true, message: `Expense '${id}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static approveExpense(id: string) {
    try {
      const data = expenseService.approveExpense(id);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static rejectExpense(id: string) {
    try {
      const data = expenseService.rejectExpense(id);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static clearAllExpenses() {
    try {
      expenseService.clearAllExpenses();
      return { success: true, message: 'All expenses cleared' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getExpenseSummary(filter?: ExpenseFilter) {
    try {
      const data = expenseService.getExpenseSummary(filter);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static listCategories() {
    try {
      const data = expenseService.listCategories();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static createCategory(name: string) {
    try {
      const data = expenseService.createCategory(name);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteCategory(nameOrId: string) {
    try {
      expenseService.deleteCategory(nameOrId);
      return { success: true, message: `Category '${nameOrId}' deleted successfully` };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static getSettings() {
    try {
      const data = expenseService.getSettings();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateSettings(settings: Partial<ExpenseSettings>) {
    try {
      const data = expenseService.updateSettings(settings);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }
}
