import React, { useState } from "react";
import { X, UserPlus, Check, ArrowRight } from "lucide-react";

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { email: string; name: string; initials: string }) => void;
}

const DEFAULT_GOOGLE_ACCOUNTS = [
  {
    name: "Bindhu shree",
    email: "sbindhu230@gmail.com",
    initials: "BS",
    avatarBg: "bg-[#00897b]",
  },
  {
    name: "Bindhu shree K. R",
    email: "bindhushreebindhushree28@gmail.com",
    initials: "BS",
    avatarBg: "bg-[#1a73e8]",
  },
  {
    name: "Clockify Admin",
    email: "admin@clockify.me",
    initials: "CA",
    avatarBg: "bg-[#0f9d58]",
  },
];

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
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

  const handleChoose = (acc: (typeof DEFAULT_GOOGLE_ACCOUNTS)[0]) => {
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
    const email = customEmail.trim() || "user@gmail.com";
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
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-[#dadce0] overflow-hidden text-[#202124]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#f1f3f4]">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-semibold text-[#5f6368] font-sans">
              Sign in with Google
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-medium text-[#202124] tracking-tight">Choose an account</h3>
          <p className="text-xs text-[#5f6368] mt-1 mb-5">
            to continue to <strong className="text-[#202124]">Clockify Desktop</strong>
          </p>

          {!isCustomMode ? (
            <div className="space-y-2">
              {DEFAULT_GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleChoose(acc)}
                  disabled={signingInAs !== null}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedEmail === acc.email
                      ? "border-[#1a73e8] bg-[#e8f0fe]"
                      : "border-slate-200 hover:bg-[#f8f9fa] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                    >
                      {acc.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#202124]">{acc.name}</p>
                      <p className="text-xs text-[#5f6368]">{acc.email}</p>
                    </div>
                  </div>

                  {signingInAs === acc.name ? (
                    <div className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin mr-1" />
                  ) : selectedEmail === acc.email ? (
                    <Check className="w-4 h-4 text-[#1a73e8]" />
                  ) : null}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-[#f8f9fa] text-left flex items-center gap-3 transition cursor-pointer text-xs font-semibold text-[#1a73e8]"
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-500">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Use another account</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#5f6368] block mb-1">Your Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Bindhu shree"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#dadce0] text-sm outline-none focus:border-[#1a73e8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5f6368] block mb-1">Google Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. bindhu@gmail.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#dadce0] text-sm outline-none focus:border-[#1a73e8]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="flex-1 py-2 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1"
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
