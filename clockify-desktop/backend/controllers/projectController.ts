import { projectService } from '../services/projectService';
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilter,
} from '../models/projectTypes';

export class ProjectController {
  static listProjects(filter?: ProjectFilter) {
    try {
      const projects = projectService.listProjects(filter);
      return { success: true, data: projects };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getProject(id: string) {
    try {
      const project = projectService.getProject(id);
      if (!project) return { success: false, error: `Project '${id}' not found` };
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static createProject(payload: CreateProjectPayload) {
    try {
      if (!payload.name || !payload.name.trim()) {
        return { success: false, error: 'Project name is required' };
      }
      const project = projectService.createProject(payload);
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateProject(id: string, payload: UpdateProjectPayload) {
    try {
      const project = projectService.updateProject(id, payload);
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteProject(id: string) {
    try {
      const deleted = projectService.deleteProject(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static archiveProject(id: string) {
    try {
      const project = projectService.archiveProject(id);
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static restoreProject(id: string) {
    try {
      const project = projectService.restoreProject(id);
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static toggleFavorite(id: string) {
    try {
      const project = projectService.toggleFavorite(id);
      return { success: true, data: project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static removeSampleData() {
    try {
      projectService.removeSampleData();
      return { success: true, message: 'Sample projects removed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static restoreSampleData() {
    try {
      const list = projectService.restoreSampleData();
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = projectService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
