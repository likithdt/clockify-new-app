import type {
  KioskDeviceDTO,
  AttendanceRecordDTO,
  CreateKioskPayload,
  UpdateKioskPayload,
  PunchClockPayload,
  KioskSummaryDTO,
} from '../models/kioskTypes';

const INITIAL_KIOSKS: KioskDeviceDTO[] = [
  {
    id: "kiosk-sample-1",
    name: "Headquarters Reception Terminal",
    assignees: ["All Members"],
    default_project: "Internal Work",
    default_break_project: "Lunch & Break",
    logout_after_hours: 24,
    auth_required: true,
    location: "Main Lobby, Floor 1",
    device_ip: "192.168.1.101",
    today_check_ins: 14,
    status: "ONLINE",
    pin_code: "1234",
    created_at: "2026-01-15T08:00:00.000Z",
  },
  {
    id: "kiosk-sample-2",
    name: "Engineering Lab Kiosk",
    assignees: ["Amy Smith", "James Anderson", "Bindhu shree", "Mike Johnson"],
    default_project: "Project Alpha",
    default_break_project: "Technical Break",
    logout_after_hours: 12,
    auth_required: true,
    location: "R&D Wing, Room 302",
    device_ip: "192.168.1.145",
    today_check_ins: 8,
    status: "ONLINE",
    pin_code: "5678",
    created_at: "2026-02-01T09:30:00.000Z",
  },
];

const INITIAL_RECORDS: AttendanceRecordDTO[] = [
  {
    id: "att-1",
    kiosk_id: "kiosk-sample-1",
    kiosk_name: "Headquarters Reception Terminal",
    user_name: "Bindhu shree",
    action: "CLOCK_IN",
    timestamp: "2026-09-04T09:02:14.000Z",
    note: "Normal shift arrival",
  },
  {
    id: "att-2",
    kiosk_id: "kiosk-sample-1",
    kiosk_name: "Headquarters Reception Terminal",
    user_name: "Amy Smith",
    action: "CLOCK_IN",
    timestamp: "2026-09-04T09:15:00.000Z",
  },
  {
    id: "att-3",
    kiosk_id: "kiosk-sample-2",
    kiosk_name: "Engineering Lab Kiosk",
    user_name: "James Anderson",
    action: "CLOCK_IN",
    timestamp: "2026-09-04T09:30:45.000Z",
  },
];

class KioskService {
  private kiosks: KioskDeviceDTO[] = JSON.parse(JSON.stringify(INITIAL_KIOSKS));
  private records: AttendanceRecordDTO[] = JSON.parse(JSON.stringify(INITIAL_RECORDS));

  listKiosks(): KioskDeviceDTO[] {
    return [...this.kiosks];
  }

  getKiosk(id: string): KioskDeviceDTO | undefined {
    return this.kiosks.find((k) => k.id === id);
  }

  createKiosk(payload: CreateKioskPayload): KioskDeviceDTO {
    const newKiosk: KioskDeviceDTO = {
      id: `kiosk-${Date.now()}`,
      name: payload.name.trim(),
      assignees: payload.assignees && payload.assignees.length > 0 ? payload.assignees : ["All Members"],
      default_project: payload.default_project || "Internal Work",
      default_break_project: payload.default_break_project || "Break",
      logout_after_hours: payload.logout_after_hours || 24,
      auth_required: payload.auth_required ?? true,
      location: payload.location || "Office Entrance",
      device_ip: `192.168.1.${Math.floor(Math.random() * 150 + 100)}`,
      today_check_ins: 0,
      status: "ONLINE",
      pin_code: payload.pin_code || "1234",
      created_at: new Date().toISOString(),
    };

    this.kiosks.unshift(newKiosk);
    return newKiosk;
  }

  updateKiosk(id: string, payload: UpdateKioskPayload): KioskDeviceDTO {
    const idx = this.kiosks.findIndex((k) => k.id === id);
    if (idx === -1) throw new Error(`Kiosk '${id}' not found`);

    const current = this.kiosks[idx];
    const updated: KioskDeviceDTO = {
      ...current,
      name: payload.name !== undefined ? payload.name.trim() : current.name,
      assignees: payload.assignees !== undefined ? payload.assignees : current.assignees,
      default_project: payload.default_project !== undefined ? payload.default_project : current.default_project,
      default_break_project: payload.default_break_project !== undefined ? payload.default_break_project : current.default_break_project,
      logout_after_hours: payload.logout_after_hours !== undefined ? payload.logout_after_hours : current.logout_after_hours,
      auth_required: payload.auth_required !== undefined ? payload.auth_required : current.auth_required,
      location: payload.location !== undefined ? payload.location : current.location,
      status: payload.status !== undefined ? payload.status : current.status,
      pin_code: payload.pin_code !== undefined ? payload.pin_code : current.pin_code,
    };

    this.kiosks[idx] = updated;
    return updated;
  }

  deleteKiosk(id: string): boolean {
    const prevLen = this.kiosks.length;
    this.kiosks = this.kiosks.filter((k) => k.id !== id);
    return this.kiosks.length < prevLen;
  }

  verifyPin(kioskId: string, pin: string): { valid: boolean; userName?: string } {
    const kiosk = this.getKiosk(kioskId);
    if (!kiosk) throw new Error(`Kiosk '${kioskId}' not found`);

    // In Clockify, standard quick pins map to staff or the kiosk admin pin
    const pinMap: { [key: string]: string } = {
      "1234": "Bindhu shree",
      "5678": "Amy Smith",
      "9999": "James Anderson",
      "0000": "Lara Peterson",
    };

    if (kiosk.pin_code && kiosk.pin_code === pin) {
      return { valid: true, userName: "Authorized Member" };
    }

    if (pinMap[pin]) {
      return { valid: true, userName: pinMap[pin] };
    }

    return { valid: false };
  }

  recordAttendance(payload: PunchClockPayload): AttendanceRecordDTO {
    const kiosk = this.getKiosk(payload.kiosk_id);
    const kioskName = kiosk ? kiosk.name : "Kiosk Terminal";

    const record: AttendanceRecordDTO = {
      id: `att-${Date.now()}`,
      kiosk_id: payload.kiosk_id,
      kiosk_name: kioskName,
      user_id: payload.user_id,
      user_name: payload.user_name,
      action: payload.action,
      timestamp: new Date().toISOString(),
      note: payload.note,
    };

    this.records.unshift(record);

    if (kiosk) {
      kiosk.today_check_ins += 1;
    }

    return record;
  }

  listAttendanceRecords(kioskId?: string): AttendanceRecordDTO[] {
    if (kioskId) {
      return this.records.filter((r) => r.kiosk_id === kioskId);
    }
    return [...this.records];
  }

  getSummary(): KioskSummaryDTO {
    const total_kiosks = this.kiosks.length;
    const online_kiosks = this.kiosks.filter((k) => k.status === "ONLINE").length;
    const today_check_ins = this.kiosks.reduce((sum, k) => sum + k.today_check_ins, 0);

    return {
      total_kiosks,
      online_kiosks,
      today_check_ins,
      total_attendance_records: this.records.length,
    };
  }
}

export const kioskService = new KioskService();
