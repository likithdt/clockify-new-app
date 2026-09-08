import React, { useState } from "react";
import { X } from "lucide-react";
import type { Client } from "../../backend/types";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, color: string, clientName?: string) => void;
  clients: Client[];
}

const COLORS = [
  "#03a9f4", "#4caf50", "#ff9800", "#e91e63", "#9c27b0",
  "#f44336", "#673ab7", "#3f51b5", "#009688", "#795548",
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  clients,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [selectedClient, setSelectedClient] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name.trim(), color, selectedClient || undefined);
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Create Project</h2>
          <button type="button" onClick={onClose} className="text-[#8c9ba5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c ? "scale-110 border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Client (Optional)</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            >
              <option value="">No Client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-[#242b35] text-[#8c9ba5] text-xs font-semibold hover:bg-[#2b3340]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
