import React, { useState } from "react";
import {
  Menu,
  Camera,
  Check,
  ChevronRight,
  AlertTriangle,
  X,
  Clock,
  Globe,
  Calendar,
  Sparkles,
  LogOut,
  Trash2,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { Switch } from "../components/ui/Switch";
import { useAuthStore } from "../stores/useAuthStore";
import type { DateTimeSettings } from "../backend/types";

interface ProfileScreenProps {
  onOpenDrawer: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignUp?: () => void;
}

const DATE_FORMAT_OPTIONS: Array<DateTimeSettings["dateFormat"]> = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "DD.MM.YYYY",
];

const DAY_START_OPTIONS = [
  "07:00",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "11:00",
];

const TIME_ZONE_OPTIONS = [
  "GMT+05:30 Asia/Calcutta",
  "GMT+05:30 Asia/Kolkata",
  "GMT+00:00 UTC",
  "GMT+01:00 Europe/London",
  "GMT+02:00 Europe/Berlin",
  "GMT-05:00 America/New_York",
  "GMT-08:00 America/Los_Angeles",
  "GMT+08:00 Asia/Singapore",
  "GMT+09:00 Asia/Tokyo",
  "GMT+10:00 Australia/Sydney",
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenDrawer,
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  const { user, updateDateTimeSettings, updateProfile, logout, deleteAccount } =
    useAuthStore();

  // Active settings fallback to screenshot values
  const dateTime: DateTimeSettings = user?.dateTimeSettings || {
    dateFormat: "DD/MM/YYYY",
    use24HourClock: true,
    dayStart: "09:00",
    setTimeZoneAutomatically: false,
    timeZone: "GMT+05:30 Asia/Calcutta",
  };

  const userName = user?.name || "Bindhu shree K. R";
  const userEmail = user?.email || "bindhushreebindhushree28@gmail.com";
  const userInitials = user?.avatarInitials || "BS";

  // Modals state
  const [isDateFormatModalOpen, setIsDateFormatModalOpen] = useState(false);
  const [isDayStartModalOpen, setIsDayStartModalOpen] = useState(false);
  const [isTimeZoneModalOpen, setIsTimeZoneModalOpen] = useState(false);
  const [isCakeModalOpen, setIsCakeModalOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Form states
  const [editNameInput, setEditNameInput] = useState(userName);
  const [editInitialsInput, setEditInitialsInput] = useState(userInitials);
  const [timeZoneSearch, setTimeZoneSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle 24-hour clock
  const handleToggle24Hour = async (val: boolean) => {
    await updateDateTimeSettings({ use24HourClock: val });
    showToast(val ? "24-hour clock enabled" : "12-hour clock enabled");
  };

  // Toggle Auto Timezone
  const handleToggleAutoTimeZone = async (val: boolean) => {
    await updateDateTimeSettings({ setTimeZoneAutomatically: val });
    showToast(val ? "Automatic time zone enabled" : "Automatic time zone disabled");
  };

  // Select Date Format
  const handleSelectDateFormat = async (format: DateTimeSettings["dateFormat"]) => {
    await updateDateTimeSettings({ dateFormat: format });
    setIsDateFormatModalOpen(false);
    showToast(`Date format set to ${format}`);
  };

  // Select Day Start
  const handleSelectDayStart = async (time: string) => {
    await updateDateTimeSettings({ dayStart: time });
    setIsDayStartModalOpen(false);
    showToast(`Day start set to ${time}`);
  };

  // Select Time Zone
  const handleSelectTimeZone = async (tz: string) => {
    await updateDateTimeSettings({ timeZone: tz });
    setIsTimeZoneModalOpen(false);
    showToast(`Time zone set to ${tz}`);
  };

  // Save Name & Initials
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editNameInput.trim() || userName;
    const cleanInitials = editInitialsInput.trim() || userInitials;
    await updateProfile({ name: cleanName, avatarInitials: cleanInitials });
    setIsEditNameModalOpen(false);
    showToast("Profile updated successfully");
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully");
    onNavigateToLogin?.();
  };

  // Handle Delete Account
  const handleDeleteAccountConfirm = async () => {
    await deleteAccount();
    setIsDeleteModalOpen(false);
    showToast("Account deleted successfully");
    onNavigateToSignUp?.();
  };

  const filteredTimezones = TIME_ZONE_OPTIONS.filter((tz) =>
    tz.toLowerCase().includes(timeZoneSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0f1216] text-white overflow-hidden relative select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-14 left-4 right-4 z-[999] bg-[#1a73e8] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn border border-white/20">
          <Check className="w-4 h-4 shrink-0" />
          <span className="flex-1 truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar matching Profile.jpeg */}
      <header className="shrink-0 h-14 px-4 flex items-center justify-between border-b border-[#1e242d] bg-[#0f1216] z-10">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu with Orange Dot */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="relative p-1.5 -ml-1.5 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 text-white" />
            {/* Orange notification dot matching Profile.jpeg */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff7043] border border-[#0f1216]" />
          </button>

          {/* Screen Title */}
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            My Profile
          </h1>
        </div>

        {/* Edit profile shortcut button */}
        <button
          type="button"
          onClick={() => {
            setEditNameInput(userName);
            setEditInitialsInput(userInitials);
            setIsEditNameModalOpen(true);
          }}
          className="p-1.5 rounded-lg text-[#8c9ba5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Edit Profile"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-12">
        {/* Profile Avatar Card matching Profile.jpeg */}
        <div className="flex flex-col items-center justify-center">
          {/* Blue rounded-square container with initials BS */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-[28px] bg-[#0088ff] flex items-center justify-center text-white shadow-xl border border-white/15 transition-transform group-hover:scale-[1.02]">
              <span className="text-4xl font-bold tracking-wider font-serif select-none">
                {userInitials}
              </span>
            </div>

            {/* Camera Edit Badge on bottom-right */}
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#242b35] hover:bg-[#2e3744] border-2 border-[#0f1216] flex items-center justify-center text-slate-200 hover:text-white shadow-lg transition-colors cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Full Name */}
          <h2 className="mt-4 text-xl font-bold text-white tracking-tight text-center">
            {userName}
          </h2>

          {/* User Email */}
          <p className="mt-0.5 text-xs text-[#8c9ba5] text-center font-normal tracking-wide">
            {userEmail}
          </p>

          {/* Manage CAKE.com account Button */}
          <button
            type="button"
            onClick={() => setIsCakeModalOpen(true)}
            className="mt-5 w-full max-w-[340px] py-3 px-6 rounded-full bg-[#273744] hover:bg-[#2f4252] active:scale-[0.99] border border-[#354859] text-white text-xs font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Manage CAKE.com account</span>
          </button>
        </div>

        {/* DATE & TIME SECTION */}
        <div className="space-y-2 max-w-[420px] mx-auto w-full">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7e8b9b] px-1">
            DATE &amp; TIME
          </h3>

          <div className="bg-[#181d24] border border-[#252e39] rounded-2xl overflow-hidden divide-y divide-[#252e39]">
            {/* 1. Date format */}
            <button
              type="button"
              onClick={() => setIsDateFormatModalOpen(true)}
              className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#1f2630] transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-[14px] font-medium text-white">Date format</div>
                <div className="text-xs text-[#8c9ba5] mt-0.5 font-normal">
                  {dateTime.dateFormat}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5c6875] group-hover:text-white transition-colors" />
            </button>

            {/* 2. Use 24-hour clock */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium text-white">
                  Use 24-hour clock
                </div>
              </div>
              <Switch
                checked={dateTime.use24HourClock}
                onChange={handleToggle24Hour}
                aria-label="Use 24-hour clock"
              />
            </div>

            {/* 3. Day start */}
            <button
              type="button"
              onClick={() => setIsDayStartModalOpen(true)}
              className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#1f2630] transition-colors cursor-pointer group"
            >
              <div>
                <div className="text-[14px] font-medium text-white">Day start</div>
                <div className="text-xs text-[#8c9ba5] mt-0.5 font-normal">
                  {dateTime.dayStart}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5c6875] group-hover:text-white transition-colors" />
            </button>

            {/* 4. Set time zone automatically */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium text-white">
                  Set time zone automatically
                </div>
              </div>
              <Switch
                checked={dateTime.setTimeZoneAutomatically}
                onChange={handleToggleAutoTimeZone}
                aria-label="Set time zone automatically"
              />
            </div>

            {/* 5. Choose time zone */}
            <button
              type="button"
              onClick={() => setIsTimeZoneModalOpen(true)}
              className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#1f2630] transition-colors cursor-pointer group"
            >
              <div className="pr-2">
                <div className="text-[14px] font-medium text-white">
                  Choose time zone
                </div>
                <div className="text-xs text-[#8c9ba5] mt-0.5 font-normal truncate">
                  {dateTime.timeZone}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5c6875] group-hover:text-white transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS matching Profile.jpeg */}
        <div className="space-y-3 pt-2 max-w-[420px] mx-auto w-full">
          {/* Log out Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3.5 rounded-full border border-[#2b3947] bg-[#141920] hover:bg-[#1c232d] text-[#00b0ff] font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Log out</span>
          </button>

          {/* Delete account Button (soft coral/salmon) */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full py-3.5 rounded-full bg-[#fca5a5] hover:bg-[#f87171] active:scale-[0.99] text-[#3b0808] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Delete account</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL: DATE FORMAT ================= */}
      {isDateFormatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[340px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262e39]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00b0ff]" />
                <h3 className="text-sm font-bold text-white">Choose Date Format</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDateFormatModalOpen(false)}
                className="text-[#8c9ba5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {DATE_FORMAT_OPTIONS.map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => handleSelectDateFormat(format)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    dateTime.dateFormat === format
                      ? "bg-[#00b0ff]/15 border border-[#00b0ff]/40 text-[#00b0ff] font-semibold"
                      : "text-slate-300 hover:bg-[#232a34]"
                  }`}
                >
                  <span>{format}</span>
                  {dateTime.dateFormat === format && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DAY START ================= */}
      {isDayStartModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[340px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262e39]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00b0ff]" />
                <h3 className="text-sm font-bold text-white">Choose Day Start Time</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDayStartModalOpen(false)}
                className="text-[#8c9ba5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {DAY_START_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSelectDayStart(time)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    dateTime.dayStart === time
                      ? "bg-[#00b0ff]/15 border border-[#00b0ff]/40 text-[#00b0ff] font-semibold"
                      : "text-slate-300 hover:bg-[#232a34]"
                  }`}
                >
                  <span>{time}</span>
                  {dateTime.dayStart === time && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHOOSE TIME ZONE ================= */}
      {isTimeZoneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[380px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262e39]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00b0ff]" />
                <h3 className="text-sm font-bold text-white">Choose Time Zone</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTimeZoneModalOpen(false)}
                className="text-[#8c9ba5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={timeZoneSearch}
              onChange={(e) => setTimeZoneSearch(e.target.value)}
              placeholder="Search time zones..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121519] border border-[#2c3746] text-white text-xs outline-none focus:border-[#00b0ff]"
            />

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {filteredTimezones.map((tz) => (
                <button
                  key={tz}
                  type="button"
                  onClick={() => handleSelectTimeZone(tz)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    dateTime.timeZone === tz
                      ? "bg-[#00b0ff]/15 border border-[#00b0ff]/40 text-[#00b0ff] font-semibold"
                      : "text-slate-300 hover:bg-[#232a34]"
                  }`}
                >
                  <span className="truncate">{tz}</span>
                  {dateTime.timeZone === tz && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT NAME & INITIALS ================= */}
      {isEditNameModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-[360px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#262e39]">
              <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditNameModalOpen(false)}
                className="text-[#8c9ba5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#8c9ba5] mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121519] border border-[#2c3746] text-white text-sm outline-none focus:border-[#00b0ff]"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#8c9ba5] mb-1 block">Avatar Initials</label>
                <input
                  type="text"
                  maxLength={3}
                  value={editInitialsInput}
                  onChange={(e) => setEditInitialsInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121519] border border-[#2c3746] text-white text-sm outline-none focus:border-[#00b0ff] uppercase tracking-widest"
                  placeholder="BS"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditNameModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#232a34] text-slate-300 text-xs font-semibold hover:bg-[#2c3542]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6] shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: AVATAR CUSTOMIZER ================= */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[340px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262e39]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#00b0ff]" />
                <h3 className="text-sm font-bold text-white">Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(false)}
                className="text-[#8c9ba5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Personalize your avatar badge color or reset to default:
            </p>

            <div className="flex items-center justify-center gap-3 py-2">
              {["#0088ff", "#1a73e8", "#0f9d58", "#9c27b0", "#e65100"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={async () => {
                    await updateProfile({ avatarColor: color });
                    setIsAvatarPickerOpen(false);
                    showToast("Avatar color updated");
                  }}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                >
                  {userInitials}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#232a34] text-slate-300 text-xs font-semibold hover:bg-[#2c3542]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANAGE CAKE.COM ACCOUNT ================= */}
      {isCakeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[360px] bg-[#1b2027] border border-[#27303d] rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00b0ff]/20 text-[#00b0ff] mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">cake.com Account</h3>
            <p className="text-xs text-[#8c9ba5] leading-relaxed">
              Your Clockify account is connected to the <strong>cake.com Productivity Suite</strong>. Single sign-on and unified billing are active for <strong>{userEmail}</strong>.
            </p>

            <div className="bg-[#121519] border border-[#242d38] rounded-xl p-3 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Products:</span>
                <span className="font-semibold text-white">Clockify, Plaky, Pumble</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active Pro
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCakeModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#00b0ff] text-white text-xs font-semibold hover:bg-[#009ee6]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM DELETE ACCOUNT ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-[360px] bg-[#1b2027] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Delete Account?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete your account for{" "}
              <strong className="text-white">{userEmail}</strong>?
              <br />
              <span className="text-red-400 font-medium">
                All tracked time, workspaces, and preferences will be permanently wiped. This action cannot be reversed.
              </span>
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#232a34] text-slate-300 text-xs font-semibold hover:bg-[#2c3542] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
