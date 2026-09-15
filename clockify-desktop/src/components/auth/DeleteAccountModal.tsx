import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const DeleteAccountModal: React.FC = () => {
  const { user, isDeleteModalOpen, closeDeleteModal, deleteAccount } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmUnderstood, setConfirmUnderstood] = useState(false);

  if (!isDeleteModalOpen) return null;

  const userName = user?.name || "Bindhu shree";
  const userEmail = user?.email || "sbindhu230@gmail.com";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          closeDeleteModal();
        }
      }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1e293b]">Delete Account</h3>
              <p className="text-xs text-[#64748b]">Permanent removal of account data</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="p-1 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-3 space-y-3">
          <p className="text-xs text-[#475569] leading-relaxed">
            Are you sure you want to permanently delete your Clockify account for{" "}
            <strong className="text-[#0f172a] font-semibold">{userName}</strong> (
            <span className="text-[#03a9f4] font-medium">{userEmail}</span>)?
          </p>

          <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 text-xs text-red-700 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-red-800">
              <span>Warning: This action cannot be reversed</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-red-600/90 space-y-0.5">
              <li>All recorded time entries and sheets will be wiped</li>
              <li>Workspace memberships and ownership will be revoked</li>
              <li>Connected API tokens and sessions will be invalidated</li>
            </ul>
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmUnderstood}
              onChange={(e) => setConfirmUnderstood(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-[11px] text-[#64748b] leading-tight">
              I understand that deleting my account is irreversible and all my data will be permanently lost.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2.5 border-t border-[#f1f5f9] bg-[#f8fafc]/50">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-[#475569] text-xs font-semibold hover:bg-white transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!confirmUnderstood || isDeleting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting account...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
