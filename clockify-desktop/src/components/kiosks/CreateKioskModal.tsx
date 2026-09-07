import React, { useState } from "react";
import { useKioskStore } from "@/stores/useKioskStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { X, ChevronDown, Info, Check } from "lucide-react";

const TEAM_MEMBERS = [
    { id: "all", name: "All Members" },
    { id: "bs", name: "Bindhu Shree" },
    { id: "ld", name: "Likith D T" },
    { id: "as", name: "Amy Smith" },
    { id: "ja", name: "James Anderson" },
    { id: "lp", name: "Lara Peterson" },
];

export function CreateKioskModal() {
    const { isCreateModalOpen, closeCreateModal, createKiosk } = useKioskStore();
    const { projects } = useProjectStore();

    const [name, setName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [defaultProject, setDefaultProject] = useState("");
    const [defaultBreakProject, setDefaultBreakProject] = useState("");
    const [logoutAfterHours, setLogoutAfterHours] = useState(24);
    const [authRequired, setAuthRequired] = useState(false);

    // Dropdown toggles
    const [isMembersDropdownOpen, setIsMembersDropdownOpen] = useState(false);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isBreakDropdownOpen, setIsBreakDropdownOpen] = useState(false);
    const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

    if (!isCreateModalOpen) return null;

    const handleToggleMember = (memberName: string) => {
        if (memberName === "All Members") {
            if (selectedMembers.includes("All Members")) {
                setSelectedMembers([]);
            } else {
                setSelectedMembers(["All Members"]);
            }
            return;
        }

        const filtered = selectedMembers.filter((m) => m !== "All Members");
        if (filtered.includes(memberName)) {
            setSelectedMembers(filtered.filter((m) => m !== memberName));
        } else {
            setSelectedMembers([...filtered, memberName]);
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        createKiosk({
            name: name.trim(),
            assignees:
                selectedMembers.length > 0 ? selectedMembers : ["All Members"],
            defaultProject: defaultProject || "Project Alpha",
            defaultBreakProject: defaultBreakProject || "Break",
            logoutAfterHours,
            authRequired,
        });

        // Reset
        setName("");
        setSelectedMembers([]);
        setDefaultProject("");
        setDefaultBreakProject("");
        setLogoutAfterHours(24);
        setAuthRequired(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                    <h2 className="text-lg font-normal text-[#1E293B]">
                        Create kiosk
                    </h2>
                    <button
                        type="button"
                        onClick={closeCreateModal}
                        className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                    {/* Name * */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Name <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#03A9F4]"
                            autoFocus
                        />
                    </div>

                    {/* Assignees * */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Assignees <span className="text-[#EF4444]">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                setIsMembersDropdownOpen(!isMembersDropdownOpen)
                            }
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] bg-white flex items-center justify-between hover:border-[#CBD5E1] transition cursor-pointer"
                        >
                            <span
                                className={
                                    selectedMembers.length === 0
                                        ? "text-[#94A3B8]"
                                        : "text-[#1E293B] font-medium"
                                }
                            >
                                {selectedMembers.length === 0
                                    ? "Select members"
                                    : selectedMembers.join(", ")}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        </button>

                        {isMembersDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 max-h-48 overflow-y-auto py-1 text-xs">
                                {TEAM_MEMBERS.map((member) => {
                                    const isSelected = selectedMembers.includes(
                                        member.name
                                    );
                                    return (
                                        <button
                                            key={member.id}
                                            type="button"
                                            onClick={() =>
                                                handleToggleMember(member.name)
                                            }
                                            className="w-full px-3 py-2 text-left hover:bg-[#F1F5F9] flex items-center justify-between text-[#1E293B] cursor-pointer"
                                        >
                                            <span>{member.name}</span>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5 text-[#03A9F4]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Default Project */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Default Project
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                setIsProjectDropdownOpen(!isProjectDropdownOpen)
                            }
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] bg-white flex items-center justify-between hover:border-[#CBD5E1] transition cursor-pointer"
                        >
                            <span
                                className={
                                    !defaultProject
                                        ? "text-[#94A3B8]"
                                        : "text-[#1E293B] font-medium"
                                }
                            >
                                {defaultProject || "Select Project"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        </button>

                        {isProjectDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 max-h-48 overflow-y-auto py-1 text-xs">
                                {projects.map((proj) => (
                                    <button
                                        key={proj.id}
                                        type="button"
                                        onClick={() => {
                                            setDefaultProject(proj.name);
                                            setIsProjectDropdownOpen(false);
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-[#F1F5F9] flex items-center gap-2 text-[#1E293B] cursor-pointer"
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: proj.color }}
                                        />
                                        <span>{proj.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Default break Project */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                            Default break Project
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                setIsBreakDropdownOpen(!isBreakDropdownOpen)
                            }
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#1E293B] bg-white flex items-center justify-between hover:border-[#CBD5E1] transition cursor-pointer"
                        >
                            <span
                                className={
                                    !defaultBreakProject
                                        ? "text-[#94A3B8]"
                                        : "text-[#1E293B] font-medium"
                                }
                            >
                                {defaultBreakProject || "Select break Project"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        </button>

                        {isBreakDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded shadow-lg z-30 max-h-48 overflow-y-auto py-1 text-xs">
                                {["Break / Lunch", "Personal Break", "Meeting Break"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setDefaultBreakProject(item);
                                                setIsBreakDropdownOpen(false);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-[#F1F5F9] text-[#1E293B] cursor-pointer"
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Kiosk logs out after X hours */}
                    <div className="flex items-center gap-1.5 text-xs text-[#1E293B] pt-1">
                        <span>Kiosk logs out after</span>
                        <div className="relative inline-block">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsHoursDropdownOpen(!isHoursDropdownOpen)
                                }
                                className="text-[#03A9F4] font-semibold hover:underline cursor-pointer px-1"
                            >
                                {logoutAfterHours}
                            </button>
                            {isHoursDropdownOpen && (
                                <div className="absolute left-0 bottom-full mb-1 bg-white border border-[#E2E8F0] rounded shadow-md z-30 py-1 text-xs">
                                    {[1, 2, 4, 8, 12, 24, 48].map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => {
                                                setLogoutAfterHours(h);
                                                setIsHoursDropdownOpen(false);
                                            }}
                                            className="w-full px-3 py-1 hover:bg-[#F1F5F9] text-left cursor-pointer"
                                        >
                                            {h} hours
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span>hours</span>
                    </div>

                    {/* Authentication required checkbox */}
                    <div className="pt-2 flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1E293B]">
                            <input
                                type="checkbox"
                                checked={authRequired}
                                onChange={(e) => setAuthRequired(e.target.checked)}
                                className="w-4 h-4 rounded border-[#CBD5E1] text-[#03A9F4] focus:ring-0"
                            />
                            <span>Authentication required</span>
                        </label>
                        <span
                            title="Require employee PIN or barcode scan before allowing clock actions"
                            className="text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
                        >
                            <Info className="w-3.5 h-3.5" />
                        </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E2E8F0] mt-6">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="text-xs font-semibold text-[#03A9F4] hover:text-[#0288D1] hover:underline cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-[#03A9F4] hover:bg-[#0288D1] disabled:bg-[#B3E5FC] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition cursor-pointer"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
