import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const ForgotPasswordModal: React.FC = () => {
  const { isForgotPasswordModalOpen, closeForgotPasswordModal, requestPasswordReset } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isForgotPasswordModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await requestPasswordReset(email.trim());
    setLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-[#1e293b]">
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#1e293b]">Reset your password</h3>
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your Clockify account email address and we will send you a link to reset your password.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-[#03a9f4] focus:ring-2 focus:ring-[#03a9f4]/20 transition"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send reset link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Check your inbox</h4>
              <p className="text-xs text-slate-500 max-w-[280px]">
                A password reset email has been sent to <strong>{email}</strong>. Please follow the link in that email.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  closeForgotPasswordModal();
                }}
                className="mt-3 px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Back to Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
