import type { AuthUser, DateTimeSettings } from "../types.ts";

export interface IUserRepository {
  getAll(): Promise<AuthUser[]>;
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
  create(userData: Partial<AuthUser> & { email: string; name: string }): Promise<AuthUser>;
  update(id: string, updates: Partial<AuthUser>): Promise<AuthUser | null>;
  updateDateTimeSettings(id: string, settings: Partial<DateTimeSettings>): Promise<DateTimeSettings | null>;
  delete(id: string): Promise<boolean>;
  resetToDefault(): Promise<AuthUser>;
  storeOtp(email: string, code: string, ttlSeconds?: number): void;
  getOtp(email: string): string | null;
  verifyAndConsumeOtp(email: string, code: string): boolean;
}

export const DEFAULT_USER: AuthUser = {
  id: "usr_bindhu",
  name: "Bindhu shree K. R",
  email: "bindhushreebindhushree28@gmail.com",
  avatarInitials: "BS",
  avatarColor: "#0088ff",
  workspace: "Bindhu's Workspace",
  workspaceRole: "Owner",
  dateTimeSettings: {
    dateFormat: "DD/MM/YYYY",
    use24HourClock: true,
    dayStart: "09:00",
    setTimeZoneAutomatically: false,
    timeZone: "GMT+05:30 Asia/Calcutta",
  },
  createdAt: "2026-01-01T00:00:00.000Z",
};

interface StoredOtp {
  code: string;
  expiresAt: number;
}

export class UserRepository implements IUserRepository {
  private users: AuthUser[] = [
    { ...DEFAULT_USER },
    {
      id: "usr_shiva",
      name: "Shivashankar B S",
      email: "shivubs1508@gmail.com",
      avatarInitials: "SB",
      avatarColor: "#1a73e8",
      workspace: "Shiva's Workspace",
      workspaceRole: "Admin",
      dateTimeSettings: {
        dateFormat: "DD/MM/YYYY",
        use24HourClock: true,
        dayStart: "09:00",
        setTimeZoneAutomatically: true,
        timeZone: "GMT+05:30 Asia/Calcutta",
      },
      createdAt: "2026-01-15T00:00:00.000Z",
    },
  ];

  private activeOtps: Map<string, StoredOtp> = new Map();

  async getAll(): Promise<AuthUser[]> {
    return [...this.users];
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const normalized = email.trim().toLowerCase();
    const found = this.users.find((u) => u.email.trim().toLowerCase() === normalized);
    return found ? { ...found } : null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const found = this.users.find((u) => u.id === id);
    return found ? { ...found } : null;
  }

  async create(userData: Partial<AuthUser> & { email: string; name: string }): Promise<AuthUser> {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const existing = await this.findByEmail(normalizedEmail);
    if (existing) {
      return existing;
    }

    const initials = userData.avatarInitials ||
      userData.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ||
      userData.email.slice(0, 2).toUpperCase();

    const newUser: AuthUser = {
      id: userData.id || `usr_${Date.now()}`,
      name: userData.name,
      email: normalizedEmail,
      avatarInitials: initials,
      avatarColor: userData.avatarColor || "#0088ff",
      avatarUrl: userData.avatarUrl,
      workspace: userData.workspace || `${userData.name}'s Workspace`,
      workspaceRole: userData.workspaceRole || "Owner",
      dateTimeSettings: userData.dateTimeSettings || {
        dateFormat: "DD/MM/YYYY",
        use24HourClock: true,
        dayStart: "09:00",
        setTimeZoneAutomatically: false,
        timeZone: "GMT+05:30 Asia/Calcutta",
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    return { ...newUser };
  }

  async update(id: string, updates: Partial<AuthUser>): Promise<AuthUser | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      dateTimeSettings: updates.dateTimeSettings
        ? { ...this.users[index].dateTimeSettings, ...updates.dateTimeSettings }
        : this.users[index].dateTimeSettings,
    };

    return { ...this.users[index] };
  }

  async updateDateTimeSettings(
    id: string,
    settings: Partial<DateTimeSettings>
  ): Promise<DateTimeSettings | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index].dateTimeSettings = {
      ...this.users[index].dateTimeSettings,
      ...settings,
    };

    return { ...this.users[index].dateTimeSettings };
  }

  async delete(id: string): Promise<boolean> {
    const prev = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < prev;
  }

  async resetToDefault(): Promise<AuthUser> {
    this.users = [{ ...DEFAULT_USER }];
    return { ...DEFAULT_USER };
  }

  storeOtp(email: string, code: string, ttlSeconds = 300): void {
    const normalized = email.trim().toLowerCase();
    this.activeOtps.set(normalized, {
      code,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  getOtp(email: string): string | null {
    const normalized = email.trim().toLowerCase();
    const stored = this.activeOtps.get(normalized);
    if (!stored) return null;
    if (Date.now() > stored.expiresAt) {
      this.activeOtps.delete(normalized);
      return null;
    }
    return stored.code;
  }

  verifyAndConsumeOtp(email: string, code: string): boolean {
    const normalized = email.trim().toLowerCase();
    // Allow standard universal test code "123456" for convenience
    if (code === "123456") {
      this.activeOtps.delete(normalized);
      return true;
    }

    const stored = this.activeOtps.get(normalized);
    if (!stored) return false;

    if (Date.now() > stored.expiresAt) {
      this.activeOtps.delete(normalized);
      return false;
    }

    if (stored.code === code.trim()) {
      this.activeOtps.delete(normalized);
      return true;
    }

    return false;
  }
}

export const userRepository = new UserRepository();
