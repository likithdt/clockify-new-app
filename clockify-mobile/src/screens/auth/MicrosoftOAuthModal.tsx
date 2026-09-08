import React, { useState } from "react";
import { MicrosoftIcon } from "./AuthComponents";
import { UserPlus, Check, ArrowRight, X } from "lucide-react";
import { UserSession } from "@/stores/useAuthStore";

interface MicrosoftOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (user: UserSession) => void;
}

interface SavedAccount {
  name: string;
  email: string;
  initials: string;
}

const DEFAULT_ACCOUNTS: SavedAccount[] = [
  {
    name: "Shivashankar B S",
    email: "shivubs1508@outlook.com",
    initials: "SB",
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

  const handleChoose = (account: SavedAccount) => {
    setSelectedEmail(account.email);
    setSigningInAs(account.name);

    setTimeout(() => {
      onSelectAccount({
        name: account.name,
        email: account.email,
        avatarInitials: account.initials,
        workspace: "Microsoft 365 Workspace",
      });
      setSigningInAs(null);
      setSelectedEmail(null);
      onClose();
    }, 900);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = customEmail.trim() || "user@outlook.com";
    const name = customName.trim() || email.split("@")[0];
    const initials = name.slice(0, 2).toUpperCase();

    setSigningInAs(name);
    setTimeout(() => {
      onSelectAccount({
        name,
        email,
        avatarInitials: initials,
        workspace: "Microsoft 365 Workspace",
      });
      setSigningInAs(null);
      setIsCustomMode(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-[420px] bg-white rounded-xl shadow-2xl border border-[#d2d2d2] overflow-hidden text-[#1b1b1b] animate-scaleUp">
        {/* Top bar with Microsoft logo and close */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#eaeaea]">
          <div className="flex items-center gap-2.5">
            <MicrosoftIcon className="w-5 h-5" />
            <span className="text-sm font-semibold text-[#505050] font-sans">
              Microsoft
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#505050] hover:bg-[#eaeaea] transition cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#1b1b1b] tracking-tight">
              Pick an account
            </h2>
            <p className="text-xs text-[#505050] mt-1">
              to sign in to <span className="font-semibold text-[#0067b8]">Clockify</span>
            </p>
          </div>

          {signingInAs ? (
            <div className="py-10 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-3 border-[#0067b8]/20 border-t-[#0067b8] rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#1b1b1b]">
                  Signing in as {signingInAs}...
                </p>
                <p className="text-xs text-[#505050] mt-1">
                  Connecting your Microsoft account
                </p>
              </div>
            </div>
          ) : !isCustomMode ? (
            <div className="flex flex-col divide-y divide-[#f1f1f1] -mx-2">
              {DEFAULT_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleChoose(account)}
                  className="flex items-center gap-3.5 p-3 rounded-lg hover:bg-[#f3f3f3] active:bg-[#eaeaea] transition text-left cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0078d4] text-white flex items-center justify-center font-semibold text-sm shadow-xs shrink-0">
                    {account.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1b1b1b] truncate group-hover:text-[#0067b8]">
                      {account.name}
                    </p>
                    <p className="text-xs text-[#505050] truncate">
                      {account.email}
                    </p>
                  </div>

                  {selectedEmail === account.email && (
                    <Check className="w-4 h-4 text-[#0078d4] shrink-0" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="flex items-center gap-3.5 p-3 rounded-lg hover:bg-[#f3f3f3] transition text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-[#d2d2d2] flex items-center justify-center text-[#505050] shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#1b1b1b]">
                  Use another account
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[#505050] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivashankar B S"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:border-[#0067b8] focus:ring-1 focus:ring-[#0067b8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#505050] mb-1">
                  Microsoft / Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@outlook.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:border-[#0067b8] focus:ring-1 focus:ring-[#0067b8] outline-none"
                />
              </div>

              <div className="flex items-center justify-between mt-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="text-xs font-semibold text-[#505050] hover:text-[#1b1b1b]"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0067b8] hover:bg-[#005da6] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <span>Sign in</span>
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
