import { authService } from "../services/authService";
import type {
  DesktopLoginPayload,
  DesktopSignUpPayload,
  DesktopOAuthPayload,
} from "../models/authTypes";

export class AuthController {
  static async login(payload: DesktopLoginPayload) {
    try {
      if (!payload.email) {
        return { success: false, error: "Email is required" };
      }
      const res = await authService.login(payload);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async signup(payload: DesktopSignUpPayload) {
    try {
      if (!payload.email || !payload.name) {
        return { success: false, error: "Name and email are required" };
      }
      const res = await authService.signup(payload);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async oauthLogin(payload: DesktopOAuthPayload) {
    try {
      if (!payload.email || !payload.provider) {
        return { success: false, error: "Provider and email are required" };
      }
      const res = await authService.oauthLogin(payload);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getCurrentUser(identifier?: string) {
    try {
      const user = await authService.getCurrentUser(identifier);
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async updateProfile(userId: string, updates: any) {
    try {
      const updated = await authService.updateProfile(userId, updates);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async updatePreferences(userId: string, prefs: any) {
    try {
      const updated = await authService.updatePreferences(userId, prefs);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async changePassword(userId: string, payload: any) {
    try {
      const res = await authService.changePassword(userId, payload);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async logout(token?: string) {
    try {
      const success = await authService.logout(token);
      return { success: true, data: { success } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async deleteAccount(userId: string) {
    try {
      const success = await authService.deleteAccount(userId);
      return { success: true, data: { success } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async requestPasswordReset(email: string) {
    try {
      const res = await authService.requestPasswordReset(email);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
