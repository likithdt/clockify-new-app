import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import {
  ArrowLeft,
  Lock,
  RotateCw,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Printer,
  Share2,
  FileSpreadsheet,
  FileText,
  Clock,
  MessageSquare,
  Kanban,
  User,
  Settings,
  Download,
  LogOut,
  Bell,
  HelpCircle,
  Puzzle,
  X,
  CreditCard,
  Rocket,
  Building,
  CheckCircle,
  Calendar,
  Receipt,
  Plus,
  Trash2,
  ExternalLink,
  Send,
  AlertTriangle,
} from "lucide-react";
import {
  exportToCsv,
  exportToExcel,
  exportToPdf,
  sampleReportEntries,
  defaultExportSettings,
} from "../../utils/reportExport";
import type {
  WorkspaceSettings,
  PlanInfo,
  SubscriptionDetails,
  WorkspaceItem,
  AddonItem,
  NotificationItem,
  HelpResource,
} from "../../backend/types";

export interface WebReportsViewProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceName?: string;
  userName?: string;
  userEmail?: string;
  onOpenShareModal?: () => void;
}

export interface WebReportsViewHandle {
  handleBack: () => boolean;
  handleHome: () => void;
}

export const WebReportsView = forwardRef<WebReportsViewHandle, WebReportsViewProps>(({
  isOpen,
  onClose,
  workspaceName: initialWorkspaceName = "gcem",
  userName = "vishalkomi954",
  userEmail = "vishalkomi954@gmail.com",
  onOpenShareModal,
}, ref) => {
  // Active workspace state
  const [activeWorkspaceName, setActiveWorkspaceName] = useState(initialWorkspaceName);

  // Top Navbar dropdowns
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);
  const [isFourLinesOpen, setIsFourLinesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBrowserMenuOpen, setIsBrowserMenuOpen] = useState(false);
  const [isProTrialOpen, setIsProTrialOpen] = useState(false);

  // Modals for the 7 feature screens requested
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isManageWorkspaceOpen, setIsManageWorkspaceOpen] = useState(false);
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Backend state
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>({
    workspaceName: "gcem",
    currency: "USD",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    defaultBillableRate: 50,
    numberFormat: "1.234,56",
    isProjectFavoritesEnabled: true,
  });

  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    planName: "Pro Trial",
    status: "trial",
    daysLeft: 3,
    billingCycle: "monthly",
    nextBillingDate: "2026-09-11",
    paymentMethod: "Visa ending in 4242",
  });

  const [workspacesList, setWorkspacesList] = useState<WorkspaceItem[]>([]);
  const [newWorkspaceInput, setNewWorkspaceInput] = useState("");

  const [addonsList, setAddonsList] = useState<AddonItem[]>([]);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [helpResourcesList, setHelpResourcesList] = useState<HelpResource[]>([]);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Sample data banner
  const [isSampleDataActive, setIsSampleDataActive] = useState(true);

  // Subnav: Report type dropdown & active tab
  const [reportType, setReportType] = useState<"time" | "team" | "expense">("time");
  const [isReportTypeOpen, setIsReportTypeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Summary" | "Detailed" | "Weekly">("Summary");

  // Date Range state
  const [dateRangeLabel, setDateRangeLabel] = useState("This week");
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);

  // Export dropdown
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Bar state
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeFilterModal, setActiveFilterModal] = useState<
    "team" | "client" | "project" | "status" | "description" | null
  >(null);

  // Enabled filter pills
  const [enabledFilters, setEnabledFilters] = useState<Record<string, boolean>>({
    Team: true,
    Client: true,
    Project: true,
    Task: true,
    Tag: true,
    Status: true,
    Description: true,
    Kiosk: true,
    Category: false,
    Note: false,
  });

  // Filter selections
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([
    "[SAMPLE] Amy Smith",
    "[SAMPLE] James Anderson",
    "[SAMPLE] Lara Peterson",
    "[SAMPLE] Mike Johnson",
    "vishalkomi954",
  ]);
  const [teamSearch, setTeamSearch] = useState("");

  const [selectedClients, setSelectedClients] = useState<string[]>([
    "[SAMPLE] Client A",
    "[SAMPLE] Client B",
  ]);
  const [withoutClientSelected, setWithoutClientSelected] = useState(true);
  const [clientSearch, setClientSearch] = useState("");

  const [selectedProjects, setSelectedProjects] = useState<string[]>([
    "[SAMPLE] Internal Project",
    "[SAMPLE] Project Alpha",
    "[SAMPLE] Project Beta",
    "[SAMPLE] Project Gamma",
  ]);
  const [withoutProjectSelected, setWithoutProjectSelected] = useState(true);
  const [projectSearch, setProjectSearch] = useState("");

  const [descriptionSearch, setDescriptionSearch] = useState("");

  // Controls in summary section
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [showAmountType, setShowAmountType] = useState<"Amount" | "Cost" | "Profit">("Amount");
  const [isShowAmountOpen, setIsShowAmountOpen] = useState(false);
  const [billabilityFilter, setBillabilityFilter] = useState<"Billability" | "Billable" | "Non-billable">("Billability");
  const [isBillabilityOpen, setIsBillabilityOpen] = useState(false);

  // Group by & Sort by
  const [groupByPrimary, setGroupByPrimary] = useState("Project");
  const [groupBySecondary, setGroupBySecondary] = useState("Description");
  const [isGroupByPrimaryOpen, setIsGroupByPrimaryOpen] = useState(false);
  const [isGroupBySecondaryOpen, setIsGroupBySecondaryOpen] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const [sortBy, setSortBy] = useState<"Title (up)" | "Title (down)" | "Duration (desc)" | "Duration (asc)">("Title (up)");
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  // Close all popups helper
  const closeAllDropdowns = () => {
    setIsAppLauncherOpen(false);
    setIsThreeDotsOpen(false);
    setIsFourLinesOpen(false);
    setIsProfileOpen(false);
    setIsBrowserMenuOpen(false);
    setIsReportTypeOpen(false);
    setIsDateRangePickerOpen(false);
    setIsExportMenuOpen(false);
    setIsFilterDropdownOpen(false);
    setActiveFilterModal(null);
    setIsShowAmountOpen(false);
    setIsBillabilityOpen(false);
    setIsGroupByPrimaryOpen(false);
    setIsGroupBySecondaryOpen(false);
    setIsSortByOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleBack: () => {
      if (!isOpen) return false;
      // Close open sub-modals in reverse order
      if (isHelpModalOpen) {
        setIsHelpModalOpen(false);
        return true;
      }
      if (isNotificationsModalOpen) {
        setIsNotificationsModalOpen(false);
        return true;
      }
      if (isAddonsModalOpen) {
        setIsAddonsModalOpen(false);
        return true;
      }
      if (isManageWorkspaceOpen) {
        setIsManageWorkspaceOpen(false);
        return true;
      }
      if (isSubscriptionModalOpen) {
        setIsSubscriptionModalOpen(false);
        return true;
      }
      if (isUpgradeModalOpen) {
        setIsUpgradeModalOpen(false);
        return true;
      }
      if (isWorkspaceSettingsOpen) {
        setIsWorkspaceSettingsOpen(false);
        return true;
      }
      if (activeFilterModal) {
        setActiveFilterModal(null);
        return true;
      }
      if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
        return true;
      }
      if (isExportMenuOpen) {
        setIsExportMenuOpen(false);
        return true;
      }
      if (isDateRangePickerOpen) {
        setIsDateRangePickerOpen(false);
        return true;
      }
      if (isBrowserMenuOpen) {
        setIsBrowserMenuOpen(false);
        return true;
      }
      if (isProfileOpen) {
        setIsProfileOpen(false);
        return true;
      }
      if (isProTrialOpen) {
        setIsProTrialOpen(false);
        return true;
      }
      if (isThreeDotsOpen) {
        setIsThreeDotsOpen(false);
        return true;
      }
      if (isAppLauncherOpen) {
        setIsAppLauncherOpen(false);
        return true;
      }
      if (isFourLinesOpen) {
        setIsFourLinesOpen(false);
        return true;
      }
      if (isReportTypeOpen) {
        setIsReportTypeOpen(false);
        return true;
      }
      if (isShowAmountOpen) {
        setIsShowAmountOpen(false);
        return true;
      }
      if (isBillabilityOpen) {
        setIsBillabilityOpen(false);
        return true;
      }
      if (isGroupByPrimaryOpen) {
        setIsGroupByPrimaryOpen(false);
        return true;
      }
      if (isGroupBySecondaryOpen) {
        setIsGroupBySecondaryOpen(false);
        return true;
      }
      if (isSortByOpen) {
        setIsSortByOpen(false);
        return true;
      }
      // If WebReportsView is open and no sub-modals, close WebReportsView
      onClose();
      return true;
    },
    handleHome: () => {
      closeAllDropdowns();
      setIsWorkspaceSettingsOpen(false);
      setIsUpgradeModalOpen(false);
      setIsSubscriptionModalOpen(false);
      setIsManageWorkspaceOpen(false);
      setIsAddonsModalOpen(false);
      setIsNotificationsModalOpen(false);
      setIsHelpModalOpen(false);
      onClose();
    },
  }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch backend data
  const loadBackendData = async () => {
    try {
      const [settingsRes, subRes, plansRes, wsRes, addonsRes, notifsRes, helpRes] =
        await Promise.all([
          fetch("/api/workspace/settings").then((r) => r.json()).catch(() => null),
          fetch("/api/workspace/subscription").then((r) => r.json()).catch(() => null),
          fetch("/api/workspace/plans").then((r) => r.json()).catch(() => null),
          fetch("/api/workspaces").then((r) => r.json()).catch(() => null),
          fetch("/api/workspace/addons").then((r) => r.json()).catch(() => null),
          fetch("/api/notifications").then((r) => r.json()).catch(() => null),
          fetch("/api/help/resources").then((r) => r.json()).catch(() => null),
        ]);

      if (settingsRes && !settingsRes.error) {
        setWorkspaceSettings(settingsRes);
        setActiveWorkspaceName(settingsRes.workspaceName);
      }
      if (subRes && !subRes.error) setSubscription(subRes);
      if (Array.isArray(plansRes)) setPlans(plansRes);
      if (Array.isArray(wsRes)) setWorkspacesList(wsRes);
      if (Array.isArray(addonsRes)) setAddonsList(addonsRes);
      if (Array.isArray(notifsRes)) setNotificationsList(notifsRes);
      if (Array.isArray(helpRes)) setHelpResourcesList(helpRes);
    } catch (err) {
      console.error("Failed to load web reports backend data:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBackendData();
    }
  }, [isOpen]);

  // Unread notifications count
  const unreadNotifsCount = useMemo(() => {
    return notificationsList.filter((n) => !n.read).length;
  }, [notificationsList]);

  // Backend actions
  const handleSaveSettings = async (newSettings: Partial<WorkspaceSettings>) => {
    try {
      const res = await fetch("/api/workspace/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      }).then((r) => r.json());

      if (res && !res.error) {
        setWorkspaceSettings(res);
        if (res.workspaceName) setActiveWorkspaceName(res.workspaceName);
        showToast("Workspace settings saved successfully");
        setIsWorkspaceSettingsOpen(false);
      }
    } catch (err) {
      showToast("Failed to save settings");
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    try {
      const res = await fetch("/api/workspace/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle: selectedBillingCycle }),
      }).then((r) => r.json());

      if (res && !res.error) {
        setSubscription(res);
        showToast(`Successfully upgraded to ${res.planName}!`);
        setIsUpgradeModalOpen(false);
      }
    } catch (err) {
      showToast("Upgrade failed");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const res = await fetch("/api/workspace/subscription/cancel", {
        method: "POST",
      }).then((r) => r.json());

      if (res && !res.error) {
        setSubscription(res);
        showToast("Subscription cancelled");
      }
    } catch (err) {
      showToast("Failed to cancel subscription");
    }
  };

  const handleSwitchWorkspace = async (id: string) => {
    try {
      const res = await fetch(`/api/workspaces/${id}/switch`, {
        method: "POST",
      }).then((r) => r.json());

      if (res && !res.error) {
        setActiveWorkspaceName(res.name);
        setWorkspacesList((prev) =>
          prev.map((w) => ({ ...w, isCurrent: w.id === id }))
        );
        showToast(`Switched workspace to ${res.name}`);
        setIsManageWorkspaceOpen(false);
      }
    } catch (err) {
      showToast("Failed to switch workspace");
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceInput.trim()) return;
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkspaceInput.trim() }),
      }).then((r) => r.json());

      if (res && !res.error) {
        setWorkspacesList((prev) => [...prev, res]);
        setNewWorkspaceInput("");
        showToast(`Created workspace: ${res.name}`);
      }
    } catch (err) {
      showToast("Failed to create workspace");
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    try {
      const res = await fetch(`/api/workspaces/${id}`, {
        method: "DELETE",
      }).then((r) => r.json());

      if (res && res.success) {
        setWorkspacesList((prev) => prev.filter((w) => w.id !== id));
        showToast("Workspace deleted");
      }
    } catch (err) {
      showToast("Failed to delete workspace");
    }
  };

  const handleToggleAddon = async (id: string) => {
    try {
      const res = await fetch(`/api/workspace/addons/${id}/toggle`, {
        method: "PUT",
      }).then((r) => r.json());

      if (res && !res.error) {
        setAddonsList((prev) =>
          prev.map((a) => (a.id === id ? res : a))
        );
        showToast(`${res.name} ${res.isEnabled ? "enabled" : "disabled"}`);
      }
    } catch (err) {
      showToast("Failed to toggle add-on");
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      }).then((r) => r.json());

      if (res && !res.error) {
        setNotificationsList((prev) =>
          prev.map((n) => (n.id === id ? res : n))
        );
      }
    } catch (err) {}
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast("All notifications marked as read");
    } catch (err) {}
  };

  const handleClearNotifs = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotificationsList([]);
      showToast("Notifications cleared");
    } catch (err) {}
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    try {
      const res = await fetch("/api/help/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: feedbackSubject || "General Support",
          message: feedbackMessage,
          email: userEmail,
        }),
      }).then((r) => r.json());

      if (res && res.data?.success) {
        showToast(res.data.message);
        setFeedbackSubject("");
        setFeedbackMessage("");
        setIsHelpModalOpen(false);
      }
    } catch (err) {
      showToast("Failed to send message");
    }
  };

  // Filtered dataset calculation
  const currentEntries = useMemo(() => {
    if (!isSampleDataActive) return [];
    return sampleReportEntries.filter((ent) => {
      // Filter by project
      if (selectedProjects.length > 0 && !selectedProjects.includes(ent.project)) {
        return false;
      }
      // Filter by client
      if (ent.client === "(Without client)") {
        if (!withoutClientSelected) return false;
      } else if (selectedClients.length > 0 && !selectedClients.includes(ent.client)) {
        return false;
      }
      // Filter by description search
      if (
        descriptionSearch.trim() &&
        !ent.description.toLowerCase().includes(descriptionSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    isSampleDataActive,
    selectedProjects,
    selectedClients,
    withoutClientSelected,
    descriptionSearch,
  ]);

  // Aggregate totals
  const totalDecHours = useMemo(() => {
    return currentEntries.reduce((sum, e) => sum + parseFloat(e.timeDec), 0);
  }, [currentEntries]);

  const totalAmountUsd = useMemo(() => {
    return currentEntries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  }, [currentEntries]);

  const billableDecHours = useMemo(() => {
    return currentEntries
      .filter((e) => parseFloat(e.amount) > 0)
      .reduce((sum, e) => sum + parseFloat(e.timeDec), 0);
  }, [currentEntries]);

  // Display strings
  const formattedTotalTime = useMemo(() => {
    if (!isSampleDataActive) return "00:00:00";
    if (currentEntries.length === sampleReportEntries.length) return "10:02:38";
    const secs = Math.round(totalDecHours * 3600);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, [isSampleDataActive, totalDecHours, currentEntries.length]);

  const formattedBillableTime = useMemo(() => {
    if (!isSampleDataActive) return "00:00:00";
    if (currentEntries.length === sampleReportEntries.length) return "00:00:00";
    const secs = Math.round(billableDecHours * 3600);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, [isSampleDataActive, billableDecHours, currentEntries.length]);

  const formattedAmount = useMemo(() => {
    if (!isSampleDataActive) return "0,00 USD";
    if (currentEntries.length === sampleReportEntries.length) return "0,00 USD";
    return `${totalAmountUsd.toFixed(2).replace(".", ",")} USD`;
  }, [isSampleDataActive, totalAmountUsd, currentEntries.length]);

  // Daily hours for bar chart matching Screenshot 3
  const dailyChartData = [
    { day: "Mon, Sep 7", total: 8.0, billable: 0 },
    { day: "Tue, Sep 8", total: 2.0, billable: 0 },
    { day: "Wed, Sep 9", total: 0, billable: 0 },
    { day: "Thu, Sep 10", total: 0, billable: 0 },
    { day: "Fri, Sep 11", total: 0, billable: 0 },
    { day: "Sat, Sep 12", total: 0, billable: 0 },
    { day: "Sun, Sep 13", total: 0, billable: 0 },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#f0f2f5] animate-fadeIn select-none font-sans overflow-hidden">
      {/* ========================================================= */}
      {/* 1. BROWSER HEADER / ADDRESS BAR                           */}
      {/* ========================================================= */}
      <div className="h-12 bg-white px-3 flex items-center justify-between border-b border-gray-200 shrink-0 shadow-sm z-30">
        {/* Back / Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors mr-1"
          title="Back to Clockify app"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* URL Pill */}
        <div className="flex-1 flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 rounded-full px-3.5 py-1.5 mx-1 transition-colors">
          <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <span className="text-xs text-gray-800 font-normal truncate">
            app.clockify.me/reports/summary
          </span>
        </div>

        {/* Browser Tabs & More */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              showToast("Refreshing web report...");
              loadBackendData();
              closeAllDropdowns();
            }}
            className="p-1.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100"
            title="Refresh"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="w-6 h-6 border-2 border-gray-700 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-700 mx-1">
            5
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBrowserMenuOpen((p) => !p)}
              className="p-1 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Browser options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {isBrowserMenuOpen && (
              <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-xs text-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    window.open("https://app.clockify.me/reports", "_blank");
                    setIsBrowserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in external browser</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setIsBrowserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print page</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenShareModal) onOpenShareModal();
                    setIsBrowserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share report link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BLUE TRIAL BANNER                                      */}
      {/* ========================================================= */}
      <div className="bg-[#1565c0] text-white px-4 py-2.5 flex items-center justify-between text-xs shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2 text-[11px] leading-tight flex-1 pr-2">
          <div className="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center font-serif text-[10px] shrink-0 font-bold">
            i
          </div>
          <span>
            {subscription.daysLeft} days left in trial - You are currently using sample data to help you explore.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="text-white hover:text-cyan-200 font-semibold text-xs flex items-center gap-1 underline underline-offset-2 shrink-0"
        >
          <span>Manage</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3. CLOCKIFY WORKSPACE HEADER                              */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shrink-0 shadow-xs z-20">
        {/* Left: 9-dots icon, Workspace name, three-dots */}
        <div className="flex items-center gap-3">
          {/* App Launcher Icon (9 dots) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                setIsAppLauncherOpen((p) => !p);
              }}
              className="p-1 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100"
              title="CAKE.com Apps"
            >
              <div className="grid grid-cols-3 gap-0.5 w-4 h-4 p-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-800 rounded-[0.5px]" />
                ))}
              </div>
            </button>

            {/* App Launcher Dropdown matching WhatsApp screenshot 9.54.15 AM */}
            {isAppLauncherOpen && (
              <div className="absolute left-0 top-9 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50 text-xs">
                {/* Clockify Active */}
                <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 bg-sky-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#00b0ff] text-white flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Clockify</p>
                      <p className="text-[10px] text-gray-500">Time Tracking</p>
                    </div>
                  </div>
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                </div>

                <div className="px-4 py-2 text-[11px] text-gray-500 border-b border-gray-100 bg-gray-50/60">
                  Failed to retrieve memberships
                </div>

                {/* Pumble */}
                <div className="px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#611f69] text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pumble</p>
                      <p className="text-[10px] text-gray-500">Team Communication</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {/* Plaky */}
                <div className="px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0052cc] text-white flex items-center justify-center">
                      <Kanban className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Plaky</p>
                      <p className="text-[10px] text-gray-500">Project Management</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {/* CAKE.com Account */}
                <div className="px-3 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 cursor-pointer border-t border-gray-100">
                  <div className="w-7 h-7 rounded-lg bg-[#0080ff] text-white flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">CAKE.com Account</span>
                </div>
              </div>
            )}
          </div>

          <span className="text-sm font-semibold text-gray-800">{activeWorkspaceName}</span>

          {/* ========================================================= */}
          {/* THREE DOTS BUTTON NEAR GCEM                               */}
          {/* Options: Workspace settings, Upgrade, Subscription, Manage workspace */}
          {/* ========================================================= */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                setIsThreeDotsOpen((p) => !p);
              }}
              className="text-gray-500 hover:text-gray-800 p-1 text-sm font-bold tracking-widest"
              title="Workspace options"
            >
              ○○○
            </button>

            {isThreeDotsOpen && (
              <div className="absolute left-0 top-8 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-xs text-gray-700 animate-scaleUp">
                {/* 1. Workspace settings */}
                <button
                  type="button"
                  onClick={() => {
                    setIsWorkspaceSettingsOpen(true);
                    setIsThreeDotsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Workspace settings</span>
                </button>

                {/* 2. Upgrade */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUpgradeModalOpen(true);
                    setIsThreeDotsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <Rocket className="w-4 h-4 text-amber-500" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Upgrade</span>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 font-bold text-[10px] rounded-full">
                      PRO
                    </span>
                  </div>
                </button>

                {/* 3. Subscription */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSubscriptionModalOpen(true);
                    setIsThreeDotsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Subscription</span>
                </button>

                {/* 4. Manage workspace */}
                <button
                  type="button"
                  onClick={() => {
                    setIsManageWorkspaceOpen(true);
                    setIsThreeDotsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium border-t border-gray-100 mt-1"
                >
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Manage workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Avatar VI & Four Lines Icon */}
        <div className="flex items-center gap-2.5">
          {/* Avatar VI button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                setIsProfileOpen((p) => !p);
              }}
              className="w-8 h-8 rounded-lg bg-[#00897b] text-white flex items-center justify-center font-bold text-xs shadow-xs"
              title="User profile"
            >
              VI
            </button>

            {/* Profile Dropdown matching WhatsApp screenshot 9.54.19 AM (2) */}
            {isProfileOpen && (
              <div className="absolute right-0 top-10 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 text-xs">
                <div className="flex flex-col items-center text-center pb-3 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-[#00897b] text-white flex items-center justify-center font-bold text-lg mb-2 shadow-sm">
                    VI
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{userName}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{userEmail}</p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubscriptionModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="mt-3 w-full py-2 px-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Manage CAKE.com account
                  </button>
                </div>

                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceSettingsOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2.5 text-gray-700"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceSettingsOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2.5 text-gray-700"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Preferences</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast("Download apps page");
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2.5 text-gray-700"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                    <span>Download apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-red-50 rounded-lg flex items-center gap-2.5 text-red-600 border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* FOUR LINES ICON (Matching Screenshot 9.54.19 AM (1))      */}
          {/* Options: Add-ons, Notifications, Help                      */}
          {/* ========================================================= */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                setIsFourLinesOpen((p) => !p);
              }}
              className="p-1.5 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors relative"
              title="More options"
            >
              {/* Authentic 4 horizontal lines icon */}
              <div className="w-5 h-5 flex flex-col justify-center gap-[3px]">
                <span className="w-full h-[2px] bg-gray-800 rounded-full" />
                <span className="w-full h-[2px] bg-gray-800 rounded-full" />
                <span className="w-full h-[2px] bg-gray-800 rounded-full" />
                <span className="w-full h-[2px] bg-gray-800 rounded-full" />
              </div>

              {/* Unread badge dot */}
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {/* Dropdown with Add-ons, Notifications, Help matching Screenshot 9.54.19 AM (1) */}
            {isFourLinesOpen && (
              <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-xs text-gray-700 animate-scaleUp">
                {/* 1. Add-ons */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddonsModalOpen(true);
                    setIsFourLinesOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <Puzzle className="w-4 h-4 text-gray-500" />
                  <span>Add-ons</span>
                </button>

                {/* 2. Notifications */}
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsModalOpen(true);
                    setIsFourLinesOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <Bell className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold text-[10px]">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* 3. Help */}
                <button
                  type="button"
                  onClick={() => {
                    setIsHelpModalOpen(true);
                    setIsFourLinesOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-gray-800 font-medium"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>Help</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. SCROLLABLE WEB REPORTS CONTENT                         */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-3 sm:p-4 space-y-3.5">
        {/* Sample Data Alert Banner matching WhatsApp Screenshot 9.54.19 AM (1) */}
        {isSampleDataActive && (
          <div className="bg-[#e0f7fa] border border-[#b2ebf2] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
            <span className="text-xs text-[#006064] font-medium leading-relaxed">
              You are currently using sample data to help you explore.
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSampleDataActive(false);
                showToast("Sample data removed");
              }}
              className="px-3 py-1.5 bg-white border border-[#4dd0e1] text-[#00838f] text-[11px] font-bold rounded-lg hover:bg-cyan-50 active:scale-95 transition-all shrink-0 shadow-2xs uppercase"
            >
              REMOVE SAMPLE DATA
            </button>
          </div>
        )}

        {/* ======================================================= */}
        {/* REPORT TYPE SELECTOR & TABS (Summary, Detailed, Weekly) */}
        {/* ======================================================= */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="flex items-center border-b border-gray-200 text-xs font-semibold">
            {/* Report Type Dropdown */}
            <div className="relative border-r border-gray-200">
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setIsReportTypeOpen((p) => !p);
                }}
                className="px-3 py-3 text-gray-700 uppercase flex items-center gap-1.5 hover:bg-gray-50"
              >
                <span>
                  {reportType === "time"
                    ? "TIME REPORT"
                    : reportType === "team"
                    ? "TEAM REPORT"
                    : "EXPENSE REPORT"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {isReportTypeOpen && (
                <div className="absolute left-0 top-full w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setReportType("time");
                      setIsReportTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                      reportType === "time" ? "font-bold text-[#00b0ff]" : "text-gray-700"
                    }`}
                  >
                    Time report
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportType("team");
                      setIsReportTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                      reportType === "team" ? "font-bold text-[#00b0ff]" : "text-gray-700"
                    }`}
                  >
                    Team report
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportType("expense");
                      setIsReportTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                      reportType === "expense" ? "font-bold text-[#00b0ff]" : "text-gray-700"
                    }`}
                  >
                    Expense report
                  </button>
                </div>
              )}
            </div>

            {/* View Tabs */}
            <button
              type="button"
              onClick={() => setActiveTab("Summary")}
              className={`flex-1 py-3 text-center border-r border-gray-200 transition-colors ${
                activeTab === "Summary"
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-500 hover:bg-gray-50 font-normal"
              }`}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Detailed")}
              className={`flex-1 py-3 text-center border-r border-gray-200 transition-colors ${
                activeTab === "Detailed"
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-500 hover:bg-gray-50 font-normal"
              }`}
            >
              Detailed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Weekly")}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === "Weekly"
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-500 hover:bg-gray-50 font-normal"
              }`}
            >
              Weekly
            </button>
          </div>

          {/* Shared Reports pill */}
          <div className="px-3 py-2 bg-gray-50/50 flex items-center justify-between border-b border-gray-100 text-xs">
            <button
              type="button"
              onClick={() => {
                if (onOpenShareModal) onOpenShareModal();
              }}
              className="px-2.5 py-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-medium"
            >
              Shared
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* DATE RANGE BAR & EXPORT DROPDOWN                        */}
        {/* ======================================================= */}
        <div className="flex items-center justify-between gap-2 z-10">
          {/* Date Range Picker */}
          <div className="relative flex-1">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setIsDateRangePickerOpen((p) => !p);
                }}
                className="flex-1 px-3 py-2 text-xs font-normal text-gray-700 flex items-center gap-2 hover:bg-gray-50 text-left"
              >
                <span>📅</span>
                <span className="truncate">{dateRangeLabel}</span>
              </button>
              <div className="flex border-l border-gray-200 divide-x divide-gray-200">
                <button
                  type="button"
                  onClick={() => showToast("Previous week")}
                  className="px-2 py-2 hover:bg-gray-50 text-gray-600"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Next week")}
                  className="px-2 py-2 hover:bg-gray-50 text-gray-600"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Date Range Options Dropdown */}
            {isDateRangePickerOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-40 text-xs">
                {[
                  "This week",
                  "Last week",
                  "Jul 13 - Jul 19",
                  "This month",
                  "Last month",
                  "This year",
                  "Last year",
                ].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRangeLabel(range);
                      setIsDateRangePickerOpen(false);
                      showToast(`Date range set to ${range}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center justify-between ${
                      dateRangeLabel === range ? "text-[#00b0ff] font-bold" : "text-gray-700"
                    }`}
                  >
                    <span>{range}</span>
                    {dateRangeLabel === range && <Check className="w-3.5 h-3.5 text-[#00b0ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EXPORT Dropdown (Teal outlined matching screenshot) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                setIsExportMenuOpen((p) => !p);
              }}
              className="px-3.5 py-2 border border-[#00b0ff] text-[#00b0ff] bg-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-cyan-50/50 shadow-2xs active:scale-95 transition-all"
            >
              <span>EXPORT</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    exportToCsv(defaultExportSettings, currentEntries);
                    setIsExportMenuOpen(false);
                    showToast("Downloaded Clockify CSV");
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportToExcel(defaultExportSettings, currentEntries);
                    setIsExportMenuOpen(false);
                    showToast("Downloaded Clockify Excel (.xlsx)");
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportToPdf(defaultExportSettings, currentEntries);
                    setIsExportMenuOpen(false);
                    showToast("Downloaded Clockify PDF");
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* FILTER BAR WITH DROPDOWNS                               */}
        {/* ======================================================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-xs space-y-2">
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-gray-600">
            {/* FILTER Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setIsFilterDropdownOpen((p) => !p);
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200/70 rounded text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1"
              >
                <span>FILTER</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-40 text-xs space-y-1">
                  {Object.keys(enabledFilters).map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={enabledFilters[key]}
                        onChange={(e) =>
                          setEnabledFilters((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="rounded text-[#00b0ff] focus:ring-[#00b0ff]"
                      />
                      <span className="text-gray-800">{key}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Pills */}
            {enabledFilters.Team && (
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setActiveFilterModal(activeFilterModal === "team" ? null : "team");
                }}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 border ${
                  activeFilterModal === "team"
                    ? "border-[#00b0ff] text-[#00b0ff] bg-cyan-50"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <span>Team</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            {enabledFilters.Client && (
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setActiveFilterModal(activeFilterModal === "client" ? null : "client");
                }}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 border ${
                  activeFilterModal === "client"
                    ? "border-[#00b0ff] text-[#00b0ff] bg-cyan-50"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <span>Client</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            {enabledFilters.Project && (
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setActiveFilterModal(activeFilterModal === "project" ? null : "project");
                }}
                className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 border ${
                  activeFilterModal === "project"
                    ? "border-[#00b0ff] text-[#00b0ff] bg-cyan-50"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <span>Project</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            {enabledFilters.Status && (
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setActiveFilterModal(activeFilterModal === "status" ? null : "status");
                }}
                className="px-2 py-1 rounded text-[11px] flex items-center gap-1 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              >
                <span>Status</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            {enabledFilters.Description && (
              <button
                type="button"
                onClick={() => {
                  closeAllDropdowns();
                  setActiveFilterModal(activeFilterModal === "description" ? null : "description");
                }}
                className="px-2 py-1 rounded text-[11px] flex items-center gap-1 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              >
                <span>Description</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            {/* APPLY Button */}
            <button
              type="button"
              onClick={() => {
                closeAllDropdowns();
                showToast("Filters applied");
              }}
              className="px-3 py-1 bg-[#29b6f6] hover:bg-[#039be5] text-white rounded text-[11px] font-bold uppercase shadow-2xs active:scale-95 transition-transform ml-auto"
            >
              APPLY
            </button>
          </div>

          {/* ACTIVE FILTER POPUP MODAL (Team, Client, Project) */}
          {activeFilterModal === "team" && (
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg space-y-2.5 animate-fadeIn">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users or groups"
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00b0ff]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>SHOW</span>
                <span className="text-[#00b0ff]">Active ▾</span>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTeamMembers.length === 5}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTeamMembers([
                        "[SAMPLE] Amy Smith",
                        "[SAMPLE] James Anderson",
                        "[SAMPLE] Lara Peterson",
                        "[SAMPLE] Mike Johnson",
                        "vishalkomi954",
                      ]);
                    } else {
                      setSelectedTeamMembers([]);
                    }
                  }}
                  className="rounded text-[#00b0ff]"
                />
                <span>Select all</span>
              </label>

              <div className="text-[10px] font-bold text-gray-400 uppercase pt-1">USERS</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {[
                  "[SAMPLE] Amy Smith",
                  "[SAMPLE] James Anderson",
                  "[SAMPLE] Lara Peterson",
                  "[SAMPLE] Mike Johnson",
                  "vishalkomi954",
                ]
                  .filter((u) => u.toLowerCase().includes(teamSearch.toLowerCase()))
                  .map((u) => (
                    <label key={u} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeamMembers.includes(u)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTeamMembers((p) => [...p, u]);
                          } else {
                            setSelectedTeamMembers((p) => p.filter((x) => x !== u));
                          }
                        }}
                        className="rounded text-[#00b0ff]"
                      />
                      <span>{u}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {activeFilterModal === "client" && (
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg space-y-2.5 animate-fadeIn">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00b0ff]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>SHOW</span>
                <span className="text-[#00b0ff]">Active ▾</span>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedClients.length === 2 && withoutClientSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClients(["[SAMPLE] Client A", "[SAMPLE] Client B"]);
                      setWithoutClientSelected(true);
                    } else {
                      setSelectedClients([]);
                      setWithoutClientSelected(false);
                    }
                  }}
                  className="rounded text-[#00b0ff]"
                />
                <span>Select all</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withoutClientSelected}
                  onChange={(e) => setWithoutClientSelected(e.target.checked)}
                  className="rounded text-[#00b0ff]"
                />
                <span>Without Client</span>
              </label>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {["[SAMPLE] Client A", "[SAMPLE] Client B"]
                  .filter((c) => c.toLowerCase().includes(clientSearch.toLowerCase()))
                  .map((c) => (
                    <label key={c} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClients((p) => [...p, c]);
                          } else {
                            setSelectedClients((p) => p.filter((x) => x !== c));
                          }
                        }}
                        className="rounded text-[#00b0ff]"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {activeFilterModal === "project" && (
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg space-y-2.5 animate-fadeIn">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Projects"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00b0ff]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>SHOW</span>
                <span className="text-[#00b0ff]">Active ▾</span>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProjects.length === 4 && withoutProjectSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProjects([
                        "[SAMPLE] Internal Project",
                        "[SAMPLE] Project Alpha",
                        "[SAMPLE] Project Beta",
                        "[SAMPLE] Project Gamma",
                      ]);
                      setWithoutProjectSelected(true);
                    } else {
                      setSelectedProjects([]);
                      setWithoutProjectSelected(false);
                    }
                  }}
                  className="rounded text-[#00b0ff]"
                />
                <span>Select all</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withoutProjectSelected}
                  onChange={(e) => setWithoutProjectSelected(e.target.checked)}
                  className="rounded text-[#00b0ff]"
                />
                <span>Without Project</span>
              </label>

              <div className="space-y-2 max-h-44 overflow-y-auto">
                <div className="text-[10px] font-bold text-gray-400 uppercase">NO CLIENT</div>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes("[SAMPLE] Internal Project")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects((p) => [...p, "[SAMPLE] Internal Project"]);
                      } else {
                        setSelectedProjects((p) => p.filter((x) => x !== "[SAMPLE] Internal Project"));
                      }
                    }}
                    className="rounded text-[#00b0ff]"
                  />
                  <span>[SAMPLE] Internal Project</span>
                </label>

                <div className="text-[10px] font-bold text-gray-400 uppercase pt-1">[SAMPLE] CLIENT A</div>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes("[SAMPLE] Project Alpha")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects((p) => [...p, "[SAMPLE] Project Alpha"]);
                      } else {
                        setSelectedProjects((p) => p.filter((x) => x !== "[SAMPLE] Project Alpha"));
                      }
                    }}
                    className="rounded text-[#00b0ff]"
                  />
                  <span>[SAMPLE] Project Alpha</span>
                </label>

                <div className="text-[10px] font-bold text-gray-400 uppercase pt-1">[SAMPLE] CLIENT B</div>
                <div className="space-y-1 ml-1">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes("[SAMPLE] Project Beta")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects((p) => [...p, "[SAMPLE] Project Beta"]);
                        } else {
                          setSelectedProjects((p) => p.filter((x) => x !== "[SAMPLE] Project Beta"));
                        }
                      }}
                      className="rounded text-[#00b0ff]"
                    />
                    <span>[SAMPLE] Project Beta</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes("[SAMPLE] Project Gamma")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects((p) => [...p, "[SAMPLE] Project Gamma"]);
                        } else {
                          setSelectedProjects((p) => p.filter((x) => x !== "[SAMPLE] Project Gamma"));
                        }
                      }}
                      className="rounded text-[#00b0ff]"
                    />
                    <span>[SAMPLE] Project Gamma</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeFilterModal === "description" && (
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg space-y-2 animate-fadeIn">
              <input
                type="text"
                placeholder="Contains description text..."
                value={descriptionSearch}
                onChange={(e) => setDescriptionSearch(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#00b0ff]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDescriptionSearch("")}
                  className="px-2.5 py-1 text-gray-500 hover:text-gray-800 text-xs"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilterModal(null)}
                  className="px-3 py-1 bg-[#00b0ff] text-white text-xs font-bold rounded-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================= */}
        {/* SUMMARY NUMBERS & ACTIONS CARD                          */}
        {/* ======================================================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => showToast("Invoice creation")}
                className="text-gray-700 hover:text-gray-900 font-medium hover:underline text-xs"
              >
                Create invoice
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="p-1 text-gray-600 hover:text-gray-900"
                title="Print report"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenShareModal) onOpenShareModal();
                }}
                className="p-1 text-gray-600 hover:text-gray-900"
                title="Share report"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => setRoundingEnabled((p) => !p)}
                  className={`w-7 h-4 rounded-full transition-colors relative ${
                    roundingEnabled ? "bg-[#00b0ff]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                      roundingEnabled ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-[11px] text-gray-600">Rounding</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsShowAmountOpen((p) => !p)}
                  className="text-[11px] text-gray-700 flex items-center gap-1 hover:text-gray-900"
                >
                  <span>Show {showAmountType.toLowerCase()}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isShowAmountOpen && (
                  <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                    {(["Amount", "Cost", "Profit"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setShowAmountType(type);
                          setIsShowAmountOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                          showAmountType === type ? "font-bold text-[#00b0ff]" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total:</p>
              <p className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
                {formattedTotalTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Billable:</p>
              <p className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
                {formattedBillableTime}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Amount:</p>
              <p className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
                {formattedAmount}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* BAR CHART SECTION (Screenshot 3)                        */}
        {/* ======================================================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="relative w-fit">
            <button
              type="button"
              onClick={() => setIsBillabilityOpen((p) => !p)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex items-center gap-1.5 hover:bg-gray-50"
            >
              <span>{billabilityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {isBillabilityOpen && (
              <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                {(["Billability", "Billable", "Non-billable"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBillabilityFilter(b);
                      setIsBillabilityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      billabilityFilter === b ? "font-bold text-[#00b0ff]" : "text-gray-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <div className="relative h-48 flex items-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {["8.3h", "6.9h", "5.6h", "4.2h", "2.8h", "1.4h", ""].map((label, idx) => (
                  <div key={idx} className="w-full flex items-center">
                    <span className="w-10 text-[10px] text-gray-400 font-mono shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 border-b border-dashed border-gray-200" />
                  </div>
                ))}
              </div>

              <div className="ml-10 flex-1 h-full flex items-end justify-between px-2 sm:px-4 z-10">
                {dailyChartData.map((d, i) => {
                  const maxH = 8.3;
                  const barHeightPct = Math.min((d.total / maxH) * 100, 100);

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onClick={() => showToast(`${d.day}: ${d.total}h total`)}
                    >
                      <div className="w-6 sm:w-10 flex flex-col items-center justify-end h-[85%]">
                        {d.total > 0 ? (
                          <div
                            style={{ height: `${barHeightPct}%` }}
                            className="w-full bg-[#9ccc65] hover:bg-[#8bc34a] rounded-t-sm transition-all relative shadow-2xs"
                          >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                              {d.total}h
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-0.5 bg-gray-200" />
                        )}
                      </div>

                      <div className="h-10 pt-2 flex items-start justify-center">
                        <span className="text-[9px] text-gray-600 -rotate-45 origin-top-left whitespace-nowrap">
                          {d.day}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* GROUP BY, DONUT CHART & BREAKDOWN TABLE                 */}
        {/* ======================================================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Group by:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGroupByPrimaryOpen((p) => !p)}
                  className="px-2.5 py-1 border border-gray-300 rounded-md font-medium text-gray-800 flex items-center gap-1 bg-white hover:bg-gray-50"
                >
                  <span>{groupByPrimary}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {isGroupByPrimaryOpen && (
                  <div className="absolute left-0 top-full mt-1 w-28 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                    {["Project", "Client", "User", "Tag"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGroupByPrimary(g);
                          setIsGroupByPrimaryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                          groupByPrimary === g ? "font-bold text-[#00b0ff]" : "text-gray-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGroupBySecondaryOpen((p) => !p)}
                  className="px-2.5 py-1 border border-gray-300 rounded-md font-medium text-gray-800 flex items-center gap-1 bg-white hover:bg-gray-50"
                >
                  <span>{groupBySecondary}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {isGroupBySecondaryOpen && (
                  <div className="absolute left-0 top-full mt-1 w-28 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                    {["Description", "User", "Date"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGroupBySecondary(g);
                          setIsGroupBySecondaryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                          groupBySecondary === g ? "font-bold text-[#00b0ff]" : "text-gray-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
              <div
                onClick={() => setShowEstimate((p) => !p)}
                className={`w-7 h-4 rounded-full transition-colors relative ${
                  showEstimate ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    showEstimate ? "translate-x-3" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-[11px]">Show estimate</span>
            </label>
          </div>

          <div className="border-t border-b border-gray-100 py-2 flex items-center justify-between text-xs">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortByOpen((p) => !p)}
                className="flex items-center gap-1 text-gray-700 font-medium hover:text-[#00b0ff]"
              >
                <div className="w-4 h-4 bg-cyan-100 text-[#00b0ff] rounded flex items-center justify-center text-[10px]">
                  ▾
                </div>
                <span>{sortBy}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isSortByOpen && (
                <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 text-xs">
                  {(["Title (up)", "Title (down)", "Duration (desc)", "Duration (asc)"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSortBy(s);
                          setIsSortByOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                          sortBy === s ? "font-bold text-[#00b0ff]" : "text-gray-700"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 font-bold rounded text-[11px]">
                  {currentEntries.length}
                </span>
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="font-semibold text-gray-800 truncate max-w-[140px] sm:max-w-none">
                  (Without proj...
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">{formattedTotalTime}</span>
                <span className="font-medium text-gray-600">{formattedAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-3 pb-2">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#cfd8dc"
                  strokeWidth="24"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#b0bec5"
                  strokeWidth="24"
                  strokeDasharray="364"
                  strokeDashoffset="0"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-gray-900 tracking-tight">
                  {formattedTotalTime}
                </span>
              </div>
            </div>

            <div className="mt-3 bg-black/85 text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Project</span>
              <span className="font-mono font-bold">{formattedTotalTime}</span>
              <span className="text-gray-300">100,00%</span>
            </div>
          </div>
        </div>

        {/* Detailed tab */}
        {activeTab === "Detailed" && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">Detailed Time Entries</h4>
            <div className="divide-y divide-gray-100 text-xs">
              {currentEntries.map((ent, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[65%]">
                    <p className="font-medium text-gray-900 truncate">{ent.description}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {ent.project} • {ent.client}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{ent.timeH}</p>
                    <p className="text-[11px] text-gray-500">${ent.amount} USD</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly tab */}
        {activeTab === "Weekly" && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 overflow-x-auto">
            <h4 className="font-bold text-gray-900 text-sm">Weekly Breakdown</h4>
            <table className="w-full text-xs text-left border-collapse min-w-[420px]">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] text-gray-500">
                  <th className="py-2">Project</th>
                  <th className="py-2 text-center">Mon</th>
                  <th className="py-2 text-center">Tue</th>
                  <th className="py-2 text-center">Wed</th>
                  <th className="py-2 text-center">Thu</th>
                  <th className="py-2 text-center">Fri</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 font-medium text-gray-800">[SAMPLE] Project Beta</td>
                  <td className="py-2.5 text-center text-gray-600">8h</td>
                  <td className="py-2.5 text-center text-gray-600">2h</td>
                  <td className="py-2.5 text-center text-gray-400">-</td>
                  <td className="py-2.5 text-center text-gray-400">-</td>
                  <td className="py-2.5 text-center text-gray-400">-</td>
                  <td className="py-2.5 text-right font-bold text-gray-900">10:02:38</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 6. TOAST NOTIFICATION                                     */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-4 py-2 rounded-full shadow-2xl z-50 animate-fadeIn backdrop-blur-xs">
          {toastMessage}
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODALS FOR THE REQUESTED FEATURES                      */}
      {/* ========================================================= */}

      {/* A. WORKSPACE SETTINGS MODAL */}
      {isWorkspaceSettingsOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsWorkspaceSettingsOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Workspace Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWorkspaceSettingsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Workspace Name */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceSettings.workspaceName}
                  onChange={(e) =>
                    setWorkspaceSettings((p) => ({ ...p, workspaceName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#00b0ff]"
                />
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Currency</label>
                <select
                  value={workspaceSettings.currency}
                  onChange={(e) =>
                    setWorkspaceSettings((p) => ({ ...p, currency: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none bg-white focus:border-[#00b0ff]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>

              {/* Time Format */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Time Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["12h", "24h"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setWorkspaceSettings((p) => ({ ...p, timeFormat: fmt }))}
                      className={`py-2 rounded-xl border text-center font-medium transition-colors ${
                        workspaceSettings.timeFormat === fmt
                          ? "border-[#00b0ff] bg-cyan-50 text-[#00b0ff] font-bold"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Format */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Date Format</label>
                <select
                  value={workspaceSettings.dateFormat}
                  onChange={(e) =>
                    setWorkspaceSettings((p) => ({
                      ...p,
                      dateFormat: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none bg-white focus:border-[#00b0ff]"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (19/07/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (07/19/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-19)</option>
                </select>
              </div>

              {/* Default Billable Rate */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700">Default Billable Rate ($/hr)</label>
                <input
                  type="number"
                  value={workspaceSettings.defaultBillableRate}
                  onChange={(e) =>
                    setWorkspaceSettings((p) => ({
                      ...p,
                      defaultBillableRate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#00b0ff]"
                />
              </div>

              {/* Project Favorites Toggle */}
              <label className="flex items-center justify-between py-2 border-t border-gray-100 cursor-pointer">
                <span className="font-medium text-gray-700">Enable Favorite Projects</span>
                <input
                  type="checkbox"
                  checked={workspaceSettings.isProjectFavoritesEnabled}
                  onChange={(e) =>
                    setWorkspaceSettings((p) => ({
                      ...p,
                      isProjectFavoritesEnabled: e.target.checked,
                    }))
                  }
                  className="rounded text-[#00b0ff] w-4 h-4 focus:ring-[#00b0ff]"
                />
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsWorkspaceSettingsOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveSettings(workspaceSettings)}
                className="flex-1 py-2.5 rounded-xl bg-[#00b0ff] text-white font-bold hover:bg-[#009ee6] text-xs shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. UPGRADE MODAL */}
      {isUpgradeModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsUpgradeModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Upgrade Workspace</h3>
                <p className="text-xs text-gray-500">Choose the best plan for your team</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-2 bg-gray-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setSelectedBillingCycle("monthly")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedBillingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setSelectedBillingCycle("annually")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  selectedBillingCycle === "annually"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Plans List */}
            <div className="space-y-3">
              {plans.map((p) => {
                const price = selectedBillingCycle === "annually" ? p.annualPrice : p.monthlyPrice;
                return (
                  <div
                    key={p.id}
                    className={`border rounded-2xl p-4 transition-all relative ${
                      p.isPopular
                        ? "border-[#00b0ff] bg-cyan-50/20 ring-1 ring-[#00b0ff]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {p.isPopular && (
                      <span className="absolute -top-2.5 right-4 bg-[#00b0ff] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">${price}</span>
                        <span className="text-[11px] text-gray-500"> /user/mo</span>
                      </div>
                    </div>

                    <ul className="space-y-1 mb-3 text-xs text-gray-600">
                      {p.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleUpgradePlan(p.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        p.isCurrent
                          ? "bg-gray-100 text-gray-500 cursor-default"
                          : "bg-[#00b0ff] text-white hover:bg-[#009ee6] active:scale-98"
                      }`}
                      disabled={p.isCurrent}
                    >
                      {p.isCurrent ? "Current Plan" : `Upgrade to ${p.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* C. SUBSCRIPTION DETAILS MODAL */}
      {isSubscriptionModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsSubscriptionModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Subscription</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Current Plan:</span>
                <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <span>{subscription.planName}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-semibold">
                    {subscription.status.toUpperCase()}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Days Remaining:</span>
                <span className="font-bold text-gray-800">{subscription.daysLeft} days left</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Billing Cycle:</span>
                <span className="font-medium text-gray-800 capitalize">{subscription.billingCycle}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Next Invoice Date:</span>
                <span className="font-medium text-gray-800">{subscription.nextBillingDate}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/60 pt-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-gray-800">{subscription.paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsSubscriptionModalOpen(false);
                  setIsUpgradeModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#00b0ff] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#009ee6]"
              >
                Change Plan / Upgrade
              </button>

              <button
                type="button"
                onClick={handleCancelSubscription}
                className="w-full py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. MANAGE WORKSPACE MODAL */}
      {isManageWorkspaceOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsManageWorkspaceOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">Manage Workspaces</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManageWorkspaceOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create New Workspace */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New workspace name..."
                value={newWorkspaceInput}
                onChange={(e) => setNewWorkspaceInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#00b0ff]"
              />
              <button
                type="button"
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceInput.trim()}
                className="px-4 py-2 bg-[#00b0ff] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </div>

            {/* Workspaces List */}
            <div className="space-y-2 text-xs">
              {workspacesList.map((ws) => (
                <div
                  key={ws.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                    ws.isCurrent
                      ? "border-[#00b0ff] bg-cyan-50/40 ring-1 ring-[#00b0ff]"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{ws.name}</span>
                      {ws.isCurrent && (
                        <span className="px-1.5 py-0.2 bg-[#00b0ff] text-white font-bold text-[9px] rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {ws.role} • {ws.membersCount} member{ws.membersCount > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!ws.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleSwitchWorkspace(ws.id)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold text-xs hover:bg-gray-100"
                      >
                        Switch
                      </button>
                    )}

                    {workspacesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkspace(ws.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* E. ADD-ONS MODAL */}
      {isAddonsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsAddonsModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-[#00b0ff]" />
                <h3 className="text-base font-bold text-gray-900">Clockify Add-ons</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddonsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {addonsList.map((addon) => (
                <div
                  key={addon.id}
                  className="p-3.5 border border-gray-200 rounded-2xl flex items-start justify-between gap-3 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-xs">{addon.name}</span>
                      <span className="px-1.5 py-0.2 bg-gray-100 text-gray-600 text-[10px] rounded-md font-medium">
                        {addon.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {addon.description}
                    </p>
                  </div>

                  {/* Toggle switch */}
                  <div
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                      addon.isEnabled ? "bg-[#00b0ff]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 shadow-xs ${
                        addon.isEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* F. NOTIFICATIONS MODAL */}
      {isNotificationsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsNotificationsModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {notificationsList.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkNotifRead(n.id)}
                    className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                      n.read
                        ? "bg-white border-gray-100 text-gray-600"
                        : "bg-cyan-50/40 border-cyan-200 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs">{n.title}</h4>
                      <span className="text-[10px] text-gray-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {notificationsList.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <button
                  type="button"
                  onClick={handleMarkAllNotifsRead}
                  className="text-[#00b0ff] font-semibold hover:underline"
                >
                  Mark all as read
                </button>
                <button
                  type="button"
                  onClick={handleClearNotifs}
                  className="text-gray-500 hover:text-gray-800"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* G. HELP & SUPPORT MODAL */}
      {isHelpModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsHelpModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Help & Support</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700">Guides & Documentation</p>
              <div className="space-y-1.5 text-xs">
                {helpResourcesList.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-gray-100 hover:border-[#00b0ff] hover:bg-cyan-50/30 flex items-center justify-between text-gray-700 hover:text-[#00b0ff] transition-all"
                  >
                    <div>
                      <p className="font-semibold">{res.title}</p>
                      <p className="text-[10px] text-gray-400">{res.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Support Form */}
            <div className="pt-2 border-t border-gray-100 space-y-2.5">
              <p className="text-xs font-bold text-gray-700">Contact Clockify Support</p>
              <input
                type="text"
                placeholder="Subject..."
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#00b0ff]"
              />
              <textarea
                placeholder="Describe your issue or feedback..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#00b0ff] resize-none"
              />
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={!feedbackMessage.trim()}
                className="w-full py-2.5 bg-[#00b0ff] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#009ee6]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
