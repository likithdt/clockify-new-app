import { useState } from "react";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useProjectStore, Project, ClientItem } from "@/stores/useProjectStore";
import { ExpensesMainView } from "./ExpensesMainView";
import { AddExpenseView } from "./AddExpenseView";
import { ProjectSelectView } from "./ProjectSelectView";
import { CategorySelectView } from "./CategorySelectView";
import { DatePickerModal } from "./DatePickerModal";
import { ReceiptBottomSheet } from "./ReceiptBottomSheet";
import { MobileDrawer } from "./MobileDrawer";
import { ExpenseSettingsModal } from "./ExpenseSettingsModal";
import { ProjectDetailEditView } from "./ProjectDetailEditView";
import { ClientSelectView } from "./ClientSelectView";
import { EditClientView } from "./EditClientView";
import { CreateProjectView } from "./CreateProjectView";
import { CategoriesSettingsView } from "./CategoriesSettingsView";

type ActiveSubView =
  | "main"
  | "add"
  | "projects"
  | "category"
  | "projectDetail"
  | "createProject"
  | "createProjectClients"
  | "clients"
  | "editClient"
  | "categoriesSettings";

export function ExpensesPage() {
  const { addExpense } = useExpenseStore();
  const { updateProject, updateClient, createProject, projects } = useProjectStore();

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveSubView>("main");
  const [navigationHistory, setNavigationHistory] = useState<ActiveSubView[]>(["main"]);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<ClientItem | null>(null);

  // New project creation state
  const [newProjectClient, setNewProjectClient] = useState<string | null>(null);

  // Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReceiptSheetOpen, setIsReceiptSheetOpen] = useState(false);

  // Draft Expense State matching Screenshots
  const [expenseDate, setExpenseDate] = useState("07/09/2026");
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isBillable, setIsBillable] = useState(false);
  const [attachedReceipt, setAttachedReceipt] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Navigation Helpers
  const navigateTo = (view: ActiveSubView) => {
    setNavigationHistory((prev) => [...prev, view]);
    setActiveView(view);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveView(prevView);
    } else {
      setActiveView("main");
    }
  };

  const handleSaveExpense = () => {
    if (!selectedProject || !selectedCategory || !amount) return;

    addExpense({
      teamMember: "shivashankarbs1508",
      date: expenseDate,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      projectColor: selectedProject.color,
      category: selectedCategory,
      amount: parseFloat(amount) || 0,
      currency: "USD",
      note: notes.trim(),
      billable: isBillable,
      receiptName: attachedReceipt || undefined,
    });

    // Reset draft
    setSelectedProject(null);
    setSelectedCategory(null);
    setAmount("");
    setIsBillable(false);
    setAttachedReceipt(null);
    setNotes("");

    // Navigate to main list
    setActiveView("main");
    setNavigationHistory(["main"]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1117] overflow-hidden select-none sm:py-3">
      {/* Mobile Device Container */}
      <div className="w-full max-w-[420px] h-full sm:h-[870px] sm:max-h-[96vh] sm:rounded-[38px] bg-white flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:border-[8px] sm:border-[#1e232d] relative">
        {/* Active View Display */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === "main" && (
            <ExpensesMainView
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onOpenSettings={() => navigateTo("categoriesSettings")}
              onOpenAddExpense={() => navigateTo("add")}
              onSelectExpense={(exp) => {
                // Pre-populate add form with this expense to view/edit
                setExpenseDate(exp.date);
                setSelectedProject({
                  id: exp.projectId,
                  name: exp.projectName,
                  color: exp.projectColor,
                });
                setSelectedCategory(exp.category);
                setAmount(String(exp.amount));
                setIsBillable(exp.billable);
                setAttachedReceipt(exp.receiptName || null);
                setNotes(exp.note || "");
                navigateTo("add");
              }}
            />
          )}

          {activeView === "add" && (
            <AddExpenseView
              onBack={handleBack}
              date={expenseDate}
              onOpenDatePicker={() => setIsDatePickerOpen(true)}
              project={selectedProject}
              onOpenProjectSelect={() => navigateTo("projects")}
              category={selectedCategory}
              onOpenCategorySelect={() => navigateTo("category")}
              amount={amount}
              onAmountChange={setAmount}
              billable={isBillable}
              onToggleBillable={() => setIsBillable(!isBillable)}
              attachedReceipt={attachedReceipt}
              onOpenReceiptSheet={() => setIsReceiptSheetOpen(true)}
              onRemoveReceipt={() => setAttachedReceipt(null)}
              notes={notes}
              onNotesChange={setNotes}
              onSaveExpense={handleSaveExpense}
            />
          )}

          {activeView === "projects" && (
            <ProjectSelectView
              onBack={handleBack}
              selectedProjectId={selectedProject?.id}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                handleBack();
              }}
              onOpenProjectEdit={(proj) => {
                setSelectedProjectForEdit(proj);
                navigateTo("projectDetail");
              }}
              onCreateNew={() => navigateTo("createProject")}
            />
          )}

          {activeView === "projectDetail" && selectedProjectForEdit && (
            <ProjectDetailEditView
              project={projects.find((p) => p.id === selectedProjectForEdit.id) || selectedProjectForEdit}
              onBack={handleBack}
              onOpenClientSelect={() => navigateTo("clients")}
            />
          )}

          {/* Create New Project - full screen view */}
          {activeView === "createProject" && (
            <CreateProjectView
              onBack={handleBack}
              onOpenClientSelect={() => navigateTo("createProjectClients")}
              selectedClient={newProjectClient}
              onSave={(newProj) => {
                createProject({
                  name: newProj.name,
                  color: newProj.color,
                  client: newProj.client,
                  isPublic: newProj.isPublic,
                  isBillable: newProj.isBillable,
                });
                // Select the newly created project and go back to add expense
                setSelectedProject({
                  id: `proj-${Date.now()}`,
                  name: newProj.name,
                  color: newProj.color,
                });
                setNewProjectClient(null);
                // Pop back to add expense view
                setActiveView("add");
                setNavigationHistory(["main", "add"]);
              }}
            />
          )}

          {/* Clients for creating a new project */}
          {activeView === "createProjectClients" && (
            <ClientSelectView
              onBack={handleBack}
              selectedClientName={newProjectClient}
              onSelectClient={(clientName) => {
                setNewProjectClient(clientName);
                handleBack();
              }}
              onEditClient={(client) => {
                setSelectedClientForEdit(client);
                navigateTo("editClient");
              }}
            />
          )}

          {activeView === "clients" && (
            <ClientSelectView
              onBack={handleBack}
              selectedClientName={
                selectedProjectForEdit
                  ? (projects.find((p) => p.id === selectedProjectForEdit.id)?.client ||
                    selectedProjectForEdit.client)
                  : null
              }
              onSelectClient={(clientName) => {
                if (selectedProjectForEdit) {
                  updateProject(selectedProjectForEdit.id, { client: clientName });
                }
                handleBack();
              }}
              onEditClient={(client) => {
                setSelectedClientForEdit(client);
                navigateTo("editClient");
              }}
            />
          )}

          {activeView === "editClient" && selectedClientForEdit && (
            <EditClientView
              client={selectedClientForEdit}
              onBack={handleBack}
              onSave={(updates) => {
                updateClient(selectedClientForEdit.id, updates);
                setSelectedClientForEdit((prev) => (prev ? { ...prev, ...updates } : null));
              }}
            />
          )}

          {activeView === "category" && (
            <CategorySelectView
              onBack={handleBack}
              selectedCategory={selectedCategory || undefined}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                // If a unit rate category is chosen, optionally populate amount
                if (cat === "Day rate" && !amount) {
                  setAmount("100.00");
                } else if (cat === "Mileage" && !amount) {
                  setAmount("0.57");
                }
                handleBack();
              }}
            />
          )}

          {activeView === "categoriesSettings" && (
            <CategoriesSettingsView onBack={handleBack} />
          )}

          {/* Modal Layers */}
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            activeScreen="expenses"
            onNavigate={(screen) => {
              if (screen === "expenses") {
                setActiveView("main");
                setNavigationHistory(["main"]);
              } else if (screen === "settings") {
                navigateTo("categoriesSettings");
              }
            }}
          />

          <DatePickerModal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            selectedDate={expenseDate}
            onSelectDate={(newDate) => setExpenseDate(newDate)}
          />

          <ReceiptBottomSheet
            isOpen={isReceiptSheetOpen}
            onClose={() => setIsReceiptSheetOpen(false)}
            onAttachReceipt={(name) => setAttachedReceipt(name)}
          />

          <ExpenseSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>

        {/* Android Navigation Bar matching Screenshots */}
        <div className="h-10 bg-white shrink-0 border-t border-gray-100 flex items-center justify-around px-8 z-40 select-none">
          {/* Recents button (three vertical bars) */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Recents / Menu"
          >
            <div className="flex items-center gap-1">
              <span className="w-0.5 h-3.5 bg-gray-600 rounded-full" />
              <span className="w-0.5 h-3.5 bg-gray-600 rounded-full" />
              <span className="w-0.5 h-3.5 bg-gray-600 rounded-full" />
            </div>
          </button>

          {/* Home button (circle) */}
          <button
            type="button"
            onClick={() => {
              setActiveView("main");
              setNavigationHistory(["main"]);
            }}
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Home"
          >
            <div className="w-3.5 h-3.5 rounded-full border-[1.8px] border-gray-600" />
          </button>

          {/* Back button (chevron left) */}
          <button
            type="button"
            onClick={handleBack}
            className="w-12 h-8 flex items-center justify-center opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            title="Back"
          >
            <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-gray-600 -rotate-45 translate-x-0.5" />
          </button>
        </div>

        {/* Bottom Android Home gesture bar pill */}
        <div className="h-2 bg-white flex items-center justify-center shrink-0">
          <div className="w-24 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
