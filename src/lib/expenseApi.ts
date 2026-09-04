import { invoke } from '@tauri-apps/api/core';
import { expenseService } from '@backend/services/expenseService';
import type {
  ExpenseItem,
  ExpenseFilter,
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseSummaryDTO,
  ExpenseCategory,
  ExpenseSettings,
} from '@backend/models/expenseTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const expenseApi = {
  listExpenses: async (filter?: ExpenseFilter): Promise<ExpenseItem[]> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem[]>('list_expenses', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_expenses failed, using fallback:', e);
      }
    }
    return expenseService.listExpenses(filter);
  },

  getExpense: async (id: string): Promise<ExpenseItem> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem>('get_expense', { id });
      } catch (e) {
        console.warn('Tauri invoke get_expense failed, using fallback:', e);
      }
    }
    const item = expenseService.getExpense(id);
    if (!item) throw new Error(`Expense '${id}' not found`);
    return item;
  },

  createExpense: async (payload: CreateExpensePayload): Promise<ExpenseItem> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem>('create_expense', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_expense failed, using fallback:', e);
      }
    }
    return expenseService.createExpense(payload);
  },

  updateExpense: async (id: string, payload: UpdateExpensePayload): Promise<ExpenseItem> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem>('update_expense', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_expense failed, using fallback:', e);
      }
    }
    return expenseService.updateExpense(id, payload);
  },

  deleteExpense: async (id: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_expense', { id });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_expense failed, using fallback:', e);
      }
    }
    expenseService.deleteExpense(id);
  },

  approveExpense: async (id: string): Promise<ExpenseItem> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem>('approve_expense', { id });
      } catch (e) {
        console.warn('Tauri invoke approve_expense failed, using fallback:', e);
      }
    }
    return expenseService.approveExpense(id);
  },

  rejectExpense: async (id: string): Promise<ExpenseItem> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseItem>('reject_expense', { id });
      } catch (e) {
        console.warn('Tauri invoke reject_expense failed, using fallback:', e);
      }
    }
    return expenseService.rejectExpense(id);
  },

  clearAllExpenses: async (): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('clear_all_expenses');
        return;
      } catch (e) {
        console.warn('Tauri invoke clear_all_expenses failed, using fallback:', e);
      }
    }
    expenseService.clearAllExpenses();
  },

  getExpenseSummary: async (filter?: ExpenseFilter): Promise<ExpenseSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseSummaryDTO>('get_expense_summary', { filter });
      } catch (e) {
        console.warn('Tauri invoke get_expense_summary failed, using fallback:', e);
      }
    }
    return expenseService.getExpenseSummary(filter);
  },

  listCategories: async (): Promise<string[]> => {
    if (isTauri) {
      try {
        return await invoke<string[]>('list_expense_categories');
      } catch (e) {
        console.warn('Tauri invoke list_expense_categories failed, using fallback:', e);
      }
    }
    return expenseService.listCategories();
  },

  createCategory: async (name: string): Promise<ExpenseCategory> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseCategory>('create_expense_category', { name });
      } catch (e) {
        console.warn('Tauri invoke create_expense_category failed, using fallback:', e);
      }
    }
    return expenseService.createCategory(name);
  },

  deleteCategory: async (name: string): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('delete_expense_category', { name });
        return;
      } catch (e) {
        console.warn('Tauri invoke delete_expense_category failed, using fallback:', e);
      }
    }
    expenseService.deleteCategory(name);
  },

  getSettings: async (): Promise<ExpenseSettings> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseSettings>('get_expense_settings');
      } catch (e) {
        console.warn('Tauri invoke get_expense_settings failed, using fallback:', e);
      }
    }
    return expenseService.getSettings();
  },

  updateSettings: async (settings: ExpenseSettings): Promise<ExpenseSettings> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseSettings>('update_expense_settings', { settings });
      } catch (e) {
        console.warn('Tauri invoke update_expense_settings failed, using fallback:', e);
      }
    }
    return expenseService.updateSettings(settings);
  },
};
