import React from "react";
import { useKioskStore, type KioskDevice } from "@/stores/useKioskStore";
import { Monitor, Trash2, ArrowRight, Play, CheckCircle2 } from "lucide-react";

interface Props {
  kiosks: KioskDevice[];
}

export function KioskDevicesTable({ kiosks }: Props) {
  const { launchTerminal, deleteKiosk } = useKioskStore();

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#03A9F4]" />
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Active Kiosk Stations ({kiosks.length})
          </h3>
        </div>
        <span className="text-[11px] text-[#64748B]">Shared attendance devices</span>
      </div>

      {/* Kiosk Station Cards for Mobile */}
      <div className="space-y-2.5">
        {kiosks.map((kiosk) => (
          <div
            key={kiosk.id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs space-y-3 transition hover:border-slate-300"
          >
            {/* Card Header: Station Name & Online Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#E1F5FE] text-[#03A9F4] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#1E293B] truncate">
                    {kiosk.name}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8] font-mono">
                    IP: {kiosk.deviceIp}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ECFDF5] text-[#047857] text-[10px] font-bold rounded-full border border-[#A7F3D0] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                ONLINE
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[10px] text-[#94A3B8] block font-medium">
                  Default Project
                </span>
                <span className="font-semibold text-[#1E293B] text-[11px] truncate block">
                  {kiosk.defaultProject}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] block font-medium">
                  Today Check-ins
                </span>
                <span className="font-mono font-bold text-[#03A9F4] text-[11px] block">
                  {kiosk.todayCheckIns} entries
                </span>
              </div>
            </div>

            {/* Assignees */}
            <div className="text-xs">
              <span className="text-[10px] text-[#94A3B8] block font-medium mb-1">
                Assigned Members
              </span>
              <div className="flex flex-wrap gap-1">
                {kiosk.assignees.slice(0, 3).map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium"
                  >
                    {m}
                  </span>
                ))}
                {kiosk.assignees.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md">
                    +{kiosk.assignees.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Launch Station & Delete */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => launchTerminal(kiosk.id)}
                className="flex-1 h-9 bg-[#03A9F4] hover:bg-[#0288D1] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Station</span>
              </button>

              <button
                type="button"
                onClick={() => deleteKiosk(kiosk.id)}
                className="h-9 px-3 border border-[#E2E8F0] hover:border-rose-300 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer hover:bg-rose-50 flex items-center justify-center"
                title="Delete Kiosk"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
