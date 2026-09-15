import React, { useState } from "react";
import { X, UserPlus, Check, ArrowRight } from "lucide-react";

interface MicrosoftOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { email: string; name: string; initials: string }) => void;
}

const DEFAULT_MS_ACCOUNTS = [
  {
    name: "Bindhu shree",
    email: "sbindhu230@outlook.com",
    initials: "BS",
  },
  {
    name: "Bindhu shree K. R",
    email: "bindhushree.kr@outlook.com",
    initials: "BS",
  },
];

export const MicrosoftOAuthModal: React.FC<MicrosoftOAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [signingInAs, setSigningInAs] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = (acc: (typeof DEFAULT_MS_ACCOUNTS)[0]) => {
    setSelectedEmail(acc.email);
    setSigningInAs(acc.name);
    setTimeout(() => {
      onSelectAccount({ name: acc.name, email: acc.email, initials: acc.initials });
      setSigningInAs(null);
      setSelectedEmail(null);
      onClose();
    }, 700);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = customEmail.trim() || "user@outlook.com";
    const name = customName.trim() || email.split("@")[0];
    const initials = name.slice(0, 2).toUpperCase();

    setSigningInAs(name);
    setTimeout(() => {
      onSelectAccount({ name, email, initials });
      setSigningInAs(null);
      setIsCustomMode(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-[#edebe9] overflow-hidden text-[#323130]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#edebe9]">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span className="text-sm font-semibold text-[#605e5c] font-sans">
              Microsoft 365
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#605e5c] hover:bg-[#edebe9] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-[#323130] tracking-tight">Pick an account</h3>
          <p className="text-xs text-[#605e5c] mt-1 mb-5">to sign in to Clockify Desktop</p>

          {!isCustomMode ? (
            <div className="space-y-2">
              {DEFAULT_MS_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleChoose(acc)}
                  disabled={signingInAs !== null}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedEmail === acc.email
                      ? "border-[#0078d4] bg-[#eff6fc]"
                      : "border-slate-200 hover:bg-[#f3f2f1] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0078d4] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {acc.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#323130]">{acc.name}</p>
                      <p className="text-xs text-[#605e5c]">{acc.email}</p>
                    </div>
                  </div>

                  {signingInAs === acc.name ? (
                    <div className="w-4 h-4 border-2 border-[#0078d4] border-t-transparent rounded-full animate-spin mr-1" />
                  ) : selectedEmail === acc.email ? (
                    <Check className="w-4 h-4 text-[#0078d4]" />
                  ) : null}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-[#f3f2f1] text-left flex items-center gap-3 transition cursor-pointer text-xs font-semibold text-[#0078d4]"
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-500">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Use another Microsoft account</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#605e5c] block mb-1">Your Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Bindhu shree"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#edebe9] text-sm outline-none focus:border-[#0078d4]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#605e5c] block mb-1">Outlook / Work Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. bindhu@outlook.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#edebe9] text-sm outline-none focus:border-[#0078d4]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="flex-1 py-2 text-xs font-medium text-[#605e5c] hover:bg-[#f3f2f1] rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
