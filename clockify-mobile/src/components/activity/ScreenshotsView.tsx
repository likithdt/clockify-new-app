import { useState } from "react";
import { useActivityStore, type ScreenshotItem } from "@/stores/useActivityStore";
import { ActivityTabs } from "./ActivityTabs";
import { ScreenshotModal } from "./ScreenshotModal";
import { Camera, Eye, EyeOff } from "lucide-react";

export function ScreenshotsView() {
    const {
        isScreenshotsActive,
        toggleScreenshots,
        blurPrivacy,
        toggleBlurPrivacy,
        screenshots,
        addScreenshot,
        deleteScreenshot,
        selectedTeammate,
    } = useActivityStore();

    const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);

    // Filter by selected teammate if not "all"
    const filteredScreenshots = screenshots.filter((item) => {
        if (selectedTeammate === "all") return true;
        return item.memberId === selectedTeammate;
    });

    const handleTakeScreenshot = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const timeFormatted = `${hours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;

        addScreenshot({
            memberId: "bindhu-shree",
            memberName: "Bindhu shree (You)",
            timestamp: now.toISOString(),
            timeFormatted,
            project: "Project Alpha",
            projectColor: "#03a9f4",
            activityPercent: Math.floor(Math.random() * 15) + 85,
            appName: "Clockify Desktop App",
            windowTitle: "src/components/activity/ScreenshotsView.tsx",
            type: "code",
        });
    };

    const activeScreenshot: ScreenshotItem | null =
        selectedScreenshotIndex !== null && filteredScreenshots[selectedScreenshotIndex]
            ? filteredScreenshots[selectedScreenshotIndex]
            : null;

    const handleNext = () => {
        if (selectedScreenshotIndex !== null && selectedScreenshotIndex < filteredScreenshots.length - 1) {
            setSelectedScreenshotIndex(selectedScreenshotIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (selectedScreenshotIndex !== null && selectedScreenshotIndex > 0) {
            setSelectedScreenshotIndex(selectedScreenshotIndex - 1);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#f5f6f8] overflow-y-auto min-h-0">
            {/* Top Tabs Bar with Teammates dropdown & Date picker */}
            <ActivityTabs showTeammatesFilter={true} />

            {!isScreenshotsActive ? (
                /* EXACT DEACTIVATED SCREENSHOT STATE (Activity(Screenshots).png) */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[420px]">
                    <div className="w-full max-w-sm flex flex-col items-center">
                        {/* Center Icon Illustration: Image placeholder with toggle overlay */}
                        <div className="w-20 h-20 rounded-2xl bg-[#e2e8f0]/40 flex items-center justify-center mb-5 shadow-inner relative group hover:scale-105 transition">
                            <div className="w-12 h-10 border-2 border-[#cbd5e1] rounded-md flex flex-col items-center justify-center p-1 relative overflow-hidden bg-white/70">
                                <div className="w-2 h-2 rounded-full bg-[#cbd5e1] self-start ml-1" />
                                <div className="w-full h-3 bg-[#e2e8f0] rounded-t-sm mt-auto" />
                            </div>
                            {/* Toggle badge on top right */}
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-4 bg-[#94a3b8] rounded-full p-0.5 flex items-center shadow-xs">
                                <div className="w-3 h-3 rounded-full bg-white shadow-2xs" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-[#1e293b] mb-2 tracking-tight">
                            Screenshots not activated
                        </h2>

                        {/* Subtitle */}
                        <p className="text-xs text-[#64748b] max-w-xs mb-7 leading-relaxed">
                            Generate screenshots every 5 minutes while the timer is running (desktop app only).
                        </p>

                        {/* Switch Toggle */}
                        <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
                            <div
                                onClick={toggleScreenshots}
                                className={`w-11 h-6 rounded-full transition-colors relative shadow-inner ${
                                    isScreenshotsActive ? "bg-[#03a9f4]" : "bg-[#cbd5e1]"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                                        isScreenshotsActive ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </div>
                            <span className="text-xs font-semibold text-[#334155] group-hover:text-[#0f172a] transition">
                                Activate screenshot capturing
                            </span>
                        </label>
                    </div>
                </div>
            ) : (
                /* ACTIVATED WORKING STATE (Screenshots Timeline Gallery) */
                <div className="p-3.5 space-y-3.5 flex-1 flex flex-col pb-20">
                    {/* Controls Bar */}
                    <div className="flex flex-col gap-2.5 bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#64748b] font-medium">Interval: 5m</span>
                                <span className="h-3.5 w-px bg-[#e2e8f0]" />
                                <span className="px-2 py-0.5 bg-[#e1f5fe] text-[#0288d1] text-[11px] font-bold rounded-full border border-[#b3e5fc]">
                                    {filteredScreenshots.length} Captures
                                </span>
                            </div>

                            {/* Deactivate switch button */}
                            <button
                                type="button"
                                onClick={toggleScreenshots}
                                className="text-[11px] text-[#94a3b8] hover:text-[#ef4444] transition px-1.5 py-0.5"
                                title="Deactivate screenshots"
                            >
                                Deactivate
                            </button>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-[#f1f5f9]">
                            {/* Blur Privacy Button */}
                            <button
                                type="button"
                                onClick={toggleBlurPrivacy}
                                className={`flex-1 py-1.5 px-2 border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                                    blurPrivacy
                                        ? "bg-[#e1f5fe] text-[#0288d1] border-[#b3e5fc]"
                                        : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                                }`}
                            >
                                {blurPrivacy ? (
                                    <>
                                        <EyeOff className="w-3.5 h-3.5 text-[#0288d1]" />
                                        <span>Blur: On</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3.5 h-3.5 text-[#64748b]" />
                                        <span>Blur: Off</span>
                                    </>
                                )}
                            </button>

                            {/* Take Screenshot Now */}
                            <button
                                type="button"
                                onClick={handleTakeScreenshot}
                                className="flex-1 py-1.5 px-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Capture Now</span>
                            </button>
                        </div>
                    </div>

                    {/* Screenshots Grid (Mobile 2-column or 1-column) */}
                    {filteredScreenshots.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-[#e2e8f0] text-center">
                            <p className="text-xs text-[#64748b]">No screenshots captured for this filter.</p>
                            <button
                                type="button"
                                onClick={handleTakeScreenshot}
                                className="mt-2 text-xs font-semibold text-[#03a9f4] hover:underline"
                            >
                                Capture a test screenshot
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {filteredScreenshots.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedScreenshotIndex(index)}
                                    className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xs hover:border-[#03a9f4] hover:shadow-xs transition cursor-pointer group flex flex-col"
                                >
                                    {/* Thumbnail Preview Area */}
                                    <div className="h-28 bg-[#1e293b] relative flex items-center justify-center p-1.5 overflow-hidden">
                                        <div
                                            className={`w-full h-full rounded border flex flex-col p-1.5 text-[9px] font-mono overflow-hidden transition ${
                                                blurPrivacy ? "filter blur-xs" : ""
                                            } ${
                                                item.type === "code"
                                                    ? "bg-[#181825] border-slate-700 text-slate-300"
                                                    : item.type === "figma"
                                                    ? "bg-[#334155] border-slate-600 text-cyan-300"
                                                    : "bg-slate-800 border-slate-700 text-slate-300"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between pb-0.5 border-b border-white/10">
                                                <span className="font-bold truncate">{item.windowTitle}</span>
                                            </div>
                                            <div className="mt-1 w-full flex-1 bg-black/20 rounded flex items-center justify-center text-white/50 text-[9px] text-center p-0.5">
                                                {item.type === "figma" && "Figma Canvas"}
                                                {item.type === "code" && "VS Code Editor"}
                                                {item.type === "browser" && "Clockify Web"}
                                                {item.type === "terminal" && "Terminal Session"}
                                                {item.type === "slack" && "Team Channel"}
                                            </div>
                                        </div>

                                        {/* Timestamp badge */}
                                        <span className="absolute top-1.5 right-1.5 px-1 py-0.2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono rounded">
                                            {item.timeFormatted}
                                        </span>
                                    </div>

                                    {/* Card Footer Details */}
                                    <div className="p-2 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] font-bold text-[#1e293b]">
                                            <span className="truncate max-w-[90px]" style={{ color: item.projectColor }}>
                                                {item.project}
                                            </span>
                                            <span className="text-[#10b981] font-mono text-[10px]">
                                                {item.activityPercent}%
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-[#64748b] truncate">
                                            {item.appName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal for full preview and audit */}
            <ScreenshotModal
                screenshot={activeScreenshot}
                onClose={() => setSelectedScreenshotIndex(null)}
                onDelete={deleteScreenshot}
                onNext={handleNext}
                onPrevious={handlePrevious}
                blurPrivacy={blurPrivacy}
            />
        </div>
    );
}
