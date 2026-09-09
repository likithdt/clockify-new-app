import React, { useState } from "react";
import { DollarSign, Scale, Filter, ChevronDown, X, Check } from "lucide-react";
import { useRateStore, type RateType, type ThresholdFilter } from "@/stores/useRateStore";

const ROLES = ["All", "Project manager", "Team manager", "Member", "Admin"] as const;

export const RatesFilterBar: React.FC = () => {
  const {
    rateType,
    setRateType,
    roleFilter,
    setRoleFilter,
    thresholdFilter,
    setThresholdFilter,
  } = useRateStore();

  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [conditionInput, setConditionInput] = useState<ThresholdFilter["condition"]>(thresholdFilter.condition);
  const [valueInput, setValueInput] = useState<string>(
    thresholdFilter.value !== null ? thresholdFilter.value.toString() : ""
  );

  const handleApplyThreshold = () => {
    const parsed = valueInput.trim() !== "" ? parseFloat(valueInput) : null;
    setThresholdFilter({
      condition: parsed !== null ? conditionInput : "all",
      value: parsed,
    });
    setIsThresholdModalOpen(false);
  };

  const handleResetThreshold = () => {
    setConditionInput("all");
    setValueInput("");
    setThresholdFilter({ condition: "all", value: null });
    setIsThresholdModalOpen(false);
  };

  const isThresholdActive = thresholdFilter.condition !== "all" && thresholdFilter.value !== null;
  const isFilterActive = roleFilter !== "All" || isThresholdActive;

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 py-2.5 space-y-2 select-none">
      {/* Segmented Control: Billable Rate vs Cost Rate */}
      <div className="grid grid-cols-2 p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
        <button
          type="button"
          onClick={() => setRateType("billable")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            rateType === "billable"
              ? "bg-white text-[#0288d1] shadow-xs"
              : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Billable Rates</span>
        </button>

        <button
          type="button"
          onClick={() => setRateType("cost")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            rateType === "cost"
              ? "bg-white text-[#0288d1] shadow-xs"
              : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Cost Rates</span>
        </button>
      </div>

      {/* Role Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {ROLES.map((role) => {
          const isActive = roleFilter === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#00b0ff] text-white shadow-xs"
                  : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {/* Threshold Filter Trigger & Quick Reset */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsThresholdModalOpen(!isThresholdModalOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
              isThresholdActive
                ? "bg-[#e0f2fe] border-[#7dd3fc] text-[#0369a1]"
                : "bg-white border-[#cbd5e1] text-[#334155] hover:bg-[#f8fafc]"
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-[#64748b]" />
            <span>
              {isThresholdActive
                ? `${thresholdFilter.condition} $${thresholdFilter.value}`
                : `Filter by ${rateType === "billable" ? "billable" : "cost"} rate`}
            </span>
            <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
          </button>

          {/* Threshold Popover Dropdown matching Team (Billable rate).png */}
          {isThresholdModalOpen && (
            <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-40 p-3 text-xs animate-fadeIn space-y-2.5">
              <div className="font-semibold text-[#1e293b] pb-1 border-b border-[#f1f5f9]">
                Filter by rate (USD)
              </div>

              {/* Exactly */}
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="condition"
                    checked={conditionInput === "exact"}
                    onChange={() => setConditionInput("exact")}
                    className="text-[#00b0ff]"
                  />
                  <span className="text-[#334155]">Exactly</span>
                </div>
                {conditionInput === "exact" && (
                  <input
                    type="number"
                    step="1"
                    placeholder="0.00"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    autoFocus
                    className="w-20 px-2 py-1 border border-[#cbd5e1] rounded text-xs outline-none focus:border-[#00b0ff]"
                  />
                )}
              </label>

              {/* Smaller than */}
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="condition"
                    checked={conditionInput === "smaller"}
                    onChange={() => setConditionInput("smaller")}
                    className="text-[#00b0ff]"
                  />
                  <span className="text-[#334155]">Smaller than</span>
                </div>
                {conditionInput === "smaller" && (
                  <input
                    type="number"
                    step="1"
                    placeholder="0.00"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    autoFocus
                    className="w-20 px-2 py-1 border border-[#cbd5e1] rounded text-xs outline-none focus:border-[#00b0ff]"
                  />
                )}
              </label>

              {/* Larger than */}
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="condition"
                    checked={conditionInput === "larger"}
                    onChange={() => setConditionInput("larger")}
                    className="text-[#00b0ff]"
                  />
                  <span className="text-[#334155]">Larger than</span>
                </div>
                {conditionInput === "larger" && (
                  <input
                    type="number"
                    step="1"
                    placeholder="0.00"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    autoFocus
                    className="w-20 px-2 py-1 border border-[#cbd5e1] rounded text-xs outline-none focus:border-[#00b0ff]"
                  />
                )}
              </label>

              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetThreshold}
                  className="text-[11px] text-[#64748b] hover:text-[#0f172a] cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleApplyThreshold}
                  className="px-3 py-1 bg-[#00b0ff] text-white rounded-lg text-xs font-semibold hover:bg-[#009ee6] cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset All */}
        {isFilterActive && (
          <button
            type="button"
            onClick={() => {
              setRoleFilter("All");
              setThresholdFilter({ condition: "all", value: null });
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#00b0ff] hover:underline cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
