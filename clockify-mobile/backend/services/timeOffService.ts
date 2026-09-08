import {
  TimeOffRequest,
  LeavePolicy,
  LeaveBalance,
  Holiday,
  TeamMember,
  CreateRequestDTO,
  ReviewRequestDTO,
  CreatePolicyDTO,
  UpdatePolicyDTO,
  CreateHolidayDTO,
  UpdateHolidayDTO,
  ListRequestsFilter,
  ListPoliciesFilter,
} from '../models/types';
import seedData from '../data/seedData.json';

export class TimeOffService {
  private requests: TimeOffRequest[] = [...(seedData.requests as TimeOffRequest[])];
  private policies: LeavePolicy[] = [...(seedData.policies as LeavePolicy[])];
  private balances: LeaveBalance[] = [...(seedData.balances as LeaveBalance[])];
  private holidays: Holiday[] = [...(seedData.holidays as Holiday[])];
  private members: TeamMember[] = [...(seedData.members as TeamMember[])];

  // ─── Requests ─────────────────────────────────────────────────────────────

  public listRequests(filter?: ListRequestsFilter): TimeOffRequest[] {
    let result = [...this.requests];
    if (filter) {
      if (filter.member_id) {
        result = result.filter((r) => r.member_id === filter.member_id);
      }
      if (filter.status) {
        result = result.filter((r) => r.status === filter.status);
      }
      if (filter.from_date) {
        result = result.filter((r) => r.start_date >= filter.from_date!);
      }
      if (filter.to_date) {
        result = result.filter((r) => r.end_date <= filter.to_date!);
      }
    }
    return result.sort((a, b) => b.requested_at.localeCompare(a.requested_at));
  }

  public getRequestById(id: string): TimeOffRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  public createRequest(dto: CreateRequestDTO): TimeOffRequest {
    const member = this.members.find((m) => m.id === dto.member_id);
    if (!member) {
      throw new Error(`Member with id '${dto.member_id}' not found`);
    }

    const policy = this.policies.find((p) => p.id === dto.policy_id);
    if (!policy) {
      throw new Error(`Policy with id '${dto.policy_id}' not found`);
    }
    if (!policy.is_active) {
      throw new Error(`Policy '${policy.name}' is currently inactive`);
    }

    if (dto.start_date > dto.end_date) {
      throw new Error('start_date cannot be after end_date');
    }

    const hasOverlap = this.requests.some(
      (r) =>
        r.member_id === dto.member_id &&
        r.status !== 'rejected' &&
        r.status !== 'withdrawn' &&
        r.start_date <= dto.end_date &&
        r.end_date >= dto.start_date
    );
    if (hasOverlap) {
      throw new Error('An overlapping request already exists for this member');
    }

    const newRequest: TimeOffRequest = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      member_id: dto.member_id,
      policy_id: dto.policy_id,
      start_date: dto.start_date,
      end_date: dto.end_date,
      duration: dto.duration,
      status: 'pending',
      note: dto.note || null,
      requested_at: new Date().toISOString(),
      rejection_reason: null,
    };

    this.requests.unshift(newRequest);
    return newRequest;
  }

  public reviewRequest(id: string, dto: ReviewRequestDTO): TimeOffRequest {
    const request = this.requests.find((r) => r.id === id);
    if (!request) {
      throw new Error(`Request '${id}' not found`);
    }
    if (request.status === 'withdrawn') {
      throw new Error('Cannot review a withdrawn request');
    }

    const oldStatus = request.status;
    request.status = dto.status;
    request.rejection_reason = dto.rejection_reason || null;

    if (oldStatus === 'pending' && dto.status === 'approved') {
      this.adjustBalance(request.member_id, request.policy_id, request.duration);
    } else if (oldStatus === 'approved' && dto.status === 'rejected') {
      this.adjustBalance(request.member_id, request.policy_id, -request.duration);
    }

    return request;
  }

  public withdrawRequest(id: string): TimeOffRequest {
    const request = this.requests.find((r) => r.id === id);
    if (!request) {
      throw new Error(`Request '${id}' not found`);
    }
    if (request.status === 'approved') {
      this.adjustBalance(request.member_id, request.policy_id, -request.duration);
    }
    request.status = 'withdrawn';
    return request;
  }

  public deleteRequest(id: string): void {
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) {
      throw new Error(`Request '${id}' not found`);
    }
    const removed = this.requests.splice(idx, 1)[0];
    if (removed.status === 'approved') {
      this.adjustBalance(removed.member_id, removed.policy_id, -removed.duration);
    }
  }

  // ─── Timeline ─────────────────────────────────────────────────────────────

  public getTimeline(fromDate: string, toDate: string, memberId?: string): TimeOffRequest[] {
    return this.requests.filter((r) => {
      return (
        r.start_date <= toDate &&
        r.end_date >= fromDate &&
        r.status !== 'rejected' &&
        r.status !== 'withdrawn' &&
        (!memberId || r.member_id === memberId)
      );
    });
  }

  // ─── Balances ─────────────────────────────────────────────────────────────

  public listBalances(policyId?: string, memberId?: string): LeaveBalance[] {
    return this.balances.filter((b) => {
      return (
        (!policyId || b.policy_id === policyId) &&
        (!memberId || b.member_id === memberId)
      );
    });
  }

  public setBalance(
    memberId: string,
    policyId: string,
    accrued: number,
    carriedOver: number
  ): LeaveBalance {
    let balance = this.balances.find(
      (b) => b.member_id === memberId && b.policy_id === policyId
    );

    if (balance) {
      balance.accrued = accrued;
      balance.carried_over = carriedOver;
      balance.remaining = accrued + carriedOver - balance.used;
    } else {
      balance = {
        member_id: memberId,
        policy_id: policyId,
        accrued,
        used: 0,
        remaining: accrued + carriedOver,
        carried_over: carriedOver,
      };
      this.balances.push(balance);
    }
    return balance;
  }

  private adjustBalance(memberId: string, policyId: string, delta: number): void {
    let balance = this.balances.find(
      (b) => b.member_id === memberId && b.policy_id === policyId
    );
    if (balance) {
      balance.used = Math.max(0, balance.used + delta);
      balance.remaining = balance.accrued + balance.carried_over - balance.used;
    } else {
      const used = Math.max(0, delta);
      this.balances.push({
        member_id: memberId,
        policy_id: policyId,
        accrued: 0,
        used,
        remaining: -used,
        carried_over: 0,
      });
    }
  }

  // ─── Policies ─────────────────────────────────────────────────────────────

  public listPolicies(filter?: ListPoliciesFilter): LeavePolicy[] {
    if (!filter || filter.is_active === undefined || filter.is_active === null) {
      return this.policies;
    }
    return this.policies.filter((p) => p.is_active === filter.is_active);
  }

  public getPolicyById(id: string): LeavePolicy | undefined {
    return this.policies.find((p) => p.id === id);
  }

  public createPolicy(dto: CreatePolicyDTO): LeavePolicy {
    if (this.policies.some((p) => p.name.toLowerCase() === dto.name.toLowerCase())) {
      throw new Error(`A policy named '${dto.name}' already exists`);
    }

    const newPolicy: LeavePolicy = {
      id: 'pol_' + Math.random().toString(36).substring(2, 9),
      name: dto.name,
      unit: dto.unit,
      accrual_per_year: dto.accrual_per_year ?? null,
      accrual_type: dto.accrual_type,
      allow_carryover: dto.allow_carryover,
      max_balance: dto.max_balance ?? null,
      is_active: true,
      assignee_ids: dto.assignee_ids,
      requires_approval: dto.requires_approval,
      allow_negative_balance: dto.allow_negative_balance,
      allow_half_day: dto.allow_half_day,
      created_at: new Date().toISOString(),
    };

    this.policies.push(newPolicy);
    return newPolicy;
  }

  public updatePolicy(id: string, dto: UpdatePolicyDTO): LeavePolicy {
    const policy = this.policies.find((p) => p.id === id);
    if (!policy) {
      throw new Error(`Policy with id '${id}' not found`);
    }
    if (dto.name !== undefined) policy.name = dto.name;
    if (dto.unit !== undefined) policy.unit = dto.unit;
    if (dto.accrual_per_year !== undefined) policy.accrual_per_year = dto.accrual_per_year;
    if (dto.accrual_type !== undefined) policy.accrual_type = dto.accrual_type;
    if (dto.allow_carryover !== undefined) policy.allow_carryover = dto.allow_carryover;
    if (dto.max_balance !== undefined) policy.max_balance = dto.max_balance;
    if (dto.assignee_ids !== undefined) policy.assignee_ids = dto.assignee_ids;
    if (dto.is_active !== undefined) policy.is_active = dto.is_active;
    if (dto.requires_approval !== undefined) policy.requires_approval = dto.requires_approval;
    if (dto.allow_negative_balance !== undefined) policy.allow_negative_balance = dto.allow_negative_balance;
    if (dto.allow_half_day !== undefined) policy.allow_half_day = dto.allow_half_day;

    return policy;
  }

  public deletePolicy(id: string): void {
    const hasApproved = this.requests.some(
      (r) => r.policy_id === id && r.status === 'approved'
    );
    if (hasApproved) {
      throw new Error(
        'Cannot delete policy that has approved requests. Deactivate it instead.'
      );
    }
    this.policies = this.policies.filter((p) => p.id !== id);
    this.balances = this.balances.filter((b) => b.policy_id !== id);
  }

  // ─── Holidays ─────────────────────────────────────────────────────────────

  public listHolidays(year?: number): Holiday[] {
    if (!year) return this.holidays;
    const yearPrefix = year.toString();
    return this.holidays.filter((h) => h.date.startsWith(yearPrefix));
  }

  public createHoliday(dto: CreateHolidayDTO): Holiday {
    const holiday: Holiday = {
      id: 'hol_' + Math.random().toString(36).substring(2, 9),
      name: dto.name,
      date: dto.date,
      end_date: dto.end_date || null,
      country_code: dto.country_code || null,
      member_ids: dto.member_ids,
      recurrence: dto.recurrence,
      color: dto.color || null,
      created_at: new Date().toISOString(),
    };
    this.holidays.push(holiday);
    return holiday;
  }

  public updateHoliday(id: string, dto: UpdateHolidayDTO): Holiday {
    const holiday = this.holidays.find((h) => h.id === id);
    if (!holiday) {
      throw new Error(`Holiday '${id}' not found`);
    }
    if (dto.name !== undefined) holiday.name = dto.name;
    if (dto.date !== undefined) holiday.date = dto.date;
    if (dto.end_date !== undefined) holiday.end_date = dto.end_date;
    if (dto.member_ids !== undefined) holiday.member_ids = dto.member_ids;
    if (dto.recurrence !== undefined) holiday.recurrence = dto.recurrence;
    if (dto.color !== undefined) holiday.color = dto.color;
    return holiday;
  }

  public deleteHoliday(id: string): void {
    this.holidays = this.holidays.filter((h) => h.id !== id);
  }

  public importPublicHolidays(countryCode: string, year: number): Holiday[] {
    const nationalHolidays: Record<string, [string, string][]> = {
      IN: [
        ["New Year's Day", '01-01'],
        ['Republic Day', '01-26'],
        ['Holi', '03-14'],
        ['Good Friday', '04-03'],
        ['Ambedkar Jayanti', '04-14'],
        ['Labour Day', '05-01'],
        ['Independence Day', '08-15'],
        ['Gandhi Jayanti', '10-02'],
        ['Dussehra', '10-02'],
        ['Diwali', '10-20'],
        ['Christmas Day', '12-25'],
      ],
      US: [
        ["New Year's Day", '01-01'],
        ['Martin Luther King Jr. Day', '01-19'],
        ["Presidents' Day", '02-16'],
        ['Memorial Day', '05-25'],
        ['Independence Day', '07-04'],
        ['Labor Day', '09-07'],
        ['Columbus Day', '10-12'],
        ['Veterans Day', '11-11'],
        ['Thanksgiving Day', '11-26'],
        ['Christmas Day', '12-25'],
      ],
      GB: [
        ["New Year's Day", '01-01'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['Early May Bank Holiday', '05-04'],
        ['Spring Bank Holiday', '05-25'],
        ['Summer Bank Holiday', '08-31'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      CA: [
        ["New Year's Day", '01-01'],
        ['Family Day', '02-16'],
        ['Good Friday', '04-03'],
        ['Victoria Day', '05-18'],
        ['Canada Day', '07-01'],
        ['Labour Day', '09-07'],
        ['Thanksgiving Day', '10-12'],
        ['Remembrance Day', '11-11'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      AU: [
        ["New Year's Day", '01-01'],
        ['Australia Day', '01-26'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['ANZAC Day', '04-25'],
        ["Queen's Birthday", '06-08'],
        ['Labour Day', '10-05'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      DE: [
        ["New Year's Day", '01-01'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['Labour Day', '05-01'],
        ['Ascension Day', '05-14'],
        ['Whit Monday', '05-25'],
        ['German Unity Day', '10-03'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      FR: [
        ["New Year's Day", '01-01'],
        ['Easter Monday', '04-06'],
        ['Labour Day', '05-01'],
        ['Victory in Europe Day', '05-08'],
        ['Ascension Day', '05-14'],
        ['Whit Monday', '05-25'],
        ['Bastille Day', '07-14'],
        ['Assumption of Mary', '08-15'],
        ["All Saints' Day", '11-01'],
        ['Armistice Day', '11-11'],
        ['Christmas Day', '12-25'],
      ],
      JP: [
        ["New Year's Day", '01-01'],
        ['Coming of Age Day', '01-12'],
        ['National Foundation Day', '02-11'],
        ['Vernal Equinox Day', '03-20'],
        ['Showa Day', '04-29'],
        ["Constitution Memorial Day", '05-03'],
        ['Greenery Day', '05-04'],
        ["Children's Day", '05-05'],
        ['Marine Day', '07-20'],
        ['Mountain Day', '08-11'],
        ['Respect for the Aged Day', '09-21'],
        ['Health and Sports Day', '10-12'],
        ['Culture Day', '11-03'],
        ['Labour Thanksgiving Day', '11-23'],
      ],
      SG: [
        ["New Year's Day", '01-01'],
        ['Chinese New Year', '01-29'],
        ['Chinese New Year (Day 2)', '01-30'],
        ['Good Friday', '04-03'],
        ['Labour Day', '05-01'],
        ['Vesak Day', '05-12'],
        ['Hari Raya Puasa', '06-03'],
        ['National Day', '08-09'],
        ['Hari Raya Haji', '08-11'],
        ['Deepavali', '10-22'],
        ['Christmas Day', '12-25'],
      ],
    };

    const targetList = nationalHolidays[countryCode.toUpperCase()];
    if (!targetList) {
      throw new Error(`Country code '${countryCode}' not supported.`);
    }

    const imported: Holiday[] = [];
    for (const [name, mmdd] of targetList) {
      const date = `${year}-${mmdd}`;
      const exists = this.holidays.some(
        (h) => h.date === date && h.name === name
      );
      if (!exists) {
        const h: Holiday = {
          id: 'hol_' + Math.random().toString(36).substring(2, 9),
          name,
          date,
          end_date: null,
          country_code: countryCode.toUpperCase(),
          member_ids: [],
          recurrence: 'every_year',
          color: null,
          created_at: new Date().toISOString(),
        };
        this.holidays.push(h);
        imported.push(h);
      }
    }
    return imported;
  }

  public getPublicHolidaysPreview(countryCode: string, year: number): { name: string; date: string; exists: boolean }[] {
    const nationalHolidays: Record<string, [string, string][]> = {
      IN: [
        ["New Year's Day", '01-01'],
        ['Republic Day', '01-26'],
        ['Holi', '03-14'],
        ['Good Friday', '04-03'],
        ['Ambedkar Jayanti', '04-14'],
        ['Labour Day', '05-01'],
        ['Independence Day', '08-15'],
        ['Gandhi Jayanti', '10-02'],
        ['Dussehra', '10-02'],
        ['Diwali', '10-20'],
        ['Christmas Day', '12-25'],
      ],
      US: [
        ["New Year's Day", '01-01'],
        ['Martin Luther King Jr. Day', '01-19'],
        ["Presidents' Day", '02-16'],
        ['Memorial Day', '05-25'],
        ['Independence Day', '07-04'],
        ['Labor Day', '09-07'],
        ['Columbus Day', '10-12'],
        ['Veterans Day', '11-11'],
        ['Thanksgiving Day', '11-26'],
        ['Christmas Day', '12-25'],
      ],
      GB: [
        ["New Year's Day", '01-01'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['Early May Bank Holiday', '05-04'],
        ['Spring Bank Holiday', '05-25'],
        ['Summer Bank Holiday', '08-31'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      CA: [
        ["New Year's Day", '01-01'],
        ['Family Day', '02-16'],
        ['Good Friday', '04-03'],
        ['Victoria Day', '05-18'],
        ['Canada Day', '07-01'],
        ['Labour Day', '09-07'],
        ['Thanksgiving Day', '10-12'],
        ['Remembrance Day', '11-11'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      AU: [
        ["New Year's Day", '01-01'],
        ['Australia Day', '01-26'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['ANZAC Day', '04-25'],
        ["Queen's Birthday", '06-08'],
        ['Labour Day', '10-05'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      DE: [
        ["New Year's Day", '01-01'],
        ['Good Friday', '04-03'],
        ['Easter Monday', '04-06'],
        ['Labour Day', '05-01'],
        ['Ascension Day', '05-14'],
        ['Whit Monday', '05-25'],
        ['German Unity Day', '10-03'],
        ['Christmas Day', '12-25'],
        ['Boxing Day', '12-26'],
      ],
      FR: [
        ["New Year's Day", '01-01'],
        ['Easter Monday', '04-06'],
        ['Labour Day', '05-01'],
        ['Victory in Europe Day', '05-08'],
        ['Ascension Day', '05-14'],
        ['Whit Monday', '05-25'],
        ['Bastille Day', '07-14'],
        ['Assumption of Mary', '08-15'],
        ["All Saints' Day", '11-01'],
        ['Armistice Day', '11-11'],
        ['Christmas Day', '12-25'],
      ],
      JP: [
        ["New Year's Day", '01-01'],
        ['Coming of Age Day', '01-12'],
        ['National Foundation Day', '02-11'],
        ['Vernal Equinox Day', '03-20'],
        ['Showa Day', '04-29'],
        ["Constitution Memorial Day", '05-03'],
        ['Greenery Day', '05-04'],
        ["Children's Day", '05-05'],
        ['Marine Day', '07-20'],
        ['Mountain Day', '08-11'],
        ['Respect for the Aged Day', '09-21'],
        ['Health and Sports Day', '10-12'],
        ['Culture Day', '11-03'],
        ['Labour Thanksgiving Day', '11-23'],
      ],
      SG: [
        ["New Year's Day", '01-01'],
        ['Chinese New Year', '01-29'],
        ['Chinese New Year (Day 2)', '01-30'],
        ['Good Friday', '04-03'],
        ['Labour Day', '05-01'],
        ['Vesak Day', '05-12'],
        ['Hari Raya Puasa', '06-03'],
        ['National Day', '08-09'],
        ['Hari Raya Haji', '08-11'],
        ['Deepavali', '10-22'],
        ['Christmas Day', '12-25'],
      ],
    };

    const targetList = nationalHolidays[countryCode.toUpperCase()] || [];
    return targetList.map(([name, mmdd]) => {
      const date = `${year}-${mmdd}`;
      const exists = this.holidays.some((h) => h.date === date && h.name === name);
      return { name, date, exists };
    });
  }

  public importSelectedHolidays(countryCode: string, selections: { name: string; date: string }[]): Holiday[] {
    const imported: Holiday[] = [];
    for (const sel of selections) {
      const exists = this.holidays.some(
        (h) => h.date === sel.date && h.name === sel.name
      );
      if (!exists) {
        const h: Holiday = {
          id: 'hol_' + Math.random().toString(36).substring(2, 9),
          name: sel.name,
          date: sel.date,
          end_date: null,
          country_code: countryCode.toUpperCase(),
          member_ids: [],
          recurrence: 'every_year',
          color: null,
          created_at: new Date().toISOString(),
        };
        this.holidays.push(h);
        imported.push(h);
      }
    }
    return imported;
  }

  // ─── Team Members ─────────────────────────────────────────────────────────

  public listMembers(): TeamMember[] {
    return [...this.members];
  }

  public addMember(name: string, email: string, avatarUrl?: string): TeamMember {
    if (this.members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`Member with email '${email}' already exists`);
    }
    const member: TeamMember = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      avatar_url: avatarUrl || null,
    };
    this.members.push(member);
    return member;
  }
}

// Singleton instance
export const timeOffService = new TimeOffService();
