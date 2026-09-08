import { kioskService } from '../services/kioskService';
import type {
  CreateKioskPayload,
  UpdateKioskPayload,
  PunchClockPayload,
} from '../models/kioskTypes';

export class KioskController {
  static listKiosks() {
    try {
      const list = kioskService.listKiosks();
      return { success: true, data: list };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getKiosk(id: string) {
    try {
      const kiosk = kioskService.getKiosk(id);
      if (!kiosk) return { success: false, error: `Kiosk '${id}' not found` };
      return { success: true, data: kiosk };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static createKiosk(payload: CreateKioskPayload) {
    try {
      if (!payload.name || !payload.name.trim()) {
        return { success: false, error: 'Kiosk name is required' };
      }
      const created = kioskService.createKiosk(payload);
      return { success: true, data: created };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static updateKiosk(id: string, payload: UpdateKioskPayload) {
    try {
      const updated = kioskService.updateKiosk(id, payload);
      return { success: true, data: updated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static deleteKiosk(id: string) {
    try {
      const deleted = kioskService.deleteKiosk(id);
      return { success: true, data: { deleted } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static verifyPin(kioskId: string, pin: string) {
    try {
      const res = kioskService.verifyPin(kioskId, pin);
      return { success: true, data: res };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static recordAttendance(payload: PunchClockPayload) {
    try {
      if (!payload.kiosk_id || !payload.user_name || !payload.action) {
        return { success: false, error: 'Kiosk ID, user name, and action are required' };
      }
      const record = kioskService.recordAttendance(payload);
      return { success: true, data: record };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static listAttendanceRecords(kioskId?: string) {
    try {
      const records = kioskService.listAttendanceRecords(kioskId);
      return { success: true, data: records };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getSummary() {
    try {
      const summary = kioskService.getSummary();
      return { success: true, data: summary };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
