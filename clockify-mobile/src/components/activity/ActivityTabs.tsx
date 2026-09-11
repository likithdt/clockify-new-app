import { useState } from "react";
import { useActivityStore } from "@/stores/useActivityStore";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

interface ActivityTabsProps {
    showTeammatesFilter?: boolean;
}

export function ActivityTabs({ showTeammatesFilter = false }: ActivityTabsProps) {
    const {
        activeSubTab,
        setActiveSubTab,
        selectedTeammate,
        setSelectedTeammate,
        selectedDate,
        setSelectedDate,
        members,
    } = useActivityStore();

    const [isTeammateDropdownOpen, setIsTeammateDropdownOpen] = useState(false);

    const getTeammateLabel = () => {
        if (selectedTeammate === "all") return "Teammates";
        const found = members.find((m) => m.id === selectedTeammate);
        return found ? found.name : "Teammates";
    };

    const handlePreviousDay = () => {
        if (selectedDate === "Today") {
            setSelectedDate("Yesterday");
        } else if (selectedDate === "Yesterday") {
            setSelectedDate("2 days ago");
        }
    };

    const handleNextDay = () => {
        if (selectedDate === "2 days ago") {
            setSelectedDate("Yesterday");
        } else if (selectedDate === "Yesterday") {
            setSelectedDate("Today");
        }
    };

    return (
        <div className="w-full bg-white border-b border-[#e2e8f0] px-3 py-2 space-y-2 select-none shrink-0 z-20">
            {/* 1. Segmented Sub-Tab Buttons: ACTIVITY | Screenshots | Locations */}
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#cbd5e1] p-1 bg-[#f8fafc]">
                <button
                    type="button"
                    onClick={() => setActiveSubTab("activity")}
                    className={`py-1.5 text-xs font-semibold rounded text-center transition-all cursor-pointer ${
                        activeSubTab === "activity"
                            ? "bg-white text-[#03a9f4] shadow-xs font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    ACTIVITY
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSubTab("screenshots")}
                    className={`py-1.5 text-xs font-semibold rounded text-center transition-all cursor-pointer ${
                        activeSubTab === "screenshots"
                            ? "bg-white text-[#03a9f4] shadow-xs font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    Screenshots
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSubTab("locations")}
                    className={`py-1.5 text-xs font-semibold rounded text-center transition-all cursor-pointer ${
                        activeSubTab === "locations"
                            ? "bg-white text-[#03a9f4] shadow-xs font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    Locations
                </button>
            </div>

            {/* 2. Controls Row: Teammates Filter & Date Navigator */}
            <div className="flex items-center justify-between gap-2">
                {/* Teammates Dropdown (shown when requested, e.g. Screenshots tab) */}
                {showTeammatesFilter ? (
                    <div className="relative flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsTeammateDropdownOpen(!isTeammateDropdownOpen)}
                            className="h-8 w-full max-w-[170px] px-2.5 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-md text-xs font-medium text-[#475569] flex items-center justify-between gap-1 transition shadow-2xs"
                        >
                            <span className="truncate">{getTeammateLabel()}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                        </button>

                        {isTeammateDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsTeammateDropdownOpen(false)}
                                />
                                <div className="absolute left-0 top-9 w-52 bg-white border border-[#e2e8f0] rounded-lg shadow-xl py-1 z-50 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTeammate("all");
                                            setIsTeammateDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f1f5f9] transition ${
                                            selectedTeammate === "all" ? "font-bold text-[#0288d1]" : "text-[#334155]"
                                        }`}
                                    >
                                        <span>All Teammates</span>
                                        {selectedTeammate === "all" && <Check className="w-3.5 h-3.5 text-[#0288d1]" />}
                                    </button>
                                    <div className="h-px bg-[#f1f5f9] my-1" />
                                    {members.map((member) => (
                                        <button
                                            key={member.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTeammate(member.id);
                                                setIsTeammateDropdownOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f1f5f9] transition ${
                                                selectedTeammate === member.id ? "font-bold text-[#0288d1]" : "text-[#334155]"
                                            }`}
                                        >
                                            <span className="truncate">{member.name}</span>
                                            {selectedTeammate === member.id && <Check className="w-3.5 h-3.5 text-[#0288d1]" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex-1" />
                )}

                {/* Date Navigator: [Calendar Icon] Today [<] [>] */}
                <div className="flex items-center h-8 bg-white border border-[#cbd5e1] rounded-md shadow-2xs overflow-hidden shrink-0">
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#475569] border-r border-[#cbd5e1]">
                        <Calendar className="w-3.5 h-3.5 text-[#03a9f4]" />
                        <span>{selectedDate}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handlePreviousDay}
                        className="px-2 h-full hover:bg-[#f1f5f9] border-r border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] transition cursor-pointer"
                        title="Previous day"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextDay}
                        disabled={selectedDate === "Today"}
                        className={`px-2 h-full hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] transition cursor-pointer ${
                            selectedDate === "Today" ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                        title="Next day"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
