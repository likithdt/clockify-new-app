import React from "react";
import { DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useInvoiceStore } from "@/stores/useInvoiceStore";

export const InvoiceSummaryBar: React.FC = () => {
  const { invoices } = useInvoiceStore();

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueCount = invoices.filter((inv) => inv.status === "Overdue").length;
  const overdueBalance = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
      <div className="grid grid-cols-3 gap-2">
        {/* Total Invoiced */}
        <div className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total</span>
            <DollarSign className="w-3.5 h-3.5 text-[#0288d1]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#0f172a] truncate">
              {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[9px] text-[#94a3b8] font-medium">USD Invoiced</span>
          </div>
        </div>

        {/* Total Balance Outstanding */}
        <div className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Balance</span>
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#d97706] truncate">
              {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[9px] text-[#94a3b8] font-medium">USD Due</span>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="bg-white p-2.5 rounded-xl border border-[#fee2e2] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#e11d48]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Overdue</span>
            <AlertCircle className="w-3.5 h-3.5 text-[#e11d48]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#e11d48] truncate">
              {overdueBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[9px] text-[#ef4444] font-semibold">
              {overdueCount} {overdueCount === 1 ? "invoice" : "invoices"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
