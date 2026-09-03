import { useEffect } from "react";
import { useTimerStore } from "@/stores/useTimerStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Play, Square } from "lucide-react";

export function TrackerBar() {
    const {
        isTracking,
        description,
        projectName,
        projectColor,
        isBillable,
        isLocationEnabled,
        currentLocation,
        elapsedSeconds,
        setDescription,
        toggleBillable,
        toggleLocationEnabled,
        setCurrentLocation,
        startTimer,
        stopTimer,
        tick,
    } = useTimerStore();

    const { getCurrentLocation, loading: locationLoading } = useGeolocation();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTracking) {
            timer = setInterval(tick, 1000);
        }
        return () => clearInterval(timer);
    }, [isTracking, tick]);

    const formatTime = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600).toString().padStart(2, "0");
        const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, "0");
        const s = (totalSecs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const handleStartTimer = async () => {
        if (isTracking) {
            stopTimer();
            return;
        }

        if (isLocationEnabled) {
            const location = await getCurrentLocation();
            if (location) {
                setCurrentLocation(location);
            }
        }

        startTimer();
    };

    const getLocationDisplayText = () => {
        if (!currentLocation) return null;
        if (currentLocation.address) {
            return currentLocation.address.length > 30
                ? currentLocation.address.substring(0, 30) + "…"
                : currentLocation.address;
        }
        return `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
    };

    return (
        <div className="w-full bg-white border border-[#e2e8f0] p-3 rounded-lg shadow-sm flex items-center justify-between gap-4">
            <Input
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm font-semibold text-[#1e293b] focus-visible:ring-0 shadow-none px-0 placeholder:text-[#94a3b8]"
            />

            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Project badge */}
                <span className="px-2.5 py-1 bg-[#e1f5fe] text-[#0288d1] rounded text-xs font-semibold border border-[#b3e5fc] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: projectColor }} />
                    {projectName}
                </span>

                {/* Billable badge — clickable pill */}
                <button
                    onClick={toggleBillable}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 transition-colors ${
                        isBillable
                            ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]"
                            : "bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0] hover:bg-[#f1f5f9]"
                    }`}
                >
                    $ Billable
                </button>

                {/* Location toggle badge */}
                <button
                    onClick={toggleLocationEnabled}
                    disabled={isTracking}
                    title={isTracking ? "Cannot change location while tracking" : "Toggle location tracking"}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 transition-colors ${
                        isLocationEnabled
                            ? "bg-[#e1f5fe] text-[#0288d1] border-[#b3e5fc]"
                            : "bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0] hover:bg-[#f1f5f9]"
                    }`}
                >
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                </button>

                <div className="h-6 w-px bg-[#e2e8f0]" />

                {/* Timer display */}
                <span className="text-xl font-bold font-mono text-[#1e293b]">{formatTime(elapsedSeconds)}</span>

                {/* Live location pill while tracking */}
                {isTracking && isLocationEnabled && currentLocation && (
                    <span className="px-2.5 py-1 bg-[#e1f5fe] text-[#0288d1] rounded text-xs font-semibold border border-[#b3e5fc] flex items-center gap-1.5 animate-pulse">
                        <MapPin className="w-3 h-3" />
                        {getLocationDisplayText()}
                    </span>
                )}

                {/* Loading indicator */}
                {isTracking && isLocationEnabled && locationLoading && (
                    <span className="px-2.5 py-1 bg-[#f8fafc] text-[#94a3b8] rounded text-xs font-semibold border border-[#e2e8f0] flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-[#94a3b8] border-t-transparent rounded-full animate-spin" />
                        Locating...
                    </span>
                )}

                {/* Start/Stop button */}
                <Button
                    onClick={handleStartTimer}
                    className={`px-4 py-2 font-bold text-xs rounded shadow-sm flex items-center gap-1 transition-colors ${
                        isTracking
                            ? "bg-[#ef4444] hover:bg-[#dc2626] text-white"
                            : "bg-[#03a9f4] hover:bg-[#0288d1] text-white"
                    }`}
                >
                    {isTracking ? (
                        <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            STOP
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            START
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}