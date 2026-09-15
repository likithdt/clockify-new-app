import React, { useRef, useEffect } from "react";
import { User, Settings, Download, LogOut, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreferences?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout, openDeleteModal, openProfileModal } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const userName = user?.name || "Bindhu shree K. R";
  const userEmail = user?.email || "bindhushreebindhushree28@gmail.com";
  const userInitials = user?.avatarInitials || "BS";

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <>
      {/* Profile Flyout Dropdown matching clockify-ref-images-desktop/Profile.png */}
      <div
        ref={dropdownRef}
        className="absolute right-0 top-10 w-[270px] bg-white rounded-2xl border border-[#e2e8f0] shadow-2xl z-50 overflow-hidden text-[#1e293b] select-none animate-fadeIn"
      >
        {/* User Card */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* Teal Square Avatar matching Profile.png */}
          <div className="w-16 h-16 rounded-xl bg-[#00897b] text-white flex items-center justify-center font-bold text-2xl shadow-sm mb-3">
            {userInitials}
          </div>

          <h3 className="font-bold text-base text-[#1e293b] tracking-tight">{userName}</h3>
          <p className="text-xs text-[#64748b] mt-0.5 max-w-[220px] truncate">{userEmail}</p>

          {/* Manage CAKE.com account Button */}
          <button
            type="button"
            onClick={() => {
              openProfileModal("cake");
              onClose();
            }}
            className="mt-3.5 w-full py-2 px-3 rounded-xl border border-[#cbd5e1] hover:bg-[#f8fafc] text-xs font-semibold text-[#1e293b] transition cursor-pointer shadow-2xs"
          >
            Manage CAKE.com account
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f1f5f9]" />

        {/* Menu Items matching Profile.png */}
        <div className="p-1.5 space-y-0.5 text-xs font-medium">
          {/* My profile */}
          <button
            type="button"
            onClick={() => {
              openProfileModal("profile");
              onClose();
            }}
            className="w-full px-3.5 py-2 rounded-lg text-left flex items-center gap-3 text-[#334155] hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            <User className="w-4 h-4 text-[#64748b]" />
            <span>My profile</span>
          </button>

          {/* Preferences */}
          <button
            type="button"
            onClick={() => {
              openProfileModal("preferences");
              onClose();
            }}
            className="w-full px-3.5 py-2 rounded-lg text-left flex items-center gap-3 text-[#334155] hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#64748b]" />
            <span>Preferences</span>
          </button>

          {/* Download apps */}
          <button
            type="button"
            onClick={() => {
              openProfileModal("apps");
              onClose();
            }}
            className="w-full px-3.5 py-2 rounded-lg text-left flex items-center gap-3 text-[#334155] hover:bg-[#f1f5f9] transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#64748b]" />
            <span>Download apps</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f1f5f9]" />

        {/* Action Items: Log out & Delete Account */}
        <div className="p-1.5 space-y-0.5 text-xs font-medium">
          {/* Log out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3.5 py-2.5 rounded-lg text-left flex items-center gap-3 text-[#334155] hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-semibold">Log out</span>
          </button>

          {/* Delete Account option */}
          <button
            type="button"
            onClick={() => {
              onClose();
              openDeleteModal();
            }}
            className="w-full px-3.5 py-2 rounded-lg text-left flex items-center gap-3 text-red-500 hover:bg-red-50 transition cursor-pointer text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete account</span>
          </button>
        </div>
      </div>
    </>
  );
};
