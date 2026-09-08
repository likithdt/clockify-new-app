import type { ApiResponse } from "../types.ts";
import {
  sampleReportEntries,
  type ReportItem,
  type ExportSettings,
  exportToCsv,
  exportToExcel,
  exportToPdf,
} from "../../utils/reportExport.ts";

export interface ReportSummaryData {
  totalSeconds: number;
  billableSeconds: number;
  totalAmount: string;
  entries: ReportItem[];
}

export const ReportsController = {
  async getSummaryReport(): Promise<ApiResponse<ReportSummaryData>> {
    return {
      status: 200,
      data: {
        totalSeconds: 180000,
        billableSeconds: 151200,
        totalAmount: "493,00 USD",
        entries: sampleReportEntries,
      },
    };
  },

  async getDetailedReport(): Promise<ApiResponse<ReportItem[]>> {
    return {
      status: 200,
      data: [...sampleReportEntries],
    };
  },

  async getWeeklyReport(): Promise<ApiResponse<ReportItem[]>> {
    return {
      status: 200,
      data: [...sampleReportEntries],
    };
  },

  async exportReport(type: "PDF" | "CSV" | "Excel", settings: ExportSettings): Promise<ApiResponse<{ success: boolean; format: string }>> {
    if (type === "CSV") {
      exportToCsv(settings);
    } else if (type === "Excel") {
      exportToExcel(settings);
    } else {
      exportToPdf(settings);
    }
    return {
      status: 200,
      data: { success: true, format: type },
    };
  },
};
