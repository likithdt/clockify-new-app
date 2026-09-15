import { create } from "zustand";
import type { DateTimeSettings } from "../backend/types.ts";

export type AuthScreenType = "login" | "signup" | "otp";
export type ThemeMode = "light" | "dark";

export interface UserSession {
  id?: string;
  email: string;
  name: string;
  avatarInitials: string;
  avatarColor?: string;
  workspace: string;
  workspaceRole?: string;
  dateTimeSettings?: DateTimeSettings;
}

const STORAGE_KEY = "clockify_mobile_auth_session";
const LOGGED_OUT_KEY = "clockify_mobile_logged_out";

export const DEFAULT_MOBILE_USER: UserSession = {
  id: "usr_bindhu",
  name: "Bindhu shree K. R",
  email: "bindhushreebindhushree28@gmail.com",
  avatarInitials: "BS",
  avatarColor: "#00b0ff",
  workspace: "GCEM Workspace",
  workspaceRole: "Owner",
  dateTimeSettings: {
    dateFormat: "DD/MM/YYYY",
    use24HourClock: true,
    dayStart: "09:00",
    setTimeZoneAutomatically: false,
    timeZone: "GMT+05:30 Asia/Calcutta",
  },
};

// Helper to load session from localStorage
const loadSavedSession = (): UserSession | null => {
  try {
    const isLoggedOut = localStorage.getItem(LOGGED_OUT_KEY);
    if (isLoggedOut === "true") {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOBILE_USER));
    return DEFAULT_MOBILE_USER;
  } catch (e) {
    console.error("Failed to load session:", e);
  }
  return null;
};

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  pendingEmail: string;
  currentScreen: AuthScreenType;
  theme: ThemeMode;
  showAndroidFrame: boolean;
  generatedOtp: string | null;
  otpNotification: string | null;
  isGoogleModalOpen: boolean;
  isMicrosoftModalOpen: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setShowAndroidFrame: (show: boolean) => void;
  toggleAndroidFrame: () => void;
  setCurrentScreen: (screen: AuthScreenType) => void;
  setPendingEmail: (email: string) => void;
  setOtpNotification: (msg: string | null) => void;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  openMicrosoftModal: () => void;
  closeMicrosoftModal: () => void;

  // Auth & Profile flows
  requestEmailOtp: (email: string) => Promise<string>;
  verifyOtp: (code: string) => Promise<boolean>;
  loginWithProfile: (user: UserSession) => void;
  updateDateTimeSettings: (settings: Partial<DateTimeSettings>) => Promise<boolean>;
  updateProfile: (profile: Partial<UserSession>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  logout: () => void;
}

const savedSession = loadSavedSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!savedSession,
  user: savedSession,
  pendingEmail: "",
  currentScreen: "login",
  theme: "light",
  showAndroidFrame: true,
  generatedOtp: null,
  otpNotification: null,
  isGoogleModalOpen: false,
  isMicrosoftModalOpen: false,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  setShowAndroidFrame: (show) => set({ showAndroidFrame: show }),
  toggleAndroidFrame: () => set((state) => ({ showAndroidFrame: !state.showAndroidFrame })),

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setPendingEmail: (email) => set({ pendingEmail: email }),
  setOtpNotification: (msg) => set({ otpNotification: msg }),

  openGoogleModal: () => set({ isGoogleModalOpen: true }),
  closeGoogleModal: () => set({ isGoogleModalOpen: false }),

  openMicrosoftModal: () => set({ isMicrosoftModalOpen: true }),
  closeMicrosoftModal: () => set({ isMicrosoftModalOpen: false }),

  requestEmailOtp: async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanEmail = email.trim();

    try {
      await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
    } catch (e) {}

    set({
      pendingEmail: cleanEmail,
      currentScreen: "otp",
      generatedOtp: code,
      otpNotification: `Verification code: ${code}`,
    });

    return code;
  },

  verifyOtp: async (code: string) => {
    const { generatedOtp, pendingEmail } = get();
    if (code.length === 6 && (!generatedOtp || code === generatedOtp || code === "123456")) {
      const email = pendingEmail || "bindhushreebindhushree28@gmail.com";
      const username = email.split("@")[0] || "Bindhu shree K. R";
      const initials = username.slice(0, 2).toUpperCase();

      const session: UserSession = {
        id: "usr_bindhu",
        email,
        name: "Bindhu shree K. R",
        avatarInitials: initials || "BS",
        avatarColor: "#00b0ff",
        workspace: "GCEM Workspace",
        workspaceRole: "Owner",
        dateTimeSettings: {
          dateFormat: "DD/MM/YYYY",
          use24HourClock: true,
          dayStart: "09:00",
          setTimeZoneAutomatically: false,
          timeZone: "GMT+05:30 Asia/Calcutta",
        },
      };

      try {
        localStorage.removeItem(LOGGED_OUT_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (e) {
        console.error("Failed to save session:", e);
      }

      set({
        isAuthenticated: true,
        user: session,
        otpNotification: null,
      });

      return true;
    }
    return false;
  },

  loginWithProfile: (user: UserSession) => {
    const fullSession: UserSession = {
      id: user.id || "usr_bindhu",
      name: user.name || "Bindhu shree K. R",
      email: user.email || "bindhushreebindhushree28@gmail.com",
      avatarInitials: user.avatarInitials || "BS",
      avatarColor: user.avatarColor || "#00b0ff",
      workspace: user.workspace || "GCEM Workspace",
      workspaceRole: user.workspaceRole || "Owner",
      dateTimeSettings: user.dateTimeSettings || DEFAULT_MOBILE_USER.dateTimeSettings,
    };

    try {
      localStorage.removeItem(LOGGED_OUT_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullSession));
    } catch (e) {
      console.error("Failed to save session:", e);
    }

    set({
      isAuthenticated: true,
      user: fullSession,
      isGoogleModalOpen: false,
      isMicrosoftModalOpen: false,
    });
  },

  updateDateTimeSettings: async (settings: Partial<DateTimeSettings>) => {
    const { user } = get();
    if (!user) return false;

    const updatedDateTime: DateTimeSettings = {
      ...(user.dateTimeSettings || DEFAULT_MOBILE_USER.dateTimeSettings!),
      ...settings,
    };

    const updatedUser: UserSession = {
      ...user,
      dateTimeSettings: updatedDateTime,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      await fetch("/api/auth/datetime-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || "usr_bindhu", settings: updatedDateTime }),
      });
    } catch (e) {}

    set({ user: updatedUser });
    return true;
  },

  updateProfile: async (profile: Partial<UserSession>) => {
    const { user } = get();
    if (!user) return false;

    const updatedUser: UserSession = {
      ...user,
      ...profile,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || "usr_bindhu", ...profile }),
      });
    } catch (e) {}

    set({ user: updatedUser });
    return true;
  },

  deleteAccount: async () => {
    const { user } = get();
    try {
      localStorage.setItem(LOGGED_OUT_KEY, "true");
      localStorage.removeItem(STORAGE_KEY);
      if (user?.id) {
        await fetch("/api/auth/account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      }
    } catch (e) {}

    set({
      isAuthenticated: false,
      user: null,
      currentScreen: "login",
      pendingEmail: "",
      generatedOtp: null,
      otpNotification: null,
    });
    return true;
  },

  logout: () => {
    try {
      localStorage.setItem(LOGGED_OUT_KEY, "true");
      localStorage.removeItem(STORAGE_KEY);
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    } catch (e) {
      console.error("Failed to clear session:", e);
    }

    set({
      isAuthenticated: false,
      user: null,
      pendingEmail: "",
      currentScreen: "login",
      generatedOtp: null,
      otpNotification: null,
    });
  },
}));
