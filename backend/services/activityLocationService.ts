import seedData from '../data/seedData.json';
import type {
  ActivityRecord,
  ActivityFilter,
  ActivitySummaryDTO,
  ScreenshotItemDTO,
  CreateScreenshotPayload,
  MemberLocationDTO,
  UpdateMemberLocationPayload,
  GeofenceZoneDTO,
  CreateGeofencePayload,
  ActivitySettingsDTO,
} from '../models/activityLocationTypes';

class ActivityLocationService {
  private activityRecords: ActivityRecord[] = [];
  private screenshots: ScreenshotItemDTO[] = [];
  private memberLocations: MemberLocationDTO[] = [];
  private geofences: GeofenceZoneDTO[] = [];
  private settings!: ActivitySettingsDTO;

  constructor() {
    this.loadSeedData();
  }

  private loadSeedData() {
    const raw = seedData as any;
    this.activityRecords = JSON.parse(JSON.stringify(raw.activity_records || []));
    this.screenshots = JSON.parse(JSON.stringify(raw.screenshots || []));
    this.memberLocations = JSON.parse(JSON.stringify(raw.member_locations || []));
    this.geofences = JSON.parse(JSON.stringify(raw.geofence_zones || []));
    this.settings = JSON.parse(
      JSON.stringify(
        raw.activity_settings || {
          is_monitoring_active: true,
          is_screenshots_active: true,
          is_gps_active: true,
          blur_privacy: false,
          screenshot_frequency_minutes: 5,
        }
      )
    );
  }

  // ─── Activity Monitoring Methods ──────────────────────────────────────────

  public listActivityRecords(filter?: ActivityFilter): ActivityRecord[] {
    return this.activityRecords.filter((rec) => {
      if (filter?.member_id && rec.member_id !== filter.member_id) return false;
      if (filter?.project && !rec.project.toLowerCase().includes(filter.project.toLowerCase()))
        return false;
      if (filter?.status && rec.status !== filter.status) return false;
      if (filter?.min_activity !== undefined && rec.activity_percent < filter.min_activity)
        return false;
      return true;
    });
  }

  public getActivityRecord(id: string): ActivityRecord | null {
    const found = this.activityRecords.find((r) => r.id === id || r.member_id === id);
    return found ? { ...found } : null;
  }

  public logActivityRecord(
    payload: Omit<ActivityRecord, 'id' | 'recorded_at'> & { id?: string }
  ): ActivityRecord {
    const newRecord: ActivityRecord = {
      ...payload,
      id: payload.id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recorded_at: new Date().toISOString(),
    };

    const existingIdx = this.activityRecords.findIndex((r) => r.member_id === payload.member_id);
    if (existingIdx >= 0) {
      this.activityRecords[existingIdx] = newRecord;
    } else {
      this.activityRecords.unshift(newRecord);
    }

    return { ...newRecord };
  }

  public getActivitySummary(): ActivitySummaryDTO {
    const totalMembers = this.activityRecords.length;
    const activeCount = this.activityRecords.filter((r) => r.status === 'TRACKING').length;
    const idleCount = this.activityRecords.filter((r) => r.status === 'IDLE').length;
    const avgActivity =
      totalMembers > 0
        ? Math.round(
            this.activityRecords.reduce((acc, r) => acc + r.activity_percent, 0) / totalMembers
          )
        : 0;

    const insideGeofenceCount = this.memberLocations.filter(
      (m) => m.status === 'Inside Geofence'
    ).length;
    const geofencePercent =
      this.memberLocations.length > 0
        ? Math.round((insideGeofenceCount / this.memberLocations.length) * 100)
        : 100;

    return {
      total_members_monitored: totalMembers,
      active_tracking_count: activeCount,
      idle_count: idleCount,
      average_activity_percent: avgActivity,
      total_screenshots_captured: this.screenshots.length,
      geofence_compliant_percent: geofencePercent,
    };
  }

  // ─── Screenshot Methods ───────────────────────────────────────────────────

  public listScreenshots(memberId?: string, date?: string): ScreenshotItemDTO[] {
    return this.screenshots.filter((s) => {
      if (memberId && memberId !== 'all' && s.member_id !== memberId) return false;
      if (date && date !== 'Today' && !s.timestamp.startsWith(date)) return false;
      return true;
    });
  }

  public getScreenshot(id: string): ScreenshotItemDTO | null {
    const found = this.screenshots.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public captureScreenshot(payload: CreateScreenshotPayload): ScreenshotItemDTO {
    const now = new Date();
    const timeFormatted =
      payload.time_formatted ||
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newScreenshot: ScreenshotItemDTO = {
      id: `sc-${Date.now()}`,
      member_id: payload.member_id,
      member_name: payload.member_name,
      member_avatar: payload.member_avatar || payload.member_name.slice(0, 2).toUpperCase(),
      timestamp: now.toISOString(),
      time_formatted: timeFormatted,
      project: payload.project,
      project_color: payload.project_color || '#03a9f4',
      activity_percent: payload.activity_percent,
      app_name: payload.app_name,
      window_title: payload.window_title,
      code_snippet: payload.code_snippet,
      type: payload.type || 'code',
    };

    this.screenshots.unshift(newScreenshot);
    return { ...newScreenshot };
  }

  public deleteScreenshot(id: string): void {
    const idx = this.screenshots.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Screenshot with ID '${id}' not found`);
    }
    this.screenshots.splice(idx, 1);
  }

  // ─── Location & GPS Methods ───────────────────────────────────────────────

  public listMemberLocations(): MemberLocationDTO[] {
    return [...this.memberLocations];
  }

  public getMemberLocation(id: string): MemberLocationDTO | null {
    const found = this.memberLocations.find((m) => m.id === id);
    return found ? { ...found } : null;
  }

  public updateMemberLocation(
    id: string,
    payload: UpdateMemberLocationPayload
  ): MemberLocationDTO {
    const idx = this.memberLocations.findIndex((m) => m.id === id);
    if (idx === -1) {
      throw new Error(`Member with ID '${id}' not found in location directory`);
    }

    const current = this.memberLocations[idx];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedBreadcrumbs = [...current.breadcrumbs];
    if (
      updatedBreadcrumbs.length === 0 ||
      Math.abs(updatedBreadcrumbs[updatedBreadcrumbs.length - 1].lat - payload.lat) > 0.0001 ||
      Math.abs(updatedBreadcrumbs[updatedBreadcrumbs.length - 1].lng - payload.lng) > 0.0001
    ) {
      updatedBreadcrumbs.push({
        lat: payload.lat,
        lng: payload.lng,
        time: nowTime,
      });
    }

    const updated: MemberLocationDTO = {
      ...current,
      lat: payload.lat,
      lng: payload.lng,
      location_name: payload.location_name || current.location_name,
      last_seen: 'Just now',
      speed: payload.speed !== undefined ? payload.speed : current.speed,
      battery: payload.battery !== undefined ? payload.battery : current.battery,
      status: payload.status !== undefined ? payload.status : current.status,
      status_color: payload.status_color !== undefined ? payload.status_color : current.status_color,
      breadcrumbs: updatedBreadcrumbs,
    };

    this.memberLocations[idx] = updated;
    return { ...updated };
  }

  // ─── Geofencing Methods ───────────────────────────────────────────────────

  public listGeofences(): GeofenceZoneDTO[] {
    return [...this.geofences];
  }

  public createGeofence(payload: CreateGeofencePayload): GeofenceZoneDTO {
    const newZone: GeofenceZoneDTO = {
      id: `geo-${Date.now()}`,
      name: payload.name.trim(),
      address: payload.address.trim(),
      lat: payload.lat,
      lng: payload.lng,
      radius_meters: payload.radius_meters,
      color: payload.color || '#03a9f4',
    };

    this.geofences.push(newZone);
    return { ...newZone };
  }

  public deleteGeofence(id: string): void {
    const idx = this.geofences.findIndex((g) => g.id === id);
    if (idx === -1) {
      throw new Error(`Geofence with ID '${id}' not found`);
    }
    this.geofences.splice(idx, 1);
  }

  // ─── Settings Methods ─────────────────────────────────────────────────────

  public getSettings(): ActivitySettingsDTO {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<ActivitySettingsDTO>): ActivitySettingsDTO {
    this.settings = { ...this.settings, ...partial };
    return { ...this.settings };
  }

  public resetSampleData(): void {
    this.loadSeedData();
  }
}

export const activityLocationService = new ActivityLocationService();
