import { useState } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import { X, ChevronDown, Check, Info } from "lucide-react";

const CLOCKIFY_COLORS = [
    "#03a9f4", // Light Blue
    "#2196f3", // Blue
    "#3f51b5", // Indigo
    "#5c6bc0", // Slate Indigo
    "#673ab7", // Deep Purple
    "#9c27b0", // Purple
    "#e91e63", // Pink
    "#f44336", // Red
    "#ff5722", // Deep Orange
    "#ff9800", // Orange
    "#ffc107", // Amber
    "#4caf50", // Green
    "#8bc34a", // Light Green
    "#009688", // Teal
    "#00bcd4", // Cyan
    "#607d8b", // Blue Grey
    "#795548", // Brown
    "#9e9e9e", // Grey
];

const CLIENT_OPTIONS = [
    "Select client",
    "[SAMPLE] Client A",
    "[SAMPLE] Client B",
];

export function CreateProjectModal() {
    const { isCreateModalOpen, closeCreateModal, createProject } = useProjectStore();

    const [projectName, setProjectName] = useState("");
    const [selectedClient, setSelectedClient] = useState("Select client");
    const [selectedColor, setSelectedColor] = useState("#5c6bc0");
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState("No template");
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    if (!isCreateModalOpen) return null;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        createProject({
            name: projectName.trim(),
            color: selectedColor,
            client: selectedClient !== "Select client" ? selectedClient : null,
            isPublic,
        });

        // Reset and close
        setProjectName("");
        setSelectedClient("Select client");
        setSelectedColor("#5c6bc0");
        setIsPublic(true);
        closeCreateModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 select-none">
            <div className="bg-white rounded-sm shadow-2xl border border-[#e2e8f0] w-full max-w-[500px] overflow-visible relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <h2 className="text-[17px] font-medium text-[#1e293b]">Create new Project</h2>
                    <button
                        onClick={closeCreateModal}
                        className="text-[#94a3b8] hover:text-[#1e293b] transition p-1 cursor-pointer"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleCreate} className="px-6 py-4 space-y-4">
                    {/* Row 1: Project Name & Select Client */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Enter Project name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                autoFocus
                                className="w-full border border-[#cbd5e1] rounded-sm px-3 py-2 text-xs text-[#1e293b] placeholder:text-[#94a3b8] focus:border-[#03a9f4] focus:ring-1 focus:ring-[#03a9f4] outline-none transition"
                            />
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                                className="w-full flex items-center justify-between border border-[#cbd5e1] rounded-sm px-3 py-2 text-xs text-[#1e293b] bg-white hover:border-[#94a3b8] focus:border-[#03a9f4] outline-none transition cursor-pointer"
                            >
                                <span className={selectedClient === "Select client" ? "text-[#94a3b8]" : "text-[#1e293b]"}>
                                    {selectedClient}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                            </button>

                            {isClientDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 text-xs">
                                    {CLIENT_OPTIONS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => {
                                                setSelectedClient(c);
                                                setIsClientDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] cursor-pointer"
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Color Picker, Public Checkbox, Template */}
                    <div className="flex items-center gap-4 pt-1">
                        {/* Color Picker Button & Popover */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                className="flex items-center gap-1.5 border border-[#cbd5e1] rounded-sm px-2 py-1.5 bg-white hover:border-[#94a3b8] cursor-pointer transition"
                                title="Pick project color"
                            >
                                <span
                                    className="w-4 h-4 rounded-sm"
                                    style={{ backgroundColor: selectedColor }}
                                />
                                <ChevronDown className="w-3 h-3 text-[#64748b]" />
                            </button>

                            {isColorPickerOpen && (
                                <div className="absolute left-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded shadow-xl p-2.5 grid grid-cols-6 gap-1.5 z-40 w-[180px]">
                                    {CLOCKIFY_COLORS.map((col) => (
                                        <button
                                            key={col}
                                            type="button"
                                            onClick={() => {
                                                setSelectedColor(col);
                                                setIsColorPickerOpen(false);
                                            }}
                                            className="w-5 h-5 rounded-sm hover:scale-110 transition flex items-center justify-center cursor-pointer relative"
                                            style={{ backgroundColor: col }}
                                        >
                                            {selectedColor === col && (
                                                <Check className="w-3 h-3 text-white drop-shadow-sm" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Public Checkbox */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#1e293b]">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-3.5 h-3.5 text-[#03a9f4] border-[#cbd5e1] rounded-sm focus:ring-[#03a9f4] cursor-pointer"
                            />
                            <span>Public</span>
                            <div
                                className="relative flex items-center"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <Info className="w-3 h-3 text-[#94a3b8] hover:text-[#64748b] cursor-pointer ml-0.5" />
                                {showTooltip && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 bg-[#1e293b] text-white text-[10px] p-2 rounded shadow-lg z-50 pointer-events-none">
                                        Public projects are visible to everyone in the workspace.
                                    </div>
                                )}
                            </div>
                        </label>

                        {/* Template Dropdown */}
                        <div className="relative flex-1">
                            <button
                                type="button"
                                onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                                className="w-full flex items-center justify-between border border-[#cbd5e1] rounded-sm px-3 py-1.5 text-xs text-[#1e293b] bg-white hover:border-[#94a3b8] focus:border-[#03a9f4] outline-none transition cursor-pointer"
                            >
                                <span className="text-[#1e293b]">{selectedTemplate}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                            </button>

                            {isTemplateDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-sm shadow-lg z-30 py-1 text-xs">
                                    {["No template", "Standard Software Project", "Marketing Campaign"].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTemplate(t);
                                                setIsTemplateDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] text-[#1e293b] cursor-pointer"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 pb-2">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="text-xs font-semibold text-[#03a9f4] hover:underline cursor-pointer px-3 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!projectName.trim()}
                            className="px-6 py-2 bg-[#03a9f4] hover:bg-[#0288d1] disabled:bg-[#b3e5fc] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition cursor-pointer"
                        >
                            CREATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
