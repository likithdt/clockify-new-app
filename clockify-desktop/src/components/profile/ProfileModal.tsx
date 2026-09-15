import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Sliders,
  Layers,
  Download,
  Check,
  Lock,
  Globe,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { DateTimePreferences } from "@backend/models/authTypes";

export const ProfileModal: React.FC = () => {
  const {
    user,
    isProfileModalOpen,
    profileModalTab,
    closeProfileModal,
    updateProfile,
    updatePreferences,
    changePassword,
    openDeleteModal,
    isLoading,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "cake" | "apps">(
    profileModalTab || "profile"
  );

  useEffect(() => {
    if (profileModalTab) {
      setActiveTab(profileModalTab);
    }
  }, [profileModalTab]);

  // Profile Form state
  const [name, setName] = useState(user?.name || "Bindhu shree K. R");
  const [email, setEmail] = useState(user?.email || "bindhushreebindhushree28@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Preferences Form state
  const [dateFormat, setDateFormat] = useState<DateTimePreferences["dateFormat"]>(
    user?.preferences?.dateFormat || "DD/MM/YYYY"
  );
  const [use24HourClock, setUse24HourClock] = useState<boolean>(
    user?.preferences?.use24HourClock ?? true
  );
  const [dayStart, setDayStart] = useState(user?.preferences?.dayStart || "09:00");
  const [dayEnd, setDayEnd] = useState(user?.preferences?.dayEnd || "17:00");
  const [weekStart, setWeekStart] = useState<DateTimePreferences["weekStart"]>(
    user?.preferences?.weekStart || "Monday"
  );
  const [timeZone, setTimeZone] = useState(
    user?.preferences?.timeZone || "GMT+05:30 Asia/Calcutta"
  );
  const [autoTimeZone, setAutoTimeZone] = useState(
    user?.preferences?.autoTimeZone ?? false
  );

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.preferences) {
        setDateFormat(user.preferences.dateFormat);
        setUse24HourClock(user.preferences.use24HourClock);
        setDayStart(user.preferences.dayStart);
        setDayEnd(user.preferences.dayEnd);
        setWeekStart(user.preferences.weekStart);
        setTimeZone(user.preferences.timeZone);
        setAutoTimeZone(user.preferences.autoTimeZone);
      }
    }
  }, [user]);

  if (!isProfileModalOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const initials = name
      .trim()
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "BS";

    const ok = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      avatarInitials: initials,
    });
    if (ok) showToast("Profile changes saved successfully!");
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updatePreferences({
      dateFormat,
      use24HourClock,
      dayStart,
      dayEnd,
      weekStart,
      timeZone,
      autoTimeZone,
    });
    if (ok) showToast("Preferences updated successfully!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    const ok = await changePassword(newPassword, currentPassword);
    if (ok) {
      setPasswordMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
    >
      <div className="w-full max-w-[640px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] flex flex-col overflow-hidden animate-scaleIn text-[#1e293b]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00897b] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.avatarInitials || "BS"}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f172a] leading-none">
                {user?.name || "Bindhu shree K. R"}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">{user?.email || "bindhushreebindhushree28@gmail.com"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeProfileModal}
            className="p-1.5 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#f1f5f9] px-6 bg-[#f8fafc] text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === "profile"
                ? "border-[#03a9f4] text-[#03a9f4]"
                : "border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>My profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === "preferences"
                ? "border-[#03a9f4] text-[#03a9f4]"
                : "border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cake")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === "cake"
                ? "border-[#03a9f4] text-[#03a9f4]"
                : "border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>CAKE.com Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("apps")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === "apps"
                ? "border-[#03a9f4] text-[#03a9f4]"
                : "border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download apps</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="w-16 h-16 rounded-xl bg-[#00897b] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                    {user?.avatarInitials || "BS"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[#0f172a]">Profile Avatar</h4>
                    <p className="text-[#64748b] text-[11px] mt-0.5">
                      Your avatar is generated from your initials and displayed across your workspace.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] focus:border-[#03a9f4] focus:ring-1 focus:ring-[#03a9f4] outline-none transition"
                      placeholder="e.g. Bindhu shree K. R"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] focus:border-[#03a9f4] focus:ring-1 focus:ring-[#03a9f4] outline-none transition"
                      placeholder="e.g. bindhushreebindhushree28@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Current Workspace
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.workspaceName || "GOPALAN COLLEGE OF ENGINEERING..."}
                      className="w-full h-9 px-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-xs text-[#64748b] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Role & Permissions
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.workspaceRole || "Owner"}
                      className="w-full h-9 px-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-xs text-[#64748b] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>

              {/* Password Change Form */}
              <div className="pt-4 border-t border-[#f1f5f9]">
                <h3 className="font-bold text-sm text-[#0f172a] flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-[#64748b]" />
                  <span>Change Password</span>
                </h3>

                {passwordMsg && (
                  <div
                    className={`p-2.5 rounded-lg mb-3 text-xs flex items-center gap-2 ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <span className="font-medium">{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs outline-none focus:border-[#03a9f4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs outline-none focus:border-[#03a9f4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs outline-none focus:border-[#03a9f4]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newPassword}
                      className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-red-600 text-xs">Delete Account</h4>
                  <p className="text-[#64748b] text-[11px]">Permanently remove your account and all associated personal records.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeProfileModal();
                    openDeleteModal();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete account</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === "preferences" && (
            <form onSubmit={handleSavePreferences} className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                {/* Date Format */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] bg-white outline-none focus:border-[#03a9f4]"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 15/09/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/15/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-15)</option>
                    <option value="DD.MM.YYYY">DD.MM.YYYY (e.g. 15.09.2026)</option>
                  </select>
                </div>

                {/* Time Format */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Time Format
                  </label>
                  <div className="flex items-center gap-3 h-9">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="timeFormat"
                        checked={use24HourClock}
                        onChange={() => setUse24HourClock(true)}
                        className="text-[#03a9f4] focus:ring-[#03a9f4]"
                      />
                      <span className="text-xs text-[#0f172a] font-medium">24-hour (14:30)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="timeFormat"
                        checked={!use24HourClock}
                        onChange={() => setUse24HourClock(false)}
                        className="text-[#03a9f4] focus:ring-[#03a9f4]"
                      />
                      <span className="text-xs text-[#0f172a] font-medium">12-hour (2:30 PM)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Day Start */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Day Start Time
                  </label>
                  <select
                    value={dayStart}
                    onChange={(e) => setDayStart(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] bg-white outline-none focus:border-[#03a9f4]"
                  >
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="08:30">08:30</option>
                    <option value="09:00">09:00 (Default)</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                  </select>
                </div>

                {/* Day End */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Day End Time
                  </label>
                  <select
                    value={dayEnd}
                    onChange={(e) => setDayEnd(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] bg-white outline-none focus:border-[#03a9f4]"
                  >
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00 (Default)</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Week Start */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Week Starts On
                  </label>
                  <select
                    value={weekStart}
                    onChange={(e) => setWeekStart(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] bg-white outline-none focus:border-[#03a9f4]"
                  >
                    <option value="Monday">Monday (Default)</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                {/* Time Zone */}
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs text-[#0f172a] bg-white outline-none focus:border-[#03a9f4]"
                  >
                    <option value="GMT+05:30 Asia/Calcutta">GMT+05:30 Asia/Calcutta (IST)</option>
                    <option value="GMT+05:30 Asia/Kolkata">GMT+05:30 Asia/Kolkata</option>
                    <option value="GMT+00:00 UTC">GMT+00:00 UTC</option>
                    <option value="GMT+01:00 Europe/London">GMT+01:00 Europe/London</option>
                    <option value="GMT+02:00 Europe/Berlin">GMT+02:00 Europe/Berlin</option>
                    <option value="GMT-05:00 America/New_York">GMT-05:00 America/New_York (EST)</option>
                    <option value="GMT-08:00 America/Los_Angeles">GMT-08:00 America/Los_Angeles (PST)</option>
                    <option value="GMT+08:00 Asia/Singapore">GMT+08:00 Asia/Singapore</option>
                    <option value="GMT+09:00 Asia/Tokyo">GMT+09:00 Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              {/* Auto Timezone Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoTimezone"
                  checked={autoTimeZone}
                  onChange={(e) => setAutoTimeZone(e.target.checked)}
                  className="w-4 h-4 rounded text-[#03a9f4] focus:ring-[#03a9f4] border-[#cbd5e1] cursor-pointer"
                />
                <label htmlFor="autoTimezone" className="text-xs text-[#475569] cursor-pointer">
                  Detect and update time zone automatically based on location
                </label>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#03a9f4] hover:bg-[#0288d1] text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CAKE.COM ACCOUNT */}
          {activeTab === "cake" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">CAKE.com Productivity Suite</h3>
                  <p className="text-xs text-[#64748b] mt-1 max-w-[420px]">
                    Manage your unified CAKE.com identity across Clockify, Plaky, and Pumble with centralized billing and single sign-on.
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#1a73e8] text-white text-[11px] font-bold shrink-0">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Clockify */}
                <div className="p-3.5 rounded-xl border border-[#cbd5e1] bg-white flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-[#03a9f4] text-white flex items-center justify-center font-bold mb-2 shadow-xs">
                      C
                    </div>
                    <h4 className="font-bold text-xs text-[#0f172a]">Clockify</h4>
                    <p className="text-[11px] text-[#64748b] mt-0.5">Time tracking & timesheets</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-3 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                </div>

                {/* Plaky */}
                <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-[#6366f1] text-white flex items-center justify-center font-bold mb-2 shadow-xs">
                      P
                    </div>
                    <h4 className="font-bold text-xs text-[#0f172a]">Plaky</h4>
                    <p className="text-[11px] text-[#64748b] mt-0.5">Project & task boards</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("https://plaky.com", "_blank")}
                    className="text-[11px] font-semibold text-[#03a9f4] hover:underline mt-3 flex items-center gap-1 cursor-pointer"
                  >
                    Open Plaky <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Pumble */}
                <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-lg bg-[#ec4899] text-white flex items-center justify-center font-bold mb-2 shadow-xs">
                      Pu
                    </div>
                    <h4 className="font-bold text-xs text-[#0f172a]">Pumble</h4>
                    <p className="text-[11px] text-[#64748b] mt-0.5">Team messaging & calls</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("https://pumble.com", "_blank")}
                    className="text-[11px] font-semibold text-[#03a9f4] hover:underline mt-3 flex items-center gap-1 cursor-pointer"
                  >
                    Open Pumble <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#0f172a]">Single Sign-On (SSO)</h4>
                  <p className="text-[11px] text-[#64748b]">Connected as {user?.email || "bindhushreebindhushree28@gmail.com"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open("https://cake.com", "_blank")}
                  className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] hover:bg-white text-[#0f172a] font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Manage at CAKE.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: DOWNLOAD APPS */}
          {activeTab === "apps" && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-[#64748b] text-xs">
                Install Clockify across all your devices for seamless background tracking and cross-platform synchronization.
              </p>

              <div className="space-y-3">
                {/* Desktop App */}
                <div className="p-4 rounded-xl border border-[#e2e8f0] flex items-center justify-between hover:bg-[#f8fafc] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#03a9f4]/10 text-[#03a9f4] flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0f172a]">Clockify Desktop (Windows / macOS / Linux)</h4>
                      <p className="text-[11px] text-[#64748b]">Tauri v2 native client with auto-tracker and offline support</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("https://clockify.me/windows-time-tracking", "_blank")}
                    className="px-3 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Download .exe
                  </button>
                </div>

                {/* Mobile Apps */}
                <div className="p-4 rounded-xl border border-[#e2e8f0] flex items-center justify-between hover:bg-[#f8fafc] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0f172a]">Clockify Mobile (Android &amp; iOS)</h4>
                      <p className="text-[11px] text-[#64748b]">Mobile simulator active at port 5174; syncs with Google Play &amp; App Store</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("http://localhost:5174", "_blank")}
                    className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-white text-[#0f172a] rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Open Simulator
                  </button>
                </div>

                {/* Browser Extensions */}
                <div className="p-4 rounded-xl border border-[#e2e8f0] flex items-center justify-between hover:bg-[#f8fafc] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0f172a]">Browser Extension (Chrome, Firefox, Edge)</h4>
                      <p className="text-[11px] text-[#64748b]">Track time across 50+ web apps like Jira, Trello, Asana, and GitHub</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("https://clockify.me/chrome-time-tracking", "_blank")}
                    className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-white text-[#0f172a] rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Add to Chrome
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
          <span className="text-[11px] text-[#94a3b8]">Clockify Desktop Enterprise v2.5</span>
          <button
            type="button"
            onClick={closeProfileModal}
            className="px-4 py-1.5 rounded-lg border border-[#cbd5e1] hover:bg-white text-xs font-semibold text-[#475569] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[11000] bg-[#1e293b] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Check className="w-4 h-4 text-[#03a9f4]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
