import { useState, useEffect } from "react";
import { useAutoTrackerStore } from "@/stores/useAutoTrackerStore";
import { AutoTrackerHeader } from "./AutoTrackerHeader";
import { DetectedActivityCard } from "./DetectedActivityCard";
import { ShieldCheck, Search, Filter } from "lucide-react";

export function AutoTrackerPage() {
    const { activities, isRecording, loadFromBackend } = useAutoTrackerStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApp, setSelectedApp] = useState("All");

    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    const apps = ["All", ...Array.from(new Set(activities.map((a) => a.app)))];

    const filteredActivities = activities.filter((a) => {
        if (selectedApp !== "All" && a.app !== selectedApp) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchTitle = a.windowTitle.toLowerCase().includes(q);
            const matchApp = a.app.toLowerCase().includes(q);
            const matchProj = a.suggestedProject.toLowerCase().includes(q);
            if (!matchTitle && !matchApp && !matchProj) return false;
        }
        return true;
    });

    const unloggedActivities = activities.filter((a) => !a.isLogged);
    const unloggedCount = unloggedActivities.length;
    const totalUnloggedMinutes = unloggedActivities.reduce(
        (acc, curr) => acc + curr.durationMinutes,
        0
    );

    const formatHoursMinutes = (totalMinutes: number) => {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            {/* Header with breadcrumbs and actions */}
            <AutoTrackerHeader />

            {/* Content Body */}
            <div className="p-8 max-w-[1200px] w-full mx-auto space-y-6">
                {/* Summary Info Banner */}
                <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-xs flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-[#1E293B]">
                                Today's Detected Background Activity
                            </h2>
                            {isRecording && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                                    Live
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">
                            TimeFlow AI automatically groups window events and suggests project allocations.
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#03A9F4] block">
                            {unloggedCount} Unlogged Block{unloggedCount === 1 ? "" : "s"} (
                            {formatHoursMinutes(totalUnloggedMinutes)})
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                            Total {activities.length} activity blocks recorded
                        </span>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-xs flex items-center justify-between gap-4">
                    {/* App Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                        <Filter className="w-3.5 h-3.5 text-[#94A3B8] mr-1 flex-shrink-0" />
                        {apps.map((app) => (
                            <button
                                key={app}
                                type="button"
                                onClick={() => setSelectedApp(app)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                                    selectedApp === app
                                        ? "bg-[#03A9F4] text-white shadow-xs"
                                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1E293B]"
                                }`}
                            >
                                {app}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-md px-3 py-1.5 w-64 focus-within:border-[#03A9F4]">
                        <Search className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Filter window title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-xs text-[#1E293B] placeholder:text-[#94A3B8] bg-transparent outline-none w-full"
                        />
                    </div>
                </div>

                {/* List of Detected Activities */}
                <div className="space-y-3">
                    {filteredActivities.length === 0 ? (
                        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center text-xs text-[#94A3B8]">
                            No activities match your filters.
                        </div>
                    ) : (
                        filteredActivities.map((activity) => (
                            <DetectedActivityCard
                                key={activity.id}
                                activity={activity}
                            />
                        ))
                    )}
                </div>

                {/* Privacy & Security Note */}
                <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#94A3B8]">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                    <span>
                        Autonomous activity tracking is saved locally on your device. Only accepted entries are synchronized to your workspace.
                    </span>
                </div>
            </div>
        </div>
    );
}
