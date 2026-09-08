/**
 * Clockify Reports Feature - Domain Models & DTOs
 */

export interface ReportFilter {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  project_ids?: string[];
  client_ids?: string[];
  user_ids?: string[];
  is_billable?: boolean;
  search_query?: string;
}

export interface SummaryReportItemDTO {
  id: string;
  name: string;
  color?: string;
  client?: string;
  duration_seconds: number;
  duration_formatted: string;
  billable_seconds: number;
  amount: number;
  currency: string;
  percentage: number;
}

export interface SummaryReportDTO {
  total_duration_seconds: number;
  total_duration_formatted: string;
  total_billable_seconds: number;
  total_amount: number;
  currency: string;
  by_project: SummaryReportItemDTO[];
  by_client: SummaryReportItemDTO[];
  by_user: SummaryReportItemDTO[];
}

export interface DetailedReportItemDTO {
  id: string;
  description: string;
  project_name: string;
  project_color: string;
  client_name?: string;
  user_name: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  duration_formatted: string;
  is_billable: boolean;
  amount: number;
  currency: string;
}

export interface DetailedReportDTO {
  total_items: number;
  total_seconds: number;
  total_formatted: string;
  total_amount: number;
  currency: string;
  items: DetailedReportItemDTO[];
}

export interface WeeklyReportRowDTO {
  id: string;
  project_name: string;
  project_color: string;
  client?: string;
  day_seconds: { [dateStr: string]: number };
  total_seconds: number;
  total_formatted: string;
  amount: number;
  currency: string;
}

export interface WeeklyReportDTO {
  week_start: string;
  days: string[];
  rows: WeeklyReportRowDTO[];
  total_seconds: number;
  total_formatted: string;
  total_amount: number;
  currency: string;
}

export interface ExportReportPayload {
  report_type: 'summary' | 'detailed' | 'weekly';
  format: 'csv' | 'pdf' | 'excel';
  filter?: ReportFilter;
}

export interface ExportReportResultDTO {
  filename: string;
  mime_type: string;
  content: string; // Plain text CSV or base64
  size_bytes: number;
}
