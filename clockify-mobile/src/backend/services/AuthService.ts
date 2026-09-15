import { userRepository, DEFAULT_USER } from "../repositories/UserRepository.ts";
import type {
  AuthUser,
  DateTimeSettings,
  AuthSessionResponse,
  OAuthLoginPayload,
  SignUpPayload,
} from "../types.ts";

export class AuthService {
  private activeSessions: Map<string, string> = new Map(); // token -> userId

  // Generate 6 digit numeric OTP
  async requestOtp(email: string): Promise<{ code: string; message: string; expiresInSeconds: number }> {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      throw new Error("Invalid email address provided");
    }

    // Generate realistic 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    userRepository.storeOtp(trimmed, code, 300);

    return {
      code,
      message: `Verification code sent to ${trimmed}`,
      expiresInSeconds: 300,
    };
  }

  // Verify OTP and issue session
  async verifyOtp(email: string, code: string): Promise<AuthSessionResponse> {
    const trimmed = email.trim().toLowerCase();
    const isValid = userRepository.verifyAndConsumeOtp(trimmed, code);

    if (!isValid) {
      throw new Error("Invalid or expired verification code. Use 123456 for universal quick access.");
    }

    let user = await userRepository.findByEmail(trimmed);
    if (!user) {
      // Auto-provision user on first verified OTP
      const fallbackName = trimmed.split("@")[0] || "Clockify User";
      user = await userRepository.create({
        email: trimmed,
        name: fallbackName,
      });
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // Email / Password or quick login
  async login(email: string): Promise<AuthSessionResponse> {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      throw new Error("Email is required");
    }

    let user = await userRepository.findByEmail(trimmed);
    if (!user) {
      // Create account automatically
      const fallbackName = trimmed.split("@")[0] || "User";
      user = await userRepository.create({
        email: trimmed,
        name: fallbackName,
      });
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // Sign up new user
  async signup(payload: SignUpPayload): Promise<AuthSessionResponse> {
    const { name, email, workspaceName } = payload;
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) throw new Error("Email is required");
    if (!trimmedName) throw new Error("Name is required");

    let user = await userRepository.findByEmail(trimmedEmail);
    if (user) {
      // Return existing user session
      const token = this.generateToken(user.id);
      return { token, user };
    }

    user = await userRepository.create({
      name: trimmedName,
      email: trimmedEmail,
      workspace: workspaceName || `${trimmedName}'s Workspace`,
    });

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // OAuth sign-in (Google / Microsoft)
  async oauthLogin(payload: OAuthLoginPayload): Promise<AuthSessionResponse> {
    const { email, name, avatarInitials } = payload;
    const trimmedEmail = email.trim().toLowerCase();

    let user = await userRepository.findByEmail(trimmedEmail);
    if (!user) {
      user = await userRepository.create({
        email: trimmedEmail,
        name,
        avatarInitials,
        workspace: `${name}'s Workspace`,
      });
    } else {
      // Update name/initials if provided
      user = await userRepository.update(user.id, {
        name: name || user.name,
        avatarInitials: avatarInitials || user.avatarInitials,
        lastLoginAt: new Date().toISOString(),
      }) || user;
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  // Retrieve current active user profile
  async getCurrentUser(identifier?: string): Promise<AuthUser> {
    if (identifier) {
      // Check if identifier is token
      const userIdFromToken = this.activeSessions.get(identifier);
      if (userIdFromToken) {
        const user = await userRepository.findById(userIdFromToken);
        if (user) return user;
      }

      // Check if identifier is email
      const userByEmail = await userRepository.findByEmail(identifier);
      if (userByEmail) return userByEmail;

      // Check if identifier is user ID
      const userById = await userRepository.findById(identifier);
      if (userById) return userById;
    }

    // Default to the first user (Bindhu shree K. R)
    const all = await userRepository.getAll();
    return all[0] || DEFAULT_USER;
  }

  // Update profile attributes (name, avatar, initials)
  async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const updated = await userRepository.update(userId, data);
    if (!updated) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return updated;
  }

  // Update date & time settings matching Profile.jpeg
  async updateDateTimeSettings(
    userId: string,
    settings: Partial<DateTimeSettings>
  ): Promise<DateTimeSettings> {
    const updated = await userRepository.updateDateTimeSettings(userId, settings);
    if (!updated) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return updated;
  }

  // Delete account completely
  async deleteAccount(userId: string): Promise<boolean> {
    // Invalidate sessions
    for (const [token, uid] of this.activeSessions.entries()) {
      if (uid === userId) {
        this.activeSessions.delete(token);
      }
    }
    return await userRepository.delete(userId);
  }

  // Invalidate session on logout
  async logout(token?: string): Promise<boolean> {
    if (token) {
      this.activeSessions.delete(token);
    }
    return true;
  }

  private generateToken(userId: string): string {
    const token = `clk_sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    this.activeSessions.set(token, userId);
    return token;
  }
}

export const authService = new AuthService();
