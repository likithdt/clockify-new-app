import type {
  AppLanguage,
  AppTheme,
  MobileAppSettings,
  MobileSettingsState,
  WorkspaceNotificationSettings,
  WorkspaceSettings,
} from "../types.ts";
import { projectRepository } from "./ProjectRepository.ts";

export const THEME_LABELS: Record<AppTheme, string> = {
  system: "System default",
  dark: "Dark theme",
  light: "Light theme",
};

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  auto: "Set automatically",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  it: "Italiano",
};

const DEFAULT_SETTINGS: MobileSettingsState = {
  app: {
    theme: "system",
    themeLabel: "System default",
    language: "auto",
    languageLabel: "Set automatically",
    forcedOfflineMode: false,
    reminders: {
      enabled: false,
      workDays: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "17:00",
      intervalMinutes: 120,
    },
    calendar: {
      integrationEnabled: false,
      calendarAccessStatus: "disabled",
      showWorkingDaysOnly: false,
      syncedCalendars: [],
    },
    appVersion: "4.2.1-200461.09.02.05",
  },
  workspace: {
    id: "ws-mobile-settings",
    workspaceId: "ws-default",
    workspaceName: "Default Workspace",
    defaultProjectId: null,
    defaultProjectName: "None",
    defaultProjectColor: null,
    notifications: {
      notificationsEnabled: true,
      pushNotifications: true,
      emailNotifications: false,
      timeTrackingReminders: true,
      timerAutoStop: false,
      weeklyReportReminder: true,
      timeOffAlerts: true,
    },
  },
};

const STORAGE_KEY = "clockify_mobile_settings";

export interface ISettingsRepository {
  getSettings(): Promise<MobileSettingsState>;
  getAppSettings(): Promise<MobileAppSettings>;
  updateAppSettings(updates: Partial<MobileAppSettings>): Promise<MobileAppSettings>;
  getWorkspaceSettings(): Promise<WorkspaceSettings>;
  updateWorkspaceSettings(updates: Partial<WorkspaceSettings>): Promise<WorkspaceSettings>;
  setDefaultProject(projectId: string | null): Promise<WorkspaceSettings>;
  updateNotifications(notifications: Partial<WorkspaceNotificationSettings>): Promise<WorkspaceSettings>;
  resetToDefaults(): Promise<MobileSettingsState>;
}

export class SettingsRepository implements ISettingsRepository {
  private state: MobileSettingsState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): MobileSettingsState {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            app: {
              ...DEFAULT_SETTINGS.app,
              ...parsed.app,
              themeLabel: THEME_LABELS[parsed.app?.theme as AppTheme] || DEFAULT_SETTINGS.app.themeLabel,
              languageLabel: LANGUAGE_LABELS[parsed.app?.language as AppLanguage] || DEFAULT_SETTINGS.app.languageLabel,
              reminders: {
                ...DEFAULT_SETTINGS.app.reminders,
                ...parsed.app?.reminders,
              },
              calendar: {
                ...DEFAULT_SETTINGS.app.calendar,
                ...parsed.app?.calendar,
              },
            },
            workspace: {
              ...DEFAULT_SETTINGS.workspace,
              ...parsed.workspace,
              notifications: {
                ...DEFAULT_SETTINGS.workspace.notifications,
                ...parsed.workspace?.notifications,
              },
            },
          };
        }
      } catch (e) {
        console.warn("Failed to load settings from storage, using defaults", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  private saveToStorage(): void {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn("Failed to save settings to localStorage", e);
      }
    }
  }

  async getSettings(): Promise<MobileSettingsState> {
    return JSON.parse(JSON.stringify(this.state));
  }

  async getAppSettings(): Promise<MobileAppSettings> {
    return JSON.parse(JSON.stringify(this.state.app));
  }

  async updateAppSettings(updates: Partial<MobileAppSettings>): Promise<MobileAppSettings> {
    const current = this.state.app;
    const nextTheme = updates.theme ?? current.theme;
    const nextLang = updates.language ?? current.language;

    this.state.app = {
      ...current,
      ...updates,
      theme: nextTheme,
      themeLabel: THEME_LABELS[nextTheme] || current.themeLabel,
      language: nextLang,
      languageLabel: LANGUAGE_LABELS[nextLang] || current.languageLabel,
      reminders: {
        ...current.reminders,
        ...(updates.reminders || {}),
      },
      calendar: {
        ...current.calendar,
        ...(updates.calendar || {}),
      },
    };

    this.saveToStorage();
    return JSON.parse(JSON.stringify(this.state.app));
  }

  async getWorkspaceSettings(): Promise<WorkspaceSettings> {
    return JSON.parse(JSON.stringify(this.state.workspace));
  }

  async updateWorkspaceSettings(updates: Partial<WorkspaceSettings>): Promise<WorkspaceSettings> {
    this.state.workspace = {
      ...this.state.workspace,
      ...updates,
      notifications: {
        ...this.state.workspace.notifications,
        ...(updates.notifications || {}),
      },
    };

    this.saveToStorage();
    return JSON.parse(JSON.stringify(this.state.workspace));
  }

  async setDefaultProject(projectId: string | null): Promise<WorkspaceSettings> {
    if (!projectId || projectId === "none") {
      this.state.workspace.defaultProjectId = null;
      this.state.workspace.defaultProjectName = "None";
      this.state.workspace.defaultProjectColor = null;
    } else {
      const project = await projectRepository.getById(projectId);
      if (project) {
        this.state.workspace.defaultProjectId = project.id;
        this.state.workspace.defaultProjectName = project.name;
        this.state.workspace.defaultProjectColor = project.color;
      } else {
        this.state.workspace.defaultProjectId = null;
        this.state.workspace.defaultProjectName = "None";
        this.state.workspace.defaultProjectColor = null;
      }
    }

    this.saveToStorage();
    return JSON.parse(JSON.stringify(this.state.workspace));
  }

  async updateNotifications(notifications: Partial<WorkspaceNotificationSettings>): Promise<WorkspaceSettings> {
    this.state.workspace.notifications = {
      ...this.state.workspace.notifications,
      ...notifications,
    };

    this.saveToStorage();
    return JSON.parse(JSON.stringify(this.state.workspace));
  }

  async resetToDefaults(): Promise<MobileSettingsState> {
    this.state = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.saveToStorage();
    return JSON.parse(JSON.stringify(this.state));
  }
}

export const settingsRepository = new SettingsRepository();
