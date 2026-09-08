import React, { useState } from "react";
import type { Project } from "../../backend/types.ts";
import { Check, FolderX, Search, X } from "lucide-react";

interface DefaultProjectModalProps {
  isOpen: boolean;
  projects: Project[];
  currentProjectId: string | null;
  onSelect: (projectId: string | null) => void;
  onClose: () => void;
}

export const DefaultProjectModal: React.FC<DefaultProjectModalProps> = ({
  isOpen,
  projects,
  currentProjectId,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  const isNoneSelected = !currentProjectId || currentProjectId === "none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-sm bg-[#1a1f26] border border-[#2b3340] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b3340]">
          <div>
            <h3 className="text-base font-semibold text-white">Default project</h3>
            <p className="text-xs text-[#8c9ba8] mt-0.5">
              Auto-applied when starting or creating new entries
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b98a5] hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-[#2b3340]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8b98a5] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#121517] border border-[#2b3340] text-sm text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-[#03a9f4] transition-colors"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#262e3a]">
          {/* None Option */}
          <button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#232a34] rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border border-dashed border-[#8c9ba8] flex items-center justify-center">
                <FolderX className="w-2.5 h-2.5 text-[#8c9ba8]" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">None</span>
                <p className="text-xs text-[#8c9ba8]">No default project</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                isNoneSelected
                  ? "border-[#03a9f4] bg-[#03a9f4]"
                  : "border-[#4a5568] bg-transparent"
              }`}
            >
              {isNoneSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </div>
          </button>

          {filteredProjects.map((proj) => {
            const isSelected = currentProjectId === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelect(proj.id);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#232a34] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: proj.color || "#03a9f4" }}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{proj.name}</div>
                    {proj.clientName && (
                      <div className="text-xs text-[#8c9ba8]">{proj.clientName}</div>
                    )}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? "border-[#03a9f4] bg-[#03a9f4]"
                      : "border-[#4a5568] bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-[#161a20] border-t border-[#262e3a] flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#03a9f4] hover:text-[#38bdf8] px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
