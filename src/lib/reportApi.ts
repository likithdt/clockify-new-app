import { invoke } from '@tauri-apps/api/core';
import { reportService } from '../../backend/services/reportService';
import type {
  ReportFilter,
  SummaryReportDTO,
  DetailedReportDTO,
  WeeklyReportDTO,
  ExportReportPayload,
  ExportReportResultDTO,
} from '../../backend/models/reportTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const reportApi = {
  getSummaryReport: async (filter?: ReportFilter): Promise<SummaryReportDTO> => {
    if (isTauri) {
      try {
        const res = await invoke<any>('get_summary_report', { filter });
        return {
          total_duration_seconds: res.total_duration_seconds,
          total_duration_formatted: res.total_duration_formatted,
          total_billable_seconds: res.total_billable_seconds,
          total_amount: res.total_amount,
          currency: res.currency,
          by_project: res.by_project || [],
          by_client: [],
          by_user: [],
        };
      } catch (e) {
        console.warn('Tauri invoke get_summary_report failed, using fallback:', e);
      }
    }
    return reportService.getSummaryReport(filter);
  },

  getDetailedReport: async (filter?: ReportFilter): Promise<DetailedReportDTO> => {
    if (isTauri) {
      try {
        return await invoke<DetailedReportDTO>('get_detailed_report', { filter });
      } catch (e) {
        console.warn('Tauri invoke get_detailed_report failed, using fallback:', e);
      }
    }
    return reportService.getDetailedReport(filter);
  },

  getWeeklyReport: async (weekStart?: string, filter?: ReportFilter): Promise<WeeklyReportDTO> => {
    return reportService.getWeeklyReport(weekStart, filter);
  },

  exportReport: async (payload: ExportReportPayload): Promise<ExportReportResultDTO> => {
    if (isTauri) {
      try {
        return await invoke<ExportReportResultDTO>('export_report', {
          reportType: payload.report_type,
          format: payload.format,
        });
      } catch (e) {
        console.warn('Tauri invoke export_report failed, using fallback:', e);
      }
    }
    return reportService.exportReport(payload);
  },
};
