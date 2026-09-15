export interface DesktopUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  workspaceName: string;
  workspaceRole: string;
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
