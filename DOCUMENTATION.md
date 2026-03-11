# Finance Admin Panel — Project Documentation

> **Version:** 2.1.0  
> **Tech Stack:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4  
> **Last Updated:** March 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Entry Points](#4-entry-points)
5. [Routing & Route Protection](#5-routing--route-protection)
6. [Layout System](#6-layout-system)
7. [Context & State Management](#7-context--state-management)
8. [API Layer](#8-api-layer)
9. [Feature Modules (API Functions)](#9-feature-modules-api-functions)
10. [Pages](#10-pages)
11. [Components](#11-components)
12. [Hooks](#12-hooks)
13. [Utilities](#13-utilities)
14. [Icons](#14-icons)
15. [Styling](#15-styling)
16. [Configuration Files](#16-configuration-files)
17. [Environment Variables](#17-environment-variables)
18. [Data Flow Diagram](#18-data-flow-diagram)
19. [API Endpoints Reference](#19-api-endpoints-reference)

---

## 1. Project Overview

This is a **React-based Finance Admin Panel** built on top of the TailAdmin template. It provides a full-featured dashboard for managing:

- **Users** (Admins, Partners, Employees) — registration, listing, editing, deleting
- **Projects** — creation via a multi-step form, viewing, and assigning
- **Employees** — listing and editing employee details
- **Document Types** — managing document categories
- **User Profiles** — viewing and editing the logged-in user's own data

Authentication is JWT-based with role-aware route guards. All backend calls go through a centralized `apiService` that sits on top of an Axios instance configured with automatic Bearer token injection.

---

## 2. Technology Stack & Dependencies

### Core
| Package | Version | Purpose |
|---|---|---|
| `react` | 19.0.0 | UI component library |
| `react-dom` | 19.0.0 | DOM rendering |
| `typescript` | 5.7.2 | Static typing |
| `vite` | 6.1.0 | Dev server & bundler |
| `tailwindcss` | 4.0.8 | Utility-first CSS framework |

### Routing & Forms
| Package | Version | Purpose |
|---|---|---|
| `react-router` | 7.1.5 | Client-side routing (v7 object API) |
| `react-hook-form` | 7.71.2 | Performant form state management |

### HTTP & Data
| Package | Version | Purpose |
|---|---|---|
| `axios` | 1.13.5 | HTTP client for API calls |

### UI Enhancements
| Package | Version | Purpose |
|---|---|---|
| `react-toastify` | 11.0.5 | Toast notifications (success/error) |
| `apexcharts` + `react-apexcharts` | 4.1.0 / 1.7.0 | Charts (line, bar) |
| `@fullcalendar/*` | 6.1.15 | Full calendar widget |
| `flatpickr` | 4.6.13 | Date/time picker |
| `swiper` | 11.2.3 | Touch-friendly carousels |
| `react-dropzone` | 14.3.5 | Drag-and-drop file uploads |
| `react-dnd` + `react-dnd-html5-backend` | 16.0.1 | Drag-and-drop interactions |
| `lucide-react` | 0.576.0 | Icon set (used alongside custom icons) |
| `@react-jvectormap/*` | — | World map vector component |
| `clsx` + `tailwind-merge` | 2.1.1 / 3.0.1 | Conditional class name utilities |
| `react-helmet-async` | 2.0.5 | Dynamic `<head>` / SEO meta tags |

### Dev Dependencies
| Package | Purpose |
|---|---|
| `@vitejs/plugin-react` | React Fast Refresh in Vite |
| `vite-plugin-svgr` | Import SVG files as React components |
| `eslint` + `typescript-eslint` | Linting |
| `postcss` | CSS processing (required by Tailwind CSS 4) |

---

## 3. Project Structure

```
src/
├── api/                  # HTTP layer
│   ├── axiosInstance.ts  # Configured Axios instance (auth interceptors)
│   ├── apiService.ts     # Thin wrapper: get/post/put/patch/delete
│   └── endpoints.ts      # Central URL definitions
│
├── context/              # React context providers
│   ├── AuthContext.tsx   # JWT auth state (user, role, token)
│   └── SidebarContext.tsx# Sidebar expanded/collapsed state
│
├── features/             # Domain-specific API call functions
│   ├── auth/authApi.ts
│   ├── users/userApi.ts
│   └── projects/projectApi.ts
│
├── hooks/                # Custom React hooks
│   ├── useModal.ts
│   └── useGoBack.ts
│
├── layout/               # Shell components (sidebar, header, backdrop)
│   ├── AppLayout.tsx
│   ├── AppSidebar.tsx
│   ├── AppHeader.tsx
│   ├── Backdrop.tsx
│   └── SidebarWidget.tsx
│
├── pages/                # Route-level page components
│   ├── AuthPages/        # SignIn, SignUp
│   ├── Dashboard/Home.tsx
│   ├── UserProfiles.tsx
│   ├── ManageUser.tsx
│   ├── ManageEmployees.tsx
│   ├── ManageDocumentType.tsx
│   ├── Manage-Project/
│   │   ├── ManageProject.tsx
│   │   ├── AddProject.tsx
│   │   ├── ViewProject.tsx
│   │   └── AssignProject.tsx
│   ├── Calendar.tsx
│   ├── Charts/           # LineChart, BarChart
│   ├── Forms/FormElements.tsx
│   ├── Tables/BasicTables.tsx
│   ├── UiElements/       # Alerts, Badges, Avatars, Buttons, Images, Videos
│   ├── OtherPage/NotFound.tsx
│   └── Blank.tsx
│
├── components/           # Reusable UI building blocks
│   ├── auth/             # RouteGuards (ProtectedRoute, GuestRoute)
│   ├── UserProfile/      # UserMetaCard, UserInfoCard, UserAddressCard
│   ├── common/           # PageBreadCrumb, PageMeta, ScrollToTop, etc.
│   ├── ui/               # Button, Badge, Modal, DataTable, Spinner, etc.
│   ├── form/             # Input, Label, Select, MultiSelect, DatePicker
│   ├── charts/           # ApexCharts wrappers
│   ├── ecommerce/        # Dashboard metric cards
│   ├── header/           # Header sub-components
│   └── tables/           # Basic table component
│
├── icons/                # ~60 custom SVG icon components
├── types/                # Shared TypeScript type definitions
│   └── apiTypes.ts
├── utils/                # Pure helper functions
│   ├── jwt.ts
│   └── toast.ts
│
├── App.tsx               # Root router and ToastContainer
├── main.tsx              # React DOM entry point, AuthProvider mount
├── index.css             # Global styles & Tailwind imports
└── vite-env.d.ts         # Vite env type declarations
```

---

## 4. Entry Points

### `src/main.tsx`
**Purpose:** Application bootstrap.  
Renders `<App />` inside `<React.StrictMode>` and wraps the entire tree in `<AuthProvider>` so that authentication state is globally available from the very first render.

### `src/App.tsx`
**Purpose:** Root component; defines the entire client-side route tree.

Key responsibilities:
- Instantiates `<BrowserRouter>` and `<Routes>`
- Wraps all protected routes in `<ProtectedRoute>` → `<AppLayout>`
- Wraps auth pages in `<GuestRoute>` (redirects away if already logged in)
- Mounts `<ToastContainer>` (top-right, 3 s auto-close, colored theme)
- Provides the catch-all `*` route pointing to `<NotFound>`

---

## 5. Routing & Route Protection

### `src/components/auth/RouteGuards.tsx`

Two components handle route security:

#### `ProtectedRoute`
- Reads `token`, `role`, `isInitialized` from `AuthContext`
- Renders `null` while the session is still being restored from storage (prevents flash redirects)
- Redirects to `/signin` if there is no valid JWT
- Optionally accepts `allowedRoles[]`; redirects to `/unauthorized` if the role doesn't match
- Renders `<Outlet />` when the user passes all checks

#### `GuestRoute`
- Redirects already-authenticated users to `/` (dashboard)
- Renders `<Outlet />` for unauthenticated visitors

### Route Map

| Path | Component | Guard |
|---|---|---|
| `/` | `Home` (Dashboard) | ProtectedRoute |
| `/profile` | `UserProfiles` | ProtectedRoute |
| `/manage-user` | `ManageUser` | ProtectedRoute |
| `/manage-employees` | `ManageEmployees` | ProtectedRoute |
| `/calendar` | `Calendar` | ProtectedRoute |
| `/document-type` | `ManageDocumentType` | ProtectedRoute |
| `/add-project` | `AddProject` | ProtectedRoute |
| `/view-project` | `ViewProject` | ProtectedRoute |
| `/assign-project` | `AssignProject` | ProtectedRoute |
| `/form-elements` | `FormElements` | ProtectedRoute |
| `/basic-tables` | `BasicTables` | ProtectedRoute |
| `/alerts` | `Alerts` | ProtectedRoute |
| `/avatars` | `Avatars` | ProtectedRoute |
| `/badge` | `Badges` | ProtectedRoute |
| `/buttons` | `Buttons` | ProtectedRoute |
| `/images` | `Images` | ProtectedRoute |
| `/videos` | `Videos` | ProtectedRoute |
| `/line-chart` | `LineChart` | ProtectedRoute |
| `/bar-chart` | `BarChart` | ProtectedRoute |
| `/signin` | `SignIn` | GuestRoute |
| `/signup` | `SignUp` | GuestRoute |
| `*` | `NotFound` | None |

---

## 6. Layout System

### `src/layout/AppLayout.tsx`
**Purpose:** Outer shell for all authenticated pages.

- Wraps content in `<SidebarProvider>` so child components can access sidebar state
- The inner `LayoutContent` reads `isExpanded`, `isHovered`, `isMobileOpen` from `SidebarContext`
- Dynamically adjusts the main content's left margin based on sidebar width (290 px expanded, 90 px collapsed)
- Renders: `<AppSidebar>` → `<Backdrop>` → `<AppHeader>` → `<Outlet>`

### `src/layout/AppSidebar.tsx`
**Purpose:** Collapsible navigation sidebar.

Features:
- **Expand/collapse** — 290 px wide when expanded or hovered, 90 px icon-only when collapsed
- **Mobile drawer** — translates in from left; controlled by `isMobileOpen`
- **Active route highlighting** — `isActive()` compares current `location.pathname` to nav item paths
- **Sub-menus** — animated accordion with measured `scrollHeight` for smooth height transitions
- **Logo** — full logo when expanded, icon-only when collapsed
- **Nav items:** Dashboard, Manage Partners, Manage Employees, Manage Users, Manage Document Type, My Profile, Manage Project (with sub-items: Add / View / Assign)

### `src/layout/AppHeader.tsx`
**Purpose:** Top navigation bar.

Contains: mobile sidebar toggle, breadcrumb/search area, notification bell, dark-mode toggle, user avatar dropdown with logout.

### `src/layout/Backdrop.tsx`
**Purpose:** Semi-transparent overlay that appears when the mobile sidebar is open; clicking it closes the sidebar.

### `src/layout/SidebarWidget.tsx`
**Purpose:** A small promotional or informational widget shown at the bottom of the sidebar when it is expanded.

---

## 7. Context & State Management

### `src/context/AuthContext.tsx`

**Purpose:** Single source of truth for the current user session.

#### Interfaces

```typescript
interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  emergencyMobileNumber?: string;
  gender?: number;   // 1=Male, 2=Female, 3=Other
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  token: string | null;
  isInitialized: boolean;
  login(data: AuthData, rememberMe: boolean): void;
  logout(): void;
  updateUser(updated: User): void;
}
```

#### Key Behaviors
| Method | What it does |
|---|---|
| **Session restore** (useEffect) | On mount, reads `user`, `role`, `token` from `localStorage` OR `sessionStorage`. Validates token via `isTokenValid()`. Clears stale data if expired. Sets `isInitialized = true` when done. |
| `login(data, rememberMe)` | If `rememberMe` → `localStorage`, else `sessionStorage`. Stores user JSON, role string, and raw token. |
| `logout()` | Clears both storages; resets all state to `null`. |
| `updateUser(updated)` | Updates context state and re-persists to whichever storage was used at login. Called after profile PATCH edits. |

### `src/context/SidebarContext.tsx`
**Purpose:** Controls the sidebar's open/closed/hover/mobile state across the header and sidebar components without prop-drilling.

---

## 8. API Layer

### `src/api/axiosInstance.ts`
**Purpose:** Configured Axios instance shared by all API calls.

- `baseURL` is read from `import.meta.env.VITE_BASE_URL` (set in `.env`)
- **Request interceptor** — attaches `Authorization: Bearer <token>` from `localStorage` to every outgoing request
- **Response interceptor** — on a `401` response, clears the stored token and redirects to `/login`

### `src/api/apiService.ts`
**Purpose:** Thin typed wrapper around `axiosInstance` that auto-unwraps `response.data`.

Exposed methods: `get`, `post`, `put`, `patch`, `delete` — all generic, all return `Promise<T>`.

### `src/api/endpoints.ts`
**Purpose:** Single location for all URL strings. Prevents magic strings from being scattered.

```typescript
API_ENDPOINTS.AUTH.LOGIN         // POST /api/Auth/login
API_ENDPOINTS.AUTH.REGISTER      // POST /api/Auth/register
API_ENDPOINTS.USERS.GET_ALL      // GET  /api/user
API_ENDPOINTS.USERS.GET_BY_ID(id)// GET  /api/user/:id
API_ENDPOINTS.USERS.PATCH(id)    // PATCH /api/user/:id
API_ENDPOINTS.PROJECT.GET_ALL    // GET  /api/projects
API_ENDPOINTS.PROJECT.CREATE     // POST /api/projects
API_ENDPOINTS.EMPLOYEE.GET_ALL   // GET  /api/employees
```

---

## 9. Feature Modules (API Functions)

### `src/features/auth/authApi.ts`
| Function | Method | Endpoint | Purpose |
|---|---|---|---|
| `loginApi(email, password)` | POST | `/api/Auth/login` | Authenticates a user; returns `ApiResponse<LoginResponse>` containing JWT, user object, and role |

### `src/features/users/userApi.ts`
| Function | Method | Endpoint | Purpose |
|---|---|---|---|
| `getAllUsers()` | GET | `/api/user` | Fetches all users; normalises `$values`, `.data`, or plain array responses |
| `registerUser(payload)` | POST | `/api/Auth/register` | Creates a new user account |
| `deleteUser(id)` | DELETE | `/api/user/:id` | Deletes a user by ID |
| `getUserById(id)` | GET | `/api/user/:id` | Fetches a single user |
| `updateUser(id, payload)` | PUT | `/api/user/:id` | Full user update |
| `patchUser(id, payload)` | PATCH | `/api/user/:id` | Partial user update (used by profile cards) |

**Enums & helpers exported:**
- `genderToEnum` — `{ Male: 1, Female: 2, Other: 3 }`
- `genderFromEnum` — reverse map `{ 1: "Male", 2: "Female", 3: "Other" }`
- `GENDER_OPTIONS` — array of `{ label, value }` for dropdowns

### `src/features/projects/projectApi.ts`
| Function | Method | Endpoint | Purpose |
|---|---|---|---|
| `getAllProjects()` | GET | `/api/projects` | Fetches all projects |
| `registerProject(payload)` | POST | `/api/projects` | Creates a project |
| `deleteProject(id)` | DELETE | `/api/projects/:id` | Deletes a project |
| `getProjectById(id)` | GET | `/api/project/:id` | Fetches a single project |
| `updateProject(id)` | PUT | `/api/projects/:id` | Full project update |
| `patchProject(id)` | PATCH | `/api/projects/:id` | Partial project update |

---

## 10. Pages

### Auth Pages (`src/pages/AuthPages/`)

#### `SignIn.tsx`
The login page. Contains an email + password form with a "Remember me" checkbox. On success, calls `loginApi`, then `login()` from `AuthContext`, then navigates to `/`. Uses `react-toastify` for error feedback.

#### `SignUp.tsx`
User self-registration page using the same `registerUser` API function.

---

### Dashboard (`src/pages/Dashboard/Home.tsx`)
The main landing page after login. Shows KPI metric cards (ecommerce stats), an interactive world map, and ApexCharts-powered charts for revenue/orders.

---

### `src/pages/UserProfiles.tsx`
**Purpose:** Renders the logged-in user's profile page.  
Composed of three cards:
- `UserMetaCard` — avatar, name, role badge, username, active status
- `UserInfoCard` — contact details (email, mobile, emergency contact, gender)
- `UserAddressCard` — address / location fields

---

### `src/pages/ManageUser.tsx`
**Purpose:** Full CRUD interface for system users.

**Tabs:**
- **Register User** — `RegisterForm` component: firstName, lastName, email, password (with show/hide toggle), role dropdown. On submit calls `registerUser()`, then switches to the View tab.
- **View Users** — `DataTable` with columns (initials avatar, name, email, role badge). Supports search, view-detail drawer, edit modal, delete.

**Sub-components:**
- `RegisterForm` — controlled form, validates required fields, calls `registerUser()`
- `EditUserModal` — modal overlay; pre-fills current user data; calls `patchUser()` on save

---

### `src/pages/ManageEmployees.tsx`
**Purpose:** Displays employee records (currently using mock data); supports editing employee details inline above the table.

**Key fields displayed:** Name/role/avatar, Employee Code, Department, Position, CTC, Joining Date, Status badge (Active / Pending / Inactive).

**EditForm** renders above the `DataTable` when a row's edit button is clicked; allows updating Department (dropdown), Position, Monthly Salary, CTC, Joining/Relieving dates, Leave count, and Status.

> ⚠️ The employee data is currently mock/static. No live API is wired for employees yet.

---

### `src/pages/ManageDocumentType.tsx`
**Purpose:** Manages document category types (e.g., ID proof, address proof). Supports listing, creating, and deleting document types.

---

### Manage Project Pages (`src/pages/Manage-Project/`)

#### `ManageProject.tsx`
Sub-navigation hub for the project section. Links to Add, View, and Assign sub-pages.

#### `AddProject.tsx`
**Purpose:** Multi-step project creation form.

Steps cover: project basics (Name, Description, Client), dates & value, manager contacts, client manager contacts, and advanced flags (IsSmooth, IsToolUsed, LeaveApplyWay, TechnologyStack). On final submit calls `registerProject()`.

#### `ViewProject.tsx`
**Purpose:** Lists all projects in a `DataTable`.

Columns: Project Name, Manager, Client, Project Value (₹), Start Date, End Date, Status (Smooth / Needs Attention badge).  
Detail drawer shows all 20 project fields. Supports search and delete.

> ℹ️ Currently backed by mock data. The `getAllProjects()` API function exists but the page uses `useState(mockProjects)`.

#### `AssignProject.tsx`
**Purpose:** UI for assigning a project to a set of employees.

---

### `src/pages/Calendar.tsx`
**Purpose:** Full interactive calendar using `@fullcalendar/react` with DayGrid, TimeGrid, and List views. Supports adding events by clicking on a date, dragging to reschedule, and deleting events.

---

### Charts (`src/pages/Charts/`)
- `LineChart.tsx` — ApexCharts line chart demo page
- `BarChart.tsx` — ApexCharts bar chart demo page

---

### `src/pages/Forms/FormElements.tsx`
Demo page showcasing all form components: inputs, selects, multi-selects, checkboxes, radio buttons, toggles, file upload, and date pickers.

### `src/pages/Tables/BasicTables.tsx`
Demo page with a basic HTML table component.

### `src/pages/UiElements/`
Six demo pages: `Alerts`, `Avatars`, `Badges`, `Buttons`, `Images`, `Videos`.

### `src/pages/OtherPage/NotFound.tsx`
404 page displayed for any unmatched route.

### `src/pages/Blank.tsx`
An empty placeholder page (useful as a starting template).

---

## 11. Components

### Auth (`src/components/auth/`)

#### `RouteGuards.tsx`
Exports `ProtectedRoute` and `GuestRoute` (see §5 above).

---

### UserProfile (`src/components/UserProfile/`)

#### `UserMetaCard.tsx`
- Shows user avatar (initials circle), full name, role badge, username handle, active/inactive status
- Edit button opens a `<Modal>` with First Name, Last Name, Username fields
- On save: calls `patchUser()`, then `getUserById()` to fetch fresh data, then `updateUser()` to sync context
- Uses `useModal` hook for open/close logic

#### `UserInfoCard.tsx`
- Displays contact info: email, phone, emergency contact, gender
- Edit modal calls `patchUser()` with the updated fields
- Gender sent as numeric enum value (1/2/3) to match the C# backend

#### `UserAddressCard.tsx`
- Displays location/address fields
- Follows the same edit → PATCH → context update pattern

---

### Common (`src/components/common/`)

| File | Purpose |
|---|---|
| `PageBreadCrumb.tsx` | Breadcrumb bar at the top of each page showing current route title |
| `PageMeta.tsx` | Sets `<title>` and `<meta name="description">` via `react-helmet-async` |
| `ScrollToTop.tsx` | Listens to route changes and scrolls `window` to top on navigation |

---

### UI (`src/components/ui/`)

#### `button/Button.tsx`
Flexible button with `variant` (solid, outline, ghost) and `size` (sm, md, lg) props.

#### `badge/Badge.tsx`
Color-coded badge component. `color` accepts: `success`, `warning`, `error`, `info`, and more. `size` is `sm` or `md`.

#### `modal/index.tsx`
Accessible modal overlay. Props: `isOpen`, `onClose`, `className`. Traps focus and renders a backdrop.

#### `table/DataTable.tsx`
**Purpose:** The project's primary reusable data display component. Used in ManageUser, ManageEmployees, and ViewProject.

Props:
| Prop | Type | Purpose |
|---|---|---|
| `data` | `T[]` | Rows to display |
| `columns` | `ColumnDef<T>[]` | Column config: `header`, `accessor` OR custom `render` function |
| `detailFields` | `DetailField<T>[]` | Fields shown in the slide-in detail drawer |
| `onDelete` | `(id: number) => void` | Called when delete button is clicked |
| `onEdit` | `(row: T) => void` | Called when edit button is clicked |
| `searchKeys` | `string[]` | Object keys to search across |
| `searchPlaceholder` | `string` | Input placeholder text |
| `title` | `string` | Table heading |

Features: client-side search/filter, detail side-drawer, delete confirmation, edit callback, responsive horizontal scroll.

#### `spinner/Spinner.tsx`
Loading indicator. Props: `size` (sm/md/lg), `label` (accessibility text), `className`.

---

### Form (`src/components/form/`)

| File | Purpose |
|---|---|
| `input/InputField.tsx` | Controlled text input with consistent styling, error state |
| `Label.tsx` | Form label with correct `htmlFor` linking |
| `Select.tsx` | Styled `<select>` with custom dropdown arrow; accepts `options: {value, label}[]` and `onChange(value)` |
| `MultiSelect.tsx` | Multi-value dropdown with keyboard navigation and custom styling |
| `date-picker.tsx` | `flatpickr`-powered date/time picker wrapped as a React component |
| `Form.tsx` | Thin `<form>` wrapper |

---

### Charts (`src/components/charts/`)

Wrappers around `react-apexcharts` for Line and Bar chart types used on the Dashboard and chart demo pages.

### Ecommerce (`src/components/ecommerce/`)

Dashboard widgets: monthly-revenue cards, statistics boxes, sales map, and customer overview tables.

---

## 12. Hooks

### `src/hooks/useModal.ts`
**Purpose:** Abstracts the `isOpen` boolean and `openModal` / `closeModal` handlers for any modal component.

```typescript
const { isOpen, openModal, closeModal } = useModal();
```

### `src/hooks/useGoBack.ts`
**Purpose:** Returns a `goBack()` function that calls `navigate(-1)` from React Router. Used on pages where a back button is needed.

---

## 13. Utilities

### `src/utils/jwt.ts`

| Function | Signature | Purpose |
|---|---|---|
| `decodeJwt<T>(token)` | `(string) => T \| null` | Decodes the base64url payload of a JWT **without** verifying the signature (client-side only) |
| `isTokenValid(token)` | `(string) => boolean` | Returns `true` if the token decodes successfully and its `exp` claim has not passed. Tokens without `exp` are treated as always valid. |

Used by `AuthContext` on startup to validate stored tokens and by `RouteGuards` on every render.

### `src/utils/toast.ts`

```typescript
showSuccess(message: string): void  // green toast
showError(message: string): void    // red toast
```

Thin wrappers around `react-toastify`'s `toast.success()` and `toast.error()`. Centralises toast configuration so it can be changed in one place.

---

## 14. Icons

**Location:** `src/icons/`  
**Count:** ~60 custom SVG icon components

All icons are typed React functional components accepting `className` and `style` props. They are imported by name from the `src/icons/index.ts` barrel file.

Selected icons used across the app:
| Icon | Used in |
|---|---|
| `GridIcon` | Sidebar — Dashboard |
| `UserCircleIcon` | Sidebar — Manage Users, My Profile |
| `EmployeeeIcon` | Sidebar — Manage Employees |
| `Handshake` | Sidebar — Manage Partners |
| `FileText` | Sidebar — Manage Document Type |
| `ChevronDownIcon` | Sidebar submenu chevron |
| `HorizontaLDots` | Sidebar section separator (collapsed state) |
| `EyeIcon` / `EyeCloseIcon` | Password show/hide toggle in forms |

---

## 15. Styling

### `src/index.css`
Global stylesheet. Includes:
- `@import "tailwindcss"` — Tailwind CSS v4 base import
- Custom CSS variables for brand colors, shadows, and border radii
- Utility classes: `.menu-item`, `.menu-item-active`, `.menu-item-inactive`, `.menu-dropdown-item`, etc.
- Dark mode support via Tailwind's `dark:` variant and `.dark` class on `<html>`
- Custom scrollbar styles (`.no-scrollbar`, `.custom-scrollbar`)
- Flatpickr overrides for the date-picker component

### Design System
- **Brand color:** Blue (`brand-500` = primary blue)
- **Dark mode:** Supported via `dark:` Tailwind variants throughout
- **Typography:** Inherited from Tailwind defaults (override in `index.css` as needed)
- **Spacing/radius:** Consistent use of `rounded-2xl`, `rounded-full`, `p-5`, `px-6` patterns

---

## 16. Configuration Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite config: uses `@vitejs/plugin-react` and `vite-plugin-svgr` for SVG support |
| `tsconfig.json` | Root TypeScript config; references `tsconfig.app.json` and `tsconfig.node.json` |
| `tsconfig.app.json` | Browser/app-specific TS settings: strict mode, `ESNext` target, JSX preserve |
| `tsconfig.node.json` | Node-specific TS settings used by Vite config file itself |
| `postcss.config.js` | PostCSS config required by Tailwind CSS v4 (`@tailwindcss/postcss` plugin) |
| `eslint.config.js` | ESLint flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins |
| `.gitignore` | Ignores `node_modules`, `dist`, `.env`, IDE files |

---

## 17. Environment Variables

Create a `.env` file at the project root:

```env
VITE_BASE_URL=https://your-api-domain.com
```

| Variable | Required | Purpose |
|---|---|---|
| `VITE_BASE_URL` | ✅ Yes | Base URL for all API requests (used by `axiosInstance.ts`) |

> **Note:** Vite only exposes variables prefixed with `VITE_` to the client bundle. Never put secrets here.

---

## 18. Data Flow Diagram

```
User Action (form submit, button click)
        │
        ▼
  Page/Component
  (e.g., ManageUser.tsx)
        │
        ▼
  Feature API Function          ← src/features/users/userApi.ts
  (e.g., patchUser(id, data))
        │
        ▼
  apiService.patch(url, data)   ← src/api/apiService.ts
        │
        ▼
  axiosInstance.patch(url, data)← src/api/axiosInstance.ts
  [injects Bearer token header]
        │
        ▼
  Backend REST API
  (e.g., PATCH /api/user/:id)
        │
        ▼ (response)
  apiService unwraps response.data
        │
        ▼
  Component updates local state
  + calls toast.success / toast.error
  + optionally calls updateUser() in AuthContext
```

---

## 19. API Endpoints Reference

All endpoints relative to `VITE_BASE_URL`:

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/Auth/login` | Login; returns `{ data: { token, user, role } }` |
| `POST` | `/api/Auth/register` | Register a new user |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user` | Get all users |
| `GET` | `/api/user/:id` | Get user by ID |
| `PUT` | `/api/user/:id` | Full update |
| `PATCH` | `/api/user/:id` | Partial update |
| `DELETE` | `/api/user/:id` | Delete user |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Get all projects |
| `GET` | `/api/project/:id` | Get project by ID |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Full update |
| `PATCH` | `/api/projects/:id` | Partial update |
| `DELETE` | `/api/projects/:id` | Delete project |

### Employees
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employee/:id` | Get employee by ID |
| `POST` | `/api/employees` | Create employee |
| `PUT` | `/api/employees/:id` | Full update |
| `PATCH` | `/api/employees/:id` | Partial update |
| `DELETE` | `/api/employees/:id` | Delete employee |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (accessible on LAN via --host flag)
npm run dev

# Type-check + build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

*This documentation was auto-generated by reviewing all source files in the project. Keep it updated as new features are added.*
