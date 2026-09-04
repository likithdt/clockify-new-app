import { useState } from "react";
import { TopNavbar } from "@/components/common/TopNavbar";
import { Sidebar, type PageRoute } from "@/components/common/Sidebar";
import { KiosksPage } from "@/components/kiosks/KiosksPage";
import { TimeTrackerPage } from "@/components/tracker/TimeTrackerPage";
import { ActivityPage } from "@/components/activity/ActivityPage";
import { ProjectsPage } from "@/components/projects/ProjectsPage";
import { AutoTrackerPage } from "@/components/autotracker/AutoTrackerPage";

export default function App() {
    // Default to "kiosks" matching the Kiosk feature request
    const [activeRoute, setActiveRoute] = useState<PageRoute>("kiosks");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen w-screen bg-[#f5f6f8] overflow-hidden select-none font-sans text-[#1e293b]">
            {/* Top Navigation Bar with Trial Banner matching Clockify */}
            <TopNavbar
                workspaceName="GOPALAN COLLEGE OF ENGINEERING..."
                userInitials="BS"
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
                    {activeRoute === "kiosks" ? (
                        /* Kiosks feature matching Kiosks.png & Creation of Kiosk.png */
                        <KiosksPage />
                    ) : activeRoute === "time-tracker" ? (
                        /* Timer / Time Tracker feature matching TimeTracker.png */
                        <TimeTrackerPage />
                    ) : activeRoute === "auto-tracker" ? (
                        /* Auto Tracker feature: AI autonomous background activity tracking */
                        <AutoTrackerPage />
                    ) : activeRoute === "projects" ? (
                        /* Projects feature: Project directory, budgets, and creation modal */
                        <ProjectsPage />
                    ) : activeRoute === "activity" ? (
                        /* Activity feature: Activity Monitoring, Screenshots, and Locations */
                        <ActivityPage />
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