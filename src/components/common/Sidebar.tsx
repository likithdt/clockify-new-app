import {
    Clock,
    Calendar,
    CalendarDays,
    Receipt,
    CalendarOff,
    LayoutDashboard,
    Activity as ActivityIcon,
    BarChart3,
    MonitorPlay,
    CheckSquare,
    FolderKanban,
    Users,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

export type PageRoute = "time-tracker" | "activity" | "calendar" | "schedule" | "expenses" | "time-off" | "dashboard" | "reports" | "kiosks" | "approvals" | "projects" | "team";

interface SidebarProps {
    activeRoute: PageRoute;
    onRouteChange: (route: PageRoute) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({
    activeRoute,
    onRouteChange,
    collapsed,
    onToggleCollapse,
}: SidebarProps) {
    return (
        <aside
            className={`${
                collapsed ? "w-[60px]" : "w-[200px]"
            } bg-white border-r border-[#e2e8f0] flex flex-col flex-shrink-0 relative select-none transition-all duration-200 z-20`}
        >
            {/* Collapse toggle button on the right border */}
            <button
                onClick={onToggleCollapse}
                className="absolute -right-3 top-3 w-6 h-6 bg-white border border-[#e2e8f0] rounded-full shadow-sm flex items-center justify-center text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f8fafc] z-30 transition cursor-pointer"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            <nav className="flex-1 py-3 overflow-y-auto space-y-4">
                {/* Top tracking section */}
                <div className="space-y-0.5 px-2">
                    <button
                        onClick={() => onRouteChange("time-tracker")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "time-tracker"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Time Tracker"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <Clock className={`w-4 h-4 flex-shrink-0 ${activeRoute === "time-tracker" ? "text-[#03a9f4]" : "text-[#64748b]"}`} />
                            {!collapsed && <span className="truncate">TIME TRACKER</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("calendar")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "calendar"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Calendar"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <Calendar className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">CALENDAR</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("schedule")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "schedule"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Schedule"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <CalendarDays className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">SCHEDULE</span>}
                        </div>
                        {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />}
                    </button>

                    <button
                        onClick={() => onRouteChange("expenses")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "expenses"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Expenses"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <Receipt className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">EXPENSES</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("time-off")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "time-off"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Time Off"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <CalendarOff className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">TIME OFF</span>}
                        </div>
                        {!collapsed && (
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />
                            </div>
                        )}
                    </button>
                </div>

                {/* ANALYZE section */}
                <div className="space-y-0.5 px-2">
                    {!collapsed && (
                        <div className="px-2.5 py-1 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                            ANALYZE
                        </div>
                    )}

                    <button
                        onClick={() => onRouteChange("dashboard")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "dashboard"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Dashboard"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <LayoutDashboard className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">DASHBOARD</span>}
                        </div>
                    </button>

                    {/* ACTIVITY ITEM — TARGET FEATURE */}
                    <button
                        onClick={() => onRouteChange("activity")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "activity"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Activity (Screenshots & Locations)"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <ActivityIcon className={`w-4 h-4 flex-shrink-0 ${activeRoute === "activity" ? "text-[#03a9f4]" : "text-[#64748b]"}`} />
                            {!collapsed && <span className="truncate">ACTIVITY</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("reports")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "reports"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Reports"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <BarChart3 className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">REPORTS</span>}
                        </div>
                        {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8]" />}
                    </button>
                </div>

                {/* MANAGE section */}
                <div className="space-y-0.5 px-2">
                    {!collapsed && (
                        <div className="px-2.5 py-1 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                            MANAGE
                        </div>
                    )}

                    <button
                        onClick={() => onRouteChange("kiosks")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "kiosks"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Kiosks"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <MonitorPlay className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">KIOSKS</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("approvals")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "approvals"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Approvals"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <CheckSquare className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">APPROVALS</span>}
                        </div>
                        {!collapsed && <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />}
                    </button>

                    <button
                        onClick={() => onRouteChange("projects")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "projects"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Projects"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <FolderKanban className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">PROJECTS</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => onRouteChange("team")}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition ${
                            activeRoute === "team"
                                ? "text-[#0288d1] bg-[#e1f5fe] border-l-4 border-[#03a9f4]"
                                : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                        title="Team"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <Users className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                            {!collapsed && <span className="truncate">TEAM</span>}
                        </div>
                    </button>
                </div>
            </nav>
        </aside>
    );
}
