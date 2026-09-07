import { useState, useEffect } from "react";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { RemoveSampleDataModal } from "./RemoveSampleDataModal";
import {
    Settings,
    Calendar,
    ChevronDown,
    Search,
    MoreVertical,
    Download,
    Trash2,
} from "lucide-react";

export function InvoicesPage() {
    const {
        invoices,
        hasSampleData,
        openCreateModal,
        openRemoveSampleModal,
        restoreSampleData,
        deleteInvoice,
        filterClient,
        filterStatus,
        searchQuery,
        setFilterClient,
        setFilterStatus,
        setSearchQuery,
        loadFromBackend,
    } = useInvoiceStore();

    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

    const filteredInvoices = invoices.filter((inv) => {
        if (filterClient !== "All" && inv.client !== filterClient) return false;
        if (filterStatus !== "All" && inv.status !== filterStatus) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchId = inv.invoiceNumber.toLowerCase().includes(q);
            const matchClient = inv.client.toLowerCase().includes(q);
            if (!matchId && !matchClient) return false;
        }
        return true;
    });

    const formatCurrency = (val: number, curr: string) => {
        return `${val.toFixed(2).replace(".", ",")} ${curr}`;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6F8] min-h-0 overflow-y-auto select-none">
            <div className="p-8 max-w-[1400px] w-full mx-auto space-y-6">
                {/* Sample Data Banner matching Invoices.png */}
                {hasSampleData ? (
                    <div className="bg-[#E1F5FE]/60 border border-[#B3E5FC] p-4 rounded shadow-xs flex items-center justify-between">
                        <span className="text-xs text-[#0288D1] font-medium">
                            You are currently using sample data to help you explore.
                        </span>
                        <button
                            type="button"
                            onClick={openRemoveSampleModal}
                            className="px-4 py-1.5 border border-[#03A9F4] text-[#03A9F4] hover:bg-[#03A9F4] hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                        >
                            REMOVE SAMPLE DATA
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={restoreSampleData}
                            className="text-xs font-semibold text-[#03A9F4] hover:underline cursor-pointer"
                        >
                            + Restore Sample Invoices
                        </button>
                    </div>
                )}

                {/* Page Title & Create Button Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-normal text-[#1E293B]">Invoices</h1>

                    <div className="flex items-center gap-3">
                        {/* Settings Button */}
                        <button
                            type="button"
                            className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B] rounded shadow-xs transition cursor-pointer"
                            title="Invoice Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        {/* CREATE INVOICE Button */}
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="px-5 py-2.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition cursor-pointer"
                        >
                            CREATE INVOICE
                        </button>
                    </div>
                </div>

                {/* Filter Toolbar matching Invoices.png */}
                <div className="bg-white border border-[#E2E8F0] p-3 rounded shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-[#64748B] uppercase tracking-wider">
                            FILTER
                        </span>

                        {/* Issue Date All Time */}
                        <div className="flex items-center gap-1.5 text-[#334155] border-r border-[#E2E8F0] pr-3">
                            <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>Issue date: All time</span>
                        </div>

                        {/* Client Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                                className="flex items-center gap-1 text-[#334155] hover:text-[#03A9F4] cursor-pointer"
                            >
                                <span>Client</span>
                                {filterClient !== "All" && (
                                    <span className="font-semibold text-[#03A9F4]">
                                        ({filterClient})
                                    </span>
                                )}
                                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                            </button>
                            {isClientDropdownOpen && (
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                                    {["All", "[SAMPLE] Client A", "[SAMPLE] Client B"].map(
                                        (c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => {
                                                    setFilterClient(c);
                                                    setIsClientDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                            >
                                                {c}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                className="flex items-center gap-1 text-[#334155] hover:text-[#03A9F4] cursor-pointer"
                            >
                                <span>Status</span>
                                {filterStatus !== "All" && (
                                    <span className="font-semibold text-[#03A9F4]">
                                        ({filterStatus})
                                    </span>
                                )}
                                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                            </button>
                            {isStatusDropdownOpen && (
                                <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                                    {["All", "Sent", "Overdue", "Paid", "Draft"].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                                setFilterStatus(s);
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] text-[#1E293B]"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="flex items-center gap-1 text-[#334155] cursor-pointer">
                            <span>Amount</span>
                            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                        </div>

                        {/* Balance */}
                        <div className="flex items-center gap-1 text-[#334155] cursor-pointer">
                            <span>Balance</span>
                            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                        </div>

                        {/* Search Input: Invoice ID */}
                        <div className="flex items-center gap-2 border border-[#E2E8F0] rounded px-3 py-1.5 w-60 focus-within:border-[#03A9F4] bg-white">
                            <Search className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Invoice ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-xs text-[#1E293B] placeholder:text-[#94A3B8] outline-none w-full"
                            />
                        </div>
                    </div>

                    {/* APPLY FILTER Button */}
                    <button
                        type="button"
                        className="px-4 py-1.5 border border-[#03A9F4] text-[#03A9F4] hover:bg-[#E1F5FE] rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                    >
                        APPLY FILTER
                    </button>
                </div>

                {/* Invoices Table matching Invoices.png */}
                <div className="bg-white border border-[#E2E8F0] rounded shadow-xs overflow-hidden">
                    {/* Sub-Header */}
                    <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#64748B]">Invoices</span>

                        {/* Export dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                                className="flex items-center gap-1 text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                            >
                                <span>Export</span>
                                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                            </button>
                            {isExportDropdownOpen && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsExportDropdownOpen(false)}
                                        className="w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] flex items-center gap-1.5 text-[#1E293B]"
                                    >
                                        <Download className="w-3 h-3" />
                                        <span>Export CSV</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                                    <th className="py-3 px-4">INVOICE ID ↕</th>
                                    <th className="py-3 px-4">CLIENT ↕</th>
                                    <th className="py-3 px-4">ISSUE DATE ↕</th>
                                    <th className="py-3 px-4">DUE ON ↕</th>
                                    <th className="py-3 px-4">AMOUNT ↕</th>
                                    <th className="py-3 px-4">BALANCE ↕</th>
                                    <th className="py-3 px-4">STATUS</th>
                                    <th className="py-3 px-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                                {filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-12 text-center text-xs text-[#94A3B8]"
                                        >
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-[#F8FAFC] transition"
                                        >
                                            <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                                                {inv.invoiceNumber}
                                            </td>

                                            <td className="py-3.5 px-4 text-[#1E293B]">
                                                {inv.client}
                                            </td>

                                            <td className="py-3.5 px-4 text-[#64748B]">
                                                {inv.issueDate}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div>
                                                    <span className="text-[#1E293B]">
                                                        {inv.dueOn}
                                                    </span>
                                                    {inv.dueSubtitle && (
                                                        <span className="text-[#EF4444] text-[11px] block">
                                                            {inv.dueSubtitle}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-mono font-bold text-[#1E293B]">
                                                {formatCurrency(inv.amount, inv.currency)}
                                            </td>

                                            <td
                                                className={`py-3.5 px-4 font-mono font-bold ${
                                                    inv.status === "Overdue"
                                                        ? "text-[#EF4444]"
                                                        : "text-[#1E293B]"
                                                }`}
                                            >
                                                {formatCurrency(inv.balance, inv.currency)}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                {inv.status === "Sent" ? (
                                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#E0F2FE] text-[#0288D1] border border-[#BAE6FD]">
                                                        Sent
                                                    </span>
                                                ) : inv.status === "Overdue" ? (
                                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]">
                                                        Overdue
                                                    </span>
                                                ) : inv.status === "Paid" ? (
                                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-right relative">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveRowMenuId(
                                                            activeRowMenuId === inv.id
                                                                ? null
                                                                : inv.id
                                                        )
                                                    }
                                                    className="p-1 text-[#94A3B8] hover:text-[#1E293B] rounded hover:bg-[#F1F5F9] transition cursor-pointer"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeRowMenuId === inv.id && (
                                                    <div className="absolute right-4 top-full mt-1 w-32 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 py-1 text-xs text-left">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                deleteInvoice(inv.id);
                                                                setActiveRowMenuId(null);
                                                            }}
                                                            className="w-full px-3 py-1.5 hover:bg-[#FEE2E2] text-[#EF4444] flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateInvoiceModal />
            <RemoveSampleDataModal />
        </div>
    );
}
