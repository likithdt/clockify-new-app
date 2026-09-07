import { useEffect, useState, useRef } from "react";
import { useTimerStore } from "@/stores/useTimerStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import { ProjectPickerDropdown } from "./ProjectPickerDropdown";
import { TagPickerDropdown } from "./TagPickerDropdown";
import { MoreVertical, Square, MapPin } from "lucide-react";

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
        setProject,
        toggleBillable,
        toggleLocationEnabled,
        setCurrentLocation,
        startTimer,
        stopTimer,
        tick,
    } = useTimerStore();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isHoveringStart, setIsHoveringStart] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    const { getCurrentLocation, loading: locationLoading } = useGeolocation();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTracking) {
            timer = setInterval(tick, 1000);
        }
        return () => clearInterval(timer);
    }, [isTracking, tick]);

    // Close more menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(event.target as Node)
            ) {
                setIsMoreMenuOpen(false);
            }
        };
        if (isMoreMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMoreMenuOpen]);

    const formatTime = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600)
            .toString()
            .padStart(2, "0");
        const m = Math.floor((totalSecs % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = (totalSecs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const handleStartStop = async () => {
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

    const handleToggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="w-full bg-white border border-[#E2E8F0] px-4 py-2.5 rounded shadow-xs flex items-center justify-between gap-4 select-none relative">
            {/* What are you working on? text input */}
            <input
                type="text"
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none min-w-[140px]"
            />

            {/* Right Controls matching Clockify TimeTracker.png */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* (+) Project Picker */}
                <ProjectPickerDropdown
                    selectedProjectName={projectName}
                    selectedProjectColor={projectColor}
                    onSelectProject={(name, color) => setProject(name, color)}
                />

                {/* Tag icon */}
                <TagPickerDropdown
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                />

                {/* Billable $ button */}
                <button
                    type="button"
                    onClick={toggleBillable}
                    className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-sm transition cursor-pointer ${
                        isBillable
                            ? "text-[#03A9F4] hover:bg-[#E1F5FE]"
                            : "text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                    }`}
                    title={isBillable ? "Billable (active)" : "Non-billable"}
                >
                    $
                </button>

                {/* Location indicator toggle (if active or locating) */}
                {isTracking && isLocationEnabled && (
                    <span className="flex items-center gap-1 text-[11px] text-[#0288D1] bg-[#E1F5FE] px-2 py-0.5 rounded border border-[#B3E5FC]">
                        <MapPin className="w-3 h-3" />
                        {locationLoading ? "Locating..." : currentLocation?.address?.substring(0, 18) || "GPS Active"}
                    </span>
                )}

                {/* Elapsed Time Display: 00:00:00 */}
                <span className="font-mono text-base font-normal text-[#1E293B] min-w-[70px] text-center tracking-wide">
                    {formatTime(elapsedSeconds)}
                </span>

                {/* START / STOP Button with hover tooltip */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={handleStartStop}
                        onMouseEnter={() => setIsHoveringStart(true)}
                        onMouseLeave={() => setIsHoveringStart(false)}
                        className={`px-5 py-2 font-bold text-xs rounded uppercase tracking-wider transition-colors cursor-pointer shadow-xs ${
                            isTracking
                                ? "bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-1.5"
                                : "bg-[#03A9F4] hover:bg-[#0288D1] text-white"
                        }`}
                    >
                        {isTracking ? (
                            <>
                                <Square className="w-3.5 h-3.5 fill-current" />
                                STOP
                            </>
                        ) : (
                            "START"
                        )}
                    </button>

                    {/* Tooltip: Start timer */}
                    {!isTracking && isHoveringStart && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 bg-[#1E293B] text-white text-[11px] font-medium px-2 py-1 rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
                            <div className="absolute left-1/2 -translate-x-1/2 -top-1 border-solid border-b-[#1E293B] border-b-4 border-x-transparent border-x-4 border-t-0" />
                            Start timer
                        </div>
                    )}
                </div>

                {/* Three dots menu */}
                <div className="relative" ref={moreMenuRef}>
                    <button
                        type="button"
                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                        className="p-1 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded transition cursor-pointer"
                        title="More options"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMoreMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded shadow-xl z-50 py-1 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    toggleLocationEnabled();
                                    setIsMoreMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between text-[#1E293B] cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                                    GPS Location Tracking
                                </span>
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isLocationEnabled
                                            ? "bg-[#10B981]"
                                            : "bg-[#CBD5E1]"
                                    }`}
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMoreMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] text-[#1E293B] cursor-pointer"
                            >
                                Manual time entry mode
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}