import { create } from "zustand";

export type AuthScreenType = "login" | "signup" | "otp";
export type ThemeMode = "light" | "dark";

export interface UserSession {
  email: string;
  name: string;
  avatarInitials: string;
  workspace: string;
}

const STORAGE_KEY = "clockify_mobile_auth_session";

// Helper to load session from localStorage
const loadSavedSession = (): UserSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
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

  // Auth flows
  requestEmailOtp: (email: string) => Promise<string>;
  verifyOtp: (code: string) => Promise<boolean>;
  loginWithProfile: (user: UserSession) => void;
  logout: () => void;
}

const savedSession = loadSavedSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!savedSession,
  user: savedSession,
  pendingEmail: "",
  currentScreen: "login",
  theme: "light", // Default to light theme as explicitly requested
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
    // Generate a realistic 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanEmail = email.trim();

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
    // Accept the generated code or 123456 as universal demo code
    if (code.length === 6 && (!generatedOtp || code === generatedOtp || code === "123456")) {
      const email = pendingEmail || "user@gmail.com";
      const username = email.split("@")[0] || "User";
      const initials = username.slice(0, 2).toUpperCase();

      const session: UserSession = {
        email,
        name: username,
        avatarInitials: initials,
        workspace: "Personal Workspace",
      };

      try {
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save session:", e);
    }

    set({
      isAuthenticated: true,
      user,
      isGoogleModalOpen: false,
      isMicrosoftModalOpen: false,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
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
