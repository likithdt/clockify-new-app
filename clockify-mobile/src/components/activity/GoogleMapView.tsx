import { useState, useMemo } from "react";
import type { MemberLocation } from "@/stores/useActivityStore";
import { Plus, Minus, MapPin } from "lucide-react";

interface GoogleMapViewProps {
  selectedMember: MemberLocation | null;
  members: MemberLocation[];
  isGpsActive: boolean;
  onSelectMember: (id: string | null) => void;
}

export function GoogleMapView({
  selectedMember,
  members,
  isGpsActive,
  onSelectMember,
}: GoogleMapViewProps) {
  const [zoom, setZoom] = useState(16);

  // Default coordinate from Activity(Locations).png: Google Amphitheatre Pkwy, Mountain View
  const centerLat = selectedMember?.lat ?? 37.4220;
  const centerLng = selectedMember?.lng ?? -122.0841;

  const mapEmbedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=${zoom}&output=embed`;
  }, [centerLat, centerLng, zoom]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 10));

  return (
    <div className="w-full h-full relative bg-[#e5e3df] overflow-hidden select-none min-h-[180px]">
      {/* Google Map iframe */}
      <iframe
        title="Google Map"
        src={mapEmbedUrl}
        className="w-full h-full border-0 pointer-events-auto"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Subtle Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col bg-white/95 backdrop-blur-xs border border-[#cbd5e1] rounded-lg shadow-md divide-y divide-[#e2e8f0] overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc] transition cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Member Indicator Pin */}
      {selectedMember && isGpsActive && (
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-md border border-[#cbd5e1] flex items-center gap-1.5 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-[#03a9f4]" />
          <span className="font-bold text-[#1e293b]">{selectedMember.name}</span>
          <span className="text-[#64748b]">· {selectedMember.lastSeen}</span>
        </div>
      )}
    </div>
  );
}
