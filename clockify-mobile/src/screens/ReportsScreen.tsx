import React from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import type { Project } from "../backend/types";

export interface ReportsScreenProps {
  projects: Project[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ projects }) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <h2 className="text-base font-bold text-white">Summary Report</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[#8c9ba5] text-xs">
            <BarChart3 className="w-4 h-4 text-[#00b0ff]" />
            <span>Total Time</span>
          </div>
          <span className="text-lg font-bold text-white mt-1 block">24h 45m</span>
        </div>

        <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[#8c9ba5] text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Billable Ratio</span>
          </div>
          <span className="text-lg font-bold text-white mt-1 block">85%</span>
        </div>
      </div>

      {/* Projects Breakdown */}
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8c9ba5]">
          Time by Project
        </h3>

        <div className="space-y-2">
          {projects.map((p, idx) => {
            const percent = Math.max(10, Math.floor(100 / (projects.length || 1)));
            return (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </span>
                  <span className="text-[#8c9ba5]">{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#242b36] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
