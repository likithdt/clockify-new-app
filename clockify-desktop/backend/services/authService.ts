import type {
  DesktopUser,
  DesktopLoginPayload,
  DesktopSignUpPayload,
  DesktopOAuthPayload,
  DesktopAuthResponse,
  PasswordResetResponse,
} from "../models/authTypes";

export const DEFAULT_DESKTOP_USER: DesktopUser = {
  id: "usr_desktop_bindhu",
  name: "Bindhu shree",
  email: "sbindhu230@gmail.com",
  avatarInitials: "BS",
  avatarColor: "#00897b", // Teal matching Profile.png
  workspaceName: "GOPALAN COLLEGE OF ENGINEERING...",
  workspaceRole: "Owner",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export class AuthService {
  private users: DesktopUser[] = [{ ...DEFAULT_DESKTOP_USER }];
  private activeTokens: Map<string, string> = new Map(); // token -> userId

  async login(payload: DesktopLoginPayload): Promise<DesktopAuthResponse> {
    const email = payload.email.trim().toLowerCase();
    if (!email) {
      throw new Error("Email is required");
    }

    let user = this.users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      // Auto-provision user account
      const username = email.split("@")[0] || "User";
      const initials = username.slice(0, 2).toUpperCase();
      user = {
        id: `usr_${Date.now()}`,
        name: username,
        email,
        avatarInitials: initials,
        avatarColor: "#00897b",
        workspaceName: "My Workspace",
        workspaceRole: "Owner",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      this.users.unshift(user);
    } else {
      user.lastLoginAt = new Date().toISOString();
    }

    const token = `clk_dsk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.activeTokens.set(token, user.id);

    return { token, user: { ...user } };
  }

  async signup(payload: DesktopSignUpPayload): Promise<DesktopAuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    if (!email) throw new Error("Email is required");
    if (!name) throw new Error("Full name is required");

    let existing = this.users.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      const token = `clk_dsk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.activeTokens.set(token, existing.id);
      return { token, user: { ...existing } };
    }

    const initials =
      name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || email.slice(0, 2).toUpperCase();

    const newUser: DesktopUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatarInitials: initials,
      avatarColor: "#00897b",
      workspaceName: payload.workspaceName || `${name}'s Workspace`,
      workspaceRole: "Owner",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    const token = `clk_dsk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.activeTokens.set(token, newUser.id);

    return { token, user: { ...newUser } };
  }

  async oauthLogin(payload: DesktopOAuthPayload): Promise<DesktopAuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    let user = this.users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      const initials =
        payload.avatarInitials ||
        name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) ||
        email.slice(0, 2).toUpperCase();

      user = {
        id: `usr_${Date.now()}`,
        name,
        email,
        avatarInitials: initials,
        avatarColor: "#00897b",
        workspaceName: `${name.split(" ")[0]}'s Workspace`,
        workspaceRole: "Owner",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      this.users.unshift(user);
    } else {
      user.lastLoginAt = new Date().toISOString();
    }

    const token = `clk_dsk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.activeTokens.set(token, user.id);

    return { token, user: { ...user } };
  }

  async getCurrentUser(identifier?: string): Promise<DesktopUser> {
    if (identifier) {
      const userIdFromToken = this.activeTokens.get(identifier);
      if (userIdFromToken) {
        const found = this.users.find((u) => u.id === userIdFromToken);
        if (found) return { ...found };
      }

      const byEmail = this.users.find((u) => u.email.toLowerCase() === identifier.toLowerCase());
      if (byEmail) return { ...byEmail };

      const byId = this.users.find((u) => u.id === identifier);
      if (byId) return { ...byId };
    }

    // Default to the first user if available, or template
    if (this.users.length > 0) {
      return { ...this.users[0] };
    }
    return { ...DEFAULT_DESKTOP_USER };
  }

  async updateProfile(userId: string, updates: Partial<DesktopUser>): Promise<DesktopUser> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error(`User with ID ${userId} not found`);

    this.users[index] = {
      ...this.users[index],
      ...updates,
    };
    return { ...this.users[index] };
  }

  async logout(token?: string): Promise<boolean> {
    if (token) {
      this.activeTokens.delete(token);
    }
    return true;
  }

  async deleteAccount(userId: string): Promise<boolean> {
    this.users = this.users.filter((u) => u.id !== userId);
    for (const [tok, uid] of this.activeTokens.entries()) {
      if (uid === userId) this.activeTokens.delete(tok);
    }
    return true;
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    return {
      success: true,
      message: `If an account exists for ${email}, a password reset link has been dispatched.`,
    };
  }
}

export const authService = new AuthService();
