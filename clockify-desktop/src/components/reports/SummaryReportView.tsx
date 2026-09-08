import { useState } from "react";
import {
    ChevronDown,
    Printer,
    Share2,
    FileText,
} from "lucide-react";

interface ProjectBreakdownItem {
    id: string;
    count: number;
    title: string;
    client?: string;
    color: string;
    duration: string;
    amount: string;
    percent: number;
}

const SUMMARY_PROJECTS: ProjectBreakdownItem[] = [
    {
        id: "p-internal",
        count: 4,
        title: "[SAMPLE] Internal Project",
        color: "#03A9F4",
        duration: "16:00:00",
        amount: "0,00 INR",
        percent: 25,
    },
    {
        id: "p-alpha",
        count: 4,
        title: "[SAMPLE] Project Alpha",
        client: "[SAMPLE] Client B",
        color: "#F59E0B",
        duration: "14:00:00",
        amount: "60,00 INR",
        percent: 21.875,
    },
    {
        id: "p-beta",
        count: 4,
        title: "[SAMPLE] Project Beta",
        client: "[SAMPLE] Client A",
        color: "#EF4444",
        duration: "18:00:00",
        amount: "75,00 INR",
        percent: 28.125,
    },
    {
        id: "p-gamma",
        count: 4,
        title: "[SAMPLE] Project Gamma",
        client: "[SAMPLE] Client A",
        color: "#6D4C41",
        duration: "16:00:00",
        amount: "195,00 INR",
        percent: 25,
    },
];

export function SummaryReportView() {
    const [isRoundingOn, setIsRoundingOn] = useState(false);
    const [showEstimate, setShowEstimate] = useState(false);
    const [billabilityFilter, setBillabilityFilter] = useState("Billability");
    const [isBillabilityDropdownOpen, setIsBillabilityDropdownOpen] = useState(false);

    return (
        <div className="space-y-4 select-none">
            {/* Top Stat Bar */}
            <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4">
                {/* Left Stats */}
                <div className="flex items-center gap-6 text-sm text-[#1E293B]">
                    <div>
                        <span className="text-xs text-[#64748B] mr-1.5">Total:</span>
                        <strong className="font-bold text-base">64:00:00</strong>
                    </div>
                    <div>
                        <span className="text-xs text-[#64748B] mr-1.5">Billable:</span>
                        <strong className="font-bold text-base">32:00:00</strong>
                    </div>
                    <div>
                        <span className="text-xs text-[#64748B] mr-1.5">Amount:</span>
                        <strong className="font-bold text-base text-[#1E293B]">330,00</strong>
                        <span className="text-xs text-[#64748B] ml-1 font-semibold">INR</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 text-xs">
                    <button
                        type="button"
                        className="text-[#64748B] hover:text-[#03A9F4] font-medium flex items-center gap-1 cursor-pointer transition"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Create invoice</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded hover:bg-[#F1F5F9] cursor-pointer transition"
                        title="Print Report"
                    >
                        <Printer className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded hover:bg-[#F1F5F9] cursor-pointer transition"
                        title="Share Report"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-[#E2E8F0]" />

                    {/* Rounding switch */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#64748B]">
                        <div
                            onClick={() => setIsRoundingOn(!isRoundingOn)}
                            className={`w-8 h-4 rounded-full transition-colors relative ${
                                isRoundingOn ? "bg-[#03A9F4]" : "bg-slate-300"
                            }`}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform absolute top-0.25 left-0.25 ${
                                    isRoundingOn ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                        </div>
                        <span>Rounding</span>
                    </label>

                    {/* Show amount */}
                    <div className="flex items-center gap-1 text-xs text-[#64748B] cursor-pointer hover:text-[#1E293B]">
                        <span>Show amount</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                </div>
            </div>

            {/* Billability Bar Chart Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs p-6 space-y-4">
                {/* Dropdown at top-left of chart */}
                <div className="relative inline-block">
                    <button
                        type="button"
                        onClick={() => setIsBillabilityDropdownOpen(!isBillabilityDropdownOpen)}
                        className="px-2.5 py-1 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>{billabilityFilter}</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {isBillabilityDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            {["Billability", "Project", "Client", "User"].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        setBillabilityFilter(opt);
                                        setIsBillabilityDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* The Chart Canvas Area */}
                <div className="relative pt-6 pb-2">
                    {/* Y-Axis Grid Lines */}
                    <div className="space-y-8 text-[11px] text-[#94A3B8] font-mono">
                        <div className="border-b border-dashed border-[#E2E8F0] pb-0.5 flex justify-between">
                            <span>69.4h</span>
                        </div>
                        <div className="border-b border-dashed border-[#E2E8F0] pb-0.5 flex justify-between">
                            <span>55.6h</span>
                        </div>
                        <div className="border-b border-dashed border-[#E2E8F0] pb-0.5 flex justify-between">
                            <span>41.7h</span>
                        </div>
                        <div className="border-b border-dashed border-[#E2E8F0] pb-0.5 flex justify-between">
                            <span>27.8h</span>
                        </div>
                        <div className="border-b border-dashed border-[#E2E8F0] pb-0.5 flex justify-between">
                            <span>13.9h</span>
                        </div>
                    </div>

                    {/* Bars Grid Overlay */}
                    <div className="absolute inset-0 pl-12 pr-4 flex items-end justify-between pt-4 pb-8 pointer-events-none">
                        {/* Monday Aug 31: Stacked Bar */}
                        <div className="flex flex-col items-center w-24">
                            <span className="text-[11px] font-mono font-bold text-[#1E293B] mb-1">
                                64:00:00
                            </span>
                            <div className="w-20 rounded-t overflow-hidden shadow-sm">
                                {/* Top portion: Non-billable (Light Green) */}
                                <div className="h-20 bg-[#9CCC65] hover:bg-[#8BC34A] transition" title="Non-billable: 32:00:00" />
                                {/* Bottom portion: Billable (Dark Green with $) */}
                                <div
                                    className="h-20 bg-[#689F38] hover:bg-[#558B2F] flex items-center justify-center text-white font-bold text-base transition"
                                    title="Billable: 32:00:00"
                                >
                                    $
                                </div>
                            </div>
                        </div>

                        {/* Tue Sep 1 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>

                        {/* Wed Sep 2 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>

                        {/* Thu Sep 3 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>

                        {/* Fri Sep 4 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>

                        {/* Sat Sep 5 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>

                        {/* Sun Sep 6 */}
                        <div className="flex flex-col items-center w-16 opacity-50">
                            <span className="text-[10px] font-mono text-[#94A3B8]">00:00:00</span>
                            <div className="w-12 h-0.5 bg-slate-200" />
                        </div>
                    </div>

                    {/* Bottom X-Axis Days Labels */}
                    <div className="flex justify-between pl-12 pr-4 pt-2 border-t border-[#CBD5E1] text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#1E293B] w-24 text-center">Mon, Aug 31</span>
                        <span className="w-16 text-center">Tue, Sep 1</span>
                        <span className="w-16 text-center">Wed, Sep 2</span>
                        <span className="w-16 text-center">Thu, Sep 3</span>
                        <span className="w-16 text-center">Fri, Sep 4</span>
                        <span className="w-16 text-center">Sat, Sep 5</span>
                        <span className="w-16 text-center">Sun, Sep 6</span>
                    </div>
                </div>
            </div>

            {/* Bottom Group Bar & Breakdown Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
                {/* Group By Toolbar */}
                <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-[#64748B] font-medium">Group by:</span>
                        <button
                            type="button"
                            className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded text-xs text-[#1E293B] flex items-center gap-1 cursor-pointer"
                        >
                            <span>Project</span>
                            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                        </button>
                        <button
                            type="button"
                            className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded text-xs text-[#1E293B] flex items-center gap-1 cursor-pointer"
                        >
                            <span>Description</span>
                            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                        </button>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                        <div
                            onClick={() => setShowEstimate(!showEstimate)}
                            className={`w-8 h-4 rounded-full transition-colors relative ${
                                showEstimate ? "bg-[#03A9F4]" : "bg-slate-300"
                            }`}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform absolute top-0.25 left-0.25 ${
                                    showEstimate ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                        </div>
                        <span>Show estimate</span>
                    </label>
                </div>

                {/* 2-Column: Left Table + Right Donut Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
                    {/* Left 8 Cols: Project Breakdown Table */}
                    <div className="lg:col-span-8 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                                    <th className="py-3 px-4 flex items-center gap-1">
                                        <ChevronDown className="w-3.5 h-3.5 text-[#03A9F4]" />
                                        <span>TITLE</span>
                                    </th>
                                    <th className="py-3 px-4 text-right">DURATION ↕</th>
                                    <th className="py-3 px-4 text-right">AMOUNT ↕</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                                {SUMMARY_PROJECTS.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-[#F8FAFC] transition cursor-pointer"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-5 h-5 rounded bg-[#E1F5FE] text-[#0288D1] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                                                    {item.count}
                                                </span>
                                                <span
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <div className="truncate">
                                                    <span className="font-medium text-[#03A9F4] hover:underline">
                                                        {item.title}
                                                    </span>
                                                    {item.client && (
                                                        <span className="text-[#64748B] ml-1.5 font-normal">
                                                            - {item.client}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-right text-[#1E293B]">
                                            {item.duration}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-right text-[#64748B]">
                                            {item.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Right 4 Cols: Donut Chart matching Clockify Reports (3).png */}
                    <div className="lg:col-span-4 p-6 flex flex-col items-center justify-center min-h-[260px]">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* SVG Donut Chart with exact 4 slices */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Slice 1: Cyan (25%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="34"
                                    fill="transparent"
                                    stroke="#03A9F4"
                                    strokeWidth="18"
                                    strokeDasharray="53.4 160.2"
                                    strokeDashoffset="0"
                                />
                                {/* Slice 2: Orange (21.875%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="34"
                                    fill="transparent"
                                    stroke="#F59E0B"
                                    strokeWidth="18"
                                    strokeDasharray="46.7 166.9"
                                    strokeDashoffset="-53.4"
                                />
                                {/* Slice 3: Red (28.125%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="34"
                                    fill="transparent"
                                    stroke="#EF4444"
                                    strokeWidth="18"
                                    strokeDasharray="60.1 153.5"
                                    strokeDashoffset="-100.1"
                                />
                                {/* Slice 4: Brown (25%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="34"
                                    fill="transparent"
                                    stroke="#6D4C41"
                                    strokeWidth="18"
                                    strokeDasharray="53.4 160.2"
                                    strokeDashoffset="-160.2"
                                />
                            </svg>

                            {/* Center Hole displaying 64:00:00 */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs font-mono font-bold text-[#1E293B]">
                                    64:00:00
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
