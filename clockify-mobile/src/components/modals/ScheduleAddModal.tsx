import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Flag, Hash } from "lucide-react";
import type { ScheduleAssignmentDTO, CreateScheduleAssignmentPayload } from "../../backend/types.ts";

interface ScheduleAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateScheduleAssignmentPayload, editId?: string) => void;
  assignmentToEdit?: ScheduleAssignmentDTO | null;
}

const AVAILABLE_PROJECTS = [
  { id: "proj-alpha", name: "[SAMPLE] Project Alpha", color: "#F59E0B", client: "[SAMPLE] Client B" },
  { id: "proj-beta", name: "[SAMPLE] Project Beta", color: "#EF4444", client: "[SAMPLE] Client A" },
  { id: "proj-gamma", name: "[SAMPLE] Project Gamma", color: "#78716C", client: "[SAMPLE] Client A" },
  { id: "proj-internal", name: "[SAMPLE] Internal Project", color: "#03A9F4", client: "Internal" },
];

const AVAILABLE_MEMBERS = [
  { id: "tm-bindhu", name: "Bindhu Shree", initials: "BS", color: "#00897B", role: "Frontend Dev" },
  { id: "tm-likith", name: "Likith D T", initials: "LD", color: "#0288D1", role: "Fullstack Dev" },
  { id: "tm-james", name: "James Anderson", initials: "JA", color: "#64748B", role: "DevOps Eng" },
  { id: "tm-lara", name: "Lara Peterson", initials: "LP", color: "#4CAF50", role: "QA Engineer" },
  { id: "team-1", name: "Vishal Komi", initials: "VK", color: "#8B5CF6", role: "Product Owner" },
];

export const ScheduleAddModal: React.FC<ScheduleAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assignmentToEdit,
}) => {
  const [projectId, setProjectId] = useState("proj-alpha");
  const [memberId, setMemberId] = useState("tm-bindhu");
  const [startDate, setStartDate] = useState("2026-08-31");
  const [endDate, setEndDate] = useState("2026-09-04");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [note, setNote] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const [isHatched, setIsHatched] = useState(false);
  const [isMilestoneActive, setIsMilestoneActive] = useState(false);

  useEffect(() => {
    if (assignmentToEdit) {
      setProjectId(assignmentToEdit.project_id || "proj-alpha");
      setMemberId(assignmentToEdit.member_id || "tm-bindhu");
      setStartDate(assignmentToEdit.start_date || "2026-08-31");
      setEndDate(assignmentToEdit.end_date || "2026-09-04");
      setHoursPerDay(String(assignmentToEdit.hours_per_day || 8));
      setNote(assignmentToEdit.note || "");
      setVersionLabel(assignmentToEdit.version_label || "");
      setIsHatched(!!assignmentToEdit.is_hatched);
      setIsMilestoneActive(!!assignmentToEdit.is_milestone_active);
    } else {
      setProjectId("proj-alpha");
      setMemberId("tm-bindhu");
      setStartDate("2026-08-31");
      setEndDate("2026-09-04");
      setHoursPerDay("8");
      setNote("");
      setVersionLabel("");
      setIsHatched(false);
      setIsMilestoneActive(false);
    }
  }, [assignmentToEdit, isOpen]);

  if (!isOpen) return null;

  const currentProject = AVAILABLE_PROJECTS.find((p) => p.id === projectId) || AVAILABLE_PROJECTS[0];
  const currentMember = AVAILABLE_MEMBERS.find((m) => m.id === memberId) || AVAILABLE_MEMBERS[0];

  // Calculate duration in days and total hours
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const hPerDay = Math.max(0.5, parseFloat(hoursPerDay) || 8);
  const totalHours = Math.round(diffDays * hPerDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateScheduleAssignmentPayload = {
      project_id: currentProject.id,
      project_name: currentProject.name,
      project_color: currentProject.color,
      client: currentProject.client,
      member_id: currentMember.id,
      member_name: currentMember.name,
      member_initials: currentMember.initials,
      member_avatar_color: currentMember.color,
      start_date: startDate,
      end_date: endDate,
      hours_per_day: hPerDay,
      total_hours: totalHours,
      note: note.trim() || undefined,
      version_label: versionLabel.trim() || undefined,
      is_hatched: isHatched,
      is_milestone_active: isMilestoneActive,
    };

    onSave(payload, assignmentToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-[#181e25] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-[#262e37] animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262e37] bg-[#14181f]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00b0ff]" />
            <h2 className="text-base font-semibold text-white">
              {assignmentToEdit ? "Edit Shift Assignment" : "Add Shift Assignment"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8c9ba5] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs text-white">
          {/* Project Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
              Project
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AVAILABLE_PROJECTS.map((proj) => (
                <button
                  type="button"
                  key={proj.id}
                  onClick={() => setProjectId(proj.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    projectId === proj.id
                      ? "bg-[#28343f] border-[#00b0ff] text-white"
                      : "bg-[#1f262e] border-[#2b3540] text-[#c2cbd4] hover:border-[#404e5d]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color }}
                    />
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">{proj.name}</div>
                      <div className="text-[10px] text-[#8c9ba5] truncate">{proj.client}</div>
                    </div>
                  </div>
                  {projectId === proj.id && (
                    <span className="text-xs text-[#00b0ff] font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Member Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
              Assignee
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_MEMBERS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMemberId(m.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                    memberId === m.id
                      ? "bg-[#28343f] border-[#00b0ff] text-white"
                      : "bg-[#1f262e] border-[#2b3540] text-[#c2cbd4] hover:border-[#404e5d]"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span className="text-[11px] font-medium truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#1f262e] border border-[#2b3540] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#1f262e] border border-[#2b3540] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                required
              />
            </div>
          </div>

          {/* Hours / Day & Total Calculated Preview */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
                Hours / Day
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-[#8c9ba5] absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full bg-[#1f262e] border border-[#2b3540] rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#00b0ff]"
                  required
                />
              </div>
            </div>
            <div className="bg-[#1f262e] border border-[#2b3540] rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[10px] text-[#8c9ba5]">Total Scheduled</span>
              <span className="text-sm font-bold text-[#00b0ff]">
                {totalHours}h <span className="text-[11px] font-normal text-[#8c9ba5]">({diffDays} days)</span>
              </span>
            </div>
          </div>

          {/* Version Label & Milestone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Hash className="w-3 h-3 text-[#8c9ba5]" /> Version Label
              </label>
              <input
                type="text"
                placeholder="e.g. V1, Beta"
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                className="w-full bg-[#1f262e] border border-[#2b3540] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#00b0ff]"
              />
            </div>
            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#c2cbd4]">
                <input
                  type="checkbox"
                  checked={isMilestoneActive}
                  onChange={(e) => setIsMilestoneActive(e.target.checked)}
                  className="rounded border-[#2b3540] text-[#00b0ff] focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Flag className="w-3 h-3 text-amber-400" /> Milestone
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#c2cbd4]">
                <input
                  type="checkbox"
                  checked={isHatched}
                  onChange={(e) => setIsHatched(e.target.checked)}
                  className="rounded border-[#2b3540] text-[#00b0ff] focus:ring-0 cursor-pointer"
                />
                <span>Hatched Stripes</span>
              </label>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8c9ba5] uppercase tracking-wider mb-1.5">
              Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Frontend Architecture & UI Setup"
              className="w-full bg-[#1f262e] border border-[#2b3540] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#00b0ff] resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262e37]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8c9ba5] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00b0ff] hover:bg-[#0091ea] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              {assignmentToEdit ? "Save Changes" : "Create Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
