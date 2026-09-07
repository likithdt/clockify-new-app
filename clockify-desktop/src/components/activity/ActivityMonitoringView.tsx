import { useState } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityTabs } from "./ActivityTabs";
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
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
                    <div className="w-full max-w-lg flex flex-col items-center">
                        {/* Center Icon Illustration: Circular badge with mini bar chart */}
                        <div className="w-20 h-20 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center mb-6 shadow-sm relative overflow-hidden group hover:scale-105 transition">
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
                        <p className="text-sm text-[#64748b] max-w-md mb-8 leading-relaxed">
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
                            <span className="text-sm font-medium text-[#334155] group-hover:text-[#0f172a] transition">
                                Activate activity monitoring
                            </span>
                        </label>
                    </div>
                </div>
            ) : (
                /* ACTIVATED WORKING STATE (Real-time Team Activity Pulse) */
                <div className="p-6 space-y-6">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-[#1e293b]">Real-time Team Activity Pulse</h2>
                                <span className="px-2 py-0.5 bg-[#ecfdf5] text-[#047857] text-[11px] font-bold rounded-full border border-[#a7f3d0] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    Live Pulse
                                </span>
                            </div>
                            <p className="text-xs text-[#64748b] mt-0.5">
                                Keystroke activity, active window audits, and team productivity scores.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded border border-[#cbd5e1] text-xs font-medium text-[#334155] hover:bg-[#f8fafc]">
                                <div
                                    onClick={toggleMonitoring}
                                    className="w-8 h-4 rounded-full bg-[#03a9f4] transition-colors relative"
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow transform translate-x-4 absolute top-0.25 left-0.25" />
                                </div>
                                <span>Monitoring Active</span>
                            </label>

                            <button className="px-3 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition">
                                <Download className="w-3.5 h-3.5" />
                                Export Activity Log
                            </button>
                        </div>
                    </div>

                    {/* Summary Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-[#e2e8f0] p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between text-[#64748b] text-xs font-medium">
                                <span>Avg Team Productivity</span>
                                <TrendingUp className="w-4 h-4 text-[#10b981]" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-bold text-[#1e293b]">88.4%</span>
                                <span className="text-xs font-semibold text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded">
                                    +3.2% vs last wk
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between text-[#64748b] text-xs font-medium">
                                <span>Active Trackers Now</span>
                                <Users className="w-4 h-4 text-[#03a9f4]" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-bold text-[#03a9f4]">12 / 16</span>
                                <span className="text-xs text-[#64748b]">75% online</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between text-[#64748b] text-xs font-medium">
                                <span>Top Application</span>
                                <Laptop className="w-4 h-4 text-[#8b5cf6]" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-bold text-[#1e293b]">VS Code</span>
                                <span className="text-xs text-[#64748b]">38.2% share</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#e2e8f0] p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between text-[#64748b] text-xs font-medium">
                                <span>Idle Time Alerts</span>
                                <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                            </div>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-bold text-[#f59e0b]">2 flagged</span>
                                <span className="text-xs font-semibold text-amber-700 bg-[#fffbeb] px-2 py-0.5 rounded">
                                    &gt; 15 min idle
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Table */}
                    <div className="bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <ActivityIcon className="w-4 h-4 text-[#03a9f4]" />
                                <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                                    Active Members Activity Breakdown
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="Filter members..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 pr-3 py-1 bg-white border border-[#cbd5e1] rounded text-xs text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#03a9f4] w-48"
                                    />
                                </div>
                                <span className="text-xs font-mono text-[#64748b]">Live interval: 5m</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                                        <th className="py-3 px-4">Member</th>
                                        <th className="py-3 px-4">Current Task & Project</th>
                                        <th className="py-3 px-4">Keystroke / Mouse Activity</th>
                                        <th className="py-3 px-4">Active Window</th>
                                        <th className="py-3 px-4">Productivity Score</th>
                                        <th className="py-3 px-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#334155]">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-[#f8fafc] transition">
                                            <td className="py-3.5 px-4 font-semibold text-[#1e293b]">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm"
                                                        style={{ backgroundColor: member.avatarColor }}
                                                    >
                                                        {member.avatar}
                                                    </div>
                                                    <span>{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span>{member.task} · </span>
                                                <span className="font-semibold" style={{ color: member.projectColor }}>
                                                    {member.project}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="w-36 bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${member.activityPercent}%`,
                                                            backgroundColor: member.activityPercent > 70 ? "#10b981" : "#f59e0b",
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-[#64748b] font-mono mt-0.5 block">
                                                    {member.pulseText}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748b]">
                                                {member.activeWindow}
                                            </td>
                                            <td className={`py-3.5 px-4 font-bold ${member.scoreColor}`}>
                                                {member.score}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${member.statusColor}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
