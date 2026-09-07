import { invoke } from '@tauri-apps/api/core';
import { kioskService } from '../../backend/services/kioskService';
import type {
  KioskDeviceDTO,
  AttendanceRecordDTO,
  CreateKioskPayload,
  UpdateKioskPayload,
  PunchClockPayload,
  KioskSummaryDTO,
} from '../../backend/models/kioskTypes';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const kioskApi = {
  listKiosks: async (): Promise<KioskDeviceDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<KioskDeviceDTO[]>('list_kiosks');
      } catch (e) {
        console.warn('Tauri invoke list_kiosks failed, using fallback:', e);
      }
    }
    return kioskService.listKiosks();
  },

  getKiosk: async (id: string): Promise<KioskDeviceDTO> => {
    if (isTauri) {
      try {
        return await invoke<KioskDeviceDTO>('get_kiosk', { id });
      } catch (e) {
        console.warn('Tauri invoke get_kiosk failed, using fallback:', e);
      }
    }
    const k = kioskService.getKiosk(id);
    if (!k) throw new Error(`Kiosk '${id}' not found`);
    return k;
  },

  createKiosk: async (payload: CreateKioskPayload): Promise<KioskDeviceDTO> => {
    if (isTauri) {
      try {
        return await invoke<KioskDeviceDTO>('create_kiosk', { payload });
      } catch (e) {
        console.warn('Tauri invoke create_kiosk failed, using fallback:', e);
      }
    }
    return kioskService.createKiosk(payload);
  },

  updateKiosk: async (id: string, payload: UpdateKioskPayload): Promise<KioskDeviceDTO> => {
    if (isTauri) {
      try {
        return await invoke<KioskDeviceDTO>('update_kiosk', { id, payload });
      } catch (e) {
        console.warn('Tauri invoke update_kiosk failed, using fallback:', e);
      }
    }
    return kioskService.updateKiosk(id, payload);
  },

  deleteKiosk: async (id: string): Promise<boolean> => {
    if (isTauri) {
      try {
        return await invoke<boolean>('delete_kiosk', { id });
      } catch (e) {
        console.warn('Tauri invoke delete_kiosk failed, using fallback:', e);
      }
    }
    return kioskService.deleteKiosk(id);
  },

  verifyPin: async (kioskId: string, pin: string): Promise<{ valid: boolean; userName?: string }> => {
    if (isTauri) {
      try {
        const res = await invoke<{ valid: boolean; user_name?: string }>('verify_kiosk_pin', {
          kioskId,
          pin,
        });
        return { valid: res.valid, userName: res.user_name };
      } catch (e) {
        console.warn('Tauri invoke verify_kiosk_pin failed, using fallback:', e);
      }
    }
    return kioskService.verifyPin(kioskId, pin);
  },

  recordAttendance: async (payload: PunchClockPayload): Promise<AttendanceRecordDTO> => {
    if (isTauri) {
      try {
        return await invoke<AttendanceRecordDTO>('record_kiosk_attendance', { payload });
      } catch (e) {
        console.warn('Tauri invoke record_kiosk_attendance failed, using fallback:', e);
      }
    }
    return kioskService.recordAttendance(payload);
  },

  listAttendanceRecords: async (kioskId?: string): Promise<AttendanceRecordDTO[]> => {
    if (isTauri) {
      try {
        return await invoke<AttendanceRecordDTO[]>('list_kiosk_attendance_records', {
          kioskId: kioskId || null,
        });
      } catch (e) {
        console.warn('Tauri invoke list_kiosk_attendance_records failed, using fallback:', e);
      }
    }
    return kioskService.listAttendanceRecords(kioskId);
  },

  getSummary: async (): Promise<KioskSummaryDTO> => {
    if (isTauri) {
      try {
        return await invoke<KioskSummaryDTO>('get_kiosk_summary');
      } catch (e) {
        console.warn('Tauri invoke get_kiosk_summary failed, using fallback:', e);
      }
    }
    return kioskService.getSummary();
  },
};
