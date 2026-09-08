import React, { useState, useEffect, useRef } from "react";
import { AndroidFrame } from "./components/AndroidFrame";
import { TopAppBar, type ScreenType } from "./components/TopAppBar";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { TimeTrackerScreen } from "./screens/TimeTrackerScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { ExpensesScreen } from "./screens/ExpensesScreen";
import { TimeOffScreen } from "./screens/TimeOffScreen";
import { ReportsScreen } from "./screens/ReportsScreen";
import { ProjectsScreen } from "./screens/ProjectsScreen";
import { ClientsScreen } from "./screens/ClientsScreen";
import { TagsScreen } from "./screens/TagsScreen";
import { TeamScreen } from "./screens/TeamScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { AutoTrackerScreen } from "./screens/AutoTrackerScreen";

// Screens & Modals
import { NewTimeEntryScreen } from "./screens/NewTimeEntryScreen";
import type { PomodoroSettings } from "./screens/PomodoroSettingsScreen";
import { ProjectModal } from "./components/modals/ProjectModal";
import { ClientModal } from "./components/modals/ClientModal";
import { TagModal } from "./components/modals/TagModal";
import { TeamModal } from "./components/modals/TeamModal";
import { ExpenseModal } from "./components/modals/ExpenseModal";
import { TimeOffModal } from "./components/modals/TimeOffModal";

import type {
  TimeEntry,
  DayGroup,
  Project,
  TaskItem,
  Tag,
  Client,
  TeamMember,
  Expense,
  TimeOffRequest,
  TimerStatus,
} from "./backend/types";

export default function App() {
  // Navigation & Drawer state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("timeTracker");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [timerStatus, setTimerStatus] = useState<TimerStatus | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Workspace & App Settings State
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Modals state
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [manualDurationSeconds, setManualDurationSeconds] = useState<number | undefined>(undefined);
  const [isCalendarMenuOpen, setIsCalendarMenuOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);

  // User Profile
  const userName = "vishalkomi954";
  const userEmail = "vishalkomi954@gmail.com";
  const workspaceName = "gcem";

  // Pomodoro Settings State (Persisted)
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => {
    try {
      const saved = localStorage.getItem("clockify_pomodoro_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      focusMinutes: 25,
      shortBreakMinutes: 5,
      automaticBreak: true,
      defaultBreakProject: false,
    };
  });

  const handleSavePomodoroSettings = (newSettings: PomodoroSettings) => {
    setPomodoroSettings(newSettings);
    try {
      localStorage.setItem("clockify_pomodoro_settings", JSON.stringify(newSettings));
    } catch (e) {}
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        statusRes,
        entriesRes,
        projectsRes,
        tagsRes,
        clientsRes,
        teamRes,
        expensesRes,
        timeOffRes,
        settingsRes,
      ] = await Promise.all([
        fetch("/api/timer/status").then((r) => r.json()),
        fetch("/api/time-entries?grouped=true").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/tags").then((r) => r.json()),
        fetch("/api/clients").then((r) => r.json()),
        fetch("/api/team").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/time-off").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()).catch(() => null),
      ]);

      if (statusRes) setTimerStatus(statusRes);
      if (Array.isArray(entriesRes)) setDayGroups(entriesRes);
      if (Array.isArray(projectsRes)) setProjects(projectsRes);
      if (Array.isArray(tagsRes)) setTags(tagsRes);
      if (Array.isArray(clientsRes)) setClients(clientsRes);
      if (Array.isArray(teamRes)) setTeamMembers(teamRes);
      if (Array.isArray(expensesRes)) setExpenses(expensesRes);
      if (Array.isArray(timeOffRes)) setTimeOffRequests(timeOffRes);
      if (settingsRes?.data) {
        if (settingsRes.data.workspace?.defaultProjectId) {
          setDefaultProjectId(settingsRes.data.workspace.defaultProjectId);
        }
        if (typeof settingsRes.data.app?.forcedOfflineMode === "boolean") {
          setIsOfflineMode(settingsRes.data.app.forcedOfflineMode);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer actions
  const handleStartTimer = async (data: {
    description: string;
    projectId?: string;
    projectName?: string;
    projectColor?: string;
    clientName?: string;
    isBillable: boolean;
    tags: string[];
  }) => {
    const targetProjectId = data.projectId || (defaultProjectId || undefined);
    const proj = projects.find((p) => p.id === targetProjectId);
    try {
      const res = await fetch("/api/timer/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: data.description,
          projectId: proj?.id,
          projectName: proj?.name || data.projectName || (proj ? proj.name : "No project"),
          projectColor: proj?.color || data.projectColor || (proj ? proj.color : "#94a3b8"),
          clientName: proj?.clientName || data.clientName,
          isBillable: data.isBillable,
          tags: data.tags,
        }),
      }).then((r) => r.json());

      if (res) {
        setTimerStatus(res);
      }
    } catch (err) {
      console.error("Failed to start timer:", err);
    }
  };

  const handleStopTimer = async () => {
    try {
      await fetch("/api/timer/stop", { method: "POST" });
      setTimerStatus({
        isTracking: false,
        description: "",
        projectName: "No project",
        projectColor: "#94a3b8",
        isBillable: true,
        tags: [],
        elapsedSeconds: 0,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to stop timer:", err);
    }
  };

  const handleDiscardTimer = async () => {
    try {
      await fetch("/api/timer/discard", { method: "POST" });
      setTimerStatus({
        isTracking: false,
        description: "",
        projectName: "No project",
        projectColor: "#94a3b8",
        isBillable: true,
        tags: [],
        elapsedSeconds: 0,
      });
    } catch (err) {
      console.error("Failed to discard timer:", err);
    }
  };

  // Manual Time Entry creation
  const handleCreateManualEntry = async (data: {
    description: string;
    projectId?: string;
    projectName?: string;
    projectColor?: string;
    clientName?: string;
    taskId?: string;
    taskName?: string;
    tags: string[];
    isBillable: boolean;
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }) => {
    const proj = projects.find((p) => p.id === data.projectId);
    try {
      await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: data.description || "No description",
          projectId: proj?.id,
          projectName: proj?.name || data.projectName || "No project",
          projectColor: proj?.color || data.projectColor || "#94a3b8",
          clientName: proj?.clientName || data.clientName,
          taskId: data.taskId,
          taskName: data.taskName,
          isBillable: data.isBillable,
          tags: data.tags,
          startTime: data.startTime,
          endTime: data.endTime,
          durationSeconds: data.durationSeconds,
        }),
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to create time entry:", err);
    }
  };

  // Delete Entry
  const handleDeleteEntry = async (id: string) => {
    try {
      await fetch(`/api/time-entries/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  // Duplicate Entry
  const handleDuplicateEntry = async (entry: TimeEntry) => {
    try {
      await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: entry.description,
          projectId: entry.projectId,
          projectName: entry.projectName,
          projectColor: entry.projectColor,
          clientName: entry.clientName,
          isBillable: entry.isBillable,
          tags: entry.tags,
          startTime: new Date().toISOString(),
          durationSeconds: entry.durationSeconds,
        }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to duplicate entry:", err);
    }
  };

  // Split Entry
  const handleSplitEntry = async (entry: TimeEntry) => {
    try {
      const half1 = Math.max(1, Math.floor(entry.durationSeconds / 2));
      const half2 = Math.max(1, entry.durationSeconds - half1);

      // Update existing entry with half1
      await fetch(`/api/time-entries/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationSeconds: half1,
        }),
      });

      // Create new second entry with half2
      const splitStartTime = new Date(
        new Date(entry.startTime).getTime() + half1 * 1000
      ).toISOString();

      await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: entry.description,
          projectId: entry.projectId,
          projectName: entry.projectName,
          projectColor: entry.projectColor,
          clientName: entry.clientName,
          isBillable: entry.isBillable,
          tags: entry.tags,
          startTime: splitStartTime,
          durationSeconds: half2,
        }),
      });

      fetchData();
    } catch (err) {
      console.error("Failed to split entry:", err);
    }
  };

  // Create Break Entry matching screenshot 2
  const handleCreateBreakEntry = async () => {
    try {
      await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Break",
          projectName: "No project",
          isBillable: true,
          tags: ["Break"],
          durationSeconds: 4, // 00:00:04 as in reference screenshot 2
        }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create break entry:", err);
    }
  };

  // Seed sample entries
  const handleSeedData = async () => {
    try {
      await fetch("/api/seed-sample-data", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Failed to seed data:", err);
    }
  };

  // Projects CRUD
  const handleCreateProject = async (name: string, color: string, clientName?: string) => {
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color, clientName }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  const handleUpdateTask = async (
    projectId: string,
    taskId: string,
    updates: Partial<TaskItem>
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        };
      })
    );
    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleCreateTask = async (projectId: string, name: string) => {
    try {
      await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // Clients CRUD
  const handleCreateClient = async (name: string, currency: string, address?: string) => {
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currency, address }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create client:", err);
    }
  };

  const handleArchiveClient = async (id: string) => {
    try {
      await fetch(`/api/clients/${id}/archive`, { method: "POST" });
      fetchData();
    } catch (err) {
      console.error("Failed to archive client:", err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  // Tags CRUD
  const handleCreateTag = async (name: string) => {
    try {
      await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create tag:", err);
    }
  };

  // Team CRUD
  const handleAddMember = async (name: string, email: string, role: TeamMember["role"]) => {
    try {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  // Expenses CRUD
  const handleCreateExpense = async (data: Omit<Expense, "id">) => {
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create expense:", err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  // Time Off CRUD
  const handleRequestTimeOff = async (data: {
    policyName: string;
    startDate: string;
    endDate: string;
    dateRangeLabel: string;
    durationDays: number;
    note?: string;
  }) => {
    try {
      await fetch("/api/time-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          ...data,
          status: "pending",
        }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to request time off:", err);
    }
  };

  // Android System Back Button Behavior
  const handleAndroidBack = () => {
    // If any modal is open, close it
    if (showTimeEntryModal) {
      setShowTimeEntryModal(false);
      setEditingEntry(null);
      return;
    }
    if (showProjectModal) {
      setShowProjectModal(false);
      return;
    }
    if (showClientModal) {
      setShowClientModal(false);
      return;
    }
    if (showTagModal) {
      setShowTagModal(false);
      return;
    }
    if (showTeamModal) {
      setShowTeamModal(false);
      return;
    }
    if (showExpenseModal) {
      setShowExpenseModal(false);
      return;
    }
    if (showTimeOffModal) {
      setShowTimeOffModal(false);
      return;
    }
    if (showSearch) {
      setShowSearch(false);
      setSearchQuery("");
      return;
    }

    // If drawer is open, close it
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      return;
    }

    // If on another screen, return to Time Tracker
    if (currentScreen !== "timeTracker") {
      setCurrentScreen("timeTracker");
    }
  };

  const handleAndroidHome = () => {
    setIsDrawerOpen(false);
    setShowSearch(false);
    setSearchQuery("");
    setCurrentScreen("timeTracker");
  };

  return (
    <AndroidFrame onBackPress={handleAndroidBack} onHomePress={handleAndroidHome}>
      {/* Top App Bar with hamburger, orange dot, title & actions */}
      <TopAppBar
        currentScreen={currentScreen}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onBackClick={() => setCurrentScreen("timeTracker")}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSearch={() => {
          setShowSearch(!showSearch);
          if (showSearch) setSearchQuery("");
        }}
        onSettingsClick={() => setCurrentScreen("settings")}
        onFilterClick={() => alert("Filter applied")}
        onExportClick={() => alert("Exporting report...")}
        onShareClick={() => alert("Sharing report...")}
        onMoreClick={() => {
          if (currentScreen === "calendar") {
            setIsCalendarMenuOpen((prev) => !prev);
          } else {
            alert("Options menu");
          }
        }}
      />

      {/* Forced Offline Mode Notification Banner */}
      {isOfflineMode && (
        <div className="bg-[#e65100]/25 border-b border-[#ff9800]/40 px-4 py-1.5 flex items-center justify-between text-xs text-[#ffb74d] shrink-0 select-none animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9800] animate-pulse" />
            <span className="font-medium">Offline Mode Active</span>
          </div>
          <button
            onClick={() => setCurrentScreen("settings")}
            className="text-[11px] underline text-[#ffcc80] hover:text-white transition-colors"
          >
            Settings
          </button>
        </div>
      )}

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TIME TRACKER SCREEN (Primary source of truth matching Time Tracker.jpeg) */}
        {currentScreen === "timeTracker" && (
          <TimeTrackerScreen
            dayGroups={dayGroups}
            timerStatus={timerStatus}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            onDiscardTimer={handleDiscardTimer}
            onOpenNewEntryModal={() => {
              setEditingEntry(null);
              setManualDurationSeconds(undefined);
              setShowTimeEntryModal(true);
            }}
            onOpenManualEntryModal={() => {
              setEditingEntry(null);
              setManualDurationSeconds(undefined);
              setShowTimeEntryModal(true);
            }}
            onSelectEntry={(entry) => {
              setEditingEntry(entry);
              setManualDurationSeconds(undefined);
              setShowTimeEntryModal(true);
            }}
            onContinueEntry={(entry) => {
              handleStartTimer({
                description: entry.description,
                projectId: entry.projectId,
                projectName: entry.projectName,
                projectColor: entry.projectColor,
                isBillable: entry.isBillable,
                tags: entry.tags,
              });
            }}
            onDuplicateEntry={handleDuplicateEntry}
            onSplitEntry={handleSplitEntry}
            onDeleteEntry={handleDeleteEntry}
            onCreateBreakEntry={handleCreateBreakEntry}
            onCreateTimeEntry={handleCreateManualEntry}
            onSeedData={handleSeedData}
            projects={projects}
            pomodoroSettings={pomodoroSettings}
            onSavePomodoroSettings={handleSavePomodoroSettings}
            onOpenProjectModal={() => setShowProjectModal(true)}
            onUpdateProject={handleUpdateProject}
            onUpdateTask={handleUpdateTask}
            onCreateTask={handleCreateTask}
          />
        )}

        {/* AUTO TRACKER SCREEN */}
        {currentScreen === "autoTracker" && (
          <AutoTrackerScreen onActivityLogged={fetchData} />
        )}

        {/* CALENDAR SCREEN */}
        {currentScreen === "calendar" && (
          <CalendarScreen
            dayGroups={dayGroups}
            projects={projects}
            tags={tags}
            timerStatus={timerStatus}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            onOpenNewEntryModal={(durationSec?: number) => {
              setEditingEntry(null);
              setManualDurationSeconds(durationSec);
              setShowTimeEntryModal(true);
            }}
            isCalendarMenuOpen={isCalendarMenuOpen}
            onCloseCalendarMenu={() => setIsCalendarMenuOpen(false)}
          />
        )}

        {/* EXPENSES SCREEN */}
        {currentScreen === "expenses" && (
          <ExpensesScreen
            expenses={expenses}
            onOpenExpenseModal={() => setShowExpenseModal(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {/* TIME OFF SCREEN */}
        {currentScreen === "timeOff" && (
          <TimeOffScreen
            requests={timeOffRequests}
            onOpenTimeOffModal={() => setShowTimeOffModal(true)}
          />
        )}

        {/* REPORTS SCREEN */}
        {currentScreen === "reports" && <ReportsScreen projects={projects} />}

        {/* PROJECTS SCREEN */}
        {currentScreen === "projects" && (
          <ProjectsScreen
            projects={projects}
            searchQuery={searchQuery}
            onOpenProjectModal={() => setShowProjectModal(true)}
            onUpdateProject={handleUpdateProject}
            onUpdateTask={handleUpdateTask}
            onCreateTask={handleCreateTask}
          />
        )}

        {/* CLIENTS SCREEN */}
        {currentScreen === "clients" && (
          <ClientsScreen
            clients={clients}
            searchQuery={searchQuery}
            onOpenClientModal={() => setShowClientModal(true)}
            onArchiveClient={handleArchiveClient}
            onDeleteClient={handleDeleteClient}
          />
        )}

        {/* TAGS SCREEN */}
        {currentScreen === "tags" && (
          <TagsScreen
            tags={tags}
            searchQuery={searchQuery}
            onOpenTagModal={() => setShowTagModal(true)}
            onDeleteTag={(id: string) => setTags(tags.filter((t) => t.id !== id))}
          />
        )}

        {/* TEAM SCREEN */}
        {currentScreen === "team" && (
          <TeamScreen
            members={teamMembers}
            searchQuery={searchQuery}
            onOpenTeamModal={() => setShowTeamModal(true)}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {/* SETTINGS SCREEN */}
        {currentScreen === "settings" && (
          <SettingsScreen
            onDefaultProjectChange={(projId) => setDefaultProjectId(projId)}
            onOfflineModeChange={(offline) => setIsOfflineMode(offline)}
          />
        )}

        {/* PROFILE SCREEN (when clicked from Drawer profile) */}
        {currentScreen === "profile" && (
          <div className="flex-1 overflow-y-auto bg-[#0f1216] p-5 space-y-5 select-none pb-12">
            <div className="flex flex-col items-center justify-center pt-4 pb-2">
              <div className="w-20 h-20 rounded-3xl bg-[#00b0ff] flex items-center justify-center font-bold text-2xl text-white shadow-xl mb-3">
                VI
              </div>
              <h2 className="text-lg font-bold text-white">{userName}</h2>
              <p className="text-xs text-[#8c9ba5]">{userEmail}</p>
            </div>

            <div className="bg-[#1a1f26] border border-[#27303c] rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8c9ba5]">
                Account & Workspace
              </h3>
              <div className="flex items-center justify-between py-2 border-b border-[#242b36]">
                <span className="text-xs text-[#8c9ba5]">Workspace</span>
                <span className="text-sm font-semibold text-white">{workspaceName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#242b36]">
                <span className="text-xs text-[#8c9ba5]">Role</span>
                <span className="text-sm font-semibold text-white">Workspace Owner</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#8c9ba5]">Email</span>
                <span className="text-sm font-semibold text-white">{userEmail}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentScreen("timeTracker")}
              className="w-full py-3 rounded-2xl bg-[#1d232c] border border-[#27303d] text-white font-medium text-xs hover:bg-[#252e3a]"
            >
              Back to Time Tracker
            </button>
          </div>
        )}
      </div>

      {/* Navigation Drawer matching Manage.jpeg and WhatsApp screenshot */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setShowSearch(false);
          setSearchQuery("");
        }}
        userName={userName}
        userEmail={userEmail}
        workspaceName={workspaceName}
        onOpenProfile={() => setCurrentScreen("profile")}
      />

      {/* Screens & Modals */}
      <NewTimeEntryScreen
        isOpen={showTimeEntryModal}
        onClose={() => {
          setShowTimeEntryModal(false);
          setEditingEntry(null);
          setManualDurationSeconds(undefined);
        }}
        onSave={handleCreateManualEntry}
        projects={projects}
        tags={tags}
        initialEntry={editingEntry}
        initialDurationSeconds={manualDurationSeconds}
        defaultProjectId={defaultProjectId}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onCreateProject={handleCreateProject}
        clients={clients}
      />

      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onCreateClient={handleCreateClient}
      />

      <TagModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onCreateTag={handleCreateTag}
      />

      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onAddMember={handleAddMember}
      />

      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onCreateExpense={handleCreateExpense}
        projects={projects}
      />

      <TimeOffModal
        isOpen={showTimeOffModal}
        onClose={() => setShowTimeOffModal(false)}
        onRequestTimeOff={handleRequestTimeOff}
      />
    </AndroidFrame>
  );
}
