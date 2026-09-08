import React from "react";
import { Plus, Shield, User, Trash2 } from "lucide-react";
import type { TeamMember } from "../backend/types";

export interface TeamScreenProps {
  members: TeamMember[];
  searchQuery: string;
  onOpenTeamModal: () => void;
  onDeleteMember: (id: string) => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  members,
  searchQuery,
  onOpenTeamModal,
  onDeleteMember,
}) => {
  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      m.email.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Team Members</h2>
        <button
          type="button"
          onClick={onOpenTeamModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-2">
            <User className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No team members found</p>
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00b0ff]/20 text-[#00b0ff] flex items-center justify-center font-bold text-xs">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                  <p className="text-xs text-[#8c9ba5]">{m.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#242b36] text-[#8c9ba5]">
                  {m.role}
                </span>
                {m.role !== "Owner" && (
                  <button
                    type="button"
                    onClick={() => onDeleteMember(m.id)}
                    className="p-2 text-[#8c9ba5] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
