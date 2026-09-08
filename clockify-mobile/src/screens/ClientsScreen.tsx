import React from "react";
import { Plus, Users, Trash2, Archive } from "lucide-react";
import type { Client } from "../backend/types";

export interface ClientsScreenProps {
  clients: Client[];
  searchQuery: string;
  onOpenClientModal: () => void;
  onArchiveClient: (id: string) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsScreen: React.FC<ClientsScreenProps> = ({
  clients,
  searchQuery,
  onOpenClientModal,
  onArchiveClient,
  onDeleteClient,
}) => {
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f1216] text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Clients</h2>
        <button
          type="button"
          onClick={onOpenClientModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#8c9ba5] space-y-2">
            <Users className="w-10 h-10 mx-auto text-[#4a5568]" />
            <p className="text-sm">No clients found</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-3.5 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                <p className="text-xs text-[#8c9ba5]">{c.currency} {c.address ? `• ${c.address}` : ""}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onArchiveClient(c.id)}
                  className={`p-2 hover:text-white ${c.isArchived ? "text-amber-400" : "text-[#8c9ba5]"}`}
                  title="Archive"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteClient(c.id)}
                  className="p-2 text-[#8c9ba5] hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
