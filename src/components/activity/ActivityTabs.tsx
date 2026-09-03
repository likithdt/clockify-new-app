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
        <div className="w-full flex items-center justify-between gap-4 py-2 border-b border-[#e2e8f0] bg-white px-6">
            {/* Segmented Tab Controls: ACTIVITY | Screenshots | Locations */}
            <div className="inline-flex items-center rounded border border-[#cbd5e1] p-0.5 bg-[#f8fafc]">
                <button
                    onClick={() => setActiveSubTab("activity")}
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        activeSubTab === "activity"
                            ? "bg-white text-[#1e293b] shadow-sm font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    ACTIVITY
                </button>

                <button
                    onClick={() => setActiveSubTab("screenshots")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                        activeSubTab === "screenshots"
                            ? "bg-white text-[#1e293b] shadow-sm font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    Screenshots
                </button>

                <button
                    onClick={() => setActiveSubTab("locations")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                        activeSubTab === "locations"
                            ? "bg-white text-[#1e293b] shadow-sm font-bold"
                            : "text-[#64748b] hover:text-[#1e293b]"
                    }`}
                >
                    Locations
                </button>
            </div>

            {/* Right Controls: Teammates filter & Date Picker */}
            <div className="flex items-center gap-3 relative">
                {/* Teammates Dropdown (shown on screenshots tab) */}
                {showTeammatesFilter && (
                    <div className="relative">
                        <button
                            onClick={() => setIsTeammateDropdownOpen(!isTeammateDropdownOpen)}
                            className="h-8 px-3 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded text-xs font-medium text-[#475569] flex items-center gap-2 transition shadow-sm"
                        >
                            <span className="truncate max-w-[140px]">{getTeammateLabel()}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
                        </button>

                        {isTeammateDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsTeammateDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-9 w-52 bg-white border border-[#e2e8f0] rounded-md shadow-lg py-1 z-50 text-xs">
                                    <button
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
                )}

                {/* Date Navigator: [Calendar Icon] Today [<] [>] */}
                <div className="flex items-center h-8 bg-white border border-[#cbd5e1] rounded shadow-sm overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#475569] border-r border-[#cbd5e1]">
                        <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>{selectedDate}</span>
                    </div>
                    <button
                        onClick={handlePreviousDay}
                        className="px-2 h-full hover:bg-[#f1f5f9] border-r border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] transition"
                        title="Previous day"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleNextDay}
                        disabled={selectedDate === "Today"}
                        className={`px-2 h-full hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#1e293b] transition ${
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
