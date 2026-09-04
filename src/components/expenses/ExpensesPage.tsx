import { useState } from "react";
import {
    Settings,
    ChevronDown,
    Plus,
    Check,
    Trash2,
    Paperclip,
    RefreshCw,
} from "lucide-react";
import { useExpenseStore, Expense } from "@/stores/useExpenseStore";
import { CreateExpenseModal } from "./CreateExpenseModal";
import { ExpenseSettingsModal } from "./ExpenseSettingsModal";

export function ExpensesPage() {
    const {
        expenses,
        selectedTeammate,
        isCreateModalOpen,
        isSettingsModalOpen,
        teammates,
        setSelectedTeammate,
        setCreateModalOpen,
        setSettingsModalOpen,
        deleteExpense,
        clearAllExpenses,
        loadSampleData,
    } = useExpenseStore();

    const [isTeammatesDropdownOpen, setIsTeammatesDropdownOpen] = useState(false);

    // Filter expenses based on selectedTeammate
    const filteredExpenses = expenses.filter((item) => {
        if (!selectedTeammate || selectedTeammate === "all") return true;
        return item.teamMember.toLowerCase() === selectedTeammate.toLowerCase();
    });

    const totalAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f5f7fa]">
            {/* Header Toolbar */}
            <div className="px-8 py-5 flex items-center justify-between">
                {/* Title */}
                <h1 className="text-[22px] font-normal text-[#333333]">Expenses</h1>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    {/* Teammates filter dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsTeammatesDropdownOpen(!isTeammatesDropdownOpen)}
                            className="h-9 px-3.5 bg-white border border-[#d1d5db] hover:border-[#9ca3af] rounded text-xs text-[#4b5563] flex items-center justify-between gap-6 transition min-w-[160px] cursor-pointer"
                        >
                            <span className="truncate">
                                {selectedTeammate && selectedTeammate !== "all"
                                    ? selectedTeammate
                                    : "Teammates"}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] flex-shrink-0" />
                        </button>

                        {isTeammatesDropdownOpen && (
                            <div className="absolute right-0 top-10 mt-1 w-48 bg-white border border-[#d1d5db] rounded shadow-lg z-30 py-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedTeammate("all");
                                        setIsTeammatesDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                >
                                    <span>All teammates</span>
                                    {(!selectedTeammate || selectedTeammate === "all") && (
                                        <Check className="w-3.5 h-3.5 text-[#03a9f4]" />
                                    )}
                                </button>
                                {teammates.map((member) => (
                                    <button
                                        key={member}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTeammate(member);
                                            setIsTeammatesDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
                                    >
                                        <span>{member}</span>
                                        {selectedTeammate === member && (
                                            <Check className="w-3.5 h-3.5 text-[#03a9f4]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Settings Gear Button */}
                    <button
                        type="button"
                        onClick={() => setSettingsModalOpen(true)}
                        className="w-9 h-9 bg-white border border-[#d1d5db] hover:border-[#9ca3af] hover:bg-gray-50 rounded flex items-center justify-center text-[#6b7280] transition cursor-pointer"
                        title="Expense Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    {/* ADD EXPENSE Button */}
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="h-9 px-4 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-semibold rounded uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                        ADD EXPENSE
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                {filteredExpenses.length === 0 ? (
                    /* Empty State matching Expenses.png exactly */
                    <div className="bg-white border border-[#e5e7eb] rounded-md h-full min-h-[480px] flex flex-col items-center justify-center p-8 text-center shadow-sm relative">
                        {/* Empty State Illustration matching Expenses.png */}
                        <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                            {/* Document shape */}
                            <div className="w-20 h-24 bg-white border-2 border-[#d9e2ec] rounded-md shadow-sm relative flex flex-col justify-center px-3 space-y-2">
                                <div className="w-10 h-1.5 bg-[#e2e8f0] rounded" />
                                <div className="w-14 h-1.5 bg-[#e2e8f0] rounded" />
                                <div className="w-8 h-1.5 bg-[#e2e8f0] rounded" />
                            </div>

                            {/* Magnifying Glass with circular 0 badge */}
                            <div className="absolute -bottom-2 -right-1">
                                <div className="relative">
                                    <svg
                                        className="w-14 h-14 text-[#94a3b8]"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="20" cy="20" r="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                                        <line x1="29" y1="29" x2="41" y2="41" stroke="#94a3b8" strokeWidth="4" />
                                    </svg>
                                    {/* Number 0 badge */}
                                    <div className="absolute top-1 right-5 w-5 h-5 bg-[#cbd5e1] text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm">
                                        0
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="text-[17px] font-semibold text-[#334155] mt-4">No results</h2>
                        <p className="text-xs text-[#94a3b8] mt-1.5 max-w-sm">
                            Try adjusting the filters to get some results.
                        </p>

                        {/* Helpful quick demo toggles */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(true)}
                                className="px-3.5 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Expense
                            </button>
                            <button
                                type="button"
                                onClick={loadSampleData}
                                className="px-3.5 py-1.5 bg-white border border-[#d1d5db] hover:bg-gray-50 text-[#4b5563] text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-[#03a9f4]" />
                                Load Sample Data
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Populated Expenses Table */
                    <div className="bg-white border border-[#e5e7eb] rounded-md shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-3.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fbfcfd]">
                            <div className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                                {filteredExpenses.length} {filteredExpenses.length === 1 ? "Expense" : "Expenses"}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={loadSampleData}
                                    className="text-xs text-[#03a9f4] hover:underline cursor-pointer"
                                >
                                    Reset sample data
                                </button>
                                <span className="text-[#cbd5e1]">•</span>
                                <button
                                    type="button"
                                    onClick={clearAllExpenses}
                                    className="text-xs text-[#ef4444] hover:underline cursor-pointer"
                                >
                                    Clear all (Show Empty State)
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#e5e7eb] bg-[#f8fafc] text-[#64748b] font-semibold uppercase tracking-wider text-[11px]">
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Team Member</th>
                                        <th className="py-3 px-4">Project</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Note</th>
                                        <th className="py-3 px-4 text-center">Billable</th>
                                        <th className="py-3 px-4 text-center">Receipt</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                        <th className="py-3 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9] text-[#334155]">
                                    {filteredExpenses.map((exp: Expense) => (
                                        <tr key={exp.id} className="hover:bg-[#f8fafc] transition-colors">
                                            <td className="py-3 px-4 font-medium text-[#1e293b]">
                                                {exp.date}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#03a9f4] flex items-center justify-center font-bold text-[10px]">
                                                        {exp.teamMember.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{exp.teamMember}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: exp.projectColor }}
                                                    />
                                                    <span className="font-medium text-[#1e293b]">{exp.projectName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 bg-[#f1f5f9] text-[#475569] rounded font-medium text-[11px]">
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 max-w-xs truncate text-[#64748b]">
                                                {exp.note || "—"}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {exp.billable ? (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ecfdf5] text-[#059669]">
                                                        YES
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#f3f4f6] text-[#6b7280]">
                                                        NO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {exp.receiptName ? (
                                                    <div
                                                        className="inline-flex items-center gap-1 text-[#03a9f4] hover:underline cursor-pointer"
                                                        title={exp.receiptName}
                                                    >
                                                        <Paperclip className="w-3.5 h-3.5" />
                                                        <span className="text-[11px] truncate max-w-[80px]">
                                                            {exp.receiptName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#9ca3af]">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-[#1e293b]">
                                                {exp.amount.toFixed(2)} {exp.currency}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExpense(exp.id)}
                                                    className="text-[#9ca3af] hover:text-[#ef4444] p-1 rounded transition cursor-pointer"
                                                    title="Delete expense"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer / Summary */}
                        <div className="px-6 py-3.5 bg-[#f8fafc] border-t border-[#e5e7eb] flex items-center justify-between text-xs text-[#64748b]">
                            <div>
                                Showing <span className="font-semibold text-[#1e293b]">{filteredExpenses.length}</span> entries
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="uppercase font-semibold tracking-wider text-[11px]">Total:</span>
                                <span className="text-sm font-bold text-[#1e293b]">
                                    {totalAmount.toFixed(2)} USD
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Expense Modal */}
            <CreateExpenseModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />

            {/* Settings Modal */}
            <ExpenseSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
            />
        </div>
    );
}
