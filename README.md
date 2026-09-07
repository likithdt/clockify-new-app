# Clockify Application Suite

A full-featured clone and reimagination of **Clockify**, featuring both a cross-platform **Desktop application** (powered by Tauri v2 and React) and a responsive **Mobile application**, alongside reference UI designs.

---

## 📁 Repository Structure

```text
clockify-new-app/
├── clockify-desktop/              # Tauri v2 + React 19 Desktop application
│   ├── src/                       # React frontend source (pages, components, stores)
│   ├── src-tauri/                 # Tauri Rust backend and application core
│   ├── public/                    # Static public assets
│   ├── package.json               # Desktop dependencies & scripts
│   └── vite.config.ts             # Vite configuration
│
├── clockify-mobile/               # Clockify Mobile Web / Simulator application
│   ├── src/                       # Mobile-optimized React frontend
│   │   ├── screens/               # Mobile screens (Timer, Pomodoro, Project picker, etc.)
│   │   ├── components/            # Mobile UI components (Android frame, drawer, modals)
│   │   └── backend/               # Mock/local API middleware & services
│   ├── package.json               # Mobile dependencies & scripts
│   └── vite.config.ts             # Vite configuration
│
├── clockify-ref-images-desktop/   # UI/UX reference screenshots and design mockups
├── .gitignore                     # Git ignore rules for node_modules, target, logs
└── README.md                      # Project documentation
```

---

## 🖥️ Clockify Desktop

A high-performance desktop application delivering comprehensive time-tracking and team management features with a native feel.

### ✨ Key Features
- **⏱️ Time Tracker**: Interactive timer with project selection, tagging, billable rates, and manual time entry.
- **📅 Timesheet & Calendar**: Daily and weekly views for scheduling, timesheet reviews, and task assignments.
- **🤖 Auto Tracker**: Automatic application and activity detection with approval workflow.
- **📊 Reports & Invoicing**: Detailed summary reports, weekly breakdowns, exportable data, and invoice generation.
- **👥 Team Management & Rates**: Role-based access, billable hourly rates, cost rates, and team filters.
- **🏖️ Time Off & Policies**: Vacation and leave tracking, holiday calendars, and request/approval flows.
- **🏢 Kiosks & Expenses**: Shared attendance kiosk terminals and expense tracking.
- **📍 Activity & Location Monitoring**: GPS location tracking with Google Maps integration and screenshot monitoring.

### 🛠️ Desktop Tech Stack
- **Framework / Shell**: [Tauri v2](https://v2.tauri.app/) (Rust backend)
- **Frontend**: React 19, TypeScript, [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), Radix UI / [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

### 🚀 Getting Started (Desktop)

#### Prerequisites
- **Node.js** (v18 or newer)
- **pnpm** (recommended) or **npm**
- **Rust & Cargo** ([Install Rust](https://www.rust-lang.org/tools/install))
- [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/) for Windows / macOS / Linux

#### Installation & Development
```bash
# Navigate to the desktop directory
cd clockify-desktop

# Install dependencies
pnpm install

# Run in development mode with Tauri shell
pnpm tauri dev

# Alternatively run only the web frontend
pnpm dev
```

#### Production Build
```bash
pnpm tauri build
```

---

## 📱 Clockify Mobile

A mobile-tailored Clockify client with touch-optimized interfaces, Pomodoro integration, and an embedded Android frame simulator.

### ✨ Key Features
- **⚡ Mobile Time Tracker**: Quick start/stop timer, recent entries, and swipeable time cards.
- **🍅 Pomodoro Timer**: Configurable work/break intervals, sound alerts, and automated tracking.
- **📂 Project & Tag Selection**: Bottom sheets and quick-search selectors for rapid tagging.
- **📱 Device Simulator**: Android device frame mockup for previewing mobile UX on desktop browsers.

### 🛠️ Mobile Tech Stack
- **Frontend**: React 19, TypeScript, [Vite](https://vite.dev/)
- **Styling**: Tailwind CSS, Lucide Icons, Radix UI
- **State**: Zustand & custom state management

### 🚀 Getting Started (Mobile)

```bash
# Navigate to the mobile directory
cd clockify-mobile

# Install dependencies
pnpm install # or npm install

# Start development server
pnpm dev # or npm run dev
```

---

## 🖼️ Reference Designs

The `clockify-ref-images-desktop/` folder contains high-fidelity visual references used during development:
- Activity monitoring & screenshots
- Calendar (Day & Week views)
- Invoices, Expenses, & Kiosks
- Projects & Reports
- Team roles, rates, and permissions
- Time Tracker & Timesheet

---

## 👤 Author
- **Likith D T** ([@likithdt](https://github.com/likithdt))
