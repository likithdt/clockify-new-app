import React, { useState } from "react";
import {
  ArrowLeft,
  FileEdit,
  Mail,
  SlidersHorizontal,
  CircleDollarSign,
  FileText,
  ChevronRight,
  Check,
} from "lucide-react";
import { ClientItem } from "@/stores/useProjectStore";

interface EditClientViewProps {
  client: ClientItem;
  onBack: () => void;
  onSave: (updates: Partial<ClientItem>) => void;
}

export const EditClientView: React.FC<EditClientViewProps> = ({
  client,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email || "");
  const [address, setAddress] = useState(client.address || "");
  const [currency, setCurrency] = useState(client.currency || "USD");
  const [note, setNote] = useState(client.note || "");

  const handleSave = () => {
    onSave({
      name: name.trim() || client.name,
      email: email.trim(),
      address: address.trim(),
      currency,
      note: note.trim(),
    });
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative select-none animate-fadeIn">
      {/* Top App Bar matching Screenshot 10 */}
      <header className="h-14 px-4 bg-white flex items-center shrink-0 border-b border-[#f3f4f6] z-20">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#111827] hover:text-[#4b5563] active:scale-95 transition-transform"
          title="Back to Clients"
        >
          <ArrowLeft className="w-6 h-6 text-[#111827]" />
        </button>
        <h1 className="text-[20px] font-semibold text-[#111827] ml-4 tracking-tight">
          Edit client
        </h1>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f3f4f6]">
        {/* Client Name */}
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
            <FileEdit className="w-5 h-5 text-[#4b5563]" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-[15px] font-medium text-[#111827] outline-none bg-transparent"
            placeholder="Client name"
          />
        </div>

        {/* Email */}
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
            <Mail className="w-5 h-5 text-[#4b5563]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="flex-1 text-[15px] text-[#111827] placeholder-[#4b5563] outline-none bg-transparent"
          />
        </div>

        {/* Address */}
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
            <SlidersHorizontal className="w-5 h-5 text-[#4b5563]" />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="flex-1 text-[15px] text-[#111827] placeholder-[#4b5563] outline-none bg-transparent"
          />
        </div>

        {/* Currency (USD) */}
        <div
          onClick={() => {
            const nextCurr = currency === "USD" ? "EUR" : "USD";
            setCurrency(nextCurr);
          }}
          className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#4b5563]">
              <CircleDollarSign className="w-5 h-5 text-[#4b5563]" />
            </div>
            <span className="text-[15px] font-medium text-[#111827]">
              {currency}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
        </div>

        {/* Note */}
        <div className="px-5 py-4 flex items-start gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-[#4b5563] mt-0.5">
            <FileText className="w-5 h-5 text-[#4b5563]" />
          </div>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="flex-1 text-[15px] text-[#111827] placeholder-[#4b5563] outline-none bg-transparent resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Floating Action Button (✓ Save) */}
      <div className="absolute right-5 bottom-6 z-30">
        <button
          type="button"
          onClick={handleSave}
          className="h-12 px-6 rounded-2xl bg-[#50c3f8] hover:bg-[#03a9f4] active:scale-95 text-white font-semibold text-[15px] flex items-center gap-2 shadow-[0_4px_16px_rgba(3,169,244,0.4)] transition-all"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};
