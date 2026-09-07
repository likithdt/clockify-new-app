-- ==============================================================================
-- Clockify Multi-Tenant Production Schema Migration (0000_init.sql)
-- Unified Desktop & Mobile Engine with Offline-First Synchronization & RBAC
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Custom Enum Types
-- ------------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "public"."workspace_role" AS ENUM (
    'OWNER',
    'ADMIN',
    'PROJECT_MANAGER',
    'MEMBER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."task_status" AS ENUM (
    'ACTIVE',
    'DONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."created_platform" AS ENUM (
    'DESKTOP',
    'MOBILE',
    'WEB'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Multi-Tenancy & RBAC: workspaces, users, workspace_members
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "currency" varchar(10) DEFAULT 'USD' NOT NULL,
  "default_hourly_rate" numeric(10, 2) DEFAULT '0.00' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "password_hash" text NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "avatar_url" text,
  "timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "workspace_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" "public"."workspace_role" DEFAULT 'MEMBER' NOT NULL,
  "custom_hourly_rate" numeric(10, 2),
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "workspace_members_workspace_user_unique" UNIQUE("workspace_id", "user_id"),
  CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);

-- ------------------------------------------------------------------------------
-- 3. Entity Hierarchy: clients, projects, tasks, tags
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "clients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "name" varchar(255) NOT NULL,
  "address" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "clients_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "client_id" uuid,
  "name" varchar(255) NOT NULL,
  "color_hex" varchar(7) DEFAULT '#03a9f4' NOT NULL,
  "is_billable_default" boolean DEFAULT true NOT NULL,
  "hourly_rate" numeric(10, 2),
  "is_archived" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "project_id" uuid NOT NULL,
  "name" varchar(255) NOT NULL,
  "status" "public"."task_status" DEFAULT 'ACTIVE' NOT NULL,
  "hourly_rate" numeric(10, 2),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "name" varchar(100) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "tags_workspace_name_unique" UNIQUE("workspace_id", "name"),
  CONSTRAINT "tags_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action
);

-- ------------------------------------------------------------------------------
-- 4. Time Entries (Unified Desktop & Mobile with Geolocation and Offline-Sync)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "time_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "project_id" uuid,
  "task_id" uuid,
  "description" text DEFAULT '' NOT NULL,
  "start_time" timestamp with time zone NOT NULL,
  "end_time" timestamp with time zone,
  "duration_seconds" integer,
  "is_billable" boolean DEFAULT true NOT NULL,
  "hourly_rate_applied" numeric(10, 2),
  
  -- Geolocation Fields
  "latitude" double precision,
  "longitude" double precision,
  "location_address" text,
  "location_accuracy" double precision,

  -- Cross-Platform Sync & Audit Metadata
  "created_platform" "public"."created_platform" DEFAULT 'WEB' NOT NULL,
  "device_id" varchar(100),
  "device_name" varchar(100),
  "client_version" varchar(20),
  "client_created_at" timestamp with time zone,
  "client_updated_at" timestamp with time zone,
  "server_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone,

  CONSTRAINT "time_entries_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "time_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "time_entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "time_entries_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE set null ON UPDATE no action
);

-- ------------------------------------------------------------------------------
-- 5. Relational Junction: time_entry_tags
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "time_entry_tags" (
  "time_entry_id" uuid NOT NULL,
  "tag_id" uuid NOT NULL,
  CONSTRAINT "time_entry_tags_time_entry_id_tag_id_pk" PRIMARY KEY("time_entry_id", "tag_id"),
  CONSTRAINT "time_entry_tags_time_entry_id_time_entries_id_fk" FOREIGN KEY ("time_entry_id") REFERENCES "public"."time_entries"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "time_entry_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action
);

-- ------------------------------------------------------------------------------
-- 6. Performance & Synchronization Indexes
-- ------------------------------------------------------------------------------

-- Fast daily / weekly feeds per user in a workspace
CREATE INDEX IF NOT EXISTS "time_entries_workspace_user_start_idx" 
  ON "time_entries" ("workspace_id", "user_id", "start_time");

-- Delta-sync queries (GET /sync?since=timestamp)
CREATE INDEX IF NOT EXISTS "time_entries_workspace_sync_idx" 
  ON "time_entries" ("workspace_id", "server_updated_at");

-- Reporting and analytics rollups by project & billable status
CREATE INDEX IF NOT EXISTS "time_entries_project_billable_idx" 
  ON "time_entries" ("project_id", "is_billable");

-- Soft-delete filtering for active queries
CREATE INDEX IF NOT EXISTS "time_entries_deleted_at_idx" 
  ON "time_entries" ("deleted_at");

-- Foreign key lookup & unique search indexes
CREATE INDEX IF NOT EXISTS "workspaces_slug_idx" ON "workspaces" ("slug");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "workspace_members_workspace_idx" ON "workspace_members" ("workspace_id");
CREATE INDEX IF NOT EXISTS "workspace_members_user_idx" ON "workspace_members" ("user_id");
CREATE INDEX IF NOT EXISTS "clients_workspace_idx" ON "clients" ("workspace_id");
CREATE INDEX IF NOT EXISTS "projects_workspace_idx" ON "projects" ("workspace_id");
CREATE INDEX IF NOT EXISTS "projects_client_idx" ON "projects" ("client_id");
CREATE INDEX IF NOT EXISTS "tasks_project_idx" ON "tasks" ("project_id");
CREATE INDEX IF NOT EXISTS "tags_workspace_idx" ON "tags" ("workspace_id");
CREATE INDEX IF NOT EXISTS "time_entry_tags_entry_idx" ON "time_entry_tags" ("time_entry_id");
CREATE INDEX IF NOT EXISTS "time_entry_tags_tag_idx" ON "time_entry_tags" ("tag_id");
