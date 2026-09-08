import { useState, useMemo, useEffect } from "react";
import {
    useScheduleStore,
    ScheduleAssignment,
} from "@/stores/useScheduleStore";
import { useTeamStore } from "@/stores/useTeamStore";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Search,
    Plus,
    Minus,
    MoreVertical,
    BarChart2,
    Trash2,
} from "lucide-react";
import { ScheduleAddModal } from "./ScheduleAddModal";
import { RemoveSampleScheduleModal } from "./RemoveSampleScheduleModal";

// Helper to generate the day list dynamically
interface CalendarDay {
    dateStr: string; // YYYY-MM-DD
    dayNumber: string; // "31", "01", etc.
    dayOfWeek: string; // "Mon", "Tue", etc.
    isWeekend: boolean;
    isCurrentDay: boolean; // Aug 31, 2026 is current day in screenshot
    monthLabel: string; // "Aug - Sep" or "Sep"
    isWeekEndBoundary: boolean; // Sunday
}

function generateDays(startDateStr: string, endDateStr: string): CalendarDay[] {
    const days: CalendarDay[] = [];
    const parseLocal = (s: string) => {
        const parts = s.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };
    const start = parseLocal(startDateStr);
    const end = parseLocal(endDateStr);

    if (start > end) {
        end.setTime(start.getTime());
    }

    const todayStr = (() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    })();

    let current = new Date(start);
    while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const dayOfWeekNum = current.getDay();
        const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeekNum];
        const isWeekend = dayOfWeekNum === 0 || dayOfWeekNum === 6;
        const isCurrentDay = dateStr === todayStr || dateStr === "2026-08-31";

        const monthLabel = current.toLocaleString("en-US", { month: "short" });

        days.push({
            dateStr,
            dayNumber: day,
            dayOfWeek,
            isWeekend,
            isCurrentDay,
            monthLabel,
            isWeekEndBoundary: dayOfWeekNum === 0,
        });

        current.setDate(current.getDate() + 1);
    }
    return days;
}

export function SchedulePage() {
    const {
        activeTab,
        setActiveTab,
        hasSampleData,
        zoomLevel,
        zoomIn,
        zoomOut,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        isPublished,
        togglePublish,
        expandedProjectIds,
        expandedMemberIds,
        toggleProjectExpand,
        toggleMemberExpand,
        openAddModal,
        openRemoveSampleModal,
        restoreSampleData,
        deleteAssignment,
        loadFromBackend,
        assignments,
        dateRange,
        setDateRange,
        navigateDateRange,
    } = useScheduleStore();

    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    const { members } = useTeamStore();

    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [tempStart, setTempStart] = useState(dateRange.startDate);
    const [tempEnd, setTempEnd] = useState(dateRange.endDate);

    const days = useMemo(
        () => generateDays(dateRange.startDate, dateRange.endDate),
        [dateRange.startDate, dateRange.endDate]
    );

    const formattedDateRange = useMemo(() => {
        const parseLocal = (s: string) => {
            const [y, m, d] = s.split("-").map(Number);
            return new Date(y, m - 1, d);
        };
        const s = parseLocal(dateRange.startDate);
        const e = parseLocal(dateRange.endDate);

        const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return `${sStr} - ${eStr}`;
    }, [dateRange.startDate, dateRange.endDate]);

    const monthChunks = useMemo(() => {
        if (days.length === 0) return [];
        const chunks: { label: string; count: number }[] = [];
        let currentLabel = "";
        let currentCount = 0;

        days.forEach((day, idx) => {
            const [y, m, d] = day.dateStr.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);
            const label = dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });

            if (label !== currentLabel) {
                if (currentCount > 0) {
                    chunks.push({ label: currentLabel, count: currentCount });
                }
                currentLabel = label;
                currentCount = 1;
            } else {
                currentCount++;
            }

            if (idx === days.length - 1) {
                chunks.push({ label: currentLabel, count: currentCount });
            }
        });

        return chunks;
    }, [days]);

    // Column width according to zoom level
    const colWidth = zoomLevel === "compact" ? 36 : zoomLevel === "normal" ? 44 : 56;

    // Filtered assignments
    const filteredAssignments = useMemo(() => {
        return assignments.filter((a) => {
            if (filterStatus === "active" && a.totalHours <= 0) return false;
            if (filterStatus === "assigned" && !a.memberId) return false;
            if (filterStatus === "unassigned" && a.memberId) return false;

            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchProj = a.projectName.toLowerCase().includes(query);
                const matchClient = a.client.toLowerCase().includes(query);
                const matchMember = a.memberName.toLowerCase().includes(query);
                if (!matchProj && !matchClient && !matchMember) return false;
            }
            return true;
        });
    }, [assignments, filterStatus, searchQuery]);

    // Grouping for PROJECTS view
    const projectGroups = useMemo(() => {
        const map = new Map<string, {
            id: string;
            name: string;
            client: string;
            color: string;
            totalHours: number;
            assignments: ScheduleAssignment[];
        }>();

        filteredAssignments.forEach((a) => {
            if (!map.has(a.projectId)) {
                map.set(a.projectId, {
                    id: a.projectId,
                    name: a.projectName,
                    client: a.client,
                    color: a.projectColor,
                    totalHours: 0,
                    assignments: [],
                });
            }
            const group = map.get(a.projectId)!;
            group.totalHours += a.totalHours;
            group.assignments.push(a);
        });

        return Array.from(map.values());
    }, [filteredAssignments]);

    // Grouping for TEAM view
    const memberGroups = useMemo(() => {
        const map = new Map<string, {
            id: string;
            name: string;
            role: string;
            initials: string;
            avatarColor: string;
            totalHours: number;
            assignments: ScheduleAssignment[];
        }>();

        // Include all active workspace members
        members.forEach((m) => {
            const colors = ["#00897B", "#0288D1", "#F59E0B", "#EF4444", "#64748B", "#8B5CF6"];
            const hash = m.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const avatarColor = colors[hash % colors.length];

            map.set(m.id, {
                id: m.id,
                name: m.name.replace(" (you)", ""),
                role: m.role,
                initials: m.name.slice(0, 2).toUpperCase(),
                avatarColor,
                totalHours: 0,
                assignments: [],
            });
        });

        filteredAssignments.forEach((a) => {
            if (map.has(a.memberId)) {
                const group = map.get(a.memberId)!;
                group.totalHours += a.totalHours;
                group.assignments.push(a);
            } else {
                map.set(a.memberId, {
                    id: a.memberId,
                    name: a.memberName,
                    role: "Member",
                    initials: a.memberInitials,
                    avatarColor: a.memberAvatarColor,
                    totalHours: a.totalHours,
                    assignments: [a],
                });
            }
        });

        return Array.from(map.values());
    }, [filteredAssignments, members]);

    // Calculate position and span of an assignment block relative to the calendar days
    const getBlockStyle = (startDate: string, endDate: string) => {
        if (days.length === 0) return null;
        const firstDay = days[0].dateStr;
        const lastDay = days[days.length - 1].dateStr;

        // If completely outside the visible date range
        if (endDate < firstDay || startDate > lastDay) {
            return null;
        }

        let startIndex = days.findIndex((d) => d.dateStr === startDate);
        let endIndex = days.findIndex((d) => d.dateStr === endDate);

        if (startIndex < 0) startIndex = 0;
        if (endIndex < 0) endIndex = days.length - 1;

        const spanDays = Math.max(1, endIndex - startIndex + 1);

        const leftPx = startIndex * colWidth;
        const widthPx = spanDays * colWidth;

        return {
            left: `${leftPx}px`,
            width: `${widthPx}px`,
        };
    };

    // Calculate overall project span block
    const getProjectSpanStyle = (projAssignments: ScheduleAssignment[]) => {
        if (projAssignments.length === 0) return null;
        let minStart = projAssignments[0].startDate;
        let maxEnd = projAssignments[0].endDate;

        projAssignments.forEach((a) => {
            if (a.startDate < minStart) minStart = a.startDate;
            if (a.endDate > maxEnd) maxEnd = a.endDate;
        });

        return getBlockStyle(minStart, maxEnd);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            <div className="p-8 max-w-[1550px] w-full mx-auto space-y-5">
                {/* 1. Sample Data Banner matching Schedule.png */}
                {hasSampleData ? (
                    <div className="bg-[#E1F5FE]/70 border border-[#B3E5FC] px-4 py-3 rounded shadow-xs flex items-center justify-between">
                        <span className="text-xs text-[#0288D1] font-medium">
                            You are currently using sample data to help you explore.
                        </span>
                        <button
                            type="button"
                            onClick={openRemoveSampleModal}
                            className="bg-white border border-[#03A9F4] text-[#03A9F4] hover:bg-[#E1F5FE] text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded transition cursor-pointer shadow-2xs"
                        >
                            REMOVE SAMPLE DATA
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded flex items-center justify-between">
                        <span className="text-xs text-[#64748B]">
                            Sample data removed. You are viewing live workspace schedules.
                        </span>
                        <button
                            type="button"
                            onClick={restoreSampleData}
                            className="text-xs font-semibold text-[#03A9F4] hover:underline cursor-pointer"
                        >
                            Restore Sample Data
                        </button>
                    </div>
                )}

                {/* 2. Top Title and Navigation Header matching Schedule.png */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-normal text-[#1E293B]">Schedule</h1>

                    <div className="flex items-center gap-3">
                        {/* Histogram / Chart toggle button */}
                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E2E8F0] rounded hover:bg-[#F8FAFC] text-[#64748B] transition cursor-pointer shadow-2xs"
                            title="Schedule capacity analytics"
                        >
                            <BarChart2 className="w-4 h-4" />
                        </button>

                        {/* Date Range Selector matching Schedule.png */}
                        <div className="relative">
                            <div className="flex items-center bg-white border border-[#E2E8F0] rounded shadow-2xs text-xs text-[#334155]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTempStart(dateRange.startDate);
                                        setTempEnd(dateRange.endDate);
                                        setIsDatePickerOpen(!isDatePickerOpen);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 border-r border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer"
                                    title="Click to change date range"
                                >
                                    <Calendar className="w-4 h-4 text-[#03A9F4]" />
                                    <span className="font-medium">{formattedDateRange}</span>
                                    <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigateDateRange("prev")}
                                    className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] border-r border-[#E2E8F0] transition cursor-pointer"
                                    title="Previous month"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigateDateRange("next")}
                                    className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] transition cursor-pointer"
                                    title="Next month"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Date Picker Dropdown Popover */}
                            {isDatePickerOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setIsDatePickerOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#CBD5E1] rounded-lg shadow-xl z-40 p-4 text-xs text-[#334155] animate-in fade-in zoom-in-95 duration-150">
                                        <div className="font-bold text-[#1E293B] mb-2.5 pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
                                            <span>Select Date Range</span>
                                            <span className="text-[10px] text-[#64748B] font-normal">
                                                {days.length} days visible
                                            </span>
                                        </div>

                                        {/* Presets Grid */}
                                        <div className="mb-3">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                                                Presets
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDateRange({ startDate: "2026-08-31", endDate: "2026-09-30" });
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    className="px-2 py-1.5 text-left rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-medium transition cursor-pointer truncate"
                                                >
                                                    Aug 31 - Sep 30, 2026
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const d = new Date();
                                                        const start = new Date(d.getFullYear(), d.getMonth(), 1);
                                                        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                                                        const fmt = (x: Date) => {
                                                            const y = x.getFullYear();
                                                            const m = String(x.getMonth() + 1).padStart(2, "0");
                                                            const day = String(x.getDate()).padStart(2, "0");
                                                            return `${y}-${m}-${day}`;
                                                        };
                                                        setDateRange({ startDate: fmt(start), endDate: fmt(end) });
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    className="px-2 py-1.5 text-left rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-medium transition cursor-pointer truncate"
                                                >
                                                    This Month
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const d = new Date();
                                                        const start = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                                                        const end = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                                                        const fmt = (x: Date) => {
                                                            const y = x.getFullYear();
                                                            const m = String(x.getMonth() + 1).padStart(2, "0");
                                                            const day = String(x.getDate()).padStart(2, "0");
                                                            return `${y}-${m}-${day}`;
                                                        };
                                                        setDateRange({ startDate: fmt(start), endDate: fmt(end) });
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    className="px-2 py-1.5 text-left rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-medium transition cursor-pointer truncate"
                                                >
                                                    Next Month
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const parseLocal = (s: string) => {
                                                            const [y, m, d] = s.split("-").map(Number);
                                                            return new Date(y, m - 1, d);
                                                        };
                                                        const formatLocal = (d: Date) => {
                                                            const y = d.getFullYear();
                                                            const m = String(d.getMonth() + 1).padStart(2, "0");
                                                            const day = String(d.getDate()).padStart(2, "0");
                                                            return `${y}-${m}-${day}`;
                                                        };
                                                        const s = parseLocal(dateRange.startDate);
                                                        const e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 13);
                                                        setDateRange({ startDate: formatLocal(s), endDate: formatLocal(e) });
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    className="px-2 py-1.5 text-left rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-medium transition cursor-pointer truncate"
                                                >
                                                    Next 2 Weeks
                                                </button>
                                            </div>
                                        </div>

                                        {/* Custom Range */}
                                        <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                                Custom Dates
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[10px] text-[#64748B] mb-1">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={tempStart}
                                                        onChange={(e) => setTempStart(e.target.value)}
                                                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-[#64748B] mb-1">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={tempEnd}
                                                        onChange={(e) => setTempEnd(e.target.value)}
                                                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDatePickerOpen(false)}
                                                    className="px-2.5 py-1 text-xs text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (tempStart && tempEnd) {
                                                            if (tempStart <= tempEnd) {
                                                                setDateRange({ startDate: tempStart, endDate: tempEnd });
                                                                setIsDatePickerOpen(false);
                                                            } else {
                                                                alert("Start date cannot be after end date");
                                                            }
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold rounded shadow-2xs text-xs cursor-pointer"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Subtabs (PROJECTS / TEAM) */}
                <div className="flex items-center border-b border-[#E2E8F0] gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("projects")}
                        className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-t ${
                            activeTab === "projects"
                                ? "bg-white text-[#1E293B] border-t-2 border-t-[#03A9F4] border-x border-[#E2E8F0] -mb-[1px] shadow-2xs"
                                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                        }`}
                    >
                        PROJECTS
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("team")}
                        className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-t ${
                            activeTab === "team"
                                ? "bg-white text-[#1E293B] border-t-2 border-t-[#03A9F4] border-x border-[#E2E8F0] -mb-[1px] shadow-2xs"
                                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                        }`}
                    >
                        TEAM
                    </button>
                </div>

                {/* 4. Controls / Action Bar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {/* Show all Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="h-9 px-3 bg-white border border-[#E2E8F0] rounded text-xs text-[#334155] font-medium flex items-center gap-1.5 hover:bg-[#F8FAFC] shadow-2xs cursor-pointer"
                            >
                                <span>
                                    {filterStatus === "all"
                                        ? "Show all"
                                        : filterStatus === "active"
                                        ? "Active only"
                                        : filterStatus === "assigned"
                                        ? "Assigned only"
                                        : "Unassigned"}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                            </button>

                            {isFilterDropdownOpen && (
                                <div className="absolute left-0 mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs text-[#334155]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterStatus("all");
                                            setIsFilterDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer"
                                    >
                                        Show all
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterStatus("active");
                                            setIsFilterDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer"
                                    >
                                        Active only
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterStatus("assigned");
                                            setIsFilterDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer"
                                    >
                                        Assigned only
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search Input matching Search Projects or Clients */}
                        <div className="relative w-72">
                            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={activeTab === "projects" ? "Search Projects or Clients" : "Search Team Members"}
                                className="w-full h-9 pl-9 pr-3 bg-white border border-[#E2E8F0] rounded text-xs text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#03A9F4] shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Right side: PUBLISHED Button matching Schedule.png */}
                    <button
                        type="button"
                        onClick={togglePublish}
                        className={`h-9 px-5 text-xs font-bold uppercase tracking-wider rounded shadow-xs transition cursor-pointer ${
                            isPublished
                                ? "bg-[#03A9F4] hover:bg-[#0288D1] text-white"
                                : "bg-[#64748B] hover:bg-[#475569] text-white"
                        }`}
                        title={isPublished ? "All schedules are published to team" : "Draft changes pending publish"}
                    >
                        {isPublished ? "PUBLISHED" : "PUBLISH CHANGES"}
                    </button>
                </div>

                {/* 5. Main Gantt Timeline Grid Table */}
                <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
                    <div className="flex">
                        {/* Left Fixed Column: Entity Names (300px) */}
                        <div className="w-[300px] flex-shrink-0 border-r border-[#E2E8F0] bg-white flex flex-col z-10">
                            {/* Column Header */}
                            <div className="h-14 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 flex items-center justify-between text-xs text-[#64748B]">
                                {/* Zoom segmented buttons [ - | + ] */}
                                <div className="inline-flex border border-[#CBD5E1] rounded bg-white shadow-2xs overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={zoomOut}
                                        className="p-1 px-2 hover:bg-[#F1F5F9] border-r border-[#CBD5E1] text-[#475569] cursor-pointer"
                                        title="Zoom out"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={zoomIn}
                                        className="p-1 px-2 hover:bg-[#F1F5F9] text-[#475569] cursor-pointer"
                                        title="Zoom in"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <span className="font-semibold uppercase tracking-wider text-[11px]">
                                    Assigned
                                </span>
                            </div>

                            {/* Column Rows (PROJECTS View) */}
                            {activeTab === "projects" ? (
                                projectGroups.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-[#94A3B8]">
                                        No scheduled projects found
                                    </div>
                                ) : (
                                    projectGroups.map((proj) => {
                                        const isExpanded = expandedProjectIds.includes(proj.id);
                                        return (
                                            <div key={proj.id} className="border-b border-[#E2E8F0]">
                                                {/* Project Parent Row */}
                                                <div className="h-16 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {/* Light blue expand square [ v ] */}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleProjectExpand(proj.id)}
                                                            className="w-5 h-5 rounded bg-[#E1F5FE] text-[#03A9F4] flex items-center justify-center hover:bg-[#B3E5FC] transition cursor-pointer flex-shrink-0"
                                                        >
                                                            <ChevronDown
                                                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                                    isExpanded ? "rotate-0" : "-rotate-90"
                                                                }`}
                                                            />
                                                        </button>

                                                        {/* Project Color Circle */}
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: proj.color }}
                                                        />

                                                        {/* Title & Client */}
                                                        <div className="min-w-0 leading-tight">
                                                            <div className="text-xs font-semibold text-[#1E293B] truncate">
                                                                {proj.name}
                                                            </div>
                                                            <div className="text-[11px] text-[#94A3B8] truncate">
                                                                {proj.client}
                                                            </div>
                                                        </div>

                                                        {/* Action Dots */}
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setActionMenuId(
                                                                        actionMenuId === proj.id ? null : proj.id
                                                                    )
                                                                }
                                                                className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded cursor-pointer"
                                                            >
                                                                <MoreVertical className="w-3.5 h-3.5" />
                                                            </button>

                                                            {actionMenuId === proj.id && (
                                                                <div className="absolute left-0 mt-1 w-36 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs text-[#334155]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            openAddModal();
                                                                            setActionMenuId(null);
                                                                        }}
                                                                        className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center gap-1.5"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5 text-[#03A9F4]" />
                                                                        Add Shift
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Total Assigned Hours */}
                                                    <span className="text-xs font-medium text-[#1E293B]">
                                                        {proj.totalHours}h
                                                    </span>
                                                </div>

                                                {/* Sub-rows for assigned team members */}
                                                {isExpanded &&
                                                    proj.assignments.map((assignment) => (
                                                        <div
                                                            key={assignment.id}
                                                            className="h-10 pl-11 pr-4 bg-[#F8FAFC]/60 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#475569]"
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <div
                                                                    className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                                                                    style={{ backgroundColor: assignment.memberAvatarColor }}
                                                                >
                                                                    {assignment.memberInitials}
                                                                </div>
                                                                <span className="truncate">{assignment.memberName}</span>
                                                            </div>
                                                            <span className="text-[11px] text-[#64748B] font-mono">
                                                                {assignment.totalHours}h
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    })
                                )
                            ) : (
                                /* TEAM View column rows */
                                memberGroups.map((member) => {
                                    const isExpanded = expandedMemberIds.includes(member.id);
                                    return (
                                        <div key={member.id} className="border-b border-[#E2E8F0]">
                                            <div className="h-16 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMemberExpand(member.id)}
                                                        className="w-5 h-5 rounded bg-[#E1F5FE] text-[#03A9F4] flex items-center justify-center hover:bg-[#B3E5FC] transition cursor-pointer flex-shrink-0"
                                                    >
                                                        <ChevronDown
                                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                                isExpanded ? "rotate-0" : "-rotate-90"
                                                            }`}
                                                        />
                                                    </button>

                                                    <div
                                                        className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: member.avatarColor }}
                                                    >
                                                        {member.initials}
                                                    </div>

                                                    <div className="min-w-0 leading-tight">
                                                        <div className="text-xs font-semibold text-[#1E293B] truncate">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-[11px] text-[#94A3B8] truncate">
                                                            {member.role}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="text-xs font-medium text-[#1E293B]">
                                                    {member.totalHours}h
                                                </span>
                                            </div>

                                            {/* Sub-rows for member's projects */}
                                            {isExpanded &&
                                                member.assignments.map((assignment) => (
                                                    <div
                                                        key={assignment.id}
                                                        className="h-10 pl-12 pr-4 bg-[#F8FAFC]/60 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#475569]"
                                                    >
                                                        <div className="flex items-center gap-2 truncate">
                                                            <span
                                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: assignment.projectColor }}
                                                            />
                                                            <span className="truncate">{assignment.projectName}</span>
                                                        </div>
                                                        <span className="text-[11px] text-[#64748B] font-mono">
                                                            {assignment.totalHours}h
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Right Scrollable Timeline Grid */}
                        <div className="flex-1 overflow-x-auto relative">
                            {/* Inner container with width calculated from total days */}
                            <div
                                style={{ width: `${days.length * colWidth}px` }}
                                className="relative min-h-[400px]"
                            >
                                {/* Timeline Header (2 rows: Months, Days) */}
                                <div className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0]">
                                    {/* Month Labels row */}
                                    <div className="h-6 flex text-[11px] font-semibold text-[#64748B] bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                        {monthChunks.map((chunk, idx) => (
                                            <div
                                                key={idx}
                                                style={{ width: `${chunk.count * colWidth}px` }}
                                                className={`px-3 flex items-center truncate ${
                                                    idx < monthChunks.length - 1
                                                        ? "border-r border-dashed border-[#CBD5E1]"
                                                        : ""
                                                }`}
                                            >
                                                {chunk.label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Days Numbers row */}
                                    <div className="h-8 flex text-[11px] font-medium text-[#64748B] bg-[#F8FAFC]">
                                        {days.map((day) => (
                                            <div
                                                key={day.dateStr}
                                                style={{ width: `${colWidth}px` }}
                                                className={`flex-shrink-0 flex items-center justify-center relative border-r ${
                                                    day.isWeekEndBoundary
                                                        ? "border-dashed border-[#CBD5E1]"
                                                        : "border-[#F1F5F9]"
                                                } ${
                                                    day.isCurrentDay
                                                        ? "text-[#03A9F4] font-bold bg-[#E1F5FE]/40"
                                                        : day.isWeekend
                                                        ? "bg-[#F8FAFC]/90 text-[#94A3B8]"
                                                        : "text-[#475569]"
                                                }`}
                                            >
                                                {/* Blue pip marker on current day */}
                                                {day.isCurrentDay && (
                                                    <span className="absolute -top-1 w-1.5 h-1.5 bg-[#03A9F4] rounded-full" />
                                                )}
                                                <span>{day.dayNumber}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Grid Lines & Today Blue Line */}
                                <div className="absolute inset-0 top-14 pointer-events-none flex">
                                    {days.map((day) => (
                                        <div
                                            key={day.dateStr}
                                            style={{ width: `${colWidth}px` }}
                                            className={`flex-shrink-0 h-full border-r ${
                                                day.isWeekEndBoundary
                                                    ? "border-dashed border-[#CBD5E1]"
                                                    : "border-[#F1F5F9]"
                                            } ${day.isCurrentDay ? "bg-[#03A9F4]/5" : ""}`}
                                        >
                                            {/* Blue vertical marker guideline for today */}
                                            {day.isCurrentDay && (
                                                <div className="w-[1.5px] h-full bg-[#03A9F4]/60 mx-auto" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Timeline Rows (PROJECTS View) */}
                                {activeTab === "projects" ? (
                                    projectGroups.map((proj) => {
                                        const isExpanded = expandedProjectIds.includes(proj.id);
                                        const projectSpan = getProjectSpanStyle(proj.assignments);

                                        return (
                                            <div key={proj.id} className="border-b border-[#E2E8F0]">
                                                {/* Project Aggregated Row */}
                                                <div className="h-16 relative flex items-center">
                                                    {/* Aggregate Project Block */}
                                                    {projectSpan && (
                                                        <div
                                                            className="absolute h-9 rounded-sm flex flex-col justify-between overflow-hidden shadow-xs transition hover:brightness-95 cursor-pointer z-10"
                                                            style={{
                                                                left: projectSpan.left,
                                                                width: projectSpan.width,
                                                                backgroundColor:
                                                                    proj.id === "proj-alpha"
                                                                        ? "#FEF3C7" // Soft amber
                                                                        : proj.id === "proj-beta"
                                                                        ? "#FEE2E2" // Soft red
                                                                        : "#F5F5F4", // Soft tan/stone
                                                                border: `1px solid ${
                                                                    proj.id === "proj-alpha"
                                                                        ? "#FDE68A"
                                                                        : proj.id === "proj-beta"
                                                                        ? "#FECACA"
                                                                        : "#E7E5E4"
                                                                }`,
                                                            }}
                                                        >
                                                            {/* Project Gamma special Hatched V1 block matching screenshot */}
                                                            {proj.id === "proj-gamma" && (
                                                                <div className="flex h-full items-center">
                                                                    <div
                                                                        className="h-full flex items-center justify-center font-bold text-[10px] text-[#44403C] border-r border-[#CBD5E1]"
                                                                        style={{
                                                                            width: `${2 * colWidth}px`,
                                                                            backgroundImage:
                                                                                "repeating-linear-gradient(45deg, #E7E5E4, #E7E5E4 5px, #D6D3D1 5px, #D6D3D1 10px)",
                                                                        }}
                                                                    >
                                                                        V1
                                                                    </div>
                                                                    <div className="flex-1 px-2 text-[10px] text-[#57534E] font-medium truncate">
                                                                        Cluster Setup &amp; Release
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Solid bottom colored bar matching screenshot */}
                                                            <div
                                                                className="h-1 w-full mt-auto"
                                                                style={{ backgroundColor: proj.color }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Blue milestone line at bottom of Project Gamma matching screenshot */}
                                                    {proj.id === "proj-gamma" && (
                                                        <div
                                                            className="absolute bottom-1.5 h-1 bg-[#03A9F4] rounded-full z-10 shadow-2xs"
                                                            style={{
                                                                left: "0px",
                                                                width: `${12 * colWidth}px`,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Clickable transparent slots to add shift */}
                                                    {days.map((day) => (
                                                        <div
                                                            key={day.dateStr}
                                                            onClick={() => openAddModal()}
                                                            style={{ width: `${colWidth}px` }}
                                                            className="h-full flex-shrink-0 cursor-pointer hover:bg-[#03A9F4]/10 transition-colors"
                                                            title={`Click to schedule for ${day.dateStr}`}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Sub-rows for assigned team members */}
                                                {isExpanded &&
                                                    proj.assignments.map((assignment) => {
                                                        const assignBlock = getBlockStyle(
                                                            assignment.startDate,
                                                            assignment.endDate
                                                        );

                                                        return (
                                                            <div
                                                                key={assignment.id}
                                                                className="h-10 relative flex items-center border-t border-[#F1F5F9]"
                                                            >
                                                                {/* Individual Member Shift Block */}
                                                                {assignBlock && (
                                                                    <div
                                                                        className="absolute h-6 rounded px-2 text-[10px] font-semibold text-white flex items-center justify-between truncate shadow-2xs z-10 cursor-pointer hover:opacity-90 transition"
                                                                        style={{
                                                                            left: assignBlock.left,
                                                                            width: assignBlock.width,
                                                                            backgroundColor: assignment.projectColor,
                                                                        }}
                                                                        title={`${assignment.memberName} - ${assignment.totalHours}h (${assignment.hoursPerDay}h/day)`}
                                                                    >
                                                                        <span className="truncate">
                                                                            {assignment.memberName} ({assignment.hoursPerDay}h/d)
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                deleteAssignment(assignment.id);
                                                                            }}
                                                                            className="hover:text-[#FEE2E2] p-0.5 ml-1 transition cursor-pointer"
                                                                            title="Delete assignment"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {days.map((day) => (
                                                                    <div
                                                                        key={day.dateStr}
                                                                        onClick={() => openAddModal(assignment)}
                                                                        style={{ width: `${colWidth}px` }}
                                                                        className="h-full flex-shrink-0 cursor-pointer hover:bg-[#03A9F4]/5 transition-colors"
                                                                    />
                                                                ))}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        );
                                    })
                                ) : (
                                    /* TEAM View Timeline Rows */
                                    memberGroups.map((member) => {
                                        const isExpanded = expandedMemberIds.includes(member.id);

                                        return (
                                            <div key={member.id} className="border-b border-[#E2E8F0]">
                                                {/* Member Parent Row */}
                                                <div className="h-16 relative flex items-center">
                                                    {member.assignments.map((assignment) => {
                                                        const assignBlock = getBlockStyle(
                                                            assignment.startDate,
                                                            assignment.endDate
                                                        );
                                                        if (!assignBlock) return null;
                                                        return (
                                                            <div
                                                                key={assignment.id}
                                                                style={{
                                                                    left: assignBlock.left,
                                                                    width: assignBlock.width,
                                                                    backgroundColor: assignment.projectColor,
                                                                }}
                                                                className="absolute h-7 rounded px-2 text-[10px] font-semibold text-white flex items-center justify-between truncate shadow-2xs z-10 cursor-pointer hover:brightness-95 transition"
                                                                title={`${assignment.projectName} - ${assignment.totalHours}h`}
                                                            >
                                                                <span className="truncate">{assignment.projectName}</span>
                                                                <span className="font-mono text-[9px] bg-black/20 px-1 py-0.5 rounded">
                                                                    {assignment.totalHours}h
                                                                </span>
                                                            </div>
                                                        );
                                                    })}

                                                    {days.map((day) => (
                                                        <div
                                                            key={day.dateStr}
                                                            onClick={() => openAddModal()}
                                                            style={{ width: `${colWidth}px` }}
                                                            className="h-full flex-shrink-0 cursor-pointer hover:bg-[#03A9F4]/5 transition-colors"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Member Sub-rows */}
                                                {isExpanded &&
                                                    member.assignments.map((assignment) => {
                                                        const assignBlock = getBlockStyle(
                                                            assignment.startDate,
                                                            assignment.endDate
                                                        );
                                                        return (
                                                            <div
                                                                key={assignment.id}
                                                                className="h-10 relative flex items-center border-t border-[#F1F5F9]"
                                                            >
                                                                {assignBlock && (
                                                                    <div
                                                                        style={{
                                                                            left: assignBlock.left,
                                                                            width: assignBlock.width,
                                                                            borderColor: assignment.projectColor,
                                                                        }}
                                                                        className="absolute h-6 rounded bg-white border-l-4 px-2 text-[10px] font-medium text-[#1E293B] flex items-center justify-between truncate shadow-2xs z-10"
                                                                    >
                                                                        <span className="truncate">{assignment.projectName}</span>
                                                                        <span className="text-[10px] text-[#64748B]">
                                                                            {assignment.hoursPerDay}h/day
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {days.map((day) => (
                                                                    <div
                                                                        key={day.dateStr}
                                                                        style={{ width: `${colWidth}px` }}
                                                                        className="h-full flex-shrink-0"
                                                                    />
                                                                ))}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Bottom Action: + ADD PROJECT button matching Schedule.png */}
                <div className="pt-1">
                    <button
                        type="button"
                        onClick={() => openAddModal()}
                        className="border border-[#03A9F4] text-[#03A9F4] hover:bg-[#E1F5FE] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {activeTab === "projects" ? "ADD PROJECT" : "ADD ASSIGNMENT"}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <ScheduleAddModal />
            <RemoveSampleScheduleModal />
        </div>
    );
}
