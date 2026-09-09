import { useState } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityTabs } from "./ActivityTabs";
import { ExportActivityModal } from "./ExportActivityModal";
import {
    Activity as ActivityIcon,
    Download,
    Search,
    TrendingUp,
    Users,
    Laptop,
    AlertCircle,
} from "lucide-react";

export function ActivityMonitoringView() {
    const { isMonitoringActive, toggleMonitoring } = useActivityStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const membersData = [
        {
            id: "likith",
            name: "Likith D T (You)",
            avatar: "LD",
            avatarColor: "#0288d1",
            task: "Clockify Desktop Development",
            project: "Project Alpha",
            projectColor: "#03a9f4",
            activityPercent: 98,
            pulseText: "98% active pulse",
            activeWindow: "VS Code Studio / Terminal",
            score: "99% High",
            scoreColor: "text-[#10b981]",
            status: "TRACKING",
            statusColor: "bg-[#ecfdf5] text-[#047857]",
        },
        {
            id: "bindhu",
            name: "Bindhu shree",
            avatar: "BS",
            avatarColor: "#00897b",
            task: "UI Design Refactoring",
            project: "Project Alpha",
            projectColor: "#03a9f4",
            activityPercent: 94,
            pulseText: "94% active pulse",
            activeWindow: "Figma / Chrome IDE",
            score: "96% High",
            scoreColor: "text-[#10b981]",
            status: "TRACKING",
            statusColor: "bg-[#ecfdf5] text-[#047857]",
        },
        {
            id: "priya",
            name: "Priya Sharma",
            avatar: "PS",
            avatarColor: "#9333ea",
            task: "Database Migration Scripts",
            project: "Backend Core",
            projectColor: "#9333ea",
            activityPercent: 86,
            pulseText: "86% active pulse",
            activeWindow: "VS Code (PostgreSQL)",
            score: "88% Optimal",
            scoreColor: "text-[#0288d1]",
            status: "TRACKING",
            statusColor: "bg-[#ecfdf5] text-[#047857]",
        },
        {
            id: "amy",
            name: "[SAMPLE] Amy Smith",
            avatar: "AS",
            avatarColor: "#f59e0b",
            task: "Client Report Analysis",
            project: "Audit Q3",
            projectColor: "#f59e0b",
            activityPercent: 78,
            pulseText: "78% active pulse",
            activeWindow: "Microsoft Excel",
            score: "82% Normal",
            scoreColor: "text-[#0288d1]",
            status: "TRACKING",
            statusColor: "bg-[#ecfdf5] text-[#047857]",
        },
        {
            id: "james",
            name: "[SAMPLE] James Anderson",
            avatar: "JA",
            avatarColor: "#0288d1",
            task: "Docker Cluster Setup",
            project: "Infrastructure",
            projectColor: "#64748b",
            activityPercent: 91,
            pulseText: "91% active pulse",
            activeWindow: "Windows Terminal / SSH",
            score: "93% High",
            scoreColor: "text-[#10b981]",
            status: "TRACKING",
            statusColor: "bg-[#ecfdf5] text-[#047857]",
        },
        {
            id: "lara",
            name: "[SAMPLE] Lara Peterson",
            avatar: "LP",
            avatarColor: "#ec4899",
            task: "Brand Guidelines v2",
            project: "Marketing",
            projectColor: "#ec4899",
            activityPercent: 32,
            pulseText: "32% idle flagged",
            activeWindow: "Slack #design",
            score: "45% Low",
            scoreColor: "text-[#f59e0b]",
            status: "IDLE",
            statusColor: "bg-[#fffbeb] text-[#b45309]",
        },
    ];

    const filteredMembers = membersData.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col bg-[#f5f6f8] overflow-y-auto min-h-0">
            {/* Top Tabs Bar */}
            <ActivityTabs />

            {!isMonitoringActive ? (
                /* EXACT DEACTIVATED SCREENSHOT STATE (Activity monitoring.png) */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[420px]">
                    <div className="w-full max-w-sm flex flex-col items-center">
                        {/* Center Icon Illustration: Circular badge with mini bar chart */}
                        <div className="w-20 h-20 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center mb-5 shadow-xs relative overflow-hidden group hover:scale-105 transition">
                            <div className="flex items-end gap-1.5 h-9">
                                <div className="w-2.5 h-6 bg-[#0288d1] rounded-t-sm" />
                                <div className="w-2.5 h-9 bg-[#03a9f4] rounded-t-sm" />
                                <div className="w-2.5 h-4 bg-[#81d4fa] rounded-t-sm" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-[#1e293b] mb-2 tracking-tight">
                            Activity monitoring
                        </h2>

                        {/* Subtitle */}
                        <p className="text-xs text-[#64748b] max-w-xs mb-7 leading-relaxed">
                            Get transparency through real data, optimize resource use and see all activity as it happens.
                        </p>

                        {/* Switch Toggle */}
                        <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
                            <div
                                onClick={toggleMonitoring}
                                className={`w-11 h-6 rounded-full transition-colors relative shadow-inner ${
                                    isMonitoringActive ? "bg-[#03a9f4]" : "bg-[#cbd5e1]"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                                        isMonitoringActive ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </div>
                            <span className="text-xs font-semibold text-[#334155] group-hover:text-[#0f172a] transition">
                                Activate activity monitoring
                            </span>
                        </label>
                    </div>
                </div>
            ) : (
                /* ACTIVATED WORKING STATE (Real-time Team Activity Pulse) */
                <div className="p-3.5 space-y-4 pb-20">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-2xs">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-[#1e293b]">Activity Pulse</h2>
                                <span className="px-2 py-0.5 bg-[#ecfdf5] text-[#047857] text-[10px] font-bold rounded-full border border-[#a7f3d0] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className="text-[11px] text-[#64748b]">
                                Keystroke &amp; window audits
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#cbd5e1] text-[11px] font-medium text-[#334155]">
                                <div
                                    onClick={toggleMonitoring}
                                    className="w-7 h-3.5 rounded-full bg-[#03a9f4] transition-colors relative"
                                >
                                    <div className="w-3 h-3 rounded-full bg-white shadow transform translate-x-3.5 absolute top-0.25 left-0.25" />
                                </div>
                                <span>Active</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsExportModalOpen(true)}
                                className="p-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg shadow-2xs transition cursor-pointer"
                                title="Export Activity Log"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Summary Metric Cards (2x2 Mobile Grid) */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs space-y-1">
                            <div className="flex items-center justify-between text-[#64748b] text-[11px] font-medium">
                                <span>Productivity</span>
                                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold text-[#1e293b]">88.4%</span>
                                <span className="text-[10px] font-semibold text-[#10b981] bg-[#ecfdf5] px-1.5 py-0.2 rounded">
                                    +3.2%
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs space-y-1">
                            <div className="flex items-center justify-between text-[#64748b] text-[11px] font-medium">
                                <span>Active Now</span>
                                <Users className="w-3.5 h-3.5 text-[#03a9f4]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold text-[#03a9f4]">12 / 16</span>
                                <span className="text-[10px] text-[#64748b]">75% online</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs space-y-1">
                            <div className="flex items-center justify-between text-[#64748b] text-[11px] font-medium">
                                <span>Top App</span>
                                <Laptop className="w-3.5 h-3.5 text-[#8b5cf6]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-bold text-[#1e293b] truncate">VS Code</span>
                                <span className="text-[10px] text-[#64748b]">38% share</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs space-y-1">
                            <div className="flex items-center justify-between text-[#64748b] text-[11px] font-medium">
                                <span>Idle Alerts</span>
                                <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold text-[#f59e0b]">2</span>
                                <span className="text-[10px] font-semibold text-amber-700 bg-[#fffbeb] px-1.5 py-0.2 rounded">
                                    &gt; 15m idle
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Member Breakdown Section */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-2xs overflow-hidden">
                        {/* Section Header & Search */}
                        <div className="p-3 border-b border-[#e2e8f0] bg-[#f8fafc] space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <ActivityIcon className="w-4 h-4 text-[#03a9f4]" />
                                    <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                                        Members Breakdown ({filteredMembers.length})
                                    </h3>
                                </div>
                                <span className="text-[10px] font-mono text-[#64748b]">Every 5m</span>
                            </div>

                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search teammate, task, project..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#03a9f4]"
                                />
                            </div>
                        </div>

                        {/* Mobile Member Cards List */}
                        <div className="divide-y divide-[#f1f5f9]">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="p-3 hover:bg-[#f8fafc] transition space-y-2">
                                    {/* Row 1: Avatar, Name & Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div
                                                className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                                                style={{ backgroundColor: member.avatarColor }}
                                            >
                                                {member.avatar}
                                            </div>
                                            <span className="text-xs font-bold text-[#1e293b] truncate">
                                                {member.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${member.scoreColor} bg-slate-50 border border-slate-200`}>
                                                {member.score}
                                            </span>
                                            <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${member.statusColor}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Row 2: Current Task & Project */}
                                    <div className="text-xs text-[#475569] flex items-center gap-1.5 truncate">
                                        <span className="truncate">{member.task}</span>
                                        <span>•</span>
                                        <span
                                            className="font-semibold px-1.5 py-0.2 rounded text-[10px] shrink-0"
                                            style={{
                                                color: member.projectColor,
                                                backgroundColor: `${member.projectColor}15`,
                                            }}
                                        >
                                            {member.project}
                                        </span>
                                    </div>

                                    {/* Row 3: Pulse Bar & Active Window */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                                            <span className="font-mono">{member.pulseText}</span>
                                            <span className="font-mono text-[10px] text-[#475569] truncate max-w-[180px]">
                                                {member.activeWindow}
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#e2e8f0] rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-1.5 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${member.activityPercent}%`,
                                                    backgroundColor: member.activityPercent > 70 ? "#10b981" : "#f59e0b",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Export Activity Modal */}
            <ExportActivityModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                members={filteredMembers}
            />
        </div>
    );
}
