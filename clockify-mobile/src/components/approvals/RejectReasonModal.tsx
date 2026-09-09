import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useApprovalStore } from "@/stores/useApprovalStore";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string | null;
  targetName: string | null;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetName,
}) => {
  const { rejectSelected, timesheetItems, expenseItems, setToastMessage } = useApprovalStore();
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetId) {
      // Reject specific item
      const store = useApprovalStore.getState();
      const updatedTs = timesheetItems.map((ts) =>
        ts.id === targetId ? { ...ts, status: "rejected" as const } : ts
      );
      const updatedExp = expenseItems.map((exp) =>
        exp.id === targetId ? { ...exp, status: "rejected" as const } : exp
      );
      useApprovalStore.setState({
        timesheetItems: updatedTs,
        expenseItems: updatedExp,
        toastMessage: `Rejected ${targetName || "item"}${reason ? `: "${reason}"` : ""}`,
      });
    } else {
      rejectSelected();
    }

    onClose();
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 animate-scaleUp">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#FFF1F2] border-b border-[#FFE4E6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E11D48] text-white flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#9F1239]">
              Reject Approval
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9F1239]/70 hover:text-[#9F1239] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleConfirm} className="p-4 space-y-3.5">
          <p className="text-xs text-[#334155] leading-relaxed">
            Are you sure you want to reject this submission for{" "}
            <strong className="text-[#0F172A]">{targetName || "the selected item(s)"}</strong>?
          </p>

          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
              Rejection Reason (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please clarify hours logged on Wednesday..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#E11D48] text-[#1E293B]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B] font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
