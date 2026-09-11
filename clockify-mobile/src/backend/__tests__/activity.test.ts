import test from "node:test";
import assert from "node:assert";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("API: Activity Settings defaults and updates", async () => {
  // Get initial settings
  const getRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/settings",
    query: {},
    body: null,
  });

  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(typeof getRes.data.is_monitoring_active, "boolean");
  assert.strictEqual(typeof getRes.data.is_screenshots_active, "boolean");
  assert.strictEqual(typeof getRes.data.is_gps_active, "boolean");

  // Update / Toggle settings
  const updateRes = await handleApiRoute({
    method: "POST",
    path: "/api/activity/settings",
    query: {},
    body: {
      is_monitoring_active: true,
      is_screenshots_active: true,
      is_gps_active: true,
      blur_privacy: true,
    },
  });

  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.is_monitoring_active, true);
  assert.strictEqual(updateRes.data.is_screenshots_active, true);
  assert.strictEqual(updateRes.data.is_gps_active, true);
  assert.strictEqual(updateRes.data.blur_privacy, true);
});

test("API: Activity Records listing, filtering, and summary", async () => {
  // List records
  const listRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/records",
    query: {},
    body: null,
  });

  assert.strictEqual(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data));
  assert.ok(listRes.data.length >= 6);

  // Filter by status TRACKING
  const filterRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/records",
    query: { status: "TRACKING" },
    body: null,
  });

  assert.strictEqual(filterRes.status, 200);
  assert.ok(filterRes.data.every((r: any) => r.status === "TRACKING"));

  // Summary
  const summaryRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/summary",
    query: {},
    body: null,
  });

  assert.strictEqual(summaryRes.status, 200);
  assert.ok(summaryRes.data.total_members_monitored >= 6);
  assert.ok(summaryRes.data.average_activity_percent > 0);
  assert.ok(summaryRes.data.active_tracking_count > 0);

  // Log new activity record
  const logRes = await handleApiRoute({
    method: "POST",
    path: "/api/activity/records",
    query: {},
    body: {
      member_id: "test-dev",
      member_name: "Test Developer",
      avatar: "TD",
      avatar_color: "#10b981",
      task: "Writing Automated Tests",
      project: "Mobile Core",
      project_color: "#10b981",
      activity_percent: 99,
      pulse_text: "99% active pulse",
      active_window: "VS Code (node --test)",
      score: "99% High",
      score_color: "text-[#10b981]",
      status: "TRACKING",
      status_color: "bg-[#ecfdf5] text-[#047857]",
    },
  });

  assert.strictEqual(logRes.status, 201);
  assert.strictEqual(logRes.data.member_name, "Test Developer");
  assert.ok(logRes.data.id);
});

test("API: Activity Screenshots capturing, listing, and deletion", async () => {
  // Capture new screenshot
  const captureRes = await handleApiRoute({
    method: "POST",
    path: "/api/activity/screenshots",
    query: {},
    body: {
      member_id: "bindhu-shree",
      member_name: "Bindhu shree",
      member_avatar: "BS",
      project: "Project Alpha",
      project_color: "#03a9f4",
      activity_percent: 96,
      app_name: "Clockify Mobile App",
      window_title: "Activity - Screenshots & GPS View",
      type: "code",
    },
  });

  assert.strictEqual(captureRes.status, 201);
  assert.ok(captureRes.data.id);
  const screenshotId = captureRes.data.id;

  // Get by ID
  const getRes = await handleApiRoute({
    method: "GET",
    path: `/api/activity/screenshots/${screenshotId}`,
    query: {},
    body: null,
  });

  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(getRes.data.id, screenshotId);

  // Delete
  const deleteRes = await handleApiRoute({
    method: "DELETE",
    path: `/api/activity/screenshots/${screenshotId}`,
    query: {},
    body: null,
  });

  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteRes.data.deleted, true);
});

test("API: Activity Locations GPS and Mobile Check-In", async () => {
  // Enable GPS first
  await handleApiRoute({
    method: "POST",
    path: "/api/activity/settings",
    query: {},
    body: { is_gps_active: true },
  });

  // List locations
  const listRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/locations",
    query: {},
    body: null,
  });

  assert.strictEqual(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data));
  assert.ok(listRes.data.length >= 6);
  // When GPS is active, last_seen should not be "-"
  const amy = listRes.data.find((m: any) => m.name.includes("Amy Smith"));
  assert.ok(amy);
  assert.notStrictEqual(amy.last_seen, "-");

  // Mobile GPS Check-In
  const checkInRes = await handleApiRoute({
    method: "POST",
    path: "/api/activity/locations/check-in",
    query: {},
    body: {
      member_id: "likith-dt",
      lat: 12.9915,
      lng: 77.7142,
      location_name: "Hoodi Metro Station, Bengaluru",
    },
  });

  assert.strictEqual(checkInRes.status, 200);
  assert.strictEqual(checkInRes.data.lat, 12.9915);
  assert.strictEqual(checkInRes.data.location_name, "Hoodi Metro Station, Bengaluru");
  assert.strictEqual(checkInRes.data.last_seen, "Just now");
});

test("API: Activity Geofencing Zones CRUD", async () => {
  // List geofences
  const listRes = await handleApiRoute({
    method: "GET",
    path: "/api/activity/geofences",
    query: {},
    body: null,
  });

  assert.strictEqual(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data));
  assert.ok(listRes.data.length >= 3);

  // Create geofence
  const createRes = await handleApiRoute({
    method: "POST",
    path: "/api/activity/geofences",
    query: {},
    body: {
      name: "Client Site - Outer Ring Rd",
      address: "Outer Ring Rd, Marathahalli, Bengaluru",
      lat: 12.955,
      lng: 77.698,
      radius_meters: 600,
      color: "#f59e0b",
    },
  });

  assert.strictEqual(createRes.status, 201);
  assert.ok(createRes.data.id);
  assert.strictEqual(createRes.data.name, "Client Site - Outer Ring Rd");
  const newZoneId = createRes.data.id;

  // Delete geofence
  const deleteRes = await handleApiRoute({
    method: "DELETE",
    path: `/api/activity/geofences/${newZoneId}`,
    query: {},
    body: null,
  });

  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteRes.data.deleted, true);
});
