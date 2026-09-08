import React, { useState } from "react";
import {
  ArrowLeft,
  FileEdit,
  User,
  CircleDollarSign,
  Globe,
  Palette,
  Check,
} from "lucide-react";

const COLOR_PALETTE = [
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#5c6bc0", // Indigo
  "#1e88e5", // Blue
  "#00aaff", // Cyan
  "#00897b", // Teal
  "#689f38", // Green
  "#ff5722", // Deep Orange
  "#795548", // Brown
];

interface CreateProjectViewProps {
  onBack: () => void;
  onOpenClientSelect: () => void;
  selectedClient: string | null;
  onSave: (project: {
    name: string;
    color: string;
    client: string | null;
    isBillable: boolean;
    isPublic: boolean;
  }) => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onBack,
  onOpenClientSelect,
  selectedClient,
  onSave,
}) => {
  const [projectName, setProjectName] = useState("");
  const [isBillable, setIsBillable] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[3]); // Default Blue

  const handleSave = () => {
    if (!projectName.trim()) return;
    onSave({
      name: projectName.trim(),
      color: selectedColor,
      client: selectedClient,
      isBillable,
      isPublic,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar */}
      <header className="h-14 px-4 bg-white flex items-center shrink-0 border-b border-[#f3f4f6] z-20">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
          title="Back to Projects"
        >
          <ArrowLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#111827] ml-4 tracking-tight">
          New Project
        </h1>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f3f4f6]">
        {/* 1. Project Name */}
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-[#9ca3af]" />
          </div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex-1 text-[15px] font-medium text-[#111827] outline-none bg-transparent placeholder-[#9ca3af]"
            placeholder="Project name"
            autoFocus
          />
        </div>

        {/* 2. Client Row */}
        <div
          onClick={onOpenClientSelect}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <User className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#111827]">Client</div>
              <div className="text-[13px] text-[#9ca3af] mt-0.5">
                {selectedClient || "None"}
              </div>
            </div>
          </div>
          <span className="text-[#9ca3af] text-lg leading-none">›</span>
        </div>

        {/* 3. Billable Row */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <span className="text-[14px] font-medium text-[#111827]">Billable</span>
          </div>
          <button
            type="button"
            onClick={() => setIsBillable(!isBillable)}
            className={`w-12 h-7 rounded-full transition-colors relative p-0.5 focus:outline-none ${
              isBillable ? "bg-[#00aaff]" : "bg-[#9ca3af]"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                isBillable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 4. Public Row */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <span className="text-[14px] font-medium text-[#111827]">Public</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-7 rounded-full transition-colors relative p-0.5 focus:outline-none ${
              isPublic ? "bg-[#00aaff]" : "bg-[#9ca3af]"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 5. Project Color */}
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <span className="text-[14px] font-medium text-[#111827]">
              Project color
            </span>
          </div>

          <div className="pl-10 space-y-3.5">
            {/* Row 1: Pink, Purple, Indigo, Blue, Cyan */}
            <div className="flex items-center gap-4">
              {COLOR_PALETTE.slice(0, 5).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor.toLowerCase() === color.toLowerCase() && (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>

            {/* Row 2: Teal, Green, Deep Orange, Brown */}
            <div className="flex items-center gap-4 pl-4">
              {COLOR_PALETTE.slice(5).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor.toLowerCase() === color.toLowerCase() && (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save FAB */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={handleSave}
          disabled={!projectName.trim()}
          className={`h-12 px-6 rounded-2xl text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(3,169,244,0.4)] transition-all ${
            projectName.trim()
              ? "bg-[#50c3f8] hover:bg-[#03a9f4] active:scale-95"
              : "bg-[#b0dff7] cursor-not-allowed"
          }`}
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};
