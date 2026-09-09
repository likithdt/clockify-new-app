import React from "react";
import { Clock, Folder, Building2, DollarSign } from "lucide-react";
import {
  useDashboardStore,
  formatDurationHMS,
  formatDurationHuman,
} from "@/stores/useDashboardStore";

export const DashboardMetricCards: React.FC = () => {
  const {
    getTotalSeconds,
    getBillableSeconds,
    getNonBillableSeconds,
    getTopProject,
    getTopClient,
    getBillableAmount,
  } = useDashboardStore();

  const totalSecs = getTotalSeconds();
  const billableSecs = getBillableSeconds();
  const nonBillableSecs = getNonBillableSeconds();
  const topProj = getTopProject();
  const topCli = getTopClient();
  const billableAmt = getBillableAmount();

  const billablePercent = totalSecs > 0 ? Math.round((billableSecs / totalSecs) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-2.5 px-3 py-3 select-none">
      {/* 1. TOTAL TIME CARD (matching Dashboard.png) */}
      <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Total time
          </span>
          <div className="w-6 h-6 rounded-md bg-sky-50 text-[#03A9F4] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#1E293B] tracking-tight font-mono">
            {formatDurationHMS(totalSecs)}
          </div>
          <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
            {formatDurationHuman(totalSecs)} total logged
          </div>
        </div>

        {/* Billable vs Non-billable pill */}
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#03A9F4]" />
            <span className="text-[#334155] font-semibold">{formatDurationHuman(billableSecs)}</span>
            <span className="text-[#94A3B8]">billable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="text-[#64748B]">{formatDurationHuman(nonBillableSecs)}</span>
          </div>
        </div>
      </div>

      {/* 2. TOP PROJECT CARD (matching Dashboard.png) */}
      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">
            Top Project
          </span>
          <div className="w-5 h-5 rounded bg-amber-50 text-amber-500 flex items-center justify-center">
            <Folder className="w-3 h-3" />
          </div>
        </div>

        <div className="my-1.5">
          {topProj ? (
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: topProj.color }}
                />
                <span className="text-sm font-bold text-[#1E293B] truncate leading-tight">
                  {topProj.name}
                </span>
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5 font-medium">
                {formatDurationHuman(topProj.seconds)}
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-[#94A3B8] font-mono">--</div>
          )}
        </div>

        <div className="text-[10px] text-[#94A3B8] truncate">
          {topProj ? topProj.client : "No project activity"}
        </div>
      </div>

      {/* 3. TOP CLIENT CARD (matching Dashboard.png) */}
      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">
            Top Client
          </span>
          <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-3 h-3" />
          </div>
        </div>

        <div className="my-1.5">
          {topCli && topCli.name !== "--" ? (
            <div>
              <div className="text-sm font-bold text-[#1E293B] truncate leading-tight">
                {topCli.name}
              </div>
              <div className="text-[11px] text-[#10B981] font-semibold mt-0.5">
                {topCli.percentage}% of time
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-[#94A3B8] font-mono">--</div>
          )}
        </div>

        <div className="text-[10px] text-[#94A3B8] truncate">
          {topCli && topCli.name !== "--"
            ? `${formatDurationHuman(topCli.seconds)} tracked`
            : "No client data"}
        </div>
      </div>

      {/* 4. BILLABILITY & REVENUE SUMMARY CARD */}
      <div className="col-span-2 bg-gradient-to-r from-[#03A9F4]/10 via-[#0288D1]/5 to-transparent p-3.5 rounded-xl border border-[#03A9F4]/20 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#03A9F4] text-white flex items-center justify-center shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">
              Estimated Billable Value
            </div>
            <div className="text-[11px] text-[#64748B]">
              Avg rate $75/hr • {billablePercent}% billable efficiency
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-base font-extrabold text-[#0288D1]">
            ${billableAmt.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
            {billablePercent}% Rate
          </div>
        </div>
      </div>
    </div>
  );
};
