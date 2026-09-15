import { invoke } from "@tauri-apps/api/core";
import { authService } from "@backend/services/authService";
import type {
  DesktopUser,
  DesktopLoginPayload,
  DesktopSignUpPayload,
  DesktopOAuthPayload,
  DesktopAuthResponse,
  PasswordResetResponse,
} from "@backend/models/authTypes";

const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export const authApi = {
  login: async (payload: DesktopLoginPayload): Promise<DesktopAuthResponse> => {
    if (isTauri) {
      try {
        return await invoke<DesktopAuthResponse>("auth_login", { payload });
      } catch (e) {
        console.warn("Tauri invoke auth_login failed, fallback to service:", e);
      }
    }
    return authService.login(payload);
  },

  signup: async (payload: DesktopSignUpPayload): Promise<DesktopAuthResponse> => {
    if (isTauri) {
      try {
        return await invoke<DesktopAuthResponse>("auth_signup", { payload });
      } catch (e) {
        console.warn("Tauri invoke auth_signup failed, fallback to service:", e);
      }
    }
    return authService.signup(payload);
  },

  oauthLogin: async (payload: DesktopOAuthPayload): Promise<DesktopAuthResponse> => {
    if (isTauri) {
      try {
        return await invoke<DesktopAuthResponse>("auth_oauth", { payload });
      } catch (e) {
        console.warn("Tauri invoke auth_oauth failed, fallback to service:", e);
      }
    }
    return authService.oauthLogin(payload);
  },

  getCurrentUser: async (identifier?: string): Promise<DesktopUser> => {
    if (isTauri) {
      try {
        return await invoke<DesktopUser>("auth_get_current_user", { identifier });
      } catch (e) {
        console.warn("Tauri invoke auth_get_current_user failed, fallback to service:", e);
      }
    }
    return authService.getCurrentUser(identifier);
  },

  updateProfile: async (userId: string, updates: Partial<DesktopUser>): Promise<DesktopUser> => {
    if (isTauri) {
      try {
        return await invoke<DesktopUser>("auth_update_profile", { userId, updates });
      } catch (e) {
        console.warn("Tauri invoke auth_update_profile failed, fallback to service:", e);
      }
    }
    return authService.updateProfile(userId, updates);
  },

  logout: async (token?: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>("auth_logout", { token });
      } catch (e) {
        console.warn("Tauri invoke auth_logout failed, fallback to service:", e);
      }
    }
    return authService.logout(token);
  },

  deleteAccount: async (userId: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>("auth_delete_account", { userId });
      } catch (e) {
        console.warn("Tauri invoke auth_delete_account failed, fallback to service:", e);
      }
    }
    return authService.deleteAccount(userId);
  },

  requestPasswordReset: async (email: string): Promise<PasswordResetResponse> => {
    if (isTauri) {
      try {
        return await invoke<PasswordResetResponse>("auth_password_reset", { email });
      } catch (e) {
        console.warn("Tauri invoke auth_password_reset failed, fallback to service:", e);
      }
    }
    return authService.requestPasswordReset(email);
  },
};
