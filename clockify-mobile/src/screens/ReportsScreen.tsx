import React, { useState, useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  Check,
  Edit2,
  Globe,
  Share2,
  Copy,
  FileSpreadsheet,
  FileText,
  Settings,
  ArrowLeft,
  Filter,
} from "lucide-react";
import type { DayGroup, Project, Client, Tag, TeamMember } from "../backend/types";
import {
  ExportSettings,
  defaultExportSettings,
  exportToCsv,
  exportToExcel,
  exportToPdf,
} from "../utils/reportExport";
import { WebReportsView, type WebReportsViewHandle } from "../components/reports/WebReportsView";

// Official Illustration matching Google Play store reference (screen_14.png)
const AdvancedReportsIllustration: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Document */}
    <g>
      {/* Document Sheet */}
      <path
        d="M16 10C16 7.79086 17.7909 6 20 6H40L52 18V52C52 54.2091 50.2091 56 48 56H20C17.7909 56 16 54.2091 16 52V10Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Folded corner */}
      <path
        d="M40 6V18H52"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Document text placeholder lines */}
      <rect x="22" y="22" width="16" height="2" rx="1" fill="#E2E8F0" />
      <rect x="22" y="27" width="22" height="2" rx="1" fill="#E2E8F0" />
      <rect x="22" y="32" width="18" height="2" rx="1" fill="#E2E8F0" />
      <rect x="22" y="37" width="14" height="2" rx="1" fill="#E2E8F0" />
    </g>

    {/* Blue Circle Badge overlapping bottom right */}
    <circle cx="46" cy="46" r="16" fill="#03A9F4" />

    {/* Computer monitor/screen inside badge */}
    <rect x="38" y="38" width="16" height="11" rx="1.5" fill="#FFFFFF" />
    <rect x="39.5" y="39.5" width="13" height="8" rx="0.5" fill="#0288D1" />
    {/* Screen stand */}
    <path d="M44 49H48V51H44V49Z" fill="#FFFFFF" />
    <rect x="42.5" y="51" width="7" height="1.2" rx="0.6" fill="#FFFFFF" />

    {/* Colorful mini bars inside monitor */}
    <rect x="41.5" y="44" width="2" height="3" rx="0.5" fill="#4CAF50" />
    <rect x="45" y="41.5" width="2" height="5.5" rx="0.5" fill="#FF9800" />
    <rect x="48.5" y="43" width="2" height="4" rx="0.5" fill="#E91E63" />
  </svg>
);

export interface ReportsScreenProps {
  dayGroups?: DayGroup[];
  projects?: Project[];
  clients?: Client[];
  tags?: Tag[];
  teamMembers?: TeamMember[];
  isFilterSheetOpen?: boolean;
  onCloseFilterSheet?: () => void;
  isExportMenuOpen?: boolean;
  onCloseExportMenu?: () => void;
  isShareScreenOpen?: boolean;
  onCloseShareScreen?: () => void;
  onOpenFilterSheet?: () => void;
  onOpenExportMenu?: () => void;
  onOpenShareScreen?: () => void;
}

export interface ReportsScreenHandle {
  handleBack: () => boolean;
  handleHome: () => void;
}

export type DateRangePreset =
  | "Jul 27 - Aug 2"
  | "Jul 13 - Jul 19"
  | "This week"
  | "Last week"
  | "This month"
  | "Last month"
  | "This year"
  | "Last year"
  | "Custom range";

export type GroupByOption =
  | "Project"
  | "Client"
  | "User"
  | "Group"
  | "Tag"
  | "Month"
  | "Week"
  | "Date";

export type SortByOption = "Most tracked" | "Least tracked" | "A-Z" | "Z-A";

// Sample initial data matching screenshots exactly
const SAMPLE_PROJECTS = [
  { id: "sample-p1", name: "[SAMPLE] Internal Project", clientName: "NO CLIENT", color: "#ec4899" },
  { id: "sample-p2", name: "[SAMPLE] Project Alpha", clientName: "[SAMPLE] Client A", color: "#3b82f6" },
  { id: "sample-p3", name: "[SAMPLE] Project Beta", clientName: "[SAMPLE] Client B", color: "#10b981" },
  { id: "sample-p4", name: "[SAMPLE] Project Gamma", clientName: "[SAMPLE] Client B", color: "#f59e0b" },
];

const SAMPLE_CLIENTS = ["[SAMPLE] Client A", "[SAMPLE] Client B"];

const SAMPLE_TEAM = [
  "[SAMPLE] Amy Smith",
  "[SAMPLE] James Anderson",
  "[SAMPLE] Lara Peterson",
  "[SAMPLE] Mike Johnson",
  "vishalkomi954",
];

const SAMPLE_TAGS = ["movie"];

const SAMPLE_TASKS_BY_GROUP: Record<string, string[]> = {
  "[SAMPLE] INTERNAL PROJECT": ["Administration", "Education", "Good", "Workshops"],
  "[SAMPLE] PROJECT ALPHA:[SAMPLE] CLIENT A": [
    "Education",
    "Meetings",
    "Project Management",
    "Refinement",
    "Reporting",
  ],
  "[SAMPLE] PROJECT BETA:[SAMPLE] CLIENT B": [
    "Administration",
    "Development",
    "Project Management",
    "R&D",
    "Reporting",
  ],
  "[SAMPLE] PROJECT GAMMA:[SAMPLE] CLIENT B": [
    "Project Management",
    "R&D",
    "Refinement",
    "Workshops",
  ],
};

export const ReportsScreen = forwardRef<ReportsScreenHandle, ReportsScreenProps>(({
  isFilterSheetOpen: propFilterSheetOpen,
  onCloseFilterSheet: propCloseFilterSheet,
  isExportMenuOpen: propExportMenuOpen,
  onCloseExportMenu: propCloseExportMenu,
  isShareScreenOpen: propShareScreenOpen,
  onCloseShareScreen: propCloseShareScreen,
}, ref) => {
  // Date Range state matching screen_7.png
  const [selectedRangePreset, setSelectedRangePreset] = useState<DateRangePreset>("Jul 27 - Aug 2");
  const [weekOffset, setWeekOffset] = useState(0);
  const [isDateRangeSheetOpen, setIsDateRangeSheetOpen] = useState(false);
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(new Date(2026, 6, 13)); // Jul 13, 2026
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date(2026, 6, 19)); // Jul 19, 2026
  const [customPickerMonth, setCustomPickerMonth] = useState(6); // July (0-indexed = 6)
  const [customPickerYear, setCustomPickerYear] = useState(2026);

  const handlePrevPeriod = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextPeriod = () => {
    setWeekOffset((prev) => prev + 1);
  };

  // Date period text
  const currentPeriodTitle = useMemo(() => {
    if (selectedRangePreset === "Jul 27 - Aug 2") {
      if (weekOffset === 0) return "Jul 27 - Aug 2";
      if (weekOffset === -1) return "Jul 20 - Jul 26";
      if (weekOffset === 1) return "Aug 3 - Aug 9";
      return "Jul 27 - Aug 2";
    }
    if (selectedRangePreset !== "This week") {
      return selectedRangePreset;
    }
    if (weekOffset === 0) return "This week";
    if (weekOffset === -1) return "Last week";
    if (weekOffset === 1) return "Next week";
    if (weekOffset < -1) return `${Math.abs(weekOffset)} weeks ago`;
    return `In ${weekOffset} weeks`;
  }, [selectedRangePreset, weekOffset]);

  const currentPeriodTotalText = useMemo(() => {
    if (selectedRangePreset === "Jul 27 - Aug 2") return "00:00:00";
    if (weekOffset === 0) return "36h 24m";
    if (weekOffset === -1) return "41h 32m";
    if (weekOffset === 1) return "18h 00m";
    return "34h 10m";
  }, [selectedRangePreset, weekOffset]);

  // Filter visibility toggles (controlled via '=' filter button)
  const [internalFilterSheetOpen, setInternalFilterSheetOpen] = useState(false);
  const showFilterSheet = propFilterSheetOpen !== undefined ? propFilterSheetOpen : internalFilterSheetOpen;
  const handleCloseFilterSheet = () => {
    if (propCloseFilterSheet) propCloseFilterSheet();
    setInternalFilterSheetOpen(false);
  };

  const [visibleFilterPills, setVisibleFilterPills] = useState<Record<string, boolean>>({
    Team: true,
    Client: true,
    Project: true,
    Task: true,
    Tag: true,
    Description: true,
  });

  // Active filter modal state (which pill modal is currently open)
  const [activeFilterModal, setActiveFilterModal] = useState<
    "Team" | "Client" | "Project" | "Task" | "Tag" | "Description" | null
  >(null);

  // Selected filters
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [withoutClient, setWithoutClient] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [withoutProject, setWithoutProject] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([
    "Administration",
    "Education",
    "Good",
  ]);
  const [withoutTask, setWithoutTask] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [withoutTag, setWithoutTag] = useState(false);
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [withoutDescription, setWithoutDescription] = useState(false);

  // Active filters summary
  const activeFilters = useMemo(() => {
    const list: string[] = [];
    if (selectedProjects.length > 0) list.push(`Projects (${selectedProjects.length})`);
    if (selectedClients.length > 0) list.push(`Clients (${selectedClients.length})`);
    if (selectedTeams.length > 0) list.push(`Team (${selectedTeams.length})`);
    if (selectedTags.length > 0) list.push(`Tags (${selectedTags.length})`);
    if (selectedTasks.length > 0) list.push(`Tasks (${selectedTasks.length})`);
    if (descriptionFilter) list.push(`"${descriptionFilter}"`);
    return list;
  }, [selectedProjects, selectedClients, selectedTeams, selectedTags, selectedTasks, descriptionFilter]);

  const handleClearAllFilters = () => {
    setSelectedProjects([]);
    setSelectedClients([]);
    setSelectedTeams([]);
    setSelectedTags([]);
    setSelectedTasks([]);
    setDescriptionFilter("");
    setWithoutProject(false);
    setWithoutClient(false);
    setWithoutTag(false);
    setWithoutTask(false);
  };

  // Card 2: Group by & Sort by state
  const [groupBy, setGroupBy] = useState<GroupByOption>("Project");
  const [isGroupBySheetOpen, setIsGroupBySheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortByOption>("Most tracked");
  const [isSortBySheetOpen, setIsSortBySheetOpen] = useState(false);

  // Export dropdown & settings state
  const [internalExportOpen, setInternalExportOpen] = useState(false);
  const showExportMenu = propExportMenuOpen !== undefined ? propExportMenuOpen : internalExportOpen;
  const handleCloseExportMenu = () => {
    if (propCloseExportMenu) propCloseExportMenu();
    setInternalExportOpen(false);
  };
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings);
  const [isExportSettingsOpen, setIsExportSettingsOpen] = useState(false);
  const [tempExportSettings, setTempExportSettings] = useState<ExportSettings>(defaultExportSettings);

  const handleOpenExportSettings = () => {
    setTempExportSettings(exportSettings);
    setIsExportSettingsOpen(true);
  };

  // Share reports screen state
  const [internalShareOpen, setInternalShareOpen] = useState(false);
  const showShareScreen = propShareScreenOpen !== undefined ? propShareScreenOpen : internalShareOpen;
  const handleCloseShareScreen = () => {
    if (propCloseShareScreen) propCloseShareScreen();
    setInternalShareOpen(false);
  };
  const [shareReportName, setShareReportName] = useState("");
  const [shareNameTouched, setShareNameTouched] = useState(false);
  const [shareVisibility, setShareVisibility] = useState<"Public" | "Private">("Public");
  const [isVisibilityScreenOpen, setIsVisibilityScreenOpen] = useState(false);
  const [shareAlwaysThisWeek, setShareAlwaysThisWeek] = useState(true);
  const [shareLockDates, setShareLockDates] = useState(false);
  const [shareScheduleEmail, setShareScheduleEmail] = useState(false);
  const [isSharingLinkModalOpen, setIsSharingLinkModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Web reports preview modal
  const [isWebReportsModalOpen, setIsWebReportsModalOpen] = useState(false);
  const [isProTrialModalOpen, setIsProTrialModalOpen] = useState(false);
  const webReportsRef = useRef<WebReportsViewHandle>(null);

  useImperativeHandle(ref, () => ({
    handleBack: () => {
      // 1. If web reports view is open, delegate to it or close it
      if (isWebReportsModalOpen) {
        if (webReportsRef.current?.handleBack()) {
          return true;
        }
        setIsWebReportsModalOpen(false);
        return true;
      }
      // 2. Sharing link bottom sheet
      if (isSharingLinkModalOpen) {
        setIsSharingLinkModalOpen(false);
        return true;
      }
      // 3. Visibility sub-screen inside share
      if (isVisibilityScreenOpen) {
        setIsVisibilityScreenOpen(false);
        return true;
      }
      // 4. Share screen
      if (showShareScreen) {
        handleCloseShareScreen();
        return true;
      }
      // 5. Custom date range picker modal
      if (isCustomRangeModalOpen) {
        setIsCustomRangeModalOpen(false);
        return true;
      }
      // 6. Date range sheet
      if (isDateRangeSheetOpen) {
        setIsDateRangeSheetOpen(false);
        return true;
      }
      // 7. Sort by sheet
      if (isSortBySheetOpen) {
        setIsSortBySheetOpen(false);
        return true;
      }
      // 8. Group by sheet
      if (isGroupBySheetOpen) {
        setIsGroupBySheetOpen(false);
        return true;
      }
      // 9. Active filter modal (Team, Client, Project, Task, Tag, Description)
      if (activeFilterModal) {
        setActiveFilterModal(null);
        return true;
      }
      // 10. Filter sheet
      if (showFilterSheet) {
        handleCloseFilterSheet();
        return true;
      }
      // 11. Export settings modal
      if (isExportSettingsOpen) {
        setIsExportSettingsOpen(false);
        return true;
      }
      // 12. Export menu dropdown
      if (showExportMenu) {
        handleCloseExportMenu();
        return true;
      }
      // 13. Pro trial modal
      if (isProTrialModalOpen) {
        setIsProTrialModalOpen(false);
        return true;
      }
      return false;
    },
    handleHome: () => {
      webReportsRef.current?.handleHome?.();
      setIsWebReportsModalOpen(false);
      setIsSharingLinkModalOpen(false);
      setIsVisibilityScreenOpen(false);
      handleCloseShareScreen();
      setIsCustomRangeModalOpen(false);
      setIsDateRangeSheetOpen(false);
      setIsSortBySheetOpen(false);
      setIsGroupBySheetOpen(false);
      setActiveFilterModal(null);
      handleCloseFilterSheet();
      setIsExportSettingsOpen(false);
      handleCloseExportMenu();
      setIsProTrialModalOpen(false);
    },
  }));

  // Daily hours for bar chart matching Google Play reference (screen_7.png and screen_14.png)
  // Max scale is 10h (10h, 8h, 6h, 4h, 2h, 0h)
  const chartDays = useMemo(() => {
    if (weekOffset === 0) {
      return [
        { name: "Mon", fullDate: "Mon", totalHours: 7.5, billableHours: 4.7 },
        { name: "Tue", fullDate: "Tue", totalHours: 7.0, billableHours: 4.4 },
        { name: "Wed", fullDate: "Wed", totalHours: 8.0, billableHours: 5.0 },
        { name: "Thu", fullDate: "Thu", totalHours: 6.6, billableHours: 4.1 },
        { name: "Fri", fullDate: "Fri", totalHours: 4.8, billableHours: 3.0 },
        { name: "Sat", fullDate: "Sat", totalHours: 0.1, billableHours: 0.0 },
        { name: "Sun", fullDate: "Sun", totalHours: 0.1, billableHours: 0.0 },
      ];
    }
    if (weekOffset === -1) {
      return [
        { name: "Mon", fullDate: "Mon", totalHours: 8.2, billableHours: 6.5 },
        { name: "Tue", fullDate: "Tue", totalHours: 8.5, billableHours: 7.0 },
        { name: "Wed", fullDate: "Wed", totalHours: 7.8, billableHours: 5.5 },
        { name: "Thu", fullDate: "Thu", totalHours: 8.0, billableHours: 6.0 },
        { name: "Fri", fullDate: "Fri", totalHours: 8.8, billableHours: 7.2 },
        { name: "Sat", fullDate: "Sat", totalHours: 0.0, billableHours: 0.0 },
        { name: "Sun", fullDate: "Sun", totalHours: 0.0, billableHours: 0.0 },
      ];
    }
    return [
      { name: "Mon", fullDate: "Mon", totalHours: 6.0, billableHours: 4.0 },
      { name: "Tue", fullDate: "Tue", totalHours: 7.2, billableHours: 5.0 },
      { name: "Wed", fullDate: "Wed", totalHours: 6.5, billableHours: 4.5 },
      { name: "Thu", fullDate: "Thu", totalHours: 7.0, billableHours: 5.2 },
      { name: "Fri", fullDate: "Fri", totalHours: 5.5, billableHours: 3.8 },
      { name: "Sat", fullDate: "Sat", totalHours: 0.1, billableHours: 0.0 },
      { name: "Sun", fullDate: "Sun", totalHours: 0.1, billableHours: 0.0 },
    ];
  }, [weekOffset]);

  // Donut chart items matching Google Play reference (screen_7.png and screen_14.png)
  // Center total: 520:32
  const donutProjects = useMemo(() => {
    if (groupBy === "Project") {
      return [
        { name: "Marketing", color: "#ef4444", total: "65:06", percentage: 100 },
        { name: "Front-end", color: "#f97316", total: "65:05", percentage: 99.8 },
        { name: "Back-end", color: "#22c55e", total: "65:05", percentage: 99.8 },
        {
          name: "Sales",
          client: "Client X",
          color: "#06b6d4",
          total: "65:05",
          billable: "65:05",
          percentage: 99.8,
        },
        {
          name: "App Development",
          client: "Zeus Inc",
          color: "#2563eb",
          total: "65:05",
          billable: "65:05",
          percentage: 99.8,
        },
        { name: "Design System", color: "#a855f7", total: "65:05", percentage: 99.8 },
        { name: "Administration", color: "#eab308", total: "65:05", percentage: 99.8 },
        { name: "Operations", color: "#64748b", total: "64:56", percentage: 99.6 },
      ];
    }
    if (groupBy === "Client") {
      return [
        { name: "Client X", color: "#06b6d4", total: "130:10", percentage: 100 },
        { name: "Zeus Inc", color: "#2563eb", total: "130:10", percentage: 100 },
        { name: "Maisy LLC", color: "#f97316", total: "65:05", percentage: 50 },
        { name: "Without Client", color: "#64748b", total: "195:07", percentage: 100 },
      ];
    }
    if (groupBy === "User") {
      return [
        { name: "vishalkomi954", color: "#03a9f4", total: "520:32", percentage: 100 },
      ];
    }
    return [
      { name: "Development", color: "#22c55e", total: "195:12", percentage: 100 },
      { name: "Design", color: "#a855f7", total: "130:10", percentage: 66.7 },
      { name: "Management", color: "#f97316", total: "195:10", percentage: 100 },
    ];
  }, [groupBy]);

  // Export report datasets
  const totalSeconds = 180000; // 50:00:00
  const billableSeconds = 151200; // 42:00:00
  const totalBillableAmount = "493,00";

  const formatHMS = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const formattedTotal = formatHMS(totalSeconds);
  const formattedBillable = formatHMS(billableSeconds);

  // Donut chart items matching report dataset
  const breakdownItems = useMemo(() => {
    if (groupBy === "Project") {
      return [
        {
          name: "[SAMPLE] Project Beta",
          client: "[SAMPLE] Client B",
          duration: "31:00:00",
          durationSecs: 31 * 3600,
          amount: "313,00",
          color: "#00b0ff",
        },
        {
          name: "[SAMPLE] Project Alpha",
          client: "[SAMPLE] Client A",
          duration: "15:00:00",
          durationSecs: 15 * 3600,
          amount: "180,00",
          color: "#f59e0b",
        },
        {
          name: "[SAMPLE] Internal Project",
          client: "Without client",
          duration: "04:00:00",
          durationSecs: 4 * 3600,
          amount: "0,00",
          color: "#64748b",
        },
      ];
    }
    if (groupBy === "Client") {
      return [
        {
          name: "[SAMPLE] Client B",
          duration: "31:00:00",
          durationSecs: 31 * 3600,
          amount: "313,00",
          color: "#00b0ff",
        },
        {
          name: "[SAMPLE] Client A",
          duration: "15:00:00",
          durationSecs: 15 * 3600,
          amount: "180,00",
          color: "#f59e0b",
        },
        {
          name: "Without Client",
          duration: "04:00:00",
          durationSecs: 4 * 3600,
          amount: "0,00",
          color: "#64748b",
        },
      ];
    }
    if (groupBy === "User") {
      return [
        {
          name: "vishalkomi954",
          duration: formattedTotal,
          durationSecs: totalSeconds,
          amount: totalBillableAmount,
          color: "#34d399",
        },
      ];
    }
    return [
      {
        name: `All ${groupBy}s`,
        duration: formattedTotal,
        durationSecs: totalSeconds,
        amount: totalBillableAmount,
        color: "#00b0ff",
      },
    ];
  }, [groupBy, formattedTotal, totalSeconds, totalBillableAmount]);

  const handleExport = (type: "PDF" | "CSV" | "Excel") => {
    handleCloseExportMenu();
    if (type === "CSV") {
      exportToCsv(exportSettings);
    } else if (type === "Excel") {
      exportToExcel(exportSettings);
    } else if (type === "PDF") {
      exportToPdf(exportSettings);
    }
    setExportToast(`Report successfully exported to ${type}!`);
    setTimeout(() => setExportToast(null), 3000);
  };

  const shareReportUrl = "https://app.clockify.me/shared/6a9f07e152d9461dbc1d1c82";
  const shareReportSummaryText = `Clockify Summary Report (13/07/2026 - 19/07/2026)\nTotal: 50:00:00 | Amount: 493.00 USD\nView report: ${shareReportUrl}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareReportUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(shareReportSummaryText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareReportName || "Clockify Summary Report",
          text: shareReportSummaryText,
          url: shareReportUrl,
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      handleCopyShareLink();
    }
  };

  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareReportUrl)}&text=${encodeURIComponent(
        shareReportSummaryText
      )}`,
      "_blank"
    );
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      shareReportName || "Clockify Summary Report"
    )}&body=${encodeURIComponent(shareReportSummaryText)}`;
  };

  // Check which filter pills are enabled
  const activePillCount = Object.values(visibleFilterPills).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] select-none relative overflow-hidden">
      {/* Toast Notification */}
      {exportToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fadeIn pointer-events-none">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportToast}</span>
        </div>
      )}

      {/* Floating Export Menu (matching screenshot 12.29.33 PM (3).jpeg) */}
      {showExportMenu && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-transparent"
            onClick={handleCloseExportMenu}
          />
          <div className="absolute top-12 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-100 py-2 w-44 animate-fadeIn">
            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Save as PDF
            </button>
            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Save as CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("Excel")}
              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Save as Excel
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              type="button"
              onClick={() => {
                handleCloseExportMenu();
                handleOpenExportSettings();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Export settings
            </button>
          </div>
        </div>
      )}

      {/* Date Navigation Bar (Jul 27 - Aug 2 ▼    <  >) */}
      <div className="px-4 pt-3 pb-1.5 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => setIsDateRangeSheetOpen(true)}
          className="text-gray-900 font-medium text-base flex items-center gap-1.5 hover:text-gray-700 transition-colors"
        >
          <span>
            {selectedRangePreset === "Custom range" && customStartDate && customEndDate
              ? `${customStartDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} – ${customEndDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`
              : currentPeriodTitle}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-700" />
        </button>

        <div className="flex items-center gap-6 text-gray-700">
          <button
            type="button"
            onClick={handlePrevPeriod}
            className="p-1 hover:text-gray-900 active:scale-95 transition-transform"
            title="Previous period"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={handleNextPeriod}
            className="p-1 hover:text-gray-900 active:scale-95 transition-transform"
            title="Next period"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Horizontal Filter Dropdown Menu Pills Row (matching 12.29.30 PM.jpeg & 12.29.31 PM.jpeg) */}
      <div className="px-4 pb-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        {/* Team Pill */}
        {visibleFilterPills.Team && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Team")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              selectedTeams.length > 0
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {selectedTeams.length > 0 && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>Team{selectedTeams.length > 0 ? ` (${selectedTeams.length})` : ""}</span>
            <ChevronDown
              className={`w-3 h-3 ${selectedTeams.length > 0 ? "text-[#0288d1]" : "text-gray-500"}`}
            />
          </button>
        )}

        {/* Client Pill */}
        {visibleFilterPills.Client && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              selectedClients.length > 0 || withoutClient
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {(selectedClients.length > 0 || withoutClient) && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>
              Client
              {selectedClients.length > 0 || withoutClient
                ? ` (${selectedClients.length + (withoutClient ? 1 : 0)})`
                : ""}
            </span>
            <ChevronDown
              className={`w-3 h-3 ${
                selectedClients.length > 0 || withoutClient ? "text-[#0288d1]" : "text-gray-500"
              }`}
            />
          </button>
        )}

        {/* Project Pill */}
        {visibleFilterPills.Project && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Project")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              selectedProjects.length > 0 || withoutProject
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {(selectedProjects.length > 0 || withoutProject) && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>
              Project
              {selectedProjects.length > 0 || withoutProject
                ? ` (${selectedProjects.length + (withoutProject ? 1 : 0)})`
                : ""}
            </span>
            <ChevronDown
              className={`w-3 h-3 ${
                selectedProjects.length > 0 || withoutProject ? "text-[#0288d1]" : "text-gray-500"
              }`}
            />
          </button>
        )}

        {/* Task Pill (matching 12.29.30 PM.jpeg: ✓ Task ▼) */}
        {visibleFilterPills.Task && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Task")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              selectedTasks.length > 0 || withoutTask
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {(selectedTasks.length > 0 || withoutTask) && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>
              Task
              {selectedTasks.length > 0 || withoutTask
                ? ` (${selectedTasks.length + (withoutTask ? 1 : 0)})`
                : ""}
            </span>
            <ChevronDown
              className={`w-3 h-3 ${
                selectedTasks.length > 0 || withoutTask ? "text-[#0288d1]" : "text-gray-500"
              }`}
            />
          </button>
        )}

        {/* Tag Pill */}
        {visibleFilterPills.Tag && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Tag")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              selectedTags.length > 0 || withoutTag
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {(selectedTags.length > 0 || withoutTag) && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>
              Tag
              {selectedTags.length > 0 || withoutTag
                ? ` (${selectedTags.length + (withoutTag ? 1 : 0)})`
                : ""}
            </span>
            <ChevronDown
              className={`w-3 h-3 ${
                selectedTags.length > 0 || withoutTag ? "text-[#0288d1]" : "text-gray-500"
              }`}
            />
          </button>
        )}

        {/* Description Pill */}
        {visibleFilterPills.Description && (
          <button
            type="button"
            onClick={() => setActiveFilterModal("Description")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-colors ${
              descriptionFilter.trim().length > 0 || withoutDescription
                ? "bg-[#e1f5fe] text-[#0288d1] border border-[#81d4fa]"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {(descriptionFilter.trim().length > 0 || withoutDescription) && (
              <Check className="w-3.5 h-3.5 text-[#0288d1] stroke-[2.5]" />
            )}
            <span>Description</span>
            <ChevronDown
              className={`w-3 h-3 ${
                descriptionFilter.trim().length > 0 || withoutDescription
                  ? "text-[#0288d1]"
                  : "text-gray-500"
              }`}
            />
          </button>
        )}

        {/* Clear filters action button (matching 12.29.31 PM.jpeg in bright blue) */}
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="text-[#03a9f4] hover:text-[#0288d1] text-xs font-medium whitespace-nowrap cursor-pointer hover:underline px-2 py-1.5 shrink-0"
        >
          Clear filters
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-3 pb-12">
        {/* TIME TRACKED Section Label */}
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
          TIME TRACKED
        </div>

        {/* CARD 1: TIME TRACKED & STACKED BAR CHART */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
          {/* Top Row: Total and Billable */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {selectedRangePreset === "Jul 27 - Aug 2" && selectedTasks.length > 0
                  ? "00:00:00"
                  : selectedRangePreset === "Jul 13 - Jul 19"
                  ? "50:00:00"
                  : currentPeriodTotalText}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Billable</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {selectedRangePreset === "Jul 27 - Aug 2" && selectedTasks.length > 0
                  ? "00:00:00"
                  : selectedRangePreset === "Jul 13 - Jul 19"
                  ? "42:00:00"
                  : "00:00:00"}
              </p>
            </div>
          </div>

          {/* Bar Chart Area (Matching 12.29.30 PM.jpeg: 6h, 4h, 2h, 0h) */}
          <div className="pt-2">
            <div className="relative h-44 w-full flex flex-col justify-between">
              {[6, 4, 2, 0].map((hour) => (
                <div key={hour} className="w-full flex items-center">
                  <span className="w-6 text-[11px] text-gray-400 font-normal shrink-0">
                    {hour}h
                  </span>
                  <div className="flex-1 border-b border-gray-100 h-0" />
                </div>
              ))}

              {/* No tracked time message if empty period */}
              {selectedRangePreset === "Jul 27 - Aug 2" && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 pointer-events-none">
                  No tracked time yet
                </div>
              )}

              {/* Stacked Bars Overlay if data */}
              {selectedRangePreset !== "Jul 27 - Aug 2" && (
                <div className="absolute inset-0 left-6 right-0 bottom-3 top-2 flex items-end justify-between px-2">
                  {chartDays.map((d) => {
                    const totalHeightPercent = Math.min(100, (d.totalHours / 10) * 100);
                    const billableHeightPercent = Math.min(100, (d.billableHours / 10) * 100);

                    return (
                      <div
                        key={d.name}
                        className="flex-1 flex flex-col items-center justify-end h-full px-1 group cursor-pointer"
                        title={`${d.fullDate}: ${d.totalHours}h (Billable: ${d.billableHours}h)`}
                      >
                        <div className="w-4 relative flex items-end justify-center h-full">
                          <div
                            style={{ height: `${Math.max(totalHeightPercent, 2)}%` }}
                            className="w-full bg-[#81d4fa] rounded-t-[3px] transition-all duration-300"
                          />
                          {billableHeightPercent > 0 && (
                            <div
                              style={{ height: `${billableHeightPercent}%` }}
                              className="absolute bottom-0 w-full bg-[#03a9f4] rounded-t-[3px]"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* X-Axis day labels */}
            <div className="flex items-center pl-6 pr-0 pt-2 justify-between text-xs text-gray-400 font-normal">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="flex-1 text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-700 font-normal">
                <span className="w-3 h-3 rounded-[2px] bg-[#81d4fa]" />
                <span>Total hours</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-normal">
                <span className="w-3 h-3 rounded-[2px] bg-[#03a9f4]" />
                <span>Billable</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 2: GROUPED BREAKDOWN WITH DONUT & DROPDOWN PILLS     */}
        {/* (Matching 12.29.30 PM.jpeg)                               */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
          {/* Header with Project and Most tracked dropdown buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGroupBySheetOpen(true)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 font-medium flex items-center justify-between gap-1.5 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>{groupBy}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            <button
              type="button"
              onClick={() => setIsSortBySheetOpen(true)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 font-medium flex items-center justify-between gap-1.5 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>{sortBy}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>

          {/* Donut Chart Ring */}
          <div className="flex flex-col items-center justify-center py-1">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                />
                {/* Multi-colored Ring Segments */}
                {donutProjects.map((item, idx) => {
                  const totalSegments = donutProjects.length;
                  const segLength = 376.99 / totalSegments - 3;
                  const offset = idx * (376.99 / totalSegments);
                  return (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r="60"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="18"
                      strokeDasharray={`${segLength} ${376.99 - segLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">520:32</span>
              </div>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-4 pt-1">
            {donutProjects.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate block">
                        {item.name}
                      </span>
                      {"client" in item && Boolean((item as any).client) && (
                        <span className="text-xs text-gray-400 block -mt-0.5">
                          {(item as any).client}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-600 font-medium">
                      Total: <span className="font-semibold text-gray-900">{item.total}</span>
                    </div>
                    {"billable" in item && Boolean((item as any).billable) && (
                      <div className="text-[11px] text-gray-400">
                        Billable: {(item as any).billable}
                      </div>
                    )}
                  </div>
                </div>

                {/* Colored horizontal progress line matching reference */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: ADVANCED REPORTS VIA WEB                          */}
        {/* (Matching Google Play Reference: screen_14.png)           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                Advanced reports via web
              </h3>

              <ul className="space-y-2 text-xs text-gray-600 font-normal">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  <span>Create shared reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  <span>Schedule your reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  <span>Set billable rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                  <span>Export PDF, CSV &amp; Excel</span>
                </li>
              </ul>
            </div>

            {/* Official Illustration matching screen_14.png */}
            <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
              <AdvancedReportsIllustration />
            </div>
          </div>

          {/* Go to web reports Button */}
          <button
            type="button"
            onClick={() => setIsWebReportsModalOpen(true)}
            className="w-full py-3 px-4 rounded-full border border-[#03a9f4] hover:bg-sky-50 active:bg-sky-100 text-[#03a9f4] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#03a9f4]" />
            <span>Go to web reports</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM SHEET: DATE RANGE PICKER (This week, Last week...) */}
      {/* ========================================================= */}
      {isDateRangeSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setIsDateRangeSheetOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-slideInUp max-h-[80vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-2" />

            <h3 className="text-lg font-medium text-gray-900">Date range</h3>

            <div className="space-y-1">
              {(
                [
                  "Jul 13 - Jul 19",
                  "This week",
                  "Last week",
                  "This month",
                  "Last month",
                  "This year",
                  "Last year",
                ] as DateRangePreset[]
              ).map((preset) => {
                const isSelected = selectedRangePreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedRangePreset(preset);
                      setIsDateRangeSheetOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-[#00b0ff]" : "border-gray-400"
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />}
                    </div>
                    <span
                      className={`text-sm ${
                        isSelected ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}
                    >
                      {preset}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Range button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDateRangeSheetOpen(false);
                  setIsCustomRangeModalOpen(true);
                }}
                className="text-[#00b0ff] text-sm font-medium hover:underline py-2"
              >
                Custom range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CUSTOM DATE RANGE PICKER (Select Range)             */}
      {/* ========================================================= */}
      {isCustomRangeModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setIsCustomRangeModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4 animate-scaleUp">
            <div>
              <p className="text-xs text-gray-500 font-medium">Select Range</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-2xl font-normal text-gray-900">
                  {customStartDate
                    ? customEndDate
                      ? `${customStartDate.getDate()} ${customStartDate.toLocaleString("default", {
                          month: "short",
                        })} – ${customEndDate.getDate()} ${customEndDate.toLocaleString("default", {
                          month: "short",
                        })}`
                      : `${customStartDate.getDate()} ${customStartDate.toLocaleString("default", {
                          month: "short",
                        })} – End date`
                    : "Start date – End date"}
                </h3>
                <button
                  type="button"
                  className="p-1 text-gray-600 hover:text-gray-900"
                  title="Edit manually"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Month / Year header */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-gray-800"
              >
                <span>
                  {new Date(customPickerYear, customPickerMonth).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {customPickerYear}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (customPickerMonth === 0) {
                      setCustomPickerMonth(11);
                      setCustomPickerYear((y) => y - 1);
                    } else {
                      setCustomPickerMonth((m) => m - 1);
                    }
                  }}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (customPickerMonth === 11) {
                      setCustomPickerMonth(0);
                      setCustomPickerYear((y) => y + 1);
                    } else {
                      setCustomPickerMonth((m) => m + 1);
                    }
                  }}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday headers: M T W T F S S */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {/* Empty offset for Sept 2026 (Starts on Tuesday = 1 empty cell) */}
              <div />
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const thisDate = new Date(customPickerYear, customPickerMonth, day);
                const isSelectedStart =
                  customStartDate &&
                  customStartDate.getDate() === day &&
                  customStartDate.getMonth() === customPickerMonth;
                const isSelectedEnd =
                  customEndDate &&
                  customEndDate.getDate() === day &&
                  customEndDate.getMonth() === customPickerMonth;
                const isInRange =
                  customStartDate &&
                  customEndDate &&
                  thisDate > customStartDate &&
                  thisDate < customEndDate;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      if (!customStartDate || (customStartDate && customEndDate)) {
                        setCustomStartDate(thisDate);
                        setCustomEndDate(null);
                      } else if (customStartDate && !customEndDate) {
                        if (thisDate < customStartDate) {
                          setCustomStartDate(thisDate);
                        } else {
                          setCustomEndDate(thisDate);
                        }
                      }
                    }}
                    className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                      isSelectedStart || isSelectedEnd
                        ? "border-2 border-[#00b0ff] text-[#00b0ff] font-bold"
                        : isInRange
                        ? "bg-cyan-50 text-cyan-800 font-medium"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-6 pt-4">
              <button
                type="button"
                onClick={() => setIsCustomRangeModalOpen(false)}
                className="text-sm font-medium text-[#00b0ff] hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRangePreset("Custom range");
                  setIsCustomRangeModalOpen(false);
                }}
                className="text-sm font-medium text-gray-400 hover:text-[#00b0ff]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET: FILTER VISIBILITY (Top bar '=' icon)        */}
      {/* ========================================================= */}
      {showFilterSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
            onClick={handleCloseFilterSheet}
          />

          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-slideInUp max-h-[80vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-2" />

            <h3 className="text-lg font-medium text-gray-900">Filter</h3>

            <div className="space-y-1">
              {["Team", "Client", "Project", "Task", "Tag", "Description"].map((pill) => {
                const isChecked = visibleFilterPills[pill];
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      setVisibleFilterPills((prev) => ({
                        ...prev,
                        [pill]: !prev[pill],
                      }));
                    }}
                    className="w-full flex items-center gap-3.5 py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm text-gray-800">{pill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FILTER SELECTION MODALS (Team, Client, Project, Task, etc.)*/}
      {/* ========================================================= */}
      {activeFilterModal && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slideInUp">
          {/* Header */}
          <div className="h-14 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveFilterModal(null);
                }}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-medium text-gray-900">{activeFilterModal}</h2>
            </div>

            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Items Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* PROJECT FILTER MODAL */}
            {activeFilterModal === "Project" && (
              <div className="space-y-4">
                {/* Select All */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedProjects.length === SAMPLE_PROJECTS.length && withoutProject) {
                      setSelectedProjects([]);
                      setWithoutProject(false);
                    } else {
                      setSelectedProjects(SAMPLE_PROJECTS.map((p) => p.id));
                      setWithoutProject(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      selectedProjects.length === SAMPLE_PROJECTS.length && withoutProject
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedProjects.length === SAMPLE_PROJECTS.length && withoutProject && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">Select all</span>
                </button>

                {/* Without Project */}
                <button
                  type="button"
                  onClick={() => setWithoutProject((v) => !v)}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutProject
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutProject && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800">Without Project</span>
                </button>

                {/* Groups */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    NO CLIENT
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const id = "sample-p1";
                      setSelectedProjects((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                    className="w-full flex items-center gap-3 py-1.5 text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selectedProjects.includes("sample-p1")
                          ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedProjects.includes("sample-p1") && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">[SAMPLE] Internal Project</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    [SAMPLE] CLIENT A
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const id = "sample-p2";
                      setSelectedProjects((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                    className="w-full flex items-center gap-3 py-1.5 text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selectedProjects.includes("sample-p2")
                          ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedProjects.includes("sample-p2") && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">[SAMPLE] Project Alpha</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    [SAMPLE] CLIENT B
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const id = "sample-p3";
                      setSelectedProjects((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                    className="w-full flex items-center gap-3 py-1.5 text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selectedProjects.includes("sample-p3")
                          ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedProjects.includes("sample-p3") && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">[SAMPLE] Project Beta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const id = "sample-p4";
                      setSelectedProjects((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      );
                    }}
                    className="w-full flex items-center gap-3 py-1.5 text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selectedProjects.includes("sample-p4")
                          ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {selectedProjects.includes("sample-p4") && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-sm text-gray-800">[SAMPLE] Project Gamma</span>
                  </button>
                </div>
              </div>
            )}

            {/* CLIENT FILTER MODAL */}
            {activeFilterModal === "Client" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedClients.length === SAMPLE_CLIENTS.length && withoutClient) {
                      setSelectedClients([]);
                      setWithoutClient(false);
                    } else {
                      setSelectedClients([...SAMPLE_CLIENTS]);
                      setWithoutClient(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      selectedClients.length === SAMPLE_CLIENTS.length && withoutClient
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedClients.length === SAMPLE_CLIENTS.length && withoutClient && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">Select all</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithoutClient((v) => !v)}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutClient
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutClient && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800">Without Client</span>
                </button>

                {SAMPLE_CLIENTS.map((c) => {
                  const isChecked = selectedClients.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setSelectedClients((prev) =>
                          prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                        )
                      }
                      className="w-full flex items-center gap-3 py-1.5 text-left"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-gray-800">{c}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TEAM FILTER MODAL */}
            {activeFilterModal === "Team" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedTeams.length === SAMPLE_TEAM.length) {
                      setSelectedTeams([]);
                    } else {
                      setSelectedTeams([...SAMPLE_TEAM]);
                    }
                  }}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      selectedTeams.length === SAMPLE_TEAM.length
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedTeams.length === SAMPLE_TEAM.length && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">Select all</span>
                </button>

                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 pt-2">
                  USERS
                </h4>

                {SAMPLE_TEAM.map((member) => {
                  const isChecked = selectedTeams.includes(member);
                  return (
                    <button
                      key={member}
                      type="button"
                      onClick={() =>
                        setSelectedTeams((prev) =>
                          prev.includes(member)
                            ? prev.filter((x) => x !== member)
                            : [...prev, member]
                        )
                      }
                      className="w-full flex items-center gap-3 py-1.5 text-left"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-gray-800">{member}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAG FILTER MODAL */}
            {activeFilterModal === "Tag" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedTags.length === SAMPLE_TAGS.length && withoutTag) {
                      setSelectedTags([]);
                      setWithoutTag(false);
                    } else {
                      setSelectedTags([...SAMPLE_TAGS]);
                      setWithoutTag(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      selectedTags.length === SAMPLE_TAGS.length && withoutTag
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {selectedTags.length === SAMPLE_TAGS.length && withoutTag && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">Select all</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithoutTag((v) => !v)}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutTag
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutTag && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800">Without Tag</span>
                </button>

                {SAMPLE_TAGS.map((t) => {
                  const isChecked = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className="w-full flex items-center gap-3 py-1.5 text-left"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-gray-800">{t}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TASK FILTER MODAL */}
            {activeFilterModal === "Task" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    const allTasks = Object.values(SAMPLE_TASKS_BY_GROUP).flat();
                    if (selectedTasks.length === allTasks.length && withoutTask) {
                      setSelectedTasks([]);
                      setWithoutTask(false);
                    } else {
                      setSelectedTasks(allTasks);
                      setWithoutTask(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutTask
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutTask && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm font-medium text-gray-800">Select all</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithoutTask((v) => !v)}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutTask
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutTask && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800">Without Task</span>
                </button>

                {Object.entries(SAMPLE_TASKS_BY_GROUP).map(([groupTitle, taskList]) => (
                  <div key={groupTitle} className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {groupTitle}
                    </h4>
                    {taskList.map((taskName) => {
                      const isChecked = selectedTasks.includes(taskName);
                      return (
                        <button
                          key={taskName}
                          type="button"
                          onClick={() =>
                            setSelectedTasks((prev) =>
                              prev.includes(taskName)
                                ? prev.filter((x) => x !== taskName)
                                : [...prev, taskName]
                            )
                          }
                          className="w-full flex items-center gap-3 py-1.5 text-left"
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isChecked
                                ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm text-gray-800">{taskName}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* DESCRIPTION FILTER MODAL */}
            {activeFilterModal === "Description" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter description"
                  value={descriptionFilter}
                  onChange={(e) => setDescriptionFilter(e.target.value)}
                  className="w-full px-1 py-2 text-sm text-gray-900 border-b border-gray-200 focus:border-[#00b0ff] outline-none"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setWithoutDescription((v) => !v)}
                  className="w-full flex items-center gap-3 py-1.5 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      withoutDescription
                        ? "bg-[#00b0ff] border-[#00b0ff] text-white"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {withoutDescription && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800">Without Description</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET: GROUP BY (Card 2)                           */}
      {/* ========================================================= */}
      {isGroupBySheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setIsGroupBySheetOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-slideInUp max-h-[80vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-2" />

            <h3 className="text-lg font-medium text-gray-900">Group by</h3>

            <div className="space-y-1">
              {(
                [
                  "Project",
                  "Client",
                  "User",
                  "Group",
                  "Tag",
                  "Month",
                  "Week",
                  "Date",
                ] as GroupByOption[]
              ).map((option) => {
                const isSelected = groupBy === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setGroupBy(option);
                      setIsGroupBySheetOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-[#00b0ff]" : "border-gray-400"
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />}
                    </div>
                    <span
                      className={`text-sm ${
                        isSelected ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET: SORT BY (Card 2)                            */}
      {/* ========================================================= */}
      {isSortBySheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setIsSortBySheetOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 animate-slideInUp max-h-[80vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-2" />

            <h3 className="text-lg font-medium text-gray-900">Sort by</h3>

            <div className="space-y-1">
              {(["Most tracked", "Least tracked", "A-Z", "Z-A"] as SortByOption[]).map(
                (option) => {
                  const isSelected = sortBy === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setIsSortBySheetOpen(false);
                      }}
                      className="w-full flex items-center gap-3.5 py-3 text-left hover:bg-gray-50 rounded-xl px-1 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "border-[#00b0ff]" : "border-gray-400"
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />}
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected ? "text-gray-900 font-medium" : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL-PAGE: SHARE REPORTS (Matching screenshot)            */}
      {/* ========================================================= */}
      {showShareScreen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slideInUp">
          {/* Header */}
          <div className="h-14 px-4 border-b border-gray-100 flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={handleCloseShareScreen}
              className="p-1 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Share reports</h2>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                placeholder="Name*"
                value={shareReportName}
                onChange={(e) => setShareReportName(e.target.value)}
                onBlur={() => setShareNameTouched(true)}
                className={`w-full py-2.5 text-base text-gray-900 border-b outline-none placeholder-gray-400 transition-colors ${
                  shareNameTouched && shareReportName.trim().length < 2
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#00b0ff]"
                }`}
              />
              <p
                className={`text-xs mt-1 transition-colors ${
                  shareNameTouched && shareReportName.trim().length < 2
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                Report name must contain at least 2 characters
              </p>
            </div>

            {/* Visibility */}
            <div
              onClick={() => setIsVisibilityScreenOpen(true)}
              className="border-b border-gray-100 pb-3 cursor-pointer hover:bg-gray-50/60 -mx-1 px-1 rounded-lg transition-colors"
            >
              <p className="text-xs text-gray-500 font-medium mb-1">Visibility</p>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-800 font-medium">{shareVisibility}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Always open as this week */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-800">Always open as this week</span>
              <button
                type="button"
                onClick={() => setShareAlwaysThisWeek((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  shareAlwaysThisWeek ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    shareAlwaysThisWeek ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Lock dates */}
            <div className="flex items-start justify-between py-2 border-b border-gray-100 gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-800">Lock dates</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Lock dates to prevent viewer from seeing the report from different time ranges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareLockDates((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  shareLockDates ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    shareLockDates ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Schedule to email */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-800">Schedule to email</span>
              <button
                type="button"
                onClick={() => setShareScheduleEmail((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  shareScheduleEmail ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    shareScheduleEmail ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Create Link Button */}
            <div className="pt-4">
              <button
                type="button"
                disabled={shareReportName.trim().length < 2}
                onClick={() => {
                  if (shareReportName.trim().length >= 2) {
                    setIsSharingLinkModalOpen(true);
                  }
                }}
                className={`w-full py-3.5 rounded-full font-medium text-sm transition-all ${
                  shareReportName.trim().length < 2
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-[#00b0ff] text-white shadow-md hover:bg-[#009ee6] active:scale-[0.99]"
                }`}
              >
                Create link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL-PAGE: VISIBILITY SCREEN (Matching screenshot)         */}
      {/* ========================================================= */}
      {isVisibilityScreenOpen && (
        <div className="absolute inset-0 z-[60] flex flex-col bg-white animate-slideInUp">
          {/* Header */}
          <div className="h-14 px-4 border-b border-gray-100 flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsVisibilityScreenOpen(false)}
              className="p-1 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Visibility</h2>
          </div>

          {/* Options */}
          <div className="p-5 space-y-6">
            <button
              type="button"
              onClick={() => {
                setShareVisibility("Public");
                setIsVisibilityScreenOpen(false);
              }}
              className="w-full flex items-center gap-4 text-left group"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  shareVisibility === "Public"
                    ? "border-[#00b0ff]"
                    : "border-gray-500 group-hover:border-gray-700"
                }`}
              >
                {shareVisibility === "Public" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />
                )}
              </div>
              <span className="text-base text-gray-900 font-normal">Public</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShareVisibility("Private");
                setIsVisibilityScreenOpen(false);
              }}
              className="w-full flex items-center gap-4 text-left group"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  shareVisibility === "Private"
                    ? "border-[#00b0ff]"
                    : "border-gray-500 group-hover:border-gray-700"
                }`}
              >
                {shareVisibility === "Private" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00b0ff]" />
                )}
              </div>
              <span className="text-base text-gray-900 font-normal">Private</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL-PAGE: EXPORT SETTINGS SCREEN (Matching screenshot)   */}
      {/* ========================================================= */}
      {isExportSettingsOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slideInUp">
          {/* Header */}
          <div className="h-14 px-4 border-b border-gray-100 flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsExportSettingsOpen(false)}
              className="p-1 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Export settings</h2>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto relative pb-24">
            {/* name input */}
            <div className="px-5 py-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="name"
                value={tempExportSettings.name}
                onChange={(e) =>
                  setTempExportSettings((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full text-base text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Duration (h) */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-base text-gray-900 font-normal">Duration (h)</p>
                <p className="text-xs text-gray-500 mt-0.5">Visible in PDF, CSV and Excel</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTempExportSettings((prev) => ({
                    ...prev,
                    durationHours: !prev.durationHours,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  tempExportSettings.durationHours ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tempExportSettings.durationHours ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Duration (decimal) */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-base text-gray-900 font-normal">Duration (decimal)</p>
                <p className="text-xs text-gray-500 mt-0.5">Visible only in CSV and Excel</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTempExportSettings((prev) => ({
                    ...prev,
                    durationDecimal: !prev.durationDecimal,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  tempExportSettings.durationDecimal ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tempExportSettings.durationDecimal ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Bar chart */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-base text-gray-900 font-normal">Bar chart</p>
                <p className="text-xs text-gray-500 mt-0.5">Visible only in PDF</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTempExportSettings((prev) => ({
                    ...prev,
                    barChart: !prev.barChart,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  tempExportSettings.barChart ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tempExportSettings.barChart ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Pie chart */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-base text-gray-900 font-normal">Pie chart</p>
                <p className="text-xs text-gray-500 mt-0.5">Visible only in PDF</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTempExportSettings((prev) => ({
                    ...prev,
                    pieChart: !prev.pieChart,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  tempExportSettings.pieChart ? "bg-[#00b0ff]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tempExportSettings.pieChart ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Note */}
            <div className="px-5 py-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Note"
                value={tempExportSettings.note}
                onChange={(e) =>
                  setTempExportSettings((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full text-base text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Floating Save Button matching screenshot: cyan pill with checkmark */}
            <div className="absolute bottom-6 right-6">
              <button
                type="button"
                onClick={() => {
                  setExportSettings(tempExportSettings);
                  setIsExportSettingsOpen(false);
                  setExportToast("Export settings saved");
                  setTimeout(() => setExportToast(null), 3000);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#5cd1ff] hover:bg-[#00b0ff] text-white font-medium text-sm shadow-xl active:scale-95 transition-all"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTTOM SHEET: SHARING LINK MODAL (matching screenshot)     */}
      {/* ========================================================= */}
      {isSharingLinkModalOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
            onClick={() => setIsSharingLinkModalOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 space-y-5 animate-slideInUp max-h-[85vh] overflow-y-auto">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-1" />

            <h3 className="text-lg font-medium text-gray-900">Sharing link</h3>

            {/* URL Box */}
            <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
              <span className="text-xs text-gray-700 font-mono break-all line-clamp-2 pr-2">
                https://app.clockify.me/shared/6a9f07e152d9461dbc1d1c82
              </span>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="p-2 text-gray-600 hover:text-gray-900 shrink-0"
                title="Copy link"
              >
                {copiedLink ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Functional App Share Targets (WhatsApp, Other Apps, Telegram, Email) */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Share via</p>
              <div className="grid grid-cols-4 gap-3 text-center text-xs text-gray-700">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.761.888 2.796.889h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm3.385 8.163c-.145.411-.749.771-1.049.818-.285.045-.658.077-2.126-.525-1.748-.716-2.875-2.482-2.962-2.597-.087-.116-.708-.941-.708-1.795s.447-1.274.606-1.448c.159-.174.347-.217.463-.217.116 0 .232.002.333.007.106.005.249-.04.39.298.145.347.497 1.213.541 1.302.043.089.072.193.014.309-.058.116-.087.188-.174.289l-.261.304c-.087.098-.178.204-.077.377.101.174.45 1.157 1.341 1.708.736.455 1.357.596 1.549.69.193.094.304.081.419-.052.116-.133.493-.574.624-.77.13-.197.26-.165.435-.101.174.064 1.102.52 1.291.614.188.094.314.14.36.218.046.077.046.449-.099.86z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">WhatsApp</span>
                </button>

                {/* Share via other apps (Native Share) */}
                <button
                  type="button"
                  onClick={handleShareNative}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#00b0ff] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">Other apps</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#229ED9] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Telegram</span>
                </button>

                {/* Email */}
                <button
                  type="button"
                  onClick={handleShareEmail}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CLOCKIFY WEB REPORTS FULL FUNCTIONAL VIEW          */}
      {/* ========================================================= */}
      <WebReportsView
        ref={webReportsRef}
        isOpen={isWebReportsModalOpen}
        onClose={() => setIsWebReportsModalOpen(false)}
        onOpenShareModal={() => {
          setIsWebReportsModalOpen(false);
          setIsSharingLinkModalOpen(true);
        }}
      />

      {/* ========================================================= */}
      {/* MODAL: PRO TRIAL POPUP (Screenshot 16)                     */}
      {/* ========================================================= */}
      {isProTrialModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setIsProTrialModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 space-y-4 animate-scaleUp">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-1 shadow-sm">
                ★
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your free trial starts today!</h3>
              <p className="text-xs text-gray-600">
                Explore Pro features for free for 7 days. No credit card required.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsProTrialModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#00b0ff] text-white font-bold text-sm shadow-md hover:bg-[#009ee6]"
            >
              Let's go →
            </button>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-700">Try these Pro plan features:</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-600">
                <span>✓ Break</span>
                <span>✓ Force timer</span>
                <span>✓ Cost & profit</span>
                <span>✓ Invoicing</span>
                <span>✓ Expenses</span>
                <span>✓ Time off</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
