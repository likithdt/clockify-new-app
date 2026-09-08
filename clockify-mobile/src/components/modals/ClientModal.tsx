import React, { useState } from "react";
import { X } from "lucide-react";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClient: (name: string, currency: string, address?: string) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onCreateClient,
}) => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateClient(name.trim(), currency, address.trim() || undefined);
    setName("");
    setAddress("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Add Client</h2>
          <button type="button" onClick={onClose} className="text-[#8c9ba5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Client Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#8c9ba5] block mb-1">Address (Optional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. New York, USA"
              className="w-full bg-[#12161c] border border-[#27303c] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00b0ff]"
            />
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
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
