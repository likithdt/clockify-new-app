import type {
  ReportFilter,
  SummaryReportDTO,
  SummaryReportItemDTO,
  DetailedReportDTO,
  DetailedReportItemDTO,
  WeeklyReportDTO,
  WeeklyReportRowDTO,
  ExportReportPayload,
  ExportReportResultDTO,
} from '../models/reportTypes';
import { timeEntryService } from './timeEntryService';
import { rateService } from './rateService';

function formatSeconds(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

class ReportService {
  getSummaryReport(filter?: ReportFilter): SummaryReportDTO {
    const entries = timeEntryService.listEntries();
    let filtered = entries;

    if (filter?.start_date && filter?.end_date) {
      filtered = filtered.filter(
        (e) => e.start_time.slice(0, 10) >= filter.start_date! && e.start_time.slice(0, 10) <= filter.end_date!
      );
    }
    if (filter?.project_ids && filter.project_ids.length > 0) {
      filtered = filtered.filter((e) => e.project_id && filter.project_ids!.includes(e.project_id));
    }
    if (filter?.is_billable !== undefined) {
      filtered = filtered.filter((e) => e.is_billable === filter.is_billable);
    }

    const total_duration_seconds = filtered.reduce((sum, e) => sum + e.duration_seconds, 0);
    const total_billable_seconds = filtered
      .filter((e) => e.is_billable)
      .reduce((sum, e) => sum + e.duration_seconds, 0);

    // Group by Project
    const projectMap = new Map<string, { seconds: number; billable: number; color: string; client?: string }>();
    for (const e of filtered) {
      const pName = e.project_name || "No Project";
      const existing = projectMap.get(pName) || {
        seconds: 0,
        billable: 0,
        color: e.project_color || "#94a3b8",
        client: e.client,
      };
      existing.seconds += e.duration_seconds;
      if (e.is_billable) existing.billable += e.duration_seconds;
      projectMap.set(pName, existing);
    }

    const defaultRate = rateService.getEffectiveRate(undefined, undefined, 'billable');

    const by_project: SummaryReportItemDTO[] = Array.from(projectMap.entries()).map(([name, data]) => {
      const pct = total_duration_seconds > 0 ? (data.seconds / total_duration_seconds) * 100 : 0;
      const amt = (data.billable / 3600) * defaultRate;
      return {
        id: name,
        name,
        color: data.color,
        client: data.client,
        duration_seconds: data.seconds,
        duration_formatted: formatSeconds(data.seconds),
        billable_seconds: data.billable,
        amount: Math.round(amt * 100) / 100,
        currency: "INR",
        percentage: Math.round(pct * 10) / 10,
      };
    });

    const total_amount = by_project.reduce((sum, p) => sum + p.amount, 0);

    // Group by Client
    const clientMap = new Map<string, { seconds: number; billable: number }>();
    for (const e of filtered) {
      const cName = e.client || "No Client";
      const existing = clientMap.get(cName) || { seconds: 0, billable: 0 };
      existing.seconds += e.duration_seconds;
      if (e.is_billable) existing.billable += e.duration_seconds;
      clientMap.set(cName, existing);
    }

    const by_client: SummaryReportItemDTO[] = Array.from(clientMap.entries()).map(([name, data]) => {
      const pct = total_duration_seconds > 0 ? (data.seconds / total_duration_seconds) * 100 : 0;
      const amt = (data.billable / 3600) * defaultRate;
      return {
        id: name,
        name,
        duration_seconds: data.seconds,
        duration_formatted: formatSeconds(data.seconds),
        billable_seconds: data.billable,
        amount: Math.round(amt * 100) / 100,
        currency: "INR",
        percentage: Math.round(pct * 10) / 10,
      };
    });

    // Group by User
    const userMap = new Map<string, { seconds: number; billable: number }>();
    for (const e of filtered) {
      const uName = e.user_name || "Bindhu shree";
      const existing = userMap.get(uName) || { seconds: 0, billable: 0 };
      existing.seconds += e.duration_seconds;
      if (e.is_billable) existing.billable += e.duration_seconds;
      userMap.set(uName, existing);
    }

    const by_user: SummaryReportItemDTO[] = Array.from(userMap.entries()).map(([name, data]) => {
      const pct = total_duration_seconds > 0 ? (data.seconds / total_duration_seconds) * 100 : 0;
      const amt = (data.billable / 3600) * defaultRate;
      return {
        id: name,
        name,
        duration_seconds: data.seconds,
        duration_formatted: formatSeconds(data.seconds),
        billable_seconds: data.billable,
        amount: Math.round(amt * 100) / 100,
        currency: "INR",
        percentage: Math.round(pct * 10) / 10,
      };
    });

    return {
      total_duration_seconds,
      total_duration_formatted: formatSeconds(total_duration_seconds),
      total_billable_seconds,
      total_amount: Math.round(total_amount * 100) / 100,
      currency: "INR",
      by_project,
      by_client,
      by_user,
    };
  }

  getDetailedReport(filter?: ReportFilter): DetailedReportDTO {
    const entries = timeEntryService.listEntries();
    let filtered = entries;

    if (filter?.start_date && filter?.end_date) {
      filtered = filtered.filter(
        (e) => e.start_time.slice(0, 10) >= filter.start_date! && e.start_time.slice(0, 10) <= filter.end_date!
      );
    }
    if (filter?.project_ids && filter.project_ids.length > 0) {
      filtered = filtered.filter((e) => e.project_id && filter.project_ids!.includes(e.project_id));
    }
    if (filter?.is_billable !== undefined) {
      filtered = filtered.filter((e) => e.is_billable === filter.is_billable);
    }

    const defaultRate = rateService.getEffectiveRate(undefined, undefined, 'billable');

    const items: DetailedReportItemDTO[] = filtered.map((e) => {
      const amount = e.is_billable ? (e.duration_seconds / 3600) * defaultRate : 0;
      return {
        id: e.id,
        description: e.description,
        project_name: e.project_name || "No Project",
        project_color: e.project_color || "#94a3b8",
        client_name: e.client,
        user_name: e.user_name || "Bindhu shree",
        start_time: e.start_time,
        end_time: e.end_time,
        duration_seconds: e.duration_seconds,
        duration_formatted: formatSeconds(e.duration_seconds),
        is_billable: e.is_billable,
        amount: Math.round(amount * 100) / 100,
        currency: "INR",
      };
    });

    const total_seconds = items.reduce((sum, i) => sum + i.duration_seconds, 0);
    const total_amount = items.reduce((sum, i) => sum + i.amount, 0);

    return {
      total_items: items.length,
      total_seconds,
      total_formatted: formatSeconds(total_seconds),
      total_amount: Math.round(total_amount * 100) / 100,
      currency: "INR",
      items,
    };
  }

  getWeeklyReport(weekStart: string = "2026-08-31", filter?: ReportFilter): WeeklyReportDTO {
    const days: string[] = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }

    const detailed = this.getDetailedReport(filter);

    const projectRows = new Map<string, WeeklyReportRowDTO>();
    for (const item of detailed.items) {
      const dateStr = item.start_time.slice(0, 10);
      const existing = projectRows.get(item.project_name) || {
        id: item.project_name,
        project_name: item.project_name,
        project_color: item.project_color,
        client: item.client_name,
        day_seconds: {},
        total_seconds: 0,
        total_formatted: "00:00:00",
        amount: 0,
        currency: "INR",
      };

      existing.day_seconds[dateStr] = (existing.day_seconds[dateStr] || 0) + item.duration_seconds;
      existing.total_seconds += item.duration_seconds;
      existing.total_formatted = formatSeconds(existing.total_seconds);
      existing.amount += item.amount;
      projectRows.set(item.project_name, existing);
    }

    const rows = Array.from(projectRows.values());
    const total_seconds = rows.reduce((sum, r) => sum + r.total_seconds, 0);
    const total_amount = rows.reduce((sum, r) => sum + r.amount, 0);

    return {
      week_start: weekStart,
      days,
      rows,
      total_seconds,
      total_formatted: formatSeconds(total_seconds),
      total_amount: Math.round(total_amount * 100) / 100,
      currency: "INR",
    };
  }

  exportReport(payload: ExportReportPayload): ExportReportResultDTO {
    if (payload.report_type === 'summary') {
      const rep = this.getSummaryReport(payload.filter);
      const header = "Project,Client,Duration,Billable Duration,Amount,Percentage\n";
      const rows = rep.by_project
        .map((p) => `"${p.name}","${p.client || ''}","${p.duration_formatted}","${p.duration_formatted}",${p.amount},${p.percentage}%`)
        .join("\n");
      const csv = header + rows;
      return {
        filename: `Clockify_Summary_Report_${Date.now()}.${payload.format === 'excel' ? 'csv' : payload.format}`,
        mime_type: payload.format === 'csv' ? 'text/csv' : 'application/octet-stream',
        content: csv,
        size_bytes: Buffer.byteLength(csv, 'utf8'),
      };
    } else {
      const rep = this.getDetailedReport(payload.filter);
      const header = "Description,Project,Client,User,Start,End,Duration,Billable,Amount\n";
      const rows = rep.items
        .map(
          (i) =>
            `"${i.description}","${i.project_name}","${i.client_name || ''}","${i.user_name}","${i.start_time}","${i.end_time || ''}","${i.duration_formatted}",${i.is_billable},${i.amount}`
        )
        .join("\n");
      const csv = header + rows;
      return {
        filename: `Clockify_Detailed_Report_${Date.now()}.${payload.format === 'excel' ? 'csv' : payload.format}`,
        mime_type: payload.format === 'csv' ? 'text/csv' : 'application/octet-stream',
        content: csv,
        size_bytes: Buffer.byteLength(csv, 'utf8'),
      };
    }
  }
}

export const reportService = new ReportService();
