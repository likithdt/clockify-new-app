import { useState, useEffect } from "react";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { useTeamStore } from "@/stores/useTeamStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { X, Calendar } from "lucide-react";

export function ScheduleAddModal() {
    const { isAddModalOpen, closeAddModal, addAssignment, selectedAssignmentForEdit } =
        useScheduleStore();
    const { members } = useTeamStore();
    const { projects } = useProjectStore();

    const [projectName, setProjectName] = useState("[SAMPLE] Project Alpha");
    const [projectColor, setProjectColor] = useState("#F59E0B");
    const [client, setClient] = useState("[SAMPLE] Client B");
    const [memberId, setMemberId] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberInitials, setMemberInitials] = useState("");
    const [memberAvatarColor, setMemberAvatarColor] = useState("#00897B");
    const [startDate, setStartDate] = useState("2026-08-31");
    const [endDate, setEndDate] = useState("2026-09-04");
    const [hoursPerDay, setHoursPerDay] = useState("8");
    const [versionLabel, setVersionLabel] = useState("");
    const [isHatched, setIsHatched] = useState(false);
    const [note, setNote] = useState("");

    // Initialize with existing members/projects
    useEffect(() => {
        if (members.length > 0 && !memberId) {
            const first = members[0];
            setMemberId(first.id);
            setMemberName(first.name.replace(" (you)", ""));
            setMemberInitials(first.name.slice(0, 2).toUpperCase());
        }
    }, [members, memberId]);

    useEffect(() => {
        if (selectedAssignmentForEdit) {
            setProjectName(selectedAssignmentForEdit.projectName);
            setProjectColor(selectedAssignmentForEdit.projectColor);
            setClient(selectedAssignmentForEdit.client);
            setMemberId(selectedAssignmentForEdit.memberId);
            setMemberName(selectedAssignmentForEdit.memberName);
            setMemberInitials(selectedAssignmentForEdit.memberInitials);
            setMemberAvatarColor(selectedAssignmentForEdit.memberAvatarColor);
            setStartDate(selectedAssignmentForEdit.startDate);
            setEndDate(selectedAssignmentForEdit.endDate);
            setHoursPerDay(String(selectedAssignmentForEdit.hoursPerDay));
            setVersionLabel(selectedAssignmentForEdit.versionLabel || "");
            setIsHatched(!!selectedAssignmentForEdit.isHatched);
            setNote(selectedAssignmentForEdit.note || "");
        } else {
            // Reset to defaults
            setProjectName("[SAMPLE] Project Alpha");
            setProjectColor("#F59E0B");
            setClient("[SAMPLE] Client B");
            setStartDate("2026-08-31");
            setEndDate("2026-09-04");
            setHoursPerDay("8");
            setVersionLabel("");
            setIsHatched(false);
            setNote("");
        }
    }, [selectedAssignmentForEdit, isAddModalOpen]);

    if (!isAddModalOpen) return null;

    const handleMemberChange = (selectedId: string) => {
        setMemberId(selectedId);
        const m = members.find((x) => x.id === selectedId);
        if (m) {
            setMemberName(m.name.replace(" (you)", ""));
            setMemberInitials(m.name.slice(0, 2).toUpperCase());
            const colors = ["#00897B", "#0288D1", "#F59E0B", "#EF4444", "#64748B", "#8B5CF6"];
            const hash = m.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            setMemberAvatarColor(colors[hash % colors.length]);
        }
    };

    const handleProjectSelect = (name: string) => {
        setProjectName(name);
        const p = projects.find((x) => x.name === name);
        if (p) {
            setProjectColor(p.color);
            setClient(p.client || "No Client");
        } else if (name === "[SAMPLE] Project Alpha") {
            setProjectColor("#F59E0B");
            setClient("[SAMPLE] Client B");
        } else if (name === "[SAMPLE] Project Beta") {
            setProjectColor("#EF4444");
            setClient("[SAMPLE] Client A");
        } else if (name === "[SAMPLE] Project Gamma") {
            setProjectColor("#78716C");
            setClient("[SAMPLE] Client A");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const hPerDay = parseFloat(hoursPerDay) || 8;
        const totalHours = Math.round(diffDays * hPerDay);

        const pId = `proj-${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

        addAssignment({
            projectId: pId,
            projectName,
            projectColor,
            client,
            memberId: memberId || "tm-default",
            memberName: memberName || "Bindhu Shree",
            memberInitials: memberInitials || "BS",
            memberAvatarColor: memberAvatarColor || "#00897B",
            startDate,
            endDate,
            hoursPerDay: hPerDay,
            totalHours,
            note: note.trim() || undefined,
            versionLabel: versionLabel.trim() || undefined,
            isHatched,
        });

        closeAddModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#03A9F4]" />
                        <h2 className="text-base font-semibold text-[#1E293B]">
                            {selectedAssignmentForEdit ? "Edit Assignment" : "Add Schedule Assignment"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={closeAddModal}
                        className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                    {/* Project & Client */}
                    <div>
                        <label className="block font-semibold text-[#1E293B] mb-1">
                            Project
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => handleProjectSelect(e.target.value)}
                                placeholder="Enter or select project"
                                className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                required
                            />
                            <input
                                type="color"
                                value={projectColor}
                                onChange={(e) => setProjectColor(e.target.value)}
                                className="w-9 h-9 p-0.5 border border-[#E2E8F0] rounded cursor-pointer"
                                title="Project color"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-[#1E293B] mb-1">
                            Client
                        </label>
                        <input
                            type="text"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            placeholder="e.g. [SAMPLE] Client A"
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                        />
                    </div>

                    {/* Team Member */}
                    <div>
                        <label className="block font-semibold text-[#1E293B] mb-1">
                            Assignee (Team Member)
                        </label>
                        <select
                            value={memberId}
                            onChange={(e) => handleMemberChange(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#03A9F4]"
                        >
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name} ({m.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-[#1E293B] mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-[#1E293B] mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                required
                            />
                        </div>
                    </div>

                    {/* Hours Per Day & Version Label */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-[#1E293B] mb-1">
                                Hours per Day
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="24"
                                value={hoursPerDay}
                                onChange={(e) => setHoursPerDay(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-[#1E293B] mb-1">
                                Version Tag (optional)
                            </label>
                            <input
                                type="text"
                                value={versionLabel}
                                onChange={(e) => setVersionLabel(e.target.value)}
                                placeholder="e.g. V1, Sprint 2"
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                            />
                        </div>
                    </div>

                    {/* Hatched Pattern Option */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="hatchedCheckbox"
                            checked={isHatched}
                            onChange={(e) => setIsHatched(e.target.checked)}
                            className="rounded border-[#CBD5E1] text-[#03A9F4] focus:ring-[#03A9F4]"
                        />
                        <label htmlFor="hatchedCheckbox" className="text-xs text-[#475569] cursor-pointer">
                            Hatched diagonal stripes pattern (Planning / Review status)
                        </label>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block font-semibold text-[#1E293B] mb-1">
                            Note (optional)
                        </label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add brief details"
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] focus:outline-none focus:border-[#03A9F4]"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                        <button
                            type="button"
                            onClick={closeAddModal}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] cursor-pointer transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#03A9F4] hover:bg-[#0288D1] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition cursor-pointer"
                        >
                            {selectedAssignmentForEdit ? "Save Changes" : "Add Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
