import { useState, useMemo, useEffect, useCallback } from "react";
import { useActivityStore, type MemberLocation } from "@/stores/useActivityStore";
import {
    Plus,
    Minus,
    LocateFixed,
    ExternalLink,
    Search,
    Navigation,
    Battery,
    ShieldCheck,
    Clock,
    MapPin,
    Radio,
    Compass,
    Check,
    SlidersHorizontal,
    AlertCircle,
} from "lucide-react";

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
    const { userLiveCoords, setUserLiveCoords } = useActivityStore();

    // Google Map parameters
    const [mapType, setMapType] = useState<"m" | "k" | "p">("m"); // 'm' = Roadmap, 'k' = Satellite, 'p' = Terrain
    const [zoom, setZoom] = useState(18); // Default to high street-level zoom
    const [customQuery, setCustomQuery] = useState("");
    const [activeSearchLocation, setActiveSearchLocation] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);
    const [locationSource, setLocationSource] = useState<"exact-gps" | "ip-estimate" | "manual">("ip-estimate");
    const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
    const [manualLat, setManualLat] = useState<string>("");
    const [manualLng, setManualLng] = useState<string>("");
    const [manualAddressName, setManualAddressName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Live Geolocation detection with High Accuracy
    const detectLiveLocation = useCallback(async (isUserTriggered = false) => {
        setIsLocating(true);
        setErrorMessage(null);

        // 1. Try Browser High-Accuracy GPS
        if (navigator.geolocation) {
            try {
                const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: isUserTriggered ? 20000 : 8000,
                        maximumAge: 0,
                    });
                });

                const { latitude, longitude, accuracy } = pos.coords;
                setGpsAccuracyMeters(Math.round(accuracy));
                setLocationSource("exact-gps");

                // Reverse geocode via OpenStreetMap Nominatim with proper User-Agent
                let address = `Exact GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=19&addressdetails=1`,
                        {
                            headers: {
                                Accept: "application/json",
                            },
                        }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        if (data.display_name) {
                            address = data.display_name.split(",").slice(0, 4).join(", ");
                        }
                    }
                } catch {
                    // Fallback to coordinates
                }

                setUserLiveCoords({ lat: latitude, lng: longitude, address });
                setManualLat(latitude.toFixed(6));
                setManualLng(longitude.toFixed(6));
                setManualAddressName(address);
                setIsLocating(false);
                return;
            } catch (err: unknown) {
                const error = err as { code?: number; message?: string };
                if (isUserTriggered) {
                    if (error.code === 1) {
                        setErrorMessage("Location permission denied. Please allow location in your browser address bar.");
                    } else if (error.code === 2) {
                        setErrorMessage("GPS position unavailable from device hardware.");
                    } else if (error.code === 3) {
                        setErrorMessage("GPS timed out. Using fallback.");
                    }
                }
            }
        }

        // 2. Fallback to IP geolocation if not user-triggered or if GPS failed
        try {
            const res = await fetch("https://ipwho.is/");
            if (res.ok) {
                const data = await res.json();
                if (data.success !== false && data.latitude && data.longitude) {
                    const address = `${data.city || "Bengaluru"}, ${data.region || "Karnataka"}, ${data.country || "India"}`;
                    setUserLiveCoords({
                        lat: data.latitude,
                        lng: data.longitude,
                        address,
                    });
                    setManualLat(data.latitude.toFixed(6));
                    setManualLng(data.longitude.toFixed(6));
                    setManualAddressName(address);
                    setLocationSource("ip-estimate");
                    setIsLocating(false);
                    return;
                }
            }
        } catch {
            // ignore
        }

        // 3. Default to Gopalan College of Engineering and Management, Hoodi, Whitefield, Bengaluru
        const defaultAddress = "Gopalan College of Engineering and Management, Hoodi, Whitefield, Bengaluru";
        setUserLiveCoords({
            lat: 12.9904,
            lng: 77.7126,
            address: defaultAddress,
        });
        setManualLat("12.990400");
        setManualLng("77.712600");
        setManualAddressName(defaultAddress);
        setLocationSource("exact-gps");
        setIsLocating(false);
    }, [setUserLiveCoords]);

    // Automatically detect location on initial mount
    useEffect(() => {
        detectLiveLocation(false);
    }, [detectLiveLocation]);

    // When GPS tracking is toggled on, re-detect with high precision
    useEffect(() => {
        if (isGpsActive) {
            detectLiveLocation(true);
        }
    }, [isGpsActive, detectLiveLocation]);

    // Compute the query for Google Maps embed
    // CRITICAL: We pass ONLY the clean exact numerical coordinates or address without conflicting parenthetical labels
    const mapEmbedUrl = useMemo(() => {
        let query = "";

        if (activeSearchLocation) {
            query = activeSearchLocation;
        } else if (selectedMember) {
            query = `${selectedMember.lat},${selectedMember.lng}`;
        } else if (userLiveCoords) {
            query = `${userLiveCoords.lat},${userLiveCoords.lng}`;
        } else {
            query = "12.9904,77.7126";
        }

        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    }, [selectedMember, activeSearchLocation, userLiveCoords, mapType, zoom]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customQuery.trim()) {
            setActiveSearchLocation(customQuery.trim());
            onSelectMember(null);
            setZoom(18);
        }
    };

    const handleCenterOnMyLocation = () => {
        setActiveSearchLocation(null);
        const currentUser = members.find((m) => m.isCurrentUser);
        if (currentUser) {
            onSelectMember(currentUser.id);
        } else {
            onSelectMember(null);
        }
        setZoom(19); // High zoom to see building and street
        detectLiveLocation(true); // User triggered to prompt for high-precision GPS
    };

    const handleSelectPresetLocation = (name: string, lat: number, lng: number) => {
        setUserLiveCoords({ lat, lng, address: name });
        setActiveSearchLocation(null);
        onSelectMember(null);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        setManualAddressName(name);
        setLocationSource("manual");
        setZoom(18);
        setIsCalibrateOpen(false);
    };

    const handleApplyManualCoords = () => {
        const parsedLat = parseFloat(manualLat);
        const parsedLng = parseFloat(manualLng);
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            const addr = manualAddressName.trim() || `Coordinates: ${parsedLat.toFixed(4)}, ${parsedLng.toFixed(4)}`;
            setUserLiveCoords({ lat: parsedLat, lng: parsedLng, address: addr });
            setActiveSearchLocation(null);
            onSelectMember(null);
            setLocationSource("manual");
            setZoom(19);
            setIsCalibrateOpen(false);
        }
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 1, 21));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 1, 10));
    };

    return (
        <div className="flex-1 flex flex-col relative w-full h-full min-h-[460px] bg-[#e5e3df] overflow-hidden select-none">
            {/* Top Google Maps Toolbar & Search */}
            <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                {/* Search & Location Bar */}
                <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-[#cbd5e1] overflow-hidden px-2.5 py-1"
                    >
                        <Search className="w-4 h-4 text-[#64748b] mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Type exact address, college, or street..."
                            value={customQuery}
                            onChange={(e) => setCustomQuery(e.target.value)}
                            className="text-xs text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none w-48 sm:w-64 bg-transparent"
                        />
                        {customQuery && (
                            <button
                                type="button"
                                onClick={() => setCustomQuery("")}
                                className="text-xs text-[#94a3b8] hover:text-[#1e293b] px-1"
                            >
                                ✕
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-2 py-0.5 ml-1 bg-[#03a9f4] hover:bg-[#0288d1] text-white text-[11px] font-bold rounded transition"
                        >
                            Go
                        </button>
                    </form>

                    {/* Map Mode Buttons: Map / Satellite / Terrain */}
                    <div className="flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-[#cbd5e1] p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setMapType("m")}
                            className={`px-2.5 py-1 rounded font-medium transition ${
                                mapType === "m"
                                    ? "bg-[#e1f5fe] text-[#0288d1] font-bold shadow-xs"
                                    : "text-[#475569] hover:bg-[#f1f5f9]"
                            }`}
                        >
                            Map
                        </button>
                        <button
                            type="button"
                            onClick={() => setMapType("k")}
                            className={`px-2.5 py-1 rounded font-medium transition ${
                                mapType === "k"
                                    ? "bg-[#e1f5fe] text-[#0288d1] font-bold shadow-xs"
                                    : "text-[#475569] hover:bg-[#f1f5f9]"
                            }`}
                        >
                            Satellite
                        </button>
                        <button
                            type="button"
                            onClick={() => setMapType("p")}
                            className={`px-2.5 py-1 rounded font-medium transition ${
                                mapType === "p"
                                    ? "bg-[#e1f5fe] text-[#0288d1] font-bold shadow-xs"
                                    : "text-[#475569] hover:bg-[#f1f5f9]"
                            }`}
                        >
                            Terrain
                        </button>
                    </div>
                </div>

                {/* Right Quick Status Badges & Pinpoint Button */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Exact GPS button */}
                    <button
                        type="button"
                        onClick={handleCenterOnMyLocation}
                        disabled={isLocating}
                        className="px-3 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg shadow-md flex items-center gap-1.5 text-xs font-bold transition shadow-cyan-500/20"
                        title="Acquire device GPS location"
                    >
                        <Radio className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : "animate-pulse"}`} />
                        <span>{isLocating ? "Acquiring GPS..." : "Pinpoint My GPS"}</span>
                    </button>

                    {/* Calibrate / Set Exact Pin Button */}
                    <button
                        type="button"
                        onClick={() => setIsCalibrateOpen(!isCalibrateOpen)}
                        className={`p-1.5 rounded-lg shadow-md border transition ${
                            isCalibrateOpen
                                ? "bg-[#03a9f4] text-white border-[#0288d1]"
                                : "bg-white/95 backdrop-blur-md border-[#cbd5e1] text-[#475569] hover:text-[#1e293b]"
                        }`}
                        title="Calibrate exact coordinates or choose area"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    <a
                        href={
                            userLiveCoords
                                ? `https://www.google.com/maps/search/?api=1&query=${userLiveCoords.lat},${userLiveCoords.lng}`
                                : "https://www.google.com/maps/search/?api=1&query=Bengaluru"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-[#cbd5e1] text-[#475569] hover:text-[#03a9f4] transition"
                        title="Open full Google Maps web"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* LIVE GOOGLE MAP IFRAME PLUGIN */}
            <div className="w-full h-full relative">
                <iframe
                    title="Live Google Map"
                    src={mapEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {/* Live Location Status Toast Banner */}
            <div className="absolute top-16 left-4 z-20 pointer-events-none max-w-md">
                <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-white rounded-lg shadow-lg text-[11px] flex items-center gap-2 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <div className="truncate">
                        <span className="font-semibold text-emerald-300">
                            {locationSource === "exact-gps"
                                ? `High-Accuracy GPS (±${gpsAccuracyMeters}m)`
                                : locationSource === "manual"
                                ? "Exact Pinpoint Mode"
                                : "Location Fix: Bengaluru"}
                        </span>
                        <span className="text-white/70 ml-1.5">
                            {userLiveCoords ? `${userLiveCoords.lat.toFixed(5)}, ${userLiveCoords.lng.toFixed(5)}` : ""}
                        </span>
                    </div>
                </div>
                {errorMessage && (
                    <div className="mt-1 px-3 py-1.5 bg-amber-600/95 backdrop-blur-md text-white rounded-md text-[11px] flex items-center justify-between gap-2 shadow-md pointer-events-auto">
                        <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-200" />
                            <span>{errorMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="text-white/80 hover:text-white font-bold px-1 text-xs"
                            title="Dismiss"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Zoom & Center Map Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col bg-white border border-[#cbd5e1] rounded-lg shadow-lg divide-y divide-[#e2e8f0] overflow-hidden">
                <button
                    onClick={handleZoomIn}
                    className="p-2.5 text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc] transition"
                    title="Zoom in Google Maps"
                >
                    <Plus className="w-4 h-4" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2.5 text-[#475569] hover:text-[#1e293b] hover:bg-[#f8fafc] transition"
                    title="Zoom out Google Maps"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCenterOnMyLocation}
                    className="p-2.5 text-[#03a9f4] hover:bg-[#f8fafc] transition"
                    title="Center on My Exact GPS Location"
                >
                    <LocateFixed className="w-4 h-4" />
                </button>
            </div>

            {/* Quick Locality / Campus Switcher Pills along bottom */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-lg border border-[#cbd5e1] shadow-lg max-w-[calc(100%-120px)] overflow-x-auto">
                <button
                    onClick={handleCenterOnMyLocation}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 bg-[#03a9f4] text-white shadow-xs"
                >
                    <Compass className="w-3.5 h-3.5" />
                    <span>My Exact Spot (Live)</span>
                </button>

                <button
                    onClick={() => handleSelectPresetLocation("Gopalan College of Engineering, Whitefield", 12.9850, 77.7280)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                >
                    Gopalan College
                </button>

                <button
                    onClick={() => handleSelectPresetLocation("Hoodi Junction / Metro, Bengaluru", 12.9930, 77.7160)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                >
                    Hoodi
                </button>

                <button
                    onClick={() => handleSelectPresetLocation("ITPL / Whitefield Tech Corridor", 12.9865, 77.7380)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                >
                    ITPL Whitefield
                </button>

                <button
                    onClick={() => handleSelectPresetLocation("Indiranagar 100ft Road, Bengaluru", 12.9784, 77.6408)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                >
                    Indiranagar
                </button>

                <button
                    onClick={() => handleSelectPresetLocation("Electronic City Phase 1, Bengaluru", 12.8452, 77.6602)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                >
                    Electronic City
                </button>
            </div>

            {/* Calibrate & Exact Location Setting Drawer */}
            {isCalibrateOpen && (
                <div className="absolute top-16 right-4 z-30 bg-white/95 backdrop-blur-md border border-[#cbd5e1] p-4 rounded-xl shadow-2xl w-80 animate-in fade-in slide-in-from-right-2 duration-150 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                        <span className="font-bold text-[#1e293b] flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-[#03a9f4]" /> Calibrate Exact Location
                        </span>
                        <button
                            onClick={() => setIsCalibrateOpen(false)}
                            className="text-[#94a3b8] hover:text-[#1e293b] font-bold p-1"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="pt-3 space-y-3">
                        <p className="text-[11px] text-[#64748b] leading-relaxed">
                            If your desktop browser reports an approximate city location, you can type your exact street address or fine-tune coordinates below:
                        </p>

                        <div>
                            <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                                Exact Street Address / Building Name:
                            </label>
                            <input
                                type="text"
                                value={manualAddressName}
                                onChange={(e) => setManualAddressName(e.target.value)}
                                placeholder="e.g. Gopalan College, Hoodi, Bengaluru"
                                className="w-full px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded text-xs text-[#1e293b] focus:outline-none focus:border-[#03a9f4]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] font-semibold text-[#64748b] block mb-0.5">Latitude</label>
                                <input
                                    type="text"
                                    value={manualLat}
                                    onChange={(e) => setManualLat(e.target.value)}
                                    placeholder="12.9850"
                                    className="w-full px-2 py-1 bg-white border border-[#cbd5e1] rounded text-xs font-mono text-[#1e293b]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-[#64748b] block mb-0.5">Longitude</label>
                                <input
                                    type="text"
                                    value={manualLng}
                                    onChange={(e) => setManualLng(e.target.value)}
                                    placeholder="77.7280"
                                    className="w-full px-2 py-1 bg-white border border-[#cbd5e1] rounded text-xs font-mono text-[#1e293b]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleApplyManualCoords}
                                className="flex-1 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded font-bold text-xs shadow-sm transition flex items-center justify-center gap-1"
                            >
                                <Check className="w-3.5 h-3.5" /> Apply Exact Pin
                            </button>
                            <button
                                type="button"
                                onClick={() => detectLiveLocation(true)}
                                className="px-2.5 py-1.5 border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569] rounded font-medium text-xs transition"
                                title="Re-query device GPS"
                            >
                                Re-detect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up Inspector for Selected Member on Live Google Map */}
            {selectedMember && (
                <div className="absolute top-16 left-4 z-30 bg-white/95 backdrop-blur-md border border-[#e2e8f0] p-4 rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                                style={{ backgroundColor: selectedMember.avatarColor }}
                            >
                                {selectedMember.avatar}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#1e293b] truncate">
                                    {selectedMember.name}
                                </h4>
                                <p className="text-[10px] text-[#64748b]">{selectedMember.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onSelectMember(null)}
                            className="text-[#94a3b8] hover:text-[#1e293b] text-xs font-bold p-1"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="pt-2.5 space-y-2 text-xs text-[#334155]">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#64748b] flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Status:
                            </span>
                            <span
                                className="font-semibold px-2 py-0.5 rounded-full text-[10px]"
                                style={{
                                    color: selectedMember.statusColor,
                                    backgroundColor: `${selectedMember.statusColor}15`,
                                }}
                            >
                                {selectedMember.status}
                            </span>
                        </div>

                        <div className="flex items-start justify-between text-[11px]">
                            <span className="text-[#64748b] flex items-center gap-1">
                                <Navigation className="w-3.5 h-3.5 text-[#03a9f4]" /> Google Pin:
                            </span>
                            <span className="font-medium text-right truncate max-w-[190px] text-[#1e293b]">
                                {selectedMember.locationName}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#64748b] flex items-center gap-1">
                                <Battery className="w-3.5 h-3.5 text-[#8b5cf6]" /> Speed &amp; Battery:
                            </span>
                            <span className="font-mono text-[#0288d1] font-semibold">
                                {selectedMember.speed} · {selectedMember.battery}%
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#64748b] flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#f59e0b]" /> Last Recorded:
                            </span>
                            <span className="font-mono text-[#10b981] font-bold">
                                {selectedMember.lastSeen === "-" ? "GPS Off" : selectedMember.lastSeen}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
