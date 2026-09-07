import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  doublePrecision,
  timestamp,
  pgEnum,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// ==========================================
// 1. ENUMS
// ==========================================

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "OWNER",
  "ADMIN",
  "PROJECT_MANAGER",
  "MEMBER",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "ACTIVE",
  "DONE",
]);

export const createdPlatformEnum = pgEnum("created_platform", [
  "DESKTOP",
  "MOBILE",
  "WEB",
]);

// ==========================================
// 2. MULTI-TENANCY & RBAC
// ==========================================

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    currency: varchar("currency", { length: 10 }).notNull().default("USD"),
    defaultHourlyRate: numeric("default_hourly_rate", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("workspaces_slug_idx").on(table.slug),
  ]
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),
    timezone: varchar("timezone", { length: 100 }).notNull().default("UTC"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
  ]
);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("MEMBER"),
    customHourlyRate: numeric("custom_hourly_rate", { precision: 10, scale: 2 }),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("workspace_members_workspace_user_unique").on(table.workspaceId, table.userId),
    index("workspace_members_workspace_idx").on(table.workspaceId),
    index("workspace_members_user_idx").on(table.userId),
  ]
);

// ==========================================
// 3. ENTITY HIERARCHY
// ==========================================

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("clients_workspace_idx").on(table.workspaceId),
  ]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
    name: varchar("name", { length: 255 }).notNull(),
    colorHex: varchar("color_hex", { length: 7 }).notNull().default("#03a9f4"),
    isBillableDefault: boolean("is_billable_default").notNull().default(true),
    hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("projects_workspace_idx").on(table.workspaceId),
    index("projects_client_idx").on(table.clientId),
  ]
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    status: taskStatusEnum("status").notNull().default("ACTIVE"),
    hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("tasks_project_idx").on(table.projectId),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("tags_workspace_name_unique").on(table.workspaceId, table.name),
    index("tags_workspace_idx").on(table.workspaceId),
  ]
);

// ==========================================
// 4. TIME ENTRIES (Unified Desktop & Mobile)
// ==========================================

export const timeEntries = pgTable(
  "time_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    description: text("description").notNull().default(""),
    startTime: timestamp("start_time", { withTimezone: true, mode: "date" }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true, mode: "date" }),
    durationSeconds: integer("duration_seconds"),
    isBillable: boolean("is_billable").notNull().default(true),
    hourlyRateApplied: numeric("hourly_rate_applied", { precision: 10, scale: 2 }),

    // Geolocation fields
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    locationAddress: text("location_address"),
    locationAccuracy: doublePrecision("location_accuracy"),

    // Cross-Platform Sync & Audit Metadata
    createdPlatform: createdPlatformEnum("created_platform").notNull().default("WEB"),
    deviceId: varchar("device_id", { length: 100 }),
    deviceName: varchar("device_name", { length: 100 }),
    clientVersion: varchar("client_version", { length: 20 }),
    clientCreatedAt: timestamp("client_created_at", { withTimezone: true, mode: "date" }),
    clientUpdatedAt: timestamp("client_updated_at", { withTimezone: true, mode: "date" }),
    serverUpdatedAt: timestamp("server_updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    // Performance requirement 1: Composite index for fast daily/weekly feeds
    index("time_entries_workspace_user_start_idx").on(
      table.workspaceId,
      table.userId,
      table.startTime
    ),
    // Performance requirement 2: Index for delta-sync queries (GET /sync?since=timestamp)
    index("time_entries_workspace_sync_idx").on(
      table.workspaceId,
      table.serverUpdatedAt
    ),
    // Performance requirement 3: Index for reporting rollups
    index("time_entries_project_billable_idx").on(
      table.projectId,
      table.isBillable
    ),
    // Soft-delete query optimization
    index("time_entries_deleted_at_idx").on(table.deletedAt),
  ]
);

// ==========================================
// 5. RELATIONAL JUNCTION
// ==========================================

export const timeEntryTags = pgTable(
  "time_entry_tags",
  {
    timeEntryId: uuid("time_entry_id")
      .notNull()
      .references(() => timeEntries.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.timeEntryId, table.tagId] }),
    index("time_entry_tags_entry_idx").on(table.timeEntryId),
    index("time_entry_tags_tag_idx").on(table.tagId),
  ]
);

// ==========================================
// 6. RELATIONS
// ==========================================

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  clients: many(clients),
  projects: many(projects),
  tags: many(tags),
  timeEntries: many(timeEntries),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(workspaceMembers),
  timeEntries: many(timeEntries),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [clients.workspaceId],
    references: [workspaces.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  tasks: many(tasks),
  timeEntries: many(timeEntries),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  timeEntries: many(timeEntries),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [tags.workspaceId],
    references: [workspaces.id],
  }),
  timeEntryTags: many(timeEntryTags),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [timeEntries.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  tags: many(timeEntryTags),
}));

export const timeEntryTagsRelations = relations(timeEntryTags, ({ one }) => ({
  timeEntry: one(timeEntries, {
    fields: [timeEntryTags.timeEntryId],
    references: [timeEntries.id],
  }),
  tag: one(tags, {
    fields: [timeEntryTags.tagId],
    references: [tags.id],
  }),
}));

// ==========================================
// 7. INFERRED TYPES & ENUM EXPORTS
// ==========================================

export type WorkspaceRole = (typeof workspaceRoleEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type CreatedPlatform = (typeof createdPlatformEnum.enumValues)[number];

export type Workspace = InferSelectModel<typeof workspaces>;
export type NewWorkspace = InferInsertModel<typeof workspaces>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type WorkspaceMember = InferSelectModel<typeof workspaceMembers>;
export type NewWorkspaceMember = InferInsertModel<typeof workspaceMembers>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

export type TimeEntry = InferSelectModel<typeof timeEntries>;
export type NewTimeEntry = InferInsertModel<typeof timeEntries>;

export type TimeEntryTag = InferSelectModel<typeof timeEntryTags>;
export type NewTimeEntryTag = InferInsertModel<typeof timeEntryTags>;
