import { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";

interface Props {
    onApplyFilter?: () => void;
}

export function ReportsFilterBar({ onApplyFilter }: Props) {
    const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedClient, setSelectedClient] = useState("All");
    const [selectedProject, setSelectedProject] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (barRef.current && !barRef.current.contains(e.target as Node)) {
                setActiveFilterDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setActiveFilterDropdown(activeFilterDropdown === name ? null : name);
    };

    return (
        <div
            ref={barRef}
            className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-2.5 select-none"
        >
            <div className="flex flex-wrap items-center gap-2">
                {/* FILTER button */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("filter")}
                        className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs font-semibold text-[#64748B] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>FILTER</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {activeFilterDropdown === "filter" && (
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            <div className="px-3 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase">
                                Quick Presets
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveFilterDropdown(null)}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                            >
                                All Time Logs
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilterDropdown(null)}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                            >
                                Only Billable Time
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilterDropdown(null)}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                            >
                                Non-billable Only
                            </button>
                        </div>
                    )}
                </div>

                {/* Team dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("team")}
                        className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Team</span>
                        {selectedTeam !== "All" && (
                            <span className="font-semibold text-[#03A9F4]">({selectedTeam})</span>
                        )}
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {activeFilterDropdown === "team" && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            {["All", "Bindhu Shree", "Likith D T", "Amy Smith", "James Anderson"].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTeam(t);
                                        setActiveFilterDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Client dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("client")}
                        className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Client</span>
                        {selectedClient !== "All" && (
                            <span className="font-semibold text-[#03A9F4]">({selectedClient})</span>
                        )}
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {activeFilterDropdown === "client" && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            {["All", "[SAMPLE] Client A", "[SAMPLE] Client B"].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        setSelectedClient(c);
                                        setActiveFilterDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Project dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("project")}
                        className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Project</span>
                        {selectedProject !== "All" && (
                            <span className="font-semibold text-[#03A9F4]">({selectedProject})</span>
                        )}
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {activeFilterDropdown === "project" && (
                        <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            {["All", "[SAMPLE] Internal Project", "[SAMPLE] Project Alpha", "[SAMPLE] Project Beta", "[SAMPLE] Project Gamma"].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                        setSelectedProject(p);
                                        setActiveFilterDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B] truncate"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Task dropdown */}
                <button
                    type="button"
                    onClick={() => toggleDropdown("task")}
                    className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                >
                    <span>Task</span>
                    <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>

                {/* Tag dropdown */}
                <button
                    type="button"
                    onClick={() => toggleDropdown("tag")}
                    className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                >
                    <span>Tag</span>
                    <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>

                {/* Status dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("status")}
                        className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Status</span>
                        {selectedStatus !== "All" && (
                            <span className="font-semibold text-[#03A9F4]">({selectedStatus})</span>
                        )}
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </button>
                    {activeFilterDropdown === "status" && (
                        <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                            {["All", "Billable", "Non-billable"].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                        setSelectedStatus(s);
                                        setActiveFilterDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description dropdown */}
                <button
                    type="button"
                    onClick={() => toggleDropdown("description")}
                    className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                >
                    <span>Description</span>
                    <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>

                {/* Kiosk dropdown */}
                <button
                    type="button"
                    onClick={() => toggleDropdown("kiosk")}
                    className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded text-xs text-[#334155] flex items-center gap-1.5 transition cursor-pointer"
                >
                    <span>Kiosk</span>
                    <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>
            </div>

            {/* APPLY FILTER Button */}
            <button
                type="button"
                onClick={onApplyFilter}
                className="px-4 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition cursor-pointer flex-shrink-0"
            >
                APPLY FILTER
            </button>
        </div>
    );
}
