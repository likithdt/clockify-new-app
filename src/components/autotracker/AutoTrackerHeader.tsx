import { useAutoTrackerStore } from "@/stores/useAutoTrackerStore";
import { Bot, CheckCheck, ChevronRight, Power } from "lucide-react";

export function AutoTrackerHeader() {
    const { isRecording, toggleRecording, acceptAll, activities } = useAutoTrackerStore();

    const unloggedCount = activities.filter((a) => !a.isLogged).length;

    return (
        <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-20 flex-shrink-0 select-none">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium">
                <span className="hover:text-[#03A9F4] cursor-pointer transition-colors">
                    Gopalan College
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#1E293B] font-semibold">
                    AI Autonomous Background Tracker
                </span>
            </div>

            {/* Right Status Badges & Action Buttons */}
            <div className="flex items-center gap-3">
                {/* Engine Status Badge */}
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                        isRecording
                            ? "bg-[#E1F5FE] text-[#0288D1] border-[#B3E5FC]"
                            : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
                    }`}
                >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isRecording ? "AI Engine Active" : "AI Engine Paused"}</span>
                    {isRecording && (
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    )}
                </span>

                {/* Toggle Recording Switch */}
                <button
                    type="button"
                    onClick={toggleRecording}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                        isRecording
                            ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0] hover:bg-[#d1fae5]"
                            : "bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0] hover:bg-[#f1f5f9]"
                    }`}
                    title={isRecording ? "Pause background auto tracking" : "Resume background auto tracking"}
                >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isRecording ? "Tracking: ON" : "Tracking: OFF"}</span>
                </button>

                {/* Accept All Suggestions Button */}
                <button
                    type="button"
                    onClick={acceptAll}
                    disabled={unloggedCount === 0}
                    className="px-3.5 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] disabled:bg-[#b3e5fc] text-white rounded text-xs font-medium shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                    <CheckCheck className="w-4 h-4" />
                    <span>Accept All Suggestions ({unloggedCount})</span>
                </button>
            </div>
        </header>
    );
}
