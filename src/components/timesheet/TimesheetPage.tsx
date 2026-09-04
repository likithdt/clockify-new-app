import { useState, useMemo } from "react";
import { useTimesheetStore, TimesheetRow } from "@/stores/useTimesheetStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTeamStore } from "@/stores/useTeamStore";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Copy,
    Bookmark,
    Menu,
    Search,
} from "lucide-react";

// Formatting helper: seconds -> "hh:mm:ss"
function formatSecondsToHms(totalSeconds: number): string {
    if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
        return "00:00:00";
    }
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Parse user input (e.g. "2", "2.5", "2:30", "02:30:00", "8h", "45m") into seconds
function parseInputToSeconds(val: string): number {
    const str = val.trim().toLowerCase();
    if (!str) return 0;

    // e.g. "2h" or "2.5h"
    if (str.endsWith("h")) {
        const num = parseFloat(str.replace("h", ""));
        return isNaN(num) ? 0 : Math.round(num * 3600);
    }
    // e.g. "30m"
    if (str.endsWith("m")) {
        const num = parseFloat(str.replace("m", ""));
        return isNaN(num) ? 0 : Math.round(num * 60);
    }
    // e.g. "hh:mm:ss" or "hh:mm"
    if (str.includes(":")) {
        const parts = str.split(":").map((p) => parseInt(p, 10) || 0);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 3600 + parts[1] * 60;
        }
    }
    // Plain number e.g. "2" or "1.5" -> interpreted as hours
    const num = parseFloat(str);
    if (!isNaN(num)) {
        return Math.round(num * 3600);
    }
    return 0;
}

export function TimesheetPage() {
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

    const [isTeammatesDropdownOpen, setIsTeammatesDropdownOpen] = useState(false);
    const [projectDropdownRowId, setProjectDropdownRowId] = useState<string | null>(null);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Calculate 7 days of the active week (Monday to Sunday)
    const weekDays = useMemo(() => {
        const start = new Date(activeWeekStart);
        const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const dayNum = String(d.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${dayNum}`;

            const label = `${dayNames[i]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;

            return {
                dateStr,
                label,
                dayIndex: i,
            };
        });
    }, [activeWeekStart]);

    // Active teammate info
    const currentTeammate = useMemo(() => {
        return (
            members.find((m) => m.id === selectedTeammateId) || {
                id: "tm-bindhu",
                name: "Bindhu shree (you)",
                role: "Owner",
            }
        );
    }, [members, selectedTeammateId]);

    // Filter projects for dropdown
    const filteredProjects = useMemo(() => {
        if (!projectSearchQuery.trim()) return projects;
        const q = projectSearchQuery.toLowerCase();
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.client && p.client.toLowerCase().includes(q))
        );
    }, [projects, projectSearchQuery]);

    // Calculate day totals across all rows
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

    // Calculate grand total across all rows and days
    const grandTotalSeconds = useMemo(() => {
        return Object.values(dayTotals).reduce((sum, sec) => sum + sec, 0);
    }, [dayTotals]);

    // Calculate row total
    const getRowTotalSeconds = (row: TimesheetRow) => {
        return weekDays.reduce((sum, wd) => sum + (row.dayHours[wd.dateStr] || 0), 0);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            <div className="p-8 max-w-[1400px] w-full mx-auto space-y-6">
                {/* 1. Top Activation Card matching TimeSheet.png */}
                <div className="bg-white border border-[#E2E8F0] rounded-md p-6 shadow-xs space-y-3">
                    <h2 className="text-base font-semibold text-[#1E293B]">Timesheet</h2>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                        Enter time on tasks and projects using a weekly timesheet view. While
                        activated, project is a required field for the whole workspace.
                    </p>

                    {/* Toggle Switch perfectly aligned matching TimeSheet.png */}
                    <div className="flex items-center gap-2.5 pt-1">
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
                            className="text-xs font-normal text-[#1E293B] cursor-pointer select-none leading-none flex items-center"
                        >
                            Activate timesheet
                        </label>
                    </div>
                </div>

                {/* 2. Main Timesheet Header & Controls matching TimeSheet.png */}
                <div className="flex items-center justify-between">
                    <h1
                        className={`text-2xl font-normal ${
                            isActivated ? "text-[#1E293B]" : "text-[#94A3B8]"
                        }`}
                    >
                        Timesheet
                    </h1>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        {/* Teammates Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsTeammatesDropdownOpen(!isTeammatesDropdownOpen)}
                                title={`Currently viewing: ${currentTeammate.name}`}
                                className="h-9 px-3 bg-white border border-[#E2E8F0] rounded text-xs text-[#64748B] font-medium flex items-center gap-1.5 hover:bg-[#F8FAFC] shadow-2xs cursor-pointer"
                            >
                                <span>Teammates</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                            </button>

                            {isTeammatesDropdownOpen && (
                                <div className="absolute right-0 mt-1 w-56 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs text-[#334155]">
                                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider border-b border-[#F1F5F9]">
                                        Select Teammate
                                    </div>
                                    {members.map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTeammateId(m.id);
                                                setIsTeammatesDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between cursor-pointer ${
                                                selectedTeammateId === m.id
                                                    ? "bg-[#E1F5FE] text-[#0288D1] font-semibold"
                                                    : ""
                                            }`}
                                        >
                                            <span className="truncate">{m.name}</span>
                                            <span className="text-[10px] text-[#94A3B8] ml-2">
                                                {m.role}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* List/Grid View Button */}
                        <button
                            type="button"
                            className="w-9 h-9 flex items-center justify-center bg-white border border-[#E2E8F0] rounded text-[#94A3B8] hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
                            title="Table view"
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        {/* Week Navigator */}
                        <div className="flex items-center bg-white border border-[#E2E8F0] rounded shadow-2xs text-xs text-[#334155]">
                            <button
                                type="button"
                                onClick={() => navigateWeek("current")}
                                className="flex items-center gap-2 px-3 py-2 border-r border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer"
                            >
                                <Calendar className="w-4 h-4 text-[#94A3B8]" />
                                <span className="font-normal text-[#64748B]">This week</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigateWeek("prev")}
                                className="p-2 hover:bg-[#F8FAFC] text-[#94A3B8] border-r border-[#E2E8F0] transition cursor-pointer"
                                title="Previous week"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => navigateWeek("next")}
                                className="p-2 hover:bg-[#F8FAFC] text-[#94A3B8] transition cursor-pointer"
                                title="Next week"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Timesheet Table matching TimeSheet.png */}
                <div className="bg-white border border-[#E2E8F0] rounded shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Table Header matching TimeSheet.png */}
                            <thead>
                                <tr className="border-b border-[#E2E8F0] text-xs font-normal text-[#94A3B8] bg-white h-11">
                                    <th className="pl-6 pr-4 font-normal w-[320px]">Projects</th>
                                    {weekDays.map((day) => (
                                        <th
                                            key={day.dateStr}
                                            className="px-2 font-normal text-center w-[84px]"
                                        >
                                            {day.label}
                                        </th>
                                    ))}
                                    <th className="px-4 font-normal text-right w-[100px]">
                                        Total:
                                    </th>
                                    <th className="w-10 pr-4"></th>
                                </tr>
                            </thead>

                            {/* Table Rows */}
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {rows.map((row) => {
                                    const rowTotalSeconds = getRowTotalSeconds(row);

                                    return (
                                        <tr
                                            key={row.id}
                                            className="h-14 hover:bg-[#FBFCFD] transition"
                                        >
                                            {/* Column 1: Project Picker */}
                                            <td className="pl-6 pr-4 relative">
                                                {row.projectId ? (
                                                    <div className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span
                                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                                style={{
                                                                    backgroundColor:
                                                                        row.projectColor || "#03A9F4",
                                                                }}
                                                            />
                                                            <div className="truncate">
                                                                <div className="text-xs font-medium text-[#1E293B] truncate">
                                                                    {row.projectName}
                                                                </div>
                                                                {row.client && (
                                                                    <div className="text-[11px] text-[#94A3B8] truncate">
                                                                        {row.client}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setProjectDropdownRowId(
                                                                    projectDropdownRowId === row.id
                                                                        ? null
                                                                        : row.id
                                                                )
                                                            }
                                                            className="opacity-0 group-hover:opacity-100 text-[11px] text-[#03A9F4] hover:underline cursor-pointer ml-2"
                                                        >
                                                            Change
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* Empty State matching "Select project" in TimeSheet.png */
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setProjectDropdownRowId(
                                                                projectDropdownRowId === row.id
                                                                    ? null
                                                                    : row.id
                                                                )
                                                            }
                                                            className="flex items-center gap-2 text-xs text-[#03A9F4] hover:underline cursor-pointer group"
                                                        >
                                                            <div className="w-4 h-4 rounded-full border border-dashed border-[#03A9F4] flex items-center justify-center text-[11px] group-hover:scale-105 transition">
                                                                +
                                                            </div>
                                                            <span>Select project</span>
                                                        </button>
                                                )}

                                                {/* Project Dropdown Menu */}
                                                {projectDropdownRowId === row.id && (
                                                    <div className="absolute left-6 top-12 w-72 bg-white border border-[#E2E8F0] rounded shadow-xl z-40 p-2 text-xs">
                                                        <div className="relative mb-2">
                                                            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2" />
                                                            <input
                                                                type="text"
                                                                value={projectSearchQuery}
                                                                onChange={(e) =>
                                                                    setProjectSearchQuery(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Find project or client..."
                                                                className="w-full pl-8 pr-2 py-1.5 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                                                autoFocus
                                                            />
                                                        </div>

                                                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                                                            {filteredProjects.map((p) => (
                                                                <button
                                                                    key={p.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setRowProject(
                                                                            row.id,
                                                                            p.id,
                                                                            p.name,
                                                                            p.color,
                                                                            p.client
                                                                        );
                                                                        setProjectDropdownRowId(null);
                                                                        setProjectSearchQuery("");
                                                                    }}
                                                                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#F1F5F9] rounded flex items-center gap-2 cursor-pointer transition"
                                                                >
                                                                    <span
                                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                                        style={{
                                                                            backgroundColor: p.color,
                                                                        }}
                                                                    />
                                                                    <div className="truncate">
                                                                        <div className="font-medium text-[#1E293B] truncate">
                                                                            {p.name}
                                                                        </div>
                                                                        {p.client && (
                                                                            <div className="text-[10px] text-[#94A3B8] truncate">
                                                                                {p.client}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Columns 2-8: 7 Day Time Inputs */}
                                            {weekDays.map((day) => {
                                                const seconds = row.dayHours[day.dateStr] || 0;
                                                const formattedTime =
                                                    seconds > 0
                                                        ? formatSecondsToHms(seconds)
                                                        : "";

                                                return (
                                                    <td
                                                        key={day.dateStr}
                                                        className="px-2 text-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            defaultValue={formattedTime}
                                                            key={`${row.id}-${day.dateStr}-${seconds}`}
                                                            placeholder=""
                                                            onBlur={(e) => {
                                                                const sec = parseInputToSeconds(
                                                                    e.target.value
                                                                );
                                                                updateCellTime(
                                                                    row.id,
                                                                    day.dateStr,
                                                                    sec
                                                                );
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                            className="h-8 w-16 text-center text-xs border border-[#E2E8F0] rounded-xs bg-[#F8FAFC] text-[#1E293B] font-mono focus:bg-white focus:border-[#03A9F4] focus:outline-none transition shadow-2xs"
                                                        />
                                                    </td>
                                                );
                                            })}

                                            {/* Column 9: Row Total */}
                                            <td className="px-4 text-right text-xs font-mono text-[#94A3B8]">
                                                {formatSecondsToHms(rowTotalSeconds)}
                                            </td>

                                            {/* Column 10: Clear / Delete row button matching TimeSheet.png */}
                                            <td className="pr-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (rows.length > 1) {
                                                            removeRow(row.id);
                                                        } else {
                                                            clearRow(row.id);
                                                        }
                                                    }}
                                                    className="text-[#CBD5E1] hover:text-[#EF4444] p-1 rounded transition cursor-pointer"
                                                    title="Clear or remove row"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            {/* Table Footer: Totals Row matching TimeSheet.png */}
                            <tfoot>
                                <tr className="border-t border-[#E2E8F0] text-xs font-normal text-[#94A3B8] h-12 bg-white">
                                    <td className="pl-6 pr-4 font-normal">Total:</td>
                                    {weekDays.map((day) => (
                                        <td
                                            key={day.dateStr}
                                            className="px-2 text-center font-mono text-[#94A3B8]"
                                        >
                                            {formatSecondsToHms(dayTotals[day.dateStr] || 0)}
                                        </td>
                                    ))}
                                    <td className="px-4 text-right font-mono text-[#94A3B8]">
                                        {formatSecondsToHms(grandTotalSeconds)}
                                    </td>
                                    <td className="pr-4"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* 4. Bottom Action Buttons matching TimeSheet.png */}
                <div className="flex items-center gap-3">
                    {/* (+) Add new row */}
                    <button
                        type="button"
                        onClick={addRow}
                        className="h-9 px-3.5 bg-white border border-[#E2E8F0] rounded text-xs font-normal text-[#03A9F4] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
                    >
                        <div className="w-3.5 h-3.5 rounded-full border border-[#03A9F4] flex items-center justify-center text-[10px]">
                            +
                        </div>
                        <span>Add new row</span>
                    </button>

                    {/* Copy last week ▾ */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                copyLastWeek();
                                showToast("Copied previous week's projects and schedule!");
                            }}
                            className="h-9 px-3.5 bg-white border border-[#E2E8F0] rounded text-xs font-normal text-[#94A3B8] hover:text-[#64748B] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy last week</span>
                            <ChevronDown className="w-3 h-3 text-[#CBD5E1]" />
                        </button>
                    </div>

                    {/* Save as template */}
                    <button
                        type="button"
                        onClick={() => {
                            saveAsTemplate();
                            showToast("Current timesheet configuration saved as template!");
                        }}
                        className="h-9 px-3.5 bg-white border border-[#E2E8F0] rounded text-xs font-normal text-[#94A3B8] hover:text-[#64748B] flex items-center gap-1.5 hover:bg-[#F8FAFC] transition cursor-pointer shadow-2xs"
                    >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save as template</span>
                    </button>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 bg-[#1E293B] text-white text-xs px-4 py-2.5 rounded shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <span>{toastMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
