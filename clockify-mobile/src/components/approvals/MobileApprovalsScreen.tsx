import React, { useState, useMemo } from "react";
import { ApprovalsHeader } from "./ApprovalsHeader";
import { ApprovalsFilterBar } from "./ApprovalsFilterBar";
import { TimesheetApprovalCard } from "./TimesheetApprovalCard";
import { ExpenseApprovalCard } from "./ExpenseApprovalCard";
import { ApprovalsBatchBar } from "./ApprovalsBatchBar";
import { RejectReasonModal } from "./RejectReasonModal";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";
import {
  useApprovalStore,
  type TimesheetApprovalItem,
  type ExpenseApprovalItem,
} from "@/stores/useApprovalStore";
import { CheckCircle2, Calendar, ShieldCheck, Check } from "lucide-react";

interface MobileApprovalsScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

export const MobileApprovalsScreen: React.FC<MobileApprovalsScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    activeTab,
    statusTab,
    sortBy,
    teamFilter,
    categoryFilter,
    timesheetItems,
    expenseItems,
    toastMessage,
    setToastMessage,
    selectedIds,
    selectAllInGroup,
  } = useApprovalStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rejectModalState, setRejectModalState] = useState<{
    isOpen: boolean;
    targetId: string | null;
    targetName: string | null;
  }>({
    isOpen: false,
    targetId: null,
    targetName: null,
  });

  const handleOpenDrawer = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      setIsDrawerOpen(true);
    }
  };

  const handleOpenRejectModal = (id: string, name: string) => {
    setRejectModalState({
      isOpen: true,
      targetId: id,
      targetName: name,
    });
  };

  // Filter & Sort Timesheets
  const filteredTimesheets = useMemo(() => {
    return timesheetItems
      .filter((item) => {
        if (item.status !== statusTab) return false;
        if (teamFilter !== "all" && !item.user.toLowerCase().includes(teamFilter.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return b.periodSortDate.localeCompare(a.periodSortDate);
        if (sortBy === "date-asc") return a.periodSortDate.localeCompare(b.periodSortDate);
        if (sortBy === "user-asc") return a.user.localeCompare(b.user);
        return 0;
      });
  }, [timesheetItems, statusTab, teamFilter, sortBy]);

  // Group Timesheets by Period (matching Approvals Timesheet.png)
  const groupedTimesheets = useMemo(() => {
    const groups: { [period: string]: TimesheetApprovalItem[] } = {};
    for (const item of filteredTimesheets) {
      if (!groups[item.period]) groups[item.period] = [];
      groups[item.period].push(item);
    }
    return groups;
  }, [filteredTimesheets]);

  // Filter & Sort Expenses
  const filteredExpenses = useMemo(() => {
    return expenseItems
      .filter((item) => {
        if (item.status !== statusTab) return false;
        if (teamFilter !== "all" && !item.user.toLowerCase().includes(teamFilter.toLowerCase())) {
          return false;
        }
        if (categoryFilter !== "all" && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return b.periodSortDate.localeCompare(a.periodSortDate);
        if (sortBy === "date-asc") return a.periodSortDate.localeCompare(b.periodSortDate);
        if (sortBy === "user-asc") return a.user.localeCompare(b.user);
        return 0;
      });
  }, [expenseItems, statusTab, teamFilter, categoryFilter, sortBy]);

  // Group Expenses by Period (matching Approvals Expenses.png)
  const groupedExpenses = useMemo(() => {
    const groups: { [period: string]: ExpenseApprovalItem[] } = {};
    for (const item of filteredExpenses) {
      if (!groups[item.period]) groups[item.period] = [];
      groups[item.period].push(item);
    }
    return groups;
  }, [filteredExpenses]);

  const activeGroupKeys =
    activeTab === "timesheet" ? Object.keys(groupedTimesheets) : Object.keys(groupedExpenses);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] text-[#1E293B] overflow-hidden select-none relative font-sans">
      {/* 1. TOP HEADER WITH TIMESHEET/EXPENSES SWITCHER */}
      <ApprovalsHeader onOpenDrawer={handleOpenDrawer} />

      {/* 2. FILTER CONTROLS & STATUS TABS (PENDING / UNSUBMITTED / ARCHIVE) */}
      <ApprovalsFilterBar />

      {/* 3. TOAST MESSAGE NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-[380px] mx-auto bg-[#059669] text-white px-3.5 py-2 rounded-xl shadow-lg flex items-center justify-between text-xs animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. SCROLLABLE APPROVALS LIST */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 pb-20 overscroll-contain">
        {activeGroupKeys.length === 0 ? (
          /* EMPTY STATE */
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-[#CBD5E1] my-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#03A9F4] flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B] mb-1">
              {statusTab === "pending"
                ? `No pending ${activeTab}s`
                : statusTab === "unsubmitted"
                ? `No unsubmitted ${activeTab}s`
                : `No archived ${activeTab}s`}
            </h3>
            <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">
              {statusTab === "pending"
                ? "All submissions for this period have been reviewed and approved."
                : "No matching records found for the selected team or filter criteria."}
            </p>
          </div>
        ) : (
          /* GROUPED APPROVAL PERIODS */
          activeGroupKeys.map((period) => {
            const periodTimesheets = groupedTimesheets[period] || [];
            const periodExpenses = groupedExpenses[period] || [];
            const items = activeTab === "timesheet" ? periodTimesheets : periodExpenses;
            const itemIds = items.map((i) => i.id);
            const isAllGroupSelected =
              items.length > 0 && items.every((i) => selectedIds.includes(i.id));

            return (
              <div key={period} className="space-y-2">
                {/* Period Section Header (matching Aug 31, 2026 - Sep 6, 2026 header in screenshots) */}
                <div className="flex items-center justify-between px-1 text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#03A9F4]" />
                    <span className="font-bold text-[#1E293B] text-[12.5px]">
                      {period}
                    </span>
                    <span className="text-[10.5px] text-[#94A3B8] font-medium">
                      ({items.length} {items.length === 1 ? "item" : "items"})
                    </span>
                  </div>

                  {statusTab === "pending" && (
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(itemIds)}
                      className="text-[11px] text-[#0288D1] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>{isAllGroupSelected ? "Deselect Week" : "Select Week"}</span>
                    </button>
                  )}
                </div>

                {/* Cards in this period */}
                <div className="space-y-2">
                  {activeTab === "timesheet"
                    ? periodTimesheets.map((ts) => (
                        <TimesheetApprovalCard
                          key={ts.id}
                          item={ts}
                          onOpenRejectModal={handleOpenRejectModal}
                        />
                      ))
                    : periodExpenses.map((exp) => (
                        <ExpenseApprovalCard
                          key={exp.id}
                          item={exp}
                          onOpenRejectModal={handleOpenRejectModal}
                        />
                      ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. FLOATING BATCH ACTIONS BAR */}
      <ApprovalsBatchBar onOpenRejectModal={handleOpenRejectModal} />

      {/* 6. REJECTION REASON MODAL */}
      <RejectReasonModal
        isOpen={rejectModalState.isOpen}
        onClose={() => setRejectModalState({ isOpen: false, targetId: null, targetName: null })}
        targetId={rejectModalState.targetId}
        targetName={rejectModalState.targetName}
      />

      {/* 7. UNIVERSAL MOBILE DRAWER */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="approvals"
        onNavigate={(screen) => {
          onNavigateScreen?.(screen);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
