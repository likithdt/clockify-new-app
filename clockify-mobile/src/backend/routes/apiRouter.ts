import { WorkspaceController } from "../controllers/WorkspaceController.ts";
import { ReportsController } from "../controllers/ReportsController.ts";
import type { ApiResponse } from "../types.ts";

export interface RequestContext {
  method: string;
  path: string;
  query: Record<string, string>;
  body: any;
}

export async function handleApiRoute(req: RequestContext): Promise<ApiResponse> {
  const { method, path, body } = req;
  const normalizedPath = path.replace(/\/$/, "");

  // Reports routes
  if (normalizedPath === "/api/reports/summary" && method === "GET") {
    return ReportsController.getSummaryReport();
  }
  if (normalizedPath === "/api/reports/detailed" && method === "GET") {
    return ReportsController.getDetailedReport();
  }
  if (normalizedPath === "/api/reports/weekly" && method === "GET") {
    return ReportsController.getWeeklyReport();
  }
  if (normalizedPath === "/api/reports/export" && method === "POST") {
    return ReportsController.exportReport(body?.type || "PDF", body?.settings);
  }

  // Workspace Settings
  if (normalizedPath === "/api/workspace/settings") {
    if (method === "GET") {
      return WorkspaceController.getSettings();
    }
    if (method === "PUT" || method === "PATCH") {
      return WorkspaceController.updateSettings(body || {});
    }
  }

  // Plans & Upgrade
  if (normalizedPath === "/api/workspace/plans" && method === "GET") {
    return WorkspaceController.getPlans();
  }
  if (normalizedPath === "/api/workspace/upgrade" && method === "POST") {
    return WorkspaceController.upgrade(body?.planId, body?.billingCycle);
  }

  // Subscription Details
  if (normalizedPath === "/api/workspace/subscription" && method === "GET") {
    return WorkspaceController.getSubscription();
  }
  if (normalizedPath === "/api/workspace/subscription/cancel" && method === "POST") {
    return WorkspaceController.cancelSubscription();
  }

  // Workspaces CRUD & Switch
  if (normalizedPath === "/api/workspaces") {
    if (method === "GET") {
      return WorkspaceController.listWorkspaces();
    }
    if (method === "POST") {
      return WorkspaceController.createWorkspace(body?.name);
    }
  }

  const switchWsMatch = normalizedPath.match(/^\/api\/workspaces\/([^/]+)\/switch$/);
  if (switchWsMatch && method === "POST") {
    return WorkspaceController.switchWorkspace(switchWsMatch[1]);
  }

  const wsItemMatch = normalizedPath.match(/^\/api\/workspaces\/([^/]+)$/);
  if (wsItemMatch && method === "DELETE") {
    return WorkspaceController.deleteWorkspace(wsItemMatch[1]);
  }

  // Addons
  if (normalizedPath === "/api/workspace/addons" && method === "GET") {
    return WorkspaceController.listAddons();
  }
  const addonToggleMatch = normalizedPath.match(/^\/api\/workspace\/addons\/([^/]+)\/toggle$/);
  if (addonToggleMatch && (method === "PUT" || method === "POST")) {
    return WorkspaceController.toggleAddon(addonToggleMatch[1]);
  }

  // Notifications
  if (normalizedPath === "/api/notifications") {
    if (method === "GET") {
      return WorkspaceController.listNotifications();
    }
    if (method === "DELETE") {
      return WorkspaceController.clearNotifications();
    }
  }
  if (normalizedPath === "/api/notifications/mark-all-read" && method === "POST") {
    return WorkspaceController.markAllNotificationsRead();
  }
  const notifReadMatch = normalizedPath.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (notifReadMatch && (method === "PUT" || method === "POST")) {
    return WorkspaceController.markNotificationRead(notifReadMatch[1]);
  }

  // Help & Support
  if (normalizedPath === "/api/help/resources" && method === "GET") {
    return WorkspaceController.getHelpResources();
  }
  if (normalizedPath === "/api/help/feedback" && method === "POST") {
    const res = await WorkspaceController.submitHelpFeedback(body || {});
    return {
      status: res.status,
      data: {
        success: true,
        data: res.data,
        message: res.data?.message,
      },
    };
  }

  return { status: 404, error: `API route '${method} ${path}' not found` };
}
