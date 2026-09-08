import React, { useState, useEffect } from "react";
import type { DetectedActivity, AutoTrackerStatus, Project } from "../backend/types.ts";
import { autoTrackerService } from "../backend/services/AutoTrackerService.ts";
import { projectRepository } from "../backend/repositories/ProjectRepository.ts";
import { AutoTrackerProjectModal } from "../components/modals/AutoTrackerProjectModal.tsx";
import {
  Bot,
  Power,
  CheckCheck,
  Check,
  Code2,
  Palette,
  Globe,
  Terminal,
  MessageSquare,
  FileText,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react";

interface AutoTrackerScreenProps {
  onActivityLogged?: () => void;
}

export const AutoTrackerScreen: React.FC<AutoTrackerScreenProps> = ({
  onActivityLogged,
}) => {
  const [activities, setActivities] = useState<DetectedActivity[]>([]);
  const [status, setStatus] = useState<AutoTrackerStatus | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedApp, setSelectedApp] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Project reassignment modal
  const [editingActivity, setEditingActivity] = useState<DetectedActivity | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [acts, st, projs] = await Promise.all([
        autoTrackerService.getActivities(),
        autoTrackerService.getStatus(),
        projectRepository.getAll(),
      ]);
      setActivities(acts);
      setStatus(st);
      setProjects(projs);
    } catch (err) {
      console.error("Failed to load auto tracker data", err);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Recording
  const handleToggleRecording = async () => {
    try {
      const next = await autoTrackerService.toggleRecording();
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      showToast(
        next
          ? "AI Background Tracking enabled (Recording: ON)"
          : "AI Background Tracking paused (Recording: OFF)"
      );
    } catch (err) {
      console.error("Failed to toggle recording", err);
    }
  };

  // Log single activity as Time Entry
  const handleLogActivity = async (id: string) => {
    try {
      const { activity } = await autoTrackerService.logActivity(id);
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isLogged: true } : a))
      );
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      onActivityLogged?.();
      showToast(`Logged "${activity.app}: ${activity.windowTitle}" as Time Entry`);
    } catch (err: any) {
      console.error("Failed to log activity", err);
      showToast(`Error: ${err.message}`);
    }
  };

  // Accept all suggestions
  const handleAcceptAll = async () => {
    try {
      const { activities: updated, createdEntriesCount } =
        await autoTrackerService.logAll();
      setActivities(updated);
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      onActivityLogged?.();
      showToast(`Accepted ${createdEntriesCount} suggestions and created Time Entries`);
    } catch (err: any) {
      console.error("Failed to accept all", err);
    }
  };

  // Discard activity
  const handleDiscardActivity = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await autoTrackerService.discardActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      showToast("Activity discarded");
    } catch (err: any) {
      console.error("Failed to discard activity", err);
    }
  };

  // Update Suggested Project
  const handleSelectProject = async (project: Project) => {
    if (!editingActivity) return;
    try {
      const updated = await autoTrackerService.updateProject(
        editingActivity.id,
        project.name,
        project.color,
        project.id
      );
      if (updated) {
        setActivities((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        showToast(`Project updated to "${project.name}"`);
      }
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  // Simulate new background window detection
  const handleSimulateDetection = async () => {
    try {
      setIsSimulating(true);
      const newAct = await autoTrackerService.simulateDetectedActivity();
      setActivities((prev) => [newAct, ...prev]);
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      showToast(`New background activity detected: ${newAct.app}`);
    } catch (err) {
      console.error("Failed to simulate detection", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset sample activities
  const handleReset = async () => {
    try {
      const resetList = await autoTrackerService.reset();
      setActivities(resetList);
      const updatedStatus = await autoTrackerService.getStatus();
      setStatus(updatedStatus);
      showToast("Auto Tracker sample data reset");
    } catch (err) {
      console.error("Failed to reset autotracker", err);
    }
  };

  // App filter list
  const apps = ["All", ...Array.from(new Set(activities.map((a) => a.app)))];

  // Filtering
  const filteredActivities = activities.filter((a) => {
    if (selectedApp !== "All" && a.app !== selectedApp) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.windowTitle.toLowerCase().includes(q);
      const matchApp = a.app.toLowerCase().includes(q);
      const matchProj = a.suggestedProject.toLowerCase().includes(q);
      if (!matchTitle && !matchApp && !matchProj) return false;
    }
    return true;
  });

  const unloggedCount = activities.filter((a) => !a.isLogged).length;
  const totalUnloggedMinutes = activities
    .filter((a) => !a.isLogged)
    .reduce((sum, a) => sum + a.durationMinutes, 0);

  const formatHoursMinutes = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatDurationHMS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getIcon = (iconType: DetectedActivity["iconType"]) => {
    switch (iconType) {
      case "code":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#03a9f4]/15 border border-[#03a9f4]/30 flex items-center justify-center text-[#03a9f4] shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
        );
      case "design":
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Palette className="w-5 h-5" />
          </div>
        );
      case "browser":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
        );
      case "terminal":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
        );
      case "communication":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center text-slate-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
    }
  };

  const isRecording = status?.isRecording ?? true;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#121517] text-white overflow-hidden relative select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-2 left-3 right-3 z-40 flex items-center gap-2 bg-[#1b232e] border border-[#03a9f4]/40 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-2xl animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#03a9f4] shrink-0" />
          <span className="flex-1 truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Status Bar */}
      <div className="px-4 py-2.5 border-b border-[#232932] bg-[#161a20] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#8c9ba8] truncate">
          <span className="truncate">Gopalan College</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#5a6575] shrink-0" />
          <span className="text-white font-medium truncate">AI Autonomous Tracker</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tracking Power Button */}
          <button
            type="button"
            onClick={handleToggleRecording}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition active:scale-95 ${
              isRecording
                ? "bg-[#064e3b]/40 text-[#34d399] border-[#059669]/60"
                : "bg-[#232932] text-[#8c9ba8] border-[#374151]"
            }`}
            title={isRecording ? "Pause tracking" : "Resume tracking"}
          >
            <Power className="w-3 h-3" />
            <span>{isRecording ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Banner Card: Today's Detected Background Activity */}
        <div className="bg-[#1a2027] border border-[#27303c] p-4 rounded-2xl shadow-md space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white">
                  Today's Detected Background Activity
                </h3>
                {isRecording && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8c9ba8] mt-1 leading-relaxed">
                TimeFlow AI automatically groups window events and suggests project allocations.
              </p>
            </div>
          </div>

          {/* Metrics & Bulk Action Row */}
          <div className="pt-2 border-t border-[#27303c] flex items-center justify-between gap-2 flex-wrap">
            <div>
              <span className="text-xs font-mono font-bold text-[#03a9f4] block">
                {unloggedCount} Unlogged Block{unloggedCount === 1 ? "" : "s"} (
                {formatHoursMinutes(totalUnloggedMinutes)})
              </span>
              <span className="text-[11px] text-[#6d7a89]">
                Total {activities.length} activity blocks recorded
              </span>
            </div>

            {/* Accept All Suggestions Button */}
            <button
              type="button"
              onClick={handleAcceptAll}
              disabled={unloggedCount === 0}
              className="px-3 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] disabled:opacity-40 disabled:hover:bg-[#03a9f4] text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition active:scale-95 shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Accept All ({unloggedCount})</span>
            </button>
          </div>
        </div>

        {/* Quick Simulator & Reset Toolbar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSimulateDetection}
            disabled={isSimulating}
            className="flex-1 py-2 px-3 rounded-xl bg-[#1e2530] border border-[#2b3340] hover:bg-[#252f3d] text-xs font-medium text-[#03a9f4] flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Detection</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-3 rounded-xl bg-[#1e2530] border border-[#2b3340] hover:bg-[#252f3d] text-xs font-medium text-[#8c9ba8] hover:text-white flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Reset sample data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c9ba8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter window title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b2027] border border-[#262e38] text-xs text-white placeholder-[#8c9ba8] rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-[#03a9f4] transition"
            />
          </div>

          {/* App Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[#6d7a89] shrink-0 ml-1 mr-0.5" />
            {apps.map((app) => {
              const isActive = selectedApp === app;
              return (
                <button
                  key={app}
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? "bg-[#03a9f4] text-white shadow"
                      : "bg-[#1b2027] border border-[#262e38] text-[#8c9ba8] hover:text-white"
                  }`}
                >
                  {app}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Cards List */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="bg-[#1a2027] border border-[#27303c] rounded-2xl p-8 text-center text-xs text-[#8c9ba8]">
              No activities match your filters.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                className={`bg-[#1b2027] border rounded-2xl p-4 shadow-sm transition space-y-3 ${
                  act.isLogged
                    ? "border-[#262e38] opacity-80"
                    : "border-[#2d3644] hover:border-[#03a9f4]"
                }`}
              >
                {/* Top Row: Icon, App + Title, Discard Button */}
                <div className="flex items-start gap-3">
                  {getIcon(act.iconType)}

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate leading-snug">
                      {act.app}: {act.windowTitle}
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* AI Match Project Pill (Clickable to change project) */}
                      <button
                        type="button"
                        onClick={() => setEditingActivity(act)}
                        className="inline-flex items-center gap-1.5 bg-[#232a35] hover:bg-[#2c3543] border border-[#343e4f] px-2.5 py-0.5 rounded-full text-[11px] text-[#00e5ff] font-medium transition active:scale-95"
                        title="Click to reassign project"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: act.projectColor || "#03a9f4" }}
                        />
                        <span className="truncate max-w-[130px]">
                          AI Match: {act.suggestedProject}
                        </span>
                      </button>

                      <span className="text-[11px] text-[#8c9ba8]">
                        {act.startTime} - {act.endTime} · {act.durationMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Discard / Delete Action */}
                  <button
                    type="button"
                    onClick={(e) => handleDiscardActivity(act.id, e)}
                    className="text-[#64748b] hover:text-[#ef4444] p-1.5 rounded-lg hover:bg-white/5 transition"
                    title="Discard activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Row: Duration Counter & Primary Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#262e38]/80">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-[#03a9f4]" />
                    <span>{formatDurationHMS(act.durationSeconds)}</span>
                  </div>

                  <div>
                    {act.isLogged ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] rounded-xl text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Logged</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLogActivity(act.id)}
                        className="px-3.5 py-1.5 bg-[#03a9f4] hover:bg-[#0288d1] text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log as Entry</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Privacy Note matching desktop */}
        <div className="flex items-center gap-2 p-3 bg-[#161a20] border border-[#232932] rounded-2xl text-[11px] text-[#8c9ba8] leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
          <span>
            Autonomous activity tracking is saved locally on your device. Only accepted entries are synchronized to your workspace.
          </span>
        </div>
      </div>

      {/* Project Selection Modal */}
      <AutoTrackerProjectModal
        isOpen={Boolean(editingActivity)}
        projects={projects}
        currentProjectName={editingActivity?.suggestedProject || ""}
        onSelectProject={handleSelectProject}
        onClose={() => setEditingActivity(null)}
      />
    </div>
  );
};
