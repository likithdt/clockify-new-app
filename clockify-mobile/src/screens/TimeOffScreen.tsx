import React from "react";
import { Plus, CalendarCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { TimeOffRequest } from "../backend/types";

export interface TimeOffScreenProps {
  requests: TimeOffRequest[];
  onOpenTimeOffModal: () => void;
}

export const TimeOffScreen: React.FC<TimeOffScreenProps> = ({
  requests,
  onOpenTimeOffModal,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Time Off Requests</h2>
        <button
          type="button"
          onClick={onOpenTimeOffModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Request Time Off
        </button>
      </div>

      {/* Requests list */}
      <div className="space-y-2">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-2">
            <CalendarCheck className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No time off requests</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{req.policyName}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    req.status === "approved"
                      ? "bg-green-500/20 text-green-400"
                      : req.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {req.status === "approved" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {req.status}
                </span>
              </div>

              <div className="text-xs text-[#8c9ba5] flex items-center justify-between">
                <span>{req.dateRangeLabel || `${req.startDate} - ${req.endDate}`}</span>
                <span>{req.durationDays} day(s)</span>
              </div>

              {req.note && <p className="text-xs text-slate-400">{req.note}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
