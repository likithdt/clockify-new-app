import type {
  TimesheetApprovalDTO,
  ExpenseApprovalDTO,
  ApprovalSummaryDTO,
} from '../models/approvalTypes';

const INITIAL_TIMESHEETS: TimesheetApprovalDTO[] = [
  {
    id: "ts-1",
    period: "Aug 31, 2026 - Sep 6, 2026",
    period_sort_date: "2026-08-31",
    user: "[SAMPLE] Amy Smith",
    team_manager: "-",
    time: "16:00:00",
    time_off: "00:00:00",
    status: "pending",
    submitted_at: "2026-09-01",
  },
  {
    id: "ts-2",
    period: "Jul 13, 2026 - Jul 19, 2026",
    period_sort_date: "2026-07-13",
    user: "[SAMPLE] James Anderson",
    team_manager: "[SAMPLE] Lara Peterson",
    time: "09:00:00",
    time_off: "00:00:00",
    status: "pending",
    submitted_at: "2026-07-20",
  },
  {
    id: "ts-3",
    period: "Jul 6, 2026 - Jul 12, 2026",
    period_sort_date: "2026-07-06",
    user: "[SAMPLE] Lara Peterson",
    team_manager: "-",
    time: "40:00:00",
    time_off: "08:00:00",
    status: "pending",
    submitted_at: "2026-07-13",
  },
  {
    id: "ts-unsub-1",
    period: "Aug 31, 2026 - Sep 6, 2026",
    period_sort_date: "2026-08-31",
    user: "[SAMPLE] David Lee",
    team_manager: "[SAMPLE] Lara Peterson",
    time: "12:30:00",
    time_off: "00:00:00",
    status: "unsubmitted",
  },
  {
    id: "ts-arch-1",
    period: "Jun 22, 2026 - Jun 28, 2026",
    period_sort_date: "2026-06-22",
    user: "[SAMPLE] Amy Smith",
    team_manager: "-",
    time: "38:15:00",
    time_off: "00:00:00",
    status: "approved",
    approved_at: "2026-06-29",
  },
];

const INITIAL_EXPENSES: ExpenseApprovalDTO[] = [
  {
    id: "exp-app-1",
    period: "Jul 6, 2026 - Jul 12, 2026",
    period_sort_date: "2026-07-06",
    user: "[SAMPLE] Lara Peterson",
    team_manager: "-",
    category: "Day rate",
    amount: 100.0,
    currency: "INR",
    status: "pending",
    submitted_at: "2026-07-13",
  },
  {
    id: "exp-unsub-1",
    period: "Aug 31, 2026 - Sep 6, 2026",
    period_sort_date: "2026-08-31",
    user: "[SAMPLE] James Anderson",
    team_manager: "[SAMPLE] Lara Peterson",
    category: "Travel",
    amount: 240.5,
    currency: "INR",
    status: "unsubmitted",
  },
  {
    id: "exp-arch-1",
    period: "Jun 15, 2026 - Jun 21, 2026",
    period_sort_date: "2026-06-15",
    user: "[SAMPLE] Lara Peterson",
    team_manager: "-",
    category: "Software",
    amount: 49.0,
    currency: "INR",
    status: "approved",
    approved_at: "2026-06-22",
  },
];

class ApprovalService {
  private timesheets: TimesheetApprovalDTO[] = JSON.parse(JSON.stringify(INITIAL_TIMESHEETS));
  private expenses: ExpenseApprovalDTO[] = JSON.parse(JSON.stringify(INITIAL_EXPENSES));

  listTimesheets(): TimesheetApprovalDTO[] {
    return [...this.timesheets];
  }

  listExpenses(): ExpenseApprovalDTO[] {
    return [...this.expenses];
  }

  approveTimesheets(ids: string[]): TimesheetApprovalDTO[] {
    const today = "2026-09-05";
    this.timesheets = this.timesheets.map((t) =>
      ids.includes(t.id) ? { ...t, status: "approved", approved_at: today } : t
    );
    return this.listTimesheets();
  }

  rejectTimesheets(ids: string[]): TimesheetApprovalDTO[] {
    this.timesheets = this.timesheets.map((t) =>
      ids.includes(t.id) ? { ...t, status: "rejected" } : t
    );
    return this.listTimesheets();
  }

  approveExpenses(ids: string[]): ExpenseApprovalDTO[] {
    const today = "2026-09-05";
    this.expenses = this.expenses.map((e) =>
      ids.includes(e.id) ? { ...e, status: "approved", approved_at: today } : e
    );
    return this.listExpenses();
  }

  rejectExpenses(ids: string[]): ExpenseApprovalDTO[] {
    this.expenses = this.expenses.map((e) =>
      ids.includes(e.id) ? { ...e, status: "rejected" } : e
    );
    return this.listExpenses();
  }

  resetSample(): void {
    this.timesheets = JSON.parse(JSON.stringify(INITIAL_TIMESHEETS));
    this.expenses = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
  }

  getSummary(): ApprovalSummaryDTO {
    const pending_timesheets = this.timesheets.filter((t) => t.status === "pending").length;
    const pending_expenses = this.expenses.filter((e) => e.status === "pending").length;
    const unsubmitted_count =
      this.timesheets.filter((t) => t.status === "unsubmitted").length +
      this.expenses.filter((e) => e.status === "unsubmitted").length;
    const approved_count =
      this.timesheets.filter((t) => t.status === "approved").length +
      this.expenses.filter((e) => e.status === "approved").length;

    return {
      pending_timesheets,
      pending_expenses,
      total_pending: pending_timesheets + pending_expenses,
      unsubmitted_count,
      approved_count,
    };
  }
}

export const approvalService = new ApprovalService();
