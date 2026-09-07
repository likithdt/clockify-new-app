import type { ScreenshotItem } from "@/stores/useActivityStore";
import { X, Trash2, ChevronLeft, ChevronRight, EyeOff, Laptop } from "lucide-react";

interface ScreenshotModalProps {
    screenshot: ScreenshotItem | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    blurPrivacy: boolean;
}

export function ScreenshotModal({
    screenshot,
    onClose,
    onDelete,
    onNext,
    onPrevious,
    blurPrivacy,
}: ScreenshotModalProps) {
    if (!screenshot) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
            <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#03a9f4] text-white flex items-center justify-center font-bold text-xs">
                            <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#1e293b] flex items-center gap-2">
                                <span>{screenshot.appName}</span>
                                <span className="text-xs font-normal text-[#64748b]">· {screenshot.windowTitle}</span>
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-[#64748b]">
                                <span>{screenshot.memberName}</span>
                                <span>•</span>
                                <span className="font-mono">{screenshot.timeFormatted}</span>
                                <span>•</span>
                                <span
                                    className="font-semibold px-1.5 py-0.2 rounded text-[11px]"
                                    style={{
                                        color: screenshot.projectColor,
                                        backgroundColor: `${screenshot.projectColor}15`,
                                    }}
                                >
                                    {screenshot.project}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#ecfdf5] text-[#047857] text-xs font-mono font-bold rounded">
                            {screenshot.activityPercent}% Active
                        </span>
                        <button
                            onClick={() => {
                                onDelete(screenshot.id);
                                onClose();
                            }}
                            className="p-1.5 text-[#ef4444] hover:bg-red-50 rounded transition"
                            title="Delete screenshot"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Screenshot Visual Content */}
                <div className="flex-1 bg-[#0f172a] p-6 relative flex items-center justify-center overflow-auto min-h-[360px]">
                    <div
                        className={`w-full max-w-3xl aspect-video rounded-lg shadow-xl overflow-hidden border border-slate-700 transition-all ${
                            blurPrivacy ? "filter blur-md select-none" : ""
                        }`}
                    >
                        {screenshot.type === "figma" && (
                            <div className="w-full h-full bg-[#1e293b] flex flex-col p-4 text-slate-200 font-sans">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs font-semibold text-cyan-400">Figma - {screenshot.windowTitle}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">100% · Zoom: Fit</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center bg-slate-900/60 rounded mt-3 border border-slate-800 p-8">
                                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                        <div className="h-28 bg-[#03a9f4]/20 border border-[#03a9f4] rounded-lg p-3 flex flex-col justify-between">
                                            <span className="text-xs font-bold text-cyan-300">Activity Screen</span>
                                            <div className="space-y-1">
                                                <div className="h-2 bg-cyan-400/40 rounded w-3/4" />
                                                <div className="h-2 bg-cyan-400/20 rounded w-1/2" />
                                            </div>
                                        </div>
                                        <div className="h-28 bg-emerald-500/20 border border-emerald-500 rounded-lg p-3 flex flex-col justify-between">
                                            <span className="text-xs font-bold text-emerald-300">GPS Map View</span>
                                            <div className="space-y-1">
                                                <div className="h-2 bg-emerald-400/40 rounded w-3/4" />
                                                <div className="h-2 bg-emerald-400/20 rounded w-1/2" />
                                            </div>
                                        </div>
                                        <div className="h-28 bg-purple-500/20 border border-purple-500 rounded-lg p-3 flex flex-col justify-between">
                                            <span className="text-xs font-bold text-purple-300">Timeline Audit</span>
                                            <div className="space-y-1">
                                                <div className="h-2 bg-purple-400/40 rounded w-3/4" />
                                                <div className="h-2 bg-purple-400/20 rounded w-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {screenshot.type === "code" && (
                            <div className="w-full h-full bg-[#181825] flex flex-col p-4 text-slate-200 font-mono text-xs">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-emerald-400 font-bold">{screenshot.windowTitle}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-500">TypeScript · UTF-8</span>
                                </div>
                                <div className="flex-1 p-4 bg-[#11111b] rounded mt-3 border border-slate-800 space-y-2 overflow-auto font-mono text-[11px]">
                                    <div className="text-slate-500">// Real-time Timer and Screenshot capturing hook</div>
                                    <div><span className="text-purple-400">import</span> &#123; useEffect, useState &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">"react"</span>;</div>
                                    <div><span className="text-purple-400">import</span> &#123; useActivityStore &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">"@/stores/useActivityStore"</span>;</div>
                                    <div className="pt-2"><span className="text-blue-400">export function</span> <span className="text-yellow-300">useScreenshotInterval</span>() &#123;</div>
                                    <div className="pl-4 text-slate-300">const &#123; isScreenshotsActive, addScreenshot &#125; = useActivityStore();</div>
                                    <div className="pl-4 text-cyan-300">console.log("Screenshot interval tick: 5 min capture saved.");</div>
                                    <div>&#125;</div>
                                </div>
                            </div>
                        )}

                        {(screenshot.type === "browser" || screenshot.type === "slack" || screenshot.type === "terminal") && (
                            <div className="w-full h-full bg-[#1e293b] flex flex-col p-4 text-slate-200">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs font-semibold text-slate-300">{screenshot.windowTitle}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">{screenshot.appName}</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center bg-slate-900/60 rounded mt-3 border border-slate-800 p-8 text-center text-slate-400 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-300 mb-1">{screenshot.appName} Active Session</p>
                                        <p className="text-xs text-slate-500">Capture verified at {screenshot.timeFormatted} with {screenshot.activityPercent}% keyboard/mouse activity</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {blurPrivacy && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg text-white text-xs font-medium flex items-center gap-2 border border-white/10 shadow-lg">
                                <EyeOff className="w-4 h-4 text-cyan-400" />
                                <span>Privacy Blur Enabled</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Controls: Nav buttons */}
                <div className="px-6 py-3 border-t border-[#e2e8f0] flex items-center justify-between bg-white">
                    <button
                        onClick={onPrevious}
                        className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569] rounded text-xs font-medium flex items-center gap-1 transition"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span className="text-xs text-[#64748b]">
                        Interval: 5 mins • Captured automatically while tracking
                    </span>

                    <button
                        onClick={onNext}
                        className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569] rounded text-xs font-medium flex items-center gap-1 transition"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
