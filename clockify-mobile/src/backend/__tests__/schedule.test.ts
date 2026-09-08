import test from "node:test";
import assert from "node:assert";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("API: Schedule initial assignments and summary", async () => {
  const listRes = await handleApiRoute({
    method: "GET",
    path: "/api/schedule/assignments",
    query: {},
    body: null,
  });

  assert.strictEqual(listRes.status, 200);
  assert.ok(Array.isArray(listRes.data));
  assert.ok(listRes.data.length >= 7);

  const summaryRes = await handleApiRoute({
    method: "GET",
    path: "/api/schedule/summary",
    query: {},
    body: null,
  });

  assert.strictEqual(summaryRes.status, 200);
  assert.ok(summaryRes.data.total_assignments >= 7);
  assert.ok(summaryRes.data.total_scheduled_hours > 0);
  assert.strictEqual(typeof summaryRes.data.is_published, "boolean");
});

test("API: Schedule toggle publish status", async () => {
  const toggleRes1 = await handleApiRoute({
    method: "POST",
    path: "/api/schedule/toggle-publish",
    query: {},
    body: null,
  });

  assert.strictEqual(toggleRes1.status, 200);
  assert.strictEqual(typeof toggleRes1.data.is_published, "boolean");

  const toggleRes2 = await handleApiRoute({
    method: "POST",
    path: "/api/schedule/toggle-publish",
    query: {},
    body: null,
  });

  assert.strictEqual(toggleRes2.status, 200);
  assert.strictEqual(toggleRes2.data.is_published, !toggleRes1.data.is_published);
});

test("API: Schedule CRUD assignment lifecycle", async () => {
  // Create
  const createPayload = {
    project_id: "proj-custom-test",
    project_name: "Mobile Test Sprint",
    project_color: "#03A9F4",
    client: "Acme Corp",
    member_id: "tm-test-user",
    member_name: "Test Engineer",
    member_initials: "TE",
    member_avatar_color: "#4CAF50",
    start_date: "2026-09-01",
    end_date: "2026-09-05",
    hours_per_day: 6,
    total_hours: 30,
    note: "Automated test assignment",
  };

  const createRes = await handleApiRoute({
    method: "POST",
    path: "/api/schedule/assignments",
    query: {},
    body: createPayload,
  });

  assert.strictEqual(createRes.status, 201);
  assert.ok(createRes.data.id);
  assert.strictEqual(createRes.data.project_name, "Mobile Test Sprint");
  const createdId = createRes.data.id;

  // Get by ID
  const getRes = await handleApiRoute({
    method: "GET",
    path: `/api/schedule/assignments/${createdId}`,
    query: {},
    body: null,
  });
  assert.strictEqual(getRes.status, 200);
  assert.strictEqual(getRes.data.id, createdId);

  // Update
  const updateRes = await handleApiRoute({
    method: "PUT",
    path: `/api/schedule/assignments/${createdId}`,
    query: {},
    body: { total_hours: 36, hours_per_day: 7 },
  });
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.total_hours, 36);

  // Delete
  const deleteRes = await handleApiRoute({
    method: "DELETE",
    path: `/api/schedule/assignments/${createdId}`,
    query: {},
    body: null,
  });
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteRes.data.deleted, true);

  // Verify deleted
  const getDeletedRes = await handleApiRoute({
    method: "GET",
    path: `/api/schedule/assignments/${createdId}`,
    query: {},
    body: null,
  });
  assert.strictEqual(getDeletedRes.status, 404);
});

test("API: Schedule remove and restore sample data", async () => {
  // Remove sample data
  const removeRes = await handleApiRoute({
    method: "POST",
    path: "/api/schedule/remove-sample",
    query: {},
    body: null,
  });
  assert.strictEqual(removeRes.status, 200);

  const listAfterRemove = await handleApiRoute({
    method: "GET",
    path: "/api/schedule/assignments",
    query: {},
    body: null,
  });
  const hasSample = listAfterRemove.data.some((a: any) => a.project_name.includes("[SAMPLE]"));
  assert.strictEqual(hasSample, false);

  // Restore sample data
  const restoreRes = await handleApiRoute({
    method: "POST",
    path: "/api/schedule/restore-sample",
    query: {},
    body: null,
  });
  assert.strictEqual(restoreRes.status, 200);
  assert.ok(restoreRes.data.length >= 7);
  const sampleRestored = restoreRes.data.some((a: any) => a.project_name.includes("[SAMPLE]"));
  assert.strictEqual(sampleRestored, true);
});
