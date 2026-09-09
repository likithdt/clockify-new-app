import React from "react";
import { Users, Play } from "lucide-react";
import { useDashboardStore, formatDurationHuman } from "@/stores/useDashboardStore";

export const TeamStatusCard: React.FC = () => {
  const { userFilter, sampleTeamMembers } = useDashboardStore();

  if (userFilter !== "team") return null;

  return (
    <div className="bg-white mx-3 my-3 p-4 rounded-xl border border-[#E2E8F0] shadow-2xs select-none animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#03A9F4]" />
          <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Team Live Activity
          </h2>
        </div>
        <span className="text-[11px] text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          Live Status
        </span>
      </div>

      <div className="space-y-3">
        {sampleTeamMembers.map((member) => (
          <div
            key={member.id}
            className="p-2.5 rounded-lg border border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between gap-2"
          >
            {/* Left: Avatar + Name + Role */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#0288D1] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {member.avatar}
                </div>
                {member.isTracking && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full ring-2 ring-white" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1E293B] truncate">
                    {member.name}
                  </span>
                  {member.isTracking && (
                    <span className="text-[9px] font-bold text-[#0288D1] bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 flex items-center gap-0.5">
                      <Play className="w-2 h-2 fill-[#0288D1]" />
                      Active
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#64748B] truncate">
                  {member.isTracking && member.currentTask ? (
                    <span className="text-[#334155] font-medium">
                      {member.currentTask}
                    </span>
                  ) : (
                    <span>{member.role}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Daily & Weekly stats */}
            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-bold text-[#1E293B]">
                {formatDurationHuman(member.todaySeconds)}
              </div>
              <div className="text-[10px] text-[#94A3B8]">
                {formatDurationHuman(member.weekSeconds)} this week
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
