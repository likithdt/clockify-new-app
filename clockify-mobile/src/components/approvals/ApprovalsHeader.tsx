import React from "react";
import { Menu, RotateCcw, Clock, Receipt } from "lucide-react";
import { useApprovalStore } from "@/stores/useApprovalStore";

interface ApprovalsHeaderProps {
  onOpenDrawer: () => void;
  workspaceName?: string;
}

export const ApprovalsHeader: React.FC<ApprovalsHeaderProps> = ({
  onOpenDrawer,
  workspaceName = "GOPALAN COLLEGE OF ENGINEERING...",
}) => {
  const { activeTab, setActiveTab, resetSampleData, timesheetItems, expenseItems } = useApprovalStore();

  const pendingTimesheetsCount = timesheetItems.filter((i) => i.status === "pending").length;
  const pendingExpensesCount = expenseItems.filter((i) => i.status === "pending").length;

  return (
    <header className="bg-white border-b border-[#E2E8F0] flex flex-col shrink-0 shadow-2xs z-30 select-none">
      {/* Top App Bar */}
      <div className="h-14 px-3 flex items-center justify-between">
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition active:scale-95 cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded bg-[#03A9F4] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-bold text-[#1E293B] leading-none tracking-tight">
                  Approvals
                </h1>
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] ring-2 ring-amber-100" />
              </div>
              <p className="text-[10px] text-[#94A3B8] font-medium truncate max-w-[150px] sm:max-w-[220px] leading-tight mt-0.5">
                {workspaceName}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Reset demo data button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={resetSampleData}
            className="flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] border border-[#CBD5E1] rounded-md text-[11px] font-medium transition cursor-pointer"
            title="Reset sample approval data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden xs:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Primary Category Switcher: Timesheet vs Expenses (matching Approvals Timesheet.png) */}
      <div className="px-3 pb-2.5 pt-0.5 flex items-center justify-between">
        <div className="flex items-center p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] w-full">
          <button
            type="button"
            onClick={() => setActiveTab("timesheet")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              activeTab === "timesheet"
                ? "bg-white text-[#03A9F4] shadow-2xs"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timesheet</span>
            {pendingTimesheetsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]">
                {pendingTimesheetsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              activeTab === "expenses"
                ? "bg-white text-[#03A9F4] shadow-2xs"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Expenses</span>
            {pendingExpensesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]">
                {pendingExpensesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
