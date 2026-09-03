import { useState } from "react";
import {
    useProjectStore,
} from "@/stores/useProjectStore";
import {
    ChevronDown,
    ArrowUpDown,
    Star,
    MoreVertical,
    RotateCw,
    Download,
    Trash2,
    Archive,
    Copy,
    Edit,
} from "lucide-react";

export function ProjectsTable() {
    const {
        projects,
        searchQuery,
        statusFilter,
        clientFilter,
        accessFilter,
        billingFilter,
        sortColumn,
        sortDirection,
        setSort,
        selectedProjectIds,
        toggleSelectProject,
        selectAllProjects,
        toggleFavorite,
        deleteProject,
        archiveProject,
        restoreProject,
    } = useProjectStore();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        // Status filter
        if (statusFilter === "Active" && project.isArchived) return false;
        if (statusFilter === "Archived" && !project.isArchived) return false;

        // Client filter
        if (clientFilter === "Without client" && project.client !== null) return false;
        if (clientFilter !== "All" && clientFilter !== "Without client" && project.client !== clientFilter) {
            return false;
        }

        // Access filter
        if (accessFilter !== "All" && project.access !== accessFilter) return false;

        // Billing filter
        if (billingFilter === "Billable" && !project.isBillable) return false;
        if (billingFilter === "Non-billable" && project.isBillable) return false;

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = project.name.toLowerCase().includes(q);
            const clientMatch = project.client?.toLowerCase().includes(q);
            if (!nameMatch && !clientMatch) return false;
        }

        return true;
    });

    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        let comp = 0;
        if (sortColumn === "name") {
            comp = a.name.localeCompare(b.name);
        } else if (sortColumn === "client") {
            comp = (a.client || "").localeCompare(b.client || "");
        } else if (sortColumn === "tracked") {
            comp = a.trackedHours - b.trackedHours;
        } else if (sortColumn === "amount") {
            comp = a.amount - b.amount;
        } else if (sortColumn === "progress") {
            comp = (a.progressPercent || 0) - (b.progressPercent || 0);
        }
        return sortDirection === "asc" ? comp : -comp;
    });

    const formatNumber = (num: number, decimals = 2) => {
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    const handleExport = (format: "csv" | "excel") => {
        setIsExportOpen(false);
        const headers = ["Name", "Client", "Tracked (h)", "Amount (USD)", "Progress (%)", "Access"];
        const rows = sortedProjects.map((p) => [
            `"${p.name}"`,
            `"${p.client || "--"}"`,
            p.trackedHours,
            p.amount,
            p.progressPercent || "-",
            p.access,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `clockify_projects_${format}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full bg-white border border-[#e2e8f0] rounded-sm shadow-xs select-none">
            {/* Top Toolbar Bar (Projects / Export) */}
            <div className="bg-[#ebf1f5] px-4 py-2 flex items-center justify-between border-b border-[#e2e8f0]">
                <span className="text-xs text-[#64748b] font-medium">Projects</span>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#1e293b] font-medium transition cursor-pointer"
                    >
                        <span>Export</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isExportOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 min-w-[140px] text-xs">
                            <button
                                onClick={() => handleExport("csv")}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5 text-[#64748b]" />
                                Save as CSV
                            </button>
                            <button
                                onClick={() => handleExport("excel")}
                                className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5 text-[#64748b]" />
                                Save as Excel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[38px_2.4fr_1.6fr_1.4fr_1.4fr_1.4fr_1fr_70px] bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-2.5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider items-center">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={
                            sortedProjects.length > 0 &&
                            selectedProjectIds.length === sortedProjects.length
                        }
                        onChange={selectAllProjects}
                        className="w-3.5 h-3.5 text-[#03a9f4] border-[#cbd5e1] rounded-sm focus:ring-[#03a9f4] cursor-pointer"
                    />
                </div>

                <button
                    onClick={() => setSort("name")}
                    className="flex items-center gap-1 hover:text-[#1e293b] text-left cursor-pointer"
                >
                    <span>NAME</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                <button
                    onClick={() => setSort("client")}
                    className="flex items-center gap-1 hover:text-[#1e293b] text-left cursor-pointer"
                >
                    <span>CLIENT</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                <button
                    onClick={() => setSort("tracked")}
                    className="flex items-center gap-1 hover:text-[#1e293b] text-left cursor-pointer"
                >
                    <span>TRACKED</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                <button
                    onClick={() => setSort("amount")}
                    className="flex items-center gap-1 hover:text-[#1e293b] text-left cursor-pointer"
                >
                    <span>AMOUNT</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                <button
                    onClick={() => setSort("progress")}
                    className="flex items-center gap-1 hover:text-[#1e293b] text-left cursor-pointer"
                >
                    <span>PROGRESS</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                <div>ACCESS</div>

                <div className="text-right"></div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#f1f5f9]">
                {sortedProjects.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#94a3b8]">
                        No projects found matching your filters.
                    </div>
                ) : (
                    sortedProjects.map((project) => {
                        const isSelected = selectedProjectIds.includes(project.id);
                        const isActionOpen = actionMenuOpenId === project.id;

                        return (
                            <div
                                key={project.id}
                                className={`grid grid-cols-[38px_2.4fr_1.6fr_1.4fr_1.4fr_1.4fr_1fr_70px] px-4 py-3 text-xs items-center transition hover:bg-[#fbfcfd] ${
                                    isSelected ? "bg-[#f0f9ff]" : "bg-white"
                                }`}
                            >
                                {/* Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelectProject(project.id)}
                                        className="w-3.5 h-3.5 text-[#03a9f4] border-[#cbd5e1] rounded-sm focus:ring-[#03a9f4] cursor-pointer"
                                    />
                                </div>

                                {/* Name with color dot */}
                                <div className="flex items-center gap-2.5 truncate pr-2">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: project.color }}
                                    />
                                    <span
                                        className="font-normal text-[#1e293b] hover:text-[#03a9f4] cursor-pointer truncate"
                                        title={project.name}
                                    >
                                        {project.name}
                                    </span>
                                </div>

                                {/* Client */}
                                <div className="text-[#1e293b] truncate pr-2">
                                    {project.client ? (
                                        <span
                                            className="cursor-pointer hover:underline"
                                            title={project.client}
                                        >
                                            {project.client}
                                        </span>
                                    ) : (
                                        <span className="text-[#94a3b8]">--</span>
                                    )}
                                </div>

                                {/* Tracked */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[#1e293b]">
                                            {formatNumber(project.trackedHours)}h
                                        </span>
                                        {project.isRecurring && (
                                            <RotateCw className="w-3 h-3 text-[#64748b] ml-0.5" />
                                        )}
                                    </div>
                                    {project.budgetHours && (
                                        <span className="text-[11px] text-[#94a3b8]">
                                            of {formatNumber(project.budgetHours)}h
                                        </span>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="flex flex-col">
                                    <span
                                        className={`font-normal ${
                                            project.isBudgetExceeded
                                                ? "text-[#ef4444] font-semibold"
                                                : "text-[#1e293b]"
                                        }`}
                                    >
                                        {formatNumber(project.amount)}{" "}
                                        {project.currency}
                                    </span>
                                    {project.isBudgetExceeded && project.budgetHours && (
                                        <span className="text-[11px] text-[#94a3b8]">
                                            of {formatNumber(project.budgetHours)},00 USD
                                        </span>
                                    )}
                                </div>

                                {/* Progress */}
                                <div>
                                    {project.progressPercent !== undefined ? (
                                        <div className="flex flex-col gap-1 w-24">
                                            <span
                                                className={`text-xs ${
                                                    project.isBudgetExceeded
                                                        ? "text-[#ef4444] font-semibold"
                                                        : "text-[#1e293b]"
                                                }`}
                                            >
                                                {formatNumber(project.progressPercent)}%
                                            </span>
                                            <div
                                                className={`w-full h-1.5 rounded-full overflow-hidden ${
                                                    project.isBudgetExceeded
                                                        ? "bg-[#fee2e2]"
                                                        : "bg-[#e2e8f0]"
                                                }`}
                                            >
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        project.isBudgetExceeded
                                                            ? "bg-[#ef4444]"
                                                            : "bg-[#10b981]"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(
                                                            project.progressPercent,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[#94a3b8]">-</span>
                                    )}
                                </div>

                                {/* Access */}
                                <div className="text-xs text-[#1e293b]">
                                    {project.access}
                                </div>

                                {/* Actions (Star & Three dots) */}
                                <div className="flex items-center justify-end gap-2 relative">
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(project.id)}
                                        className="p-1 cursor-pointer transition hover:scale-110"
                                        title={project.isFavorite ? "Remove favorite" : "Mark as favorite"}
                                    >
                                        <Star
                                            className={`w-4 h-4 ${
                                                project.isFavorite
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-[#cbd5e1] hover:text-[#94a3b8]"
                                            }`}
                                        />
                                    </button>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActionMenuOpenId(
                                                    isActionOpen ? null : project.id
                                                )
                                            }
                                            className="p-1 text-[#94a3b8] hover:text-[#1e293b] cursor-pointer transition"
                                            title="More options"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {isActionOpen && (
                                            <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-xl z-40 py-1 min-w-[130px] text-xs">
                                                <button
                                                    onClick={() => {
                                                        setActionMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Edit className="w-3.5 h-3.5 text-[#64748b]" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActionMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Copy className="w-3.5 h-3.5 text-[#64748b]" />
                                                    Duplicate
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (project.isArchived) {
                                                            restoreProject(project.id);
                                                        } else {
                                                            archiveProject(project.id);
                                                        }
                                                        setActionMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Archive className="w-3.5 h-3.5 text-[#64748b]" />
                                                    {project.isArchived ? "Restore" : "Archive"}
                                                </button>
                                                <div className="h-px bg-[#f1f5f9] my-1" />
                                                <button
                                                    onClick={() => {
                                                        deleteProject(project.id);
                                                        setActionMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-[#fee2e2] text-[#ef4444] flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
