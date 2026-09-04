import { useState, useMemo } from "react";
import {
    ChevronDown,
    Check,
    Bell,
    CheckCircle2,
    RotateCcw,
    X,
    Filter,
} from "lucide-react";
import {
    useApprovalStore,
    ApprovalStatusTab,
    TimesheetApprovalItem,
    ExpenseApprovalItem,
} from "@/stores/useApprovalStore";

export function ApprovalsPage() {
    const {
        activeTab,
        statusTab,
        sortBy,
        teamFilter,
        categoryFilter,
        selectedIds,
        toastMessage,
        timesheetItems,
        expenseItems,
        setActiveTab,
        setStatusTab,
        setSortBy,
        setTeamFilter,
        setCategoryFilter,
        toggleSelect,
        selectAllInGroup,
        approveSelected,
        approveAll,
        rejectSelected,
        remindToApprove,
        setToastMessage,
        resetSampleData,
    } = useApprovalStore();

    // Dropdown toggles
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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

    // Group Timesheets by Period
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

    // Group Expenses by Period
    const groupedExpenses = useMemo(() => {
        const groups: { [period: string]: ExpenseApprovalItem[] } = {};
        for (const item of filteredExpenses) {
            if (!groups[item.period]) groups[item.period] = [];
            groups[item.period].push(item);
        }
        return groups;
    }, [filteredExpenses]);

    // Available categories from expenses
    const availableCategories = useMemo(() => {
        const set = new Set<string>();
        expenseItems.forEach((e) => set.add(e.category));
        return Array.from(set);
    }, [expenseItems]);

    // Unique users for team filter
    const availableUsers = useMemo(() => {
        const set = new Set<string>();
        timesheetItems.forEach((t) => set.add(t.user.replace("[SAMPLE] ", "")));
        expenseItems.forEach((e) => set.add(e.user.replace("[SAMPLE] ", "")));
        return Array.from(set);
    }, [timesheetItems, expenseItems]);

    const activeCount = activeTab === "timesheet" ? filteredTimesheets.length : filteredExpenses.length;
    const hasSelection = selectedIds.length > 0;

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f5f7fa] p-8">
            {/* Toast feedback */}
            {toastMessage && (
                <div className="fixed top-16 right-8 z-50 bg-[#1e293b] text-white px-4 py-3 rounded shadow-xl flex items-center gap-3 text-xs animate-in slide-in-from-top duration-200">
                    <CheckCircle2 className="w-4 h-4 text-[#03a9f4]" />
                    <span>{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="text-gray-400 hover:text-white ml-2"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Top Bar: Segmented Tab Group [ APPROVALS | Timesheet | Expenses ] */}
            <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-stretch bg-white border border-[#d1d5db] rounded shadow-sm overflow-hidden h-9">
                    <div className="px-3.5 bg-[#f8fafc] text-[#64748b] font-semibold text-xs uppercase tracking-wider flex items-center border-r border-[#d1d5db]">
                        APPROVALS
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTab("timesheet")}
                        className={`px-4 text-xs font-medium flex items-center transition border-r border-[#d1d5db] cursor-pointer ${
                            activeTab === "timesheet"
                                ? "bg-white text-[#1e293b] font-semibold"
                                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                        }`}
                    >
                        Timesheet
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("expenses")}
                        className={`px-4 text-xs font-medium flex items-center transition cursor-pointer ${
                            activeTab === "expenses"
                                ? "bg-white text-[#1e293b] font-semibold"
                                : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]"
                        }`}
                    >
                        Expenses
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={resetSampleData}
                        className="text-xs text-[#64748b] hover:text-[#03a9f4] flex items-center gap-1.5 transition cursor-pointer"
                        title="Reset sample approval items"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Sample Data</span>
                    </button>
                </div>
            </div>

            {/* Status Navigation Tabs: PENDING / UNSUBMITTED / ARCHIVE */}
            <div className="flex items-center gap-1">
                {(["pending", "unsubmitted", "archive"] as ApprovalStatusTab[]).map((tab) => {
                    const isActive = statusTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setStatusTab(tab)}
                            className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t transition-colors cursor-pointer ${
                                isActive
                                    ? "bg-white text-[#1e293b] border-t border-l border-r border-[#e2e8f0] relative z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
                                    : "bg-[#eef2f6] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e293b]"
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Card with Border and Inner Toolbar */}
            <div className="bg-white border border-[#e2e8f0] rounded-b-md rounded-tr-md shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Filter Toolbar */}
                <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-4 bg-white">
                    {/* Left Dropdown Filters */}
                    <div className="flex items-center gap-3">
                        {/* Sort by: Date */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    setIsTeamOpen(false);
                                    setIsCategoryOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>
                                    Sort by:{" "}
                                    {sortBy === "date-desc"
                                        ? "Date"
                                        : sortBy === "date-asc"
                                        ? "Date (Oldest)"
                                        : "User"}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isSortOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-44 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSortBy("date-desc");
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                    >
                                        <span>Date (Newest first)</span>
                                        {sortBy === "date-desc" && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSortBy("date-asc");
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                    >
                                        <span>Date (Oldest first)</span>
                                        {sortBy === "date-asc" && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSortBy("user-asc");
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                    >
                                        <span>User name (A-Z)</span>
                                        {sortBy === "user-asc" && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Team Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTeamOpen(!isTeamOpen);
                                    setIsSortOpen(false);
                                    setIsCategoryOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>{teamFilter === "all" ? "Team" : teamFilter}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isTeamOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-48 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTeamFilter("all");
                                            setIsTeamOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                    >
                                        <span>All Team</span>
                                        {teamFilter === "all" && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                    </button>
                                    {availableUsers.map((user) => (
                                        <button
                                            key={user}
                                            type="button"
                                            onClick={() => {
                                                setTeamFilter(user);
                                                setIsTeamOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                        >
                                            <span>{user}</span>
                                            {teamFilter === user && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category Dropdown (Shown on Expenses Tab) */}
                        {activeTab === "expenses" && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCategoryOpen(!isCategoryOpen);
                                        setIsSortOpen(false);
                                        setIsTeamOpen(false);
                                    }}
                                    className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                                >
                                    <span>{categoryFilter === "all" ? "Category" : categoryFilter}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute left-0 top-9 mt-1 w-44 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoryFilter("all");
                                                setIsCategoryOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                        >
                                            <span>All Categories</span>
                                            {categoryFilter === "all" && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                        </button>
                                        {availableCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    setCategoryFilter(cat);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                            >
                                                <span>{cat}</span>
                                                {categoryFilter === cat && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={remindToApprove}
                            className="h-8 px-4 border border-[#03a9f4] hover:bg-[#e1f5fe] text-[#03a9f4] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                        >
                            <Bell className="w-3.5 h-3.5" />
                            <span>REMIND TO APPROVE</span>
                        </button>

                        {statusTab === "pending" && (
                            <>
                                {hasSelection && (
                                    <button
                                        type="button"
                                        onClick={rejectSelected}
                                        className="h-8 px-3.5 border border-[#ef4444] text-[#ef4444] hover:bg-[#fef2f2] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                    >
                                        REJECT ({selectedIds.length})
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={hasSelection ? approveSelected : approveAll}
                                    className="h-8 px-4 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                                >
                                    <span>
                                        {hasSelection
                                            ? `APPROVE (${selectedIds.length})`
                                            : "APPROVE ALL"}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Table Content Area */}
                <div className="flex-1 overflow-x-auto">
                    {activeCount === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mb-3">
                                <Filter className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#1e293b]">No {statusTab} {activeTab} approvals</h3>
                            <p className="text-xs text-[#64748b] mt-1 max-w-sm">
                                There are no items matching the selected filters.
                            </p>
                            <button
                                type="button"
                                onClick={resetSampleData}
                                className="mt-4 px-3 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded text-xs font-medium transition cursor-pointer"
                            >
                                Reset Sample Data
                            </button>
                        </div>
                    ) : activeTab === "timesheet" ? (
                        /* Timesheet Approvals Table */
                        <div className="divide-y divide-[#e2e8f0]">
                            {Object.entries(groupedTimesheets).map(([period, items]) => {
                                const itemIds = items.map((i) => i.id);
                                const isGroupAllSelected = itemIds.every((id) => selectedIds.includes(id));

                                return (
                                    <div key={period} className="flex flex-col">
                                        {/* Date Period Header matching screenshot */}
                                        <div className="bg-[#eceff1] px-4 py-2 text-xs font-medium text-[#374151]">
                                            {period}
                                        </div>

                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#e5e7eb] bg-white text-[#94a3b8] font-semibold text-[11px] uppercase tracking-wider">
                                                    <th className="py-2.5 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isGroupAllSelected}
                                                            onChange={() => selectAllInGroup(itemIds)}
                                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                                        />
                                                    </th>
                                                    <th className="py-2.5 px-4 font-semibold">USER</th>
                                                    <th className="py-2.5 px-4 font-semibold">TEAM MANAGER</th>
                                                    <th className="py-2.5 px-4 font-semibold">TIME</th>
                                                    <th className="py-2.5 px-4 font-semibold">TIME OFF</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f1f5f9] text-[#334155] bg-white">
                                                {items.map((row) => {
                                                    const isChecked = selectedIds.includes(row.id);
                                                    return (
                                                        <tr
                                                            key={row.id}
                                                            className={`hover:bg-[#f8fafc] transition ${
                                                                isChecked ? "bg-[#f0f9ff]" : ""
                                                            }`}
                                                        >
                                                            <td className="py-3 px-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleSelect(row.id)}
                                                                    className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="py-3 px-4 font-medium text-[#1e293b]">
                                                                {row.user}
                                                            </td>
                                                            <td className="py-3 px-4 text-[#64748b]">
                                                                {row.teamManager}
                                                            </td>
                                                            <td className="py-3 px-4 font-mono text-[#1e293b]">
                                                                {row.time}
                                                            </td>
                                                            <td className="py-3 px-4 font-mono text-[#64748b]">
                                                                {row.timeOff}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Expenses Approvals Table */
                        <div className="divide-y divide-[#e2e8f0]">
                            {Object.entries(groupedExpenses).map(([period, items]) => {
                                const itemIds = items.map((i) => i.id);
                                const isGroupAllSelected = itemIds.every((id) => selectedIds.includes(id));

                                return (
                                    <div key={period} className="flex flex-col">
                                        {/* Date Period Header matching screenshot */}
                                        <div className="bg-[#eceff1] px-4 py-2 text-xs font-medium text-[#374151]">
                                            {period}
                                        </div>

                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#e5e7eb] bg-white text-[#94a3b8] font-semibold text-[11px] uppercase tracking-wider">
                                                    <th className="py-2.5 px-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isGroupAllSelected}
                                                            onChange={() => selectAllInGroup(itemIds)}
                                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                                        />
                                                    </th>
                                                    <th className="py-2.5 px-4 font-semibold">USER</th>
                                                    <th className="py-2.5 px-4 font-semibold">TEAM MANAGER</th>
                                                    <th className="py-2.5 px-4 font-semibold">CATEGORY</th>
                                                    <th className="py-2.5 px-4 font-semibold">EXPENSES</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f1f5f9] text-[#334155] bg-white">
                                                {items.map((row) => {
                                                    const isChecked = selectedIds.includes(row.id);
                                                    return (
                                                        <tr
                                                            key={row.id}
                                                            className={`hover:bg-[#f8fafc] transition ${
                                                                isChecked ? "bg-[#f0f9ff]" : ""
                                                            }`}
                                                        >
                                                            <td className="py-3 px-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleSelect(row.id)}
                                                                    className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="py-3 px-4 font-medium text-[#1e293b]">
                                                                {row.user}
                                                            </td>
                                                            <td className="py-3 px-4 text-[#64748b]">
                                                                {row.teamManager}
                                                            </td>
                                                            <td className="py-3 px-4 text-[#475569]">
                                                                {row.category}
                                                            </td>
                                                            <td className="py-3 px-4 font-semibold text-[#1e293b]">
                                                                {row.amount.toFixed(2).replace(".", ",")} {row.currency}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
