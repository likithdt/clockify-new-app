import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  Users,
  Tag,
  Bell,
  CheckCheck,
} from "lucide-react";
import {
  useApprovalStore,
  type ApprovalStatusTab,
  type SortOption,
} from "@/stores/useApprovalStore";

export const ApprovalsFilterBar: React.FC = () => {
  const {
    activeTab,
    statusTab,
    setStatusTab,
    sortBy,
    setSortBy,
    teamFilter,
    setTeamFilter,
    categoryFilter,
    setCategoryFilter,
    remindToApprove,
    approveAll,
    timesheetItems,
    expenseItems,
  } = useApprovalStore();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const currentItems = activeTab === "timesheet" ? timesheetItems : expenseItems;
  const pendingCount = currentItems.filter((i) => i.status === "pending").length;
  const unsubmittedCount = currentItems.filter((i) => i.status === "unsubmitted").length;
  const archiveCount = currentItems.filter(
    (i) => i.status === "approved" || i.status === "rejected"
  ).length;

  const sortLabels: Record<SortOption, string> = {
    "date-desc": "Sort by: Date (Newest)",
    "date-asc": "Sort by: Date (Oldest)",
    "user-asc": "Sort by: User (A-Z)",
  };

  return (
    <div className="bg-white border-b border-[#E2E8F0] shadow-2xs select-none">
      {/* 1. STATUS TABS (matching PENDING | UNSUBMITTED | ARCHIVE from screenshots) */}
      <div className="flex items-center border-b border-[#E2E8F0] px-3">
        {(
          [
            ["pending", "PENDING", pendingCount],
            ["unsubmitted", "UNSUBMITTED", unsubmittedCount],
            ["archive", "ARCHIVE", archiveCount],
          ] as [ApprovalStatusTab, string, number][]
        ).map(([tab, label, count]) => {
          const isActive = statusTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusTab(tab)}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? "text-[#03A9F4]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-[#E1F5FE] text-[#0288D1]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {count}
                </span>
              )}
              {/* Active Tab Underline */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#03A9F4]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. FILTER & BATCH ACTIONS ROW */}
      <div className="px-3 py-2.5 flex flex-col gap-2">
        {/* Dropdown Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsTeamOpen(false);
                setIsCategoryOpen(false);
              }}
              className="h-7 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-medium text-[#334155] flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
              <span className="truncate max-w-[130px]">{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                <div className="absolute left-0 top-8 w-48 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B] animate-fadeIn">
                  {(
                    [
                      ["date-desc", "Date (Newest first)"],
                      ["date-asc", "Date (Oldest first)"],
                      ["user-asc", "User (A to Z)"],
                    ] as [SortOption, string][]
                  ).map(([val, name]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSortBy(val);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center justify-between ${
                        sortBy === val ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                      }`}
                    >
                      <span>{name}</span>
                      {sortBy === val && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Team Filter Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsTeamOpen(!isTeamOpen);
                setIsSortOpen(false);
                setIsCategoryOpen(false);
              }}
              className="h-7 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-medium text-[#334155] flex items-center gap-1 transition cursor-pointer"
            >
              <Users className="w-3 h-3 text-[#64748B]" />
              <span>{teamFilter === "all" ? "Team: All" : teamFilter}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {isTeamOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTeamOpen(false)} />
                <div className="absolute left-0 top-8 w-44 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B] animate-fadeIn">
                  {["all", "Amy Smith", "James Anderson", "Lara Peterson", "David Lee"].map(
                    (user) => (
                      <button
                        key={user}
                        type="button"
                        onClick={() => {
                          setTeamFilter(user);
                          setIsTeamOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center justify-between ${
                          teamFilter === user ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                        }`}
                      >
                        <span>{user === "all" ? "All Team Members" : user}</span>
                        {teamFilter === user && <span className="text-xs">✓</span>}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          {/* Category Filter (when activeTab === "expenses") */}
          {activeTab === "expenses" && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSortOpen(false);
                  setIsTeamOpen(false);
                }}
                className="h-7 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-medium text-[#334155] flex items-center gap-1 transition cursor-pointer"
              >
                <Tag className="w-3 h-3 text-[#64748B]" />
                <span>{categoryFilter === "all" ? "Category: All" : categoryFilter}</span>
                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                  <div className="absolute left-0 top-8 w-40 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B] animate-fadeIn">
                    {["all", "Day rate", "Travel", "Software", "Office supplies"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center justify-between ${
                          categoryFilter === cat ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                        }`}
                      >
                        <span>{cat === "all" ? "All Categories" : cat}</span>
                        {categoryFilter === cat && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: REMIND TO APPROVE & APPROVE ALL (matching screenshots) */}
        {statusTab === "pending" && pendingCount > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={remindToApprove}
              className="flex-1 h-8 px-2.5 bg-white hover:bg-sky-50 text-[#0288D1] border border-[#03A9F4] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Remind to Approve</span>
            </button>

            <button
              type="button"
              onClick={approveAll}
              className="flex-1 h-8 px-2.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer shadow-xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Approve All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
