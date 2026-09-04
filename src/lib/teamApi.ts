import { invoke } from '@tauri-apps/api/core';
import { teamService } from '@backend/services/teamService';
import type {
  TeamMemberDTO,
  AddTeamMemberPayload,
  UpdateTeamMemberPayload,
  TeamFilter,
  TeamSummaryDTO,
} from '@backend/models/teamTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const teamApi = {
  listMembers: async (filter?: TeamFilter): Promise<TeamMemberDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TeamMemberDTO[]>('list_workspace_team_members', { filter });
      } catch (e) {
        console.warn('Tauri invoke list_workspace_team_members failed, using fallback:', e);
      }
    }
    return teamService.listMembers(filter);
  },

  getMember: async (id: string): Promise<TeamMemberDTO> => {
    if (isTauri) {
      try {
        return await invoke<TeamMemberDTO>('get_workspace_team_member', { id });
      } catch (e) {
        console.warn('Tauri invoke get_workspace_team_member failed, using fallback:', e);
      }
    }
    const m = teamService.getMember(id);
    if (!m) throw new Error(`Team member '${id}' not found`);
    return m;
  },

  addMembers: async (payload: AddTeamMemberPayload): Promise<TeamMemberDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TeamMemberDTO[]>('add_workspace_team_members', { payload });
      } catch (e) {
        console.warn('Tauri invoke add_workspace_team_members failed, using fallback:', e);
      }
    }
    return teamService.addMembers(payload);
  },

  updateMember: async (id: string, payload: UpdateTeamMemberPayload): Promise<TeamMemberDTO> => {
    if (isTauri) {
      try {
        return await invoke<TeamMemberDTO>('update_workspace_team_member', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_workspace_team_member failed, using fallback:', e);
      }
    }
    return teamService.updateMember(id, payload);
  },

  deleteMember: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_workspace_team_member', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_workspace_team_member failed, using fallback:', e);
      }
    }
    return teamService.deleteMember(id);
  },

  resetSampleTeam: async (): Promise<TeamMemberDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<TeamMemberDTO[]>('reset_sample_workspace_team');
      } catch (e) {
        console.warn('Tauri invoke reset_sample_workspace_team failed, using fallback:', e);
      }
    }
    teamService.resetSample();
    return teamService.listMembers();
  },

  getSummary: async (): Promise<TeamSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<TeamSummaryDTO>('get_workspace_team_summary');
      } catch (e) {
        console.warn('Tauri invoke get_workspace_team_summary failed, using fallback:', e);
      }
    }
    return teamService.getSummary();
  },
};
