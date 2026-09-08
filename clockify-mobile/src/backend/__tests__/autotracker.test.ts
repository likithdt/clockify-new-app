import assert from "node:assert";
import test from "node:test";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("API: Auto Tracker initial activities and status", async () => {
  // Reset autotracker
  const resetRes = await handleApiRoute({ method: "POST", path: "/api/autotracker/reset", query: {}, body: {} });
  assert.strictEqual(resetRes.status, 200);

  // 1. Get activities
  const actRes = await handleApiRoute({ method: "GET", path: "/api/autotracker/activities", query: {}, body: {} });
  assert.strictEqual(actRes.status, 200);
  assert.strictEqual(actRes.data.length, 4);

  // Check initial 4 activities matching reference screenshot
  const vsCode = actRes.data.find((a: any) => a.app === "VS Code");
  assert.ok(vsCode);
  assert.strictEqual(vsCode.windowTitle, "timeflow-design-system — App.tsx");
  assert.strictEqual(vsCode.suggestedProject, "Project Alpha");
  assert.strictEqual(vsCode.durationMinutes, 135);
  assert.strictEqual(vsCode.isLogged, false);

  const figma = actRes.data.find((a: any) => a.app === "Figma");
  assert.ok(figma);
  assert.strictEqual(figma.windowTitle, "Clockify Light Design Rebuild");
  assert.strictEqual(figma.suggestedProject, "Project Alpha");
  assert.strictEqual(figma.durationMinutes, 90);

  const chrome = actRes.data.find((a: any) => a.app === "Google Chrome");
  assert.ok(chrome);
  assert.strictEqual(chrome.suggestedProject, "[SAMPLE] Internal Work");
  assert.strictEqual(chrome.durationMinutes, 30);

  const terminal = actRes.data.find((a: any) => a.app === "Terminal");
  assert.ok(terminal);
  assert.strictEqual(terminal.suggestedProject, "[SAMPLE] Project Orion");
  assert.strictEqual(terminal.durationMinutes, 45);

  // 2. Status
  const statusRes = await handleApiRoute({ method: "GET", path: "/api/autotracker/status", query: {}, body: {} });
  assert.strictEqual(statusRes.status, 200);
  assert.strictEqual(statusRes.data.isRecording, true);
  assert.strictEqual(statusRes.data.unloggedCount, 4);
  assert.strictEqual(statusRes.data.unloggedMinutes, 300); // 135 + 90 + 30 + 45 = 300
});

test("API: Auto Tracker toggle recording", async () => {
  const toggle1 = await handleApiRoute({ method: "POST", path: "/api/autotracker/toggle", query: {}, body: {} });
  assert.strictEqual(toggle1.status, 200);
  assert.strictEqual(toggle1.data.isRecording, false);

  const toggle2 = await handleApiRoute({ method: "POST", path: "/api/autotracker/toggle", query: {}, body: {} });
  assert.strictEqual(toggle2.status, 200);
  assert.strictEqual(toggle2.data.isRecording, true);
});

test("API: Auto Tracker update project and log activity as time entry", async () => {
  // Update project for act-1
  const updateRes = await handleApiRoute({
    method: "PATCH",
    path: "/api/autotracker/activity/act-1/project",
    query: {},
    body: {
      projectName: "Updated Alpha",
      projectColor: "#00bcd4",
      projectId: "proj-1",
    },
  });
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.suggestedProject, "Updated Alpha");
  assert.strictEqual(updateRes.data.projectColor, "#00bcd4");

  // Log act-1
  const logRes = await handleApiRoute({
    method: "POST",
    path: "/api/autotracker/log",
    query: {},
    body: { id: "act-1" },
  });
  assert.strictEqual(logRes.status, 200);
  assert.ok(logRes.data.activity);
  assert.strictEqual(logRes.data.activity.isLogged, true);
  assert.ok(logRes.data.timeEntry);
  assert.ok(logRes.data.timeEntry.id);
  assert.strictEqual(logRes.data.timeEntry.projectName, "Updated Alpha");
  assert.strictEqual(logRes.data.timeEntry.durationSeconds, 135 * 60);

  // Verify time entry is in time entries list
  const entriesRes = await handleApiRoute({ method: "GET", path: "/api/time-entries", query: { grouped: "false" }, body: {} });
  assert.strictEqual(entriesRes.status, 200);
  const found = entriesRes.data.find((e: any) => e.id === logRes.data.timeEntry.id);
  assert.ok(found);
});

test("API: Auto Tracker accept all suggestions and simulate activity", async () => {
  // Log all remaining
  const logAllRes = await handleApiRoute({ method: "POST", path: "/api/autotracker/log-all", query: {}, body: {} });
  assert.strictEqual(logAllRes.status, 200);
  assert.ok(logAllRes.data.createdEntriesCount >= 1);

  // Status unlogged count should now be 0
  const statusRes = await handleApiRoute({ method: "GET", path: "/api/autotracker/status", query: {}, body: {} });
  assert.strictEqual(statusRes.status, 200);
  assert.strictEqual(statusRes.data.unloggedCount, 0);

  // Simulate new background activity
  const simRes = await handleApiRoute({ method: "POST", path: "/api/autotracker/simulate", query: {}, body: {} });
  assert.strictEqual(simRes.status, 201);
  assert.ok(simRes.data.id);
  assert.strictEqual(simRes.data.isLogged, false);

  // Unlogged count should now be 1
  const statusRes2 = await handleApiRoute({ method: "GET", path: "/api/autotracker/status", query: {}, body: {} });
  assert.strictEqual(statusRes2.data.unloggedCount, 1);

  // Discard simulated activity
  const delRes = await handleApiRoute({
    method: "DELETE",
    path: `/api/autotracker/activity/${simRes.data.id}`,
    query: {},
    body: {},
  });
  assert.strictEqual(delRes.status, 200);
});
