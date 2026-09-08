/**
 * Clockify Kiosk Feature - Domain Models & DTOs
 */

export type KioskStatus = 'ONLINE' | 'OFFLINE';
export type AttendanceAction = 'CLOCK_IN' | 'START_BREAK' | 'END_BREAK' | 'CLOCK_OUT';

export interface KioskDeviceDTO {
  id: string;
  name: string;
  assignees: string[];
  default_project: string;
  default_break_project: string;
  logout_after_hours: number;
  auth_required: boolean;
  location: string;
  device_ip: string;
  today_check_ins: number;
  status: KioskStatus;
  pin_code?: string;
  created_at: string;
}

export interface AttendanceRecordDTO {
  id: string;
  kiosk_id: string;
  kiosk_name: string;
  user_id?: string;
  user_name: string;
  action: AttendanceAction;
  timestamp: string;
  note?: string;
}

export interface CreateKioskPayload {
  name: string;
  assignees?: string[];
  default_project?: string;
  default_break_project?: string;
  logout_after_hours?: number;
  auth_required?: boolean;
  location?: string;
  pin_code?: string;
}

export interface UpdateKioskPayload {
  name?: string;
  assignees?: string[];
  default_project?: string;
  default_break_project?: string;
  logout_after_hours?: number;
  auth_required?: boolean;
  location?: string;
  status?: KioskStatus;
  pin_code?: string;
}

export interface PunchClockPayload {
  kiosk_id: string;
  user_name: string;
  user_id?: string;
  action: AttendanceAction;
  pin_code?: string;
  note?: string;
}

export interface KioskSummaryDTO {
  total_kiosks: number;
  online_kiosks: number;
  today_check_ins: number;
  total_attendance_records: number;
}
