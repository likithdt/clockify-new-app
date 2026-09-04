import { useState, useRef, useEffect } from "react";
import {
    useProjectStore,
    type StatusFilter,
    type AccessFilter,
    type BillingFilter,
} from "@/stores/useProjectStore";
import { Search, ChevronDown, Check } from "lucide-react";

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
            className="w-full bg-white border border-[#e2e8f0] rounded-sm shadow-xs px-5 py-2.5 flex items-center justify-between select-none"
        >
            {/* Left Filter Group matching Projects.png */}
            <div className="flex items-center gap-6">
                {/* Filter Label */}
                <span className="text-xs font-semibold text-[#8292a2] uppercase tracking-wider select-none">
                    FILTER
                </span>

                {/* Status Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                        className="flex items-center gap-1.5 text-xs text-[#334155] hover:text-[#03a9f4] transition cursor-pointer"
                    >
                        <span>{statusFilter}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                    </button>

                    {openDropdown === "status" && (
                        <div className="absolute left-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[120px] text-xs">
                            {(["Active", "Archived", "All"] as StatusFilter[]).map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(st);
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] flex items-center justify-between text-[#334155]"
                                >
                                    <span>{st}</span>
                                    {statusFilter === st && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
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
                        className="flex items-center gap-1.5 text-xs text-[#334155] hover:text-[#03a9f4] transition cursor-pointer"
                    >
                        <span>{clientFilter === "All" ? "Client" : clientFilter}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                    </button>

                    {openDropdown === "client" && (
                        <div className="absolute left-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[160px] text-xs">
                            {["All", "[SAMPLE] Client A", "[SAMPLE] Client B", "Without client"].map((cl) => (
                                <button
                                    key={cl}
                                    type="button"
                                    onClick={() => {
                                        setClientFilter(cl);
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] flex items-center justify-between text-[#334155]"
                                >
                                    <span>{cl}</span>
                                    {clientFilter === cl && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
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
                        className="flex items-center gap-1.5 text-xs text-[#334155] hover:text-[#03a9f4] transition cursor-pointer"
                    >
                        <span>{accessFilter === "All" ? "Access" : accessFilter}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                    </button>

                    {openDropdown === "access" && (
                        <div className="absolute left-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[120px] text-xs">
                            {(["All", "Public", "Private"] as AccessFilter[]).map((acc) => (
                                <button
                                    key={acc}
                                    type="button"
                                    onClick={() => {
                                        setAccessFilter(acc);
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] flex items-center justify-between text-[#334155]"
                                >
                                    <span>{acc}</span>
                                    {accessFilter === acc && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
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
                        className="flex items-center gap-1.5 text-xs text-[#334155] hover:text-[#03a9f4] transition cursor-pointer"
                    >
                        <span>{billingFilter === "All" ? "Billing" : billingFilter}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                    </button>

                    {openDropdown === "billing" && (
                        <div className="absolute left-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[130px] text-xs">
                            {(["All", "Billable", "Non-billable"] as BillingFilter[]).map((b) => (
                                <button
                                    key={b}
                                    type="button"
                                    onClick={() => {
                                        setBillingFilter(b);
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] flex items-center justify-between text-[#334155]"
                                >
                                    <span>{b}</span>
                                    {billingFilter === b && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Search Input & Apply Filter Button matching Projects.png */}
            <div className="flex items-center gap-3">
                <div className="relative flex items-center border border-[#cbd5e1] rounded-sm px-3 py-1.5 bg-white w-72 focus-within:border-[#03a9f4]">
                    <Search className="w-3.5 h-3.5 text-[#94a3b8] mr-2 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Find by name"
                        value={localSearch}
                        onChange={(e) => {
                            setLocalSearch(e.target.value);
                            setSearchQuery(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full text-xs text-[#1e293b] placeholder:text-[#94a3b8] bg-transparent outline-none"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleApplyFilter}
                    className="px-4 py-1.5 border border-[#03a9f4] text-[#03a9f4] hover:bg-[#e1f5fe] rounded-sm text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex-shrink-0"
                >
                    APPLY FILTER
                </button>
            </div>
        </div>
    );
}
