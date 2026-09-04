import { useState, useRef, useEffect } from "react";
import { ReportsFilterBar } from "./ReportsFilterBar";
import { SummaryReportView } from "./SummaryReportView";
import { DetailedReportView } from "./DetailedReportView";
import { WeeklyReportView } from "./WeeklyReportView";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Download,
    FileSpreadsheet,
    FileText,
} from "lucide-react";

export type ReportTab = "summary" | "detailed" | "weekly" | "shared";

export function ReportsPage() {
    const [activeTab, setActiveTab] = useState<ReportTab>("summary");
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isReportTypeOpen, setIsReportTypeOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
                setIsExportOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExport = (format: string) => {
        setIsExportOpen(false);
        alert(`Exporting ${activeTab.toUpperCase()} report as ${format}...`);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            {/* Top Sub-Nav & Date Range Controls matching Reports.png */}
            <div className="p-6 pb-2 max-w-[1400px] w-full mx-auto space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Left: TIME REPORT dropdown + Tab Pills */}
                    <div className="flex items-center gap-2">
                        {/* TIME REPORT selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsReportTypeOpen(!isReportTypeOpen)}
                                className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded text-xs font-bold text-[#1E293B] flex items-center gap-1.5 uppercase tracking-wider transition cursor-pointer"
                            >
                                <span>TIME REPORT</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                            </button>
                            {isReportTypeOpen && (
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsReportTypeOpen(false)}
                                        className="w-full text-left px-3 py-1.5 font-bold text-[#03A9F4] bg-[#E1F5FE]"
                                    >
                                        TIME REPORT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsReportTypeOpen(false)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                    >
                                        EXPENSE REPORT
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tabs: Summary, Detailed, Weekly, Shared */}
                        <div className="flex items-center bg-[#E2E8F0] p-0.5 rounded">
                            <button
                                type="button"
                                onClick={() => setActiveTab("summary")}
                                className={`px-4 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                    activeTab === "summary"
                                        ? "bg-white text-[#1E293B] shadow-xs"
                                        : "text-[#64748B] hover:text-[#1E293B]"
                                }`}
                            >
                                Summary
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("detailed")}
                                className={`px-4 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                    activeTab === "detailed"
                                        ? "bg-white text-[#1E293B] shadow-xs"
                                        : "text-[#64748B] hover:text-[#1E293B]"
                                }`}
                            >
                                Detailed
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("weekly")}
                                className={`px-4 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                    activeTab === "weekly"
                                        ? "bg-white text-[#1E293B] shadow-xs"
                                        : "text-[#64748B] hover:text-[#1E293B]"
                                }`}
                            >
                                Weekly
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("shared")}
                                className={`px-4 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                    activeTab === "shared"
                                        ? "bg-white text-[#1E293B] shadow-xs"
                                        : "text-[#64748B] hover:text-[#1E293B]"
                                }`}
                            >
                                Shared
                            </button>
                        </div>
                    </div>

                    {/* Right: Date Range & EXPORT button */}
                    <div className="flex items-center gap-2">
                        {/* Date Range Picker */}
                        <div className="flex items-center border border-[#E2E8F0] bg-white rounded shadow-xs">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#1E293B] font-medium hover:bg-[#F8FAFC] transition cursor-pointer"
                            >
                                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <span>This week</span>
                            </button>
                            <div className="h-4 w-px bg-[#E2E8F0]" />
                            <button
                                type="button"
                                className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] transition cursor-pointer"
                                title="Previous week"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <div className="h-4 w-px bg-[#E2E8F0]" />
                            <button
                                type="button"
                                className="p-1.5 hover:bg-[#F8FAFC] text-[#64748B] transition cursor-pointer"
                                title="Next week"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* EXPORT Dropdown */}
                        <div className="relative" ref={exportRef}>
                            <button
                                type="button"
                                onClick={() => setIsExportOpen(!isExportOpen)}
                                className="px-3 py-1.5 bg-white border border-[#03A9F4] text-[#03A9F4] hover:bg-[#E1F5FE] rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
                            >
                                <span>EXPORT</span>
                                <ChevronDown className="w-3 h-3 text-[#03A9F4]" />
                            </button>

                            {isExportOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleExport("CSV")}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center gap-2 text-[#1E293B] cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5 text-[#64748B]" />
                                        <span>Save as CSV</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExport("Excel")}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center gap-2 text-[#1E293B] cursor-pointer"
                                    >
                                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#10B981]" />
                                        <span>Save as Excel</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExport("PDF")}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center gap-2 text-[#1E293B] cursor-pointer"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                        <span>Save as PDF</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <ReportsFilterBar />

                {/* Main Tab View */}
                <div className="pt-2">
                    {activeTab === "summary" && <SummaryReportView />}
                    {activeTab === "detailed" && <DetailedReportView />}
                    {activeTab === "weekly" && <WeeklyReportView />}
                    {activeTab === "shared" && (
                        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center text-xs text-[#94A3B8]">
                            No shared report links have been created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
