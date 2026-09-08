import { approvalService } from '../services/approvalService';

export class ApprovalController {
  static listTimesheets() {
    try {
      const timesheets = approvalService.listTimesheets();
      return { success: true, data: timesheets };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static listExpenses() {
    try {
      const expenses = approvalService.listExpenses();
      return { success: true, data: expenses };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static approveTimesheets(ids: string[]) {
    try {
      const updated = approvalService.approveTimesheets(ids);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static rejectTimesheets(ids: string[]) {
    try {
      const updated = approvalService.rejectTimesheets(ids);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static approveExpenses(ids: string[]) {
    try {
      const updated = approvalService.approveExpenses(ids);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static rejectExpenses(ids: string[]) {
    try {
      const updated = approvalService.rejectExpenses(ids);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static resetSample() {
    try {
      approvalService.resetSample();
      return { success: true, message: 'Sample approvals reset successfully' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = approvalService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
