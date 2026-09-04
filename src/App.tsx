import { useState } from "react";
import { TopNavbar } from "@/components/common/TopNavbar";
import { Sidebar, type PageRoute } from "@/components/common/Sidebar";
import { TrackerBar } from "@/components/tracker/TrackerBar";
import { ActivityPage } from "@/components/activity/ActivityPage";
import { ProjectsPage } from "@/components/projects/ProjectsPage";
import { AutoTrackerPage } from "@/components/autotracker/AutoTrackerPage";
import { useTimerStore } from "@/stores/useTimerStore";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

export default function App() {
    // Default to "auto-tracker" as requested
    const [activeRoute, setActiveRoute] = useState<PageRoute>("auto-tracker");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const { entries } = useTimerStore();

    const formatDuration = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    const getLocationDisplayText = (
        entry: ReturnType<typeof useTimerStore.getState>["entries"][number]
    ) => {
        if (!entry.location) return null;
        if (entry.location.address) {
            return entry.location.address.length > 25
                ? entry.location.address.substring(0, 25) + "…"
                : entry.location.address;
        }
        return `${entry.location.latitude.toFixed(3)}, ${entry.location.longitude.toFixed(3)}`;
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#f5f6f8] overflow-hidden select-none font-sans text-[#1e293b]">
            {/* Top Navigation Bar with Trial Banner matching Clockify */}
            <TopNavbar
                workspaceName="GOPALAN COLLEGE OF ENGINEERING..."
                userInitials="LD"
            />

            {/* Body Area: Sidebar + Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar */}
                <Sidebar
                    activeRoute={activeRoute}
                    onRouteChange={setActiveRoute}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* Main View Area */}
                <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#f5f6f8]">
                    {activeRoute === "auto-tracker" ? (
                        /* Auto Tracker feature: AI autonomous background activity tracking */
                        <AutoTrackerPage />
                    ) : activeRoute === "projects" ? (
                        /* Projects feature: Project directory, budgets, and creation modal */
                        <ProjectsPage />
                    ) : activeRoute === "activity" ? (
                        /* Activity feature: Activity Monitoring, Screenshots, and Locations */
                        <ActivityPage />
                    ) : activeRoute === "time-tracker" ? (
                        /* Standard Time Tracker with Sticky TrackerBar and entries */
                        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
                            <header className="sticky top-0 z-10 bg-[#f5f6f8] p-6 pb-4 border-b border-[#e2e8f0]">
                                <TrackerBar />
                            </header>

                            <section className="flex-1 p-6 pt-4 space-y-4">
                                <div className="flex items-center justify-between text-xs font-semibold text-[#64748b] uppercase tracking-wider px-1">
                                    <span>Today</span>
                                    <span className="font-mono">
                                        Total: {formatDuration(entries.reduce((acc, curr) => acc + curr.durationSeconds, 0))}
                                    </span>
                                </div>

                                <div className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm divide-y divide-[#f1f5f9]">
                                    {entries.length === 0 ? (
                                        <div className="p-8 text-center text-sm text-[#94a3b8]">
                                            No time tracked yet today. Type a task and hit{" "}
                                            <span className="font-semibold text-[#03a9f4]">START</span>!
                                        </div>
                                    ) : (
                                        entries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="p-3.5 flex items-center justify-between text-sm hover:bg-[#f8fafc] transition"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className="font-semibold text-[#1e293b] truncate">
                                                        {entry.description || "No description"}
                                                    </span>

                                                    {/* Project badge */}
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-[#e1f5fe] text-[#0288d1] border border-[#b3e5fc]">
                                                        <span
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: entry.projectColor }}
                                                        />
                                                        {entry.projectName}
                                                    </span>

                                                    {/* Billable badge */}
                                                    {entry.isBillable && (
                                                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                                                            $ Billable
                                                        </span>
                                                    )}

                                                    {/* Location badge */}
                                                    {entry.location && (
                                                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-[#e1f5fe] text-[#0288d1] border border-[#b3e5fc]">
                                                            <MapPin className="w-3 h-3" />
                                                            {getLocationDisplayText(entry)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-6 text-[#64748b] text-xs">
                                                    <span className="font-mono text-[11px]">
                                                        {format(entry.startTime, "HH:mm")} -{" "}
                                                        {entry.endTime ? format(entry.endTime, "HH:mm") : "now"}
                                                    </span>
                                                    <span className="font-mono font-bold text-[#1e293b] min-w-[60px] text-right">
                                                        {formatDuration(entry.durationSeconds)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    ) : (
                        /* Generic view placeholder for other sidebar links */
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="max-w-md bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-sm">
                                <h3 className="text-base font-bold text-[#1e293b] uppercase tracking-wide mb-2">
                                    {activeRoute.replace("-", " ")}
                                </h3>
                                <p className="text-xs text-[#64748b] mb-4">
                                    View and manage your {activeRoute.replace("-", " ")} settings and reports.
                                </p>
                                <button
                                    onClick={() => setActiveRoute("activity")}
                                    className="px-4 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded text-xs font-semibold transition"
                                >
                                    Go to Activity (Screenshots &amp; Locations)
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}