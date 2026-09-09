import React, { useState } from "react";
import { X, Clock, Folder, DollarSign } from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";

export const QuickTimeEntryModal: React.FC = () => {
  const { isQuickLogModalOpen, closeQuickLogModal, addTimeEntry, sampleActivities } = useDashboardStore();

  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("Mobile App 2.0");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");
  const [isBillable, setIsBillable] = useState(true);

  if (!isQuickLogModalOpen) return null;

  const projectList = [
    { name: "Mobile App 2.0", color: "#03A9F4", client: "Internal" },
    { name: "Backend Microservices", color: "#10B981", client: "Acme Corp" },
    { name: "Design System", color: "#F59E0B", client: "Starlight Inc" },
    { name: "Kiosk Management", color: "#8B5CF6", client: "Retail Group" },
    { name: "Timesheet Core", color: "#EC4899", client: "Internal" },
    { name: "Finance & Expenses", color: "#06B6D4", client: "Acme Corp" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const totalSecs = h * 3600 + m * 60;

    if (totalSecs <= 0) {
      alert("Please enter a valid time duration.");
      return;
    }

    const proj = projectList.find((p) => p.name === selectedProject) || {
      name: selectedProject,
      color: "#03A9F4",
      client: "Internal",
    };

    addTimeEntry({
      description: description.trim() || "Work task",
      projectName: proj.name,
      projectColor: proj.color,
      clientName: proj.client,
      seconds: totalSecs,
      isBillable,
      user: "SH",
    });

    closeQuickLogModal();
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
        onClick={closeQuickLogModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 animate-scaleUp">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#03A9F4] text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              Quick Log Time
            </h3>
          </div>
          <button
            type="button"
            onClick={closeQuickLogModal}
            className="p-1 text-[#64748B] hover:text-[#1E293B] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              What are you working on?
            </label>
            <input
              type="text"
              placeholder="Task description (e.g. Wireframes review)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#03A9F4] text-[#1E293B]"
            />
          </div>

          {/* Project selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#03A9F4] text-[#1E293B] bg-white cursor-pointer"
            >
              {projectList.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.client})
                </option>
              ))}
            </select>
          </div>

          {/* Duration: Hours & Minutes */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 border border-[#CBD5E1] rounded-lg px-2.5 py-1.5">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full text-xs font-mono font-bold text-[#1E293B] focus:outline-none"
                />
                <span className="text-[11px] text-[#94A3B8] font-medium">hours</span>
              </div>
              <div className="flex items-center gap-1.5 border border-[#CBD5E1] rounded-lg px-2.5 py-1.5">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full text-xs font-mono font-bold text-[#1E293B] focus:outline-none"
                />
                <span className="text-[11px] text-[#94A3B8] font-medium">min</span>
              </div>
            </div>
          </div>

          {/* Billable toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-sky-50 text-[#03A9F4] flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#334155]">
                Billable entry
              </span>
            </div>
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className="w-4 h-4 accent-[#03A9F4] cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={closeQuickLogModal}
              className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B] font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
