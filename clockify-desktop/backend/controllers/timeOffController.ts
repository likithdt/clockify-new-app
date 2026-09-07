import { timeOffService } from '../services/timeOffService';
import type {
  CreateRequestDTO,
  ReviewRequestDTO,
  CreatePolicyDTO,
  UpdatePolicyDTO,
  CreateHolidayDTO,
  UpdateHolidayDTO,
  ListRequestsFilter,
  ListPoliciesFilter,
} from '../models/types';

export class TimeOffController {
  // Requests
  static getRequests(filter?: ListRequestsFilter) {
    return {
      success: true,
      data: timeOffService.listRequests(filter),
    };
  }

  static getRequest(id: string) {
    const request = timeOffService.getRequestById(id);
    if (!request) {
      return { success: false, error: `Request '${id}' not found` };
    }
    return { success: true, data: request };
  }

  static createRequest(dto: CreateRequestDTO) {
    try {
      const data = timeOffService.createRequest(dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static reviewRequest(id: string, dto: ReviewRequestDTO) {
    try {
      const data = timeOffService.reviewRequest(id, dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static withdrawRequest(id: string) {
    try {
      const data = timeOffService.withdrawRequest(id);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteRequest(id: string) {
    try {
      timeOffService.deleteRequest(id);
      return { success: true, message: 'Deleted successfully' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // Timeline
  static getTimeline(fromDate: string, toDate: string, memberId?: string) {
    return {
      success: true,
      data: timeOffService.getTimeline(fromDate, toDate, memberId),
    };
  }

  // Balances
  static getBalances(policyId?: string, memberId?: string) {
    return {
      success: true,
      data: timeOffService.listBalances(policyId, memberId),
    };
  }

  static setBalance(memberId: string, policyId: string, accrued: number, carriedOver: number) {
    return {
      success: true,
      data: timeOffService.setBalance(memberId, policyId, accrued, carriedOver),
    };
  }

  // Policies
  static getPolicies(filter?: ListPoliciesFilter) {
    return {
      success: true,
      data: timeOffService.listPolicies(filter),
    };
  }

  static createPolicy(dto: CreatePolicyDTO) {
    try {
      const data = timeOffService.createPolicy(dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updatePolicy(id: string, dto: UpdatePolicyDTO) {
    try {
      const data = timeOffService.updatePolicy(id, dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deletePolicy(id: string) {
    try {
      timeOffService.deletePolicy(id);
      return { success: true, message: 'Policy deleted' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // Holidays
  static getHolidays(year?: number) {
    return {
      success: true,
      data: timeOffService.listHolidays(year),
    };
  }

  static createHoliday(dto: CreateHolidayDTO) {
    try {
      const data = timeOffService.createHoliday(dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static updateHoliday(id: string, dto: UpdateHolidayDTO) {
    try {
      const data = timeOffService.updateHoliday(id, dto);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static deleteHoliday(id: string) {
    try {
      timeOffService.deleteHoliday(id);
      return { success: true, message: 'Holiday deleted' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  static importHolidays(countryCode: string, year: number) {
    try {
      const data = timeOffService.importPublicHolidays(countryCode, year);
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message };
    }
  }

  // Members
  static getMembers() {
    return {
      success: true,
      data: timeOffService.listMembers(),
    };
  }
}
