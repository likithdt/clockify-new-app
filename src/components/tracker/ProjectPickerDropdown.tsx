import { useState, useRef, useEffect } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import { PlusCircle, Search, Check, FolderPlus, X } from "lucide-react";

interface Props {
    selectedProjectName: string;
    selectedProjectColor: string;
    onSelectProject: (name: string, color: string) => void;
}

export function ProjectPickerDropdown({
    selectedProjectName,
    selectedProjectColor,
    onSelectProject,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { projects, openCreateModal } = useProjectStore();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasSelection =
        selectedProjectName && selectedProjectName !== "No Project";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Button matching Clockify (+) Project */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition text-xs font-semibold cursor-pointer ${
                    hasSelection
                        ? "bg-[#E1F5FE] text-[#0288D1] border border-[#B3E5FC]"
                        : "text-[#03A9F4] hover:bg-[#E1F5FE]/60"
                }`}
            >
                {hasSelection ? (
                    <>
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selectedProjectColor }}
                        />
                        <span className="truncate max-w-[140px]">
                            {selectedProjectName}
                        </span>
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectProject("No Project", "#94a3b8");
                            }}
                            className="ml-1 hover:text-[#EF4444] transition p-0.5"
                            title="Remove project"
                        >
                            <X className="w-3 h-3" />
                        </span>
                    </>
                ) : (
                    <>
                        <PlusCircle className="w-4 h-4 text-[#03A9F4]" />
                        <span>Project</span>
                    </>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-[#E2E8F0] rounded shadow-xl z-50 py-1 text-xs">
                    {/* Search box */}
                    <div className="p-2 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded focus-within:border-[#03A9F4]">
                            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Find project or client..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-xs text-[#1E293B] placeholder:text-[#94A3B8] outline-none w-full"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Projects list */}
                    <div className="max-h-52 overflow-y-auto py-1">
                        {filteredProjects.length === 0 ? (
                            <div className="p-3 text-center text-xs text-[#94A3B8]">
                                No projects found
                            </div>
                        ) : (
                            filteredProjects.map((proj) => {
                                const isSelected =
                                    selectedProjectName === proj.name;
                                return (
                                    <button
                                        key={proj.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectProject(
                                                proj.name,
                                                proj.color
                                            );
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-[#F1F5F9] flex items-center justify-between transition cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor: proj.color,
                                                }}
                                            />
                                            <span className="truncate text-[#1E293B] font-medium">
                                                {proj.name}
                                            </span>
                                            {proj.client && (
                                                <span className="text-[10px] text-[#94A3B8]">
                                                    ({proj.client})
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check className="w-3.5 h-3.5 text-[#03A9F4]" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Bottom Action: Create Project */}
                    <div className="border-t border-[#E2E8F0] p-1.5 bg-[#F8FAFC]">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                openCreateModal();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-[#03A9F4] hover:bg-[#E1F5FE] rounded transition cursor-pointer"
                        >
                            <FolderPlus className="w-3.5 h-3.5" />
                            <span>Create new project</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
