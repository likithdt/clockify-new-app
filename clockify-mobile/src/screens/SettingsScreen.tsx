import React, { useState, useEffect } from "react";
import type {
  AppLanguage,
  AppTheme,
  CalendarSettings,
  MobileSettingsState,
  Project,
  ReminderSettings,
  WorkspaceNotificationSettings,
} from "../backend/types.ts";
import { settingsService } from "../backend/services/SettingsService.ts";
import { projectRepository } from "../backend/repositories/ProjectRepository.ts";
import { Switch } from "../components/ui/Switch.tsx";
import { ThemeModal } from "../components/modals/ThemeModal.tsx";
import { LanguageModal } from "../components/modals/LanguageModal.tsx";
import { ReminderModal } from "../components/modals/ReminderModal.tsx";
import { CalendarIntegrationModal } from "../components/modals/CalendarIntegrationModal.tsx";
import { DefaultProjectModal } from "../components/modals/DefaultProjectModal.tsx";
import { NotificationSettingsModal } from "../components/modals/NotificationSettingsModal.tsx";
import { AppVersionModal } from "../components/modals/AppVersionModal.tsx";
import { CheckCircle, AlertCircle } from "lucide-react";

interface SettingsScreenProps {
  onDefaultProjectChange?: (projectId: string | null, projectName: string) => void;
  onOfflineModeChange?: (isOffline: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onDefaultProjectChange,
  onOfflineModeChange,
}) => {
  const [activeTab, setActiveTab] = useState<"app" | "workspace">("app");
  const [settings, setSettings] = useState<MobileSettingsState | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals visibility state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isDefaultProjectModalOpen, setIsDefaultProjectModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allSettings, allProjects] = await Promise.all([
        settingsService.getAllSettings(),
        projectRepository.getAll(),
      ]);
      setSettings(allSettings);
      setProjects(allProjects);
    } catch (e) {
      console.error("Failed to load settings data", e);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handler: Theme
  const handleThemeSelect = async (theme: AppTheme) => {
    try {
      const updatedApp = await settingsService.updateTheme(theme);
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast(`Theme changed to ${updatedApp.themeLabel}`);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Language
  const handleLanguageSelect = async (language: AppLanguage) => {
    try {
      const updatedApp = await settingsService.updateLanguage(language);
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast(`Language set to ${updatedApp.languageLabel}`);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Forced Offline Mode
  const handleToggleOfflineMode = async (enabled: boolean) => {
    try {
      const updatedApp = await settingsService.setForcedOfflineMode(enabled);
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      onOfflineModeChange?.(enabled);
      showToast(
        enabled
          ? "Forced offline mode enabled. Changes will sync when reconnected."
          : "Offline mode disabled. Connected to sync server."
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Reminder Toggle
  const handleToggleReminders = async (enabled: boolean) => {
    try {
      const updatedApp = await settingsService.updateReminders({ enabled });
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast(enabled ? "Reminders enabled" : "Reminders disabled");
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Reminder Details Save
  const handleSaveReminders = async (reminders: ReminderSettings) => {
    try {
      const updatedApp = await settingsService.updateReminders(reminders);
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast("Reminder preferences updated");
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Calendar Working Days Toggle
  const handleToggleWorkingDaysOnly = async (enabled: boolean) => {
    try {
      const updatedApp = await settingsService.updateCalendarSettings({
        showWorkingDaysOnly: enabled,
      });
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast(
        enabled
          ? "Calendar set to show working days only"
          : "Calendar set to show all days"
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Calendar Integration Save
  const handleSaveCalendar = async (calendar: CalendarSettings) => {
    try {
      const updatedApp = await settingsService.updateCalendarSettings(calendar);
      setSettings((prev) => (prev ? { ...prev, app: updatedApp } : prev));
      showToast(
        calendar.integrationEnabled
          ? "Calendar integration enabled"
          : "Calendar integration disabled"
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Default Project Select
  const handleDefaultProjectSelect = async (projectId: string | null) => {
    try {
      const updatedWs = await settingsService.setDefaultProject(projectId);
      setSettings((prev) => (prev ? { ...prev, workspace: updatedWs } : prev));
      onDefaultProjectChange?.(
        updatedWs.defaultProjectId,
        updatedWs.defaultProjectName
      );
      showToast(
        projectId
          ? `Default project set to ${updatedWs.defaultProjectName}`
          : "Default project set to None"
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Workspace Notifications Save
  const handleSaveNotifications = async (
    notifications: WorkspaceNotificationSettings
  ) => {
    try {
      const updatedWs = await settingsService.updateNotifications(notifications);
      setSettings((prev) => (prev ? { ...prev, workspace: updatedWs } : prev));
      showToast("Workspace notifications updated");
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!settings) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121517] text-[#8c9ba8]">
        <div className="text-sm">Loading settings...</div>
      </div>
    );
  }

  const { app, workspace } = settings;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#121517] text-white overflow-hidden relative select-none">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="absolute top-2 left-4 right-4 z-40 flex items-center gap-2 bg-[#1e2530] border border-[#03a9f4]/40 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-xl animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-[#03a9f4] shrink-0" />
          <span className="flex-1 truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Tabs: App & Workspace */}
      <div className="flex border-b border-[#232932] bg-[#121517] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("app")}
          className={`flex-1 py-3 text-center text-sm font-semibold relative transition-colors ${
            activeTab === "app" ? "text-white" : "text-[#8c9ba8] hover:text-white"
          }`}
        >
          App
          {activeTab === "app" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#03a9f4]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("workspace")}
          className={`flex-1 py-3 text-center text-sm font-semibold relative transition-colors ${
            activeTab === "workspace"
              ? "text-white"
              : "text-[#8c9ba8] hover:text-white"
          }`}
        >
          Workspace
          {activeTab === "workspace" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#03a9f4]" />
          )}
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* ===================== TAB: APP ===================== */}
        {activeTab === "app" && (
          <div className="space-y-6 animate-fadeIn">
            {/* GENERAL SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                GENERAL
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden divide-y divide-[#262e38]">
                {/* App Theme */}
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#232932] transition-colors"
                >
                  <div>
                    <div className="text-[15px] font-normal text-white">
                      App theme
                    </div>
                    <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal">
                      {app.themeLabel}
                    </div>
                  </div>
                </button>

                {/* Language */}
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#232932] transition-colors"
                >
                  <div>
                    <div className="text-[15px] font-normal text-white">
                      Language
                    </div>
                    <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal">
                      {app.languageLabel}
                    </div>
                  </div>
                </button>

                {/* Forced Offline Mode */}
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <div className="pr-3">
                    <div className="text-[15px] font-normal text-white">
                      Forced offline mode
                    </div>
                    <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal">
                      Use Clockify without internet connection
                    </div>
                  </div>
                  <Switch
                    checked={app.forcedOfflineMode}
                    onChange={handleToggleOfflineMode}
                    aria-label="Forced offline mode"
                  />
                </div>
              </div>
            </div>

            {/* REMINDERS SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                REMINDERS
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden">
                <div
                  onClick={() => setIsReminderModalOpen(true)}
                  className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#232932] transition-colors"
                >
                  <div className="pr-3">
                    <div className="text-[15px] font-normal text-white">
                      Remind to track time
                    </div>
                    <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal leading-relaxed">
                      Choose when you'd like to get reminders to start and stop
                      tracking your time.
                    </div>
                  </div>
                  <Switch
                    checked={app.reminders.enabled}
                    onChange={handleToggleReminders}
                    aria-label="Remind to track time"
                  />
                </div>
              </div>
            </div>

            {/* CALENDAR SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                CALENDAR
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden divide-y divide-[#262e38]">
                {/* Calendar Integration */}
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-[#232932] transition-colors"
                >
                  <div>
                    <div className="text-[15px] font-normal text-white">
                      Calendar integration
                    </div>
                    <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal">
                      {app.calendar.integrationEnabled
                        ? "Calendar access enabled"
                        : "Calendar access disabled"}
                    </div>
                  </div>
                </button>

                {/* Show Working Days Only */}
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-normal text-white">
                      Show working days only
                    </div>
                  </div>
                  <Switch
                    checked={app.calendar.showWorkingDaysOnly}
                    onChange={handleToggleWorkingDaysOnly}
                    aria-label="Show working days only"
                  />
                </div>
              </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                ABOUT
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left hover:bg-[#232932] transition-colors"
                >
                  <div className="text-[15px] font-normal text-white">
                    App version
                  </div>
                  <div className="text-xs text-[#8c9ba8] mt-0.5 font-normal">
                    {app.appVersion}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: WORKSPACE ===================== */}
        {activeTab === "workspace" && (
          <div className="space-y-6 animate-fadeIn">
            {/* GENERAL SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                GENERAL
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left hover:bg-[#232932] transition-colors"
                >
                  <div className="text-[15px] font-normal text-white">
                    Notifications
                  </div>
                </button>
              </div>
            </div>

            {/* DEFAULTS SECTION */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold tracking-wider text-[#7e8b9b] uppercase px-1">
                DEFAULTS
              </h2>
              <div className="bg-[#1b2027] border border-[#262e38] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsDefaultProjectModalOpen(true)}
                  className="w-full px-4 py-3.5 text-left hover:bg-[#232932] transition-colors"
                >
                  <div className="text-[15px] font-normal text-white">
                    Default project
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {workspace.defaultProjectColor && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: workspace.defaultProjectColor }}
                      />
                    )}
                    <span className="text-xs text-[#8c9ba8] font-normal">
                      {workspace.defaultProjectName}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        currentTheme={app.theme}
        onSelect={handleThemeSelect}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        currentLanguage={app.language}
        onSelect={handleLanguageSelect}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        settings={app.reminders}
        onSave={handleSaveReminders}
        onClose={() => setIsReminderModalOpen(false)}
      />

      <CalendarIntegrationModal
        isOpen={isCalendarModalOpen}
        settings={app.calendar}
        onSave={handleSaveCalendar}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      <DefaultProjectModal
        isOpen={isDefaultProjectModalOpen}
        projects={projects}
        currentProjectId={workspace.defaultProjectId}
        onSelect={handleDefaultProjectSelect}
        onClose={() => setIsDefaultProjectModalOpen(false)}
      />

      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        notifications={workspace.notifications}
        onSave={handleSaveNotifications}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <AppVersionModal
        isOpen={isVersionModalOpen}
        version={app.appVersion}
        onClose={() => setIsVersionModalOpen(false)}
      />
    </div>
  );
};
