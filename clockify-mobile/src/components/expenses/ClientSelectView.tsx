import React, { useState } from "react";
import { ArrowLeft, Search, Plus, MoreVertical, Pencil, X } from "lucide-react";
import { useProjectStore, ClientItem } from "@/stores/useProjectStore";

interface ClientSelectViewProps {
  onBack: () => void;
  selectedClientName?: string | null;
  onSelectClient: (clientName: string) => void;
  onEditClient: (client: ClientItem) => void;
}

export const ClientSelectView: React.FC<ClientSelectViewProps> = ({
  onBack,
  selectedClientName,
  onSelectClient,
  onEditClient,
}) => {
  const { clients, addClient } = useProjectStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuClient, setActiveMenuClient] = useState<ClientItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const created: ClientItem = {
      id: `client-${Date.now()}`,
      name: newClientName.trim(),
      currency: "USD",
    };
    addClient(created);
    onSelectClient(created.name);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 8 */}
      <header className="h-14 px-4 bg-white flex items-center justify-between shrink-0 border-b border-[#f3f4f6] z-20">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-2 bg-[#f3f4f6] rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-1 text-[#6b7280] hover:text-[#111827]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
                title="Back to Project Settings"
              >
                <ArrowLeft className="w-6 h-6 text-[#111827]" />
              </button>
              <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">
                Clients
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#374151] hover:text-[#111827] active:scale-95 transition-transform"
              title="Search Clients"
            >
              <Search className="w-5 h-5 text-[#374151]" />
            </button>
          </>
        )}
      </header>

      {/* Clients List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client.name)}
            className={`flex items-center justify-between py-3.5 px-2 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${
              selectedClientName === client.name ? "bg-sky-50" : ""
            }`}
          >
            <div>
              <div className="text-[15px] font-medium text-[#111827]">
                {client.name}
              </div>
              <div className="text-[12px] text-[#6b7280] mt-0.5">
                {client.currency || "USD"}
              </div>
            </div>

            {/* 3-dots Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuClient(client);
              }}
              className="p-1.5 text-[#9ca3af] hover:text-[#4b5563] rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No clients found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Floating Action Button (+ New) matching Screenshot 8 */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 px-6 rounded-2xl bg-[#00aaff] hover:bg-[#0288d1] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(0,170,255,0.4)] transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* Client Options Bottom Sheet - matching Screenshot 9 (11.47.57 AM.jpeg) */}
      {activeMenuClient && (
        <div className="absolute inset-0 z-50 flex items-end select-none animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"
            onClick={() => setActiveMenuClient(null)}
          />
          <div className="relative w-full bg-white rounded-t-[32px] shadow-2xl pb-8 pt-3 px-6 z-10 animate-slideUp">
            <div className="w-12 h-1 bg-[#cfd8dc] rounded-full mx-auto mb-6" />
            <button
              type="button"
              onClick={() => {
                const c = activeMenuClient;
                setActiveMenuClient(null);
                onEditClient(c);
              }}
              className="w-full flex items-center gap-5 py-3.5 px-2 rounded-xl text-[#1f2937] hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center text-[#212121]">
                <Pencil className="w-5 h-5 text-[#212121]" />
              </div>
              <span className="text-[15px] font-medium text-[#111827]">Edit</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Client Dialog */}
      {isCreateModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <form
            onSubmit={handleCreateClient}
            className="relative w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-lg font-bold text-[#111827]">New Client</h3>
            <div>
              <label className="text-xs text-gray-500 font-medium">Client Name *</label>
              <input
                type="text"
                required
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#00aaff]"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#00aaff] rounded-xl hover:bg-[#0288d1]"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
