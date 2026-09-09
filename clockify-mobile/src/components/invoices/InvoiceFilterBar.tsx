import React, { useState } from "react";
import { Filter, ChevronDown, Calendar, X, Building2 } from "lucide-react";
import { useInvoiceStore } from "@/stores/useInvoiceStore";

const STATUS_OPTIONS = ["All", "Sent", "Overdue", "Paid", "Draft"] as const;

export const InvoiceFilterBar: React.FC = () => {
  const {
    invoices,
    filterStatus,
    filterClient,
    setFilterStatus,
    setFilterClient,
  } = useInvoiceStore();

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Extract unique clients
  const uniqueClients = Array.from(new Set(invoices.map((i) => i.client)));

  const getStatusCount = (status: string) => {
    if (status === "All") return invoices.length;
    return invoices.filter((i) => i.status === status).length;
  };

  const hasActiveFilters = filterStatus !== "All" || filterClient !== "All";

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 py-2.5 space-y-2 select-none">
      {/* Horizontal Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {STATUS_OPTIONS.map((status) => {
          const isActive = filterStatus === status;
          const count = getStatusCount(status);

          let badgeColor = "bg-slate-100 text-slate-700";
          if (status === "Overdue") badgeColor = "bg-rose-100 text-rose-700";
          else if (status === "Paid") badgeColor = "bg-emerald-100 text-emerald-700";
          else if (status === "Sent") badgeColor = "bg-blue-100 text-blue-700";

          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#00b0ff] text-white shadow-xs"
                  : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : badgeColor
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Second Row: Client selector, Date period, and Reset */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2">
          {/* Client Filter Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsClientModalOpen(!isClientModalOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
                filterClient !== "All"
                  ? "bg-[#e0f2fe] border-[#7dd3fc] text-[#0369a1]"
                  : "bg-white border-[#cbd5e1] text-[#334155] hover:bg-[#f8fafc]"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#64748b]" />
              <span className="truncate max-w-[120px]">
                {filterClient === "All" ? "Client" : filterClient}
              </span>
              <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
            </button>

            {/* Client Dropdown */}
            {isClientModalOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-40 py-1 text-xs animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setFilterClient("All");
                    setIsClientModalOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-[#f1f5f9] flex items-center justify-between ${
                    filterClient === "All" ? "text-[#00b0ff] font-bold" : "text-[#1e293b]"
                  }`}
                >
                  <span>All Clients</span>
                  {filterClient === "All" && <span className="text-[#00b0ff]">✓</span>}
                </button>
                <div className="border-t border-[#f1f5f9] my-0.5" />
                {uniqueClients.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setFilterClient(c);
                      setIsClientModalOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#f1f5f9] flex items-center justify-between truncate ${
                      filterClient === c ? "text-[#00b0ff] font-bold" : "text-[#1e293b]"
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {filterClient === c && <span className="text-[#00b0ff]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Issue Date Info Tag */}
          <div className="flex items-center gap-1 text-[11px] text-[#64748b]">
            <Calendar className="w-3 h-3 text-[#94a3b8]" />
            <span>Issue date: All time</span>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setFilterStatus("All");
              setFilterClient("All");
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#00b0ff] hover:underline cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
