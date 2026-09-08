import React, { useState, useMemo } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Clock,
  Calendar as CalendarIcon,
  Copy,
  Bookmark,
  CheckCircle2,
  MoreVertical,
  X,
  User,
  Search,
  RotateCcw,
} from "lucide-react";
import { useTimesheetStore, TimesheetRow } from "@/stores/useTimesheetStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTeamStore } from "@/stores/useTeamStore";
import { AddTimeEntrySheet } from "./AddTimeEntrySheet";
import { MobileDrawer } from "@/components/expenses/MobileDrawer";

interface MobileTimesheetScreenProps {
  onOpenDrawer?: () => void;
  onNavigateScreen?: (screen: string) => void;
}

// Formatting helper: seconds -> "hh:mm:ss" matching desktop
function formatSecondsToHms(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
    return "00:00:00";
  }
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Parse user input (e.g. "2", "2.5", "2:30", "02:30:00", "8h", "45m") into seconds matching desktop
function parseInputToSeconds(val: string): number {
  const str = val.trim().toLowerCase();
  if (!str) return 0;

  if (str.endsWith("h")) {
    const num = parseFloat(str.replace("h", ""));
    return isNaN(num) ? 0 : Math.round(num * 3600);
  }
  if (str.endsWith("m")) {
    const num = parseFloat(str.replace("m", ""));
    return isNaN(num) ? 0 : Math.round(num * 60);
  }
  if (str.includes(":")) {
    const parts = str.split(":").map((p) => parseInt(p, 10) || 0);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 3600 + parts[1] * 60;
    }
  }
  const num = parseFloat(str);
  if (!isNaN(num)) {
    return Math.round(num * 3600);
  }
  return 0;
}

export const MobileTimesheetScreen: React.FC<MobileTimesheetScreenProps> = ({
  onOpenDrawer,
  onNavigateScreen,
}) => {
  const {
    isActivated,
    toggleActivate,
    activeWeekStart,
    navigateWeek,
    selectedTeammateId,
    setSelectedTeammateId,
    rows,
    addRow,
    removeRow,
    clearRow,
    setRowProject,
    updateCellTime,
    copyLastWeek,
    saveAsTemplate,
  } = useTimesheetStore();

  const { projects } = useProjectStore();
  const { members } = useTeamStore();

  // Internal Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals & Sheets
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isTeammatesSheetOpen, setIsTeammatesSheetOpen] = useState(false);
  const [isActionsSheetOpen, setIsActionsSheetOpen] = useState(false);
  const [projectPickerRowId, setProjectPickerRowId] = useState<string | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  // Quick cell time edit dialog for mobile touch
  const [quickCellTarget, setQuickCellTarget] = useState<{
    rowId: string;
    projectName: string;
    dateStr: string;
    dayLabel: string;
    seconds: number;
  } | null>(null);
  const [quickCellInput, setQuickCellInput] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute 7 days of the active week matching desktop TimesheetPage
  const weekDays = useMemo(() => {
    const start = new Date(activeWeekStart);
    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${dayNum}`;

      // e.g. "Mo, Aug 31" matching desktop TimeSheet.png
      const desktopLabel = `${dayNames[i]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;

      return {
        dateStr,
        dayAbbr: dayNames[i],
        dayOfMonth: d.getDate(),
        desktopLabel,
        dayIndex: i,
      };
    });
  }, [activeWeekStart]);

  // Week date range label matching desktop (e.g. "Aug 31 – Sep 6, 2026")
  const weekRangeLabel = useMemo(() => {
    if (weekDays.length < 7) return "";
    const first = new Date(weekDays[0].dateStr);
    const last = new Date(weekDays[6].dateStr);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${monthNames[first.getMonth()]} ${first.getDate()} – ${monthNames[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
  }, [weekDays]);

  // Teammate Info matching desktop
  const currentTeammate = useMemo(() => {
    return (
      members.find((m) => m.id === selectedTeammateId) || {
        id: "tm-bindhu",
        name: "Bindhu shree (you)",
        role: "Owner",
      }
    );
  }, [members, selectedTeammateId]);

  // Filtered projects for search
  const filteredProjects = useMemo(() => {
    if (!projectSearchQuery.trim()) return projects;
    const q = projectSearchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q))
    );
  }, [projects, projectSearchQuery]);

  // Daily totals across all rows
  const dayTotals = useMemo(() => {
    const totals: { [dateStr: string]: number } = {};
    weekDays.forEach((wd) => {
      totals[wd.dateStr] = 0;
    });

    rows.forEach((r) => {
      weekDays.forEach((wd) => {
        totals[wd.dateStr] += r.dayHours[wd.dateStr] || 0;
      });
    });

    return totals;
  }, [rows, weekDays]);

  // Grand total for the week
  const grandTotalSeconds = useMemo(() => {
    return Object.values(dayTotals).reduce((sum, sec) => sum + sec, 0);
  }, [dayTotals]);

  // Row total seconds calculation
  const getRowTotalSeconds = (row: TimesheetRow) => {
    return weekDays.reduce((sum, wd) => sum + (row.dayHours[wd.dateStr] || 0), 0);
  };

  // Open Quick Cell Stepper
  const handleOpenQuickCell = (row: TimesheetRow, wd: (typeof weekDays)[0]) => {
    const secs = row.dayHours[wd.dateStr] || 0;
    setQuickCellTarget({
      rowId: row.id,
      projectName: row.projectName || "Select project",
      dateStr: wd.dateStr,
      dayLabel: wd.desktopLabel,
      seconds: secs,
    });
    setQuickCellInput(secs > 0 ? formatSecondsToHms(secs) : "");
  };

  // Save Quick Cell Time
  const handleSaveQuickCell = (seconds: number) => {
    if (!quickCellTarget) return;
    updateCellTime(quickCellTarget.rowId, quickCellTarget.dateStr, Math.max(0, seconds));
    setQuickCellTarget(null);
    showToast("Time updated!");
  };

  // Handle saving time entry from AddTimeEntrySheet
  const handleSaveEntryFromSheet = (data: {
    projectId: string;
    projectName: string;
    projectColor: string;
    client: string | null;
    taskId: string | null;
    taskName: string | null;
    description: string;
    isBillable: boolean;
    durationSeconds: number;
  }) => {
    let targetRow = rows.find((r) => !r.projectId && Object.keys(r.dayHours).length === 0);
    let targetRowId = targetRow?.id;

    if (!targetRowId) {
      addRow();
      const updatedRows = useTimesheetStore.getState().rows;
      targetRowId = updatedRows[updatedRows.length - 1].id;
    }

    setRowProject(
      targetRowId,
      data.projectId,
      data.projectName,
      data.projectColor,
      data.client
    );
    updateCellTime(targetRowId, weekDays[0].dateStr, data.durationSeconds);
    showToast("Time entry added successfully!");
    setIsAddSheetOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F5F6F8] text-[#1E293B] overflow-hidden select-none relative font-sans">
      {/* 1. TOP APP BAR */}
      <header className="h-14 px-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu */}
          <button
            type="button"
            onClick={() => (onOpenDrawer ? onOpenDrawer() : setIsDrawerOpen(true))}
            className="p-2 -ml-1 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clockify Logo & Title */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-[#03A9F4] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.85-.51-3.58-1.39-5.07l-1.53.88C19.64 8.94 20 10.42 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c1.58 0 3.06.46 4.31 1.25l.89-1.54C15.7 2.61 13.92 2 12 2zm-1 5v6h6v-2h-4V7h-2z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-[#1E293B] tracking-tight">
              Timesheet
            </h1>
          </div>
        </div>

        {/* Right Actions: Teammates & Options */}
        <div className="flex items-center gap-1.5">
          {/* Teammates Button matching desktop Teammates ▾ */}
          <button
            type="button"
            onClick={() => setIsTeammatesSheetOpen(true)}
            className="h-8 px-2.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded text-xs text-[#64748B] font-medium flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title={`Viewing timesheet for: ${currentTeammate.name}`}
          >
            <User className="w-3.5 h-3.5 text-[#03A9F4]" />
            <span className="max-w-[70px] truncate text-[11px] font-semibold text-[#1E293B]">
              {currentTeammate.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {/* More Actions Menu */}
          <button
            type="button"
            onClick={() => setIsActionsSheetOpen(true)}
            className="p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Timesheet options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SECONDARY CONTROLS & WEEK NAVIGATOR */}
      <div className="bg-white border-b border-[#E2E8F0] px-3 py-2 shrink-0 space-y-2">
        {/* Row 1: Week Date Range & Total Time */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#1E293B] truncate">
            {weekRangeLabel}
          </span>
          <div className="flex items-center gap-1.5 bg-[#E1F5FE]/70 px-2.5 py-1 rounded-md border border-[#B3E5FC] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#0288D1]" />
            <span className="text-xs font-bold text-[#0288D1] font-mono tracking-tight">
              {formatSecondsToHms(grandTotalSeconds)}
            </span>
          </div>
        </div>

        {/* Row 2: Week Navigator Controls */}
        <div className="flex items-center">
          {/* Navigator Buttons */}
          <div className="flex items-center bg-white border border-[#E2E8F0] rounded shadow-2xs text-xs text-[#334155] overflow-hidden">
            <button
              type="button"
              onClick={() => navigateWeek("current")}
              className="flex items-center gap-1 px-2.5 py-1.5 border-r border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer font-medium text-[#64748B]"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[11px]">This week</span>
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("prev")}
              className="p-1.5 hover:bg-[#F8FAFC] text-[#94A3B8] border-r border-[#E2E8F0] transition cursor-pointer"
              title="Previous week"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("next")}
              className="p-1.5 hover:bg-[#F8FAFC] text-[#94A3B8] transition cursor-pointer"
              title="Next week"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN SCROLLABLE BODY (WEEKLY TIMESHEET TABLE) */}
      <div className="flex-1 overflow-y-auto p-3 pb-24 space-y-3">
        {/* Exact Desktop Activation Card matching TimeSheet.png */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1E293B]">Timesheet</h2>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActivated
                  ? "bg-[#E1F5FE] text-[#0288D1]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isActivated ? "Activated" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Enter time on tasks and projects using a weekly timesheet view. While
            activated, project is a required field for the whole workspace.
          </p>

          {/* Toggle Switch matching desktop */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <button
              type="button"
              role="switch"
              aria-checked={isActivated}
              onClick={toggleActivate}
              className={`relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActivated ? "bg-[#03A9F4]" : "bg-[#475569]"
              }`}
              title={isActivated ? "Deactivate timesheet" : "Activate timesheet"}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isActivated ? "translate-x-[16px]" : "translate-x-0"
                }`}
              />
            </button>
            <label
              onClick={toggleActivate}
              className="text-xs font-medium text-[#1E293B] cursor-pointer select-none leading-none"
            >
              Activate timesheet
            </label>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WEEKLY TIMESHEET TABLE (Exact Desktop Parity) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {/* Table Container */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
            <div className="px-3 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E293B]">
                Weekly Timesheet
              </span>
              <span className="text-[10px] text-[#64748B]">
                Swipe horizontally to view Mon–Sun
              </span>
            </div>

            {/* Horizontally Scrollable Table matching TimeSheet.png */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[580px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-xs font-normal text-[#94A3B8] bg-white h-10">
                    <th className="pl-3 pr-2 font-semibold w-[160px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                      Projects
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day.dateStr}
                        className="px-1.5 font-normal text-center w-[74px]"
                      >
                        <div className="text-[11px] font-medium text-[#64748B]">
                          {day.dayAbbr}
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          {day.dayOfMonth}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 font-semibold text-right w-[84px]">
                      Total:
                    </th>
                    <th className="w-8 pr-2"></th>
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody className="divide-y divide-[#F1F5F9]">
                  {rows.map((row) => {
                    const rowTotalSeconds = getRowTotalSeconds(row);

                    return (
                      <tr
                        key={row.id}
                        className="h-13 hover:bg-[#FBFCFD] transition"
                      >
                        {/* Column 1: Sticky Project Picker */}
                        <td className="pl-3 pr-2 relative sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                          {row.projectId ? (
                            <div className="flex items-center justify-between gap-1 group">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      row.projectColor || "#03A9F4",
                                  }}
                                />
                                <div className="truncate">
                                  <div className="text-xs font-bold text-[#1E293B] truncate max-w-[100px]">
                                    {row.projectName}
                                  </div>
                                  {row.client && (
                                    <div className="text-[10px] text-[#94A3B8] truncate max-w-[100px]">
                                      {row.client}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProjectPickerRowId(row.id)}
                                className="text-[11px] text-[#03A9F4] font-medium hover:underline cursor-pointer shrink-0"
                              >
                                Change
                              </button>
                            </div>
                          ) : (
                            /* Empty state matching "Select project" in TimeSheet.png */
                            <button
                              type="button"
                              onClick={() => setProjectPickerRowId(row.id)}
                              className="flex items-center gap-1.5 text-xs text-[#03A9F4] font-medium hover:underline cursor-pointer group"
                            >
                              <div className="w-3.5 h-3.5 rounded-full border border-dashed border-[#03A9F4] flex items-center justify-center text-[10px] shrink-0">
                                +
                              </div>
                              <span className="truncate">Select project</span>
                            </button>
                          )}
                        </td>

                        {/* Columns 2-8: 7 Day Time Inputs matching desktop with mobile touch support */}
                        {weekDays.map((day) => {
                          const seconds = row.dayHours[day.dateStr] || 0;
                          const formattedTime =
                            seconds > 0 ? formatSecondsToHms(seconds) : "";

                          return (
                            <td
                              key={day.dateStr}
                              className="px-1 text-center"
                            >
                              <input
                                type="text"
                                defaultValue={formattedTime}
                                key={`${row.id}-${day.dateStr}-${seconds}`}
                                placeholder=""
                                onClick={() => handleOpenQuickCell(row, day)}
                                onBlur={(e) => {
                                  const sec = parseInputToSeconds(
                                    e.target.value
                                  );
                                  updateCellTime(row.id, day.dateStr, sec);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                  }
                                }}
                                className="h-8 w-15 text-center text-xs border border-[#E2E8F0] rounded bg-[#F8FAFC] text-[#1E293B] font-mono focus:bg-white focus:border-[#03A9F4] focus:outline-none transition shadow-2xs"
                                title="Tap to edit time"
                              />
                            </td>
                          );
                        })}

                        {/* Column 9: Row Total */}
                        <td className="px-3 text-right text-xs font-mono font-bold text-[#64748B]">
                          {formatSecondsToHms(rowTotalSeconds)}
                        </td>

                        {/* Column 10: Clear / Delete row button matching TimeSheet.png */}
                        <td className="pr-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (rows.length > 1) {
                                removeRow(row.id);
                                showToast("Row removed");
                              } else {
                                clearRow(row.id);
                                showToast("Row cleared");
                              }
                            }}
                            className="text-[#CBD5E1] hover:text-[#EF4444] p-1 rounded transition cursor-pointer"
                            title="Clear or remove row"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Table Footer: Totals Row matching TimeSheet.png */}
                <tfoot>
                  <tr className="border-t border-[#E2E8F0] text-xs font-semibold text-[#64748B] h-11 bg-white">
                    <td className="pl-3 pr-2 font-bold text-[#1E293B] sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                      Total:
                    </td>
                    {weekDays.map((day) => (
                      <td
                        key={day.dateStr}
                        className="px-1 text-center font-mono text-[#64748B] text-[11px]"
                      >
                        {formatSecondsToHms(dayTotals[day.dateStr] || 0)}
                      </td>
                    ))}
                    <td className="px-3 text-right font-mono font-bold text-[#03A9F4] text-xs">
                      {formatSecondsToHms(grandTotalSeconds)}
                    </td>
                    <td className="pr-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom Action Buttons matching desktop TimeSheet.png */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* (+) Add new row */}
            <button
              type="button"
              onClick={() => {
                addRow();
                showToast("Added new timesheet row!");
              }}
              className="h-8 px-3 bg-white border border-[#E2E8F0] rounded text-xs font-medium text-[#03A9F4] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-[#03A9F4] flex items-center justify-center text-[10px] leading-none">
                +
              </div>
              <span>Add new row</span>
            </button>

            {/* Copy last week ▾ */}
            <button
              type="button"
              onClick={() => {
                copyLastWeek();
                showToast("Copied projects and schedule from last week!");
              }}
              className="h-8 px-3 bg-white border border-[#E2E8F0] rounded text-xs font-medium text-[#64748B] hover:text-[#1E293B] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Copy last week</span>
              <ChevronDown className="w-3 h-3 text-[#CBD5E1]" />
            </button>

            {/* Save as template */}
            <button
              type="button"
              onClick={() => {
                saveAsTemplate();
                showToast("Current timesheet configuration saved as template!");
              }}
              className="h-8 px-3 bg-white border border-[#E2E8F0] rounded text-xs font-medium text-[#64748B] hover:text-[#1E293B] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Save as template</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. FLOATING ACTION BUTTON (FAB) */}
      <div className="absolute bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsAddSheetOpen(true)}
          className="h-11 px-4 bg-[#03A9F4] hover:bg-[#0288d1] text-white rounded-full shadow-lg shadow-[#03A9F4]/35 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Time</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODALS & SHEETS */}
      {/* ========================================================================= */}

      {/* Add Time Entry Sheet */}
      <AddTimeEntrySheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        dateStr={weekDays[0].dateStr}
        dayLabel={weekDays[0].desktopLabel}
        onSave={handleSaveEntryFromSheet}
      />

      {/* Project Picker Modal matching desktop search */}
      {projectPickerRowId && (
        <div className="absolute inset-0 z-[65] flex items-end justify-center bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl p-4 space-y-3 animate-slideUp text-slate-800 max-h-[80%] flex flex-col">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-[#1E293B]">Select Project</h3>
              <button
                type="button"
                onClick={() => {
                  setProjectPickerRowId(null);
                  setProjectSearchQuery("");
                }}
                className="p-1 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Find project or client..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#03A9F4] bg-[#F8FAFC]"
                autoFocus
              />
            </div>

            {/* Project List */}
            <div className="overflow-y-auto divide-y divide-slate-100 flex-1 space-y-0.5 max-h-60">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setRowProject(
                      projectPickerRowId,
                      p.id,
                      p.name,
                      p.color,
                      p.client
                    );
                    setProjectPickerRowId(null);
                    setProjectSearchQuery("");
                    showToast(`Assigned project: ${p.name}`);
                  }}
                  className="w-full py-2.5 px-2 flex items-center justify-between hover:bg-[#F8FAFC] rounded-lg transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#1E293B] truncate">
                        {p.name}
                      </p>
                      {p.client && (
                        <p className="text-[10px] text-[#94A3B8] truncate">
                          {p.client}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#03A9F4] font-medium">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick In-Cell Time Stepper Dialog for mobile touch ergonomics */}
      {quickCellTarget && (
        <div className="absolute inset-0 z-[65] flex items-end justify-center bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl p-4 space-y-3 animate-slideUp text-slate-800">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-[#1E293B]">
                  Enter Time for {quickCellTarget.dayLabel}
                </h3>
                <p className="text-[11px] text-[#64748B] truncate">
                  {quickCellTarget.projectName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickCellTarget(null)}
                className="p-1 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#64748B]">
                Duration (e.g. 2h, 1.5, 08:00:00, 30m)
              </label>
              <input
                type="text"
                value={quickCellInput}
                onChange={(e) => setQuickCellInput(e.target.value)}
                placeholder="00:00:00"
                className="w-full h-11 px-3 text-sm font-mono text-center border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#03A9F4] font-bold"
                autoFocus
              />
            </div>

            {/* Quick Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">
                Quick Presets
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: "+30m", sec: 1800 },
                  { label: "+1h", sec: 3600 },
                  { label: "+2h", sec: 7200 },
                  { label: "+4h", sec: 14400 },
                  { label: "8h", sec: 28800, replace: true },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      const current = parseInputToSeconds(quickCellInput);
                      const updated = chip.replace ? chip.sec : current + chip.sec;
                      setQuickCellInput(formatSecondsToHms(updated));
                    }}
                    className="py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#1E293B] transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSaveQuickCell(0)}
                className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
              >
                Clear (0h)
              </button>
              <button
                type="button"
                onClick={() => {
                  const sec = parseInputToSeconds(quickCellInput);
                  handleSaveQuickCell(sec);
                }}
                className="flex-2 py-2.5 rounded-xl bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold shadow-md shadow-[#03A9F4]/30 transition cursor-pointer"
              >
                Save Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teammates Selector Sheet */}
      {isTeammatesSheetOpen && (
        <div className="absolute inset-0 z-[65] flex items-end justify-center bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl p-4 space-y-3 animate-slideUp">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-[#1E293B]">Select Teammate</h3>
              <button
                type="button"
                onClick={() => setIsTeammatesSheetOpen(false)}
                className="p-1 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedTeammateId(m.id);
                    setIsTeammatesSheetOpen(false);
                    showToast(`Viewing timesheet for ${m.name}`);
                  }}
                  className={`w-full py-2.5 px-2 flex items-center justify-between text-left transition cursor-pointer ${
                    selectedTeammateId === m.id
                      ? "bg-[#E1F5FE]/60 text-[#0288D1] font-semibold"
                      : "hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#03A9F4]/20 text-[#0288D1] flex items-center justify-center font-bold text-xs">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E293B]">{m.name}</p>
                      <p className="text-[10px] text-[#94A3B8]">{m.role}</p>
                    </div>
                  </div>
                  {selectedTeammateId === m.id && (
                    <span className="text-[11px] font-bold text-[#03A9F4]">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Options Sheet */}
      {isActionsSheetOpen && (
        <div className="absolute inset-0 z-[65] flex items-end justify-center bg-black/50 backdrop-blur-[1px] animate-fadeIn select-none">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl p-4 space-y-3 animate-slideUp">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-[#1E293B]">Timesheet Options</h3>
              <button
                type="button"
                onClick={() => setIsActionsSheetOpen(false)}
                className="p-1 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  copyLastWeek();
                  setIsActionsSheetOpen(false);
                  showToast("Copied entries from last week!");
                }}
                className="w-full p-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-center gap-2.5 text-xs font-medium text-[#1E293B] cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#64748B]" />
                <span>Copy last week</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  saveAsTemplate();
                  setIsActionsSheetOpen(false);
                  showToast("Saved current week as template!");
                }}
                className="w-full p-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-center gap-2.5 text-xs font-medium text-[#1E293B] cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-[#64748B]" />
                <span>Save as template</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleActivate();
                  setIsActionsSheetOpen(false);
                  showToast(
                    isActivated ? "Timesheet deactivated" : "Timesheet activated!"
                  );
                }}
                className="w-full p-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-center gap-2.5 text-xs font-medium text-[#1E293B] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#64748B]" />
                <span>{isActivated ? "Deactivate timesheet" : "Activate timesheet"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[80] bg-[#1E293B] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn border border-[#334155]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#03A9F4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="timesheet"
        onNavigate={(scr) => {
          onNavigateScreen?.(scr);
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};
