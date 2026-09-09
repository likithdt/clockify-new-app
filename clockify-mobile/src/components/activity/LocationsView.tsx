import { useState } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityTabs } from "./ActivityTabs";
import { GoogleMapView } from "./GoogleMapView";
import { ArrowUpDown } from "lucide-react";

export function LocationsView() {
  const {
    isGpsActive,
    toggleGps,
    members,
    selectedMemberId,
    setSelectedMemberId,
  } = useActivityStore();

  const [viewMode, setViewMode] = useState<"split" | "map" | "members">("split");

  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

  return (
    <div className="flex-1 flex flex-col bg-[#f5f6f8] overflow-hidden min-h-0 select-none">
      {/* 1. Top "Track location" Card matching Activity(Locations).png */}
      <div className="bg-white border-b border-[#e2e8f0] px-4 py-3 shrink-0">
        <h2 className="text-sm font-bold text-[#1e293b]">Track location</h2>
        <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
          See all Client job sites that were visited by your remote field workers who clock-in via the mobile app (iOS &amp; Android).
        </p>
        <div className="mt-2.5">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={toggleGps}
              className={`w-9 h-5 rounded-full transition-colors relative shadow-inner ${
                isGpsActive ? "bg-[#03a9f4]" : "bg-[#cbd5e1]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                  isGpsActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-xs font-medium text-[#334155]">
              Activate GPS tracking
            </span>
          </label>
        </div>
      </div>

      {/* 2. Subtabs Row: ACTIVITY | Screenshots | Locations & Date Picker */}
      <ActivityTabs />

      {/* 3. Mobile View Switcher: Split | Map | Members */}
      <div className="px-3 py-1.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#cbd5e1] text-[11px] shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-3 py-0.5 rounded-md font-medium transition cursor-pointer ${
              viewMode === "split"
                ? "bg-[#03a9f4] text-white font-bold shadow-2xs"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`px-3 py-0.5 rounded-md font-medium transition cursor-pointer ${
              viewMode === "map"
                ? "bg-[#03a9f4] text-white font-bold shadow-2xs"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode("members")}
            className={`px-3 py-0.5 rounded-md font-medium transition cursor-pointer ${
              viewMode === "members"
                ? "bg-[#03a9f4] text-white font-bold shadow-2xs"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
          >
            Members ({members.length})
          </button>
        </div>

        <span className="text-[11px] text-[#64748b] font-medium">
          {isGpsActive ? "GPS Active" : "GPS Inactive"}
        </span>
      </div>

      {/* 4. Main Locations Display */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        {/* Map View (shown in split or map mode) */}
        {(viewMode === "split" || viewMode === "map") && (
          <div
            className={`w-full relative overflow-hidden bg-[#e5eef4] select-none ${
              viewMode === "split" ? "h-[200px] shrink-0 border-b border-[#e2e8f0]" : "flex-1"
            }`}
          >
            <GoogleMapView
              selectedMember={selectedMember}
              members={members}
              isGpsActive={isGpsActive}
              onSelectMember={setSelectedMemberId}
            />
          </div>
        )}

        {/* Members Table View (shown in split or members mode) */}
        {(viewMode === "split" || viewMode === "members") && (
          <div className="flex-1 flex flex-col w-full bg-white overflow-hidden select-none min-h-0">
            {/* Table Header: MEMBER ⇅ | LAST SEEN ⇅ */}
            <div className="px-4 py-2 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between text-[11px] font-bold text-[#64748b] uppercase tracking-wider shrink-0">
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#1e293b]">
                <span>MEMBER</span>
                <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#1e293b]">
                <span>LAST SEEN</span>
                <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
              </div>
            </div>

            {/* Member Rows */}
            <div className="divide-y divide-[#f1f5f9] overflow-y-auto flex-1">
              {members.map((member) => {
                const isSelected = selectedMemberId === member.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`px-4 py-2.5 flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-[#e1f5fe]/70 border-l-4 border-[#03a9f4]"
                        : "hover:bg-[#f8fafc]"
                    }`}
                  >
                    {/* Left: Avatar & Name */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: member.avatarColor }}
                      >
                        {member.avatar}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#1e293b] truncate">
                          {member.name}
                        </div>
                        {isGpsActive && member.locationName && (
                          <div className="text-[10px] text-[#64748b] truncate mt-0.5">
                            {member.locationName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Last Seen column (shows '-' when GPS is off, matching reference image) */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-mono ${
                          member.lastSeen === "-"
                            ? "text-[#94a3b8] text-base font-normal"
                            : "text-[#0288d1] font-semibold"
                        }`}
                      >
                        {member.lastSeen}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status bar */}
            <div className="px-4 py-2 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#64748b] flex items-center justify-between shrink-0">
              <span>{members.length} Team Members</span>
              <button
                type="button"
                className="font-semibold text-[#03a9f4] hover:underline cursor-pointer"
                onClick={toggleGps}
              >
                {isGpsActive ? "Deactivate GPS" : "Activate GPS"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
