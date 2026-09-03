import { useState, useRef, useEffect } from "react";
import {
    useProjectStore,
    type StatusFilter,
    type AccessFilter,
    type BillingFilter,
} from "@/stores/useProjectStore";
import { Search, ChevronDown } from "lucide-react";

export function ProjectsFilterBar() {
    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        clientFilter,
        setClientFilter,
        accessFilter,
        setAccessFilter,
        billingFilter,
        setBillingFilter,
    } = useProjectStore();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const filterBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleApplyFilter = () => {
        setSearchQuery(localSearch);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleApplyFilter();
        }
    };

    return (
        <div
            ref={filterBarRef}
            className="w-full bg-white border border-[#e2e8f0] rounded-sm shadow-xs flex items-center select-none"
        >
            {/* Filter Label */}
            <div className="px-5 py-2.5 border-r border-[#e2e8f0] text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider flex-shrink-0">
                FILTER
            </div>

            {/* Status Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                    className="px-4 py-2.5 border-r border-[#e2e8f0] flex items-center gap-1.5 text-xs text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
                >
                    <span>{statusFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                {openDropdown === "status" && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[120px] text-xs">
                        {(["Active", "Archived", "All"] as StatusFilter[]).map((st) => (
                            <button
                                key={st}
                                onClick={() => {
                                    setStatusFilter(st);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] cursor-pointer ${
                                    statusFilter === st ? "font-semibold text-[#03a9f4]" : "text-[#1e293b]"
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Client Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "client" ? null : "client")}
                    className="px-4 py-2.5 border-r border-[#e2e8f0] flex items-center gap-1.5 text-xs text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
                >
                    <span>{clientFilter === "All" ? "Client" : clientFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                {openDropdown === "client" && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[160px] text-xs">
                        {["All", "[SAMPLE] Client A", "[SAMPLE] Client B", "Without client"].map((cl) => (
                            <button
                                key={cl}
                                onClick={() => {
                                    setClientFilter(cl);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] cursor-pointer ${
                                    clientFilter === cl ? "font-semibold text-[#03a9f4]" : "text-[#1e293b]"
                                }`}
                            >
                                {cl}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Access Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "access" ? null : "access")}
                    className="px-4 py-2.5 border-r border-[#e2e8f0] flex items-center gap-1.5 text-xs text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
                >
                    <span>{accessFilter === "All" ? "Access" : accessFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                {openDropdown === "access" && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[120px] text-xs">
                        {(["All", "Public", "Private"] as AccessFilter[]).map((acc) => (
                            <button
                                key={acc}
                                onClick={() => {
                                    setAccessFilter(acc);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] cursor-pointer ${
                                    accessFilter === acc ? "font-semibold text-[#03a9f4]" : "text-[#1e293b]"
                                }`}
                            >
                                {acc}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Billing Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "billing" ? null : "billing")}
                    className="px-4 py-2.5 border-r border-[#e2e8f0] flex items-center gap-1.5 text-xs text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
                >
                    <span>{billingFilter === "All" ? "Billing" : billingFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                {openDropdown === "billing" && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[130px] text-xs">
                        {(["All", "Billable", "Non-billable"] as BillingFilter[]).map((b) => (
                            <button
                                key={b}
                                onClick={() => {
                                    setBillingFilter(b);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] cursor-pointer ${
                                    billingFilter === b ? "font-semibold text-[#03a9f4]" : "text-[#1e293b]"
                                }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center px-3">
                <Search className="w-4 h-4 text-[#94a3b8] mr-2 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Find by name"
                    value={localSearch}
                    onChange={(e) => {
                        setLocalSearch(e.target.value);
                        setSearchQuery(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full text-xs text-[#1e293b] placeholder:text-[#94a3b8] bg-transparent outline-none py-2"
                />
            </div>

            {/* Apply Filter Button */}
            <button
                type="button"
                onClick={handleApplyFilter}
                className="px-5 py-2.5 border-l border-[#e2e8f0] text-xs font-semibold text-[#03a9f4] hover:bg-[#f8fafc] transition uppercase tracking-wider flex-shrink-0 cursor-pointer"
            >
                APPLY FILTER
            </button>
        </div>
    );
}
