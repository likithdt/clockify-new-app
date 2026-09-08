import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Minus,
  BarChart2,
  Trash2,
  Edit2,
  Flag,
  Users,
  Briefcase,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import { handleApiRoute } from "../backend/routes/apiRouter.ts";
import type {
  ScheduleAssignmentDTO,
  CreateScheduleAssignmentPayload,
  ScheduleSummaryDTO,
} from "../backend/types.ts";
import { ScheduleAddModal } from "../components/modals/ScheduleAddModal.tsx";
import { RemoveSampleScheduleModal } from "../components/modals/RemoveSampleScheduleModal.tsx";

// Helper to generate the day list for Aug 31 - Sep 30, 2026 (matching desktop)
interface CalendarDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: string; // "31", "01", etc.
  dayOfWeek: string; // "Mon", "Tue", etc.
  isWeekend: boolean;
  isCurrentDay: boolean; // Aug 31, 2026 is current day
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

export const ScheduleScreen: React.FC = () => {
  const [assignments, setAssignments] = useState<ScheduleAssignmentDTO[]>([]);
  const [summary, setSummary] = useState<ScheduleSummaryDTO | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "team">("projects");
  const [viewMode, setViewMode] = useState<"timeline" | "cards">("timeline");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "assigned">("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState<"compact" | "normal" | "spacious">("normal");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>(["proj-alpha", "proj-beta", "proj-gamma"]);
  const [expandedMemberIds, setExpandedMemberIds] = useState<string[]>(["tm-bindhu", "tm-likith", "tm-james", "tm-lara"]);

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: "2026-08-31",
    endDate: "2026-09-30",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempStart, setTempStart] = useState("2026-08-31");
  const [tempEnd, setTempEnd] = useState("2026-09-30");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<ScheduleAssignmentDTO | null>(null);
  const [isRemoveSampleModalOpen, setIsRemoveSampleModalOpen] = useState(false);

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

  const navigateDateRange = (direction: "prev" | "next") => {
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

    const currentStart = parseLocal(dateRange.startDate);
    const monthDelta = direction === "next" ? 1 : -1;
    const newStart = new Date(currentStart.getFullYear(), currentStart.getMonth() + monthDelta, 1);
    const newEnd = new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0);

    setDateRange({
      startDate: formatLocal(newStart),
      endDate: formatLocal(newEnd),
    });
  };

  // Column width according to zoom level
  const colWidth = zoomLevel === "compact" ? 34 : zoomLevel === "normal" ? 42 : 54;

  const loadData = async () => {
    const listRes = await handleApiRoute({
      method: "GET",
      path: "/api/schedule/assignments",
      query: {},
      body: null,
    });
    if (listRes.status === 200 && Array.isArray(listRes.data)) {
      setAssignments(listRes.data);
    }

    const sumRes = await handleApiRoute({
      method: "GET",
      path: "/api/schedule/summary",
      query: {},
      body: null,
    });
    if (sumRes.status === 200 && sumRes.data) {
      setSummary(sumRes.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hasSampleData = useMemo(() => {
    return assignments.some((a) => a.project_name.includes("[SAMPLE]"));
  }, [assignments]);

  // Toggle publish
  const handleTogglePublish = async () => {
    const res = await handleApiRoute({
      method: "POST",
      path: "/api/schedule/toggle-publish",
      query: {},
      body: null,
    });
    if (res.status === 200) {
      loadData();
    }
  };

  // Remove sample data
  const handleRemoveSampleData = async () => {
    await handleApiRoute({
      method: "POST",
      path: "/api/schedule/remove-sample",
      query: {},
      body: null,
    });
    loadData();
  };

  // Restore sample data
  const handleRestoreSampleData = async () => {
    await handleApiRoute({
      method: "POST",
      path: "/api/schedule/restore-sample",
      query: {},
      body: null,
    });
    loadData();
  };

  // Delete assignment
  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      await handleApiRoute({
        method: "DELETE",
        path: `/api/schedule/assignments/${id}`,
        query: {},
        body: null,
      });
      loadData();
    }
  };

  // Save (Create or Update) assignment
  const handleSaveAssignment = async (payload: CreateScheduleAssignmentPayload, editId?: string) => {
    if (editId) {
      await handleApiRoute({
        method: "PUT",
        path: `/api/schedule/assignments/${editId}`,
        query: {},
        body: payload,
      });
    } else {
      await handleApiRoute({
        method: "POST",
        path: "/api/schedule/assignments",
        query: {},
        body: payload,
      });
    }
    loadData();
  };

  // Filtering
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (filterStatus === "active" && a.total_hours <= 0) return false;
      if (filterStatus === "assigned" && !a.member_id) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProj = a.project_name.toLowerCase().includes(q);
        const matchClient = a.client.toLowerCase().includes(q);
        const matchMember = a.member_name.toLowerCase().includes(q);
        if (!matchProj && !matchClient && !matchMember) return false;
      }
      return true;
    });
  }, [assignments, filterStatus, searchQuery]);

  // Project groups
  const projectGroups = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      client: string;
      color: string;
      totalHours: number;
      assignments: ScheduleAssignmentDTO[];
    }>();

    filteredAssignments.forEach((a) => {
      if (!map.has(a.project_id)) {
        map.set(a.project_id, {
          id: a.project_id,
          name: a.project_name,
          client: a.client,
          color: a.project_color,
          totalHours: 0,
          assignments: [],
        });
      }
      const group = map.get(a.project_id)!;
      group.totalHours += a.total_hours;
      group.assignments.push(a);
    });

    return Array.from(map.values());
  }, [filteredAssignments]);

  // Member groups
  const memberGroups = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      initials: string;
      avatarColor: string;
      totalHours: number;
      assignments: ScheduleAssignmentDTO[];
    }>();

    filteredAssignments.forEach((a) => {
      if (!map.has(a.member_id)) {
        map.set(a.member_id, {
          id: a.member_id,
          name: a.member_name,
          initials: a.member_initials,
          avatarColor: a.member_avatar_color,
          totalHours: 0,
          assignments: [],
        });
      }
      const group = map.get(a.member_id)!;
      group.totalHours += a.total_hours;
      group.assignments.push(a);
    });

    return Array.from(map.values());
  }, [filteredAssignments]);

  const toggleProjectExpand = (id: string) => {
    setExpandedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMemberExpand = (id: string) => {
    setExpandedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Block style calculation
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

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0f1216] text-white overflow-y-auto select-none">
      {/* 1. Sample Data Banner */}
      {hasSampleData ? (
        <div className="bg-[#0288d1]/15 border-b border-[#03a9f4]/30 px-3.5 py-2 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#29b6f6] font-medium truncate pr-2">
            You are using sample data to explore.
          </span>
          <button
            type="button"
            onClick={() => setIsRemoveSampleModalOpen(true)}
            className="bg-[#00b0ff]/20 hover:bg-[#00b0ff]/30 text-[#00b0ff] border border-[#00b0ff]/50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer"
          >
            Remove Sample
          </button>
        </div>
      ) : (
        <div className="bg-[#181e25] border-b border-[#262e37] px-3.5 py-2 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#8c9ba5]">
            Viewing live workspace schedules.
          </span>
          <button
            type="button"
            onClick={handleRestoreSampleData}
            className="text-[11px] font-semibold text-[#00b0ff] hover:underline cursor-pointer"
          >
            Restore Sample Data
          </button>
        </div>
      )}

      {/* 2. Top Header & Actions Bar */}
      <div className="p-3.5 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Breadcrumb / Screen Title */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8c9ba5]">
              Workspace Planning
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Schedule</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Analytics toggle button */}
            <button
              type="button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-2 rounded-xl border transition-all ${
                showAnalytics
                  ? "bg-[#00b0ff]/20 border-[#00b0ff] text-[#00b0ff]"
                  : "bg-[#181e25] border-[#262e37] text-[#8c9ba5] hover:text-white"
              }`}
              title="Schedule capacity analytics"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Published / Publish Changes button */}
            <button
              type="button"
              onClick={handleTogglePublish}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 ${
                summary?.is_published
                  ? "bg-[#00b0ff] hover:bg-[#0091ea] text-white"
                  : "bg-[#28343f] hover:bg-[#344453] text-[#c2cbd4] border border-[#404e5d]"
              }`}
            >
              {summary?.is_published ? "PUBLISHED" : "PUBLISH"}
            </button>

            {/* + Add Shift button */}
            <button
              type="button"
              onClick={() => {
                setAssignmentToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#00b0ff] hover:bg-[#0091ea] text-white rounded-xl text-[11px] font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Shift</span>
            </button>
          </div>
        </div>

        {/* Analytics Capacity Panel (Collapsible) */}
        {showAnalytics && summary && (
          <div className="p-3 bg-[#181e25] border border-[#262e37] rounded-2xl grid grid-cols-3 gap-2 text-center animate-fadeIn">
            <div className="p-2 bg-[#12161b] rounded-xl border border-[#262e37]/60">
              <div className="text-[10px] text-[#8c9ba5] uppercase">Total Hours</div>
              <div className="text-base font-bold text-[#00b0ff]">
                {summary.total_scheduled_hours}h
              </div>
            </div>
            <div className="p-2 bg-[#12161b] rounded-xl border border-[#262e37]/60">
              <div className="text-[10px] text-[#8c9ba5] uppercase">Members</div>
              <div className="text-base font-bold text-white">
                {summary.total_members_scheduled}
              </div>
            </div>
            <div className="p-2 bg-[#12161b] rounded-xl border border-[#262e37]/60">
              <div className="text-[10px] text-[#8c9ba5] uppercase">Projects</div>
              <div className="text-base font-bold text-white">
                {summary.total_projects_scheduled}
              </div>
            </div>
          </div>
        )}

        {/* 3. Date Range Selector Bar */}
        <div className="relative">
          <div className="flex items-center justify-between bg-[#181e25] border border-[#262e37] rounded-2xl p-1.5 text-xs text-[#c2cbd4]">
            <button
              type="button"
              onClick={() => {
                setTempStart(dateRange.startDate);
                setTempEnd(dateRange.endDate);
                setIsDatePickerOpen(!isDatePickerOpen);
              }}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-white/5 transition cursor-pointer text-left"
              title="Click to change date range"
            >
              <Calendar className="w-4 h-4 text-[#00b0ff] shrink-0" />
              <span className="font-semibold text-white text-[11px] truncate">
                {formattedDateRange}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8c9ba5] shrink-0" />
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => navigateDateRange("prev")}
                className="p-1 rounded-lg hover:bg-white/5 text-[#8c9ba5] hover:text-white transition cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateDateRange("next")}
                className="p-1 rounded-lg hover:bg-white/5 text-[#8c9ba5] hover:text-white transition cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date Picker Popover Modal */}
          {isDatePickerOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
                onClick={() => setIsDatePickerOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#181e25] border border-[#262e37] rounded-2xl shadow-2xl z-50 p-4 text-xs text-[#c2cbd4] animate-in fade-in zoom-in-95 duration-150">
                <div className="font-bold text-white mb-2.5 pb-2 border-b border-[#262e37] flex items-center justify-between">
                  <span>Select Date Range</span>
                  <span className="text-[10px] text-[#8c9ba5] font-normal">
                    {days.length} days visible
                  </span>
                </div>

                {/* Presets Grid */}
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c9ba5] mb-1.5">
                    Presets
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDateRange({ startDate: "2026-08-31", endDate: "2026-09-30" });
                        setIsDatePickerOpen(false);
                      }}
                      className="px-2.5 py-2 text-left rounded-xl bg-[#12161b] hover:bg-white/5 border border-[#262e37] text-[11px] font-medium text-white transition cursor-pointer truncate"
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
                      className="px-2.5 py-2 text-left rounded-xl bg-[#12161b] hover:bg-white/5 border border-[#262e37] text-[11px] font-medium text-white transition cursor-pointer truncate"
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
                      className="px-2.5 py-2 text-left rounded-xl bg-[#12161b] hover:bg-white/5 border border-[#262e37] text-[11px] font-medium text-white transition cursor-pointer truncate"
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
                      className="px-2.5 py-2 text-left rounded-xl bg-[#12161b] hover:bg-white/5 border border-[#262e37] text-[11px] font-medium text-white transition cursor-pointer truncate"
                    >
                      Next 2 Weeks
                    </button>
                  </div>
                </div>

                {/* Custom Range */}
                <div className="space-y-2 pt-2 border-t border-[#262e37]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c9ba5]">
                    Custom Dates
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#8c9ba5] mb-1 font-medium">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={tempStart}
                        onChange={(e) => setTempStart(e.target.value)}
                        className="w-full bg-[#12161b] border border-[#262e37] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#8c9ba5] mb-1 font-medium">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={tempEnd}
                        onChange={(e) => setTempEnd(e.target.value)}
                        className="w-full bg-[#12161b] border border-[#262e37] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-3 py-1.5 text-xs text-[#8c9ba5] hover:text-white cursor-pointer"
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
                      className="px-3.5 py-1.5 bg-[#00b0ff] hover:bg-[#0091ea] text-white font-semibold rounded-xl shadow-md text-xs cursor-pointer transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. Subtabs: PROJECTS vs TEAM */}
        <div className="flex items-center border-b border-[#262e37] gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold uppercase tracking-wider transition relative ${
              activeTab === "projects"
                ? "text-[#00b0ff]"
                : "text-[#8c9ba5] hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects ({projectGroups.length})</span>
            {activeTab === "projects" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b0ff] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold uppercase tracking-wider transition relative ${
              activeTab === "team"
                ? "text-[#00b0ff]"
                : "text-[#8c9ba5] hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team ({memberGroups.length})</span>
            {activeTab === "team" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b0ff] rounded-full" />
            )}
          </button>
        </div>

        {/* 5. Toolbar: Search, Filters, View mode & Zoom */}
        <div className="flex items-center justify-between gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8c9ba5] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "projects" ? "Search Projects..." : "Search Members..."}
              className="w-full h-8 pl-8 pr-3 bg-[#181e25] border border-[#262e37] rounded-xl text-xs text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#00b0ff]"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-8 px-2.5 bg-[#181e25] border border-[#262e37] rounded-xl text-[11px] text-[#c2cbd4] flex items-center gap-1 hover:border-[#404e5d]"
            >
              <span>{filterStatus === "all" ? "All" : filterStatus === "active" ? "Active" : "Assigned"}</span>
              <ChevronDown className="w-3 h-3 text-[#8c9ba5]" />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-[#181e25] border border-[#262e37] rounded-xl shadow-2xl z-30 py-1 text-xs text-[#c2cbd4]">
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus("all");
                    setIsFilterDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5"
                >
                  Show all
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus("active");
                    setIsFilterDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5"
                >
                  Active only
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus("assigned");
                    setIsFilterDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/5"
                >
                  Assigned only
                </button>
              </div>
            )}
          </div>

          {/* View Mode Toggle: Timeline vs Cards */}
          <div className="flex items-center bg-[#181e25] border border-[#262e37] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "timeline" ? "bg-[#00b0ff] text-white" : "text-[#8c9ba5] hover:text-white"
              }`}
              title="Timeline view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-[#00b0ff] text-white" : "text-[#8c9ba5] hover:text-white"
              }`}
              title="Cards list view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls (visible in timeline mode) */}
          {viewMode === "timeline" && (
            <div className="flex items-center bg-[#181e25] border border-[#262e37] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => {
                  if (zoomLevel === "spacious") setZoomLevel("normal");
                  else if (zoomLevel === "normal") setZoomLevel("compact");
                }}
                className="p-1.5 text-[#8c9ba5] hover:text-white"
                title="Zoom out"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (zoomLevel === "compact") setZoomLevel("normal");
                  else if (zoomLevel === "normal") setZoomLevel("spacious");
                }}
                className="p-1.5 text-[#8c9ba5] hover:text-white"
                title="Zoom in"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Main View Area */}
      <div className="flex-1 min-h-0 px-3.5 pb-6 overflow-y-auto">
        {viewMode === "timeline" ? (
          /* GANTT TIMELINE VIEW */
          <div className="bg-[#181e25] border border-[#262e37] rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Split layout: Fixed Left Entity Column + Scrollable Right Day Timeline */}
            <div className="flex">
              {/* Left Column: Projects or Team Members (150px on mobile) */}
              <div className="w-[140px] sm:w-[170px] shrink-0 border-r border-[#262e37] bg-[#14181f] flex flex-col z-10">
                {/* Column Header */}
                <div className="h-12 border-b border-[#262e37] px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8c9ba5]">
                  <span>{activeTab === "projects" ? "Projects" : "Members"}</span>
                  <span>Hours</span>
                </div>

                {/* Left Rows */}
                {activeTab === "projects" ? (
                  projectGroups.map((proj) => {
                    const isExpanded = expandedProjectIds.includes(proj.id);
                    return (
                      <div key={proj.id} className="border-b border-[#262e37]">
                        {/* Parent Project Row */}
                        <div className="h-14 px-2.5 flex items-center justify-between hover:bg-white/5 transition">
                          <div className="flex items-center gap-1.5 min-w-0 pr-1">
                            <button
                              type="button"
                              onClick={() => toggleProjectExpand(proj.id)}
                              className="w-4 h-4 rounded bg-[#00b0ff]/20 text-[#00b0ff] flex items-center justify-center shrink-0"
                            >
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${
                                  isExpanded ? "rotate-0" : "-rotate-90"
                                }`}
                              />
                            </button>
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: proj.color }}
                            />
                            <div className="truncate min-w-0 leading-tight">
                              <div className="text-[11px] font-semibold text-white truncate">
                                {proj.name.replace("[SAMPLE] ", "")}
                              </div>
                              <div className="text-[9px] text-[#8c9ba5] truncate">
                                {proj.client.replace("[SAMPLE] ", "")}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#00b0ff] shrink-0">
                            {proj.totalHours}h
                          </span>
                        </div>

                        {/* Sub-rows for assigned team members */}
                        {isExpanded &&
                          proj.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="h-10 pl-6 pr-2.5 bg-[#0f1216]/60 border-t border-[#262e37]/50 flex items-center justify-between text-[10px] text-[#8c9ba5]"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <div
                                  className="w-4 h-4 rounded-full text-white text-[8px] font-bold flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: assignment.member_avatar_color }}
                                >
                                  {assignment.member_initials}
                                </div>
                                <span className="truncate text-white">{assignment.member_name}</span>
                              </div>
                              <span className="font-mono text-[10px] text-[#00b0ff]">
                                {assignment.total_hours}h
                              </span>
                            </div>
                          ))}
                      </div>
                    );
                  })
                ) : (
                  memberGroups.map((member) => {
                    const isExpanded = expandedMemberIds.includes(member.id);
                    return (
                      <div key={member.id} className="border-b border-[#262e37]">
                        <div className="h-14 px-2.5 flex items-center justify-between hover:bg-white/5 transition">
                          <div className="flex items-center gap-1.5 min-w-0 pr-1">
                            <button
                              type="button"
                              onClick={() => toggleMemberExpand(member.id)}
                              className="w-4 h-4 rounded bg-[#00b0ff]/20 text-[#00b0ff] flex items-center justify-center shrink-0"
                            >
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${
                                  isExpanded ? "rotate-0" : "-rotate-90"
                                }`}
                              />
                            </button>
                            <div
                              className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                              style={{ backgroundColor: member.avatarColor }}
                            >
                              {member.initials}
                            </div>
                            <span className="text-[11px] font-semibold text-white truncate">
                              {member.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-[#00b0ff] shrink-0">
                            {member.totalHours}h
                          </span>
                        </div>

                        {/* Member project sub-rows */}
                        {isExpanded &&
                          member.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="h-10 pl-6 pr-2.5 bg-[#0f1216]/60 border-t border-[#262e37]/50 flex items-center justify-between text-[10px] text-[#8c9ba5]"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: assignment.project_color }}
                                />
                                <span className="truncate text-white">
                                  {assignment.project_name.replace("[SAMPLE] ", "")}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-[#00b0ff]">
                                {assignment.total_hours}h
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
                <div
                  style={{ width: `${days.length * colWidth}px` }}
                  className="relative min-h-[300px]"
                >
                  {/* Timeline Header (Months + Days) */}
                  <div className="sticky top-0 z-20 bg-[#14181f] border-b border-[#262e37]">
                    {/* Month Labels row */}
                    <div className="h-5 flex text-[10px] font-semibold text-[#8c9ba5] bg-[#101419] border-b border-[#262e37]">
                      {monthChunks.map((chunk, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${chunk.count * colWidth}px` }}
                          className={`px-2 flex items-center truncate ${
                            idx < monthChunks.length - 1
                              ? "border-r border-dashed border-[#262e37]"
                              : ""
                          }`}
                        >
                          {chunk.label}
                        </div>
                      ))}
                    </div>

                    {/* Days row */}
                    <div className="h-7 flex text-[10px] font-medium text-[#8c9ba5]">
                      {days.map((day) => (
                        <div
                          key={day.dateStr}
                          style={{ width: `${colWidth}px` }}
                          className={`shrink-0 flex flex-col items-center justify-center border-r relative ${
                            day.isWeekEndBoundary ? "border-dashed border-[#344453]" : "border-[#262e37]"
                          } ${
                            day.isCurrentDay
                              ? "bg-[#00b0ff]/20 text-[#00b0ff] font-bold"
                              : day.isWeekend
                              ? "bg-[#101419] text-[#64748b]"
                              : "text-[#c2cbd4]"
                          }`}
                        >
                          <span className="text-[8px] uppercase leading-none opacity-70">
                            {day.dayOfWeek}
                          </span>
                          <span className="text-[10px] font-semibold leading-none mt-0.5">
                            {day.dayNumber}
                          </span>
                          {day.isCurrentDay && (
                            <span className="absolute top-0.5 w-1 h-1 rounded-full bg-[#00b0ff]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Background Grid Lines & Today Guideline */}
                  <div className="absolute inset-0 top-12 pointer-events-none flex">
                    {days.map((day) => (
                      <div
                        key={day.dateStr}
                        style={{ width: `${colWidth}px` }}
                        className={`shrink-0 h-full border-r ${
                          day.isWeekEndBoundary ? "border-dashed border-[#344453]" : "border-[#262e37]"
                        } ${day.isCurrentDay ? "bg-[#00b0ff]/5" : ""}`}
                      >
                        {day.isCurrentDay && (
                          <div className="w-[1.5px] h-full bg-[#00b0ff]/70 mx-auto" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Timeline Rows (PROJECTS View) */}
                  {activeTab === "projects" ? (
                    projectGroups.map((proj) => {
                      const isExpanded = expandedProjectIds.includes(proj.id);
                      return (
                        <div key={proj.id} className="border-b border-[#262e37]">
                          {/* Project parent row timeline bar */}
                          <div className="h-14 relative flex items-center">
                            {proj.assignments.map((assignment) => {
                              const block = getBlockStyle(assignment.start_date, assignment.end_date);
                              if (!block) return null;
                              return (
                                <div
                                  key={assignment.id}
                                  onClick={() => {
                                    setAssignmentToEdit(assignment);
                                    setIsAddModalOpen(true);
                                  }}
                                  style={{
                                    left: block.left,
                                    width: block.width,
                                    backgroundColor: assignment.project_color + "33",
                                    border: `1px solid ${assignment.project_color}`,
                                  }}
                                  className={`absolute h-8 rounded-lg px-2 flex items-center justify-between cursor-pointer hover:brightness-110 transition shadow-sm overflow-hidden text-[10px] ${
                                    assignment.is_hatched ? "bg-stripes" : ""
                                  }`}
                                  title={`${assignment.project_name}: ${assignment.member_name} (${assignment.total_hours}h)`}
                                >
                                  <div className="flex items-center gap-1 truncate text-white font-medium">
                                    {assignment.is_milestone_active && (
                                      <Flag className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                    )}
                                    {assignment.version_label && (
                                      <span className="px-1 py-0.2 bg-black/40 rounded text-[8px] font-bold text-amber-300">
                                        {assignment.version_label}
                                      </span>
                                    )}
                                    <span className="truncate">{assignment.member_name}</span>
                                  </div>
                                  <span className="font-mono font-bold text-[9px] text-white shrink-0 ml-1">
                                    {assignment.total_hours}h
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Sub-rows for each assignment */}
                          {isExpanded &&
                            proj.assignments.map((assignment) => {
                              const block = getBlockStyle(assignment.start_date, assignment.end_date);
                              if (!block) return null;
                              return (
                                <div
                                  key={assignment.id}
                                  className="h-10 relative flex items-center border-t border-[#262e37]/50"
                                >
                                  <div
                                    onClick={() => {
                                      setAssignmentToEdit(assignment);
                                      setIsAddModalOpen(true);
                                    }}
                                    style={{
                                      left: block.left,
                                      width: block.width,
                                      backgroundColor: assignment.project_color,
                                    }}
                                    className="absolute h-6 rounded-md px-2 flex items-center justify-between text-white text-[9px] font-semibold cursor-pointer shadow-md overflow-hidden"
                                  >
                                    <span className="truncate">{assignment.note || assignment.member_name}</span>
                                    <span className="font-mono shrink-0 ml-1">{assignment.total_hours}h</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })
                  ) : (
                    /* Timeline Rows (TEAM View) */
                    memberGroups.map((member) => {
                      const isExpanded = expandedMemberIds.includes(member.id);
                      return (
                        <div key={member.id} className="border-b border-[#262e37]">
                          <div className="h-14 relative flex items-center">
                            {member.assignments.map((assignment) => {
                              const block = getBlockStyle(assignment.start_date, assignment.end_date);
                              if (!block) return null;
                              return (
                                <div
                                  key={assignment.id}
                                  onClick={() => {
                                    setAssignmentToEdit(assignment);
                                    setIsAddModalOpen(true);
                                  }}
                                  style={{
                                    left: block.left,
                                    width: block.width,
                                    backgroundColor: assignment.project_color + "33",
                                    border: `1px solid ${assignment.project_color}`,
                                  }}
                                  className="absolute h-8 rounded-lg px-2 flex items-center justify-between cursor-pointer hover:brightness-110 transition shadow-sm overflow-hidden text-[10px]"
                                  title={`${assignment.project_name} (${assignment.total_hours}h)`}
                                >
                                  <div className="flex items-center gap-1 truncate text-white font-medium">
                                    <span className="truncate">{assignment.project_name.replace("[SAMPLE] ", "")}</span>
                                  </div>
                                  <span className="font-mono font-bold text-[9px] text-white shrink-0 ml-1">
                                    {assignment.total_hours}h
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Member assignment sub-rows */}
                          {isExpanded &&
                            member.assignments.map((assignment) => {
                              const block = getBlockStyle(assignment.start_date, assignment.end_date);
                              if (!block) return null;
                              return (
                                <div
                                  key={assignment.id}
                                  className="h-10 relative flex items-center border-t border-[#262e37]/50"
                                >
                                  <div
                                    onClick={() => {
                                      setAssignmentToEdit(assignment);
                                      setIsAddModalOpen(true);
                                    }}
                                    style={{
                                      left: block.left,
                                      width: block.width,
                                      backgroundColor: assignment.project_color,
                                    }}
                                    className="absolute h-6 rounded-md px-2 flex items-center justify-between text-white text-[9px] font-semibold cursor-pointer shadow-md overflow-hidden"
                                  >
                                    <span className="truncate">{assignment.note || assignment.project_name}</span>
                                    <span className="font-mono shrink-0 ml-1">{assignment.total_hours}h</span>
                                  </div>
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
        ) : (
          /* CARD LIST VIEW (Optimized for Mobile Inspection) */
          <div className="space-y-3">
            {activeTab === "projects" ? (
              projectGroups.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8c9ba5] bg-[#181e25] rounded-2xl border border-[#262e37]">
                  No scheduled projects match your search/filter
                </div>
              ) : (
                projectGroups.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#181e25] border border-[#262e37] rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Project Header */}
                    <div className="p-3.5 flex items-center justify-between bg-[#14181f] border-b border-[#262e37]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: proj.color }}
                        />
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-white truncate">{proj.name}</h3>
                          <p className="text-[10px] text-[#8c9ba5] truncate">{proj.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#00b0ff] bg-[#00b0ff]/10 px-2 py-0.5 rounded-md border border-[#00b0ff]/20">
                          {proj.totalHours}h
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAssignmentToEdit(null);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#8c9ba5] hover:text-white"
                          title="Add shift to project"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#00b0ff]" />
                        </button>
                      </div>
                    </div>

                    {/* Shifts inside Project */}
                    <div className="p-3 space-y-2">
                      {proj.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-3 rounded-xl bg-[#1f262e] border border-[#2b3540] flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm"
                                style={{ backgroundColor: assignment.member_avatar_color }}
                              >
                                {assignment.member_initials}
                              </div>
                              <span className="text-xs font-semibold text-white">
                                {assignment.member_name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignmentToEdit(assignment);
                                  setIsAddModalOpen(true);
                                }}
                                className="p-1 rounded-lg hover:bg-white/10 text-[#8c9ba5] hover:text-white transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="p-1 rounded-lg hover:bg-red-500/10 text-[#8c9ba5] hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8c9ba5]">
                            <span className="bg-[#14181f] px-2 py-0.5 rounded-md border border-[#262e37] text-[#c2cbd4]">
                              📅 {assignment.start_date} → {assignment.end_date}
                            </span>
                            <span className="bg-[#14181f] px-2 py-0.5 rounded-md border border-[#262e37] text-[#00b0ff] font-semibold">
                              ⏱️ {assignment.hours_per_day}h/day ({assignment.total_hours}h total)
                            </span>
                            {assignment.version_label && (
                              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                                {assignment.version_label}
                              </span>
                            )}
                            {assignment.is_milestone_active && (
                              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                <Flag className="w-2.5 h-2.5" /> Milestone
                              </span>
                            )}
                          </div>

                          {assignment.note && (
                            <p className="text-[11px] text-[#94a3b8] italic bg-[#14181f]/70 p-2 rounded-lg border border-[#262e37]/60">
                              "{assignment.note}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : (
              /* TEAM VIEW CARDS */
              memberGroups.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8c9ba5] bg-[#181e25] rounded-2xl border border-[#262e37]">
                  No team members match your search/filter
                </div>
              ) : (
                memberGroups.map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#181e25] border border-[#262e37] rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Member Header */}
                    <div className="p-3.5 flex items-center justify-between bg-[#14181f] border-b border-[#262e37]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: member.avatarColor }}
                        >
                          {member.initials}
                        </div>
                        <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                      </div>
                      <span className="text-xs font-bold text-[#00b0ff] bg-[#00b0ff]/10 px-2 py-0.5 rounded-md border border-[#00b0ff]/20">
                        {member.totalHours}h
                      </span>
                    </div>

                    {/* Member's Shifts */}
                    <div className="p-3 space-y-2">
                      {member.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-3 rounded-xl bg-[#1f262e] border border-[#2b3540] flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: assignment.project_color }}
                              />
                              <span className="text-xs font-semibold text-white truncate">
                                {assignment.project_name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignmentToEdit(assignment);
                                  setIsAddModalOpen(true);
                                }}
                                className="p-1 rounded-lg hover:bg-white/10 text-[#8c9ba5] hover:text-white transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="p-1 rounded-lg hover:bg-red-500/10 text-[#8c9ba5] hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8c9ba5]">
                            <span className="bg-[#14181f] px-2 py-0.5 rounded-md border border-[#262e37] text-[#c2cbd4]">
                              📅 {assignment.start_date} → {assignment.end_date}
                            </span>
                            <span className="bg-[#14181f] px-2 py-0.5 rounded-md border border-[#262e37] text-[#00b0ff] font-semibold">
                              ⏱️ {assignment.hours_per_day}h/day ({assignment.total_hours}h total)
                            </span>
                          </div>

                          {assignment.note && (
                            <p className="text-[11px] text-[#94a3b8] italic bg-[#14181f]/70 p-2 rounded-lg border border-[#262e37]/60">
                              "{assignment.note}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Shift Modal */}
      <ScheduleAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAssignmentToEdit(null);
        }}
        onSave={handleSaveAssignment}
        assignmentToEdit={assignmentToEdit}
      />

      {/* Remove Sample Schedule Modal */}
      <RemoveSampleScheduleModal
        isOpen={isRemoveSampleModalOpen}
        onClose={() => setIsRemoveSampleModalOpen(false)}
        onConfirm={handleRemoveSampleData}
      />
    </div>
  );
};
