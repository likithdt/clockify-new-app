import { useTimerStore } from "@/stores/useTimerStore";
import { TrackerBar } from "./TrackerBar";
import { TimeTrackerEmptyState } from "./TimeTrackerEmptyState";
import { TimesheetToast } from "./TimesheetToast";
import { Play, Trash2, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Props {
    onNavigateToTimesheet?: () => void;
}

export function TimeTrackerPage({ onNavigateToTimesheet }: Props) {
    const { entries, startTimer, setDescription, setProject } = useTimerStore();

    const formatDuration = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((totalSecs % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (totalSecs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const totalSeconds = entries.reduce(
        (acc, curr) => acc + curr.durationSeconds,
        0
    );

    const handleContinueEntry = (entry: (typeof entries)[number]) => {
        setDescription(entry.description);
        setProject(entry.projectName, entry.projectColor);
        startTimer();
    };

    const handleDeleteEntry = (id: string) => {
        useTimerStore.setState((state) => ({
            entries: state.entries.filter((e) => e.id !== id),
        }));
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none relative">
            {/* Top Tracker Bar sticky section */}
            <div className="p-6 pb-4">
                <TrackerBar />
            </div>

            {/* Main Area: Empty state illustration OR Time entries table */}
            <div className="px-6 flex-1 flex flex-col">
                {entries.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center min-h-[420px]">
                        <TimeTrackerEmptyState />
                    </div>
                ) : (
                    <div className="space-y-4 pb-12">
                        {/* Section Header: Today & Total Time */}
                        <div className="bg-white border border-[#E2E8F0] rounded shadow-xs overflow-hidden">
                            <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1E293B]">
                                    Today · {format(new Date(), "EEE, MMM d")}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#1E293B]">
                                    Total: {formatDuration(totalSeconds)}
                                </span>
                            </div>

                            {/* Entries List */}
                            <div className="divide-y divide-[#F1F5F9] text-xs text-[#334155]">
                                {entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition group"
                                    >
                                        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                                            {/* Continue/Play Icon */}
                                            <button
                                                type="button"
                                                onClick={() => handleContinueEntry(entry)}
                                                className="w-7 h-7 rounded-full hover:bg-[#E1F5FE] text-[#94A3B8] hover:text-[#03A9F4] flex items-center justify-center transition cursor-pointer flex-shrink-0"
                                                title="Continue this timer"
                                            >
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </button>

                                            <div className="truncate flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-xs text-[#1E293B] truncate">
                                                        {entry.description || "(No details)"}
                                                    </span>

                                                    {/* Project badge */}
                                                    {entry.projectName && entry.projectName !== "No Project" && (
                                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]">
                                                            <span
                                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: entry.projectColor }}
                                                            />
                                                            <span className="truncate max-w-[150px]">
                                                                {entry.projectName}
                                                            </span>
                                                        </span>
                                                    )}

                                                    {/* Billable icon */}
                                                    {entry.isBillable && (
                                                        <span className="text-[#03A9F4] font-bold text-xs" title="Billable">
                                                            $
                                                        </span>
                                                    )}

                                                    {/* Location badge */}
                                                    {entry.location && (
                                                        <span className="flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]">
                                                            <MapPin className="w-3 h-3" />
                                                            {entry.location.address?.substring(0, 20) || "GPS"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Time Range & Duration & Delete */}
                                        <div className="flex items-center gap-4 text-[#64748B] flex-shrink-0">
                                            <span className="font-mono text-xs">
                                                {format(entry.startTime, "HH:mm")} -{" "}
                                                {entry.endTime ? format(entry.endTime, "HH:mm") : "now"}
                                            </span>

                                            <span className="font-mono font-bold text-xs text-[#1E293B] min-w-[65px] text-right">
                                                {formatDuration(entry.durationSeconds)}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                                className="p-1 text-[#CBD5E1] hover:text-[#EF4444] rounded hover:bg-[#FEE2E2] transition cursor-pointer"
                                                title="Delete time entry"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom-right toast matching Clockify TimeTracker.png */}
            <TimesheetToast onEnableTimesheet={onNavigateToTimesheet} />
        </div>
    );
}
