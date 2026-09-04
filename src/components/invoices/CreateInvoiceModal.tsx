import React, { useState } from "react";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { X, ChevronDown, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";

const CLIENTS = [
    "[SAMPLE] Client A",
    "[SAMPLE] Client B",
    "Acme Corp",
    "Global Tech Labs",
];

export function CreateInvoiceModal() {
    const { isCreateModalOpen, closeCreateModal, createInvoice, invoices } =
        useInvoiceStore();

    const [selectedClient, setSelectedClient] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [invoiceNumber, setInvoiceNumber] = useState(
        `[SAMPLE] Invoice ${invoices.length + 1}`
    );
    const [issueDate, setIssueDate] = useState("Today");
    const [dueDate, setDueDate] = useState("10 days after issue");
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

    if (!isCreateModalOpen) return null;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const client = selectedClient || "[SAMPLE] Client B";
        const todayStr = format(new Date(), "dd/MM/yyyy");
        const dueStr = format(addDays(new Date(), 10), "dd/MM/yyyy");

        createInvoice({
            client,
            currency,
            invoiceNumber: invoiceNumber.trim() || `Invoice #${Date.now()}`,
            issueDate: issueDate === "Today" ? todayStr : issueDate,
            dueDate: dueDate === "10 days after issue" ? dueStr : dueDate,
            amount: 750.0,
        });

        // Reset
        setSelectedClient("");
        setInvoiceNumber(`[SAMPLE] Invoice ${invoices.length + 2}`);
        closeCreateModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                    <h2 className="text-lg font-normal text-[#1E293B]">
                        Create invoice
                    </h2>
                    <button
                        type="button"
                        onClick={closeCreateModal}
                        className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                    {/* Client */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Client
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] bg-white flex items-center justify-between hover:border-[#CBD5E1] transition cursor-pointer"
                        >
                            <span
                                className={
                                    !selectedClient
                                        ? "text-[#94A3B8]"
                                        : "text-[#1E293B] font-medium"
                                }
                            >
                                {selectedClient || "Select Client"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        </button>

                        {isClientDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 max-h-48 overflow-y-auto py-1 text-xs">
                                {CLIENTS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            setSelectedClient(c);
                                            setIsClientDropdownOpen(false);
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-[#F1F5F9] text-[#1E293B] cursor-pointer"
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Currency
                        </label>
                        <input
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                        />
                    </div>

                    {/* Invoice ID */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Invoice ID
                        </label>
                        <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                        />
                    </div>

                    {/* Issue date & Due date Side-by-side */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                                Issue date
                            </label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded bg-white focus-within:border-[#03A9F4]">
                                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                                Due date
                            </label>
                            <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded bg-white focus-within:border-[#03A9F4]">
                                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full text-xs text-[#1E293B] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E2E8F0] mt-6">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="text-xs font-semibold text-[#03A9F4] hover:text-[#0288D1] hover:underline cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition cursor-pointer"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
