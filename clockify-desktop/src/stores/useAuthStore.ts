import { create } from "zustand";
import { authApi } from "@/lib/authApi";
import type { DesktopUser } from "@backend/models/authTypes";

export type DesktopAuthView = "login" | "signup" | "forgotPassword";

const DESKTOP_STORAGE_KEY = "clockify_desktop_auth_session";
const DESKTOP_LOGGED_OUT_KEY = "clockify_desktop_logged_out";

export const DEFAULT_DESKTOP_USER_SESSION: DesktopUser = {
  id: "usr_desktop_bindhu",
  name: "Bindhu shree",
  email: "sbindhu230@gmail.com",
  avatarInitials: "BS",
  avatarColor: "#00897b", // Teal matching Profile.png
  workspaceName: "GOPALAN COLLEGE OF ENGINEERING...",
  workspaceRole: "Owner",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const loadDesktopSession = (): DesktopUser | null => {
  try {
    const isLoggedOut = localStorage.getItem(DESKTOP_LOGGED_OUT_KEY);
    if (isLoggedOut === "true") return null;

    const raw = localStorage.getItem(DESKTOP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load desktop session:", e);
  }
  return DEFAULT_DESKTOP_USER_SESSION;
};

interface DesktopAuthState {
  isAuthenticated: boolean;
  user: DesktopUser | null;
  token: string | null;
  authView: DesktopAuthView;
  isLoading: boolean;
  error: string | null;
  successToast: string | null;
  isGoogleModalOpen: boolean;
  isMicrosoftModalOpen: boolean;
  isForgotPasswordModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Actions
  setAuthView: (view: DesktopAuthView) => void;
  clearError: () => void;
  setSuccessToast: (msg: string | null) => void;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  openMicrosoftModal: () => void;
  closeMicrosoftModal: () => void;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;

  // Auth operations
  login: (email: string, password?: string, stayLoggedIn?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, termsAccepted?: boolean) => Promise<boolean>;
  loginWithOAuth: (
    provider: "google" | "microsoft",
    email: string,
    name: string,
    initials?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
}

const initialSession = loadDesktopSession();

export const useAuthStore = create<DesktopAuthState>((set, get) => ({
  isAuthenticated: !!initialSession,
  user: initialSession,
  token: initialSession ? "clk_dsk_session" : null,
  authView: "login",
  isLoading: false,
  error: null,
  successToast: null,
  isGoogleModalOpen: false,
  isMicrosoftModalOpen: false,
  isForgotPasswordModalOpen: false,
  isDeleteModalOpen: false,

  setAuthView: (view) => set({ authView: view, error: null }),
  clearError: () => set({ error: null }),
  setSuccessToast: (msg) => set({ successToast: msg }),

  openGoogleModal: () => set({ isGoogleModalOpen: true }),
  closeGoogleModal: () => set({ isGoogleModalOpen: false }),

  openMicrosoftModal: () => set({ isMicrosoftModalOpen: true }),
  closeMicrosoftModal: () => set({ isMicrosoftModalOpen: false }),

  openForgotPasswordModal: () => set({ isForgotPasswordModalOpen: true }),
  closeForgotPasswordModal: () => set({ isForgotPasswordModalOpen: false }),

  openDeleteModal: () => set({ isDeleteModalOpen: true }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false }),

  login: async (email: string, password?: string, stayLoggedIn = true) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ email, password, stayLoggedIn });
      if (res && res.user) {
        if (stayLoggedIn) {
          try {
            localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(res.user));
            localStorage.removeItem(DESKTOP_LOGGED_OUT_KEY);
          } catch (e) {}
        }
        set({
          isAuthenticated: true,
          user: res.user,
          token: res.token,
          isLoading: false,
          successToast: `Welcome back, ${res.user.name}!`,
        });
        setTimeout(() => get().setSuccessToast(null), 3000);
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || "Login failed. Please check your credentials.", isLoading: false });
    }
    return false;
  },

  signup: async (name: string, email: string, password?: string, termsAccepted = true) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.signup({ name, email, password, termsAccepted });
      if (res && res.user) {
        try {
          localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(res.user));
          localStorage.removeItem(DESKTOP_LOGGED_OUT_KEY);
        } catch (e) {}
        set({
          isAuthenticated: true,
          user: res.user,
          token: res.token,
          isLoading: false,
          successToast: `Account created for ${res.user.name}!`,
        });
        setTimeout(() => get().setSuccessToast(null), 3000);
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || "Registration failed.", isLoading: false });
    }
    return false;
  },

  loginWithOAuth: async (provider, email, name, initials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.oauthLogin({
        provider,
        email,
        name,
        avatarInitials: initials,
      });
      if (res && res.user) {
        try {
          localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(res.user));
          localStorage.removeItem(DESKTOP_LOGGED_OUT_KEY);
        } catch (e) {}
        set({
          isAuthenticated: true,
          user: res.user,
          token: res.token,
          isGoogleModalOpen: false,
          isMicrosoftModalOpen: false,
          isLoading: false,
          successToast: `Signed in with ${provider === "google" ? "Google" : "Microsoft"} as ${res.user.name}`,
        });
        setTimeout(() => get().setSuccessToast(null), 3000);
        return true;
      }
    } catch (err: any) {
      set({ error: err.message || "OAuth login failed.", isLoading: false });
    }
    return false;
  },

  logout: async () => {
    const { token } = get();
    try {
      await authApi.logout(token || undefined);
    } catch (e) {}

    try {
      localStorage.removeItem(DESKTOP_STORAGE_KEY);
      localStorage.setItem(DESKTOP_LOGGED_OUT_KEY, "true");
    } catch (e) {}

    set({
      isAuthenticated: false,
      user: null,
      token: null,
      authView: "login",
      error: null,
      successToast: "Logged out successfully",
    });
    setTimeout(() => get().setSuccessToast(null), 2500);
  },

  deleteAccount: async () => {
    const { user } = get();
    set({ isLoading: true });
    if (user?.id) {
      try {
        await authApi.deleteAccount(user.id);
      } catch (e) {
        console.error("Failed to delete account:", e);
      }
    }

    try {
      localStorage.removeItem(DESKTOP_STORAGE_KEY);
      localStorage.setItem(DESKTOP_LOGGED_OUT_KEY, "true");
    } catch (e) {}

    set({
      isAuthenticated: false,
      user: null,
      token: null,
      authView: "login",
      isDeleteModalOpen: false,
      isLoading: false,
      error: null,
      successToast: "Your account has been deleted permanently. You can sign up or log in again.",
    });
    setTimeout(() => get().setSuccessToast(null), 5000);
    return true;
  },

  requestPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.requestPasswordReset(email);
      set({
        isLoading: false,
        isForgotPasswordModalOpen: false,
        successToast: res.message,
      });
      setTimeout(() => get().setSuccessToast(null), 4000);
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to request password reset", isLoading: false });
      return false;
    }
  },
}));
