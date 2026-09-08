import type { ApiResponse } from "./TimeTrackerController.ts";
import { settingsService } from "../services/SettingsService.ts";

export class SettingsController {
  static async getAllSettings(): Promise<ApiResponse> {
    try {
      const data = await settingsService.getAllSettings();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to fetch settings" };
    }
  }

  static async getAppSettings(): Promise<ApiResponse> {
    try {
      const data = await settingsService.getAppSettings();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to fetch app settings" };
    }
  }

  static async updateAppSettings(body: any): Promise<ApiResponse> {
    try {
      const data = await settingsService.updateAppSettings(body);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update app settings" };
    }
  }

  static async updateTheme(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.theme) {
        return { status: 400, error: "Theme is required ('system' | 'dark' | 'light')" };
      }
      const data = await settingsService.updateTheme(body.theme);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update theme" };
    }
  }

  static async updateLanguage(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.language) {
        return { status: 400, error: "Language code is required" };
      }
      const data = await settingsService.updateLanguage(body.language);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update language" };
    }
  }

  static async setForcedOfflineMode(body: any): Promise<ApiResponse> {
    try {
      if (body === undefined || body.forcedOfflineMode === undefined) {
        return { status: 400, error: "forcedOfflineMode boolean is required" };
      }
      const data = await settingsService.setForcedOfflineMode(Boolean(body.forcedOfflineMode));
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to set forced offline mode" };
    }
  }

  static async updateReminders(body: any): Promise<ApiResponse> {
    try {
      const data = await settingsService.updateReminders(body || {});
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update reminder settings" };
    }
  }

  static async updateCalendarSettings(body: any): Promise<ApiResponse> {
    try {
      const data = await settingsService.updateCalendarSettings(body || {});
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update calendar settings" };
    }
  }

  static async getWorkspaceSettings(): Promise<ApiResponse> {
    try {
      const data = await settingsService.getWorkspaceSettings();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to fetch workspace settings" };
    }
  }

  static async updateWorkspaceSettings(body: any): Promise<ApiResponse> {
    try {
      const data = await settingsService.updateWorkspaceSettings(body || {});
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update workspace settings" };
    }
  }

  static async setDefaultProject(body: any): Promise<ApiResponse> {
    try {
      const projectId = body?.projectId === undefined ? null : body.projectId;
      const data = await settingsService.setDefaultProject(projectId);
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to set default project" };
    }
  }

  static async updateNotifications(body: any): Promise<ApiResponse> {
    try {
      const data = await settingsService.updateNotifications(body || {});
      return { status: 200, data };
    } catch (err: any) {
      return { status: 400, error: err.message || "Failed to update notification settings" };
    }
  }

  static async resetSettings(): Promise<ApiResponse> {
    try {
      const data = await settingsService.resetSettings();
      return { status: 200, data };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to reset settings" };
    }
  }
}
