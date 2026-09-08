import assert from "node:assert";
import test from "node:test";
import { handleApiRoute } from "../routes/apiRouter.ts";

test("API: Timer lifecycle and entry creation", async () => {
  // Clear any data
  await handleApiRoute({ method: "POST", path: "/api/clear-data", query: {}, body: {} });

  // 1. Initial status should be idle
  let statusRes = await handleApiRoute({ method: "GET", path: "/api/timer/status", query: {}, body: {} });
  assert.strictEqual(statusRes.status, 200);
  assert.strictEqual(statusRes.data.isTracking, false);

  // 2. Start timer
  const startRes = await handleApiRoute({
    method: "POST",
    path: "/api/timer/start",
    query: {},
    body: {
      description: "Testing mobile timer",
      projectName: "[SAMPLE] Project Alpha",
      projectColor: "#ff9800",
      isBillable: true,
      tags: ["Development"],
    },
  });
  assert.strictEqual(startRes.status, 200);
  assert.strictEqual(startRes.data.isTracking, true);
  assert.strictEqual(startRes.data.description, "Testing mobile timer");

  // 3. Stop timer
  const stopRes = await handleApiRoute({ method: "POST", path: "/api/timer/stop", query: {}, body: {} });
  assert.strictEqual(stopRes.status, 200);
  assert.ok(stopRes.data.id);
  assert.strictEqual(stopRes.data.description, "Testing mobile timer");
  const createdEntryId = stopRes.data.id;

  // 4. Verify entry in list
  const listRes = await handleApiRoute({ method: "GET", path: "/api/time-entries", query: { grouped: "true" }, body: {} });
  assert.strictEqual(listRes.status, 200);
  assert.ok(listRes.data.length > 0);
  assert.strictEqual(listRes.data[0].entries[0].id, createdEntryId);

  // 5. Update entry
  const updateRes = await handleApiRoute({
    method: "PUT",
    path: `/api/time-entries/${createdEntryId}`,
    query: {},
    body: {
      description: "Updated description",
      isBillable: false,
    },
  });
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.description, "Updated description");
  assert.strictEqual(updateRes.data.isBillable, false);

  // 6. Delete entry
  const delRes = await handleApiRoute({
    method: "DELETE",
    path: `/api/time-entries/${createdEntryId}`,
    query: {},
    body: {},
  });
  assert.strictEqual(delRes.status, 200);
  assert.strictEqual(delRes.data.success, true);

  // 7. Verify empty list
  const emptyRes = await handleApiRoute({ method: "GET", path: "/api/time-entries", query: { grouped: "true" }, body: {} });
  assert.strictEqual(emptyRes.status, 200);
  assert.strictEqual(emptyRes.data.length, 0);

  // 8. Projects and tags
  const projRes = await handleApiRoute({ method: "GET", path: "/api/projects", query: {}, body: {} });
  assert.strictEqual(projRes.status, 200);
  assert.ok(projRes.data.length >= 4);

  const tagRes = await handleApiRoute({ method: "GET", path: "/api/tags", query: {}, body: {} });
  assert.strictEqual(tagRes.status, 200);
  assert.ok(tagRes.data.length >= 5);

  // 9. Clients
  const clientRes = await handleApiRoute({ method: "GET", path: "/api/clients", query: {}, body: {} });
  assert.strictEqual(clientRes.status, 200);
  assert.ok(clientRes.data.length >= 2);

  // 10. Team
  const teamRes = await handleApiRoute({ method: "GET", path: "/api/team", query: {}, body: {} });
  assert.strictEqual(teamRes.status, 200);
  assert.ok(teamRes.data.length >= 5);

  // 11. Expenses
  const expRes = await handleApiRoute({
    method: "POST",
    path: "/api/expenses",
    query: {},
    body: { amount: 50, currency: "USD", category: "Software" },
  });
  assert.strictEqual(expRes.status, 201);
  const expListRes = await handleApiRoute({ method: "GET", path: "/api/expenses", query: {}, body: {} });
  assert.strictEqual(expListRes.status, 200);
  assert.strictEqual(expListRes.data.length, 1);

  // 12. Time Off
  const toRes = await handleApiRoute({ method: "GET", path: "/api/time-off", query: {}, body: {} });
  assert.strictEqual(toRes.status, 200);
  assert.ok(toRes.data.length >= 3);

  // 13. Project & Task editing
  const internalProj = projRes.data.find((p: any) => p.name === "[SAMPLE] Internal Project");
  assert.ok(internalProj);
  assert.strictEqual(internalProj.tasks[0].name, "Administration");
  assert.strictEqual(internalProj.tasks[1].name, "Education");
  assert.strictEqual(internalProj.tasks[2].name, "Workshops");

  // Update task
  const updateTaskRes = await handleApiRoute({
    method: "PUT",
    path: `/api/projects/${internalProj.id}/tasks/${internalProj.tasks[0].id}`,
    query: {},
    body: { name: "Administration & Operations", isBillable: false, isDone: true },
  });
  assert.strictEqual(updateTaskRes.status, 200);
  assert.strictEqual(updateTaskRes.data.name, "Administration & Operations");
  assert.strictEqual(updateTaskRes.data.isDone, true);
});

