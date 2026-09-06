import { timeTrackerService } from "../services/TimeTrackerService.ts";
import { projectRepository } from "../repositories/ProjectRepository.ts";
import { tagRepository } from "../repositories/TagRepository.ts";
import { clientRepository } from "../repositories/ClientRepository.ts";
import { teamRepository } from "../repositories/TeamRepository.ts";
import { expenseRepository } from "../repositories/ExpenseRepository.ts";
import { timeOffRepository } from "../repositories/TimeOffRepository.ts";
import { TimeTrackerValidator } from "../validators/timeTrackerValidator.ts";

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  error?: string;
  errors?: string[];
}

export class TimeTrackerController {
  // Timer Endpoints
  static async getTimerStatus(): Promise<ApiResponse> {
    try {
      const status = timeTrackerService.getTimerStatus();
      return { status: 200, data: status };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to get timer status" };
    }
  }

  static async startTimer(body: any): Promise<ApiResponse> {
    try {
      const status = await timeTrackerService.startTimer(body);
      return { status: 200, data: status };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to start timer" };
    }
  }

  static async stopTimer(): Promise<ApiResponse> {
    try {
      const entry = await timeTrackerService.stopTimer();
      if (!entry) {
        return { status: 400, error: "No active timer is currently running" };
      }
      return { status: 200, data: entry };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to stop timer" };
    }
  }

  static async discardTimer(): Promise<ApiResponse> {
    try {
      const status = timeTrackerService.discardTimer();
      return { status: 200, data: status };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to discard timer" };
    }
  }

  // Time Entry Endpoints
  static async listEntries(grouped: boolean = true): Promise<ApiResponse> {
    try {
      if (grouped) {
        const groups = await timeTrackerService.listGroupedEntries();
        return { status: 200, data: groups };
      }
      const entries = await timeTrackerService.listEntries();
      return { status: 200, data: entries };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list time entries" };
    }
  }

  static async getEntry(id: string): Promise<ApiResponse> {
    try {
      const entry = await timeTrackerService.getEntryById(id);
      if (!entry) {
        return { status: 404, error: `Time entry '${id}' not found` };
      }
      return { status: 200, data: entry };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to get time entry" };
    }
  }

  static async createEntry(body: any): Promise<ApiResponse> {
    try {
      const validation = TimeTrackerValidator.validateCreateEntry(body);
      if (!validation.isValid) {
        return { status: 400, errors: validation.errors };
      }
      const entry = await timeTrackerService.createEntry(body);
      return { status: 201, data: entry };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create time entry" };
    }
  }

  static async updateEntry(id: string, body: any): Promise<ApiResponse> {
    try {
      const validation = TimeTrackerValidator.validateUpdateEntry(body);
      if (!validation.isValid) {
        return { status: 400, errors: validation.errors };
      }
      const updated = await timeTrackerService.updateEntry(id, body);
      if (!updated) {
        return { status: 404, error: `Time entry '${id}' not found` };
      }
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to update time entry" };
    }
  }

  static async deleteEntry(id: string): Promise<ApiResponse> {
    try {
      const success = await timeTrackerService.deleteEntry(id);
      if (!success) {
        return { status: 404, error: `Time entry '${id}' not found` };
      }
      return { status: 200, data: { success: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to delete time entry" };
    }
  }

  static async getSummary(): Promise<ApiResponse> {
    try {
      const summary = await timeTrackerService.getSummary();
      return { status: 200, data: summary };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to calculate summary" };
    }
  }

  // Metadata Endpoints
  static async listProjects(): Promise<ApiResponse> {
    try {
      const projects = await projectRepository.getAll();
      return { status: 200, data: projects };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list projects" };
    }
  }

  static async createProject(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.name) {
        return { status: 400, error: "Project name is required" };
      }
      const project = await projectRepository.create(
        body.name,
        body.color || "#03a9f4",
        body.clientName
      );
      return { status: 201, data: project };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create project" };
    }
  }

  static async updateProject(id: string, body: any): Promise<ApiResponse> {
    try {
      const updated = await projectRepository.update(id, body);
      if (!updated) return { status: 404, error: "Project not found" };
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to update project" };
    }
  }

  static async updateTask(projectId: string, taskId: string, body: any): Promise<ApiResponse> {
    try {
      const updated = await projectRepository.updateTask(projectId, taskId, body);
      if (!updated) return { status: 404, error: "Task or project not found" };
      return { status: 200, data: updated };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to update task" };
    }
  }

  static async createTask(projectId: string, body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.name) {
        return { status: 400, error: "Task name is required" };
      }
      const newTask = await projectRepository.createTask(projectId, body.name);
      if (!newTask) return { status: 404, error: "Project not found" };
      return { status: 201, data: newTask };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create task" };
    }
  }

  static async listTags(): Promise<ApiResponse> {
    try {
      const tags = await tagRepository.getAll();
      return { status: 200, data: tags };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list tags" };
    }
  }

  static async createTag(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.name) {
        return { status: 400, error: "Tag name is required" };
      }
      const tag = await tagRepository.create(body.name);
      return { status: 201, data: tag };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create tag" };
    }
  }

  // Client Endpoints
  static async listClients(): Promise<ApiResponse> {
    try {
      const clients = await clientRepository.getAll();
      return { status: 200, data: clients };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list clients" };
    }
  }

  static async createClient(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.name) {
        return { status: 400, error: "Client name is required" };
      }
      const client = await clientRepository.create(body.name, body.currency || "USD", body.address);
      return { status: 201, data: client };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create client" };
    }
  }

  static async archiveClient(id: string): Promise<ApiResponse> {
    try {
      const client = await clientRepository.archive(id);
      if (!client) return { status: 404, error: "Client not found" };
      return { status: 200, data: client };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to toggle archive status" };
    }
  }

  static async deleteClient(id: string): Promise<ApiResponse> {
    try {
      const success = await clientRepository.delete(id);
      if (!success) return { status: 404, error: "Client not found" };
      return { status: 200, data: { success: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to delete client" };
    }
  }

  // Team Endpoints
  static async listTeamMembers(): Promise<ApiResponse> {
    try {
      const members = await teamRepository.getAll();
      return { status: 200, data: members };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list team members" };
    }
  }

  static async createTeamMember(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.email || !body.name) {
        return { status: 400, error: "Name and email are required" };
      }
      const member = await teamRepository.create(body.name, body.email, body.role || "Regular");
      return { status: 201, data: member };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create team member" };
    }
  }

  static async deleteTeamMember(id: string): Promise<ApiResponse> {
    try {
      const success = await teamRepository.delete(id);
      if (!success) return { status: 404, error: "Team member not found" };
      return { status: 200, data: { success: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to delete team member" };
    }
  }

  // Expense Endpoints
  static async listExpenses(): Promise<ApiResponse> {
    try {
      const expenses = await expenseRepository.getAll();
      return { status: 200, data: expenses };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list expenses" };
    }
  }

  static async createExpense(body: any): Promise<ApiResponse> {
    try {
      if (!body || typeof body.amount !== "number") {
        return { status: 400, error: "Expense amount is required" };
      }
      const expense = await expenseRepository.create({
        amount: body.amount,
        currency: body.currency || "USD",
        category: body.category || "General",
        projectId: body.projectId,
        projectName: body.projectName,
        projectColor: body.projectColor,
        date: body.date || new Date().toISOString(),
        isBillable: body.isBillable ?? true,
        notes: body.notes,
        hasReceipt: body.hasReceipt ?? false,
      });
      return { status: 201, data: expense };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create expense" };
    }
  }

  static async deleteExpense(id: string): Promise<ApiResponse> {
    try {
      const success = await expenseRepository.delete(id);
      if (!success) return { status: 404, error: "Expense not found" };
      return { status: 200, data: { success: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to delete expense" };
    }
  }

  // Time Off Endpoints
  static async listTimeOff(): Promise<ApiResponse> {
    try {
      const requests = await timeOffRepository.getAll();
      return { status: 200, data: requests };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to list time off requests" };
    }
  }

  static async createTimeOff(body: any): Promise<ApiResponse> {
    try {
      if (!body || !body.policyName || !body.startDate) {
        return { status: 400, error: "Policy and start date are required" };
      }
      const req = await timeOffRepository.create({
        userName: body.userName || "vishalkomi954",
        policyName: body.policyName,
        startDate: body.startDate,
        endDate: body.endDate || body.startDate,
        dateRangeLabel: body.dateRangeLabel || `${body.startDate}`,
        durationDays: body.durationDays || 1,
        status: body.status || "pending",
        note: body.note,
      });
      return { status: 201, data: req };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to create time off request" };
    }
  }

  static async updateTimeOffStatus(id: string, status: any): Promise<ApiResponse> {
    try {
      const req = await timeOffRepository.updateStatus(id, status);
      if (!req) return { status: 404, error: "Time off request not found" };
      return { status: 200, data: req };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to update time off request" };
    }
  }

  // Seed / Clear Helper Endpoints for Testing
  static async seedSampleData(): Promise<ApiResponse> {
    try {
      const entries = await timeTrackerService.seedData();
      return { status: 200, data: entries };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to seed data" };
    }
  }

  static async clearData(): Promise<ApiResponse> {
    try {
      await timeTrackerService.clearData();
      return { status: 200, data: { cleared: true } };
    } catch (err: any) {
      return { status: 500, error: err.message || "Failed to clear data" };
    }
  }
}

