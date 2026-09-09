import React, { useState, useEffect } from "react";
import { ApprovalsPage } from "@/components/approvals/ApprovalsPage";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { ActivityPage } from "@/components/activity/ActivityPage";
import { KiosksPage } from "@/components/kiosks/KiosksPage";
import { TimesheetPage } from "@/components/timesheet/TimesheetPage";
import { ExpensesPage } from "@/components/expenses/ExpensesPage";
import { LoginPage } from "@/screens/auth/LoginPage";
import { TimeOffPage } from "@/components/timeoff/TimeOffPage";
import {
  CheckSquare,
  LayoutDashboard,
  Activity,
  Monitor,
  CalendarDays,
  Receipt,
  Lock,
  RotateCcw,
} from "lucide-react";

export type ActivePage =
  | "approvals"
  | "dashboard"
  | "activity"
  | "kiosks"
  | "timesheet"
  | "expenses"
  | "login"
  | "timeoff";

export default function App() {
  // Check URL hash for direct routing (#activity, #kiosks, #timesheet, #expenses, #login, #timeoff)
  // Default to activity as requested
  const getInitialPage = (): ActivePage => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes("approvals") || hash.includes("approval")) return "approvals";
    if (hash.includes("dashboard")) return "dashboard";
    if (hash.includes("activity")) return "activity";
    if (hash.includes("kiosks")) return "kiosks";
    if (hash.includes("timesheet")) return "timesheet";
    if (hash.includes("expenses")) return "expenses";
    if (hash.includes("login")) return "login";
    if (hash.includes("timeoff")) return "timeoff";
    return "approvals"; // Default to Approvals as requested
  };

  const [activePage, setActivePage] = useState<ActivePage>(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("approvals") || hash.includes("approval")) {
        setActivePage("approvals");
      } else if (hash.includes("dashboard")) {
        setActivePage("dashboard");
      } else if (hash.includes("activity")) {
        setActivePage("activity");
      } else if (hash.includes("kiosks")) {
        setActivePage("kiosks");
      } else if (hash.includes("timesheet")) {
        setActivePage("timesheet");
      } else if (hash.includes("expenses")) {
        setActivePage("expenses");
      } else if (hash.includes("login")) {
        setActivePage("login");
      } else if (hash.includes("timeoff")) {
        setActivePage("timeoff");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const switchPage = (page: ActivePage) => {
    setActivePage(page);
    window.location.hash = page;
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans select-none relative">
      {/* Top Floating Page Switcher */}
      <div className="fixed top-2.5 right-4 z-[9999] pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#161b22]/95 backdrop-blur-md p-1.5 rounded-full border border-[#30363d] shadow-2xl">
          {/* Approvals Page Button */}
          <button
            type="button"
            onClick={() => switchPage("approvals")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "approvals"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Approvals</span>
          </button>

          {/* Dashboard Page Button */}
          <button
            type="button"
            onClick={() => switchPage("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "dashboard"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* Activity Page Button */}
          <button
            type="button"
            onClick={() => switchPage("activity")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "activity"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity</span>
          </button>

          {/* Kiosks Page Button */}
          <button
            type="button"
            onClick={() => switchPage("kiosks")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "kiosks"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Kiosks</span>
          </button>

          {/* Timesheet Page Button */}
          <button
            type="button"
            onClick={() => switchPage("timesheet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "timesheet"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Timesheet</span>
          </button>

          {/* Expenses Page Button */}
          <button
            type="button"
            onClick={() => switchPage("expenses")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "expenses"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </button>

          {/* Login Page Button */}
          <button
            type="button"
            onClick={() => switchPage("login")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "login"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login Page</span>
          </button>

          {/* Time Off Page Button */}
          <button
            type="button"
            onClick={() => switchPage("timeoff")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === "timeoff"
                ? "bg-[#00b0ff] text-white shadow-md shadow-[#00b0ff]/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Time Off</span>
          </button>
        </div>
      </div>

      {/* Render the selected page separately without coupling */}
      {activePage === "approvals" ? (
        <ApprovalsPage
          onNavigateScreen={(scr) => {
            if (scr === "dashboard") switchPage("dashboard");
            else if (scr === "activity") switchPage("activity");
            else if (scr === "kiosks") switchPage("kiosks");
            else if (scr === "timesheet") switchPage("timesheet");
            else if (scr === "expenses") switchPage("expenses");
            else if (scr === "timeoff") switchPage("timeoff");
            else if (scr === "login") switchPage("login");
          }}
        />
      ) : activePage === "dashboard" ? (
        <DashboardPage
          onNavigateScreen={(scr) => {
            if (scr === "approvals") switchPage("approvals");
            else if (scr === "activity") switchPage("activity");
            else if (scr === "kiosks") switchPage("kiosks");
            else if (scr === "timesheet") switchPage("timesheet");
            else if (scr === "expenses") switchPage("expenses");
            else if (scr === "timeoff") switchPage("timeoff");
            else if (scr === "login") switchPage("login");
          }}
        />
      ) : activePage === "activity" ? (
        <ActivityPage
          onNavigateScreen={(scr) => {
            if (scr === "approvals") switchPage("approvals");
            else if (scr === "dashboard") switchPage("dashboard");
            else if (scr === "kiosks") switchPage("kiosks");
            else if (scr === "timesheet") switchPage("timesheet");
            else if (scr === "expenses") switchPage("expenses");
            else if (scr === "timeoff") switchPage("timeoff");
            else if (scr === "login") switchPage("login");
          }}
        />
      ) : activePage === "kiosks" ? (
        <KiosksPage
          onNavigateScreen={(scr) => {
            if (scr === "approvals") switchPage("approvals");
            else if (scr === "dashboard") switchPage("dashboard");
            else if (scr === "activity") switchPage("activity");
            else if (scr === "timesheet") switchPage("timesheet");
            else if (scr === "expenses") switchPage("expenses");
            else if (scr === "timeoff") switchPage("timeoff");
            else if (scr === "login") switchPage("login");
          }}
        />
      ) : activePage === "timesheet" ? (
        <TimesheetPage
          onNavigateScreen={(scr) => {
            if (scr === "approvals") switchPage("approvals");
            else if (scr === "dashboard") switchPage("dashboard");
            else if (scr === "activity") switchPage("activity");
            else if (scr === "kiosks") switchPage("kiosks");
            else if (scr === "expenses") switchPage("expenses");
            else if (scr === "timeoff") switchPage("timeoff");
            else if (scr === "login") switchPage("login");
          }}
        />
      ) : activePage === "expenses" ? (
        <ExpensesPage />
      ) : activePage === "login" ? (
        <LoginPage />
      ) : (
        <TimeOffPage />
      )}
    </div>
  );
}
