import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Users,
  FolderKanban,
  Sparkles,
  X,
} from "lucide-react";
import { useDashboardStore, type UserFilterType, type DateRangeType } from "@/stores/useDashboardStore";

export const DashboardFilterBar: React.FC = () => {
  const {
    hasSampleData,
    removeSampleData,
    userFilter,
    setUserFilter,
    projectFilter,
    setProjectFilter,
    dateRangeType,
    setDateRangeType,
    currentWeekStart,
    navigateWeek,
    sampleActivities,
  } = useDashboardStore();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Extract unique project list
  const projectList = Array.from(new Set(sampleActivities.map((a) => a.projectName)));

  // Format active week label e.g., "Aug 31 - Sep 6, 2026"
  const getWeekRangeLabel = () => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startM = monthNames[start.getMonth()];
    const endM = monthNames[end.getMonth()];

    if (dateRangeType === "this_week") {
      return `This week (${startM} ${start.getDate()} - ${endM} ${end.getDate()})`;
    }
    if (dateRangeType === "last_week") {
      return `Last week (${startM} ${start.getDate()} - ${endM} ${end.getDate()})`;
    }
    if (dateRangeType === "this_month") {
      return `This month (${startM} 2026)`;
    }
    return `${startM} ${start.getDate()} - ${endM} ${end.getDate()}`;
  };

  return (
    <div className="flex flex-col bg-white border-b border-[#E2E8F0] shadow-2xs select-none">
      {/* 1. Clockify Sample Data Exploration Notice Banner (matching Dashboard.png) */}
      {hasSampleData && (
        <div className="bg-[#E0F2FE] border-b border-[#BAE6FD] px-3.5 py-2 flex items-center justify-between text-xs text-[#0369A1] animate-fadeIn">
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0288D1] shrink-0" />
            <span className="truncate text-[11.5px] font-medium">
              You are currently using sample data to help you explore.
            </span>
          </div>
          <button
            type="button"
            onClick={removeSampleData}
            className="shrink-0 px-2 py-0.5 bg-white hover:bg-sky-50 text-[#0288D1] border border-[#7DD3FC] rounded text-[11px] font-bold tracking-tight shadow-2xs transition active:scale-95 cursor-pointer uppercase"
          >
            Remove Sample Data
          </button>
        </div>
      )}

      {/* 2. Filter Controls Row */}
      <div className="px-3 py-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {/* Project Filter Dropdown */}
          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsProjectDropdownOpen(!isProjectDropdownOpen);
                setIsDateDropdownOpen(false);
              }}
              className="w-full h-8 px-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-md flex items-center justify-between text-xs text-[#334155] font-medium transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FolderKanban className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                <span className="truncate">
                  {projectFilter === "all" ? "All Projects" : projectFilter}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 ml-1" />
            </button>

            {/* Project Dropdown Menu */}
            {isProjectDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProjectDropdownOpen(false)}
                />
                <div className="absolute left-0 top-9 w-52 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B] max-h-56 overflow-y-auto animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Filter by Project
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectFilter("all");
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between ${
                      projectFilter === "all" ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                    }`}
                  >
                    <span>All Projects</span>
                    {projectFilter === "all" && <span className="text-xs">✓</span>}
                  </button>
                  {projectList.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setProjectFilter(p);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between truncate ${
                        projectFilter === p ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                      }`}
                    >
                      <span className="truncate">{p}</span>
                      {projectFilter === p && <span className="text-xs shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Mode Filter: "Only me" vs "Team" */}
          <div className="flex bg-[#F1F5F9] p-0.5 rounded-md border border-[#E2E8F0] shrink-0">
            <button
              type="button"
              onClick={() => setUserFilter("only_me")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                userFilter === "only_me"
                  ? "bg-white text-[#03A9F4] shadow-2xs"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
              title="View my own time"
            >
              <User className="w-3 h-3" />
              <span>Only me</span>
            </button>
            <button
              type="button"
              onClick={() => setUserFilter("team")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                userFilter === "team"
                  ? "bg-white text-[#03A9F4] shadow-2xs"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
              title="View team dashboard"
            >
              <Users className="w-3 h-3" />
              <span>Team</span>
            </button>
          </div>
        </div>

        {/* Date Period Navigation Row */}
        <div className="flex items-center justify-between gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2 py-1">
          {/* Quick Date Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateDropdownOpen(!isDateDropdownOpen);
                setIsProjectDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B] hover:text-[#03A9F4] transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#03A9F4]" />
              <span className="text-[12px]">{getWeekRangeLabel()}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {isDateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDateDropdownOpen(false)}
                />
                <div className="absolute left-0 top-7 w-44 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B] animate-fadeIn">
                  {(
                    [
                      ["this_week", "This week"],
                      ["last_week", "Last week"],
                      ["this_month", "This month"],
                      ["last_month", "Last month"],
                    ] as [DateRangeType, string][]
                  ).map(([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setDateRangeType(type);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between ${
                        dateRangeType === type ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                      }`}
                    >
                      <span>{label}</span>
                      {dateRangeType === type && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Stepper Buttons: Prev / Next Week */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateWeek("prev")}
              className="p-1 text-[#64748B] hover:text-[#1E293B] hover:bg-white rounded transition active:scale-90 cursor-pointer"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("current")}
              className="px-1.5 py-0.5 text-[10px] font-bold text-[#64748B] hover:text-[#03A9F4] hover:bg-white rounded transition cursor-pointer"
              title="Jump to current week"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => navigateWeek("next")}
              className="p-1 text-[#64748B] hover:text-[#1E293B] hover:bg-white rounded transition active:scale-90 cursor-pointer"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
