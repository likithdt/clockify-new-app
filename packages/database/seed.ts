import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/clockify";

export async function seed() {
  console.log("🌱 Starting database seed...");
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    // --------------------------------------------------------------------------
    // 1. Clean slate / Idempotent Reset
    // --------------------------------------------------------------------------
    console.log("🧹 Cleaning existing demo records...");
    await db.delete(schema.timeEntryTags);
    await db.delete(schema.timeEntries);
    await db.delete(schema.tasks);
    await db.delete(schema.tags);
    await db.delete(schema.projects);
    await db.delete(schema.clients);
    await db.delete(schema.workspaceMembers);
    await db.delete(schema.workspaces);
    await db.delete(schema.users);

    // --------------------------------------------------------------------------
    // 2. Workspace Creation
    // --------------------------------------------------------------------------
    console.log("🏢 Creating workspace...");
    const [workspace] = await db
      .insert(schema.workspaces)
      .values({
        name: "Acme Enterprises",
        slug: "acme-enterprises",
        currency: "USD",
        defaultHourlyRate: "75.00",
      })
      .returning();

    console.log(`   ✓ Workspace: ${workspace.name} (${workspace.id})`);

    // --------------------------------------------------------------------------
    // 3. Users Creation
    // --------------------------------------------------------------------------
    console.log("👤 Creating users...");
    const [likith, sarah] = await db
      .insert(schema.users)
      .values([
        {
          email: "likith@clockify.local",
          fullName: "Likith D T",
          passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", // Mock bcrypt hash
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Likith",
          timezone: "Asia/Kolkata",
        },
        {
          email: "sarah.connor@clockify.local",
          fullName: "Sarah Connor",
          passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          timezone: "America/New_York",
        },
      ])
      .returning();

    console.log(`   ✓ User 1: ${likith.fullName} (${likith.email})`);
    console.log(`   ✓ User 2: ${sarah.fullName} (${sarah.email})`);

    // --------------------------------------------------------------------------
    // 4. Workspace Memberships (RBAC)
    // --------------------------------------------------------------------------
    console.log("👥 Assigning workspace roles...");
    await db.insert(schema.workspaceMembers).values([
      {
        workspaceId: workspace.id,
        userId: likith.id,
        role: "OWNER",
        customHourlyRate: "120.00",
      },
      {
        workspaceId: workspace.id,
        userId: sarah.id,
        role: "PROJECT_MANAGER",
        customHourlyRate: "90.00",
      },
    ]);

    // --------------------------------------------------------------------------
    // 5. Clients
    // --------------------------------------------------------------------------
    console.log("🏛️ Creating clients...");
    const [starkIndustries, wayneEnterprises] = await db
      .insert(schema.clients)
      .values([
        {
          workspaceId: workspace.id,
          name: "Stark Industries",
          address: "10880 Wilshire Blvd, Los Angeles, CA 90024",
        },
        {
          workspaceId: workspace.id,
          name: "Wayne Enterprises",
          address: "1007 Mountain Drive, Gotham City, NJ 07001",
        },
      ])
      .returning();

    // --------------------------------------------------------------------------
    // 6. Projects with Brand Colors
    // --------------------------------------------------------------------------
    console.log("📁 Creating projects...");
    const [projectArc, projectBatmobile, projectInternal] = await db
      .insert(schema.projects)
      .values([
        {
          workspaceId: workspace.id,
          clientId: starkIndustries.id,
          name: "Arc Reactor Optimization",
          colorHex: "#03a9f4", // Blue
          isBillableDefault: true,
          hourlyRate: "150.00",
        },
        {
          workspaceId: workspace.id,
          clientId: wayneEnterprises.id,
          name: "Batmobile Telemetry Subsystem",
          colorHex: "#8bc34a", // Green
          isBillableDefault: true,
          hourlyRate: "110.00",
        },
        {
          workspaceId: workspace.id,
          clientId: null,
          name: "Internal R&D & Operations",
          colorHex: "#ff9800", // Orange
          isBillableDefault: false,
          hourlyRate: "0.00",
        },
      ])
      .returning();

    // --------------------------------------------------------------------------
    // 7. Tasks
    // --------------------------------------------------------------------------
    console.log("📝 Creating tasks...");
    const [taskFirmware, taskSensors, taskSync] = await db
      .insert(schema.tasks)
      .values([
        {
          projectId: projectArc.id,
          name: "Plasma Confinement Testing",
          status: "ACTIVE",
          hourlyRate: "160.00",
        },
        {
          projectId: projectBatmobile.id,
          name: "GPS & Inertial Sensor Calibration",
          status: "ACTIVE",
          hourlyRate: "110.00",
        },
        {
          projectId: projectInternal.id,
          name: "Weekly Architecture Sync",
          status: "ACTIVE",
          hourlyRate: "0.00",
        },
      ])
      .returning();

    // --------------------------------------------------------------------------
    // 8. Tags
    // --------------------------------------------------------------------------
    console.log("🏷️ Creating tags...");
    const [tagDev, tagTesting, tagUrgent, tagMeeting] = await db
      .insert(schema.tags)
      .values([
        { workspaceId: workspace.id, name: "Development" },
        { workspaceId: workspace.id, name: "Testing" },
        { workspaceId: workspace.id, name: "Urgent" },
        { workspaceId: workspace.id, name: "Meeting" },
      ])
      .returning();

    // --------------------------------------------------------------------------
    // 9. Time Entries (Desktop & Mobile with Geolocation and Offline-Sync Metadata)
    // --------------------------------------------------------------------------
    console.log("⏱️ Creating sample desktop and mobile time entries...");
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const fortyFiveMinsAgo = new Date(now.getTime() - 45 * 60 * 1000);

    const [desktopEntry1, mobileEntryActive, mobileEntry2, desktopEntry2] = await db
      .insert(schema.timeEntries)
      .values([
        // Entry 1: Desktop Entry (Completed)
        {
          workspaceId: workspace.id,
          userId: likith.id,
          projectId: projectArc.id,
          taskId: taskFirmware.id,
          description: "Calibrating magnetic plasma confinement on Tauri desktop client",
          startTime: threeHoursAgo,
          endTime: oneHourAgo,
          durationSeconds: 7200,
          isBillable: true,
          hourlyRateApplied: "150.00",
          // Geolocation
          latitude: 12.9716,
          longitude: 77.5946,
          locationAddress: "MG Road, Bengaluru, Karnataka 560001, India",
          locationAccuracy: 6.5,
          // Sync metadata
          createdPlatform: "DESKTOP",
          deviceId: "macbook-pro-m3-likith",
          deviceName: "MacBook Pro M3 Max",
          clientVersion: "2.1.0",
          clientCreatedAt: threeHoursAgo,
          clientUpdatedAt: oneHourAgo,
          serverUpdatedAt: oneHourAgo,
        },

        // Entry 2: Mobile Entry (Currently Active Timer!)
        {
          workspaceId: workspace.id,
          userId: likith.id,
          projectId: projectBatmobile.id,
          taskId: taskSensors.id,
          description: "Field testing vehicle telemetry and GPS breadcrumb accuracy",
          startTime: fortyFiveMinsAgo,
          endTime: null, // Running active timer
          durationSeconds: null,
          isBillable: true,
          hourlyRateApplied: "110.00",
          // Geolocation
          latitude: 12.9784,
          longitude: 77.6408,
          locationAddress: "100ft Road, Indiranagar, Bengaluru, Karnataka 560038, India",
          locationAccuracy: 3.8,
          // Sync metadata
          createdPlatform: "MOBILE",
          deviceId: "pixel-8-pro-likith-01",
          deviceName: "Google Pixel 8 Pro (Android 15)",
          clientVersion: "1.4.2",
          clientCreatedAt: fortyFiveMinsAgo,
          clientUpdatedAt: fortyFiveMinsAgo,
          serverUpdatedAt: fortyFiveMinsAgo,
        },

        // Entry 3: Mobile Entry (Sarah Connor - Completed Non-billable Meeting)
        {
          workspaceId: workspace.id,
          userId: sarah.id,
          projectId: projectInternal.id,
          taskId: taskSync.id,
          description: "Attended weekly roadmap planning on mobile app during transit",
          startTime: fiveHoursAgo,
          endTime: fourHoursAgo,
          durationSeconds: 3600,
          isBillable: false,
          hourlyRateApplied: "0.00",
          // Geolocation
          latitude: 40.7128,
          longitude: -74.006,
          locationAddress: "One World Trade Center, New York, NY 10007, USA",
          locationAccuracy: 5.0,
          // Sync metadata
          createdPlatform: "MOBILE",
          deviceId: "iphone-15-pro-sarah",
          deviceName: "iPhone 15 Pro (iOS 18.2)",
          clientVersion: "1.4.2",
          clientCreatedAt: fiveHoursAgo,
          clientUpdatedAt: fourHoursAgo,
          serverUpdatedAt: fourHoursAgo,
        },

        // Entry 4: Desktop Entry (Sarah Connor - Completed Billable Research)
        {
          workspaceId: workspace.id,
          userId: sarah.id,
          projectId: projectArc.id,
          taskId: taskFirmware.id,
          description: "Thermal stress simulations and high-load test automation",
          startTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 5.5 * 60 * 60 * 1000),
          durationSeconds: 9000,
          isBillable: true,
          hourlyRateApplied: "150.00",
          // Geolocation
          latitude: 40.7589,
          longitude: -73.9851,
          locationAddress: "Times Square Tower, New York, NY 10036, USA",
          locationAccuracy: 11.2,
          // Sync metadata
          createdPlatform: "DESKTOP",
          deviceId: "thinkpad-x1-sarah",
          deviceName: "ThinkPad X1 Carbon Gen 11 (Fedora 40)",
          clientVersion: "2.1.0",
          clientCreatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
          clientUpdatedAt: new Date(now.getTime() - 5.5 * 60 * 60 * 1000),
          serverUpdatedAt: new Date(now.getTime() - 5.5 * 60 * 60 * 1000),
        },
      ])
      .returning();

    // --------------------------------------------------------------------------
    // 10. Tag Assignments (Relational Junction)
    // --------------------------------------------------------------------------
    console.log("🔗 Linking tags to time entries...");
    await db.insert(schema.timeEntryTags).values([
      // Desktop entry 1: Development + Urgent
      { timeEntryId: desktopEntry1.id, tagId: tagDev.id },
      { timeEntryId: desktopEntry1.id, tagId: tagUrgent.id },
      // Mobile active entry 2: Testing + Urgent
      { timeEntryId: mobileEntryActive.id, tagId: tagTesting.id },
      { timeEntryId: mobileEntryActive.id, tagId: tagUrgent.id },
      // Mobile entry 3: Meeting
      { timeEntryId: mobileEntry2.id, tagId: tagMeeting.id },
      // Desktop entry 4: Development + Testing
      { timeEntryId: desktopEntry2.id, tagId: tagDev.id },
      { timeEntryId: desktopEntry2.id, tagId: tagTesting.id },
    ]);

    console.log("✅ Seed completed successfully!");
    console.log(`
Summary of Seeded Data:
-----------------------
- 1 Workspace (${workspace.name})
- 2 Users (${likith.fullName}, ${sarah.fullName})
- 2 Clients (${starkIndustries.name}, ${wayneEnterprises.name})
- 3 Projects (${projectArc.name}, ${projectBatmobile.name}, ${projectInternal.name})
- 3 Tasks
- 4 Tags
- 4 Time Entries (2 Desktop, 2 Mobile, including 1 running live timer with GPS)
    `);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute directly if run via CLI
if (process.argv[1]?.includes("seed")) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
