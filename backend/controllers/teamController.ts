import { teamService } from '../services/teamService';
import type {
  AddTeamMemberPayload,
  UpdateTeamMemberPayload,
  TeamFilter,
} from '../models/teamTypes';

export class TeamController {
  static listMembers(filter?: TeamFilter) {
    try {
      const members = teamService.listMembers(filter);
      return { success: true, data: members };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getMember(id: string) {
    try {
      const member = teamService.getMember(id);
      if (!member) return { success: false, error: `Member '${id}' not found` };
      return { success: true, data: member };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static addMembers(payload: AddTeamMemberPayload) {
    try {
      if (!payload.emails || payload.emails.length === 0) {
        return { success: false, error: 'At least one email is required' };
      }
      const added = teamService.addMembers(payload);
      return { success: true, data: added };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateMember(id: string, payload: UpdateTeamMemberPayload) {
    try {
      const updated = teamService.updateMember(id, payload);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteMember(id: string) {
    try {
      const deleted = teamService.deleteMember(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static resetSample() {
    try {
      const members = teamService.resetSample();
      return { success: true, data: members };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = teamService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
