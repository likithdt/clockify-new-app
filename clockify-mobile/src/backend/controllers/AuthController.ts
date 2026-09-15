import { authService } from "../services/AuthService.ts";
import type { ApiResponse } from "./TimeTrackerController.ts";
import type { SignUpPayload, OAuthLoginPayload } from "../types.ts";

export class AuthController {
  // POST /api/auth/otp/send
  static async sendOtp(body: { email?: string }): Promise<ApiResponse> {
    try {
      if (!body || !body.email) {
        return { status: 400, error: "Email address is required" };
      }
      const res = await authService.requestOtp(body.email);
      return { status: 200, data: res };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to send verification code" };
    }
  }

  // POST /api/auth/otp/verify
  static async verifyOtp(body: { email?: string; code?: string }): Promise<ApiResponse> {
    try {
      if (!body || !body.code) {
        return { status: 400, error: "Verification code is required" };
      }
      const email = body.email || "user@gmail.com";
      const session = await authService.verifyOtp(email, body.code);
      return { status: 200, data: session };
    } catch (err: any) {
      return { status: 400, error: err.message || "Invalid or expired verification code" };
    }
  }

  // POST /api/auth/login
  static async login(body: { email?: string }): Promise<ApiResponse> {
    try {
      if (!body || !body.email) {
        return { status: 400, error: "Email address is required" };
      }
      const session = await authService.login(body.email);
      return { status: 200, data: session };
    } catch (err: any) {
      return { status: 400, error: err.message || "Login failed" };
    }
  }

  // POST /api/auth/signup
  static async signup(body: SignUpPayload): Promise<ApiResponse> {
    try {
      if (!body || !body.email || !body.name) {
        return { status: 400, error: "Name and email are required" };
      }
      const session = await authService.signup(body);
      return { status: 201, data: session };
    } catch (err: any) {
      return { status: 400, error: err.message || "Signup failed" };
    }
  }

  // POST /api/auth/oauth
  static async oauthLogin(body: OAuthLoginPayload): Promise<ApiResponse> {
    try {
      if (!body || !body.email || !body.provider) {
        return { status: 400, error: "Provider and email are required for OAuth sign-in" };
      }
      const session = await authService.oauthLogin(body);
      return { status: 200, data: session };
    } catch (err: any) {
      return { status: 400, error: err.message || "OAuth login failed" };
    }
  }

  // GET /api/auth/me
  static async getCurrentUser(identifier?: string): Promise<ApiResponse> {
    try {
      const user = await authService.getCurrentUser(identifier);
      return { status: 200, data: user };
    } catch (err: any) {
      return { status: 404, error: err.message || "User profile not found" };
    }
  }

  // PUT /api/auth/profile
  static async updateProfile(body: any): Promise<ApiResponse> {
    try {
      const userId = body.userId || "usr_bindhu";
      const updated = await authService.updateProfile(userId, body);
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update profile" };
    }
  }

  // PUT /api/auth/datetime-settings
  static async updateDateTimeSettings(body: any): Promise<ApiResponse> {
    try {
      const userId = body.userId || "usr_bindhu";
      const settings = await authService.updateDateTimeSettings(userId, body.settings || body);
      return { status: 200, data: settings };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update date & time settings" };
    }
  }

  // POST /api/auth/logout
  static async logout(body?: any): Promise<ApiResponse> {
    try {
      const token = body?.token;
      await authService.logout(token);
      return { status: 200, data: { success: true, message: "Logged out successfully" } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Logout failed" };
    }
  }

  // DELETE /api/auth/account
  static async deleteAccount(body?: any): Promise<ApiResponse> {
    try {
      const userId = body?.userId || "usr_bindhu";
      const success = await authService.deleteAccount(userId);
      return {
        status: 200,
        data: { success, message: "Account and associated data deleted successfully" },
      };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to delete account" };
    }
  }
}
