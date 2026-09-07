import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, FileText, Folder, Tag as TagIcon, DollarSign } from "lucide-react";
import type { TimeEntry, Project, Tag } from "../../backend/types";

interface EditEntryDetailsModalProps {
  isOpen: boolean;
  entry: TimeEntry | null;
  onClose: () => void;
  onSave: (entry: TimeEntry) => void;
  onDelete?: (id: string) => void;
  projects?: Project[];
  tags?: Tag[];
}

export const EditEntryDetailsModal: React.FC<EditEntryDetailsModalProps> = ({
  isOpen,
  entry,
  onClose,
  onSave,
  onDelete,
  projects = [],
  tags = [],
}) => {
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [isBillable, setIsBillable] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (entry) {
      setDescription(entry.description || "");
      setProjectId(entry.projectId || "");
      setIsBillable(entry.isBillable ?? true);
      setSelectedTags(entry.tags || []);
    }
  }, [entry, isOpen]);

  if (!isOpen || !entry) return null;

  // Format Date and Time: e.g. "Tue, Sep 08 12:34 - 13:30"
  const formatDateTimeRange = () => {
    try {
      const start = new Date(entry.startTime);
      const durationSec = entry.durationSeconds || 0;
      const end = new Date(start.getTime() + durationSec * 1000);

      const dayName = start.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = start.toLocaleDateString("en-US", { month: "short" });
      const dayNum = String(start.getDate()).padStart(2, "0");

      const startH = String(start.getHours()).padStart(2, "0");
      const startM = String(start.getMinutes()).padStart(2, "0");
      const endH = String(end.getHours()).padStart(2, "0");
      const endM = String(end.getMinutes()).padStart(2, "0");

      return `${dayName}, ${monthName} ${dayNum} ${startH}:${startM} - ${endH}:${endM}`;
    } catch {
      return "Mon, Sep 07 10:00 - 11:00";
    }
  };

  const handleSave = () => {
    const proj = projects.find((p) => p.id === projectId);
    const updated: TimeEntry = {
      ...entry,
      description: description.trim() || "No description",
      projectId: proj?.id,
      projectName: proj?.name || entry.projectName,
      projectColor: proj?.color || entry.projectColor,
      clientName: proj?.clientName || entry.clientName,
      isBillable,
      tags: selectedTags,
    };
    onSave(updated);
    onClose();
  };

  const selectedProject = projects.find((p) => p.id === projectId);

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center select-none animate-fadeIn font-sans">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal matching Screenshot 8 */}
      <div className="relative w-full bg-white rounded-t-[28px] pt-3 pb-8 px-5 shadow-2xl z-10 animate-slideInUp border-t border-gray-100 max-h-[85vh] overflow-y-auto">
        {/* Pull handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Header Row: Close (X), Title, Save */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="p-1 -ml-1 text-gray-700 hover:text-gray-900 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2.4]" />
            </button>
            <h2 className="text-[19px] font-normal text-gray-900">
              Edit entry details
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="text-[15px] font-semibold text-[#0288d1] hover:text-[#0277bd] transition-colors px-1"
          >
            Save
          </button>
        </div>

        {/* Body Fields matching Screenshot 8 */}
        <div className="space-y-4 pt-3">
          {/* Row 1: Calendar Date/Time Range */}
          <div className="flex items-center gap-4 py-2 border-b border-gray-100">
            <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="text-[15px] text-gray-800 font-normal">
              {formatDateTimeRange()}
            </span>
          </div>

          {/* Row 2: Description input */}
          <div className="flex items-center gap-4 py-2 border-b border-gray-100">
            <FileText className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Row 3: Project Selector */}
          {projects.length > 0 && (
            <div className="flex items-center gap-4 py-2 border-b border-gray-100">
              <Folder className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-[15px] text-gray-800">
                  {selectedProject ? selectedProject.name : "No project"}
                </span>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-1.5 outline-none cursor-pointer"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Row 4: Billable Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs font-semibold text-gray-500">
                $
              </span>
              <span className="text-[15px] text-gray-800">Billable</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBillable(!isBillable)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isBillable ? "bg-[#0288d1]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  isBillable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Row 5: Tags */}
          {tags.length > 0 && (
            <div className="py-2">
              <div className="flex items-center gap-4 mb-2">
                <TagIcon className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-[15px] text-gray-800">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-9">
                {tags.map((t) => {
                  const isSelected = selectedTags.includes(t.name);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter((tn) => tn !== t.name));
                        } else {
                          setSelectedTags([...selectedTags, t.name]);
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        isSelected
                          ? "bg-sky-50 border-sky-400 text-sky-700 font-semibold"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
