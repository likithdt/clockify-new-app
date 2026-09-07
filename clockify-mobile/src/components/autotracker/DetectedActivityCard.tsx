import { useState } from "react";
import {
    type DetectedActivity,
    useAutoTrackerStore,
} from "@/stores/useAutoTrackerStore";
import {
    Code2,
    Palette,
    Globe,
    Terminal,
    FileText,
    MessageSquare,
    Check,
    Trash2,
    ChevronDown,
} from "lucide-react";

interface Props {
    activity: DetectedActivity;
}

const AVAILABLE_PROJECTS = [
    { name: "Project Alpha", color: "#03a9f4" },
    { name: "[SAMPLE] Internal Work", color: "#0288d1" },
    { name: "[SAMPLE] Project Orion", color: "#f59e0b" },
    { name: "[SAMPLE] Project Apollo", color: "#ef4444" },
    { name: "[SAMPLE] Project Phoenix", color: "#78716c" },
];

export function DetectedActivityCard({ activity }: Props) {
    const { acceptAndLog, discardActivity, updateProject } = useAutoTrackerStore();
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

    const getIcon = () => {
        switch (activity.iconType) {
            case "code":
                return (
                    <div className="w-10 h-10 rounded-lg bg-[#E1F5FE] border border-[#B3E5FC] flex items-center justify-center text-[#03A9F4] flex-shrink-0">
                        <Code2 className="w-5 h-5" />
                    </div>
                );
            case "design":
                return (
                    <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <Palette className="w-5 h-5" />
                    </div>
                );
            case "browser":
                return (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Globe className="w-5 h-5" />
                    </div>
                );
            case "terminal":
                return (
                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Terminal className="w-5 h-5" />
                    </div>
                );
            case "communication":
                return (
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                );
        }
    };

    const formatDuration = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (totalSeconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <div
            className={`bg-white border rounded-lg p-4 shadow-xs flex items-center justify-between transition ${
                activity.isLogged
                    ? "border-[#e2e8f0] opacity-75 bg-[#fafafa]"
                    : "border-[#e2e8f0] hover:border-[#03a9f4]"
            }`}
        >
            {/* Left: Icon and Details */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                {getIcon()}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-[#1E293B] truncate">
                            {activity.app}: {activity.windowTitle}
                        </span>

                        {/* Suggested Project Badge / Selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    !activity.isLogged &&
                                    setIsProjectDropdownOpen(!isProjectDropdownOpen)
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                                    activity.isLogged
                                        ? "bg-slate-100 text-slate-700"
                                        : "bg-[#ECFDF5] text-[#047857] hover:bg-[#d1fae5] cursor-pointer"
                                }`}
                                title="Click to change project allocation"
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: activity.projectColor }}
                                />
                                <span>AI Match: {activity.suggestedProject}</span>
                                {!activity.isLogged && (
                                    <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                                )}
                            </button>

                            {isProjectDropdownOpen && (
                                <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-xl z-30 py-1 min-w-[170px] text-xs">
                                    <div className="px-2.5 py-1 text-[10px] font-semibold text-[#94a3b8] uppercase">
                                        Assign Project
                                    </div>
                                    {AVAILABLE_PROJECTS.map((proj) => (
                                        <button
                                            key={proj.name}
                                            onClick={() => {
                                                updateProject(
                                                    activity.id,
                                                    proj.name,
                                                    proj.color
                                                );
                                                setIsProjectDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer text-xs"
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: proj.color }}
                                            />
                                            <span className="truncate">{proj.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[11px] text-[#64748B] mt-0.5">
                        {activity.startTime} - {activity.endTime} ·{" "}
                        {activity.durationMinutes} minutes
                    </p>
                </div>
            </div>

            {/* Right: Duration & Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm font-mono font-bold text-[#1E293B]">
                    {formatDuration(activity.durationSeconds)}
                </span>

                {activity.isLogged ? (
                    <span className="px-3 py-1.5 bg-[#ecfdf5] text-[#047857] text-xs font-semibold rounded border border-[#a7f3d0] flex items-center gap-1.5 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        Logged
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => acceptAndLog(activity.id)}
                            className="px-3.5 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-semibold rounded shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                        >
                            Accept &amp; Log
                        </button>

                        <button
                            type="button"
                            onClick={() => discardActivity(activity.id)}
                            className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] rounded hover:bg-[#fee2e2] transition cursor-pointer"
                            title="Discard activity block"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
