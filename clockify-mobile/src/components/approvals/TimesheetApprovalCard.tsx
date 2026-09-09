import React, { useState } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  CalendarOff,
  User,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import {
  useApprovalStore,
  type TimesheetApprovalItem,
} from "@/stores/useApprovalStore";

interface TimesheetApprovalCardProps {
  item: TimesheetApprovalItem;
  onOpenRejectModal: (id: string, name: string) => void;
}

export const TimesheetApprovalCard: React.FC<TimesheetApprovalCardProps> = ({
  item,
  onOpenRejectModal,
}) => {
  const { selectedIds, toggleSelect, timesheetItems } = useApprovalStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isSelected = selectedIds.includes(item.id);

  const approveItem = () => {
    // Quick approve single item
    const store = useApprovalStore.getState();
    const updated = timesheetItems.map((ts) =>
      ts.id === item.id ? { ...ts, status: "approved" as const, approvedAt: new Date().toISOString().split("T")[0] } : ts
    );
    useApprovalStore.setState({
      timesheetItems: updated,
      toastMessage: `Approved timesheet for ${item.user}`,
    });
  };

  // Mock days breakdown for expandable view
  const mockDays = [
    { day: "Mon", hours: "08:00:00", project: "Mobile App 2.0" },
    { day: "Tue", hours: "08:00:00", project: "Mobile App 2.0" },
    { day: "Wed", hours: "00:00:00", project: "-" },
    { day: "Thu", hours: "00:00:00", project: "-" },
    { day: "Fri", hours: "00:00:00", project: "-" },
  ];

  const getStatusBadge = () => {
    switch (item.status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "unsubmitted":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <HelpCircle className="w-3 h-3" />
            Unsubmitted
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    const clean = name.replace("[SAMPLE]", "").trim();
    const parts = clean.split(" ");
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : clean.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`bg-white rounded-xl border transition-all select-none overflow-hidden ${
        isSelected
          ? "border-[#03A9F4] ring-1 ring-[#03A9F4] shadow-xs"
          : "border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1]"
      }`}
    >
      {/* Card Header / Main row */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2.5">
          {/* Left: Checkbox + Avatar + User info */}
          <div className="flex items-center gap-2.5 min-w-0">
            {item.status === "pending" && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(item.id)}
                className="w-4 h-4 rounded text-[#03A9F4] accent-[#03A9F4] cursor-pointer shrink-0"
              />
            )}

            <div className="w-9 h-9 rounded-full bg-[#03A9F4]/10 text-[#0288D1] font-bold text-xs flex items-center justify-center shrink-0 border border-[#B3E5FC]">
              {getInitials(item.user)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#1E293B] truncate">
                  {item.user}
                </span>
              </div>
              <div className="text-[11px] text-[#64748B] truncate flex items-center gap-1">
                <User className="w-3 h-3 text-[#94A3B8]" />
                <span>
                  {item.teamManager && item.teamManager !== "-"
                    ? `Mgr: ${item.teamManager}`
                    : "No manager assigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status badge */}
          <div className="shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Time and Details Grid */}
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
            <Clock className="w-4 h-4 text-[#03A9F4] shrink-0" />
            <div>
              <span className="text-[10px] text-[#64748B] font-medium block leading-none">
                Time Tracked
              </span>
              <span className="font-mono font-bold text-[#1E293B] text-[13px]">
                {item.time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
            <CalendarOff className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <div>
              <span className="text-[10px] text-[#64748B] font-medium block leading-none">
                Time Off
              </span>
              <span className="font-mono font-bold text-[#1E293B] text-[13px]">
                {item.timeOff}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Pending Timesheets */}
        {item.status === "pending" && (
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] text-[#64748B] hover:text-[#03A9F4] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span>{isExpanded ? "Hide Breakdown" : "View Breakdown"}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenRejectModal(item.id, item.user)}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-[#E11D48] border border-rose-200 rounded-md text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={approveItem}
                className="px-3 py-1 bg-[#059669] hover:bg-[#047857] text-white rounded-md text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-3 animate-fadeIn text-xs">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
            Daily Hours Breakdown
          </div>
          <div className="space-y-1.5">
            {mockDays.map((d) => (
              <div
                key={d.day}
                className="flex items-center justify-between py-1 px-2 bg-white rounded border border-[#E2E8F0]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E293B] w-8">{d.day}</span>
                  <span className="text-[11px] text-[#64748B] truncate">{d.project}</span>
                </div>
                <span className="font-mono font-semibold text-[#1E293B]">{d.hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
