import { invoke } from '@tauri-apps/api/core';
import { projectService } from '@backend/services/projectService';
import type {
  ProjectDTO,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilter,
  ProjectSummaryDTO,
} from '@backend/models/projectTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const projectApi = {
  listProjects: async (filter?: ProjectFilter): Promise<ProjectDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO[]>('list_projects', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_projects failed, using fallback:', e);
      }
    }
    return projectService.listProjects(filter);
  },

  getProject: async (id: string): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('get_project', { id });
      } catch (e) {
        console.warn('Tauri invoke get_project failed, using fallback:', e);
      }
    }
    const p = projectService.getProject(id);
    if (!p) throw new Error(`Project '${id}' not found`);
    return p;
  },

  createProject: async (payload: CreateProjectPayload): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('create_project', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_project failed, using fallback:', e);
      }
    }
    return projectService.createProject(payload);
  },

  updateProject: async (id: string, payload: UpdateProjectPayload): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('update_project', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_project failed, using fallback:', e);
      }
    }
    return projectService.updateProject(id, payload);
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_project', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_project failed, using fallback:', e);
      }
    }
    return projectService.deleteProject(id);
  },

  archiveProject: async (id: string): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('archive_project', { id });
      } catch (e) {
        console.warn('Tauri invoke archive_project failed, using fallback:', e);
      }
    }
    return projectService.archiveProject(id);
  },

  restoreProject: async (id: string): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('restore_project', { id });
      } catch (e) {
        console.warn('Tauri invoke restore_project failed, using fallback:', e);
      }
    }
    return projectService.restoreProject(id);
  },

  toggleFavoriteProject: async (id: string): Promise<ProjectDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO>('toggle_favorite_project', { id });
      } catch (e) {
        console.warn('Tauri invoke toggle_favorite_project failed, using fallback:', e);
      }
    }
    return projectService.toggleFavorite(id);
  },

  removeSampleProjects: async (): Promise<void> => {
    if (isTauri) {
      try {
        await invoke('remove_sample_projects');
        return;
      } catch (e) {
        console.warn('Tauri invoke remove_sample_projects failed, using fallback:', e);
      }
    }
    projectService.removeSampleData();
  },

  restoreSampleProjects: async (): Promise<ProjectDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<ProjectDTO[]>('restore_sample_projects');
      } catch (e) {
        console.warn('Tauri invoke restore_sample_projects failed, using fallback:', e);
      }
    }
    projectService.restoreSampleData();
    return projectService.listProjects();
  },

  getProjectSummary: async (): Promise<ProjectSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<ProjectSummaryDTO>('get_project_summary');
      } catch (e) {
        console.warn('Tauri invoke get_project_summary failed, using fallback:', e);
      }
    }
    return projectService.getSummary();
  },
};
