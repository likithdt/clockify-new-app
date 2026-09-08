import assert from "node:assert";
import test from "node:test";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("API: Settings initial state and retrieval", async () => {
  // Reset settings
  const resetRes = await handleApiRoute({ method: "POST", path: "/api/settings/reset", query: {}, body: {} });
  assert.strictEqual(resetRes.status, 200);

  // Fetch full settings
  const res = await handleApiRoute({ method: "GET", path: "/api/settings", query: {}, body: {} });
  assert.strictEqual(res.status, 200);
  assert.ok(res.data.app);
  assert.ok(res.data.workspace);

  // App settings defaults matching reference images
  assert.strictEqual(res.data.app.theme, "system");
  assert.strictEqual(res.data.app.themeLabel, "System default");
  assert.strictEqual(res.data.app.language, "auto");
  assert.strictEqual(res.data.app.languageLabel, "Set automatically");
  assert.strictEqual(res.data.app.forcedOfflineMode, false);
  assert.strictEqual(res.data.app.reminders.enabled, false);
  assert.strictEqual(res.data.app.calendar.showWorkingDaysOnly, false);
  assert.strictEqual(res.data.app.calendar.calendarAccessStatus, "disabled");
  assert.strictEqual(res.data.app.appVersion, "4.2.1-200461.09.02.05");

  // Workspace settings defaults matching reference images
  assert.strictEqual(res.data.workspace.defaultProjectId, null);
  assert.strictEqual(res.data.workspace.defaultProjectName, "None");
  assert.ok(res.data.workspace.notifications);
  assert.strictEqual(res.data.workspace.notifications.notificationsEnabled, true);
});

test("API: Update App Theme and Language", async () => {
  // 1. Update theme to dark
  const themeRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/theme",
    query: {},
    body: { theme: "dark" },
  });
  assert.strictEqual(themeRes.status, 200);
  assert.strictEqual(themeRes.data.theme, "dark");
  assert.strictEqual(themeRes.data.themeLabel, "Dark theme");

  // 2. Reject invalid theme
  const invalidThemeRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/theme",
    query: {},
    body: { theme: "invalid-theme" },
  });
  assert.strictEqual(invalidThemeRes.status, 400);

  // 3. Update language to French
  const langRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/language",
    query: {},
    body: { language: "fr" },
  });
  assert.strictEqual(langRes.status, 200);
  assert.strictEqual(langRes.data.language, "fr");
  assert.strictEqual(langRes.data.languageLabel, "Français");
});

test("API: Toggle Forced Offline Mode", async () => {
  const offlineOnRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/offline-mode",
    query: {},
    body: { forcedOfflineMode: true },
  });
  assert.strictEqual(offlineOnRes.status, 200);
  assert.strictEqual(offlineOnRes.data.forcedOfflineMode, true);

  const offlineOffRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/offline-mode",
    query: {},
    body: { forcedOfflineMode: false },
  });
  assert.strictEqual(offlineOffRes.status, 200);
  assert.strictEqual(offlineOffRes.data.forcedOfflineMode, false);
});

test("API: Configure Reminders and Calendar Settings", async () => {
  // 1. Reminders
  const remindersRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/reminders",
    query: {},
    body: {
      enabled: true,
      startTime: "08:30",
      endTime: "18:00",
      workDays: [1, 2, 3, 4, 5],
    },
  });
  assert.strictEqual(remindersRes.status, 200);
  assert.strictEqual(remindersRes.data.reminders.enabled, true);
  assert.strictEqual(remindersRes.data.reminders.startTime, "08:30");
  assert.strictEqual(remindersRes.data.reminders.endTime, "18:00");

  // 2. Calendar
  const calendarRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/calendar",
    query: {},
    body: {
      integrationEnabled: true,
      showWorkingDaysOnly: true,
    },
  });
  assert.strictEqual(calendarRes.status, 200);
  assert.strictEqual(calendarRes.data.calendar.integrationEnabled, true);
  assert.strictEqual(calendarRes.data.calendar.showWorkingDaysOnly, true);
  assert.strictEqual(calendarRes.data.calendar.calendarAccessStatus, "enabled");
});

test("API: Workspace Default Project and Notifications", async () => {
  // 1. Set default project to sample project "proj-1"
  const defaultProjRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/workspace/default-project",
    query: {},
    body: { projectId: "proj-1" },
  });
  assert.strictEqual(defaultProjRes.status, 200);
  assert.strictEqual(defaultProjRes.data.defaultProjectId, "proj-1");
  assert.strictEqual(defaultProjRes.data.defaultProjectName, "[SAMPLE] Internal Project");
  assert.strictEqual(defaultProjRes.data.defaultProjectColor, "#03a9f4");

  // 2. Unset default project
  const unsetRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/workspace/default-project",
    query: {},
    body: { projectId: null },
  });
  assert.strictEqual(unsetRes.status, 200);
  assert.strictEqual(unsetRes.data.defaultProjectId, null);
  assert.strictEqual(unsetRes.data.defaultProjectName, "None");

  // 3. Update notification preferences
  const notifRes = await handleApiRoute({
    method: "POST",
    path: "/api/settings/workspace/notifications",
    query: {},
    body: {
      emailNotifications: true,
      timerAutoStop: true,
    },
  });
  assert.strictEqual(notifRes.status, 200);
  assert.strictEqual(notifRes.data.notifications.emailNotifications, true);
  assert.strictEqual(notifRes.data.notifications.timerAutoStop, true);
});
