import type {
  WorkspaceSettings,
  PlanInfo,
  SubscriptionDetails,
  WorkspaceItem,
  AddonItem,
  NotificationItem,
  HelpResource,
  ApiResponse,
} from "../types.ts";

// Initial In-Memory Workspace State
let currentSettings: WorkspaceSettings = {
  workspaceName: "gcem",
  currency: "USD",
  timeFormat: "24h",
  dateFormat: "DD/MM/YYYY",
  defaultBillableRate: 50,
  numberFormat: "1.234,56",
  isProjectFavoritesEnabled: true,
};

let currentSubscription: SubscriptionDetails = {
  planName: "Pro Trial",
  status: "trial",
  daysLeft: 3,
  billingCycle: "monthly",
  nextBillingDate: "2026-09-11",
  paymentMethod: "Visa ending in 4242",
};

const plans: PlanInfo[] = [
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 5.49,
    annualPrice: 4.49,
    isCurrent: false,
    features: [
      "Time rounding",
      "Lock timesheets",
      "Reminders",
      "Targets & alerts",
      "Manager role",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 7.99,
    annualPrice: 6.49,
    isCurrent: true,
    isPopular: true,
    features: [
      "Everything in Standard",
      "Expenses & Invoicing",
      "Scheduling & Time off",
      "GPS tracking & Geofencing",
      "Custom fields",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 11.99,
    annualPrice: 9.99,
    isCurrent: false,
    features: [
      "Everything in Pro",
      "Single Sign-On (SAML)",
      "Control accounts",
      "Audit log",
      "Custom subdomain",
    ],
  },
];

let workspaces: WorkspaceItem[] = [
  {
    id: "ws-1",
    name: "gcem",
    role: "Owner",
    membersCount: 5,
    isCurrent: true,
  },
  {
    id: "ws-2",
    name: "Personal Workspace",
    role: "Owner",
    membersCount: 1,
    isCurrent: false,
  },
  {
    id: "ws-3",
    name: "Client Alpha Portal",
    role: "Member",
    membersCount: 12,
    isCurrent: false,
  },
];

let addons: AddonItem[] = [
  {
    id: "invoicing",
    name: "Invoicing",
    category: "Financials",
    description: "Issue professional invoices from tracked billable hours and expenses.",
    isEnabled: true,
    icon: "FileText",
  },
  {
    id: "approval",
    name: "Timesheet Approvals",
    category: "Team Management",
    description: "Submit weekly timesheets for manager review and formal approval.",
    isEnabled: true,
    icon: "CheckCircle",
  },
  {
    id: "expenses",
    name: "Expense Tracking",
    category: "Financials",
    description: "Record project fees, attach receipts, and invoice clients directly.",
    isEnabled: true,
    icon: "Receipt",
  },
  {
    id: "time-off",
    name: "Time Off & Holidays",
    category: "HR & Scheduling",
    description: "Track vacation, sick leaves, company holidays, and time-off balances.",
    isEnabled: true,
    icon: "Calendar",
  },
  {
    id: "scheduling",
    name: "Shift Scheduling",
    category: "HR & Scheduling",
    description: "Schedule employee shifts and compare scheduled vs actual tracked hours.",
    isEnabled: false,
    icon: "Clock",
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    category: "Integrations",
    description: "Synchronize time entries and customers with QuickBooks automatically.",
    isEnabled: false,
    icon: "Share2",
  },
  {
    id: "cake-suite",
    name: "CAKE.com Productivity Suite",
    category: "Integrations",
    description: "Cross-link Pumble team messaging and Plaky project board cards.",
    isEnabled: true,
    icon: "Grid",
  },
];

let notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Pro Free Trial Ending Soon",
    message: "Your 7-day Pro free trial has 3 days remaining. Upgrade now to keep advanced reports.",
    timestamp: "2 hours ago",
    read: false,
    type: "warning",
  },
  {
    id: "notif-2",
    title: "Weekly Summary Report Ready",
    message: "Your time tracking report for Jul 13 – Jul 19 is processed and available for export.",
    timestamp: "Yesterday",
    read: false,
    type: "info",
  },
  {
    id: "notif-3",
    title: "Timesheet Approved",
    message: "Timesheet submission for period ending Jul 19 was approved by Vishal Komi.",
    timestamp: "2 days ago",
    read: true,
    type: "success",
  },
];

const helpResources: HelpResource[] = [
  {
    title: "Clockify Reports Guide",
    url: "https://clockify.me/help/reports",
    description: "Learn how to filter, group, export, and share Summary, Detailed, and Weekly reports.",
  },
  {
    title: "Setting Up Billable Rates",
    url: "https://clockify.me/help/rates",
    description: "Configure hourly rates per workspace, member, project, or task.",
  },
  {
    title: "Clockify Mobile App FAQ",
    url: "https://clockify.me/help/apps/mobile",
    description: "Common questions regarding Android and iOS mobile app synchronization.",
  },
  {
    title: "API & Webhook Integrations",
    url: "https://clockify.me/developers-api",
    description: "Connect Clockify to your tools with REST API tokens and Webhooks.",
  },
];

export const WorkspaceController = {
  // 1. Workspace Settings
  async getSettings(): Promise<ApiResponse<WorkspaceSettings>> {
    return { status: 200, data: { ...currentSettings } };
  },

  async updateSettings(payload: Partial<WorkspaceSettings>): Promise<ApiResponse<WorkspaceSettings>> {
    currentSettings = { ...currentSettings, ...payload };
    // update current workspace name in workspaces list if changed
    if (payload.workspaceName) {
      const activeWs = workspaces.find((w) => w.isCurrent);
      if (activeWs) activeWs.name = payload.workspaceName;
    }
    return { status: 200, data: { ...currentSettings } };
  },

  // 2. Plans & Upgrade
  async getPlans(): Promise<ApiResponse<PlanInfo[]>> {
    return { status: 200, data: [...plans] };
  },

  async upgrade(planId: string, billingCycle: "monthly" | "annually" = "monthly"): Promise<ApiResponse<SubscriptionDetails>> {
    const targetPlan = plans.find((p) => p.id.toLowerCase() === planId.toLowerCase());
    if (!targetPlan) {
      return { status: 400, error: `Plan '${planId}' not found` };
    }

    plans.forEach((p) => {
      p.isCurrent = p.id.toLowerCase() === planId.toLowerCase();
    });

    currentSubscription = {
      planName: targetPlan.name,
      status: "active",
      daysLeft: 30,
      billingCycle,
      nextBillingDate: "2026-10-08",
      paymentMethod: "Visa ending in 4242",
    };

    return { status: 200, data: { ...currentSubscription } };
  },

  // 3. Subscription Details
  async getSubscription(): Promise<ApiResponse<SubscriptionDetails>> {
    return { status: 200, data: { ...currentSubscription } };
  },

  async cancelSubscription(): Promise<ApiResponse<SubscriptionDetails>> {
    currentSubscription = {
      ...currentSubscription,
      status: "expired",
      planName: "Free",
      daysLeft: 0,
    };
    return { status: 200, data: { ...currentSubscription } };
  },

  // 4. Manage Workspaces
  async listWorkspaces(): Promise<ApiResponse<WorkspaceItem[]>> {
    return { status: 200, data: [...workspaces] };
  },

  async createWorkspace(name: string): Promise<ApiResponse<WorkspaceItem>> {
    if (!name || !name.trim()) {
      return { status: 400, error: "Workspace name is required" };
    }
    const newWs: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      name: name.trim(),
      role: "Owner",
      membersCount: 1,
      isCurrent: false,
    };
    workspaces.push(newWs);
    return { status: 201, data: newWs };
  },

  async switchWorkspace(id: string): Promise<ApiResponse<WorkspaceItem>> {
    const ws = workspaces.find((w) => w.id === id);
    if (!ws) {
      return { status: 404, error: "Workspace not found" };
    }
    workspaces.forEach((w) => {
      w.isCurrent = w.id === id;
    });
    currentSettings.workspaceName = ws.name;
    return { status: 200, data: ws };
  },

  async deleteWorkspace(id: string): Promise<ApiResponse<{ success: boolean }>> {
    const ws = workspaces.find((w) => w.id === id);
    if (!ws) {
      return { status: 404, error: "Workspace not found" };
    }
    if (ws.isCurrent && workspaces.length > 1) {
      // Set another workspace as current
      const other = workspaces.find((w) => w.id !== id);
      if (other) {
        other.isCurrent = true;
        currentSettings.workspaceName = other.name;
      }
    }
    workspaces = workspaces.filter((w) => w.id !== id);
    return { status: 200, data: { success: true } };
  },

  // 5. Add-ons
  async listAddons(): Promise<ApiResponse<AddonItem[]>> {
    return { status: 200, data: [...addons] };
  },

  async toggleAddon(id: string): Promise<ApiResponse<AddonItem>> {
    const addon = addons.find((a) => a.id === id);
    if (!addon) {
      return { status: 404, error: "Add-on not found" };
    }
    addon.isEnabled = !addon.isEnabled;
    return { status: 200, data: { ...addon } };
  },

  // 6. Notifications
  async listNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return { status: 200, data: [...notifications] };
  },

  async markNotificationRead(id: string): Promise<ApiResponse<NotificationItem>> {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) {
      return { status: 404, error: "Notification not found" };
    }
    notif.read = true;
    return { status: 200, data: { ...notif } };
  },

  async markAllNotificationsRead(): Promise<ApiResponse<{ success: boolean }>> {
    notifications.forEach((n) => {
      n.read = true;
    });
    return { status: 200, data: { success: true } };
  },

  async clearNotifications(): Promise<ApiResponse<{ success: boolean }>> {
    notifications = [];
    return { status: 200, data: { success: true } };
  },

  // 7. Help & Support
  async getHelpResources(): Promise<ApiResponse<HelpResource[]>> {
    return { status: 200, data: [...helpResources] };
  },

  async submitHelpFeedback(data: { subject: string; message: string; email?: string }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return {
      status: 200,
      data: {
        success: true,
        message: "Thank you! Your feedback has been sent to Clockify Support.",
      },
    };
  },
};
