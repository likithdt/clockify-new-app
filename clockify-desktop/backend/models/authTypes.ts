export interface DateTimePreferences {
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "DD.MM.YYYY";
  use24HourClock: boolean;
  dayStart: string;
  dayEnd: string;
  weekStart: "Monday" | "Sunday" | "Saturday";
  timeZone: string;
  autoTimeZone: boolean;
}

export interface DesktopUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  workspaceName: string;
  workspaceRole: string;
  preferences?: DateTimePreferences;
  theme?: "light" | "dark";
  createdAt: string;
  lastLoginAt?: string;
}

export interface DesktopLoginPayload {
  email: string;
  password?: string;
  stayLoggedIn?: boolean;
}

export interface DesktopSignUpPayload {
  name: string;
  email: string;
  password?: string;
  termsAccepted: boolean;
  workspaceName?: string;
}

export interface DesktopOAuthPayload {
  provider: "google" | "microsoft" | "apple";
  email: string;
  name: string;
  avatarInitials?: string;
}

export interface DesktopAuthResponse {
  token: string;
  user: DesktopUser;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}
