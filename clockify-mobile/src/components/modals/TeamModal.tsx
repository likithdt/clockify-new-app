import React, { useState } from "react";
import { X } from "lucide-react";
import type { TeamMember } from "../../backend/types";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (name: string, email: string, role: TeamMember["role"]) => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Regular");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAddMember(name.trim(), email.trim(), role);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Add Team Member</h2>
          <button type="button" onClick={onClose} className="text-[#8c9ba5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember["role"])}
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            >
              <option value="Regular">Regular</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
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
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
