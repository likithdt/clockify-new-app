import React, { useState } from "react";
import { X, Plus, Trash2, MapPin, ShieldCheck, Check } from "lucide-react";
import type { GeofenceZoneDTO, CreateGeofencePayload } from "../../backend/types.ts";

interface GeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  geofences: GeofenceZoneDTO[];
  onCreateGeofence: (payload: CreateGeofencePayload) => void;
  onDeleteGeofence: (id: string) => void;
}

export const GeofenceModal: React.FC<GeofenceModalProps> = ({
  isOpen,
  onClose,
  geofences,
  onCreateGeofence,
  onDeleteGeofence,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("12.9904");
  const [lng, setLng] = useState("77.7126");
  const [radiusMeters, setRadiusMeters] = useState("500");
  const [color, setColor] = useState("#03a9f4");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    onCreateGeofence({
      name: name.trim(),
      address: address.trim(),
      lat: parseFloat(lat) || 12.9904,
      lng: parseFloat(lng) || 77.7126,
      radius_meters: parseInt(radiusMeters, 10) || 500,
      color,
    });

    setName("");
    setAddress("");
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#181d24] border border-[#2e3947] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-fadeIn text-white">
        {/* Header */}
        <div className="px-4 py-3 bg-[#13171c] border-b border-[#262e38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#03a9f4]" />
            <h3 className="text-sm font-bold text-white">Client Job Sites &amp; Geofences</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8c9ba8] hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Top description */}
          <p className="text-xs text-[#8c9ba8]">
            Defined client locations and job site perimeters. Field workers clocked-in inside these zones are verified as compliant.
          </p>

          {/* List of existing geofences */}
          <div className="space-y-2">
            {geofences.map((geo) => (
              <div
                key={geo.id}
                className="bg-[#121518] border border-[#262e38] rounded-xl p-3 flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm"
                    style={{ backgroundColor: geo.color }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{geo.name}</div>
                    <div className="text-[11px] text-[#8c9ba8] truncate">{geo.address}</div>
                    <div className="text-[10px] font-mono text-[#03a9f4] mt-0.5">
                      Radius: {geo.radius_meters}m · ({geo.lat.toFixed(4)}, {geo.lng.toFixed(4)})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteGeofence(geo.id)}
                  className="p-1.5 text-[#8c9ba8] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition shrink-0"
                  title="Delete zone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Toggle Add Form */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 bg-[#1e252e] hover:bg-[#28323e] border border-[#2e3947] text-[#03a9f4] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Geofence Zone</span>
            </button>
          ) : (
            /* Add Geofence Form */
            <form onSubmit={handleSubmit} className="bg-[#121518] border border-[#03a9f4]/40 rounded-xl p-3 space-y-2.5">
              <h4 className="text-xs font-bold text-white">Create New Geofence Zone</h4>

              <div>
                <label className="text-[10px] text-[#8c9ba8] block mb-1">Zone Name</label>
                <input
                  type="text"
                  placeholder="e.g. Client HQ Campus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 bg-[#181d24] border border-[#2b3542] rounded-lg text-xs text-white focus:outline-none focus:border-[#03a9f4]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8c9ba8] block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Whitefield, Bengaluru"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 bg-[#181d24] border border-[#2b3542] rounded-lg text-xs text-white focus:outline-none focus:border-[#03a9f4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#8c9ba8] block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-2 py-1 bg-[#181d24] border border-[#2b3542] rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8c9ba8] block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-2 py-1 bg-[#181d24] border border-[#2b3542] rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#8c9ba8] block mb-1">Radius (meters)</label>
                  <input
                    type="number"
                    value={radiusMeters}
                    onChange={(e) => setRadiusMeters(e.target.value)}
                    className="w-full px-2 py-1 bg-[#181d24] border border-[#2b3542] rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8c9ba8] block mb-1">Zone Color</label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {["#03a9f4", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"].map((c) => (
                      <div
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-md cursor-pointer flex items-center justify-center transition ${
                          color === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }}
                      >
                        {color === c && <Check className="w-3 h-3 text-white" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-[#8c9ba8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg text-xs font-bold active:scale-95 transition"
                >
                  Save Zone
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
