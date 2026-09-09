import React, { useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import {
  useDashboardStore,
  formatDurationHMS,
} from "@/stores/useDashboardStore";

export const MostTrackedActivitiesCard: React.FC = () => {
  const {
    getFilteredActivities,
    getTotalSeconds,
    topActivitiesLimit,
    setTopActivitiesLimit,
  } = useDashboardStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activities = getFilteredActivities();
  const totalSeconds = getTotalSeconds();

  // Aggregate by description & project
  const map = new Map<string, {
    description: string;
    projectName: string;
    projectColor: string;
    clientName: string;
    seconds: number;
    isBillable: boolean;
  }>();

  for (const act of activities) {
    const key = `${act.projectName}:::${act.description}`;
    const existing = map.get(key) || {
      description: act.description,
      projectName: act.projectName,
      projectColor: act.projectColor,
      clientName: act.clientName,
      seconds: 0,
      isBillable: act.isBillable,
    };
    existing.seconds += act.seconds;
    map.set(key, existing);
  }

  const sorted = Array.from(map.values())
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, topActivitiesLimit);

  return (
    <div className="bg-white mx-3 my-3 p-4 rounded-xl border border-[#E2E8F0] shadow-2xs select-none relative">
      {/* Header with Title and Top 5 / Top 10 Dropdown (matching Dashboard.png) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-[#03A9F4]" />
          <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Most tracked activities
          </h2>
        </div>

        {/* Top 5 / Top 10 Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-semibold text-[#475569] transition cursor-pointer"
          >
            <span>Top {topActivitiesLimit}</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-7 w-24 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1 text-xs text-[#1E293B]">
                <button
                  type="button"
                  onClick={() => {
                    setTopActivitiesLimit(5);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] ${
                    topActivitiesLimit === 5 ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                  }`}
                >
                  Top 5
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTopActivitiesLimit(10);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#F1F5F9] ${
                    topActivitiesLimit === 10 ? "font-bold text-[#03A9F4] bg-sky-50" : ""
                  }`}
                >
                  Top 10
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Activity List */}
      {sorted.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#94A3B8]">
          No activities recorded for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item, idx) => {
            const percentage = totalSeconds > 0 ? Math.round((item.seconds / totalSeconds) * 100) : 0;

            return (
              <div key={`${item.projectName}-${item.description}-${idx}`} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  {/* Left: description & project tag */}
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-[#1E293B] truncate leading-tight">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#64748B]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.projectColor }}
                      />
                      <span className="font-medium text-[#475569] truncate">
                        {item.projectName}
                      </span>
                      {item.clientName && item.clientName !== "Internal" && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[#94A3B8] truncate">{item.clientName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: duration & percentage */}
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#1E293B] text-[13px]">
                      {formatDurationHMS(item.seconds)}
                    </span>
                    <span className="block text-[10px] text-[#64748B] font-medium">
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.projectColor || "#03A9F4",
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
