import type {
  AppLanguage,
  AppTheme,
  CalendarSettings,
  MobileAppSettings,
  MobileSettingsState,
  ReminderSettings,
  WorkspaceNotificationSettings,
  WorkspaceSettings,
} from "../types.ts";
import {
  LANGUAGE_LABELS,
  settingsRepository,
  THEME_LABELS,
  type ISettingsRepository,
} from "../repositories/SettingsRepository.ts";

export class SettingsService {
  constructor(private repo: ISettingsRepository = settingsRepository) {}

  async getAllSettings(): Promise<MobileSettingsState> {
    return this.repo.getSettings();
  }

  async getAppSettings(): Promise<MobileAppSettings> {
    return this.repo.getAppSettings();
  }

  async updateTheme(theme: AppTheme): Promise<MobileAppSettings> {
    if (!THEME_LABELS[theme]) {
      throw new Error(`Invalid theme: "${theme}". Allowed: system, dark, light`);
    }
    return this.repo.updateAppSettings({ theme });
  }

  async updateLanguage(language: AppLanguage): Promise<MobileAppSettings> {
    if (!LANGUAGE_LABELS[language]) {
      throw new Error(`Invalid language code: "${language}"`);
    }
    return this.repo.updateAppSettings({ language });
  }

  async setForcedOfflineMode(forcedOfflineMode: boolean): Promise<MobileAppSettings> {
    return this.repo.updateAppSettings({ forcedOfflineMode: Boolean(forcedOfflineMode) });
  }

  async updateReminders(payload: Partial<ReminderSettings>): Promise<MobileAppSettings> {
    const updates: Partial<ReminderSettings> = {};
    if (typeof payload.enabled === "boolean") updates.enabled = payload.enabled;
    if (Array.isArray(payload.workDays)) {
      updates.workDays = payload.workDays.filter((d) => d >= 1 && d <= 7);
    }
    if (payload.startTime && /^\d{2}:\d{2}$/.test(payload.startTime)) {
      updates.startTime = payload.startTime;
    }
    if (payload.endTime && /^\d{2}:\d{2}$/.test(payload.endTime)) {
      updates.endTime = payload.endTime;
    }
    if (typeof payload.intervalMinutes === "number" && payload.intervalMinutes > 0) {
      updates.intervalMinutes = payload.intervalMinutes;
    }

    return this.repo.updateAppSettings({ reminders: updates as ReminderSettings });
  }

  async updateCalendarSettings(payload: Partial<CalendarSettings>): Promise<MobileAppSettings> {
    const updates: Partial<CalendarSettings> = {};
    if (typeof payload.integrationEnabled === "boolean") {
      updates.integrationEnabled = payload.integrationEnabled;
      updates.calendarAccessStatus = payload.integrationEnabled ? "enabled" : "disabled";
    }
    if (typeof payload.showWorkingDaysOnly === "boolean") {
      updates.showWorkingDaysOnly = payload.showWorkingDaysOnly;
    }
    if (Array.isArray(payload.syncedCalendars)) {
      updates.syncedCalendars = payload.syncedCalendars;
    }

    return this.repo.updateAppSettings({ calendar: updates as CalendarSettings });
  }

  async updateAppSettings(updates: Partial<MobileAppSettings>): Promise<MobileAppSettings> {
    return this.repo.updateAppSettings(updates);
  }

  async getWorkspaceSettings(): Promise<WorkspaceSettings> {
    return this.repo.getWorkspaceSettings();
  }

  async setDefaultProject(projectId: string | null): Promise<WorkspaceSettings> {
    return this.repo.setDefaultProject(projectId);
  }

  async updateNotifications(notifications: Partial<WorkspaceNotificationSettings>): Promise<WorkspaceSettings> {
    return this.repo.updateNotifications(notifications);
  }

  async updateWorkspaceSettings(updates: Partial<WorkspaceSettings>): Promise<WorkspaceSettings> {
    return this.repo.updateWorkspaceSettings(updates);
  }

  async resetSettings(): Promise<MobileSettingsState> {
    return this.repo.resetToDefaults();
  }
}

export const settingsService = new SettingsService();
