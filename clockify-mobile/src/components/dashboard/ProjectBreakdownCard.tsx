import React from "react";
import { FolderKanban } from "lucide-react";
import {
  useDashboardStore,
  formatDurationHuman,
} from "@/stores/useDashboardStore";

export const ProjectBreakdownCard: React.FC = () => {
  const { getProjectStats, getTotalSeconds } = useDashboardStore();

  const projectStats = getProjectStats();
  const totalSecs = getTotalSeconds();

  if (projectStats.length === 0) return null;

  return (
    <div className="bg-white mx-3 my-3 p-4 rounded-xl border border-[#E2E8F0] shadow-2xs select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <FolderKanban className="w-4 h-4 text-[#03A9F4]" />
          <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Project Distribution
          </h2>
        </div>
        <span className="text-[11px] text-[#64748B] font-medium">
          {projectStats.length} projects active
        </span>
      </div>

      <div className="space-y-3">
        {projectStats.map((proj) => {
          const percent = totalSecs > 0 ? Math.round((proj.seconds / totalSecs) * 100) : 0;

          return (
            <div key={proj.id} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color }}
                  />
                  <div className="truncate">
                    <span className="font-bold text-[#1E293B] truncate block leading-tight">
                      {proj.name}
                    </span>
                    <span className="text-[10.5px] text-[#64748B]">
                      {proj.client || "Internal"}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold text-[#1E293B] font-mono text-[12px]">
                    {formatDurationHuman(proj.seconds)}
                  </div>
                  <div className="text-[10px] text-[#0288D1] font-semibold">
                    {percent}% ({proj.amount > 0 ? `$${proj.amount.toLocaleString()}` : "Non-billable"})
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${percent}%`,
                    backgroundColor: proj.color,
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
