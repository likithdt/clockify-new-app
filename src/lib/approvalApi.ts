import { invoke } from '@tauri-apps/api/core';
import { approvalService } from '@backend/services/approvalService';
import type {
  TimesheetApprovalDTO,
  ExpenseApprovalDTO,
  ApprovalSummaryDTO,
} from '@backend/models/approvalTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const approvalApi = {
  listTimesheets: async (): Promise<TimesheetApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TimesheetApprovalDTO[]>('list_approval_timesheets');
      } catch (e) {
        console.warn('Tauri invoke list_approval_timesheets failed, using fallback:', e);
      }
    }
    return approvalService.listTimesheets();
  },

  listExpenses: async (): Promise<ExpenseApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseApprovalDTO[]>('list_approval_expenses');
      } catch (e) {
        console.warn('Tauri invoke list_approval_expenses failed, using fallback:', e);
      }
    }
    return approvalService.listExpenses();
  },

  approveTimesheets: async (ids: string[]): Promise<TimesheetApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TimesheetApprovalDTO[]>('approve_approval_timesheets', { ids });
      } catch (e) {
        console.warn('Tauri invoke approve_approval_timesheets failed, using fallback:', e);
      }
    }
    return approvalService.approveTimesheets(ids);
  },

  rejectTimesheets: async (ids: string[]): Promise<TimesheetApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TimesheetApprovalDTO[]>('reject_approval_timesheets', { ids });
      } catch (e) {
        console.warn('Tauri invoke reject_approval_timesheets failed, using fallback:', e);
      }
    }
    return approvalService.rejectTimesheets(ids);
  },

  approveExpenses: async (ids: string[]): Promise<ExpenseApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseApprovalDTO[]>('approve_approval_expenses', { ids });
      } catch (e) {
        console.warn('Tauri invoke approve_approval_expenses failed, using fallback:', e);
      }
    }
    return approvalService.approveExpenses(ids);
  },

  rejectExpenses: async (ids: string[]): Promise<ExpenseApprovalDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ExpenseApprovalDTO[]>('reject_approval_expenses', { ids });
      } catch (e) {
        console.warn('Tauri invoke reject_approval_expenses failed, using fallback:', e);
      }
    }
    return approvalService.rejectExpenses(ids);
  },

  resetSampleData: async (): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('reset_sample_approvals');
        return;
      } catch (e) {
        console.warn('Tauri invoke reset_sample_approvals failed, using fallback:', e);
      }
    }
    approvalService.resetSample();
  },

  getSummary: async (): Promise<ApprovalSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<ApprovalSummaryDTO>('get_approval_summary');
      } catch (e) {
        console.warn('Tauri invoke get_approval_summary failed, using fallback:', e);
      }
    }
    return approvalService.getSummary();
  },
};
