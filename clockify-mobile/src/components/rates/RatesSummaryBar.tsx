import React from "react";
import { TrendingUp, DollarSign, Users, Scale } from "lucide-react";
import { useRateStore } from "@/stores/useRateStore";

export const RatesSummaryBar: React.FC = () => {
  const { members } = useRateStore();

  const billableMembers = members.filter((m) => m.billableRate !== null);
  const costMembers = members.filter((m) => m.costRate !== null);

  const avgBillable =
    billableMembers.length > 0
      ? billableMembers.reduce((sum, m) => sum + (m.billableRate || 0), 0) / billableMembers.length
      : 0;

  const avgCost =
    costMembers.length > 0
      ? costMembers.reduce((sum, m) => sum + (m.costRate || 0), 0) / costMembers.length
      : 0;

  const avgMargin = avgBillable > 0 ? ((avgBillable - avgCost) / avgBillable) * 100 : 0;

  return (
    <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] select-none">
      <div className="grid grid-cols-3 gap-2">
        {/* Avg Billable Rate */}
        <div className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Billable</span>
            <DollarSign className="w-3.5 h-3.5 text-[#0288d1]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#0f172a] truncate">
              {avgBillable > 0 ? `$${avgBillable.toFixed(2)}/h` : "Not Set"}
            </p>
            <span className="text-[9px] text-[#94a3b8] font-medium">
              {billableMembers.length} set
            </span>
          </div>
        </div>

        {/* Avg Cost Rate */}
        <div className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Cost</span>
            <Scale className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#d97706] truncate">
              ${avgCost.toFixed(2)}/h
            </p>
            <span className="text-[9px] text-[#94a3b8] font-medium">
              {costMembers.length} set
            </span>
          </div>
        </div>

        {/* Profit Margin Spread */}
        <div className="bg-white p-2.5 rounded-xl border border-[#dcfce7] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#16a34a]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Margin</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#16a34a]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-bold text-[#16a34a] truncate">
              {avgMargin > 0 ? `+${avgMargin.toFixed(0)}%` : "—"}
            </p>
            <span className="text-[9px] text-[#22c55e] font-semibold">Blended spread</span>
          </div>
        </div>
      </div>
    </div>
  );
};
