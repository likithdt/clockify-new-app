import React from "react";
import { DollarSign, Scale, Edit3, Shield, ArrowUpRight, TrendingUp } from "lucide-react";
import { useRateStore, type RateMember, type RateType } from "@/stores/useRateStore";

interface MemberRateCardProps {
  member: RateMember;
}

export const MemberRateCard: React.FC<MemberRateCardProps> = ({ member }) => {
  const { rateType, openEditRateModal } = useRateStore();

  const getInitials = (name: string) => {
    const clean = name.replace(/^\[SAMPLE\]\s*/i, "").trim();
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const isBillable = rateType === "billable";
  const activeRate = isBillable ? member.billableRate : member.costRate;
  const otherRate = isBillable ? member.costRate : member.billableRate;

  // Margin calculation if both rates exist
  const hasBoth = member.billableRate !== null && member.costRate !== null;
  const spread = hasBoth ? (member.billableRate! - member.costRate!) : null;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs hover:border-[#cbd5e1] transition-all">
      {/* Top Header: Avatar, Name, Email, Role */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-xl ${member.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
          >
            {getInitials(member.name)}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#0f172a] truncate">{member.name}</h3>
            <p className="text-[11px] text-[#64748b] truncate">{member.email}</p>
          </div>
        </div>

        {/* Role Badge */}
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] shrink-0 border border-[#e2e8f0]">
          {member.role}
        </span>
      </div>

      {/* Main Rate Highlight Box */}
      <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider flex items-center gap-1">
            {isBillable ? (
              <>
                <DollarSign className="w-3 h-3 text-[#0288d1]" /> Billable Rate (USD)
              </>
            ) : (
              <>
                <Scale className="w-3 h-3 text-[#d97706]" /> Cost Rate (USD)
              </>
            )}
          </span>

          <div className="flex items-baseline gap-1 mt-0.5">
            {activeRate !== null ? (
              <>
                <span className="text-lg font-extrabold text-[#0f172a]">
                  ${activeRate.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-[#94a3b8]">/ hr</span>
              </>
            ) : (
              <span className="text-base font-semibold text-[#94a3b8]">
                — <span className="text-xs font-normal">Not Set</span>
              </span>
            )}
          </div>
        </div>

        {/* "Change" action button matching desktop Team table */}
        <button
          type="button"
          onClick={() => openEditRateModal(member.id, rateType)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e0f2fe] text-[#0288d1] hover:bg-[#bae6fd] active:scale-95 text-xs font-semibold transition cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Change</span>
        </button>
      </div>

      {/* Secondary Rate Comparison Strip */}
      <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-[#64748b]">
          <span className="font-medium">
            {isBillable ? "Cost Rate:" : "Billable Rate:"}
          </span>
          <span className="font-semibold text-[#334155]">
            {otherRate !== null ? `$${otherRate.toFixed(2)}/h` : "—"}
          </span>
          <button
            type="button"
            onClick={() => openEditRateModal(member.id, isBillable ? "cost" : "billable")}
            className="text-[#0288d1] hover:underline font-medium cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Margin badge */}
        {hasBoth && spread !== null && (
          <div
            className={`flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
              spread >= 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>{spread >= 0 ? `+$${spread.toFixed(2)}/h` : `-$${Math.abs(spread).toFixed(2)}/h`}</span>
          </div>
        )}
      </div>
    </div>
  );
};
