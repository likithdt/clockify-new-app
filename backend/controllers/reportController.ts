import { reportService } from '../services/reportService';
import type {
  ReportFilter,
  ExportReportPayload,
} from '../models/reportTypes';

export class ReportController {
  static getSummaryReport(filter?: ReportFilter) {
    try {
      const summary = reportService.getSummaryReport(filter);
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getDetailedReport(filter?: ReportFilter) {
    try {
      const detailed = reportService.getDetailedReport(filter);
      return { success: true, data: detailed };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getWeeklyReport(weekStart?: string, filter?: ReportFilter) {
    try {
      const weekly = reportService.getWeeklyReport(weekStart, filter);
      return { success: true, data: weekly };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static exportReport(payload: ExportReportPayload) {
    try {
      const exported = reportService.exportReport(payload);
      return { success: true, data: exported };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
