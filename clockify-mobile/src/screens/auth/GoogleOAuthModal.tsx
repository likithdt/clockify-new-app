import React, { useState } from "react";
import { GoogleIcon } from "./AuthComponents";
import { UserPlus, Check, ArrowRight, X } from "lucide-react";
import { UserSession } from "@/stores/useAuthStore";

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (user: UserSession) => void;
}

interface SavedAccount {
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
}

const DEFAULT_ACCOUNTS: SavedAccount[] = [
  {
    name: "Shivashankar B S",
    email: "shivubs1508@gmail.com",
    avatarColor: "bg-[#1a73e8]",
    initials: "SB",
  },
  {
    name: "Shiva Shankar",
    email: "shivashankar.workspace@gmail.com",
    avatarColor: "bg-[#0f9d58]",
    initials: "SS",
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

  const handleChoose = (account: SavedAccount) => {
    setSelectedEmail(account.email);
    setSigningInAs(account.name);

    setTimeout(() => {
      onSelectAccount({
        name: account.name,
        email: account.email,
        avatarInitials: account.initials,
        workspace: "Shiva's Workspace",
      });
      setSigningInAs(null);
      setSelectedEmail(null);
      onClose();
    }, 900);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = customEmail.trim() || "user@gmail.com";
    const name = customName.trim() || email.split("@")[0];
    const initials = name.slice(0, 2).toUpperCase();

    setSigningInAs(name);
    setTimeout(() => {
      onSelectAccount({
        name,
        email,
        avatarInitials: initials,
        workspace: "My Workspace",
      });
      setSigningInAs(null);
      setIsCustomMode(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      {/* Google OAuth Modal Window */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl border border-[#dadce0] overflow-hidden text-[#202124] animate-scaleUp">
        {/* Top bar with Google G and close button */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#f1f3f4]">
          <div className="flex items-center gap-2.5">
            <GoogleIcon className="w-5 h-5" />
            <span className="text-sm font-semibold text-[#5f6368] font-sans">
              Sign in with Google
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] transition cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-xl font-normal text-[#202124] tracking-tight">
              Choose an account
            </h2>
            <p className="text-xs text-[#5f6368] mt-1">
              to continue to <span className="font-semibold text-[#1a73e8]">Clockify</span>
            </p>
          </div>

          {signingInAs ? (
            /* Signing in loading state */
            <div className="py-10 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-3 border-[#1a73e8]/20 border-t-[#1a73e8] rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-[#202124]">
                  Signing in as {signingInAs}...
                </p>
                <p className="text-xs text-[#5f6368] mt-1">
                  Connecting to Clockify
                </p>
              </div>
            </div>
          ) : !isCustomMode ? (
            /* Account list */
            <div className="flex flex-col divide-y divide-[#f1f3f4] -mx-2">
              {DEFAULT_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleChoose(account)}
                  className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#f8f9fa] active:bg-[#f1f3f4] transition text-left cursor-pointer group"
                >
                  {/* Account Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${account.avatarColor} text-white flex items-center justify-center font-semibold text-sm shadow-xs shrink-0`}
                  >
                    {account.initials}
                  </div>

                  {/* Account details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#202124] truncate group-hover:text-[#1a73e8]">
                      {account.name}
                    </p>
                    <p className="text-xs text-[#5f6368] truncate">
                      {account.email}
                    </p>
                  </div>

                  {selectedEmail === account.email && (
                    <Check className="w-4 h-4 text-[#1a73e8] shrink-0" />
                  )}
                </button>
              ))}

              {/* Use another account option */}
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#f8f9fa] transition text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-[#dadce0] flex items-center justify-center text-[#5f6368] shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#202124]">
                  Use another account
                </span>
              </button>
            </div>
          ) : (
            /* Custom account form */
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5f6368] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivashankar B S"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5f6368] mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-sm focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                />
              </div>

              <div className="flex items-center justify-between mt-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="text-xs font-semibold text-[#5f6368] hover:text-[#202124]"
                >
                  Back to accounts
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Privacy disclaimer matching real Google OAuth */}
          <div className="mt-6 pt-4 border-t border-[#f1f3f4] text-[11px] text-[#5f6368] leading-relaxed">
            To continue, Google will share your name, email address, language
            preference, and profile picture with Clockify. Before using Clockify,
            you can review their{" "}
            <span className="text-[#1a73e8] hover:underline cursor-pointer">
              privacy policy
            </span>{" "}
            and{" "}
            <span className="text-[#1a73e8] hover:underline cursor-pointer">
              terms of service
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
};
