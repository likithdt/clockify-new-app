import React, { useState } from "react";
import {
  useDashboardStore,
  formatDurationHuman,
} from "@/stores/useDashboardStore";

export const DashboardBarChart: React.FC = () => {
  const {
    getDailyStats,
    getTotalSeconds,
    selectedDayIndex,
    setSelectedDayIndex,
  } = useDashboardStore();

  const days = getDailyStats();
  const totalSecs = getTotalSeconds();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedDayIndex;

  // Find max daily hours to scale the Y-axis
  const maxSeconds = Math.max(...days.map((d) => d.totalSeconds), 3600); // at least 1h
  const maxHours = Math.ceil(maxSeconds / 3600);

  // Generate 5 grid ticks
  const ticks = [
    maxHours,
    Math.round((maxHours * 0.75) * 10) / 10,
    Math.round((maxHours * 0.5) * 10) / 10,
    Math.round((maxHours * 0.25) * 10) / 10,
  ];

  return (
    <div className="bg-white mx-3 p-4 rounded-xl border border-[#E2E8F0] shadow-2xs select-none relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Time Tracked by Day
          </h2>
          <p className="text-[11px] text-[#64748B]">
            Tap any bar to inspect daily breakdown
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10.5px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#03A9F4]" />
            <span className="text-[#334155] font-medium">Billable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#CBD5E1]" />
            <span className="text-[#64748B]">Non-billable</span>
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      {totalSecs === 0 ? (
        /* EMPTY STATE MATCHING Dashboard.png EXACTLY */
        <div className="h-56 flex flex-col items-center justify-center text-center py-6 px-4 bg-[#FAFAFA] rounded-lg border border-dashed border-[#E2E8F0]">
          {/* Clockify Empty State Icon Illustration */}
          <div className="relative mb-3">
            <div className="w-14 h-12 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#94A3B8]">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 fill-none stroke-[#94A3B8] stroke-1.5"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
              </svg>
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#03A9F4] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              0
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#1E293B] mb-1">
            No data to show
          </h3>
          <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">
            Try adjusting the filters to get some results, or tap “Log Time” to record your hours.
          </p>
        </div>
      ) : (
        /* BAR CHART CONTAINER */
        <div className="flex flex-col">
          {/* Selected Day Floating Inspector Banner */}
          {activeIndex !== null && days[activeIndex] && (
            <div className="mb-2.5 px-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg flex items-center justify-between text-xs text-[#0369A1] animate-fadeIn">
              <span className="font-bold">
                {days[activeIndex].dayLabel}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0288D1]">
                  {formatDurationHuman(days[activeIndex].totalSeconds)}
                </span>
                <span className="text-[10px] text-[#0288D1]/80">
                  ({formatDurationHuman(days[activeIndex].billableSeconds)} billable)
                </span>
              </div>
            </div>
          )}

          {/* Chart Graphic */}
          <div className="h-48 relative flex items-end pt-5 pb-6">
            {/* Horizontal Grid Guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              {ticks.map((val) => (
                <div key={val} className="w-full flex items-center gap-1">
                  <span className="text-[9px] font-mono text-[#94A3B8] w-6 text-right shrink-0">
                    {val}h
                  </span>
                  <div className="w-full border-b border-dashed border-[#E2E8F0]" />
                </div>
              ))}
              <div className="w-full flex items-center gap-1">
                <span className="text-[9px] font-mono text-[#94A3B8] w-6 text-right shrink-0">
                  0h
                </span>
                <div className="w-full border-b border-[#CBD5E1]" />
              </div>
            </div>

            {/* 7 Vertical Day Columns */}
            <div className="flex-1 ml-7 h-full flex items-end justify-around relative z-10">
              {days.map((day, idx) => {
                const heightPercent = maxSeconds > 0 ? (day.totalSeconds / maxSeconds) * 100 : 0;
                const billablePercent = day.totalSeconds > 0 ? (day.billableSeconds / day.totalSeconds) * 100 : 0;
                const isSelected = activeIndex === idx;

                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDayIndex(selectedDayIndex === idx ? null : idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer px-1"
                  >
                    {/* Bar container */}
                    <div className="w-full max-w-[24px] flex flex-col justify-end h-full">
                      {day.totalSeconds > 0 ? (
                        <div
                          style={{ height: `${Math.max(heightPercent, 6)}%` }}
                          className={`w-full rounded-t-md overflow-hidden flex flex-col transition-all duration-300 ${
                            isSelected
                              ? "ring-2 ring-[#0288D1] ring-offset-1 scale-105"
                              : "group-hover:opacity-90"
                          }`}
                        >
                          {/* Non-billable part (top) */}
                          <div
                            style={{ height: `${100 - billablePercent}%` }}
                            className="w-full bg-[#CBD5E1]"
                            title={`Non-billable: ${formatDurationHuman(day.nonBillableSeconds)}`}
                          />
                          {/* Billable part (bottom) */}
                          <div
                            style={{ height: `${billablePercent}%` }}
                            className="w-full bg-[#03A9F4]"
                            title={`Billable: ${formatDurationHuman(day.billableSeconds)}`}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-slate-200 rounded-full" />
                      )}
                    </div>

                    {/* Bottom Day Label (e.g. "Mon" or "Mon 31") */}
                    <div className="absolute -bottom-5 text-center pointer-events-none">
                      <span
                        className={`text-[10px] font-medium leading-none block ${
                          isSelected
                            ? "font-bold text-[#0288D1]"
                            : "text-[#64748B]"
                        }`}
                      >
                        {day.shortDay}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
