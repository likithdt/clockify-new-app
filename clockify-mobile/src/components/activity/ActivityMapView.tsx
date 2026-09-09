import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Plus,
  Minus,
  LocateFixed,
  Battery,
  ShieldCheck,
  Compass,
  Layers,
  Globe,
  Radio,
} from "lucide-react";
import type { MemberLocationDTO, GeofenceZoneDTO } from "../../backend/types.ts";

interface ActivityMapViewProps {
  selectedMember: MemberLocationDTO | null;
  members: MemberLocationDTO[];
  geofences: GeofenceZoneDTO[];
  isGpsActive: boolean;
  onSelectMember: (id: string) => void;
  onCheckInGPS?: () => void;
  isCheckingIn?: boolean;
}

export const ActivityMapView: React.FC<ActivityMapViewProps> = ({
  selectedMember,
  members,
  geofences,
  isGpsActive,
  onSelectMember,
  onCheckInGPS,
  isCheckingIn = false,
}) => {
  const [mapType, setMapType] = useState<"google" | "vector">("google");
  const [zoom, setZoom] = useState(16);

  // Active center coordinates
  const activeLat = selectedMember ? selectedMember.lat : 12.9904;
  const activeLng = selectedMember ? selectedMember.lng : 77.7126;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 20));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 12));

  return (
    <div className="w-full h-64 sm:h-72 relative rounded-2xl overflow-hidden border border-[#262e38] bg-[#0c0f12] select-none shadow-md flex flex-col">
      {/* Top Floating Controls Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Map Type Switcher */}
        <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-lg text-[11px]">
          <button
            type="button"
            onClick={() => setMapType("google")}
            className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
              mapType === "google"
                ? "bg-[#03a9f4] text-white shadow-sm"
                : "text-[#8c9ba8] hover:text-white"
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType("vector")}
            className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
              mapType === "vector"
                ? "bg-[#03a9f4] text-white shadow-sm"
                : "text-[#8c9ba8] hover:text-white"
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Campus</span>
          </button>
        </div>

        {/* GPS Check-in / Recenter Button */}
        {onCheckInGPS && (
          <button
            type="button"
            onClick={onCheckInGPS}
            disabled={isCheckingIn || !isGpsActive}
            className={`pointer-events-auto px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition active:scale-95 ${
              isGpsActive
                ? "bg-[#03a9f4] hover:bg-[#0288d1] text-white"
                : "bg-[#1e252e] text-[#5a6575] cursor-not-allowed border border-[#2e3947]"
            }`}
            title="Check In with your device GPS"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isCheckingIn ? "animate-spin" : ""}`} />
            <span>{isCheckingIn ? "Locating..." : "My GPS"}</span>
          </button>
        )}
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {mapType === "google" ? (
          /* LIVE GOOGLE MAPS EMBED */
          <div className="w-full h-full relative">
            <iframe
              title="Google Map Activity Viewer"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
              loading="lazy"
              allowFullScreen={false}
              src={`https://maps.google.com/maps?q=${activeLat},${activeLng}&z=${zoom}&output=embed`}
            />

            {/* Subtle dark tint border */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>
        ) : (
          /* CAMPUS VECTOR BLUEPRINT MAP */
          <div className="w-full h-full bg-[#111923] relative flex items-center justify-center p-4">
            <svg
              className="w-full h-full opacity-60"
              viewBox="0 0 400 240"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Roads / Paths */}
              <path
                d="M 20 180 Q 150 140 380 200"
                stroke="#2a3b4c"
                strokeWidth="14"
                fill="none"
              />
              <path
                d="M 120 20 L 140 220"
                stroke="#2a3b4c"
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M 260 20 L 250 220"
                stroke="#2a3b4c"
                strokeWidth="12"
                fill="none"
              />

              {/* Geofence Zone 1 Circle */}
              <circle
                cx="140"
                cy="110"
                r="45"
                fill="#10b981"
                fillOpacity="0.15"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Geofence Zone 2 Circle */}
              <circle
                cx="270"
                cy="140"
                r="55"
                fill="#03a9f4"
                fillOpacity="0.15"
                stroke="#03a9f4"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Breadcrumb Trail */}
              {selectedMember && selectedMember.breadcrumbs.length > 1 && (
                <path
                  d="M 100 130 Q 130 115 150 110"
                  stroke="#03a9f4"
                  strokeWidth="3"
                  strokeDasharray="4 3"
                  fill="none"
                />
              )}
            </svg>

            {/* Member Pins on Vector Canvas */}
            {members.map((m, idx) => {
              const isSelected = selectedMember?.id === m.id;
              // Spread out positions for visual demo
              const positions = [
                { top: "42%", left: "33%" },
                { top: "48%", left: "68%" },
                { top: "60%", left: "58%" },
                { top: "35%", left: "62%" },
                { top: "72%", left: "25%" },
                { top: "25%", left: "45%" },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                    isSelected ? "scale-125 z-30" : "scale-100 hover:scale-110 z-20"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-xl ring-2 ring-white/80"
                    style={{ backgroundColor: m.avatar_color }}
                  >
                    {m.avatar}
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 bg-black/90 text-[9px] font-bold text-white rounded shadow-md border border-white/20">
                      {m.name.split(" ")[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Info Pill (Selected Member Status) */}
      {selectedMember && (
        <div className="absolute bottom-2.5 left-2.5 right-12 z-20 bg-[#141920]/95 backdrop-blur-md border border-[#2f3a46] rounded-xl px-3 py-1.5 text-xs text-white shadow-2xl flex items-center justify-between gap-2 pointer-events-auto animate-fadeIn">
          <div className="flex items-center gap-2 truncate">
            <div
              className="w-5 h-5 rounded-full text-white font-bold text-[9px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedMember.avatar_color }}
            >
              {selectedMember.avatar}
            </div>
            <div className="truncate">
              <span className="font-bold truncate">{selectedMember.name}</span>
              <span className="text-[#8c9ba8] ml-1.5 text-[10px] truncate">
                · {selectedMember.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[10px] text-[#8c9ba8] font-mono">
            <span>{selectedMember.speed}</span>
            <div className="flex items-center gap-0.5 text-emerald-400">
              <Battery className="w-3 h-3" />
              <span>{selectedMember.battery}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Zoom Controls (+ / -) on bottom right */}
      <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col gap-1 bg-black/80 backdrop-blur-md p-0.5 rounded-xl border border-white/10 shadow-lg pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-[#8c9ba8] hover:text-white active:scale-90 transition rounded-lg hover:bg-white/10"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-[#8c9ba8] hover:text-white active:scale-90 transition rounded-lg hover:bg-white/10"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
