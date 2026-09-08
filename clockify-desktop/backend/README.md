# Clockify Time Off — Backend Architecture & API Specification

This directory encapsulates the complete standalone **Backend** for the Time Off feature. It mirrors the desktop Tauri backend in `src-tauri/` and can be run or integrated independently.

---

## Directory Structure

```
backend/
├── data/
│   └── seedData.json           # Seed database containing sample team, policies, requests & balances
├── models/
│   └── types.ts                # TypeScript interfaces, enums, and DTO contracts
├── services/
│   └── timeOffService.ts       # Core domain service containing business logic & balance arithmetic
├── controllers/
│   └── timeOffController.ts    # API controller handlers with error handling & response envelopes
├── index.ts                    # Public module exports
└── README.md                   # Complete backend architecture documentation
```

---

## 1. Domain Entities

### `TimeOffRequest`
Represents an individual leave application submitted by a member.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g. `r1`, `req_abc`) |
| `member_id` | `string` | Foreign key referencing `TeamMember.id` |
| `policy_id` | `string` | Foreign key referencing `LeavePolicy.id` |
| `start_date` | `string` | ISO date `YYYY-MM-DD` (inclusive) |
| `end_date` | `string` | ISO date `YYYY-MM-DD` (inclusive) |
| `duration` | `number` | Total units requested (e.g. `2.0` days) |
| `status` | `'pending' \| 'approved' \| 'rejected' \| 'withdrawn'` | Approval status |
| `note` | `string?` | Optional requester note |
| `requested_at` | `string` | ISO timestamp of submission |
| `rejection_reason` | `string?` | Optional comment when rejected |

### `LeavePolicy`
A leave entitlement policy configured by administrators.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (`p1`, `pol_xyz`) |
| `name` | `string` | Name (e.g. `Sick leave`, `Vacation`) |
| `unit` | `'days' \| 'hours'` | Unit of measurement |
| `accrual_per_year` | `number?` | Total units granted per calendar year |
| `accrual_type` | `'fixed_per_year' \| 'monthly_accrual' \| 'manual'` | Accrual mode |
| `allow_carryover` | `boolean` | Whether unused days roll over to next year |
| `max_balance` | `number?` | Maximum balance cap |
| `is_active` | `boolean` | Policy active status |
| `assignee_ids` | `string[]` | List of member IDs assigned to this policy |

### `LeaveBalance`
Tracks accrual, usage, and remaining days for every `(member, policy)` pair.

$$\text{remaining} = \text{accrued} + \text{carried\_over} - \text{used}$$

### `Holiday`
Public or company holidays that exempt team members from working.

---

## 2. API Endpoints & Tauri Commands

### Requests
- `GET /api/timeoff/requests` or `list_timeoff_requests` — List & filter requests by member, status, or date range.
- `GET /api/timeoff/requests/:id` or `get_timeoff_request` — Retrieve request details.
- `POST /api/timeoff/requests` or `create_timeoff_request` — Submit request with overlap validation.
- `POST /api/timeoff/requests/:id/review` or `review_timeoff_request` — Approve/Reject request and update balance.
- `POST /api/timeoff/requests/:id/withdraw` or `withdraw_timeoff_request` — Withdraw request.
- `DELETE /api/timeoff/requests/:id` or `delete_timeoff_request` — Delete request.

### Timeline
- `GET /api/timeoff/timeline` or `get_timeline` — Get date-range overlapping requests for the Gantt view.

### Balance
- `GET /api/timeoff/balances` or `list_leave_balances` — List leave balances filtered by member or policy.
- `POST /api/timeoff/balances/set` or `set_leave_balance` — Manually override accrual and carryover.

### Policies
- `GET /api/timeoff/policies` or `list_leave_policies` — List policies (active/inactive).
- `POST /api/timeoff/policies` or `create_leave_policy` — Create new policy.
- `PUT /api/timeoff/policies/:id` or `update_leave_policy` — Update policy fields.
- `DELETE /api/timeoff/policies/:id` or `delete_leave_policy` — Delete policy (guarded against active requests).

### Holidays
- `GET /api/timeoff/holidays` or `list_holidays` — List holidays.
- `POST /api/timeoff/holidays` or `create_holiday` — Create single holiday.
- `POST /api/timeoff/holidays/import` or `import_public_holidays` — Bulk import national holidays (IN, US, GB).
- `DELETE /api/timeoff/holidays/:id` or `delete_holiday` — Delete holiday.

---

## 3. Calendar Task Architecture & API Specification

The Calendar Task module provides interactive calendar management mirroring Clockify's Week & Day view. It supports both **tracked time entries** and **planned tasks**, duration calculation, project & client association, billable tracking, teammate filtering, and direct timer integration.

### Domain Entities

#### `CalendarTask`
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique task ID (`ct_123`) |
| `title` | `string` | Task / entry description |
| `project_id` | `string?` | Optional FK to Project |
| `project_name` | `string` | Project display name |
| `project_color` | `string` | Hex color code (e.g. `#03a9f4`) |
| `client_name` | `string?` | Optional client label |
| `date` | `string` | ISO date `YYYY-MM-DD` |
| `start_time` | `string` | `HH:mm` 24-hour start time |
| `end_time` | `string` | `HH:mm` 24-hour end time |
| `duration_minutes` | `number` | Computed duration in minutes |
| `is_billable` | `boolean` | Billable flag |
| `tags` | `string[]` | Associated labels |
| `entry_type` | `'entry' \| 'planned'` | Regular logged block vs planned task |
| `member_id` | `string` | FK to `TeamMember.id` |
| `status` | `'completed' \| 'in_progress' \| 'planned'` | Execution status |

### Calendar API Endpoints & Tauri Commands
- `GET /api/calendar/tasks` or `list_calendar_tasks` — Filter tasks by date range, member, project, entry type, billable.
- `GET /api/calendar/tasks/:id` or `get_calendar_task` — Get single task.
- `POST /api/calendar/tasks` or `create_calendar_task` — Create calendar entry or planned task.
- `PUT /api/calendar/tasks/:id` or `update_calendar_task` — Update title, time, project, billable, or tags.
- `DELETE /api/calendar/tasks/:id` or `delete_calendar_task` — Delete task.
- `POST /api/calendar/tasks/:id/duplicate` or `duplicate_calendar_task` — Duplicate task.
- `POST /api/calendar/tasks/:id/move` or `move_calendar_task` — Reschedule task to new date/time.
- `GET /api/calendar/summaries` or `get_calendar_day_summaries` — Aggregated daily minutes & counts.
- `GET /api/calendar/settings` or `get_calendar_settings` — Retrieve user calendar preferences.
- `PUT /api/calendar/settings` or `update_calendar_settings` — Update preferences.
- `GET /api/calendar/projects` or `list_calendar_projects` — List available projects.
- `GET /api/calendar/tags` or `list_calendar_tags` — List available tags.

---

## 4. Location & Activity Monitoring Domain Entities & API

### `ActivityRecord`
Represents an active member pulse, active window, activity percentage, and score.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique record ID |
| `member_id` | `string` | Member ID |
| `member_name` | `string` | Display name |
| `avatar` | `string` | Initials |
| `avatar_color` | `string` | Hex code |
| `task` | `string` | Active task name |
| `project` | `string` | Project name |
| `project_color` | `string` | Project hex color |
| `activity_percent`| `number` | Real-time activity pulse % (0-100) |
| `pulse_text` | `string` | Activity pulse badge description |
| `active_window` | `string` | Foreground application / window title |
| `score` | `string` | Productivity rating label |
| `status` | `'TRACKING' \| 'IDLE' \| 'OFFLINE'` | Live tracking status |
| `recorded_at` | `string` | ISO timestamp |

### `ScreenshotItemDTO`
Stores periodic automated screen audits and active application state.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique screenshot ID |
| `member_id` | `string` | Member ID |
| `member_name` | `string` | Display name |
| `timestamp` | `string` | ISO capture timestamp |
| `time_formatted` | `string` | Formatted capture time (e.g. `10:40 AM`) |
| `project` | `string` | Tracked project |
| `activity_percent`| `number` | Activity score during window |
| `app_name` | `string` | Active executable or browser |
| `window_title` | `string` | Foreground window title |
| `type` | `'figma' \| 'code' \| 'browser' \| 'slack' \| 'terminal'` | Category badge |

### `MemberLocationDTO`
GPS and geofence tracking record for team members.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Member ID |
| `name` | `string` | Member name |
| `role` | `string` | Role description |
| `last_seen` | `string` | Live status time or `-` |
| `status` | `'Inside Geofence' \| 'Outside Zone' \| 'On Route' \| 'Stationary' \| 'Offline'` | Geofence state |
| `location_name` | `string` | Geocoded reverse address string |
| `lat` / `lng` | `number` | Live GPS coordinates |
| `speed` | `string` | Transit velocity (e.g. `0 km/h`) |
| `battery` | `number` | Device charge % (0-100) |
| `breadcrumbs` | `Array<{lat, lng, time}>` | Route history points |

### `GeofenceZoneDTO`
Designated physical perimeter for workplace attendance audits.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique zone ID |
| `name` | `string` | Zone title (e.g. `Gopalan College Campus`) |
| `address` | `string` | Physical location street address |
| `lat` / `lng` | `number` | Center coordinate |
| `radius_meters` | `number` | Radial containment distance |
| `color` | `string` | Map circle display color |

### Location & Activity API Endpoints & Tauri Commands
- `GET /api/activity/records` or `list_activity_records` — Retrieve list of real-time member activities.
- `GET /api/activity/records/:id` or `get_activity_record` — Get activity status for a member.
- `POST /api/activity/records` or `log_activity_record` — Record active window and keystroke/mouse pulse.
- `GET /api/activity/summary` or `get_activity_summary` — Aggregated workspace telemetry (average activity %, geofence compliance %, active counts).
- `GET /api/activity/screenshots` or `list_screenshots` — Query captured screenshot log with member & date filters.
- `POST /api/activity/screenshots` or `capture_screenshot` — Store newly captured desktop screenshot record.
- `DELETE /api/activity/screenshots/:id` or `delete_screenshot` — Delete screenshot audit record.
- `GET /api/activity/locations` or `list_member_locations` — List all members with live coordinates and breadcrumbs.
- `GET /api/activity/locations/:id` or `get_member_location` — Get real-time GPS telemetry for a specific teammate.
- `PUT /api/activity/locations/:id` or `update_member_location` — Update GPS coordinates, speed, battery, and breadcrumbs.
- `GET /api/activity/geofences` or `list_geofences` — List all configured geofence perimeters.
- `POST /api/activity/geofences` or `create_geofence` — Add a new geofence zone.
- `DELETE /api/activity/geofences/:id` or `delete_geofence` — Remove a geofence zone.
- `GET /api/activity/settings` or `get_activity_settings` — Retrieve tracking, screenshot, and GPS feature toggles.
- `PUT /api/activity/settings` or `update_activity_settings` — Update monitoring settings.

---

## 5. Expenses Domain Entities & API

### `ExpenseItem`
Represents an individual team expense record with project allocation, category, receipts, and approval lifecycle.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique expense ID (`exp-xyz`) |
| `team_member` | `string` | Associated employee display name |
| `member_id` | `string?` | Optional FK to `TeamMember.id` |
| `date` | `string` | Date of expense transaction (`YYYY-MM-DD` or `Today`) |
| `project_id` | `string` | Project identifier |
| `project_name` | `string` | Project name |
| `project_color` | `string` | Hex badge color code |
| `category` | `string` | Expense category (e.g. `Travel`, `Meals`, `Day rate`) |
| `amount` | `number` | Monetanry amount spent |
| `currency` | `string` | Currency code (`INR`, `USD`, etc.) |
| `note` | `string` | Purpose and description |
| `billable` | `boolean` | Whether invoiceable to client |
| `receipt_name` | `string?` | Attached receipt filename/path |
| `status` | `'pending' \| 'approved' \| 'rejected'` | Approval state |
| `created_at` | `string` | Submission timestamp |

### `ExpenseCategory`
Standardized categorization and billing rates for company purchases.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique category ID |
| `name` | `string` | Category label |
| `unit_price` | `number?` | Unit price for mileage or day rate calculations |
| `is_active` | `boolean` | Availability status |

### Expenses API Endpoints & Tauri Commands
- `GET /api/expenses` or `list_expenses` — Query expenses with filters for member, project, category, billable, approval status, and date range.
- `GET /api/expenses/:id` or `get_expense` — Get specific expense details.
- `POST /api/expenses` or `create_expense` — Create new expense entry with receipt.
- `PUT /api/expenses/:id` or `update_expense` — Modify amount, note, project, category, or billable toggle.
- `DELETE /api/expenses/:id` or `delete_expense` — Remove an expense entry.
- `POST /api/expenses/:id/approve` or `approve_expense` — Approve submitted expense.
- `POST /api/expenses/:id/reject` or `reject_expense` — Reject submitted expense.
- `POST /api/expenses/clear` or `clear_all_expenses` — Reset/clear all expenses.
- `GET /api/expenses/summary` or `get_expense_summary` — Aggregated monetary totals (total, billable, non-billable, pending count, approved count).
- `GET /api/expenses/categories` or `list_expense_categories` — Retrieve available categories list.
- `POST /api/expenses/categories` or `create_expense_category` — Add a custom expense category.
- `DELETE /api/expenses/categories/:name` or `delete_expense_category` — Remove custom category.
- `GET /api/expenses/settings` or `get_expense_settings` — Retrieve default currency, billable status, and active categories.
- `PUT /api/expenses/settings` or `update_expense_settings` — Update workspace expense configuration.

---

## 6. Invoicing Module (`/api/invoices`)

The Invoicing module provides enterprise-grade billing, itemized invoices, balance tracking, status progression (Draft -> Sent -> Paid / Overdue), client directory, tax rates, and export configurations.

### Invoicing Data Schema
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique invoice identifier |
| `invoice_number` | `string` | Human-readable sequential or customized invoice code |
| `client_id` | `string` | Reference ID to client record |
| `client_name` | `string` | Display name of the client |
| `issue_date` | `string` | Issue date (YYYY-MM-DD or DD/MM/YYYY) |
| `due_date` | `string` | Due date for payment settlement |
| `due_subtitle` | `string?` | Contextual due note (e.g., "4 days ago", "Due in 5 days") |
| `items` | `InvoiceItem[]` | Array of itemized lines (item, description, qty, unit price, total) |
| `subtotal` | `number` | Sum of item amounts before tax and discounts |
| `tax_percent` | `number` | Workspace or invoice tax percentage (e.g. 18.0) |
| `tax_amount` | `number` | Calculated tax value |
| `discount_percent`| `number` | Discount percentage applied |
| `total_amount` | `number` | Grand total payable |
| `balance_due` | `number` | Remaining amount unpaid |
| `currency` | `string` | 3-letter currency code (e.g., INR, USD, EUR) |
| `status` | `string` | State: `Draft`, `Sent`, `Paid`, `Overdue`, `Void` |
| `is_sample` | `boolean` | Flag indicating whether this is exploration sample data |
| `notes` | `string?` | Payment terms or customer notes |

### Invoicing API Endpoints & Tauri Commands
- `GET /api/invoices` or `list_invoices` — Retrieve invoices filtered by client, status, date range, or sample flag.
- `GET /api/invoices/:id` or `get_invoice` — Retrieve single invoice with full line items and client info.
- `POST /api/invoices` or `create_invoice` — Create new invoice, auto-calculate subtotals, taxes, and balance.
- `PUT /api/invoices/:id` or `update_invoice` — Update line items, due dates, discounts, or notes.
- `DELETE /api/invoices/:id` or `delete_invoice` — Delete invoice.
- `POST /api/invoices/:id/status` or `mark_invoice_status` — Transition invoice state (`Draft`, `Sent`, `Paid`, `Overdue`, `Void`).
- `POST /api/invoices/:id/payment` or `record_invoice_payment` — Record partial or full payment, updating balance due and auto-marking Paid if balance reaches 0.
- `POST /api/invoices/sample/remove` or `remove_sample_invoices` — Purge sample invoices while preserving real invoices.
- `POST /api/invoices/sample/restore` or `restore_sample_invoices` — Re-seed sample exploration invoices.
- `GET /api/invoices/summary` or `get_invoice_summary` — Aggregated counts and amounts by status (draft, sent, overdue, paid).
- `GET /api/invoices/clients` or `list_invoice_clients` — Retrieve list of clients configured for invoicing.
- `POST /api/invoices/clients` or `create_invoice_client` — Add a new invoicing client.
- `DELETE /api/invoices/clients/:id` or `delete_invoice_client` — Remove an invoicing client.
- `GET /api/invoices/settings` or `get_invoice_settings` — Retrieve invoice settings (currency, tax, payment terms, company info).
- `PUT /api/invoices/settings` or `update_invoice_settings` — Update workspace invoicing configuration.

---

## 7. Separation of Concerns & Architecture

- **`backend/`**: Contains the standalone domain models, controllers, services, database seed, and documentation.
- **`src-tauri/`**: Houses the native desktop Tauri runtime executing Rust commands (`src-tauri/src/invoices/`, `src-tauri/src/expenses/`, `src-tauri/src/activity/`, `src-tauri/src/calendar/`, `src-tauri/src/timeoff/`).
- **`src/`**: Houses all frontend React UI components, styles, and stores (`src/stores/useInvoiceStore.ts`, `src/lib/invoiceApi.ts`).





---

## 6. Projects & Clients Architecture & API Specification

### Domain Entities
- **ProjectDTO**: id, 
ame, color, client, 	racked_hours, udget_hours, udget_amount, mount, currency, ccess ('Public' | 'Private'), is_favorite, is_archived, is_billable, created_at.
- **CreateProjectPayload**: 
ame, color, client, ccess, is_billable, udget_hours, udget_amount, currency.
- **UpdateProjectPayload**: partial overrides of all project fields.
- **ProjectFilter**: query, client, status, ccess, illing, is_favorite.
- **ProjectSummaryDTO**: aggregate tracked hours, total budget, and billable amounts.

### Tauri IPC Commands & REST Endpoints
- list_projects / GET /api/projects
- get_project / GET /api/projects/:id
- create_project / POST /api/projects
- update_project / PUT /api/projects/:id
- delete_project / DELETE /api/projects/:id
- rchive_project / POST /api/projects/:id/archive
- 
estore_project / POST /api/projects/:id/restore
- 	oggle_favorite_project / POST /api/projects/:id/toggle-favorite
- 
emove_sample_projects / POST /api/projects/sample/remove
- 
estore_sample_projects / POST /api/projects/sample/restore
- get_project_summary / GET /api/projects/summary

---

## 7. Team & Workspace Members Architecture & API Specification

### Domain Entities
- **TeamMemberDTO**: id, 
ame, email, illable_rate, cost_rate, currency, 
ole ('Owner' | 'Admin' | 'Team manager' | 'Project manager' | 'Member'), group, status ('Active' | 'Inactive' | 'Invited'), is_current_user.
- **AddTeamMemberPayload**: emails, 
ole, group, illable_rate, cost_rate, currency.
- **UpdateTeamMemberPayload**: 
ame, email, illable_rate, cost_rate, currency, 
ole, group, status.

### Tauri IPC Commands & REST Endpoints
- list_workspace_team_members / GET /api/team
- get_workspace_team_member / GET /api/team/:id
- dd_workspace_team_members / POST /api/team
- update_workspace_team_member / PUT /api/team/:id
- delete_workspace_team_member / DELETE /api/team/:id
- 
eset_sample_workspace_team / POST /api/team/sample/reset
- get_workspace_team_summary / GET /api/team/summary

---

## 8. Scheduling & Milestone Planning Architecture & API Specification

### Domain Entities
- **ScheduleAssignmentDTO**: id, project_id, project_name, project_color, client, member_id, member_name, member_initials, member_avatar_color, start_date, end_date, hours_per_day, 	otal_hours, 
ote, ersion_label, is_hatched, is_milestone_active.
- **CreateScheduleAssignmentPayload**: Assignment definition and time slots.
- **UpdateScheduleAssignmentPayload**: Date modifications, daily hours adjustment.

### Tauri IPC Commands & REST Endpoints
- list_schedule_assignments / GET /api/schedule
- get_schedule_assignment / GET /api/schedule/:id
- create_schedule_assignment / POST /api/schedule
- update_schedule_assignment / PUT /api/schedule/:id
- delete_schedule_assignment / DELETE /api/schedule/:id
- 	oggle_schedule_publish / POST /api/schedule/publish/toggle
- 
emove_sample_schedule / POST /api/schedule/sample/remove
- 
estore_sample_schedule / POST /api/schedule/sample/restore
- get_schedule_summary / GET /api/schedule/summary

---

## 9. Approvals (Timesheet & Expense) Architecture & API Specification

### Domain Entities
- **TimesheetApprovalDTO**: id, period, period_sort_date, user, 	eam_manager, 	ime, 	ime_off, status ('pending' | 'approved' | 'rejected' | 'unsubmitted'), submitted_at, pproved_at.
- **ExpenseApprovalDTO**: id, period, period_sort_date, user, 	eam_manager, category, mount, currency, status, submitted_at, pproved_at.

### Tauri IPC Commands & REST Endpoints
- list_approval_timesheets / GET /api/approvals/timesheets
- list_approval_expenses / GET /api/approvals/expenses
- pprove_approval_timesheets / POST /api/approvals/timesheets/approve
- 
eject_approval_timesheets / POST /api/approvals/timesheets/reject
- pprove_approval_expenses / POST /api/approvals/expenses/approve
- 
eject_approval_expenses / POST /api/approvals/expenses/reject
- 
eset_sample_approvals / POST /api/approvals/sample/reset
- get_approval_summary / GET /api/approvals/summary

---

## 10. Time Tracking & Timesheet Architecture & API Specification

### Domain Entities
- **TimeEntryDTO**: id, description, project_id, project_name, project_color, client, 	ask_id, 	ask_name, is_billable, start_time, end_time, duration_seconds, location, user_id, user_name.
- **TimerStatusDTO**: is_tracking, start_time, description, project_name, project_color, is_billable, elapsed_seconds.

### Tauri IPC Commands & REST Endpoints
- list_time_entries / GET /api/time-entries
- get_time_entry / GET /api/time-entries/:id
- create_time_entry / POST /api/time-entries
- update_time_entry / PUT /api/time-entries/:id
- delete_time_entry / DELETE /api/time-entries/:id
- start_time_entry_timer / POST /api/timer/start
- stop_time_entry_timer / POST /api/timer/stop
- get_time_entry_timer_status / GET /api/timer/status
- get_time_entry_summary / GET /api/time-entries/summary

---

## 11. Kiosk Attendance Terminal Architecture & API Specification

### Domain Entities
- **KioskDeviceDTO**: `id`, `name`, `assignees`, `default_project`, `default_break_project`, `logout_after_hours`, `auth_required`, `location`, `device_ip`, `today_check_ins`, `status` (`'ONLINE'` | `'OFFLINE'`), `pin_code`, `created_at`.
- **AttendanceRecordDTO**: `id`, `kiosk_id`, `kiosk_name`, `user_id`, `user_name`, `action` (`'CLOCK_IN'` | `'START_BREAK'` | `'END_BREAK'` | `'CLOCK_OUT'`), `timestamp`, `note`.

### Tauri IPC Commands & REST Endpoints
- `list_kiosks` / `GET /api/kiosks`
- `get_kiosk` / `GET /api/kiosks/:id`
- `create_kiosk` / `POST /api/kiosks`
- `update_kiosk` / `PUT /api/kiosks/:id`
- `delete_kiosk` / `DELETE /api/kiosks/:id`
- `verify_kiosk_pin` / `POST /api/kiosks/:id/verify-pin`
- `record_kiosk_attendance` / `POST /api/kiosks/attendance/punch`
- `list_kiosk_attendance_records` / `GET /api/kiosks/attendance/records`
- `get_kiosk_summary` / `GET /api/kiosks/summary`

---

## 12. Rates & Billing Architecture & API Specification

### Domain Entities
- **HourlyRateDTO**: `id`, `entity_type` (`'workspace'` | `'member'` | `'project'` | `'project_member'` | `'client'`), `entity_id`, `entity_name`, `rate_type` (`'billable'` | `'cost'`), `rate_amount`, `currency`, `since_date`, `is_active`, `updated_at`.
- **RateHistoryItemDTO**: audit log of all historical rate adjustments.

### Tauri IPC Commands & REST Endpoints
- `list_rates` / `GET /api/rates`
- `get_rate` / `GET /api/rates/:id`
- `set_rate` / `POST /api/rates`
- `delete_rate` / `DELETE /api/rates/:id`
- `get_effective_rate` / `GET /api/rates/effective`
- `get_rate_history` / `GET /api/rates/:id/history`
- `get_rate_summary` / `GET /api/rates/summary`

---

## 13. Reports (Summary, Detailed & Weekly) Architecture & API Specification

### Domain Entities
- **SummaryReportDTO**: Aggregated duration, billable amounts, and percentage allocations grouped by project, client, and team member.
- **DetailedReportDTO**: Itemized activity entries with timestamps, rates, and amounts.
- **WeeklyReportDTO**: Matrix table mapping project/client hours across every day of the active week.
- **ExportReportResultDTO**: CSV/Excel/PDF serialized export payload.

### Tauri IPC Commands & REST Endpoints
- `get_summary_report` / `POST /api/reports/summary`
- `get_detailed_report` / `POST /api/reports/detailed`
- `export_report` / `POST /api/reports/export`

---

## 14. Auto-tracker (Desktop Activity Monitoring) Architecture & API Specification

### Domain Entities
- **DetectedActivityDTO**: `id`, `app`, `window_title`, `icon_type` (`'code'` | `'design'` | `'browser'` | `'terminal'` | `'document'` | `'communication'`), `suggested_project`, `project_color`, `start_time`, `end_time`, `duration_minutes`, `duration_seconds`, `is_logged`, `date`.
- **AutoTrackerStatusDTO**: `is_recording`, `active_app`, `active_window`, `idle_seconds`, `recorded_today_seconds`, `pending_activities_count`.

### Tauri IPC Commands & REST Endpoints
- `list_autotracker_activities` / `GET /api/autotracker/activities`
- `toggle_autotracker_recording` / `POST /api/autotracker/recording/toggle`
- `get_autotracker_status` / `GET /api/autotracker/status`
- `log_autotracker_activity` / `POST /api/autotracker/log`
- `log_all_autotracker_activities` / `POST /api/autotracker/log-all`
- `discard_autotracker_activity` / `POST /api/autotracker/discard`
- `update_autotracker_project` / `POST /api/autotracker/project`
