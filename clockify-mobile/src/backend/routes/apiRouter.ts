import { TimeTrackerController, type ApiResponse } from "../controllers/TimeTrackerController.ts";
import { SettingsController } from "../controllers/SettingsController.ts";
import { AutoTrackerController } from "../controllers/AutoTrackerController.ts";
import { ScheduleController } from "../controllers/ScheduleController.ts";

export interface RequestContext {
  method: string;
  path: string;
  query: Record<string, string>;
  body: any;
}

export async function handleApiRoute(req: RequestContext): Promise<ApiResponse> {
  const { method, path, query, body } = req;
  const normalizedPath = path.replace(/\/$/, "");

  // Timer routes
  if (normalizedPath === "/api/timer/status" && method === "GET") {
    return TimeTrackerController.getTimerStatus();
  }
  if (normalizedPath === "/api/timer/start" && method === "POST") {
    return TimeTrackerController.startTimer(body);
  }
  if (normalizedPath === "/api/timer/stop" && method === "POST") {
    return TimeTrackerController.stopTimer();
  }
  if (normalizedPath === "/api/timer/discard" && method === "POST") {
    return TimeTrackerController.discardTimer();
  }

  // Summary route
  if (normalizedPath === "/api/summary" && method === "GET") {
    return TimeTrackerController.getSummary();
  }

  // Time entries list & create
  if (normalizedPath === "/api/time-entries" && method === "GET") {
    const grouped = query.grouped !== "false";
    return TimeTrackerController.listEntries(grouped);
  }
  if (normalizedPath === "/api/time-entries" && method === "POST") {
    return TimeTrackerController.createEntry(body);
  }

  // Time entry item routes: /api/time-entries/:id
  const itemMatch = normalizedPath.match(/^\/api\/time-entries\/([^/]+)$/);
  if (itemMatch) {
    const id = itemMatch[1];
    if (method === "GET") {
      return TimeTrackerController.getEntry(id);
    }
    if (method === "PUT" || method === "PATCH") {
      return TimeTrackerController.updateEntry(id, body);
    }
    if (method === "DELETE") {
      return TimeTrackerController.deleteEntry(id);
    }
  }

  // Metadata routes
  if (normalizedPath === "/api/projects" && method === "GET") {
    return TimeTrackerController.listProjects();
  }
  if (normalizedPath === "/api/projects" && method === "POST") {
    return TimeTrackerController.createProject(body);
  }
  const taskItemMatch = normalizedPath.match(/^\/api\/projects\/([^/]+)\/tasks\/([^/]+)$/);
  if (taskItemMatch && (method === "PUT" || method === "PATCH")) {
    return TimeTrackerController.updateTask(taskItemMatch[1], taskItemMatch[2], body);
  }
  const taskListMatch = normalizedPath.match(/^\/api\/projects\/([^/]+)\/tasks$/);
  if (taskListMatch && method === "POST") {
    return TimeTrackerController.createTask(taskListMatch[1], body);
  }
  const projectItemMatch = normalizedPath.match(/^\/api\/projects\/([^/]+)$/);
  if (projectItemMatch && (method === "PUT" || method === "PATCH")) {
    return TimeTrackerController.updateProject(projectItemMatch[1], body);
  }
  if (normalizedPath === "/api/tags" && method === "GET") {
    return TimeTrackerController.listTags();
  }
  if (normalizedPath === "/api/tags" && method === "POST") {
    return TimeTrackerController.createTag(body);
  }

  // Clients routes
  if (normalizedPath === "/api/clients" && method === "GET") {
    return TimeTrackerController.listClients();
  }
  if (normalizedPath === "/api/clients" && method === "POST") {
    return TimeTrackerController.createClient(body);
  }
  const clientArchiveMatch = normalizedPath.match(/^\/api\/clients\/([^/]+)\/archive$/);
  if (clientArchiveMatch && method === "POST") {
    return TimeTrackerController.archiveClient(clientArchiveMatch[1]);
  }
  const clientMatch = normalizedPath.match(/^\/api\/clients\/([^/]+)$/);
  if (clientMatch && method === "DELETE") {
    return TimeTrackerController.deleteClient(clientMatch[1]);
  }

  // Team routes
  if (normalizedPath === "/api/team" && method === "GET") {
    return TimeTrackerController.listTeamMembers();
  }
  if (normalizedPath === "/api/team" && method === "POST") {
    return TimeTrackerController.createTeamMember(body);
  }
  const teamMatch = normalizedPath.match(/^\/api\/team\/([^/]+)$/);
  if (teamMatch && method === "DELETE") {
    return TimeTrackerController.deleteTeamMember(teamMatch[1]);
  }

  // Expenses routes
  if (normalizedPath === "/api/expenses" && method === "GET") {
    return TimeTrackerController.listExpenses();
  }
  if (normalizedPath === "/api/expenses" && method === "POST") {
    return TimeTrackerController.createExpense(body);
  }
  const expenseMatch = normalizedPath.match(/^\/api\/expenses\/([^/]+)$/);
  if (expenseMatch && method === "DELETE") {
    return TimeTrackerController.deleteExpense(expenseMatch[1]);
  }

  // Time Off routes
  if (normalizedPath === "/api/time-off" && method === "GET") {
    return TimeTrackerController.listTimeOff();
  }
  if (normalizedPath === "/api/time-off" && method === "POST") {
    return TimeTrackerController.createTimeOff(body);
  }
  const timeOffStatusMatch = normalizedPath.match(/^\/api\/time-off\/([^/]+)\/status$/);
  if (timeOffStatusMatch && (method === "PUT" || method === "PATCH")) {
    return TimeTrackerController.updateTimeOffStatus(timeOffStatusMatch[1], body.status);
  }

  // Settings routes
  if (normalizedPath === "/api/settings" && method === "GET") {
    return SettingsController.getAllSettings();
  }
  if (normalizedPath === "/api/settings/app" && method === "GET") {
    return SettingsController.getAppSettings();
  }
  if (normalizedPath === "/api/settings/app" && (method === "PUT" || method === "PATCH")) {
    return SettingsController.updateAppSettings(body);
  }
  if (normalizedPath === "/api/settings/theme" && method === "POST") {
    return SettingsController.updateTheme(body);
  }
  if (normalizedPath === "/api/settings/language" && method === "POST") {
    return SettingsController.updateLanguage(body);
  }
  if (normalizedPath === "/api/settings/offline-mode" && method === "POST") {
    return SettingsController.setForcedOfflineMode(body);
  }
  if (normalizedPath === "/api/settings/reminders" && (method === "PUT" || method === "PATCH" || method === "POST")) {
    return SettingsController.updateReminders(body);
  }
  if (normalizedPath === "/api/settings/calendar" && (method === "PUT" || method === "PATCH" || method === "POST")) {
    return SettingsController.updateCalendarSettings(body);
  }
  if (normalizedPath === "/api/settings/workspace" && method === "GET") {
    return SettingsController.getWorkspaceSettings();
  }
  if (normalizedPath === "/api/settings/workspace" && (method === "PUT" || method === "PATCH")) {
    return SettingsController.updateWorkspaceSettings(body);
  }
  if (normalizedPath === "/api/settings/workspace/default-project" && method === "POST") {
    return SettingsController.setDefaultProject(body);
  }
  if (normalizedPath === "/api/settings/workspace/notifications" && (method === "PUT" || method === "PATCH" || method === "POST")) {
    return SettingsController.updateNotifications(body);
  }
  if (normalizedPath === "/api/settings/reset" && method === "POST") {
    return SettingsController.resetSettings();
  }

  // Auto Tracker routes
  if (normalizedPath === "/api/autotracker/activities" && method === "GET") {
    return AutoTrackerController.getActivities();
  }
  if (normalizedPath === "/api/autotracker/status" && method === "GET") {
    return AutoTrackerController.getStatus();
  }
  if (normalizedPath === "/api/autotracker/toggle" && method === "POST") {
    return AutoTrackerController.toggleRecording();
  }
  if (normalizedPath === "/api/autotracker/log" && method === "POST") {
    return AutoTrackerController.logActivity(body);
  }
  if (normalizedPath === "/api/autotracker/log-all" && method === "POST") {
    return AutoTrackerController.logAll();
  }
  const autoTrackerProjectMatch = normalizedPath.match(/^\/api\/autotracker\/activity\/([^/]+)\/project$/);
  if (autoTrackerProjectMatch && (method === "PUT" || method === "PATCH")) {
    return AutoTrackerController.updateProject(autoTrackerProjectMatch[1], body);
  }
  const autoTrackerItemMatch = normalizedPath.match(/^\/api\/autotracker\/activity\/([^/]+)$/);
  if (autoTrackerItemMatch && method === "DELETE") {
    return AutoTrackerController.discardActivity(autoTrackerItemMatch[1]);
  }
  if (normalizedPath === "/api/autotracker/simulate" && method === "POST") {
    return AutoTrackerController.simulateActivity();
  }
  if (normalizedPath === "/api/autotracker/reset" && method === "POST") {
    return AutoTrackerController.reset();
  }

  // Schedule routes
  if (normalizedPath === "/api/schedule/assignments" && method === "GET") {
    return ScheduleController.listAssignments(query);
  }
  if (normalizedPath === "/api/schedule/assignments" && method === "POST") {
    return ScheduleController.createAssignment(body);
  }
  const scheduleItemMatch = normalizedPath.match(/^\/api\/schedule\/assignments\/([^/]+)$/);
  if (scheduleItemMatch) {
    const id = scheduleItemMatch[1];
    if (method === "GET") {
      return ScheduleController.getAssignment(id);
    }
    if (method === "PUT" || method === "PATCH") {
      return ScheduleController.updateAssignment(id, body);
    }
    if (method === "DELETE") {
      return ScheduleController.deleteAssignment(id);
    }
  }
  if (normalizedPath === "/api/schedule/toggle-publish" && method === "POST") {
    return ScheduleController.togglePublish();
  }
  if (normalizedPath === "/api/schedule/remove-sample" && method === "POST") {
    return ScheduleController.removeSampleData();
  }
  if (normalizedPath === "/api/schedule/restore-sample" && method === "POST") {
    return ScheduleController.restoreSampleData();
  }
  if (normalizedPath === "/api/schedule/summary" && method === "GET") {
    return ScheduleController.getSummary();
  }

  // Test seed / clear helpers
  if (normalizedPath === "/api/seed-sample-data" && method === "POST") {
    return TimeTrackerController.seedSampleData();
  }
  if (normalizedPath === "/api/clear-data" && method === "POST") {
    return TimeTrackerController.clearData();
  }

  return { status: 404, error: `API route '${method} ${path}' not found` };
}


