import React, { useState, useEffect } from "react";
import { X, DollarSign } from "lucide-react";
import { useRateStore } from "@/stores/useRateStore";

export const EditRateModal: React.FC = () => {
  const { editingTarget, closeEditRateModal, updateRate } = useRateStore();

  const [rateInput, setRateInput] = useState<string>("");
  const [applyToExisting, setApplyToExisting] = useState<boolean>(false);

  useEffect(() => {
    if (editingTarget) {
      setRateInput(
        editingTarget.currentRate !== null && editingTarget.currentRate !== undefined
          ? editingTarget.currentRate.toString()
          : ""
      );
      setApplyToExisting(false);
    }
  }, [editingTarget]);

  if (!editingTarget) return null;

  const isBillable = editingTarget.type === "billable";
  const title = isBillable ? "Change billable rate" : "Change cost rate";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = rateInput.trim() === "" ? null : parseFloat(rateInput);
    updateRate(editingTarget.memberId, editingTarget.type, parsed, applyToExisting);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] overflow-hidden border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#1e293b]">{title}</h2>
          <button
            type="button"
            onClick={closeEditRateModal}
            className="text-[#94a3b8] hover:text-[#1e293b] p-1 rounded-lg transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-[#334155]">
          {/* Member Info */}
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[#64748b] text-[11px] block font-medium">Team member</span>
            <span className="font-bold text-sm text-[#0f172a] block mt-0.5">
              {editingTarget.memberName}
            </span>
          </div>

          {/* Rate Input */}
          <div>
            <label className="block text-xs font-semibold text-[#1e293b] mb-1.5">
              New {isBillable ? "billable" : "cost"} rate (USD/h)
            </label>
            <div className="relative flex items-center">
              <DollarSign className="w-4 h-4 text-[#94a3b8] absolute left-3 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                autoFocus
                className="w-full h-10 pl-9 pr-16 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#1e293b] focus:outline-none focus:border-[#00b0ff] font-medium"
              />
              <span className="absolute right-3 text-[11px] font-bold text-[#94a3b8]">
                USD / h
              </span>
            </div>
            <p className="text-[10px] text-[#94a3b8] mt-1">
              Leave blank to reset to default workspace rate.
            </p>
          </div>

          {/* Apply to Existing Checkbox */}
          <div className="pt-2 border-t border-[#f1f5f9]">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyToExisting}
                onChange={(e) => setApplyToExisting(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#00b0ff] focus:ring-0 mt-0.5"
              />
              <span className="text-[#475569] text-xs leading-tight">
                Apply to previous un-invoiced time entries as well
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeEditRateModal}
              className="px-3.5 py-2 text-xs font-semibold text-[#64748b] hover:text-[#0f172a] cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00b0ff] hover:bg-[#009ee6] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition cursor-pointer shadow-sm shadow-[#00b0ff]/20"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
