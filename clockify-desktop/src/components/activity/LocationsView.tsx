import { useState } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { ActivityTabs } from "./ActivityTabs";
import { GoogleMapView } from "./GoogleMapView";
import { ArrowUpDown, Map as MapIcon, Globe } from "lucide-react";

export function LocationsView() {
    const {
        isGpsActive,
        toggleGps,
        members,
        selectedMemberId,
        setSelectedMemberId,
    } = useActivityStore();

    const [mapEngine, setMapEngine] = useState<"google" | "vector">("google");

    const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

    return (
        <div className="flex-1 flex flex-col bg-[#f5f6f8] overflow-y-auto min-h-0">
            {/* Top "Track location" Card matching Activity(Locations).png */}
            <div className="bg-white border-b border-[#e2e8f0] px-6 py-5">
                <div className="max-w-4xl space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#1e293b]">Track location</h2>
                        {/* Map Engine Selector */}
                        <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded border border-[#cbd5e1] text-xs">
                            <button
                                onClick={() => setMapEngine("google")}
                                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition ${
                                    mapEngine === "google"
                                        ? "bg-white text-[#0288d1] font-bold shadow-xs"
                                        : "text-[#64748b] hover:text-[#1e293b]"
                                }`}
                            >
                                <Globe className="w-3.5 h-3.5 text-[#03a9f4]" />
                                <span>Live Google Maps</span>
                            </button>
                            <button
                                onClick={() => setMapEngine("vector")}
                                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition ${
                                    mapEngine === "vector"
                                        ? "bg-white text-[#0288d1] font-bold shadow-xs"
                                        : "text-[#64748b] hover:text-[#1e293b]"
                                }`}
                            >
                                <MapIcon className="w-3.5 h-3.5 text-[#64748b]" />
                                <span>Campus Vector</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-[#64748b]">
                        See all Client job sites that were visited by your remote field workers who clock-in via the mobile app (iOS &amp; Android).
                    </p>

                    <div className="pt-2">
                        <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
                            <div
                                onClick={toggleGps}
                                className={`w-11 h-6 rounded-full transition-colors relative shadow-inner ${
                                    isGpsActive ? "bg-[#03a9f4]" : "bg-[#cbd5e1]"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                                        isGpsActive ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </div>
                            <span className="text-xs font-medium text-[#334155] group-hover:text-[#0f172a] transition">
                                Activate GPS tracking
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Tabs Row: ACTIVITY | Screenshots | Locations */}
            <ActivityTabs />

            {/* Main Interactive Map & Member List Split View */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-[560px] overflow-hidden">
                {/* Left / Center Map Section */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-[#e5eef4] select-none min-h-[440px]">
                    {mapEngine === "google" ? (
                        /* LIVE GOOGLE MAPS PLUGIN COMPONENT */
                        <GoogleMapView
                            selectedMember={selectedMember}
                            members={members}
                            isGpsActive={isGpsActive}
                            onSelectMember={setSelectedMemberId}
                        />
                    ) : (
                        /* Standard Campus Vector View */
                        <div className="flex-1 relative overflow-hidden bg-[#e8f4f8] flex items-center justify-center p-4">
                            <div className="w-full max-w-2xl bg-white border border-[#cbd5e1] rounded-xl p-6 shadow-sm text-center">
                                <h3 className="text-sm font-bold text-[#1e293b] mb-1">Campus Vector Blueprint</h3>
                                <p className="text-xs text-[#64748b] mb-4">
                                    Google Athletic Recreation Field Park &amp; Amphitheatre Pkwy Zone (500m)
                                </p>
                                <button
                                    onClick={() => setMapEngine("google")}
                                    className="px-4 py-2 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded text-xs font-semibold shadow-sm transition"
                                >
                                    Switch to Live Google Maps View
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Members List matching Activity(Locations).png */}
                <div className="w-full lg:w-[340px] bg-white border-t lg:border-t-0 lg:border-l border-[#e2e8f0] flex flex-col flex-shrink-0 select-none">
                    {/* Header Row: MEMBER ⇅ | LAST SEEN ⇅ */}
                    <div className="px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
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
                                    className={`px-4 py-3.5 flex items-center justify-between transition cursor-pointer ${
                                        isSelected
                                            ? "bg-[#e1f5fe]/60 border-l-4 border-[#03a9f4]"
                                            : "hover:bg-[#f8fafc]"
                                    }`}
                                >
                                    {/* Left: Avatar & Name */}
                                    <div className="flex items-center gap-3 min-w-0 pr-2">
                                        <div
                                            className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs ring-1 ring-black/5"
                                            style={{ backgroundColor: member.avatarColor }}
                                        >
                                            {member.avatar}
                                        </div>
                                        <div className="truncate">
                                            <div className="text-xs font-semibold text-[#1e293b] truncate">
                                                {member.name}
                                            </div>
                                            {isGpsActive && (
                                                <div className="text-[10px] text-[#64748b] truncate mt-0.5">
                                                    {member.locationName}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Last Seen column (shows '-' when GPS is off, matching reference image) */}
                                    <div className="text-right flex-shrink-0">
                                        <span
                                            className={`text-xs font-mono ${
                                                member.lastSeen === "-"
                                                    ? "text-[#94a3b8] text-base"
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
                    <div className="p-3 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#64748b] flex items-center justify-between">
                        <span>5 Team Members</span>
                        <button
                            type="button"
                            className="font-medium text-[#03a9f4] hover:underline"
                            onClick={toggleGps}
                        >
                            {isGpsActive ? "Deactivate GPS" : "Activate GPS"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
