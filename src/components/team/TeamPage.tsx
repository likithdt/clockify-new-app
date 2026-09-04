import { useState, useMemo } from "react";
import {
    ChevronDown,
    Search,
    Plus,
    MoreVertical,
    Check,
    Download,
    CheckCircle2,
    X,
    RotateCcw,
} from "lucide-react";
import { useTeamStore, TeamMember, TeamTab } from "@/stores/useTeamStore";
import { ChangeRateModal } from "./ChangeRateModal";
import { AddFullMemberModal } from "./AddFullMemberModal";

export function TeamPage() {
    const {
        members,
        activeTab,
        statusFilter,
        billableRateFilter,
        costRateFilter,
        selectedRoles,
        searchQuery,
        selectedMemberIds,
        visibleFields,
        toastMessage,
        setActiveTab,
        setStatusFilter,
        setBillableRateFilter,
        setCostRateFilter,
        toggleRoleFilter,
        selectAllRoles,
        clearRoleFilter,
        setSearchQuery,
        toggleSelectMember,
        selectAllMembers,
        toggleVisibleField,
        setAddMemberOpen,
        setEditingRate,
        deleteMember,
        setToastMessage,
        resetSampleTeam,
    } = useTeamStore();

    // Dropdown open states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isBillableRateOpen, setIsBillableRateOpen] = useState(false);
    const [isCostRateOpen, setIsCostRateOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

    // Search for role in dropdown
    const [roleSearch, setRoleSearch] = useState("");

    const allRoles: TeamMember["role"][] = [
        "Admin",
        "Member",
        "Owner",
        "Project manager",
        "Team manager",
    ];

    const filteredRoles = allRoles.filter((r) =>
        r.toLowerCase().includes(roleSearch.toLowerCase())
    );

    // Filtering logic
    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            // Status filter
            if (statusFilter !== "All" && member.status !== statusFilter) {
                return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = member.name.toLowerCase().includes(q);
                const matchesEmail = member.email.toLowerCase().includes(q);
                if (!matchesName && !matchesEmail) return false;
            }

            // Role filter
            if (selectedRoles.length > 0 && !selectedRoles.includes(member.role)) {
                return false;
            }

            // Billable rate filter
            if (billableRateFilter.exactly !== "") {
                const target = parseFloat(billableRateFilter.exactly);
                if (member.billableRate !== target) return false;
            }
            if (billableRateFilter.smallerThan !== "") {
                const target = parseFloat(billableRateFilter.smallerThan);
                if (member.billableRate === null || member.billableRate >= target) return false;
            }
            if (billableRateFilter.largerThan !== "") {
                const target = parseFloat(billableRateFilter.largerThan);
                if (member.billableRate === null || member.billableRate <= target) return false;
            }

            // Cost rate filter
            if (costRateFilter.exactly !== "") {
                const target = parseFloat(costRateFilter.exactly);
                if (member.costRate !== target) return false;
            }
            if (costRateFilter.smallerThan !== "") {
                const target = parseFloat(costRateFilter.smallerThan);
                if (member.costRate === null || member.costRate >= target) return false;
            }
            if (costRateFilter.largerThan !== "") {
                const target = parseFloat(costRateFilter.largerThan);
                if (member.costRate === null || member.costRate <= target) return false;
            }

            return true;
        });
    }, [members, statusFilter, searchQuery, selectedRoles, billableRateFilter, costRateFilter]);

    const isAllSelected =
        members.length > 0 && selectedMemberIds.length === members.length;

    const handleExport = (type: string) => {
        setToastMessage(`Exported team & rates as ${type}.`);
        setIsExportOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f5f7fa] p-8">
            {/* Toast feedback */}
            {toastMessage && (
                <div className="fixed top-16 right-8 z-50 bg-[#1e293b] text-white px-4 py-3 rounded shadow-xl flex items-center gap-3 text-xs animate-in slide-in-from-top duration-200">
                    <CheckCircle2 className="w-4 h-4 text-[#03a9f4]" />
                    <span>{toastMessage}</span>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="text-gray-400 hover:text-white ml-2 cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Top Bar: Tabs [ FULL | LIMITED | GROUPS | REMINDERS ] and ADD FULL MEMBER */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    {(["FULL", "LIMITED", "GROUPS", "REMINDERS"] as TeamTab[]).map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t transition cursor-pointer ${
                                    isActive
                                        ? "bg-white text-[#1e293b] border-t border-l border-r border-[#e2e8f0] shadow-sm relative z-10"
                                        : "bg-[#eef2f6] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e293b]"
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={resetSampleTeam}
                        className="text-xs text-[#64748b] hover:text-[#03a9f4] flex items-center gap-1.5 transition cursor-pointer"
                        title="Reset sample members"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Sample Data</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setAddMemberOpen(true)}
                        className="h-9 px-4 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                        ADD FULL MEMBER
                    </button>
                </div>
            </div>

            {/* Main Content Box with Filter Toolbar and Table */}
            <div className="bg-white border border-[#e2e8f0] rounded shadow-sm overflow-hidden flex flex-col">
                {/* Filter Toolbar matching Team.png */}
                <div className="p-4 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 bg-white">
                    {/* Left Dropdown Filters */}
                    <div className="flex items-center flex-wrap gap-2">
                        {/* FILTER dropdown (Standard Fields toggle) */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFilterOpen(!isFilterOpen);
                                    setIsStatusOpen(false);
                                    setIsBillableRateOpen(false);
                                    setIsCostRateOpen(false);
                                    setIsRoleOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition uppercase font-semibold text-[11px]"
                            >
                                <span>FILTER</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-52 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-2 text-xs">
                                    <div className="px-3 py-1 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                        STANDARD FIELDS
                                    </div>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.billableRate}
                                            onChange={() => toggleVisibleField("billableRate")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Billable rate</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.costRate}
                                            onChange={() => toggleVisibleField("costRate")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Cost rate</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.role}
                                            onChange={() => toggleVisibleField("role")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Role</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.group}
                                            onChange={() => toggleVisibleField("group")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Group</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.weekStart}
                                            onChange={() => toggleVisibleField("weekStart")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Week start</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.workingDays}
                                            onChange={() => toggleVisibleField("workingDays")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Working days</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleFields.dailyWorkCapacity}
                                            onChange={() => toggleVisibleField("dailyWorkCapacity")}
                                            className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                        />
                                        <span>Daily work capacity</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Status (All / Active / Inactive / Invited) */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatusOpen(!isStatusOpen);
                                    setIsFilterOpen(false);
                                    setIsBillableRateOpen(false);
                                    setIsCostRateOpen(false);
                                    setIsRoleOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>{statusFilter}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isStatusOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-32 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                    {(["Active", "Inactive", "All", "Invited"] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                                setStatusFilter(s);
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                        >
                                            <span>{s}</span>
                                            {statusFilter === s && <Check className="w-3.5 h-3.5 text-[#03a9f4]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Billable rate dropdown matching Team (Billable rate).png */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsBillableRateOpen(!isBillableRateOpen);
                                    setIsCostRateOpen(false);
                                    setIsFilterOpen(false);
                                    setIsStatusOpen(false);
                                    setIsRoleOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>Billable rate</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isBillableRateOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-56 bg-white border border-[#d1d5db] rounded shadow-xl z-30 p-3 text-xs space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Exactly</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={billableRateFilter.exactly}
                                            onChange={(e) =>
                                                setBillableRateFilter({ exactly: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Smaller than</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={billableRateFilter.smallerThan}
                                            onChange={(e) =>
                                                setBillableRateFilter({ smallerThan: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Larger than</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={billableRateFilter.largerThan}
                                            onChange={(e) =>
                                                setBillableRateFilter({ largerThan: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="pt-2 border-t border-[#f3f4f6] flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setBillableRateFilter({ exactly: "", smallerThan: "", largerThan: "" })
                                            }
                                            className="text-[11px] text-[#03a9f4] hover:underline"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cost rate dropdown matching Team(CostRate).png */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCostRateOpen(!isCostRateOpen);
                                    setIsBillableRateOpen(false);
                                    setIsFilterOpen(false);
                                    setIsStatusOpen(false);
                                    setIsRoleOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>Cost rate</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isCostRateOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-56 bg-white border border-[#d1d5db] rounded shadow-xl z-30 p-3 text-xs space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Exactly</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={costRateFilter.exactly}
                                            onChange={(e) =>
                                                setCostRateFilter({ exactly: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Smaller than</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={costRateFilter.smallerThan}
                                            onChange={(e) =>
                                                setCostRateFilter({ smallerThan: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-20 text-[#4b5563]">Larger than</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={costRateFilter.largerThan}
                                            onChange={(e) =>
                                                setCostRateFilter({ largerThan: e.target.value })
                                            }
                                            className="w-24 h-7 px-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                        />
                                    </div>
                                    <div className="pt-2 border-t border-[#f3f4f6] flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCostRateFilter({ exactly: "", smallerThan: "", largerThan: "" })
                                            }
                                            className="text-[11px] text-[#03a9f4] hover:underline"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Role dropdown matching Team(Role).png */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRoleOpen(!isRoleOpen);
                                    setIsBillableRateOpen(false);
                                    setIsCostRateOpen(false);
                                    setIsFilterOpen(false);
                                    setIsStatusOpen(false);
                                }}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>Role</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isRoleOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-56 bg-white border border-[#d1d5db] rounded shadow-xl z-30 py-2 text-xs">
                                    <div className="px-3 pb-2 border-b border-[#e5e7eb]">
                                        <div className="relative flex items-center">
                                            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search Role"
                                                value={roleSearch}
                                                onChange={(e) => setRoleSearch(e.target.value)}
                                                className="w-full h-7 pl-7 pr-2 border border-[#d1d5db] rounded text-xs focus:outline-none focus:border-[#03a9f4]"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-1.5">
                                        <label className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.length === allRoles.length}
                                                onChange={() => {
                                                    if (selectedRoles.length === allRoles.length) {
                                                        clearRoleFilter();
                                                    } else {
                                                        selectAllRoles(allRoles);
                                                    }
                                                }}
                                                className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                            />
                                            <span className="font-semibold text-[#1e293b]">Select all</span>
                                        </label>

                                        <div className="px-3 py-1 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                            ROLE
                                        </div>

                                        {filteredRoles.map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#f3f4f6] cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoles.includes(role)}
                                                    onChange={() => toggleRoleFilter(role)}
                                                    className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0"
                                                />
                                                <span>{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Group dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsGroupOpen(!isGroupOpen)}
                                className="h-8 px-3 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#374151] flex items-center gap-2 cursor-pointer transition"
                            >
                                <span>Group</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                            </button>

                            {isGroupOpen && (
                                <div className="absolute left-0 top-9 mt-1 w-36 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsGroupOpen(false)}
                                        className="w-full text-left px-3 py-1.5 text-[#374151] hover:bg-[#f3f4f6]"
                                    >
                                        All Groups
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Search Input & APPLY FILTER button */}
                    <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-2.5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-8 pl-9 pr-3 bg-white border border-[#d1d5db] rounded text-xs text-[#1f2937] focus:outline-none focus:border-[#03a9f4]"
                            />
                        </div>
                        <button
                            type="button"
                            className="h-8 px-3.5 border border-[#03a9f4] text-[#03a9f4] hover:bg-[#e1f5fe] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                        >
                            APPLY FILTER
                        </button>
                    </div>
                </div>

                {/* Sub-header Bar: Members and Export */}
                <div className="px-6 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs text-[#64748b]">
                    <div className="font-semibold text-[#475569]">
                        Members ({filteredMembers.length})
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="text-xs text-[#64748b] hover:text-[#1e293b] flex items-center gap-1 cursor-pointer transition font-medium"
                        >
                            <Download className="w-3 h-3" />
                            <span>Export</span>
                            <ChevronDown className="w-3 h-3 text-[#9ca3af]" />
                        </button>

                        {isExportOpen && (
                            <div className="absolute right-0 top-6 mt-1 w-32 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleExport("CSV")}
                                    className="w-full text-left px-3 py-1.5 text-[#374151] hover:bg-[#f3f4f6]"
                                >
                                    CSV
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleExport("Excel")}
                                    className="w-full text-left px-3 py-1.5 text-[#374151] hover:bg-[#f3f4f6]"
                                >
                                    Excel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team & Rates Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-[#e5e7eb] bg-white text-[#64748b] font-semibold text-[11px] uppercase tracking-wider">
                                <th className="py-3 px-4 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={selectAllMembers}
                                        className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                    />
                                </th>
                                <th className="py-3 px-4">NAME ⬍</th>
                                <th className="py-3 px-4">EMAIL ⬍</th>
                                {visibleFields.billableRate && (
                                    <th className="py-3 px-4">BILLABLE RATE (INR) ⬍</th>
                                )}
                                {visibleFields.costRate && (
                                    <th className="py-3 px-4">COST RATE (INR) ⬍</th>
                                )}
                                {visibleFields.role && <th className="py-3 px-4">ROLE</th>}
                                {visibleFields.group && <th className="py-3 px-4">GROUP</th>}
                                <th className="py-3 px-4 w-12 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] text-[#334155] bg-white">
                            {filteredMembers.map((member) => {
                                const isChecked = selectedMemberIds.includes(member.id);

                                return (
                                    <tr
                                        key={member.id}
                                        className={`hover:bg-[#f8fafc] transition ${
                                            isChecked ? "bg-[#f0f9ff]" : ""
                                        }`}
                                    >
                                        <td className="py-3.5 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleSelectMember(member.id)}
                                                className="rounded border-[#cbd5e1] text-[#03a9f4] focus:ring-0 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-[#1e293b]">
                                            {member.name}
                                        </td>
                                        <td className="py-3.5 px-4 text-[#64748b] max-w-xs truncate font-mono text-[11px]">
                                            {member.email}
                                        </td>

                                        {/* Billable Rate Column matching Team.png */}
                                        {visibleFields.billableRate && (
                                            <td className="py-3.5 px-4">
                                                <div className="inline-flex items-stretch border border-[#d1d5db] bg-[#eef2f6] rounded overflow-hidden text-xs">
                                                    <span className="px-3 py-1 text-center font-normal text-[#1e293b] min-w-[42px]">
                                                        {member.billableRate !== null
                                                            ? `${member.billableRate}`
                                                            : "—"}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingRate({
                                                                memberId: member.id,
                                                                memberName: member.name,
                                                                type: "billable",
                                                                currentRate: member.billableRate,
                                                            })
                                                        }
                                                        className="px-2.5 py-1 bg-white hover:bg-[#f8fafc] text-[#03a9f4] border-l border-[#d1d5db] font-normal text-xs cursor-pointer transition"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            </td>
                                        )}

                                        {/* Cost Rate Column matching Team.png */}
                                        {visibleFields.costRate && (
                                            <td className="py-3.5 px-4">
                                                <div className="inline-flex items-stretch border border-[#d1d5db] bg-[#eef2f6] rounded overflow-hidden text-xs">
                                                    <span className="px-3 py-1 text-center font-normal text-[#1e293b] min-w-[42px]">
                                                        {member.costRate !== null
                                                            ? `${member.costRate}`
                                                            : "—"}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingRate({
                                                                memberId: member.id,
                                                                memberName: member.name,
                                                                type: "cost",
                                                                currentRate: member.costRate,
                                                            })
                                                        }
                                                        className="px-2.5 py-1 bg-white hover:bg-[#f8fafc] text-[#03a9f4] border-l border-[#d1d5db] font-normal text-xs cursor-pointer transition"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            </td>
                                        )}

                                        {/* Role Pill Column */}
                                        {visibleFields.role && (
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium ${
                                                        member.role === "Owner"
                                                            ? "bg-[#0288d1] text-white"
                                                            : "bg-[#e0f2fe] text-[#0288d1]"
                                                    }`}
                                                >
                                                    {member.role}
                                                </span>
                                            </td>
                                        )}

                                        {/* Group Column */}
                                        {visibleFields.group && (
                                            <td className="py-3.5 px-4">
                                                <button
                                                    type="button"
                                                    className="text-xs text-[#03a9f4] hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Group</span>
                                                </button>
                                            </td>
                                        )}

                                        {/* 3 dots action menu */}
                                        <td className="py-3.5 px-4 text-center relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveActionMenuId(
                                                        activeActionMenuId === member.id ? null : member.id
                                                    )
                                                }
                                                className="text-[#9ca3af] hover:text-[#4b5563] p-1 rounded transition cursor-pointer"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeActionMenuId === member.id && (
                                                <div className="absolute right-4 top-10 mt-1 w-44 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingRate({
                                                                memberId: member.id,
                                                                memberName: member.name,
                                                                type: "billable",
                                                                currentRate: member.billableRate,
                                                            });
                                                            setActiveActionMenuId(null);
                                                        }}
                                                        className="w-full text-left px-3 py-1.5 hover:bg-[#f3f4f6] text-[#374151]"
                                                    >
                                                        Edit Billable Rate
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingRate({
                                                                memberId: member.id,
                                                                memberName: member.name,
                                                                type: "cost",
                                                                currentRate: member.costRate,
                                                            });
                                                            setActiveActionMenuId(null);
                                                        }}
                                                        className="w-full text-left px-3 py-1.5 hover:bg-[#f3f4f6] text-[#374151]"
                                                    >
                                                        Edit Cost Rate
                                                    </button>
                                                    {!member.isCurrentUser && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                deleteMember(member.id);
                                                                setActiveActionMenuId(null);
                                                            }}
                                                            className="w-full text-left px-3 py-1.5 hover:bg-[#fef2f2] text-[#ef4444]"
                                                        >
                                                            Remove Member
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <ChangeRateModal />
            <AddFullMemberModal />
        </div>
    );
}
