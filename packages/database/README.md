# @clockify/database

Production-grade PostgreSQL database layer with **Drizzle ORM** for the multi-tenant enterprise Clockify suite supporting Desktop (Tauri) and Mobile (Expo/React Native) clients.

---

## 🏗️ Architecture & Features

### 1. Multi-Tenancy & RBAC
- **Workspaces**: Complete tenancy isolation via `workspace_id`.
- **RBAC Roles**: `OWNER`, `ADMIN`, `PROJECT_MANAGER`, `MEMBER`.
- **Rate Hierarchy**: Workspace-level default rate with per-member overrides (`custom_hourly_rate`).

### 2. Entity Hierarchy
- **Clients**: Client accounts per workspace.
- **Projects**: Project grouping with custom color hexes, billable flags, and hourly rates.
- **Tasks**: Granular task assignments under projects (`ACTIVE`, `DONE`).
- **Tags**: Categorization tags per workspace.

### 3. Unified Time Entries (Desktop & Mobile)
- Client- or server-generated UUID primary keys.
- Accurate UTC timestamps (`start_time`, `end_time`).
- `duration_seconds` calculated automatically on timer stop.
- `hourly_rate_applied`: Historical rate snapshot preserving billing integrity even if user/project rates change later.

### 4. Geolocation & Mobile Tracking
- High-precision GPS coordinates (`latitude`, `longitude`).
- Geocoded physical address (`location_address`).
- Accuracy radius in meters (`location_accuracy`).

### 5. Offline-First Cross-Platform Synchronization
- `created_platform`: `DESKTOP`, `MOBILE`, `WEB`.
- Hardware auditing: `device_id`, `device_name`, `client_version`.
- Offline timestamps: `client_created_at`, `client_updated_at` (used for Last-Write-Wins conflict resolution).
- Server timestamp: `server_updated_at` (monotonically tracked for delta sync).
- Soft delete: `deleted_at` ensures deleted records sync reliably to all offline devices.

### 6. High-Performance Indexes
- `(workspace_id, user_id, start_time)`: Optimized for daily/weekly timesheet views.
- `(workspace_id, server_updated_at)`: Optimized for delta-sync queries (`GET /sync?since=timestamp`).
- `(project_id, is_billable)`: Optimized for financial and project reporting rollups.
- `(deleted_at)`: Optimized for filtering out soft-deleted records.

---

## 🚀 Getting Started

### 1. Installation
```bash
cd packages/database
pnpm install # or npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your PostgreSQL connection string in `DATABASE_URL`.

### 3. Migrations
Run the raw SQL migration using psql or your preferred tool:
```bash
psql -d clockify -f migrations/0000_init.sql
```
Or with Drizzle Kit:
```bash
pnpm migrate
# or push schema directly in development:
pnpm push
```

### 4. Seed Database
Run the seed script to populate sample workspace, users, projects, and desktop/mobile entries:
```bash
pnpm seed
```

### 5. Drizzle Studio (Visual DB Browser)
```bash
pnpm studio
```
