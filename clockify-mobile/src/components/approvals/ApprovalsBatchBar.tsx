import React from "react";
import { Check, X, CheckCheck } from "lucide-react";
import { useApprovalStore } from "@/stores/useApprovalStore";

interface ApprovalsBatchBarProps {
  onOpenRejectModal: (id: string, name: string) => void;
}

export const ApprovalsBatchBar: React.FC<ApprovalsBatchBarProps> = ({
  onOpenRejectModal,
}) => {
  const {
    selectedIds,
    clearSelection,
    approveSelected,
  } = useApprovalStore();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-[400px] mx-auto animate-slideUp">
      <div className="bg-[#1E293B] text-white p-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-2">
        {/* Left: Selected count & Clear */}
        <div className="flex items-center gap-2 pl-2">
          <span className="w-5 h-5 rounded-full bg-[#03A9F4] text-white text-[11px] font-extrabold flex items-center justify-center">
            {selectedIds.length}
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Selected
          </span>
          <button
            type="button"
            onClick={clearSelection}
            className="text-[11px] text-slate-400 hover:text-white underline ml-1 cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenRejectModal(selectedIds[0], `${selectedIds.length} items`)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-slate-600 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          <button
            type="button"
            onClick={approveSelected}
            className="px-3.5 py-1.5 bg-[#03A9F4] hover:bg-[#0288D1] text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-md shadow-[#03A9F4]/30"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Approve ({selectedIds.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
