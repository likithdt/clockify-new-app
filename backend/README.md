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

## 4. Separation of Concerns

- **`backend/`**: Contains the standalone domain models, controllers, services, database seed, and documentation.
- **`src-tauri/`**: Houses the native desktop Tauri runtime executing Rust commands.
- **`src/`**: Houses all frontend React UI components, styles, and stores.

